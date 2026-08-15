import {
  vnextSpecialistItemRecords,
  vnextSurfaceRecords,
} from "./vnextSurfaceRecords";

function fingerprint(values: readonly string[]): string {
  let hash = 2166136261;
  for (const value of values) {
    for (const char of value) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 124;
    hash = Math.imul(hash, 16777619);
  }
  return `vnext_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

/** The approved surface roster is data, not a projection of the combined form. */
export const vnextSurfaceManifests = vnextSurfaceRecords;
export const vnextSurfaceManifestById = new Map(
  vnextSurfaceManifests.map((manifest) => [manifest.manifestId, manifest]),
);
export const vnextSurfaceManifestBySurface = new Map(
  vnextSurfaceManifests.map((manifest) => [manifest.surface, manifest]),
);
export const vnextSpecialistItemIdsByModule = new Map(
  Object.entries(vnextSpecialistItemRecords).map(([moduleId, itemIds]) => [
    moduleId,
    [...itemIds],
  ]),
);
export const vnextSurfaceFingerprint = fingerprint;
