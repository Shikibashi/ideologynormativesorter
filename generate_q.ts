import fs from "fs";

const Q = [
  // 1. egalitarian-statist vs anti-imperialism
  {
    id: "q0901",
    prompt:
      "A legitimate state must aggressively enforce social equality, even if it requires heavily restricting individual liberties.",
    domain: "state-legitimacy",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [
      { axisId: "equality-theory", weight: 0.9 },
      { axisId: "liberty-noninterference", weight: -0.8 },
    ],
  },
  {
    id: "q0902",
    prompt:
      "State power must be aggressively expanded and centralized to forcibly regulate the economy and redistribute wealth.",
    domain: "redistribution-welfare",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [
      { axisId: "centralization-preference", weight: 0.8 },
      { axisId: "regulation-vs-deregulation", weight: 0.8 },
      { axisId: "redistribution-vs-predistribution", weight: 0.9 },
    ],
  },
  // 2. council-communist vs anarcho-syndicalism
  {
    id: "q0903",
    prompt:
      "Individual freedom from interference must be completely sacrificed to ensure collective council decision-making.",
    domain: "labor-unions-workplace",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [{ axisId: "liberty-noninterference", weight: -0.8 }],
  },
  {
    id: "q0904",
    prompt:
      "Revolutionaries must violently seize absolute control over production, refusing any compromise with existing institutions.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [
      { axisId: "coercion-strategy", weight: 0.9 },
      { axisId: "compromise-vs-persistence", weight: -0.8 },
    ],
  },
  // 3. minarchist vs bleeding-heart-libertarianism
  {
    id: "q0905",
    prompt:
      "True justice requires equal outcomes and social levelling, rather than just fair procedures.",
    domain: "redistribution-welfare",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [{ axisId: "equality-theory", weight: 0.9 }],
  },
  {
    id: "q0906",
    prompt:
      "We must rely on state action to protect the vulnerable, rather than expecting private charity and free markets to handle it.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [{ axisId: "state-action-vs-exit", weight: 0.8 }],
  },
  // 4. fascist-authoritarian vs theocrat
  {
    id: "q0907",
    prompt:
      "Our political community should be strictly defined by ethnic purity rather than religious affiliation.",
    domain: "national-identity-sovereignty",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [{ axisId: "political-community-boundary", weight: -0.9 }],
  },
  {
    id: "q0908",
    prompt:
      "National rebirth requires an immediate, violent revolution to overthrow the current degenerate system.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [
      { axisId: "reform-vs-revolution", weight: 0.9 },
      { axisId: "gradualism-vs-immediatism", weight: 0.9 },
      { axisId: "coercion-strategy", weight: 0.8 },
    ],
  },
  // 5. anarcho-capitalist vs decentralist-market-skeptic-of-state
  {
    id: "q0909",
    prompt:
      "Preventing interpersonal domination is more important than rigidly upholding private property rights.",
    domain: "property-ownership",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [
      { axisId: "anti-domination", weight: 0.8 },
      { axisId: "equality-theory", weight: 0.8 },
    ],
  },
  // 6. revolutionary-collectivist vs ecosocialist
  {
    id: "q0910",
    prompt:
      "Protecting the natural environment is the highest moral priority, far more important than meeting human material needs.",
    domain: "environment-climate-growth",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [{ axisId: "human-nature-priority", weight: 0.9 }],
  },
  {
    id: "q0911",
    prompt:
      "Our movement must immediately resort to violent coercion and total revolution rather than peaceful democratic processes.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [
      { axisId: "coercion-strategy", weight: 0.9 },
      { axisId: "reform-vs-revolution", weight: 0.9 },
      { axisId: "electoralism-vs-direct-action", weight: -0.8 },
    ],
  },
  // 7. technocratic-centralist vs corporatism
  {
    id: "q0912",
    prompt:
      "Society must be dynamically engineered to reshape culture and human behavior, discarding traditional morality.",
    domain: "democracy-expertise-constitutionalism",
    responseType: "likert7",
    reverseScored: false,
    layer: "descriptive",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [
      { axisId: "cultural-plasticity", weight: 0.9 },
      { axisId: "coordination-optimism", weight: -0.5 },
    ],
  },
  {
    id: "q0913",
    prompt:
      "The state must strictly coerce economic groups into harmony rather than allowing free negotiation.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [{ axisId: "coercion-strategy", weight: -0.6 }],
  },
  // 8. objectivism vs minarchist
  {
    id: "q0914",
    prompt:
      "All forms of compromise in political strategy are inherently evil and must be entirely rejected.",
    domain: "strategy-change",
    responseType: "likert7",
    reverseScored: false,
    layer: "prescriptive",
    theoryContext: "nonideal",
    tier: "moderate",
    priorityPrompt: "PRIORITY_PROMPT",
    axisWeights: [{ axisId: "compromise-vs-persistence", weight: -0.9 }],
  },
  // 9. individualist-anarchism vs left-wing-market-anarchism
  {
    id: "q0915",
    prompt:
      "Private property is an absolute moral right, regardless of whether it leads to massive wealth inequality.",
    domain: "property-ownership",
    responseType: "likert7",
    reverseScored: false,
    layer: "normative",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [
      { axisId: "property-legitimacy", weight: 0.8 },
      { axisId: "equality-theory", weight: -0.8 },
    ],
  },
  {
    id: "q0916",
    prompt:
      "The general public can be trusted to make wise, well-informed democratic choices.",
    domain: "democracy-expertise-constitutionalism",
    responseType: "likert7",
    reverseScored: false,
    layer: "descriptive",
    theoryContext: "ideal",
    tier: "moderate",
    axisWeights: [{ axisId: "democratic-confidence", weight: 0.9 }],
  },
];

let str = fs.readFileSync("src/data/questions.ts", "utf-8");
const qStr = Q.map((q) => {
  let s = JSON.stringify(q, null, 3);
  s = s.replace(/"PRIORITY_PROMPT"/g, "PRIORITY_PROMPT");
  return s;
}).join(",\n");

str = str.replace(
  "]\nexport const coreQuestions: Question[]",
  ",\n" + qStr + "\n]\nexport const coreQuestions: Question[]",
);

fs.writeFileSync("src/data/questions.ts", str);
console.log("Appended questions");
