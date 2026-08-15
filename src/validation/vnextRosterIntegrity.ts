import {
  CONTEXT_LABEL_IDS,
  LABEL_IDS_BY_ROLE,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  labelTaxonomyById,
  primaryScoringLabels,
  specialistModuleByLabel,
} from "../data/labelTaxonomy";
import { labels } from "../data/labels";
import { modifierMeasurementDefinitions } from "../data/modifierMeasurement";
import {
  SPECIALIST_ASSIGNMENT_MODULE_IDS as MODULE_ROSTER,
  specialistModuleDefinitions,
} from "../specialist";
import {
  VNEXT_ROSTER_INTEGRITY_VERSION,
  VNEXT_FACET_MAP_VERSION,
} from "./vnextVersions";

const EXPECTED_ROLE_COUNTS = {
  primary: 16,
  specialist: 78,
  modifier: 24,
  context: 19,
  retired: 8,
} as const;

const EXPECTED_DIRECT_MODIFIERS = new Set([
  "anti-imperialism",
  "cosmopolitanism",
  "civil-libertarianism",
  "decentralist-orientation",
  "feminist-orientation",
  "multiculturalism",
  "technocratic-orientation",
]);

const EXPECTED_FOCUSED_MODIFIERS = new Set(["ethnonationalist"]);

export interface VNextRosterIntegrityReport {
  version: typeof VNEXT_ROSTER_INTEGRITY_VERSION;
  facetMapVersion: typeof VNEXT_FACET_MAP_VERSION;
  currentLabelCount: number;
  roleCounts: Readonly<Record<keyof typeof EXPECTED_ROLE_COUNTS, number>>;
  primaryScopeCount: number;
  directModifierCount: number;
  focusedModifierCount: number;
  mappedSpecialistCount: number;
  provisionalSpecialistCount: number;
  moduleCount: number;
}

function sameMembers(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return (
    left.length === right.length &&
    new Set(left).size === left.length &&
    left.every((value) => right.includes(value))
  );
}

export function vnextRosterErrors(): string[] {
  const errors: string[] = [];
  const allIds = Object.values(LABEL_IDS_BY_ROLE).flat();
  const labelIds = labels.map((label) => label.id);

  if (!sameMembers(allIds, labelIds)) {
    errors.push("role rosters do not form a bijection with the label catalog");
  }
  if (new Set(allIds).size !== allIds.length) {
    errors.push("a label appears in more than one current role roster");
  }

  for (const [role, expected] of Object.entries(EXPECTED_ROLE_COUNTS)) {
    const ids = LABEL_IDS_BY_ROLE[role as keyof typeof LABEL_IDS_BY_ROLE];
    if (ids.length !== expected) {
      errors.push(`${role} roster expected ${expected}, found ${ids.length}`);
    }
  }

  for (const id of allIds) {
    const taxonomy = labelTaxonomyById.get(id);
    if (!taxonomy) errors.push(`${id} is missing taxonomy metadata`);
    if (taxonomy?.role !== roleForRosterId(id)) {
      errors.push(`${id} taxonomy role does not match its roster role`);
    }
  }

  if (primaryScoringLabels.length !== PRIMARY_LABEL_IDS.length) {
    errors.push("every Primary must have a primary scoring scope");
  }
  if (
    primaryScoringLabels.some(
      (label) => !label.scoringScope || label.scoringScope.axisIds.length === 0,
    )
  ) {
    errors.push("a Primary scoring scope has no declared root axis");
  }

  const modifierIds = modifierMeasurementDefinitions.map(
    (definition) => definition.labelId,
  );
  if (!sameMembers(modifierIds, MODIFIER_LABEL_IDS)) {
    errors.push(
      "Modifier measurement dispositions do not cover the full roster",
    );
  }
  const directModifiers = new Set(
    modifierMeasurementDefinitions
      .filter((definition) => definition.availability === "core-construct")
      .map((definition) => definition.labelId),
  );
  const focusedModifiers = new Set(
    modifierMeasurementDefinitions
      .filter((definition) => definition.availability === "focused-follow-up")
      .map((definition) => definition.labelId),
  );
  if (!sameMembers([...directModifiers], [...EXPECTED_DIRECT_MODIFIERS])) {
    errors.push(
      "direct Modifier construct roster drifted from the approved seven",
    );
  }
  if (!sameMembers([...focusedModifiers], [...EXPECTED_FOCUSED_MODIFIERS])) {
    errors.push(
      "focused Modifier roster drifted from the approved disposition",
    );
  }

  const mappedSpecialists = Object.keys(specialistModuleByLabel);
  if (
    mappedSpecialists.some(
      (id) =>
        !SPECIALIST_LABEL_IDS.includes(
          id as (typeof SPECIALIST_LABEL_IDS)[number],
        ),
    )
  ) {
    errors.push("a module mapping points outside the Specialist roster");
  }
  if (mappedSpecialists.length !== 39) {
    errors.push(
      `expected 39 module-mapped Specialists, found ${mappedSpecialists.length}`,
    );
  }
  if (SPECIALIST_LABEL_IDS.length - mappedSpecialists.length !== 39) {
    errors.push("expected 39 provisional/catalog-only Specialists");
  }

  const moduleIds = specialistModuleDefinitions.map((module) => module.id);
  if (!sameMembers(moduleIds, MODULE_ROSTER)) {
    errors.push(
      "registered Specialist modules do not match the frozen ordered roster",
    );
  }
  if (MODULE_ROSTER.length !== 9)
    errors.push("expected nine Specialist modules");

  const contextSet = new Set(CONTEXT_LABEL_IDS);
  if (mappedSpecialists.some((id) => contextSet.has(id as never))) {
    errors.push("Context entered Specialist module mapping");
  }
  if (
    primaryScoringLabels.some((label) => contextSet.has(label.id as never)) ||
    modifierMeasurementDefinitions.some((definition) =>
      contextSet.has(definition.labelId as never),
    )
  ) {
    errors.push("Context entered ordinary Primary or Modifier measurement");
  }

  for (const id of RETIRED_LABEL_IDS) {
    const taxonomy = labelTaxonomyById.get(id);
    if (!taxonomy?.legacyDisposition) {
      errors.push(`retired label ${id} lacks a compatibility disposition`);
    }
    if (taxonomy?.aliasOf && !labelTaxonomyById.has(taxonomy.aliasOf)) {
      errors.push(`retired alias ${id} points to an unknown target`);
    }
    if (
      taxonomy?.aliasOf &&
      RETIRED_LABEL_IDS.includes(taxonomy.aliasOf as never)
    ) {
      errors.push(`retired alias ${id} points to another retired endpoint`);
    }
  }

  return errors;
}

function roleForRosterId(
  id: string,
): keyof typeof LABEL_IDS_BY_ROLE | undefined {
  for (const [role, ids] of Object.entries(LABEL_IDS_BY_ROLE)) {
    if (ids.includes(id as never))
      return role as keyof typeof LABEL_IDS_BY_ROLE;
  }
  return undefined;
}

export function rosterIntegrityReport(): VNextRosterIntegrityReport {
  const errors = vnextRosterErrors();
  if (errors.length > 0) {
    throw new Error(`vNext roster violation: ${errors.join("; ")}`);
  }
  return {
    version: VNEXT_ROSTER_INTEGRITY_VERSION,
    facetMapVersion: VNEXT_FACET_MAP_VERSION,
    currentLabelCount: labels.length,
    roleCounts: {
      primary: PRIMARY_LABEL_IDS.length,
      specialist: SPECIALIST_LABEL_IDS.length,
      modifier: MODIFIER_LABEL_IDS.length,
      context: CONTEXT_LABEL_IDS.length,
      retired: RETIRED_LABEL_IDS.length,
    },
    primaryScopeCount: primaryScoringLabels.length,
    directModifierCount: EXPECTED_DIRECT_MODIFIERS.size,
    focusedModifierCount: EXPECTED_FOCUSED_MODIFIERS.size,
    mappedSpecialistCount: Object.keys(specialistModuleByLabel).length,
    provisionalSpecialistCount:
      SPECIALIST_LABEL_IDS.length - Object.keys(specialistModuleByLabel).length,
    moduleCount: MODULE_ROSTER.length,
  };
}

export function assertVNextRosterIntegrity(): void {
  const errors = vnextRosterErrors();
  if (errors.length > 0) {
    throw new Error(`vNext roster violation: ${errors.join("; ")}`);
  }
}
