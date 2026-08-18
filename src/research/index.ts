import type { AnswerMap, Question, QuizTier } from "../types";
import { getQuestionHelpText, getSalienceHelpText } from "../domain/selectors";
import {
  DEFAULT_CONFIDENCE_PROMPT,
  SALIENCE_LEVELS,
  presentedResponseOptions,
  type PresentedResponseOption,
} from "../questionPresentation";
import { canonicalize } from "../domain/canonicalSerialization";
import {
  RESEARCH_FORM_VERSION,
  researchFormFingerprint,
  RESEARCH_CONTRACT_ROUTE as FORM_CONTRACT_ROUTE,
  RESEARCH_COHORT as FORM_COHORT,
  RESEARCH_COHORT_VERSION as FORM_COHORT_VERSION,
  RESEARCH_COHORT_FINGERPRINT as FORM_COHORT_FINGERPRINT,
  RESEARCH_MANIFEST_VERSION as FORM_MANIFEST_VERSION,
  RESEARCH_MANIFEST_FINGERPRINT as FORM_MANIFEST_FINGERPRINT,
  RESEARCH_SERIALIZATION_VERSION as FORM_SERIALIZATION_VERSION,
  RESEARCH_MANIFEST_SCHEMA_VERSION as FORM_MANIFEST_SCHEMA_VERSION,
  RESEARCH_SOURCE_MANIFEST_SHA256 as FORM_SOURCE_MANIFEST_SHA256,
  RESEARCH_SERIALIZATION_FINGERPRINT as FORM_SERIALIZATION_FINGERPRINT,
  RESEARCH_SCHEMA_CONTRACT_VERSION as FORM_SCHEMA_CONTRACT_VERSION,
  RESEARCH_SCHEMA_FINGERPRINT as FORM_SCHEMA_FINGERPRINT,
  RESEARCH_CONTRACT_FINGERPRINT as FORM_CONTRACT_FINGERPRINT,
  RESEARCH_RECORD_CONTRACT_VERSION as FORM_RECORD_CONTRACT_VERSION,
} from "./forms";
import {
  canonicalLabelId,
  modifierScoringLabels,
  primaryScoringLabels,
  TAXONOMY_VERSION,
} from "../domain/selectors";
import { MODIFIER_MEASUREMENT_VERSION } from "../domain/selectors";
import { PRIMARY_MEASUREMENT_VERSION } from "../domain/selectors";
import { labelRosterFingerprint } from "./taxonomyMetadata";
import { canonicalRegistry } from "../domain/registry";
import type {
  SpecialistCriterionResponse,
  SpecialistMatch,
  SpecialistModuleAssignment,
  SpecialistModuleId,
  SpecialistOutcome,
} from "../specialist";
export * from "./contractSnapshot";
import {
  createResearchContractSnapshot,
  type ResearchContractConsent,
  type ResearchContractProvenance,
  type ResearchContractRefusal,
  type ResearchContractSnapshot,
  type ResearchObservation,
} from "./contractSnapshot";

export const RESEARCH_SCHEMA_VERSION = "2026-08-v15";
export const RESEARCH_CONSENT_VERSION = "2026-08-12-v8";
export const RESEARCH_QUALITY_RULE_VERSION = "data-quality-v2";
/** A new cohort isolates taxonomy and specialist-construct revisions from prior submissions. */
export const RESEARCH_STUDY_ID = "community-2026-v5";
export const RESEARCH_MANIFEST_VERSION = FORM_MANIFEST_VERSION;
export const RESEARCH_MANIFEST_FINGERPRINT = FORM_MANIFEST_FINGERPRINT;
export const RESEARCH_MANIFEST_SCHEMA_VERSION = FORM_MANIFEST_SCHEMA_VERSION;
export const RESEARCH_SOURCE_MANIFEST_SHA256 = FORM_SOURCE_MANIFEST_SHA256;
export const RESEARCH_SERIALIZATION_VERSION = FORM_SERIALIZATION_VERSION;
export const RESEARCH_SERIALIZATION_FINGERPRINT =
  FORM_SERIALIZATION_FINGERPRINT;
export const RESEARCH_SCHEMA_CONTRACT_VERSION = FORM_SCHEMA_CONTRACT_VERSION;
export const RESEARCH_SCHEMA_FINGERPRINT = FORM_SCHEMA_FINGERPRINT;
export const RESEARCH_RECORD_CONTRACT_VERSION = FORM_RECORD_CONTRACT_VERSION;
export const RESEARCH_CONTRACT_FINGERPRINT = FORM_CONTRACT_FINGERPRINT;
export const RESEARCH_CONTRACT_ROUTE = FORM_CONTRACT_ROUTE;
export const RESEARCH_COHORT = FORM_COHORT;
export const RESEARCH_COHORT_VERSION = FORM_COHORT_VERSION;
export const RESEARCH_COHORT_FINGERPRINT = FORM_COHORT_FINGERPRINT;
export const RESEARCH_COHORT_ID = RESEARCH_COHORT;
export const PUBLIC_RESEARCH_ENTRYPOINT =
  "?contribute=1&collection=community-2026-v5";
export const PRIMARY_LABEL_ROSTER_FINGERPRINT = labelRosterFingerprint(
  "primary",
  primaryScoringLabels.map((label) => label.id),
  TAXONOMY_VERSION,
  PRIMARY_MEASUREMENT_VERSION,
);
export const MODIFIER_LABEL_ROSTER_FINGERPRINT = labelRosterFingerprint(
  "modifier",
  modifierScoringLabels.map((label) => label.id),
  TAXONOMY_VERSION,
  MODIFIER_MEASUREMENT_VERSION,
);
const PARTICIPANT_STORAGE_KEY = "political-judgment-research-participant-v1";

export type ResearchAdministration = "test" | "retest";
export type SpecialistDisposition =
  | "declined-before-start"
  | "declined-after-partial"
  | "declined-after-completion";

export interface ResearchConsent {
  ageConfirmed: true;
  voluntaryParticipation: true;
  dataUseAccepted: true;
  consentVersion: string;
  consentedAt: string;
  disclosureSnapshot: {
    endpointConfigured: boolean;
    transferAndWithdrawalNotice: string;
    retentionNotice: string;
    contactNotice: string;
  };
}
export interface ResearchSubmissionContractMetadata {
  manifestVersion?: string;
  manifestFingerprint?: string;
  manifestSchemaVersion?: string;
  sourceManifestSha256?: string;
  serializationVersion?: string;
  serializationFingerprint?: string;
  schemaContractVersion?: string;
  schemaFingerprint?: string;
  contractVersion?: string;
  contractFingerprint?: string;
  contractRoute?: string;
  cohort?: string;
  cohortVersion?: string;
  cohortFingerprint?: string;
  provenance?: ResearchContractProvenance;
  refusal?: ResearchContractRefusal | null;
  snapshot?: ResearchContractSnapshot;
}

export interface ResearchIdentity {
  selfLabelId?: string;
  /** Optional respondent-supplied names of one or more ideologies or traditions. */
  selfReportedIdeologies?: string;
  ageBand?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
  genderGroup?: "woman" | "man" | "nonbinary-or-another";
}

export interface ResearchItemSnapshot {
  questionId: string;
  prompt: string;
  helpText: string;
  domain: string;
  layer: Question["layer"];
  theoryContext: Question["theoryContext"];
  responseType: Question["responseType"];
  responseOptions: PresentedResponseOption[];
  axisWeights: Array<{ axisId: string; weight: number }>;
  statementOptions?: Array<{
    id: string;
    text: string;
    axisWeights: Array<{ axisId: string; weight: number }>;
  }>;
  constructWeights?: Record<string, number>;
  reverseScored: boolean;
  confidencePrompt?: string;
  priorityPrompt?: string;
  salience?: {
    kind: "confidence" | "priority";
    prompt: string;
    helpText: string;
    options: Array<{ value: number | "skipped"; label: string }>;
  };
  reviewStatus: Question["reviewStatus"];
  evidenceNote?: string;
  contextNote?: string;
  sourceCount: number;
}

interface ResearchRecordBase {
  schemaVersion: string;
  submissionId: string;
  studyId: string;
  participantId: string;
  administration: ResearchAdministration;
  submittedAt: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  consent: ResearchConsent;
  locale: string;
  qualityRuleVersion: string;
  manifestSchemaVersion: string;
  sourceManifestSha256: string;
  manifestVersion: string;
  manifestFingerprint: string;
  serializationVersion: string;
  serializationFingerprint: string;
  schemaContractVersion: string;
  schemaFingerprint: string;
  contractVersion: string;
  contractFingerprint: string;
  contractRoute: string;
  cohort: string;
  cohortVersion: string;
  cohortFingerprint: string;
  provenance: ResearchContractProvenance;
  refusal: ResearchContractRefusal | null;
  observations: Readonly<Record<string, ResearchObservation>>;
  contractMetadata: ResearchSubmissionContractMetadata;
}

export interface ResearchFormMetadata {
  algorithmVersion: string;
  requestedItemCount: number | null;
  assignedItemCount: number;
  fingerprint: string;
}

export interface ResearchSamplingMetadata {
  design: "open-opt-in-nonprobability";
  populationInference: false;
  weighting: "none";
  recruitmentSource: string;
  recruitmentSourceProvenance: "url-parameter-unverified";
}

export interface CoreResearchSubmission extends ResearchRecordBase {
  recordType: "core";
  resumed: boolean;
  presentationOrder: string[];
  form: ResearchFormMetadata;
  sampling: ResearchSamplingMetadata;
  bankVersion: string;
  scoringVersion: string;
  taxonomyVersion: string;
  /** Version of the source-backed primary core-comparison registry. */
  primaryMeasurementVersion: string;
  /** Version of the direct-construct eligibility registry for modifiers. */
  modifierMeasurementVersion: string;
  primaryLabelIds: string[];
  modifierLabelIds: string[];
  primaryLabelRosterFingerprint: string;
  modifierLabelRosterFingerprint: string;
  tier: QuizTier;
  identity: ResearchIdentity;
  predictedLabelIds: string[];
  predictedModifierIds: string[];
  specialistAssignment?: SpecialistModuleAssignment;
  answers: AnswerMap;
  itemMap: ResearchItemSnapshot[];
}

export interface SpecialistResearchSubmission extends ResearchRecordBase {
  recordType: "specialist";
  moduleId: SpecialistModuleId;
  moduleVersion: string;
  assignment: SpecialistModuleAssignment;
  presentationOrder: string[];
  bankVersion: string;
  scoringVersion: string;
  criterion: SpecialistCriterionResponse;
  answers: AnswerMap;
  itemMap: ResearchItemSnapshot[];
  constructScores: Record<string, number>;
  matches: SpecialistMatch[];
  evidence?: SpecialistOutcome["evidence"];
}

export interface SpecialistDispositionSubmission extends ResearchRecordBase {
  recordType: "specialist-disposition";
  moduleId: SpecialistModuleId;
  moduleVersion: string;
  assignment: SpecialistModuleAssignment;
  disposition: SpecialistDisposition;
  answeredCount: number;
}

export type ResearchSubmission =
  | CoreResearchSubmission
  | SpecialistResearchSubmission
  | SpecialistDispositionSubmission;

export type ResearchSubmissionStatus =
  | { status: "submitted"; endpoint: string }
  | { status: "export-only" }
  | { status: "failed"; reason: string };

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function safeToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 96);
}

function durationBetween(startedAt: string, completedAt: string): number {
  const started = Date.parse(startedAt);
  const completed = Date.parse(completedAt);
  if (!Number.isFinite(started) || !Number.isFinite(completed)) return 0;
  return Math.max(0, completed - started);
}

function normalizeSelfReportedIdeologies(value?: string): string | undefined {
  const normalized = value?.replace(/\s+/g, " ").trim().slice(0, 240);
  return normalized || undefined;
}

function normalizeLocale(value?: string): string {
  return value?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "und";
}
function browserObservation<T>(
  value: T | undefined,
  observedAt: string,
): ResearchObservation<T | null> {
  return {
    kind: "browser-observation",
    source: "browser",
    value: value === undefined ? null : value,
    observedAt,
  };
}

function buildContractMetadata(input: {
  submittedAt: string;
  studyId: string;
  contractMetadata?: ResearchSubmissionContractMetadata;
  refusal?: ResearchContractRefusal | null;
  consent?: ResearchConsent | null;
  form: {
    formId: string;
    formVersion: string;
    fingerprint: string;
  };
  observations: Readonly<Record<string, ResearchObservation>>;
}): Pick<
  ResearchRecordBase,
  | "manifestSchemaVersion"
  | "sourceManifestSha256"
  | "manifestVersion"
  | "manifestFingerprint"
  | "serializationVersion"
  | "serializationFingerprint"
  | "schemaContractVersion"
  | "schemaFingerprint"
  | "contractVersion"
  | "contractFingerprint"
  | "contractRoute"
  | "cohort"
  | "cohortVersion"
  | "cohortFingerprint"
  | "provenance"
  | "refusal"
  | "observations"
  | "contractMetadata"
> {
  const provenance: ResearchContractProvenance = {
    source: "browser",
    capturedAt: input.submittedAt,
    surface: "research-form",
  };
  const snapshot = createResearchContractSnapshot({
    registry: canonicalRegistry,
    serialization: {
      version: RESEARCH_SERIALIZATION_VERSION,
      fingerprint: RESEARCH_SERIALIZATION_FINGERPRINT,
    },
    schema: {
      version: RESEARCH_SCHEMA_CONTRACT_VERSION,
      fingerprint: RESEARCH_SCHEMA_FINGERPRINT,
    },
    cohort: {
      version: RESEARCH_COHORT_VERSION,
      fingerprint: RESEARCH_COHORT_FINGERPRINT,
    },
    sourceManifestSha256: RESEARCH_SOURCE_MANIFEST_SHA256,
    contractFingerprint: RESEARCH_CONTRACT_FINGERPRINT,
    study: {
      studyId: input.studyId,
      cohortId: RESEARCH_COHORT,
    },
    form: {
      ...input.form,
      contractRoute: RESEARCH_CONTRACT_ROUTE,
      cohort: RESEARCH_COHORT,
    },
    provenance,
    consent: input.consent
      ? (input.consent as unknown as ResearchContractConsent)
      : null,
    refusal: input.refusal ?? null,
    observations: input.observations,
  });
  const expected = {
    manifestSchemaVersion: RESEARCH_MANIFEST_SCHEMA_VERSION,
    sourceManifestSha256: RESEARCH_SOURCE_MANIFEST_SHA256,
    manifestVersion: RESEARCH_MANIFEST_VERSION,
    manifestFingerprint: RESEARCH_MANIFEST_FINGERPRINT,
    serializationVersion: RESEARCH_SERIALIZATION_VERSION,
    serializationFingerprint: RESEARCH_SERIALIZATION_FINGERPRINT,
    schemaContractVersion: RESEARCH_SCHEMA_CONTRACT_VERSION,
    schemaFingerprint: RESEARCH_SCHEMA_FINGERPRINT,
    contractVersion: RESEARCH_RECORD_CONTRACT_VERSION,
    contractFingerprint: RESEARCH_CONTRACT_FINGERPRINT,
    contractRoute: RESEARCH_CONTRACT_ROUTE,
    cohort: RESEARCH_COHORT,
    cohortVersion: RESEARCH_COHORT_VERSION,
    cohortFingerprint: RESEARCH_COHORT_FINGERPRINT,
    provenance,
    refusal: input.refusal ?? null,
  };
  if (input.contractMetadata !== undefined) {
    const supplied = input.contractMetadata as Record<string, unknown>;
    const suppliedKeys = Object.keys(supplied)
      .filter((key) => key !== "snapshot")
      .sort();
    const expectedKeys = Object.keys(expected).sort();
    if (
      expectedKeys.length !== suppliedKeys.length ||
      expectedKeys.some((key, index) => key !== suppliedKeys[index]) ||
      expectedKeys.some(
        (key) =>
          canonicalize(supplied[key]) !==
          canonicalize(expected[key as keyof typeof expected]),
      )
    ) {
      throw new Error(
        "Research contract metadata must match the canonical browser contract exactly.",
      );
    }
    if (
      supplied.snapshot !== undefined &&
      canonicalize(supplied.snapshot) !== canonicalize(snapshot)
    ) {
      throw new Error(
        "Research contract metadata must match the canonical browser contract exactly.",
      );
    }
  }
  const contractMetadata: ResearchSubmissionContractMetadata = Object.freeze({
    ...expected,
    snapshot,
  });
  return {
    ...expected,
    observations: input.observations,
    contractMetadata,
  };
}

function validateAnswerCoverage(
  answers: AnswerMap,
  questions: Question[],
): void {
  const questionIds = new Set(questions.map((question) => String(question.id)));
  const answerIds = Object.keys(answers);
  const missing = [...questionIds].filter(
    (questionId) => answers[questionId] === undefined,
  );
  const unexpected = answerIds.filter(
    (questionId) => !questionIds.has(questionId),
  );
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `Research answer coverage mismatch: ${missing.length} missing and ${unexpected.length} unexpected item(s).`,
    );
  }
}

const CANONICAL_DEFAULT_CONFIDENCE_PROMPT =
  "How confident are you in the answer you just gave?";
function buildItemMap(
  questions: Question[],
  constructWeightsByQuestionId?: Record<string, Record<string, number>>,
): ResearchItemSnapshot[] {
  return questions.map((question) => {
    const questionId = String(question.id);
    const canonical = canonicalRegistry.get("item", questionId);
    const item: ResearchItemSnapshot = {
      questionId,
      prompt: question.prompt,
      helpText: question.helpText ?? getQuestionHelpText(question),
      domain: String(question.domain),
      layer: question.layer,
      theoryContext: question.theoryContext,
      responseType: question.responseType,
      responseOptions: presentedResponseOptions(question, true),
      axisWeights: question.axisWeights.map((weight) => ({
        axisId: String(weight.axisId),
        weight: weight.weight,
      })),
      statementOptions: question.statementOptions?.map((option) => ({
        id: option.id,
        text: option.text,
        axisWeights: option.axisWeights.map((weight) => ({
          axisId: String(weight.axisId),
          weight: weight.weight,
        })),
      })),
      constructWeights: constructWeightsByQuestionId?.[questionId],
      reverseScored: question.reverseScored === true,
      confidencePrompt:
        question.layer === "descriptive"
          ? (question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT)
          : undefined,
      priorityPrompt: question.priorityPrompt,
      salience:
        question.layer === "descriptive" || question.layer === "prescriptive"
          ? {
              kind:
                question.layer === "descriptive" ? "confidence" : "priority",
              prompt:
                question.layer === "descriptive"
                  ? (question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT)
                  : (question.priorityPrompt ?? ""),
              helpText: getSalienceHelpText(
                question.layer === "descriptive" ? "confidence" : "priority",
              ),
              options: [
                ...SALIENCE_LEVELS.map((level) => ({
                  value: level.value,
                  label: level.label,
                })),
                { value: "skipped" as const, label: "Skip rating" },
              ],
            }
          : undefined,
      reviewStatus: question.reviewStatus,
      evidenceNote: question.evidenceNote,
      contextNote: question.contextNote,
      sourceCount: question.sources?.length ?? 0,
    };
    if (!canonical) return item;
    const canonicalResponseType =
      (canonical.responseType as Question["responseType"] | undefined) ??
      question.responseType;
    const canonicalAxisWeights = Object.entries(
      canonical.rootConstructWeights ?? {},
    ).map(([axisId, weight]) => ({ axisId, weight }));
    const canonicalStatementOptions = canonical.statementOptions?.map(
      (option) => ({
        id: option.id,
        text: option.text,
        axisWeights: Object.entries(option.rootConstructWeights ?? {}).map(
          ([axisId, weight]) => ({ axisId, weight }),
        ),
      }),
    );
    return {
      ...item,
      prompt: canonical.prompt,
      domain: canonical.domain ?? item.domain,
      layer: canonical.layer ?? item.layer,
      theoryContext: "mixed",
      responseType: canonicalResponseType,
      axisWeights: canonicalAxisWeights,
      responseOptions: presentedResponseOptions(
        {
          ...question,
          responseType: canonicalResponseType,
          allowDontKnow: canonical.allowDontKnow === true,
          confidencePrompt:
            canonical.confidencePrompt ?? CANONICAL_DEFAULT_CONFIDENCE_PROMPT,
          priorityPrompt: canonical.priorityPrompt ?? "",
          statementOptions: canonical.statementOptions?.map((option) => ({
            ...option,
            axisWeights: Object.entries(option.rootConstructWeights ?? {}).map(
              ([axisId, weight]) => ({ axisId, weight }),
            ),
          })),
        },
        true,
      ),
      ...(canonicalStatementOptions === undefined
        ? { statementOptions: undefined }
        : { statementOptions: canonicalStatementOptions }),
      ...(canonical.localConstructWeights === undefined
        ? { constructWeights: item.constructWeights }
        : { constructWeights: { ...canonical.localConstructWeights } }),
      reverseScored: canonical.reverseScored === true,
      reviewStatus: "approved",
      ...(canonical.layer === "descriptive"
        ? {
            confidencePrompt:
              canonical.confidencePrompt ?? CANONICAL_DEFAULT_CONFIDENCE_PROMPT,
            salience: {
              kind: "confidence" as const,
              prompt:
                canonical.confidencePrompt ??
                CANONICAL_DEFAULT_CONFIDENCE_PROMPT,
              helpText: getSalienceHelpText("confidence"),
              options: [
                ...SALIENCE_LEVELS.map((level) => ({
                  value: level.value,
                  label: level.label,
                })),
                { value: "skipped" as const, label: "Skip rating" },
              ],
            },
          }
        : canonical.layer === "prescriptive"
          ? {
              ...(canonical.priorityPrompt === undefined
                ? {}
                : { priorityPrompt: canonical.priorityPrompt }),
              salience: {
                kind: "priority" as const,
                prompt: canonical.priorityPrompt ?? "",
                helpText: getSalienceHelpText("priority"),
                options: [
                  ...SALIENCE_LEVELS.map((level) => ({
                    value: level.value,
                    label: level.label,
                  })),
                  { value: "skipped" as const, label: "Skip rating" },
                ],
              },
            }
          : {}),
      sourceCount: canonical.sources?.length ?? 0,
    };
  });
}

export function isResearchMode(search = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get("contribute") === "1" || params.get("research") === "1";
}

export function researchAdministration(
  search = window.location.search,
): ResearchAdministration {
  return new URLSearchParams(search).get("administration") === "retest"
    ? "retest"
    : "test";
}

export function researchStudyId(search = window.location.search): string {
  const params = new URLSearchParams(search);
  const configured = safeToken(
    params.get("collection") ?? params.get("study") ?? "",
  );
  return configured || RESEARCH_STUDY_ID;
}

export function researchRecruitmentSource(
  search = window.location.search,
): string {
  const configured = safeToken(new URLSearchParams(search).get("source") ?? "");
  return configured || "direct-or-unknown";
}

export function getOrCreateParticipantId(
  storage: StorageLike = window.localStorage,
  createId: (() => string) | undefined = undefined,
  studyId = RESEARCH_STUDY_ID,
): string {
  const storageKey = `${PARTICIPANT_STORAGE_KEY}:${safeToken(studyId) || RESEARCH_STUDY_ID}`;
  const existing = storage.getItem(storageKey);
  if (existing) return existing;
  const participantId = `p_${safeToken((createId ?? (() => crypto.randomUUID()))())}`;
  storage.setItem(storageKey, participantId);
  return participantId;
}

export function buildResearchSubmission(input: {
  studyId: string;
  participantId: string;
  administration: ResearchAdministration;
  bankVersion: string;
  scoringVersion: string;
  tier: QuizTier;
  consent: ResearchConsent;
  identity: ResearchIdentity;
  predictedLabelIds: string[];
  predictedModifierIds?: string[];
  specialistAssignment?: SpecialistModuleAssignment;
  answers: AnswerMap;
  questions: Question[];
  startedAt: string;
  completedAt: string;
  resumed: boolean;
  requestedFormSize?: number | null;
  recruitmentSource?: string;
  locale?: string;
  submissionId?: string;
  submittedAt?: string;
  contractMetadata?: ResearchSubmissionContractMetadata;
}): CoreResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions);
  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const identity: ResearchIdentity = {
    ...input.identity,
    selfLabelId: input.identity.selfLabelId
      ? canonicalLabelId(input.identity.selfLabelId)
      : undefined,
    selfReportedIdeologies: normalizeSelfReportedIdeologies(
      input.identity.selfReportedIdeologies,
    ),
  };
  const predictedLabelIds = input.predictedLabelIds
    .slice(0, 5)
    .map(canonicalLabelId);
  const predictedModifierIds = (input.predictedModifierIds ?? []).slice(0, 5);
  const form = {
    algorithmVersion: RESEARCH_FORM_VERSION,
    requestedItemCount: input.requestedFormSize ?? null,
    assignedItemCount: input.questions.length,
    fingerprint: researchFormFingerprint(input.questions),
  };
  const itemMap = buildItemMap(input.questions);
  const contract = buildContractMetadata({
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    submittedAt,
    consent: input.consent,
    contractMetadata: input.contractMetadata,
    form: {
      formId: "core",
      formVersion: RESEARCH_FORM_VERSION,
      fingerprint: form.fingerprint,
    },
    observations: {
      identity: browserObservation(identity, submittedAt),
      predictedLabelIds: browserObservation(predictedLabelIds, submittedAt),
      predictedModifierIds: browserObservation(
        predictedModifierIds,
        submittedAt,
      ),
      answers: browserObservation(input.answers, input.completedAt),
      canonicalItems: browserObservation(itemMap, input.completedAt),
      canonicalForm: browserObservation(form, submittedAt),
    },
  });
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "core",
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    resumed: input.resumed,
    presentationOrder: input.questions.map((question) => String(question.id)),
    bankVersion: input.bankVersion,
    scoringVersion: input.scoringVersion,
    taxonomyVersion: TAXONOMY_VERSION,
    primaryMeasurementVersion: PRIMARY_MEASUREMENT_VERSION,
    modifierMeasurementVersion: MODIFIER_MEASUREMENT_VERSION,
    primaryLabelIds: primaryScoringLabels.map((label) => label.id),
    modifierLabelIds: modifierScoringLabels.map((label) => label.id),
    primaryLabelRosterFingerprint: PRIMARY_LABEL_ROSTER_FINGERPRINT,
    modifierLabelRosterFingerprint: MODIFIER_LABEL_ROSTER_FINGERPRINT,
    tier: input.tier,
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    ...contract,
    identity,
    predictedLabelIds,
    predictedModifierIds,
    specialistAssignment: input.specialistAssignment,
    form,
    sampling: {
      design: "open-opt-in-nonprobability",
      populationInference: false,
      weighting: "none",
      recruitmentSource:
        safeToken(input.recruitmentSource ?? "") || "direct-or-unknown",
      recruitmentSourceProvenance: "url-parameter-unverified",
    },
    answers: input.answers,
    itemMap,
  };
}

export function buildSpecialistResearchSubmission(input: {
  studyId: string;
  participantId: string;
  administration: ResearchAdministration;
  consent: ResearchConsent;
  moduleId: SpecialistModuleId;
  moduleVersion: string;
  assignment: SpecialistModuleAssignment;
  bankVersion: string;
  scoringVersion: string;
  criterion: SpecialistCriterionResponse;
  answers: AnswerMap;
  questions: Question[];
  constructWeightsByQuestionId: Record<string, Record<string, number>>;
  outcome: SpecialistOutcome;
  startedAt: string;
  completedAt: string;
  submittedAt?: string;
  locale?: string;
  submissionId?: string;
  contractMetadata?: ResearchSubmissionContractMetadata;
}): SpecialistResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions);
  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const form = {
    formId: `specialist-${input.moduleId}`,
    formVersion: input.moduleVersion,
    fingerprint: researchFormFingerprint(input.questions),
  };
  const itemMap = buildItemMap(
    input.questions,
    input.constructWeightsByQuestionId,
  );
  const contract = buildContractMetadata({
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    submittedAt,
    consent: input.consent,
    contractMetadata: input.contractMetadata,
    form,
    observations: {
      criterion: browserObservation(input.criterion, submittedAt),
      answers: browserObservation(input.answers, input.completedAt),
      constructScores: browserObservation(
        input.outcome.constructScores,
        input.completedAt,
      ),
      matches: browserObservation(input.outcome.matches, input.completedAt),
      evidence: browserObservation(input.outcome.evidence, input.completedAt),
      canonicalItems: browserObservation(itemMap, input.completedAt),
      canonicalForm: browserObservation(form, submittedAt),
    },
  });
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "specialist",
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    ...contract,
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    presentationOrder: input.questions.map((question) => String(question.id)),
    bankVersion: input.bankVersion,
    scoringVersion: input.scoringVersion,
    criterion: input.criterion,
    answers: input.answers,
    itemMap,
    constructScores: input.outcome.constructScores,
    matches: input.outcome.matches,
    evidence: input.outcome.evidence,
  };
}

export function buildSpecialistDispositionSubmission(input: {
  studyId: string;
  participantId: string;
  administration: ResearchAdministration;
  consent: ResearchConsent;
  moduleId: SpecialistModuleId;
  moduleVersion: string;
  assignment: SpecialistModuleAssignment;
  disposition: SpecialistDisposition;
  answeredCount: number;
  startedAt?: string;
  occurredAt?: string;
  submittedAt?: string;
  locale?: string;
  submissionId?: string;
  contractMetadata?: ResearchSubmissionContractMetadata;
}): SpecialistDispositionSubmission {
  const completedAt = input.occurredAt ?? new Date().toISOString();
  const startedAt = input.startedAt ?? completedAt;
  const submittedAt = input.submittedAt ?? completedAt;
  const answeredCount = Math.max(0, Math.floor(input.answeredCount));
  const contract = buildContractMetadata({
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    submittedAt,
    consent: null,
    contractMetadata: input.contractMetadata,
    refusal: {
      status: "refused",
      reason: input.disposition,
      refusedAt: completedAt,
    },
    form: {
      formId: `specialist-disposition-${input.moduleId}`,
      formVersion: input.moduleVersion,
      fingerprint: researchFormFingerprint([]),
    },
    observations: {
      disposition: browserObservation(input.disposition, completedAt),
      answeredCount: browserObservation(answeredCount, completedAt),
    },
  });
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "specialist-disposition",
    studyId: safeToken(input.studyId) || RESEARCH_STUDY_ID,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt,
    startedAt,
    completedAt,
    durationMs: durationBetween(startedAt, completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    ...contract,
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    disposition: input.disposition,
    answeredCount,
  };
}

export async function submitResearchSubmission(
  submission: ResearchSubmission,
  endpoint: string | undefined,
  send: typeof fetch = fetch,
): Promise<ResearchSubmissionStatus> {
  if (!endpoint?.trim()) return { status: "export-only" };
  let resolvedEndpoint: URL;
  try {
    resolvedEndpoint = new URL(endpoint, window.location.href);
  } catch {
    return {
      status: "failed",
      reason: "The website collection endpoint is not a valid URL.",
    };
  }
  const localDevelopment = ["localhost", "127.0.0.1", "[::1]"].includes(
    resolvedEndpoint.hostname,
  );
  if (resolvedEndpoint.protocol !== "https:" && !localDevelopment) {
    return {
      status: "failed",
      reason: "The website collection endpoint must use HTTPS.",
    };
  }
  try {
    const response = await send(resolvedEndpoint.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(submission),
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok)
      return {
        status: "failed",
        reason: `The website could not receive the contribution (HTTP ${response.status}).`,
      };
    return { status: "submitted", endpoint: resolvedEndpoint.toString() };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown network error.";
    return { status: "failed", reason };
  }
}
