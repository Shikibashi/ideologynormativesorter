import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { sha256Canonical } from "../src/domain/canonicalSerialization.ts";

const root = new URL("..", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

async function readOptional(relativePath) {
  try {
    return await read(relativePath);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}
function generatedManifestFingerprintInput(manifest) {
  const { fingerprint: _fingerprint, ...metadata } = manifest.metadata;
  const { metadata: _manifestMetadata, ...payload } = manifest;
  return { metadata, ...payload };
}

function scanWhitespace(text, index) {
  while (/[\u0020\u0009\u000a\u000d]/u.test(text[index] ?? "")) index += 1;
  return index;
}

function scanString(text, start) {
  let index = start + 1;
  while (index < text.length) {
    const code = text.charCodeAt(index);
    if (code === 0x22) return index + 1;
    if (code === 0x5c) index += 2;
    else index += 1;
  }
  throw new Error(`Unterminated JSON string at offset ${start}`);
}

function scanObject(text, start) {
  let cursor = scanWhitespace(text, start + 1);
  const keys = new Set();
  if (text[cursor] === "}") return cursor + 1;
  while (true) {
    if (text[cursor] !== '"')
      throw new Error(`Expected object key at offset ${cursor}`);
    const keyEnd = scanString(text, cursor);
    const key = JSON.parse(text.slice(cursor, keyEnd)).normalize("NFC");
    if (keys.has(key)) throw new Error(`Duplicate object key: ${key}`);
    keys.add(key);
    cursor = scanWhitespace(text, keyEnd);
    if (text[cursor] !== ":")
      throw new Error(`Expected ':' at offset ${cursor}`);
    cursor = scanValue(text, cursor + 1);
    cursor = scanWhitespace(text, cursor);
    if (text[cursor] === "}") return cursor + 1;
    if (text[cursor] !== ",")
      throw new Error(`Expected ',' at offset ${cursor}`);
    cursor = scanWhitespace(text, cursor + 1);
  }
}

function scanValue(text, start) {
  const index = scanWhitespace(text, start);
  const character = text[index];
  if (character === '"') return scanString(text, index);
  if (character === "{") return scanObject(text, index);
  if (character === "[") {
    let cursor = scanWhitespace(text, index + 1);
    if (text[cursor] === "]") return cursor + 1;
    while (true) {
      cursor = scanValue(text, cursor);
      cursor = scanWhitespace(text, cursor);
      if (text[cursor] === "]") return cursor + 1;
      if (text[cursor] !== ",")
        throw new Error(`Expected ',' at offset ${cursor}`);
      cursor = scanWhitespace(text, cursor + 1);
    }
  }
  let cursor = index;
  while (cursor < text.length && !",]}".includes(text[cursor])) cursor += 1;
  return cursor;
}

function parseStrictJson(source, label) {
  try {
    const end = scanValue(source, 0);
    if (scanWhitespace(source, end) !== source.length)
      throw new Error("Trailing data");
    return JSON.parse(source);
  } catch (error) {
    throw new Error(
      `${label} is not valid JSON without duplicate keys: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function record(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function consistentValues(values, label) {
  const present = values.filter((value) => value !== undefined);
  const unique = [...new Set(present.map((value) => JSON.stringify(value)))];
  if (unique.length > 1)
    throw new Error(`Generated canonical contract has conflicting ${label}`);
  return present[0];
}

function parseCanonicalArtifact(source) {
  if (source === null) return null;
  const label =
    "Generated canonical contract artifact: research-worker/generated/canonical-contract.json";
  const value = parseStrictJson(source, label);
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Generated canonical contract artifact must be an object");

  const metadataSource = record(value.metadata);
  const manifest = record(value.manifest);
  const serialization = record(value.serialization);
  const contract = record(value.contract);
  const cohort = record(value.cohort);
  const manifestMetadata = record(metadataSource.manifest);
  const manifestDataMetadata = record(manifest.metadata);
  const serializationMetadata = record(metadataSource.serialization);
  const contractMetadata = record(metadataSource.contract);
  const cohortMetadata = record(metadataSource.cohort);
  const metadata = {
    sourceManifest: consistentValues(
      [
        value.sourceManifest,
        metadataSource.sourceManifest,
        manifest.sourceManifest,
        manifestMetadata.sourceManifest,
        manifestDataMetadata.sourceManifest,
      ],
      "sourceManifest",
    ),
    sourceManifestSha256: consistentValues(
      [
        value.sourceManifestSha256,
        metadataSource.sourceManifestSha256,
        manifest.sourceManifestSha256,
        manifestMetadata.sourceManifestSha256,
        manifestDataMetadata.sourceManifestSha256,
      ],
      "sourceManifestSha256",
    ),
    manifestSchemaVersion: consistentValues(
      [
        value.manifestSchemaVersion,
        metadataSource.manifestSchemaVersion,
        manifest.manifestSchemaVersion,
        manifest.schemaVersion,
        manifestMetadata.manifestSchemaVersion,
        manifestMetadata.schemaVersion,
        manifestDataMetadata.manifestSchemaVersion,
        manifestDataMetadata.schemaVersion,
      ],
      "manifestSchemaVersion",
    ),
    manifestVersion: consistentValues(
      [
        value.manifestVersion,
        metadataSource.manifestVersion,
        manifest.manifestVersion,
        manifest.version,
        manifestMetadata.manifestVersion,
        manifestMetadata.version,
        manifestDataMetadata.manifestVersion,
        manifestDataMetadata.version,
      ],
      "manifestVersion",
    ),
    manifestFingerprint: consistentValues(
      [
        value.manifestFingerprint,
        value.canonicalManifestFingerprint,
        metadataSource.manifestFingerprint,
        metadataSource.canonicalManifestFingerprint,
        manifest.manifestFingerprint,
        manifest.canonicalManifestFingerprint,
        manifest.fingerprint,
        manifestMetadata.manifestFingerprint,
        manifestMetadata.canonicalManifestFingerprint,
        manifestMetadata.fingerprint,
        manifestDataMetadata.manifestFingerprint,
        manifestDataMetadata.canonicalManifestFingerprint,
        manifestDataMetadata.fingerprint,
      ],
      "manifestFingerprint",
    ),
    serializationVersion: consistentValues(
      [
        value.serializationVersion,
        metadataSource.serializationVersion,
        serialization.serializationVersion,
        serialization.version,
        serializationMetadata.serializationVersion,
        serializationMetadata.version,
      ],
      "serializationVersion",
    ),
    contractVersion: consistentValues(
      [
        value.contractVersion,
        metadataSource.contractVersion,
        contract.contractVersion,
        contract.version,
        contractMetadata.contractVersion,
        contractMetadata.version,
      ],
      "contractVersion",
    ),
    bankVersion: consistentValues(
      [value.bankVersion, metadataSource.bankVersion, manifest.bankVersion],
      "bankVersion",
    ),
    contractRoute: consistentValues(
      [
        value.contractRoute,
        metadataSource.contractRoute,
        manifest.contractRoute,
        manifestMetadata.contractRoute,
      ],
      "contractRoute",
    ),
    cohort: consistentValues(
      [
        typeof value.cohort === "string" ? value.cohort : undefined,
        typeof metadataSource.cohort === "string"
          ? metadataSource.cohort
          : undefined,
        cohortMetadata.cohort,
        cohort.cohort,
        cohort.id,
        cohort.name,
      ],
      "cohort",
    ),
    cohortVersion: consistentValues(
      [
        value.cohortVersion,
        metadataSource.cohortVersion,
        cohort.cohortVersion,
        cohort.version,
        cohortMetadata.cohortVersion,
        cohortMetadata.version,
      ],
      "cohortVersion",
    ),
    cohortFingerprint: consistentValues(
      [
        value.cohortFingerprint,
        metadataSource.cohortFingerprint,
        cohort.cohortFingerprint,
        cohort.fingerprint,
        cohortMetadata.cohortFingerprint,
        cohortMetadata.fingerprint,
      ],
      "cohortFingerprint",
    ),
  };
  if (
    metadata.sourceManifest !== "src/domain/canonicalManifest.ts" ||
    !/^[0-9a-f]{64}$/u.test(metadata.sourceManifestSha256 ?? "") ||
    !metadata.manifestSchemaVersion ||
    !metadata.manifestVersion ||
    !/^[0-9a-f]{64}$/u.test(metadata.manifestFingerprint ?? "") ||
    !metadata.serializationVersion ||
    !metadata.contractVersion ||
    !metadata.bankVersion ||
    !metadata.contractRoute ||
    !metadata.cohort ||
    !metadata.cohortVersion ||
    !metadata.cohortFingerprint
  ) {
    throw new Error(
      "Generated canonical contract artifact is missing required manifest, serialization, contract, or cohort metadata",
    );
  }
  return metadata;
}

function constant(source, name) {
  const match = source.match(
    new RegExp(`export const ${name}\\s*=\\s*['\"]([^'\"]+)['\"]`),
  );
  if (!match) throw new Error(`Missing ${name} in source`);
  return match[1];
}

function configuredVar(source, name) {
  const match = source.match(
    new RegExp(`['\"]${name}['\"]\\s*:\\s*['\"]([^'\"]+)['\"]`),
  );
  if (!match) throw new Error(`Missing ${name} in Wrangler configuration`);
  return match[1];
}

function collectorDefault(source, envName) {
  const match = source.match(
    new RegExp(`process\\.env\\.${envName}\\s*\\?\\?\\s*['\"]([^'\"]+)['\"]`),
  );
  if (!match) throw new Error(`Missing ${envName} collector default`);
  return match[1];
}

function analysisDefault(source, variableName, environmentName) {
  const match = source.match(
    new RegExp(
      `${variableName}\\s*<-\\s*Sys.getenv\\(\\s*['\"]${environmentName}['\"]\\s*,\\s*['\"]([^'\"]+)['\"]`,
    ),
  );
  if (!match) throw new Error(`Missing ${variableName} analysis default`);
  return match[1];
}

function specialistRoster(source) {
  const match = source.match(
    /export const SPECIALIST_ASSIGNMENT_MODULE_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/,
  );
  if (!match)
    throw new Error("Missing SPECIALIST_ASSIGNMENT_MODULE_IDS in source");
  const moduleIds = [...match[1].matchAll(/['\"]([^'\"]+-module)['\"]/g)].map(
    (entry) => entry[1],
  );
  if (moduleIds.length === 0 || new Set(moduleIds).size !== moduleIds.length) {
    throw new Error(
      "Specialist assignment roster is empty or contains duplicate module IDs",
    );
  }
  return moduleIds.join(",");
}

function sourceStringList(source, expression, description) {
  const match = source.match(expression);
  if (!match) throw new Error(`Missing ${description}`);
  const values = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(
    (entry) => entry[1],
  );
  if (values.length === 0 || new Set(values).size !== values.length) {
    throw new Error(`${description} is empty or contains duplicate IDs`);
  }
  return values;
}

function hash32(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function labelRosterFingerprint(
  role,
  labelIds,
  taxonomyVersion,
  measurementVersion = "not-applicable",
) {
  const canonicalIds = [...new Set(labelIds)].sort().join("|");
  const payload = `${taxonomyVersion}:${role}:${measurementVersion}:${canonicalIds}`;
  return `lr_${hash32(payload).toString(16).padStart(8, "0")}`;
}

function assertEqual(name, expected, actual) {
  if (expected !== actual) {
    throw new Error(`${name} mismatch: expected ${expected}, found ${actual}`);
  }
}
function sourceField(source, field) {
  const match = source.match(
    new RegExp(`(?:["']${field}["']|\\b${field}\\b)\\s*:\\s*["']([^"']+)["']`),
  );
  if (!match) throw new Error(`Missing ${field} in canonical source`);
  return match[1];
}

const research = await read("src/research/index.ts");
const taxonomy = await read("src/data/labelTaxonomy.ts");
const primaryMeasurement = await read("src/data/primaryMeasurement.ts");
const modifierMeasurement = await read("src/data/modifierMeasurement.ts");
const forms = await read("src/research/forms.ts");
const specialist = await read("src/specialist/index.ts");
const worker = await read("research-worker/wrangler.jsonc");
const collector = await read("research-collector/server.mjs");
const validation = await read("analysis/run_validation.R");
const readme = await read("analysis/README.md");
const preregistration = await read("docs/pilot-preregistration.md");
const launchGuide = await read("docs/pilot-retest-launch-2026-08.md");
const retestOperations = await read(
  "docs/recruitment-and-retest-operations.md",
);
const canonicalDataSource = await readOptional("src/domain/canonicalData.ts");
const protocol = await read("docs/psychometric-validation-protocol.md");
const canonicalManifestSource = await readOptional(
  "src/domain/canonicalManifest.ts",
);
const canonicalManifestArtifactSource = await readOptional(
  "research-worker/generated/canonical-manifest.json",
);
const canonicalManifestArtifact = canonicalManifestArtifactSource
  ? parseStrictJson(
      canonicalManifestArtifactSource,
      "Generated canonical manifest artifact: research-worker/generated/canonical-manifest.json",
    )
  : null;
const canonicalArtifact = parseCanonicalArtifact(
  await readOptional("research-worker/generated/canonical-contract.json"),
);
if (!canonicalArtifact) {
  throw new Error(
    "Generated canonical contract artifact is required; empty contract metadata is not allowed.",
  );
}
if (canonicalArtifact) {
  if (canonicalManifestSource === null)
    throw new Error(
      "Canonical manifest source is required when the artifact is present.",
    );
  if (canonicalDataSource === null)
    throw new Error(
      "Canonical data source is required when the artifact is present.",
    );
  if (
    !canonicalManifestArtifact ||
    !record(canonicalManifestArtifact.manifest)
  ) {
    throw new Error(
      "Generated canonical manifest artifact is required when the contract artifact is present.",
    );
  }
  const generatedManifest = record(canonicalManifestArtifact.manifest);
  const generatedManifestMetadata = record(generatedManifest.metadata);
  const generatedItems = generatedManifest.items;
  if (
    !Array.isArray(generatedItems) ||
    generatedItems.length === 0 ||
    !generatedItems.every(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        typeof item.id === "string" &&
        item.id.length > 0,
    ) ||
    new Set(generatedItems.map((item) => item.id)).size !==
      generatedItems.length
  ) {
    throw new Error(
      "Generated canonical manifest artifact must contain uniquely identified items.",
    );
  }
  const generatedItemsById = new Map(
    generatedItems.map((item) => [item.id, item]),
  );
  const activeCoreItemIds = generatedManifest.activeCoreItemIds;
  const conditionalSpecialistItemIds =
    generatedManifest.conditionalSpecialistItemIds;
  if (
    !Array.isArray(activeCoreItemIds) ||
    !Array.isArray(conditionalSpecialistItemIds) ||
    new Set([...activeCoreItemIds, ...conditionalSpecialistItemIds]).size !==
      activeCoreItemIds.length + conditionalSpecialistItemIds.length ||
    !activeCoreItemIds.every(
      (id) => generatedItemsById.get(id)?.role === "core",
    ) ||
    !conditionalSpecialistItemIds.every(
      (id) => generatedItemsById.get(id)?.role === "specialist",
    )
  ) {
    throw new Error(
      "Generated canonical manifest active item projections are inconsistent.",
    );
  }
  const generatedFingerprint = await sha256Canonical(
    generatedManifestFingerprintInput(generatedManifest),
  );
  assertEqual(
    "Generated canonical manifest payload fingerprint",
    generatedFingerprint,
    canonicalArtifact.manifestFingerprint,
  );
  assertEqual(
    "Canonical manifest schema",
    constant(canonicalManifestSource, "CANONICAL_MANIFEST_SCHEMA_VERSION"),
    canonicalArtifact.manifestSchemaVersion,
  );
  assertEqual(
    "Canonical manifest version",
    constant(canonicalManifestSource, "CANONICAL_MANIFEST_VERSION"),
    canonicalArtifact.manifestVersion,
  );
  assertEqual(
    "Canonical manifest fingerprint",
    sourceField(canonicalDataSource, "fingerprint"),
    canonicalArtifact.manifestFingerprint,
  );
  const sourceManifestSha256 = createHash("sha256")
    .update(canonicalManifestSource)
    .digest("hex");
  assertEqual(
    "Canonical manifest source",
    sourceManifestSha256,
    canonicalArtifact.sourceManifestSha256,
  );
  assertEqual(
    "Canonical serialization",
    "canonical-json-v1",
    canonicalArtifact.serializationVersion,
  );
  assertEqual(
    "Generated canonical manifest schema",
    canonicalArtifact.manifestSchemaVersion,
    generatedManifestMetadata.schemaVersion,
  );
  assertEqual(
    "Generated canonical manifest version",
    canonicalArtifact.manifestVersion,
    generatedManifestMetadata.version,
  );
  assertEqual(
    "Generated canonical manifest fingerprint",
    canonicalArtifact.manifestFingerprint,
    generatedManifestMetadata.fingerprint,
  );
  assertEqual(
    "Canonical bank version",
    canonicalArtifact.manifestVersion,
    canonicalArtifact.bankVersion,
  );
}

const taxonomyVersion = constant(taxonomy, "TAXONOMY_VERSION");
const primaryMeasurementVersion = constant(
  primaryMeasurement,
  "PRIMARY_MEASUREMENT_VERSION",
);
const modifierMeasurementVersion = constant(
  modifierMeasurement,
  "MODIFIER_MEASUREMENT_VERSION",
);
const primaryLabelIds = sourceStringList(
  taxonomy,
  /export const PRIMARY_LABEL_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/,
  "PRIMARY_LABEL_IDS",
);
const scoredModifierIds = [
  ...modifierMeasurement.matchAll(/coreConstruct\(\s*['"]([^'"]+)['"]/g),
].map((entry) => entry[1]);
if (
  scoredModifierIds.length === 0 ||
  new Set(scoredModifierIds).size !== scoredModifierIds.length
) {
  throw new Error(
    "core-construct modifier roster is empty or contains duplicate IDs",
  );
}
const primaryLabelRosterFingerprint = labelRosterFingerprint(
  "primary",
  primaryLabelIds,
  taxonomyVersion,
  primaryMeasurementVersion,
);
const modifierLabelRosterFingerprint = labelRosterFingerprint(
  "modifier",
  scoredModifierIds,
  taxonomyVersion,
  modifierMeasurementVersion,
);

const contract = {
  study: configuredVar(worker, "EXPECTED_STUDY_ID"),
  schema: constant(research, "RESEARCH_SCHEMA_VERSION"),
  consent: constant(research, "RESEARCH_CONSENT_VERSION"),
  quality: constant(research, "RESEARCH_QUALITY_RULE_VERSION"),
  primaryMeasurement: primaryMeasurementVersion,
  form: constant(forms, "RESEARCH_FORM_VERSION"),
  assignment: constant(specialist, "SPECIALIST_ASSIGNMENT_STRATEGY"),
  assignmentRoster: constant(
    specialist,
    "SPECIALIST_ASSIGNMENT_ROSTER_VERSION",
  ),
  assignmentModules: specialistRoster(specialist),
};

function documentedVersion(source, label) {
  const prefix = `- ${label}: `;
  const line = source
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith(prefix));
  if (!line) throw new Error(`Missing documented ${label} version`);
  const value = line.slice(prefix.length).trim();
  if (!value.startsWith("`") || !value.endsWith("`"))
    throw new Error(`Malformed documented ${label} version`);
  return value.slice(1, -1);
}

const documentedScoringVersion = documentedVersion(preregistration, "Scoring");
const documentedTaxonomyVersion = documentedVersion(
  preregistration,
  "Taxonomy registry",
);
const documentedPrimaryMeasurementVersion = documentedVersion(
  preregistration,
  "Primary measurement registry",
);

assertEqual(
  "Documented primary measurement",
  primaryMeasurementVersion,
  documentedPrimaryMeasurementVersion,
);

if (
  !constant(research, "PUBLIC_RESEARCH_ENTRYPOINT").includes(
    `collection=${contract.study}`,
  )
) {
  throw new Error(
    `Public research entrypoint does not use Worker study ${contract.study}`,
  );
}

assertEqual(
  "Worker schema",
  contract.schema,
  configuredVar(worker, "EXPECTED_SCHEMA_VERSION"),
);
assertEqual(
  "Worker consent",
  contract.consent,
  configuredVar(worker, "EXPECTED_CONSENT_VERSION"),
);
assertEqual(
  "Worker quality rules",
  contract.quality,
  configuredVar(worker, "EXPECTED_QUALITY_RULE_VERSION"),
);
assertEqual(
  "Worker form",
  contract.form,
  configuredVar(worker, "EXPECTED_FORM_VERSION"),
);
assertEqual(
  "Worker bank",
  canonicalArtifact.manifestVersion,
  configuredVar(worker, "EXPECTED_BANK_VERSION"),
);
assertEqual(
  "Worker contract route",
  canonicalArtifact.contractRoute,
  configuredVar(worker, "EXPECTED_CONTRACT_ROUTE"),
);
assertEqual(
  "Worker cohort",
  canonicalArtifact.cohort,
  configuredVar(worker, "EXPECTED_COHORT"),
);
assertEqual(
  "Worker cohort version",
  canonicalArtifact.cohortVersion,
  configuredVar(worker, "EXPECTED_COHORT_VERSION"),
);
assertEqual(
  "Worker cohort fingerprint",
  canonicalArtifact.cohortFingerprint,
  configuredVar(worker, "EXPECTED_COHORT_FINGERPRINT"),
);
assertEqual(
  "Worker scoring",
  documentedScoringVersion,
  configuredVar(worker, "EXPECTED_SCORING_VERSION"),
);
assertEqual(
  "Worker taxonomy",
  documentedTaxonomyVersion,
  configuredVar(worker, "EXPECTED_TAXONOMY_VERSION"),
);
assertEqual(
  "Worker primary measurement",
  primaryMeasurementVersion,
  configuredVar(worker, "EXPECTED_PRIMARY_MEASUREMENT_VERSION"),
);
assertEqual(
  "Worker modifier measurement",
  modifierMeasurementVersion,
  configuredVar(worker, "EXPECTED_MODIFIER_MEASUREMENT_VERSION"),
);
assertEqual(
  "Worker primary-label roster",
  primaryLabelRosterFingerprint,
  configuredVar(worker, "EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT"),
);
assertEqual(
  "Worker modifier-label roster",
  modifierLabelRosterFingerprint,
  configuredVar(worker, "EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT"),
);
assertEqual(
  "Worker specialist assignment strategy",
  contract.assignment,
  configuredVar(worker, "EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY"),
);
assertEqual(
  "Worker specialist assignment roster",
  contract.assignmentRoster,
  configuredVar(worker, "EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION"),
);
assertEqual(
  "Worker specialist assignment modules",
  contract.assignmentModules,
  configuredVar(worker, "EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS"),
);
assertEqual(
  "Collector schema",
  contract.schema,
  collectorDefault(collector, "RESEARCH_SCHEMA_VERSION"),
);
assertEqual(
  "Collector consent",
  contract.consent,
  collectorDefault(collector, "RESEARCH_CONSENT_VERSION"),
);
assertEqual(
  "Collector quality rules",
  contract.quality,
  collectorDefault(collector, "RESEARCH_QUALITY_RULE_VERSION"),
);
assertEqual(
  "Collector form",
  contract.form,
  collectorDefault(collector, "RESEARCH_FORM_VERSION"),
);
assertEqual(
  "Collector taxonomy",
  documentedTaxonomyVersion,
  collectorDefault(collector, "RESEARCH_TAXONOMY_VERSION"),
);
assertEqual(
  "Collector primary measurement",
  primaryMeasurementVersion,
  collectorDefault(collector, "RESEARCH_PRIMARY_MEASUREMENT_VERSION"),
);
assertEqual(
  "Collector modifier measurement",
  modifierMeasurementVersion,
  collectorDefault(collector, "RESEARCH_MODIFIER_MEASUREMENT_VERSION"),
);
assertEqual(
  "Collector primary-label roster",
  primaryLabelRosterFingerprint,
  collectorDefault(collector, "RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT"),
);
assertEqual(
  "Collector modifier-label roster",
  modifierLabelRosterFingerprint,
  collectorDefault(collector, "RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT"),
);
assertEqual(
  "Collector specialist assignment strategy",
  contract.assignment,
  collectorDefault(collector, "RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY"),
);
assertEqual(
  "Collector specialist assignment roster",
  contract.assignmentRoster,
  collectorDefault(collector, "RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION"),
);
assertEqual(
  "Collector specialist assignment modules",
  contract.assignmentModules,
  collectorDefault(collector, "RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS"),
);
assertEqual(
  "Analysis schema",
  contract.schema,
  analysisDefault(
    validation,
    "required_schema_version",
    "PSYCH_REQUIRED_SCHEMA_VERSION",
  ),
);
assertEqual(
  "Analysis modifier measurement",
  modifierMeasurementVersion,
  analysisDefault(
    validation,
    "required_modifier_measurement_version",
    "PSYCH_REQUIRED_MODIFIER_MEASUREMENT_VERSION",
  ),
);
assertEqual(
  "Analysis primary measurement",
  primaryMeasurementVersion,
  analysisDefault(
    validation,
    "required_primary_measurement_version",
    "PSYCH_REQUIRED_PRIMARY_MEASUREMENT_VERSION",
  ),
);
assertEqual(
  "Analysis primary-label roster",
  primaryLabelRosterFingerprint,
  analysisDefault(
    validation,
    "required_primary_label_roster_fingerprint",
    "PSYCH_REQUIRED_PRIMARY_LABEL_ROSTER_FINGERPRINT",
  ),
);
assertEqual(
  "Analysis modifier-label roster",
  modifierLabelRosterFingerprint,
  analysisDefault(
    validation,
    "required_modifier_label_roster_fingerprint",
    "PSYCH_REQUIRED_MODIFIER_LABEL_ROSTER_FINGERPRINT",
  ),
);

for (const [name, source] of [
  ["analysis README", readme],
  ["pilot preregistration", preregistration],
  ["pilot launch guide", launchGuide],
  ["retest operations", retestOperations],
  ["psychometric protocol", protocol],
]) {
  if (source.includes("2026-08-v9"))
    throw new Error(`${name} still references stale schema 2026-08-v9`);
  if (
    name !== "pilot preregistration" &&
    /(?:study|studyId)[=": ]+['"]?pilot-2026/.test(source)
  ) {
    throw new Error(
      `${name} still references the non-deployable study pilot-2026`,
    );
  }
  if (name !== "pilot preregistration" && !source.includes(contract.study)) {
    throw new Error(
      `${name} does not document the configured study ${contract.study}`,
    );
  }
}

if (contract.assignment !== "balanced-hash-v2") {
  throw new Error(
    `Unexpected specialist assignment strategy: ${contract.assignment}`,
  );
}

assertEqual(
  "Documented specialist assignment roster",
  contract.assignmentRoster,
  documentedVersion(preregistration, "Specialist assignment roster"),
);

console.log("Research version contract OK");
for (const [key, value] of Object.entries(contract))
  console.log(`${key}: ${value}`);
if (!canonicalArtifact) {
  console.warn(
    "Canonical contract artifact not found at research-worker/generated/canonical-contract.json; artifact-bound checks are deferred (bounded grace caveat).",
  );
} else {
  console.log(
    `canonicalContract: ${canonicalArtifact.contractVersion} / ${canonicalArtifact.cohortVersion}`,
  );
}
