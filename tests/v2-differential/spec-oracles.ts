export function normalizeLikert(raw: number, maximum: 2 | 3, reverse = false): number {
  if (!Number.isInteger(raw) || raw < -maximum || raw > maximum) throw new Error("raw Likert value is outside the contract");
  const unit = raw / maximum;
  const result = reverse ? -unit : unit;
  return result === 0 ? 0 : result;
}

export function salience(layer: "normative" | "descriptive" | "prescriptive", rating?: 1 | 3 | 5, skipped = false): number {
  if (layer === "normative") return 1;
  if (skipped || rating === undefined) return 0;
  return rating / 5;
}

export function weightedConstruct(values: readonly { value: number; weight: number; polarity: -1 | 1 }[]): number | null {
  const denominator = values.reduce((sum, entry) => sum + Math.abs(entry.weight), 0);
  if (denominator === 0) return null;
  const numerator = values.reduce((sum, entry) => sum + entry.value * entry.weight * entry.polarity, 0);
  return Math.max(-1, Math.min(1, numerator / denominator));
}

export function profileDistance(scores: readonly number[], targets: readonly number[]): { distance: number; similarity: number } {
  if (scores.length !== targets.length || scores.length === 0) throw new Error("profile vectors must have equal non-zero length");
  const distance = Math.sqrt(scores.reduce((sum, score, index) => sum + (score - targets[index]) ** 2, 0) / scores.length);
  return { distance, similarity: Math.max(0, Math.min(1, 1 - distance / 2)) };
}

export function evidenceRatio(answered: number, expected: number): number {
  return expected === 0 ? 0 : Math.max(0, Math.min(1, answered / expected));
}
