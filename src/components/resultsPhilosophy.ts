import type { Axis, AxisId, AxisScore, Layer, ResultProfile } from '../types'
import type { IdeologyLabel } from '../types/label'
import type { LabelTaxonomyMetadata } from '../data/labelTaxonomy'

export type LabelWithInfluences = IdeologyLabel & {
  taxonomy?: LabelTaxonomyMetadata
  philosophyInfluences?: Array<{
    philosophy: string
    description: string
    affectedAxes: AxisId[]
  }>
}

export interface PhilosophyRow {
  philosophy: string
  layer: Layer
  score: number
  axisIds: AxisId[]
  labelNames: string[]
  descriptions: string[]
}

const LAYERS: Layer[] = ['normative', 'descriptive', 'prescriptive']

const PHILOSOPHY_LAYER_DESCRIPTIONS: Record<string, Partial<Record<Layer, string>>> = {
  Socialism: {
    normative: 'Treats economic democracy, social ownership, equality, and freedom from exploitation as central political commitments.',
    descriptive: 'Interprets private control of productive resources as a major source of economic power, dependence, and inequality.',
    prescriptive: 'Favors institutions that place productive resources under social, cooperative, worker, or democratic control.',
  },
  Marxism: {
    normative: 'Treats emancipation from class domination and collective control over production as central political commitments.',
    descriptive: 'Analyzes class, production relations, and capitalist power as central drivers of political conflict and social change.',
    prescriptive: 'Uses class organization and changes to productive ownership as central strategies for political transformation.',
  },
  Environmentalism: {
    normative: 'Treats ecological integrity and obligations to the nonhuman world as central moral and political concerns.',
    descriptive: 'Examines how institutions, production, and consumption create or mitigate ecological harm.',
    prescriptive: 'Prioritizes institutions and policies that protect ecological systems and reduce environmental harm.',
  },
  Populism: {
    normative: 'Gives special moral standing to a people or public against elites viewed as unaccountable or entrenched.',
    descriptive: 'Interprets politics through conflict between a public and elites or institutions said to frustrate popular control.',
    prescriptive: 'Favors political strategies that mobilize a people or public against entrenched elites and institutions.',
  },
  Liberalism: {
    normative: 'Centers individual rights, legal equality, and limits on arbitrary public or private power.',
    descriptive: 'Examines institutions in terms of how reliably they protect rights, pluralism, and equal legal standing.',
    prescriptive: 'Favors rights-protecting, constitutionally constrained institutions and reform through public rules.',
  },
  Nationalism: {
    normative: 'Gives national identity, sovereignty, or collective self-determination special moral importance.',
    descriptive: 'Treats national identity and national institutions as important forces in political allegiance and conflict.',
    prescriptive: 'Favors political strategies and institutions that protect national sovereignty or self-determination.',
  },
}

const LAYER_PHILOSOPHY_FALLBACK: Record<Layer, string> = {
  normative: 'A value tradition represented by the aligned moral commitments below.',
  descriptive: 'An interpretive framework represented by the aligned empirical beliefs below.',
  prescriptive: 'A practical tradition represented by the aligned policy and strategy preferences below.',
}

export function philosophyOverview(philosophy: string, layer: Layer): string {
  return PHILOSOPHY_LAYER_DESCRIPTIONS[philosophy]?.[layer] ?? LAYER_PHILOSOPHY_FALLBACK[layer]
}

function scoreByAxis(result: ResultProfile): Map<AxisId, AxisScore> {
  const entries = LAYERS.flatMap((layer) => result.scores[layer].map((score) => [score.axisId, score] as const))
  return new Map(entries)
}

function alignment(score: number, centroid: number): number {
  return Math.max(0, 1 - Math.abs(score - centroid) / 2)
}

function philosophiesForLayer(label: IdeologyLabel, layer: Layer): readonly string[] {
  if (layer === 'normative') return label.normativePhilosophies ?? []
  if (layer === 'descriptive') return label.descriptivePhilosophies ?? []
  return label.prescriptivePhilosophies ?? []
}

function directionallyAligned(score: number, centroid: number): boolean {
  const minimumDirectionalMagnitude = 0.2
  if (Math.abs(score) < minimumDirectionalMagnitude || Math.abs(centroid) < minimumDirectionalMagnitude) return false
  if (Math.sign(score) !== Math.sign(centroid)) return false
  return alignment(score, centroid) >= 0.675
}

export function buildPhilosophyRows(
  result: ResultProfile,
  labels: LabelWithInfluences[],
  axes: Axis[],
): PhilosophyRow[] {
  const labelById = new Map(labels.map((label) => [label.id, label]))
  const axisById = new Map(axes.map((axis) => [axis.id, axis]))
  const userScores = scoreByAxis(result)
  const conflationByLabel = new Map(result.conflatedLabels.map((flag) => [flag.labelId, flag]))
  const rows = new Map<string, PhilosophyRow>()

  for (const match of result.nearestLabels) {
    const label = labelById.get(match.labelId)
    if (!label?.philosophyInfluences) continue
    const conflation = conflationByLabel.get(match.labelId)

    for (const influence of label.philosophyInfluences) {
      for (const layer of LAYERS) {
        if (!philosophiesForLayer(label, layer).includes(influence.philosophy)) continue

        const axisIds = influence.affectedAxes.filter((axisId) => {
          if (axisById.get(axisId)?.layer !== layer) return false
          const score = userScores.get(axisId)
          if (!score || score.itemCount === 0) return false
          return directionallyAligned(score.normalized, label.centroid[axisId] ?? 0)
        })
        if (axisIds.length === 0) continue

        const axisAlignments = axisIds.map((axisId) =>
          alignment(userScores.get(axisId)!.normalized, label.centroid[axisId] ?? 0),
        )
        const meanAlignment = axisAlignments.reduce((sum, value) => sum + value, 0) / axisAlignments.length
        const layerAgreement = conflation?.layerAgreement[layer] ?? match.fit
        const score = match.fit * layerAgreement * meanAlignment
        const key = `${layer}:${influence.philosophy}`
        const existing = rows.get(key)

        if (existing) {
          existing.score += score
          existing.axisIds = Array.from(new Set([...existing.axisIds, ...axisIds]))
          existing.labelNames = Array.from(new Set([...existing.labelNames, label.name]))
          existing.descriptions = Array.from(new Set([...existing.descriptions, influence.description]))
        } else {
          rows.set(key, {
            philosophy: influence.philosophy,
            layer,
            score,
            axisIds,
            labelNames: [label.name],
            descriptions: [influence.description],
          })
        }
      }
    }
  }

  return LAYERS.flatMap((layer) =>
    Array.from(rows.values())
      .filter((row) => row.layer === layer)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
  )
}
