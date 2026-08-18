import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const PROBE_SCENARIOS = Object.freeze([
  { name: "accepted", status: 202, error: null },
  { name: "deduplicated", status: 202, error: null },
  { name: "conflict", status: 409, error: "submission-id-conflict" },
  { name: "forbidden", status: 403, error: "origin-not-allowed" },
  { name: "too-large", status: 413, error: "payload-too-large" },
  { name: "invalid", status: 422, error: "invalid-submission" },
  { name: "rate-limited", status: 429, error: "rate-limited" },
  { name: "storage-failure", status: 500, error: "storage-failed" },
  { name: "upstream-failure", status: 502, error: "upstream-failed" },
  { name: "gateway-timeout", status: 504, error: "gateway-timeout" },
  { name: "unavailable", status: 503, error: "contract-unavailable" },
]);

const RETRY_AFTER_STATUSES = new Set([429, 500, 502, 503, 504]);
const DEFAULT_ROUTES = Object.freeze({ health: "/health", submit: "/submit" });
const DEFAULT_COMMANDS = Object.freeze({
  rollback: "kubectl rollout undo deployment/research-collector",
  drain: "kubectl scale deployment/research-collector --replicas=0",
});
const VERSIONED_METADATA_KEYS = new Set([
  "contractVersion",
  "manifestSchemaVersion",
  "manifestVersion",
  "manifestFingerprint",
  "serializationVersion",
  "serializationFingerprint",
  "schemaContractVersion",
  "schemaFingerprint",
  "cohortVersion",
  "cohortFingerprint",
  "sourceManifestSha256",
  "payloadSha256",
  "schemaVersion",
  "taxonomyVersion",
  "scoringVersion",
  "bankVersion",
  "formVersion",
  "qualityRuleVersion",
  "registryVersion",
  "profileVersion",
  "resultVersion",
]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function endpointUrl(value, label) {
  if (typeof value !== "string" || value.trim() === "")
    throw new Error(`${label} endpoint is required`);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} endpoint must be an absolute http(s) URL`);
  }
  if (!/^https?:$/u.test(parsed.protocol) || parsed.username || parsed.password)
    throw new Error(
      `${label} endpoint must be an absolute http(s) URL without credentials`,
    );
  return parsed;
}

function endpointSpec(value, label) {
  const spec = typeof value === "string" ? { endpoint: value } : value;
  if (!isRecord(spec)) throw new Error(`${label} endpoint is required`);
  const endpoint = endpointUrl(spec.endpoint, label);
  const route = spec.contractRoute ?? spec.route;
  const cohort = spec.cohort ?? spec.cohortVersion;
  return {
    endpoint: endpoint.toString(),
    contractRoute:
      typeof route === "string" && route.trim() ? route : undefined,
    cohort: typeof cohort === "string" && cohort.trim() ? cohort : undefined,
    name: spec.name ?? label.toLowerCase(),
  };
}

function headerValue(headers, name) {
  if (!headers) return undefined;
  if (typeof headers.get === "function") return headers.get(name) ?? undefined;
  const key = Object.keys(headers).find(
    (candidate) => candidate.toLowerCase() === name,
  );
  return key === undefined ? undefined : headers[key];
}

async function responseBody(response) {
  if (response.body !== undefined && typeof response.json !== "function")
    return response.body;
  if (typeof response.json === "function") {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  if (typeof response.text === "function") {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return null;
}

function metadataFrom(response, fallback) {
  const body = response.body;
  const nested = isRecord(body?.metadata) ? body.metadata : {};
  const contractRoute =
    headerValue(response.headers, "x-contract-route") ??
    body?.contractRoute ??
    nested.contractRoute ??
    fallback.contractRoute;
  const cohort =
    headerValue(response.headers, "x-cohort") ??
    body?.cohort ??
    body?.cohortVersion ??
    nested.cohort ??
    nested.cohortVersion ??
    fallback.cohort;
  return { contractRoute, cohort };
}

function retryAfter(response) {
  const value = headerValue(response.headers, "retry-after");
  if (value === undefined || value === "") return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return String(value);
  return Number.isFinite(Date.parse(value)) ? String(value) : null;
}

function createCheck(name, passed, details = {}) {
  return { name, passed, ...details };
}

function expectedBodyForScenario(scenario) {
  return {
    probe: "research-cutover",
    scenario,
    contractRoute: "echoed-by-transport",
    cohort: "echoed-by-transport",
    submissionId: `probe-${scenario}`,
    payload: {
      deterministic: true,
      ordinal: PROBE_SCENARIOS.findIndex((entry) => entry.name === scenario),
    },
  };
}

async function call(fetchImpl, endpoint, route, init, context) {
  const body = init.body ?? "";
  const headers = Object.fromEntries(
    Object.entries({
      accept: "application/json",
      "x-contract-route": context.contractRoute,
      "x-cohort": context.cohort,
      "x-submission-id": context.submissionId,
      ...(init.headers ?? {}),
    }).filter(([, value]) => value !== undefined),
  );
  const request = {
    method: init.method ?? "GET",
    headers,
    body,
    url: new URL(route, endpoint).toString(),
  };
  const response = await fetchImpl(request.url, {
    method: request.method,
    headers: request.headers,
    ...(body === "" ? {} : { body }),
  });
  const normalized = {
    status: Number(response.status),
    headers: response.headers ?? {},
    body: await responseBody(response),
  };
  return { request, response: normalized };
}

function assertResponseMetadata(response, expected, checkName) {
  const actual = metadataFrom(response, expected);
  return createCheck(
    `${checkName}:route-cohort`,
    Boolean(actual.contractRoute && actual.cohort) &&
      (!expected.contractRoute ||
        actual.contractRoute === expected.contractRoute) &&
      (!expected.cohort || actual.cohort === expected.cohort),
    {
      expected: {
        contractRoute: expected.contractRoute,
        cohort: expected.cohort,
      },
      actual,
    },
  );
}

async function probeEndpoint(spec, fetchImpl, routes) {
  const report = {
    endpoint: spec.endpoint,
    contractRoute: spec.contractRoute,
    cohort: spec.cohort,
    checks: [],
  };
  const health = await call(
    fetchImpl,
    spec.endpoint,
    routes.health,
    { method: "GET" },
    spec,
  );
  const healthBody = health.response.body;
  report.checks.push(
    createCheck(
      "health",
      health.response.status === 200 && healthBody?.ok === true,
      {
        status: health.response.status,
      },
    ),
  );
  report.checks.push(assertResponseMetadata(health.response, spec, "health"));
  const healthMetadata = metadataFrom(health.response, spec);
  if (!spec.contractRoute) spec.contractRoute = healthMetadata.contractRoute;
  if (!spec.cohort) spec.cohort = healthMetadata.cohort;
  report.contractRoute = spec.contractRoute;
  report.cohort = spec.cohort;

  for (const scenario of PROBE_SCENARIOS) {
    const payload = expectedBodyForScenario(scenario.name);
    const body = canonicalJson({
      ...payload,
      contractRoute: spec.contractRoute,
      cohort: spec.cohort,
    });
    const submissionId = payload.submissionId;
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-probe-scenario": scenario.name,
      },
      body,
    };
    const first = await call(
      fetchImpl,
      spec.endpoint,
      routes.submit,
      requestOptions,
      {
        ...spec,
        submissionId,
      },
    );
    const firstCheck =
      first.response.status === scenario.status &&
      (scenario.error === null ||
        first.response.body?.error === scenario.error);
    report.checks.push(
      createCheck(scenario.name, firstCheck, {
        status: first.response.status,
        expectedStatus: scenario.status,
        error: first.response.body?.error,
      }),
    );
    report.checks.push(
      assertResponseMetadata(first.response, spec, scenario.name),
    );
    if (RETRY_AFTER_STATUSES.has(scenario.status)) {
      report.checks.push(
        createCheck(
          `${scenario.name}:retry-after`,
          retryAfter(first.response) !== null,
          {
            retryAfter: retryAfter(first.response),
          },
        ),
      );
    }

    if (scenario.name === "accepted") {
      const retry = await call(
        fetchImpl,
        spec.endpoint,
        routes.submit,
        requestOptions,
        {
          ...spec,
          submissionId,
        },
      );
      const retryBody = retry.response.body;
      const retryInvariant =
        first.request.body === retry.request.body &&
        first.request.headers["x-submission-id"] ===
          retry.request.headers["x-submission-id"] &&
        first.request.headers["x-contract-route"] ===
          retry.request.headers["x-contract-route"] &&
        first.request.headers["x-cohort"] === retry.request.headers["x-cohort"];
      report.checks.push(
        createCheck(
          "deduplicated",
          retry.response.status === 202 && retryBody?.deduplicated === true,
          {
            status: retry.response.status,
            deduplicated: retryBody?.deduplicated,
          },
        ),
      );
      report.checks.push(
        createCheck("exact-retry", retryInvariant, {
          payloadSha256: sha256(first.request.body),
          firstPayloadBytes: Buffer.byteLength(first.request.body),
          retryPayloadBytes: Buffer.byteLength(retry.request.body),
          submissionId,
          contractRoute: spec.contractRoute,
          cohort: spec.cohort,
        }),
      );
      report.checks.push(
        assertResponseMetadata(retry.response, spec, "deduplicated"),
      );
    }
  }
  report.passed = report.checks.every((check) => check.passed);
  return report;
}

export function validateOperationalCommand(command, label) {
  if (typeof command !== "string" || command.trim() === "")
    throw new Error(`${label} command is required`);
  const value = command.trim();
  if (/[\r\n;|&<>`$]/u.test(value))
    throw new Error(`${label} command contains shell control characters`);
  const tokens = value.split(/\s+/u);
  if (tokens.some((token) => token === "" || token.startsWith("-;")))
    throw new Error(`${label} command is invalid`);
  if (/^(rm|rmdir|dd|mkfs|shutdown|reboot)$/u.test(tokens[0]))
    throw new Error(`${label} command is destructive`);
  return value;
}

export function validateOperationalCommands({
  rollback,
  drain,
  rollbackCommand,
  drainCommand,
} = {}) {
  const rollbackValue = rollback ?? rollbackCommand;
  const drainValue = drain ?? drainCommand;
  return {
    rollback: validateOperationalCommand(rollbackValue, "rollback"),
    drain: validateOperationalCommand(drainValue, "drain"),
  };
}

export function syntheticFixture(overrides = {}) {
  const base = {
    endpoints: {
      old: {
        endpoint: "https://old.synthetic.invalid",
        contractRoute: "research-old",
        cohort: "legacy-v1",
      },
      new: {
        endpoint: "https://new.synthetic.invalid",
        contractRoute: "research-new",
        cohort: "clean-rebuild-v1",
      },
    },
    commands: DEFAULT_COMMANDS,
    responses: {},
  };
  return {
    ...base,
    ...overrides,
    endpoints: {
      ...base.endpoints,
      ...(overrides.endpoints ?? {}),
      old: { ...base.endpoints.old, ...(overrides.endpoints?.old ?? {}) },
      new: { ...base.endpoints.new, ...(overrides.endpoints?.new ?? {}) },
    },
    commands: { ...base.commands, ...(overrides.commands ?? {}) },
    responses: { ...base.responses, ...(overrides.responses ?? {}) },
  };
}

function responseForScenario(spec, scenario, request, state, fixture) {
  const endpointResponses =
    fixture.responses?.[spec.name] ??
    fixture.responses?.[spec.contractRoute] ??
    {};
  const override = endpointResponses[scenario];
  if (override) return override;
  if (scenario === "accepted") {
    const key = `${spec.name}:${request.headers.get?.("x-submission-id") ?? request.headers["x-submission-id"]}:${request.body}`;
    const duplicate = state.has(key);
    state.add(key);
    return {
      status: 202,
      body: {
        accepted: true,
        submissionId:
          request.headers.get?.("x-submission-id") ??
          request.headers["x-submission-id"],
        deduplicated: duplicate,
        contractRoute: spec.contractRoute,
        cohort: spec.cohort,
        payloadSha256: sha256(request.body),
      },
    };
  }
  const scenarioEntry = PROBE_SCENARIOS.find(
    (entry) => entry.name === scenario,
  );
  const body = scenarioEntry.error
    ? { error: scenarioEntry.error }
    : { ok: true };
  return {
    status: scenarioEntry.status,
    body: { ...body, contractRoute: spec.contractRoute, cohort: spec.cohort },
    headers: RETRY_AFTER_STATUSES.has(scenarioEntry.status)
      ? { "retry-after": "7" }
      : {},
  };
}

export function createSyntheticFetch(fixture = syntheticFixture()) {
  const normalized = syntheticFixture(fixture);
  const specs = Object.entries(normalized.endpoints).map(([name, entry]) =>
    endpointSpec({ ...entry, name }, name),
  );
  const state = new Set();
  return async (url, init = {}) => {
    const parsed = new URL(url);
    const spec = specs.find(
      (entry) => new URL(entry.endpoint).origin === parsed.origin,
    );
    if (!spec)
      throw new Error(`Synthetic endpoint is not configured: ${parsed.origin}`);
    const headers = new Headers(init.headers ?? {});
    const request = { headers, body: init.body ?? "" };
    if (parsed.pathname === DEFAULT_ROUTES.health) {
      return new Response(
        JSON.stringify({
          ok: true,
          contractRoute: spec.contractRoute,
          cohort: spec.cohort,
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "x-contract-route": spec.contractRoute,
            "x-cohort": spec.cohort,
          },
        },
      );
    }
    if (parsed.pathname !== DEFAULT_ROUTES.submit)
      return new Response(JSON.stringify({ error: "not-found" }), {
        status: 404,
      });
    const scenario = headers.get("x-probe-scenario") ?? "accepted";
    const response = responseForScenario(
      spec,
      scenario,
      request,
      state,
      normalized,
    );
    return new Response(JSON.stringify(response.body ?? null), {
      status: response.status,
      headers: {
        "content-type": "application/json",
        "x-contract-route": spec.contractRoute,
        "x-cohort": spec.cohort,
        ...(response.headers ?? {}),
      },
    });
  };
}

export async function probeCutover({
  oldEndpoint,
  newEndpoint,
  endpoints,
  fixture,
  fetchImpl,
  routes = DEFAULT_ROUTES,
  rollbackCommand,
  drainCommand,
  commands,
} = {}) {
  const fixtureValue = fixture ? syntheticFixture(fixture) : null;
  const endpointValues = endpoints ?? {
    old: oldEndpoint ?? fixture?.endpoints?.old,
    new: newEndpoint ?? fixture?.endpoints?.new,
  };
  if (!endpointValues?.old || !endpointValues?.new)
    throw new Error("Both old and new endpoints are required");
  const oldSpec = endpointSpec(endpointValues.old, "old");
  const newSpec = endpointSpec(endpointValues.new, "new");
  const transport =
    fetchImpl ??
    (fixtureValue ? createSyntheticFetch(fixtureValue) : globalThis.fetch);
  if (typeof transport !== "function")
    throw new Error("A fetch implementation is required");
  const commandValues = commands ?? {
    rollback: rollbackCommand ?? fixture?.commands?.rollback,
    drain: drainCommand ?? fixture?.commands?.drain,
  };
  const operational = validateOperationalCommands(commandValues);
  const [oldReport, newReport] = await Promise.all([
    probeEndpoint(oldSpec, transport, routes),
    probeEndpoint(newSpec, transport, routes),
  ]);
  return {
    passed: oldReport.passed && newReport.passed,
    operational,
    old: oldReport,
    new: newReport,
  };
}

export function assertProbeReport(report) {
  if (!report?.passed) {
    const failed = [
      ...(report?.old?.checks ?? []),
      ...(report?.new?.checks ?? []),
    ]
      .filter((check) => !check.passed)
      .map((check) => check.name);
    throw new Error(
      `Research cutover probe failed${failed.length ? `: ${failed.join(", ")}` : ""}`,
    );
  }
  return report;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (!token.startsWith("--"))
      throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2).replaceAll("-", "_");
    const value = argv[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for --${key.replaceAll("_", "-")}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    if (args.help) {
      console.log(
        "Usage: node scripts/probe-research-cutover.mjs --old-endpoint URL --new-endpoint URL [--rollback-command CMD --drain-command CMD] [--fixture FILE]",
      );
      return 0;
    }
    const oldEndpoint = args.old_endpoint ?? args.old;
    const newEndpoint = args.new_endpoint ?? args.new;
    if (!oldEndpoint || !newEndpoint)
      throw new Error("Both --old-endpoint and --new-endpoint are required");
    let fixture = null;
    if (args.fixture)
      fixture = JSON.parse(await readFile(args.fixture, "utf8"));
    if (fixture) {
      fixture = syntheticFixture({
        ...fixture,
        endpoints: {
          ...fixture.endpoints,
          old: { ...(fixture.endpoints?.old ?? {}), endpoint: oldEndpoint },
          new: { ...(fixture.endpoints?.new ?? {}), endpoint: newEndpoint },
        },
      });
    }
    const report = await probeCutover({
      oldEndpoint,
      newEndpoint,
      fixture,
      rollbackCommand: args.rollback_command ?? args.rollback,
      drainCommand: args.drain_command ?? args.drain,
    });
    assertProbeReport(report);
    console.log(JSON.stringify(report, null, 2));
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await main();
}
