import { createHash } from "node:crypto";
import type { CanonicalContentBundle } from "../../contracts/src/index";
import { stableSerialize } from "./serialization";

export interface FingerprintOptions {
  excludeKeys?: string[];
}

export function computeContentFingerprint(
  value: CanonicalContentBundle,
  options: FingerprintOptions = {},
): string {
  const serialized = stableSerialize(value, {
    excludeKeys: ["contentFingerprint", "counts", ...(options.excludeKeys ?? [])],
  });
  const digest = createHash("sha256").update(serialized, "utf8").digest("hex");
  return digest;
}
