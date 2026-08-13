export type SpecialistEvidenceStatus = "sufficient" | "insufficient-evidence";

export interface SpecialistConstructEvidence {
  answeredItemCount: number;
  itemCount: number;
  answeredWeight: number;
  totalWeight: number;
  weightedCoverage: number;
  effectiveItemCount: number;
  sufficient: boolean;
}

export interface SpecialistEvidenceSummary {
  answeredItemCount: number;
  totalItemCount: number;
  answeredCoverage: number;
  weightedAnsweredCoverage: number;
  effectiveItemCount: number;
  status: SpecialistEvidenceStatus;
  insufficientReason?: string;
  constructs: Record<string, SpecialistConstructEvidence>;
}

export interface SpecialistProfileEvidence {
  evidenceStatus: SpecialistEvidenceStatus;
  insufficientEvidence: boolean;
  evidenceCoverage: number;
  coveredConstructCount: number;
  requiredConstructCount: number;
}

export interface SpecialistConstructGate {
  constructId: string;
  min?: number;
  max?: number;
}

export type SpecialistGateStatus =
  | "passed"
  | "blocked"
  | "insufficient-evidence";

export interface SpecialistGateEvaluation {
  status: SpecialistGateStatus;
  failedConstructIds: string[];
}

/**
 * Evaluate necessary construct commitments separately from centroid distance.
 * Missing construct evidence abstains; a measured contradiction blocks the
 * candidate. This keeps a plausible nearest-neighbour score from laundering
 * an absent or contradicted defining commitment into a specialist result.
 */
export function evaluateSpecialistConstructGates(
  summary: SpecialistEvidenceSummary,
  constructScores: Readonly<Record<string, number>>,
  gates: readonly SpecialistConstructGate[] = [],
): SpecialistGateEvaluation {
  let hasInsufficientEvidence = false;
  const failedConstructIds: string[] = [];

  for (const gate of gates) {
    const evidence = summary.constructs[gate.constructId];
    const score = constructScores[gate.constructId];
    if (!evidence?.sufficient || !Number.isFinite(score)) {
      hasInsufficientEvidence = true;
      continue;
    }
    if (
      (gate.min !== undefined && score < gate.min) ||
      (gate.max !== undefined && score > gate.max)
    ) {
      failedConstructIds.push(gate.constructId);
    }
  }

  if (hasInsufficientEvidence)
    return { status: "insufficient-evidence", failedConstructIds };
  if (failedConstructIds.length > 0)
    return { status: "blocked", failedConstructIds };
  return { status: "passed", failedConstructIds };
}

interface WeightedItem {
  question: { id: string };
  constructWeights: Partial<Record<string, number>>;
}

export function summarizeSpecialistEvidence(
  items: readonly WeightedItem[],
  answers: Readonly<Record<string, number | undefined>>,
  constructIds: readonly string[],
): SpecialistEvidenceSummary {
  const constructs = Object.fromEntries(
    constructIds.map((constructId) => [
      constructId,
      {
        answeredItemCount: 0,
        itemCount: 0,
        answeredWeight: 0,
        totalWeight: 0,
        weightedCoverage: 0,
        effectiveItemCount: 0,
        sufficient: false,
      },
    ]),
  ) as Record<string, SpecialistConstructEvidence>;

  let answeredItemCount = 0;
  let weightedAnsweredTotal = 0;
  let totalWeight = 0;

  for (const item of items) {
    const answer = answers[item.question.id];
    const answered = answer !== undefined && Number.isFinite(answer);
    if (answered) answeredItemCount += 1;

    for (const constructId of constructIds) {
      const weight = item.constructWeights[constructId];
      if (weight === undefined || !Number.isFinite(weight) || weight === 0)
        continue;
      const evidence = constructs[constructId];
      const absoluteWeight = Math.abs(weight);
      evidence.itemCount += 1;
      evidence.totalWeight += absoluteWeight;
      totalWeight += absoluteWeight;
      if (answered) {
        evidence.answeredItemCount += 1;
        evidence.answeredWeight += absoluteWeight;
        weightedAnsweredTotal += absoluteWeight;
      }
    }
  }

  const averageItemWeight = items.length > 0 ? totalWeight / items.length : 0;
  for (const evidence of Object.values(constructs)) {
    evidence.weightedCoverage =
      evidence.totalWeight === 0
        ? 0
        : evidence.answeredWeight / evidence.totalWeight;
    evidence.effectiveItemCount =
      averageItemWeight === 0 ? 0 : evidence.answeredWeight / averageItemWeight;
    evidence.sufficient =
      evidence.itemCount > 0 &&
      evidence.answeredItemCount >= Math.min(2, evidence.itemCount) &&
      evidence.weightedCoverage >= 0.5;
  }

  const weightedAnsweredCoverage =
    totalWeight === 0 ? 0 : weightedAnsweredTotal / totalWeight;
  const status: SpecialistEvidenceStatus =
    answeredItemCount === 0 || weightedAnsweredCoverage < 0.5
      ? "insufficient-evidence"
      : "sufficient";

  return {
    answeredItemCount,
    totalItemCount: items.length,
    answeredCoverage: items.length === 0 ? 0 : answeredItemCount / items.length,
    weightedAnsweredCoverage,
    effectiveItemCount:
      averageItemWeight === 0 ? 0 : weightedAnsweredTotal / averageItemWeight,
    status,
    ...(status === "insufficient-evidence"
      ? {
          insufficientReason:
            "Answer coverage is too sparse for an interpretable specialist comparison.",
        }
      : {}),
    constructs,
  };
}

export function profileEvidence(
  summary: SpecialistEvidenceSummary,
  signals: Readonly<Record<string, number>>,
): SpecialistProfileEvidence {
  const requiredConstructIds = Object.keys(signals);
  const coveredConstructIds = requiredConstructIds.filter(
    (constructId) => summary.constructs[constructId]?.sufficient,
  );
  const minimumCoveredConstructs =
    requiredConstructIds.length <= 1
      ? requiredConstructIds.length
      : Math.max(2, Math.ceil(requiredConstructIds.length / 2));
  const evidenceCoverage =
    requiredConstructIds.length === 0
      ? 0
      : coveredConstructIds.length / requiredConstructIds.length;
  // Evidence sufficiency is profile-specific. A respondent can answer the two
  // Pan-African items while skipping unrelated identity constructs; module-wide
  // coverage remains sparse, but that should not erase the narrower signal.
  const sufficient = coveredConstructIds.length >= minimumCoveredConstructs;

  return {
    evidenceStatus: sufficient ? "sufficient" : "insufficient-evidence",
    insufficientEvidence: !sufficient,
    evidenceCoverage,
    coveredConstructCount: coveredConstructIds.length,
    requiredConstructCount: requiredConstructIds.length,
  };
}

export function profileDistanceConstructIds(
  summary: SpecialistEvidenceSummary,
  signals: Readonly<Record<string, number>>,
): string[] {
  return Object.keys(signals).filter(
    (constructId) => summary.constructs[constructId]?.sufficient,
  );
}
