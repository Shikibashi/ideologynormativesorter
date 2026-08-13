import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_SEVENTEENTH_PASS_VERSION = "2026-08-editorial-v17";
export const EDITORIAL_SEVENTEENTH_PASS_DATE = "2026-08-12";

export interface SeventeenthPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass narrows active descriptive items whose sources supported a
 * mechanism or institutional pattern but not the original universal,
 * rhetorical, or motive-imputing wording.
 */
export const seventeenthPassRewritesById: Readonly<
  Record<string, SeventeenthPassRewrite>
> = {
  q0012: {
    prompt:
      "In documented common-pool and polycentric settings, durable cooperation has relied on predictable rules, monitoring, graduated sanctions, and accessible conflict resolution.",
    rationale:
      "Scope the broad order claim to the institutional settings and mechanisms documented by Ostrom rather than treating polycentric governance as a universal substitute for sovereignty.",
    evidenceNote:
      "Scope to documented common-pool and polycentric settings: compare whether predictable rules, monitoring, graduated sanctions, and accessible conflict resolution are present where cooperation persists. The evidence does not establish that every stable order can dispense with a sovereign or that polycentric governance always works.",
    sourceIds: ["polycentricGovernance"],
  },
  q0027: {
    prompt:
      "In documented land-tenure systems, clear possession, transfer, and dispute-resolution rules can reduce overlapping claims while also distributing access and bargaining power.",
    rationale:
      "Remove the unsupported “artificial scarcity” condition and make the item cover both the conflict-reduction mechanism and the institutional distributional tradeoff.",
    evidenceNote:
      "Scope to land and resource-tenure systems: compare overlapping claims and disputes under different rules for possession, transfer, and resolution, while separately recording how those rules distribute scarcity, access, and bargaining power.",
    sourceIds: ["property", "landTenure"],
  },
  q0030: {
    prompt:
      "In state-owned enterprises, public ownership changes the governance chain but does not by itself remove managerial hierarchy or accountability problems.",
    rationale:
      "Replace the stronger claim that ownership “often transfers control” with the source-supported distinction between ownership and governance structure.",
    evidenceNote:
      "Scope to state-owned enterprises: compare ownership, board autonomy, managerial hierarchy, disclosure, and accountability. Public ownership changes the principal and governance chain but does not by itself determine how much control political managers exercise or how well the enterprise performs.",
    sourceIds: ["stateOwnedGovernance"],
  },
  q0047: {
    prompt:
      "In market exchanges, prices can transmit some dispersed information without any participant knowing the whole economy, although market power and externalities can limit that function.",
    rationale:
      "Add the mechanism’s scope and principal qualifications so the Hayekian information claim is not read as a complete defense of markets.",
    evidenceNote:
      "Scope to the information function of prices in market exchange. Prices can transmit some dispersed signals without centralized knowledge, but this does not resolve market power, externalities, missing markets, distributional conflict, or every coordination problem.",
    sourceIds: ["marketsKnowledge"],
  },
  q0048: {
    prompt:
      "Centralized planners may lack access to changing, local, or tacit information even when they are honest and technically competent.",
    rationale:
      "Replace rhetorical character traits with the specific information-access problem supported by the cited economic literature.",
    evidenceNote:
      "Scope to centralized planning and the availability of local, changing, or tacit information. The item concerns information access rather than planner motives or intelligence; it does not imply that markets solve every coordination problem or that planning never improves outcomes.",
    sourceIds: ["marketsKnowledge", "polycentricGovernance"],
  },
  q0148: {
    prompt:
      "In patent-intensive sectors, portfolios may be used for commercialization, licensing, cross-licensing, litigation strategy, or defense as well as for protecting inventions.",
    rationale:
      "Remove the unsupported comparison that strategic use displaces useful disclosure and distinguish portfolio strategy from the patent system’s disclosure function.",
    evidenceNote:
      "Scope to patent-intensive sectors and distinguish commercialization, licensing, cross-licensing, litigation strategy, and defensive accumulation. The item does not claim that patents generally fail to disclose inventions or that one portfolio motive dominates across industries.",
    sourceIds: ["patentStrategies"],
  },
  q0171: {
    prompt:
      "Emergency-law frameworks use sunset clauses, renewal limits, and periodic review because exceptional powers can persist beyond the conditions that prompted them.",
    rationale:
      "Replace the broad panic-and-law causal story with the narrower institutional persistence risk directly reflected in emergency-law safeguards.",
    evidenceNote:
      "Scope to institutional safeguards for exceptional powers: sunset clauses, renewal limits, and periodic review are used because emergency measures can persist after their original justification changes. The item does not claim that every crisis law outlasts its trigger or that all emergency powers are illegitimate.",
    sourceIds: ["emergencyPowers", "democracy"],
  },
  q0188: {
    prompt:
      "Law-enforcement performance systems distinguish activity measures such as arrests and response times from outcomes such as safety, trust, and perceived legitimacy.",
    rationale:
      "Turn the relative-ease claim into a source-supported distinction between activity and outcome measures without implying that every department ignores safety.",
    evidenceNote:
      "Scope to law-enforcement performance measurement: distinguish activity measures such as arrests, response times, and budgets from outcomes such as safety, perceived safety, trust, and satisfaction. The item does not say that activity measures are useless or that every agency gives them priority.",
    sourceIds: ["policePerformance"],
  },
  q0190: {
    prompt:
      "When law-enforcement agencies can receive or spend forfeiture proceeds, the funding structure creates a potential resource incentive around seizures.",
    rationale:
      "Make the incentive claim conditional and institutional rather than asserting that forfeiture necessarily turns property into revenue in every case.",
    evidenceNote:
      "Scope to forfeiture systems with agency access to proceeds or equitable-sharing payments. The funding structure creates a potential resource incentive around seizures; this does not establish improper motive in a particular case or imply that all forfeiture is revenue-seeking.",
    sourceIds: ["forfeitureFunding"],
  },
  q0269: {
    prompt:
      "Tax-transfer and benefit rules can produce different eligibility and net-transfer outcomes for households classified by marriage, children, cohabitation, or other characteristics.",
    rationale:
      "Replace the metaphor of administrative invisibility with the measurable classification and transfer differences documented in household-typology research.",
    evidenceNote:
      "Scope to tax-transfer and benefit rules that classify households by marriage, children, cohabitation, or other characteristics. The item asks about different eligibility and net-transfer outcomes, not whether one household form is universally privileged or another is literally invisible.",
    sourceIds: ["householdTypologies"],
  },
  q0308: {
    prompt:
      "Command-and-control environmental rules can distribute compliance burdens unevenly across firms, industries, and facilities, so effects on incumbents and entrants must be measured.",
    rationale:
      "Replace the unsupported directional claim that these rules often favor large incumbents with the empirically testable incidence question supported by EPA cost studies.",
    evidenceNote:
      "Scope to the distribution of compliance burdens by firm size, industry, facility age, and design under a named command-and-control rule. Evidence can show pressure on smaller or newer entrants or other uneven effects, but the direction and magnitude must be measured rather than assumed from the policy label.",
    sourceIds: ["environmentalComplianceCosts"],
  },
  q0348: {
    prompt:
      "In low-salience elections or policy domains, information acquisition can be limited by the small expected effect of an individual vote and by issue salience.",
    rationale:
      "Scope the rational-ignorance mechanism to low-salience settings and avoid claiming that voters generally lack information or incentives.",
    evidenceNote:
      "Scope to low-salience elections or policy domains: information acquisition can vary with issue salience, electoral institutions, media exposure, and the expected effect of an individual vote. The item does not claim that voters are generally uninformed or that expertise should replace democratic judgment.",
    sourceIds: ["democracy", "electoralJustice"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialSeventeenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = seventeenthPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_SEVENTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_SEVENTEENTH_PASS_DATE,
    deprecationReason: undefined,
  };
}
