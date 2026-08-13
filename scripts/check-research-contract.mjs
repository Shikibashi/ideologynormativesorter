import { readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8')
}

function constant(source, name) {
  const match = source.match(new RegExp(`export const ${name}\\s*=\\s*['\"]([^'\"]+)['\"]`))
  if (!match) throw new Error(`Missing ${name} in source`)
  return match[1]
}

function configuredVar(source, name) {
  const match = source.match(new RegExp(`['\"]${name}['\"]\\s*:\\s*['\"]([^'\"]+)['\"]`))
  if (!match) throw new Error(`Missing ${name} in Wrangler configuration`)
  return match[1]
}

function collectorDefault(source, envName) {
  const match = source.match(new RegExp(`process\\.env\\.${envName}\\s*\\?\\?\\s*['\"]([^'\"]+)['\"]`))
  if (!match) throw new Error(`Missing ${envName} collector default`)
  return match[1]
}

function analysisDefault(source, variableName, environmentName) {
  const match = source.match(new RegExp(
    `${variableName}\\s*<-\\s*Sys.getenv\\(\\s*['\"]${environmentName}['\"]\\s*,\\s*['\"]([^'\"]+)['\"]`,
  ))
  if (!match) throw new Error(`Missing ${variableName} analysis default`)
  return match[1]
}

function specialistRoster(source) {
  const match = source.match(/export const SPECIALIST_ASSIGNMENT_MODULE_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/)
  if (!match) throw new Error('Missing SPECIALIST_ASSIGNMENT_MODULE_IDS in source')
  const moduleIds = [...match[1].matchAll(/['\"]([^'\"]+-module)['\"]/g)].map((entry) => entry[1])
  if (moduleIds.length === 0 || new Set(moduleIds).size !== moduleIds.length) {
    throw new Error('Specialist assignment roster is empty or contains duplicate module IDs')
  }
  return moduleIds.join(',')
}

function sourceStringList(source, expression, description) {
  const match = source.match(expression)
  if (!match) throw new Error(`Missing ${description}`)
  const values = [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((entry) => entry[1])
  if (values.length === 0 || new Set(values).size !== values.length) {
    throw new Error(`${description} is empty or contains duplicate IDs`)
  }
  return values
}

function hash32(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function labelRosterFingerprint(role, labelIds, taxonomyVersion, modifierMeasurementVersion = 'not-applicable') {
  const canonicalIds = [...new Set(labelIds)].sort().join('|')
  const payload = `${taxonomyVersion}:${role}:${modifierMeasurementVersion}:${canonicalIds}`
  return `lr_${hash32(payload).toString(16).padStart(8, '0')}`
}

function assertEqual(name, expected, actual) {
  if (expected !== actual) {
    throw new Error(`${name} mismatch: expected ${expected}, found ${actual}`)
  }
}

const research = await read('src/research/index.ts')
const taxonomy = await read('src/data/labelTaxonomy.ts')
const modifierMeasurement = await read('src/data/modifierMeasurement.ts')
const forms = await read('src/research/forms.ts')
const specialist = await read('src/specialist/index.ts')
const worker = await read('research-worker/wrangler.jsonc')
const collector = await read('research-collector/server.mjs')
const validation = await read('analysis/run_validation.R')
const readme = await read('analysis/README.md')
const preregistration = await read('docs/pilot-preregistration.md')
const launchGuide = await read('docs/pilot-retest-launch-2026-08.md')
const retestOperations = await read('docs/recruitment-and-retest-operations.md')
const protocol = await read('docs/psychometric-validation-protocol.md')

const taxonomyVersion = constant(taxonomy, 'TAXONOMY_VERSION')
const modifierMeasurementVersion = constant(modifierMeasurement, 'MODIFIER_MEASUREMENT_VERSION')
const primaryLabelIds = sourceStringList(
  taxonomy,
  /export const PRIMARY_LABEL_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/,
  'PRIMARY_LABEL_IDS',
)
const scoredModifierIds = [...modifierMeasurement.matchAll(/coreConstruct\(\s*['"]([^'"]+)['"]/g)].map((entry) => entry[1])
if (scoredModifierIds.length === 0 || new Set(scoredModifierIds).size !== scoredModifierIds.length) {
  throw new Error('core-construct modifier roster is empty or contains duplicate IDs')
}
const primaryLabelRosterFingerprint = labelRosterFingerprint('primary', primaryLabelIds, taxonomyVersion)
const modifierLabelRosterFingerprint = labelRosterFingerprint(
  'modifier',
  scoredModifierIds,
  taxonomyVersion,
  modifierMeasurementVersion,
)

const contract = {
  study: configuredVar(worker, 'EXPECTED_STUDY_ID'),
  schema: constant(research, 'RESEARCH_SCHEMA_VERSION'),
  consent: constant(research, 'RESEARCH_CONSENT_VERSION'),
  quality: constant(research, 'RESEARCH_QUALITY_RULE_VERSION'),
  form: constant(forms, 'RESEARCH_FORM_VERSION'),
  assignment: constant(specialist, 'SPECIALIST_ASSIGNMENT_STRATEGY'),
  assignmentRoster: constant(specialist, 'SPECIALIST_ASSIGNMENT_ROSTER_VERSION'),
  assignmentModules: specialistRoster(specialist),
}

function documentedVersion(source, label) {
  const prefix = `- ${label}: `
  const line = source.split(/\r?\n/).find((candidate) => candidate.startsWith(prefix))
  if (!line) throw new Error(`Missing documented ${label} version`)
  const value = line.slice(prefix.length).trim()
  if (!value.startsWith('`') || !value.endsWith('`')) throw new Error(`Malformed documented ${label} version`)
  return value.slice(1, -1)
}

const documentedBankVersion = documentedVersion(preregistration, 'Question bank')
const documentedScoringVersion = documentedVersion(preregistration, 'Scoring')
const documentedTaxonomyVersion = documentedVersion(preregistration, 'Taxonomy registry')

if (!constant(research, 'PUBLIC_RESEARCH_ENTRYPOINT').includes(`collection=${contract.study}`)) {
  throw new Error(`Public research entrypoint does not use Worker study ${contract.study}`)
}

assertEqual('Worker schema', contract.schema, configuredVar(worker, 'EXPECTED_SCHEMA_VERSION'))
assertEqual('Worker consent', contract.consent, configuredVar(worker, 'EXPECTED_CONSENT_VERSION'))
assertEqual('Worker quality rules', contract.quality, configuredVar(worker, 'EXPECTED_QUALITY_RULE_VERSION'))
assertEqual('Worker form', contract.form, configuredVar(worker, 'EXPECTED_FORM_VERSION'))
assertEqual('Worker bank', documentedBankVersion, configuredVar(worker, 'EXPECTED_BANK_VERSION'))
assertEqual('Worker scoring', documentedScoringVersion, configuredVar(worker, 'EXPECTED_SCORING_VERSION'))
assertEqual('Worker taxonomy', documentedTaxonomyVersion, configuredVar(worker, 'EXPECTED_TAXONOMY_VERSION'))
assertEqual('Worker modifier measurement', modifierMeasurementVersion, configuredVar(worker, 'EXPECTED_MODIFIER_MEASUREMENT_VERSION'))
assertEqual('Worker primary-label roster', primaryLabelRosterFingerprint, configuredVar(worker, 'EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT'))
assertEqual('Worker modifier-label roster', modifierLabelRosterFingerprint, configuredVar(worker, 'EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT'))
assertEqual('Worker specialist assignment strategy', contract.assignment, configuredVar(worker, 'EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY'))
assertEqual('Worker specialist assignment roster', contract.assignmentRoster, configuredVar(worker, 'EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION'))
assertEqual('Worker specialist assignment modules', contract.assignmentModules, configuredVar(worker, 'EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS'))
assertEqual('Collector schema', contract.schema, collectorDefault(collector, 'RESEARCH_SCHEMA_VERSION'))
assertEqual('Collector consent', contract.consent, collectorDefault(collector, 'RESEARCH_CONSENT_VERSION'))
assertEqual('Collector quality rules', contract.quality, collectorDefault(collector, 'RESEARCH_QUALITY_RULE_VERSION'))
assertEqual('Collector form', contract.form, collectorDefault(collector, 'RESEARCH_FORM_VERSION'))
assertEqual('Collector taxonomy', documentedTaxonomyVersion, collectorDefault(collector, 'RESEARCH_TAXONOMY_VERSION'))
assertEqual('Collector modifier measurement', modifierMeasurementVersion, collectorDefault(collector, 'RESEARCH_MODIFIER_MEASUREMENT_VERSION'))
assertEqual('Collector primary-label roster', primaryLabelRosterFingerprint, collectorDefault(collector, 'RESEARCH_PRIMARY_LABEL_ROSTER_FINGERPRINT'))
assertEqual('Collector modifier-label roster', modifierLabelRosterFingerprint, collectorDefault(collector, 'RESEARCH_MODIFIER_LABEL_ROSTER_FINGERPRINT'))
assertEqual('Collector specialist assignment strategy', contract.assignment, collectorDefault(collector, 'RESEARCH_SPECIALIST_ASSIGNMENT_STRATEGY'))
assertEqual('Collector specialist assignment roster', contract.assignmentRoster, collectorDefault(collector, 'RESEARCH_SPECIALIST_ASSIGNMENT_ROSTER_VERSION'))
assertEqual('Collector specialist assignment modules', contract.assignmentModules, collectorDefault(collector, 'RESEARCH_SPECIALIST_ASSIGNMENT_MODULE_IDS'))
assertEqual(
  'Analysis schema',
  contract.schema,
  analysisDefault(validation, 'required_schema_version', 'PSYCH_REQUIRED_SCHEMA_VERSION'),
)
assertEqual(
  'Analysis modifier measurement',
  modifierMeasurementVersion,
  analysisDefault(validation, 'required_modifier_measurement_version', 'PSYCH_REQUIRED_MODIFIER_MEASUREMENT_VERSION'),
)
assertEqual(
  'Analysis primary-label roster',
  primaryLabelRosterFingerprint,
  analysisDefault(validation, 'required_primary_label_roster_fingerprint', 'PSYCH_REQUIRED_PRIMARY_LABEL_ROSTER_FINGERPRINT'),
)
assertEqual(
  'Analysis modifier-label roster',
  modifierLabelRosterFingerprint,
  analysisDefault(validation, 'required_modifier_label_roster_fingerprint', 'PSYCH_REQUIRED_MODIFIER_LABEL_ROSTER_FINGERPRINT'),
)

for (const [name, source] of [
  ['analysis README', readme],
  ['pilot preregistration', preregistration],
  ['pilot launch guide', launchGuide],
  ['retest operations', retestOperations],
  ['psychometric protocol', protocol],
]) {
  if (source.includes('2026-08-v9')) throw new Error(`${name} still references stale schema 2026-08-v9`)
  if (name !== 'pilot preregistration' && /(?:study|studyId)[=": ]+['"]?pilot-2026/.test(source)) {
    throw new Error(`${name} still references the non-deployable study pilot-2026`)
  }
  if (name !== 'pilot preregistration' && !source.includes(contract.study)) {
    throw new Error(`${name} does not document the configured study ${contract.study}`)
  }
}

if (contract.assignment !== 'balanced-hash-v2') {
  throw new Error(`Unexpected specialist assignment strategy: ${contract.assignment}`)
}

assertEqual(
  'Documented specialist assignment roster',
  contract.assignmentRoster,
  documentedVersion(preregistration, 'Specialist assignment roster'),
)

console.log('Research version contract OK')
for (const [key, value] of Object.entries(contract)) console.log(`${key}: ${value}`)
