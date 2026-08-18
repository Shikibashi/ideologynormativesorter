import { describe, expect, it } from "vitest";
import { CANONICAL_JSON_VERSION } from "../domain/canonicalSerialization";
import {
  CANONICAL_MANIFEST,
  type CanonicalManifest as Manifest,
} from "../domain/canonicalManifest";
import { createCanonicalRegistry } from "../domain/registry";
import {
  RESEARCH_CONTRACT_VERSION,
  createResearchContractSnapshot,
  validateResearchContractSnapshot,
  type ResearchContractSnapshot,
  type ResearchContractSnapshotInput,
} from "./contractSnapshot";

const manifest: Manifest = {
  ...CANONICAL_MANIFEST,
  metadata: {
    ...CANONICAL_MANIFEST.metadata,
    schemaVersion: "canonical-domain-v1",
    version: "manifest-test-v1",
    fingerprint: "mf_test_001",
  },
};

const input: ResearchContractSnapshotInput = {
  registry: createCanonicalRegistry(manifest),
  serialization: {
    version: CANONICAL_JSON_VERSION,
    fingerprint: "sf_test_001",
    schema: { arraySemantics: "ordered" },
  },
  schema: { version: "research-schema-test-v1", fingerprint: "rf_test_001" },
  cohort: { version: "cohort-test-v1", fingerprint: "cf_test_001" },
  study: { studyId: "study-test", cohortId: "cohort-test" },
  form: {
    contractRoute: "research-browser",
    cohort: "community-2026-v5",
    formId: "core-test",
    formVersion: "form-test-v1",
    fingerprint: "ff_test_001",
  },
  provenance: {
    source: "browser",
    capturedAt: "2026-08-18T12:00:00.000Z",
    surface: "research-form",
  },
  consent: {
    consentVersion: "consent-test-v1",
    consentedAt: "2026-08-18T11:59:00.000Z",
  },
  observations: {
    primaryLabelIds: {
      kind: "browser-observation",
      source: "browser",
      value: ["label-a"],
    },
  },
};

function validSnapshot(): ResearchContractSnapshot {
  return createResearchContractSnapshot(input);
}

describe("research contract snapshot", () => {
  it("copies canonical metadata and freezes authority and observations", () => {
    const snapshot = validSnapshot();

    expect(snapshot.contractVersion).toBe(RESEARCH_CONTRACT_VERSION);
    expect(snapshot.manifestVersion).toBe("manifest-test-v1");
    expect(snapshot.manifestFingerprint).toBe("mf_test_001");
    expect(snapshot.serializationVersion).toBe(CANONICAL_JSON_VERSION);
    expect(snapshot.schemaFingerprint).toBe("rf_test_001");
    expect(snapshot.cohortFingerprint).toBe("cf_test_001");
    expect(snapshot.form.contractRoute).toBe("research-browser");
    expect(snapshot.form.cohort).toBe("community-2026-v5");
    expect(snapshot.observations.primaryLabelIds.kind).toBe(
      "browser-observation",
    );
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.form)).toBe(true);
    expect(Object.isFrozen(snapshot.observations.primaryLabelIds)).toBe(true);
    expect(validateResearchContractSnapshot(snapshot)).toMatchObject({
      valid: true,
      ok: true,
      issues: [],
    });
  });
  it("records refusal instead of consent without treating it as a result", () => {
    const snapshot = createResearchContractSnapshot({
      ...input,
      consent: null,
      refusal: {
        reason: "participant declined",
        refusedAt: "2026-08-18T12:00:00.000Z",
      },
    });

    expect(snapshot.consent).toBeNull();
    expect(snapshot.refusal?.reason).toBe("participant declined");
    expect(validateResearchContractSnapshot(snapshot).valid).toBe(true);
  });

  it("fails closed on mixed serialization versions", () => {
    const snapshot = validSnapshot();
    const result = validateResearchContractSnapshot({
      ...snapshot,
      serializationVersion: "canonical-json-v2",
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some((entry) => entry.code === "mixed-version")).toBe(
      true,
    );
  });

  it("fails closed when browser provenance is missing", () => {
    const snapshot = validSnapshot();
    const result = validateResearchContractSnapshot({
      ...snapshot,
      provenance: null,
    });

    expect(result.valid).toBe(false);
    expect(
      result.issues.some((entry) => entry.code === "missing-provenance"),
    ).toBe(true);
  });

  it("rejects production mutation fields", () => {
    const snapshot = validSnapshot();
    const result = validateResearchContractSnapshot({
      ...snapshot,
      observations: {
        ...snapshot.observations,
        result: {
          kind: "browser-observation",
          source: "browser",
          value: { score: 0 },
          productionMutation: { target: "registry" },
        },
      },
    });

    expect(result.valid).toBe(false);
    expect(
      result.issues.some((entry) => entry.code === "production-mutation"),
    ).toBe(true);
  });

  it("rejects Context-role leakage from observations", () => {
    const snapshot = validSnapshot();
    const result = validateResearchContractSnapshot({
      ...snapshot,
      observations: {
        ...snapshot.observations,
        result: {
          kind: "browser-observation",
          source: "browser",
          value: { publicRoleStatus: "context" },
        },
      },
    });

    expect(result.valid).toBe(false);
    expect(
      result.issues.some((entry) => entry.code === "context-leakage"),
    ).toBe(true);
  });
});
