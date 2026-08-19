import generatedBundle from "../../../generated/content.bundle.json";
import type { CanonicalContentBundle } from "../../../packages/contracts/src";

export const canonicalBundle = generatedBundle as unknown as CanonicalContentBundle;
