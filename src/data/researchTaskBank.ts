// Decision IDs: D-05, D-07, D-08, D-09, D-18, D-29.
// These are opt-in research scaffolds. They are never part of the production
// question bank and have no path into buildResultProfile.
import { RESEARCH_TASK_BANK_VERSION } from "../research/versions";
import type { ResearchTask } from "../types";

export const researchTaskBank: readonly ResearchTask[] = [
  {
    id: "forecast-state-capacity-001",
    version: RESEARCH_TASK_BANK_VERSION,
    familyId: "domain:state-legitimacy",
    domainId: "state-legitimacy",
    layer: "descriptive",
    theoryContext: "nonideal",
    prompt:
      "By the end of the stated horizon, how likely is the named public service to meet the outcome definition?",
    criterionIds: ["forecast-outcome-state-capacity-001"],
    randomizationSeedKey: "forecast-state-capacity-001",
    stimulus: {
      description:
        "A public service is evaluated against a frozen outcome definition at a stated horizon.",
      profileDescription:
        "The forecast concerns one predefined public-service outcome; it does not estimate an ideology label or public prevalence.",
      constraints: [
        {
          id: "frozen-outcome-definition",
          description:
            "Use only the registered outcome definition and resolution source.",
        },
      ],
    },
    kind: "forecast",
    propositionId: "public-service-target-001",
    outcomeId: "target-reached-under-frozen-definition-001",
    horizon: "24 months after study close",
    probabilityScale: "0-100",
    allowDontKnow: true,
    outcomeDescription:
      "The named public-service target is reached under the frozen outcome-register definition.",
    resolutionSource: "study-outcome-register-v1",
    outcomeVersion: "outcome-register-v1",
  },
  {
    id: "conjoint-strategy-001",
    version: RESEARCH_TASK_BANK_VERSION,
    familyId: "domain:strategy-change",
    domainId: "strategy-change",
    layer: "prescriptive",
    theoryContext: "nonideal",
    prompt:
      "Which strategy should a coalition choose in this scenario, given the stated constraints?",
    criterionIds: ["strategy-choice-001"],
    randomizationSeedKey: "conjoint-strategy-001",
    stimulus: {
      description:
        "A coalition must choose one strategy under a fixed political and administrative context.",
      profileDescription:
        "The displayed profile describes the resources, opposition, uncertainty, reversibility, time horizon, administrative capacity, and political constraints for this choice.",
      constraints: [
        {
          id: "one-strategy",
          description: "Select at most one strategy for the presented profile.",
        },
        {
          id: "profile-bound",
          description:
            "Evaluate each strategy only under the displayed attribute levels.",
        },
        {
          id: "no-outcome-key",
          description:
            "There is no keyed correct answer; record the participant's judgment.",
        },
      ],
    },
    kind: "conjoint",
    choiceSetId: "strategy-choice-set-v1",
    attributes: [
      {
        id: "resources",
        description: "Resources available to the coalition",
        levels: ["scarce", "adequate", "abundant"],
      },
      {
        id: "administrative-capacity",
        description: "Administrative capacity available for implementation",
        levels: ["limited", "moderate", "strong"],
      },
      {
        id: "opposition",
        description: "Strength and organization of opposition",
        levels: ["low", "organized", "dominant"],
      },
      {
        id: "uncertainty",
        description: "Uncertainty about the surrounding conditions",
        levels: ["low", "high"],
      },
      {
        id: "reversibility",
        description: "How easily the choice can be reversed",
        levels: ["easy-to-reverse", "costly-to-reverse"],
      },
      {
        id: "time-horizon",
        description: "Time available for the strategy to take effect",
        levels: ["short", "medium", "long"],
      },
      {
        id: "political-constraints",
        description: "Political constraints on coalition action",
        levels: ["narrow-coalition", "mixed-coalition", "broad-coalition"],
      },
    ],
    attributeProfiles: [
      {
        id: "strategy-profile-scarce-short",
        description:
          "Scarce resources and a short horizon make implementation capacity especially constrained.",
        levels: {
          resources: "scarce",
          "administrative-capacity": "limited",
          opposition: "organized",
          uncertainty: "high",
          reversibility: "costly-to-reverse",
          "time-horizon": "short",
          "political-constraints": "narrow-coalition",
        },
      },
      {
        id: "strategy-profile-adequate-medium",
        description:
          "Adequate resources and a medium horizon leave mixed administrative and political constraints.",
        levels: {
          resources: "adequate",
          "administrative-capacity": "moderate",
          opposition: "organized",
          uncertainty: "high",
          reversibility: "easy-to-reverse",
          "time-horizon": "medium",
          "political-constraints": "mixed-coalition",
        },
      },
      {
        id: "strategy-profile-abundant-long",
        description:
          "Abundant resources and a long horizon allow stronger administrative capacity despite dominant opposition.",
        levels: {
          resources: "abundant",
          "administrative-capacity": "strong",
          opposition: "dominant",
          uncertainty: "low",
          reversibility: "costly-to-reverse",
          "time-horizon": "long",
          "political-constraints": "broad-coalition",
        },
      },
    ],
    alternatives: [
      "work through existing institutions",
      "build a parallel institution",
      "use a direct-action campaign",
    ],
    constraintProfileId: "strategy-constraints-v1",
  },
  {
    id: "allocation-welfare-001",
    version: RESEARCH_TASK_BANK_VERSION,
    familyId: "domain:redistribution-welfare",
    domainId: "redistribution-welfare",
    layer: "normative",
    theoryContext: "mixed",
    prompt:
      "Allocate the available units among these public goods according to the priority you think the policy should express.",
    criterionIds: ["normative-priority-welfare-001"],
    randomizationSeedKey: "allocation-welfare-001",
    stimulus: {
      description:
        "A fixed public budget must be allocated among the listed goods.",
      profileDescription:
        "The allocation expresses relative priority under an abstract, research-only budget constraint.",
      constraints: [
        {
          id: "whole-units",
          description: "Allocate whole units only.",
        },
        {
          id: "nonnegative",
          description: "No good may receive a negative allocation.",
        },
        {
          id: "sum-equals-total",
          description: "All available units must be allocated exactly once.",
        },
      ],
    },
    kind: "allocation",
    goods: ["income-floor", "health-services", "housing-support"],
    goodDescriptions: {
      "income-floor": "Direct income support that guarantees a minimum floor.",
      "health-services": "Publicly provided health services.",
      "housing-support": "Support intended to secure stable housing.",
    },
    totalUnits: 100,
    constraints: ["whole-units", "nonnegative", "sum-equals-total"],
  },
  {
    id: "similarity-profile-001",
    version: RESEARCH_TASK_BANK_VERSION,
    familyId: "domain:state-legitimacy",
    domainId: "state-legitimacy",
    layer: "normative",
    theoryContext: "ideal",
    prompt:
      "Rate how similar each research profile is to the political outlook you would endorse on the stated dimensions.",
    criterionIds: ["profile-similarity-001"],
    randomizationSeedKey: "similarity-profile-001",
    stimulus: {
      description:
        "Rate similarity to frozen research profile descriptions, not to public ideology labels.",
      profileDescription:
        "These profiles are exploratory item bundles for perception research and are not production scoring endpoints.",
      constraints: [
        {
          id: "independent-ratings",
          description: "Rate each profile independently on the stated scale.",
        },
        {
          id: "no-label-inference",
          description:
            "Do not infer or assign an ideology label from the profile names.",
        },
      ],
    },
    kind: "similarity",
    stimulusIds: [
      "profile-authority-justified-001",
      "profile-authority-contestable-001",
      "profile-authority-localist-001",
    ],
    stimuli: [
      {
        id: "profile-authority-justified-001",
        version: "2026-08-profile-stimuli-v1",
        description:
          "Public authority is acceptable when it is justified by shared reasons and accountable to those affected.",
      },
      {
        id: "profile-authority-contestable-001",
        version: "2026-08-profile-stimuli-v1",
        description:
          "Public authority is legitimate only when people can contest, revise, or withdraw it.",
      },
      {
        id: "profile-authority-localist-001",
        version: "2026-08-profile-stimuli-v1",
        description:
          "Public authority should remain close to communities and be limited to tasks they cannot coordinate themselves.",
      },
    ],
    responseScale: "0-100 similarity",
  },
] satisfies readonly ResearchTask[];

export const researchTaskById = new Map(
  researchTaskBank.map((task) => [task.id, task]),
);
