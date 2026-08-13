import type {
  IdeologyLabel,
  IdeologyLabelSource,
  IdeologyLabelSourceScope,
  LabelId,
} from "../types";

import type { SourceDefinition } from "./labelSourceTypes";
import {
  EXPLICIT_SUPPORTS_BY_LABEL_ID,
  EXPLICIT_SUPPORTS_BY_SOURCE_ID_BY_LABEL_ID,
} from "./labelSourceSupportParts";
import { sourceCatalogPart01 } from "./labelSourceParts/sourceCatalogPart01";
import { sourceCatalogPart02 } from "./labelSourceParts/sourceCatalogPart02";

const SOURCE_CATALOG: Record<string, SourceDefinition> = {
  ...sourceCatalogPart01,
  ...sourceCatalogPart02,
};

const FAMILY_SOURCE_IDS: Record<string, readonly string[]> = {
  liberal: ["sep-liberalism", "sep-libertarianism"],
  socialist: ["sep-socialism", "iep-socialism"],
  "social-democratic": ["sep-socialism", "iep-socialism"],
  anarchist: ["sep-anarchism", "sep-libertarianism"],
  conservative: ["sep-conservatism"],
  nationalist: ["sep-nationalism"],
  republican: ["sep-republicanism", "sep-democracy"],
  democratic: ["sep-democracy", "sep-republicanism"],
  communitarian: ["sep-communitarianism", "sep-liberalism"],
  green: ["sep-environmental-ethics"],
  authoritarian: ["sep-nationalism"],
  populist: ["sep-democracy"],
  "anti-colonial": ["sep-nationalism"],
  regionalist: ["sep-nationalism"],
  technocratic: ["sep-democracy"],
  distributist: ["eui-christian-democracy", "modernist-journals-distributism"],
};

const EXPLICIT_SOURCE_IDS_BY_LABEL_ID: Partial<
  Record<LabelId, readonly string[]>
> = {
  "social-liberalism": ["cambridge-social-liberalism-positive-liberty"],
  distributism: ["cambridge-chesterton-distributism"],
  "welfare-chauvinism": ["oxford-welfare-chauvinism"],
  "anti-imperialism": ["cambridge-decolonization-self-determination"],
  regionalism: [
    "princeton-regionalism-regionalization",
    "oxford-regional-authority-preferences",
  ],
  "christian-democrat": [
    "eui-christian-democracy",
    "cambridge-christian-democracy-subsidiarity",
  ],
  "social-democrat": [
    "routledge-social-democracy",
    "oxford-ethics-social-democracy",
  ],
  "democratic-socialist": ["oxford-american-democratic-socialism"],
  communitarianism: ["sep-communitarianism"],
  "marxist-leninist": ["cambridge-marxism-leninism-discourse"],
  republicanism: ["sep-republicanism"],
  "libertarian-socialism": ["sep-anarchism"],
  "fascist-authoritarian": [
    "cambridge-fascist-palingenetic-ultranationalism",
    "wiley-doctrine-of-fascism",
    "ushmm-fascism",
  ],
  "civic-nationalist": ["cambridge-civic-patriotism"],
  corporatism: ["cambridge-corporatism"],
  kemalism: ["cambridge-kemalism"],
  "fiscal-conservatism": ["sage-fiscal-conservatism"],
  ethnonationalist: [
    "oxford-ethnonationalism",
    "cambridge-nationalism-demos-boundary",
  ],
  "islamic-democracy": [
    "cambridge-islamic-constitutionalism",
    "annualreviews-islamic-constitutionalism",
    "polity-islamic-democracy",
  ],
  "fourth-theory": [
    "dugin-fourth-political-theory-primary",
    "springer-fourth-political-theory",
  ],
  hindutva: ["oxford-hindutva", "cambridge-hindutva-markets"],
  zionism: [
    "cambridge-zionism",
    "cambridge-zionism-revisionism",
    "cambridge-zionism-labour",
  ],
  cyberocracy: ["rand-cyberocracy", "rand-cyberocracy-original"],
  accelerationism: [
    "tandf-accelerationism",
    "cambridge-accelerationism-spectrum",
    "oxford-reactionary-accelerationism",
  ],
  "right-wing-populism": [
    "cambridge-populist-zeitgeist",
    "cambridge-populist-people-elite",
  ],
  "left-wing-populism": [
    "cambridge-populist-zeitgeist",
    "cambridge-populist-people-elite",
  ],
  "national-conservatism": ["tandf-national-conservatism"],
  "liberal-conservatism": ["oxford-conservative-liberalism"],
  "social-conservatism": ["sage-social-conservatism"],
  theocrat: ["oxford-theocracy-secularism", "cambridge-theocracy-variants"],
  "eco-authoritarianism": ["cambridge-eco-authoritarianism"],
  internationalism: ["oxford-internationalism-political-ideology"],
  neoliberalism: ["oxford-neoliberalism-contested-uses"],
  progressivism: ["cambridge-progressivism-reform"],
  "expansionist-nationalism": ["cambridge-imperial-nationalism"],
  "separatist-nationalism": ["cambridge-substate-nationalism-variation"],
  conservative: ["sep-prudential-conservatism"],
  "green-politics": ["sep-green-political-ecology"],
  "social-anarchism": ["sep-social-communal-anarchism"],
  "market-right-libertarianism": ["sep-market-right-libertarianism"],
  "marxian-socialism": ["sep-marxian-socialism"],
  "technocratic-orientation": ["routledge-technocracy"],
  "black-nationalism": [
    "oxford-black-nationalism",
    "cambridge-black-nationalism-pan-africanism",
  ],
  "pan-africanism": [
    "oxford-pan-africanism",
    "cambridge-black-nationalism-pan-africanism",
  ],
  "technocratic-centralist": [
    "routledge-technocracy",
    "cambridge-technocracy-democracy-hybrids",
  ],
  "anarcho-communist": ["sep-anarchism", "cambridge-anarchist-communism"],
  minarchist: ["sep-libertarianism", "cambridge-libertarianism-state"],
  objectivism: ["sep-ayn-rand"],
  "world-federalism": ["sep-world-government"],
  bioregionalism: ["wiley-contemporary-bioregionalism"],
  geolibertarian: ["sep-libertarianism", "oxford-georgism-land-value-tax"],
  "market-socialist": ["cambridge-market-socialism"],
  "classical-liberalism": ["sep-liberalism"],
  ordoliberalism: ["cambridge-ordoliberalism"],
  multiculturalism: ["sep-multiculturalism"],
  "radical-democracy": ["sep-radical-democracy"],
  "one-nation-conservatism": ["wiley-one-nation-conservatism"],
  "democratic-confederalism": ["open-democratic-confederalism"],
  "liberal-feminism": [
    "sep-feminist-political-philosophy",
    "routledge-liberal-feminism",
  ],
  "left-wing-nationalism": ["oxford-anti-colonial-nationalism"],
  "agrarian-populism": [
    "oxford-agrarian-populism",
    "cambridge-populist-zeitgeist",
  ],
  "green-capitalism": ["cambridge-green-capitalism"],
  "anarcho-capitalist": ["cambridge-anarcho-capitalism-state"],
  mutualist: [
    "cambridge-mutualist-social-science",
    "sep-individualist-anarchism-boundary",
    "umich-jo-labadie-individualist-anarchism",
    "swartz-what-is-mutualism",
    "c4ss-laurance-labadie-archive",
    "carson-are-we-all-mutualists",
    "c4ss-what-is-c4ss",
    "c4ss-history-2006",
    "c4ss-carson-first-paid-staff",
  ],
  "anarcho-primitivism": ["sage-primitivism-political-philosophy"],
  syndicalist: ["cambridge-syndicalism-strikes"],
  "anarcho-syndicalism": ["cambridge-anarcho-syndicalism-history"],
  agorist: ["konkin-new-libertarian-manifesto"],
  "political-islam": ["oxford-political-islam"],
  integralism: [
    "cambridge-integralism-christian-nationalism",
    "oxford-catholic-integralism",
  ],
  juche: ["oxford-juche-history", "cambridge-north-korea-socialism-style"],
  "national-socialism": ["ushmm-national-socialism"],
  neoreactionary: ["sage-neoreactionary-dark-enlightenment"],
  "council-communist": ["cambridge-council-communism-workers-control"],
  "degrowth-green": ["oxford-degrowth-planning"],
  "deep-ecology": ["oxford-deep-ecology", "oxford-radical-environmentalism"],
  ecosocialist: ["oxford-radical-environmentalism"],
  "absolute-monarchist": ["cambridge-absolute-monarchy-theory"],
  maoism: ["cambridge-maoism-definition"],
  trotskyism: ["cambridge-trotskyism-historiography"],
  participism: ["erasmus-participatory-economics"],
  "individualist-anarchism": ["wiley-individualist-anarchism"],
  "constitutional-monarchism": ["cambridge-constitutional-monarchy"],
  dataism: ["cambridge-dataism-digital-politics"],
  "fundamentalist-theocracy": ["oxford-theocratic-secularism"],
  "liquid-democracy": ["oxford-liquid-democracy"],
  "radical-centrism": ["notre-dame-radical-center"],
  singularitarianism: ["scielo-singularitarianism"],
  "social-investment-state": ["cambridge-social-investment-state"],
  platformism: ["platformist-organisational-platform"],
  panarchism: ["routledge-panarchy"],
  transhumanism: ["oxford-transhumanist-imaginaries"],
  "universal-basic-income": ["oxford-basic-income"],
  neoconservative: ["oxford-neoconservatism"],
  ecomodernist: ["mit-ecomodernism-technology-politics"],
  "socialist-feminism": ["cambridge-socialist-feminism-history"],
  "christian-socialism": ["oxford-christian-socialism-history"],
  "guild-socialism": ["oxford-guild-socialism"],
  indigenism: ["oxford-indigenism-human-rights"],
  "libertarian-municipalism": ["res-publica-libertarian-municipalism"],
  georgism: ["oxford-georgism-land-value-tax"],
  paleoconservatism: ["cambridge-paleoconservatism-morphology"],
  "left-wing-market-anarchism": ["routledge-left-market-anarchism"],
  "traditional-monarchist": ["oxford-monarchism-authoritarian-politics"],
  paleolibertarianism: ["ucm-paleolibertarianism"],
  "eco-fascism": ["cambridge-ecofascism-illiberal-environmentalism"],
  "national-bolshevism": ["sciencedirect-red-brown-politics"],
  strasserism: ["sciencedirect-red-brown-politics"],
  "techno-anarchism": [
    "wiley-anarchism-politics-technology",
    "anarchist-studies-cryptoanarchist-governance",
  ],
  "utopian-socialism": ["cambridge-utopian-socialism-social-science"],
  voluntaryism: ["journal-libertarian-studies-voluntaryism"],
  stirnerism: ["cambridge-stirner-egoism"],
  "anarcha-feminism": ["cambridge-anarcho-feminism-history"],
  "bright-green-environmentalism": ["cambridge-bright-green-environmentalism"],
  "bleeding-heart-libertarianism": [
    "independent-rawls-bleeding-heart-libertarianism",
  ],
  "christian-reconstructionism": ["oxford-christian-reconstruction"],
  "queer-anarchism": ["sage-queer-theory-anarchism"],
  "religious-nationalism": ["oxford-religious-nationalism"],
  "civil-libertarian-cosmopolitan": ["oxford-political-cosmopolitanism"],
  "market-anarchism": [
    "sep-anarchism",
    "sep-libertarianism",
    "routledge-market-anarchism",
  ],
  "third-way": ["cambridge-third-way-social-democracy"],
  baathism: ["cambridge-baathism-arab-lefts"],
  "developmental-authoritarianism": ["cambridge-developmental-states"],
  "confucian-political-revival": ["sep-modern-confucianism"],
  "asian-values": ["cambridge-confucian-asian-values"],
  "market-liberal": ["oxford-market-liberalism"],
  nationalism: ["sep-nationalism"],
  populism: ["cambridge-populist-people-elite", "cambridge-populist-zeitgeist"],
  "civil-libertarianism": ["stanford-civil-liberty"],
  cosmopolitanism: ["oxford-political-cosmopolitanism"],
  "decentralist-orientation": [
    "oxford-regional-authority-preferences",
    "routledge-panarchy",
  ],
  "feminist-orientation": ["sep-feminist-political-philosophy"],
  "economic-nationalism": ["cambridge-economic-nationalism"],
  developmentalism: [
    "oxford-developmentalism",
    "cambridge-developmental-states",
  ],
  "pan-arabism": ["oxford-pan-arabism", "cambridge-panarab-ideology"],
  "arab-socialism": [
    "cambridge-arab-socialism",
    "cambridge-baathism-arab-lefts",
  ],
  "radical-feminism": ["sep-feminist-political-philosophy"],
  "black-feminism": ["annualreviews-black-feminism"],
  "queer-politics": ["uchicago-queer-liberation-politics"],
};

function sourceWithSupports(
  sourceId: string,
  supports: readonly IdeologyLabelSourceScope[],
): IdeologyLabelSource {
  const source = SOURCE_CATALOG[sourceId];
  if (!source) throw new Error(`Unknown ideology label source: ${sourceId}`);
  return { ...source, supports };
}

/**
 * Returns public interpretive sources for a label. Family baselines are used
 * for scored labels; narrow labels receive bespoke sources only where the
 * catalog has completed a dedicated source review.
 */
export function getIdeologyLabelSources(
  label: IdeologyLabel,
  includeFamilyBaseline = false,
): readonly IdeologyLabelSource[] {
  const explicitIds = EXPLICIT_SOURCE_IDS_BY_LABEL_ID[label.id] ?? [];
  const familyIds = includeFamilyBaseline
    ? (FAMILY_SOURCE_IDS[label.family] ?? [])
    : [];
  const sourceIds = Array.from(new Set([...familyIds, ...explicitIds]));
  const labelSourceScopes =
    EXPLICIT_SUPPORTS_BY_SOURCE_ID_BY_LABEL_ID[label.id] ?? {};
  const labelScopes = EXPLICIT_SUPPORTS_BY_LABEL_ID[label.id];
  const sourcesByUrl = new Map<string, IdeologyLabelSource>();

  for (const sourceId of sourceIds) {
    const source = sourceWithSupports(
      sourceId,
      labelSourceScopes[sourceId] ??
        (familyIds.includes(sourceId) && !explicitIds.includes(sourceId)
          ? ["definition", "boundary"]
          : labelScopes) ??
        (includeFamilyBaseline
          ? [
              "definition",
              "normative",
              "descriptive",
              "prescriptive",
              "boundary",
            ]
          : ["definition", "boundary"]),
    );
    const existing = sourcesByUrl.get(source.url);
    if (!existing) {
      sourcesByUrl.set(source.url, source);
      continue;
    }

    const explicitSource = explicitIds.includes(source.sourceId);
    const existingIsExplicit = explicitIds.includes(existing.sourceId);
    const preferred = explicitSource && !existingIsExplicit ? source : existing;
    sourcesByUrl.set(source.url, {
      ...preferred,
      supports: Array.from(new Set([...existing.supports, ...source.supports])),
    });
  }

  return Array.from(sourcesByUrl.values());
}

export function attachIdeologyLabelSources<T extends IdeologyLabel>(
  label: T,
  includeFamilyBaseline = false,
): T {
  const sources = getIdeologyLabelSources(label, includeFamilyBaseline);
  return (sources.length > 0 ? { ...label, sources } : label) as T;
}

export const ideologyLabelSourceCatalog = Object.freeze(
  Object.values(SOURCE_CATALOG).map((source) => Object.freeze({ ...source })),
);
