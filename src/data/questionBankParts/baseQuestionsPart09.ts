import type { Question } from "../../types";
import { CONFIDENCE_PROMPT, PRIORITY_PROMPT } from "./prompts";

export const baseQuestionsPart09: Question[] = [
  {
    id: "q0401",
    prompt:
      "The threat or use of military force against another society should require justification as strong as the use of force against one's own citizens.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "militarism-pacifism", weight: -1 },
      { axisId: "anti-domination", weight: 0.3 },
      { axisId: "political-community-boundary", weight: 0.3 },
    ],
  },
  {
    id: "q0402",
    prompt:
      "A country may legitimately use overwhelming force to neutralize threats before they materialize.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [
      { axisId: "militarism-pacifism", weight: 1 },
      { axisId: "authority-legitimacy", weight: 0.3 },
      { axisId: "anti-domination", weight: -0.3 },
    ],
  },
  {
    id: "q0403",
    prompt:
      "National greatness is partly measured by willingness to project military power abroad.",
    domain: "foreign-policy-war",
    layer: "normative",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "quick",
    axisWeights: [
      { axisId: "militarism-pacifism", weight: 1 },
      { axisId: "political-community-boundary", weight: -0.3 },
      { axisId: "anti-domination", weight: -0.3 },
    ],
  },
  {
    id: "q0404",
    prompt:
      "Government ceremonies, public schools, and official holidays should be framed in terms that do not assume any particular religion.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "secularism-religious", weight: -1 },
      { axisId: "liberty-noninterference", weight: 0.5 },
      { axisId: "moral-traditionalism", weight: -0.5 },
    ],
  },
  {
    id: "q0405",
    prompt:
      "A shared religious heritage can legitimately shape public law even when nonbelievers disagree.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [
      { axisId: "secularism-religious", weight: 1 },
      { axisId: "moral-traditionalism", weight: 0.7 },
      { axisId: "authority-legitimacy", weight: 0.4 },
    ],
  },
  {
    id: "q0406",
    prompt:
      "Religious arguments should be translated into publicly accessible reasons before they shape coercive law.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "quick",
    axisWeights: [
      { axisId: "secularism-religious", weight: -1 },
      { axisId: "liberty-noninterference", weight: 0.4 },
      { axisId: "authority-legitimacy", weight: -0.3 },
    ],
  },
  {
    id: "q0407",
    prompt:
      "Productive assets are most legitimate when the people who work with them have a direct ownership or governance claim over them.",
    domain: "property-ownership",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "property-legitimacy", weight: -0.4 },
      { axisId: "equality-theory", weight: 0.5 },
      { axisId: "anti-domination", weight: 0.3 },
    ],
  },
  {
    id: "q0408",
    prompt:
      "The unimproved value of land and natural opportunities belongs morally to the community, even when improvements are privately made.",
    domain: "land-housing-georgism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "property-legitimacy", weight: -1 },
      { axisId: "equality-theory", weight: 0.2 },
      { axisId: "political-community-boundary", weight: 0.2 },
    ],
  },
  {
    id: "q0409",
    prompt:
      "Worker-managed firms can preserve useful price signals while reducing domination inside the workplace.",
    domain: "labor-unions-workplace",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.5 },
      { axisId: "democratic-confidence", weight: 0.4 },
      { axisId: "coordination-optimism", weight: 0.3 },
    ],
  },
  {
    id: "q0410",
    prompt:
      "Central economic planning tends to lose local information faster than planners can recover it.",
    domain: "markets-planning",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "market-process-confidence", weight: 0.6 },
      { axisId: "state-capacity-confidence", weight: -0.8 },
      { axisId: "expert-confidence", weight: -0.3 },
    ],
  },
  {
    id: "q0411",
    prompt:
      "A post-capitalist economy should be built through federated workplace and neighborhood councils rather than a party-state bureaucracy.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "centralization-preference", weight: -0.8 },
      { axisId: "electoralism-vs-direct-action", weight: -0.7 },
      { axisId: "state-action-vs-exit", weight: -0.4 },
    ],
  },
  {
    id: "q0412",
    prompt:
      "A disciplined revolutionary organization should be prepared to centralize authority during a transition away from capitalism.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "centralization-preference", weight: 0.8 },
      { axisId: "reform-vs-revolution", weight: 0.8 },
      { axisId: "coercion-strategy", weight: 0.4 },
    ],
  },
  {
    id: "q0413",
    prompt:
      "Anti-authoritarian movements need shared strategy and collective discipline, not only loose affinity groups.",
    domain: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "centralization-preference", weight: 0.3 },
      { axisId: "electoralism-vs-direct-action", weight: -0.6 },
      { axisId: "compromise-vs-persistence", weight: -0.4 },
    ],
  },
  {
    id: "q0414",
    prompt:
      "Civil law may legitimately be subordinate to revealed religious law when the two conflict.",
    domain: "religion-secularism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [
      { axisId: "secularism-religious", weight: 1 },
      { axisId: "moral-traditionalism", weight: 0.8 },
      { axisId: "authority-legitimacy", weight: 0.5 },
    ],
  },
  {
    id: "q0415",
    prompt:
      "A nation is best understood as a shared civic project rather than an inherited ethnic or religious identity.",
    domain: "national-identity-sovereignty",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "political-community-boundary", weight: 0.7 },
      { axisId: "moral-traditionalism", weight: -0.4 },
      { axisId: "secularism-religious", weight: -0.3 },
    ],
  },
  {
    id: "q0416",
    prompt:
      "A shared religious identity is usually a more reliable source of social cohesion than secular constitutional patriotism.",
    domain: "religion-secularism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "extensive",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "cultural-plasticity", weight: -0.6 },
      { axisId: "coordination-optimism", weight: 0.3 },
      { axisId: "democratic-confidence", weight: -0.3 },
    ],
  },
  {
    id: "q0417",
    prompt:
      "Immigration policy should be used to preserve inherited cultural continuity, even at the cost of economic openness.",
    domain: "immigration-borders",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "centralization-preference", weight: 0.4 },
      { axisId: "state-action-vs-exit", weight: 0.5 },
      { axisId: "compromise-vs-persistence", weight: -0.3 },
    ],
  },
  {
    id: "q0418",
    prompt:
      "Nonhuman habitats can have moral claims strong enough to override projects that would materially benefit people.",
    domain: "environment-climate-growth",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "human-nature-priority", weight: 1 },
      { axisId: "property-legitimacy", weight: -0.3 },
      { axisId: "anti-domination", weight: 0.3 },
    ],
  },
  {
    id: "q0419",
    prompt:
      "Advanced technology and expert-led deployment can decouple prosperity from ecological harm fast enough to avoid degrowth.",
    domain: "environment-climate-growth",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "expert-confidence", weight: 0.7 },
      { axisId: "state-capacity-confidence", weight: 0.4 },
      { axisId: "market-process-confidence", weight: 0.3 },
    ],
  },
  {
    id: "q0420",
    prompt:
      "Rich societies should impose binding caps on total material throughput instead of treating green growth as the main climate strategy.",
    domain: "environment-climate-growth",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "moderate",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "regulation-vs-deregulation", weight: 0.8 },
      { axisId: "redistribution-vs-predistribution", weight: 0.4 },
      { axisId: "gradualism-vs-immediatism", weight: 0.3 },
    ],
  },
  {
    id: "q0421",
    prompt:
      "Gender and sexual liberation require dismantling the institutions that reproduce hierarchy, not merely extending equal formal rights.",
    domain: "family-gender-feminism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "moderate",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.8 },
      { axisId: "equality-theory", weight: 0.7 },
      { axisId: "moral-traditionalism", weight: -0.8 },
    ],
  },
  {
    id: "q0422",
    prompt:
      "Gender and family norms respond strongly to law, education, and institutional incentives.",
    domain: "family-gender-feminism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "extensive",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "cultural-plasticity", weight: 0.9 },
      { axisId: "expert-confidence", weight: 0.3 },
    ],
  },
  {
    id: "q0423",
    prompt:
      "A universal cash floor is preferable to tightly targeted welfare programs, even if some recipients do not strictly need it.",
    domain: "redistribution-welfare",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: 0.7 },
      { axisId: "state-action-vs-exit", weight: 0.3 },
      { axisId: "compromise-vs-persistence", weight: 0.2 },
    ],
  },
  {
    id: "q0424",
    prompt:
      "Taxing unimproved land value should replace broad taxes on labor and productive investment wherever possible.",
    domain: "land-housing-georgism",
    layer: "prescriptive",
    theoryContext: "nonideal",
    responseType: "likert7",
    tier: "extensive",
    priorityPrompt: PRIORITY_PROMPT,
    axisWeights: [
      { axisId: "redistribution-vs-predistribution", weight: -0.9 },
      { axisId: "state-action-vs-exit", weight: 0.8 },
      { axisId: "centralization-preference", weight: 0.3 },
    ],
  },
  {
    id: "q0425",
    prompt:
      "Inherited office can be a legitimate source of political authority when it anchors continuity and social order.",
    domain: "democracy-expertise-constitutionalism",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [
      { axisId: "authority-legitimacy", weight: 0.8 },
      { axisId: "moral-traditionalism", weight: 0.7 },
      { axisId: "equality-theory", weight: -0.6 },
    ],
  },
  {
    id: "q0426",
    prompt:
      "Mainstream institutions tend to protect their own status even when they present themselves as neutral guardians of democracy or expertise.",
    domain: "democracy-expertise-constitutionalism",
    layer: "descriptive",
    theoryContext: "mixed",
    responseType: "likert7",
    tier: "moderate",
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
    axisWeights: [
      { axisId: "public-choice-skepticism", weight: 1 },
      { axisId: "expert-confidence", weight: -0.5 },
      { axisId: "democratic-confidence", weight: -0.3 },
    ],
  },
];
