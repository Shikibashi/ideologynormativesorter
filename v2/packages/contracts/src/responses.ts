import {
  ItemId,
  StatementOptionId,
} from "./ids";
import { ResponseSchemaVersion, ContentFingerprint } from "./versions";

export const RESPONSE_STATES = [
  "answered",
  "missing",
  "skipped",
  "abstained",
  "refused",
] as const;
export type ResponseState = (typeof RESPONSE_STATES)[number];

export const LIKERT_RESPONSE_TYPES = ["likert5", "likert7"] as const;
export type LikertResponseType = (typeof LIKERT_RESPONSE_TYPES)[number];
export type StatementChoiceResponseType = "statement-choice";

export const CONFIDENCE_SCALE = [1, 3, 5] as const;
export type ConfidenceValue = (typeof CONFIDENCE_SCALE)[number];
export const PRIORITY_SCALE = [1, 3, 5] as const;
export type PriorityValue = (typeof PRIORITY_SCALE)[number];

export interface ResponseMeta {
  state: ResponseState;
  itemId: ItemId;
}

export interface AnsweredResponse
  extends ResponseMeta {
  state: "answered";
  responseType: LikertResponseType;
  value: number;
  confidence?: ConfidenceValue;
  priority?: PriorityValue;
}

export interface StatementChoiceAnsweredResponse
  extends ResponseMeta {
  state: "answered";
  responseType: StatementChoiceResponseType;
  optionId: StatementOptionId;
  confidence?: ConfidenceValue;
  priority?: PriorityValue;
}

export interface MissingResponse extends ResponseMeta {
  state: "missing";
}
export interface SkippedResponse extends ResponseMeta {
  state: "skipped";
}
export interface AbstainedResponse extends ResponseMeta {
  state: "abstained";
}
export interface RefusedResponse extends ResponseMeta {
  state: "refused";
}

export type RawResponse =
  | AnsweredResponse
  | StatementChoiceAnsweredResponse
  | MissingResponse
  | SkippedResponse
  | AbstainedResponse
  | RefusedResponse;

export interface RawResponseEnvelope {
  responseSchemaVersion: ResponseSchemaVersion;
  contentFingerprint: ContentFingerprint;
  responses: RawResponse[];
}

export function isAnsweredResponse(
  value: RawResponse | NormalizedResponse,
): value is AnsweredResponse | StatementChoiceAnsweredResponse {
  return value.state === "answered";
}

export function isMissingResponse(
  value: RawResponse | NormalizedResponse,
): value is MissingResponse {
  return value.state === "missing";
}

export function isSkippedResponse(
  value: RawResponse | NormalizedResponse,
): value is SkippedResponse | NormalizedSkippedResponse {
  return value.state === "skipped";
}

export function isAbstainedResponse(
  value: RawResponse | NormalizedResponse,
): value is AbstainedResponse {
  return value.state === "abstained";
}

export function isRefusedResponse(
  value: RawResponse | NormalizedResponse,
): value is RefusedResponse {
  return value.state === "refused";
}

export interface NormalizedBase {
  state: ResponseState;
  itemId: ItemId;
}

export interface NormalizedLikertResponse
  extends NormalizedBase {
  state: "answered";
  responseType: LikertResponseType;
  rawValue: number;
  normalizedValue: number;
  reverseScored: boolean;
  confidence?: ConfidenceValue;
  priority?: PriorityValue;
}

export interface NormalizedStatementChoiceResponse
  extends NormalizedBase {
  state: "answered";
  responseType: StatementChoiceResponseType;
  optionId: StatementOptionId;
  confidence?: ConfidenceValue;
  priority?: PriorityValue;
}

export interface NormalizedMissingResponse extends NormalizedBase {
  state: "missing";
}
export interface NormalizedSkippedResponse extends NormalizedBase {
  state: "skipped";
}
export interface NormalizedAbstainedResponse extends NormalizedBase {
  state: "abstained";
}
export interface NormalizedRefusedResponse extends NormalizedBase {
  state: "refused";
}

export type NormalizedResponse =
  | NormalizedLikertResponse
  | NormalizedStatementChoiceResponse
  | NormalizedMissingResponse
  | NormalizedSkippedResponse
  | NormalizedAbstainedResponse
  | NormalizedRefusedResponse;

export interface NormalizedResponseEnvelope {
  responseSchemaVersion: ResponseSchemaVersion;
  contentFingerprint: ContentFingerprint;
  responses: NormalizedResponse[];
}
