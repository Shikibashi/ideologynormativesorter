import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { vnextReleaseManifest } from "../data/vnextReleaseManifest";
import {
  assertVNextReleaseManifest,
  vnextReleaseManifestErrors,
} from "./vnextReleaseManifest";

describe("vNext release manifest", () => {
  it("records all six closed P1s, the complete version/fingerprint tuple, and future merge gates", () => {
    expect(vnextReleaseManifestErrors()).toEqual([]);
    expect(() => assertVNextReleaseManifest()).not.toThrow();
    expect(vnextReleaseManifest.p1Findings).toHaveLength(6);
    expect(Object.keys(vnextReleaseManifest.implementationUnits)).toHaveLength(
      18,
    );
  });

  it("does not allow a release manifest to replace the frozen baseline", () => {
    expect(vnextReleaseManifest.candidateCommit).not.toBe(
      vnextReleaseManifest.frozenBaselineCommit,
    );
    expect(vnextReleaseManifest.rollbackReference).toBe(
      vnextReleaseManifest.frozenBaselineCommit,
    );
    expect(vnextReleaseManifest.candidateBinding).toBe(
      "parent-bound-finalization",
    );
    expect(vnextReleaseManifest.releaseMetadataParentCommit).toBe(
      vnextReleaseManifest.candidateCommit,
    );
  });

  it("keeps the typed release manifest byte-source and JSON artifact semantically identical", () => {
    const json = JSON.parse(
      readFileSync("release-manifest/vnext-release-manifest.json", "utf8"),
    );
    expect(json).toEqual(vnextReleaseManifest);
  });
});
