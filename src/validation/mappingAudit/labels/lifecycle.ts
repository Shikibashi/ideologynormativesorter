import { labels } from "../../../data/labels";
import type { LabelId } from "../../../types/common";
import type { LabelLifecycle } from "../types";

export interface LabelLifecycleEntry {
  id: string; // life:{labelId}
  labelId: LabelId;
  lifecycle: LabelLifecycle;
  mergedInto?: LabelId;
  survivorOf: LabelId[];
  splitFrom?: LabelId;
  history: string[];
}

/** WP0/WP3 seed: every live label starts active with empty history. */
export const labelLifecycleEntries: LabelLifecycleEntry[] = labels.map(
  (label) => ({
    id: `life:${label.id}`,
    labelId: label.id,
    lifecycle: "active",
    survivorOf: [],
    history: [`seeded-active@WP0`],
  }),
);

export function lifecycleForLabel(
  labelId: LabelId,
): LabelLifecycleEntry | undefined {
  return labelLifecycleEntries.find((e) => e.labelId === labelId);
}
