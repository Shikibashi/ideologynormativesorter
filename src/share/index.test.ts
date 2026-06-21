import { afterEach, describe, expect, it } from 'vitest'
import type { AnswerMap } from '../types'
import { buildShareUrl, decodeAnswers, encodeAnswers, readSharedAnswers } from './index'

const SAMPLE_ANSWERS: AnswerMap = {
  q0001: { questionId: 'q0001', value: 2 },
  q0002: { questionId: 'q0002', value: 'dont_know' },
  q0003: { questionId: 'q0003', value: -1, confidence: 4 },
  q0004: { questionId: 'q0004', value: 3, priority: 2 },
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
})

describe('readSharedAnswers', () => {
  it('reads an encoded answer map out of the #r= hash', () => {
    const encoded = encodeAnswers(SAMPLE_ANSWERS)
    window.history.replaceState(null, '', `/#r=${encoded}`)
    expect(readSharedAnswers()).toEqual(SAMPLE_ANSWERS)
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
