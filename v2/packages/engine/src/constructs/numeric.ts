export const CONSTRUCT_NUMERIC_TOLERANCE = 1e-12;

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isNearlyZero(value: number): boolean {
  return Math.abs(value) <= CONSTRUCT_NUMERIC_TOLERANCE;
}

export function ratioOrZero(numerator: number, denominator: number): number {
  return denominator > CONSTRUCT_NUMERIC_TOLERANCE
    ? numerator / denominator
    : 0;
}

export function stableUnitRatio(numerator: number, denominator: number): number {
  const ratio = ratioOrZero(numerator, denominator);
  return Math.max(0, Math.min(1, ratio));
}

