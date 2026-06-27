import type { LabelId } from '../types'

export type LabelPrecisionFollowUpPriority = 'high' | 'medium' | 'ui'

export interface LabelPrecisionFollowUp {
   labelId: LabelId
   priority: LabelPrecisionFollowUpPriority
   issue: string
   recommendedAction: string
}

/**
 * Research follow-ups that should be handled as future centroid or UI work,
 * not silently folded into current label descriptions. Keeping them in data
 * makes the audit actionable without changing current scoring behavior.
 */
export const labelPrecisionFollowUps: LabelPrecisionFollowUp[] = [
   {
      labelId: 'accelerationism',
      priority: 'high',
      issue: 'One centroid currently stands in for incompatible left, right/unconditional, and technology-centered accelerationist traditions.',
      recommendedAction: 'Split into separate accelerationist subtype labels with distinct centroids before treating the result as precise.',
   },
   {
      labelId: 'zionism',
      priority: 'high',
      issue: 'Political Zionism has liberal, labor/socialist, religious, revisionist, and territorial variants with different axis profiles.',
      recommendedAction: 'Add subtype centroids if this family becomes a prominent result area.',
   },
   {
      labelId: 'hindutva',
      priority: 'high',
      issue: 'Hindutva is a political ideology distinct from Hinduism and has religious-national, civilizational, and party-political variants.',
      recommendedAction: 'Review whether a single centroid overstates one variant and add subtypes if needed.',
   },
   {
      labelId: 'islamic-democracy',
      priority: 'high',
      issue: 'Islamic democratic constitutionalism can mean Muslim democratic parties, Islamic constitutional constraints, or electoral politics in Muslim-majority contexts.',
      recommendedAction: 'Split from theocratic politics and consider subtypes for constitutional, party-political, and majoritarian variants.',
   },
   {
      labelId: 'cyberocracy',
      priority: 'medium',
      issue: 'Cyberocratic Governance can mean algorithmic administration, cybernetic planning, or information-networked technocracy.',
      recommendedAction: 'Keep marked experimental and split if enough questions are added to distinguish governance mechanisms.',
   },
   {
      labelId: 'techno-anarchism',
      priority: 'medium',
      issue: 'Techno-Anarchist / Crypto-Anarchist overlaps cypherpunk, crypto-anarchism, peer-to-peer commons, and broader techno-libertarian currents.',
      recommendedAction: 'Split into crypto-anarchist and peer-to-peer/commons variants if module questions can distinguish them.',
   },
   {
      labelId: 'ecomodernist',
      priority: 'medium',
      issue: 'Ecomodernism can be confused with generic technocracy or market environmentalism.',
      recommendedAction: 'Confirm centroid emphasizes technology-enabled ecological decoupling rather than generic expert governance.',
   },
   {
      labelId: 'revolutionary-collectivist',
      priority: 'medium',
      issue: 'Revolutionary State Socialist may cluster near Marxist-Leninist, Maoist, or council-communist results without enough institutional detail.',
      recommendedAction: 'Review centroid separation after adding more revolutionary-socialist module items.',
   },
   {
      labelId: 'republicanism',
      priority: 'ui',
      issue: 'Users may confuse civic republicanism with a contemporary party label.',
      recommendedAction: 'Keep user-facing help text explicit that the label means the political-theory tradition of non-domination and civic self-government.',
   },
   {
      labelId: 'right-wing-populism',
      priority: 'ui',
      issue: 'Populism is a thin-centered ideology or style rather than a complete doctrine.',
      recommendedAction: 'Keep the caution note visible when populist labels appear in results.',
   },
   {
      labelId: 'left-wing-populism',
      priority: 'ui',
      issue: 'Populism is a thin-centered ideology or style rather than a complete doctrine.',
      recommendedAction: 'Keep the caution note visible when populist labels appear in results.',
   },
]


export const labelPrecisionFollowUpById = new Map(labelPrecisionFollowUps.map((followUp) => [followUp.labelId, followUp]))

export const highPriorityLabelPrecisionFollowUps = labelPrecisionFollowUps.filter(
   (followUp) => followUp.priority === 'high',
)
