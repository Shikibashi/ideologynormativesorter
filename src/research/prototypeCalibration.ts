// Decision IDs: D-11, D-12, D-18, D-29.
// Prototype distributions remain research-only and are not consumed by the
// production label matcher or result-language path.
import { PROTOTYPE_CALIBRATION_VERSION } from "./versions";
import type { PrototypeDistribution } from "../types";

function isFiniteRecord(
  values: Record<string, number>,
  keys: readonly string[],
): boolean {
  return keys.every((key) => Number.isFinite(values[key]));
}

function covarianceIsPositiveDefinite(matrix: number[][]): boolean {
  const size = matrix.length;
  const lower = Array.from({ length: size }, () => Array(size).fill(0));
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      let residual = matrix[row][column];
      for (let index = 0; index < column; index += 1) {
        residual -= lower[row][index] * lower[column][index];
      }
      if (row === column) {
        if (!Number.isFinite(residual) || residual <= 0) return false;
        lower[row][column] = Math.sqrt(residual);
      } else {
        const divisor = lower[column][column];
        if (divisor === 0) return false;
        lower[row][column] = residual / divisor;
      }
    }
  }
  return true;
}

export function prototypeDistributionErrors(
  distribution: PrototypeDistribution,
): string[] {
  const errors: string[] = [];
  const axisIds = [...distribution.axisIds];
  if (!distribution.labelId.trim())
    errors.push("prototype labelId is required");
  if (distribution.version !== PROTOTYPE_CALIBRATION_VERSION) {
    errors.push(
      "prototype version does not match the current calibration contract",
    );
  }
  if (axisIds.length === 0)
    errors.push("prototype must name at least one axis");
  if (new Set(axisIds).size !== axisIds.length)
    errors.push("prototype axisIds must be unique");
  if (!isFiniteRecord(distribution.means, axisIds))
    errors.push("prototype means must cover each axis with finite values");
  if (!isFiniteRecord(distribution.scales, axisIds))
    errors.push("prototype scales must cover each axis with finite values");
  if (axisIds.some((axisId) => distribution.scales[axisId] <= 0)) {
    errors.push("prototype scales must be positive");
  }
  if (
    distribution.expertDispersion &&
    !isFiniteRecord(distribution.expertDispersion, axisIds)
  ) {
    errors.push("expert dispersion must cover each axis with finite values");
  }
  if (
    distribution.expertDispersion &&
    axisIds.some((axisId) => distribution.expertDispersion![axisId] < 0)
  ) {
    errors.push("expert dispersion cannot be negative");
  }
  if (distribution.covariance) {
    if (
      distribution.covariance.length !== axisIds.length ||
      distribution.covariance.some((row) => row.length !== axisIds.length)
    ) {
      errors.push("prototype covariance must be square over axisIds");
    } else {
      for (let row = 0; row < axisIds.length; row += 1) {
        for (let column = 0; column < axisIds.length; column += 1) {
          if (!Number.isFinite(distribution.covariance[row][column])) {
            errors.push("prototype covariance must be finite");
          } else if (
            Math.abs(
              distribution.covariance[row][column] -
                distribution.covariance[column][row],
            ) > 1e-9
          ) {
            errors.push("prototype covariance must be symmetric");
          }
        }
      }
      if (!covarianceIsPositiveDefinite(distribution.covariance)) {
        errors.push("prototype covariance must be positive definite");
      }
    }
  }
  if (
    distribution.bridgeSampleId !== undefined &&
    !distribution.bridgeSampleId.trim()
  ) {
    errors.push("bridgeSampleId cannot be empty");
  }
  if (distribution.sourceIds.length === 0)
    errors.push("prototype must name at least one source");
  return [...new Set(errors)];
}

export function assertPrototypeDistribution(
  distribution: PrototypeDistribution,
): void {
  const errors = prototypeDistributionErrors(distribution);
  if (errors.length > 0) {
    throw new Error(`Prototype distribution violation: ${errors.join("; ")}`);
  }
}
