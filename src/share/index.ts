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
    let compact: EncodedAnswer[]
    if (decoded && typeof decoded === 'object' && 'v' in decoded) {
      // v2
      compact = decoded.a
    } else {
      compact = decoded
    }
    const answers: AnswerMap = {}
    for (const [questionId, value, confidence, priority] of compact) {
      const answer: Answer = { questionId, value }
      if (confidence != null) answer.confidence = confidence
      if (priority != null) answer.priority = priority
      answers[questionId] = answer
    }
    return answers
  } catch {
    return null
  }
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
  const { hash } = window.location
  const cMatch = hash.match(/[?&]c=([^&]+)/)
  if (!cMatch) return null
  return decodeAnswers(cMatch[1])
}
export function readSharedAnswers(): AnswerMap | null {
  if (typeof window === 'undefined') return null
  const { hash } = window.location
  if (!hash.startsWith(HASH_PREFIX)) return null
  return decodeAnswers(hash.slice(HASH_PREFIX.length))
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