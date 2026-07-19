import type { Axis } from '../../../types'
import type { IdeologyLabel } from '../../../types/label'
import type { PerspectiveEntry } from '../types'
import { familyScholarlyById } from '../citations/familyCatalog'
import { labels } from '../../../data/labels'

export const CLAIM_FILL_SPEC_VERSION = 'claim-fill-v1'

export type CentroidBand = 'neutral' | 'moderate' | 'clear' | 'strong'

export function centroidBand(value: number): CentroidBand {
  const mag = Math.abs(value)
  if (mag < 0.15) return 'neutral'
  if (mag < 0.4) return 'moderate'
  if (mag < 0.7) return 'clear'
  return 'strong'
}

export function poleForValue(
  axis: Axis,
  value: number,
): { side: 'positive' | 'negative' | 'neutral'; poleText: string } {
  if (Math.abs(value) < 0.15) {
    return { side: 'neutral', poleText: 'near the midpoint between poles' }
  }
  if (value > 0) {
    return { side: 'positive', poleText: axis.positivePole }
  }
  return { side: 'negative', poleText: axis.negativePole }
}

function siblingNames(label: IdeologyLabel, limit = 2): string[] {
  return labels
    .filter(
      (l) =>
        l.id !== label.id &&
        l.family === label.family &&
        (label.subfamily ? l.subfamily === label.subfamily : true),
    )
    .slice(0, limit)
    .map((l) => l.name)
}

function influenceHook(label: IdeologyLabel, axisId: string): string {
  const hits = (label.philosophyInfluences ?? []).filter((inf) =>
    inf.affectedAxes.includes(axisId as never),
  )
  if (hits.length === 0) return ''
  const names = hits
    .slice(0, 2)
    .map((h) => h.philosophy)
    .join(' and ')
  return ` Philosophy influences named in the catalog (${names}) shape the directional emphasis only.`
}

export function formatDefinitionStatement(label: IdeologyLabel): string {
  const scope = label.usageNote
    ? ` Scope note: ${label.usageNote.replace(/\s+/g, ' ').trim()}`
    : ''
  const caution = label.cautionNote
    ? ` Caution: ${label.cautionNote.replace(/\s+/g, ' ').trim()}`
    : ''
  return (
    `In this instrument (${CLAIM_FILL_SPEC_VERSION}), ${label.name} (${label.id}) denotes: ` +
    `${label.description.replace(/\s+/g, ' ').trim()}.${scope}${caution} ` +
    `This is the catalog's operational definition for matching — not an external endorsement of the label's centroid profile.`
  )
}

export function formatFamilyStatement(label: IdeologyLabel): string {
  const sub = label.subfamily ? ` / subfamily ${label.subfamily}` : ''
  const siblings = siblingNames(label)
  const siblingClause =
    siblings.length > 0
      ? ` It is grouped with related constructs such as ${siblings.join(' and ')}.`
      : ''
  const evidence = familyScholarlyById.get(label.family)?.evidenceNote
  const evidenceClause = evidence
    ? ` Family scholarly baseline note: ${evidence}`
    : ''
  return (
    `Within the instrument taxonomy (${CLAIM_FILL_SPEC_VERSION}), ${label.name} is placed in family ${label.family}${sub}.` +
    `${siblingClause} This placement reflects catalog construct boundaries for navigation and review — ` +
    `not empirical proof that family literature assigns this label's axis coordinates.${evidenceClause}`
  )
}

export function formatCentroidStatement(
  label: IdeologyLabel,
  axis: Axis,
  value: number,
): string {
  const band = centroidBand(value)
  const pole = poleForValue(axis, value)
  const rounded = Math.round(value * 100) / 100
  const bandPhrase = band === 'neutral' ? 'near-neutral on' : `${band} toward`
  const poleClause =
    pole.side === 'neutral'
      ? pole.poleText
      : `the ${pole.side} pole (“${pole.poleText}”)`
  const hook = influenceHook(label, axis.id)
  return (
    `For ${label.name}, the instrument's reference placement on ${axis.name} (${axis.layer}) ` +
    `is ${bandPhrase} ${poleClause}, catalog coordinate ${rounded} (${CLAIM_FILL_SPEC_VERSION}). ` +
    `This is a model-internal placement derived from the label definition` +
    `${hook} — not a claim that external literature pins this exact catalog score.`
  )
}

export function formatPerspectives(
  label: IdeologyLabel,
  fieldPath: string,
): Record<'sympathetic' | 'critical' | 'neutral', PerspectiveEntry> {
  const shortDesc = label.description.replace(/\s+/g, ' ').trim()
  const caution =
    label.cautionNote?.replace(/\s+/g, ' ').trim() ??
    'internal diversity and contested boundary cases remain'

  if (fieldPath === 'definition') {
    return {
      sympathetic: {
        text:
          `Sympathetic reading: ${label.name} helpfully operationalizes a recognizable tradition by stating: ${shortDesc} ` +
          `This clarity aids comparative mapping without requiring respondents to use academic jargon.`,
      },
      critical: {
        text:
          `Critical reading: collapsing lived political movements into the single operational gloss for ${label.name} risks over-precision; ${caution}. ` +
          `Family-level encyclopedias cannot settle every subtype dispute.`,
      },
      neutral: {
        text:
          `Neutral framing: treat the ${label.name} definition as an instrument construct for nearest-centroid matching, ` +
          `cross-checked against family scholarly baselines, pending qualified-expert textual review.`,
      },
    }
  }

  if (fieldPath === 'family') {
    return {
      sympathetic: {
        text:
          `Sympathetic reading: placing ${label.name} under family ${label.family}` +
          `${label.subfamily ? ` / ${label.subfamily}` : ''} mirrors common comparative-politics groupings and aids user navigation.`,
      },
      critical: {
        text:
          `Critical reading: family buckets can hide cross-cutting disagreements (e.g. strategy, property, or nationalism disputes) inside ${label.family}; ` +
          `taxonomy placement should not be read as doctrinal unanimity.`,
      },
      neutral: {
        text:
          `Neutral framing: family membership is a catalog hierarchy decision for ${label.name}, justified by tradition-level sources where available, ` +
          `not by respondent data or expert pass.`,
      },
    }
  }

  const axisId = fieldPath.replace(/^centroid\./, '')
  return {
    sympathetic: {
      text:
        `Sympathetic reading: the ${axisId} coordinate for ${label.name} encodes a coherent directional emphasis implied by the label's definition and named philosophy influences.`,
    },
    critical: {
      text:
        `Critical reading: no family encyclopedia assigns the exact ${axisId} numeric score used for ${label.name}; treating the coordinate as externally validated would overclaim evidence strength.`,
    },
    neutral: {
      text:
        `Neutral framing: the ${axisId} value is a catalog reference placement for matching distance — model-internal, researched for consistency with the definition, and awaiting qualified-expert review.`,
    },
  }
}
