import { canonicalRegistry } from "../domain/registry";
import type { CanonicalRegistry } from "../domain/registry";
import type {
  ProductionAbstention,
  ProductionDimensionDefinition,
  ProductionDimensionScore,
  ProductionEvidenceCoverage,
  ProductionLabelEndpoint,
  ProductionLabelMatch,
  ProductionPrimitiveOutput,
  ProductionPrimitiveRequest,
  ProductionProfile,
  ProductionResponse,
  ProductionScoreOptions,
  ProductionScoreRequest,
  ProductionScoredResponse,
  ProductionScoringAdapter,
  ProductionResult,
  ProductionUncertainty,
  ProductionUncertaintyReason,
} from "./contracts";
import { validateCanonicalRegistry } from "../domain/registryValidation";
import {
  PRODUCTION_CONTRACT_VERSION,
  PRODUCTION_PROFILE_VERSION,
  PRODUCTION_RESULT_VERSION,
  PRODUCTION_SCORING_VERSION,
} from "./contracts";
import type { CanonicalItem, StableId } from "../domain/canonicalManifest";

const DEFAULT_MINIMUM_COVERAGE = 0.5;
const TRANSFORM = "weighted-mean-v1" as const;
export const CANONICAL_PRODUCTION_ADAPTER_VERSION =
  "canonical-registry-v2" as const;

type ResponseStatus = NonNullable<ProductionResponse["status"]>;

interface NormalizedResponses {
  readonly usable: readonly ProductionScoredResponse[];
  readonly abstentions: readonly ProductionAbstention[];
  readonly expectedItemIds: readonly StableId[];
}

export interface ProductionResponseNormalization {
  readonly responses: readonly ProductionScoredResponse[];
  readonly abstentions: readonly ProductionAbstention[];
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isProductionResponseStatus(value: unknown): value is ResponseStatus {
  return (
    value === "answered" ||
    value === "missing" ||
    value === "refused" ||
    value === "abstained"
  );
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stableUnique(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => compareStable(left, right));
}
function compareStable(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function clampUnit(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function finiteUnit(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= -1 &&
    value <= 1
  );
}

function statusOrder(status: ResponseStatus): number {
  switch (status) {
    case "answered":
      return 0;
    case "missing":
      return 1;
    case "refused":
      return 2;
    case "abstained":
      return 3;
  }
}

function abstention(
  code: ProductionAbstention["code"],
  itemIds: readonly string[],
): ProductionAbstention {
  const ids = stableUnique(itemIds);
  const messages: Record<ProductionAbstention["code"], string> = {
    "no-responses": "No production responses were supplied.",
    "missing-response":
      "The response was missing and cannot measure a profile dimension.",
    "refused-response": "The respondent refused this item.",
    "abstained-response": "The response was explicitly abstained.",
    "invalid-response":
      "The response value is not a finite number in the range -1 through 1.",
    "unknown-item":
      "The response item is not present in the canonical registry.",
    "duplicate-response":
      "Multiple responses used the same item; one deterministic value was retained.",
    "insufficient-evidence":
      "Evidence coverage is below the production minimum.",
    "canonical-registry-unavailable":
      "The canonical production registry is unavailable; production scoring abstains.",
    "adapter-refused":
      "The scoring adapter did not return a valid normalized value.",
  };
  return { code, itemIds: ids, message: messages[code] };
}

function responsesFromRequest(
  responses: unknown,
): readonly ProductionResponse[] {
  if (Array.isArray(responses))
    return responses as readonly ProductionResponse[];
  if (isRecord(responses) && Array.isArray(responses.responses)) {
    return responses.responses as readonly ProductionResponse[];
  }
  return [];
}

function productionItems(
  registry: CanonicalRegistry,
): readonly CanonicalItem[] {
  const activeCoreItemIds = registry.manifest.activeCoreItemIds;
  const items = registry.list("item");
  if (!activeCoreItemIds || activeCoreItemIds.length === 0) return items;
  const activeIds = new Set(activeCoreItemIds);
  return items.filter((item) => activeIds.has(item.id));
}

function dimensionDefinitions(
  registry: CanonicalRegistry,
): readonly ProductionDimensionDefinition[] {
  const itemWeights = new Map<StableId, Map<StableId, number>>();
  for (const construct of registry.list("construct")) {
    itemWeights.set(construct.id, new Map());
  }

  const explicitMappings = new Set<string>();
  for (const mapping of registry.list("mapping")) {
    if (mapping.source.kind !== "item" || mapping.target.kind !== "construct")
      continue;
    if (
      mapping.relation !== "measures" &&
      mapping.relation !== "supports" &&
      mapping.relation !== "contrasts" &&
      mapping.relation !== "composes"
    ) {
      continue;
    }
    const byItem =
      itemWeights.get(mapping.target.id) ?? new Map<StableId, number>();
    const relationDefault = mapping.relation === "contrasts" ? -1 : 1;
    byItem.set(mapping.source.id, mapping.weight ?? relationDefault);
    itemWeights.set(mapping.target.id, byItem);
    explicitMappings.add(`${mapping.source.id}\u0000${mapping.target.id}`);
  }

  for (const item of productionItems(registry)) {
    const canonicalEntries = Object.entries(
      item.rootConstructWeights ?? {},
    ).filter(([, weight]) => Number.isFinite(weight) && weight !== 0);
    if (canonicalEntries.length > 0) {
      for (const [constructId, weight] of canonicalEntries) {
        const byItem =
          itemWeights.get(constructId) ?? new Map<StableId, number>();
        byItem.set(item.id, weight);
        itemWeights.set(constructId, byItem);
        explicitMappings.add(`${item.id}\u0000${constructId}`);
      }
      continue;
    }

    const statementConstructIds = new Set<StableId>();
    for (const option of item.statementOptions ?? []) {
      for (const constructId of Object.keys(option.rootConstructWeights)) {
        statementConstructIds.add(constructId);
      }
    }
    if (statementConstructIds.size > 0) {
      for (const constructId of statementConstructIds) {
        const byItem =
          itemWeights.get(constructId) ?? new Map<StableId, number>();
        byItem.set(item.id, 1);
        itemWeights.set(constructId, byItem);
        explicitMappings.add(`${item.id}\u0000${constructId}`);
      }
      continue;
    }

    for (const constructId of item.constructIds) {
      if (explicitMappings.has(`${item.id}\u0000${constructId}`)) continue;
      const byItem =
        itemWeights.get(constructId) ?? new Map<StableId, number>();
      byItem.set(item.id, (byItem.get(item.id) ?? 0) + 1);
      itemWeights.set(constructId, byItem);
    }
  }

  return [...itemWeights.entries()]
    .sort(([left], [right]) => compareStable(left, right))
    .map(([id, weights]) => ({
      id,
      itemWeights: Object.fromEntries(
        [...weights.entries()]
          .filter(([, weight]) => Number.isFinite(weight) && weight !== 0)
          .sort(([left], [right]) => compareStable(left, right)),
      ),
    }));
}

function normalizeResponses(
  responses: readonly ProductionResponse[],
  registry: CanonicalRegistry,
): NormalizedResponses {
  const expectedItemIds = productionItems(registry)
    .map((item) => item.id)
    .sort((left, right) => compareStable(left, right));
  const knownItems = new Set(expectedItemIds);
  const sorted: readonly ProductionResponse[] = [...responses].sort(
    (left, right) => {
      const leftRecord: Record<string, unknown> = isRecord(left) ? left : {};
      const rightRecord: Record<string, unknown> = isRecord(right) ? right : {};
      const itemOrder = compareStable(
        String(leftRecord.itemId ?? ""),
        String(rightRecord.itemId ?? ""),
      );
      if (itemOrder !== 0) return itemOrder;
      const leftStatus = isProductionResponseStatus(leftRecord.status)
        ? leftRecord.status
        : "answered";
      const rightStatus = isProductionResponseStatus(rightRecord.status)
        ? rightRecord.status
        : "answered";
      const statusDifference =
        statusOrder(leftStatus) - statusOrder(rightStatus);
      if (statusDifference !== 0) return statusDifference;
      return compareStable(
        String(leftRecord.value ?? ""),
        String(rightRecord.value ?? ""),
      );
    },
  );
  const usable: ProductionScoredResponse[] = [];
  const abstentions: ProductionAbstention[] = [];
  const seen = new Set<StableId>();

  for (const rawResponse of sorted) {
    if (!isRecord(rawResponse)) {
      abstentions.push(abstention("invalid-response", []));
      continue;
    }
    const itemId = rawResponse.itemId;
    if (!nonEmptyString(itemId)) {
      abstentions.push(abstention("invalid-response", []));
      continue;
    }
    const statusValue = rawResponse.status;
    if (statusValue !== undefined && !isProductionResponseStatus(statusValue)) {
      abstentions.push(abstention("invalid-response", [itemId]));
      continue;
    }
    const status: ResponseStatus = statusValue ?? "answered";
    if (!knownItems.has(itemId)) {
      abstentions.push(abstention("unknown-item", [itemId]));
      continue;
    }
    if (seen.has(itemId)) {
      abstentions.push(abstention("duplicate-response", [itemId]));
      continue;
    }
    seen.add(itemId);
    if (status !== "answered") {
      const code =
        status === "missing"
          ? "missing-response"
          : status === "refused"
            ? "refused-response"
            : "abstained-response";
      abstentions.push(abstention(code, [itemId]));
      continue;
    }
    if (!finiteUnit(rawResponse.value)) {
      abstentions.push(abstention("invalid-response", [itemId]));
      continue;
    }
    if (
      rawResponse.constructValues !== undefined &&
      !isRecord(rawResponse.constructValues)
    ) {
      abstentions.push(abstention("invalid-response", [itemId]));
      continue;
    }
    const constructValues = isRecord(rawResponse.constructValues)
      ? Object.fromEntries(
          Object.entries(rawResponse.constructValues).filter(([, value]) =>
            finiteUnit(value),
          ),
        )
      : undefined;
    if (
      rawResponse.constructValues &&
      Object.keys(constructValues ?? {}).length !==
        Object.keys(rawResponse.constructValues).length
    ) {
      abstentions.push(abstention("invalid-response", [itemId]));
      continue;
    }
    usable.push({
      itemId,
      value: rawResponse.value,
      ...(constructValues && Object.keys(constructValues).length > 0
        ? { constructValues }
        : {}),
    });
  }

  if (responses.length === 0) abstentions.push(abstention("no-responses", []));
  return { usable, abstentions, expectedItemIds };
}

/** Convert the external response contract into stable adapter input. */
export function normalizeProductionResponses(
  responses: readonly ProductionResponse[],
  registry: CanonicalRegistry = canonicalRegistry,
): ProductionResponseNormalization {
  const validation = validateCanonicalRegistry(registry);
  if (!validation.valid) {
    return {
      responses: [],
      abstentions: [abstention("canonical-registry-unavailable", [])],
    };
  }
  const normalized = normalizeResponses(
    Array.isArray(responses) ? responses : [],
    registry,
  );
  return {
    responses: normalized.usable,
    abstentions: normalized.abstentions,
  };
}

function defaultAdapter(): ProductionScoringAdapter {
  return {
    id: "weighted-mean-v1",
    score(request: ProductionPrimitiveRequest): ProductionPrimitiveOutput {
      const responses = new Map(
        request.responses.map((response) => [response.itemId, response]),
      );
      const output: Record<StableId, number | null> = {};
      for (const dimension of request.dimensions) {
        let numerator = 0;
        let denominator = 0;
        for (const [itemId, weight] of Object.entries(dimension.itemWeights)) {
          const response = responses.get(itemId);
          if (
            response === undefined ||
            !Number.isFinite(weight) ||
            weight === 0
          )
            continue;
          const directValue = response.constructValues?.[dimension.id];
          if (directValue !== undefined && finiteUnit(directValue)) {
            numerator += directValue;
            denominator += 1;
            continue;
          }
          numerator += response.value * weight;
          denominator += Math.abs(weight);
        }
        output[dimension.id] =
          denominator === 0 ? null : clampUnit(numerator / denominator);
      }
      return { values: output };
    },
  };
}

function coverage(
  answeredItems: number,
  expectedItems: number,
  minimumCoverage: number,
): ProductionEvidenceCoverage {
  const ratio = expectedItems === 0 ? 0 : answeredItems / expectedItems;
  const bounded = Math.max(0, Math.min(1, ratio));
  return {
    answeredItems,
    expectedItems,
    coverage: bounded,
    status:
      bounded === 0
        ? "none"
        : bounded >= minimumCoverage
          ? "sufficient"
          : "partial",
  };
}

function uncertainty(
  evidence: ProductionEvidenceCoverage,
  abstentions: readonly ProductionAbstention[],
  extraReasons: readonly ProductionUncertaintyReason[] = [],
): ProductionUncertainty {
  const reasons = new Set<ProductionUncertaintyReason>(extraReasons);
  for (const entry of abstentions) {
    if (entry.code === "refused-response") reasons.add("refusal");
    if (entry.code === "missing-response") reasons.add("missingness");
    if (entry.code === "abstained-response") reasons.add("abstention");
    if (entry.code === "insufficient-evidence")
      reasons.add("insufficient-evidence");
    if (entry.code === "adapter-refused") reasons.add("adapter-output");
  }
  if (evidence.status !== "sufficient") reasons.add("insufficient-evidence");
  const band: ProductionUncertainty["band"] =
    reasons.has("adapter-output") || reasons.has("refusal")
      ? "high"
      : evidence.coverage === 0 || evidence.status === "none"
        ? "high"
        : evidence.status === "partial"
          ? "high"
          : evidence.coverage < 0.8
            ? "medium"
            : "low";
  return {
    band,
    reasons: [...reasons].sort((left, right) => compareStable(left, right)),
  };
}

function dimensionScores(
  dimensions: readonly ProductionDimensionDefinition[],
  values: Readonly<Record<StableId, number | null>>,
  normalized: NormalizedResponses,
  minimumCoverage: number,
  adapterRefused = false,
): readonly ProductionDimensionScore[] {
  const answered = new Set(
    normalized.usable.map((response) => response.itemId),
  );
  return dimensions.map((dimension) => {
    const itemIds = Object.keys(dimension.itemWeights).sort((left, right) =>
      compareStable(left, right),
    );
    const answeredItems = itemIds.filter((itemId) => answered.has(itemId));
    const evidence = coverage(
      answeredItems.length,
      itemIds.length,
      minimumCoverage,
    );
    const relatedAbstentions = normalized.abstentions.filter((entry) =>
      entry.itemIds.some((itemId) => itemIds.includes(itemId)),
    );
    const value = values[dimension.id];
    const validValue =
      answeredItems.length === 0 ||
      typeof value !== "number" ||
      !finiteUnit(value)
        ? null
        : value;
    const abstentions =
      validValue === null && relatedAbstentions.length === 0
        ? [
            abstention(
              adapterRefused ? "adapter-refused" : "insufficient-evidence",
              [dimension.id],
            ),
          ]
        : relatedAbstentions;
    return {
      dimensionId: dimension.id,
      value: validValue,
      evidenceCoverage: evidence,
      uncertainty: uncertainty(evidence, abstentions),
      abstentions,
    };
  });
}

function profileEvidence(
  normalized: NormalizedResponses,
  dimensions: readonly ProductionDimensionDefinition[],
  minimumCoverage: number,
): ProductionEvidenceCoverage {
  const expected = new Set<StableId>();
  for (const dimension of dimensions) {
    for (const itemId of Object.keys(dimension.itemWeights))
      expected.add(itemId);
  }
  const answered = new Set(
    normalized.usable.map((response) => response.itemId),
  );
  const answeredCount = [...expected].filter((itemId) =>
    answered.has(itemId),
  ).length;
  return coverage(answeredCount, expected.size, minimumCoverage);
}

function validLabels(
  labels: readonly ProductionLabelEndpoint[],
): readonly ProductionLabelEndpoint[] {
  const byId = new Map<StableId, ProductionLabelEndpoint>();
  if (!Array.isArray(labels)) return [];
  for (const label of labels) {
    if (
      !isRecord(label) ||
      !nonEmptyString(label.id) ||
      !nonEmptyString(label.name) ||
      !isRecord(label.centroid) ||
      (label.description !== undefined &&
        typeof label.description !== "string") ||
      (label.interpretation !== undefined &&
        typeof label.interpretation !== "string")
    )
      continue;
    const centroid: Record<StableId, number> = {};
    for (const [dimensionId, value] of Object.entries(label.centroid)) {
      if (finiteUnit(value)) centroid[dimensionId] = value;
    }
    if (Object.keys(centroid).length === 0) continue;
    byId.set(label.id, {
      id: label.id,
      name: label.name,
      centroid,
      ...(label.description !== undefined
        ? { description: label.description }
        : {}),
      ...(label.interpretation !== undefined
        ? { interpretation: label.interpretation }
        : {}),
    });
  }
  return [...byId.values()].sort((left, right) =>
    compareStable(left.id, right.id),
  );
}

function compareLabels(
  scores: readonly ProductionDimensionScore[],
  labels: readonly ProductionLabelEndpoint[],
  minimumCoverage: number,
  profileUncertainty: ProductionUncertainty,
): readonly ProductionLabelMatch[] {
  const measured = new Map(
    scores
      .filter((score) => score.value !== null)
      .map((score) => [score.dimensionId, score.value as number]),
  );
  const matches = validLabels(labels).flatMap((label) => {
    const dimensions = Object.keys(label.centroid).filter((id) =>
      measured.has(id),
    );
    if (dimensions.length === 0) return [];
    let squaredDistance = 0;
    for (const dimensionId of dimensions) {
      squaredDistance += Math.pow(
        measured.get(dimensionId)! - label.centroid[dimensionId],
        2,
      );
    }
    const distance = Math.sqrt(squaredDistance / dimensions.length);
    const similarity = Math.max(0, Math.min(1, 1 - distance / 2));
    const evidence = coverage(
      dimensions.length,
      Object.keys(label.centroid).length,
      minimumCoverage,
    );
    if (evidence.status !== "sufficient") return [];
    return [
      {
        label,
        similarity,
        evidence,
      },
    ];
  });
  matches.sort(
    (left, right) =>
      right.similarity - left.similarity ||
      compareStable(left.label.id, right.label.id),
  );
  return matches.map((entry, index) => {
    const next = matches[index + 1];
    const margin = next ? entry.similarity - next.similarity : undefined;
    const reasons = [...profileUncertainty.reasons];
    if (margin !== undefined && margin < 0.05) reasons.push("label-tie");
    const dedupedReasons = [...new Set(reasons)].sort((left, right) =>
      compareStable(left, right),
    );
    const labelUncertainty: ProductionUncertainty = {
      band:
        profileUncertainty.band === "high" ||
        (margin !== undefined && margin < 0.05)
          ? "high"
          : profileUncertainty.band === "medium" ||
              (margin !== undefined && margin < 0.15)
            ? "medium"
            : "low",
      reasons: dedupedReasons,
    };
    return {
      labelId: entry.label.id,
      name: entry.label.name,
      similarity: entry.similarity,
      evidenceCoverage: entry.evidence,
      uncertainty: labelUncertainty,
      rank: index + 1,
      ...(margin === undefined ? {} : { runnerUpMargin: margin }),
      ...(entry.label.interpretation === undefined
        ? {}
        : { interpretation: entry.label.interpretation }),
    };
  });
}

function adapterOutput(
  adapter: ProductionScoringAdapter,
  request: ProductionPrimitiveRequest,
): {
  readonly values: Readonly<Record<StableId, number | null>>;
  readonly refused: boolean;
} {
  try {
    const output = adapter.score(request);
    if (!output || typeof output !== "object" || !output.values) {
      return { values: {}, refused: true };
    }
    const valid = request.dimensions.every((dimension) => {
      if (!Object.prototype.hasOwnProperty.call(output.values, dimension.id))
        return false;
      const value = output.values[dimension.id];
      return value === null || finiteUnit(value);
    });
    return { values: output.values, refused: !valid };
  } catch {
    return { values: {}, refused: true };
  }
}

export function buildProductionProfile(
  normalized: ProductionResponseNormalization,
  dimensions: readonly ProductionDimensionDefinition[],
  values: Readonly<Record<StableId, number | null>>,
  minimumEvidenceCoverage = DEFAULT_MINIMUM_COVERAGE,
  adapterRefused = false,
): ProductionProfile {
  const normalizedInternal: NormalizedResponses = {
    usable: normalized.responses,
    abstentions: normalized.abstentions,
    expectedItemIds: [],
  };
  const evidence = profileEvidence(
    normalizedInternal,
    dimensions,
    minimumEvidenceCoverage,
  );
  const allAbstentions = [...normalized.abstentions];
  if (evidence.status === "partial") {
    allAbstentions.push(abstention("insufficient-evidence", []));
  }
  if (adapterRefused) allAbstentions.push(abstention("adapter-refused", []));
  const scores = dimensionScores(
    dimensions,
    values,
    normalizedInternal,
    minimumEvidenceCoverage,
    adapterRefused,
  );
  return {
    contractVersion: PRODUCTION_PROFILE_VERSION,
    scoringVersion: PRODUCTION_SCORING_VERSION,
    scores,
    evidenceCoverage: evidence,
    uncertainty: uncertainty(
      evidence,
      allAbstentions,
      adapterRefused ? ["adapter-output"] : [],
    ),
    abstentions: allAbstentions,
  };
}
export function canonicalProductionLabels(
  registry: CanonicalRegistry = canonicalRegistry,
): readonly ProductionLabelEndpoint[] {
  const validation = validateCanonicalRegistry(registry);
  if (!validation.valid) return [];
  const profiles = registry.manifest.productionProfiles ?? [];
  const nodes = new Map(
    (registry.manifest.nodes ?? []).map((node) => [node.id, node]),
  );
  return [...profiles]
    .sort((left, right) => compareStable(left.labelId, right.labelId))
    .map((profile) => {
      const node = nodes.get(profile.nodeId);
      return {
        id: profile.labelId,
        name: node?.canonicalName ?? profile.labelId,
        centroid: profile.centroid,
      };
    });
}

/**
 * Empty evidence still goes through the canonical scorer. This helper remains
 * for callers that explicitly request an empty production result.
 */
export function canonicalRegistryUnavailable(
  registry: CanonicalRegistry = canonicalRegistry,
): ProductionResult {
  return scoreProduction({ responses: [] }, { registry });
}

export function scoreProduction(
  request: ProductionScoreRequest,
  options: ProductionScoreOptions = {},
): ProductionResult {
  if (!isRecord(request)) request = { responses: [] };
  const configuredRegistry = isRecord(options) ? options.registry : undefined;
  const registry =
    (configuredRegistry as CanonicalRegistry | null | undefined) ??
    canonicalRegistry;
  const safeOptions = isRecord(options)
    ? (options as ProductionScoreOptions)
    : {};
  const validation = validateCanonicalRegistry(registry);
  if (!validation.valid) {
    throw new Error(
      `Invalid canonical production registry: ${validation.issues
        .map((entry) => `${entry.code}:${entry.path ?? entry.id ?? "unknown"}`)
        .join(", ")}`,
    );
  }
  const minimumCoverage =
    safeOptions.minimumEvidenceCoverage ?? DEFAULT_MINIMUM_COVERAGE;
  if (
    !Number.isFinite(minimumCoverage) ||
    minimumCoverage < 0 ||
    minimumCoverage > 1
  ) {
    throw new RangeError("minimumEvidenceCoverage must be between 0 and 1");
  }
  const dimensions = dimensionDefinitions(registry);
  const normalized = normalizeResponses(
    responsesFromRequest(request.responses),
    registry,
  );
  const adapter = safeOptions.adapter ?? defaultAdapter();
  const primitiveRequest: ProductionPrimitiveRequest = {
    responses: normalized.usable,
    dimensions,
  };
  const output = adapterOutput(adapter, primitiveRequest);
  const normalizedPublic: ProductionResponseNormalization = {
    responses: normalized.usable,
    abstentions: normalized.abstentions,
  };
  const profile = buildProductionProfile(
    normalizedPublic,
    dimensions,
    output.values,
    minimumCoverage,
    output.refused,
  );
  const evidence = profile.evidenceCoverage;
  const decision =
    !output.refused && evidence.status === "sufficient" ? "scored" : "abstain";
  const labels =
    decision === "scored"
      ? compareLabels(
          scoresForLabels(profile),
          request.labels ?? [],
          minimumCoverage,
          profile.uncertainty,
        )
      : [];
  const resultAbstentions = [...profile.abstentions];
  if (
    evidence.status !== "sufficient" &&
    !resultAbstentions.some((entry) => entry.code === "insufficient-evidence")
  ) {
    resultAbstentions.push(abstention("insufficient-evidence", []));
  }
  const resultUncertainty = uncertainty(evidence, resultAbstentions);
  return {
    contractVersion: PRODUCTION_RESULT_VERSION,
    profile,
    labels,
    decision,
    evidenceCoverage: evidence,
    uncertainty: resultUncertainty,
    abstentions: resultAbstentions,
    interpretation: {
      mode: "profile-similarity",
      labelSource: "configuration",
      contractVersion: PRODUCTION_CONTRACT_VERSION,
      profileVersion: PRODUCTION_PROFILE_VERSION,
      scoringVersion: PRODUCTION_SCORING_VERSION,
      registryVersion: registry.manifest.metadata.version,
      transform: TRANSFORM,
      adapterId: adapter.id,
    },
  };
}

function scoresForLabels(
  profile: ProductionProfile,
): readonly ProductionDimensionScore[] {
  return profile.scores;
}

export function createProductionScorer(
  options: ProductionScoreOptions = {},
): (request: ProductionScoreRequest) => ProductionResult {
  return (request) => scoreProduction(request, options);
}

export const productionScoringAdapter = defaultAdapter();
