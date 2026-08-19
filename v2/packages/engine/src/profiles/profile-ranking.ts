import type {
  PrimaryProfileAssessmentUncertainty,
  PrimaryProfileMatchResult,
  PrimaryProfileRankingEntry,
  PrimaryProfileTieSummary,
  ScoredPrimaryProfile,
} from "../../../contracts/src/profiles";
import type { ProfileId } from "../../../contracts/src/ids";

export const PROFILE_TIE_TOLERANCE = 0.05;

export interface RankedPrimaryProfiles {
  readonly profiles: readonly PrimaryProfileMatchResult[];
  readonly ranking: readonly PrimaryProfileRankingEntry[];
  readonly topProfileIds: readonly ProfileId[];
  readonly topTie: PrimaryProfileTieSummary;
  readonly uncertainty: PrimaryProfileAssessmentUncertainty;
}

function withTieSupport(
  result: ScoredPrimaryProfile,
  tied: boolean,
): ScoredPrimaryProfile {
  if (!tied) return result;
  const reasons = new Set(result.support.uncertaintyReasons);
  reasons.add("near_profile_tie");
  return {
    ...result,
    support: {
      ...result.support,
      uncertaintyLevel: "high",
      uncertaintyReasons: Object.freeze([...reasons].sort()),
    },
  };
}

export function rankPrimaryProfiles(
  results: readonly PrimaryProfileMatchResult[],
): RankedPrimaryProfiles {
  const scored = results
    .filter((result): result is ScoredPrimaryProfile => result.status === "scored")
    .sort(
      (left, right) =>
        right.similarity - left.similarity ||
        left.distance - right.distance ||
        String(left.profileId).localeCompare(String(right.profileId)),
    );

  const ranking: PrimaryProfileRankingEntry[] = [];
  const rankedById = new Map<ProfileId, ScoredPrimaryProfile>();
  let tieGroup = 0;
  let groupStart = 0;
  let groupAnchorSimilarity: number | undefined;
  for (let index = 0; index < scored.length; index += 1) {
    const current = scored[index];
    if (
      index === 0 ||
      groupAnchorSimilarity === undefined ||
      groupAnchorSimilarity - current.similarity >= PROFILE_TIE_TOLERANCE
    ) {
      tieGroup += 1;
      groupStart = index;
      groupAnchorSimilarity = current.similarity;
    }
    const ranked = {
      ...current,
      rank: groupStart + 1,
      tieGroup,
    };
    rankedById.set(ranked.profileId, ranked);
    ranking.push({
      profileId: ranked.profileId,
      similarity: ranked.similarity,
      distance: ranked.distance,
      rank: ranked.rank,
      tieGroup: ranked.tieGroup,
    });
  }

  const topGroup = ranking.filter((entry) => entry.tieGroup === 1);
  const topProfileIds = Object.freeze(topGroup.map((entry) => entry.profileId));
  const topSimilarity = topGroup[0]?.similarity;
  const lastTopSimilarity = topGroup.at(-1)?.similarity;
  const isTie = topGroup.length > 1;
  const topTie: PrimaryProfileTieSummary = Object.freeze({
    isTie,
    profileIds: topProfileIds,
    similarityDelta:
      topSimilarity === undefined || lastTopSimilarity === undefined
        ? null
        : topSimilarity - lastTopSimilarity,
    tolerance: PROFILE_TIE_TOLERANCE,
    ...(isTie ? { reason: "label-tie" as const } : {}),
  });

  const updatedResults = results.map((result) => {
    if (result.status !== "scored") return result;
    const ranked = rankedById.get(result.profileId);
    if (!ranked) return result;
    return withTieSupport(ranked, isTie && ranked.tieGroup === 1);
  });
  updatedResults.sort((left, right) => String(left.profileId).localeCompare(String(right.profileId)));

  const abstained = updatedResults.filter((result) => result.status === "abstained");
  const evidenceAbstention = abstained.some(
    (result) =>
      result.abstentionReason === "required_construct_unavailable" ||
      result.abstentionReason === "insufficient_evidence",
  );
  const uncertaintyReasons = [
    ...(isTie ? (["label-tie"] as const) : []),
    ...(scored.length === 0 ? (["no_eligible_profiles"] as const) : []),
    ...(evidenceAbstention ? (["partial_profile_evidence"] as const) : []),
  ];
  const uncertainty: PrimaryProfileAssessmentUncertainty = Object.freeze({
    level:
      isTie || scored.length === 0
        ? "high"
        : evidenceAbstention
          ? "medium"
          : "low",
    reasons: Object.freeze(uncertaintyReasons),
  });

  return {
    profiles: Object.freeze(updatedResults),
    ranking: Object.freeze(ranking),
    topProfileIds,
    topTie,
    uncertainty,
  };
}
