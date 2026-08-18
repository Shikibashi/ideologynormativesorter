import type { Answer, AnswerMap } from "../types";
import { isCompatibleQuestionBankVersion } from "../domain/selectors";

type EncodedAnswer = [string, Answer["value"], number?, number?, true?];

const HASH_PREFIX = "#r=";
const SHARE_VERSION = 3;

export interface ShareMeta {
  bankVersion?: string;
  scoringVersion?: string;
}

export function encodeAnswers(answers: AnswerMap, meta?: ShareMeta): string {
  const compact: EncodedAnswer[] = Object.values(answers).map((answer) => [
    answer.questionId,
    answer.value,
    answer.confidence,
    answer.priority,
    answer.salienceSkipped === true ? true : undefined,
  ]);
  const payload = {
    v: SHARE_VERSION,
    bk: meta?.bankVersion,
    sc: meta?.scoringVersion,
    a: compact,
  };
  return base64UrlEncode(JSON.stringify(payload));
}

export function decodeAnswers(param: string): AnswerMap | null {
  try {
    const decoded = JSON.parse(base64UrlDecode(param));
    return decodePayload(decoded)?.answers ?? null;
  } catch {
    return null;
  }
}

function decodePayload(
  decoded: unknown,
): { answers: AnswerMap; meta: ShareMeta | null } | null {
  const payload = compactAnswersFromPayload(decoded);
  if (!payload) return null;

  const answers: AnswerMap = {};
  for (const entry of payload.compact) {
    if (!Array.isArray(entry)) return null;
    const [questionId, value, confidence, priority, salienceSkipped] = entry;
    if (typeof questionId !== "string" || !isValidAnswerValue(value))
      return null;
    if (
      salienceSkipped !== undefined &&
      salienceSkipped !== null &&
      salienceSkipped !== true
    )
      return null;

    const answer: Answer = { questionId, value };
    if (isValidSalience(confidence)) answer.confidence = confidence;
    if (isValidSalience(priority)) answer.priority = priority;
    if (salienceSkipped === true) answer.salienceSkipped = true;
    answers[questionId] = answer;
  }
  return { answers, meta: payload.meta };
}

export function extractEncodedAnswers(
  input: string,
  param: "r" | "c" = "r",
): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const hashIndex = trimmed.indexOf("#");
  let payload = hashIndex >= 0 ? trimmed.slice(hashIndex + 1) : trimmed;
  if (payload.startsWith("#")) payload = payload.slice(1);

  if (payload.includes("=") || payload.includes("&")) {
    const params = new URLSearchParams(payload);
    return params.get(param);
  }

  return param === "r" ? trimmed : null;
}

export function buildShareUrl(answers: AnswerMap, meta?: ShareMeta): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  return `${base}${HASH_PREFIX}${encodeAnswers(answers, meta)}`;
}

export function buildCompareUrl(
  profile1: AnswerMap,
  profile2: AnswerMap,
  meta?: ShareMeta,
): string {
  const enc1 = encodeAnswers(profile1, meta);
  const enc2 = encodeAnswers(profile2, meta);
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  return `${base}#r=${enc1}&c=${enc2}`;
}

export function readCompareAnswers(expectedMeta?: ShareMeta): AnswerMap | null {
  if (typeof window === "undefined") return null;
  const encoded = extractEncodedAnswers(window.location.hash, "c");
  return encoded ? decodeCompatibleAnswers(encoded, expectedMeta) : null;
}
export function readSharedAnswers(expectedMeta?: ShareMeta): AnswerMap | null {
  if (typeof window === "undefined") return null;
  const encoded = extractEncodedAnswers(window.location.hash, "r");
  return encoded ? decodeCompatibleAnswers(encoded, expectedMeta) : null;
}

export function readSharedResult(expectedMeta?: ShareMeta): {
  answers: AnswerMap | null;
  malformed: boolean;
} {
  if (typeof window === "undefined") return { answers: null, malformed: false };
  const hash = window.location.hash;
  // Only treat as a share attempt when an explicit r= param is present, so arbitrary
  // fragment anchors (e.g. #about) are never flagged as broken share links.
  if (!/[#&?]r=/.test(hash)) return { answers: null, malformed: false };
  const encoded = extractEncodedAnswers(hash, "r");
  if (!encoded) return { answers: null, malformed: false };
  const answers = decodeCompatibleAnswers(encoded, expectedMeta);
  if (answers && Object.keys(answers).length > 0)
    return { answers, malformed: false };
  return { answers: null, malformed: true };
}

export function decodeCompatibleAnswers(
  encoded: string,
  expectedMeta?: ShareMeta,
): AnswerMap | null {
  try {
    const decoded = decodePayload(JSON.parse(base64UrlDecode(encoded)));
    if (!decoded) return null;
    if (expectedMeta && !metadataMatches(decoded.meta, expectedMeta))
      return null;
    return decoded.answers;
  } catch {
    return null;
  }
}

function metadataMatches(
  actual: ShareMeta | null,
  expected: ShareMeta,
): boolean {
  if (!actual) return false;
  return (
    (!expected.bankVersion ||
      (actual.bankVersion !== undefined &&
        isCompatibleQuestionBankVersion(
          actual.bankVersion,
          expected.bankVersion,
        ))) &&
    (!expected.scoringVersion ||
      actual.scoringVersion === expected.scoringVersion)
  );
}

function compactAnswersFromPayload(
  decoded: unknown,
): { compact: unknown[]; meta: ShareMeta | null } | null {
  if (Array.isArray(decoded)) return { compact: decoded, meta: null };
  if (decoded && typeof decoded === "object" && "v" in decoded) {
    const payload = decoded as {
      v?: unknown;
      bk?: unknown;
      sc?: unknown;
      a?: unknown;
    };
    if (payload.v !== 2 && payload.v !== SHARE_VERSION) return null;
    if (!Array.isArray(payload.a)) return null;
    if (payload.bk !== undefined && typeof payload.bk !== "string") return null;
    if (payload.sc !== undefined && typeof payload.sc !== "string") return null;
    return {
      compact: payload.a,
      meta:
        payload.bk || payload.sc
          ? {
              bankVersion: payload.bk as string | undefined,
              scoringVersion: payload.sc as string | undefined,
            }
          : null,
    };
  }
  return null;
}

function isValidAnswerValue(value: unknown): value is Answer["value"] {
  return (
    value === "dont_know" ||
    value === "prefer_not_to_answer" ||
    (typeof value === "number" &&
      Number.isFinite(value) &&
      value >= -3 &&
      value <= 3)
  );
}

function isValidSalience(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
  );
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
