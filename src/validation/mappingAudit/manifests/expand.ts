import type { AxisWeight, Question } from "../../../types";
import type { CorpusId } from "../types";

const LIKERT5_VALUES = [-2, -1, 0, 1, 2] as const;
const LIKERT7_VALUES = [-3, -2, -1, 0, 1, 2, 3] as const;

export interface SelectableResponse {
  responseKey: string;
  responseValue: number | string | null;
  axisWeights: AxisWeight[];
}

/**
 * Expand a question into selectable response keys and the axis weights that
 * fire for each key. Coverage primary key = questionId × responseKey × axisId
 * at default salience (no confidence/priority rating).
 */
export function expandSelectableResponses(
  question: Question,
): SelectableResponse[] {
  if (question.responseType === "statementChoice") {
    return (question.statementOptions ?? []).map((option, index) => ({
      responseKey: `option:${index}|${option.id}`,
      responseValue: index,
      axisWeights: option.axisWeights,
    }));
  }

  const values =
    question.responseType === "likert5" ? LIKERT5_VALUES : LIKERT7_VALUES;
  const rows: SelectableResponse[] = values.map((value) => ({
    responseKey: `likert:${value}`,
    responseValue: value,
    axisWeights: question.axisWeights,
  }));

  if (question.allowDontKnow) {
    rows.push({
      responseKey: "dont_know",
      responseValue: "dont_know",
      axisWeights: question.axisWeights,
    });
  }

  return rows;
}

export function contributionId(
  questionId: string,
  responseKey: string,
  axisId: string,
): string {
  return `rc:${questionId}:${responseKey}:${axisId}`;
}

export function expectedContributionCardinality(questions: Question[]): number {
  let count = 0;
  for (const question of questions) {
    for (const response of expandSelectableResponses(question)) {
      count += response.axisWeights.length;
    }
  }
  return count;
}

export function corpusForQuestion(
  question: Question,
  explicit?: CorpusId,
): CorpusId {
  if (explicit) return explicit;
  if (
    question.responseType === "statementChoice" &&
    question.id.startsWith("stmt-")
  ) {
    return "statement";
  }
  return "main";
}
