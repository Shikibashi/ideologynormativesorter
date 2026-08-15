import type { VNextCalibrationContract } from "../types";
import { vnextCalibrationContract } from "../data/vnextCalibrationContract";

export function vnextCalibrationContractErrors(
  contract: VNextCalibrationContract = vnextCalibrationContract,
): string[] {
  const errors: string[] = [];
  if (contract.objectIds.length === 0)
    errors.push("calibration contract has no object scope");
  if (!contract.constructScore.missingnessPolicy.includes("no imputation")) {
    errors.push(
      "calibration contract does not declare no-imputation missingness",
    );
  }
  if (contract.reliability.itemCountOnly)
    errors.push("item count cannot be a reliability estimate");
  if (
    contract.reliability.observedN !== undefined &&
    contract.reliability.denominatorN !== undefined &&
    contract.reliability.observedN > contract.reliability.denominatorN
  ) {
    errors.push("reliability observed N exceeds denominator");
  }
  const interval = contract.uncertainty.interval;
  if (
    interval &&
    (!Number.isFinite(interval.lower) ||
      !Number.isFinite(interval.upper) ||
      interval.lower > interval.upper)
  ) {
    errors.push("uncertainty interval is invalid");
  }
  if (contract.difInvariance.minimumUsableNPerGroup < 100)
    errors.push("DIF minimum usable group N is below the contract floor");
  if (!contract.difInvariance.multipleTestingMethod.trim())
    errors.push("DIF multiple-testing method is required");
  if (contract.formEquivalence.itemCountOnly)
    errors.push("item count cannot establish form equivalence");
  if (!contract.formEquivalence.heldOutEvaluation.trim())
    errors.push("form equivalence requires held-out evaluation");
  if (
    contract.robustness.omissionAnalyses.length === 0 ||
    contract.robustness.missingnessAnalyses.length === 0
  ) {
    errors.push("robustness contract lacks omission or missingness analyses");
  }
  if (
    contract.multiplicity.hypotheses < 0 ||
    !contract.multiplicity.method.trim()
  )
    errors.push("multiplicity contract is incomplete");
  if (
    !contract.subgroupManifest.voluntary ||
    contract.subgroupManifest.inferredFromAnswers
  ) {
    errors.push(
      "subgroup variables must be voluntary and never inferred from answers",
    );
  }
  if (
    contract.claimTierCeiling !== "PC0" &&
    contract.claimTierCeiling !== "PC1"
  )
    errors.push("calibration contract exceeds current claim ceiling");
  return [...new Set(errors)];
}

export function assertVNextCalibrationContract(): void {
  const errors = vnextCalibrationContractErrors();
  if (errors.length > 0)
    throw new Error(
      `vNext calibration contract violation: ${errors.join("; ")}`,
    );
}
