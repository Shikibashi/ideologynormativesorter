import type { RawResponse, ResponseState } from "../../contracts/src/responses";

export const RESEARCH_SCHEMA_VERSION = "research-v2.phase13.1" as const;
export const RESEARCH_PROTOCOL_VERSION = "research-protocol-v2.phase13.1" as const;
export const RESEARCH_CONSENT_VERSION = "consent-v2.phase13.1" as const;
export const RESEARCH_PURPOSE = "instrument-research" as const;
export const RESEARCH_MAX_PAYLOAD_BYTES = 131_072;
export const RESEARCH_RETRY_LIMIT = 3;

export interface ResearchConsent {
  readonly granted: true;
  readonly consentVersion: typeof RESEARCH_CONSENT_VERSION;
  readonly consentedAt: string;
  readonly purpose: typeof RESEARCH_PURPOSE;
  readonly identityLinkage: "none";
}

export interface ResearchSubmissionEnvelope {
  readonly researchSchemaVersion: typeof RESEARCH_SCHEMA_VERSION;
  readonly researchProtocolVersion: typeof RESEARCH_PROTOCOL_VERSION;
  readonly consentVersion: typeof RESEARCH_CONSENT_VERSION;
  readonly submissionId: string;
  readonly contentSchemaVersion: string;
  readonly contentVersion: string;
  readonly contentFingerprint: string;
  readonly scoringVersion: string;
  readonly responseSchemaVersion: string;
  readonly resultSchemaVersion: string;
  readonly consent: ResearchConsent;
  readonly responses: {
    readonly core: readonly RawResponse[];
    readonly specialist: readonly RawResponse[];
    readonly requestedSpecialistModuleIds: readonly string[];
  };
}

export interface ResearchBundleItem {
  readonly id: string;
  readonly role: "core" | "specialist";
  readonly status: "active" | "inactive" | string;
  readonly responseType: "likert5" | "likert7" | "statement-choice";
  readonly scaleMin?: number;
  readonly scaleMax?: number;
  readonly scaleStep?: number;
  readonly moduleId?: string;
  readonly options?: readonly { readonly id: string }[];
}

export interface ResearchBundleModule {
  readonly id: string;
  readonly itemIds: readonly string[];
}

export interface ResearchBundle {
  readonly metadata: {
    readonly contentSchemaVersion: string;
    readonly contentVersion: string;
    readonly contentFingerprint: string;
    readonly scoringVersion: string;
    readonly responseSchemaVersion: string;
    readonly resultSchemaVersion: string;
  };
  readonly items: readonly ResearchBundleItem[];
  readonly specialistModules: readonly ResearchBundleModule[];
}

export interface ResearchAcceptanceRegistry extends ResearchBundle {
  readonly researchSchemaVersion: typeof RESEARCH_SCHEMA_VERSION;
  readonly researchProtocolVersion: typeof RESEARCH_PROTOCOL_VERSION;
  readonly consentVersion: typeof RESEARCH_CONSENT_VERSION;
  readonly maxPayloadBytes: number;
}

export type ResearchResponseState = ResponseState;

export function isResearchSubmissionEnvelope(value: unknown): value is ResearchSubmissionEnvelope {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.researchSchemaVersion === RESEARCH_SCHEMA_VERSION &&
    candidate.researchProtocolVersion === RESEARCH_PROTOCOL_VERSION &&
    candidate.consentVersion === RESEARCH_CONSENT_VERSION &&
    typeof candidate.submissionId === "string" &&
    candidate.consent !== undefined &&
    candidate.responses !== undefined;
}

export function createSubmissionId(randomUuid: () => string = () => crypto.randomUUID()): string {
  const uuid = randomUuid();
  if (!/^[-0-9a-f]{36}$/i.test(uuid)) throw new Error("UUID generator returned an invalid value");
  return `rs_${uuid}`;
}

export function assertConsentTimestamp(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error("Consent timestamp must be an ISO UTC timestamp with milliseconds");
  }
}

export function deepFreeze<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return value;
}

export function freezeResearchSubmission(value: ResearchSubmissionEnvelope): ResearchSubmissionEnvelope {
  return deepFreeze(value);
}

export interface ResearchAssessmentInput {
  readonly responseSchemaVersion: string;
  readonly contentFingerprint: string;
  readonly coreResponses: readonly RawResponse[];
  readonly specialistResponses?: readonly RawResponse[];
  readonly requestedSpecialistModuleIds: readonly string[];
}
