import type { IdeologyLabel, LabelId } from '../types'
import { FEMINIST_MODULE_ID } from './feministBreadth'
import { IDENTITY_SOVEREIGNTY_MODULE_ID } from './identitySovereigntyBreadth'
import { labels } from './labels'

/**
 * Product taxonomy for ideology labels.
 *
 * The full label catalog remains available for audit/history, but not every
 * catalog entry is a valid default scoring endpoint. The main questionnaire
 * should return broad, self-contained political traditions. Narrower schools
 * are resolved by depth modules; cross-cutting attitudes are modifiers; policy
 * proposals and speculative concepts are context-only; legacy synthetic labels
 * remain in the catalog only for compatibility.
 */
export type LabelRole = 'primary' | 'specialist' | 'modifier' | 'context' | 'retired'

export const PRIMARY_LABEL_IDS = [
  'anarcho-capitalist',
  'anarcho-communist',
  'christian-democrat',
  'civic-nationalist',
  'civil-libertarian-cosmopolitan',
  'classical-liberalism',
  'communitarianism',
  'deep-ecology',
  'degrowth-green',
  'democratic-socialist',
  'distributism',
  'ecomodernist',
  'ecosocialist',
  'ethnonationalist',
  'fascist-authoritarian',
  'georgism',
  'individualist-anarchism',
  'liberal-conservatism',
  'liberal-feminism',
  'libertarian-socialism',
  'market-socialist',
  'marxist-leninist',
  'minarchist',
  'mutualist',
  'national-conservatism',
  'neoconservative',
  'neoliberalism',
  'progressivism',
  'radical-democracy',
  'republicanism',
  'social-conservatism',
  'social-democrat',
  'social-liberalism',
  'technocratic-centralist',
] as const satisfies readonly LabelId[]

export const SPECIALIST_LABEL_IDS = [
  'absolute-monarchist',
  'agorist',
  'agrarian-populism',
  'anarcha-feminism',
  'anarcho-primitivism',
  'anarcho-syndicalism',
  'bioregionalism',
  'bleeding-heart-libertarianism',
  'bright-green-environmentalism',
  'christian-reconstructionism',
  'christian-socialism',
  'constitutional-monarchism',
  'conservative-liberalism',
  'corporatism',
  'council-communist',
  'democratic-confederalism',
  'eco-fascism',
  'geolibertarian',
  'green-capitalism',
  'guild-socialism',
  'hindutva',
  'indigenism',
  'integralism',
  'islamic-democracy',
  'juche',
  'kemalism',
  'left-wing-market-anarchism',
  'libertarian-municipalism',
  'maoism',
  'national-bolshevism',
  'national-socialism',
  'neoreactionary',
  'objectivism',
  'one-nation-conservatism',
  'ordoliberalism',
  'paleoconservatism',
  'paleolibertarianism',
  'panarchism',
  'participism',
  'platformism',
  'political-islam',
  'stirnerism',
  'strasserism',
  'socialist-feminism',
  'syndicalist',
  'traditional-monarchist',
  'trotskyism',
  'utopian-socialism',
  'voluntaryism',
  'world-federalism',
  'zionism',
  'fourth-theory',
  'queer-anarchism',
] as const satisfies readonly LabelId[]

export const MODIFIER_LABEL_IDS = [
  'anti-imperialism',
  'eco-authoritarianism',
  'expansionist-nationalism',
  'fiscal-conservatism',
  'internationalism',
  'left-wing-nationalism',
  'left-wing-populism',
  'multiculturalism',
  'regionalism',
  'religious-nationalism',
  'right-wing-populism',
  'separatist-nationalism',
  'theocrat',
  'welfare-chauvinism',
] as const satisfies readonly LabelId[]

export const CONTEXT_LABEL_IDS = [
  'accelerationism',
  'cyberocracy',
  'dataism',
  'fundamentalist-theocracy',
  'liquid-democracy',
  'radical-centrism',
  'singularitarianism',
  'social-investment-state',
  'techno-anarchism',
  'transhumanism',
  'universal-basic-income',
] as const satisfies readonly LabelId[]

export const RETIRED_LABEL_IDS = [
  'cultural-populism',
  'decentralist-market-skeptic-of-state',
  'egalitarian-statist',
  'market-liberal',
  'national-traditionalist',
  'revolutionary-collectivist',
] as const satisfies readonly LabelId[]

export const LABEL_IDS_BY_ROLE = {
  primary: PRIMARY_LABEL_IDS,
  specialist: SPECIALIST_LABEL_IDS,
  modifier: MODIFIER_LABEL_IDS,
  context: CONTEXT_LABEL_IDS,
  retired: RETIRED_LABEL_IDS,
} as const

export const labelRoleById = new Map<LabelId, LabelRole>(
  (Object.entries(LABEL_IDS_BY_ROLE) as Array<[LabelRole, readonly LabelId[]]>).flatMap(([role, ids]) =>
    ids.map((id) => [id, role] as const),
  ),
)

export function roleForLabel(labelId: LabelId): LabelRole | undefined {
  return labelRoleById.get(labelId)
}

const CANONICAL_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  'fascist-authoritarian': 'Fascism',
}

function canonicalizeLabel(label: IdeologyLabel): IdeologyLabel {
  const name = CANONICAL_NAME_OVERRIDES[label.id]
  return name ? { ...label, name } : label
}

/** Labels eligible to be returned directly by the ordinary questionnaire. */
export const primaryScoringLabels = labels
  .filter((label) => roleForLabel(label.id) === 'primary')
  .map(canonicalizeLabel)

/** Labels worth browsing as political traditions or meaningful cross-cutting descriptors. */
export const publicCatalogLabels = labels
  .filter((label) => {
    const role = roleForLabel(label.id)
    return role === 'primary' || role === 'specialist' || role === 'modifier'
  })
  .map(canonicalizeLabel)

/** Criterion labels offered before results in research mode. */
export const researchIdentityLabels = primaryScoringLabels

/**
 * A specialist must be paired with a real, construct-matched depth module
 * before it can be promoted from a nearby subtype to a scored specialist result.
 */
export const specialistModuleByLabel: Readonly<Partial<Record<
  LabelId,
  typeof FEMINIST_MODULE_ID | typeof IDENTITY_SOVEREIGNTY_MODULE_ID
>>> = {
  'anarcha-feminism': FEMINIST_MODULE_ID,
  'socialist-feminism': FEMINIST_MODULE_ID,
  'indigenism': IDENTITY_SOVEREIGNTY_MODULE_ID,
}

/** Specialist labels awaiting a respondent-facing, construct-matched depth module. */
export const PROVISIONAL_SPECIALIST_LABEL_IDS: readonly LabelId[] = SPECIALIST_LABEL_IDS.filter(
  (labelId) => specialistModuleByLabel[labelId] === undefined,
)
