import { labels } from "../../../data/labels";
import { roleForLabel } from "../../../data/labelTaxonomy";
import { axes } from "../../../data/axes";
import type { IdeologyDossier } from "../types";
import { isMatchPoolMember } from "../predicates";
import { buildClaimsForLabel } from "./claims";
import { ensureLabelBankCitations } from "../citations/registry";

/**
 * Build dossiers from the live label catalog with researched claim-matrix fill.
 * Centroid rationales are projected from the matching centroid.* claim statements.
 */
export function buildDossiers(): IdeologyDossier[] {
  ensureLabelBankCitations(labels.map((l) => l.id));

  return labels.map((label) => {
    const centroid: Record<string, number> = { ...label.centroid };
    const claims = buildClaimsForLabel(label);
    const centroidRationales: Record<string, string> = {};
    for (const axis of axes) {
      if (centroid[axis.id] === undefined) {
        centroid[axis.id] = 0;
      }
      const claim = claims.find((c) => c.fieldPath === `centroid.${axis.id}`);
      centroidRationales[axis.id] =
        claim?.statement ??
        `Missing centroid rationale for ${axis.id} on ${label.id}`;
    }

    const dossier: IdeologyDossier = {
      dossierId: `dossier:${label.id}`,
      labelId: label.id,
      lifecycle: "active",
      family: label.family,
      subfamily: label.subfamily,
      aliases: label.aliases ?? [],
      survivorOf: [],
      claims,
      centroid,
      centroidRationales,
      cautionNote: label.cautionNote,
      usageNote: label.usageNote,
      matchPoolMember: roleForLabel(label.id) === "primary",
      linkedFindingIds: [],
      linkedTestIds: [],
      provisionalExpertOnly: true,
    };

    dossier.matchPoolMember = isMatchPoolMember({
      ...dossier,
      matchPoolMember: dossier.matchPoolMember,
    });

    return dossier;
  });
}

/** @deprecated Prefer buildDossiers. */
export function buildDossierStubs(): IdeologyDossier[] {
  return buildDossiers();
}

export const dossiers: IdeologyDossier[] = buildDossiers();

export function dossierByLabelId(labelId: string): IdeologyDossier | undefined {
  return dossiers.find((d) => d.labelId === labelId);
}
