export const PRIMARY_COMMITMENT_RELATIONS = [
  "constitutive",
  "core",
  "characteristic",
  "contested",
  "compatible",
  "peripheral",
  "incompatible",
] as const;

export type PrimaryCommitmentRelation =
  (typeof PRIMARY_COMMITMENT_RELATIONS)[number];

export type CommitmentCriterion =
  | { readonly operator: "minimum"; readonly minimum: number }
  | { readonly operator: "maximum"; readonly maximum: number }
  | {
      readonly operator: "interval";
      readonly minimum: number;
      readonly maximum: number;
    };

export interface PrimaryIdeologyCommitment {
  readonly id: string;
  readonly constructId: string;
  readonly relation: PrimaryCommitmentRelation;
  readonly criterion?: CommitmentCriterion;
  readonly minimumAnsweredItems?: number;
  readonly rationale: string;
}

export interface PrimaryIdeologyCommitmentSpec {
  readonly profileId: string;
  readonly modelVersion: "2026-08-primary-commitment-v1";
  readonly rationale: string;
  readonly commitments: readonly PrimaryIdeologyCommitment[];
}

const minimum = (minimum: number): CommitmentCriterion => ({
  operator: "minimum",
  minimum,
});
const maximum = (maximum: number): CommitmentCriterion => ({
  operator: "maximum",
  maximum,
});
const interval = (minimumValue: number, maximumValue: number): CommitmentCriterion => ({
  operator: "interval",
  minimum: minimumValue,
  maximum: maximumValue,
});

const commitment = (
  id: string,
  constructId: string,
  relation: PrimaryCommitmentRelation,
  rationale: string,
  criterion?: CommitmentCriterion,
): PrimaryIdeologyCommitment => ({
  id,
  constructId,
  relation,
  ...(criterion === undefined ? {} : { criterion }),
  rationale,
});

const spec = (
  profileId: string,
  rationale: string,
  commitments: readonly PrimaryIdeologyCommitment[],
): PrimaryIdeologyCommitmentSpec => ({
  profileId,
  modelVersion: "2026-08-primary-commitment-v1",
  rationale,
  commitments,
});

/**
 * These records are the production primary-classification authority.
 *
 * The centroid/targetValue arrays still present in the migrated v2 content bundle
 * are frozen compatibility artifacts. Production matching must not read them.
 * They remain only so old reference fixtures and migration tooling can be
 * interpreted while the declarative content schema is migrated in a later phase.
 */
export const PRIMARY_IDEOLOGY_COMMITMENT_SPECS = Object.freeze([
  spec(
    "profile:christian-democrat",
    "Christian democracy is treated as a configuration of social obligation, private property with social duties, subsidiary institutions, democratic public authority, and historically Christian moral inspiration rather than a generic conservative centroid.",
    [
      commitment(
        "cd-tradition",
        "moral-traditionalism",
        "core",
        "Christian-democratic traditions characteristically give inherited moral and associational institutions political relevance without requiring theocracy.",
        minimum(0.05),
      ),
      commitment(
        "cd-social-obligation",
        "equality-theory",
        "core",
        "Christian democracy ordinarily recognizes social obligations beyond formal legal equality without requiring strict material equality.",
        minimum(-0.1),
      ),
      commitment(
        "cd-mixed-property",
        "property-legitimacy",
        "characteristic",
        "Private property is normally accepted but is constrained by social obligations; neither abolition nor absolutization is constitutive.",
        interval(-0.1, 0.75),
      ),
      commitment(
        "cd-public-action",
        "state-action-vs-exit",
        "characteristic",
        "Christian-democratic social policy permits public action and social provision while also valuing subsidiary institutions.",
        minimum(0),
      ),
      commitment(
        "cd-subsidiarity",
        "centralization-preference",
        "characteristic",
        "Subsidiarity makes unlimited concentration of decision-making uncharacteristic even while public authority remains legitimate.",
        maximum(0.45),
      ),
      commitment(
        "cd-religious-order",
        "secularism-religious",
        "contested",
        "Christian-democratic traditions vary over establishment, neutrality, accommodation, and religiously informed public reason.",
      ),
      commitment(
        "cd-market-confidence",
        "market-process-confidence",
        "contested",
        "Christian democracy contains social-market, corporatist, and more interventionist economic currents.",
      ),
    ],
  ),
  spec(
    "profile:classical-liberalism",
    "Classical liberalism is defined by liberty, limited and justified political authority, rule-bound government, property, and voluntary exchange; welfare, democracy, foreign policy, and particular regulatory programs remain internally variable.",
    [
      commitment(
        "cl-liberty",
        "liberty-noninterference",
        "constitutive",
        "A strong presumption for individual liberty and limits on interference is constitutive of the classical-liberal family.",
        minimum(0.3),
      ),
      commitment(
        "cl-property",
        "property-legitimacy",
        "core",
        "Private property and voluntary exchange are core classical-liberal institutions, though land, acquisition, and intellectual-property theories vary.",
        minimum(0.25),
      ),
      commitment(
        "cl-limited-authority",
        "authority-legitimacy",
        "core",
        "Political authority must be limited and justified rather than presumptively unlimited.",
        maximum(0.35),
      ),
      commitment(
        "cl-market-order",
        "market-process-confidence",
        "characteristic",
        "Confidence in decentralized exchange and price coordination is characteristic but varies across schools.",
        minimum(0.05),
      ),
      commitment(
        "cl-public-choice",
        "public-choice-skepticism",
        "characteristic",
        "Skepticism about concentrated political incentives and capture is characteristic of many modern classical-liberal traditions.",
        minimum(-0.05),
      ),
      commitment(
        "cl-decentralization",
        "centralization-preference",
        "characteristic",
        "Dispersed and contestable authority is characteristic, although institutional scale varies.",
        maximum(0.35),
      ),
      commitment(
        "cl-coercion",
        "coercion-strategy",
        "core",
        "Classical liberalism strongly constrains coercive political means even where coercion is permitted for rights protection.",
        maximum(0.25),
      ),
      commitment(
        "cl-unlimited-authority",
        "authority-legitimacy",
        "incompatible",
        "Presumptively unlimited centralized political authority conflicts with the classical-liberal core.",
        minimum(0.8),
      ),
      commitment(
        "cl-social-minimum",
        "state-action-vs-exit",
        "contested",
        "Classical liberals disagree over poor relief, public goods, social insurance, and legitimate welfare provision.",
      ),
    ],
  ),
  spec(
    "profile:conservative",
    "Prudential conservatism is modeled around continuity, practical judgment, inherited institutions, and skepticism toward rationalist reconstruction; nationalism, laissez-faire economics, and specific religious doctrines are not universal requirements.",
    [
      commitment(
        "con-prudence",
        "gradualism-vs-immediatism",
        "core",
        "Prudential conservatism characteristically favors gradual adaptation and attention to transition costs over abstract immediatism.",
        maximum(0.1),
      ),
      commitment(
        "con-continuity",
        "cultural-plasticity",
        "core",
        "Skepticism that inherited institutions and cultural practices can be redesigned at will is a characteristic descriptive commitment.",
        maximum(0.15),
      ),
      commitment(
        "con-tradition",
        "moral-traditionalism",
        "core",
        "Conservative traditions give inherited moral and social practices some presumptive weight, although their substantive content varies.",
        minimum(-0.05),
      ),
      commitment(
        "con-revolution",
        "reform-vs-revolution",
        "core",
        "Prudential conservatism normally prefers reform within inherited institutions to wholesale revolutionary rupture.",
        maximum(0.25),
      ),
      commitment(
        "con-authority",
        "authority-legitimacy",
        "characteristic",
        "Conservatives characteristically regard legitimate authority and social order as politically important without requiring absolutism.",
        minimum(-0.25),
      ),
      commitment(
        "con-market",
        "market-process-confidence",
        "contested",
        "Conservatism includes market-oriented, paternalist, corporatist, and protectionist currents.",
      ),
      commitment(
        "con-nationalism",
        "political-community-boundary",
        "contested",
        "National attachment is common in many conservative movements but is not constitutive of conservatism as such.",
      ),
    ],
  ),
  spec(
    "profile:democratic-socialist",
    "Democratic socialism is distinguished from social democracy by its commitment to social or democratic control of productive resources, not by simply occupying a more egalitarian point on a shared vector.",
    [
      commitment(
        "ds-social-property",
        "property-legitimacy",
        "constitutive",
        "Democratic socialism requires a significant normative challenge to private control of productive assets and support for social or democratic control.",
        maximum(-0.2),
      ),
      commitment(
        "ds-equality",
        "equality-theory",
        "core",
        "Substantive social and economic equality is a core democratic-socialist commitment.",
        minimum(0.25),
      ),
      commitment(
        "ds-democracy",
        "democratic-confidence",
        "core",
        "Democratic institutions, pluralism, or democratic accountability distinguish democratic socialism from authoritarian socialist forms.",
        minimum(0),
      ),
      commitment(
        "ds-domination",
        "anti-domination",
        "core",
        "Democratic socialism characteristically treats workplace and economic domination as political problems.",
        minimum(0.2),
      ),
      commitment(
        "ds-public-action",
        "state-action-vs-exit",
        "characteristic",
        "Democratic-socialist programs commonly use public institutions, social provision, and democratic collective action, though decentralist variants exist.",
        minimum(-0.1),
      ),
      commitment(
        "ds-regulation",
        "regulation-vs-deregulation",
        "characteristic",
        "Regulation is frequently supported but is secondary to changes in ownership and control.",
        minimum(-0.2),
      ),
      commitment(
        "ds-strategy",
        "reform-vs-revolution",
        "contested",
        "Democratic socialists disagree over parliamentary transition, structural reform, rupture, and extra-parliamentary strategy.",
      ),
      commitment(
        "ds-market",
        "market-process-confidence",
        "contested",
        "Market-socialist and planning-oriented democratic socialists differ over the permissible role of markets.",
      ),
      commitment(
        "ds-private-capital-core",
        "property-legitimacy",
        "incompatible",
        "Treating strong private control of productive capital as normatively sufficient conflicts with the socialist core.",
        minimum(0.8),
      ),
    ],
  ),
  spec(
    "profile:green-politics",
    "Green politics is anchored in ecological standing and sustainability rather than an omnibus left-of-center centroid; economic system, growth strategy, and institutional scale remain important internal divisions.",
    [
      commitment(
        "green-ecological-standing",
        "human-nature-priority",
        "constitutive",
        "Green political ideology gives ecological systems, nonhuman nature, or ecological sustainability independent political weight.",
        minimum(0.3),
      ),
      commitment(
        "green-domination",
        "anti-domination",
        "characteristic",
        "Many green traditions connect ecological politics with critiques of domination and hierarchy, but this is not uniform across all green currents.",
        minimum(-0.05),
      ),
      commitment(
        "green-force",
        "militarism-pacifism",
        "characteristic",
        "Peace and anti-militarist commitments are historically characteristic of many green movements but are not constitutive of ecological politics.",
        maximum(0.4),
      ),
      commitment(
        "green-growth",
        "market-process-confidence",
        "contested",
        "Green traditions include post-growth, ecosocialist, green-liberal, and ecomodernist views with different market assessments.",
      ),
      commitment(
        "green-centralization",
        "centralization-preference",
        "contested",
        "Green politics includes both decentralist and state-capacity-oriented strategies.",
      ),
    ],
  ),
  spec(
    "profile:libertarian-socialism",
    "Libertarian socialism is modeled as the conjunction of socialist economic commitments and anti-authoritarian/decentralist political commitments, with market and transition questions left to subtraditions.",
    [
      commitment(
        "ls-anti-authority",
        "authority-legitimacy",
        "constitutive",
        "Libertarian socialism rejects concentrated or presumptively legitimate political authority.",
        maximum(-0.2),
      ),
      commitment(
        "ls-social-property",
        "property-legitimacy",
        "constitutive",
        "It combines anti-authoritarian politics with a socialist challenge to private control of productive assets.",
        maximum(-0.15),
      ),
      commitment(
        "ls-domination",
        "anti-domination",
        "core",
        "Opposition to domination across political and economic institutions is central.",
        minimum(0.35),
      ),
      commitment(
        "ls-decentralization",
        "centralization-preference",
        "core",
        "Decentralized, federative, or directly democratic organization is characteristic of libertarian-socialist traditions.",
        maximum(0.2),
      ),
      commitment(
        "ls-coordination",
        "coordination-optimism",
        "characteristic",
        "Libertarian socialism relies on the possibility of non-centralized social coordination, though proposed mechanisms differ.",
        minimum(-0.1),
      ),
      commitment(
        "ls-state-action",
        "state-action-vs-exit",
        "contested",
        "Libertarian socialists differ over transitional public institutions, municipalism, dual power, and direct non-state organization.",
      ),
      commitment(
        "ls-markets",
        "market-process-confidence",
        "contested",
        "Market anarchist, mutualist, syndicalist, and communist currents disagree over markets.",
      ),
      commitment(
        "ls-central-authority",
        "centralization-preference",
        "incompatible",
        "Strongly centralized command authority conflicts with libertarian socialism's anti-authoritarian core.",
        minimum(0.75),
      ),
    ],
  ),
  spec(
    "profile:market-right-libertarianism",
    "Right-libertarianism is defined by strong individual liberty, private property, and severely constrained coercive government; minarchism and anarcho-capitalism remain narrower specialist variants.",
    [
      commitment(
        "rl-liberty",
        "liberty-noninterference",
        "constitutive",
        "Strong individual non-interference and constraints on coercion are constitutive of right-libertarianism.",
        minimum(0.4),
      ),
      commitment(
        "rl-property",
        "property-legitimacy",
        "constitutive",
        "Strong private property and contract rights distinguish right-libertarianism from libertarian-socialist families.",
        minimum(0.4),
      ),
      commitment(
        "rl-authority",
        "authority-legitimacy",
        "core",
        "Right-libertarianism subjects political authority to strong justification and limitation.",
        maximum(0.15),
      ),
      commitment(
        "rl-market",
        "market-process-confidence",
        "core",
        "Confidence in market coordination is a core descriptive commitment of market-oriented right-libertarianism.",
        minimum(0.2),
      ),
      commitment(
        "rl-public-choice",
        "public-choice-skepticism",
        "characteristic",
        "Skepticism about state incentives and capture is characteristic.",
        minimum(0.1),
      ),
      commitment(
        "rl-state-action",
        "state-action-vs-exit",
        "core",
        "Right-libertarians characteristically prefer voluntary or private alternatives to expansive public provision.",
        maximum(0.15),
      ),
      commitment(
        "rl-regulation",
        "regulation-vs-deregulation",
        "characteristic",
        "A presumption against extensive economic regulation is characteristic but not sufficient by itself.",
        maximum(0.2),
      ),
      commitment(
        "rl-centralization",
        "centralization-preference",
        "characteristic",
        "Political decentralization is commonly favored as a constraint on coercive power.",
        maximum(0.25),
      ),
      commitment(
        "rl-socialized-property",
        "property-legitimacy",
        "incompatible",
        "A strong commitment against private productive property conflicts with the right-libertarian core.",
        maximum(-0.6),
      ),
    ],
  ),
  spec(
    "profile:marxian-socialism",
    "This replaces the residual 'non-Leninist' centroid with a Marxian-socialist family record. The current construct bank still lacks direct class, exploitation, accumulation, and historical-change measures, so classification remains explicitly research-stage.",
    [
      commitment(
        "mx-social-property",
        "property-legitimacy",
        "constitutive",
        "Marxian socialism rejects private capitalist control of the means of production as the normative endpoint.",
        maximum(-0.2),
      ),
      commitment(
        "mx-equality",
        "equality-theory",
        "core",
        "Material and social emancipation from class hierarchy is central, although Marxian theory is not reducible to distributive equality.",
        minimum(0.2),
      ),
      commitment(
        "mx-market-critique",
        "market-process-confidence",
        "characteristic",
        "Marxian traditions reject treating competitive markets as a sufficient account of capitalist coordination and social power.",
        maximum(0.3),
      ),
      commitment(
        "mx-domination",
        "anti-domination",
        "core",
        "Class domination and dependence are central political concerns.",
        minimum(0.1),
      ),
      commitment(
        "mx-revolution",
        "reform-vs-revolution",
        "contested",
        "Marxian socialists disagree about revolutionary rupture, parliamentary transition, and structural reform.",
      ),
      commitment(
        "mx-state",
        "state-action-vs-exit",
        "contested",
        "Marxian traditions differ sharply over the state, transition, and post-capitalist institutional design.",
      ),
      commitment(
        "mx-class-analysis-gap",
        "public-choice-skepticism",
        "peripheral",
        "The current root construct registry lacks direct measures of class, exploitation, accumulation, and ideology; public-choice skepticism is not used as a proxy.",
      ),
      commitment(
        "mx-private-capital",
        "property-legitimacy",
        "incompatible",
        "Strong normative endorsement of private capitalist ownership as sufficient conflicts with Marxian socialism.",
        minimum(0.8),
      ),
    ],
  ),
  spec(
    "profile:marxist-leninist",
    "Marxism-Leninism is keyed to revolutionary transition, socialist property, and centralized party/state strategy rather than generic authoritarian coordinates. Vanguard-party and democratic-centralism measures remain a required construct gap.",
    [
      commitment(
        "ml-social-property",
        "property-legitimacy",
        "constitutive",
        "Marxism-Leninism rejects private capitalist ownership of the commanding means of production.",
        maximum(-0.45),
      ),
      commitment(
        "ml-revolution",
        "reform-vs-revolution",
        "constitutive",
        "A revolutionary transition beyond the existing capitalist order is central to Marxism-Leninism.",
        minimum(0.3),
      ),
      commitment(
        "ml-centralization",
        "centralization-preference",
        "core",
        "Leninist organization and historical Marxist-Leninist state models give centralized political organization a distinctive role.",
        minimum(0.35),
      ),
      commitment(
        "ml-state-transition",
        "state-action-vs-exit",
        "core",
        "The transitional party/state is central relative to anti-statist socialist alternatives.",
        minimum(0.35),
      ),
      commitment(
        "ml-market-critique",
        "market-process-confidence",
        "core",
        "Marxism-Leninism characteristically rejects market coordination as the organizing principle of the socialist economy.",
        maximum(-0.2),
      ),
      commitment(
        "ml-authority",
        "authority-legitimacy",
        "characteristic",
        "Marxist-Leninist transition theories legitimate concentrated revolutionary authority under specified organizational claims.",
        minimum(0.05),
      ),
      commitment(
        "ml-electoralism",
        "electoralism-vs-direct-action",
        "characteristic",
        "Electoral activity may be tactical, but parliamentarism is not treated as the sole route to transformation.",
        maximum(0.25),
      ),
      commitment(
        "ml-vanguard-gap",
        "expert-confidence",
        "peripheral",
        "The current root bank has no vanguard-party or democratic-centralism construct; expert confidence must not substitute for it.",
      ),
      commitment(
        "ml-private-capital",
        "property-legitimacy",
        "incompatible",
        "Strong endorsement of private capitalist ownership is incompatible with the Marxist-Leninist core.",
        minimum(0.75),
      ),
    ],
  ),
  spec(
    "profile:republicanism",
    "Republicanism is anchored in non-domination and contestable power. It is no longer placed at an arbitrary point on a generic liberty centroid.",
    [
      commitment(
        "rep-nondomination",
        "anti-domination",
        "constitutive",
        "Freedom as protection against arbitrary or uncontrolled power is constitutive of the republican family.",
        minimum(0.35),
      ),
      commitment(
        "rep-authority",
        "authority-legitimacy",
        "core",
        "Political power must be legally constrained, contestable, and justified rather than arbitrary.",
        maximum(0.35),
      ),
      commitment(
        "rep-institutions",
        "centralization-preference",
        "characteristic",
        "Dispersal and contestability of public power are characteristic, though republicans disagree over federal scale.",
        maximum(0.4),
      ),
      commitment(
        "rep-democracy",
        "democratic-confidence",
        "contested",
        "Republican traditions vary between participatory, representative, mixed-government, and constitutional emphases.",
      ),
      commitment(
        "rep-property",
        "property-legitimacy",
        "contested",
        "Property independence matters in many republican theories, but the appropriate property regime is internally contested.",
      ),
      commitment(
        "rep-liberty-axis",
        "liberty-noninterference",
        "contested",
        "The current liberty construct conflates non-interference with rival conceptions, so republican non-domination is measured directly rather than inferred from this axis.",
      ),
      commitment(
        "rep-domination",
        "anti-domination",
        "incompatible",
        "Acceptance of unchecked arbitrary domination conflicts with republicanism's constitutive conception of freedom.",
        maximum(-0.5),
      ),
    ],
  ),
  spec(
    "profile:social-democrat",
    "Social democracy is modeled around democracy, equality, social insurance, labor and market governance, and reformist collective action rather than as a midpoint between liberalism and socialism.",
    [
      commitment(
        "sd-equality",
        "equality-theory",
        "constitutive",
        "Substantive social and economic equality is a constitutive social-democratic objective.",
        minimum(0.25),
      ),
      commitment(
        "sd-democracy",
        "democratic-confidence",
        "core",
        "Democratic political institutions and collective action are central to social democracy.",
        minimum(0.15),
      ),
      commitment(
        "sd-reform",
        "reform-vs-revolution",
        "core",
        "Modern social democracy characteristically seeks transformation through democratic reform rather than revolutionary replacement of constitutional government.",
        maximum(-0.2),
      ),
      commitment(
        "sd-public-action",
        "state-action-vs-exit",
        "core",
        "Social insurance, public services, and collective provision are central social-democratic instruments.",
        minimum(0.15),
      ),
      commitment(
        "sd-regulation",
        "regulation-vs-deregulation",
        "characteristic",
        "Regulation of markets and labor relations is characteristic of social-democratic governance.",
        minimum(0.05),
      ),
      commitment(
        "sd-redistribution",
        "redistribution-vs-predistribution",
        "characteristic",
        "Redistribution is characteristic, while social democracy may also support predistribution and labor-market institutions.",
        minimum(0.1),
      ),
      commitment(
        "sd-property",
        "property-legitimacy",
        "contested",
        "Social democracy historically spans socialization, mixed-economy, and regulated-capitalist positions; private property is not assigned a universal target.",
      ),
      commitment(
        "sd-market",
        "market-process-confidence",
        "contested",
        "Social democrats disagree over the desirable scope of markets while accepting substantial democratic regulation.",
      ),
      commitment(
        "sd-authoritarian",
        "democratic-confidence",
        "incompatible",
        "Deep rejection of democratic political accountability conflicts with the social-democratic core.",
        maximum(-0.7),
      ),
    ],
  ),
  spec(
    "profile:social-liberalism",
    "Social liberalism combines liberal rights and constitutionalism with effective liberty, opportunity, social provision, and regulated markets; it is not defined as a numerical midpoint between classical liberalism and social democracy.",
    [
      commitment(
        "sl-limited-authority",
        "authority-legitimacy",
        "constitutive",
        "Social liberalism retains the liberal requirement that political authority be limited and justified.",
        maximum(0.4),
      ),
      commitment(
        "sl-effective-liberty",
        "equality-theory",
        "core",
        "Social liberalism treats material opportunity and effective agency as relevant to equal freedom without requiring strict outcome equality.",
        minimum(0.05),
      ),
      commitment(
        "sl-democracy",
        "democratic-confidence",
        "core",
        "Constitutional democracy is a core institutional commitment of contemporary social liberalism.",
        minimum(0.1),
      ),
      commitment(
        "sl-market",
        "market-process-confidence",
        "characteristic",
        "Social liberalism generally retains a market economy while treating markets as institutions subject to public rules and correction.",
        minimum(-0.1),
      ),
      commitment(
        "sl-public-action",
        "state-action-vs-exit",
        "characteristic",
        "Public provision and regulation may be legitimate means of securing effective liberty and opportunity.",
        minimum(-0.05),
      ),
      commitment(
        "sl-reform",
        "reform-vs-revolution",
        "core",
        "Social liberalism is reformist and constitutional rather than revolutionary.",
        maximum(0.2),
      ),
      commitment(
        "sl-coercion",
        "coercion-strategy",
        "core",
        "Liberal constitutionalism constrains coercive political means.",
        maximum(0.25),
      ),
      commitment(
        "sl-property",
        "property-legitimacy",
        "characteristic",
        "Social liberals generally accept private property while permitting stronger social regulation than classical liberals.",
        minimum(-0.2),
      ),
      commitment(
        "sl-welfare-scope",
        "state-action-vs-exit",
        "contested",
        "The scale and institutional design of welfare provision varies across social-liberal traditions.",
      ),
      commitment(
        "sl-unlimited-authority",
        "authority-legitimacy",
        "incompatible",
        "Presumptively unlimited political authority conflicts with the liberal core.",
        minimum(0.85),
      ),
    ],
  ),
] satisfies readonly PrimaryIdeologyCommitmentSpec[]);

export const DEMOTED_PRIMARY_PROFILE_IDS = Object.freeze([
  "profile:liberal-conservatism",
  "profile:market-liberal",
  "profile:national-conservatism",
  "profile:radical-democracy",
] as const);

const commitmentSpecByProfileId = new Map(
  PRIMARY_IDEOLOGY_COMMITMENT_SPECS.map((entry) => [entry.profileId, entry]),
);
const demotedPrimaryIds = new Set<string>(DEMOTED_PRIMARY_PROFILE_IDS);

export function getPrimaryIdeologyCommitmentSpec(
  profileId: string,
): PrimaryIdeologyCommitmentSpec | undefined {
  return commitmentSpecByProfileId.get(profileId);
}

export function isDemotedPrimaryProfile(profileId: string): boolean {
  return demotedPrimaryIds.has(profileId);
}

export function commitmentCriterionSatisfied(
  score: number,
  criterion: CommitmentCriterion,
): boolean {
  switch (criterion.operator) {
    case "minimum":
      return score >= criterion.minimum;
    case "maximum":
      return score <= criterion.maximum;
    case "interval":
      return score >= criterion.minimum && score <= criterion.maximum;
  }
}

export function commitmentCriterionAnchor(
  criterion: CommitmentCriterion,
): number {
  switch (criterion.operator) {
    case "minimum":
      return criterion.minimum;
    case "maximum":
      return criterion.maximum;
    case "interval":
      return (criterion.minimum + criterion.maximum) / 2;
  }
}

export function commitmentAffinityWeight(
  relation: PrimaryCommitmentRelation,
): number {
  if (relation === "core") return 2;
  if (relation === "characteristic") return 1;
  return 0;
}

export function isAffinityCommitment(
  commitment: PrimaryIdeologyCommitment,
): boolean {
  return commitmentAffinityWeight(commitment.relation) > 0 && commitment.criterion !== undefined;
}

export function isDecisiveCommitment(
  commitment: PrimaryIdeologyCommitment,
): boolean {
  return (
    (commitment.relation === "constitutive" || commitment.relation === "incompatible") &&
    commitment.criterion !== undefined
  );
}
