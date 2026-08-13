import type { Axis, IdeologyLabel, Layer } from "../types";

export interface LayerExplainer {
  label: string;
  measurement: string;
  description: string;
}

export const LAYER_EXPLAINERS: Record<Layer, LayerExplainer> = {
  normative: {
    label: "Foundational values / ideal legitimacy",
    measurement:
      "which values and forms of authority you consider morally legitimate",
    description:
      "In this test, this layer asks about foundational moral commitments and what an ideally legitimate political order would value or allow.",
  },
  descriptive: {
    label: "Empirical beliefs / how institutions behave",
    measurement: "what you think tends to be true in the world",
    description:
      "In this test, this layer asks what you believe about institutions, incentives, culture, and likely consequences—not what you approve of.",
  },
  prescriptive: {
    label: "Applied policy / strategy",
    measurement: "which policies, institutions, or strategies you favor",
    description:
      "In this test, this layer asks what should be done in practice under the ideal, current, or mixed conditions named by the item.",
  },
};

import { termDefinitionsPart01 } from "./ideologyTermParts/termDefinitionsPart01";
import { directTermDefinitionsPart01 } from "./ideologyDirectTermParts/directTermDefinitionsPart01";
import { summaryBasePart01 } from "./ideologySummaryParts/summaryBasePart01";
import { summaryCompletionPart01 } from "./ideologySummaryParts/summaryCompletionPart01";
import type { IdeologyTermDefinition } from "./ideologyExplainersTypes";

const IDEOLOGY_TERM_DEFINITIONS: IdeologyTermDefinition[] = [
  ...termDefinitionsPart01,
];

const DIRECT_TERM_DEFINITIONS_BY_LABEL_ID: Readonly<
  Record<string, readonly string[]>
> = {
  ...directTermDefinitionsPart01,
};

const DIRECT_ONLY_TERM_DEFINITION_LABEL_IDS = new Set([
  "national-traditionalist",
  "fascist-authoritarian",
  "eco-fascism",
  "strasserism",
  "christian-democrat",
  "theocrat",
  "integralism",
  "fundamentalist-theocracy",
  "democratic-socialist",
  "market-socialist",
  "socialist-feminism",
  "juche",
  "egalitarian-statist",
  "social-democrat",
  "universal-basic-income",
  "social-investment-state",
  "right-wing-populism",
  "left-wing-populism",
  "agrarian-populism",
  "cultural-populism",
  "market-liberal",
  "decentralist-market-skeptic-of-state",
  "civil-libertarian-cosmopolitan",
  "classical-liberalism",
  "neoliberalism",
  "social-liberalism",
  "progressivism",
  "liberal-feminism",
  "georgism",
  "internationalism",
  "radical-centrism",
  "constitutional-monarchism",
  "anti-imperialism",
  "traditional-monarchist",
  "communitarianism",
  "republicanism",
  "bioregionalism",
  "political-islam",
  "world-federalism",
  "multiculturalism",
  "technocratic-centralist",
  "transhumanism",
  "cyberocracy",
  "accelerationism",
  "dataism",
  "singularitarianism",
  "bright-green-environmentalism",
  "green-capitalism",
  "national-socialism",
  "corporatism",
  "islamic-democracy",
  "council-communist",
  "syndicalist",
  "anarcho-syndicalism",
  "platformism",
  "mutualist",
  "agorist",
  "left-wing-market-anarchism",
  "individualist-anarchism",
  "anarcho-primitivism",
  "voluntaryism",
  "stirnerism",
  "anarcha-feminism",
  "queer-anarchism",
  "techno-anarchism",
  "civic-nationalist",
  "indigenism",
  "hindutva",
  "religious-nationalism",
  "zionism",
  "left-wing-nationalism",
  "expansionist-nationalism",
  "separatist-nationalism",
  "welfare-chauvinism",
  "participism",
  "panarchism",
  "liquid-democracy",
  "ecomodernist",
  "ecosocialist",
  "geolibertarian",
  "anarcho-capitalist",
  "anarcho-communist",
  "bleeding-heart-libertarianism",
  "national-bolshevism",
  "kemalism",
  "christian-reconstructionism",
  "fourth-theory",
  "revolutionary-collectivist",
  "marxist-leninist",
  "libertarian-socialism",
  "maoism",
  "trotskyism",
  "guild-socialism",
  "christian-socialism",
  "utopian-socialism",
  "neoconservative",
  "paleoconservatism",
  "one-nation-conservatism",
  "fiscal-conservatism",
  "social-conservatism",
  "national-conservatism",
  "conservative-liberalism",
  "liberal-conservatism",
  "conservative",
  "green-politics",
  "social-anarchism",
  "market-right-libertarianism",
  "marxian-socialism",
  "technocratic-orientation",
  "black-nationalism",
  "pan-africanism",
  "market-anarchism",
  "third-way",
  "baathism",
  "developmental-authoritarianism",
  "confucian-political-revival",
  "asian-values",
  "nationalism",
  "populism",
  "civil-libertarianism",
  "cosmopolitanism",
  "decentralist-orientation",
  "feminist-orientation",
  "economic-nationalism",
  "developmentalism",
  "pan-arabism",
  "arab-socialism",
  "radical-feminism",
  "black-feminism",
  "queer-politics",
]);

/**
 * Layer-specific editorial summaries for labels whose general influence notes
 * otherwise conflate values, empirical expectations, and practical strategy.
 */

const CURATED_IDEOLOGY_LAYER_SUMMARIES_BASE: Readonly<
  Record<string, Partial<Record<Layer, string>>>
> = {
  ...summaryBasePart01,
};

const CURATED_IDEOLOGY_LAYER_COMPLETIONS: Readonly<
  Record<string, Partial<Record<Layer, string>>>
> = {
  ...summaryCompletionPart01,
};

export const CURATED_IDEOLOGY_LAYER_SUMMARIES: Readonly<
  Record<string, Partial<Record<Layer, string>>>
> = Object.freeze(
  Object.keys({
    ...CURATED_IDEOLOGY_LAYER_SUMMARIES_BASE,
    ...CURATED_IDEOLOGY_LAYER_COMPLETIONS,
  }).reduce<Record<string, Partial<Record<Layer, string>>>>(
    (summaries, labelId) => {
      summaries[labelId] = {
        ...CURATED_IDEOLOGY_LAYER_SUMMARIES_BASE[labelId],
        ...CURATED_IDEOLOGY_LAYER_COMPLETIONS[labelId],
      };
      return summaries;
    },
    {},
  ),
);

function layerPhilosophies(label: IdeologyLabel, layer: Layer): string[] {
  if (layer === "normative") return label.normativePhilosophies ?? [];
  if (layer === "descriptive") return label.descriptivePhilosophies ?? [];
  return label.prescriptivePhilosophies ?? [];
}

/**
 * Explains how a single label is read in each layer without pretending its
 * one name is a complete description of the respondent's whole politics.
 */
export function getIdeologyLayerSummary(
  label: IdeologyLabel,
  axes: Axis[],
  layer: Layer,
): string {
  const curatedSummary = CURATED_IDEOLOGY_LAYER_SUMMARIES[label.id]?.[layer];
  if (curatedSummary)
    return `${LAYER_EXPLAINERS[layer].description} ${curatedSummary}`;

  const layerAxisIds = new Set(
    axes.filter((axis) => axis.layer === layer).map((axis) => axis.id),
  );
  const philosophyNames = layerPhilosophies(label, layer);
  const philosophyNameSet = new Set(philosophyNames);
  const relevantInfluences = (label.philosophyInfluences ?? [])
    .filter((influence) => philosophyNameSet.has(influence.philosophy))
    .filter((influence) =>
      influence.affectedAxes.some((axisId) => layerAxisIds.has(axisId)),
    )
    .map((influence) => influence.description.trim())
    .filter(
      (description, index, descriptions) =>
        descriptions.indexOf(description) === index,
    )
    .slice(0, 2);

  if (relevantInfluences.length > 0) {
    return `${LAYER_EXPLAINERS[layer].description} ${relevantInfluences.join(" ")}`;
  }

  if (philosophyNames.length > 0) {
    return `${LAYER_EXPLAINERS[layer].description} Related traditions include ${philosophyNames.slice(0, 3).join(", ")}. The catalog does not currently provide a more specific curated summary for this label in this layer.`;
  }

  return `${LAYER_EXPLAINERS[layer].description} The catalog does not currently provide a curated summary for this label in this layer.`;
}

export function getIdeologyTermDefinitions(
  label: IdeologyLabel,
  limit = 2,
): string[] {
  const directDefinitions = [
    ...(DIRECT_TERM_DEFINITIONS_BY_LABEL_ID[label.id] ?? []),
  ];
  if (DIRECT_ONLY_TERM_DEFINITION_LABEL_IDS.has(label.id))
    return directDefinitions.slice(0, limit);

  const identityText = [label.name, ...(label.aliases ?? [])].join(" ");
  const definitions: string[] = directDefinitions;

  for (const { pattern, definition } of IDEOLOGY_TERM_DEFINITIONS) {
    if (!pattern.test(identityText) || definitions.includes(definition))
      continue;
    definitions.push(definition);
    if (definitions.length >= limit) return definitions;
  }

  return definitions.slice(0, limit);
}
