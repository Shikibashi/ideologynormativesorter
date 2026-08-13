/**
 * Broad anchors added by the taxonomy migration.  These are intentionally
 * family-level reference positions rather than copies of a narrow subtype.
 */
export const BROAD_ANCHOR_CENTROID: Record<string, number> = {
  "authority-legitimacy": 0,
  "property-legitimacy": 0,
  "liberty-noninterference": 0,
  "equality-theory": 0,
  "political-community-boundary": 0,
  "moral-traditionalism": 0,
  "anti-domination": 0,
  "human-nature-priority": 0,
  "market-process-confidence": 0,
  "state-capacity-confidence": 0,
  "public-choice-skepticism": 0,
  "democratic-confidence": 0,
  "expert-confidence": 0,
  "cultural-plasticity": 0,
  "coordination-optimism": 0,
  "centralization-preference": 0,
  "reform-vs-revolution": 0,
  "gradualism-vs-immediatism": 0,
  "state-action-vs-exit": 0,
  "electoralism-vs-direct-action": 0,
  "compromise-vs-persistence": 0,
  "coercion-strategy": 0,
  "regulation-vs-deregulation": 0,
  "redistribution-vs-predistribution": 0,
  "militarism-pacifism": 0,
  "secularism-religious": 0,
};

export function broadCentroid(
  overrides: Record<string, number>,
): Record<string, number> {
  return { ...BROAD_ANCHOR_CENTROID, ...overrides };
}
