import { describe, expect, it } from "vitest";
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
  });
});
