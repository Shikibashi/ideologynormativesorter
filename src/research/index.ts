import type {
  AnswerMap,
  Question,
  QuizTier,
  ResearchTask,
  ResearchTaskArm,
  ResearchTaskResponse,
  LabelExposureArm,
  LabelExposureAssignment,
  LabelExposureOutcome,
} from "../types";
import {
  getQuestionHelpText,
  getSalienceHelpText,
} from "../data/questionHelpText";
import {
  DEFAULT_CONFIDENCE_PROMPT,
  SALIENCE_LEVELS,
  presentedResponseOptions,
  type PresentedResponseOption,
} from "../questionPresentation";
import { RESEARCH_FORM_VERSION, researchFormFingerprint } from "./forms";
import {
  canonicalLabelId,
  modifierScoringLabels,
  primaryScoringLabels,
  TAXONOMY_VERSION,
} from "../data/labelTaxonomy";
import { MODIFIER_MEASUREMENT_VERSION } from "../data/modifierMeasurement";
import { PRIMARY_MEASUREMENT_VERSION } from "../data/primaryMeasurement";
import { labelRosterFingerprint } from "./taxonomyMetadata";
import type {
  CalibrationEligibility,
  ItemLinkingRole,
} from "../types/research";
import type {
  SpecialistCriterionResponse,
  SpecialistMatch,
  SpecialistModuleAssignment,
  SpecialistModuleId,
  SpecialistOutcome,
} from "../specialist";
import {
  researchTaskAssignmentErrors,
  researchTaskResponseErrors,
  type ResearchTaskAssignment,
} from "./tasks";
import type { MeasurementVersionBundle } from "../validation/researchContracts";
import {
  LABEL_EXPOSURE_VERSION,
  RESEARCH_TASK_FORM_VERSION,
  RESEARCH_QUALITY_RULE_VERSION,
  RESEARCH_SCHEMA_VERSION,
  RESEARCH_STUDY_ID,
} from "./versions";
import { buildResearchVersionBundle } from "../validation/researchContracts";

export {
  RESEARCH_CONSENT_VERSION,
  RESEARCH_QUALITY_RULE_VERSION,
  RESEARCH_SCHEMA_VERSION,
  RESEARCH_STUDY_ID,
} from "./versions";
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
export { RESEARCH_TASK_BANK_VERSION } from "./versions";
export { LABEL_EXPOSURE_VERSION } from "./versions";
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
  familyId: string;
  calibrationEligibility: CalibrationEligibility;
  linkingRole?: ItemLinkingRole;
  wordingFormId: string;
  responseProcessTags: string[];
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
  versionBundle: MeasurementVersionBundle;
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
  labelExposure?: LabelExposureOutcome;
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

export interface ResearchTaskFormMetadata {
  algorithmVersion: string;
  assignedTaskCount: number;
  fingerprint: string;
}

export interface ResearchTaskSubmission extends ResearchRecordBase {
  recordType: "research-task";
  arm: ResearchTaskArm;
  taskBankVersion: string;
  assignment: ResearchTaskAssignment;
  presentationOrder: string[];
  form: ResearchTaskFormMetadata;
  tasks: ResearchTask[];
  responses: ResearchTaskResponse[];
}

export type ResearchSubmission =
  | CoreResearchSubmission
  | SpecialistResearchSubmission
  | SpecialistDispositionSubmission
  | ResearchTaskSubmission;

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

function buildItemMap(
  questions: Question[],
  constructWeightsByQuestionId?: Record<string, Record<string, number>>,
): ResearchItemSnapshot[] {
  return questions.map((question) => ({
    questionId: String(question.id),
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
    constructWeights: constructWeightsByQuestionId?.[String(question.id)],
    reverseScored: question.reverseScored === true,
    confidencePrompt:
      question.layer === "descriptive"
        ? (question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT)
        : undefined,
    priorityPrompt: question.priorityPrompt,
    salience:
      question.layer === "descriptive" || question.layer === "prescriptive"
        ? {
            kind: question.layer === "descriptive" ? "confidence" : "priority",
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
    familyId: question.familyId ?? `domain:${String(question.domain)}`,
    calibrationEligibility: question.calibrationEligibility ?? "pending-review",
    linkingRole: question.linkingRole,
    wordingFormId:
      question.wordingFormId ?? `unversioned:${String(question.id)}`,
    responseProcessTags: [
      ...(question.responseProcessTags ?? [question.responseType]),
    ],
  }));
}

export function isResearchMode(search = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get("contribute") === "1" || params.get("research") === "1";
}

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function researchLabelExposureEnabled(
  search = window.location.search,
): boolean {
  const params = new URLSearchParams(search);
  return params.get("research") === "1" && params.get("exposure") === "1";
}

export function buildLabelExposureAssignment(
  studyId: string,
  participantId: string,
): LabelExposureAssignment {
  const seed = `${safeToken(studyId)}_${safeToken(participantId)}_label-exposure-v1`;
  const arms: LabelExposureArm[] = [
    "dimension-only",
    "unlabeled-profile",
    "named-label",
  ];
  return {
    version: LABEL_EXPOSURE_VERSION,
    studyId: safeToken(studyId) || RESEARCH_STUDY_ID,
    participantId: safeToken(participantId),
    arm: arms[hash32(seed) % arms.length],
    seed,
    assignedAfterSubstantiveResponses: true,
  };
}

export function researchTaskArm(
  search = window.location.search,
): Exclude<ResearchTaskArm, "all"> | null {
  const params = new URLSearchParams(search);
  if (params.get("research") !== "1") return null;
  const arm = params.get("arm");
  if (
    arm === "probability" ||
    arm === "choice" ||
    arm === "allocation" ||
    arm === "similarity"
  ) {
    return arm;
  }
  return null;
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
  studyId: string = RESEARCH_STUDY_ID,
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
  labelExposureOutcome?: LabelExposureOutcome;
  submissionId?: string;
  submittedAt?: string;
}): CoreResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions);
  const studyId = safeToken(input.studyId) || RESEARCH_STUDY_ID;
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "core",
    studyId,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
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
    versionBundle: buildResearchVersionBundle({
      bankVersion: input.bankVersion,
      scoringVersion: input.scoringVersion,
      studyId,
    }),
    identity: {
      ...input.identity,
      selfLabelId: input.identity.selfLabelId
        ? canonicalLabelId(input.identity.selfLabelId)
        : undefined,
      selfReportedIdeologies: normalizeSelfReportedIdeologies(
        input.identity.selfReportedIdeologies,
      ),
    },
    predictedLabelIds: input.predictedLabelIds
      .slice(0, 5)
      .map(canonicalLabelId),
    predictedModifierIds: (input.predictedModifierIds ?? []).slice(0, 5),
    specialistAssignment: input.specialistAssignment,
    labelExposure: input.labelExposureOutcome,
    form: {
      algorithmVersion: RESEARCH_FORM_VERSION,
      requestedItemCount: input.requestedFormSize ?? null,
      assignedItemCount: input.questions.length,
      fingerprint: researchFormFingerprint(input.questions),
    },
    sampling: {
      design: "open-opt-in-nonprobability",
      populationInference: false,
      weighting: "none",
      recruitmentSource:
        safeToken(input.recruitmentSource ?? "") || "direct-or-unknown",
      recruitmentSourceProvenance: "url-parameter-unverified",
    },
    answers: input.answers,
    itemMap: buildItemMap(input.questions),
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
}): SpecialistResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions);
  const studyId = safeToken(input.studyId) || RESEARCH_STUDY_ID;
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "specialist",
    studyId,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    versionBundle: buildResearchVersionBundle({
      bankVersion: input.bankVersion,
      scoringVersion: input.scoringVersion,
      studyId,
    }),
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    presentationOrder: input.questions.map((question) => String(question.id)),
    bankVersion: input.bankVersion,
    scoringVersion: input.scoringVersion,
    criterion: input.criterion,
    answers: input.answers,
    itemMap: buildItemMap(input.questions, input.constructWeightsByQuestionId),
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
}): SpecialistDispositionSubmission {
  const completedAt = input.occurredAt ?? new Date().toISOString();
  const startedAt = input.startedAt ?? completedAt;
  const studyId = safeToken(input.studyId) || RESEARCH_STUDY_ID;
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "specialist-disposition",
    studyId,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? completedAt,
    startedAt,
    completedAt,
    durationMs: durationBetween(startedAt, completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    versionBundle: buildResearchVersionBundle({ studyId }),
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    disposition: input.disposition,
    answeredCount: Math.max(0, Math.floor(input.answeredCount)),
  };
}

export function buildResearchTaskSubmission(input: {
  studyId: string;
  participantId: string;
  administration: ResearchAdministration;
  consent: ResearchConsent;
  scoringVersion: string;
  arm: ResearchTaskArm;
  assignment: ResearchTaskAssignment;
  tasks: ResearchTask[];
  responses: ResearchTaskResponse[];
  startedAt: string;
  completedAt: string;
  submittedAt?: string;
  locale?: string;
  submissionId?: string;
}): ResearchTaskSubmission {
  const assignmentErrors = researchTaskAssignmentErrors(
    input.assignment,
    input.tasks,
  );
  if (input.assignment.arm !== input.arm) {
    assignmentErrors.push(
      "task assignment arm does not match the submission arm",
    );
  }
  if (assignmentErrors.length > 0) {
    throw new Error(
      `Research task assignment violation: ${assignmentErrors.join("; ")}`,
    );
  }
  const tasksById = new Map(input.tasks.map((task) => [task.id, task]));
  if (
    input.responses.length !== input.tasks.length ||
    new Set(input.responses.map((response) => response.taskId)).size !==
      input.responses.length
  ) {
    throw new Error(
      "Research task responses must contain one response per task.",
    );
  }
  for (const response of input.responses) {
    const task = tasksById.get(response.taskId);
    if (!task)
      throw new Error(
        `Research response names unknown task ${response.taskId}.`,
      );
    const errors = researchTaskResponseErrors(task, response);
    if (errors.length > 0) {
      throw new Error(`Research task response violation: ${errors.join("; ")}`);
    }
  }
  const studyId = safeToken(input.studyId) || RESEARCH_STUDY_ID;
  const versionBundle = buildResearchVersionBundle({
    formVersion: RESEARCH_TASK_FORM_VERSION,
    scoringVersion: input.scoringVersion,
    studyId,
  });
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: "research-task",
    studyId,
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    arm: input.arm,
    taskBankVersion: input.assignment.taskBankVersion,
    assignment: input.assignment,
    presentationOrder: [...input.assignment.presentationOrder],
    form: {
      algorithmVersion: RESEARCH_TASK_FORM_VERSION,
      assignedTaskCount: input.tasks.length,
      fingerprint: input.assignment.fingerprint,
    },
    tasks: input.tasks,
    responses: input.responses,
    versionBundle,
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
