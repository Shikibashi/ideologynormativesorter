import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleRequest, researchFormFingerprint } from "./src/worker.mjs";

const ORIGIN = "https://ideologynormativesorter.edriffles.us";

class FakeDatabase {
  constructor() {
    this.rows = new Map();
  }

  prepare(query) {
    const database = this;
    let parameters = [];
    return {
      bind(...values) {
        parameters = values;
        return this;
      },
      async first() {
        if (!query.startsWith("SELECT payload_sha256"))
          throw new Error(`Unexpected SELECT: ${query}`);
        const row = database.rows.get(parameters[0]);
        return row ? { payload_sha256: row.payload_sha256 } : null;
      },
      async run() {
        if (!query.startsWith("INSERT OR IGNORE INTO submissions"))
          throw new Error(`Unexpected INSERT: ${query}`);
        database.rows.set(parameters[0], {
          submission_id: parameters[0],
          record_type: parameters[1],
          participant_id: parameters[2],
          study_id: parameters[3],
          schema_version: parameters[4],
          received_at: parameters[5],
          payload_sha256: parameters[6],
          payload_json: parameters[7],
        });
        return { success: true };
      },
    };
  }
}

function environment(overrides = {}) {
  return {
    ALLOWED_ORIGIN: ORIGIN,
    EXPECTED_STUDY_ID: "community-2026-v5",
    EXPECTED_SCHEMA_VERSION: "2026-08-v17",
    EXPECTED_RESEARCH_TASK_FORM_VERSION: "2026-08-research-task-form-v1",
    EXPECTED_RESEARCH_TASK_BANK_VERSION: "2026-08-research-task-bank-v2",
    EXPECTED_LABEL_EXPOSURE_VERSION: "2026-08-label-exposure-v1",
    EXPECTED_CONSENT_VERSION: "2026-08-12-v8",
    EXPECTED_QUALITY_RULE_VERSION: "data-quality-v2",
    EXPECTED_FORM_VERSION: "profile-form-v3",
    EXPECTED_BANK_VERSION: "bank-v1",
    EXPECTED_SCORING_VERSION: "scoring-v1",
    EXPECTED_TAXONOMY_VERSION: "taxonomy-v1",
    EXPECTED_PRIMARY_MEASUREMENT_VERSION: "primary-measurement-v1",
    EXPECTED_MODIFIER_MEASUREMENT_VERSION: "modifier-measurement-v1",
    EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT: "lr_6e7558bc",
    EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT: "lr_28f0d466",
    EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY: "balanced-hash-v2",
    EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION:
      "2026-08-specialist-roster-v1",
    EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS:
      "feminist-faction-module,identity-sovereignty-module,anarchist-families-module,green-morphology-module,socialist-families-module,conservative-variants-module,religious-national-politics-module,technology-governance-module,monarchist-municipal-module",
    EXPECTED_MODERATE_ITEM_COUNT: "1",
    EXPECTED_EXTENSIVE_ITEM_COUNT: "2",
    ALLOWED_LEGACY_MODERATE_ITEM_COUNTS: "3",
    ALLOWED_LEGACY_EXTENSIVE_ITEM_COUNTS: "1",
    ALLOWED_MATRIX_ITEM_COUNTS: "1",
    MAXIMUM_BODY_BYTES: "2000000",
    DB: new FakeDatabase(),
    RESEARCH_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  };
}

function versionBundle(formVersion = "profile-form-v3") {
  return {
    architectureVersion: "2026-08-measurement-architecture-v1",
    implementationSpecVersion: "2026-08-implementation-spec-v1",
    decisionLogVersion: "2026-08-methodological-decisions-v1",
    bankVersion: "bank-v1",
    scoringVersion: "scoring-v1",
    taxonomyVersion: "taxonomy-v1",
    primaryMeasurementVersion: "primary-measurement-v1",
    modifierMeasurementVersion: "modifier-measurement-v1",
    formVersion,
    schemaVersion: "2026-08-v17",
    consentVersion: "2026-08-12-v8",
    qualityRuleVersion: "data-quality-v2",
    studyId: "community-2026-v5",
    specialistRosterVersion: "2026-08-specialist-roster-v1",
    specialistAssignmentStrategy: "balanced-hash-v2",
    researchTaskBankVersion: "2026-08-research-task-bank-v2",
    researchEstimatorVersion: "2026-08-research-estimators-v1",
    descriptiveCalibrationVersion: "2026-08-descriptive-calibration-v1",
    strategyTaskBankVersion: "2026-08-strategy-task-bank-v1",
    normativeTradeoffVersion: "2026-08-normative-tradeoff-v1",
    modelComparisonVersion: "2026-08-model-comparison-v1",
    unfoldingAnalysisVersion: "2026-08-unfolding-analysis-v1",
    perceptionGeometryVersion: "2026-08-perception-geometry-v1",
    profileDiscoveryVersion: "2026-08-profile-discovery-v1",
    prototypeCodingVersion: "2026-08-prototype-coding-v1",
    deploymentScopeVersion: "2026-08-deployment-scope-v1",
    constructFamilyMapVersion: "2026-08-construct-family-map-v1",
    criterionPlanVersion: "2026-08-criterion-plan-v1",
    validatorBatteryVersion: "2026-08-validator-battery-v1",
    prototypeCalibrationVersion: "2026-08-prototype-calibration-v1",
    difPlanVersion: "2026-08-dif-plan-v1",
    contentReviewVersion: "2026-08-content-review-v1",
    cognitiveReviewVersion: "2026-08-cognitive-review-v1",
    labelExposureVersion: "2026-08-label-exposure-v1",
    formEquivalenceVersion: "2026-08-form-equivalence-v1",
    anchorRotationVersion: "2026-08-anchor-rotation-v1",
    validationReportVersion: "2026-08-validation-report-v1",
    itemMetadataVersion: "2026-08-item-metadata-v1",
  };
}

function hash32(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function coreSubmission(overrides = {}) {
  const itemMap = [
    {
      questionId: "q0001",
      prompt: "Public authority requires justification.",
      helpText: "Choose the response closest to your view.",
      domain: "state-legitimacy",
      layer: "normative",
      responseOptions: [
        { value: -1, label: "Disagree" },
        { value: 0, label: "Neither" },
        { value: 1, label: "Agree" },
        { value: "prefer_not_to_answer", label: "Prefer not to answer" },
      ],
      familyId: "domain:state-legitimacy",
      calibrationEligibility: "pending-review",
      wordingFormId: "2026-08-item-metadata-v1:q0001",
      responseProcessTags: ["likert5"],
    },
  ];
  return {
    schemaVersion: "2026-08-v17",
    submissionId: "submission_1",
    recordType: "core",
    studyId: "community-2026-v5",
    participantId: "p_test",
    administration: "test",
    submittedAt: "2026-08-10T12:02:00.000Z",
    startedAt: "2026-08-10T12:00:00.000Z",
    completedAt: "2026-08-10T12:02:00.000Z",
    durationMs: 120000,
    consent: {
      ageConfirmed: true,
      voluntaryParticipation: true,
      dataUseAccepted: true,
      consentVersion: "2026-08-12-v8",
      consentedAt: "2026-08-10T12:00:00.000Z",
      disclosureSnapshot: {
        endpointConfigured: true,
        transferAndWithdrawalNotice:
          "Responses are sent to the website endpoint.",
        retentionNotice: "Records are retained for a published period.",
        contactNotice: "A site-owner contact is published.",
      },
    },
    locale: "en-US",
    qualityRuleVersion: "data-quality-v2",
    resumed: false,
    presentationOrder: ["q0001"],
    form: {
      algorithmVersion: "profile-form-v3",
      requestedItemCount: null,
      assignedItemCount: 1,
      fingerprint: researchFormFingerprint(itemMap),
    },
    sampling: {
      design: "open-opt-in-nonprobability",
      populationInference: false,
      weighting: "none",
      recruitmentSource: "direct-or-unknown",
      recruitmentSourceProvenance: "url-parameter-unverified",
    },
    bankVersion: "bank-v1",
    scoringVersion: "scoring-v1",
    taxonomyVersion: "taxonomy-v1",
    primaryMeasurementVersion: "primary-measurement-v1",
    modifierMeasurementVersion: "modifier-measurement-v1",
    primaryLabelIds: ["conservative"],
    modifierLabelIds: ["progressivism"],
    primaryLabelRosterFingerprint: "lr_6e7558bc",
    modifierLabelRosterFingerprint: "lr_28f0d466",
    tier: "moderate",
    identity: {},
    predictedLabelIds: [],
    predictedModifierIds: [],
    answers: { q0001: { questionId: "q0001", value: 1 } },
    itemMap,
    versionBundle: versionBundle(),
    ...overrides,
  };
}

function researchTaskSubmission(overrides = {}) {
  const task = {
    id: "forecast-state-capacity-001",
    version: "2026-08-research-task-bank-v2",
    domainId: "state-legitimacy",
    layer: "descriptive",
    theoryContext: "nonideal",
    prompt: "Estimate the outcome probability.",
    criterionIds: ["forecast-outcome-state-capacity-001"],
    randomizationSeedKey: "forecast-state-capacity-001",
    kind: "forecast",
    propositionId: "public-service-target-001",
    outcomeId: "target-reached-under-frozen-definition-001",
    horizon: "24 months after study close",
    probabilityScale: "0-100",
    allowDontKnow: true,
    resolutionSource: "study-outcome-register-v1",
    outcomeVersion: "outcome-register-v1",
  };
  const presentationOrder = [task.id];
  const assignment = {
    taskBankVersion: "2026-08-research-task-bank-v2",
    arm: "probability",
    participantSeed: "2026-08-research-task-bank-v2:p_task:probability",
    taskIds: [task.id],
    presentationOrder,
    fingerprint: `rt_${hash32(
      `2026-08-research-task-bank-v2:${presentationOrder.join("|")}`,
    )
      .toString(16)
      .padStart(8, "0")}`,
  };
  return {
    ...coreSubmission({
      submissionId: "task_submission_1",
      participantId: "p_task",
    }),
    recordType: "research-task",
    taskBankVersion: "2026-08-research-task-bank-v2",
    arm: "probability",
    assignment,
    presentationOrder,
    form: {
      algorithmVersion: "2026-08-research-task-form-v1",
      assignedTaskCount: 1,
      fingerprint: assignment.fingerprint,
    },
    tasks: [task],
    responses: [{ taskId: task.id, kind: "forecast", probability: 50 }],
    versionBundle: versionBundle("2026-08-research-task-form-v1"),
    ...overrides,
  };
}

function postRequest(body, origin = ORIGIN) {
  return new Request("https://collector.example/submit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": "203.0.113.10",
      origin,
    },
    body: JSON.stringify(body),
  });
}

describe("research contribution Worker", () => {
  it("accepts a valid contribution and deduplicates an exact retry", async () => {
    const env = environment();
    const submission = coreSubmission();

    const first = await handleRequest(postRequest(submission), env);
    assert.equal(first.status, 202);
    assert.deepEqual(await first.json(), {
      accepted: true,
      submissionId: "submission_1",
      deduplicated: false,
    });

    const retry = await handleRequest(postRequest(submission), env);
    assert.equal(retry.status, 202);
    assert.equal((await retry.json()).deduplicated, true);
    assert.equal(env.DB.rows.size, 1);
  });

  it("rejects stale measurement metadata", async () => {
    const env = environment();

    for (const field of [
      "bankVersion",
      "scoringVersion",
      "taxonomyVersion",
      "primaryMeasurementVersion",
      "modifierMeasurementVersion",
      "primaryLabelRosterFingerprint",
      "modifierLabelRosterFingerprint",
    ]) {
      const submission = coreSubmission({ [field]: `${field}-stale` });
      const response = await handleRequest(postRequest(submission), env);
      assert.equal(response.status, 422);
    }
  });

  it("rejects roster tampering and result IDs outside the declared active rosters", async () => {
    const env = environment();
    const invalidSubmissions = [
      coreSubmission({ primaryLabelIds: ["market-liberal"] }),
      coreSubmission({ modifierLabelIds: ["populism"] }),
      coreSubmission({ predictedLabelIds: ["market-liberal"] }),
      coreSubmission({ predictedModifierIds: ["populism"] }),
    ];

    for (const [index, submission] of invalidSubmissions.entries()) {
      submission.submissionId = `submission_roster_${index}`;
      assert.equal(
        (await handleRequest(postRequest(submission), env)).status,
        422,
      );
    }
  });

  it("accepts only the frozen balanced-hash specialist assignment", async () => {
    const env = environment();
    const assignment = {
      moduleId: "anarchist-families-module",
      strategy: "balanced-hash-v2",
      rosterVersion: "2026-08-specialist-roster-v1",
    };

    assert.equal(
      (
        await handleRequest(
          postRequest(
            coreSubmission({
              submissionId: "submission_assigned",
              specialistAssignment: assignment,
            }),
          ),
          env,
        )
      ).status,
      202,
    );

    for (const [suffix, invalidAssignment] of [
      ["strategy", { ...assignment, strategy: "balanced-hash-v1" }],
      ["roster", { ...assignment, rosterVersion: "stale-roster" }],
      ["module", { ...assignment, moduleId: "socialist-families-module" }],
    ]) {
      assert.equal(
        (
          await handleRequest(
            postRequest(
              coreSubmission({
                submissionId: `submission_assigned_${suffix}`,
                specialistAssignment: invalidAssignment,
              }),
            ),
            env,
          )
        ).status,
        422,
      );
    }
  });

  it("accepts the configured full-depth profile and a controlled matrix form", async () => {
    const env = environment();
    const base = coreSubmission();
    const secondItem = { ...base.itemMap[0], questionId: "q0002" };
    const fullItemMap = [base.itemMap[0], secondItem];
    const full = coreSubmission({
      submissionId: "submission_full",
      tier: "extensive",
      itemMap: fullItemMap,
      presentationOrder: ["q0001", "q0002"],
      answers: {
        q0001: { questionId: "q0001", value: 1 },
        q0002: { questionId: "q0002", value: 1 },
      },
      form: {
        algorithmVersion: "profile-form-v3",
        requestedItemCount: null,
        assignedItemCount: 2,
        fingerprint: researchFormFingerprint(fullItemMap),
      },
    });
    const matrix = coreSubmission({
      submissionId: "submission_matrix",
      form: { ...base.form, requestedItemCount: 1 },
    });
    const legacyFull = coreSubmission({
      submissionId: "submission_legacy_full",
      tier: "extensive",
    });

    assert.equal((await handleRequest(postRequest(full), env)).status, 202);
    assert.equal((await handleRequest(postRequest(matrix), env)).status, 202);
    assert.equal(
      (await handleRequest(postRequest(legacyFull), env)).status,
      202,
    );
  });

  it("accepts a valid post-response label-exposure outcome and rejects invalid ratings", async () => {
    const env = environment();
    const valid = coreSubmission({
      submissionId: "submission_exposure",
      labelExposure: {
        assignment: {
          version: "2026-08-label-exposure-v1",
          studyId: "community-2026-v5",
          participantId: "p_test",
          arm: "named-label",
          seed: "community-2026-v5_p_test_label-exposure-v1",
          assignedAfterSubstantiveResponses: true,
        },
        exposureShown: true,
        exposedLabelIds: ["conservative"],
        perceivedAccuracy: 4,
        identityAcceptance: 3,
        confidence: 4,
        affect: 2,
      },
    });
    assert.equal((await handleRequest(postRequest(valid), env)).status, 202);
    const invalid = coreSubmission({
      submissionId: "submission_exposure_invalid",
      labelExposure: {
        ...valid.labelExposure,
        perceivedAccuracy: 6,
      },
    });
    assert.equal((await handleRequest(postRequest(invalid), env)).status, 422);
  });

  it("accepts a complete task record and rejects a mixed version bundle", async () => {
    const env = environment();
    const valid = researchTaskSubmission();
    assert.equal((await handleRequest(postRequest(valid), env)).status, 202);
    const invalid = researchTaskSubmission({
      submissionId: "task_submission_invalid",
      versionBundle: {
        ...valid.versionBundle,
        itemMetadataVersion: "stale-item-metadata",
      },
    });
    assert.equal((await handleRequest(postRequest(invalid), env)).status, 422);
  });

  it("rejects a conflicting payload that reuses a submission ID", async () => {
    const env = environment();
    await handleRequest(postRequest(coreSubmission()), env);
    const conflict = await handleRequest(
      postRequest(coreSubmission({ locale: "fr" })),
      env,
    );
    assert.equal(conflict.status, 409);
    assert.deepEqual(await conflict.json(), {
      error: "submission-id-conflict",
    });
  });

  it("rejects untrusted origins and invalid form sizes", async () => {
    const env = environment();
    const forbidden = await handleRequest(
      postRequest(coreSubmission(), "https://attacker.example"),
      env,
    );
    assert.equal(forbidden.status, 403);
    assert.equal(forbidden.headers.get("access-control-allow-origin"), null);

    const invalid = await handleRequest(
      postRequest(coreSubmission({ itemMap: [] })),
      env,
    );
    assert.equal(invalid.status, 422);
  });

  it("returns 429 before persistence when the edge rate limit is exhausted", async () => {
    const env = environment({
      RESEARCH_RATE_LIMITER: { limit: async () => ({ success: false }) },
    });
    const response = await handleRequest(postRequest(coreSubmission()), env);
    assert.equal(response.status, 429);
    assert.equal(env.DB.rows.size, 0);
  });
});
