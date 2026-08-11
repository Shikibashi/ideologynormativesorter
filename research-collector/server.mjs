import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const port = Number(process.env.PORT ?? 8787)
const outputFile = resolve(process.env.RESEARCH_OUTPUT_FILE ?? './private-data/submissions.ndjson')
const specialistOutputFile = resolve(
  process.env.SPECIALIST_RESEARCH_OUTPUT_FILE ?? './private-data/specialist-submissions.ndjson',
)
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'
const maximumBodyBytes = Number(process.env.MAXIMUM_BODY_BYTES ?? 2_000_000)
const expectedSchemaVersion = process.env.RESEARCH_SCHEMA_VERSION ?? '2026-08-v5'
const expectedConsentVersion = process.env.RESEARCH_CONSENT_VERSION ?? '2026-08-10-v5'
const expectedQualityRuleVersion = process.env.RESEARCH_QUALITY_RULE_VERSION ?? 'data-quality-v2'
const expectedFormVersion = process.env.RESEARCH_FORM_VERSION ?? 'balanced-matrix-v2'
const expectedStudyId = process.env.RESEARCH_STUDY_ID?.trim() || null
const expectedBankVersion = process.env.RESEARCH_BANK_VERSION?.trim() || null
const expectedScoringVersion = process.env.RESEARCH_SCORING_VERSION?.trim() || null
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/
const LAYERS = new Set(['normative', 'descriptive', 'prescriptive'])
const THEORY_CONTEXTS = new Set(['ideal', 'nonideal', 'mixed'])
const RESPONSE_TYPES = new Set(['likert5', 'likert7', 'statementChoice'])
const REVIEW_STATUSES = new Set(['approved', 'draft', 'needs-rewrite'])
const TIERS = new Set(['blitz', 'quick', 'moderate', 'extensive'])
const SALIENCE_VALUES = new Set([1, 3, 5])

await Promise.all([
  mkdir(dirname(outputFile), { recursive: true }),
  mkdir(dirname(specialistOutputFile), { recursive: true }),
])

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function validToken(value, maximumLength = 96) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= maximumLength
    && TOKEN_PATTERN.test(value)
}

function validNonemptyString(value, maximumLength = 512) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength
}

function validIsoTimestamp(value) {
  if (typeof value !== 'string') return false
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value
}

function validVersion(value, expected = null) {
  return validNonemptyString(value, 512) && (expected === null || value === expected)
}

function validAxisWeights(weights) {
  return Array.isArray(weights) && weights.every((weight) => (
    isObject(weight)
    && validToken(weight.axisId, 128)
    && typeof weight.weight === 'number'
    && Number.isFinite(weight.weight)
  ))
}

function validSalienceSnapshot(salience, layer) {
  if (layer === 'normative') return salience === undefined
  if (!isObject(salience)) return false
  const expectedKind = layer === 'descriptive' ? 'confidence' : 'priority'
  if (salience.kind !== expectedKind
    || !validNonemptyString(salience.prompt, 1_000)
    || !validNonemptyString(salience.helpText, 2_000)
    || !Array.isArray(salience.options)) return false
  const values = salience.options.map((option) => option?.value)
  return values.length === 4
    && [1, 3, 5, 'skipped'].every((value) => values.some((candidate) => Object.is(candidate, value)))
    && salience.options.every((option) => isObject(option) && validNonemptyString(option.label, 256))
}

function validItemSnapshot(item) {
  if (!isObject(item)
    || !validToken(item.questionId, 128)
    || !validNonemptyString(item.prompt, 10_000)
    || !validNonemptyString(item.helpText, 10_000)
    || !validToken(item.domain, 128)
    || !LAYERS.has(item.layer)
    || !THEORY_CONTEXTS.has(item.theoryContext)
    || !RESPONSE_TYPES.has(item.responseType)
    || !Array.isArray(item.responseOptions)
    || item.responseOptions.length === 0
    || !validAxisWeights(item.axisWeights)
    || typeof item.reverseScored !== 'boolean'
    || (item.reviewStatus !== undefined && !REVIEW_STATUSES.has(item.reviewStatus))
    || !Number.isInteger(item.sourceCount)
    || item.sourceCount < 0
    || !validSalienceSnapshot(item.salience, item.layer)) return false

  const responseValues = item.responseOptions.map((option) => option?.value)
  const responseKeys = responseValues.map((value) => `${typeof value}:${String(value)}`)
  const stringValues = responseValues.filter((value) => typeof value === 'string')
  if (new Set(responseKeys).size !== responseKeys.length
    || !item.responseOptions.every((option) => isObject(option) && validNonemptyString(option.label, 10_000))
    || !responseValues.every((value) => typeof value === 'number' || typeof value === 'string')
    || !stringValues.every((value) => value === 'dont_know' || value === 'prefer_not_to_answer')
    || !responseValues.includes('prefer_not_to_answer')) return false

  if (item.responseType === 'statementChoice') {
    if (!Array.isArray(item.statementOptions) || item.statementOptions.length === 0) return false
    const validStatements = item.statementOptions.every((option) => (
      isObject(option)
      && validToken(option.id, 128)
      && validNonemptyString(option.text, 10_000)
      && validAxisWeights(option.axisWeights)
    ))
    const expectedValues = item.statementOptions.map((_, index) => index)
    const numericValues = responseValues.filter((value) => typeof value === 'number')
    return validStatements
      && numericValues.length === expectedValues.length
      && expectedValues.every((value) => numericValues.includes(value))
  }

  const expectedValues = item.responseType === 'likert5' ? [-2, -1, 0, 1, 2] : [-3, -2, -1, 0, 1, 2, 3]
  const numericValues = responseValues.filter((value) => typeof value === 'number')
  return numericValues.length === expectedValues.length
    && expectedValues.every((value) => numericValues.includes(value))
}

function hash32(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function researchFormFingerprint(itemMap) {
  const canonical = itemMap.map((item) => item.questionId).sort().join('|')
  return `rf_${hash32(`${expectedFormVersion}:${canonical}`).toString(16).padStart(8, '0')}`
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`
  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function submissionDigest(submission) {
  const withoutReceipt = { ...submission }
  delete withoutReceipt.receivedAt
  return createHash('sha256').update(canonicalize(withoutReceipt)).digest('hex')
}

async function loadSubmissionDigests(paths) {
  const digests = new Map()
  for (const path of new Set(paths)) {
    let contents
    try {
      contents = await readFile(path, 'utf8')
    } catch (error) {
      if (error?.code === 'ENOENT') continue
      throw error
    }
    const lines = contents.split(/\r?\n/).filter((line) => line.trim().length > 0)
    for (const [lineIndex, line] of lines.entries()) {
      let submission
      try {
        submission = JSON.parse(line)
      } catch {
        throw new Error(`Cannot start with malformed JSON in ${path} at data line ${lineIndex + 1}.`)
      }
      if (!validToken(submission?.submissionId)) {
        throw new Error(`Cannot start with a missing or invalid submissionId in ${path} at data line ${lineIndex + 1}.`)
      }
      const digest = submissionDigest(submission)
      const existing = digests.get(submission.submissionId)
      if (existing && existing !== digest) {
        throw new Error(`Conflicting stored records reuse submissionId ${submission.submissionId}.`)
      }
      digests.set(submission.submissionId, digest)
    }
  }
  return digests
}

const submissionDigests = await loadSubmissionDigests([outputFile, specialistOutputFile])
let writeQueue = Promise.resolve()

function setCors(response, origin) {
  if (origin === allowedOrigin) response.setHeader('access-control-allow-origin', origin)
  response.setHeader('vary', 'origin')
  response.setHeader('access-control-allow-methods', 'POST, OPTIONS')
  response.setHeader('access-control-allow-headers', 'content-type')
  response.setHeader('cache-control', 'no-store')
  response.setHeader('x-content-type-options', 'nosniff')
}

function validBaseRecord(value) {
  if (!(isObject(value)
    && value.schemaVersion === expectedSchemaVersion
    && validToken(value.submissionId)
    && validToken(value.studyId)
    && (expectedStudyId === null || value.studyId === expectedStudyId)
    && validToken(value.participantId)
    && (value.administration === 'test' || value.administration === 'retest')
    && validIsoTimestamp(value.submittedAt)
    && validIsoTimestamp(value.startedAt)
    && validIsoTimestamp(value.completedAt)
    && Number.isInteger(value.durationMs)
    && value.durationMs >= 0
    && isObject(value.consent)
    && value.consent?.ageConfirmed === true
    && value.consent?.voluntaryParticipation === true
    && value.consent?.dataUseAccepted === true
    && value.consent?.consentVersion === expectedConsentVersion
    && validIsoTimestamp(value.consent?.consentedAt)
    && isObject(value.consent?.disclosureSnapshot)
    && typeof value.consent.disclosureSnapshot.endpointConfigured === 'boolean'
    && validNonemptyString(value.consent.disclosureSnapshot.transferAndWithdrawalNotice, 10_000)
    && validNonemptyString(value.consent.disclosureSnapshot.retentionNotice, 10_000)
    && validNonemptyString(value.consent.disclosureSnapshot.contactNotice, 10_000)
    && validToken(value.locale, 32)
    && value.qualityRuleVersion === expectedQualityRuleVersion)) return false

  const submittedAt = Date.parse(value.submittedAt)
  const startedAt = Date.parse(value.startedAt)
  const completedAt = Date.parse(value.completedAt)
  const consentedAt = Date.parse(value.consent.consentedAt)
  return startedAt <= completedAt
    && completedAt <= submittedAt
    && consentedAt <= completedAt
    && value.durationMs === completedAt - startedAt
}

function validAnswerForItem(answer, item) {
  if (!isObject(answer) || answer.questionId !== item.questionId) return false
  if (!item.responseOptions.some((option) => Object.is(option.value, answer.value))) return false

  const substantive = typeof answer.value === 'number'
  const hasConfidence = answer.confidence !== undefined
  const hasPriority = answer.priority !== undefined
  const skipped = answer.salienceSkipped === true
  if (answer.salienceSkipped !== undefined && !skipped) return false
  if (!substantive) return !hasConfidence && !hasPriority && !skipped
  if (item.layer === 'normative') return !hasConfidence && !hasPriority && !skipped

  const rating = item.layer === 'descriptive' ? answer.confidence : answer.priority
  const hasWrongRating = item.layer === 'descriptive' ? hasPriority : hasConfidence
  if (hasWrongRating) return false
  return skipped ? rating === undefined : SALIENCE_VALUES.has(rating)
}

function validAnsweredRecord(value) {
  if (!(validBaseRecord(value)
    && value.answers
    && typeof value.answers === 'object'
    && !Array.isArray(value.answers)
    && Array.isArray(value.itemMap)
    && Array.isArray(value.presentationOrder))) return false

  if (!value.itemMap.every(validItemSnapshot)) return false
  const itemIds = value.itemMap.map((item) => item.questionId)
  const answerIds = Object.keys(value.answers)
  if (new Set(itemIds).size !== itemIds.length) return false
  if (new Set(value.presentationOrder).size !== value.presentationOrder.length) return false
  if (itemIds.length !== answerIds.length || itemIds.length !== value.presentationOrder.length) return false
  const membership = new Set(itemIds)
  if (!answerIds.every((id) => membership.has(id))
    || !value.presentationOrder.every((id, index) => id === itemIds[index])) return false
  return value.itemMap.every((item) => validAnswerForItem(value.answers[item.questionId], item))
}

function validAssignment(assignment, moduleId) {
  return isObject(assignment)
    && assignment.moduleId === moduleId
    && validToken(assignment.moduleId, 128)
    && validToken(assignment.strategy, 128)
}

function validIdentity(identity) {
  if (!isObject(identity)) return false
  if (identity.selfLabelId !== undefined && !validToken(identity.selfLabelId, 128)) return false
  if (identity.selfReportedIdeologies !== undefined
    && (typeof identity.selfReportedIdeologies !== 'string' || identity.selfReportedIdeologies.length > 240)) return false
  if (identity.ageBand !== undefined && !['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].includes(identity.ageBand)) return false
  return identity.genderGroup === undefined || ['woman', 'man', 'nonbinary-or-another'].includes(identity.genderGroup)
}

function validCoreRecord(value) {
  return validAnsweredRecord(value)
    && value.recordType === 'core'
    && typeof value.resumed === 'boolean'
    && validVersion(value.bankVersion, expectedBankVersion)
    && validVersion(value.scoringVersion, expectedScoringVersion)
    && TIERS.has(value.tier)
    && validIdentity(value.identity)
    && Array.isArray(value.predictedLabelIds)
    && value.predictedLabelIds.length <= 5
    && value.predictedLabelIds.every((labelId) => validToken(labelId, 128))
    && new Set(value.predictedLabelIds).size === value.predictedLabelIds.length
    && isObject(value.form)
    && value.form.algorithmVersion === expectedFormVersion
    && (value.form.requestedItemCount === null
      || (Number.isInteger(value.form.requestedItemCount)
        && value.form.requestedItemCount >= 12
        && value.form.requestedItemCount >= value.form.assignedItemCount))
    && Number.isInteger(value.form.assignedItemCount)
    && value.form.assignedItemCount > 0
    && value.form.assignedItemCount === value.itemMap.length
    && value.form.fingerprint === researchFormFingerprint(value.itemMap)
    && value.sampling?.design === 'open-opt-in-nonprobability'
    && value.sampling?.populationInference === false
    && value.sampling?.weighting === 'none'
    && validToken(value.sampling?.recruitmentSource)
    && value.sampling?.recruitmentSourceProvenance === 'url-parameter-unverified'
    && (value.specialistAssignment === undefined
      || validAssignment(value.specialistAssignment, value.specialistAssignment.moduleId))
}

function validSpecialistRecord(value) {
  return validAnsweredRecord(value)
    && value.recordType === 'specialist'
    && validToken(value.moduleId, 128)
    && validVersion(value.moduleVersion)
    && validVersion(value.bankVersion, expectedBankVersion)
    && validVersion(value.scoringVersion, expectedScoringVersion)
    && validAssignment(value.assignment, value.moduleId)
    && isObject(value.criterion)
    && Array.isArray(value.criterion.selectedIds)
    && value.criterion.selectedIds.every((labelId) => validToken(labelId, 128))
    && new Set(value.criterion.selectedIds).size === value.criterion.selectedIds.length
    && typeof value.criterion.noneOrUnsure === 'boolean'
    && !(value.criterion.noneOrUnsure && value.criterion.selectedIds.length > 0)
    && ['low', 'medium', 'high'].includes(value.criterion.confidence)
    && isObject(value.constructScores)
    && Object.values(value.constructScores).every((score) => typeof score === 'number' && Number.isFinite(score))
    && Array.isArray(value.matches)
    && value.matches.every((match) => isObject(match) && validToken(match.id, 128) && Number.isFinite(match.fit))
}

function validSpecialistDisposition(value) {
  return validBaseRecord(value)
    && value.recordType === 'specialist-disposition'
    && validToken(value.moduleId, 128)
    && validVersion(value.moduleVersion)
    && validAssignment(value.assignment, value.moduleId)
    && ['declined-before-start', 'declined-after-partial', 'declined-after-completion'].includes(value.disposition)
    && Number.isInteger(value.answeredCount)
    && value.answeredCount >= 0
}

function validSubmission(value) {
  return validCoreRecord(value) || validSpecialistRecord(value) || validSpecialistDisposition(value)
}

function persistSubmission(submission, targetFile) {
  const operation = writeQueue.then(async () => {
    const digest = submissionDigest(submission)
    const existing = submissionDigests.get(submission.submissionId)
    if (existing) {
      return existing === digest ? { duplicate: true, conflict: false } : { duplicate: false, conflict: true }
    }

    const storedSubmission = { ...submission, receivedAt: new Date().toISOString() }
    await appendFile(targetFile, `${JSON.stringify(storedSubmission)}\n`, { encoding: 'utf8', mode: 0o600 })
    submissionDigests.set(submission.submissionId, digest)
    return { duplicate: false, conflict: false }
  })
  writeQueue = operation.then(() => undefined, () => undefined)
  return operation
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin ?? ''
  setCors(response, origin)

  if (request.method === 'OPTIONS') {
    response.writeHead(origin === allowedOrigin ? 204 : 403).end()
    return
  }

  if (request.method !== 'POST' || request.url !== '/submit') {
    response.writeHead(404, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'not-found' }))
    return
  }

  if (origin !== allowedOrigin) {
    response.writeHead(403, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'origin-not-allowed' }))
    return
  }

  if (!(request.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
    response.writeHead(415, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'json-required' }))
    return
  }

  const chunks = []
  let byteCount = 0
  for await (const chunk of request) {
    byteCount += chunk.length
    if (byteCount > maximumBodyBytes) {
      response.writeHead(413, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'payload-too-large' }))
      return
    }
    chunks.push(chunk)
  }

  let submission
  try {
    submission = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    response.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'invalid-json' }))
    return
  }

  if (!validSubmission(submission)) {
    response.writeHead(422, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'invalid-submission' }))
    return
  }

  const targetFile = submission.recordType === 'specialist' || submission.recordType === 'specialist-disposition'
    ? specialistOutputFile
    : outputFile
  let persistence
  try {
    persistence = await persistSubmission(submission, targetFile)
  } catch (error) {
    console.error('Failed to persist research submission:', error)
    response.writeHead(500, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'storage-failed' }))
    return
  }
  if (persistence.conflict) {
    response.writeHead(409, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'submission-id-conflict' }))
    return
  }
  response.writeHead(202, { 'content-type': 'application/json' }).end(JSON.stringify({
    accepted: true,
    submissionId: submission.submissionId,
    deduplicated: persistence.duplicate,
  }))
})

server.listen(port, () => {
  console.log(`Research collector listening on http://localhost:${port}/submit`)
  console.log(`Writing core pseudonymous records to ${outputFile}`)
  console.log(`Writing specialist pseudonymous records and dispositions to ${specialistOutputFile}`)
  console.log(`Loaded ${submissionDigests.size} existing submission ID(s) for idempotency checks`)
})
