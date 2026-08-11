import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { AnswerMap } from '../../types'
import { QUESTION_BANK_VERSION } from '../../data/questions'
import { SEMANTIC_AUDIT_VERSION } from '../../data/semanticAudit'
import { RESULT_SCORING_VERSION } from '../../scoring'
import { decodeAnswers, encodeAnswers } from '../../share'
import { WP0_FREEZE, liveFreezeMetrics } from './inventory/freeze'

const SAMPLE_ANSWERS: AnswerMap = {
  q0001: { questionId: 'q0001', value: 2 },
  q0002: { questionId: 'q0002', value: 'dont_know' },
  q0003: { questionId: 'q0003', value: -1, confidence: 4 },
}

function decodeSharePayload(encoded: string): unknown {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return JSON.parse(new TextDecoder().decode(bytes))
}

describe('version matrix', () => {
  it('exposes live version constants used by bank, audit, scoring, and share', () => {
    expect(typeof QUESTION_BANK_VERSION).toBe('string')
    expect(QUESTION_BANK_VERSION.length).toBeGreaterThan(0)

    expect(typeof SEMANTIC_AUDIT_VERSION).toBe('string')
    expect(SEMANTIC_AUDIT_VERSION.length).toBeGreaterThan(0)

    expect(typeof RESULT_SCORING_VERSION).toBe('string')
    expect(RESULT_SCORING_VERSION.length).toBeGreaterThan(0)

    // SHARE_VERSION is module-private; assert the current metadata-and-salience format is wired as v3.
    const shareSource = readFileSync('src/share/index.ts', 'utf8')
    expect(shareSource).toMatch(/\bconst\s+SHARE_VERSION\s*=\s*3\b/)
  })

  it('freeze.versions matches live recount versions', () => {
    const live = liveFreezeMetrics()
    expect(live.versions).toEqual(WP0_FREEZE.versions)
    expect(WP0_FREEZE.versions.questionBank).toBe(QUESTION_BANK_VERSION)
    expect(WP0_FREEZE.versions.semanticAudit).toBe(SEMANTIC_AUDIT_VERSION)
    expect(WP0_FREEZE.versions.resultScoring).toBe(RESULT_SCORING_VERSION)
  })

  it('share encode writes bankVersion/scoringVersion when meta is present without breaking decode', () => {
    const meta = {
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
    }

    const withMeta = encodeAnswers(SAMPLE_ANSWERS, meta)
    const payload = decodeSharePayload(withMeta) as {
      v?: number
      bk?: string
      sc?: string
      a?: unknown
    }

    expect(payload).toMatchObject({
      v: 3,
      bk: QUESTION_BANK_VERSION,
      sc: RESULT_SCORING_VERSION,
    })
    expect(Array.isArray(payload.a)).toBe(true)
    expect(decodeAnswers(withMeta)).toEqual(SAMPLE_ANSWERS)

    // The v3 envelope also works without optional bank/scoring metadata.
    const legacy = encodeAnswers(SAMPLE_ANSWERS)
    expect(decodeSharePayload(legacy)).toMatchObject({ v: 3 })
    expect(decodeAnswers(legacy)).toEqual(SAMPLE_ANSWERS)
  })
})
