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
    EXPECTED_SCHEMA_VERSION: "2026-08-v15",
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
    },
  ];
  return {
    schemaVersion: "2026-08-v15",
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
