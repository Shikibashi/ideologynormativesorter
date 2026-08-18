import type { IdeologyLabel, LabelId } from "../types";
import { getCanonicalSpecialistModule } from "../specialist/canonicalAdapter";
import { attachIdeologyLabelSources } from "./labelSources";
import { labels } from "./labels";
import {
  ideologyScaleMetadataForLabel,
  IDEOLOGY_SCALE_VERSION,
  type IdeologyScaleMetadata,
} from "./ideologyScales";
import { modifierMeasurementForLabel } from "./modifierMeasurement";
import { attachPrimaryScoringScope } from "./primaryMeasurement";

function canonicalModuleId(moduleId: string): string {
  const module = getCanonicalSpecialistModule(moduleId);
  if (!module)
    throw new Error(`Unknown canonical specialist module: ${moduleId}`);
  return module.id;
}
const FEMINIST_MODULE_ID = canonicalModuleId("feminist-faction-module");
const IDENTITY_SOVEREIGNTY_MODULE_ID = canonicalModuleId(
  "identity-sovereignty-module",
);
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
export type LabelRole =
  | "primary"
  | "specialist"
  | "modifier"
  | "context"
  | "retired";

export type LabelMeasurementStatus =
  | "core-primary"
  | "modifier-scored"
  | "modifier-follow-up"
  | "modifier-catalog-only"
  | "validated-specialist"
  | "provisional-specialist"
  | "context-only"
  | "retired-alias";

export interface LabelTaxonomyMetadata {
  role: LabelRole;
  measurementStatus: LabelMeasurementStatus;
  parentId?: LabelId;
  aliasOf?: LabelId;
  /** How a retired ID remains interpretable without returning to scoring. */
  legacyDisposition?: LegacyLabelDisposition;
  /** Deterministic active components for a retired synthetic profile, when safe. */
  legacyComponents?: readonly LabelId[];
  relations: readonly LabelRelation[];
  rationale: string;
  /** Common analytical scales; this is not an additional scoring role. */
  analyticalScale: IdeologyScaleMetadata;
  analyticalScaleVersion: string;
}

export type LegacyLabelDisposition = "alias" | "split" | "keep-retired";

export interface LegacyLabelDispositionMetadata {
  disposition: LegacyLabelDisposition;
  /** Only use components when the old profile maps deterministically. */
  components?: readonly LabelId[];
  rationale: string;
}

export type LabelRelationType =
  | "subtype_of"
  | "hybrid_of"
  | "requires"
  | "overlaps_with"
  | "often_combines_with"
  | "contrasts_with"
  | "historical_predecessor_of"
  | "influenced_by"
  | "institutionalizes"
  | "alias_of"
  | "regional_variant_of"
  | "context_for"
  | "incompatible_with_core";

export interface LabelRelation {
  type: LabelRelationType;
  labelId: LabelId;
  note?: string;
}

export type CatalogLabel = IdeologyLabel & { taxonomy: LabelTaxonomyMetadata };

export const TAXONOMY_VERSION = "2026-08-taxonomy-v13";

export const PRIMARY_LABEL_IDS = [
  "conservative",
  "christian-democrat",
  "classical-liberalism",
  "democratic-socialist",
  "green-politics",
  "liberal-conservatism",
  "libertarian-socialism",
  "market-liberal",
  "market-right-libertarianism",
  "marxian-socialism",
  "marxist-leninist",
  "national-conservatism",
  "radical-democracy",
  "republicanism",
  "social-democrat",
  "social-liberalism",
] as const satisfies readonly LabelId[];

export const SPECIALIST_LABEL_IDS = [
  "absolute-monarchist",
  "agorist",
  "agrarian-populism",
  "anarcho-capitalist",
  "anarcho-communist",
  "anarcha-feminism",
  "anarcho-primitivism",
  "anarcho-syndicalism",
  "bioregionalism",
  "bleeding-heart-libertarianism",
  "black-nationalism",
  "christian-reconstructionism",
  "christian-socialism",
  "council-communist",
  "democratic-confederalism",
  "deep-ecology",
  "degrowth-green",
  "eco-fascism",
  "eco-authoritarianism",
  "ecomodernist",
  "ecosocialist",
  "fascist-authoritarian",
  "georgism",
  "geolibertarian",
  "green-capitalism",
  "guild-socialism",
  "hindutva",
  "indigenism",
  "individualist-anarchism",
  "integralism",
  "islamic-democracy",
  "juche",
  "kemalism",
  "left-wing-market-anarchism",
  "market-anarchism",
  "liberal-feminism",
  "libertarian-municipalism",
  "market-socialist",
  "maoism",
  "minarchist",
  "mutualist",
  "national-bolshevism",
  "national-socialism",
  "neoconservative",
  "neoreactionary",
  "objectivism",
  "one-nation-conservatism",
  "ordoliberalism",
  "paleoconservatism",
  "paleolibertarianism",
  "pan-africanism",
  "participism",
  "political-islam",
  "stirnerism",
  "strasserism",
  "socialist-feminism",
  "syndicalist",
  "traditional-monarchist",
  "trotskyism",
  "voluntaryism",
  "zionism",
  "third-way",
  "distributism",
  "neoliberalism",
  "social-anarchism",
  "developmentalism",
  "pan-arabism",
  "arab-socialism",
  "radical-feminism",
  "religious-nationalism",
  "black-feminism",
  "queer-politics",
  "confucian-political-revival",
  "techno-anarchism",
  "technocratic-centralist",
  "theocrat",
  "queer-anarchism",
  "welfare-chauvinism",
] as const satisfies readonly LabelId[];

export const MODIFIER_LABEL_IDS = [
  "anti-imperialism",
  "civic-nationalist",
  "communitarianism",
  "cosmopolitanism",
  "civil-libertarianism",
  "decentralist-orientation",
  "economic-nationalism",
  "ethnonationalist",
  "expansionist-nationalism",
  "fiscal-conservatism",
  "internationalism",
  "feminist-orientation",
  "left-wing-nationalism",
  "left-wing-populism",
  "multiculturalism",
  "regionalism",
  "right-wing-populism",
  "separatist-nationalism",
  "progressivism",
  "social-conservatism",
  "technocratic-orientation",
  "nationalism",
  "populism",
  "transhumanism",
] as const satisfies readonly LabelId[];

export const CONTEXT_LABEL_IDS = [
  "accelerationism",
  "asian-values",
  "baathism",
  "constitutional-monarchism",
  "corporatism",
  "cyberocracy",
  "dataism",
  "developmental-authoritarianism",
  "fourth-theory",
  "fundamentalist-theocracy",
  "liquid-democracy",
  "radical-centrism",
  "singularitarianism",
  "social-investment-state",
  "platformism",
  "panarchism",
  "universal-basic-income",
  "utopian-socialism",
  "world-federalism",
] as const satisfies readonly LabelId[];

export const RETIRED_LABEL_IDS = [
  "conservative-liberalism",
  "cultural-populism",
  "bright-green-environmentalism",
  "civil-libertarian-cosmopolitan",
  "decentralist-market-skeptic-of-state",
  "egalitarian-statist",
  "national-traditionalist",
  "revolutionary-collectivist",
] as const satisfies readonly LabelId[];

export const LABEL_IDS_BY_ROLE = {
  primary: PRIMARY_LABEL_IDS,
  specialist: SPECIALIST_LABEL_IDS,
  modifier: MODIFIER_LABEL_IDS,
  context: CONTEXT_LABEL_IDS,
  retired: RETIRED_LABEL_IDS,
} as const;

export const labelRoleById = new Map<LabelId, LabelRole>(
  (
    Object.entries(LABEL_IDS_BY_ROLE) as Array<[LabelRole, readonly LabelId[]]>
  ).flatMap(([role, ids]) => ids.map((id) => [id, role] as const)),
);

const LABEL_ALIASES: Readonly<Record<string, LabelId>> = {
  "conservative-liberalism": "liberal-conservatism",
  "bright-green-environmentalism": "ecomodernist",
};

/** Legacy compounds are expanded into independently interpretable components during analysis. */
export const LEGACY_LABEL_COMPOSITIONS: Readonly<
  Record<string, readonly LabelId[]>
> = {
  "civil-libertarian-cosmopolitan": ["civil-libertarianism", "cosmopolitanism"],
  "decentralist-market-skeptic-of-state": [
    "market-liberal",
    "decentralist-orientation",
  ],
  "national-traditionalist": ["national-conservatism", "social-conservatism"],
};

/**
 * A complete disposition ledger prevents historical synthetic labels from
 * silently re-entering scoring or being forced into a false one-to-one alias.
 * A missing component list is intentional: those labels retain their raw
 * historical meaning because no deterministic decomposition is defensible.
 */
export const LEGACY_LABEL_DISPOSITIONS = {
  "conservative-liberalism": {
    disposition: "alias",
    components: ["liberal-conservatism"],
    rationale:
      "The two public names are semantic mirrors in this catalog, so the older ID resolves to the single canonical combined entry.",
  },
  "bright-green-environmentalism": {
    disposition: "alias",
    components: ["ecomodernist"],
    rationale:
      "The former public wording is retained as a historical name for the canonical Ecomodernist entry.",
  },
  "civil-libertarian-cosmopolitan": {
    disposition: "split",
    components: ["civil-libertarianism", "cosmopolitanism"],
    rationale:
      "Civil-libertarian and cosmopolitan commitments can vary independently, so the former conjunction expands into two modifiers.",
  },
  "decentralist-market-skeptic-of-state": {
    disposition: "split",
    components: ["market-liberal", "decentralist-orientation"],
    rationale:
      "The former profile combined a market-oriented family with a separable institutional preference for decentralization.",
  },
  "national-traditionalist": {
    disposition: "split",
    components: ["national-conservatism", "social-conservatism"],
    rationale:
      "The former profile joined national-conservative and social-conservative commitments; religious-national commitments remain contingent rather than assumed.",
  },
  "cultural-populism": {
    disposition: "keep-retired",
    rationale:
      "Its cultural content can be conservative, progressive, multicultural, nationalist, or otherwise; no fixed active component set preserves that historical ambiguity.",
  },
  "egalitarian-statist": {
    disposition: "keep-retired",
    rationale:
      "The synthetic combination of egalitarian outcomes and state capacity does not map deterministically onto one active political family or technocratic orientation.",
  },
  "revolutionary-collectivist": {
    disposition: "keep-retired",
    rationale:
      "Revolutionary strategy and collectivist ownership appear across distinct socialist traditions; collapsing the legacy profile into one would create a false historical identity.",
  },
} as const satisfies Readonly<
  Record<(typeof RETIRED_LABEL_IDS)[number], LegacyLabelDispositionMetadata>
>;

const ROLE_RATIONALES: Readonly<Partial<Record<LabelId, string>>> = {
  conservative:
    "Broad family anchor for prudence and institutional continuity; subtype claims require a specialist or modifier.",
  "green-politics":
    "Broad ecological family anchor; growth, technology, political economy, and strategy are independent dimensions.",
  "social-anarchism":
    "Broad anti-authoritarian neighborhood; economic and organizational variants require a specialist module.",
  "market-right-libertarianism":
    "Broad right-libertarian family anchor; market anarchism, mutualism, and anarcho-capitalism remain distinct anarchist or contested specialist traditions.",
  "market-liberal":
    "Broad contemporary pro-market liberal family anchor; it accepts an enabling state and limited safety net and is distinct from both neoliberalism and right-libertarianism.",
  mutualist:
    "Plural anarchist tradition with Proudhonian, American individualist, and later revivalist interpretations; Proudhon influenced part of the Tuckerite field, while reciprocal exchange and federation overlap with social and market anarchisms without making it a required subtype of either.",
  "marxian-socialism":
    "Broad non-Leninist Marxian family anchor; party-state and strategy distinctions remain specialist variants.",
  progressivism:
    "Cross-cutting reform and social-improvement orientation rather than a single complete ideology.",
  "social-conservatism":
    "Cross-cutting moral and family-order orientation rather than a complete conservative family.",
  "technocratic-orientation":
    "Cross-cutting confidence in expertise and administration, independent from centralization and democratic authority.",
  neoconservative:
    "Historically specific modern U.S. specialist current, not a generic conservative primary.",
  "market-socialist":
    "Economic-system variant requiring explicit measurement of ownership and coordination mechanisms.",
  georgism:
    "Property-regime and land-rent doctrine requiring specialist measurement rather than a complete primary family.",
  ethnonationalist:
    "Cross-cutting account of national membership and political boundary; it can combine with multiple broader ideologies and is measured through the identity-sovereignty layer rather than treated as a complete primary program.",
  "market-anarchism":
    "Anarchist market-order family anchor; property, reciprocity, counter-economics, and capitalist versus non-capitalist variants require specialist discrimination.",
  "third-way":
    "Historically bounded social-democratic modernization current retained for browsing and future depth measurement rather than ordinary primary scoring.",
  baathism:
    "Historically consequential Arab-nationalist and socialist synthesis retained as a provisional regional specialist; doctrine and later party-state practice must remain distinct.",
  "developmental-authoritarianism":
    "State-led developmental and authoritarian synthesis retained as a provisional specialist; developmentalism also appears in democratic and non-authoritarian forms.",
  "civil-libertarian-cosmopolitan":
    "Cross-cutting combination of strong civil liberties and universalist or transnational concern; it does not determine property, welfare, or world-government preferences.",
  "technocratic-centralist":
    "Narrow compound profile requiring both expert-centered authority and centralized administration; neither evidence-informed policy nor administrative capacity alone establishes it.",
  "fascist-authoritarian":
    "Historically specific palingenetic-ultranationalist project retained as a provisional specialist because the core bank does not directly measure national-rebirth myth or fascist mobilization.",
  "welfare-chauvinism":
    "Access-boundary position retained as a provisional specialist because generic nationalism and redistribution axes do not directly measure exclusion from welfare or social services.",
  "religious-nationalism":
    "Cross-cutting fusion of religious and national identity retained for the construct-matched opt-in module; generic religiosity and nationalism alone are insufficient.",
  theocrat:
    "Political-order specialist retained for the construct-matched opt-in module because the core bank cannot establish final religious legal authority from broad religiosity, social traditionalism, or religious public participation.",
  "eco-authoritarianism":
    "Ecological-authority synthesis retained as a provisional specialist because the core bank does not directly measure willingness to override democratic or rights constraints specifically for ecological enforcement.",
  "conservative-liberalism":
    "Compatibility alias for the canonical combined Liberal Conservatism / Conservative Liberalism entry.",
  "fourth-theory":
    "Intellectual project and self-description, not an ordinary broad ideology scoring endpoint.",
  nationalism:
    "Base national-orientation modifier; membership rules, territorial projects, and host ideology are measured separately.",
  populism:
    "Thin people-versus-elite and popular-sovereignty modifier; substantive left/right content comes from host ideology and other modifiers.",
  "civil-libertarianism":
    "Cross-cutting rights orientation concerning speech, privacy, association, due process, protest, religion, and bodily autonomy, independent of economic ideology.",
  cosmopolitanism:
    "Cross-cutting orientation toward equal moral concern across borders; it is distinct from international cooperation and world federalism.",
  "decentralist-orientation":
    "Cross-cutting preference for local, federal, municipal, polycentric, or voluntary institutions over concentrated territorial authority.",
  "feminist-orientation":
    "Cross-cutting concern with gendered power, exclusion, care, reproduction, violence, labor, or representation without selecting one feminist school.",
  "economic-nationalism":
    "Cross-cutting preference for national productive capacity, strategic autonomy, domestic industry, managed trade, or control of key assets.",
  transhumanism:
    "Cross-cutting orientation toward deliberate technological enhancement; it leaves economic, democratic, and distributive commitments open.",
  "confucian-political-revival":
    "Modern Confucian political family with democratic, constitutional, perfectionist, and meritocratic branches; it is not synonymous with Asian Values or authoritarianism.",
};

const PARENT_BY_ID: Readonly<Partial<Record<LabelId, LabelId>>> = {
  "anarcho-communist": "social-anarchism",
  // Anti-civilization politics is an anarchist current, but not a required
  // subtype of the social/communal branch.
  "anarcho-syndicalism": "social-anarchism",
  "social-anarchism": "libertarian-socialism",
  "deep-ecology": "green-politics",
  "degrowth-green": "green-politics",
  ecomodernist: "green-politics",
  ecosocialist: "green-politics",
  minarchist: "market-right-libertarianism",
  neoconservative: "conservative",
};

const RELATIONS_BY_ID: Readonly<
  Partial<Record<LabelId, readonly LabelRelation[]>>
> = {
  "social-anarchism": [
    { type: "subtype_of", labelId: "libertarian-socialism" },
    {
      type: "contrasts_with",
      labelId: "marxist-leninist",
      note: "Both may seek social ownership, but they diverge over party-state authority and centralized transition.",
    },
  ],
  "market-anarchism": [
    { type: "overlaps_with", labelId: "mutualist" },
    {
      type: "overlaps_with",
      labelId: "anarcho-capitalist",
      note: "Both reject the state and value non-state market coordination, but anarcho-capitalism makes strong private-property commitments that market anarchism as a family does not settle.",
    },
    { type: "often_combines_with", labelId: "individualist-anarchism" },
    { type: "contrasts_with", labelId: "anarcho-communist" },
  ],
  mutualist: [
    {
      type: "overlaps_with",
      labelId: "individualist-anarchism",
      note: "Proudhon influenced portions of the Tuckerite American individualist-anarchist field, including Joseph (Jo) and Laurance Labadie. That field also includes natural-rights and egoist currents, so the relation is neither identity nor two exhaustive mutualist camps.",
    },
    {
      type: "overlaps_with",
      labelId: "social-anarchism",
      note: "Mutualist federation and anti-domination can overlap with social or communal anarchism, but mutualism does not inherit that branch’s full economic program.",
    },
    {
      type: "overlaps_with",
      labelId: "market-anarchism",
      note: "Mutualist and market-anarchist currents can share anti-statism and exchange, while differing over property, exploitation, rent, and the meaning of a freed market.",
    },
    {
      type: "often_combines_with",
      labelId: "left-wing-market-anarchism",
      note: "Some contemporary writers connect mutualist anti-privilege arguments to left-wing market anarchism, but neither label is a subtype of the other.",
    },
  ],
  "individualist-anarchism": [
    {
      type: "influenced_by",
      labelId: "mutualist",
      note: "Proudhonian mutualism influenced portions of the Tuckerite American individualist tradition, including figures linked to Joseph (Jo) and Laurance Labadie; later revivalist work is not treated as a historical parent, and the broader individualist field is not reducible to mutualism.",
    },
  ],
  "anarcho-capitalist": [
    {
      type: "overlaps_with",
      labelId: "market-anarchism",
      note: "A contested market-anarchist relative: it shares anti-statism and market coordination but adds a distinctive private-property account.",
    },
    {
      type: "overlaps_with",
      labelId: "market-right-libertarianism",
      note: "Shares the right-libertarian property and contract tradition, while rejecting the minimal state that some right-libertarians retain.",
    },
  ],
  "market-right-libertarianism": [
    {
      type: "overlaps_with",
      labelId: "anarcho-capitalist",
      note: "Anarcho-capitalism is a stateless right-libertarian variant, but the broad family also includes minimal-state positions.",
    },
  ],
  georgism: [
    { type: "overlaps_with", labelId: "market-liberal" },
    { type: "overlaps_with", labelId: "social-liberalism" },
    { type: "overlaps_with", labelId: "market-right-libertarianism" },
  ],
  "market-socialist": [
    { type: "overlaps_with", labelId: "democratic-socialist" },
    {
      type: "contrasts_with",
      labelId: "marxist-leninist",
      note: "Market socialism does not by itself specify a Leninist party-state.",
    },
  ],
  "marxian-socialism": [
    {
      type: "contrasts_with",
      labelId: "marxist-leninist",
      note: "The non-Leninist anchor shares Marxian analysis but does not make vanguard-party organization or centralized transitional state power a defining commitment.",
    },
  ],
  "marxist-leninist": [
    {
      type: "contrasts_with",
      labelId: "marxian-socialism",
      note: "Marxism-Leninism combines Marxian analysis with a distinctive theory of revolutionary party organization and state power; it is not a subtype of the non-Leninist anchor.",
    },
  ],
  "black-nationalism": [
    { type: "overlaps_with", labelId: "pan-africanism" },
    { type: "often_combines_with", labelId: "nationalism" },
  ],
  "pan-africanism": [
    { type: "often_combines_with", labelId: "internationalism" },
    { type: "overlaps_with", labelId: "black-nationalism" },
  ],
  ecosocialist: [
    { type: "hybrid_of", labelId: "green-politics" },
    { type: "hybrid_of", labelId: "democratic-socialist" },
  ],
  "welfare-chauvinism": [
    { type: "requires", labelId: "nationalism" },
    { type: "requires", labelId: "social-democrat" },
  ],
  geolibertarian: [
    { type: "hybrid_of", labelId: "georgism" },
    { type: "hybrid_of", labelId: "market-right-libertarianism" },
  ],
  "developmental-authoritarianism": [
    { type: "hybrid_of", labelId: "developmentalism" },
    { type: "requires", labelId: "technocratic-orientation" },
    {
      type: "incompatible_with_core",
      labelId: "radical-democracy",
      note: "This is a derived context profile, not a standalone ideology.",
    },
  ],
  "technocratic-centralist": [
    {
      type: "requires",
      labelId: "technocratic-orientation",
      note: "Technocratic centralism adds concentrated administrative authority to a broader confidence in expert governance; expert advice alone is insufficient.",
    },
  ],
  baathism: [
    { type: "regional_variant_of", labelId: "arab-socialism" },
    { type: "regional_variant_of", labelId: "pan-arabism" },
  ],
  "confucian-political-revival": [
    { type: "context_for", labelId: "asian-values" },
    { type: "overlaps_with", labelId: "communitarianism" },
  ],
  "bright-green-environmentalism": [
    { type: "alias_of", labelId: "ecomodernist" },
  ],
  "civil-libertarian-cosmopolitan": [
    { type: "alias_of", labelId: "civil-libertarianism" },
    { type: "alias_of", labelId: "cosmopolitanism" },
  ],
};

function measurementStatusForRole(
  labelId: LabelId,
  role: LabelRole,
): LabelMeasurementStatus {
  if (role === "primary") return "core-primary";
  if (role === "modifier") {
    const measurement = modifierMeasurementForLabel(labelId);
    if (!measurement) {
      throw new Error(
        `Modifier ${labelId} is missing a direct-measurement disposition`,
      );
    }
    if (measurement.availability === "core-construct") return "modifier-scored";
    if (measurement.availability === "focused-follow-up")
      return "modifier-follow-up";
    return "modifier-catalog-only";
  }
  if (role === "context") return "context-only";
  if (role === "retired") return "retired-alias";
  return "provisional-specialist";
}

export const labelTaxonomyById = new Map<LabelId, LabelTaxonomyMetadata>(
  [...labelRoleById.entries()].map(([labelId, role]) => {
    const legacy = LEGACY_LABEL_DISPOSITIONS[
      labelId as keyof typeof LEGACY_LABEL_DISPOSITIONS
    ] as LegacyLabelDispositionMetadata | undefined;

    return [
      labelId,
      {
        role,
        measurementStatus: measurementStatusForRole(labelId, role),
        parentId: PARENT_BY_ID[labelId],
        aliasOf: LABEL_ALIASES[labelId],
        legacyDisposition: legacy?.disposition,
        legacyComponents: legacy?.components,
        relations: RELATIONS_BY_ID[labelId] ?? [],
        analyticalScale: ideologyScaleMetadataForLabel(labelId, role),
        analyticalScaleVersion: IDEOLOGY_SCALE_VERSION,
        rationale:
          ROLE_RATIONALES[labelId] ??
          (role === "specialist"
            ? "Narrow tradition retained for browsing and future construct-matched depth measurement."
            : role === "context"
              ? "Institutional form, strategy, mechanism, or intellectual context; not a complete ideology score."
              : role === "modifier"
                ? "Cross-cutting orientation that can coexist with multiple primary families."
                : role === "retired"
                  ? "Historical or compatibility entry retained outside the public catalog."
                  : "Broad political family retained as a primary scoring anchor."),
      },
    ] as const;
  }),
);

export function roleForLabel(labelId: LabelId): LabelRole | undefined {
  return labelRoleById.get(labelId);
}

export function canonicalLabelId(labelId: LabelId): LabelId {
  return LABEL_ALIASES[labelId] ?? labelId;
}

/** Expand historical IDs into the active canonical components used by analysis. */
export function normalizeHistoricalLabelIds(
  labelIds: readonly LabelId[],
): LabelId[] {
  return [
    ...new Set(
      labelIds.flatMap((labelId) => {
        const canonical = canonicalLabelId(labelId);
        return LEGACY_LABEL_COMPOSITIONS[canonical] ?? [canonical];
      }),
    ),
  ];
}

export function taxonomyForLabel(
  labelId: LabelId,
): LabelTaxonomyMetadata | undefined {
  return labelTaxonomyById.get(labelId);
}

const CANONICAL_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  "fascist-authoritarian": "Fascism",
  "liberal-conservatism": "Liberal Conservatism / Conservative Liberalism",
  neoliberalism: "Neoliberalism / Market-Governance Liberalism",
  "market-right-libertarianism": "Right-Libertarianism",
  "technocratic-centralist": "Technocratic Centralism",
  "confucian-political-revival": "Political Confucianism",
  "asian-values": "Asian Values Discourse",
  transhumanism: "Transhumanist Orientation",
  corporatism: "State Corporatism",
  "utopian-socialism": "Early / Utopian Socialism",
  "developmental-authoritarianism":
    "Developmental Authoritarianism (Derived Context)",
  baathism: "Baʿthism (Arab Socialist Subtype)",
  "fourth-theory": "Dugin's Fourth Political Theory",
};

function canonicalizeLabel(label: IdeologyLabel): CatalogLabel {
  const name = CANONICAL_NAME_OVERRIDES[label.id];
  const taxonomy = labelTaxonomyById.get(label.id);
  if (!taxonomy) throw new Error(`Missing taxonomy metadata for ${label.id}`);
  return { ...(name ? { ...label, name } : label), taxonomy };
}

/** Labels eligible to be returned directly by the ordinary questionnaire. */
export const primaryScoringLabels = labels
  .filter((label) => roleForLabel(label.id) === "primary")
  .map(canonicalizeLabel)
  .map(attachPrimaryScoringScope)
  .map((label) => attachIdeologyLabelSources(label, true));

/** Labels worth browsing as political traditions or meaningful cross-cutting descriptors. */
export const publicCatalogLabels = labels
  .filter((label) => {
    const role = roleForLabel(label.id);
    return (
      role === "primary" ||
      role === "specialist" ||
      role === "modifier" ||
      role === "context"
    );
  })
  .map(canonicalizeLabel)
  .map((label) =>
    roleForLabel(label.id) === "primary"
      ? attachPrimaryScoringScope(label)
      : label,
  )
  .map((label) =>
    attachIdeologyLabelSources(
      label,
      roleForLabel(label.id) === "primary" ||
        roleForLabel(label.id) === "modifier",
    ),
  );

/** Criterion labels offered before results in research mode. */
export const researchIdentityLabels = [...primaryScoringLabels];

/** Labels measured independently from the primary family result. */
export const modifierScoringLabels = labels
  .filter(
    (label) =>
      labelTaxonomyById.get(label.id)?.measurementStatus === "modifier-scored",
  )
  .map(canonicalizeLabel)
  .map((label) => attachIdeologyLabelSources(label, true) as CatalogLabel);

/**
 * A specialist must be paired with a real, construct-matched depth module
 * before it can be promoted from a nearby subtype to a scored specialist result.
 */
export const specialistModuleByLabel: Readonly<
  Partial<Record<LabelId, string>>
> = {
  "anarcha-feminism": FEMINIST_MODULE_ID,
  "liberal-feminism": FEMINIST_MODULE_ID,
  "socialist-feminism": FEMINIST_MODULE_ID,
  indigenism: IDENTITY_SOVEREIGNTY_MODULE_ID,
  "black-nationalism": IDENTITY_SOVEREIGNTY_MODULE_ID,
  "pan-africanism": IDENTITY_SOVEREIGNTY_MODULE_ID,
  "anarcho-capitalist": "anarchist-families-module",
  "anarcho-communist": "anarchist-families-module",
  "social-anarchism": "anarchist-families-module",
  "individualist-anarchism": "anarchist-families-module",
  "anarcho-syndicalism": "anarchist-families-module",
  "market-anarchism": "anarchist-families-module",
  mutualist: "anarchist-families-module",
  minarchist: "anarchist-families-module",
  "deep-ecology": "green-morphology-module",
  "degrowth-green": "green-morphology-module",
  ecomodernist: "green-morphology-module",
  ecosocialist: "green-morphology-module",
  "green-capitalism": "green-morphology-module",
  "market-socialist": "socialist-families-module",
  "guild-socialism": "socialist-families-module",
  "council-communist": "socialist-families-module",
  syndicalist: "socialist-families-module",
  maoism: "socialist-families-module",
  trotskyism: "socialist-families-module",
  neoconservative: "conservative-variants-module",
  "one-nation-conservatism": "conservative-variants-module",
  "islamic-democracy": "religious-national-politics-module",
  "political-islam": "religious-national-politics-module",
  hindutva: "religious-national-politics-module",
  zionism: "religious-national-politics-module",
  "religious-nationalism": "religious-national-politics-module",
  theocrat: "religious-national-politics-module",
  "techno-anarchism": "technology-governance-module",
  "technocratic-centralist": "technology-governance-module",
  "absolute-monarchist": "monarchist-municipal-module",
  "traditional-monarchist": "monarchist-municipal-module",
  "libertarian-municipalism": "monarchist-municipal-module",
  "democratic-confederalism": "monarchist-municipal-module",
};

/** Specialist labels awaiting a respondent-facing, construct-matched depth module. */
export const PROVISIONAL_SPECIALIST_LABEL_IDS: readonly LabelId[] =
  SPECIALIST_LABEL_IDS.filter(
    (labelId) => specialistModuleByLabel[labelId] === undefined,
  );
