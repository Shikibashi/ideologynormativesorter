import type { Question, QuestionSource } from "../types";

/**
 * Third confidence-coverage pass. These items add one positive and one
 * negative, single-construct observation to the three axes that remained
 * below the moderate coverage band after the earlier expansions.
 */
export const CONFIDENCE_COVERAGE_THIRD_PASS_VERSION =
  "2026-08-confidence-coverage-v4";
export const CONFIDENCE_COVERAGE_THIRD_PASS_DATE = "2026-08-12";

const CONFIDENCE_PROMPT = "How confident are you in this empirical claim?";

const source = (
  title: string,
  url: string,
  publisher: string,
): QuestionSource => ({ title, url, publisher });

const stateCapacitySource = source(
  "Beyond state capacity: bureaucratic performance, policy implementation and reform",
  "https://doi.org/10.1017/S1744137420000478",
  "Journal of Institutional Economics / Cambridge University Press",
);
const stateCapacityMeasurementSource = source(
  "Income taxation and the validity of state capacity indicators",
  "https://doi.org/10.1017/S0143814X1300024X",
  "Journal of Public Policy / Cambridge University Press",
);
const expertiseSource = source(
  "Reflections on evidence use in policy making: Expertise under pressure",
  "https://doi.org/10.1017/S1682098326100538",
  "European Political Science / Cambridge University Press",
);
const accountabilitySource = source(
  "Understanding Accountability in Democratic Governance",
  "https://doi.org/10.1017/9781108973823",
  "Elements in Public Policy / Cambridge University Press",
);
const normsSource = source(
  "Shifts in Social Norms Often Underpin Change",
  "https://doi.org/10.1093/oso/9780198899952.003.0004",
  "Oxford Scholarship Online / Oxford University Press",
);
const informalInstitutionsSource = source(
  "Formal and informal institutions: some problems of meaning, impact, and interaction",
  "https://doi.org/10.1017/S1744137423000291",
  "Journal of Institutional Economics / Cambridge University Press",
);

const confidenceCoverageThirdPassBaseQuestions: Question[] = [
  {
    id: "q0474",
    prompt:
      "A policy can fail in practice when implementing agencies lack the staff, information, coordination, or enforcement capacity required by its design.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item isolates implementation capacity from the desirability of a policy and from the state’s overall size. Research distinguishes the hypothetical potential of state capacity from actual bureaucratic performance and emphasizes information, incentives, coordination, and contextual constraints in implementation; failure is therefore conditional rather than inevitable.",
    sources: [stateCapacitySource, stateCapacityMeasurementSource],
    axisWeights: [{ axisId: "state-capacity-confidence", weight: -1 }],
  },
  {
    id: "q0475",
    prompt:
      "Whether a government can implement a policy is better assessed by observed performance on defined tasks than by the policy’s formal existence or ambition alone.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item measures an evidence-oriented view of state capacity: the ability to implement public policy should be distinguished from announcing a policy or possessing formal authority. The measurement literature treats implementation outcomes as a validity problem and does not imply that one indicator captures every dimension of capacity.",
    sources: [stateCapacityMeasurementSource, stateCapacitySource],
    axisWeights: [{ axisId: "state-capacity-confidence", weight: 1 }],
  },
  {
    id: "q0476",
    prompt:
      "Expert recommendations can gain public legitimacy when their assumptions, conflicts, uncertainty, and limits remain open to accountable political challenge.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item concerns the institutional conditions that can make expertise more publicly legitimate, not a guarantee that challenge improves technical accuracy in every case. Recent scholarship on evidence use treats expertise as politically contested and emphasizes inclusion, independence safeguards, transparency, and accountability.",
    sources: [expertiseSource, accountabilitySource],
    axisWeights: [{ axisId: "expert-confidence", weight: 1 }],
  },
  {
    id: "q0477",
    prompt:
      "Delegating value-laden choices to expert bodies can weaken democratic accountability when affected people cannot meaningfully scrutinize or contest the decision.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item separates expert analysis from the democratic authorization of distributive or value-laden choices. Research on accountability identifies risks when delegation obscures responsibility or leaves affected people without effective scrutiny; it does not claim that all delegation is illegitimate or that public challenge supplies technical expertise by itself.",
    sources: [accountabilitySource, expertiseSource],
    axisWeights: [{ axisId: "expert-confidence", weight: -1 }],
  },
  {
    id: "q0478",
    prompt:
      "Norm change is more likely to endure when new behavior becomes publicly expected and socially reinforced, not merely legally permitted.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item isolates social reinforcement as a mechanism of durable norm change. Scholarship distinguishes formal legal rules from the expectations, sanctions, reference groups, and institutional practices that make behavior appear normal; the claim is conditional and does not deny that law can itself alter expectations.",
    sources: [normsSource, informalInstitutionsSource],
    axisWeights: [{ axisId: "cultural-plasticity", weight: 1 }],
  },
  {
    id: "q0479",
    prompt:
      "Changing a formal rule may leave older social expectations in place for a time when informal institutions and group sanctions continue to reward established behavior.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    evidenceNote:
      "This item tests conditional persistence rather than cultural immobility. Research on formal and informal institutions describes culture and social norms as capable of persistence while also changing through interaction with law, authority, incentives, and collective action; the item does not make delay permanent or universal.",
    sources: [informalInstitutionsSource, normsSource],
    axisWeights: [{ axisId: "cultural-plasticity", weight: -1 }],
  },
];

const stampQuestion = (question: Question): Question => ({
  ...question,
  active: true,
  reviewStatus: "approved",
  version: CONFIDENCE_COVERAGE_THIRD_PASS_VERSION,
  updatedAt: CONFIDENCE_COVERAGE_THIRD_PASS_DATE,
});

export const confidenceCoverageThirdPassQuestions: Question[] =
  confidenceCoverageThirdPassBaseQuestions.map(stampQuestion);
