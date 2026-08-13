import type { IdeologyLabel, LabelId, LabelScoringScope } from "../types";

/**
 * This registry separates a primary tradition's constitutive comparison
 * constructs from the wider, legacy centroid used for catalog continuity.
 * It does not claim that a source validates a numeric centroid or that a
 * respondent who fits a comparison scope belongs to the tradition.
 */
export const PRIMARY_MEASUREMENT_VERSION = "2026-08-primary-core-v1";

function coreScope(
  axisIds: readonly string[],
  requiredAxisIds: readonly string[],
  sourceIds: readonly string[],
  rationale: string,
  limitation?: string,
  minimumItemCounts?: LabelScoringScope["minimumItemCounts"],
): LabelScoringScope {
  return {
    version: PRIMARY_MEASUREMENT_VERSION,
    axisIds,
    requiredAxisIds,
    sourceIds,
    rationale,
    ...(limitation ? { limitation } : {}),
    ...(minimumItemCounts ? { minimumItemCounts } : {}),
  };
}

/**
 * Broad primaries are compared only on claims their definition makes central.
 * Required axes are an abstention boundary, not a positional gate: a measured
 * disagreement can still be reported as a low-fit neighbor, but an unmeasured
 * constitutive construct cannot be silently replaced by unrelated agreement.
 */
export const primaryScoringScopeByLabelId = {
  "market-liberal": coreScope(
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    ["oxford-market-liberalism"],
    "The family is compared through constitutional public authority, private-property legitimacy, liberty, and confidence in market coordination. Including authority prevents a broadly market-oriented liberal position from being silently collapsed into the more state-skeptical right-libertarian lineage; it does not infer a fixed welfare, tax, trade, or deregulation package.",
  ),
  "democratic-socialist": coreScope(
    ["property-legitimacy", "equality-theory", "anti-domination"],
    ["property-legitimacy", "equality-theory", "anti-domination"],
    ["sep-socialism", "oxford-american-democratic-socialism"],
    "The ordinary comparison tests social-ownership and egalitarian anti-domination commitments, not a party or one transition strategy.",
    "The bank has no direct democratic-control or workplace-self-government construct, so this cannot distinguish every democratic-socialist account of democracy.",
  ),
  "social-democrat": coreScope(
    [
      "property-legitimacy",
      "equality-theory",
      "state-action-vs-exit",
      "reform-vs-revolution",
    ],
    ["property-legitimacy", "equality-theory", "state-action-vs-exit"],
    ["routledge-social-democracy", "oxford-ethics-social-democracy"],
    "The comparison distinguishes egalitarian public provision and reform of a mixed economy from a commitment to replace private ownership outright.",
    "Specific tax, welfare, labor, and regulatory models remain outside the ordinary family score.",
  ),
  "christian-democrat": coreScope(
    [
      "property-legitimacy",
      "equality-theory",
      "centralization-preference",
      "secularism-religious",
    ],
    [
      "property-legitimacy",
      "equality-theory",
      "centralization-preference",
      "secularism-religious",
    ],
    ["eui-christian-democracy", "cambridge-christian-democracy-subsidiarity"],
    "The comparison uses social-market, solidarity, subsidiarity, and religious-social-ethics dimensions without equating Christian democracy with theocracy.",
    "The secularism axis is only a limited proxy for Christian social thought; it does not identify a denomination, party, or clerical authority.",
  ),
  "marxist-leninist": coreScope(
    [
      "authority-legitimacy",
      "property-legitimacy",
      "market-process-confidence",
      "centralization-preference",
      "reform-vs-revolution",
      "state-action-vs-exit",
    ],
    [
      "authority-legitimacy",
      "property-legitimacy",
      "centralization-preference",
      "reform-vs-revolution",
      "state-action-vs-exit",
    ],
    ["sep-socialism", "cambridge-marxism-leninism-discourse"],
    "The family comparison is limited to socialist property commitments and the party-state, centralized, revolutionary transition captured by the existing constitutive gate.",
    "It does not establish a national variant, historical regime, party affiliation, or endorsement of any historical practice.",
  ),
  "classical-liberalism": coreScope(
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    ["sep-liberalism"],
    "The comparison centers limited authority, private property, liberty as non-interference, and the market order, while leaving the permissible scope of public goods and social policy open.",
  ),
  "social-liberalism": coreScope(
    ["liberty-noninterference", "equality-theory", "state-action-vs-exit"],
    ["liberty-noninterference", "equality-theory", "state-action-vs-exit"],
    ["cambridge-social-liberalism-positive-liberty"],
    "The comparison tests a liberal account of effective opportunity and public action, rather than treating market confidence or electoral tactics as defining.",
  ),
  republicanism: coreScope(
    ["authority-legitimacy", "liberty-noninterference", "anti-domination"],
    ["liberty-noninterference", "anti-domination"],
    ["sep-republicanism"],
    "The comparison centers non-domination and the republican contrast with freedom understood only as non-interference.",
    "Civic self-government is not yet a dedicated ordinary construct, so the score does not choose among republican institutional models.",
  ),
  "libertarian-socialism": coreScope(
    [
      "authority-legitimacy",
      "property-legitimacy",
      "equality-theory",
      "anti-domination",
      "centralization-preference",
    ],
    [
      "authority-legitimacy",
      "property-legitimacy",
      "equality-theory",
      "anti-domination",
    ],
    ["sep-socialism", "sep-anarchism"],
    "The comparison uses anti-authoritarian, egalitarian, anti-domination, and anti-capitalist commitments while leaving markets, organization, and strategy open.",
  ),
  "radical-democracy": coreScope(
    [
      "authority-legitimacy",
      "equality-theory",
      "anti-domination",
      "centralization-preference",
    ],
    ["equality-theory", "anti-domination"],
    ["sep-radical-democracy"],
    "The comparison registers equality, contestation of concentrated power, and participatory anti-domination without treating formal electoralism as a definition.",
    "The bank lacks a dedicated popular-sovereignty or participatory-self-government construct; this is a constrained family comparison, not a full radical-democracy measure.",
  ),
  "national-conservatism": coreScope(
    [
      "political-community-boundary",
      "moral-traditionalism",
      "cultural-plasticity",
    ],
    ["political-community-boundary", "cultural-plasticity"],
    ["sep-conservatism", "tandf-national-conservatism"],
    "The comparison combines national priority with conservative resistance to deliberate cultural redesign; it does not infer one economic, religious, or authoritarian program.",
    "The moral-traditionalism axis is an imperfect proxy for national-traditional claims and is not a claim that every national conservative favors the same family or religious policy.",
  ),
  "liberal-conservatism": coreScope(
    [
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
      "cultural-plasticity",
      "gradualism-vs-immediatism",
    ],
    [
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
      "cultural-plasticity",
    ],
    ["oxford-conservative-liberalism"],
    "The comparison requires a liberal market-and-rights orientation alongside a prudential constraint on rapid institutional redesign.",
    "It does not settle whether the tradition should be called conservative liberalism, liberal conservatism, or ordoliberalism in a particular national setting.",
  ),
  conservative: coreScope(
    [
      "cultural-plasticity",
      "reform-vs-revolution",
      "gradualism-vs-immediatism",
    ],
    ["cultural-plasticity", "gradualism-vs-immediatism"],
    ["sep-prudential-conservatism"],
    "The broad prudential anchor is compared through skepticism about deliberate cultural redesign and preference for gradual, reforming change, not through social conservatism, nationalism, or small-government proxies.",
    "The bank does not yet contain a dedicated institutional-prudence construct, so this comparison is deliberately narrow and will abstain in short forms without the required evidence.",
  ),
  "green-politics": coreScope(
    ["human-nature-priority"],
    ["human-nature-priority"],
    ["sep-green-political-ecology"],
    "The broad green anchor is compared only through independent moral standing for the nonhuman world; it does not infer a position on growth, markets, technology, authority, or strategy.",
    "Green political ecology is multi-affinity. The ordinary score is a family signal, while its morphology requires the opt-in green module.",
    { "human-nature-priority": 2 },
  ),
  "market-right-libertarianism": coreScope(
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    [
      "authority-legitimacy",
      "property-legitimacy",
      "liberty-noninterference",
      "market-process-confidence",
    ],
    ["sep-market-right-libertarianism"],
    "The comparison centers skepticism of centralized coercive authority, strong property and non-interference claims, and voluntary market coordination.",
    "It does not decide the state question, property-acquisition theory, or whether an anarcho-capitalist current belongs under anarchism.",
  ),
  "marxian-socialism": coreScope(
    ["property-legitimacy", "equality-theory", "anti-domination"],
    ["property-legitimacy", "equality-theory", "anti-domination"],
    ["sep-marxian-socialism"],
    "The non-Leninist Marxian anchor is compared through social ownership, egalitarianism, and emancipation from domination, without importing one party, planning, market, or revolutionary strategy.",
    "The ordinary bank has no direct class-structure or historical-materialism construct, so this cannot identify a complete Marxian theory.",
  ),
} as const satisfies Readonly<Partial<Record<LabelId, LabelScoringScope>>>;

export function attachPrimaryScoringScope<T extends IdeologyLabel>(
  label: T,
): T {
  const scoringScope =
    primaryScoringScopeByLabelId[
      label.id as keyof typeof primaryScoringScopeByLabelId
    ];
  return scoringScope ? ({ ...label, scoringScope } as T) : label;
}
