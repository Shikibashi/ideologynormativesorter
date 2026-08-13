import type { AxisId, LabelId } from "../../../types/common";
import { axes } from "../../../data/axes";
import type { AuditFinding, IdeologyDossier } from "../types";
import { dossiers } from "../dossiers/index";
import { isMatchPoolMember } from "../predicates";

/** Pairwise L2 distance below this flags a near-duplicate centroid pair. */
export const NEAR_DUPLICATE_DISTANCE = 0.35;

const GENERATED_AT = "2026-07-19T00:00:00.000Z";
const AXIS_IDS = axes.map((a) => a.id) as AxisId[];

export interface SeparabilityDiagnostic {
  diagnosticId: string; // sep:{analysis}:{id}
  labelIdA: LabelId;
  labelIdB: LabelId;
  euclideanDistance: number;
  overlappingAxes: AxisId[];
  analysisType: "pairwise-distance" | "cluster-coherence" | "perturbation";
  result: "separable" | "near-duplicate" | "non-separable" | "needs-review";
  generatedAt: string;
}

export interface CentroidDistance {
  distance: number;
  overlappingAxes: AxisId[];
}

/**
 * Euclidean (L2) distance over the shared axis space.
 * Does not mutate centroids — diagnostics only.
 */
export function euclideanCentroidDistance(
  centroidA: Record<string, number>,
  centroidB: Record<string, number>,
  axisIds: AxisId[] = AXIS_IDS,
): CentroidDistance {
  let sumSq = 0;
  const overlappingAxes: AxisId[] = [];

  for (const axisId of axisIds) {
    const a = centroidA[axisId] ?? 0;
    const b = centroidB[axisId] ?? 0;
    const delta = a - b;
    sumSq += delta * delta;
    if (a !== 0 && b !== 0) overlappingAxes.push(axisId);
  }

  return { distance: Math.sqrt(sumSq), overlappingAxes };
}

function canonicalPair(a: LabelId, b: LabelId): [LabelId, LabelId] {
  return a <= b ? [a, b] : [b, a];
}

function dispositionForPair(a: IdeologyDossier, b: IdeologyDossier) {
  return a.family === b.family
    ? ("merge" as const)
    : ("park-separability" as const);
}

/**
 * Build AuditFinding records for near-duplicate diagnostics.
 * Lifecycle is always `proposed` — never auto-applied; centroids stay untouched.
 */
export function buildNearDuplicateFindings(
  diagnostics: SeparabilityDiagnostic[],
  pool: IdeologyDossier[] = dossiers.filter(isMatchPoolMember),
): AuditFinding[] {
  const byId = new Map(pool.map((d) => [d.labelId, d]));
  const findings: AuditFinding[] = [];

  for (const diagnostic of diagnostics) {
    if (
      diagnostic.analysisType !== "pairwise-distance" ||
      diagnostic.result !== "near-duplicate"
    ) {
      continue;
    }

    const [a, b] = canonicalPair(diagnostic.labelIdA, diagnostic.labelIdB);
    const dossierA = byId.get(a);
    const dossierB = byId.get(b);
    const proposedDisposition =
      dossierA && dossierB
        ? dispositionForPair(dossierA, dossierB)
        : ("park-separability" as const);

    findings.push({
      findingId: `finding:near-duplicate-centroid:${a}:${b}:1`,
      severity: "major",
      issueClass: "near-duplicate-centroid",
      subjectIds: [a, b],
      inventorySet: "effective-active",
      evidence:
        `Pairwise Euclidean centroid distance ${diagnostic.euclideanDistance.toFixed(4)} ` +
        `< ${NEAR_DUPLICATE_DISTANCE} between ${a} and ${b}` +
        (diagnostic.overlappingAxes.length > 0
          ? ` (overlappingAxes=${diagnostic.overlappingAxes.length})`
          : ""),
      evidenceCiteIds: [],
      proposedDisposition,
      lifecycle: "proposed",
      versionImpact: "none",
      linkedTestIds: ["separability.suite", "separability.policy"],
    });
  }

  return findings.sort((x, y) => x.findingId.localeCompare(y.findingId));
}

/**
 * For all match-pool dossiers: pairwise Euclidean distances + per-label
 * nearest-neighbor coherence summaries. Never retunes centroids.
 */
export function computeSeparabilityDiagnostics(
  pool: IdeologyDossier[] = dossiers.filter(isMatchPoolMember),
  generatedAt: string = GENERATED_AT,
): SeparabilityDiagnostic[] {
  const diagnostics: SeparabilityDiagnostic[] = [];
  const minNeighbor = new Map<
    LabelId,
    { neighborId: LabelId; distance: number; overlappingAxes: AxisId[] }
  >();

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const left = pool[i]!;
      const right = pool[j]!;
      const { distance, overlappingAxes } = euclideanCentroidDistance(
        left.centroid,
        right.centroid,
      );
      const [a, b] = canonicalPair(left.labelId, right.labelId);

      const prevA = minNeighbor.get(left.labelId);
      if (!prevA || distance < prevA.distance) {
        minNeighbor.set(left.labelId, {
          neighborId: right.labelId,
          distance,
          overlappingAxes,
        });
      }
      const prevB = minNeighbor.get(right.labelId);
      if (!prevB || distance < prevB.distance) {
        minNeighbor.set(right.labelId, {
          neighborId: left.labelId,
          distance,
          overlappingAxes,
        });
      }

      if (distance < NEAR_DUPLICATE_DISTANCE) {
        diagnostics.push({
          diagnosticId: `sep:near-duplicate:${a}:${b}`,
          labelIdA: a,
          labelIdB: b,
          euclideanDistance: distance,
          overlappingAxes,
          analysisType: "pairwise-distance",
          result: "near-duplicate",
          generatedAt,
        });
      }
    }
  }

  for (const dossier of pool) {
    const nearest = minNeighbor.get(dossier.labelId);
    if (!nearest) continue;

    diagnostics.push({
      diagnosticId: `sep:coherence:${dossier.labelId}`,
      labelIdA: dossier.labelId,
      labelIdB: nearest.neighborId,
      euclideanDistance: nearest.distance,
      overlappingAxes: nearest.overlappingAxes,
      analysisType: "cluster-coherence",
      result:
        nearest.distance < NEAR_DUPLICATE_DISTANCE
          ? "near-duplicate"
          : "separable",
      generatedAt,
    });
  }

  return diagnostics.sort((x, y) =>
    x.diagnosticId.localeCompare(y.diagnosticId),
  );
}

export const separabilityDiagnostics: SeparabilityDiagnostic[] =
  computeSeparabilityDiagnostics();

export const nearDuplicateFindings: AuditFinding[] = buildNearDuplicateFindings(
  separabilityDiagnostics,
);

export function diagnosticById(id: string): SeparabilityDiagnostic | undefined {
  return separabilityDiagnostics.find((d) => d.diagnosticId === id);
}
