export const ENGINE_ERROR_CODES = [
  "UNKNOWN_ITEM",
  "INACTIVE_ITEM",
  "DUPLICATE_RESPONSE",
  "INVALID_RESPONSE_SHAPE",
  "UNSUPPORTED_RESPONSE_VARIANT",
  "INVALID_RESPONSE_TYPE",
  "INVALID_LIKERT_VALUE",
  "NONFINITE_VALUE",
  "UNKNOWN_STATEMENT_OPTION",
  "INVALID_SALIENCE_VALUE",
  "INVALID_SCORING_CONFIGURATION",
  "INVALID_CONTENT_BUNDLE",
  "INVALID_ASSESSMENT_INPUT",
  "ENGINE_INVARIANT_VIOLATION",
  "RESPONSE_SCHEMA_VERSION_MISMATCH",
  "CONTENT_SCHEMA_VERSION_MISMATCH",
  "CONTENT_FINGERPRINT_MISMATCH",
  "CONTENT_VERSION_MISMATCH",
  "SCORING_VERSION_MISMATCH",
  "RESULT_SCHEMA_VERSION_MISMATCH",
  "UNKNOWN_CONSTRUCT",
  "INVALID_CONTRIBUTION",
  "DUPLICATE_CONTRIBUTION",
  "NON_FINITE_AGGREGATION",
  "AGGREGATION_OUT_OF_BOUNDS",
] as const;

export type EngineErrorCode = (typeof ENGINE_ERROR_CODES)[number];

export const ENGINE_ERROR_CATEGORIES = [
  "INPUT_ERROR",
  "VERSION_ERROR",
  "CONTENT_ERROR",
  "ENGINE_INVARIANT_ERROR",
] as const;
export type EngineErrorCategory = (typeof ENGINE_ERROR_CATEGORIES)[number];

export interface ScoringErrorIssue {
  readonly code: EngineErrorCode;
  readonly message: string;
  readonly path?: string;
  readonly itemId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

function categoryForCode(code: EngineErrorCode): EngineErrorCategory {
  if (code.endsWith("_VERSION_MISMATCH")) return "VERSION_ERROR";
  if (code === "INVALID_CONTENT_BUNDLE" || code === "INVALID_SCORING_CONFIGURATION") return "CONTENT_ERROR";
  if (code === "ENGINE_INVARIANT_VIOLATION" || code === "NON_FINITE_AGGREGATION" || code === "AGGREGATION_OUT_OF_BOUNDS") return "ENGINE_INVARIANT_ERROR";
  return "INPUT_ERROR";
}

function sortIssues(issues: readonly ScoringErrorIssue[]): readonly ScoringErrorIssue[] {
  return [...issues].sort((left, right) =>
    [
      left.code,
      left.itemId ?? "",
      left.path ?? "",
      left.message,
    ].join("\u0000").localeCompare(
      [
        right.code,
        right.itemId ?? "",
        right.path ?? "",
        right.message,
      ].join("\u0000"),
    ),
  );
}

export class ScoringError extends Error {
  readonly code: EngineErrorCode;
  readonly category: EngineErrorCategory;
  readonly issues: readonly ScoringErrorIssue[];

  constructor(issues: readonly ScoringErrorIssue[]) {
    const sortedIssues = sortIssues(issues);
    const firstIssue = sortedIssues[0];
    super(firstIssue?.message ?? "Scoring engine error");
    this.name = "ScoringError";
    this.code = firstIssue?.code ?? "INVALID_RESPONSE_SHAPE";
    this.category = categoryForCode(this.code);
    this.issues = Object.freeze(sortedIssues);
  }
}

export function throwScoringError(
  code: EngineErrorCode,
  message: string,
  details?: {
    readonly path?: string;
    readonly itemId?: string;
    readonly details?: Readonly<Record<string, unknown>>;
  },
): never {
  throw new ScoringError([
    {
      code,
      message,
      path: details?.path,
      itemId: details?.itemId,
      details: details?.details,
    },
  ]);
}
