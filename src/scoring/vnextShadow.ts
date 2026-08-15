import { questions as defaultQuestions } from "../data/effectiveQuestions";
import { vnextFacetById, vnextRootById } from "../data/vnextConstructs";
import { vnextItemAnnotationById } from "../data/vnextItemAnnotations";
import { vnextShadowVersionTuple } from "../data/vnextShadow";
import { vnextSurfaceManifestBySurface } from "../data/vnextSurfaceManifests";
import { contributionForQuestionAxis } from "./aggregate";
import { VNEXT_SHADOW_SCORING_VERSION } from "../validation/vnextVersions";
import type {
  AnswerMap,
  Layer,
  Question,
  VNextShadowEstimate,
  VNextShadowResult,
} from "../types";

const LAYERS: readonly Layer[] = ["normative", "descriptive", "prescriptive"];

function emptyMissingness(): Record<string, number> {
  return {
    dont_know: 0,
    prefer_not_to_answer: 0,
    omitted: 0,
    blocked: 0,
    invalid: 0,
  };
}

function estimate(
  id: string,
  layer: Layer,
  entries: readonly {
    question: Question;
    answerValue: string | number | undefined;
    contribution: number;
    weight: number;
  }[],
  eligibleItemCount: number,
  missingness: Readonly<Record<string, number>>,
  abstentionRationale?: string,
): VNextShadowEstimate {
  const answered = entries.filter((entry) => entry.answerValue !== undefined);
  const weightSum = answered.reduce(
    (sum, entry) => sum + Math.abs(entry.weight),
    0,
  );
  const raw = answered.reduce((sum, entry) => sum + entry.contribution, 0);
  const measured = answered.length > 0 && weightSum > 0;
  const evidenceStatus = measured
    ? answered.length < eligibleItemCount
      ? "partial"
      : "measured"
    : abstentionRationale
      ? "abstained"
      : "unmeasured";
  return {
    id,
    layer,
    measured,
    ...(measured ? { score: Math.min(1, Math.max(-1, raw / weightSum)) } : {}),
    answeredItemIds: answered.map((entry) => entry.question.id),
    eligibleItemCount,
    answeredItemCount: answered.length,
    weightSum,
    coverage: eligibleItemCount > 0 ? answered.length / eligibleItemCount : 0,
    missingness,
    evidenceStatus,
    uncertainty: {
      kind: "unquantified",
      reason:
        "Respondent calibration, uncertainty, and promotion evidence are not available in the design-only shadow contract.",
    },
    claimCeiling: "PC0",
    ...(abstentionRationale ? { abstentionRationale } : {}),
  };
}

function answerState(answer: AnswerMap[string] | undefined): string {
  if (!answer) return "omitted";
  if (answer.value === "dont_know") return "dont_know";
  if (answer.value === "prefer_not_to_answer") return "prefer_not_to_answer";
  if (typeof answer.value !== "number" || !Number.isFinite(answer.value))
    return "invalid";
  return "answered";
}

function buildEstimate(
  id: string,
  layer: Layer,
  questions: readonly Question[],
  answers: AnswerMap,
  include: (itemId: string) => boolean,
  axisId: string,
): VNextShadowEstimate {
  const selected = questions.filter((question) => include(question.id));
  const missingness = emptyMissingness();
  const entries = selected.flatMap((question) => {
    const answer = answers[question.id];
    const state = answerState(answer);
    if (state !== "answered") {
      missingness[state] = (missingness[state] ?? 0) + 1;
      return [];
    }
    if (!answer) return [];
    const contribution = contributionForQuestionAxis(question, answer, axisId);
    if (contribution === null) {
      missingness.invalid += 1;
      return [];
    }
    const axisWeight =
      question.responseType === "statementChoice" &&
      typeof answer.value === "number"
        ? question.statementOptions?.[answer.value]?.axisWeights.find(
            (weight) => weight.axisId === axisId,
          )
        : question.axisWeights.find((weight) => weight.axisId === axisId);
    if (!axisWeight) return [];
    return [
      {
        question,
        answerValue: answer.value,
        contribution,
        weight: axisWeight.weight,
      },
    ];
  });
  return estimate(id, layer, entries, selected.length, missingness);
}

function buildFacetEstimate(
  id: string,
  layer: Layer,
  questions: readonly Question[],
  answers: AnswerMap,
  include: (itemId: string) => boolean,
): VNextShadowEstimate {
  const selected = questions.filter((question) => include(question.id));
  const missingness = emptyMissingness();
  let answeredWithoutFacetContract = 0;
  for (const question of selected) {
    const state = answerState(answers[question.id]);
    if (state !== "answered")
      missingness[state] = (missingness[state] ?? 0) + 1;
    else answeredWithoutFacetContract += 1;
  }
  if (answeredWithoutFacetContract > 0)
    missingness.blocked = answeredWithoutFacetContract;
  return estimate(
    id,
    layer,
    [],
    selected.length,
    missingness,
    "No approved facet-level weight/estimator is attached to this item; root weights cannot be reused for a facet estimate.",
  );
}

function duplicateIds(questions: readonly Question[]): string[] {
  const seen = new Set<string>();
  const duplicate = new Set<string>();
  for (const question of questions) {
    if (seen.has(question.id)) duplicate.add(question.id);
    seen.add(question.id);
  }
  return [...duplicate];
}

export function computeVNextShadowScores(
  inputQuestions: readonly Question[] = defaultQuestions,
  answers: AnswerMap = {},
): VNextShadowResult {
  const questions = [...inputQuestions];
  const duplicateQuestionIds = duplicateIds(questions);
  if (duplicateQuestionIds.length > 0) {
    throw new Error(
      `vNext shadow scorer received duplicate question IDs: ${duplicateQuestionIds.join(", ")}`,
    );
  }
  const warnings: string[] = [];
  const excludedItemIds: string[] = [];
  const usableQuestions = questions.filter((question) => {
    const annotation = vnextItemAnnotationById.get(question.id);
    if (!annotation) {
      warnings.push(`${question.id} has no vNext annotation`);
      return false;
    }
    if (annotation.analysisEligibility === "blocked-pending-replacement") {
      excludedItemIds.push(question.id);
      return false;
    }
    return true;
  });
  const roots = [...vnextRootById.values()];
  const facets = [...vnextFacetById.values()];
  const rootScores = roots.map((root) =>
    buildEstimate(
      root.id,
      root.layer,
      usableQuestions.filter((question) => question.layer === root.layer),
      answers,
      (itemId) =>
        vnextItemAnnotationById
          .get(itemId)
          ?.intendedRootIds.includes(root.id) ?? false,
      root.id,
    ),
  );
  const facetScores = facets.map((facet) =>
    buildFacetEstimate(
      facet.id,
      facet.layer,
      usableQuestions.filter((question) => question.layer === facet.layer),
      answers,
      (itemId) =>
        vnextItemAnnotationById.get(itemId)?.facetIds.includes(facet.id) ??
        false,
    ),
  );
  const allMeasured = [...rootScores, ...facetScores].some(
    (score) => score.measured,
  );
  const surfaceManifestId = usableQuestions.every((question) =>
    vnextSurfaceManifestBySurface.get("core")?.itemIds.includes(question.id),
  )
    ? vnextSurfaceManifestBySurface.get("core")!.manifestId
    : (vnextSurfaceManifestBySurface.get("specialist")?.manifestId ??
      "vnext-analysis-surface:unresolved");
  const abstentionRationale = facetScores.flatMap((score) =>
    score.abstentionRationale
      ? [`${score.id}: ${score.abstentionRationale}`]
      : [],
  );
  const surfaceManifest = [...vnextSurfaceManifestBySurface.values()].find(
    (manifest) => manifest.manifestId === surfaceManifestId,
  );
  const facetEstimates = facetScores.map((score) => ({
    facetId: score.id,
    status: score.measured ? ("estimated" as const) : ("abstained" as const),
    ...(score.score === undefined ? {} : { value: score.score }),
    uncertainty: score.uncertainty.reason,
    ...(score.abstentionRationale
      ? { abstentionRationale: score.abstentionRationale }
      : {}),
  }));
  return {
    resultId: `vnext-shadow-run:${surfaceManifestId}:${questions.length}`,
    researchOnly: true,
    productionConsumed: false,
    failClosed: true,
    versionTuple: vnextShadowVersionTuple,
    itemFingerprint: surfaceManifest?.itemFingerprint ?? "unresolved",
    missingnessStatus: allMeasured ? "partial" : "missing",
    refusalHandling:
      "Refusal, dont-know, omitted, blocked, and invalid responses remain explicit missingness states and cannot be coerced into directional estimates.",
    uncertaintyStatus: "not-estimable",
    claimTierCeiling: "PC0",
    rootEstimates: Object.fromEntries(
      rootScores.flatMap((score) =>
        score.score === undefined ? [] : [[score.id, score.score]],
      ),
    ),
    facetEstimates,
    facetEstimationRule:
      "Estimate a facet only from its declared facet-level model and evidence; never reuse a root weight or impute an absent facet.",
    rootWeightReuse: false,
    scoringVersion: VNEXT_SHADOW_SCORING_VERSION,
    questionIds: questions.map((question) => question.id),
    rootScores,
    facetScores,
    measuredLayerMask: Object.fromEntries(
      LAYERS.map((layer) => [
        layer,
        rootScores.some((score) => score.layer === layer && score.measured),
      ]),
    ) as Record<Layer, boolean>,
    excludedItemIds,
    warnings: [...new Set(warnings)],
    evidenceStatus: allMeasured ? "partial" : "design-only",
    claimCeiling: "PC0",
    surfaceManifestId,
    abstentionRationale,
  };
}
