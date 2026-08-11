export type RelatedTraditionStatus = 'catalog-candidate' | 'focused-follow-up'

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
    id: 'market-right-libertarianism',
    name: 'Market / Right-Libertarianism',
    family: 'liberal',
    subfamily: 'market-libertarian',
    status: 'catalog-candidate',
    aliases: ['Right-Libertarianism', 'Market Libertarianism'],
    description:
      'The modern market-oriented libertarian family links robust personal freedom to private property, voluntary exchange, and strict limits on state coercion. It sits in the liberal tradition here; libertarian-socialist and anarchist uses remain in their own families rather than being folded into this label.',
    sourceUrls: [
      'https://plato.stanford.edu/entries/libertarianism/',
      'https://plato.stanford.edu/entries/liberalism/',
    ],
  },
  {
    id: 'non-leninist-marxian-socialism',
    name: 'Marxian Socialism (Non-Leninist)',
    family: 'socialist',
    subfamily: 'marxian-socialist',
    status: 'catalog-candidate',
    aliases: ['Non-Leninist Marxian Socialism', 'Non-Leninist Marxism'],
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
  {
    id: 'black-nationalism',
    name: 'Black Nationalism',
    family: 'nationalist',
    subfamily: 'black-self-determination',
    status: 'focused-follow-up',
    aliases: ['Black Political Nationalism'],
    description:
      'A heterogeneous tradition centered on Black political, economic, and cultural autonomy in response to racial domination. Community-nationalist forms emphasize institution-building and collective self-reliance, while separatist forms seek stronger territorial or state autonomy; neither is safely represented by cloning a generic ethnonationalist profile.',
    sourceUrls: [
      'https://onlinelibrary.wiley.com/doi/abs/10.1111/1468-2508.00116',
      'https://www.cambridge.org/core/journals/american-political-science-review/article/abs/liberal-defense-of-black-nationalism/5B5E6442E55A8A10342A0D43BDEFC47B',
    ],
  },
  {
    id: 'pan-africanism',
    name: 'Pan-Africanism',
    family: 'anti-colonial',
    subfamily: 'pan-african',
    status: 'focused-follow-up',
    aliases: ['Pan-African Unity', 'Pan-Africanist'],
    description:
      'A diverse political tradition linking African peoples and African-descended diasporas through transnational solidarity, anti-colonial struggle, or projects of African unity. Its internationalist, sovereignty-centered, and nativist variants should not be collapsed into Black separatism or one generic nationalist centroid.',
    sourceUrls: [
      'https://www.cambridge.org/core/journals/review-of-international-studies/article/abs/internationalists-sovereigntists-nativists-contending-visions-of-world-order-in-panafricanism/85ED07FAA4CCB08F6CDB2A532437B3E2',
      'https://www.cambridge.org/core/journals/du-bois-review-social-science-research-on-race/article/true-to-our-native-land-distinguishing-attitudinal-support-for-panafricanism-from-black-separatism/2378116FD1172FA43A339347603DCB11',
    ],
  },
]
