import type {
  Answer,
  AnswerMap,
  Axis,
  AxisId,
  IdeologyLabel,
  Question,
} from "../types";
import { buildResultProfile } from "../scoring";

export type EstimateStatus =
  | "estimated"
  | "insufficient-data"
  | "not-applicable";

export interface ValidationResponse {
  respondentId: string;
  administration: "test" | "retest";
  answers: AnswerMap;
  /** Optional self-identification captured before results are shown. */
  selfLabelId?: string;
  /** Optional respondent-supplied ideology names kept for candidate discovery, not scoring. */
  selfReportedIdeologies?: string;
  /** Optional coarse group for later fairness analysis. Never require sensitive attributes. */
  group?: string;
}

export interface NumericEstimate {
  status: EstimateStatus;
  value?: number;
  n: number;
  itemCount: number;
  reason: string;
}

export interface ItemTotalEstimate {
  questionId: string;
  status: EstimateStatus;
  correlation?: number;
  n: number;
  reason: string;
}

export interface AxisPsychometricReport {
  axisId: AxisId;
  eligibleItemCount: number;
  completeCaseCount: number;
  cronbachAlpha: NumericEstimate;
  splitHalfReliability: NumericEstimate;
  testRetestCorrelation: NumericEstimate;
  itemTotalCorrelations: ItemTotalEstimate[];
  missingResponseRate: number;
  floorRate: number;
  ceilingRate: number;
}

export interface DirectionalBalance {
  axisId: AxisId;
  positiveItems: number;
  negativeItems: number;
  ipsativeOptions: number;
  imbalance: number;
}

export interface SourceCoverageReport {
  descriptiveItems: number;
  sourcedItems: number;
  operationalizedItems: number;
  sourcedRate: number;
  operationalizedRate: number;
}

export interface SelfLabelConcordance {
  status: EstimateStatus;
  n: number;
  top1Rate?: number;
  top3Rate?: number;
  reason: string;
}

export interface PsychometricStudyReport {
  status: "not-collected" | "pilot" | "estimable";
  respondentCount: number;
  testResponseCount: number;
  retestResponseCount: number;
  axisReports: AxisPsychometricReport[];
  directionalBalance: DirectionalBalance[];
  sourceCoverage: SourceCoverageReport;
  selfLabelConcordance: SelfLabelConcordance;
  excludedQuestionIds: string[];
  notes: string[];
}

export interface PsychometricOptions {
  minimumCompleteCases?: number;
  minimumRetestPairs?: number;
  minimumCriterionCases?: number;
  pilotRespondents?: number;
}

const DEFAULT_OPTIONS: Required<PsychometricOptions> = {
  minimumCompleteCases: 50,
  minimumRetestPairs: 30,
  minimumCriterionCases: 50,
  pilotRespondents: 100,
};

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const center = mean(values);
  return (
    values.reduce((sum, value) => sum + (value - center) ** 2, 0) /
    (values.length - 1)
  );
}

export function pearsonCorrelation(xs: number[], ys: number[]): number | null {
  if (xs.length !== ys.length || xs.length < 3) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let cross = 0;
  let xx = 0;
  let yy = 0;
  for (let i = 0; i < xs.length; i += 1) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    cross += dx * dy;
    xx += dx * dx;
    yy += dy * dy;
  }
  if (xx === 0 || yy === 0) return null;
  return cross / Math.sqrt(xx * yy);
}

function likertMaximum(question: Question): number | null {
  if (question.responseType === "likert5") return 2;
  if (question.responseType === "likert7") return 3;
  return null;
}

function weightForAxis(question: Question, axisId: AxisId): number | null {
  return (
    question.axisWeights.find((weight) => weight.axisId === axisId)?.weight ??
    null
  );
}

function orientedItemScore(
  question: Question,
  answer: Answer | undefined,
  axisId: AxisId,
): number | null {
  if (
    !answer ||
    answer.value === "dont_know" ||
    typeof answer.value !== "number"
  )
    return null;
  const maximum = likertMaximum(question);
  const weight = weightForAxis(question, axisId);
  if (maximum === null || weight === null || weight === 0) return null;
  const reverse = question.reverseScored ? -1 : 1;
  return (answer.value / maximum) * Math.sign(weight) * reverse;
}

function eligibleItems(questions: Question[], axisId: AxisId): Question[] {
  return questions.filter(
    (question) =>
      question.active !== false &&
      question.reviewStatus !== "needs-rewrite" &&
      question.responseType !== "statementChoice" &&
      question.axisWeights.some(
        (weight) => weight.axisId === axisId && weight.weight !== 0,
      ),
  );
}

function completeCaseMatrix(
  records: ValidationResponse[],
  items: Question[],
  axisId: AxisId,
): { rows: number[][]; respondentIds: string[] } {
  const rows: number[][] = [];
  const respondentIds: string[] = [];
  for (const record of records.filter(
    (candidate) => candidate.administration === "test",
  )) {
    const values = items.map((question) =>
      orientedItemScore(question, record.answers[question.id], axisId),
    );
    if (values.every((value): value is number => value !== null)) {
      rows.push(values);
      respondentIds.push(record.respondentId);
    }
  }
  return { rows, respondentIds };
}

export function cronbachAlpha(matrix: number[][]): number | null {
  if (matrix.length < 2 || matrix[0]?.length < 2) return null;
  const itemCount = matrix[0].length;
  if (matrix.some((row) => row.length !== itemCount)) return null;

  const itemVariances = Array.from({ length: itemCount }, (_, column) =>
    sampleVariance(matrix.map((row) => row[column])),
  );
  const totalScores = matrix.map((row) =>
    row.reduce((sum, value) => sum + value, 0),
  );
  const totalVariance = sampleVariance(totalScores);
  if (totalVariance === 0) return null;
  return (
    (itemCount / (itemCount - 1)) *
    (1 -
      itemVariances.reduce((sum, variance) => sum + variance, 0) /
        totalVariance)
  );
}

function alphaEstimate(
  matrix: number[][],
  itemCount: number,
  minimumCases: number,
): NumericEstimate {
  if (itemCount < 2) {
    return {
      status: "not-applicable",
      n: matrix.length,
      itemCount,
      reason: "At least two common-scale items are required.",
    };
  }
  if (matrix.length < minimumCases) {
    return {
      status: "insufficient-data",
      n: matrix.length,
      itemCount,
      reason: `Requires at least ${minimumCases} complete respondent records; ${matrix.length} are available.`,
    };
  }
  const value = cronbachAlpha(matrix);
  if (value === null) {
    return {
      status: "not-applicable",
      n: matrix.length,
      itemCount,
      reason: "The score has zero variance or cannot be estimated.",
    };
  }
  return {
    status: "estimated",
    value,
    n: matrix.length,
    itemCount,
    reason:
      "Cronbach alpha over complete, directionally aligned Likert responses.",
  };
}

function splitHalfEstimate(
  matrix: number[][],
  itemCount: number,
  minimumCases: number,
): NumericEstimate {
  if (itemCount < 4) {
    return {
      status: "not-applicable",
      n: matrix.length,
      itemCount,
      reason: "At least four items are required for an odd-even split.",
    };
  }
  if (matrix.length < minimumCases) {
    return {
      status: "insufficient-data",
      n: matrix.length,
      itemCount,
      reason: `Requires at least ${minimumCases} complete respondent records; ${matrix.length} are available.`,
    };
  }
  const odd = matrix.map((row) =>
    mean(row.filter((_, index) => index % 2 === 0)),
  );
  const even = matrix.map((row) =>
    mean(row.filter((_, index) => index % 2 === 1)),
  );
  const correlation = pearsonCorrelation(odd, even);
  if (correlation === null || correlation <= -1) {
    return {
      status: "not-applicable",
      n: matrix.length,
      itemCount,
      reason: "Half scores have zero variance or an undefined correlation.",
    };
  }
  const spearmanBrown = (2 * correlation) / (1 + correlation);
  return {
    status: "estimated",
    value: spearmanBrown,
    n: matrix.length,
    itemCount,
    reason: "Odd-even correlation with Spearman-Brown correction.",
  };
}

function itemTotalEstimates(
  matrix: number[][],
  items: Question[],
  minimumCases: number,
): ItemTotalEstimate[] {
  return items.map((item, column) => {
    if (matrix.length < minimumCases || items.length < 2) {
      return {
        questionId: String(item.id),
        status: "insufficient-data",
        n: matrix.length,
        reason: `Requires at least ${minimumCases} complete records and two items.`,
      };
    }
    const itemValues = matrix.map((row) => row[column]);
    const remainder = matrix.map((row) =>
      row.reduce(
        (sum, value, index) => (index === column ? sum : sum + value),
        0,
      ),
    );
    const correlation = pearsonCorrelation(itemValues, remainder);
    if (correlation === null) {
      return {
        questionId: String(item.id),
        status: "not-applicable",
        n: matrix.length,
        reason: "Item or remainder score has zero variance.",
      };
    }
    return {
      questionId: String(item.id),
      status: "estimated",
      correlation,
      n: matrix.length,
      reason:
        "Corrected item-total correlation excluding this item from the total.",
    };
  });
}

function axisScore(
  record: ValidationResponse,
  items: Question[],
  axisId: AxisId,
): number | null {
  const values = items.flatMap((question) => {
    const value = orientedItemScore(
      question,
      record.answers[question.id],
      axisId,
    );
    return value === null ? [] : [value];
  });
  return values.length === 0 ? null : mean(values);
}

function testRetestEstimate(
  records: ValidationResponse[],
  items: Question[],
  axisId: AxisId,
  minimumPairs: number,
): NumericEstimate {
  const tests = new Map(
    records
      .filter((record) => record.administration === "test")
      .map((record) => [record.respondentId, record]),
  );
  const retests = new Map(
    records
      .filter((record) => record.administration === "retest")
      .map((record) => [record.respondentId, record]),
  );
  const first: number[] = [];
  const second: number[] = [];
  for (const [respondentId, test] of tests) {
    const retest = retests.get(respondentId);
    if (!retest) continue;
    const testScore = axisScore(test, items, axisId);
    const retestScore = axisScore(retest, items, axisId);
    if (testScore === null || retestScore === null) continue;
    first.push(testScore);
    second.push(retestScore);
  }
  if (first.length < minimumPairs) {
    return {
      status: "insufficient-data",
      n: first.length,
      itemCount: items.length,
      reason: `Requires at least ${minimumPairs} matched test-retest pairs; ${first.length} are available.`,
    };
  }
  const correlation = pearsonCorrelation(first, second);
  if (correlation === null) {
    return {
      status: "not-applicable",
      n: first.length,
      itemCount: items.length,
      reason: "Test or retest scores have zero variance.",
    };
  }
  return {
    status: "estimated",
    value: correlation,
    n: first.length,
    itemCount: items.length,
    reason: "Pearson correlation across matched test-retest respondents.",
  };
}

function responseDistribution(
  records: ValidationResponse[],
  items: Question[],
  axisId: AxisId,
): { missing: number; observed: number; floor: number; ceiling: number } {
  let missing = 0;
  let observed = 0;
  let floor = 0;
  let ceiling = 0;
  for (const record of records.filter(
    (candidate) => candidate.administration === "test",
  )) {
    for (const item of items) {
      const value = orientedItemScore(item, record.answers[item.id], axisId);
      if (value === null) {
        missing += 1;
      } else {
        observed += 1;
        if (value <= -0.999) floor += 1;
        if (value >= 0.999) ceiling += 1;
      }
    }
  }
  return { missing, observed, floor, ceiling };
}

export function directionalBalance(
  questions: Question[],
  axes: Axis[],
): DirectionalBalance[] {
  return axes.map((axis) => {
    let positiveItems = 0;
    let negativeItems = 0;
    let ipsativeOptions = 0;
    for (const question of questions.filter(
      (item) => item.active !== false && item.reviewStatus !== "needs-rewrite",
    )) {
      if (question.responseType === "statementChoice") {
        for (const option of question.statementOptions ?? []) {
          if (
            option.axisWeights.some(
              (weight) => weight.axisId === axis.id && weight.weight !== 0,
            )
          )
            ipsativeOptions += 1;
        }
        continue;
      }
      const weight = question.axisWeights.find(
        (candidate) => candidate.axisId === axis.id,
      )?.weight;
      if (weight === undefined || weight === 0) continue;
      const direction = Math.sign(weight) * (question.reverseScored ? -1 : 1);
      if (direction > 0) positiveItems += 1;
      if (direction < 0) negativeItems += 1;
    }
    const directionalTotal = positiveItems + negativeItems;
    return {
      axisId: axis.id,
      positiveItems,
      negativeItems,
      ipsativeOptions,
      imbalance:
        directionalTotal === 0
          ? 1
          : Math.abs(positiveItems - negativeItems) / directionalTotal,
    };
  });
}

export function sourceCoverage(questions: Question[]): SourceCoverageReport {
  const descriptive = questions.filter(
    (question) => question.active !== false && question.layer === "descriptive",
  );
  const sourcedItems = descriptive.filter(
    (question) => (question.sources?.length ?? 0) > 0,
  ).length;
  const operationalizedItems = descriptive.filter((question) =>
    Boolean(question.evidenceNote?.trim()),
  ).length;
  return {
    descriptiveItems: descriptive.length,
    sourcedItems,
    operationalizedItems,
    sourcedRate:
      descriptive.length === 0 ? 0 : sourcedItems / descriptive.length,
    operationalizedRate:
      descriptive.length === 0 ? 0 : operationalizedItems / descriptive.length,
  };
}

function selfLabelEstimate(
  records: ValidationResponse[],
  questions: Question[],
  axes: Axis[],
  labels: IdeologyLabel[],
  minimumCases: number,
): SelfLabelConcordance {
  const usable = records.filter(
    (record) =>
      record.administration === "test" &&
      record.selfLabelId &&
      labels.some((label) => label.id === record.selfLabelId),
  );
  if (usable.length < minimumCases) {
    return {
      status: "insufficient-data",
      n: usable.length,
      reason: `Requires at least ${minimumCases} test records with a recognized post-questionnaire, pre-result-display self-label; ${usable.length} are available.`,
    };
  }
  let top1 = 0;
  let top3 = 0;
  for (const record of usable) {
    const result = buildResultProfile(questions, record.answers, axes, labels);
    const nearest = result.nearestLabels.map((match) => String(match.labelId));
    if (nearest[0] === record.selfLabelId) top1 += 1;
    if (nearest.slice(0, 3).includes(record.selfLabelId!)) top3 += 1;
  }
  return {
    status: "estimated",
    n: usable.length,
    top1Rate: top1 / usable.length,
    top3Rate: top3 / usable.length,
    reason:
      "Agreement with optional ideology self-identification captured before results. This is criterion evidence, not proof of validity.",
  };
}

export function analyzePsychometricStudy(
  records: ValidationResponse[],
  questions: Question[],
  axes: Axis[],
  labels: IdeologyLabel[],
  options: PsychometricOptions = {},
): PsychometricStudyReport {
  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const testRecords = records.filter(
    (record) => record.administration === "test",
  );
  const retestRecords = records.filter(
    (record) => record.administration === "retest",
  );
  const uniqueRespondents = new Set(
    records.map((record) => record.respondentId),
  ).size;

  const axisReports = axes.map((axis) => {
    const items = eligibleItems(questions, axis.id);
    const matrix = completeCaseMatrix(records, items, axis.id).rows;
    const distribution = responseDistribution(records, items, axis.id);
    const denominator = distribution.observed + distribution.missing;
    return {
      axisId: axis.id,
      eligibleItemCount: items.length,
      completeCaseCount: matrix.length,
      cronbachAlpha: alphaEstimate(
        matrix,
        items.length,
        resolved.minimumCompleteCases,
      ),
      splitHalfReliability: splitHalfEstimate(
        matrix,
        items.length,
        resolved.minimumCompleteCases,
      ),
      testRetestCorrelation: testRetestEstimate(
        records,
        items,
        axis.id,
        resolved.minimumRetestPairs,
      ),
      itemTotalCorrelations: itemTotalEstimates(
        matrix,
        items,
        resolved.minimumCompleteCases,
      ),
      missingResponseRate:
        denominator === 0 ? 0 : distribution.missing / denominator,
      floorRate:
        distribution.observed === 0
          ? 0
          : distribution.floor / distribution.observed,
      ceilingRate:
        distribution.observed === 0
          ? 0
          : distribution.ceiling / distribution.observed,
    };
  });

  const excludedQuestionIds = questions
    .filter(
      (question) =>
        question.reviewStatus === "needs-rewrite" ||
        question.responseType === "statementChoice",
    )
    .map((question) => String(question.id));

  const status =
    uniqueRespondents === 0
      ? "not-collected"
      : uniqueRespondents < resolved.pilotRespondents
        ? "pilot"
        : "estimable";

  return {
    status,
    respondentCount: uniqueRespondents,
    testResponseCount: testRecords.length,
    retestResponseCount: retestRecords.length,
    axisReports,
    directionalBalance: directionalBalance(questions, axes),
    sourceCoverage: sourceCoverage(questions),
    selfLabelConcordance: selfLabelEstimate(
      records,
      questions,
      axes,
      labels,
      resolved.minimumCriterionCases,
    ),
    excludedQuestionIds,
    notes: [
      "Statement-choice items are ipsative and are excluded from internal-consistency estimates.",
      "Items marked needs-rewrite are excluded from psychometric estimates until rewritten and re-piloted.",
      "Cronbach alpha is not unidimensionality evidence; factor structure requires a separate preregistered analysis.",
      "Group fairness and differential item functioning require adequate voluntary subgroup samples and are not inferred from aggregate scores.",
    ],
  };
}
