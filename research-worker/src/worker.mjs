const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/
const RECORD_TYPES = new Set(['core', 'specialist', 'specialist-disposition'])
const LAYERS = new Set(['normative', 'descriptive', 'prescriptive'])
const SALIENCE_VALUES = new Set([1, 3, 5])

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function validToken(value, maximumLength = 128) {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= maximumLength
    && TOKEN_PATTERN.test(value)
}

function validString(value, maximumLength = 10_000) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength
}

function validTimestamp(value) {
  if (typeof value !== 'string') return false
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value
}

function configuredInteger(value, fallback) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function configuredIntegerSet(value) {
  if (typeof value !== 'string') return new Set()
  return new Set(value.split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isInteger(entry) && entry > 0))
}

function validConsent(consent, env) {
  return isObject(consent)
    && consent.ageConfirmed === true
    && consent.voluntaryParticipation === true
    && consent.dataUseAccepted === true
    && consent.consentVersion === env.EXPECTED_CONSENT_VERSION
    && validTimestamp(consent.consentedAt)
    && isObject(consent.disclosureSnapshot)
    && consent.disclosureSnapshot.endpointConfigured === true
    && validString(consent.disclosureSnapshot.transferAndWithdrawalNotice)
    && validString(consent.disclosureSnapshot.retentionNotice)
    && validString(consent.disclosureSnapshot.contactNotice)
}

function validBaseRecord(submission, env) {
  if (!(isObject(submission)
    && submission.schemaVersion === env.EXPECTED_SCHEMA_VERSION
    && RECORD_TYPES.has(submission.recordType)
    && validToken(submission.submissionId, 96)
    && submission.studyId === env.EXPECTED_STUDY_ID
    && validToken(submission.participantId, 96)
    && (submission.administration === 'test' || submission.administration === 'retest')
    && validTimestamp(submission.submittedAt)
    && validTimestamp(submission.startedAt)
    && validTimestamp(submission.completedAt)
    && Number.isInteger(submission.durationMs)
    && submission.durationMs >= 0
    && validConsent(submission.consent, env)
    && validToken(submission.locale, 32)
    && submission.qualityRuleVersion === env.EXPECTED_QUALITY_RULE_VERSION)) return false

  const startedAt = Date.parse(submission.startedAt)
  const completedAt = Date.parse(submission.completedAt)
  const submittedAt = Date.parse(submission.submittedAt)
  const consentedAt = Date.parse(submission.consent.consentedAt)
  return startedAt <= completedAt
    && completedAt <= submittedAt
    && consentedAt <= completedAt
    && submission.durationMs === completedAt - startedAt
}

function validResponseOption(option) {
  return isObject(option)
    && (typeof option.value === 'number' || typeof option.value === 'string')
    && validString(option.label)
}

function validItem(item) {
  return isObject(item)
    && validToken(item.questionId)
    && validString(item.prompt)
    && validString(item.helpText)
    && validToken(item.domain)
    && LAYERS.has(item.layer)
    && Array.isArray(item.responseOptions)
    && item.responseOptions.length > 0
    && item.responseOptions.every(validResponseOption)
}

function validAnswer(answer, item) {
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

function validAnsweredRecord(submission) {
  if (!(isObject(submission.answers)
    && Array.isArray(submission.itemMap)
    && Array.isArray(submission.presentationOrder)
    && submission.itemMap.every(validItem))) return false

  const itemIds = submission.itemMap.map((item) => item.questionId)
  const answerIds = Object.keys(submission.answers)
  if (new Set(itemIds).size !== itemIds.length
    || itemIds.length !== answerIds.length
    || itemIds.length !== submission.presentationOrder.length
    || !submission.presentationOrder.every((id, index) => id === itemIds[index])) return false

  const membership = new Set(itemIds)
  return answerIds.every((id) => membership.has(id))
    && submission.itemMap.every((item) => validAnswer(submission.answers[item.questionId], item))
}

function hash32(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function researchFormFingerprint(itemMap, formVersion = 'profile-form-v3') {
  const canonicalIds = itemMap.map((item) => item.questionId).sort().join('|')
  return `rf_${hash32(`${formVersion}:${canonicalIds}`).toString(16).padStart(8, '0')}`
}

function validIdentity(identity) {
  if (!isObject(identity)) return false
  if (identity.selfLabelId !== undefined && !validToken(identity.selfLabelId)) return false
  if (identity.selfReportedIdeologies !== undefined
    && (typeof identity.selfReportedIdeologies !== 'string' || identity.selfReportedIdeologies.length > 240)) return false
  if (identity.ageBand !== undefined && !['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].includes(identity.ageBand)) return false
  return identity.genderGroup === undefined || ['woman', 'man', 'nonbinary-or-another'].includes(identity.genderGroup)
}

function validCoreRecord(submission, env) {
  const expectedProfileCount = submission.tier === 'moderate'
    ? configuredInteger(env.EXPECTED_MODERATE_ITEM_COUNT, 140)
    : submission.tier === 'extensive'
      ? configuredInteger(env.EXPECTED_EXTENSIVE_ITEM_COUNT, 286)
      : null
  const assignedCount = submission.itemMap?.length
  const requestedCount = submission.form?.requestedItemCount
  const allowedMatrixCounts = configuredIntegerSet(env.ALLOWED_MATRIX_ITEM_COUNTS)
  const validProfileForm = requestedCount === null && assignedCount === expectedProfileCount
  const validMatrixForm = Number.isInteger(requestedCount)
    && requestedCount === assignedCount
    && allowedMatrixCounts.has(requestedCount)
  return submission.recordType === 'core'
    && validAnsweredRecord(submission)
    && (submission.tier === 'moderate' || submission.tier === 'extensive')
    && (validProfileForm || validMatrixForm)
    && typeof submission.resumed === 'boolean'
    && validString(submission.bankVersion, 512)
    && validString(submission.scoringVersion, 512)
    && validIdentity(submission.identity)
    && Array.isArray(submission.predictedLabelIds)
    && submission.predictedLabelIds.length <= 5
    && submission.predictedLabelIds.every((id) => validToken(id))
    && new Set(submission.predictedLabelIds).size === submission.predictedLabelIds.length
    && isObject(submission.form)
    && submission.form.algorithmVersion === env.EXPECTED_FORM_VERSION
    && submission.form.assignedItemCount === assignedCount
    && submission.form.fingerprint === researchFormFingerprint(submission.itemMap, env.EXPECTED_FORM_VERSION)
    && submission.sampling?.design === 'open-opt-in-nonprobability'
    && submission.sampling?.populationInference === false
    && submission.sampling?.weighting === 'none'
    && validToken(submission.sampling?.recruitmentSource, 96)
    && submission.sampling?.recruitmentSourceProvenance === 'url-parameter-unverified'
}

function validAssignment(assignment, moduleId) {
  return isObject(assignment)
    && assignment.moduleId === moduleId
    && validToken(assignment.moduleId)
    && validToken(assignment.strategy)
}

function validSpecialistRecord(submission) {
  return submission.recordType === 'specialist'
    && validAnsweredRecord(submission)
    && validToken(submission.moduleId)
    && validString(submission.moduleVersion, 512)
    && validString(submission.bankVersion, 512)
    && validString(submission.scoringVersion, 512)
    && validAssignment(submission.assignment, submission.moduleId)
    && isObject(submission.criterion)
    && Array.isArray(submission.criterion.selectedIds)
    && submission.criterion.selectedIds.every((id) => validToken(id))
    && typeof submission.criterion.noneOrUnsure === 'boolean'
    && !(submission.criterion.noneOrUnsure && submission.criterion.selectedIds.length > 0)
    && ['low', 'medium', 'high'].includes(submission.criterion.confidence)
    && isObject(submission.constructScores)
    && Object.values(submission.constructScores).every((score) => Number.isFinite(score))
    && Array.isArray(submission.matches)
    && submission.matches.every((match) => isObject(match) && validToken(match.id) && Number.isFinite(match.fit))
}

function validSpecialistDisposition(submission) {
  return submission.recordType === 'specialist-disposition'
    && validToken(submission.moduleId)
    && validString(submission.moduleVersion, 512)
    && validAssignment(submission.assignment, submission.moduleId)
    && ['declined-before-start', 'declined-after-partial', 'declined-after-completion'].includes(submission.disposition)
    && Number.isInteger(submission.answeredCount)
    && submission.answeredCount >= 0
}

export function validateSubmission(submission, env) {
  if (!validBaseRecord(submission, env)) return false
  if (submission.recordType === 'core') return validCoreRecord(submission, env)
  if (submission.recordType === 'specialist') return validSpecialistRecord(submission)
  return validSpecialistDisposition(submission)
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`
  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

async function submissionDigest(submission) {
  const bytes = new TextEncoder().encode(canonicalize(submission))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('')
}

function responseHeaders(origin, env) {
  const headers = new Headers({
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff',
    vary: 'Origin',
  })
  if (origin === env.ALLOWED_ORIGIN) headers.set('access-control-allow-origin', origin)
  return headers
}

function jsonResponse(status, body, origin, env) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(origin, env) })
}

async function persistSubmission(submission, env) {
  const digest = await submissionDigest(submission)
  const existing = await env.DB.prepare(
    'SELECT payload_sha256 FROM submissions WHERE submission_id = ?1',
  ).bind(submission.submissionId).first()
  if (existing) {
    return existing.payload_sha256 === digest
      ? { duplicate: true, conflict: false }
      : { duplicate: false, conflict: true }
  }

  const receivedAt = new Date().toISOString()
  const result = await env.DB.prepare(
    `INSERT OR IGNORE INTO submissions (
      submission_id, record_type, participant_id, study_id, schema_version,
      received_at, payload_sha256, payload_json
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
  ).bind(
    submission.submissionId,
    submission.recordType,
    submission.participantId,
    submission.studyId,
    submission.schemaVersion,
    receivedAt,
    digest,
    JSON.stringify({ ...submission, receivedAt }),
  ).run()
  if (result?.success === false) throw new Error('D1 insert failed')
  if (result?.meta?.changes === 0) {
    const raced = await env.DB.prepare(
      'SELECT payload_sha256 FROM submissions WHERE submission_id = ?1',
    ).bind(submission.submissionId).first()
    return raced?.payload_sha256 === digest
      ? { duplicate: true, conflict: false }
      : { duplicate: false, conflict: true }
  }
  return { duplicate: false, conflict: false }
}

export async function handleRequest(request, env) {
  const origin = request.headers.get('origin') ?? ''
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse(200, { ok: true }, origin, env)
  }

  if (request.method === 'OPTIONS' && url.pathname === '/submit') {
    if (origin !== env.ALLOWED_ORIGIN) return jsonResponse(403, { error: 'origin-not-allowed' }, origin, env)
    const headers = responseHeaders(origin, env)
    headers.set('access-control-allow-methods', 'POST, OPTIONS')
    headers.set('access-control-allow-headers', 'content-type')
    return new Response(null, { status: 204, headers })
  }

  if (request.method !== 'POST' || url.pathname !== '/submit') {
    return jsonResponse(404, { error: 'not-found' }, origin, env)
  }
  if (origin !== env.ALLOWED_ORIGIN) return jsonResponse(403, { error: 'origin-not-allowed' }, origin, env)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return jsonResponse(415, { error: 'json-required' }, origin, env)
  }

  if (env.RESEARCH_RATE_LIMITER?.limit) {
    const actor = request.headers.get('cf-connecting-ip') ?? 'unknown'
    const rateLimit = await env.RESEARCH_RATE_LIMITER.limit({ key: `research:${actor}` })
    if (!rateLimit.success) return jsonResponse(429, { error: 'rate-limited' }, origin, env)
  }

  const maximumBodyBytes = configuredInteger(env.MAXIMUM_BODY_BYTES, 2_000_000)
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > maximumBodyBytes) return jsonResponse(413, { error: 'payload-too-large' }, origin, env)
  const body = await request.arrayBuffer()
  if (body.byteLength > maximumBodyBytes) return jsonResponse(413, { error: 'payload-too-large' }, origin, env)

  let submission
  try {
    submission = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return jsonResponse(400, { error: 'invalid-json' }, origin, env)
  }
  if (!validateSubmission(submission, env)) {
    return jsonResponse(422, { error: 'invalid-submission' }, origin, env)
  }

  try {
    const persistence = await persistSubmission(submission, env)
    if (persistence.conflict) return jsonResponse(409, { error: 'submission-id-conflict' }, origin, env)
    return jsonResponse(202, {
      accepted: true,
      submissionId: submission.submissionId,
      deduplicated: persistence.duplicate,
    }, origin, env)
  } catch (error) {
    console.error('Failed to persist contribution', error)
    return jsonResponse(500, { error: 'storage-failed' }, origin, env)
  }
}

export default {
  fetch: handleRequest,
}
