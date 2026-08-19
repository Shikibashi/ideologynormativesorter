import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { ConstructAssessment } from "../../../contracts/src/constructs";
import type { ContributionTrace } from "../../../contracts/src/diagnostics";
import { contributionIdentity, deepFreeze, DiagnosticsError } from "./common";

export function buildContributionTrace(
  assessment: ConstructAssessment,
  bundle: CanonicalContentBundle,
): readonly ContributionTrace[] {
  const itemById = new Map(bundle.items.map((item) => [String(item.id), item]));
  const seen = new Set<string>();
  const traces = assessment.contributions.map((record) => {
    const contributionId = contributionIdentity(record);
    if (seen.has(contributionId)) throw new DiagnosticsError(`Duplicate contribution identity ${contributionId}`);
    seen.add(contributionId);
    const item = itemById.get(record.sourceItemId);
    return {
      contributionId,
      itemId: record.sourceItemId,
      constructId: record.targetConstructId,
      constructRole: record.constructRole,
      responseState: record.sourceResponseState,
      normalizedValue: record.normalizedInput,
      ...(record.rawValue === undefined ? {} : { rawValue: record.rawValue }),
      ...(record.optionId === undefined ? {} : { optionId: record.optionId }),
      mappingWeight: record.weight,
      direction: record.direction,
      salienceFactor: record.salienceFactor,
      effectiveWeight: record.effectiveWeight,
      weightedContribution: record.weightedContribution,
      included: record.included,
      ...(record.exclusionReason === undefined ? {} : { exclusionReason: record.exclusionReason }),
      provenanceRefs: Object.freeze([...(item?.provenanceRefs ?? [])].sort()),
    } satisfies ContributionTrace;
  });
  return deepFreeze([...traces].sort((left, right) => left.contributionId.localeCompare(right.contributionId)));
}
