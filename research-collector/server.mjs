import { createServer } from 'node:http'
import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const port = Number(process.env.PORT ?? 8787)
const outputFile = resolve(process.env.RESEARCH_OUTPUT_FILE ?? './private-data/submissions.ndjson')
const specialistOutputFile = resolve(
  process.env.SPECIALIST_RESEARCH_OUTPUT_FILE ?? './private-data/specialist-submissions.ndjson',
)
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'
const maximumBodyBytes = Number(process.env.MAXIMUM_BODY_BYTES ?? 2_000_000)

await Promise.all([
  mkdir(dirname(outputFile), { recursive: true }),
  mkdir(dirname(specialistOutputFile), { recursive: true }),
])

function setCors(response, origin) {
  if (origin === allowedOrigin) response.setHeader('access-control-allow-origin', origin)
  response.setHeader('vary', 'origin')
  response.setHeader('access-control-allow-methods', 'POST, OPTIONS')
  response.setHeader('access-control-allow-headers', 'content-type')
  response.setHeader('cache-control', 'no-store')
  response.setHeader('x-content-type-options', 'nosniff')
}

function validBaseRecord(value) {
  return value
    && typeof value === 'object'
    && typeof value.schemaVersion === 'string'
    && typeof value.studyId === 'string'
    && typeof value.participantId === 'string'
    && (value.administration === 'test' || value.administration === 'retest')
    && typeof value.startedAt === 'string'
    && typeof value.completedAt === 'string'
    && value.consent?.ageConfirmed === true
    && value.consent?.voluntaryParticipation === true
    && value.consent?.dataUseAccepted === true
}

function validAnsweredRecord(value) {
  return validBaseRecord(value)
    && value.answers
    && typeof value.answers === 'object'
    && !Array.isArray(value.answers)
    && Array.isArray(value.itemMap)
    && Array.isArray(value.presentationOrder)
}

function validCoreRecord(value) {
  return validAnsweredRecord(value)
    && (value.recordType === undefined || value.recordType === 'core')
    && typeof value.bankVersion === 'string'
    && typeof value.scoringVersion === 'string'
    && typeof value.tier === 'string'
    && value.identity
    && typeof value.identity === 'object'
    && Array.isArray(value.predictedLabelIds)
}

function validSpecialistRecord(value) {
  return validAnsweredRecord(value)
    && value.recordType === 'specialist'
    && typeof value.moduleId === 'string'
    && typeof value.moduleVersion === 'string'
    && typeof value.bankVersion === 'string'
    && typeof value.scoringVersion === 'string'
    && value.assignment
    && typeof value.assignment === 'object'
    && value.assignment.moduleId === value.moduleId
    && typeof value.assignment.strategy === 'string'
    && value.criterion
    && typeof value.criterion === 'object'
    && Array.isArray(value.criterion.selectedIds)
    && typeof value.criterion.noneOrUnsure === 'boolean'
    && ['low', 'medium', 'high'].includes(value.criterion.confidence)
    && value.constructScores
    && typeof value.constructScores === 'object'
    && !Array.isArray(value.constructScores)
    && Array.isArray(value.matches)
}

function validSpecialistDisposition(value) {
  return validBaseRecord(value)
    && value.recordType === 'specialist-disposition'
    && typeof value.moduleId === 'string'
    && typeof value.moduleVersion === 'string'
    && value.assignment
    && typeof value.assignment === 'object'
    && value.assignment.moduleId === value.moduleId
    && typeof value.assignment.strategy === 'string'
    && ['declined-before-start', 'declined-after-partial', 'declined-after-completion'].includes(value.disposition)
    && Number.isInteger(value.answeredCount)
    && value.answeredCount >= 0
}

function validSubmission(value) {
  return validCoreRecord(value) || validSpecialistRecord(value) || validSpecialistDisposition(value)
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

  submission.receivedAt = new Date().toISOString()
  const targetFile = submission.recordType === 'specialist' || submission.recordType === 'specialist-disposition'
    ? specialistOutputFile
    : outputFile
  await appendFile(targetFile, `${JSON.stringify(submission)}\n`, { encoding: 'utf8', mode: 0o600 })
  response.writeHead(202, { 'content-type': 'application/json' }).end(JSON.stringify({ accepted: true }))
})

server.listen(port, () => {
  console.log(`Research collector listening on http://localhost:${port}/submit`)
  console.log(`Writing core pseudonymous records to ${outputFile}`)
  console.log(`Writing specialist pseudonymous records and dispositions to ${specialistOutputFile}`)
})
