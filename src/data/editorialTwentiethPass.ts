import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_TWENTIETH_PASS_VERSION = "2026-08-editorial-v20";
export const EDITORIAL_TWENTIETH_PASS_DATE = "2026-08-12";

export interface TwentiethPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass tightens older descriptive rewrites to the populations, outcomes,
 * and comparisons in their underlying studies, and separates anticipatory
 * self-defense from the broader claim that force is justified against any
 * future threat. Raw question IDs remain unchanged for research compatibility.
 */
export const twentiethPassRewritesById: Readonly<
  Record<string, TwentiethPassRewrite>
> = {
  q0007: {
    prompt:
      "In U.S. metropolitan police-service comparisons, more autonomous service providers were not associated with lower efficiency and were sometimes associated with higher efficiency.",
    rationale:
      "Use an associational formulation and name the service domain. Ostrom’s work compares metropolitan police arrangements; it does not establish that autonomous provision improves every public service or that exit creates a competitive market for all government functions.",
    evidenceNote:
      "Scope to U.S. metropolitan police-service comparisons summarized in Ostrom’s work: compare measured service output and efficiency across arrangements with more and fewer autonomous producers. The evidence does not imply that every service benefits from fragmentation, that autonomy is the same as privatization, or that the result is causal in every setting.",
    sourceIds: ["polycentricGovernance"],
  },
  q0067: {
    prompt:
      "In a U.S. SNAP study, later recertification interview assignments reduced successful recertification and subsequent participation among affected cases.",
    rationale:
      "Name the program and study design, and distinguish the measured administrative margin from a universal claim about all welfare programs or all ineligible cases. The study found large short-run recertification effects and smaller later participation effects, with substantial re-enrollment.",
    evidenceNote:
      "Scope to the randomized interview-timing study of SNAP recertification cases in San Francisco. Later assigned interview dates reduced recertification and lowered SNAP participation in the following year for affected cases; many cases re-enrolled, so the item does not claim that every closure reflected ineligibility or that one administrative rule has the same effect elsewhere.",
    sourceIds: ["snapRecertification"],
  },
  q0107: {
    prompt:
      "In high-cost metropolitan housing markets, permitting additional construction can moderate price pressure when land-use rules constrain supply.",
    rationale:
      "Replace the vague and normatively loaded outcome “reduce exclusion” with the housing-price mechanism actually examined by the cited zoning research. Access, displacement, density, and distributional effects remain separate questions.",
    evidenceNote:
      "Scope to high-cost metropolitan housing markets in which zoning or other land-use controls constrain new construction. The cited evidence links restrictive controls to higher housing costs, but it is suggestive rather than universal and does not by itself establish effects on displacement, segregation, or every kind of housing access.",
    sourceIds: ["housingSupply"],
  },
  q0328: {
    prompt:
      "In the Afghanistan reconstruction, outside planners often struggled to adapt projects to local political and institutional conditions.",
    rationale:
      "Reduce a three-part claim about political, security, and institutional knowledge to the adaptation problem documented in the Afghanistan reconstruction record. The item no longer generalizes from one case to military interventions as a class.",
    evidenceNote:
      "Scope to the Afghanistan reconstruction lessons reviewed by SIGAR and USIP. The record emphasizes local knowledge and buy-in as conditions for development success; this item does not claim that every project failed, that local knowledge has one institutional form, or that the case determines all intervention outcomes.",
    sourceIds: ["afghanistanReconstruction"],
  },
  q0402: {
    prompt:
      "A country may legitimately use force in anticipatory self-defense when an armed attack is sufficiently imminent.",
    rationale:
      "Remove “overwhelming force” and the unbounded phrase “before threats materialize.” The revised item isolates the contested normative question of anticipatory self-defense; it does not merge imminence with proportionality or preventive war against a remote future threat.",
    evidenceNote:
      "This normative item distinguishes anticipatory self-defense against a sufficiently imminent attack from preventive war against a threat that may arise in the future. Article 51 refers to self-defense if an armed attack occurs, while international-law sources debate the scope of anticipatory action; legality, necessity, proportionality, and moral legitimacy are related but separate judgments.",
    sourceIds: ["war", "unCharter"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialTwentiethPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = twentiethPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_TWENTIETH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTIETH_PASS_DATE,
    deprecationReason: undefined,
  };
}
