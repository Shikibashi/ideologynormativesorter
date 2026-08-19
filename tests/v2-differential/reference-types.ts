export const NUMERIC_TOLERANCE = 1e-9;
export const REFERENCE_COMMIT = "f0324dbf27dfc6e35ff557992e4643e3df15ee0e" as const;
export const RANDOM_SEED = 20260819;
export const RANDOM_SAMPLE_COUNT = 64;

export interface ReferenceCaseEntry {
  readonly id: string;
  readonly description: string;
  readonly classificationScope: readonly string[];
  readonly input: string;
  readonly expectedV1: string;
  readonly expectedV2: string;
  readonly expectedDifferences: readonly string[];
  readonly sourceVersion: Readonly<Record<string, string>>;
  readonly rationaleRefs: readonly string[];
}

export function nearlyEqual(left: number, right: number, tolerance = NUMERIC_TOLERANCE): boolean {
  return Math.abs(left - right) <= tolerance;
}

export function assertNearlyEqual(left: number, right: number, label: string, tolerance = NUMERIC_TOLERANCE): void {
  if (!nearlyEqual(left, right, tolerance)) {
    throw new Error(`${label}: expected ${right}, received ${left}, tolerance ${tolerance}`);
  }
}
