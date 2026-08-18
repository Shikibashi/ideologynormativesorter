import type { ResearchSubmission, ResearchSubmissionStatus } from "./index";

export const PENDING_RESEARCH_PREFIX =
  "political-judgment-pending-research-record-v2:";
export const PENDING_RESEARCH_LEGACY_KEY =
  "political-judgment-pending-research-record-v1";
export const PENDING_RESEARCH_MAX_COUNT = 32;
export const PENDING_RESEARCH_MAX_RECORD_BYTES = 2 * 1024 * 1024;
export const PENDING_RESEARCH_MAX_AGGREGATE_BYTES = 8 * 1024 * 1024;
export const PENDING_RESEARCH_MAX_TOTAL_BYTES =
  PENDING_RESEARCH_MAX_AGGREGATE_BYTES;
export const PENDING_RESEARCH_MAX_BYTES = PENDING_RESEARCH_MAX_RECORD_BYTES;
export const PENDING_RESEARCH_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const PENDING_RESEARCH_KEY_PREFIX = PENDING_RESEARCH_PREFIX;
export const PENDING_RECORD_MAX_COUNT = PENDING_RESEARCH_MAX_COUNT;
export const PENDING_RECORD_MAX_BYTES = PENDING_RESEARCH_MAX_RECORD_BYTES;
export const PENDING_RECORD_MAX_TOTAL_BYTES =
  PENDING_RESEARCH_MAX_AGGREGATE_BYTES;
export const PENDING_RECORD_MAX_AGGREGATE_BYTES =
  PENDING_RESEARCH_MAX_AGGREGATE_BYTES;
export const PENDING_RECORD_MAX_AGE_MS = PENDING_RESEARCH_MAX_AGE_MS;
export function pendingResearchKey(submissionId: string): string {
  return `${PENDING_RESEARCH_PREFIX}${submissionId}`;
}
export const pendingSubmissionKey = pendingResearchKey;

export type PendingSubmissionState =
  | "pending"
  | "retryable"
  | "export-only"
  | "failed"
  | "conflict"
  | "submitted"
  | "retention-expired";

export interface PendingResearchSubmission {
  version: 2;
  submissionId: string;
  payload: ResearchSubmission;
  payloadSha256: string;
  recordSha256?: string;
  route: string;
  cohort: string;
  state: PendingSubmissionState;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  lastAttemptAt?: string;
  lastError?: string;
  retryAfterAt?: string;
}

export type PendingSaveResult =
  | { saved: true; record: PendingResearchSubmission; existing: boolean }
  | { saved: false; reason: string; record?: PendingResearchSubmission };

export interface PendingStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  readonly length: number;
  key(index: number): string | null;
}

export interface PendingSubmissionOptions {
  storage?: PendingStorage;
  now?: () => number;
  route?: string;
  cohort?: string;
  skipMigration?: boolean;
}

export interface PendingSubmitResult {
  status: ResearchSubmissionStatus;
  state: PendingSubmissionState;
  persisted: boolean;
  pending: PendingResearchSubmission | null;
  deduplicated?: boolean;
  retryAfterMs?: number;
}

function storageOrDefault(storage?: PendingStorage): PendingStorage | null {
  if (storage) return storage;
  try {
    return globalThis.localStorage as PendingStorage;
  } catch {
    return null;
  }
}

function nowOrDefault(now?: () => number): number {
  return now ? now() : Date.now();
}

function isoNow(now: number): string {
  try {
    return new Date(now).toISOString();
  } catch {
    return "";
  }
}

function keyForSubmission(submissionId: string): string {
  return `${PENDING_RESEARCH_PREFIX}${submissionId}`;
}

function byteLength(value: string): number {
  return typeof TextEncoder === "undefined"
    ? value.length
    : new TextEncoder().encode(value).byteLength;
}
function validTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function validAnswerMap(
  value: unknown,
  questionIds?: ReadonlySet<string>,
): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(([questionId, answer]) => {
    if (questionIds && !questionIds.has(questionId)) return false;
    if (!answer || typeof answer !== "object") return false;
    const candidate = answer as {
      questionId?: unknown;
      value?: unknown;
      confidence?: unknown;
      priority?: unknown;
      salienceSkipped?: unknown;
    };
    const valueValid =
      (typeof candidate.value === "number" &&
        Number.isFinite(candidate.value)) ||
      candidate.value === "dont_know" ||
      candidate.value === "prefer_not_to_answer";
    const ratingValid = (rating: unknown) =>
      rating === undefined ||
      (typeof rating === "number" &&
        Number.isInteger(rating) &&
        rating >= 1 &&
        rating <= 5);
    return (
      candidate.questionId === questionId &&
      valueValid &&
      ratingValid(candidate.confidence) &&
      ratingValid(candidate.priority) &&
      (candidate.salienceSkipped === undefined ||
        candidate.salienceSkipped === true)
    );
  });
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .filter((key) => object[key] !== undefined)
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

// Synchronous SHA-256 keeps persistence usable in browsers and test storage
// implementations without relying on an asynchronous crypto boundary.
function sha256(value: string): string {
  const words = new Uint32Array(64);
  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ]);
  const bytes = new TextEncoder().encode(value);
  const bitLength = bytes.length * 8;
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  const constants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const rotr = (word: number, bits: number) =>
    (word >>> bits) | (word << (32 - bits));
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let index = 0; index < 16; index += 1)
      words[index] = view.getUint32(offset + index * 4);
    for (let index = 16; index < 64; index += 1) {
      const a = words[index - 15];
      const b = words[index - 2];
      const s0 = rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3);
      const s1 = rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temporary1 =
        (h + s1 + choice + constants[index] + words[index]) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (s0 + majority) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temporary1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temporary1 + temporary2) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }
  return Array.from(hash, (word) => word.toString(16).padStart(8, "0")).join(
    "",
  );
}

export function pendingPayload(submission: ResearchSubmission): string {
  return canonicalize(submission);
}

export function pendingPayloadSha256(submission: ResearchSubmission): string {
  return sha256(pendingPayload(submission));
}

function recordSha256(
  payloadSha256: string,
  route: string,
  cohort: string,
): string {
  return sha256(canonicalize({ cohort, payloadSha256, route }));
}
function validState(value: unknown): value is PendingSubmissionState {
  return (
    value === "pending" ||
    value === "retryable" ||
    value === "export-only" ||
    value === "failed" ||
    value === "conflict" ||
    value === "submitted" ||
    value === "retention-expired"
  );
}

function isSubmission(value: unknown): value is ResearchSubmission {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ResearchSubmission>;
  if (
    typeof candidate.submissionId !== "string" ||
    candidate.submissionId.trim().length === 0 ||
    typeof candidate.studyId !== "string" ||
    candidate.studyId.trim().length === 0 ||
    (candidate.recordType !== "core" &&
      candidate.recordType !== "specialist" &&
      candidate.recordType !== "specialist-disposition")
  )
    return false;

  for (const key of ["startedAt", "completedAt", "submittedAt"] as const) {
    if (key in candidate && !validTimestamp(candidate[key])) return false;
  }

  if ("itemMap" in candidate) {
    if (!Array.isArray(candidate.itemMap)) return false;
    const questionIds = new Set<string>();
    for (const item of candidate.itemMap) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as { questionId?: unknown }).questionId !== "string" ||
        (item as { questionId: string }).questionId.length === 0
      )
        return false;
      const questionId = (item as { questionId: string }).questionId;
      if (questionIds.has(questionId)) return false;
      questionIds.add(questionId);
    }
    if (
      (candidate.recordType === "core" ||
        candidate.recordType === "specialist") &&
      !validAnswerMap(candidate.answers, questionIds)
    )
      return false;
    if (
      "answers" in candidate &&
      !validAnswerMap(candidate.answers, questionIds)
    )
      return false;
  } else if (
    candidate.recordType === "core" ||
    candidate.recordType === "specialist"
  ) {
    return false;
  } else if ("answers" in candidate && !validAnswerMap(candidate.answers)) {
    return false;
  }
  return true;
}

function parseRecord(value: unknown): PendingResearchSubmission | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PendingResearchSubmission>;
  const attempts = candidate.attempts;
  if (
    candidate.version !== 2 ||
    typeof candidate.submissionId !== "string" ||
    !isSubmission(candidate.payload) ||
    candidate.payload.submissionId !== candidate.submissionId ||
    typeof candidate.payloadSha256 !== "string" ||
    !/^[a-f0-9]{64}$/i.test(candidate.payloadSha256) ||
    typeof candidate.recordSha256 !== "string" ||
    !/^[a-f0-9]{64}$/i.test(candidate.recordSha256) ||
    typeof candidate.route !== "string" ||
    typeof candidate.cohort !== "string" ||
    !validState(candidate.state) ||
    typeof attempts !== "number" ||
    !Number.isSafeInteger(attempts) ||
    attempts < 0 ||
    !validTimestamp(candidate.createdAt) ||
    !validTimestamp(candidate.updatedAt)
  )
    return null;
  if (candidate.payloadSha256 !== pendingPayloadSha256(candidate.payload))
    return null;
  if (
    candidate.recordSha256 !== undefined &&
    (typeof candidate.recordSha256 !== "string" ||
      !/^[a-f0-9]{64}$/i.test(candidate.recordSha256) ||
      candidate.recordSha256 !==
        recordSha256(
          candidate.payloadSha256,
          candidate.route,
          candidate.cohort,
        ))
  )
    return null;
  if (
    candidate.lastAttemptAt !== undefined &&
    !validTimestamp(candidate.lastAttemptAt)
  )
    return null;
  if (
    candidate.lastError !== undefined &&
    typeof candidate.lastError !== "string"
  )
    return null;
  if (
    candidate.retryAfterAt !== undefined &&
    !validTimestamp(candidate.retryAfterAt)
  )
    return null;
  if (candidate.state === "submitted" && candidate.route.trim().length === 0)
    return null;
  return candidate as PendingResearchSubmission;
}

function readRecord(
  storage: PendingStorage,
  submissionId: string,
): PendingResearchSubmission | null {
  try {
    const raw = storage.getItem(keyForSubmission(submissionId));
    if (!raw || byteLength(raw) > PENDING_RESEARCH_MAX_RECORD_BYTES)
      return null;
    return parseRecord(JSON.parse(raw));
  } catch {
    return null;
  }
}

function migrateLegacy(storage: PendingStorage, now: number): void {
  let raw: string | null;
  try {
    raw = storage.getItem(PENDING_RESEARCH_LEGACY_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  let legacy: {
    submission?: ResearchSubmission;
    status?: ResearchSubmissionStatus;
  };
  try {
    legacy = JSON.parse(raw) as typeof legacy;
  } catch {
    return;
  }
  if (!legacy.submission || !isSubmission(legacy.submission)) return;
  if (
    legacy.status &&
    legacy.status.status !== "submitted" &&
    legacy.status.status !== "export-only" &&
    legacy.status.status !== "failed"
  )
    return;
  if (
    legacy.status?.status === "submitted" &&
    (typeof legacy.status.endpoint !== "string" ||
      legacy.status.endpoint.trim().length === 0)
  )
    return;
  if (
    legacy.status?.status === "failed" &&
    typeof legacy.status.reason !== "string"
  )
    return;
  const route =
    legacy.status?.status === "submitted" ? legacy.status.endpoint : "";
  const result = savePendingResearchSubmission(
    legacy.submission,
    route,
    legacy.submission.studyId,
    { storage, now: () => now, skipMigration: true },
  );
  if (result.saved) {
    if (legacy.status?.status === "export-only") {
      transitionPendingResearchSubmission(
        legacy.submission.submissionId,
        "export-only",
        { storage, now: () => now, skipMigration: true },
      );
    } else if (legacy.status?.status === "failed") {
      transitionPendingResearchSubmission(
        legacy.submission.submissionId,
        "failed",
        {
          storage,
          now: () => now,
          skipMigration: true,
          error: legacy.status.reason,
        },
      );
    } else if (legacy.status?.status === "submitted") {
      transitionPendingResearchSubmission(
        legacy.submission.submissionId,
        "submitted",
        { storage, now: () => now, skipMigration: true },
      );
    }
    try {
      storage.removeItem(PENDING_RESEARCH_LEGACY_KEY);
    } catch {
      // Keep the legacy value when removal is unavailable; the v2 value is
      // already durable and the migration remains idempotent.
    }
  }
}

function enumerateRaw(storage: PendingStorage): PendingResearchSubmission[] {
  const found: PendingResearchSubmission[] = [];
  let keys: string[] = [];
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(PENDING_RESEARCH_PREFIX)) keys.push(key);
    }
  } catch {
    return [];
  }
  keys = [...new Set(keys)].sort();
  for (const key of keys) {
    try {
      const raw = storage.getItem(key);
      if (!raw || byteLength(raw) > PENDING_RESEARCH_MAX_RECORD_BYTES) continue;
      const parsed = parseRecord(JSON.parse(raw));
      if (parsed && key === keyForSubmission(parsed.submissionId))
        found.push(parsed);
    } catch {
      // A malformed or unreadable entry is not allowed to overwrite another
      // entry, and remains untouched for a later recovery attempt.
    }
  }
  return found;
}

function storedRecordBytes(
  storage: PendingStorage,
  record: PendingResearchSubmission,
): number {
  try {
    const raw = storage.getItem(keyForSubmission(record.submissionId));
    if (raw) return byteLength(raw);
  } catch {
    // Fall through to the canonical representation when a reread is unavailable.
  }
  return byteLength(JSON.stringify(record));
}

function markRetentionExpired(
  storage: PendingStorage,
  records: PendingResearchSubmission[],
  now: number,
): PendingResearchSubmission[] {
  return records.map((record) => {
    if (
      record.state === "retention-expired" ||
      now - Date.parse(record.createdAt) <= PENDING_RESEARCH_MAX_AGE_MS
    )
      return record;
    const timestamp = isoNow(now);
    const updated: PendingResearchSubmission = {
      ...record,
      state: "retention-expired",
      updatedAt: validTimestamp(timestamp) ? timestamp : record.updatedAt,
    };
    try {
      const serialized = JSON.stringify(updated);
      if (byteLength(serialized) > PENDING_RESEARCH_MAX_RECORD_BYTES)
        return record;
      storage.setItem(keyForSubmission(record.submissionId), serialized);
      return updated;
    } catch {
      return record;
    }
  });
}

export function listPendingResearchSubmissions(
  options: PendingSubmissionOptions = {},
): PendingResearchSubmission[] {
  const storage = storageOrDefault(options.storage);
  if (!storage) return [];
  const now = nowOrDefault(options.now);
  if (!Number.isFinite(now)) return [];
  migrateLegacy(storage, now);
  return markRetentionExpired(storage, enumerateRaw(storage), now).sort(
    (left, right) => left.submissionId.localeCompare(right.submissionId),
  );
}

export function loadPendingResearchSubmission(
  submissionId: string,
  options: PendingSubmissionOptions = {},
): PendingResearchSubmission | null {
  const storage = storageOrDefault(options.storage);
  if (!storage) return null;
  const now = nowOrDefault(options.now);
  if (!Number.isFinite(now)) return null;
  if (!options.skipMigration) migrateLegacy(storage, now);
  const record = readRecord(storage, submissionId);
  if (!record) return null;
  if (
    (options.route !== undefined && options.route !== record.route) ||
    (options.cohort !== undefined && options.cohort !== record.cohort)
  )
    return null;
  return markRetentionExpired(storage, [record], now)[0] ?? null;
}

export function savePendingResearchSubmission(
  submission: ResearchSubmission,
  route = "",
  cohort = submission.studyId,
  options: PendingSubmissionOptions & { skipMigration?: boolean } = {},
): PendingSaveResult {
  const storage = storageOrDefault(options.storage);
  if (!storage)
    return { saved: false, reason: "Browser storage is unavailable." };
  if (!isSubmission(submission)) {
    return {
      saved: false,
      reason: "The completed research record is invalid.",
    };
  }
  if (typeof route !== "string" || typeof cohort !== "string") {
    return { saved: false, reason: "The pending research context is invalid." };
  }
  const now = nowOrDefault(options.now);
  if (!Number.isFinite(now)) {
    return {
      saved: false,
      reason: "The pending research timestamp is invalid.",
    };
  }
  if (!options.skipMigration) migrateLegacy(storage, now);
  const payload = pendingPayload(submission);
  if (byteLength(payload) > PENDING_RESEARCH_MAX_RECORD_BYTES) {
    return {
      saved: false,
      reason: "The completed research record is too large to save.",
    };
  }
  let existingRaw: string | null;
  try {
    existingRaw = storage.getItem(keyForSubmission(submission.submissionId));
  } catch {
    return {
      saved: false,
      reason:
        "The existing pending research record could not be read; it was preserved.",
    };
  }
  let existing: PendingResearchSubmission | null = null;
  if (existingRaw !== null) {
    try {
      existing = parseRecord(JSON.parse(existingRaw));
    } catch {
      existing = null;
    }
  }
  if (existingRaw !== null && !existing) {
    return {
      saved: false,
      reason:
        "A pending submission ID collision was detected; the existing record was preserved.",
    };
  }
  if (
    existing &&
    now - Date.parse(existing.createdAt) > PENDING_RESEARCH_MAX_AGE_MS
  ) {
    existing = markRetentionExpired(storage, [existing], now)[0] ?? existing;
  }
  if (existing) {
    if (existing.state === "retention-expired") {
      return {
        saved: false,
        reason: "The pending research record has reached its retention limit.",
        record: existing,
      };
    }
    const immutableMatches =
      existing.payloadSha256 === sha256(payload) &&
      pendingPayload(existing.payload) === payload &&
      existing.route === route &&
      existing.cohort === cohort &&
      existing.submissionId === submission.submissionId;
    if (!immutableMatches)
      return {
        saved: false,
        reason:
          "A pending submission ID collision was detected; the existing record was preserved.",
        record: existing,
      };
    return { saved: true, record: existing, existing: true };
  }
  const records = markRetentionExpired(storage, enumerateRaw(storage), now);
  if (records.length >= PENDING_RESEARCH_MAX_COUNT) {
    return {
      saved: false,
      reason: "Too many pending research records are stored in this browser.",
    };
  }
  const timestamp = isoNow(now);
  if (!validTimestamp(timestamp)) {
    return {
      saved: false,
      reason: "The pending research timestamp is invalid.",
    };
  }
  const payloadSha256 = sha256(payload);
  const record: PendingResearchSubmission = {
    version: 2,
    submissionId: submission.submissionId,
    payload: submission,
    payloadSha256,
    recordSha256: recordSha256(payloadSha256, route, cohort),
    route,
    cohort,
    state: "pending",
    attempts: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const serializedRecord = JSON.stringify(record);
  const serializedBytes = byteLength(serializedRecord);
  if (serializedBytes > PENDING_RESEARCH_MAX_RECORD_BYTES) {
    return {
      saved: false,
      reason: "The completed research record is too large to save.",
    };
  }
  const aggregateBytes = records.reduce(
    (total, candidate) => total + storedRecordBytes(storage, candidate),
    0,
  );
  if (aggregateBytes + serializedBytes > PENDING_RESEARCH_MAX_AGGREGATE_BYTES) {
    return {
      saved: false,
      reason: "Pending research records exceed the browser storage bound.",
    };
  }
  try {
    storage.setItem(
      keyForSubmission(submission.submissionId),
      serializedRecord,
    );
    return { saved: true, record, existing: false };
  } catch {
    return {
      saved: false,
      reason:
        "The completed research record could not be saved in this browser.",
    };
  }
}

export function transitionPendingResearchSubmission(
  submissionId: string,
  state: PendingSubmissionState,
  options: PendingSubmissionOptions & {
    error?: string;
    retryAfterMs?: number;
    incrementAttempt?: boolean;
  } = {},
): PendingSaveResult {
  const storage = storageOrDefault(options.storage);
  if (!storage)
    return { saved: false, reason: "Browser storage is unavailable." };
  if (!validState(state)) {
    return { saved: false, reason: "The pending research state is invalid." };
  }
  if (options.error !== undefined && typeof options.error !== "string") {
    return { saved: false, reason: "The pending research error is invalid." };
  }
  if (
    options.retryAfterMs !== undefined &&
    !Number.isFinite(options.retryAfterMs)
  ) {
    return {
      saved: false,
      reason: "The pending research retry timestamp is invalid.",
    };
  }
  const existing = loadPendingResearchSubmission(submissionId, options);
  if (!existing)
    return {
      saved: false,
      reason: "The pending research record no longer exists.",
    };
  if (existing.state === "retention-expired" && state !== "retention-expired") {
    return {
      saved: false,
      reason: "The pending research record has reached its retention limit.",
      record: existing,
    };
  }
  if (state === "submitted" && existing.route.trim().length === 0) {
    return {
      saved: false,
      reason: "A submitted pending record must include its endpoint.",
      record: existing,
    };
  }
  const now = nowOrDefault(options.now);
  if (!Number.isFinite(now)) {
    return {
      saved: false,
      reason: "The pending research timestamp is invalid.",
    };
  }
  const nextAttempts =
    existing.attempts + (options.incrementAttempt === true ? 1 : 0);
  if (!Number.isSafeInteger(nextAttempts)) {
    return {
      saved: false,
      reason: "The pending research attempt count is invalid.",
      record: existing,
    };
  }
  const timestamp = isoNow(now);
  const lastAttemptAt =
    options.incrementAttempt === true ? timestamp : existing.lastAttemptAt;
  const retryAfterAt =
    options.retryAfterMs === undefined
      ? existing.retryAfterAt
      : options.retryAfterMs < 0
        ? undefined
        : isoNow(now + options.retryAfterMs);
  if (
    !validTimestamp(timestamp) ||
    (lastAttemptAt !== undefined && !validTimestamp(lastAttemptAt)) ||
    (retryAfterAt !== undefined && !validTimestamp(retryAfterAt))
  ) {
    return {
      saved: false,
      reason: "The pending research timestamp is invalid.",
      record: existing,
    };
  }
  const updated: PendingResearchSubmission = {
    ...existing,
    state,
    attempts: nextAttempts,
    updatedAt: timestamp,
    lastAttemptAt,
    lastError:
      options.error ?? (state === "pending" ? undefined : existing.lastError),
    retryAfterAt,
  };
  const serializedUpdated = JSON.stringify(updated);
  const updatedBytes = byteLength(serializedUpdated);
  if (updatedBytes > PENDING_RESEARCH_MAX_RECORD_BYTES) {
    return {
      saved: false,
      reason: "The completed research record is too large to save.",
      record: existing,
    };
  }
  const aggregateBytes = enumerateRaw(storage).reduce(
    (total, record) => total + storedRecordBytes(storage, record),
    0,
  );
  const existingBytes = storedRecordBytes(storage, existing);
  if (
    aggregateBytes - existingBytes + updatedBytes >
    PENDING_RESEARCH_MAX_AGGREGATE_BYTES
  ) {
    return {
      saved: false,
      reason: "Pending research records exceed the browser storage bound.",
      record: existing,
    };
  }
  try {
    storage.setItem(keyForSubmission(submissionId), serializedUpdated);
    return { saved: true, record: updated, existing: true };
  } catch {
    return {
      saved: false,
      reason:
        "The pending research state could not be updated in this browser.",
      record: existing,
    };
  }
}

export function deletePendingResearchSubmission(
  submissionId: string,
  options: PendingSubmissionOptions = {},
): boolean {
  const storage = storageOrDefault(options.storage);
  if (!storage) return false;
  try {
    storage.removeItem(keyForSubmission(submissionId));
    return true;
  } catch {
    return false;
  }
}

function resolveEndpoint(endpoint: string | undefined): {
  value?: string;
  error?: string;
} {
  if (!endpoint?.trim()) return {};
  let resolved: URL;
  try {
    resolved = new URL(
      endpoint,
      globalThis.location?.href ?? "http://localhost/",
    );
  } catch {
    return { error: "The website collection endpoint is not a valid URL." };
  }
  const localDevelopment = ["localhost", "127.0.0.1", "[::1]"].includes(
    resolved.hostname,
  );
  if (resolved.protocol !== "https:" && !localDevelopment)
    return { error: "The website collection endpoint must use HTTPS." };
  return { value: resolved.toString() };
}

function responseRetryAfter(
  response: Response,
  now: number,
): number | undefined {
  const value = response.headers.get("retry-after");
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  if (!Number.isFinite(date)) return undefined;
  return Math.max(0, date - now);
}

function reasonForResponse(response: Response): string {
  return `The website could not receive the contribution (HTTP ${response.status}).`;
}

export async function submitPendingResearchSubmission(
  submission: ResearchSubmission,
  endpoint: string | undefined,
  send: typeof fetch = fetch,
  options: PendingSubmissionOptions = {},
): Promise<PendingSubmitResult> {
  const resolved = resolveEndpoint(endpoint);
  const route = resolved.value ?? endpoint?.trim() ?? "";
  const saved = savePendingResearchSubmission(
    submission,
    route,
    options.cohort ?? submission.studyId,
    options,
  );
  if (!saved.saved) {
    return {
      status: { status: "failed", reason: saved.reason },
      state: "pending",
      persisted: false,
      pending: saved.record ?? null,
    };
  }
  let record = saved.record;
  if (!resolved.value) {
    const transition = transitionPendingResearchSubmission(
      submission.submissionId,
      resolved.error ? "failed" : "export-only",
      {
        ...options,
        error: resolved.error,
      },
    );
    record = transition.saved ? transition.record : record;
    return {
      status: resolved.error
        ? { status: "failed", reason: resolved.error }
        : { status: "export-only" },
      state: resolved.error ? "failed" : "export-only",
      persisted: true,
      pending: record,
    };
  }

  const started = transitionPendingResearchSubmission(
    submission.submissionId,
    "pending",
    { ...options, incrementAttempt: true },
  );
  record = started.saved ? started.record : record;
  if (!started.saved) {
    return {
      status: { status: "failed", reason: started.reason },
      state: "pending",
      persisted: true,
      pending: record,
    };
  }

  try {
    const response = await send(resolved.value, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: pendingPayload(submission),
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (response.status >= 200 && response.status < 300) {
      const body = await response
        .clone()
        .json()
        .catch(() => ({}));
      const deduplicated =
        response.status === 202 && body?.deduplicated === true;
      const finalized = transitionPendingResearchSubmission(
        submission.submissionId,
        "submitted",
        options,
      );
      if (!finalized.saved) {
        return {
          status: { status: "failed", reason: finalized.reason },
          state: record.state,
          persisted: true,
          pending: record,
          deduplicated,
        };
      }
      record = finalized.record;
      const deleted = deletePendingResearchSubmission(
        submission.submissionId,
        options,
      );
      return {
        status: { status: "submitted", endpoint: resolved.value },
        state: "submitted",
        persisted: !deleted,
        pending: deleted ? null : record,
        deduplicated,
      };
    }
    const retryAfterMs = responseRetryAfter(
      response,
      nowOrDefault(options.now),
    );
    const retryable =
      response.status === 429 ||
      (response.status >= 500 && response.status <= 599);
    const state: PendingSubmissionState = retryable
      ? "retryable"
      : response.status === 409
        ? "conflict"
        : "failed";
    const transitioned = transitionPendingResearchSubmission(
      submission.submissionId,
      state,
      {
        ...options,
        error: reasonForResponse(response),
        retryAfterMs: retryAfterMs ?? -1,
      },
    );
    record = transitioned.saved ? transitioned.record : record;
    return {
      status: { status: "failed", reason: reasonForResponse(response) },
      state,
      persisted: true,
      pending: record,
      retryAfterMs,
    };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown network error.";
    const transitioned = transitionPendingResearchSubmission(
      submission.submissionId,
      "retryable",
      { ...options, error: reason, retryAfterMs: -1 },
    );
    record = transitioned.saved ? transitioned.record : record;
    return {
      status: { status: "failed", reason },
      state: "retryable",
      persisted: true,
      pending: record,
    };
  }
}

export async function retryPendingResearchSubmission(
  submissionId: string,
  send: typeof fetch = fetch,
  options: PendingSubmissionOptions = {},
): Promise<PendingSubmitResult | null> {
  const record = loadPendingResearchSubmission(submissionId, options);
  if (
    !record ||
    (record.state !== "pending" &&
      record.state !== "retryable" &&
      record.state !== "failed" &&
      record.state !== "conflict")
  )
    return null;
  const now = nowOrDefault(options.now);
  if (!Number.isFinite(now)) return null;
  if (record.retryAfterAt !== undefined) {
    const retryAfterMs = Date.parse(record.retryAfterAt) - now;
    if (retryAfterMs > 0) {
      return {
        status: {
          status: "failed",
          reason: "The pending research retry is not available yet.",
        },
        state: record.state,
        persisted: true,
        pending: record,
        retryAfterMs,
      };
    }
  }
  return submitPendingResearchSubmission(record.payload, record.route, send, {
    ...options,
    cohort: record.cohort,
  });
}
export const enumeratePendingResearchSubmissions =
  listPendingResearchSubmissions;
export const loadPendingSubmission = loadPendingResearchSubmission;
export const savePendingSubmission = savePendingResearchSubmission;
export const deletePendingSubmission = deletePendingResearchSubmission;
export const retryPendingSubmission = retryPendingResearchSubmission;
export const persistPendingResearchSubmission = submitPendingResearchSubmission;
export const cleanupPendingResearchSubmissions = listPendingResearchSubmissions;

export function clearAllPendingResearchSubmissions(
  options: PendingSubmissionOptions = {},
): boolean {
  const storage = storageOrDefault(options.storage);
  if (!storage) return false;
  const records = listPendingResearchSubmissions(options);
  let success = true;
  for (const record of records) {
    if (!deletePendingResearchSubmission(record.submissionId, options))
      success = false;
  }
  try {
    storage.removeItem(PENDING_RESEARCH_LEGACY_KEY);
  } catch {
    success = false;
  }
  return success;
}
