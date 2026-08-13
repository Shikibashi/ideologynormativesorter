import type { LabelId, QuestionId } from "../types";

/**
 * Direct measurement contract for public cross-cutting modifiers.
 *
 * A catalog modifier may be well defined without being defensibly inferable
 * from the 26-axis primary-profile model.  Ordinary modifier output is
 * therefore limited to constructs with direct core indicators.  The registry
 * deliberately leaves catalog-only and focused-follow-up modifiers visible in
 * the catalog, but prevents them from being reconstructed from a neighbouring
 * primary ideology, broad axis, or host ideology.
 */
export const MODIFIER_MEASUREMENT_VERSION = "2026-08-modifier-construct-v1";

export type ModifierMeasurementAvailability =
  | "core-construct"
  | "focused-follow-up"
  | "catalog-only";

export interface ModifierIndicator {
  questionId: QuestionId;
  /** +1 means agreement supports the construct; -1 means disagreement does. */
  direction: 1 | -1;
  /** Narrow reason this item belongs in this construct, not in a host ideology. */
  rationale: string;
}

export interface ModifierMeasurementDefinition {
  labelId: LabelId;
  availability: ModifierMeasurementAvailability;
  constructName: string;
  /** Respondent-facing boundary for the construct match. */
  note: string;
  /** Direct core indicators, present only when ordinary matching is allowed. */
  indicators?: readonly ModifierIndicator[];
  /** Minimum substantive direct indicators required before ordinary output. */
  minimumAnsweredItems?: number;
}

const indicator = (
  questionId: QuestionId,
  rationale: string,
  direction: 1 | -1 = 1,
): ModifierIndicator => ({ questionId, direction, rationale });

const coreConstruct = (
  labelId: LabelId,
  constructName: string,
  note: string,
  indicators: readonly ModifierIndicator[],
): ModifierMeasurementDefinition => ({
  labelId,
  availability: "core-construct",
  constructName,
  note,
  indicators,
  minimumAnsweredItems: 2,
});

const focusedFollowUp = (
  labelId: LabelId,
  constructName: string,
  note: string,
): ModifierMeasurementDefinition => ({
  labelId,
  availability: "focused-follow-up",
  constructName,
  note,
});

const catalogOnly = (
  labelId: LabelId,
  constructName: string,
  note: string,
): ModifierMeasurementDefinition => ({
  labelId,
  availability: "catalog-only",
  constructName,
  note,
});

export const modifierMeasurementDefinitions = [
  coreConstruct(
    "anti-imperialism",
    "Anti-imperial restraint",
    "This limited core construct concerns equal moral standing across borders and resistance to domination or externally imposed rule. It does not settle pacifism, defensive force, trade policy, or every historical anti-colonial program.",
    [
      indicator("q0321", "Equal moral standing for foreign civilians."),
      indicator(
        "q0322",
        "Rejects prestige-, empire-, or crusade-driven use of a state population.",
      ),
      indicator(
        "q0323",
        "Distinguishes defense from regime transformation abroad.",
      ),
      indicator(
        "q0326",
        "Separates solidarity with oppressed people from military control over them.",
      ),
    ],
  ),
  catalogOnly(
    "civic-nationalist",
    "Civic basis of national membership",
    "The core measures civic membership and rejection of ancestry-based exclusion, but not whether national attachment or self-determination is politically primary. It must not relabel liberal constitutionalism, cosmopolitanism, or equal-citizenship views as civic nationalism.",
  ),
  catalogOnly(
    "communitarianism",
    "Socially embedded obligation and the common good",
    "The core bank addresses community-related policies but does not yet distinguish a communitarian account of persons and obligations from conservative tradition, civic republicanism, welfare solidarity, or localism.",
  ),
  coreConstruct(
    "cosmopolitanism",
    "Equal moral concern across borders",
    "This construct concerns moral standing and layered membership beyond nationality. It does not choose world government, open borders in every circumstance, or one theory of distributive justice.",
    [
      indicator(
        "q0201",
        "Rejects birthplace as a morally sufficient basis for excluding peaceful people from ordinary opportunity.",
      ),
      indicator(
        "q0321",
        "Treats foreign civilians as no less morally important because of political borders.",
      ),
      indicator(
        "q0233",
        "Permits local, regional, national, and cosmopolitan affiliations to coexist.",
      ),
    ],
  ),
  coreConstruct(
    "civil-libertarianism",
    "Civil-liberties constraint",
    "This construct concerns strong default protection for speech, privacy, association, religion, due process, and bodily autonomy. It does not infer a property theory, market program, or minimal-state position.",
    [
      indicator(
        "q0161",
        "Tests protection for dissenting and unpopular expression.",
      ),
      indicator(
        "q0164",
        "Tests privacy as a condition for dissent and minority life.",
      ),
      indicator(
        "q0173",
        "Tests a default rights regime across speech, encryption, association, religion, and due process.",
      ),
    ],
  ),
  coreConstruct(
    "decentralist-orientation",
    "Polycentric and decentralized institutional preference",
    "This construct concerns preference for plural, locally responsive, and contestable institutions. It does not identify separatism, anarchism, local-majoritarian rule, or one economic system.",
    [
      indicator(
        "q0015",
        "Tests dispersing reform authority across independently accountable institutions.",
      ),
      indicator(
        "q0018",
        "Tests divided rather than unitary executive control of enforcement agencies.",
      ),
      indicator(
        "q0053",
        "Tests decentralized experimentation instead of one mandatory production plan.",
      ),
    ],
  ),
  catalogOnly(
    "economic-nationalism",
    "National productive capacity and strategic autonomy",
    "The core bank has trade and state-capacity material, but no direct construct set separating national productive priority from protectionism, developmentalism, public ownership, or ordinary market skepticism.",
  ),
  focusedFollowUp(
    "ethnonationalist",
    "Ethnic centrality in national membership",
    "Ethnic belonging, assimilation, minority self-determination, and exclusion are distinct variants. The identity-and-sovereignty follow-up is required instead of inferring this sensitive construct from nationalism, tradition, or immigration views.",
  ),
  catalogOnly(
    "expansionist-nationalism",
    "Expansionist territorial-national project",
    "The core contains restraint and military-power material, but not a direct construct set for territorial expansion, imperial project, annexation, or irredentism.",
  ),
  catalogOnly(
    "fiscal-conservatism",
    "Fiscal restraint and public-finance orientation",
    "Debt sustainability, deficit restraint, balanced-budget rules, tax structure, spending cuts, and austerity are not interchangeable. The present bank has no direct multi-item fiscal construct and must not use generic small-state or market views as a proxy.",
  ),
  catalogOnly(
    "internationalism",
    "Cooperation and solidarity across political communities",
    "The core distinguishes cross-border concern from institutional cooperation imperfectly. A future construct must separate international cooperation from cosmopolitan moral scope and from a specific world-federal institutional proposal.",
  ),
  coreConstruct(
    "feminist-orientation",
    "Gendered power and liberation orientation",
    "This construct concerns gendered hierarchy, dependency, and liberation as political concerns. It does not select liberal, radical, socialist, Black, queer, or anarchist feminist theory; those remain focused follow-up distinctions.",
    [
      indicator("q0261", "Tests freedom from coercive household forms."),
      indicator(
        "q0264",
        "Tests whether formal family consent is adequate under blocked exit, violence, or dependency.",
      ),
      indicator(
        "q0421",
        "Tests structural gender and sexual hierarchy beyond formal equal rights.",
      ),
    ],
  ),
  catalogOnly(
    "left-wing-nationalism",
    "Left-national host combination",
    "This label combines a national orientation with a particular egalitarian or anti-colonial host ideology. It must not be reconstructed by merging nearby nationalism and left-primary scores without direct evidence of the combination.",
  ),
  catalogOnly(
    "left-wing-populism",
    "Left-populist thin-plus-host combination",
    "The core bank does not yet measure people-centrism, anti-elitism, and anti-pluralism as a distinct thin construct, so it cannot combine that absent evidence with an egalitarian host profile.",
  ),
  coreConstruct(
    "multiculturalism",
    "Plural accommodation with equal status",
    "This construct concerns equal standing alongside voluntary cultural association and plural difference. It does not settle every accommodation, self-government, representation, religious-exemption, or reparative-policy dispute.",
    [
      indicator(
        "q0281",
        "Tests rejection of inherited group status as a basis for legal standing and opportunity.",
      ),
      indicator(
        "q0282",
        "Tests equal citizenship without making cultural uniformity a condition.",
      ),
      indicator(
        "q0293",
        "Tests equal individual rights alongside voluntary cultural association.",
      ),
    ],
  ),
  catalogOnly(
    "regionalism",
    "Regional political identity and authority",
    "The core distinguishes local and national scale but does not directly measure regional identity, regional authority, or the institutional forms through which regionalism is expressed.",
  ),
  catalogOnly(
    "right-wing-populism",
    "Right-populist thin-plus-host combination",
    "The core bank does not yet measure the required populist thin ideology separately from nationalism, nativism, social conservatism, or market and welfare views.",
  ),
  catalogOnly(
    "separatist-nationalism",
    "Separatist national self-determination project",
    "The core discusses safeguards around secession but does not measure whether a respondent favors independent statehood rather than autonomy, federation, or shared-state self-government.",
  ),
  catalogOnly(
    "progressivism",
    "Progressive social-improvement orientation",
    "Reform strategy and cultural change appear in the core bank, but it does not yet distinguish a progressive orientation from liberalism, social democracy, radical democracy, or a specific reform program.",
  ),
  catalogOnly(
    "social-conservatism",
    "Social and moral traditionalism",
    "The core measures particular family, religion, and cultural-policy claims, but it does not yet isolate a non-theocratic, non-nationalist social-conservative orientation from support for any one religious or legal enforcement mechanism.",
  ),
  coreConstruct(
    "technocratic-orientation",
    "Accountable evidence-guided administration",
    "This construct concerns confidence in transparent, contestable technical expertise and implementation. It does not infer insulated expert rule or centralized administration, which remain a separate specialist compound.",
    [
      indicator(
        "q0458",
        "Tests whether checkable methods and reported uncertainty improve expert advice.",
      ),
      indicator(
        "q0460",
        "Tests whether independent technical expertise can improve public decisions when openly contestable.",
      ),
      indicator(
        "q0476",
        "Tests accountable challenge, transparency, and limits around expert recommendations.",
      ),
    ],
  ),
  catalogOnly(
    "nationalism",
    "National attachment, continuity, and civic membership",
    "The core contains individual questions about permissible civic belonging, national memory, and cultural continuity. It does not yet directly distinguish national political priority from cosmopolitan duty, civic patriotism, cultural conservatism, or immigration restriction, so it cannot support an ordinary nationalism result.",
  ),
  catalogOnly(
    "populism",
    "People-versus-elite thin ideology",
    "People-centrism, anti-elitism, and anti-pluralism require direct joint measurement. Generic distrust of institutions, nativism, direct democracy, or host ideology is not a valid proxy.",
  ),
  catalogOnly(
    "transhumanism",
    "Deliberate human enhancement orientation",
    "The core contains one human-enhancement item but no multi-item construct distinguishing voluntary enhancement from privacy, anti-surveillance, technology optimism, or coercive deployment.",
  ),
] as const satisfies readonly ModifierMeasurementDefinition[];

export const modifierMeasurementByLabelId = new Map<
  LabelId,
  ModifierMeasurementDefinition
>(
  modifierMeasurementDefinitions.map((definition) => [
    definition.labelId,
    definition,
  ]),
);

export function modifierMeasurementForLabel(
  labelId: LabelId,
): ModifierMeasurementDefinition | undefined {
  return modifierMeasurementByLabelId.get(labelId);
}
