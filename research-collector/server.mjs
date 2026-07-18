import { createServer } from 'node:http'
import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const port = Number(process.env.PORT ?? 8787)
const outputFile = resolve(process.env.RESEARCH_OUTPUT_FILE ?? './private-data/submissions.ndjson')
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'
const maximumBodyBytes = Number(process.env.MAXIMUM_BODY_BYTES ?? 2_000_000)

await mkdir(dirname(outputFile), { recursive: true })

function setCors(response, origin) {
  if (origin === allowedOrigin) response.setHeader('access-control-allow-origin', origin)
  response.setHeader('vary', 'origin')
  response.setHeader('access-control-allow-methods', 'POST, OPTIONS')
  response.setHeader('access-control-allow-headers', 'content-type')
  response.setHeader('cache-control', 'no-store')
  response.setHeader('x-content-type-options', 'nosniff')
}

function validSubmission(value) {
  return value
    && typeof value === 'object'
    && typeof value.schemaVersion === 'string'
    && typeof value.studyId === 'string'
    && typeof value.participantId === 'string'
    && (value.administration === 'test' || value.administration === 'retest')
    && value.consent?.ageConfirmed === true
    && value.consent?.voluntaryParticipation === true
    && value.consent?.dataUseAccepted === true
    && value.answers
    && typeof value.answers === 'object'
    && Array.isArray(value.itemMap)
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
  await appendFile(outputFile, `${JSON.stringify(submission)}\n`, { encoding: 'utf8', mode: 0o600 })
  response.writeHead(202, { 'content-type': 'application/json' }).end(JSON.stringify({ accepted: true }))
})

server.listen(port, () => {
  console.log(`Research collector listening on http://localhost:${port}/submit`)
  console.log(`Writing pseudonymous records to ${outputFile}`)
})
