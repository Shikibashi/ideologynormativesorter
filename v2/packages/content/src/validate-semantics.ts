import type {
  CanonicalContentBundle,
  ConstructRecord,
  ItemRecord,
  ModifierProfileRecord,
  PrimaryProfileRecord,
  SpecialistCandidateRecord,
  SpecialistModuleRecord,
  SpecialistProfileRecord,
} from "../../contracts/src/index";
import type { ConstitutiveGate } from "../../contracts/src/scoring";
import type { ValidationIssue, ValidationReport } from "./validate-schema";

function addIssue(
  issues: ValidationIssue[],
  path: string,
  code: string,
  message: string,
): void {
  issues.push({ path, code, message });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectIds(
  values: Array<{ id: string }> | undefined,
  namespace: string,
  issues: ValidationIssue[],
  globalIds: Map<string, string>,
): Set<string> {
  const ids = new Set<string>();
  for (const [index, value] of (values ?? []).entries()) {
    const id = value?.id;
    if (typeof id !== "string" || id.length === 0) continue;
    if (ids.has(id))
      addIssue(
        issues,
        `${namespace}[${index}].id`,
        "collision",
        `Duplicate ${namespace} id ${id}`,
      );
    ids.add(id);
    const existing = globalIds.get(id);
    if (existing && existing !== namespace) {
      addIssue(
        issues,
        `${namespace}[${index}].id`,
        "collision",
        `ID ${id} is also owned by ${existing}`,
      );
    } else {
      globalIds.set(id, namespace);
    }
  }
  return ids;
}

function validateRef(
  value: string | undefined,
  known: Set<string>,
  path: string,
  label: string,
  issues: ValidationIssue[],
): void {
  if (value !== undefined && !known.has(value))
    addIssue(issues, path, "ref", `Unknown ${label} ${value}`);
}

function validateProvenanceRefs(
  value: string[] | undefined,
  known: Set<string>,
  path: string,
  issues: ValidationIssue[],
): void {
  for (const [index, ref] of (value ?? []).entries())
    validateRef(ref, known, `${path}[${index}]`, "provenance source", issues);
}

function validateContributionRefs(
  item: ItemRecord,
  constructMap: Map<string, ConstructRecord>,
  issues: ValidationIssue[],
): number {
  let count = 0;
  const contributions = item.scoring.contributions;
  for (const [index, contribution] of contributions.entries()) {
    const construct = constructMap.get(contribution.constructId);
    if (!construct) {
      addIssue(
        issues,
        `items[${item.id}].scoring.contributions[${index}].constructId`,
        "ref",
        `Unknown construct ${contribution.constructId}`,
      );
    } else if (
      !isFiniteNumber(contribution.weight) ||
      contribution.weight <= 0
    ) {
      addIssue(
        issues,
        `items[${item.id}].scoring.contributions[${index}].weight`,
        "value",
        "Contribution weight must be finite and positive",
      );
    }
    if (item.role === "core" && construct?.scope === "specialist") {
      addIssue(
        issues,
        `items[${item.id}].scoring.contributions[${index}]`,
        "scope",
        "Core item cannot map to specialist-local construct",
      );
    }
    if (
      item.role === "specialist" &&
      construct?.scope === "specialist" &&
      construct.moduleId !== item.moduleId
    ) {
      addIssue(
        issues,
        `items[${item.id}].scoring.contributions[${index}]`,
        "scope",
        "Specialist item mapping belongs to another module",
      );
    }
    count += 1;
  }
  if (item.responseType === "statement-choice") {
    for (const [optionIndex, option] of item.options.entries()) {
      for (const [
        contributionIndex,
        contribution,
      ] of option.contributions.entries()) {
        if (!constructMap.has(contribution.constructId)) {
          addIssue(
            issues,
            `items[${item.id}].options[${optionIndex}].contributions[${contributionIndex}].constructId`,
            "ref",
            `Unknown construct ${contribution.constructId}`,
          );
        }
        count += 1;
      }
    }
  }
  return count;
}

function validateGateSet(
  gates: ConstitutiveGate[],
  knownConstructs: Set<string>,
  path: string,
  issues: ValidationIssue[],
): void {
  const gateIds = new Set<string>();
  const childrenByGate = new Map<string, string[]>();
  for (const [index, gate] of gates.entries()) {
    const gatePath = `${path}[${index}]`;
    if (gateIds.has(gate.id))
      addIssue(
        issues,
        `${gatePath}.id`,
        "collision",
        `Duplicate gate id ${gate.id}`,
      );
    gateIds.add(gate.id);
    if (
      "constructId" in gate &&
      gate.constructId !== undefined &&
      !knownConstructs.has(gate.constructId)
    ) {
      addIssue(
        issues,
        `${gatePath}.constructId`,
        "ref",
        `Unknown gate construct ${gate.constructId}`,
      );
    }
    if (gate.operator === "interval" && gate.minimum > gate.maximum)
      addIssue(
        issues,
        gatePath,
        "value",
        "Gate interval minimum exceeds maximum",
      );
    if (gate.operator === "evidenceMinimum") {
      if (
        !isFiniteNumber(gate.minimumEvidenceRatio) ||
        gate.minimumEvidenceRatio < 0 ||
        gate.minimumEvidenceRatio > 1
      ) {
        addIssue(
          issues,
          `${gatePath}.minimumEvidenceRatio`,
          "value",
          "Evidence minimum must be in [0,1]",
        );
      }
      if (
        gate.minimumItemCount !== undefined &&
        (!isFiniteNumber(gate.minimumItemCount) || gate.minimumItemCount < 0)
      ) {
        addIssue(
          issues,
          `${gatePath}.minimumItemCount`,
          "value",
          "Minimum item count must be finite and >= 0",
        );
      }
    }
    if (gate.operator === "conjunction" || gate.operator === "disjunction") {
      childrenByGate.set(gate.id, gate.children);
      for (const [childIndex, childId] of gate.children.entries()) {
        if (
          !gateIds.has(childId) &&
          !gates.some((candidate) => candidate.id === childId)
        ) {
          addIssue(
            issues,
            `${gatePath}.children[${childIndex}]`,
            "ref",
            `Unknown child gate ${childId}`,
          );
        }
      }
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) {
      addIssue(
        issues,
        `${path}`,
        "cycle",
        `Gate graph contains a cycle at ${id}`,
      );
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const child of childrenByGate.get(id) ?? []) visit(child);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of childrenByGate.keys()) visit(id);
}

function validateItemSemantics(
  item: ItemRecord,
  constructMap: Map<string, ConstructRecord>,
  moduleMap: Map<string, SpecialistModuleRecord>,
  domainIds: Set<string>,
  issues: ValidationIssue[],
): number {
  if (!domainIds.has(item.domainId))
    addIssue(
      issues,
      `items[${item.id}].domainId`,
      "ref",
      `Unknown domain ${item.domainId}`,
    );
  if (item.role === "specialist") {
    if (!item.moduleId)
      addIssue(
        issues,
        `items[${item.id}].moduleId`,
        "ref",
        "Specialist item requires moduleId",
      );
    else if (!moduleMap.has(item.moduleId))
      addIssue(
        issues,
        `items[${item.id}].moduleId`,
        "ref",
        `Unknown specialist module ${item.moduleId}`,
      );
  } else if (item.moduleId) {
    addIssue(
      issues,
      `items[${item.id}].moduleId`,
      "scope",
      "Core item cannot belong to specialist module",
    );
  }
  if (item.responseType === "statement-choice") {
    if (
      item.scoring.mappingMode !== "options" ||
      item.scoring.contributions.length !== 0
    ) {
      addIssue(
        issues,
        `items[${item.id}].scoring`,
        "mapping",
        "Statement-choice item must use option-owned mappings only",
      );
    }
    if (item.options.some((option) => option.contributions.length === 0))
      addIssue(
        issues,
        `items[${item.id}].options`,
        "mapping",
        "Every statement option requires a mapping",
      );
  } else {
    if (
      item.scoring.mappingMode !== "item" ||
      item.scoring.contributions.length === 0
    )
      addIssue(
        issues,
        `items[${item.id}].scoring`,
        "mapping",
        "Likert item requires item-owned mapping",
      );
  }
  return validateContributionRefs(item, constructMap, issues);
}

function validatePrimaryProfile(
  profile: PrimaryProfileRecord,
  constructMap: Map<string, ConstructRecord>,
  nodeIds: Set<string>,
  provenanceIds: Set<string>,
  issues: ValidationIssue[],
): void {
  validateRef(
    profile.targetNodeId,
    nodeIds,
    `profiles[${profile.id}].targetNodeId`,
    "ontology node",
    issues,
  );
  for (const [index, requirement] of (profile.requirements ?? []).entries()) {
    const construct = constructMap.get(requirement.constructId);
    if (!construct)
      addIssue(
        issues,
        `profiles[${profile.id}].requirements[${index}].constructId`,
        "ref",
        `Unknown construct ${requirement.constructId}`,
      );
    else if (construct.scope !== "root")
      addIssue(
        issues,
        `profiles[${profile.id}].requirements[${index}].constructId`,
        "scope",
        "Primary profile must target root constructs",
      );
  }
  validateGateSet(
    profile.gates,
    new Set(constructMap.keys()),
    `profiles[${profile.id}].gates`,
    issues,
  );
  validateProvenanceRefs(
    profile.provenanceRefs,
    provenanceIds,
    `profiles[${profile.id}].provenanceRefs`,
    issues,
  );
}

function validateModifierProfile(
  modifier: ModifierProfileRecord,
  itemMap: Map<string, ItemRecord>,
  constructMap: Map<string, ConstructRecord>,
  provenanceIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const indicatorIds = new Set<string>();
  for (const [index, indicator] of modifier.indicators.entries()) {
    const path = `modifiers[${modifier.id}].indicators[${index}]`;
    validateRef(
      indicator.itemId,
      new Set(itemMap.keys()),
      `${path}.itemId`,
      "item",
      issues,
    );
    if (indicatorIds.has(indicator.itemId))
      addIssue(
        issues,
        `${path}.itemId`,
        "collision",
        "Modifier indicator item IDs must be unique",
      );
    indicatorIds.add(indicator.itemId);
    const item = itemMap.get(indicator.itemId);
    if (item && (item.role !== "core" || item.status !== "active"))
      addIssue(
        issues,
        `${path}.itemId`,
        "scope",
        "Modifier indicators must reference active core items",
      );
    if (!isFiniteNumber(indicator.weight) || indicator.weight <= 0)
      addIssue(
        issues,
        `${path}.weight`,
        "value",
        "Modifier indicator weight must be finite and positive",
      );
    if (
      indicator.targetValue !== undefined &&
      (!isFiniteNumber(indicator.targetValue) ||
        indicator.targetValue < -1 ||
        indicator.targetValue > 1)
    )
      addIssue(
        issues,
        `${path}.targetValue`,
        "value",
        "Modifier indicator target must be within [-1,1]",
      );
    if (
      indicator.minimumEvidenceWeight !== undefined &&
      (!isFiniteNumber(indicator.minimumEvidenceWeight) ||
        indicator.minimumEvidenceWeight < 0)
    )
      addIssue(
        issues,
        `${path}.minimumEvidenceWeight`,
        "value",
        "Modifier indicator evidence minimum must be finite and >= 0",
      );
  }
  if (
    modifier.availability === "core-construct" &&
    modifier.indicators.length === 0
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].indicators`,
      "mapping",
      "Core modifier requires direct item indicators",
    );
  if (
    modifier.availability !== "core-construct" &&
    modifier.indicators.length > 0
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].indicators`,
      "scope",
      "Only core-construct modifiers may expose ordinary direct indicators",
    );
  if (
    modifier.minimumAnsweredItems !== undefined &&
    (!Number.isInteger(modifier.minimumAnsweredItems) ||
      modifier.minimumAnsweredItems < 0 ||
      modifier.minimumAnsweredItems > modifier.indicators.length)
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].minimumAnsweredItems`,
      "value",
      "Minimum answered items must be a valid indicator count",
    );
  if (
    modifier.minimumEvidenceRatio !== undefined &&
    (!isFiniteNumber(modifier.minimumEvidenceRatio) ||
      modifier.minimumEvidenceRatio < 0 ||
      modifier.minimumEvidenceRatio > 1)
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].minimumEvidenceRatio`,
      "value",
      "Modifier evidence minimum must be within [0,1]",
    );
  if (
    modifier.fitThreshold !== undefined &&
    (!isFiniteNumber(modifier.fitThreshold) ||
      modifier.fitThreshold < 0 ||
      modifier.fitThreshold > 1)
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].fitThreshold`,
      "value",
      "Modifier fit threshold must be within [0,1]",
    );
  if (
    modifier.availability === "core-construct" &&
    modifier.minimumAnsweredItems === undefined
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].minimumAnsweredItems`,
      "value",
      "Core modifier must declare its minimum answered indicator count",
    );
  if (
    modifier.availability === "core-construct" &&
    modifier.minimumEvidenceRatio === undefined
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].minimumEvidenceRatio`,
      "value",
      "Core modifier must declare its evidence threshold",
    );
  if (
    modifier.availability === "core-construct" &&
    modifier.fitThreshold === undefined
  )
    addIssue(
      issues,
      `modifiers[${modifier.id}].fitThreshold`,
      "value",
      "Core modifier must declare its fit threshold",
    );
  validateGateSet(
    modifier.gates,
    new Set(constructMap.keys()),
    `modifiers[${modifier.id}].gates`,
    issues,
  );
  validateProvenanceRefs(
    modifier.provenanceRefs,
    provenanceIds,
    `modifiers[${modifier.id}].provenanceRefs`,
    issues,
  );
}

function validateCandidate(
  candidate: SpecialistCandidateRecord,
  constructMap: Map<string, ConstructRecord>,
  moduleMap: Map<string, SpecialistModuleRecord>,
  nodeIds: Set<string>,
  provenanceIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const module = moduleMap.get(candidate.moduleId);
  if (!module)
    addIssue(
      issues,
      `specialistCandidates[${candidate.id}].moduleId`,
      "ref",
      `Unknown module ${candidate.moduleId}`,
    );
  validateRef(
    candidate.nodeId,
    nodeIds,
    `specialistCandidates[${candidate.id}].nodeId`,
    "ontology node",
    issues,
  );
  for (const [index, requirement] of candidate.requirements.entries()) {
    const construct = constructMap.get(requirement.constructId);
    if (!construct)
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].requirements[${index}].constructId`,
        "ref",
        `Unknown construct ${requirement.constructId}`,
      );
    else if (
      construct.scope !== "specialist" ||
      construct.moduleId !== candidate.moduleId
    )
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].requirements[${index}].constructId`,
        "scope",
        "Candidate requirement is outside its module scope",
      );
  }
  validateGateSet(
    candidate.gates,
    new Set(constructMap.keys()),
    `specialistCandidates[${candidate.id}].gates`,
    issues,
  );
  validateProvenanceRefs(
    candidate.provenanceRefs,
    provenanceIds,
    `specialistCandidates[${candidate.id}].provenanceRefs`,
    issues,
  );
}

function validateSpecialistProfile(
  profile: SpecialistProfileRecord,
  itemMap: Map<string, ItemRecord>,
  moduleMap: Map<string, SpecialistModuleRecord>,
  nodeMap: Map<string, { nodeScope?: string }>,
  constructMap: Map<string, ConstructRecord>,
  provenanceIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const node = nodeMap.get(profile.specialistId);
  if (!node || node.nodeScope !== "specialist")
    addIssue(
      issues,
      `specialists[${profile.id}].specialistId`,
      "ref",
      "Specialist profile must target a specialist ontology node",
    );
  if (profile.moduleId && !moduleMap.has(profile.moduleId))
    addIssue(
      issues,
      `specialists[${profile.id}].moduleId`,
      "ref",
      `Unknown specialist module ${profile.moduleId}`,
    );
  for (const [index, itemId] of profile.itemIds.entries()) {
    const item = itemMap.get(itemId);
    if (!item)
      addIssue(
        issues,
        `specialists[${profile.id}].itemIds[${index}]`,
        "ref",
        `Unknown item ${itemId}`,
      );
    else if (item.role !== "specialist" || item.moduleId !== profile.moduleId)
      addIssue(
        issues,
        `specialists[${profile.id}].itemIds[${index}]`,
        "scope",
        "Specialist profile item does not belong to its module",
      );
  }
  validateGateSet(
    profile.gates,
    new Set(constructMap.keys()),
    `specialists[${profile.id}].gates`,
    issues,
  );
  for (const [index, variant] of (profile.variants ?? []).entries()) {
    for (const [
      requirementIndex,
      requirement,
    ] of variant.requirements.entries()) {
      const construct = constructMap.get(requirement.constructId);
      if (!construct)
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].requirements[${requirementIndex}]`,
          "ref",
          "Unknown variant construct",
        );
      else if (
        construct.scope !== "specialist" ||
        construct.moduleId !== profile.moduleId
      )
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].requirements[${requirementIndex}]`,
          "scope",
          "Variant construct is outside profile module",
        );
    }
    validateGateSet(
      variant.gates,
      new Set(constructMap.keys()),
      `specialists[${profile.id}].variants[${index}].gates`,
      issues,
    );
  }
  validateProvenanceRefs(
    profile.provenanceRefs,
    provenanceIds,
    `specialists[${profile.id}].provenanceRefs`,
    issues,
  );
}

function validateSpecialistModuleActivation(
  module: SpecialistModuleRecord,
  issues: ValidationIssue[],
): void {
  const activation = module.activation;
  if (activation === undefined) return;
  if (activation.strategy !== "explicit-request") {
    addIssue(
      issues,
      `specialistModules[${module.id}].activation.strategy`,
      "value",
      "Specialist module activation must be explicit-request",
    );
  }
  if (
    !Number.isInteger(activation.minimumAnsweredItems) ||
    activation.minimumAnsweredItems < 0 ||
    activation.minimumAnsweredItems > module.itemIds.length
  ) {
    addIssue(
      issues,
      `specialistModules[${module.id}].activation.minimumAnsweredItems`,
      "value",
      "Minimum answered items must be an integer within the module item count",
    );
  }
  if (
    !isFiniteNumber(activation.minimumAnsweredWeightRatio) ||
    activation.minimumAnsweredWeightRatio < 0 ||
    activation.minimumAnsweredWeightRatio > 1
  ) {
    addIssue(
      issues,
      `specialistModules[${module.id}].activation.minimumAnsweredWeightRatio`,
      "value",
      "Minimum answered weight ratio must be within [0,1]",
    );
  }
  if (
    !isFiniteNumber(activation.minimumConstructCoverageRatio) ||
    activation.minimumConstructCoverageRatio < 0 ||
    activation.minimumConstructCoverageRatio > 1
  ) {
    addIssue(
      issues,
      `specialistModules[${module.id}].activation.minimumConstructCoverageRatio`,
      "value",
      "Minimum construct coverage ratio must be within [0,1]",
    );
  }
}

export function countExplicitMappings(bundle: CanonicalContentBundle): number {
  return bundle.items.reduce(
    (total, item) =>
      total +
      item.scoring.contributions.length +
      (item.responseType === "statement-choice"
        ? item.options.reduce(
            (optionTotal, option) => optionTotal + option.contributions.length,
            0,
          )
        : 0),
    0,
  );
}

export function validateContentSemantics(
  bundle: CanonicalContentBundle,
): ValidationReport<CanonicalContentBundle> {
  const issues: ValidationIssue[] = [];
  const globalIds = new Map<string, string>();
  const domainIds = collectIds(bundle.domains, "domains", issues, globalIds);
  collectIds(bundle.constructs, "constructs", issues, globalIds);
  collectIds(bundle.items, "items", issues, globalIds);
  const profileIds = collectIds(bundle.profiles, "profiles", issues, globalIds);
  const modifierIds = collectIds(
    bundle.modifiers,
    "modifiers",
    issues,
    globalIds,
  );
  const specialistIds = collectIds(
    bundle.specialists,
    "specialists",
    issues,
    globalIds,
  );
  const moduleIds = collectIds(
    bundle.specialistModules,
    "specialistModules",
    issues,
    globalIds,
  );
  const candidateIds = collectIds(
    bundle.specialistCandidates,
    "specialistCandidates",
    issues,
    globalIds,
  );
  const nodeIds = collectIds(
    bundle.ontologyNodes,
    "ontologyNodes",
    issues,
    globalIds,
  );
  collectIds(bundle.ontologyRelations, "ontologyRelations", issues, globalIds);
  const provenanceIds = collectIds(
    bundle.provenanceSources,
    "provenanceSources",
    issues,
    globalIds,
  );
  void profileIds;
  void modifierIds;
  void specialistIds;
  void candidateIds;

  const constructMap = new Map(
    bundle.constructs.map((construct) => [construct.id, construct]),
  );
  const itemMap = new Map(bundle.items.map((item) => [item.id, item]));
  const moduleMap = new Map(
    bundle.specialistModules.map((module) => [module.id, module]),
  );
  const nodeMap = new Map(bundle.ontologyNodes.map((node) => [node.id, node]));
  for (const construct of bundle.constructs) {
    if (construct.domainId && !domainIds.has(construct.domainId))
      addIssue(
        issues,
        `constructs[${construct.id}].domainId`,
        "ref",
        `Unknown domain ${construct.domainId}`,
      );
    if (construct.scope === "specialist") {
      if (!construct.moduleId || !moduleIds.has(construct.moduleId))
        addIssue(
          issues,
          `constructs[${construct.id}].moduleId`,
          "ref",
          "Specialist construct requires a valid module",
        );
    }
    validateProvenanceRefs(
      construct.provenanceRefs,
      provenanceIds,
      `constructs[${construct.id}].provenanceRefs`,
      issues,
    );
  }
  for (const domain of bundle.domains)
    validateProvenanceRefs(
      domain.provenanceRefs,
      provenanceIds,
      `domains[${domain.id}].provenanceRefs`,
      issues,
    );
  let mappingCount = 0;
  for (const item of bundle.items) {
    mappingCount += validateItemSemantics(
      item,
      constructMap,
      moduleMap,
      domainIds,
      issues,
    );
    validateProvenanceRefs(
      item.provenanceRefs,
      provenanceIds,
      `items[${item.id}].provenanceRefs`,
      issues,
    );
  }
  for (const profile of bundle.profiles)
    validatePrimaryProfile(
      profile,
      constructMap,
      nodeIds,
      provenanceIds,
      issues,
    );
  for (const modifier of bundle.modifiers)
    validateModifierProfile(
      modifier,
      itemMap,
      constructMap,
      provenanceIds,
      issues,
    );
  for (const candidate of bundle.specialistCandidates)
    validateCandidate(
      candidate,
      constructMap,
      moduleMap,
      nodeIds,
      provenanceIds,
      issues,
    );
  for (const profile of bundle.specialists)
    validateSpecialistProfile(
      profile,
      itemMap,
      moduleMap,
      nodeMap,
      constructMap,
      provenanceIds,
      issues,
    );
  for (const module of bundle.specialistModules) {
    validateSpecialistModuleActivation(module, issues);
    for (const itemId of module.itemIds) {
      const item = itemMap.get(itemId);
      if (!item)
        addIssue(
          issues,
          `specialistModules[${module.id}].itemIds`,
          "ref",
          `Unknown module item ${itemId}`,
        );
      else if (item.role !== "specialist" || item.moduleId !== module.id)
        addIssue(
          issues,
          `specialistModules[${module.id}].itemIds`,
          "scope",
          `Item ${itemId} is not owned by module ${module.id}`,
        );
    }
    for (const constructId of module.constructIds) {
      const construct = constructMap.get(constructId);
      if (
        !construct ||
        construct.scope !== "specialist" ||
        construct.moduleId !== module.id
      )
        addIssue(
          issues,
          `specialistModules[${module.id}].constructIds`,
          "scope",
          `Invalid module construct ${constructId}`,
        );
    }
    for (const candidateId of module.candidateIds) {
      const candidate = bundle.specialistCandidates.find(
        (entry) => entry.id === candidateId,
      );
      if (!candidate || candidate.moduleId !== module.id)
        addIssue(
          issues,
          `specialistModules[${module.id}].candidateIds`,
          "ref",
          `Invalid module candidate ${candidateId}`,
        );
    }
    for (const profileId of module.outputProfileIds) {
      const profile = bundle.specialists.find(
        (entry) => entry.id === profileId,
      );
      if (!profile || profile.moduleId !== module.id)
        addIssue(
          issues,
          `specialistModules[${module.id}].outputProfileIds`,
          "ref",
          `Invalid module output profile ${profileId}`,
        );
    }
    validateProvenanceRefs(
      module.provenanceRefs,
      provenanceIds,
      `specialistModules[${module.id}].provenanceRefs`,
      issues,
    );
  }
  const specialistItemOwners = new Map<string, string>();
  for (const module of bundle.specialistModules) {
    for (const itemId of module.itemIds.map(String)) {
      const previousOwner = specialistItemOwners.get(itemId);
      if (previousOwner !== undefined) {
        addIssue(
          issues,
          `specialistModules[${module.id}].itemIds`,
          "collision",
          `Specialist item ${itemId} is assigned to both ${previousOwner} and ${module.id}`,
        );
      } else {
        specialistItemOwners.set(itemId, String(module.id));
      }
    }
  }
  for (const item of bundle.items) {
    if (
      item.role === "specialist" &&
      !specialistItemOwners.has(String(item.id))
    ) {
      addIssue(
        issues,
        `items[${item.id}]`,
        "scope",
        "Specialist item is not assigned to exactly one module",
      );
    }
  }
  const assigned = bundle.specialistAssignment.orderedModuleIds;
  if (new Set(assigned).size !== assigned.length)
    addIssue(
      issues,
      "specialistAssignment.orderedModuleIds",
      "collision",
      "Specialist assignment roster contains duplicates",
    );
  for (const moduleId of assigned)
    if (!moduleMap.has(moduleId))
      addIssue(
        issues,
        "specialistAssignment.orderedModuleIds",
        "ref",
        `Unknown assigned module ${moduleId}`,
      );
  if (assigned.length !== bundle.specialistModules.length)
    addIssue(
      issues,
      "specialistAssignment.orderedModuleIds",
      "value",
      "Assignment roster does not cover every module",
    );
  for (const node of bundle.ontologyNodes) {
    validateRef(
      node.parentId,
      nodeIds,
      `ontologyNodes[${node.id}].parentId`,
      "ontology node",
      issues,
    );
    if (node.parentId === node.id)
      addIssue(
        issues,
        `ontologyNodes[${node.id}].parentId`,
        "cycle",
        "Ontology node cannot parent itself",
      );
    if (node.domainId && !domainIds.has(node.domainId))
      addIssue(
        issues,
        `ontologyNodes[${node.id}].domainId`,
        "ref",
        `Unknown ontology domain ${node.domainId}`,
      );
    validateProvenanceRefs(
      node.provenanceRefs,
      provenanceIds,
      `ontologyNodes[${node.id}].provenanceRefs`,
      issues,
    );
  }
  const relationIds = new Set<string>();
  for (const relation of bundle.ontologyRelations) {
    if (relationIds.has(relation.id))
      addIssue(
        issues,
        `ontologyRelations[${relation.id}]`,
        "collision",
        "Duplicate ontology relation",
      );
    relationIds.add(relation.id);
    validateRef(
      relation.sourceNodeId,
      nodeIds,
      `ontologyRelations[${relation.id}].sourceNodeId`,
      "ontology node",
      issues,
    );
    validateRef(
      relation.targetNodeId,
      nodeIds,
      `ontologyRelations[${relation.id}].targetNodeId`,
      "ontology node",
      issues,
    );
    if (relation.sourceNodeId === relation.targetNodeId)
      addIssue(
        issues,
        `ontologyRelations[${relation.id}]`,
        "cycle",
        "Ontology self-edge is prohibited",
      );
    validateProvenanceRefs(
      relation.provenanceRefs,
      provenanceIds,
      `ontologyRelations[${relation.id}].provenanceRefs`,
      issues,
    );
  }
  const diagnosticRelationIds = new Set<string>();
  for (const relation of bundle.diagnosticRelations ?? []) {
    if (diagnosticRelationIds.has(relation.id))
      addIssue(issues, `diagnosticRelations[${relation.id}]`, "collision", "Duplicate diagnostic relation");
    diagnosticRelationIds.add(relation.id);
    if (relation.constructIds[0] === relation.constructIds[1])
      addIssue(issues, `diagnosticRelations[${relation.id}]`, "cycle", "Diagnostic relation cannot compare a construct with itself");
    const first = constructMap.get(relation.constructIds[0]);
    const second = constructMap.get(relation.constructIds[1]);
    if (!first) addIssue(issues, `diagnosticRelations[${relation.id}].constructIds[0]`, "ref", `Unknown construct ${relation.constructIds[0]}`);
    if (!second) addIssue(issues, `diagnosticRelations[${relation.id}].constructIds[1]`, "ref", `Unknown construct ${relation.constructIds[1]}`);
    const expectedRoles = relation.dimensionPair.split("-");
    if (first && first.role !== expectedRoles[0]) addIssue(issues, `diagnosticRelations[${relation.id}].dimensionPair`, "scope", "First construct role does not match dimension pair");
    if (second && second.role !== expectedRoles[1]) addIssue(issues, `diagnosticRelations[${relation.id}].dimensionPair`, "scope", "Second construct role does not match dimension pair");
    validateProvenanceRefs(relation.provenanceRefs, provenanceIds, `diagnosticRelations[${relation.id}].provenanceRefs`, issues);
  }
  const constructCoverage = new Set<string>();
  for (const item of bundle.items) {
    for (const contribution of item.scoring.contributions)
      constructCoverage.add(contribution.constructId);
    if (item.responseType === "statement-choice")
      for (const option of item.options)
        for (const contribution of option.contributions)
          constructCoverage.add(contribution.constructId);
  }
  for (const profile of bundle.profiles)
    for (const requirement of profile.requirements ?? [])
      constructCoverage.add(requirement.constructId);
  for (const candidate of bundle.specialistCandidates)
    for (const requirement of candidate.requirements)
      constructCoverage.add(requirement.constructId);
  for (const construct of bundle.constructs)
    if (!constructCoverage.has(construct.id))
      addIssue(
        issues,
        `constructs[${construct.id}]`,
        "coverage",
        "Construct has no explicit item or profile relationship",
      );
  if (mappingCount === 0)
    addIssue(issues, "items", "mapping", "No explicit scoring mappings found");
  return issues.length === 0
    ? { success: true, issues, value: bundle }
    : { success: false, issues };
}
