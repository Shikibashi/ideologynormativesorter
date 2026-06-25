import type { Answer, AnswerMap } from '../types'

type EncodedAnswer = [string, Answer['value'], number?, number?]

const HASH_PREFIX = '#r='
const SHARE_VERSION = 2

export interface ShareMeta {
  bankVersion?: string
  scoringVersion?: string
}

export function encodeAnswers(answers: AnswerMap, meta?: ShareMeta): string {
  const compact: EncodedAnswer[] = Object.values(answers).map((a) => [a.questionId, a.value, a.confidence, a.priority])
  const payload = meta ? { v: SHARE_VERSION, bk: meta.bankVersion, sc: meta.scoringVersion, a: compact } : compact
  return base64UrlEncode(JSON.stringify(payload))
}

export function decodeAnswers(param: string): AnswerMap | null {
  try {
    const decoded = JSON.parse(base64UrlDecode(param))
    const compact = compactAnswersFromPayload(decoded)
    if (!compact) return null

    const answers: AnswerMap = {}
    for (const entry of compact) {
      if (!Array.isArray(entry)) return null
      const [questionId, value, confidence, priority] = entry
      if (typeof questionId !== 'string' || !isValidAnswerValue(value)) return null

      const answer: Answer = { questionId, value }
      if (isValidSalience(confidence)) answer.confidence = confidence
      if (isValidSalience(priority)) answer.priority = priority
      answers[questionId] = answer
    }
    return answers
  } catch {
    return null
  }
}

export function extractEncodedAnswers(input: string, param: 'r' | 'c' = 'r'): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const hashIndex = trimmed.indexOf('#')
  let payload = hashIndex >= 0 ? trimmed.slice(hashIndex + 1) : trimmed
  if (payload.startsWith('#')) payload = payload.slice(1)

  if (payload.includes('=') || payload.includes('&')) {
    const params = new URLSearchParams(payload)
    return params.get(param)
  }

  return param === 'r' ? trimmed : null
}

export function buildShareUrl(answers: AnswerMap, meta?: ShareMeta): string {
  return `${window.location.origin}${window.location.pathname}${HASH_PREFIX}${encodeAnswers(answers, meta)}`
}

export function buildCompareUrl(profile1: AnswerMap, profile2: AnswerMap, meta?: ShareMeta): string {
  const enc1 = encodeAnswers(profile1, meta)
  const enc2 = encodeAnswers(profile2)
  return `${window.location.origin}${window.location.pathname}#r=${enc1}&c=${enc2}`
}

export function readCompareAnswers(): AnswerMap | null {
  if (typeof window === 'undefined') return null
  const encoded = extractEncodedAnswers(window.location.hash, 'c')
  return encoded ? decodeAnswers(encoded) : null
}
export function readSharedAnswers(): AnswerMap | null {
  if (typeof window === 'undefined') return null
  const encoded = extractEncodedAnswers(window.location.hash, 'r')
  return encoded ? decodeAnswers(encoded) : null
}

export function readSharedResult(): { answers: AnswerMap | null; malformed: boolean } {
  if (typeof window === 'undefined') return { answers: null, malformed: false }
  const hash = window.location.hash
  // Only treat as a share attempt when an explicit r= param is present, so arbitrary
  // fragment anchors (e.g. #about) are never flagged as broken share links.
  if (!/[#&?]r=/.test(hash)) return { answers: null, malformed: false }
  const encoded = extractEncodedAnswers(hash, 'r')
  if (!encoded) return { answers: null, malformed: false }
  const answers = decodeAnswers(encoded)
  if (answers && Object.keys(answers).length > 0) return { answers, malformed: false }
  return { answers: null, malformed: true }
}

function compactAnswersFromPayload(decoded: unknown): unknown[] | null {
  if (Array.isArray(decoded)) return decoded
  if (decoded && typeof decoded === 'object' && 'v' in decoded) {
    const payload = decoded as { a?: unknown }
    return Array.isArray(payload.a) ? payload.a : null
  }
  return null
}

function isValidAnswerValue(value: unknown): value is Answer['value'] {
  return value === 'dont_know' || (typeof value === 'number' && Number.isFinite(value) && value >= -3 && value <= 3)
}

function isValidSalience(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}