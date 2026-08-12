import type { IdeologyLabel, IdeologyLabelSource, IdeologyLabelSourceScope, LabelId } from '../types'

type SourceDefinition = Omit<IdeologyLabelSource, 'supports'>

const SOURCE_CATALOG: Record<string, SourceDefinition> = {
   'sep-liberalism': {
      sourceId: 'sep-liberalism',
      title: 'Liberalism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/liberalism/',
      kind: 'scholarly',
      note: 'Provides a broad philosophical baseline for liberal rights, liberty, legal equality, and limited government; it does not validate this label’s numeric coordinates.',
   },
   'sep-libertarianism': {
      sourceId: 'sep-libertarianism',
      title: 'Libertarianism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/libertarianism/',
      kind: 'scholarly',
      note: 'Provides a broad baseline for libertarian arguments about coercion, property, and voluntary association; variants remain internally diverse.',
   },
   'sep-socialism': {
      sourceId: 'sep-socialism',
      title: 'Socialism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/socialism/',
      kind: 'scholarly',
      note: 'Provides a family-level baseline for social ownership and democratic control of productive resources; it does not settle the subtype or policy mix represented here.',
   },
   'iep-socialism': {
      sourceId: 'iep-socialism',
      title: 'Socialism',
      publisher: 'Internet Encyclopedia of Philosophy',
      url: 'https://iep.utm.edu/socialis/',
      kind: 'reference',
      note: 'Provides an accessible overview of socialist traditions and their variation; it does not validate this label’s numeric coordinates.',
   },
   'sep-anarchism': {
      sourceId: 'sep-anarchism',
      title: 'Anarchism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/anarchism/',
      kind: 'scholarly',
      note: 'Provides a broad baseline for anti-authoritarian political thought; anarchist traditions differ substantially over property, markets, and organization.',
   },
   'sep-conservatism': {
      sourceId: 'sep-conservatism',
      title: 'Conservatism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/conservatism/',
      kind: 'scholarly',
      note: 'Provides a broad baseline for conservative arguments about tradition, prudence, and institutional continuity; it does not determine a label’s economic or social variant.',
   },
   'sep-nationalism': {
      sourceId: 'sep-nationalism',
      title: 'Nationalism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/nationalism/',
      kind: 'scholarly',
      note: 'Provides a broad baseline for national identity, sovereignty, and self-determination; it does not collapse civic, ethnic, religious, or anti-colonial forms into one doctrine.',
   },
   'sep-republicanism': {
      sourceId: 'sep-republicanism',
      title: 'Republicanism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/republicanism/',
      kind: 'scholarly',
      note: 'Provides a baseline for civic self-government and freedom from domination; it does not prescribe one party system or economic program.',
   },
   'sep-democracy': {
      sourceId: 'sep-democracy',
      title: 'Democracy',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/democracy/',
      kind: 'scholarly',
      note: 'Provides a baseline for democratic authority and participation; it does not establish that a label’s mapped profile is empirically validated.',
   },
   'sep-communitarianism': {
      sourceId: 'sep-communitarianism',
      title: 'Communitarianism',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/communitarianism/',
      kind: 'scholarly',
      note: 'Provides a baseline for arguments about social membership, practices, and community; communitarian positions vary over rights and state power.',
   },
   'sep-environmental-ethics': {
      sourceId: 'sep-environmental-ethics',
      title: 'Environmental Ethics',
      publisher: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/entries/ethics-environmental/',
      kind: 'scholarly',
      note: 'Provides a baseline for ecological value and obligations to the nonhuman world; it does not determine one ecological economic or institutional strategy.',
   },
   'eui-christian-democracy': {
      sourceId: 'eui-christian-democracy',
      title: 'Christian Democracy',
      publisher: 'European University Institute',
      url: 'https://cadmus.eui.eu/bitstreams/e1f2c3f6-a6b8-5d88-8e96-681950cd3ff1/download',
      kind: 'scholarly',
      note: 'Provides intellectual-history context for Christian-democratic and subsidiarity-oriented traditions; it does not collapse distributism into Christian democracy.',
   },
   'modernist-journals-distributism': {
      sourceId: 'modernist-journals-distributism',
      title: 'Distributism',
      publisher: 'Modernist Journals Project / Brown University',
      url: 'https://modjourn.org/essay/distributism/',
      kind: 'reference',
      note: 'Provides a historical overview of dispersed property ownership and distributist political economy; it does not validate this label’s numeric coordinates.',
   },
   'cambridge-corporatism': {
      sourceId: 'cambridge-corporatism',
      title: 'Corporatism',
      publisher: 'Cambridge Handbook of Constitutional Theory',
      url: 'https://www.cambridge.org/core/books/abs/cambridge-handbook-of-constitutional-theory/corporatism/FB99029D8586B9F70358345303A26260',
      kind: 'scholarly',
      note: 'Supports the distinction between corporatism as an umbrella and the state-directed authoritarian form used by this catalog label; democratic and societal corporatist forms also exist.',
   },
   'cambridge-kemalism': {
      sourceId: 'cambridge-kemalism',
      title: 'Turkish Conservative Modernism: Birth of a Nationalist Quest for Cultural Renewal',
      publisher: 'International Journal of Middle East Studies',
      url: 'https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/article/abs/turkish-conservative-modernism-birth-of-a-nationalist-quest-for-cultural-renewal/72A93098038B9EC1D959659C08D0EAEB',
      kind: 'scholarly',
      note: 'Supports the historical state-building context and the Six Arrows framing while recognizing heterogeneity within Kemalist interpretations.',
   },
   'sage-fiscal-conservatism': {
      sourceId: 'sage-fiscal-conservatism',
      title: 'Fiscal Conservatism',
      publisher: 'The SAGE Encyclopedia of Political Science',
      url: 'https://sk.sagepub.com/ency/edvol/embed/the-encyclopedia-of-political-science/chpt/fiscal-conservatism',
      kind: 'reference',
      note: 'Supports fiscal conservatism as a historically variable economic orientation distinct from social conservatism; tax cuts, spending cuts, privatization, and austerity are possible strategies rather than requirements.',
   },
   'oxford-ethnonationalism': {
      sourceId: 'oxford-ethnonationalism',
      title: 'Ethnonationalism',
      publisher: 'Oxford Bibliographies',
      url: 'https://academic.oup.com/reference/62356/reference-article-abstract/554498639?login=false',
      kind: 'scholarly',
      note: 'Supports ethnicity or ethnic ties as central to ethnonational membership while preserving the historical diversity of self-determination, postcolonial, fascist, nativist, and exclusionary variants.',
   },
   'cambridge-islamic-constitutionalism': {
      sourceId: 'cambridge-islamic-constitutionalism',
      title: 'Islamic Constitutionalism',
      publisher: 'Democracy Under God, Cambridge University Press',
      url: 'https://www.cambridge.org/core/books/abs/democracy-under-god/islamic-constitutionalism/3C82791964D0B1824113F0AC38CEDD1B',
      kind: 'scholarly',
      note: 'Supports treating Islamic constitutionalism as an institutional problem involving Islam, constitutional democracy, rights, and legal authority rather than as one settled country or party model.',
   },
   'springer-fourth-political-theory': {
      sourceId: 'springer-fourth-political-theory',
      title: 'The Fourth Political Theory: Aleksandr Dugin’s Ideological Repackaging of Third-Position and Fascist Materials',
      publisher: 'Socialism and Democracy / Springer',
      url: 'https://link.springer.com/article/10.1007/s11212-025-09703-3',
      kind: 'scholarly',
      note: 'Supports presenting Dugin’s project as author-specific and contested, separating his claimed break with fascism from critical scholarly classification.',
   },
}

const FAMILY_SOURCE_IDS: Record<string, readonly string[]> = {
   liberal: ['sep-liberalism', 'sep-libertarianism'],
   socialist: ['sep-socialism', 'iep-socialism'],
   'social-democratic': ['sep-socialism', 'iep-socialism'],
   anarchist: ['sep-anarchism', 'sep-libertarianism'],
   conservative: ['sep-conservatism'],
   nationalist: ['sep-nationalism'],
   republican: ['sep-republicanism', 'sep-democracy'],
   democratic: ['sep-democracy', 'sep-republicanism'],
   communitarian: ['sep-communitarianism', 'sep-liberalism'],
   green: ['sep-environmental-ethics'],
   authoritarian: ['sep-nationalism'],
   populist: ['sep-democracy'],
   'anti-colonial': ['sep-nationalism'],
   regionalist: ['sep-nationalism'],
   technocratic: ['sep-democracy'],
   distributist: ['eui-christian-democracy', 'modernist-journals-distributism'],
}

const EXPLICIT_SOURCE_IDS_BY_LABEL_ID: Partial<Record<LabelId, readonly string[]>> = {
   corporatism: ['cambridge-corporatism'],
   kemalism: ['cambridge-kemalism'],
   'fiscal-conservatism': ['sage-fiscal-conservatism'],
   ethnonationalist: ['oxford-ethnonationalism'],
   'islamic-democracy': ['cambridge-islamic-constitutionalism'],
   'fourth-theory': ['springer-fourth-political-theory'],
}

const EXPLICIT_SUPPORTS_BY_LABEL_ID: Partial<Record<LabelId, readonly IdeologyLabelSourceScope[]>> = {
   corporatism: ['definition', 'normative', 'boundary'],
   kemalism: ['definition', 'normative', 'descriptive', 'prescriptive'],
   'fiscal-conservatism': ['definition', 'normative', 'descriptive', 'prescriptive', 'boundary'],
   ethnonationalist: ['definition', 'prescriptive', 'boundary'],
   'islamic-democracy': ['definition', 'descriptive', 'prescriptive', 'boundary'],
   'fourth-theory': ['definition', 'descriptive', 'prescriptive', 'boundary'],
}

function sourceWithSupports(sourceId: string, supports: readonly IdeologyLabelSourceScope[]): IdeologyLabelSource {
   const source = SOURCE_CATALOG[sourceId]
   if (!source) throw new Error(`Unknown ideology label source: ${sourceId}`)
   return { ...source, supports }
}

/**
 * Returns public interpretive sources for a label. Family baselines are used
 * for scored labels; narrow labels receive bespoke sources only where the
 * catalog has completed a dedicated source review.
 */
export function getIdeologyLabelSources(label: IdeologyLabel, includeFamilyBaseline = false): readonly IdeologyLabelSource[] {
   const explicitIds = EXPLICIT_SOURCE_IDS_BY_LABEL_ID[label.id] ?? []
   const familyIds = includeFamilyBaseline ? FAMILY_SOURCE_IDS[label.family] ?? [] : []
   const sourceIds = Array.from(new Set([...familyIds, ...explicitIds]))
   const supports = EXPLICIT_SUPPORTS_BY_LABEL_ID[label.id]
      ?? (includeFamilyBaseline
         ? ['definition', 'normative', 'descriptive', 'prescriptive', 'boundary']
         : ['definition', 'boundary'])
   return sourceIds.map((sourceId) => sourceWithSupports(sourceId, supports))
}

export function attachIdeologyLabelSources<T extends IdeologyLabel>(label: T, includeFamilyBaseline = false): T {
   const sources = getIdeologyLabelSources(label, includeFamilyBaseline)
   return (sources.length > 0 ? { ...label, sources } : label) as T
}

export const ideologyLabelSourceCatalog = Object.freeze(
   Object.values(SOURCE_CATALOG).map((source) => Object.freeze({ ...source })),
)
