import type { IdeologyLabel, LabelId } from '../types'
import { FEMINIST_MODULE_ID } from './feministBreadth'
import { IDENTITY_SOVEREIGNTY_MODULE_ID } from './identitySovereigntyBreadth'
import { attachIdeologyLabelSources } from './labelSources'
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

export type LabelMeasurementStatus =
  | 'core-primary'
  | 'modifier-scored'
  | 'validated-specialist'
  | 'provisional-specialist'
  | 'context-only'
  | 'retired-alias'

export interface LabelTaxonomyMetadata {
   role: LabelRole
   measurementStatus: LabelMeasurementStatus
   parentId?: LabelId
   aliasOf?: LabelId
   rationale: string
}

export type CatalogLabel = IdeologyLabel & { taxonomy: LabelTaxonomyMetadata }

export const TAXONOMY_VERSION = '2026-08-taxonomy-v1'

export const PRIMARY_LABEL_IDS = [
  'conservative',
  'christian-democrat',
  'civic-nationalist',
  'classical-liberalism',
  'communitarianism',
  'democratic-socialist',
  'distributism',
  'ethnonationalist',
  'fascist-authoritarian',
  'green-politics',
  'liberal-conservatism',
  'libertarian-socialism',
  'market-right-libertarianism',
  'marxian-socialism',
  'marxist-leninist',
  'national-conservatism',
  'neoliberalism',
  'radical-democracy',
  'republicanism',
  'social-anarchism',
  'social-democrat',
  'social-liberalism',
] as const satisfies readonly LabelId[]

export const SPECIALIST_LABEL_IDS = [
  'absolute-monarchist',
  'agorist',
  'agrarian-populism',
  'anarcho-capitalist',
  'anarcho-communist',
  'anarcha-feminism',
  'anarcho-primitivism',
  'anarcho-syndicalism',
  'bioregionalism',
  'bleeding-heart-libertarianism',
  'bright-green-environmentalism',
  'black-nationalism',
  'christian-reconstructionism',
  'christian-socialism',
  'corporatism',
  'council-communist',
  'democratic-confederalism',
  'deep-ecology',
  'degrowth-green',
  'eco-fascism',
  'ecomodernist',
  'ecosocialist',
  'georgism',
  'geolibertarian',
  'green-capitalism',
  'guild-socialism',
  'hindutva',
  'indigenism',
  'individualist-anarchism',
  'integralism',
  'islamic-democracy',
  'juche',
  'kemalism',
  'left-wing-market-anarchism',
  'liberal-feminism',
  'libertarian-municipalism',
  'market-socialist',
  'maoism',
  'minarchist',
  'mutualist',
  'national-bolshevism',
  'national-socialism',
  'neoconservative',
  'neoreactionary',
  'objectivism',
  'one-nation-conservatism',
  'ordoliberalism',
  'paleoconservatism',
  'paleolibertarianism',
  'pan-africanism',
  'participism',
  'political-islam',
  'stirnerism',
  'strasserism',
  'socialist-feminism',
  'syndicalist',
  'traditional-monarchist',
  'trotskyism',
  'utopian-socialism',
  'voluntaryism',
  'zionism',
  'techno-anarchism',
  'technocratic-centralist',
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
  'progressivism',
  'social-conservatism',
  'technocratic-orientation',
  'theocrat',
  'welfare-chauvinism',
] as const satisfies readonly LabelId[]

export const CONTEXT_LABEL_IDS = [
  'accelerationism',
  'constitutional-monarchism',
  'cyberocracy',
  'dataism',
   'fourth-theory',
  'fundamentalist-theocracy',
  'liquid-democracy',
  'radical-centrism',
  'singularitarianism',
  'social-investment-state',
  'platformism',
  'panarchism',
  'transhumanism',
  'universal-basic-income',
  'world-federalism',
] as const satisfies readonly LabelId[]

export const RETIRED_LABEL_IDS = [
  'civil-libertarian-cosmopolitan',
  'conservative-liberalism',
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

const LABEL_ALIASES: Readonly<Record<string, LabelId>> = {
   'conservative-liberalism': 'liberal-conservatism',
}

const ROLE_RATIONALES: Readonly<Partial<Record<LabelId, string>>> = {
   conservative: 'Broad family anchor for prudence and institutional continuity; subtype claims require a specialist or modifier.',
   'green-politics': 'Broad ecological family anchor; growth, technology, political economy, and strategy are independent dimensions.',
   'social-anarchism': 'Broad anti-authoritarian neighborhood; economic and organizational variants require a specialist module.',
   'market-right-libertarianism': 'Broad market and anti-statist neighborhood; specific property and state doctrines remain specialist variants.',
   'marxian-socialism': 'Broad non-Leninist Marxian family anchor; party-state and strategy distinctions remain specialist variants.',
   'progressivism': 'Cross-cutting reform and social-improvement orientation rather than a single complete ideology.',
   'social-conservatism': 'Cross-cutting moral and family-order orientation rather than a complete conservative family.',
   'technocratic-orientation': 'Cross-cutting confidence in expertise and administration, independent from centralization and democratic authority.',
   'neoconservative': 'Historically specific modern U.S. specialist current, not a generic conservative primary.',
   'market-socialist': 'Economic-system variant requiring explicit measurement of ownership and coordination mechanisms.',
   georgism: 'Property-regime and land-rent doctrine requiring specialist measurement rather than a complete primary family.',
   'technocratic-centralist': 'Compound authority-and-expertise profile requiring explicit centralization and democratic-accountability measurement.',
   'conservative-liberalism': 'Compatibility alias for the canonical combined Liberal Conservatism / Conservative Liberalism entry.',
   'fourth-theory': 'Intellectual project and self-description, not an ordinary broad ideology scoring endpoint.',
}

const PARENT_BY_ID: Readonly<Partial<Record<LabelId, LabelId>>> = {
   'anarcho-capitalist': 'market-right-libertarianism',
   'anarcho-communist': 'social-anarchism',
   'anarcho-primitivism': 'social-anarchism',
   'anarcho-syndicalism': 'social-anarchism',
   'deep-ecology': 'green-politics',
   'degrowth-green': 'green-politics',
   ecomodernist: 'green-politics',
   ecosocialist: 'green-politics',
   georgism: 'market-right-libertarianism',
   'market-socialist': 'marxian-socialism',
   'marxist-leninist': 'marxian-socialism',
   minarchist: 'market-right-libertarianism',
   mutualist: 'social-anarchism',
   neoconservative: 'conservative',
   'technocratic-centralist': 'technocratic-orientation',
   'black-nationalism': 'civic-nationalist',
   'pan-africanism': 'civic-nationalist',
}

function measurementStatusForRole(role: LabelRole): LabelMeasurementStatus {
   if (role === 'primary') return 'core-primary'
   if (role === 'modifier') return 'modifier-scored'
   if (role === 'context') return 'context-only'
   if (role === 'retired') return 'retired-alias'
   return 'provisional-specialist'
}

export const labelTaxonomyById = new Map<LabelId, LabelTaxonomyMetadata>(
   [...labelRoleById.entries()].map(([labelId, role]) => [labelId, {
      role,
      measurementStatus: measurementStatusForRole(role),
      parentId: PARENT_BY_ID[labelId],
      aliasOf: LABEL_ALIASES[labelId],
      rationale: ROLE_RATIONALES[labelId] ?? (
         role === 'specialist'
            ? 'Narrow tradition retained for browsing and future construct-matched depth measurement.'
            : role === 'context'
               ? 'Institutional form, strategy, mechanism, or intellectual context; not a complete ideology score.'
               : role === 'modifier'
                  ? 'Cross-cutting orientation that can coexist with multiple primary families.'
                  : role === 'retired'
                     ? 'Historical or compatibility entry retained outside the public catalog.'
                     : 'Broad political family retained as a primary scoring anchor.'
      ),
   }] as const),
)

export function roleForLabel(labelId: LabelId): LabelRole | undefined {
   return labelRoleById.get(labelId)
}

export function canonicalLabelId(labelId: LabelId): LabelId {
   return LABEL_ALIASES[labelId] ?? labelId
}

export function taxonomyForLabel(labelId: LabelId): LabelTaxonomyMetadata | undefined {
   return labelTaxonomyById.get(labelId)
}

const CANONICAL_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  'fascist-authoritarian': 'Fascism',
  'liberal-conservatism': 'Liberal Conservatism / Conservative Liberalism',
  'fourth-theory': "Dugin's Fourth Political Theory",
}

function canonicalizeLabel(label: IdeologyLabel): CatalogLabel {
   const name = CANONICAL_NAME_OVERRIDES[label.id]
   const taxonomy = labelTaxonomyById.get(label.id)
   if (!taxonomy) throw new Error(`Missing taxonomy metadata for ${label.id}`)
   return { ...(name ? { ...label, name } : label), taxonomy }
}

/** Labels eligible to be returned directly by the ordinary questionnaire. */
export const primaryScoringLabels = labels
  .filter((label) => roleForLabel(label.id) === 'primary')
  .map(canonicalizeLabel)
  .map((label) => attachIdeologyLabelSources(label, true))

/** Labels worth browsing as political traditions or meaningful cross-cutting descriptors. */
export const publicCatalogLabels = labels
  .filter((label) => {
    const role = roleForLabel(label.id)
  return role === 'primary' || role === 'specialist' || role === 'modifier' || role === 'context'
  })
  .map(canonicalizeLabel)
  .map((label) => attachIdeologyLabelSources(label, roleForLabel(label.id) === 'primary' || roleForLabel(label.id) === 'modifier'))

/** Criterion labels offered before results in research mode. */
export const researchIdentityLabels = primaryScoringLabels

/** Labels measured independently from the primary family result. */
export const modifierScoringLabels = labels
  .filter((label) => roleForLabel(label.id) === 'modifier')
  .map(canonicalizeLabel)
  .map((label) => attachIdeologyLabelSources(label, true) as CatalogLabel)

/**
 * A specialist must be paired with a real, construct-matched depth module
 * before it can be promoted from a nearby subtype to a scored specialist result.
 */
export const specialistModuleByLabel: Readonly<Partial<Record<LabelId, string>>> = {
   'anarcha-feminism': FEMINIST_MODULE_ID,
   'liberal-feminism': FEMINIST_MODULE_ID,
   'socialist-feminism': FEMINIST_MODULE_ID,
   'indigenism': IDENTITY_SOVEREIGNTY_MODULE_ID,
   'black-nationalism': IDENTITY_SOVEREIGNTY_MODULE_ID,
   'pan-africanism': IDENTITY_SOVEREIGNTY_MODULE_ID,
   'anarcho-capitalist': 'anarchist-families-module',
   'anarcho-communist': 'anarchist-families-module',
   'individualist-anarchism': 'anarchist-families-module',
   'anarcho-syndicalism': 'anarchist-families-module',
   mutualist: 'anarchist-families-module',
   minarchist: 'anarchist-families-module',
   'deep-ecology': 'green-morphology-module',
   'degrowth-green': 'green-morphology-module',
   ecomodernist: 'green-morphology-module',
   ecosocialist: 'green-morphology-module',
   'green-capitalism': 'green-morphology-module',
   'market-socialist': 'socialist-families-module',
   'council-communist': 'socialist-families-module',
   syndicalist: 'socialist-families-module',
   'maoism': 'socialist-families-module',
   trotskyism: 'socialist-families-module',
   neoconservative: 'conservative-variants-module',
   'one-nation-conservatism': 'conservative-variants-module',
   'islamic-democracy': 'religious-national-politics-module',
   'political-islam': 'religious-national-politics-module',
   hindutva: 'religious-national-politics-module',
   zionism: 'religious-national-politics-module',
   'techno-anarchism': 'technology-governance-module',
   'technocratic-centralist': 'technology-governance-module',
   'absolute-monarchist': 'monarchist-municipal-module',
   'traditional-monarchist': 'monarchist-municipal-module',
   'libertarian-municipalism': 'monarchist-municipal-module',
   'democratic-confederalism': 'monarchist-municipal-module',
}

/** Specialist labels awaiting a respondent-facing, construct-matched depth module. */
export const PROVISIONAL_SPECIALIST_LABEL_IDS: readonly LabelId[] = SPECIALIST_LABEL_IDS.filter(
  (labelId) => specialistModuleByLabel[labelId] === undefined,
)
