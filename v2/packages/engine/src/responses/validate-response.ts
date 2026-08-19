import type {
  ConfidenceValue,
  PriorityValue,
  RawResponse,
  RawResponseEnvelope,
} from "../../../contracts/src/responses";
import type { ItemId } from "../../../contracts/src/ids";
import type { ResponseSchemaVersion } from "../../../contracts/src/versions";
import type { EngineContentIndex } from "../content-index";
import { getEngineItem, isRecordValue } from "../content-index";
import { ScoringError, throwScoringError } from "../errors/scoring-error";
import type { ValidatedAssessmentResponses } from "../types";

const ENVELOPE_KEYS = new Set([
  "responseSchemaVersion",
  "contentFingerprint",
  "responses",
]);
const ANSWERED_LIKERT_KEYS = new Set([
  "state",
  "itemId",
  "responseType",
  "value",
  "confidence",
  "priority",
]);
const ANSWERED_STATEMENT_KEYS = new Set([
  "state",
  "itemId",
  "responseType",
  "optionId",
  "confidence",
  "priority",
]);
const NONANSWER_KEYS = new Set(["state", "itemId"]);

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function assertExactKeys(
  record: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  path: string,
): void {
  const unknownKeys = Object.keys(record)
    .filter((key) => !allowed.has(key))
    .sort();
  if (unknownKeys.length > 0) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      path + " contains unsupported fields",
      { path, details: { unknownKeys } },
    );
  }
}

function readRequiredString(
  record: Record<string, unknown>,
  key: string,
  path: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      path + "." + key + " must be a non-empty string",
      { path: path + "." + key },
    );
  }
  return value;
}

function readSalienceValue(
  record: Record<string, unknown>,
  key: "confidence" | "priority",
  path: string,
): ConfidenceValue | PriorityValue | undefined {
  if (!hasOwn(record, key)) {
    return undefined;
  }
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throwScoringError(
      "NONFINITE_VALUE",
      path + "." + key + " must be a finite number",
      { path: path + "." + key, details: { value } },
    );
  }
  if (value !== 1 && value !== 3 && value !== 5) {
    throwScoringError(
      "INVALID_SALIENCE_VALUE",
      path + "." + key + " must be 1, 3, or 5",
      { path: path + "." + key, details: { value } },
    );
  }
  return value;
}

function extractEnvelope(
  input: unknown,
  index: EngineContentIndex,
): {
  readonly responseSchemaVersion: ResponseSchemaVersion;
  readonly contentFingerprint: string;
  readonly responses: readonly unknown[];
} {
  if (Array.isArray(input)) {
    return {
      responseSchemaVersion: index.bundle.metadata.responseSchemaVersion,
      contentFingerprint: index.bundle.metadata.contentFingerprint,
      responses: input,
    };
  }
  if (!isRecordValue(input)) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      "Assessment responses must be an envelope object or an array of response objects",
    );
  }
  assertExactKeys(input, ENVELOPE_KEYS, "responseEnvelope");
  if (typeof input.responseSchemaVersion !== "string") {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      "responseEnvelope.responseSchemaVersion must be a string",
      { path: "responseEnvelope.responseSchemaVersion" },
    );
  }
  if (typeof input.contentFingerprint !== "string") {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      "responseEnvelope.contentFingerprint must be a string",
      { path: "responseEnvelope.contentFingerprint" },
    );
  }
  if (!Array.isArray(input.responses)) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      "responseEnvelope.responses must be an array",
      { path: "responseEnvelope.responses" },
    );
  }
  return {
    responseSchemaVersion: input.responseSchemaVersion as ResponseSchemaVersion,
    contentFingerprint: input.contentFingerprint,
    responses: input.responses,
  };
}

function normalizeRawResponse(
  candidate: unknown,
  index: number,
  contentIndex: EngineContentIndex,
): RawResponse {
  const path = "responses[" + index + "]";
  if (!isRecordValue(candidate)) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      path + " must be an object",
      { path },
    );
  }
  const itemId = readRequiredString(candidate, "itemId", path) as ItemId;
  const item = getEngineItem(contentIndex, itemId);
  const state = candidate.state;

  if (state !== "answered") {
    if (
      state !== "missing" &&
      state !== "skipped" &&
      state !== "abstained" &&
      state !== "refused"
    ) {
      throwScoringError(
        "UNSUPPORTED_RESPONSE_VARIANT",
        path + ".state is not a supported response state",
        { path: path + ".state", itemId, details: { state } },
      );
    }
    assertExactKeys(candidate, NONANSWER_KEYS, path);
    return {
      state,
      itemId,
    };
  }

  if (candidate.responseType !== item.responseType) {
    if (
      candidate.responseType !== "likert5" &&
      candidate.responseType !== "likert7" &&
      candidate.responseType !== "statement-choice"
    ) {
      throwScoringError(
        "UNSUPPORTED_RESPONSE_VARIANT",
        path + ".responseType is not supported",
        { path: path + ".responseType", itemId },
      );
    }
    throwScoringError(
      "INVALID_RESPONSE_TYPE",
      path + ".responseType does not match item " + itemId,
      {
        path: path + ".responseType",
        itemId,
        details: {
          expected: item.responseType,
          received: candidate.responseType,
        },
      },
    );
  }

  if (candidate.responseType === "statement-choice") {
    assertExactKeys(candidate, ANSWERED_STATEMENT_KEYS, path);
    const optionId = readRequiredString(candidate, "optionId", path);
    const options = item.raw.options;
    if (
      !Array.isArray(options) ||
      !options.some((option) => isRecordValue(option) && option.id === optionId)
    ) {
      throwScoringError(
        "UNKNOWN_STATEMENT_OPTION",
        path + ".optionId is not declared by item " + itemId,
        { path: path + ".optionId", itemId, details: { optionId } },
      );
    }
    const confidence = readSalienceValue(candidate, "confidence", path);
    const priority = readSalienceValue(candidate, "priority", path);
    return {
      state: "answered",
      itemId,
      responseType: "statement-choice",
      optionId,
      ...(confidence === undefined ? {} : { confidence }),
      ...(priority === undefined ? {} : { priority }),
    } as RawResponse;
  }

  assertExactKeys(candidate, ANSWERED_LIKERT_KEYS, path);
  const value = candidate.value;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throwScoringError(
      "NONFINITE_VALUE",
      path + ".value must be a finite number",
      { path: path + ".value", itemId, details: { value } },
    );
  }
  const maximum = candidate.responseType === "likert5" ? 2 : 3;
  if (!Number.isInteger(value) || value < -maximum || value > maximum) {
    throwScoringError(
      "INVALID_LIKERT_VALUE",
      path + ".value is outside the legal " + candidate.responseType + " scale",
      {
        path: path + ".value",
        itemId,
        details: { minimum: -maximum, maximum, value },
      },
    );
  }
  const confidence = readSalienceValue(candidate, "confidence", path);
  const priority = readSalienceValue(candidate, "priority", path);
  return {
    state: "answered",
    itemId,
    responseType: candidate.responseType,
    value,
    ...(confidence === undefined ? {} : { confidence }),
    ...(priority === undefined ? {} : { priority }),
  } as RawResponse;
}

export function validateAssessmentResponses(
  input: RawResponseEnvelope | readonly unknown[] | unknown,
  contentIndex: EngineContentIndex,
): ValidatedAssessmentResponses {
  const envelope = extractEnvelope(input, contentIndex);
  if (
    envelope.responseSchemaVersion !==
    contentIndex.bundle.metadata.responseSchemaVersion
  ) {
    throwScoringError(
      "RESPONSE_SCHEMA_VERSION_MISMATCH",
      "Response schema version does not match canonical content",
      {
        path: "responseEnvelope.responseSchemaVersion",
        details: {
          expected: contentIndex.bundle.metadata.responseSchemaVersion,
          received: envelope.responseSchemaVersion,
        },
      },
    );
  }
  if (
    envelope.contentFingerprint !==
    contentIndex.bundle.metadata.contentFingerprint
  ) {
    throwScoringError(
      "CONTENT_FINGERPRINT_MISMATCH",
      "Response content fingerprint does not match canonical content",
      {
        path: "responseEnvelope.contentFingerprint",
        details: {
          expected: contentIndex.bundle.metadata.contentFingerprint,
          received: envelope.contentFingerprint,
        },
      },
    );
  }

  const responses = envelope.responses.map((candidate, responseIndex) =>
    normalizeRawResponse(candidate, responseIndex, contentIndex),
  );
  const duplicateItemIds = [
    ...new Set(
      responses
        .map((response) => response.itemId)
        .filter((itemId, responseIndex, all) => all.indexOf(itemId) !== responseIndex),
    ),
  ].sort();
  if (duplicateItemIds.length > 0) {
    throw new ScoringError([
      {
        code: "DUPLICATE_RESPONSE",
        message: "Each item may appear at most once in an assessment response set",
        path: "responses",
        details: { duplicateItemIds },
      },
    ]);
  }

  const sortedResponses = responses.sort((left, right) =>
    left.itemId.localeCompare(right.itemId),
  );
  return Object.freeze({
    responseSchemaVersion: envelope.responseSchemaVersion,
    contentFingerprint: envelope.contentFingerprint,
    responses: Object.freeze(sortedResponses),
  });
}
