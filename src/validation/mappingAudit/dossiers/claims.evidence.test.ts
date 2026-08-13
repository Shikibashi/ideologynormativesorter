import { describe, it, expect } from "vitest";
import { labels } from "../../../data/labels";
import { axes } from "../../../data/axes";
import { dossiers, dossierByLabelId } from "./index";
import {
  buildClaimsForLabel,
  buildClaimStubsForLabel,
  expectedClaimFieldPaths,
} from "./claims";
import {
  citationById,
  citationRegistry,
  labelBankPrimaryCiteId,
  scholarlyCiteIdsForFamily,
} from "../citations/registry";
import { FAMILY_SCHOLARLY_CATALOG } from "../citations/familyCatalog";
import { ingressQueue } from "../citations/ingressQueue";
import { WP0_FREEZE } from "../inventory/freeze";
import { CLAIM_FILL_SPEC_VERSION } from "./formatters";

const PERSPECTIVE_KINDS = ["sympathetic", "critical", "neutral"] as const;

const FORBIDDEN_EMPIRICAL =
  /respondent accuracy|empirically valid|validated against respondents/i;
const FORBIDDEN_NUMERIC_PROOF =
  /source(?:s)? (?:assign|validate|prove).{0,40}numeric|externally validated (?:centroid|coordinate|numeric)/i;

describe("claims.evidence", () => {
  it("every live label dossier has definition, family, and 26 centroid claims", () => {
    expect(labels.length).toBe(WP0_FREEZE.labelCount);
    expect(axes.length).toBe(WP0_FREEZE.axisCount);

    const expectedPaths = expectedClaimFieldPaths();
    expect(expectedPaths).toHaveLength(2 + WP0_FREEZE.axisCount);

    for (const label of labels) {
      const dossier = dossierByLabelId(label.id);
      expect(dossier, `missing dossier for ${label.id}`).toBeDefined();
      expect(dossier!.claims.length).toBe(expectedPaths.length);

      const paths = dossier!.claims.map((c) => c.fieldPath).sort();
      expect(paths).toEqual([...expectedPaths].sort());

      for (const claim of dossier!.claims) {
        expect(claim.labelId).toBe(label.id);
        expect(claim.claimId).toBe(`claim:${label.id}:${claim.fieldPath}:1`);
        expect(claim.statement.length).toBeGreaterThan(0);
        expect(claim.statement.startsWith("PENDING_CLAIM_STUB:")).toBe(false);
        expect(claim.statement.includes("PENDING_")).toBe(false);
        expect(claim.statement).toContain(CLAIM_FILL_SPEC_VERSION);
      }
    }
  });

  it("every claim meets Primary+2 scholarly+3 perspectives schema minima", () => {
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(claim.primaryCiteId.length).toBeGreaterThan(0);
        expect(claim.scholarlyCiteIds.length).toBeGreaterThanOrEqual(2);

        for (const kind of PERSPECTIVE_KINDS) {
          const perspective = claim.perspectives[kind];
          expect(perspective, `${claim.claimId} missing ${kind}`).toBeDefined();
          expect(typeof perspective.text).toBe("string");
          expect(perspective.text!.length).toBeGreaterThan(0);
          expect(perspective.text!.startsWith("PENDING_")).toBe(false);
          expect(perspective.unavailableReason).toBeUndefined();
        }
      }
    }
  });

  it("researched claims stay textual in-review; empirical insufficient-data; expert never pass", () => {
    for (const dossier of dossiers) {
      expect(dossier.provisionalExpertOnly).toBe(true);
      for (const claim of dossier.claims) {
        expect(claim.textualStatus).toBe("in-review");
        expect(claim.textualStatus).not.toBe("pass");
        expect(claim.textualStatus).not.toBe("not-started");
        expect(
          claim.empiricalStatus === "insufficient-data" ||
            claim.empiricalStatus === "deferred",
          `${claim.claimId} empiricalStatus=${claim.empiricalStatus}`,
        ).toBe(true);
        expect(
          claim.expertStatus,
          `${claim.claimId} expertStatus must not be pass`,
        ).not.toBe("pass");
      }
    }
  });

  it("claim cite ids resolve to instrument primary + family scholarly entries", () => {
    expect(citationRegistry.length).toBeGreaterThanOrEqual(
      labels.length + FAMILY_SCHOLARLY_CATALOG.length,
    );

    for (const label of labels) {
      const primary = citationById(labelBankPrimaryCiteId(label.id));
      expect(primary, `missing primary cite for ${label.id}`).toBeDefined();
      expect(primary!.kind).toBe("secondary-seed");
      expect(primary!.title.startsWith("PENDING")).toBe(false);

      const scholarlyIds = scholarlyCiteIdsForFamily(label.family);
      expect(scholarlyIds.length).toBeGreaterThanOrEqual(2);
      for (const citeId of scholarlyIds) {
        const scholarly = citationById(citeId);
        expect(scholarly, `missing scholarly ${citeId}`).toBeDefined();
        expect(scholarly!.kind).toBe("scholarly");
      }
    }

    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(citationById(claim.primaryCiteId)).toBeDefined();
        for (const citeId of claim.scholarlyCiteIds) {
          const cite = citationById(citeId);
          expect(cite).toBeDefined();
          expect(cite!.kind).toBe("scholarly");
        }
      }
    }
  });

  it("family scholarly baselines are promoted in ingress with clean-room checks", () => {
    for (const bundle of FAMILY_SCHOLARLY_CATALOG) {
      for (const cite of bundle.scholarly) {
        const queued = ingressQueue.find((c) => c.citeId === cite.citeId);
        expect(queued, `missing ingress entry ${cite.citeId}`).toBeDefined();
        expect(queued!.kind).toBe("scholarly");
        expect(queued!.promotedTo).toBe("scholarly");
        expect(queued!.cleanRoomChecked).toBe(true);
        expect(queued!.independenceChecked).toBe(true);
      }
    }
  });

  it("buildClaimsForLabel matches dossier attachment for a sample label", () => {
    const label = labels[0];
    const built = buildClaimsForLabel(label);
    const attached = dossierByLabelId(label.id)!.claims;
    expect(attached.map((c) => c.claimId)).toEqual(built.map((c) => c.claimId));
    expect(buildClaimStubsForLabel(label).map((c) => c.claimId)).toEqual(
      built.map((c) => c.claimId),
    );
  });

  it("centroid rationales project from centroid claim statements", () => {
    for (const dossier of dossiers) {
      for (const axis of axes) {
        const rationale = dossier.centroidRationales[axis.id];
        expect(rationale.includes("PENDING_")).toBe(false);
        const claim = dossier.claims.find(
          (c) => c.fieldPath === `centroid.${axis.id}`,
        );
        expect(rationale).toBe(claim?.statement);
      }
    }
  });

  it("claim statements do not assert empirical respondent validity or numeric source proof", () => {
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(FORBIDDEN_EMPIRICAL.test(claim.statement)).toBe(false);
        expect(FORBIDDEN_NUMERIC_PROOF.test(claim.statement)).toBe(false);
      }
    }
  });
});
