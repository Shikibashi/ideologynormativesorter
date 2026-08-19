/**
 * UI-facing projections of the canonical manifest.
 *
 * Components and app state consume these selectors rather than importing the
 * documentary data tree. The projections deliberately retain the existing
 * Question, Axis, Domain, and IdeologyLabel shapes so scoring and presentation
 * code can remain stable while the canonical manifest owns the values.
 */
import type {
  Axis,
  Domain,
  IdeologyLabel,
  IdeologyScaleMetadata,
  LabelMeasurementStatus,
  LabelRole,
  LabelTaxonomyMetadata,
  Question,
  StatementOption,
  QuizTier,
} from "../types";
import type { AxisId, Layer, ResponseType } from "../types/common";
import {
  CANONICAL_MANIFEST,
  type CanonicalConstruct,
  type CanonicalItem,
  type IdeologyNode,
} from "./canonicalManifest";
import {
  CANONICAL_PRESENTATION_VERSION,
  CANONICAL_QUESTION_PRESENTATION,
} from "./canonicalPresentation";
export type {
  LabelMeasurementStatus,
  LabelRole,
  LabelTaxonomyMetadata,
} from "../types/label";
export { CANONICAL_MANIFEST };

export const TAXONOMY_VERSION = "2026-08-taxonomy-v13";
export const IDEOLOGY_SCALE_VERSION = "2026-08-analytical-scale-v2";

function freeze<T extends object>(value: T): T {
  return Object.freeze(value);
}

function freezeArray<T>(values: T[]): T[] {
  return Object.freeze(values) as unknown as T[];
}

function humanize(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const DOMAIN_METADATA: Readonly<Record<string, Domain>> = {
  "state-legitimacy": {
    id: "state-legitimacy",
    name: "State Legitimacy",
    description:
      "Whether and why a central authority may rightfully hold a monopoly on law, taxation, and force.",
  },
  "property-ownership": {
    id: "property-ownership",
    name: "Property and Ownership",
    description:
      "What kinds of claims over productive assets and resources are legitimate, and who may hold them.",
  },
  "markets-planning": {
    id: "markets-planning",
    name: "Markets and Planning",
    description:
      "How production and exchange should be coordinated, and how well markets versus planning actually work.",
  },
  "redistribution-welfare": {
    id: "redistribution-welfare",
    name: "Redistribution and Welfare",
    description:
      "Obligations to redistribute resources and provide for material need, and how to do so under real constraints.",
  },
  "labor-unions-workplace": {
    id: "labor-unions-workplace",
    name: "Labor, Unions, and Workplace Governance",
    description:
      "Rights and power relations between workers, employers, and organized labor.",
  },
  "land-housing-georgism": {
    id: "land-housing-georgism",
    name: "Land, Housing, Zoning, and Georgism",
    description:
      "Claims over land and housing, the institutions that regulate building and rent, and proposals to tax land value rather than improvements.",
  },
  "money-banking": {
    id: "money-banking",
    name: "Money, Banking, and Central Banking",
    description:
      "Who should control the issuance of money and the institutions that manage banking and monetary policy.",
  },
  "intellectual-property-information": {
    id: "intellectual-property-information",
    name: "Intellectual Property and Information",
    description:
      "Whether ideas and information should be ownable, and how innovation and creative work are actually produced.",
  },
  "civil-liberties-speech": {
    id: "civil-liberties-speech",
    name: "Civil Liberties and Speech",
    description:
      "Protections for expression, conscience, privacy, association, and fair legal process, including when public safety or other collective goals are invoked.",
  },
  "crime-policing-justice": {
    id: "crime-policing-justice",
    name: "Crime, Policing, Prisons, and Justice",
    description:
      "How rule-breaking should be deterred, punished, and remedied, and who should hold the power to do so.",
  },
  "immigration-borders": {
    id: "immigration-borders",
    name: "Immigration and Borders",
    description:
      "Who may rightfully control movement across borders, and what that control actually achieves.",
  },
  "national-identity-sovereignty": {
    id: "national-identity-sovereignty",
    name: "National Identity and Sovereignty",
    description:
      "What binds a political community together, and how far national self-determination should constrain outside involvement.",
  },
  "religion-secularism": {
    id: "religion-secularism",
    name: "Religion and Secularism",
    description:
      "The proper relationship between religious belief or institutions and the apparatus of the state.",
  },
  "family-gender-feminism": {
    id: "family-gender-feminism",
    name: "Family, Gender, Sex, and Feminism",
    description:
      "How family structure, gender roles, and sex-based inequality should be understood and addressed.",
  },
  "race-ethnicity-multiculturalism": {
    id: "race-ethnicity-multiculturalism",
    name: "Race, Ethnicity, Multiculturalism, and Assimilation",
    description:
      "Equal citizenship, racial and ethnic inequality, cultural pluralism, assimilation, and remedies for historical exclusion.",
  },
  "environment-climate-growth": {
    id: "environment-climate-growth",
    name: "Environment, Climate, Growth, and Nuclear Power",
    description:
      "How to weigh economic growth against ecological limits, and what tools and tradeoffs that weighing implies.",
  },
  "foreign-policy-war": {
    id: "foreign-policy-war",
    name: "Foreign Policy, War, and Intervention",
    description:
      "When, if ever, a state should use or threaten force beyond its own borders, and what role it should play in the affairs of others.",
  },
  "democracy-expertise-constitutionalism": {
    id: "democracy-expertise-constitutionalism",
    name: "Democracy, Expertise, and Constitutionalism",
    description:
      "How voting, expertise, courts, and constitutional limits should share authority in collective decisions.",
  },
  "technology-ai-surveillance": {
    id: "technology-ai-surveillance",
    name: "Technology, AI, and Surveillance",
    description:
      "How new technological capability should be governed, and what risks and opportunities it poses to liberty and welfare.",
  },
  "strategy-change": {
    id: "strategy-change",
    name: "Strategy: Reform, Revolution, and Direct Action",
    description:
      "How political change is actually best pursued, independent of what change is being pursued.",
  },
};

function axisProjection(construct: CanonicalConstruct): Axis {
  return freeze({
    id: construct.id,
    layer: construct.layer ?? "normative",
    name: construct.name,
    negativePole: construct.negativePole ?? "",
    positivePole: construct.positivePole ?? "",
    description: construct.description ?? "",
  });
}

export const axes: Axis[] = freezeArray(
  CANONICAL_MANIFEST.constructs.map(axisProjection),
);
export const axisById = new Map(axes.map((axis) => [axis.id, axis]));

const itemById = new Map(
  CANONICAL_MANIFEST.items.map((item) => [item.id, item]),
);
const activeCoreItemIds = new Set(CANONICAL_MANIFEST.activeCoreItemIds ?? []);
export const QUESTION_BANK_VERSION = `${CANONICAL_MANIFEST.metadata.version}+${CANONICAL_PRESENTATION_VERSION}`;

function questionProjection(item: CanonicalItem): Question {
  const layer = (item.layer ?? "normative") as Layer;
  const presentation = CANONICAL_QUESTION_PRESENTATION[item.id];
  const evidenceNote = presentation?.evidenceNote ?? item.evidenceNote;
  const confidencePrompt =
    presentation?.confidencePrompt ?? item.confidencePrompt;
  const priorityPrompt = presentation?.priorityPrompt ?? item.priorityPrompt;
  const axisWeights = Object.entries(item.rootConstructWeights ?? {}).map(
    ([axisId, weight]) => ({ axisId, weight }),
  );
  const statementOptions = item.statementOptions?.map(
    (option): StatementOption => ({
      id: option.id,
      text: option.text,
      axisWeights: Object.entries(option.rootConstructWeights).map(
        ([axisId, weight]) => ({ axisId, weight }),
      ),
    }),
  );
  return freeze({
    id: item.id,
    prompt: presentation?.prompt ?? item.prompt,
    domain: item.domain ?? "unknown",
    layer,
    theoryContext: presentation?.theoryContext ?? "mixed",
    responseType: (item.responseType ?? "likert7") as ResponseType,
    tier: (item.tier ?? "extensive") as QuizTier,
    axisWeights,
    ...(statementOptions ? { statementOptions } : {}),
    ...(item.moduleId ? { module: item.moduleId } : {}),
    ...(item.explanation ? { explanation: item.explanation } : {}),
    ...(item.helpText ? { helpText: item.helpText } : {}),
    ...(evidenceNote ? { evidenceNote } : {}),
    ...(item.sources
      ? {
          sources: item.sources.map((source) => ({ ...source })),
        }
      : {}),
    ...(item.contextNote ? { contextNote: item.contextNote } : {}),
    ...(item.allowDontKnow !== undefined
      ? { allowDontKnow: item.allowDontKnow }
      : {}),
    ...(confidencePrompt ? { confidencePrompt } : {}),
    ...(priorityPrompt ? { priorityPrompt } : {}),
    ...(item.reverseScored !== undefined
      ? { reverseScored: item.reverseScored }
      : {}),
    active: item.role === "core" ? activeCoreItemIds.has(item.id) : true,
    reviewStatus: "approved",
    version: QUESTION_BANK_VERSION,
    sourceStatus: "clean_room",
    ...(item.textHash ? { textHash: item.textHash } : {}),
  });
}

const projectedItems = CANONICAL_MANIFEST.items.map(questionProjection);
export const allQuestions: Question[] = freezeArray(projectedItems);
export const coreQuestions: Question[] = freezeArray(
  projectedItems.filter(
    (question) => itemById.get(question.id)?.role === "core",
  ),
);
export const questions: Question[] = freezeArray(
  coreQuestions.filter((question) => question.active !== false),
);
export const questionById = new Map(
  allQuestions.map((question) => [question.id, question]),
);

const TIER_RANK: Record<QuizTier, number> = {
  blitz: 0,
  quick: 1,
  moderate: 2,
  extensive: 3,
};

function diversifyQuickOrder(selected: Question[]): Question[] {
  const domainOrder = [...new Set(selected.map((question) => question.domain))];
  const byDomain = new Map(
    domainOrder.map((domain) => [
      domain,
      selected.filter((question) => question.domain === domain),
    ]),
  );
  const maxDepth = Math.max(
    ...[...byDomain.values()].map((domainQuestions) => domainQuestions.length),
  );
  const result: Question[] = [];
  for (let depth = 0; depth < maxDepth; depth += 1) {
    for (const domain of domainOrder) {
      const question = byDomain.get(domain)?.[depth];
      if (question) result.push(question);
    }
  }
  return result;
}

export function questionsForTier(tier: QuizTier): Question[] {
  const selected = questions.filter(
    (question) => TIER_RANK[question.tier] <= TIER_RANK[tier],
  );
  return tier === "quick" ? diversifyQuickOrder(selected) : selected;
}

export const SCORING_VERSION = CANONICAL_MANIFEST.metadata.version;
export function getBankFingerprint(): string {
  return CANONICAL_MANIFEST.metadata.fingerprint ?? QUESTION_BANK_VERSION;
}

export const LEGACY_QUESTION_BANK_VERSION =
  "2026-06-v4+2026-08-confidence-coverage-v1+2026-08-confidence-coverage-v3+2026-08-confidence-coverage-v4+2026-07-semantic-v1+2026-07-statement-semantic-v1+2026-08-respondent-v5+2026-08-editorial-v5+2026-08-editorial-v7.1+2026-08-editorial-v8+2026-08-descriptive-evidence-v1+2026-08-descriptive-evidence-v2+2026-08-descriptive-evidence-v3+2026-08-specialist-descriptive-v3+2026-08-editorial-v9+2026-08-editorial-v11+2026-08-editorial-v12+2026-08-editorial-v13+2026-08-editorial-v14+2026-08-editorial-v15+2026-08-editorial-v16+2026-08-editorial-v17+2026-08-editorial-v18+2026-08-editorial-v19+2026-08-editorial-v20+2026-08-editorial-v21+2026-08-editorial-v22+2026-08-editorial-v23+2026-08-editorial-v24+2026-08-editorial-v25+2026-08-editorial-v26+2026-08-editorial-v27+2026-08-editorial-v28+2026-08-descriptive-evidence-v4+2026-08-descriptive-evidence-v5+2026-08-question-context-v33+2026-08-question-prompts-v1";

export function isCompatibleQuestionBankVersion(
  actual: string,
  expected: string,
): boolean {
  return (
    actual === expected ||
    (actual === LEGACY_QUESTION_BANK_VERSION &&
      expected === QUESTION_BANK_VERSION) ||
    (actual === QUESTION_BANK_VERSION &&
      expected === LEGACY_QUESTION_BANK_VERSION)
  );
}

const profileByLabelId = new Map(
  (CANONICAL_MANIFEST.productionProfiles ?? []).map((profile) => [
    profile.labelId,
    profile,
  ]),
);
const contractByLabelId = new Map(
  (CANONICAL_MANIFEST.modifierContracts ?? []).map((contract) => [
    contract.labelId,
    contract,
  ]),
);
export const productionProfiles = Object.freeze([
  ...(CANONICAL_MANIFEST.productionProfiles ?? []),
]);
export const productionProfileByLabelId = new Map(
  productionProfiles.map((profile) => [profile.labelId, profile]),
);
export const modifierContracts = Object.freeze([
  ...(CANONICAL_MANIFEST.modifierContracts ?? []),
]);
export const PRIMARY_MEASUREMENT_VERSION = "2026-08-primary-core-v1";
export const MODIFIER_MEASUREMENT_VERSION = "2026-08-modifier-construct-v1";

function roleForNode(node: IdeologyNode): LabelRole {
  return node.publicRoleStatus as LabelRole;
}

function measurementStatusForNode(node: IdeologyNode): LabelMeasurementStatus {
  const role = roleForNode(node);
  if (role === "primary") {
    return node.measurementStatus === "validated-scoped-public"
      ? "core-primary"
      : "core-primary-unvalidated";
  }
  if (role === "specialist") {
    return node.measurementStatus === "validated-scoped-public"
      ? "validated-specialist"
      : "provisional-specialist";
  }
  if (role === "modifier") {
    const contract = contractByLabelId.get(node.id);
    if (!contract) return "modifier-catalog-only";
    if (contract.availability === "core-construct") return "modifier-scored";
    if (contract.availability === "focused-follow-up")
      return "modifier-follow-up";
    return "modifier-catalog-only";
  }
  if (role === "context") return "context-only";
  return "retired-alias";
}

function scaleForRole(role: LabelRole): IdeologyScaleMetadata {
  const respondentMeasurementScale =
    role === "primary" || role === "modifier" ? "micro" : null;
  return freeze({
    commonScales: ["macro", "meso"],
    respondentMeasurementScale,
    note: "This canonical catalog entry is normally interpreted through doctrine, movements, institutions, or public discourse. A scored respondent estimate concerns micro-level uptake and is not an identity claim.",
    sources: [],
  });
}

function taxonomyForNode(node: IdeologyNode): LabelTaxonomyMetadata {
  const role = roleForNode(node);
  const contract = contractByLabelId.get(node.id);
  return freeze({
    role,
    measurementStatus: measurementStatusForNode(node),
    relations: [],
    rationale:
      role === "primary"
        ? "Broad canonical family retained as a primary scoring endpoint."
        : role === "modifier"
          ? (contract?.note ?? "Cross-cutting canonical orientation.")
          : role === "context"
            ? "Canonical context retained for browsing and interpretation, not ordinary scoring."
            : role === "specialist"
              ? "Narrow canonical tradition reserved for focused construct-matched depth measurement."
              : "Retired canonical alias retained for interpretation only.",
    analyticalScale: scaleForRole(role),
    analyticalScaleVersion: IDEOLOGY_SCALE_VERSION,
  });
}

function labelProjection(node: IdeologyNode): IdeologyLabel & {
  taxonomy: LabelTaxonomyMetadata;
} {
  const profile = profileByLabelId.get(node.id);
  const centroid = profile ? { ...profile.centroid } : {};
  const scoringScope = profile
    ? {
        version: profile.version,
        axisIds: [...profile.rootConstructIds],
        requiredAxisIds: [...profile.requiredRootConstructIds],
        ...(profile.minimumItemCounts
          ? { minimumItemCounts: { ...profile.minimumItemCounts } }
          : {}),
        sourceIds: [],
        rationale:
          profile.rationale ||
          "Canonical production profile restricted to its declared root constructs.",
      }
    : undefined;
  const philosophy = node.family ? humanize(node.family) : undefined;
  const affectedAxes = profile ? [...profile.rootConstructIds] : [];
  return freeze({
    id: node.id,
    name: node.canonicalName,
    family: node.family ?? "uncategorized",
    ...(node.subfamily ? { subfamily: node.subfamily } : {}),
    centroid,
    ...(scoringScope ? { scoringScope } : {}),
    description: node.canonicalDefinition,
    ...(node.description ? { description: node.description } : {}),
    ...(node.cautionNote ? { cautionNote: node.cautionNote } : {}),
    ...(node.usageNote ? { usageNote: node.usageNote } : {}),
    ...(node.sources
      ? {
          sources: node.sources.map((source, index) => ({
            sourceId: `${node.id}:source:${index + 1}`,
            title: source.title,
            url: source.url,
            ...(source.publisher ? { publisher: source.publisher } : {}),
            kind: "scholarly" as const,
            supports: ["definition"] as const,
            note: "Supports the canonical label definition and scoped interpretation.",
          })),
        }
      : {}),
    ...(node.boundaryStatement ? { cautionNote: node.boundaryStatement } : {}),
    ...(node.aliases || node.id === "marxian-socialism"
      ? {
          aliases: [
            ...(node.aliases ?? []),
            ...(node.id === "marxian-socialism"
              ? ["Non-Leninist Marxism", "Socialist Feminism"]
              : []),
          ],
        }
      : {}),
    ...(philosophy
      ? {
          philosophies: [philosophy],
          normativePhilosophies: [philosophy],
          descriptivePhilosophies: [philosophy],
          prescriptivePhilosophies: [philosophy],
          philosophyInfluences: [
            {
              philosophy,
              description: `The ${philosophy.toLowerCase()} family provides the broad interpretive context for this canonical entry.`,
              affectedAxes,
            },
          ],
        }
      : {}),
    taxonomy: taxonomyForNode(node),
  });
}

const canonicalNodes = CANONICAL_MANIFEST.nodes ?? [];
const projectedLabels = canonicalNodes.map(labelProjection);
export const labelById = new Map(
  projectedLabels.map((label) => [label.id, label]),
);
export const primaryScoringLabels = freezeArray(
  projectedLabels.filter((label) => label.taxonomy.role === "primary"),
);
export const modifierScoringLabels = freezeArray(
  projectedLabels.filter(
    (label) => label.taxonomy.measurementStatus === "modifier-scored",
  ),
);
export const publicCatalogLabels = freezeArray(
  projectedLabels.filter((label) => label.taxonomy.role !== "retired"),
);
export const researchIdentityLabels = freezeArray([...primaryScoringLabels]);

const canonicalAliasById = new Map<string, string>();
for (const relation of CANONICAL_MANIFEST.relations ?? []) {
  if (relation.relation !== "alias_of" && relation.relation !== "aliases")
    continue;
  if (relation.source.kind !== "node" || relation.target.kind !== "node")
    continue;
  canonicalAliasById.set(relation.source.id, relation.target.id);
}

export function canonicalLabelId(labelId: string): string {
  return canonicalAliasById.get(labelId) ?? labelId;
}

export const domainById = new Map<string, Domain>();
for (const item of questions) {
  if (domainById.has(item.domain)) continue;
  const metadata = DOMAIN_METADATA[item.domain];
  domainById.set(
    item.domain,
    freeze(
      metadata ?? {
        id: item.domain,
        name: humanize(item.domain),
        description: `Questions about ${humanize(item.domain).toLowerCase()}.`,
      },
    ),
  );
}
export const domains: Domain[] = freezeArray([...domainById.values()]);

export interface CatalogRelatedTradition {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly subfamily: string;
  readonly status: "catalog-candidate" | "focused-follow-up";
  readonly aliases?: readonly string[];
  readonly description: string;
  readonly sourceUrls: readonly string[];
}

export const catalogRelatedTraditions: readonly CatalogRelatedTradition[] =
  freezeArray([
    freeze({
      id: "socialist-marxist-feminist-traditions",
      name: "Socialist and Marxist Feminist Traditions",
      family: "feminist",
      subfamily: "socialist-marxist",
      status: "focused-follow-up",
      aliases: ["Socialist Feminism", "Marxist Feminism"],
      description:
        "Focused traditions connecting gender hierarchy to political economy, class structure, and material dependence.",
      sourceUrls: [
        "https://plato.stanford.edu/entries/feminism-class/",
        "https://plato.stanford.edu/entries/feminist-philosophy/",
      ],
    }),
    freeze({
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
    }),
    freeze({
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
    }),
  ]);

export const LAYER_EXPLAINERS = freeze({
  normative: freeze({ label: "Normative values" }),
  descriptive: freeze({ label: "Descriptive beliefs" }),
  prescriptive: freeze({ label: "Prescriptive strategy" }),
});

export function getIdeologyLayerSummary(
  label: IdeologyLabel,
  _axes: readonly Axis[],
  layer: Layer,
): string {
  return `${label.name} is described canonically as ${label.description.toLowerCase()} This ${layer} reading is interpretive context, not a claim that every adherent shares one fixed view.`;
}

export function getIdeologyTermDefinitions(
  label: IdeologyLabel,
): readonly string[] {
  return label.description ? [label.description] : [];
}
export function getIdeologyLabelSources(
  label: IdeologyLabel,
  includeLayerScoped: boolean,
): readonly NonNullable<IdeologyLabel["sources"]>[number][] {
  void includeLayerScoped;
  return label.sources ?? [];
}
export function getQuestionHelpText(question: Question): string {
  if (question.helpText) return question.helpText;
  const domain = domainById.get(question.domain);
  const domainPhrase = domain?.name.toLowerCase() ?? "this topic";
  const measurement =
    question.layer === "normative"
      ? "the moral commitments"
      : question.layer === "descriptive"
        ? "the empirical beliefs"
        : "the practical policy or strategy direction";
  const response =
    question.responseType === "statementChoice"
      ? "which statement you choose"
      : "how strongly you agree";
  return `This question concerns ${domainPhrase}. It measures ${measurement} about this topic, based on ${response}.`;
}

export function getSalienceHelpText(
  field: "confidence" | "priority" | null,
): string {
  if (field === "confidence")
    return "“Confidence” means how sure you are that your answer is accurate. This rating controls how strongly this empirical answer counts in your result. Skipping the rating excludes the answer from your result.";
  if (field === "priority")
    return "“Priority” means how important this policy or strategy is compared with other changes. This rating controls how strongly this preference counts in your result. Skipping the rating excludes the answer from your result.";
  return "";
}

export function getCanonicalItem(id: string): CanonicalItem | undefined {
  return itemById.get(id);
}

export function getCanonicalLabel(
  id: string,
): ReturnType<typeof labelProjection> | undefined {
  return labelById.get(id);
}

export type { AxisId };
