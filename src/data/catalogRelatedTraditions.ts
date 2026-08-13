export type RelatedTraditionStatus = "catalog-candidate" | "focused-follow-up";

/**
 * Historically meaningful traditions that the public catalog should be able to
 * name and explain, but that the current question bank cannot distinguish well
 * enough to return as scored results. These entries deliberately have no axis
 * centroid and must remain outside the label-scoring pipeline.
 */
export interface CatalogRelatedTradition {
  id: string;
  name: string;
  family: string;
  subfamily: string;
  status: RelatedTraditionStatus;
  aliases?: readonly string[];
  description: string;
  sourceUrls: readonly string[];
}

export const catalogRelatedTraditions: readonly CatalogRelatedTradition[] = [
  {
    id: "eurocommunism",
    name: "Eurocommunism",
    family: "socialist",
    subfamily: "democratic-communist",
    status: "catalog-candidate",
    description:
      "A Western European communist current associated with parliamentary democracy, political pluralism, and independence from the Soviet model while retaining a communist identity.",
    sourceUrls: [
      "https://www.cambridge.org/core/journals/european-journal-of-political-research/article/abs/eurocommunism-four-years-on/575D703F043F9C4D51ECCBB0A6FC96D3",
    ],
  },
  {
    id: "ujamaa",
    name: "Ujamaa / Nyerereism",
    family: "socialist",
    subfamily: "african-socialist",
    status: "catalog-candidate",
    aliases: ["Ujamaa", "Nyerereism", "Tanzanian African Socialism"],
    description:
      "Julius Nyerere’s Tanzanian current of African socialism, centered on familyhood, communal obligation, national self-reliance, and rural development through Ujamaa villages.",
    sourceUrls: [
      "https://academic.oup.com/edited-volume/61663/chapter/553407677",
      "https://www.cambridge.org/core/journals/africa/article/abs/ujamaa-revisited-indigenous-and-european-influences-in-nyereres-social-and-political-thought/6BEAA8BE5DECD916979237B710C7F73F",
    ],
  },
];
