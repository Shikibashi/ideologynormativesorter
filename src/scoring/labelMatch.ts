import type {
  Axis,
  AxisId,
  IdeologyLabel,
  LabelConflationFlag,
  LabelLayerEvidence,
  LabelMatch,
  Layer,
  ScoreBreakdown,
} from "../types";
import { compoundGateByLabelId } from "../data/compoundGates";

const NEAREST_LABEL_COUNT = 20;
export const MODIFIER_MATCH_LIMIT = 5;
export const MODIFIER_FIT_THRESHOLD = 0.65;
export const MODIFIER_EVIDENCE_THRESHOLD = 0.4;
/** A layer must agree at least this well to count as the "matched" layer. */
const MATCH_FLOOR = 0.7;
/** Spread between best and worst layer agreement that counts as conflation. */
const DIVERGENCE_DELTA = 0.18;
/** Per-axis gap (native -1..1 scale) above which an axis is "divergent". */
const AXIS_DIVERGENCE_GAP = 0.8;
/** Maximum divergent axes named per flag. */
const MAX_DIVERGENT_AXES = 3;
const LAYERS: Layer[] = ["normative", "descriptive", "prescriptive"];

interface MeasuredScore {
  normalized: number;
  itemCount: number;
}

function compoundGateStatus(
  breakdown: ScoreBreakdown,
  label: IdeologyLabel,
): LabelMatch["compoundGateStatus"] {
  const gate = compoundGateByLabelId.get(label.id);
  if (!gate) return undefined;

  const scoreMap = measuredScoreMap(breakdown);
  let insufficient = false;
  for (const requirement of gate.allOf) {
    const score = scoreMap.get(requirement.axisId);
    if (!score || score.itemCount === 0) {
      insufficient = true;
      continue;
    }
    if (requirement.min !== undefined && score.normalized < requirement.min)
      return "blocked";
    if (requirement.max !== undefined && score.normalized > requirement.max)
      return "blocked";
  }
  return insufficient ? "insufficient-evidence" : "passed";
}

function comparisonAxisIdsFor(label: IdeologyLabel): AxisId[] {
  return label.scoringScope
    ? ([...label.scoringScope.axisIds] as AxisId[])
    : (Object.keys(label.centroid) as AxisId[]);
}

/**
 * A broad primary must not be exposed when an unmeasured constitutive
 * construct would otherwise be silently filled in by agreement on unrelated
 * axes. This is intentionally an evidence gate, not a requirement that the
 * respondent already agrees with every core commitment.
 */
function scoringScopeGateStatus(
  breakdown: ScoreBreakdown,
  label: IdeologyLabel,
): LabelMatch["coreGateStatus"] {
  const scope = label.scoringScope;
  if (!scope) return undefined;

  const scoreMap = measuredScoreMap(breakdown);
  const missing = scope.requiredAxisIds.some((axisId) => {
    const minimumItemCount = scope.minimumItemCounts?.[axisId] ?? 1;
    return (scoreMap.get(axisId)?.itemCount ?? 0) < minimumItemCount;
  });
  return missing ? "insufficient-evidence" : "passed";
}

function measuredScoreMap(
  breakdown: ScoreBreakdown,
): Map<AxisId, MeasuredScore> {
  const all = [
    ...breakdown.normative,
    ...breakdown.descriptive,
    ...breakdown.prescriptive,
  ];
  return new Map(
    all.map((s) => [
      s.axisId,
      { normalized: s.normalized, itemCount: s.itemCount },
    ]),
  );
}

/**
 * Convert root-mean-square distance on the native -1..1 axis scale to [0,1].
 * RMS distance is already bounded by 2 regardless of axis count, so dividing by
 * sqrt(axisCount * 4) would incorrectly inflate fits as more axes are measured.
 */
function closeness(distance: number): number {
  return Number.isFinite(distance) ? Math.max(0, 1 - distance / 2) : 0;
}

function distanceOver(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  axisIds: AxisId[],
): {
  distance: number;
  measuredAxisCount: number;
  totalAxisCount: number;
  evidenceStrength: number;
} {
  let sum = 0;
  let weightSum = 0;
  let measuredAxisCount = 0;
  const totalAxisCount = axisIds.length;

  for (const axisId of axisIds) {
    const score = scoreMap.get(axisId);
    if (!score || score.itemCount === 0) continue;

    const evidenceWeight = Math.min(1, score.itemCount / 3);
    const respondent = score.normalized;
    const target = label.centroid[axisId] ?? 0;

    sum += evidenceWeight * (respondent - target) ** 2;
    weightSum += evidenceWeight;
    measuredAxisCount++;
  }

  return {
    distance:
      weightSum > 0 ? Math.sqrt(sum / weightSum) : Number.POSITIVE_INFINITY,
    measuredAxisCount,
    totalAxisCount,
    evidenceStrength: totalAxisCount > 0 ? weightSum / totalAxisCount : 0,
  };
}

/**
 * Calculate a label comparison independently within every judgment layer.
 * The same distance-and-evidence contract as overall matching is used here,
 * but these values are explanatory only: they never change rank or gates.
 */
function layerEvidenceFor(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  axes: readonly Axis[],
  comparisonAxisIds: readonly AxisId[],
): Record<Layer, LabelLayerEvidence> {
  const comparisonAxisIdSet = new Set(comparisonAxisIds);
  return Object.fromEntries(
    LAYERS.map((layer) => {
      const axisIds = axes
        .filter(
          (axis) =>
            axis.layer === layer &&
            comparisonAxisIdSet.has(axis.id) &&
            label.centroid[axis.id] !== undefined,
        )
        .map((axis) => axis.id);
      const { distance, measuredAxisCount, totalAxisCount, evidenceStrength } =
        distanceOver(scoreMap, label, axisIds);
      return [
        layer,
        {
          fit: measuredAxisCount > 0 ? closeness(distance) : null,
          evidenceStrength,
          measuredAxisCount,
          totalAxisCount,
        },
      ];
    }),
  ) as Record<Layer, LabelLayerEvidence>;
}

/**
 * Ranks ideology labels by Euclidean distance over measured axes.
 * This avoids treating unasked axes as neutral evidence while still lowering
 * confidence when the match rests on sparse answers.
 */
export function computeLabelMatches(
  breakdown: ScoreBreakdown,
  labels: IdeologyLabel[],
  axes?: readonly Axis[],
): LabelMatch[] {
  const scoreMap = measuredScoreMap(breakdown);

  const matches = labels.map((label) => {
    const axisIds = comparisonAxisIdsFor(label);
    const { distance, measuredAxisCount, totalAxisCount, evidenceStrength } =
      distanceOver(scoreMap, label, axisIds);
    const fit = measuredAxisCount > 0 ? closeness(distance) : 0;
    return {
      labelId: label.id,
      name: label.name,
      description: label.description,
      cautionNote: label.cautionNote,
      usageNote: label.usageNote,
      distance,
      fit,
      evidenceStrength,
      measuredAxisCount,
      totalAxisCount,
      runnerUpMargin: undefined as number | undefined,
      uncertaintyBand: "high" as "low" | "medium" | "high",
      compoundGateStatus: compoundGateStatus(breakdown, label),
      coreGateStatus: scoringScopeGateStatus(breakdown, label),
      reasoning: undefined as
        | ReturnType<typeof computeLabelMatchReasoning>
        | undefined,
      layerEvidence: axes
        ? layerEvidenceFor(scoreMap, label, axes, axisIds)
        : undefined,
    };
  });

  // A compound label cannot be a nearest result when its defining commitment
  // was either contradicted or not measured. A primary with a source-backed
  // scoring scope likewise cannot be exposed until each required core
  // construct is measured. These are eligibility boundaries, not claims that
  // the remaining centroid values are empirically validated.
  const eligibleMatches = matches.filter(
    (match) =>
      (match.compoundGateStatus === undefined ||
        match.compoundGateStatus === "passed") &&
      (match.coreGateStatus === undefined || match.coreGateStatus === "passed"),
  );

  eligibleMatches.sort((a, b) => a.distance - b.distance);
  const top = eligibleMatches.slice(0, NEAREST_LABEL_COUNT);

  // Set runnerUpMargin for rank 1 only
  if (top.length >= 2) {
    top[0].runnerUpMargin = top[0].fit - top[1].fit;
  }

  // Assign uncertainty bands
  for (const m of top) {
    if (
      m.evidenceStrength < 0.4 ||
      (m.runnerUpMargin !== undefined && m.runnerUpMargin < 0.03)
    ) {
      m.uncertaintyBand = "high";
    } else if (
      m.evidenceStrength < 0.7 ||
      (m.runnerUpMargin !== undefined && m.runnerUpMargin < 0.08)
    ) {
      m.uncertaintyBand = "medium";
    } else {
      m.uncertaintyBand = "low";
    }
  }
  // Compute reasoning breakdowns for the top matches
  for (const m of top) {
    const label = labels.find((l) => l.id === m.labelId);
    if (label) {
      m.reasoning = computeLabelMatchReasoning(
        scoreMap,
        label,
        comparisonAxisIdsFor(label),
      );
    }
  }

  return top;
}

/**
 * Returns only independently supported cross-cutting orientations. Modifiers
 * never compete with primary labels and weak or high-uncertainty matches are
 * intentionally omitted from the public result.
 */
export function computeModifierMatches(
  breakdown: ScoreBreakdown,
  labels: IdeologyLabel[],
  axes?: readonly Axis[],
): LabelMatch[] {
  return computeLabelMatches(breakdown, labels, axes)
    .filter((match) => match.fit >= MODIFIER_FIT_THRESHOLD)
    .filter((match) => match.evidenceStrength >= MODIFIER_EVIDENCE_THRESHOLD)
    .filter((match) => match.uncertaintyBand !== "high")
    .slice(0, MODIFIER_MATCH_LIMIT);
}

function computeLabelMatchReasoning(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  comparisonAxisIds: readonly AxisId[],
) {
  const sharedExtremeAxes: {
    axisId: AxisId;
    userScore: number;
    labelScore: number;
  }[] = [];
  const divergentAxes: {
    axisId: AxisId;
    userScore: number;
    labelScore: number;
  }[] = [];

  for (const axisId of comparisonAxisIds) {
    const target = label.centroid[axisId];
    if (target === undefined) continue;
    const ms = scoreMap.get(axisId);
    if (!ms) continue;

    const userScore = ms.normalized;

    // Shared extremes: both in the same direction, and both substantial
    if (
      Math.sign(userScore) === Math.sign(target) &&
      Math.abs(userScore) >= 0.25 &&
      Math.abs(target) >= 0.25
    ) {
      sharedExtremeAxes.push({ axisId, userScore, labelScore: target });
    }

    // Divergent: differ significantly in polarity or magnitude
    if (
      Math.sign(userScore) !== Math.sign(target) &&
      (Math.abs(userScore) >= 0.2 || Math.abs(target) >= 0.2)
    ) {
      divergentAxes.push({ axisId, userScore, labelScore: target });
    }
  }

  // Sort shared extremes by combined magnitude desc
  sharedExtremeAxes.sort(
    (a, b) =>
      Math.abs(b.userScore) +
      Math.abs(b.labelScore) -
      (Math.abs(a.userScore) + Math.abs(a.labelScore)),
  );

  // Sort divergent by absolute difference desc
  divergentAxes.sort(
    (a, b) =>
      Math.abs(b.userScore - b.labelScore) -
      Math.abs(a.userScore - a.labelScore),
  );

  return {
    sharedExtremeAxes: sharedExtremeAxes.slice(0, 3),
    divergentAxes: divergentAxes.slice(0, 3),
  };
}

const LAYER_NOUN: Record<Layer, string> = {
  normative: "moral commitments",
  descriptive: "empirical beliefs",
  prescriptive: "policy and strategy",
};

const LAYER_ADJ: Record<Layer, string> = {
  normative: "normative",
  descriptive: "descriptive",
  prescriptive: "prescriptive",
};

/**
 * Per-layer agreement on the native -1..1 score scale.
 * Mean absolute per-axis gap mapped to [0,1]: gap 0 -> 1 (identical),
 * gap 2 -> 0 (maximally opposed). Unlike full-vector closeness, this does
 * not divide by the theoretical maximum distance, so realistic divergences
 * remain visible instead of being compressed toward 1.
 */
function layerAgreement(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  axes: Axis[],
  layer: Layer,
): number {
  const comparisonAxisIds = new Set(comparisonAxisIdsFor(label));
  const layerAxes = axes.filter(
    (a) =>
      a.layer === layer &&
      comparisonAxisIds.has(a.id) &&
      label.centroid[a.id] !== undefined,
  );
  let sumAbs = 0;
  let measuredAxisCount = 0;
  for (const axis of layerAxes) {
    const score = scoreMap.get(axis.id);
    if (!score || score.itemCount === 0) continue;
    const respondent = score.normalized;
    const target = label.centroid[axis.id] ?? 0;
    sumAbs += Math.abs(respondent - target);
    measuredAxisCount++;
  }
  if (measuredAxisCount === 0) return 0;
  const meanAbsGap = sumAbs / measuredAxisCount;
  return Math.max(0, 1 - meanAbsGap / 2);
}

function hasMeasuredLayerEvidence(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  axes: Axis[],
  layer: Layer,
): boolean {
  const comparisonAxisIds = new Set(comparisonAxisIdsFor(label));
  return axes.some(
    (axis) =>
      axis.layer === layer &&
      comparisonAxisIds.has(axis.id) &&
      label.centroid[axis.id] !== undefined &&
      (scoreMap.get(axis.id)?.itemCount ?? 0) > 0,
  );
}

function divergentAxesFor(
  scoreMap: Map<AxisId, MeasuredScore>,
  label: IdeologyLabel,
  axes: Axis[],
  layers: Layer[],
): AxisId[] {
  const comparisonAxisIds = new Set(comparisonAxisIdsFor(label));
  const scored = axes
    .filter(
      (a) =>
        layers.includes(a.layer) &&
        comparisonAxisIds.has(a.id) &&
        label.centroid[a.id] !== undefined,
    )
    .flatMap((axis) => {
      const score = scoreMap.get(axis.id);
      if (!score || score.itemCount === 0) return [];
      const respondent = score.normalized;
      const target = label.centroid[axis.id] ?? 0;
      return [
        { id: axis.id, name: axis.name, gap: Math.abs(respondent - target) },
      ];
    })
    .filter((a) => a.gap >= AXIS_DIVERGENCE_GAP)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, MAX_DIVERGENT_AXES);
  return scored.map((a) => a.id);
}

/**
 * Flags nearest-fitting labels that match the respondent on one layer (e.g.
 * moral commitments) but diverge on another (e.g. policy and strategy).
 * Such a label, taken alone, would conflate the respondent's normative,
 * descriptive, and prescriptive positions into one, hiding exactly the
 * cross-layer divergence this test exists to surface.
 */
export function computeConflatedLabels(
  breakdown: ScoreBreakdown,
  labels: IdeologyLabel[],
  axes: Axis[],
): LabelConflationFlag[] {
  const scoreMap = measuredScoreMap(breakdown);
  const axisName = new Map(axes.map((a) => [a.id, a.name]));
  const flags: LabelConflationFlag[] = [];

  for (const label of labels) {
    const comparableLayers = LAYERS.filter((layer) =>
      hasMeasuredLayerEvidence(scoreMap, label, axes, layer),
    );
    // Do not manufacture a cross-layer disagreement when this label's scope
    // (or the respondent's answers) supplies evidence in only one layer.
    // A scope omission is a measurement limit, not a substantive divergence.
    if (comparableLayers.length < 2) continue;

    const agreement = {
      normative: layerAgreement(scoreMap, label, axes, "normative"),
      descriptive: layerAgreement(scoreMap, label, axes, "descriptive"),
      prescriptive: layerAgreement(scoreMap, label, axes, "prescriptive"),
    } as Record<Layer, number>;

    let matchedLayer: Layer = comparableLayers[0];
    for (const layer of comparableLayers) {
      if (agreement[layer] > agreement[matchedLayer]) matchedLayer = layer;
    }
    const best = agreement[matchedLayer];
    if (best < MATCH_FLOOR) continue;

    const conflatedLayers = comparableLayers.filter(
      (l) => l !== matchedLayer && best - agreement[l] >= DIVERGENCE_DELTA,
    );
    if (conflatedLayers.length === 0) continue;

    const divergentAxes = divergentAxesFor(
      scoreMap,
      label,
      axes,
      conflatedLayers,
    );

    const conflatedPhrase = conflatedLayers
      .map((l) => `${LAYER_ADJ[l]} (${LAYER_NOUN[l]})`)
      .join(" and ");
    const axisPhrase =
      divergentAxes.length > 0
        ? ` Your sharpest divergences are on ${divergentAxes.map((id) => `"${axisName.get(id) ?? id}"`).join(", ")}.`
        : "";
    const reason = `You match ${label.name} on ${LAYER_ADJ[matchedLayer]} grounds (${LAYER_NOUN[matchedLayer]}), but a test that assigned this label would conflate that with your ${conflatedPhrase}, where you diverge from it.${axisPhrase}`;

    flags.push({
      labelId: label.id,
      name: label.name,
      matchedLayer,
      conflatedLayers,
      layerAgreement: agreement,
      divergentAxes,
      reason,
    });
  }

  flags.sort(
    (a, b) =>
      b.layerAgreement[b.matchedLayer] -
      Math.min(...b.conflatedLayers.map((l) => b.layerAgreement[l])) -
      (a.layerAgreement[a.matchedLayer] -
        Math.min(...a.conflatedLayers.map((l) => a.layerAgreement[l]))),
  );
  return flags;
}
