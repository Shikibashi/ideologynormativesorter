import type { CitationRecord } from '../types'

/**
 * Family-level scholarly baselines drawn from docs/labels-academic-audit.md,
 * docs/ideology-label-review.md, docs/contested-label-research-verification.md,
 * and docs/ideology-family-research-verification.md.
 *
 * These justify tradition boundaries and naming strategy. They do NOT validate
 * exact axis coordinates or niche subtype collapses.
 */
export interface FamilyScholarlyBundle {
  family: string
  scholarly: CitationRecord[]
  /** Honest note for weak/insufficient family evidence. */
  evidenceNote: string
}

function scholarlyCite(
  idSuffix: string,
  title: string,
  authors: string[],
  year: number | undefined,
  venue: string,
  url: string,
): CitationRecord {
  return {
    citeId: `cite:scholarly:${idSuffix}`,
    kind: 'scholarly',
    title,
    authors,
    year,
    venue,
    url,
    normalizedUrl: url.toLowerCase().replace(/\/$/, ''),
  }
}

const SEP = 'Stanford Encyclopedia of Philosophy'
const IEP = 'Internet Encyclopedia of Philosophy'

export const FAMILY_SCHOLARLY_CATALOG: FamilyScholarlyBundle[] = [
  {
    family: 'liberal',
    evidenceNote: 'Strong SEP baseline for liberalism and cosmopolitanism.',
    scholarly: [
      scholarlyCite(
        'sep-liberalism',
        'Liberalism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/liberalism/',
      ),
      scholarlyCite(
        'sep-cosmopolitanism',
        'Cosmopolitanism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/cosmopolitanism/',
      ),
    ],
  },
  {
    family: 'socialist',
    evidenceNote: 'Strong SEP/IEP socialism baselines; niche labels need specialists.',
    scholarly: [
      scholarlyCite(
        'sep-socialism',
        'Socialism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/socialism/',
      ),
      scholarlyCite(
        'iep-socialism',
        'Socialism',
        [],
        undefined,
        IEP,
        'https://iep.utm.edu/socialis/',
      ),
    ],
  },
  {
    family: 'social-democratic',
    evidenceNote: 'Uses socialism SEP/IEP with reformist/welfare framing notes.',
    scholarly: [
      scholarlyCite(
        'sep-socialism-socdem',
        'Socialism (social-democracy sections)',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/socialism/',
      ),
      scholarlyCite(
        'iep-socialism-socdem',
        'Socialism',
        [],
        undefined,
        IEP,
        'https://iep.utm.edu/socialis/',
      ),
    ],
  },
  {
    family: 'libertarian-leaning',
    evidenceNote:
      'Solid SEP libertarianism baseline delineating boundary from classical liberalism. Does not validate numeric coordinates for variants.',
    scholarly: [
      scholarlyCite(
        'sep-libertarianism',
        'Libertarianism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/libertarianism/',
      ),
      scholarlyCite(
        'sep-liberalism-libertarian',
        'Liberalism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/liberalism/',
      ),
    ],
  },
  {
    family: 'conservative',
    evidenceNote: 'Adequate SEP conservatism baseline; religious variants need specialists.',
    scholarly: [
      scholarlyCite(
        'sep-conservatism',
        'Conservatism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/conservatism/',
      ),
      scholarlyCite(
        'iep-polphil-conservative',
        'Political Philosophy: Methodology',
        [],
        undefined,
        IEP,
        'https://iep.utm.edu/polphil/',
      ),
    ],
  },
  {
    family: 'technocratic',
    evidenceNote:
      'SEP Political Legitimacy provides a conceptual boundary for epistocratic/technocratic claims to authority. Does not validate numeric coordinates.',
    scholarly: [
      scholarlyCite(
        'sep-political-legitimacy',
        'Political Legitimacy',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/legitimacy/',
      ),
      scholarlyCite(
        'rand-ronfeldt-cyberocracy',
        'Cyberocracy, Cyberspace, and Cyberology: Political Effects of the Information Revolution',
        ['David Ronfeldt'],
        1992,
        'RAND',
        'https://www.rand.org/content/dam/rand/pubs/papers/2008/P7745.pdf',
      ),
    ],
  },
  {
    family: 'anarchist',
    evidenceNote: 'Strong SEP anarchism + socialism baselines for social-anarchist strands.',
    scholarly: [
      scholarlyCite(
        'sep-anarchism',
        'Anarchism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/anarchism/',
      ),
      scholarlyCite(
        'sep-socialism-anarchist',
        'Socialism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/socialism/',
      ),
    ],
  },
  {
    family: 'authoritarian',
    evidenceNote:
      'Griffin-style fascism scholarship + SEP nationalism for ultranationalist strands.',
    scholarly: [
      scholarlyCite(
        'griffin-palingenetic-core',
        'The Palingenetic Core of Fascist Ideology',
        ['Roger Griffin'],
        undefined,
        'Library of Social Science (overview of Griffin framework)',
        'https://www.libraryofsocialscience.com/ideologies/resources/griffin-the-palingenetic-core/',
      ),
      scholarlyCite(
        'sep-nationalism-authoritarian',
        'Nationalism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/nationalism/',
      ),
    ],
  },
  {
    family: 'green',
    evidenceNote:
      'SEP Environmental Ethics establishes the normative core of green political thought. Does not assign empirical axis coordinates.',
    scholarly: [
      scholarlyCite(
        'sep-environmental-ethics',
        'Environmental Ethics',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/ethics-environmental/',
      ),
      scholarlyCite(
        'iep-environmental-ethics',
        'Environmental Ethics',
        [],
        undefined,
        IEP,
        'https://iep.utm.edu/enviro-e/',
      ),
    ],
  },
  {
    family: 'nationalist',
    evidenceNote:
      'Strong SEP nationalism baseline; contested ethno/religious subtypes need specialists.',
    scholarly: [
      scholarlyCite(
        'sep-nationalism',
        'Nationalism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/nationalism/',
      ),
      scholarlyCite(
        'sep-cosmopolitanism-nationalist',
        'Cosmopolitanism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/cosmopolitanism/',
      ),
    ],
  },
  {
    family: 'populist',
    evidenceNote: 'Mudde thin-ideology debate + SEP democracy for procedural context.',
    scholarly: [
      scholarlyCite(
        'mudde-populist-zeitgeist',
        'The Populist Zeitgeist',
        ['Cas Mudde'],
        2004,
        'Government and Opposition / Cambridge',
        'https://www.cambridge.org/core/journals/government-and-opposition/article/populist-zeitgeist/2CD34F8B25C4FFF4F322316833DB94B7',
      ),
      scholarlyCite(
        'sep-democracy-populist',
        'Democracy',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/democracy/',
      ),
    ],
  },
  {
    family: 'republican',
    evidenceNote: 'SEP republicanism + democracy baselines.',
    scholarly: [
      scholarlyCite(
        'sep-republicanism',
        'Republicanism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/republicanism/',
      ),
      scholarlyCite(
        'sep-democracy-republican',
        'Democracy',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/democracy/',
      ),
    ],
  },
  {
    family: 'democratic',
    evidenceNote: 'Adequate generic democratic theory; confederal variants need specialists.',
    scholarly: [
      scholarlyCite(
        'sep-democracy',
        'Democracy',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/democracy/',
      ),
      scholarlyCite(
        'sep-republicanism-democratic',
        'Republicanism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/republicanism/',
      ),
    ],
  },
  {
    family: 'communitarian',
    evidenceNote: 'Solid SEP communitarianism baseline providing contrast with liberal individualism. Justifies tradition boundary, not quantitative placement.',
    scholarly: [
      scholarlyCite(
        'sep-communitarianism',
        'Communitarianism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/communitarianism/',
      ),
      scholarlyCite(
        'sep-liberalism-communitarian',
        'Liberalism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/liberalism/',
      ),
    ],
  },
  {
    family: 'distributist',
    evidenceNote: 'Christian-democratic / distributist intellectual history baselines.',
    scholarly: [
      scholarlyCite(
        'eui-christian-democracy',
        'Christian Democracy',
        [],
        undefined,
        'European University Institute',
        'https://cadmus.eui.eu/bitstreams/e1f2c3f6-a6b8-5d88-8e96-681950cd3ff1/download',
      ),
      scholarlyCite(
        'modjourn-distributism',
        'Distributism',
        [],
        undefined,
        'Modernist Journals Project / Brown University',
        'https://modjourn.org/essay/distributism/',
      ),
    ],
  },
  {
    family: 'indigenist',
    evidenceNote:
      'SEP Colonialism and Group Rights baselines establish boundaries for Indigenous sovereignty and anti-colonial self-determination without assigning coordinates.',
    scholarly: [
      scholarlyCite(
        'sep-colonialism',
        'Colonialism',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/colonialism/',
      ),
      scholarlyCite(
        'sep-rights-group',
        'Group Rights',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/rights-group/',
      ),
    ],
  },
  {
    family: 'monarchist',
    evidenceNote:
      'International IDEA establishes that constitutionally limited monarchy includes parliamentary-democratic and symbolic forms; it does not validate a centroid.',
    scholarly: [
      scholarlyCite(
        'idea-constitutional-monarchs',
        'Constitutional Monarchs in Parliamentary Democracies',
        ['W. Elliot Bulmer'],
        2014,
        'International IDEA',
        'https://www.idea.int/publications/catalogue/constitutional-monarchs-parliamentary-democracies',
      ),
      scholarlyCite(
        'idea-constitutional-monarchs-primer',
        'Constitutional Monarchs in Parliamentary Democracies: Primer',
        ['W. Elliot Bulmer'],
        2014,
        'International IDEA',
        'https://www.idea.int/sites/default/files/publications/constitutional-monarchs-in-parliamentary-democracies-primer.pdf',
      ),
    ],
  },
  {
    family: 'religious-political',
    evidenceNote:
      'Political-theory and comparative-democracy sources support a distinct religious-political family with internally diverse relationships to democracy, law, and violence.',
    scholarly: [
      scholarlyCite(
        'sep-religion-political',
        'Religion and Political Theory',
        [],
        undefined,
        SEP,
        'https://plato.stanford.edu/entries/religion-political/',
      ),
      scholarlyCite(
        'jod-islamist-movements',
        'Islamist Parties and Democracy: Three Kinds of Movements',
        ['Tamara Cofman Wittes'],
        2008,
        'Journal of Democracy',
        'https://www.journalofdemocracy.org/articles/islamist-parties-and-democracy-three-kinds-of-movements/',
      ),
    ],
  },
]

export const familyScholarlyById = new Map(
  FAMILY_SCHOLARLY_CATALOG.map((b) => [b.family, b]),
)

export function scholarlyCiteIdsForFamily(family: string): string[] {
  const bundle = familyScholarlyById.get(family)
  if (!bundle || bundle.scholarly.length < 2) {
    // Deterministic fallback pair — should never hit for WP0 families.
    return [
      'cite:scholarly:sep-liberalism',
      'cite:scholarly:iep-polphil-conservative',
    ]
  }
  return bundle.scholarly.slice(0, 2).map((c) => c.citeId)
}

export function allFamilyScholarlyCitations(): CitationRecord[] {
  const byId = new Map<string, CitationRecord>()
  for (const bundle of FAMILY_SCHOLARLY_CATALOG) {
    for (const cite of bundle.scholarly) {
      byId.set(cite.citeId, cite)
    }
  }
  return [...byId.values()]
}
