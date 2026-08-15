// Decision IDs: D-03, D-14–D-20, D-25, D-26, D-28, D-29.
// These validators describe research-analysis artifacts only. They must not
// be imported by the participant-facing production scoring path.
import type {
  ResearchAnalysisMetadata,
  ResearchDIFPlan,
  ResearchFormEquivalenceReport,
  ResearchModelResult,
  ResearchModelSpecification,
  ResearchPrecisionOutput,
} from "../types";
import {
  DEPLOYMENT_SCOPE_VERSION,
  DIF_PLAN_VERSION,
  FORM_EQUIVALENCE_VERSION,
  MODEL_COMPARISON_VERSION,
  VALIDATION_REPORT_VERSION,
} from "../research/versions";
import {
  CURRENT_RESEARCH_VERSION_BUNDLE,
  versionBundleErrors,
} from "./researchContracts";

const MODEL_FAMILIES = new Set<ResearchModelSpecification["family"]>([
  "production-baseline",
  "one-factor",
  "correlated-factor",
  "higher-order",
  "bifactor",
  "multidimensional",
  "graded-response",
]);

const INVARIANCE_METHODS = new Set<ResearchDIFPlan["invarianceMethod"]>([
  "graded-response",
  "partial-invariance",
  "approximate-invariance",
]);

function finiteBetween(
  value: unknown,
  lower: number,
  upper: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= lower &&
    value <= upper
  );
}

export function researchAnalysisMetadataErrors(
  metadata: ResearchAnalysisMetadata,
): string[] {
  const errors: string[] = [];
  if (metadata.recordType !== "analysis")
    errors.push("recordType must be analysis");
  if (!metadata.analysisId.trim()) errors.push("analysisId is required");
  if (!metadata.analysisVersion.trim())
    errors.push("analysisVersion is required");
  if (!metadata.studyId.trim()) errors.push("studyId is required");
  if (!metadata.codeRevision.trim()) errors.push("codeRevision is required");
  if (!metadata.inclusionManifestId.trim()) {
    errors.push("inclusionManifestId is required");
  }
  if (!metadata.estimand.trim()) errors.push("estimand is required");
  if (!Number.isInteger(metadata.seed)) errors.push("seed must be an integer");
  if (
    !Number.isInteger(metadata.sample.includedN) ||
    metadata.sample.includedN < 0
  ) {
    errors.push("sample.includedN must be a non-negative integer");
  }
  if (
    !Number.isInteger(metadata.sample.excludedN) ||
    metadata.sample.excludedN < 0
  ) {
    errors.push("sample.excludedN must be a non-negative integer");
  }
  if (!metadata.sample.denominatorDescription.trim()) {
    errors.push("sample.denominatorDescription is required");
  }
  const versionErrors = versionBundleErrors(
    metadata.versionBundle,
    CURRENT_RESEARCH_VERSION_BUNDLE,
  );
  errors.push(...versionErrors.map((error) => `analysis ${error}`));
  if (
    !metadata.itemFingerprint &&
    !metadata.taskFingerprint &&
    !metadata.formFingerprint
  ) {
    errors.push("analysis must identify an item, task, or form fingerprint");
  }
  return errors;
}

export function researchPrecisionOutputErrors(
  output: ResearchPrecisionOutput,
): string[] {
  const errors: string[] = [];
  if (!output.estimand.trim()) errors.push("precision estimand is required");
  if (!Number.isInteger(output.observedN) || output.observedN < 0) {
    errors.push("observedN must be a non-negative integer");
  }
  if (!Number.isInteger(output.denominatorN) || output.denominatorN < 0) {
    errors.push("denominatorN must be a non-negative integer");
  }
  if (output.observedN > output.denominatorN) {
    errors.push("observedN cannot exceed denominatorN");
  }
  if (!finiteBetween(output.coverage, 0, 1)) {
    errors.push("coverage must be between 0 and 1");
  }
  if (output.status === "estimated" && output.observedN < 2) {
    errors.push("estimated precision requires at least two observed cases");
  }
  if (output.standardError !== undefined && output.standardError < 0) {
    errors.push("standardError cannot be negative");
  }
  if (output.interval) {
    if (
      !Number.isFinite(output.interval.lower) ||
      !Number.isFinite(output.interval.upper)
    ) {
      errors.push("precision interval must be finite");
    }
    if (output.interval.lower > output.interval.upper) {
      errors.push("precision interval lower bound cannot exceed upper bound");
    }
  }
  if (
    output.information?.observed !== undefined &&
    output.information.observed < 0
  ) {
    errors.push("observed information cannot be negative");
  }
  return errors;
}

export function researchModelSpecificationErrors(
  model: ResearchModelSpecification,
): string[] {
  const errors: string[] = [];
  if (!model.id.trim()) errors.push("model id is required");
  if (model.version !== MODEL_COMPARISON_VERSION) {
    errors.push("model version does not match the current comparison contract");
  }
  if (!MODEL_FAMILIES.has(model.family)) errors.push("model family is invalid");
  if (!model.estimand.trim()) errors.push("model estimand is required");
  if (!model.identification.trim())
    errors.push("model identification is required");
  if (!model.itemEligibility.trim())
    errors.push("model item eligibility is required");
  if (!model.priorsOrEstimator.trim())
    errors.push("model priors/estimator is required");
  if (!Number.isInteger(model.seed))
    errors.push("model seed must be an integer");
  if (!finiteBetween(model.developmentFraction, 0, 1)) {
    errors.push("developmentFraction must be between 0 and 1");
  }
  if (!finiteBetween(model.confirmationFraction, 0, 1)) {
    errors.push("confirmationFraction must be between 0 and 1");
  }
  if (
    Math.abs(model.developmentFraction + model.confirmationFraction - 1) > 1e-9
  ) {
    errors.push("development and confirmation fractions must sum to 1");
  }
  if (model.fitCriteria.length === 0)
    errors.push("model fit criteria are required");
  if (model.productionBaselineComparison !== true) {
    errors.push("model comparisons must name the exact production baseline");
  }
  return errors;
}

export function researchModelResultErrors(
  result: ResearchModelResult,
): string[] {
  const errors = [
    ...researchAnalysisMetadataErrors(result.metadata),
    ...researchModelSpecificationErrors(result.model),
  ];
  if (result.metadata.modelId !== result.model.id) {
    errors.push("analysis modelId must match the model specification");
  }
  if (result.status === "converged" && result.fit === undefined) {
    errors.push("converged model results require fit statistics");
  }
  if (result.status === "nonconverged" && result.fit !== undefined) {
    errors.push("nonconverged model results cannot publish fit statistics");
  }
  return [...new Set(errors)];
}

export function researchDIFPlanErrors(plan: ResearchDIFPlan): string[] {
  const errors: string[] = [];
  if (plan.version !== DIF_PLAN_VERSION)
    errors.push("DIF plan version is not current");
  if (plan.deploymentScopeVersion !== DEPLOYMENT_SCOPE_VERSION) {
    errors.push("DIF plan deployment scope version is not current");
  }
  if (plan.targetGroups.length === 0)
    errors.push("DIF plan requires target groups");
  if (new Set(plan.targetGroups).size !== plan.targetGroups.length) {
    errors.push("DIF target groups must be unique");
  }
  if (plan.minimumUsableN < 100)
    errors.push("DIF minimum usable N must be at least 100");
  if (plan.preferredN < 200)
    errors.push("DIF preferred N must be at least 200");
  if (!plan.effectSizeRule.trim())
    errors.push("DIF effect-size rule is required");
  if (!plan.multipleTestingMethod.trim()) {
    errors.push("DIF multiple-testing method is required");
  }
  if (!INVARIANCE_METHODS.has(plan.invarianceMethod)) {
    errors.push("DIF invariance method is invalid");
  }
  if (plan.inferredGroupsAllowed !== false) {
    errors.push("DIF groups cannot be inferred");
  }
  return errors;
}

export function researchFormEquivalenceErrors(
  report: ResearchFormEquivalenceReport,
): string[] {
  const errors: string[] = [];
  if (report.version !== FORM_EQUIVALENCE_VERSION) {
    errors.push("form equivalence version is not current");
  }
  if (!report.studyId.trim())
    errors.push("form equivalence studyId is required");
  if (
    !report.shortFormFingerprint.trim() ||
    !report.fullFormFingerprint.trim()
  ) {
    errors.push("form equivalence requires both form fingerprints");
  }
  if (!report.estimand.trim())
    errors.push("form equivalence estimand is required");
  if (!Number.isInteger(report.heldOutN) || report.heldOutN < 0) {
    errors.push("heldOutN must be a non-negative integer");
  }
  for (const [name, value] of [
    ["axisAgreement", report.axisAgreement],
    ["neighborhoodStability", report.neighborhoodStability],
    ["coverageDifference", report.coverageDifference],
    ["uncertaintyDifference", report.uncertaintyDifference],
    ["burdenDifference", report.burdenDifference],
  ] as const) {
    if (value !== undefined && !finiteBetween(value, -1, 1)) {
      errors.push(`${name} must be between -1 and 1`);
    }
  }
  if (report.status === "estimated" && report.heldOutN === 0) {
    errors.push("estimated form equivalence requires held-out respondents");
  }
  return errors;
}

export function assertResearchAnalysisMetadata(
  metadata: ResearchAnalysisMetadata,
): void {
  const errors = researchAnalysisMetadataErrors(metadata);
  if (errors.length > 0) {
    throw new Error(
      `Research analysis metadata violation: ${errors.join("; ")}`,
    );
  }
}

export function assertResearchModelResult(result: ResearchModelResult): void {
  const errors = researchModelResultErrors(result);
  if (errors.length > 0) {
    throw new Error(`Research model result violation: ${errors.join("; ")}`);
  }
}

export function assertResearchDIFPlan(plan: ResearchDIFPlan): void {
  const errors = researchDIFPlanErrors(plan);
  if (errors.length > 0) {
    throw new Error(`Research DIF plan violation: ${errors.join("; ")}`);
  }
}

export function assertResearchFormEquivalence(
  report: ResearchFormEquivalenceReport,
): void {
  const errors = researchFormEquivalenceErrors(report);
  if (errors.length > 0) {
    throw new Error(
      `Research form equivalence violation: ${errors.join("; ")}`,
    );
  }
}

export const RESEARCH_VALIDATION_REPORT_VERSION = VALIDATION_REPORT_VERSION;
