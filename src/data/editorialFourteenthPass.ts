import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_FOURTEENTH_PASS_VERSION = "2026-08-editorial-v14";
export const EDITORIAL_FOURTEENTH_PASS_DATE = "2026-08-12";

export interface FourteenthPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass aligns four active descriptive items with the population,
 * mechanism, and outcome actually covered by their cited sources.
 */
export const fourteenthPassRewritesById: Readonly<
  Record<string, FourteenthPassRewrite>
> = {
  q0147: {
    prompt:
      "In some digital markets, open and interoperable standards can reduce switching or integration barriers.",
    rationale:
      "Replace the broad innovation and shared-knowledge claim with the narrower interoperability mechanism supported by OECD evidence. The item no longer treats lower barriers as a universal innovation or competition result.",
    evidenceNote:
      "Scope to digital-market interoperability research and policy analysis: compare whether open or interoperable standards lower switching or integration barriers and support diffusion in a defined market. The effects are conditional; standard-setting can impose maintenance costs or entrench technologies and gatekeepers when markets change quickly.",
    sourceIds: ["openStandardsDigitalInnovation", "openStandardsCompetition"],
  },
  q0248: {
    prompt:
      "In countries with an official or preferred religion, governments are more likely to restrict other religious groups than in countries without one.",
    rationale:
      "Replace the unsupported mechanism about every doctrinal disagreement becoming enforceable law with the cross-national comparison actually measured by Pew: official or preferred religion, legal or practical preference, and restrictions on other religious groups.",
    evidenceNote:
      "Scope to Pew Research Center’s coding of 199 countries and territories and its Government Restrictions Index comparisons. The analysis reports higher median restrictions and more frequent interference or bans in countries with official or preferred religions, while the category includes ceremonial, preferential, restrictive, and hostile arrangements that must not be treated as identical.",
    sourceIds: ["religionOfficialStatus", "religionRestrictions"],
  },
  q0307: {
    prompt:
      "Under CERCLA/Superfund, identifying a liable party can trigger a cleanup obligation or recovery of cleanup costs.",
    rationale:
      "Replace the general causal claim that liability reduces pollution harm with the documented legal mechanism: identifying a potentially responsible party can support cleanup or cost recovery under the named U.S. regime.",
    evidenceNote:
      "Scope to U.S. CERCLA/Superfund: hazardous-substance presence, release or possible release, response costs, and a liable potentially responsible party can trigger cleanup costs, damages, or injunctive relief. This item describes a legal enforcement mechanism; it does not estimate pollution reduction or generalize to every liability regime.",
    sourceIds: ["superfundLiability", "superfundEnforcement"],
  },
  q0368: {
    prompt:
      "In GAO’s review of DHS law-enforcement technologies, agencies reported using many detection, observation, and monitoring tools in public spaces, while technology policies did not always address key privacy protections.",
    rationale:
      "Name the DHS and GAO scope and replace the unsupported general-purpose claim with the report’s measured findings about technology use and policy coverage.",
    evidenceNote:
      "Scope to GAO-25-107302’s review of selected DHS law-enforcement agencies and technologies in fiscal year 2023. The report found agencies used more than 20 types of detection, observation, and monitoring technologies in public spaces and that reviewed policies did not always address collection, purpose specification, sharing, security, retention, and accountability protections.",
    sourceIds: ["gaoFacialRecognitionPrivacy"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialFourteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = fourteenthPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_FOURTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_FOURTEENTH_PASS_DATE,
    deprecationReason: undefined,
  };
}
