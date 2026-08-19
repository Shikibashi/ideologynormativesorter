import registry from "../generated/acceptance-registry.json" with { type: "json" };

const RESPONSE_STATES = new Set(["answered", "missing", "skipped", "abstained", "refused"]);
const LIKERT_TYPES = new Set(["likert5", "likert7"]);
const ALLOWED_ORIGIN_ENV = "RESEARCH_ALLOWED_ORIGINS";

export async function handleRequest(request, env = {}) {
  const url = new URL(request.url);
  if (url.pathname === "/health" && request.method === "GET") {
    return json({ ok: true, researchSchemaVersion: registry.researchSchemaVersion, contentFingerprint: registry.metadata.contentFingerprint, writesEnabled: writesEnabled(env) }, 200);
  }
  if (url.pathname !== "/submit") return json({ error: "not_found" }, 404);
  if (request.method === "OPTIONS") return corsPreflight(request, env);
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, request, env);

  if (!allowedOrigin(request, env)) return json({ error: "origin_not_allowed" }, 403);
  if (!writesEnabled(env)) return json({ error: "research_collection_disabled" }, 503, request, env);
  if (!isJsonRequest(request)) return json({ error: "content_type_required" }, 415, request, env);

  const body = await request.text();
  const bytes = new TextEncoder().encode(body).byteLength;
  if (bytes > registry.maxPayloadBytes) return json({ error: "payload_too_large" }, 413, request, env);
  let payload;
  try { payload = JSON.parse(body); } catch { return json({ error: "invalid_json" }, 400, request, env); }
  const validation = validateEnvelope(payload);
  if (!validation.ok) return json({ error: "invalid_submission", reason: validation.reason }, 400, request, env);
  if (!env.RESEARCH_DB) return json({ error: "research_storage_unavailable" }, 503, request, env);

  try {
    const result = await persistSubmission(env.RESEARCH_DB, payload, validation.canonical, await sha256Hex(validation.canonical));
    return json(result, result.conflict ? 409 : 202, request, env);
  } catch {
    return json({ error: "research_storage_unavailable" }, 503, request, env);
  }
}

export default { fetch: handleRequest };

export function validateEnvelope(payload) {
  if (!isRecord(payload)) return failure("root must be an object");
  if (!sameKeys(payload, ["consent", "consentVersion", "contentFingerprint", "contentSchemaVersion", "contentVersion", "researchProtocolVersion", "researchSchemaVersion", "responseSchemaVersion", "resultSchemaVersion", "responses", "scoringVersion", "submissionId"])) return failure("root fields are not exact");
  if (payload.researchSchemaVersion !== registry.researchSchemaVersion || payload.researchProtocolVersion !== registry.researchProtocolVersion || payload.consentVersion !== registry.consentVersion) return failure("unknown research version");
  for (const key of ["contentSchemaVersion", "contentVersion", "contentFingerprint", "scoringVersion", "responseSchemaVersion", "resultSchemaVersion"]) {
    if (payload[key] !== registry.metadata[key]) return failure(`version mismatch: ${key}`);
  }
  if (!/^rs_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.submissionId)) return failure("invalid submission id");
  if (!isRecord(payload.consent) || !sameKeys(payload.consent, ["consentVersion", "consentedAt", "granted", "identityLinkage", "purpose"])) return failure("consent fields are not exact");
  if (payload.consent.granted !== true || payload.consent.consentVersion !== registry.consentVersion || payload.consent.identityLinkage !== "none" || payload.consent.purpose !== "instrument-research" || !isoUtc(payload.consent.consentedAt)) return failure("invalid consent");
  if (!isRecord(payload.responses) || !sameKeys(payload.responses, ["core", "requestedSpecialistModuleIds", "specialist"])) return failure("response fields are not exact");
  const requested = payload.responses.requestedSpecialistModuleIds;
  if (!Array.isArray(requested) || new Set(requested).size !== requested.length || requested.some((id) => typeof id !== "string" || !moduleById.has(id))) return failure("invalid requested module set");
  const expectedCore = registry.items.filter((item) => item.role === "core");
  const expectedSpecialist = registry.items.filter((item) => item.role === "specialist" && requested.includes(item.moduleId));
  const coreResult = validateResponses(payload.responses.core, expectedCore, "core");
  if (!coreResult.ok) return coreResult;
  const specialistResult = validateResponses(payload.responses.specialist, expectedSpecialist, "specialist");
  if (!specialistResult.ok) return specialistResult;
  const canonical = canonicalize(payload);
  if (new TextEncoder().encode(canonical).byteLength > registry.maxPayloadBytes) return failure("canonical payload is too large");
  return { ok: true, canonical };
}

const itemById = new Map(registry.items.map((item) => [item.id, item]));
const moduleById = new Map(registry.specialistModules.map((module) => [module.id, module]));

function validateResponses(value, expectedItems, scope) {
  if (!Array.isArray(value)) return failure(`${scope} responses must be an array`);
  const expected = new Map(expectedItems.map((item) => [item.id, item]));
  if (value.length !== expected.size) return failure(`${scope} response count does not match active content`);
  const seen = new Set();
  for (const response of value) {
    if (!isRecord(response) || typeof response.itemId !== "string" || seen.has(response.itemId)) return failure(`${scope} has duplicate or malformed item`);
    seen.add(response.itemId);
    const item = expected.get(response.itemId);
    if (!item || itemById.get(response.itemId)?.role !== scope) return failure(`${scope} item is not an eligible active item`);
    const result = validateResponse(response, item);
    if (!result.ok) return result;
  }
  if ([...expected.keys()].some((id) => !seen.has(id))) return failure(`${scope} is missing an active item`);
  return { ok: true };
}

function validateResponse(response, item) {
  if (typeof response.state !== "string" || !RESPONSE_STATES.has(response.state)) return failure("unknown response state");
  if (response.state !== "answered") {
    if (!sameKeys(response, ["itemId", "state"])) return failure("non-answered response has extra fields");
    return { ok: true };
  }
  if (response.responseType !== item.responseType) return failure("response type does not match content");
  if (response.confidence !== undefined && ![1, 3, 5].includes(response.confidence)) return failure("invalid confidence");
  if (response.priority !== undefined && ![1, 3, 5].includes(response.priority)) return failure("invalid priority");
  if (item.responseType === "statement-choice") {
    if (!allowedKeys(response, ["confidence", "itemId", "optionId", "priority", "responseType", "state"]) || typeof response.optionId !== "string" || !item.optionIds.includes(response.optionId)) return failure("invalid statement choice");
  } else {
    if (!allowedKeys(response, ["confidence", "itemId", "priority", "responseType", "state", "value"]) || !Number.isInteger(response.value) || !LIKERT_TYPES.has(item.responseType) || response.value < item.scaleMin || response.value > item.scaleMax || (response.value - item.scaleMin) % item.scaleStep !== 0) return failure("invalid likert response");
  }
  return { ok: true };
}

async function persistSubmission(db, payload, canonical, digest) {
  const existing = await db.prepare("SELECT payload_digest FROM research_submissions WHERE submission_id = ?1").bind(payload.submissionId).first();
  if (existing) {
    if (existing.payload_digest !== digest) return { accepted: false, conflict: true, submissionId: payload.submissionId };
    return { accepted: true, deduplicated: true, submissionId: payload.submissionId };
  }
  const receivedAt = new Date().toISOString();
  const statements = [db.prepare("INSERT INTO research_submissions (submission_id, research_schema_version, research_protocol_version, consent_version, content_schema_version, content_version, content_fingerprint, scoring_version, response_schema_version, result_schema_version, consented_at, received_at, payload_digest, payload_json) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)").bind(payload.submissionId, payload.researchSchemaVersion, payload.researchProtocolVersion, payload.consentVersion, payload.contentSchemaVersion, payload.contentVersion, payload.contentFingerprint, payload.scoringVersion, payload.responseSchemaVersion, payload.resultSchemaVersion, payload.consent.consentedAt, receivedAt, digest, canonical)];
  for (const [scope, responses] of [["core", payload.responses.core], ["specialist", payload.responses.specialist]]) {
    for (const response of responses) statements.push(db.prepare("INSERT INTO research_submission_responses (submission_id, scope, item_id, state, response_type, raw_value, option_id, confidence, priority) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)").bind(payload.submissionId, scope, response.itemId, response.state, response.responseType ?? null, "value" in response ? response.value : null, "optionId" in response ? response.optionId : null, response.confidence ?? null, response.priority ?? null));
  }
  for (const moduleId of payload.responses.requestedSpecialistModuleIds) statements.push(db.prepare("INSERT INTO research_submission_modules (submission_id, module_id) VALUES (?1, ?2)").bind(payload.submissionId, moduleId));
  try {
    await db.batch(statements);
    return { accepted: true, deduplicated: false, submissionId: payload.submissionId };
  } catch {
    const raced = await db.prepare("SELECT payload_digest FROM research_submissions WHERE submission_id = ?1").bind(payload.submissionId).first();
    if (raced?.payload_digest === digest) return { accepted: true, deduplicated: true, submissionId: payload.submissionId };
    if (raced) return { accepted: false, conflict: true, submissionId: payload.submissionId };
    throw new Error("research transaction failed");
  }
}

function writesEnabled(env) {
  return env.RESEARCH_WRITES_ENABLED === "true" && env.DEPLOYMENT_ENVIRONMENT !== "production";
}
function isJsonRequest(request) { return request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() === "application/json"; }
function allowedOrigin(request, env) { return originSet(env).has(request.headers.get("origin") ?? ""); }
function originSet(env) { return new Set(String(env[ALLOWED_ORIGIN_ENV] ?? "").split(",").map((origin) => origin.trim()).filter(Boolean)); }
function corsPreflight(request, env) { return allowedOrigin(request, env) ? json({}, 204, request, env) : json({ error: "origin_not_allowed" }, 403); }
function json(value, status, request, env) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  const origin = request?.headers.get("origin");
  if (origin && originSet(env ?? {}).has(origin)) { headers["Access-Control-Allow-Origin"] = origin; headers["Vary"] = "Origin"; headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"; headers["Access-Control-Allow-Headers"] = "Content-Type"; }
  return new Response(status === 204 ? null : JSON.stringify(value), { status, headers });
}
function isRecord(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function sameKeys(value, keys) { return isRecord(value) && Object.keys(value).sort().join("\u0000") === [...keys].sort().join("\u0000"); }
function allowedKeys(value, keys) { return isRecord(value) && Object.keys(value).every((key) => keys.includes(key)); }
function isoUtc(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && !Number.isNaN(Date.parse(value)); }
function failure(reason) { return { ok: false, reason }; }
function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
async function sha256Hex(value) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(""); }
