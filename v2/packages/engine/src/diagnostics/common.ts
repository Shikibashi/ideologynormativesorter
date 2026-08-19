import type { ContributionRecordBase } from "../../../contracts/src/scoring";

export const DIAGNOSTIC_NUMERIC_TOLERANCE = 1e-12;

export function contributionIdentity(record: ContributionRecordBase): string {
  return [record.sourceItemId, record.targetConstructId, record.optionId ?? ""].join("\u0000");
}

export function stableIds(values: readonly string[]): readonly string[] {
  return Object.freeze([...values].sort((left, right) => left.localeCompare(right)));
}

export function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return value;
}

export function byMagnitudeThenId<T extends { readonly id: string; readonly value: number }>(
  left: T,
  right: T,
): number {
  return Math.abs(right.value) - Math.abs(left.value) || left.id.localeCompare(right.id);
}

export function weightedComparisonIds(
  comparisons: readonly { readonly constructId: string; readonly included: boolean; readonly weightedSquaredError: number | null; readonly weight: number }[],
): { readonly closest: readonly string[]; readonly departures: readonly string[]; readonly highestWeight: readonly string[] } {
  const included = comparisons.filter((entry) => entry.included && entry.weightedSquaredError !== null);
  const closest = [...included].sort((left, right) => (left.weightedSquaredError! - right.weightedSquaredError!) || left.constructId.localeCompare(right.constructId)).map((entry) => entry.constructId);
  const departures = [...included].sort((left, right) => (right.weightedSquaredError! - left.weightedSquaredError!) || left.constructId.localeCompare(right.constructId)).map((entry) => entry.constructId);
  const highestWeight = [...comparisons].sort((left, right) => right.weight - left.weight || left.constructId.localeCompare(right.constructId)).map((entry) => entry.constructId);
  return { closest: Object.freeze(closest), departures: Object.freeze(departures), highestWeight: Object.freeze(highestWeight) };
}

export class DiagnosticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiagnosticsError";
  }
}
