import type { Answer, AnswerMap } from '../types'

type EncodedAnswer = [string, Answer['value'], number?, number?]

const HASH_PREFIX = '#r='

/** No backend: a result is shared by encoding the full answer set into the URL itself. */
export function encodeAnswers(answers: AnswerMap): string {
  const compact: EncodedAnswer[] = Object.values(answers).map((a) => [a.questionId, a.value, a.confidence, a.priority])
  return base64UrlEncode(JSON.stringify(compact))
}

export function decodeAnswers(param: string): AnswerMap | null {
  try {
    const compact = JSON.parse(base64UrlDecode(param)) as EncodedAnswer[]
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

export function buildShareUrl(answers: AnswerMap): string {
  return `${window.location.origin}${window.location.pathname}${HASH_PREFIX}${encodeAnswers(answers)}`
}

/** Reads a shared result out of the current URL hash, if one is present. */
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
