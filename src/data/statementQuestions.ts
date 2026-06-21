import type { Question } from '../types'

const REFORM_PRIORITY_PROMPT = 'How high a priority is this relative to other reforms?'

/**
 * Prism-style "which statement comes closest to your view" items. Each
 * option carries its own axisWeights (see scoring/aggregate.ts), so picking
 * one is a discrete choice rather than a scaled agreement.
 */
export const statementQuestions: Question[] = [
  {
    id: 'sq01',
    prompt: 'Which comes closest to your view of when political authority is justified?',
    domain: 'state-legitimacy',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'quick',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: "Authority is justified whenever it's needed to prevent chaos, regardless of how it arose.",
        axisWeights: [
          { axisId: 'authority-legitimacy', weight: 1 },
          { axisId: 'anti-domination', weight: -0.6 },
        ],
      },
      {
        id: 'b',
        text: 'Authority is justified only if those subject to it could plausibly have consented to it.',
        axisWeights: [
          { axisId: 'authority-legitimacy', weight: -0.3 },
          { axisId: 'anti-domination', weight: 0.5 },
        ],
      },
      {
        id: 'c',
        text: 'Authority is justified by lawful procedure and real accountability, win or lose.',
        axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.5 }],
      },
      {
        id: 'd',
        text: "No authority over others is ever fully justified; at best it's a tolerated necessity.",
        axisWeights: [
          { axisId: 'authority-legitimacy', weight: -1 },
          { axisId: 'anti-domination', weight: 0.8 },
        ],
      },
    ],
  },
  {
    id: 'sq02',
    prompt: 'Which comes closest to how you think about ownership of productive assets?',
    domain: 'property-ownership',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'moderate',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Whoever first transforms or improves a resource holds the strongest claim to it.',
        axisWeights: [
          { axisId: 'property-legitimacy', weight: 1 },
          { axisId: 'equality-theory', weight: -0.4 },
        ],
      },
      {
        id: 'b',
        text: 'Ownership is a social convention that should be structured to narrow material gaps.',
        axisWeights: [
          { axisId: 'property-legitimacy', weight: -0.6 },
          { axisId: 'equality-theory', weight: 1 },
        ],
      },
      {
        id: 'c',
        text: 'Private ownership is legitimate, but its scope should be limited to what one can personally use.',
        axisWeights: [
          { axisId: 'property-legitimacy', weight: -0.2 },
          { axisId: 'equality-theory', weight: 0.3 },
        ],
      },
      {
        id: 'd',
        text: 'Ownership claims matter less than ensuring everyone has a secure baseline of resources.',
        axisWeights: [
          { axisId: 'property-legitimacy', weight: -0.8 },
          { axisId: 'equality-theory', weight: 0.8 },
        ],
      },
    ],
  },
  {
    id: 'sq03',
    prompt: 'Which statement best matches what you believe actually happens in a modern economy?',
    domain: 'markets-planning',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'quick',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Prices set by competitive exchange usually adjust faster to new information than any planning body could.',
        axisWeights: [{ axisId: 'market-process-confidence', weight: 1 }],
      },
      {
        id: 'b',
        text: "Large firms and finance routinely distort prices, so unregulated exchange doesn't track real value.",
        axisWeights: [{ axisId: 'market-process-confidence', weight: -0.8 }],
      },
      {
        id: 'c',
        text: 'Public agencies can run complex logistics and industrial policy about as well as private firms can.',
        axisWeights: [{ axisId: 'state-capacity-confidence', weight: 0.8 }],
      },
      {
        id: 'd',
        text: 'Centralized planning consistently underperforms decentralized exchange at allocating scarce resources.',
        axisWeights: [
          { axisId: 'market-process-confidence', weight: 0.7 },
          { axisId: 'state-capacity-confidence', weight: -0.6 },
        ],
      },
    ],
  },
  {
    id: 'sq04',
    prompt: 'Which best matches your read on how welfare administration tends to work in practice?',
    domain: 'redistribution-welfare',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'moderate',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: "Means-tested programs are mostly captured by whichever groups can navigate the paperwork or lobby hardest.",
        axisWeights: [{ axisId: 'public-choice-skepticism', weight: 0.8 }],
      },
      {
        id: 'b',
        text: 'Welfare agencies, on the whole, deliver benefits to the people they were designed to reach.',
        axisWeights: [
          { axisId: 'public-choice-skepticism', weight: -0.7 },
          { axisId: 'state-capacity-confidence', weight: 0.6 },
        ],
      },
      {
        id: 'c',
        text: 'Simple, universal transfers avoid most of the failure modes that target narrower programs run into.',
        axisWeights: [{ axisId: 'public-choice-skepticism', weight: 0.3 }],
      },
      {
        id: 'd',
        text: "Administrative capacity is the real bottleneck, not how narrowly a program targets who qualifies.",
        axisWeights: [{ axisId: 'state-capacity-confidence', weight: -0.5 }],
      },
    ],
  },
  {
    id: 'sq05',
    prompt: 'Which comes closest to your view on how to address repeat low-level offending right now?',
    domain: 'crime-policing-justice',
    layer: 'prescriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'quick',
    priorityPrompt: REFORM_PRIORITY_PROMPT,
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Expand policing and sentencing tools to incapacitate repeat offenders quickly.',
        axisWeights: [
          { axisId: 'coercion-strategy', weight: 0.6 },
          { axisId: 'state-action-vs-exit', weight: 0.5 },
        ],
      },
      {
        id: 'b',
        text: 'Invest in diversion and treatment programs instead of expanding punitive enforcement.',
        axisWeights: [{ axisId: 'coercion-strategy', weight: -0.7 }],
      },
      {
        id: 'c',
        text: 'Devolve responses to local communities and civil-society groups rather than centralized agencies.',
        axisWeights: [
          { axisId: 'state-action-vs-exit', weight: -0.8 },
          { axisId: 'centralization-preference', weight: -0.5 },
        ],
      },
      {
        id: 'd',
        text: 'Keep the current framework, but tighten oversight and accountability for how it gets applied.',
        axisWeights: [{ axisId: 'regulation-vs-deregulation', weight: 0.5 }],
      },
    ],
  },
  {
    id: 'sq06',
    prompt: 'Which best captures your view of obligations across borders?',
    domain: 'immigration-borders',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'moderate',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'States owe much stronger obligations to their own citizens than to outsiders.',
        axisWeights: [{ axisId: 'political-community-boundary', weight: -0.8 }],
      },
      {
        id: 'b',
        text: 'Basic obligations of justice extend equally to people regardless of citizenship.',
        axisWeights: [{ axisId: 'political-community-boundary', weight: 0.9 }],
      },
      {
        id: 'c',
        text: 'Obligations scale with proximity and shared institutions, not a strict citizen/non-citizen line.',
        axisWeights: [{ axisId: 'political-community-boundary', weight: 0.2 }],
      },
      {
        id: 'd',
        text: 'Movement across borders is itself a basic liberty that states may only narrowly restrict.',
        axisWeights: [
          { axisId: 'liberty-noninterference', weight: 0.8 },
          { axisId: 'political-community-boundary', weight: 0.4 },
        ],
      },
    ],
  },
  {
    id: 'sq07',
    prompt: 'Which comes closest to how you weigh nature against human use?',
    domain: 'environment-climate-growth',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'quick',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Ecosystems and species have worth independent of any benefit they provide to people.',
        axisWeights: [{ axisId: 'human-nature-priority', weight: 1 }],
      },
      {
        id: 'b',
        text: 'Nature matters mainly because, and to the extent that, it sustains human life and flourishing.',
        axisWeights: [{ axisId: 'human-nature-priority', weight: -1 }],
      },
      {
        id: 'c',
        text: 'Long-run human welfare requires treating ecological limits as hard constraints, not tradeoffs.',
        axisWeights: [{ axisId: 'human-nature-priority', weight: 0.5 }],
      },
      {
        id: 'd',
        text: 'Most environmental harms are worth bearing if they substantially raise material living standards.',
        axisWeights: [{ axisId: 'human-nature-priority', weight: -0.7 }],
      },
    ],
  },
  {
    id: 'sq08',
    prompt: 'Which statement best matches your expectations about advanced AI systems?',
    domain: 'technology-ai-surveillance',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'moderate',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Specialized technical bodies are best positioned to anticipate and manage AI risk.',
        axisWeights: [{ axisId: 'expert-confidence', weight: 0.8 }],
      },
      {
        id: 'b',
        text: 'Concentrating AI oversight in a few expert institutions creates its own risk of capture and error.',
        axisWeights: [{ axisId: 'expert-confidence', weight: -0.7 }],
      },
      {
        id: 'c',
        text: 'Open, decentralized development will sort out safety problems faster than centralized review.',
        axisWeights: [{ axisId: 'coordination-optimism', weight: 0.7 }],
      },
      {
        id: 'd',
        text: 'Without centralized coordination, competitive pressure will outrun voluntary safety norms.',
        axisWeights: [{ axisId: 'coordination-optimism', weight: -0.8 }],
      },
    ],
  },
  {
    id: 'sq09',
    prompt: "Which comes closest to what you'd actually do about housing costs right now?",
    domain: 'land-housing-georgism',
    layer: 'prescriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'extensive',
    priorityPrompt: REFORM_PRIORITY_PROMPT,
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Loosen zoning and permitting rules so more housing can be built where demand is highest.',
        axisWeights: [{ axisId: 'regulation-vs-deregulation', weight: -0.8 }],
      },
      {
        id: 'b',
        text: 'Expand direct rent assistance and public housing subsidies for those priced out.',
        axisWeights: [{ axisId: 'redistribution-vs-predistribution', weight: 0.7 }],
      },
      {
        id: 'c',
        text: 'Shift taxation toward land value so unimproved land is costlier to hold idle.',
        axisWeights: [
          { axisId: 'regulation-vs-deregulation', weight: 0.3 },
          { axisId: 'redistribution-vs-predistribution', weight: -0.4 },
        ],
      },
      {
        id: 'd',
        text: "Strengthen tenant protections and rent regulation rather than changing what gets built.",
        axisWeights: [{ axisId: 'regulation-vs-deregulation', weight: 0.7 }],
      },
    ],
  },
  {
    id: 'sq10',
    prompt: 'Which best matches your view of how monetary policy actually performs?',
    domain: 'money-banking',
    layer: 'descriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'extensive',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Central bank technocrats generally stabilize the economy more than they destabilize it.',
        axisWeights: [{ axisId: 'state-capacity-confidence', weight: 0.8 }],
      },
      {
        id: 'b',
        text: 'Discretionary monetary policy tends to introduce more distortion than it corrects.',
        axisWeights: [
          { axisId: 'state-capacity-confidence', weight: -0.7 },
          { axisId: 'market-process-confidence', weight: 0.4 },
        ],
      },
      {
        id: 'c',
        text: 'Rules-based monetary frameworks outperform discretionary management by technocrats.',
        axisWeights: [{ axisId: 'state-capacity-confidence', weight: -0.3 }],
      },
      {
        id: 'd',
        text: 'Markets price risk better than policymakers can forecast it.',
        axisWeights: [{ axisId: 'market-process-confidence', weight: 0.8 }],
      },
    ],
  },
  {
    id: 'sq11',
    prompt: 'Which comes closest to your view of family and gender norms?',
    domain: 'family-gender-feminism',
    layer: 'normative',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'extensive',
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'A settled, traditional structure for family life provides social goods worth preserving.',
        axisWeights: [{ axisId: 'moral-traditionalism', weight: 0.9 }],
      },
      {
        id: 'b',
        text: 'People should organize family and gender roles however suits them, without a presumed norm.',
        axisWeights: [{ axisId: 'moral-traditionalism', weight: -0.9 }],
      },
      {
        id: 'c',
        text: 'Material equality between genders matters more than which family structure is socially favored.',
        axisWeights: [{ axisId: 'equality-theory', weight: 0.7 }],
      },
      {
        id: 'd',
        text: 'Inherited gender roles mostly reflect durable, functional divisions of labor rather than arbitrary hierarchy.',
        axisWeights: [
          { axisId: 'moral-traditionalism', weight: 0.5 },
          { axisId: 'equality-theory', weight: -0.4 },
        ],
      },
    ],
  },
  {
    id: 'sq12',
    prompt: 'Which comes closest to your theory of how political change actually happens?',
    domain: 'strategy-change',
    layer: 'prescriptive',
    theoryContext: 'mixed',
    responseType: 'statementChoice',
    tier: 'extensive',
    priorityPrompt: REFORM_PRIORITY_PROMPT,
    axisWeights: [],
    statementOptions: [
      {
        id: 'a',
        text: 'Sustained work inside existing institutions is how durable change gets made.',
        axisWeights: [
          { axisId: 'reform-vs-revolution', weight: -0.8 },
          { axisId: 'electoralism-vs-direct-action', weight: 0.6 },
        ],
      },
      {
        id: 'b',
        text: 'Existing institutions are too captured to reform; they need to be replaced, not patched.',
        axisWeights: [{ axisId: 'reform-vs-revolution', weight: 0.9 }],
      },
      {
        id: 'c',
        text: 'Direct action and organizing outside formal channels moves things faster than waiting on electoral cycles.',
        axisWeights: [{ axisId: 'electoralism-vs-direct-action', weight: -0.8 }],
      },
      {
        id: 'd',
        text: 'Change requires both: building leverage outside institutions to force action within them.',
        axisWeights: [
          { axisId: 'reform-vs-revolution', weight: 0.2 },
          { axisId: 'electoralism-vs-direct-action', weight: -0.2 },
        ],
      },
    ],
  },
]
