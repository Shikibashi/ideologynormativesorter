import { describe, expect, it } from "vitest";
import { CANONICAL_MANIFEST } from "./canonicalManifest";
import {
  APPROVED_METHODOLOGY_COMMIT,
  EXPECTED_CANONICAL_COUNTS,
  FROZEN_SOURCE_COMMIT,
  validateMigrationSource,
} from "./canonicalMigration";

function sourceFixture() {
  const nodes = CANONICAL_MANIFEST.nodes ?? [];
  const role = (name: string) =>
    nodes
      .filter((node) => node.publicRoleStatus === name)
      .map((node) => node.id);
  const modules = (CANONICAL_MANIFEST.specialistModules ?? []).map(
    (module) => ({
      id: module.id,
      itemIds: module.itemIds,
      candidateIds: module.candidateIds,
    }),
  );
  return {
    sourceCommit: FROZEN_SOURCE_COMMIT,
    methodologyCommit: APPROVED_METHODOLOGY_COMMIT,
    rosters: {
      roots: CANONICAL_MANIFEST.constructs.map((construct) => construct.id),
      primary: role("primary"),
      specialist: role("specialist"),
      modifier: role("modifier"),
      context: role("context"),
      retired: role("retired"),
    },
    rootIds: CANONICAL_MANIFEST.constructs.map((construct) => construct.id),
    coreItemIds: CANONICAL_MANIFEST.activeCoreItemIds ?? [],
    conditionalSpecialistItemIds:
      CANONICAL_MANIFEST.conditionalSpecialistItemIds ?? [],
    modules,
    manifest: CANONICAL_MANIFEST,
  } as const;
}

describe("canonical migration guards", () => {
  it("freezes the approved source, methodology, and counts", () => {
    const report = validateMigrationSource(sourceFixture());
    expect(report.status).toBe("passed");
    expect(report.counts).toEqual(EXPECTED_CANONICAL_COUNTS);
  });

  it("fails closed on a roster discrepancy", () => {
    const source = sourceFixture();
    const report = validateMigrationSource({
      ...source,
      rosters: {
        ...source.rosters,
        primary: [...source.rosters.primary, "unknown"],
      },
    });
    expect(report.status).toBe("failed");
    expect(
      report.discrepancies.some((item) => item.path === "rosters.primary"),
    ).toBe(true);
  });

  it("fails closed on reference and count discrepancies", () => {
    const source = sourceFixture();
    const report = validateMigrationSource({
      ...source,
      conditionalSpecialistItemIds: [
        ...source.conditionalSpecialistItemIds.slice(0, -1),
      ],
      referenceIds: { relationTargets: ["not-a-canonical-id"] },
    });
    expect(report.status).toBe("failed");
    expect(
      report.discrepancies.some(
        (item) => item.path === "counts.conditionalSpecialistItems",
      ),
    ).toBe(true);
    expect(
      report.discrepancies.some(
        (item) => item.path === "references.relationTargets",
      ),
    ).toBe(true);
  });
});
