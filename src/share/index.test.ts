import { afterEach, describe, expect, it } from 'vitest'
import type { AnswerMap } from '../types'
import { buildShareUrl, decodeAnswers, encodeAnswers, extractEncodedAnswers, readSharedAnswers, readCompareAnswers, readSharedResult } from './index'

const SAMPLE_ANSWERS: AnswerMap = {
  q0001: { questionId: 'q0001', value: 2 },
  q0002: { questionId: 'q0002', value: 'dont_know' },
  q0003: { questionId: 'q0003', value: -1, confidence: 4 },
  q0004: { questionId: 'q0004', value: 3, priority: 2 },
}

function encodePayload(payload: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

afterEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('encodeAnswers / decodeAnswers', () => {
  it('round-trips an answer map exactly', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    expect(decodeAnswers(encoded)).toEqual(SAMPLE_ANSWERS)
  })

  it('produces a URL-safe string with no padding characters', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('returns null for garbage input instead of throwing', () => {
    expect(decodeAnswers('not-valid-base64!!')).toBeNull()
  })

  it('rejects malformed v2 payloads', () => {
    expect(decodeAnswers(encodePayload({ v: 2, a: {} }))).toBeNull()
    expect(decodeAnswers(encodePayload({ v: 2 }))).toBeNull()
    expect(decodeAnswers(encodePayload({ a: [['q0001', 1]] }))).toBeNull()
  })

  it('rejects invalid answer values', () => {
    expect(decodeAnswers(encodePayload([['q0001', 4]]))).toBeNull()
    expect(decodeAnswers(encodePayload([['q0001', Number.NaN]]))).toBeNull()
    expect(decodeAnswers(encodePayload([[123, 1]]))).toBeNull()
  })

  it('omits invalid optional salience while preserving the answer', () => {
    const decoded = decodeAnswers(encodePayload([
      ['q0001', 2, 'high', 0],
      ['q0002', -1, 6, Number.POSITIVE_INFINITY],
    ]))

    expect(decoded).toEqual({
      q0001: { questionId: 'q0001', value: 2 },
      q0002: { questionId: 'q0002', value: -1 },
    })
  })
})

describe('extractEncodedAnswers', () => {
  it('extracts answers from full URLs, hashes, raw payloads, and composite params', () => {
    const encoded1 = encodeAnswers(SAMPLE_ANSWERS)
    const encoded2 = encodeAnswers({ q0001: { questionId: 'q0001', value: -2 } })

    expect(extractEncodedAnswers(`https://example.test/path#r=${encoded1}`)).toBe(encoded1)
    expect(extractEncodedAnswers(`#r=${encoded1}`)).toBe(encoded1)
    expect(extractEncodedAnswers(encoded1)).toBe(encoded1)
    expect(extractEncodedAnswers(`#r=${encoded1}&c=${encoded2}`, 'r')).toBe(encoded1)
    expect(extractEncodedAnswers(`#r=${encoded1}&c=${encoded2}`, 'c')).toBe(encoded2)
    expect(extractEncodedAnswers(encoded1, 'c')).toBeNull()
  })
})

describe('readSharedAnswers', () => {
  it('reads an encoded answer map out of the #r= hash', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    window.history.replaceState(null, '', `/#r=${encoded}`)
    expect(readSharedAnswers()).toEqual(SAMPLE_ANSWERS)
  })

  it('reads both original and compare answers from a composite hash', () => {
    const encoded1 = encodeAnswers(SAMPLE_ANSWERS)
    const encoded2 = encodeAnswers({ q0001: { questionId: 'q0001', value: -2 } })
    window.history.replaceState(null, '', `/#r=${encoded1}&c=${encoded2}`)
    expect(readSharedAnswers()).toEqual(SAMPLE_ANSWERS)
    expect(readCompareAnswers()).toEqual({ q0001: { questionId: 'q0001', value: -2 } })
  })

  it('returns null when there is no #r= hash', () => {
    window.history.replaceState(null, '', '/')
    expect(readSharedAnswers()).toBeNull()
  })
})

describe('buildShareUrl', () => {
  it('builds a URL containing the current origin and an #r= hash', () => {
    const url = buildShareUrl(SAMPLE_ANSWERS)
    expect(url).toContain(window.location.origin)
    expect(url).toContain('#r=')
  })
})

describe('readSharedResult', () => {
  it('returns answers and malformed=false for a valid #r= hash', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    window.history.replaceState(null, '', `/#r=${encoded}`)
    const result = readSharedResult()
    expect(result.answers).toEqual(SAMPLE_ANSWERS)
    expect(result.malformed).toBe(false)
  })

  it('returns null answers and malformed=false when there is no hash', () => {
    window.history.replaceState(null, '', '/')
    expect(readSharedResult()).toEqual({ answers: null, malformed: false })
  })

  it('returns null answers and malformed=false for a non-share fragment (#about)', () => {
    window.history.replaceState(null, '', '/#about')
    expect(readSharedResult()).toEqual({ answers: null, malformed: false })
  })

  it('returns malformed=true for a non-empty r= value that cannot be decoded', () => {
    window.history.replaceState(null, '', '/#r=%%%notbase64%%%')
    const result = readSharedResult()
    expect(result.answers).toBeNull()
    expect(result.malformed).toBe(true)
  })

  it('returns malformed=true for a valid encoding of an empty answer map', () => {
    const encoded = encodeAnswers({})
    window.history.replaceState(null, '', `/#r=${encoded}`)
    const result = readSharedResult()
    expect(result.answers).toBeNull()
    expect(result.malformed).toBe(true)
  })
})
