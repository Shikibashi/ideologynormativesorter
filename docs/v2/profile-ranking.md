# Phase 5 Deterministic Ranking

Only scored primary profiles are ranked. The sort key is descending similarity, then ascending distance, then ascending profile ID. Numeric values are not rounded before comparison.

Adjacent scored profiles are placed in the same tie group when their similarity difference is strictly less than `0.05`. Tie groups use competition ranking: a two-profile top tie receives rank `1` for both and the next group receives rank `3`. IDs make serialization deterministic without breaking the substantive tie.

The assessment separately reports `topProfileIds`, `topTie`, and assessment uncertainty. A top tie adds the explicit `label-tie` reason and raises assessment uncertainty to `high`. Abstained profiles remain in the complete profile result set with null rank and never affect ranking.
