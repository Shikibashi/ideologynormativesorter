import { labels } from '../../../data/labels'
import { axes } from '../../../data/axes'
import type { IdeologyDossier } from '../types'
import { isMatchPoolMember } from '../predicates'
import { buildClaimStubsForLabel } from './claims'
import { ensureLabelBankCitations } from '../citations/registry'

/**
 * Build WP3 skeleton dossiers from the live label catalog.
 * Claims are PENDING stubs (definition, family, 26 centroids) for wave fill.
 */
export function buildDossierStubs(): IdeologyDossier[] {
  ensureLabelBankCitations(labels.map((l) => l.id))

  return labels.map((label) => {
    const centroid: Record<string, number> = { ...label.centroid }
    const centroidRationales: Record<string, string> = {}
    for (const axis of axes) {
      if (centroid[axis.id] === undefined) {
        centroid[axis.id] = 0
      }
      centroidRationales[axis.id] = 'PENDING_CENTROID_RATIONALE'
    }

    const dossier: IdeologyDossier = {
      dossierId: `dossier:${label.id}`,
      labelId: label.id,
      lifecycle: 'active',
      family: label.family,
      subfamily: label.subfamily,
      aliases: label.aliases ?? [],
      survivorOf: [],
      claims: buildClaimStubsForLabel(label),
      centroid,
      centroidRationales,
      cautionNote: label.cautionNote,
      usageNote: label.usageNote,
      matchPoolMember: true,
      linkedFindingIds: [],
      linkedTestIds: [],
      provisionalExpertOnly: true,
    }

    // Keep matchPoolMember aligned with predicate expectations.
    dossier.matchPoolMember = isMatchPoolMember({
      ...dossier,
      matchPoolMember: true,
    })

    return dossier
  })
}

export const dossiers: IdeologyDossier[] = buildDossierStubs()

export function dossierByLabelId(labelId: string): IdeologyDossier | undefined {
  return dossiers.find((d) => d.labelId === labelId)
}
