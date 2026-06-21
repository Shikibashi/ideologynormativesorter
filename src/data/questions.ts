import type { Question } from '../types'

const CONFIDENCE_PROMPT = 'How confident are you in this empirical claim?'
const PRIORITY_PROMPT = 'How high a priority is this relative to other reforms?'

export const questions: Question[] = [
  // --- State legitimacy ---
  {
    id: 'state-legitimacy-norm-ideal',
    prompt:
      "Even in a society that is reasonably just and well-run, any institution that claims sole authority over law, taxation, and the use of force owes its subjects a clear justification for that monopoly.",
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.7 }],
    reverseScored: true,
  },
  {
    id: 'state-legitimacy-norm-nonideal',
    prompt:
      'Even where current institutions are flawed or partly corrupt, citizens still owe some baseline deference to lawful authority rather than treating every law as optional.',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.6 }],
  },
  {
    id: 'state-legitimacy-desc-nonideal',
    prompt:
      "Where a central authority's monopoly on law and force genuinely collapses, the power-holders who fill the resulting vacuum usually become predatory rather than protective.",
    domain: 'state-legitimacy',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'coordination-optimism', weight: -0.7 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'state-legitimacy-presc-nonideal',
    prompt:
      "Given the institutions we actually have, the responsible path is to gradually narrow the state's core monopoly functions rather than attempt to dissolve them all at once.",
    domain: 'state-legitimacy',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'gradualism-immediatism', weight: -0.7 },
      { axisId: 'centralization-decentralization', weight: 0.3 },
    ],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Property and ownership ---
  {
    id: 'property-norm-ideal',
    prompt:
      "Under fair background conditions, a person who improves a resource through their own labor acquires a strong moral claim to it that others may not simply override.",
    domain: 'property-ownership',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'property-legitimacy', weight: 0.8 }],
  },
  {
    id: 'property-norm-nonideal',
    prompt:
      'Even where current property holdings trace back to historical conquest, fraud, or state favoritism, unwinding those holdings case-by-case today would generally create more injustice than it resolves.',
    domain: 'property-ownership',
    layer: 'normative',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'property-legitimacy', weight: 0.5 }],
  },
  {
    id: 'property-desc-nonideal',
    prompt:
      'In practice, large concentrations of private capital tend to translate into outsized political influence that ordinary regulatory oversight rarely fully counteracts.',
    domain: 'property-ownership',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'public-choice-skepticism', weight: 0.4 },
      { axisId: 'market-confidence', weight: -0.2 },
    ],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'property-presc-nonideal',
    prompt:
      'Given current state capacity, enterprises currently run by the government should generally be transferred to private or cooperative ownership rather than expanded.',
    domain: 'property-ownership',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'state-action-exit', weight: 0.6 },
      { axisId: 'regulation-deregulation', weight: 0.2 },
    ],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Markets and planning ---
  {
    id: 'markets-norm',
    prompt:
      'People should be free to negotiate the terms of exchange and production between themselves without a central authority dictating what may be produced or at what price.',
    domain: 'markets-planning',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'liberty-theory', weight: 0.6 },
      { axisId: 'authority-legitimacy', weight: -0.3 },
    ],
  },
  {
    id: 'markets-desc',
    prompt:
      'Prices set through open exchange usually convey more accurate information about scarcity and demand than centrally planned quotas can.',
    domain: 'markets-planning',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'market-confidence', weight: 0.7 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'markets-presc',
    prompt:
      'Given current institutions, price controls and production quotas should generally be replaced with open competition, even in sectors that are politically sensitive.',
    domain: 'markets-planning',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'regulation-deregulation', weight: 0.6 },
      { axisId: 'state-action-exit', weight: 0.2 },
    ],
    priorityPrompt: PRIORITY_PROMPT,
  },
  {
    id: 'markets-presc-revolution',
    prompt:
      'Given how entrenched current economic institutions are, comprehensive market reform is more likely to succeed through sustained legislative change than through sudden systemic rupture.',
    domain: 'markets-planning',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'reform-revolution', weight: -0.6 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Redistribution and welfare ---
  {
    id: 'redistribution-norm-ideal',
    prompt:
      "In a genuinely just society, no one's access to food, shelter, or basic care should depend entirely on how much market value their labor commands.",
    domain: 'redistribution-welfare',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'equality-theory', weight: 0.8 }],
  },
  {
    id: 'redistribution-norm-nonideal',
    prompt:
      'Even granting that severe deprivation is unjust, people who are able to work still owe society some contribution in exchange for sustained material support.',
    domain: 'redistribution-welfare',
    layer: 'normative',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'equality-theory', weight: 0.5 }],
    reverseScored: true,
  },
  {
    id: 'redistribution-desc-nonideal',
    prompt:
      'Means-tested welfare programs in practice create benefit cliffs that discourage some recipients from taking on additional work.',
    domain: 'redistribution-welfare',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'state-capacity-confidence', weight: -0.5 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'redistribution-presc-nonideal',
    prompt:
      'Given current administrative capacity, unconditional cash transfers should be prioritized over expanding categorical, means-tested benefit programs.',
    domain: 'redistribution-welfare',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'redistribution-marketexit', weight: -0.4 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Labor, unions, and workplace governance ---
  {
    id: 'labor-norm',
    prompt:
      "Workers who jointly produce a firm's output have a legitimate claim to a meaningful say in how that firm is governed, not merely to a wage.",
    domain: 'labor-unions',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'anti-domination-hierarchy', weight: 0.6 }],
  },
  {
    id: 'labor-desc',
    prompt:
      'Mandatory sector-wide collective bargaining tends to raise wages for workers who keep their jobs while pricing some lower-productivity workers out of employment entirely.',
    domain: 'labor-unions',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'market-confidence', weight: 0.5 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'labor-presc',
    prompt:
      'Given current labor markets, wage subsidies or earnings top-ups for low-paid workers should be prioritized over mandating higher minimum wages.',
    domain: 'labor-unions',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'redistribution-marketexit', weight: 0.3 },
      { axisId: 'regulation-deregulation', weight: 0.4 },
    ],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Land, housing, and zoning ---
  {
    id: 'housing-norm-ideal',
    prompt:
      "In a just society, a person's ability to secure decent housing should not be governed entirely by market purchasing power.",
    domain: 'land-housing-zoning',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'equality-theory', weight: 0.6 }],
  },
  {
    id: 'housing-desc-nonideal',
    prompt: 'In most growing cities, zoning rules and permitting requirements are a major cause of high housing costs.',
    domain: 'land-housing-zoning',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'state-capacity-confidence', weight: -0.4 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'housing-desc-ideal',
    prompt:
      'If permitting and zoning approval were fast and predictable, private developers would build enough housing to meet most demand without further intervention.',
    domain: 'land-housing-zoning',
    layer: 'descriptive',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'market-confidence', weight: 0.6 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'housing-presc-nonideal',
    prompt:
      'Given current housing shortages, removing zoning and permitting barriers to new construction should be prioritized over expanding rent control.',
    domain: 'land-housing-zoning',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'regulation-deregulation', weight: 0.7 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Money and central banking ---
  {
    id: 'money-norm',
    prompt:
      "Society has a right to keep the basic medium of exchange under public, collectively accountable control rather than leaving its issuance entirely to private actors.",
    domain: 'money-banking',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.5 }],
  },
  {
    id: 'money-desc',
    prompt:
      'Central banks insulated from short-term political pressure tend to produce more stable prices than monetary policy set directly by elected officials.',
    domain: 'money-banking',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'state-capacity-confidence', weight: 0.3 },
      { axisId: 'democratic-confidence', weight: -0.4 },
    ],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'money-presc',
    prompt:
      'Given current institutions, monetary policy decisions should remain insulated from direct legislative control rather than be brought under closer democratic oversight.',
    domain: 'money-banking',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'centralization-decentralization', weight: -0.4 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Intellectual property and information ---
  {
    id: 'ip-norm',
    prompt: 'An idea or expression, once shared, cannot be owned by its originator in the same way a physical object can.',
    domain: 'intellectual-property',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'property-legitimacy', weight: 0.6 }],
    reverseScored: true,
  },
  {
    id: 'ip-desc',
    prompt:
      'Long copyright and patent terms mostly protect the revenue of established rightsholders rather than meaningfully encouraging new creative or inventive work.',
    domain: 'intellectual-property',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'market-confidence', weight: -0.4 },
      { axisId: 'public-choice-skepticism', weight: 0.3 },
    ],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'ip-presc',
    prompt: 'Given current evidence, copyright and patent terms should be shortened substantially rather than extended further.',
    domain: 'intellectual-property',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'regulation-deregulation', weight: 0.5 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Civil liberties and speech ---
  {
    id: 'speech-norm-ideal',
    prompt:
      'Even speech that many people find deeply offensive should not be suppressed by the state, so long as it does not directly incite imminent violence.',
    domain: 'civil-liberties-speech',
    layer: 'normative',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'liberty-theory', weight: 0.7 }],
  },
  {
    id: 'speech-presc-ideal',
    prompt:
      'If public discourse were healthy and well-informed, the best response to false or hateful speech would be counter-speech rather than legal restriction.',
    domain: 'civil-liberties-speech',
    layer: 'prescriptive',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'regulation-deregulation', weight: 0.5 }],
    priorityPrompt: PRIORITY_PROMPT,
  },
  {
    id: 'speech-desc-nonideal',
    prompt:
      'In practice, broad legal restrictions on offensive or hateful speech are often eventually applied against minority or dissenting viewpoints rather than only against their original targets.',
    domain: 'civil-liberties-speech',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'public-choice-skepticism', weight: 0.5 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'speech-presc-nonideal',
    prompt:
      'Given how such laws tend to be enforced in practice, restrictions on hateful but non-threatening speech should remain narrow rather than be broadened.',
    domain: 'civil-liberties-speech',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'regulation-deregulation', weight: 0.4 }],
    priorityPrompt: PRIORITY_PROMPT,
  },

  // --- Immigration and borders ---
  {
    id: 'immigration-norm',
    prompt: "A person's place of birth should not by itself limit their moral standing to seek a better life across a border.",
    domain: 'immigration-borders',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'community-boundary', weight: 0.7 }],
  },
  {
    id: 'immigration-desc-nonideal',
    prompt:
      'Large and rapid increases in low-skilled immigration measurably depress wages for the lowest-paid native-born workers in the receiving region.',
    domain: 'immigration-borders',
    layer: 'descriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'market-confidence', weight: -0.3 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'immigration-desc-ideal',
    prompt:
      'If labor markets adjusted quickly and freely, an increase in the local workforce would mostly raise total output rather than displace existing workers.',
    domain: 'immigration-borders',
    layer: 'descriptive',
    theoryContext: 'ideal',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'market-confidence', weight: 0.5 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'immigration-desc-culture',
    prompt:
      "Newcomers' social and cultural practices generally converge toward the host society's norms within a generation or two, given normal social contact.",
    domain: 'immigration-borders',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'likert7',
    axisWeights: [{ axisId: 'cultural-plasticity', weight: 0.5 }],
    allowDontKnow: true,
    confidencePrompt: CONFIDENCE_PROMPT,
  },
  {
    id: 'immigration-presc-nonideal',
    prompt:
      'Given current capacity to verify backgrounds and provide public services, immigration levels should be expanded mainly through faster legal processing rather than relaxed vetting.',
    domain: 'immigration-borders',
    layer: 'prescriptive',
    theoryContext: 'nonideal',
    responseType: 'likert7',
    axisWeights: [
      { axisId: 'regulation-deregulation', weight: 0.3 },
      { axisId: 'gradualism-immediatism', weight: -0.3 },
    ],
    priorityPrompt: PRIORITY_PROMPT,
  },
]

export const questionById = new Map(questions.map((q) => [q.id, q]))
