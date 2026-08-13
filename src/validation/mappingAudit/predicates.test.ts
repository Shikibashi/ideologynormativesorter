import { describe, it, expect } from "vitest";
import {
  isApprovedDisposition,
  isUnresolvedActive,
  isMatchPoolMember,
  isExpertGateSatisfied,
  releaseGate,
} from "./predicates";
import type {
  AuditFinding,
  IdeologyDossier,
  ClaimMatrixEntry,
  ReviewRecord,
  ReleaseSummary,
} from "./types";

// ---------------------------------------------------------------------------
// Minimal synthetic fixtures
// ---------------------------------------------------------------------------

const baseFinding = {
  findingId: "finding:sign-inversion:q0001:1",
  severity: "major",
  issueClass: "sign-inversion",
  subjectIds: ["q0001"],
  inventorySet: "overlay",
  evidence: "weight sign wrong",
  evidenceCiteIds: [],
  proposedDisposition: "correct-overlay",
  lifecycle: "proposed",
  versionImpact: "semantic-overlay",
  linkedTestIds: [],
} as const satisfies Partial<AuditFinding>;

function finding(overrides: Partial<AuditFinding> = {}): AuditFinding {
  return { ...baseFinding, ...overrides } as AuditFinding;
}

const baseDossier = {
  dossierId: "dossier:social-democracy",
  labelId: "social-democracy",
  lifecycle: "active",
  family: "socialism",
  aliases: [],
  survivorOf: [],
  claims: [],
  centroid: {},
  centroidRationales: {},
  matchPoolMember: true,
  linkedFindingIds: [],
  linkedTestIds: [],
  provisionalExpertOnly: false,
} as const satisfies Partial<IdeologyDossier>;

function dossier(overrides: Partial<IdeologyDossier> = {}): IdeologyDossier {
  return { ...baseDossier, ...overrides } as IdeologyDossier;
}

function claim(overrides: Partial<ClaimMatrixEntry> = {}): ClaimMatrixEntry {
  return {
    claimId: "claim:social-democracy:definition:1",
    labelId: "social-democracy",
    fieldPath: "definition",
    statement: "test claim",
    primaryCiteId: "cite:abc",
    scholarlyCiteIds: ["cite:a", "cite:b"],
    perspectives: {
      sympathetic: { text: "s" },
      critical: { text: "c" },
      neutral: { text: "n" },
    },
    textualStatus: "pass",
    expertStatus: "pass",
    empiricalStatus: "insufficient-data",
    ...overrides,
  } as ClaimMatrixEntry;
}

function review(overrides: Partial<ReviewRecord> = {}): ReviewRecord {
  return {
    reviewId: "review:finding:sign-inversion:q0001:1:domain:1",
    findingId: "finding:sign-inversion:q0001:1",
    role: "domain",
    qualificationStatus: "qualified-expert",
    reviewerKey: "expert-1",
    decision: "correct-overlay",
    rationale: "confirmed",
    evidenceCiteIds: [],
    timestamp: "2026-07-01T00:00:00Z",
    bankVersion: "2026-06-v4",
    scoringVersion: "2026-07-18-semantic-v3",
    linkedTestIds: [],
    ...overrides,
  } as ReviewRecord;
}

function releaseSummary(
  overrides: Partial<ReleaseSummary> = {},
): ReleaseSummary {
  return {
    releaseId: "release:2026-06-v4:2026-07-18-semantic-v3",
    generatedAt: "2026-07-19T00:00:00Z",
    generatedFrom: {
      bankFingerprint: "fp-live",
      scoringVersion: "sv-live",
    },
    totalContributions: 100,
    totalDossiers: 16,
    totalFindings: 5,
    unresolvedActiveCount: 0,
    gateStatuses: [],
    linkedTestIds: [],
    ...overrides,
  } as ReleaseSummary;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("isApprovedDisposition", () => {
  it("returns true for approved lifecycle with both reviews", () => {
    const f = finding({
      lifecycle: "approved",
      domainReviewId: "review:1",
      measurementReviewId: "review:2",
    });
    expect(isApprovedDisposition(f)).toBe(true);
  });

  it("returns true for applied lifecycle with both reviews", () => {
    const f = finding({
      lifecycle: "applied",
      domainReviewId: "review:1",
      measurementReviewId: "review:2",
    });
    expect(isApprovedDisposition(f)).toBe(true);
  });

  it("returns false for proposed lifecycle", () => {
    const f = finding({
      lifecycle: "proposed",
      domainReviewId: "review:1",
      measurementReviewId: "review:2",
    });
    expect(isApprovedDisposition(f)).toBe(false);
  });

  it("returns false when domain review is missing", () => {
    const f = finding({
      lifecycle: "approved",
      measurementReviewId: "review:2",
    });
    expect(isApprovedDisposition(f)).toBe(false);
  });

  it("returns false when measurement review is missing", () => {
    const f = finding({
      lifecycle: "approved",
      domainReviewId: "review:1",
    });
    expect(isApprovedDisposition(f)).toBe(false);
  });
});

describe("isUnresolvedActive", () => {
  it("returns true for proposed without reviews", () => {
    const f = finding({ lifecycle: "proposed" });
    expect(isUnresolvedActive(f)).toBe(true);
  });

  it("returns true for domain-reviewed", () => {
    const f = finding({ lifecycle: "domain-reviewed" });
    expect(isUnresolvedActive(f)).toBe(true);
  });

  it("returns true for measurement-reviewed", () => {
    const f = finding({ lifecycle: "measurement-reviewed" });
    expect(isUnresolvedActive(f)).toBe(true);
  });

  it("returns true for adjudicated", () => {
    const f = finding({ lifecycle: "adjudicated" });
    expect(isUnresolvedActive(f)).toBe(true);
  });

  it("returns false for approved", () => {
    const f = finding({
      lifecycle: "approved",
      domainReviewId: "review:1",
      measurementReviewId: "review:2",
    });
    expect(isUnresolvedActive(f)).toBe(false);
  });

  it("returns false for superseded", () => {
    const f = finding({ lifecycle: "superseded" });
    expect(isUnresolvedActive(f)).toBe(false);
  });
});

describe("isMatchPoolMember", () => {
  it("returns true for active with matchPoolMember=true and no mergedInto", () => {
    const d = dossier({ lifecycle: "active", matchPoolMember: true });
    expect(isMatchPoolMember(d)).toBe(true);
  });

  it("returns true for survivor with matchPoolMember=true", () => {
    const d = dossier({ lifecycle: "survivor", matchPoolMember: true });
    expect(isMatchPoolMember(d)).toBe(true);
  });

  it("returns true for split-active with matchPoolMember=true", () => {
    const d = dossier({ lifecycle: "split-active", matchPoolMember: true });
    expect(isMatchPoolMember(d)).toBe(true);
  });

  it("returns false for deactivated", () => {
    const d = dossier({ lifecycle: "deactivated", matchPoolMember: true });
    expect(isMatchPoolMember(d)).toBe(false);
  });

  it("returns false for merged-away", () => {
    const d = dossier({
      lifecycle: "merged-away",
      matchPoolMember: true,
      mergedInto: "democratic-socialism" as string,
    });
    expect(isMatchPoolMember(d)).toBe(false);
  });

  it("returns false when matchPoolMember is false", () => {
    const d = dossier({ lifecycle: "active", matchPoolMember: false });
    expect(isMatchPoolMember(d)).toBe(false);
  });

  it("returns false when mergedInto is set even if lifecycle is active", () => {
    const d = dossier({
      lifecycle: "active",
      matchPoolMember: true,
      mergedInto: "other-label" as string,
    });
    expect(isMatchPoolMember(d)).toBe(false);
  });
});

describe("isExpertGateSatisfied", () => {
  it("returns true when all claims pass and all reviewers are qualified-expert", () => {
    const claims = [
      claim({ expertStatus: "pass" }),
      claim({ expertStatus: "pass" }),
    ];
    const reviews = [
      review({ qualificationStatus: "qualified-expert" }),
      review({ qualificationStatus: "qualified-expert" }),
    ];
    expect(isExpertGateSatisfied(claims, reviews)).toBe(true);
  });

  it("returns false when one reviewer is provisional-agent", () => {
    const claims = [claim({ expertStatus: "pass" })];
    const reviews = [
      review({ qualificationStatus: "qualified-expert" }),
      review({ qualificationStatus: "provisional-agent" }),
    ];
    expect(isExpertGateSatisfied(claims, reviews)).toBe(false);
  });

  it("returns false when one claim expertStatus is not pass", () => {
    const claims = [
      claim({ expertStatus: "pass" }),
      claim({ expertStatus: "fail" }),
    ];
    const reviews = [review({ qualificationStatus: "qualified-expert" })];
    expect(isExpertGateSatisfied(claims, reviews)).toBe(false);
  });

  it("returns true for empty claims and empty reviews", () => {
    expect(isExpertGateSatisfied([], [])).toBe(true);
  });
});

describe("releaseGate", () => {
  const acceptableGates = [
    {
      gate: "expert" as const,
      status: "pass" as const,
      subjectId: "mapping-audit:catalog",
      updatedAt: "2026-07-01T00:00:00Z",
      evidenceRefs: [],
    },
    {
      gate: "empirical" as const,
      status: "insufficient-data" as const,
      subjectId: "mapping-audit:catalog",
      updatedAt: "2026-07-01T00:00:00Z",
      evidenceRefs: [],
    },
  ];

  it("returns pass when fingerprints match, 0 unresolved, and expert is pass", () => {
    const s = releaseSummary({ gateStatuses: acceptableGates });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
  });

  it("returns failure when expert gate is missing", () => {
    const s = releaseSummary({ gateStatuses: [] });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(false);
    expect(result.failures).toContain("expert gate missing");
  });

  it("returns failure when expert gate is in-review (not fail, not pass)", () => {
    const s = releaseSummary({
      gateStatuses: [
        {
          gate: "expert",
          status: "in-review",
          subjectId: "mapping-audit:catalog",
          updatedAt: "2026-07-01T00:00:00Z",
          evidenceRefs: [],
        },
        {
          gate: "empirical",
          status: "insufficient-data",
          subjectId: "mapping-audit:catalog",
          updatedAt: "2026-07-01T00:00:00Z",
          evidenceRefs: [],
        },
      ],
    });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(false);
    expect(
      result.failures.some((f) => f.includes("expert gate requires pass")),
    ).toBe(true);
  });

  it("allows empirical insufficient-data when expert is pass", () => {
    const s = releaseSummary({ gateStatuses: acceptableGates });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(true);
  });

  it("returns failure on bankFingerprint mismatch", () => {
    const s = releaseSummary({ gateStatuses: acceptableGates });
    const result = releaseGate(s, "fp-different", "sv-live");
    expect(result.pass).toBe(false);
    expect(result.failures).toContain("bankFingerprint mismatch");
  });

  it("returns failure on scoringVersion mismatch", () => {
    const s = releaseSummary({ gateStatuses: acceptableGates });
    const result = releaseGate(s, "fp-live", "sv-different");
    expect(result.pass).toBe(false);
    expect(result.failures).toContain("scoringVersion mismatch");
  });

  it("returns failure when unresolved actives exist", () => {
    const s = releaseSummary({
      unresolvedActiveCount: 3,
      gateStatuses: acceptableGates,
    });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(false);
    expect(result.failures).toContain("3 unresolved active findings");
  });

  it("returns failure when summary generated before last applied disposition", () => {
    const s = releaseSummary({
      generatedAt: "2026-07-01T00:00:00Z",
      lastAppliedDispositionTimestamp: "2026-07-15T00:00:00Z",
      gateStatuses: acceptableGates,
    });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(false);
    expect(result.failures).toContain(
      "summary generated before last applied disposition",
    );
  });

  it("returns failure when gate statuses contain failures", () => {
    const s = releaseSummary({
      gateStatuses: [
        {
          gate: "expert",
          status: "fail",
          subjectId: "dossier:x",
          updatedAt: "2026-07-01T00:00:00Z",
          evidenceRefs: [],
        },
      ],
    });
    const result = releaseGate(s, "fp-live", "sv-live");
    expect(result.pass).toBe(false);
    expect(result.failures.some((f) => f.includes("failed gates"))).toBe(true);
  });

  it("accumulates multiple failures", () => {
    const s = releaseSummary({ unresolvedActiveCount: 2 });
    const result = releaseGate(s, "fp-wrong", "sv-wrong");
    expect(result.pass).toBe(false);
    expect(result.failures.length).toBeGreaterThanOrEqual(3);
  });
});
