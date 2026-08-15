import { describe, expect, it } from "vitest";
import {
  anchorItemIds,
  anchorRotationManifestErrors,
  researchAnchorManifest,
} from "./anchorItems";
import { ANCHOR_ROTATION_VERSION } from "../research/versions";
import type { AnchorRotationManifest } from "../types";

describe("anchor and rotation manifest", () => {
  it("keeps anchor selection held until confirmation evidence exists", () => {
    expect(researchAnchorManifest.version).toBe(ANCHOR_ROTATION_VERSION);
    expect(researchAnchorManifest.anchors).toEqual([]);
    expect(anchorItemIds()).toEqual([]);
    expect(anchorRotationManifestErrors()).toEqual([]);
  });

  it("requires a linking method for active anchors and rejects duplicates", () => {
    const manifest: AnchorRotationManifest = {
      ...researchAnchorManifest,
      linkingMethod: "mean-sigma",
      anchors: [
        {
          questionId: "q1",
          itemVersion: "item-v1",
          wave: "wave-1",
          role: "anchor",
          axisIds: ["equality"],
          layer: "normative",
          formVersions: ["form-v1"],
        },
        {
          questionId: "q1",
          itemVersion: "item-v1",
          wave: "wave-1",
          role: "rotating",
          axisIds: ["equality"],
          layer: "normative",
          formVersions: ["form-v1"],
        },
      ],
    };
    expect(anchorRotationManifestErrors(manifest)).toContain(
      "anchor items must be unique",
    );
  });
});
