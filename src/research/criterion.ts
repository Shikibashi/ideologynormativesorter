// Decision IDs: D-06, D-10, D-13, D-14, D-18, D-29.
import { CRITERION_PLAN_VERSION } from "./versions";
import type { CriterionObservation, Layer } from "../types";

const CRITERION_KINDS = new Set<CriterionObservation["kind"]>([
  "self-label",
  "external-scale",
  "behavior",
  "forecast-outcome",
  "expert-code",
  "novel-scenario",
]);
const CRITERION_TIMINGS = new Set<CriterionObservation["timing"]>([
  "pre-questionnaire",
  "post-questionnaire",
  "follow-up",
]);
const MISSING_REASONS = new Set<
  NonNullable<CriterionObservation["missingReason"]>
>(["declined", "not-applicable", "unresolved", "not-collected"]);
const LAYERS = new Set<Layer>(["normative", "descriptive", "prescriptive"]);

export function criterionObservationErrors(
  observation: CriterionObservation,
): string[] {
  const errors: string[] = [];
  if (!observation.criterionId.trim()) errors.push("criterionId is required");
  if (observation.criterionVersion !== CRITERION_PLAN_VERSION) {
    errors.push("criterionVersion does not match the current criterion plan");
  }
  if (!CRITERION_KINDS.has(observation.kind))
    errors.push("criterion kind is invalid");
  if (!observation.collectionWave.trim())
    errors.push("collectionWave is required");
  if (!CRITERION_TIMINGS.has(observation.timing))
    errors.push("criterion timing is invalid");
  if (observation.layer !== undefined && !LAYERS.has(observation.layer)) {
    errors.push("criterion layer is invalid");
  }
  if (
    observation.missingReason !== undefined &&
    !MISSING_REASONS.has(observation.missingReason)
  ) {
    errors.push("criterion missingReason is invalid");
  }
  if (
    observation.missingReason === undefined &&
    (observation.value === undefined || observation.value === null)
  ) {
    errors.push("criterion value is required when missingReason is absent");
  }
  if (observation.missingReason !== undefined && observation.value !== null) {
    errors.push("missing criterion observations must use null value");
  }
  if (
    observation.kind === "self-label" &&
    observation.timing !== "post-questionnaire"
  ) {
    errors.push("self-label criteria must be collected post-questionnaire");
  }
  if (
    observation.kind === "forecast-outcome" &&
    observation.timing !== "follow-up"
  ) {
    errors.push("forecast outcomes must be collected at follow-up");
  }
  return errors;
}

export function assertCriterionObservation(
  observation: CriterionObservation,
): void {
  const errors = criterionObservationErrors(observation);
  if (errors.length > 0) {
    throw new Error(`Criterion observation violation: ${errors.join("; ")}`);
  }
}

export function criterionObservation(
  input: Omit<CriterionObservation, "criterionVersion">,
): CriterionObservation {
  const observation = {
    ...input,
    criterionVersion: CRITERION_PLAN_VERSION,
  } satisfies CriterionObservation;
  assertCriterionObservation(observation);
  return observation;
}
