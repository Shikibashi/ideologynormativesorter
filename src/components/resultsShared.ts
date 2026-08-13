import type { Layer } from "../types";

export const LAYERS: Layer[] = ["normative", "descriptive", "prescriptive"];

export const LAYER_LABELS: Record<Layer, string> = {
  normative: "Normative",
  descriptive: "Descriptive",
  prescriptive: "Prescriptive",
};
