import type { AxisId, Layer } from "../types";
import { RESEARCH_ESTIMATOR_VERSION } from "../research/versions";

export type ResearchEstimateStatus =
  | "estimated"
  | "insufficient-data"
  | "not-applicable";

export type ResearchMissingReason =
  | "dont_know"
  | "prefer_not_to_answer"
  | "skipped"
  | "not-presented"
  | "invalid";

export interface ResearchEstimatorObservation {
  questionId: string;
  value?: number;
  missingReason?: ResearchMissingReason;
}

export interface ResearchEstimatorInput {
  estimatorId: string;
  respondentId: string;
  studyId: string;
  axisId: AxisId;
  layer: Layer;
  observations: readonly ResearchEstimatorObservation[];
  minimumObserved?: number;
  /** A guard against accidentally routing a research estimate into scoring. */
  productionScoringInput?: boolean;
}

export interface ResearchEstimatePrecision {
  observedCount: number;
  totalCount: number;
  coverage: number;
  standardError?: number;
  interval?: {
    lower: number;
    upper: number;
    method: "normal-approximation";
  };
}

export interface ResearchLayerEstimate {
  recordType: "research-estimate";
  researchOnly: true;
  productionScoringInput: false;
  claimLanguage: "research-estimate";
  estimatorId: string;
  estimatorVersion: string;
  respondentId: string;
  studyId: string;
  axisId: AxisId;
  layer: Layer;
  estimand: "observed-normalized-mean";
  status: ResearchEstimateStatus;
  value?: number;
  precision: ResearchEstimatePrecision;
  missingness: {
    observedCount: number;
    missingCount: number;
    reasons: Partial<Record<ResearchMissingReason, number>>;
  };
  reason: string;
}

const DEFAULT_MINIMUM_OBSERVED = 2;
const INTERVAL_Z = 1.96;

function isFiniteNormalizedValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= -1 &&
    value <= 1
  );
}

function missingReasonFor(
  observation: ResearchEstimatorObservation,
): ResearchMissingReason | null {
  if (observation.value !== undefined) return null;
  return observation.missingReason ?? "invalid";
}

function sampleStandardDeviation(
  values: readonly number[],
  mean: number,
): number {
  if (values.length < 2) return 0;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      (values.length - 1),
  );
}

export function researchEstimatorInputErrors(
  input: ResearchEstimatorInput,
): string[] {
  const errors: string[] = [];
  if (!input.estimatorId.trim()) errors.push("estimatorId is required");
  if (!input.respondentId.trim()) errors.push("respondentId is required");
  if (!input.studyId.trim()) errors.push("studyId is required");
  if (input.productionScoringInput === true) {
    errors.push("research estimates cannot be production scoring inputs");
  }
  const questionIds = input.observations.map(
    (observation) => observation.questionId,
  );
  if (questionIds.some((questionId) => !questionId.trim())) {
    errors.push("every estimator observation requires a questionId");
  }
  if (new Set(questionIds).size !== questionIds.length) {
    errors.push("estimator observations must have unique questionIds");
  }
  for (const observation of input.observations) {
    if (
      observation.value !== undefined &&
      !isFiniteNormalizedValue(observation.value)
    ) {
      errors.push(
        `observation ${observation.questionId} must be a finite normalized value from -1 to 1`,
      );
    }
    if (
      observation.value !== undefined &&
      observation.missingReason !== undefined
    ) {
      errors.push(
        `observation ${observation.questionId} cannot have both a value and missingReason`,
      );
    }
    if (
      observation.value === undefined &&
      observation.missingReason === undefined
    ) {
      errors.push(
        `observation ${observation.questionId} requires explicit missingReason when unanswered`,
      );
    }
  }
  const minimumObserved = input.minimumObserved ?? DEFAULT_MINIMUM_OBSERVED;
  if (!Number.isInteger(minimumObserved) || minimumObserved < 1) {
    errors.push("minimumObserved must be a positive integer");
  }
  return errors;
}

export function estimateResearchLayerMean(
  input: ResearchEstimatorInput,
): ResearchLayerEstimate {
  const errors = researchEstimatorInputErrors(input);
  if (errors.length > 0) {
    throw new Error(`Research estimator input violation: ${errors.join("; ")}`);
  }

  const values = input.observations.flatMap((observation) =>
    observation.value === undefined ? [] : [observation.value],
  );
  const reasons: Partial<Record<ResearchMissingReason, number>> = {};
  for (const observation of input.observations) {
    const reason = missingReasonFor(observation);
    if (reason) reasons[reason] = (reasons[reason] ?? 0) + 1;
  }
  const totalCount = input.observations.length;
  const observedCount = values.length;
  const missingCount = totalCount - observedCount;
  const coverage = totalCount === 0 ? 0 : observedCount / totalCount;
  const minimumObserved = input.minimumObserved ?? DEFAULT_MINIMUM_OBSERVED;

  const base = {
    recordType: "research-estimate" as const,
    researchOnly: true as const,
    productionScoringInput: false as const,
    claimLanguage: "research-estimate" as const,
    estimatorId: input.estimatorId,
    estimatorVersion: RESEARCH_ESTIMATOR_VERSION,
    respondentId: input.respondentId,
    studyId: input.studyId,
    axisId: input.axisId,
    layer: input.layer,
    estimand: "observed-normalized-mean" as const,
    precision: { observedCount, totalCount, coverage },
    missingness: { observedCount, missingCount, reasons },
  };

  if (totalCount === 0) {
    return {
      ...base,
      status: "not-applicable",
      reason: "No observations were presented for this layer and axis.",
    };
  }
  if (observedCount < minimumObserved) {
    return {
      ...base,
      status: "insufficient-data",
      reason: `At least ${minimumObserved} observed responses are required for this research estimate.`,
    };
  }

  const value =
    values.reduce((sum, current) => sum + current, 0) / observedCount;
  const standardError =
    sampleStandardDeviation(values, value) / Math.sqrt(observedCount);
  return {
    ...base,
    status: "estimated",
    value,
    precision: {
      ...base.precision,
      standardError,
      interval: {
        lower: Math.max(-1, value - INTERVAL_Z * standardError),
        upper: Math.min(1, value + INTERVAL_Z * standardError),
        method: "normal-approximation",
      },
    },
    reason: "Research-only layer estimate from observed normalized responses.",
  };
}

export function assertResearchEstimatorOutput(
  estimate: ResearchLayerEstimate,
): void {
  if (!estimate.researchOnly || estimate.productionScoringInput) {
    throw new Error(
      "Research estimator output cannot be a production scoring input.",
    );
  }
  if (estimate.claimLanguage !== "research-estimate") {
    throw new Error(
      "Research estimator output must use research-estimate claim language.",
    );
  }
}
