import { axes } from "./axes";
import { questions } from "./effectiveQuestions";
import { modifierMeasurementDefinitions } from "./modifierMeasurement";
import { primaryScoringLabels, specialistModuleByLabel } from "./labelTaxonomy";
import { specialistModuleDefinitions } from "../specialist";
import { vnextOntologyNodes } from "./vnextOntology";
import type {
  VNextConstructCoverageStatus,
  VNextConstructRegistry,
  VNextFacetConstruct,
  VNextRootConstruct,
} from "../types";
import {
  VNEXT_CONSTRUCTS_VERSION,
  VNEXT_FACET_MAP_VERSION,
} from "../validation/vnextVersions";

const FACETS_BY_ROOT: Readonly<Record<string, readonly string[]>> = {
  "authority-legitimacy": [
    "authority.source",
    "authority.scope",
    "authority.monopoly",
    "authority.accountability",
    "authority.contestability",
    "authority.coercive-justification",
  ],
  "property-legitimacy": [
    "property.subject",
    "property.productive-v-personal",
    "property.control-v-title",
    "property.acquisition",
    "property.rent-and-exclusion",
    "property.common-claims",
  ],
  "liberty-noninterference": [
    "liberty.noninterference",
    "liberty.autonomy-capacity",
    "liberty.exit",
    "liberty.bodily",
    "liberty.expression",
    "liberty.due-process",
  ],
  "equality-theory": [
    "equality.formal-status",
    "equality.opportunity",
    "equality.distribution",
    "equality.capability",
    "equality.relativity-status",
    "equality.remedy",
  ],
  "political-community-boundary": [
    "community.moral-scope",
    "community.special-obligation",
    "community.membership",
    "community.sovereignty",
    "community.layered-membership",
    "community.outsider-standing",
  ],
  "moral-traditionalism": [
    "tradition.inherited-authority",
    "tradition.family-order",
    "tradition.sexual-morality",
    "tradition.religious-morality",
    "tradition.public-enforcement",
    "tradition.pluralist-tolerance",
  ],
  "anti-domination": [
    "domination.arbitrariness",
    "domination.contestability",
    "domination.dependence",
    "domination.hierarchy",
    "domination.workplace",
    "domination.public-private",
  ],
  "human-nature-priority": [
    "ecology.intrinsic-standing",
    "ecology.ecological-limits",
    "ecology.intergenerational-duty",
    "ecology.species-and-systems",
    "ecology.human-use",
  ],
  "militarism-pacifism": [
    "force.justification",
    "force.defense",
    "force.intervention",
    "force.civilian-harm",
    "force.regime-change",
    "force.military-institution",
  ],
  "secularism-religious": [
    "religion.state-neutrality",
    "religion.public-expression",
    "religion.establishment",
    "religion.legal-authority",
    "religion.clerical-power",
    "religion.pluralism",
  ],
  "market-process-confidence": [
    "market.information",
    "market.discovery",
    "market.incentives",
    "market.externalities",
    "market.concentration",
    "market.distribution",
    "market-alternative",
  ],
  "state-capacity-confidence": [
    "state.implementation",
    "state.coordination",
    "state.administrative-skill",
    "state.autonomy",
    "state.accountability",
    "state.failure",
  ],
  "public-choice-skepticism": [
    "public-choice.capture",
    "public-choice.principal-agent",
    "public-choice.concentrated-benefits",
    "public-choice.information",
    "public-choice.correctability",
  ],
  "democratic-confidence": [
    "democracy.voter-information",
    "democracy.aggregation",
    "democracy.deliberation",
    "democracy.majoritarian-error",
    "democracy.responsiveness",
    "democracy.learning",
  ],
  "expert-confidence": [
    "expert.competence",
    "expert.uncertainty",
    "expert.transparency",
    "expert.accountability",
    "expert.capture",
    "expert.public-knowledge",
  ],
  "cultural-plasticity": [
    "culture.path-dependence",
    "culture.policy-malleability",
    "culture.diffusion",
    "culture.socialization",
    "culture.institutional-feedback",
    "culture.persistence",
  ],
  "coordination-optimism": [
    "coordination.trust",
    "coordination.monitoring",
    "coordination.information",
    "coordination.scale",
    "coordination.polycentric",
    "coordination.failure",
  ],
  "centralization-preference": [
    "centralization.level",
    "centralization.uniformity",
    "centralization.local-autonomy",
    "centralization.federalism",
    "centralization.polycentrism",
    "centralization.exit",
  ],
  "reform-vs-revolution": [
    "change.continuity",
    "change.rupture",
    "change.transition",
    "change.legitimacy",
    "change.movement",
    "change.institution-building",
  ],
  "gradualism-vs-immediatism": [
    "pace.sequencing",
    "pace.transition-risk",
    "pace.crisis",
    "pace.experimentation",
    "pace.irreversibility",
  ],
  "state-action-vs-exit": [
    "remedy.state-provision",
    "remedy.private-exit",
    "remedy.voice-exit",
    "remedy.public-goods",
    "remedy.counter-institution",
    "remedy.enforcement",
  ],
  "electoralism-vs-direct-action": [
    "strategy.electoral",
    "strategy.legal",
    "strategy.movement",
    "strategy.disruption",
    "strategy.direct-action",
    "strategy.violence-separate",
  ],
  "compromise-vs-persistence": [
    "bargaining.partial-gain",
    "bargaining.issue-firmness",
    "bargaining.coalition",
    "bargaining.principle",
    "bargaining.opposition",
    "bargaining.long-horizon",
  ],
  "coercion-strategy": [
    "coercion.threshold",
    "coercion.target",
    "coercion.legality",
    "coercion.violence",
    "coercion.repression",
    "coercion.nonviolence",
  ],
  "regulation-vs-deregulation": [
    "regulation.domain",
    "regulation.enforcement",
    "regulation.entry",
    "regulation.precaution",
    "regulation.consumer",
    "regulation.labor",
    "regulation.environment",
    "regulation.technology",
  ],
  "redistribution-vs-predistribution": [
    "distribution.transfer",
    "distribution.services",
    "distribution.taxation",
    "distribution.ownership",
    "distribution.labor-rules",
    "distribution.capability",
    "distribution.rule-setting",
  ],
};

const COVERAGE_BY_ROOT: Readonly<Record<string, VNextConstructCoverageStatus>> =
  {
    "authority-legitimacy": "contaminated",
    "property-legitimacy": "contaminated",
    "liberty-noninterference": "overrepresented",
    "equality-theory": "contaminated",
    "political-community-boundary": "contaminated",
    "moral-traditionalism": "contaminated",
    "anti-domination": "overrepresented",
    "human-nature-priority": "adequate",
    "militarism-pacifism": "underrepresented",
    "secularism-religious": "contaminated",
    "market-process-confidence": "contaminated",
    "state-capacity-confidence": "underrepresented",
    "public-choice-skepticism": "contaminated",
    "democratic-confidence": "adequate",
    "expert-confidence": "adequate",
    "cultural-plasticity": "adequate",
    "coordination-optimism": "contaminated",
    "centralization-preference": "overrepresented",
    "reform-vs-revolution": "contaminated",
    "gradualism-vs-immediatism": "contaminated",
    "state-action-vs-exit": "overrepresented",
    "electoralism-vs-direct-action": "adequate",
    "compromise-vs-persistence": "depth-limited",
    "coercion-strategy": "contaminated",
    "regulation-vs-deregulation": "overrepresented",
    "redistribution-vs-predistribution": "contaminated",
  };

const ROOT_RISKS: Readonly<Record<string, readonly string[]>> = {
  "authority-legitimacy": ["authority-conflation", "high-consequence"],
  "property-legitimacy": ["property-equality-conflation"],
  "liberty-noninterference": ["social-desirability", "broad-proxy-risk"],
  "equality-theory": ["social-desirability", "wording-sensitivity"],
  "political-community-boundary": [
    "sensitive-content",
    "membership-conflation",
  ],
  "moral-traditionalism": ["social-desirability", "religion-sensitivity"],
  "anti-domination": ["overrepresentation", "broad-proxy-risk"],
  "human-nature-priority": ["social-desirability", "policy-conflation"],
  "militarism-pacifism": ["sensitive-content", "knowledge-dependence"],
  "secularism-religious": ["religion-sensitivity", "language-scope"],
  "market-process-confidence": ["normative-descriptive-conflation"],
  "state-capacity-confidence": ["knowledge-dependence", "undercoverage"],
  "public-choice-skepticism": ["institutional-conflation"],
  "democratic-confidence": ["partisan-affect", "knowledge-dependence"],
  "expert-confidence": ["prestige-effects", "knowledge-dependence"],
  "cultural-plasticity": ["ought-can-conflation"],
  "coordination-optimism": ["normative-descriptive-conflation"],
  "centralization-preference": ["generic-scale-conflation"],
  "reform-vs-revolution": ["means-ends-conflation", "violence-conflation"],
  "gradualism-vs-immediatism": ["risk-aversion-conflation"],
  "state-action-vs-exit": ["remedy-conflation"],
  "electoralism-vs-direct-action": ["romanticization-risk"],
  "compromise-vs-persistence": ["agreeableness-conflation"],
  "coercion-strategy": ["sensitive-content", "underreporting-risk"],
  "regulation-vs-deregulation": ["domain-conflation"],
  "redistribution-vs-predistribution": ["mechanism-conflation"],
};

const CONFIGURATIONS_BY_ROOT: Readonly<Record<string, readonly string[]>> = {
  "authority-legitimacy": [
    "liberal-constitutional",
    "traditional-authority",
    "anti-authority",
  ],
  "property-legitimacy": ["private-title", "social-ownership", "common-claims"],
  "liberty-noninterference": [
    "noninterference",
    "republican-nondomination",
    "capability",
  ],
  "equality-theory": ["formal-status", "redistribution", "structural-equality"],
  "political-community-boundary": [
    "national-priority",
    "cosmopolitan-scope",
    "anti-imperialism",
  ],
  "moral-traditionalism": [
    "inherited-order",
    "pluralist-tolerance",
    "public-enforcement",
  ],
  "anti-domination": ["contestable-hierarchy", "anti-class", "anti-patriarchy"],
  "human-nature-priority": [
    "intrinsic-standing",
    "human-centered-use",
    "ecological-limits",
  ],
  "militarism-pacifism": ["pacifism", "conditional-defense", "interventionism"],
  "secularism-religious": [
    "state-neutrality",
    "religious-public-order",
    "final-authority",
  ],
  "market-process-confidence": [
    "market-confidence",
    "market-skepticism",
    "mixed-coordination",
  ],
  "state-capacity-confidence": [
    "administrative-confidence",
    "state-skepticism",
  ],
  "public-choice-skepticism": [
    "capture-skepticism",
    "institutional-correctability",
  ],
  "democratic-confidence": ["democratic-learning", "majoritarian-skepticism"],
  "expert-confidence": ["expertise-confidence", "anti-technocratic-skepticism"],
  "cultural-plasticity": ["cultural-persistence", "policy-malleability"],
  "coordination-optimism": ["polycentric-coordination", "central-coordination"],
  "centralization-preference": ["centralization", "federalism", "polycentrism"],
  "reform-vs-revolution": ["reform", "rupture", "institution-building"],
  "gradualism-vs-immediatism": ["sequenced-change", "immediate-change"],
  "state-action-vs-exit": [
    "public-provision",
    "private-exit",
    "counter-institution",
  ],
  "electoralism-vs-direct-action": ["electoralism", "direct-action"],
  "compromise-vs-persistence": ["partial-gains", "principled-persistence"],
  "coercion-strategy": [
    "lawful-enforcement",
    "coercive-politics",
    "nonviolence",
  ],
  "regulation-vs-deregulation": ["domain-regulation", "deregulation"],
  "redistribution-vs-predistribution": [
    "transfers",
    "rule-setting",
    "ownership",
  ],
};

function hasAxis(
  question: (typeof questions)[number],
  rootId: string,
): boolean {
  const weights =
    question.responseType === "statementChoice"
      ? (question.statementOptions?.flatMap((option) => option.axisWeights) ??
        [])
      : question.axisWeights;
  return weights.some((weight) => weight.axisId === rootId);
}

function applicableLabels(rootId: string): string[] {
  const primary = primaryScoringLabels
    .filter((label) => label.scoringScope?.axisIds.includes(rootId))
    .map((label) => label.id);
  const modifier = modifierMeasurementDefinitions
    .filter((definition) =>
      definition.indicators?.some((indicator) => {
        const question = questions.find(
          (candidate) => candidate.id === indicator.questionId,
        );
        return question ? hasAxis(question, rootId) : false;
      }),
    )
    .map((definition) => definition.labelId);
  const specialists = Object.entries(specialistModuleByLabel)
    .filter(([, moduleId]) =>
      specialistModuleDefinitions
        .find((module) => module.id === moduleId)
        ?.questions.some((question) => hasAxis(question, rootId)),
    )
    .map(([labelId]) => labelId);
  return [...new Set([...primary, ...modifier, ...specialists])];
}

function applicableModules(rootId: string): string[] {
  return specialistModuleDefinitions
    .filter((module) =>
      module.questions.some((question) => hasAxis(question, rootId)),
    )
    .map((module) => module.id);
}

function facetRecord(
  root: (typeof axes)[number],
  facetId: string,
  applicableLabelIds: readonly string[],
  applicableModuleIds: readonly string[],
): VNextFacetConstruct {
  return {
    id: facetId,
    rootId: root.id,
    name: facetId.slice(facetId.indexOf(".") + 1).replaceAll("-", " "),
    layer: root.layer,
    definition: `A vNext facet of ${root.name}; it is not an independently validated score in this release.`,
    neighboringRootIds: axes
      .filter((candidate) => candidate.id !== root.id)
      .slice(0, 3)
      .map((candidate) => candidate.id),
    discriminantRoles: [
      "separate from neighboring roots before interpretation",
    ],
    riskFlags: ["respondent-validation-required"],
    applicableLabelIds,
    applicableModuleIds,
    coverageStatus: "planned",
    sourceRecordIds: [
      "vnext-construct-architecture-measurement-blueprint-2026-08",
    ],
    implementationIds: ["I-004"],
    decisionIds: ["D-76", "D-77", "D-79", "D-85"],
  };
}

const roots: VNextRootConstruct[] = axes.map((axis) => {
  const facetIds = FACETS_BY_ROOT[axis.id] ?? [];
  const labelIds = applicableLabels(axis.id);
  const moduleIds = applicableModules(axis.id);
  return {
    id: axis.id,
    name: axis.name,
    layer: axis.layer,
    definition: axis.description,
    facetIds,
    neighboringRootIds: axes
      .filter((candidate) => candidate.id !== axis.id)
      .slice(0, 3)
      .map((candidate) => candidate.id),
    expectedConfigurations: CONFIGURATIONS_BY_ROOT[axis.id] ?? [],
    discriminantRoles: [
      "root comparison only",
      "do not infer adjacent facets from this root",
    ],
    riskFlags: ROOT_RISKS[axis.id] ?? ["respondent-validation-required"],
    applicableLabelIds: labelIds,
    applicableModuleIds: moduleIds,
    coverageStatus: COVERAGE_BY_ROOT[axis.id] ?? "planned",
    sourceRecordIds: [
      "vnext-construct-architecture-measurement-blueprint-2026-08",
      "construct-family-map-2026-08",
    ],
    implementationIds: ["I-004"],
    decisionIds: [
      "D-76",
      "D-77",
      "D-78",
      "D-79",
      "D-80",
      "D-81",
      "D-82",
      "D-85",
    ],
  };
});

const facets = roots.flatMap((root) => {
  const axis = axes.find((candidate) => candidate.id === root.id);
  if (!axis) throw new Error(`Unknown root ${root.id}`);
  return root.facetIds.map((facetId) =>
    facetRecord(
      axis,
      facetId,
      root.applicableLabelIds,
      root.applicableModuleIds,
    ),
  );
});

export const vnextConstructRegistry: VNextConstructRegistry = {
  constructsVersion: VNEXT_CONSTRUCTS_VERSION,
  facetMapVersion: VNEXT_FACET_MAP_VERSION,
  roots,
  facets,
};

export const vnextRootById = new Map(roots.map((root) => [root.id, root]));
export const vnextFacetById = new Map(facets.map((facet) => [facet.id, facet]));

// Keep the ontology import live in this research registry so a deleted or
// retired label cannot become a silent construct reference.
export const vnextKnownOntologyLabelIds = new Set(
  vnextOntologyNodes.map((node) => node.id),
);
