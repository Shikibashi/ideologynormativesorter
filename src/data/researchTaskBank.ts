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
    kind: "forecast",
    propositionId: "public-service-target-001",
    outcomeId: "target-reached-under-frozen-definition-001",
    horizon: "24 months after study close",
    probabilityScale: "0-100",
    allowDontKnow: true,
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
    kind: "conjoint",
    choiceSetId: "strategy-choice-set-v1",
    attributes: [
      {
        id: "administrative-capacity",
        levels: ["limited", "moderate", "strong"],
      },
      {
        id: "opposition",
        levels: ["low", "organized", "dominant"],
      },
      {
        id: "reversibility",
        levels: ["easy-to-reverse", "costly-to-reverse"],
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
    kind: "allocation",
    goods: ["income-floor", "health-services", "housing-support"],
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
    kind: "similarity",
    stimulusIds: [
      "profile-authority-justified-001",
      "profile-authority-contestable-001",
      "profile-authority-localist-001",
    ],
    responseScale: "0-100 similarity",
  },
] satisfies readonly ResearchTask[];

export const researchTaskById = new Map(
  researchTaskBank.map((task) => [task.id, task]),
);
