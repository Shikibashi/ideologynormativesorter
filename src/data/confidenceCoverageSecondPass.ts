import type { Question } from "../types";

/**
 * Targeted coverage extension for axes that remained sparse after the first
 * confidence pass. Every item is single-axis so additional coverage does not
 * smuggle a second construct into the result.
 */
export const CONFIDENCE_COVERAGE_SECOND_PASS_VERSION =
  "2026-08-confidence-coverage-v3";
export const CONFIDENCE_COVERAGE_SECOND_PASS_DATE = "2026-08-12";
const CONFIDENCE_PROMPT = "How confident are you in this empirical claim?";
const PRIORITY_PROMPT =
  "How high a priority is this relative to other reforms?";
const source = (title: string, url: string, publisher: string) => ({
  title,
  url,
  publisher,
});
const electoralAccountabilitySource = source(
  "Information and Political Accountability",
  "https://www.aeaweb.org/articles?id=10.1257%2Fmic.20240340",
  "American Economic Association",
);
const evidenceGovernanceSource = source(
  "Mobilising evidence for good governance",
  "https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html",
  "Organisation for Economic Co-operation and Development",
);
const socialNormsSource = source(
  "Social Norms",
  "https://wbl.worldbank.org/en/publications/thematic-topics/social-norm",
  "World Bank",
);

const confidenceCoverageSecondPassBaseQuestions: Question[] = [
  {
    id: "q0446",
    prompt:
      "A policy can be morally wrong because it destroys an ecosystem even when it increases aggregate human welfare.",
    domain: "environment-climate-growth",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "human-nature-priority", weight: 1 }],
  },
  {
    id: "q0447",
    prompt:
      "Nonhuman beings can matter morally in their own right, not only because protecting them benefits present or future people.",
    domain: "environment-climate-growth",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "human-nature-priority", weight: 1 }],
  },
  {
    id: "q0448",
    prompt:
      "When human necessities conflict with nonhuman interests, human use should usually prevail if less harmful alternatives are costly.",
    domain: "environment-climate-growth",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "human-nature-priority", weight: -1 }],
  },
  {
    id: "q0449",
    prompt:
      "Armed defense can be morally justified when it is necessary to stop grave aggression and no less harmful alternative is available.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "militarism-pacifism", weight: 1 }],
  },
  {
    id: "q0450",
    prompt:
      "A government should reject military intervention when a nonviolent policy can protect people from the same immediate threat.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "militarism-pacifism", weight: -1 }],
  },
  {
    id: "q0451",
    prompt:
      "A state may use proportionate military force to defend people from attack even when doing so imposes serious costs on its own citizens.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "militarism-pacifism", weight: 1 }],
  },
  {
    id: "q0452",
    prompt:
      "Public institutions may recognize a religious tradition symbolically while protecting equal civic standing for people who do not practice it.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "secularism-religious", weight: 1 }],
  },
  {
    id: "q0453",
    prompt:
      "Public law should not privilege a religious moral code merely because it is traditional or supported by a majority.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "secularism-religious", weight: -1 }],
  },
  {
    id: "q0454",
    prompt:
      "Religious authorities should not have final unchecked power to interpret or enforce public law.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [{ axisId: "secularism-religious", weight: -1 }],
  },
  {
    id: "q0455",
    prompt:
      "When voters can compare competing evidence and observe consequences, elections can improve accountability for poor performance.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item is scoped to electoral accountability when voters can compare evidence and observe outcomes. Information effects vary with media, issue salience, and who receives the signal; the claim is not that elections always select competent leaders.",
    sources: [electoralAccountabilitySource],
    axisWeights: [{ axisId: "democratic-confidence", weight: 1 }],
  },
  {
    id: "q0456",
    prompt:
      "Even under competitive elections, identity cues and misinformation can lead voters to reward leaders for outcomes those leaders did not cause.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item concerns retrospective attribution problems under competitive elections. Identity cues and misinformation are possible mechanisms, not universal explanations, and the item does not imply that voters cannot learn from outcomes.",
    sources: [electoralAccountabilitySource],
    axisWeights: [{ axisId: "democratic-confidence", weight: -1 }],
  },
  {
    id: "q0457",
    prompt:
      "Mass participation alone does not ensure that voters reach well-informed collective judgments.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item separates participation from information and deliberative quality. It does not imply that mass participation is harmful or that expert filtering reliably produces better decisions.",
    sources: [electoralAccountabilitySource],
    axisWeights: [{ axisId: "democratic-confidence", weight: -1 }],
  },
  {
    id: "q0458",
    prompt:
      "Expert advice is more likely to improve policy when its methods can be independently checked and its uncertainty is reported.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item concerns conditions that can make expert advice more useful: independent checking, transparent methods, and reported uncertainty. These design conditions do not guarantee correctness or replace public authorization.",
    sources: [evidenceGovernanceSource],
    axisWeights: [{ axisId: "expert-confidence", weight: 1 }],
  },
  {
    id: "q0459",
    prompt:
      "Professional expert bodies can protect their jurisdiction and status even when their recommendations are presented as neutral evidence.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item tests a public-choice risk within professional expertise. It does not assert that all expert bodies are captured or that ordinary political control is free of status and self-interest effects.",
    sources: [evidenceGovernanceSource],
    axisWeights: [{ axisId: "expert-confidence", weight: -1 }],
  },
  {
    id: "q0460",
    prompt:
      "Independent technical expertise can improve public decisions when its assumptions, evidence, and limits remain open to challenge.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item asks whether contestable and bounded expertise can improve public decisions. It leaves the quality of evidence, reviewer independence, and allocation of final authority open.",
    sources: [evidenceGovernanceSource],
    axisWeights: [{ axisId: "expert-confidence", weight: 1 }],
  },
  {
    id: "q0461",
    prompt:
      "Changing formal rules can shift social norms when enforcement and social incentives reinforce the new expectations.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item tests a mediated account of legal norm change: rules matter partly through enforcement and social incentives. It does not claim that law alone changes culture or that every norm responds at the same speed.",
    sources: [socialNormsSource],
    axisWeights: [{ axisId: "cultural-plasticity", weight: 1 }],
  },
  {
    id: "q0462",
    prompt:
      "Long-standing norms can persist despite legal change when family, peer, and economic dependencies remain stable.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item isolates persistence under stable relational and economic dependencies. It does not make path dependence permanent or deny that legal change can alter incentives and reference groups.",
    sources: [socialNormsSource],
    axisWeights: [{ axisId: "cultural-plasticity", weight: -1 }],
  },
  {
    id: "q0463",
    prompt:
      "Public institutions can change cultural expectations without making every person share the same moral view.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item separates institutional influence on expectations from unanimous moral conversion. It does not specify whether the change is desirable, how coercive the institution is, or whether effects are equal across groups.",
    sources: [socialNormsSource],
    axisWeights: [{ axisId: "cultural-plasticity", weight: 1 }],
  },
  {
    id: "q0464",
    prompt:
      "When existing institutions can remove the relevant injustice without preserving the same power, change should work through them.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "reform-vs-revolution", weight: -1 }],
  },
  {
    id: "q0465",
    prompt:
      "Replacing an institution is justified when its core function cannot be separated from domination and no credible reform path exists.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "reform-vs-revolution", weight: 1 }],
  },
  {
    id: "q0466",
    prompt:
      "Movements should not treat disruption itself as evidence that revolutionary replacement will improve accountability.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "reform-vs-revolution", weight: -1 }],
  },
  {
    id: "q0467",
    prompt:
      "Electoral work is worthwhile when it expands durable power for affected people while independent organizing continues.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "electoralism-vs-direct-action", weight: 1 }],
  },
  {
    id: "q0468",
    prompt:
      "Direct action is justified when formal channels repeatedly block affected people from meaningful influence.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "electoralism-vs-direct-action", weight: -1 }],
  },
  {
    id: "q0469",
    prompt:
      "Formal elections should be treated as one tactic among others rather than the sole legitimate route to political change.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "electoralism-vs-direct-action", weight: -1 }],
  },
  {
    id: "q0470",
    prompt:
      "A partial agreement is preferable when it yields real improvements without preventing later correction.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "compromise-vs-persistence", weight: 1 }],
  },
  {
    id: "q0471",
    prompt:
      "A movement should refuse a settlement that permanently entrenches the injustice even if it offers immediate benefits.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "compromise-vs-persistence", weight: -1 }],
  },
  {
    id: "q0472",
    prompt:
      "Negotiation deserves priority when opponents can make verifiable concessions and the issue remains open to revision.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [{ axisId: "compromise-vs-persistence", weight: 1 }],
  },
  {
    id: "q0473",
    prompt:
      "Expert evidence can clarify likely consequences without deciding which competing social values deserve priority.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item distinguishes the analytic contribution of expert evidence from the normative choice among competing values and distributional priorities. Evidence-governance guidance treats transparent assumptions, uncertainty, contestability, and public representation as safeguards; the item does not imply that evidence is politically neutral or that expertise is dispensable.",
    sources: [evidenceGovernanceSource],
    axisWeights: [{ axisId: "expert-confidence", weight: 0.8 }],
  },
];

const stampConfidenceCoverageSecondPassQuestion = (
  question: Question,
): Question => {
  question.active = true;
  question.reviewStatus = "approved";
  question.version = CONFIDENCE_COVERAGE_SECOND_PASS_VERSION;
  question.updatedAt = CONFIDENCE_COVERAGE_SECOND_PASS_DATE;
  return question;
};

export const confidenceCoverageSecondPassQuestions: Question[] =
  confidenceCoverageSecondPassBaseQuestions.map(
    stampConfidenceCoverageSecondPassQuestion,
  );
