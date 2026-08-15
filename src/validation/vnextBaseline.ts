import { axes } from "../data/axes";
import { coreQuestions, questions } from "../data/effectiveQuestions";
import type { Question } from "../types";
import {
  CONTEXT_LABEL_IDS,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  PROVISIONAL_SPECIALIST_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  labelTaxonomyById,
  modifierScoringLabels,
  primaryScoringLabels,
} from "../data/labelTaxonomy";
import {
  SPECIALIST_ASSIGNMENT_MODULE_IDS,
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
  specialistModuleDefinitions,
} from "../specialist";
import { CURRENT_RESEARCH_VERSION_BUNDLE } from "./researchContracts";
import {
  VNEXT_BASELINE_CHECK_VERSION,
  VNEXT_FROZEN_BASELINE_COMMIT,
} from "./vnextVersions";

export interface VNextBaselineManifest {
  checkVersion: typeof VNEXT_BASELINE_CHECK_VERSION;
  frozenBaselineCommit: typeof VNEXT_FROZEN_BASELINE_COMMIT;
  production: {
    activeCoreQuestions: number;
    historicalCoreRecords: number;
    effectiveQuestions: number;
    statementChoiceQuestions: number;
    roots: number;
    primaryLabels: number;
    specialistLabels: number;
    modifierLabels: number;
    contextLabels: number;
    retiredLabels: number;
  };
  specialist: {
    moduleCount: number;
    moduleQuestionCount: number;
    mappedLabelCount: number;
    provisionalLabelCount: number;
    rosterVersion: string;
    assignmentStrategy: string;
    moduleOrder: readonly string[];
  };
  versionBundle: Readonly<Record<string, string>>;
}

const EXPECTED = {
  activeCoreQuestions: 338,
  historicalCoreRecords: 496,
  effectiveQuestions: 406,
  statementChoiceQuestions: 6,
  roots: 26,
  primaryLabels: 16,
  specialistLabels: 78,
  modifierLabels: 24,
  contextLabels: 19,
  retiredLabels: 8,
  moduleCount: 9,
  moduleQuestionCount: 68,
  mappedLabelCount: 39,
  provisionalLabelCount: 39,
} as const;

function moduleQuestions(): Question[] {
  return specialistModuleDefinitions.flatMap((module) => module.questions);
}

function scoringInputIds(): Set<string> {
  return new Set([
    ...primaryScoringLabels.map((label) => label.id),
    ...modifierScoringLabels.map((label) => label.id),
  ]);
}

export const vnextBaselineManifest: VNextBaselineManifest = {
  checkVersion: VNEXT_BASELINE_CHECK_VERSION,
  frozenBaselineCommit: VNEXT_FROZEN_BASELINE_COMMIT,
  production: {
    activeCoreQuestions: questions.length,
    historicalCoreRecords: coreQuestions.length,
    effectiveQuestions: questions.length + moduleQuestions().length,
    statementChoiceQuestions: questions.filter(
      (question) => question.responseType === "statementChoice",
    ).length,
    roots: axes.length,
    primaryLabels: PRIMARY_LABEL_IDS.length,
    specialistLabels: SPECIALIST_LABEL_IDS.length,
    modifierLabels: MODIFIER_LABEL_IDS.length,
    contextLabels: CONTEXT_LABEL_IDS.length,
    retiredLabels: RETIRED_LABEL_IDS.length,
  },
  specialist: {
    moduleCount: specialistModuleDefinitions.length,
    moduleQuestionCount: moduleQuestions().length,
    mappedLabelCount:
      SPECIALIST_LABEL_IDS.length - PROVISIONAL_SPECIALIST_LABEL_IDS.length,
    provisionalLabelCount: PROVISIONAL_SPECIALIST_LABEL_IDS.length,
    rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
    assignmentStrategy: SPECIALIST_ASSIGNMENT_STRATEGY,
    moduleOrder: SPECIALIST_ASSIGNMENT_MODULE_IDS,
  },
  versionBundle: CURRENT_RESEARCH_VERSION_BUNDLE,
};

export function vnextBaselineErrors(
  manifest: VNextBaselineManifest = vnextBaselineManifest,
  currentCommit?: string,
): string[] {
  const errors: string[] = [];
  for (const [key, expected] of Object.entries(EXPECTED)) {
    const section =
      key in manifest.production ? manifest.production : manifest.specialist;
    if (section[key as keyof typeof section] !== expected) {
      errors.push(`${key} expected ${expected}`);
    }
  }
  if (manifest.production.roots !== axes.length) {
    errors.push("root count does not match the current axis registry");
  }
  if (
    manifest.specialist.moduleOrder.length !== manifest.specialist.moduleCount
  ) {
    errors.push("Specialist module order does not match module count");
  }
  if (
    manifest.specialist.moduleOrder.some(
      (moduleId, index) => moduleId !== SPECIALIST_ASSIGNMENT_MODULE_IDS[index],
    )
  ) {
    errors.push("Specialist module order drifted from balanced-hash-v2");
  }
  if (
    manifest.specialist.rosterVersion !== SPECIALIST_ASSIGNMENT_ROSTER_VERSION
  ) {
    errors.push("Specialist roster version is not current");
  }
  if (
    manifest.specialist.assignmentStrategy !== SPECIALIST_ASSIGNMENT_STRATEGY
  ) {
    errors.push("Specialist assignment strategy is not current");
  }
  const currentIds = new Set([
    ...PRIMARY_LABEL_IDS,
    ...SPECIALIST_LABEL_IDS,
    ...MODIFIER_LABEL_IDS,
    ...CONTEXT_LABEL_IDS,
    ...RETIRED_LABEL_IDS,
  ]);
  if (currentIds.size !== 145 || labelTaxonomyById.size !== currentIds.size) {
    errors.push("current taxonomy IDs do not resolve exactly once");
  }
  const scoringIds = scoringInputIds();
  for (const labelId of [...CONTEXT_LABEL_IDS, ...RETIRED_LABEL_IDS]) {
    if (scoringIds.has(labelId)) {
      errors.push(`${labelId} is a Context/retired scoring input`);
    }
  }
  const effectiveIds = [
    ...questions.map((question) => question.id),
    ...moduleQuestions().map((question) => question.id),
  ];
  if (new Set(effectiveIds).size !== effectiveIds.length) {
    errors.push(
      "effective item IDs are not unique across core and Specialist forms",
    );
  }
  if (currentCommit && currentCommit !== manifest.frozenBaselineCommit) {
    errors.push(
      `commit ${currentCommit} is not the frozen baseline ${manifest.frozenBaselineCommit}`,
    );
  }
  return errors;
}

export function assertVNextBaseline(
  manifest: VNextBaselineManifest = vnextBaselineManifest,
  currentCommit?: string,
): void {
  const errors = vnextBaselineErrors(manifest, currentCommit);
  if (errors.length > 0) {
    throw new Error(`vNext baseline violation: ${errors.join("; ")}`);
  }
}
