import type { IdeologyLabel } from "../types";
import { labelsPart01 } from "./labelCatalogParts/labelsPart01";
import { labelsPart02 } from "./labelCatalogParts/labelsPart02";
import { labelsPart03 } from "./labelCatalogParts/labelsPart03";
import { labelsPart04 } from "./labelCatalogParts/labelsPart04";
import { labelsPart05 } from "./labelCatalogParts/labelsPart05";
import { labelsPart06 } from "./labelCatalogParts/labelsPart06";
import { labelsPart07 } from "./labelCatalogParts/labelsPart07";
import { labelsPart08 } from "./labelCatalogParts/labelsPart08";
import { labelsPart09 } from "./labelCatalogParts/labelsPart09";
import { labelsPart10 } from "./labelCatalogParts/labelsPart10";
import { broadLabelsPart01 } from "./labelCatalogParts/broadLabelsPart01";
import { broadLabelsPart02 } from "./labelCatalogParts/broadLabelsPart02";

export const labels: IdeologyLabel[] = [
  ...labelsPart01,
  ...labelsPart02,
  ...labelsPart03,
  ...labelsPart04,
  ...labelsPart05,
  ...labelsPart06,
  ...labelsPart07,
  ...labelsPart08,
  ...labelsPart09,
  ...labelsPart10,
  ...broadLabelsPart01,
  ...broadLabelsPart02,
];

export const labelById = new Map(labels.map((l) => [l.id, l]));
