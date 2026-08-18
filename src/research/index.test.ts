import { describe, expect, it, vi } from "vitest";
import type { AnswerMap, Question } from "../types";
import {
  buildResearchSubmission,
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  getOrCreateParticipantId,
  MODIFIER_LABEL_ROSTER_FINGERPRINT,
  PRIMARY_LABEL_ROSTER_FINGERPRINT,
  submitResearchSubmission,
  RESEARCH_CONTRACT_VERSION,
  createResearchContractSnapshot,
  isValidResearchContractSnapshot,
  validateResearchContractSnapshot,
  type ResearchContractSnapshot,
  type ResearchContractSnapshotInput,
  type ResearchConsent,
  RESEARCH_MANIFEST_VERSION,
  RESEARCH_SERIALIZATION_VERSION,
  RESEARCH_CONTRACT_ROUTE,
  RESEARCH_COHORT,
} from "./index";
import { canonicalizeBytes } from "../domain/canonicalSerialization";
import {
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
} from "../specialist";
import { questionById } from "../data/effectiveQuestions";
import { TAXONOMY_VERSION } from "../data/labelTaxonomy";
import { PRIMARY_MEASUREMENT_VERSION } from "../data/primaryMeasurement";
import { MODIFIER_MEASUREMENT_VERSION } from "../data/modifierMeasurement";

const consent: ResearchConsent = {
  ageConfirmed: true,
  voluntaryParticipation: true,
  dataUseAccepted: true,
  consentVersion: "test-consent",
  consentedAt: "2026-07-18T12:00:00.000Z",
  disclosureSnapshot: {
    endpointConfigured: false,
    transferAndWithdrawalNotice: "No endpoint.",
    retentionNotice: "No retention notice.",
    contactNotice: "No contact configured.",
  },
};

const question: Question = {
  id: "q-test",
  prompt: "Test prompt",
  domain: "test-domain",
  layer: "normative",
  theoryContext: "mixed",
  responseType: "likert7",
  tier: "quick",
  axisWeights: [{ axisId: "test-axis", weight: -1 }],
  reviewStatus: "approved",
  sources: [{ title: "Source", url: "https://example.test/source" }],
  evidenceNote: "Adults in a defined population over one year.",
  contextNote:
    "This is neutral background context for interpreting the item without changing its wording or scoring.",
};

const answers: AnswerMap = {
  "q-test": { questionId: "q-test", value: 2 },
};

const timing = {
  startedAt: "2026-07-18T12:10:00.000Z",
  completedAt: "2026-07-18T12:20:00.000Z",
  resumed: false,
};
function deterministicCoreSubmission() {
  return buildResearchSubmission({
    studyId: "pilot",
    participantId: "p_fixed",
    administration: "test",
    bankVersion: "bank-v1",
    scoringVersion: "score-v1",
    tier: "quick",
    consent,
    identity: {},
    predictedLabelIds: ["market-liberal"],
    answers,
    questions: [question],
    startedAt: timing.startedAt,
    completedAt: timing.completedAt,
    resumed: timing.resumed,
    submissionId: "submission-fixed",
    submittedAt: "2026-07-18T12:30:00.000Z",
  });
}

describe("research submission", () => {
  it("keeps the existing research API while exposing contract snapshots", () => {
    const factory: (
      input: ResearchContractSnapshotInput,
    ) => ResearchContractSnapshot = createResearchContractSnapshot;

    expect(factory).toBe(createResearchContractSnapshot);
    expect(RESEARCH_CONTRACT_VERSION).toBe("research-contract-v1");
    expect(validateResearchContractSnapshot).toBeTypeOf("function");
    expect(isValidResearchContractSnapshot).toBeTypeOf("function");
    expect(buildResearchSubmission).toBeTypeOf("function");
    expect(buildSpecialistResearchSubmission).toBeTypeOf("function");
    expect(buildSpecialistDispositionSubmission).toBeTypeOf("function");
    expect(submitResearchSubmission).toBeTypeOf("function");
    expect(getOrCreateParticipantId).toBeTypeOf("function");
  });
  it("emits deterministic contract metadata and browser observation markers", () => {
    const first = deterministicCoreSubmission();
    const second = deterministicCoreSubmission();

    expect(first.manifestVersion).toBe(RESEARCH_MANIFEST_VERSION);
    expect(first.manifestFingerprint).toBe(
      "045d96d1f6d9416517ae0d59121bca17107caf645874b452afa4df61202e6cdf",
    );
    expect(first.serializationVersion).toBe(RESEARCH_SERIALIZATION_VERSION);
    expect(first.contractRoute).toBe(RESEARCH_CONTRACT_ROUTE);
    expect(first.cohort).toBe(RESEARCH_COHORT);
    expect(first.cohortVersion).toBe("clean-rebuild-v1");
    expect(first.cohortFingerprint).toBe("clean-rebuild-fingerprint-v1");
    expect(first.provenance).toEqual({
      source: "browser",
      capturedAt: "2026-07-18T12:30:00.000Z",
      surface: "research-form",
    });
    expect(first.observations.answers).toMatchObject({
      kind: "browser-observation",
      source: "browser",
      observedAt: timing.completedAt,
    });
    expect(Array.from(canonicalizeBytes(first))).toEqual(
      Array.from(canonicalizeBytes(second)),
    );
  });
  it("emits one complete canonical contract envelope for core records", () => {
    const submission = deterministicCoreSubmission();
    expect(submission.manifestSchemaVersion).toBe("canonical-domain-v2");
    expect(submission.sourceManifestSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(submission.serializationFingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(submission.schemaContractVersion).toBe("research-schema-v1");
    expect(submission.schemaFingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(submission.contractFingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(submission.contractMetadata.snapshot).toBeDefined();
    expect(
      validateResearchContractSnapshot(submission.contractMetadata.snapshot)
        .valid,
    ).toBe(true);
    expect(
      submission.contractMetadata.snapshot?.observations.canonicalItems.value,
    ).toEqual(submission.itemMap);
    expect(
      submission.contractMetadata.snapshot?.observations.canonicalForm.value,
    ).toEqual(submission.form);
  });
  it("rejects partial or caller-overridden contract metadata", () => {
    const base = {
      studyId: "pilot",
      participantId: "p_fixed",
      administration: "test" as const,
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick" as const,
      consent,
      identity: {},
      predictedLabelIds: ["market-liberal"],
      answers,
      questions: [question],
      startedAt: timing.startedAt,
      completedAt: timing.completedAt,
      resumed: false,
    };
    expect(() =>
      buildResearchSubmission({
        ...base,
        contractMetadata: { manifestVersion: RESEARCH_MANIFEST_VERSION },
      }),
    ).toThrow(/canonical browser contract/);
    expect(() =>
      buildResearchSubmission({
        ...base,
        contractMetadata: {
          manifestVersion: "caller-override",
          manifestFingerprint:
            "045d96d1f6d9416517ae0d59121bca17107caf645874b452afa4df61202e6cdf",
          serializationVersion: RESEARCH_SERIALIZATION_VERSION,
          contractVersion: "2026-08-v19",
          contractRoute: RESEARCH_CONTRACT_ROUTE,
          cohort: RESEARCH_COHORT,
          cohortVersion: "clean-rebuild-v1",
          cohortFingerprint: "clean-rebuild-fingerprint-v1",
          provenance: {
            source: "browser",
            capturedAt: "2026-07-18T12:30:00.000Z",
            surface: "research-form",
          },
          refusal: null,
        },
      }),
    ).toThrow(/canonical browser contract/);
  });
  it("copies the final interrogative prompt into research item snapshots", () => {
    const effectiveQuestion = questionById.get("q0067")!;
    const submission = buildResearchSubmission({
      studyId: "prompt-review-test",
      participantId: "p_prompt-review",
      administration: "test",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: { ageBand: "25-34" },
      predictedLabelIds: [],
      answers: {
        q0067: { questionId: "q0067", value: 2 },
      },
      questions: [effectiveQuestion],
      startedAt: "2026-07-18T12:10:00.000Z",
      completedAt: "2026-07-18T12:20:00.000Z",
      resumed: false,
    });

    expect(submission.itemMap[0].prompt).toBe(effectiveQuestion.prompt);
    expect(submission.itemMap[0].prompt.endsWith("?")).toBe(true);
  });

  it("uses a stable pseudonymous participant id", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const first = getOrCreateParticipantId(storage, () => "abc-123");
    const second = getOrCreateParticipantId(storage, () => "different");
    expect(first).toBe("p_abc-123");
    expect(second).toBe(first);
  });

  it("uses separate participant ids for separate studies", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    const firstStudy = getOrCreateParticipantId(
      storage,
      () => "study-one-id",
      "study-one",
    );
    const secondStudy = getOrCreateParticipantId(
      storage,
      () => "study-two-id",
      "study-two",
    );

    expect(firstStudy).toBe("p_study-one-id");
    expect(secondStudy).toBe("p_study-two-id");
  });

  it("builds a versioned core record with item metadata, timing, criterion labels, and specialist assignment", () => {
    const submission = buildResearchSubmission({
      studyId: "pilot one!",
      participantId: "p_abc-123",
      administration: "test",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: {
        selfLabelId: "market-liberal",
        selfReportedIdeologies: "  Mutualism;  Pan-Africanism  ",
        ageBand: "25-34",
      },
      predictedLabelIds: ["market-liberal", "classical-liberalism"],
      predictedModifierIds: ["religious-nationalism", "progressivism"],
      specialistAssignment: {
        moduleId: "feminist-faction-module",
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      answers,
      questions: [question],
      submittedAt: "2026-07-18T12:30:00.000Z",
      ...timing,
    });

    expect(submission.recordType).toBe("core");
    expect(submission.studyId).toBe("pilotone");
    expect(submission.identity.selfLabelId).toBe("market-liberal");
    expect(submission.identity.selfReportedIdeologies).toBe(
      "Mutualism; Pan-Africanism",
    );
    expect(submission.predictedLabelIds).toEqual([
      "market-liberal",
      "classical-liberalism",
    ]);
    expect(submission.predictedModifierIds).toEqual([
      "religious-nationalism",
      "progressivism",
    ]);
    expect(submission.taxonomyVersion).toBe(TAXONOMY_VERSION);
    expect(submission.primaryMeasurementVersion).toBe(
      PRIMARY_MEASUREMENT_VERSION,
    );
    expect(submission.modifierMeasurementVersion).toBe(
      MODIFIER_MEASUREMENT_VERSION,
    );
    expect(submission.primaryLabelIds).toContain("conservative");
    expect(submission.modifierLabelIds).toContain("technocratic-orientation");
    expect(submission.modifierLabelIds).not.toContain("theocrat");
    expect(submission.primaryLabelRosterFingerprint).toBe(
      PRIMARY_LABEL_ROSTER_FINGERPRINT,
    );
    expect(submission.modifierLabelRosterFingerprint).toBe(
      MODIFIER_LABEL_ROSTER_FINGERPRINT,
    );
    expect(submission.specialistAssignment?.moduleId).toBe(
      "feminist-faction-module",
    );
    expect(submission.specialistAssignment?.rosterVersion).toBe(
      SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
    );
    expect(submission.durationMs).toBe(600_000);
    expect(submission.presentationOrder).toEqual(["q-test"]);
    expect(submission.form).toMatchObject({
      assignedItemCount: 1,
      requestedItemCount: null,
    });
    expect(submission.form.fingerprint).toMatch(/^rf_[0-9a-f]{8}$/);
    expect(submission.sampling).toEqual({
      design: "open-opt-in-nonprobability",
      populationInference: false,
      weighting: "none",
      recruitmentSource: "direct-or-unknown",
      recruitmentSourceProvenance: "url-parameter-unverified",
    });
    expect(submission.itemMap[0]).toMatchObject({
      questionId: "q-test",
      prompt: "Test prompt",
      domain: "test-domain",
      theoryContext: "mixed",
      reverseScored: false,
      contextNote:
        "This is neutral background context for interpreting the item without changing its wording or scoring.",
      sourceCount: 1,
    });
    expect(submission.itemMap[0].responseOptions).toContainEqual({
      value: "prefer_not_to_answer",
      label: "Prefer not to answer",
    });
  });

  it("builds a separate specialist record with construct weights and pre-result self-identification", () => {
    const submission = buildSpecialistResearchSubmission({
      studyId: "pilot",
      participantId: "p_abc-123",
      administration: "test",
      consent,
      moduleId: "feminist-faction-module",
      moduleVersion: "2026-08-v1",
      assignment: {
        moduleId: "feminist-faction-module",
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      criterion: {
        selectedIds: ["liberal-feminism"],
        noneOrUnsure: false,
        confidence: "high",
      },
      answers,
      questions: [question],
      constructWeightsByQuestionId: {
        "q-test": { "legal-equality-reform": 1 },
      },
      outcome: {
        moduleId: "feminist-faction-module",
        constructScores: { "legal-equality-reform": 0.8 },
        matches: [
          {
            id: "liberal-feminism",
            name: "Liberal Feminism",
            status: "existing-primary",
            fit: 0.9,
          },
        ],
      },
      submittedAt: "2026-07-18T12:30:00.000Z",
      startedAt: timing.startedAt,
      completedAt: timing.completedAt,
    });

    expect(submission.recordType).toBe("specialist");
    expect(submission.moduleId).toBe("feminist-faction-module");
    expect(submission.criterion.selectedIds).toEqual(["liberal-feminism"]);
    expect(submission.constructScores["legal-equality-reform"]).toBe(0.8);
    expect(submission.itemMap[0].constructWeights).toEqual({
      "legal-equality-reform": 1,
    });
    expect(submission.durationMs).toBe(600_000);
    expect(submission.manifestVersion).toBe(RESEARCH_MANIFEST_VERSION);
    expect(submission.serializationVersion).toBe(
      RESEARCH_SERIALIZATION_VERSION,
    );
    expect(submission.observations.constructScores).toMatchObject({
      kind: "browser-observation",
      source: "browser",
    });
  });

  it("builds a lightweight specialist disposition record for explicit nonresponse", () => {
    const submission = buildSpecialistDispositionSubmission({
      studyId: "pilot",
      participantId: "p_abc-123",
      administration: "test",
      consent,
      moduleId: "identity-sovereignty-module",
      moduleVersion: "2026-08-v1",
      assignment: {
        moduleId: "identity-sovereignty-module",
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      disposition: "declined-after-partial",
      answeredCount: 4,
      startedAt: "2026-07-18T12:10:00.000Z",
      occurredAt: "2026-07-18T12:14:00.000Z",
    });

    expect(submission.recordType).toBe("specialist-disposition");
    expect(submission.disposition).toBe("declined-after-partial");
    expect(submission.answeredCount).toBe(4);
    expect(submission.durationMs).toBe(240_000);
    expect(submission.manifestVersion).toBe(RESEARCH_MANIFEST_VERSION);
    expect(submission.serializationVersion).toBe(
      RESEARCH_SERIALIZATION_VERSION,
    );
    expect(submission.refusal).toEqual({
      status: "refused",
      reason: "declined-after-partial",
      refusedAt: "2026-07-18T12:14:00.000Z",
    });
    expect(submission.provenance).toMatchObject({
      source: "browser",
      capturedAt: "2026-07-18T12:14:00.000Z",
    });
    expect(submission.observations.disposition).toMatchObject({
      kind: "browser-observation",
      source: "browser",
    });
  });

  it("does not transmit when no endpoint is configured", async () => {
    const send = vi.fn<typeof fetch>();
    const submission = buildResearchSubmission({
      studyId: "pilot",
      participantId: "p_1",
      administration: "test",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    });
    await expect(
      submitResearchSubmission(submission, undefined, send),
    ).resolves.toEqual({ status: "export-only" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a record whose answers do not match its assigned instrument", () => {
    expect(() =>
      buildResearchSubmission({
        studyId: "pilot",
        participantId: "p_1",
        administration: "test",
        bankVersion: "bank-v1",
        scoringVersion: "score-v1",
        tier: "quick",
        consent,
        identity: {},
        predictedLabelIds: [],
        answers: {},
        questions: [question],
        ...timing,
      }),
    ).toThrow(/answer coverage mismatch/i);
  });

  it("posts JSON without credentials to a configured HTTPS endpoint", async () => {
    const send = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 202 }));
    const submission = buildResearchSubmission({
      studyId: "pilot",
      participantId: "p_1",
      administration: "retest",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    });

    await expect(
      submitResearchSubmission(
        submission,
        "https://study.example.test/submit",
        send,
      ),
    ).resolves.toEqual({
      status: "submitted",
      endpoint: "https://study.example.test/submit",
    });
    expect(send).toHaveBeenCalledWith(
      "https://study.example.test/submit",
      expect.objectContaining({
        method: "POST",
        credentials: "omit",
        referrerPolicy: "no-referrer",
      }),
    );
  });

  it("rejects insecure remote endpoints before sending", async () => {
    const send = vi.fn<typeof fetch>();
    const submission = buildResearchSubmission({
      studyId: "pilot",
      participantId: "p_1",
      administration: "test",
      bankVersion: "bank-v1",
      scoringVersion: "score-v1",
      tier: "quick",
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    });
    await expect(
      submitResearchSubmission(
        submission,
        "http://study.example.test/submit",
        send,
      ),
    ).resolves.toEqual({
      status: "failed",
      reason: "The website collection endpoint must use HTTPS.",
    });
    expect(send).not.toHaveBeenCalled();
  });
});
