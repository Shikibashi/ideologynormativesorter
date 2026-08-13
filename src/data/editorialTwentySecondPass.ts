import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_TWENTY_SECOND_PASS_VERSION = "2026-08-editorial-v22";
export const EDITORIAL_TWENTY_SECOND_PASS_DATE = "2026-08-12";

export interface TwentySecondPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass separates policy preferences from claims that were too broad for
 * their domain. Raw IDs and scoring axes remain stable; the effective prompts
 * gain the institutional boundaries needed for a truthful response.
 */
export const twentySecondPassRewritesById: Readonly<
  Record<string, TwentySecondPassRewrite>
> = {
  q0114: {
    prompt:
      "Where housing supply is constrained, policy should remove barriers to apartments, accessory units, and mixed-use construction before broadly subsidizing demand.",
    rationale:
      "Condition the sequencing preference on constrained supply and name the housing forms at issue. The original wording treated supply reform as universally prior even though construction capacity, subsidy targeting, infrastructure, and local market conditions affect the result.",
    evidenceNote:
      "This prescriptive item compares supply-side permitting reform with broad demand subsidies in constrained housing markets. Supply constraints can bind, while subsidies can have different effects by market, program design, income group, and construction response; it does not claim that targeted assistance is never appropriate or that permitting reform is sufficient by itself.",
    sourceIds: ["housingSupplyAffordability", "housingDemandSubsidies"],
  },
  q0123: {
    prompt:
      "Saving, lending, and payment services should generally be open to new providers, subject to proportionate safeguards for capital, disclosure, consumer protection, and payment integrity.",
    rationale:
      "Replace the vague “unless specific risks are shown” exception with the distinct safeguards that make entry compatible with financial stability and consumer protection. Saving, lending, and payment services are related but do not carry identical risk profiles.",
    evidenceNote:
      "This normative item measures a presumption in favor of contestable entry, not a claim that all financial services need the same licensing regime. Proportionate rules may address capital, fit-and-proper standards, disclosure, complaints, fraud, AML/CFT, cyber resilience, settlement, and payment-system integrity; the appropriate design varies by activity and jurisdiction.",
    sourceIds: [
      "financialEntryBarriers",
      "financialEntryLicensing",
      "paymentSystemIntegrity",
    ],
  },
  q0142: {
    prompt:
      "Creators should ordinarily receive attribution, but legal control over downstream uses should be limited when it would unnecessarily restrict criticism, research, repair, or follow-on creation.",
    rationale:
      "Separate attribution from exclusive downstream control and replace the absolute “all downstream uses” phrase with recognizable cases where copyright limitations or exceptions may matter. The item does not deny compensation, licensing, or other creator-support mechanisms.",
    evidenceNote:
      "This normative item concerns the moral and legal balance between attribution and downstream exclusion. Copyright systems distinguish economic rights, moral or attribution interests, licensing, and limitations or exceptions; the exact balance varies across jurisdictions and uses, so agreement is not a verdict on every copyright remedy.",
    sourceIds: ["copyrightLimitations", "intellectualProperty"],
  },
  q0154: {
    prompt:
      "Patent policy should narrow patent exclusivity—through shorter terms, narrower claims, or broader exceptions—before expanding enforcement remedies.",
    rationale:
      "Define “scope” as claims and exceptions and distinguish the breadth of exclusivity from enforcement remedies. The original item bundled several patent-policy levers without naming what each lever changes.",
    evidenceNote:
      "This prescriptive item expresses a sequencing preference between reducing the breadth or duration of patent exclusivity and expanding enforcement remedies. Patent term, claim scope, exceptions, licensing, injunctions, and damages are distinct legal tools; national law and the applicable technology sector determine their effects.",
    sourceIds: ["patentExceptions", "patentRightsEnforcement"],
  },
  q0158: {
    prompt:
      "Information policy should favor interoperable, open protocols and licensing that preserves follow-on use over broad exclusionary enforcement.",
    rationale:
      "Make “open protocols” and “voluntary licensing” operational by tying them to interoperability and follow-on use, and replace the undefined “monopoly enforcement” with broad exclusionary enforcement. These are related but distinct competition and intellectual-property choices.",
    evidenceNote:
      "This prescriptive item compares interoperability and follow-on access with broad exclusionary enforcement. Open standards can require governance, compatibility, privacy, security, and liability choices, while licensing and infringement remedies concern rights over particular works or inventions; the item does not assume that openness automatically creates competition.",
    sourceIds: [
      "openStandardsDigitalInnovation",
      "openStandardsCompetition",
      "copyrightLimitations",
    ],
  },
  q0217: {
    prompt:
      "Interior immigration enforcement should prioritize serious violence and fraud over otherwise nonviolent violations of immigration status or work authorization, with due process protections.",
    rationale:
      "Replace “ordinary work or residence” with the legally clearer distinction between serious criminal conduct and otherwise nonviolent status or work-authorization violations, while making procedural protection explicit. Enforcement priorities and offense classifications vary by jurisdiction and policy.",
    evidenceNote:
      "This prescriptive item concerns priority-setting within interior immigration enforcement, not a claim that status violations are harmless or that every fraud case is equally serious. Immigration agencies distinguish civil removal authority from criminal enforcement and state that enforcement remains subject to lawful orders and due process; the item leaves the precise priority categories and implementation to the jurisdiction.",
    sourceIds: ["iceEnforcementStatistics", "civilPoliticalRights"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialTwentySecondPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = twentySecondPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_SECOND_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_SECOND_PASS_DATE,
    deprecationReason: undefined,
  };
}
