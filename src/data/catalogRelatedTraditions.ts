export type RelatedTraditionStatus = 'catalog-candidate'

/**
 * Historically meaningful traditions that the public catalog should be able to
 * name and explain, but that the current question bank cannot distinguish well
 * enough to return as scored results. These entries deliberately have no axis
 * centroid and must remain outside the label-scoring pipeline.
 */
export interface CatalogRelatedTradition {
  id: string
  name: string
  family: string
  subfamily: string
  status: RelatedTraditionStatus
  aliases?: readonly string[]
  description: string
  sourceUrls: readonly string[]
}

export const catalogRelatedTraditions: readonly CatalogRelatedTradition[] = [
  {
    id: 'non-leninist-marxian-socialism',
    name: 'Marxian Socialism (Non-Leninist)',
    family: 'socialist',
    subfamily: 'marxian-socialist',
    status: 'catalog-candidate',
    aliases: ['Non-Leninist Marxian Socialism', 'Democratic Marxism', 'Non-Leninist Marxism'],
    description:
      'An umbrella for socialist positions that use Marxian class and capitalist-relations analysis while rejecting Leninist party-state doctrine. Its democratic and anti-authoritarian variants require more specific questions before they can be separated from adjacent socialist traditions.',
    sourceUrls: ['https://plato.stanford.edu/entries/socialism/'],
  },
  {
    id: 'eurocommunism',
    name: 'Eurocommunism',
    family: 'socialist',
    subfamily: 'democratic-communist',
    status: 'catalog-candidate',
    aliases: ['Democratic Communism', 'Pluralist Communism'],
    description:
      'A Western European communist current associated with parliamentary democracy, political pluralism, and independence from the Soviet model while retaining a communist identity.',
    sourceUrls: [
      'https://www.cambridge.org/core/journals/european-journal-of-political-research/article/abs/eurocommunism-four-years-on/575D703F043F9C4D51ECCBB0A6FC96D3',
    ],
  },
  {
    id: 'ujamaa',
    name: 'Ujamaa / Nyerereism',
    family: 'socialist',
    subfamily: 'african-socialist',
    status: 'catalog-candidate',
    aliases: ['Ujamaa', 'Nyerereism', 'Tanzanian African Socialism'],
    description:
      'Julius Nyerere’s Tanzanian current of African socialism, centered on familyhood, communal obligation, national self-reliance, and rural development through Ujamaa villages.',
    sourceUrls: [
      'https://academic.oup.com/edited-volume/61663/chapter/553407677',
      'https://www.cambridge.org/core/journals/africa/article/abs/ujamaa-revisited-indigenous-and-european-influences-in-nyereres-social-and-political-thought/6BEAA8BE5DECD916979237B710C7F73F',
    ],
  },
  {
    id: 'arab-socialism',
    name: 'Arab Socialism',
    family: 'socialist',
    subfamily: 'arab-socialist',
    status: 'catalog-candidate',
    aliases: ['Arab Socialist', 'Socialist Arabism'],
    description:
      'A diverse family of Arab socialist currents that joined social and economic transformation to anti-colonial state-building and Arab national projects, including but not limited to Nasserist and Ba’athist forms.',
    sourceUrls: [
      'https://www.cambridge.org/core/books/abs/cambridge-history-of-socialism/arab-socialism/C0CC111E2F8E7DB698326B03385240CF',
    ],
  },
]
