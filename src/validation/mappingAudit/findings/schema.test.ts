import { describe, it, expect } from "vitest";
import { findings } from "./ledger";
import { reviewRecords, reviewsForFinding } from "../reviews/records";
import { isApprovedDisposition } from "../predicates";
import type {
  IssueClass,
  Severity,
  FindingLifecycle,
  Disposition,
} from "../types";

const ISSUE_CLASSES: IssueClass[] = [
  "sign-inversion",
  "construct-mismatch",
  "template-carryover",
  "double-barreled",
  "non-discriminating",
  "underspecified",
  "hierarchy-inconsistency",
  "centroid-invalid",
  "near-duplicate-centroid",
  "insufficient-discriminator",
  "perturbation-instability",
  "evidence-strength",
  "misleading-tie",
  "layer-conflation",
  "non-separable-label",
  "affinity-quarantine",
  "version-drift",
  "copy-overclaim",
];

const SEVERITIES: Severity[] = ["blocker", "major", "minor", "info"];
const LIFECYCLES: FindingLifecycle[] = [
  "proposed",
  "domain-reviewed",
  "measurement-reviewed",
  "adjudicated",
  "approved",
  "applied",
  "superseded",
];
const DISPOSITIONS: Disposition[] = [
  "no-change",
  "correct-overlay",
  "correct-source",
  "deactivate",
  "merge",
  "construct-split",
  "reactivate-after-measurement",
  "park-separability",
  "reject-forced-spread",
];

describe("findings.schema", () => {
  it("every finding has required fields and dual reviews when approved/applied", () => {
    expect(findings.length).toBeGreaterThan(0);
    expect(reviewRecords.length).toBeGreaterThan(0);

    for (const finding of findings) {
      expect(finding.findingId.startsWith("finding:")).toBe(true);
      expect(ISSUE_CLASSES).toContain(finding.issueClass);
      expect(SEVERITIES).toContain(finding.severity);
      expect(LIFECYCLES).toContain(finding.lifecycle);
      expect(DISPOSITIONS).toContain(finding.proposedDisposition);
      expect(finding.subjectIds.length).toBeGreaterThan(0);
      expect(finding.evidence.length).toBeGreaterThan(0);
      expect(Array.isArray(finding.evidenceCiteIds)).toBe(true);
      expect(Array.isArray(finding.linkedTestIds)).toBe(true);
      expect(finding.versionImpact).toBeTruthy();

      if (isApprovedDisposition(finding)) {
        expect(finding.domainReviewId).toBeTruthy();
        expect(finding.measurementReviewId).toBeTruthy();
        const reviews = reviewsForFinding(finding.findingId);
        expect(reviews.some((r) => r.role === "domain")).toBe(true);
        expect(reviews.some((r) => r.role === "measurement")).toBe(true);
      }
    }
  });

  it("finding ids are unique", () => {
    const ids = findings.map((f) => f.findingId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every review references an existing finding", () => {
    const findingIds = new Set(findings.map((f) => f.findingId));
    for (const review of reviewRecords) {
      expect(findingIds.has(review.findingId)).toBe(true);
      expect(review.reviewId.startsWith("review:")).toBe(true);
      expect(review.rationale.length).toBeGreaterThan(0);
      expect(["domain", "measurement", "adjudicator"]).toContain(review.role);
      expect(["provisional-agent", "qualified-expert"]).toContain(
        review.qualificationStatus,
      );
    }
  });
});
