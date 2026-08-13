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
      recommendedAction: 'Use the v5 technology-governance module to pool data for left, right, and technology-centered accelerationist directions; keep the catalog entry provisional until subtype separation is tested.',
   },
   {
      labelId: 'zionism',
      priority: 'high',
      issue: 'Political Zionism has liberal, labor/socialist, religious, revisionist, and territorial variants with different axis profiles.',
      recommendedAction: 'Use the v5 religious-national module to pool data on Jewish collective self-determination and related constitutional, religious, and territorial dimensions before adding subtype centroids.',
   },
   {
      labelId: 'hindutva',
      priority: 'high',
      issue: 'Hindutva is a political ideology distinct from Hinduism and has religious-national, civilizational, and party-political variants.',
      recommendedAction: 'Use the v5 religious-national module to test Hindu civilizational belonging against generic religious nationalism and minority-citizenship dimensions before adding subtypes.',
   },
   {
      labelId: 'islamic-democracy',
      priority: 'high',
      issue: 'Islamic democratic constitutionalism can mean Muslim democratic parties, Islamic constitutional constraints, or electoral politics in Muslim-majority contexts.',
      recommendedAction: 'Use the v5 religious-national module to test constitutional public-law framing, interpretive pluralism, party competition, and clerical authority; retain provisional status until the variants separate in respondent data.',
   },
   {
      labelId: 'cyberocracy',
      priority: 'medium',
      issue: 'Cyberocratic Governance can mean algorithmic administration, cybernetic planning, or information-networked technocracy.',
      recommendedAction: 'Use the v5 technology-governance module to test algorithmic or cybernetic authority against ordinary expert administration before splitting the concept or promoting it.',
   },
   {
      labelId: 'techno-anarchism',
      priority: 'medium',
      issue: 'Techno-Anarchist / Crypto-Anarchist overlaps cypherpunk, crypto-anarchism, peer-to-peer commons, and broader techno-libertarian currents.',
      recommendedAction: 'Use the v5 technology-governance module to test cryptographic autonomy and distributed infrastructure against broader techno-libertarian or peer-to-peer commons claims before splitting it.',
   },
   {
      labelId: 'ecomodernist',
      priority: 'medium',
      issue: 'Ecomodernism can be confused with generic technocracy or market environmentalism.',
      recommendedAction: 'Use the green-morphology module to test technology-enabled ecological decoupling against generic technocracy and market environmentalism before changing the centroid.',
   },
   {
      labelId: 'revolutionary-collectivist',
      priority: 'medium',
      issue: 'Revolutionary State Socialist may cluster near Marxist-Leninist, Maoist, or council-communist results without enough institutional detail.',
      recommendedAction: 'Keep this retired compatibility entry out of scoring; if a future socialist module restores it, test its institutional profile against Marxist-Leninist, Maoist, Trotskyist, and councilist variants first.',
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
