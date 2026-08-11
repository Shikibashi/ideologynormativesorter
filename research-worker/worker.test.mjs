import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { handleRequest, researchFormFingerprint } from './src/worker.mjs'

const ORIGIN = 'https://ideologynormativesorter.edriffles.us'

class FakeDatabase {
  constructor() {
    this.rows = new Map()
  }

  prepare(query) {
    const database = this
    let parameters = []
    return {
      bind(...values) {
        parameters = values
        return this
      },
      async first() {
        if (!query.startsWith('SELECT payload_sha256')) throw new Error(`Unexpected SELECT: ${query}`)
        const row = database.rows.get(parameters[0])
        return row ? { payload_sha256: row.payload_sha256 } : null
      },
      async run() {
        if (!query.startsWith('INSERT OR IGNORE INTO submissions')) throw new Error(`Unexpected INSERT: ${query}`)
        database.rows.set(parameters[0], {
          submission_id: parameters[0],
          record_type: parameters[1],
          participant_id: parameters[2],
          study_id: parameters[3],
          schema_version: parameters[4],
          received_at: parameters[5],
          payload_sha256: parameters[6],
          payload_json: parameters[7],
        })
        return { success: true }
      },
    }
  }
}

function environment(overrides = {}) {
  return {
    ALLOWED_ORIGIN: ORIGIN,
    EXPECTED_STUDY_ID: 'community-2026',
    EXPECTED_SCHEMA_VERSION: '2026-08-v5',
    EXPECTED_CONSENT_VERSION: '2026-08-10-v5',
    EXPECTED_QUALITY_RULE_VERSION: 'data-quality-v2',
    EXPECTED_FORM_VERSION: 'balanced-matrix-v2',
    EXPECTED_CORE_ITEM_COUNT: '1',
    MAXIMUM_BODY_BYTES: '2000000',
    DB: new FakeDatabase(),
    RESEARCH_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  }
}

function coreSubmission(overrides = {}) {
  const itemMap = [{
    questionId: 'q0001',
    prompt: 'Public authority requires justification.',
    helpText: 'Choose the response closest to your view.',
    domain: 'state-legitimacy',
    layer: 'normative',
    responseOptions: [
      { value: -1, label: 'Disagree' },
      { value: 0, label: 'Neither' },
      { value: 1, label: 'Agree' },
      { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
    ],
  }]
  return {
    schemaVersion: '2026-08-v5',
    submissionId: 'submission_1',
    recordType: 'core',
    studyId: 'community-2026',
    participantId: 'p_test',
    administration: 'test',
    submittedAt: '2026-08-10T12:02:00.000Z',
    startedAt: '2026-08-10T12:00:00.000Z',
    completedAt: '2026-08-10T12:02:00.000Z',
    durationMs: 120000,
    consent: {
      ageConfirmed: true,
      voluntaryParticipation: true,
      dataUseAccepted: true,
      consentVersion: '2026-08-10-v5',
      consentedAt: '2026-08-10T12:00:00.000Z',
      disclosureSnapshot: {
        endpointConfigured: true,
        transferAndWithdrawalNotice: 'Responses are sent to the website endpoint.',
        retentionNotice: 'Records are retained for a published period.',
        contactNotice: 'A site-owner contact is published.',
      },
    },
    locale: 'en-US',
    qualityRuleVersion: 'data-quality-v2',
    resumed: false,
    presentationOrder: ['q0001'],
    form: {
      algorithmVersion: 'balanced-matrix-v2',
      requestedItemCount: 1,
      assignedItemCount: 1,
      fingerprint: researchFormFingerprint(itemMap),
    },
    sampling: {
      design: 'open-opt-in-nonprobability',
      populationInference: false,
      weighting: 'none',
      recruitmentSource: 'direct-or-unknown',
      recruitmentSourceProvenance: 'url-parameter-unverified',
    },
    bankVersion: 'bank-v1',
    scoringVersion: 'scoring-v1',
    tier: 'moderate',
    identity: {},
    predictedLabelIds: [],
    answers: { q0001: { questionId: 'q0001', value: 1 } },
    itemMap,
    ...overrides,
  }
}

function postRequest(body, origin = ORIGIN) {
  return new Request('https://collector.example/submit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '203.0.113.10',
      origin,
    },
    body: JSON.stringify(body),
  })
}

describe('research contribution Worker', () => {
  it('accepts a valid contribution and deduplicates an exact retry', async () => {
    const env = environment()
    const submission = coreSubmission()

    const first = await handleRequest(postRequest(submission), env)
    assert.equal(first.status, 202)
    assert.deepEqual(await first.json(), {
      accepted: true,
      submissionId: 'submission_1',
      deduplicated: false,
    })

    const retry = await handleRequest(postRequest(submission), env)
    assert.equal(retry.status, 202)
    assert.equal((await retry.json()).deduplicated, true)
    assert.equal(env.DB.rows.size, 1)
  })

  it('rejects a conflicting payload that reuses a submission ID', async () => {
    const env = environment()
    await handleRequest(postRequest(coreSubmission()), env)
    const conflict = await handleRequest(postRequest(coreSubmission({ locale: 'fr' })), env)
    assert.equal(conflict.status, 409)
    assert.deepEqual(await conflict.json(), { error: 'submission-id-conflict' })
  })

  it('rejects untrusted origins and invalid form sizes', async () => {
    const env = environment()
    const forbidden = await handleRequest(postRequest(coreSubmission(), 'https://attacker.example'), env)
    assert.equal(forbidden.status, 403)
    assert.equal(forbidden.headers.get('access-control-allow-origin'), null)

    const invalid = await handleRequest(postRequest(coreSubmission({ itemMap: [] })), env)
    assert.equal(invalid.status, 422)
  })

  it('returns 429 before persistence when the edge rate limit is exhausted', async () => {
    const env = environment({ RESEARCH_RATE_LIMITER: { limit: async () => ({ success: false }) } })
    const response = await handleRequest(postRequest(coreSubmission()), env)
    assert.equal(response.status, 429)
    assert.equal(env.DB.rows.size, 0)
  })
})
