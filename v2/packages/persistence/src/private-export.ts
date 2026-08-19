import type { CanonicalContentBundle } from "../../contracts/src";
import { validatePrivateSaveShape, parsePrivateAssessmentSave, serializePrivateAssessmentSave } from "./save/schema";
import { evaluateSavedAssessmentFreshness } from "./save/freshness";
import { PersistenceError, type PrivateAssessmentSave, type SaveFreshness } from "./types";

export function exportPrivateAssessment(save: PrivateAssessmentSave): string {
  if (!validatePrivateSaveShape(save)) throw new PersistenceError("INVALID_PRIVATE_SAVE", "Cannot export an invalid private save.");
  return serializePrivateAssessmentSave({ ...save, kind: "private-export" });
}

export interface ImportedPrivateAssessment {
  readonly save: PrivateAssessmentSave;
  readonly freshness: SaveFreshness;
  readonly warnings: readonly string[];
}

export function importPrivateAssessment(serialized: string, bundle: CanonicalContentBundle): ImportedPrivateAssessment {
  const parsed = parsePrivateAssessmentSave(serialized);
  if (parsed.status !== "loaded" || !parsed.save) throw new PersistenceError("IMPORT_REJECTED", parsed.error ?? "The private import was rejected.");
  const freshness = evaluateSavedAssessmentFreshness(parsed.save, bundle);
  if (freshness.kind === "incompatible") throw new PersistenceError("INCOMPATIBLE_SAVE", "This private save belongs to incompatible v2 content or response contracts.", { ...freshness });
  return { save: parsed.save, freshness, warnings: parsed.warnings };
}
