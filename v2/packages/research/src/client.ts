import type { AssessmentInput } from "../../contracts/src/results";
import type { RawResponse } from "../../contracts/src/responses";
import {
  assertConsentTimestamp,
  createSubmissionId,
  deepFreeze,
  RESEARCH_CONSENT_VERSION,
  RESEARCH_MAX_PAYLOAD_BYTES,
  RESEARCH_PROTOCOL_VERSION,
  RESEARCH_PURPOSE,
  RESEARCH_RETRY_LIMIT,
  RESEARCH_SCHEMA_VERSION,
  type ResearchAssessmentInput,
  type ResearchBundle,
  type ResearchBundleItem,
  type ResearchSubmissionEnvelope,
} from "./contract";
import { canonicalize } from "./canonical-json";

export interface CreateResearchSubmissionOptions {
  readonly consentedAt?: string;
  readonly submissionId?: string;
}

export function createResearchSubmission(
  input: ResearchAssessmentInput,
  bundle: ResearchBundle,
  options: CreateResearchSubmissionOptions = {},
): ResearchSubmissionEnvelope {
  const consentedAt = options.consentedAt ?? new Date().toISOString();
  assertConsentTimestamp(consentedAt);
  const requestedModules = [...input.requestedSpecialistModuleIds].sort();
  const coreItems = bundle.items.filter((item) => item.role === "core" && item.status === "active");
  const selectedModuleIds = new Set(requestedModules);
  const specialistItems = bundle.items.filter((item) => item.role === "specialist" && item.status === "active" && item.moduleId && selectedModuleIds.has(item.moduleId));
  const responseById = new Map([...input.coreResponses, ...(input.specialistResponses ?? [])].map((response) => [response.itemId, response]));
  const envelope: ResearchSubmissionEnvelope = {
    researchSchemaVersion: RESEARCH_SCHEMA_VERSION,
    researchProtocolVersion: RESEARCH_PROTOCOL_VERSION,
    consentVersion: RESEARCH_CONSENT_VERSION,
    submissionId: options.submissionId ?? createSubmissionId(),
    contentSchemaVersion: bundle.metadata.contentSchemaVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    scoringVersion: bundle.metadata.scoringVersion,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    resultSchemaVersion: bundle.metadata.resultSchemaVersion,
    consent: {
      granted: true,
      consentVersion: RESEARCH_CONSENT_VERSION,
      consentedAt,
      purpose: RESEARCH_PURPOSE,
      identityLinkage: "none",
    },
    responses: {
      core: completeResponses(coreItems, responseById),
      specialist: completeResponses(specialistItems, responseById),
      requestedSpecialistModuleIds: requestedModules,
    },
  };
  const bytes = new TextEncoder().encode(canonicalize(envelope)).byteLength;
  if (bytes > RESEARCH_MAX_PAYLOAD_BYTES) throw new Error("Research submission exceeds the client payload limit");
  return deepFreeze(envelope);
}

function completeResponses(items: readonly ResearchBundleItem[], responseById: ReadonlyMap<string, RawResponse>): RawResponse[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id)).map((item) => responseById.get(item.id) ?? ({ state: "missing", itemId: item.id } as unknown as RawResponse));
}

export function researchInputFromSubmission(envelope: ResearchSubmissionEnvelope): AssessmentInput {
  return {
    responseSchemaVersion: envelope.responseSchemaVersion as AssessmentInput["responseSchemaVersion"],
    contentFingerprint: envelope.contentFingerprint as AssessmentInput["contentFingerprint"],
    coreResponses: [...envelope.responses.core],
    specialistResponses: [...envelope.responses.specialist],
    requestedSpecialistModuleIds: [...envelope.responses.requestedSpecialistModuleIds],
  };
}

export interface ResearchSendResult {
  readonly accepted: boolean;
  readonly deduplicated: boolean;
  readonly submissionId: string;
  readonly attempts: number;
}

export async function sendResearchSubmission(
  envelope: ResearchSubmissionEnvelope,
  endpoint: string,
  fetchImpl: typeof fetch = fetch,
  sleep: (milliseconds: number) => Promise<void> = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
): Promise<ResearchSendResult> {
  let attempts = 0;
  let lastError: unknown;
  while (attempts < RESEARCH_RETRY_LIMIT) {
    attempts += 1;
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: canonicalize(envelope),
        credentials: "omit",
      });
      if (response.ok) {
        const result = await response.json() as { accepted?: boolean; deduplicated?: boolean };
        return { accepted: result.accepted === true, deduplicated: result.deduplicated === true, submissionId: envelope.submissionId, attempts };
      }
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`Research submission rejected (${response.status})`);
      }
      lastError = new Error(`Research submission temporarily unavailable (${response.status})`);
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message.startsWith("Research submission rejected (")) throw error;
    }
    if (attempts < RESEARCH_RETRY_LIMIT) await sleep(2 ** attempts * 100);
  }
  throw lastError instanceof Error ? lastError : new Error("Research submission failed");
}

export function projectResearchRows(envelope: ResearchSubmissionEnvelope): Array<Record<string, string | number | null>> {
  const rows: Array<Record<string, string | number | null>> = [];
  for (const [scope, responses] of [["core", envelope.responses.core], ["specialist", envelope.responses.specialist]] as const) {
    for (const response of responses) {
      rows.push({
        submissionId: envelope.submissionId,
        scope,
        itemId: response.itemId,
        state: response.state,
        responseType: response.state === "answered" ? response.responseType : null,
        rawValue: response.state === "answered" && "value" in response ? response.value : null,
        optionId: response.state === "answered" && "optionId" in response ? response.optionId : null,
        confidence: response.state === "answered" ? response.confidence ?? null : null,
        priority: response.state === "answered" ? response.priority ?? null : null,
      });
    }
  }
  return rows;
}
