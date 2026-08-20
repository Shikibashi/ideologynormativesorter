import type {
  ItemRecord,
  ScoringContribution,
} from "../../contracts/src/index";

export interface ItemMappingCorrection {
  readonly itemId: string;
  readonly status: "active" | "inactive";
  readonly contributions: readonly ScoringContribution[];
  readonly rationale: string;
}

export function applyItemMappingCorrections(
  items: readonly ItemRecord[],
  corrections: readonly ItemMappingCorrection[],
): ItemRecord[] {
  const itemIds = new Set(items.map((item) => String(item.id)));
  const seen = new Set<string>();
  for (const correction of corrections) {
    if (!correction.itemId || seen.has(correction.itemId)) {
      throw new Error(`Invalid or duplicate item mapping correction: ${correction.itemId}`);
    }
    seen.add(correction.itemId);
    if (!itemIds.has(correction.itemId)) {
      throw new Error(`Item mapping correction references unknown item ${correction.itemId}`);
    }
    if (correction.contributions.length === 0) {
      throw new Error(`Item mapping correction ${correction.itemId} has no contributions`);
    }
    if (!correction.rationale.trim()) {
      throw new Error(`Item mapping correction ${correction.itemId} requires a rationale`);
    }
    for (const contribution of correction.contributions) {
      if (!Number.isFinite(contribution.weight) || contribution.weight <= 0) {
        throw new Error(`Item mapping correction ${correction.itemId} has an invalid weight`);
      }
      if (contribution.polarity !== -1 && contribution.polarity !== 1) {
        throw new Error(`Item mapping correction ${correction.itemId} has an invalid polarity`);
      }
    }
  }

  return items.map((item) => {
    const correction = corrections.find((entry) => entry.itemId === String(item.id));
    if (!correction) return item;
    if (item.responseType === "statement-choice") {
      throw new Error(`Item mapping correction ${correction.itemId} cannot patch statement-choice mappings`);
    }
    return {
      ...item,
      status: correction.status,
      scoring: {
        mappingMode: "item" as const,
        contributions: correction.contributions.map((entry) => ({ ...entry })),
      },
      reviewStatus: "reviewed-commitment-alignment-v1",
      contextNote: `${item.contextNote ?? ""}${item.contextNote ? " " : ""}Scoring mapping reviewed for commitment alignment: ${correction.rationale}`,
    } as ItemRecord;
  });
}
