import type { AxisWeight, Question } from "../types";

export const EDITORIAL_TWENTY_FIFTH_PASS_VERSION = "2026-08-editorial-v25";
export const EDITORIAL_TWENTY_FIFTH_PASS_DATE = "2026-08-12";

interface ConstructCorrection {
  rationale: string;
  prompt?: string;
  axisWeights: readonly AxisWeight[];
}

/**
 * Corrects descriptive items whose empirical mechanism was being used as an
 * unsupported proxy for a neighboring construct. Agreement with a finding
 * about licensing, legal enforcement, or information asymmetry should not
 * automatically be scored as low state capacity, low expertise, or capture
 * skepticism unless the item actually makes that claim.
 */
export const descriptiveConstructCorrectionsById: Readonly<
  Record<string, ConstructCorrection>
> = {
  q0012: {
    rationale:
      "Predictable rules, monitoring, graduated sanctions, and conflict resolution directly describe conditions for durable coordination; they do not establish low state capacity or public capture.",
    axisWeights: [{ axisId: "coordination-optimism", weight: 0.8 }],
  },
  q0027: {
    rationale:
      "Clear land-tenure and dispute-resolution rules are an empirical coordination mechanism, not evidence that public institutions are captured or that markets generally misallocate.",
    axisWeights: [{ axisId: "coordination-optimism", weight: 0.8 }],
  },
  q0029: {
    rationale:
      "Political access converted into entry barriers directly supports capture skepticism and lower confidence in competition; it does not directly measure administrative capacity.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 1 },
      { axisId: "market-process-confidence", weight: -0.8 },
    ],
  },
  q0030: {
    rationale:
      "The OECD evidence concerns the complex accountability chain and persistent managerial or political-governance problems in state-owned enterprises; retain those two constructs without implying that ownership alone determines performance.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 0.6 },
      { axisId: "state-capacity-confidence", weight: -0.5 },
    ],
  },
  q0048: {
    rationale:
      "The information problem of centralized planning is not a claim that experts are generally incompetent; it is a claim about dispersed and tacit information and coordination.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 1 },
      { axisId: "coordination-optimism", weight: 0.3 },
    ],
  },
  q0050: {
    rationale:
      "Regulated firms’ information advantage is a direct capture-risk mechanism; it does not by itself establish general expert incompetence or low state capacity.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
  q0107: {
    rationale:
      "The housing-supply finding concerns market coordination under binding land-use constraints; it does not directly measure state administrative capacity.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.7 },
      { axisId: "coordination-optimism", weight: 0.5 },
    ],
  },
  q0128: {
    prompt:
      "Because households differ in asset ownership, borrowing constraints, income sources, and labor-market exposure, monetary policy can affect them unevenly in ways policymakers cannot fully target.",
    rationale:
      "Make the policy-targeting implication explicit so the item measures a bounded belief about administrative precision rather than merely stating that households differ.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
    ],
  },
  q0130: {
    rationale:
      "Disproportionate compliance burdens for small entrants can indicate entry and capture concerns, but the finding is not a general test of state capacity.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 1 },
      { axisId: "market-process-confidence", weight: 0.3 },
    ],
  },
  q0147: {
    rationale:
      "Open and interoperable standards concern coordination and switching costs; they do not directly measure confidence in technical experts.",
    axisWeights: [
      { axisId: "coordination-optimism", weight: 0.7 },
      { axisId: "market-process-confidence", weight: 0.5 },
    ],
  },
  q0148: {
    prompt:
      "In patent-intensive sectors, portfolios can be used for cross-licensing and litigation leverage as well as for protecting inventions, potentially affecting entry and competition.",
    rationale:
      "The FTC evidence supports strategic portfolio uses and competition effects; make the mechanism directional instead of scoring a neutral list of possible uses as capture skepticism.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: -0.5 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
    ],
  },
  q0188: {
    prompt:
      "Law-enforcement agencies can improve apparent performance by emphasizing countable activity measures over outcomes such as safety, trust, and perceived legitimacy.",
    rationale:
      "The performance-measurement source supports a directional risk of substituting easy-to-count activity for public-safety and legitimacy outcomes; the rewrite makes that construct explicit.",
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 1 },
      { axisId: "state-capacity-confidence", weight: -0.8 },
    ],
  },
  q0190: {
    rationale:
      "Forfeiture proceeds create a potential resource incentive around seizures, which is a public-choice mechanism; it does not directly measure administrative capacity.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
  q0191: {
    rationale:
      "The plea-bargaining finding concerns coercive incentives and institutional power, not the general competence of the justice system.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
  q0248: {
    rationale:
      "Cross-national official-religion evidence concerns institutional privilege and restrictions on minorities; cultural plasticity is not measured by that relationship.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
  q0269: {
    prompt:
      "Complex tax-transfer classifications can make eligibility and net benefits difficult for similarly situated households to predict.",
    rationale:
      "Replace a neutral statement that rules differ with a bounded claim about administrative complexity and predictability, matching the existing household-typology source.",
    axisWeights: [
      { axisId: "state-capacity-confidence", weight: -0.5 },
      { axisId: "public-choice-skepticism", weight: 0.4 },
    ],
  },
  q0307: {
    rationale:
      "CERCLA liability is a legal enforcement mechanism and therefore primarily concerns the capacity of public institutions to identify and compel responsible parties; it does not directly measure market coordination.",
    axisWeights: [{ axisId: "state-capacity-confidence", weight: 0.6 }],
  },
  q0308: {
    prompt:
      "Uniform command-and-control environmental rules can impose disproportionately high compliance costs on smaller firms than on larger firms.",
    rationale:
      "The EPA source supports uneven cost incidence, not a universal claim about capture or state competence. The rewrite keeps the size-distribution mechanism explicit and bounded.",
    axisWeights: [
      { axisId: "market-process-confidence", weight: -0.4 },
      { axisId: "public-choice-skepticism", weight: 0.4 },
    ],
  },
  q0328: {
    rationale:
      "The Afghanistan reconstruction evidence directly concerns failures to adapt external projects to local conditions; it does not by itself establish capture or insider self-interest.",
    axisWeights: [{ axisId: "state-capacity-confidence", weight: -1 }],
  },
  q0350: {
    rationale:
      "Documented democratic backsliding is direct evidence about democratic and institutional constraints; flexible interpretation by courts, parties, or agencies is not a general measure of expert confidence.",
    axisWeights: [
      { axisId: "democratic-confidence", weight: -1 },
      { axisId: "public-choice-skepticism", weight: 0.3 },
    ],
  },
  q0368: {
    rationale:
      "The GAO finding concerns agency accountability and privacy safeguards in a defined federal review; it does not establish low confidence in technical expertise itself.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
};

export function applyEditorialTwentyFifthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const correction = descriptiveConstructCorrectionsById[String(question.id)];
  if (!correction) return question;

  return {
    ...question,
    ...(correction.prompt ? { prompt: correction.prompt } : {}),
    axisWeights: [...correction.axisWeights],
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_FIFTH_PASS_DATE,
  };
}
