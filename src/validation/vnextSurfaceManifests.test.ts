import { describe, expect, it } from "vitest";
import { vnextSurfaceManifests } from "../data/vnextSurfaceManifests";
import {
  assertVNextSurfaceManifests,
  vnextSurfaceManifestErrors,
} from "./vnextSurfaceManifests";
import type { VNextSurfaceManifest } from "../types";

describe("vNext analysis surface manifests", () => {
  it("partitions the active core and Specialist rosters without leakage", () => {
    expect(vnextSurfaceManifestErrors()).toEqual([]);
    expect(() => assertVNextSurfaceManifests()).not.toThrow();
  });

  it("fails closed when a Specialist item is moved into the core surface", () => {
    const core = vnextSurfaceManifests.find(
      (manifest) => manifest.surface === "core",
    )!;
    const specialist = vnextSurfaceManifests.find(
      (manifest) => manifest.surface === "specialist",
    )!;
    const invalid: VNextSurfaceManifest[] = vnextSurfaceManifests.map(
      (manifest) => {
        if (manifest.surface === "core")
          return {
            ...manifest,
            itemIds: [...manifest.itemIds, specialist.itemIds[0]!],
          };
        if (manifest.surface === "specialist")
          return { ...manifest, itemIds: manifest.itemIds.slice(1) };
        return manifest;
      },
    );
    expect(vnextSurfaceManifestErrors(invalid)).toEqual(
      expect.arrayContaining([expect.stringContaining("fingerprint")]),
    );
    expect(core.itemIds).not.toEqual(specialist.itemIds);
  });
});
