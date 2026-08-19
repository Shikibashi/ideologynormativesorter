import type {
  CanonicalContentBundle,
  ConstructRecord,
  DomainRecord,
  ItemRecord,
  ModifierProfileRecord,
  OntologyNodeRecord,
  OntologyRelationRecord,
  PrimaryProfileRecord,
  ProvenanceSourceRecord,
  ScoringContribution,
  SpecialistCandidateRecord,
  SpecialistModuleRecord,
  SpecialistProfileRecord,
  SpecialistVariantRecord,
} from "../../contracts/src/index";
import { ONTOLOGY_RELATION_TYPES } from "../../contracts/src/index";

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ValidationReport<T> {
  success: boolean;
  issues: ValidationIssue[];
  value?: T;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function addIssue(
  issues: ValidationIssue[],
  path: string,
  code: string,
  message: string,
): void {
  issues.push({ path, code, message });
}

function requiredString(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): value is string {
  if (!isString(value) || value.trim().length === 0) {
    addIssue(issues, path, "value", "Expected a non-empty string");
    return false;
  }
  return true;
}

function requiredArray(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): unknown[] | undefined {
  if (!Array.isArray(value)) {
    addIssue(issues, path, "type", "Expected an array");
    return undefined;
  }
  return value;
}

function optionalString(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (value !== undefined && !isString(value)) {
    addIssue(issues, path, "type", "Expected an optional string");
  }
}

function optionalBoolean(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (value !== undefined && typeof value !== "boolean") {
    addIssue(issues, path, "type", "Expected an optional boolean");
  }
}

function optionalFiniteNumber(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (value !== undefined && !isFiniteNumber(value)) {
    addIssue(issues, path, "type", "Expected an optional finite number");
  }
}

function validateRefs(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (value === undefined) return;
  const refs = requiredArray(value, path, issues);
  refs?.forEach((ref, index) => requiredString(ref, `${path}[${index}]`, issues));
}

function validateContribution(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): value is ScoringContribution {
  if (!isObject(value)) {
    addIssue(issues, path, "type", "Expected a contribution object");
    return false;
  }
  const idOk = requiredString(value.constructId, `${path}.constructId`, issues);
  const weightOk = isFiniteNumber(value.weight) && value.weight > 0;
  if (!weightOk) addIssue(issues, `${path}.weight`, "value", "Weight must be finite and positive");
  const polarityOk = value.polarity === 1 || value.polarity === -1;
  if (!polarityOk) addIssue(issues, `${path}.polarity`, "value", "Polarity must be -1 or 1");
  return idOk && weightOk && polarityOk;
}

function validateContributions(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  requireNonEmpty: boolean,
): void {
  if (!isObject(value)) {
    addIssue(issues, path, "type", "Expected scoring object");
    return;
  }
  if (value.mappingMode !== "item" && value.mappingMode !== "options") {
    addIssue(issues, `${path}.mappingMode`, "value", "Expected item or options mappingMode");
  }
  const contributions = requiredArray(value.contributions, `${path}.contributions`, issues);
  if (!contributions) return;
  if (requireNonEmpty && contributions.length === 0) {
    addIssue(issues, `${path}.contributions`, "mapping", "Scored item requires an explicit mapping");
  }
  contributions.forEach((contribution, index) =>
    validateContribution(contribution, `${path}.contributions[${index}]`, issues),
  );
}

function validateDomain(record: DomainRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.label, `${path}.label`, issues);
  optionalString(record.description, `${path}.description`, issues);
  if (record.display !== undefined && !isObject(record.display)) {
    addIssue(issues, `${path}.display`, "type", "Expected display object");
  }
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateConstruct(
  record: ConstructRecord,
  path: string,
  issues: ValidationIssue[],
): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.name, `${path}.name`, issues);
  if (!["normative", "descriptive", "prescriptive", "specialist"].includes(record.role)) {
    addIssue(issues, `${path}.role`, "value", "Unknown construct role");
  }
  if (!["root", "specialist"].includes(record.scope)) {
    addIssue(issues, `${path}.scope`, "value", "Unknown construct scope");
  }
  if (record.scope === "root" && record.role === "specialist") {
    addIssue(issues, `${path}`, "value", "Root construct cannot have specialist role");
  }
  if (record.scope === "specialist" && record.role !== "specialist") {
    addIssue(issues, `${path}`, "value", "Specialist construct must have specialist role");
  }
  optionalString(record.domainId, `${path}.domainId`, issues);
  optionalString(record.moduleId, `${path}.moduleId`, issues);
  optionalString(record.description, `${path}.description`, issues);
  optionalString(record.sourceKey, `${path}.sourceKey`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateItem(record: ItemRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.domainId, `${path}.domainId`, issues);
  requiredString(record.prompt, `${path}.prompt`, issues);
  if (!["likert5", "likert7", "statement-choice"].includes(record.responseType)) {
    addIssue(issues, `${path}.responseType`, "value", "Unknown response type");
  }
  if (!["core", "specialist"].includes(record.role)) {
    addIssue(issues, `${path}.role`, "value", "Unknown item role");
  }
  if (!["normative", "descriptive", "prescriptive"].includes(record.layer)) {
    addIssue(issues, `${path}.layer`, "value", "Unknown item layer");
  }
  if (!["blitz", "quick", "moderate", "extensive"].includes(record.tier)) {
    addIssue(issues, `${path}.tier`, "value", "Unknown item tier");
  }
  if (!["active", "inactive"].includes(record.status)) {
    addIssue(issues, `${path}.status`, "value", "Unknown item status");
  }
  if (typeof record.reverseScored !== "boolean") {
    addIssue(issues, `${path}.reverseScored`, "type", "reverseScored must be boolean");
  }
  optionalBoolean(record.allowDontKnow, `${path}.allowDontKnow`, issues);
  for (const key of [
    "confidencePrompt",
    "priorityPrompt",
    "contextNote",
    "evidenceNote",
    "reviewStatus",
    "version",
    "sourceKey",
  ]) optionalString(record[key as keyof ItemRecord], `${path}.${key}`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);

  const isStatementChoice = record.responseType === "statement-choice";
  validateContributions(
    record.scoring,
    `${path}.scoring`,
    issues,
    !isStatementChoice,
  );
  if (isStatementChoice) {
    if (record.scoring.mappingMode !== "options") {
      addIssue(issues, `${path}.scoring.mappingMode`, "mapping", "Statement-choice mapping must be option-owned");
    }
    const options = requiredArray(record.options, `${path}.options`, issues);
    if (!options || options.length === 0) {
      addIssue(issues, `${path}.options`, "mapping", "Statement-choice item requires options");
    } else {
      const optionIds = new Set<string>();
      options.forEach((option, index) => {
        const optionPath = `${path}.options[${index}]`;
        if (!isObject(option)) {
          addIssue(issues, optionPath, "type", "Expected statement option object");
          return;
        }
        requiredString(option.id, `${optionPath}.id`, issues);
        requiredString(option.text, `${optionPath}.text`, issues);
        if (typeof option.id === "string") {
          if (optionIds.has(option.id)) addIssue(issues, `${optionPath}.id`, "collision", "Duplicate option id");
          optionIds.add(option.id);
        }
        const contributions = requiredArray(option.contributions, `${optionPath}.contributions`, issues);
        if (!contributions || contributions.length === 0) {
          addIssue(issues, `${optionPath}.contributions`, "mapping", "Every option requires an explicit mapping");
        } else {
          contributions.forEach((contribution, contributionIndex) =>
            validateContribution(contribution, `${optionPath}.contributions[${contributionIndex}]`, issues),
          );
        }
      });
    }
  } else {
    if (record.responseType === "likert5" &&
      (record.scaleMin !== -2 || record.scaleMax !== 2 || record.scaleStep !== 1)) {
      addIssue(issues, path, "value", "likert5 requires -2..2 scale");
    }
    if (record.responseType === "likert7" &&
      (record.scaleMin !== -3 || record.scaleMax !== 3 || record.scaleStep !== 1)) {
      addIssue(issues, path, "value", "likert7 requires -3..3 scale");
    }
  }
}

function validateGate(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!isObject(value)) {
    addIssue(issues, path, "type", "Expected gate object");
    return;
  }
  requiredString(value.id, `${path}.id`, issues);
  const operators = ["minimum", "maximum", "interval", "evidenceMinimum", "conjunction", "disjunction"];
  if (!operators.includes(String(value.operator))) {
    addIssue(issues, `${path}.operator`, "value", "Unknown gate operator");
    return;
  }
  if (["minimum", "maximum", "interval", "evidenceMinimum"].includes(String(value.operator))) {
    if (value.constructId !== undefined) requiredString(value.constructId, `${path}.constructId`, issues);
  }
  for (const key of ["minimum", "maximum", "minimumEvidenceRatio", "minimumItemCount"]) {
    if (value[key] !== undefined && !isFiniteNumber(value[key])) {
      addIssue(issues, `${path}.${key}`, "value", `${key} must be finite`);
    }
  }
  if (isFiniteNumber(value.minimumEvidenceRatio) &&
    (value.minimumEvidenceRatio < 0 || value.minimumEvidenceRatio > 1)) {
    addIssue(issues, `${path}.minimumEvidenceRatio`, "value", "Evidence ratio must be in [0,1]");
  }
  if (isFiniteNumber(value.minimumItemCount) && value.minimumItemCount < 0) {
    addIssue(issues, `${path}.minimumItemCount`, "value", "Minimum item count must be >= 0");
  }
  if (value.operator === "interval" &&
    isFiniteNumber(value.minimum) && isFiniteNumber(value.maximum) &&
    value.minimum > value.maximum) {
    addIssue(issues, path, "value", "Interval minimum cannot exceed maximum");
  }
  if (value.operator === "conjunction" || value.operator === "disjunction") {
    const children = requiredArray(value.children, `${path}.children`, issues);
    if (!children || children.length === 0) addIssue(issues, `${path}.children`, "value", "Compound gate requires children");
    children?.forEach((child, index) => requiredString(child, `${path}.children[${index}]`, issues));
  }
}

function validateRequirements(
  values: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  const requirements = requiredArray(values, path, issues);
  if (!requirements) return;
  requirements.forEach((requirement, index) => {
    const requirementPath = `${path}[${index}]`;
    if (!isObject(requirement)) {
      addIssue(issues, requirementPath, "type", "Expected requirement object");
      return;
    }
    requiredString(requirement.constructId, `${requirementPath}.constructId`, issues);
    for (const key of ["targetValue", "weight", "minimumAnsweredItems"]) {
      if (requirement[key] !== undefined && !isFiniteNumber(requirement[key])) {
        addIssue(issues, `${requirementPath}.${key}`, "value", `${key} must be finite`);
      }
    }
    if (isFiniteNumber(requirement.weight) && requirement.weight <= 0) {
      addIssue(issues, `${requirementPath}.weight`, "value", "Requirement weight must be positive");
    }
  });
}

function validateProfileGates(
  gates: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  const gateArray = requiredArray(gates, path, issues);
  gateArray?.forEach((gate, index) => validateGate(gate, `${path}[${index}]`, issues));
}

function validatePrimary(record: PrimaryProfileRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.name, `${path}.name`, issues);
  validateRequirements(record.requirements, `${path}.requirements`, issues);
  if (!record.requirements?.length) addIssue(issues, `${path}.requirements`, "value", "Primary profile requires requirements");
  validateProfileGates(record.gates, `${path}.gates`, issues);
  optionalFiniteNumber(record.minimumEvidenceRatio, `${path}.minimumEvidenceRatio`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateModifier(record: ModifierProfileRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.name, `${path}.name`, issues);
  requiredString(record.modifierId, `${path}.modifierId`, issues);
  requiredString(record.constructName, `${path}.constructName`, issues);
  requiredString(record.note, `${path}.note`, issues);
  if (!["core-construct", "focused-follow-up", "catalog-only"].includes(record.availability)) {
    addIssue(issues, `${path}.availability`, "value", "Unknown modifier availability");
  }
  const indicators = requiredArray(record.indicators, `${path}.indicators`, issues);
  indicators?.forEach((indicator, index) => {
    const indicatorPath = `${path}.indicators[${index}]`;
    if (!isObject(indicator)) {
      addIssue(issues, indicatorPath, "type", "Expected modifier indicator object");
      return;
    }
    requiredString(indicator.itemId, `${indicatorPath}.itemId`, issues);
    if (indicator.direction !== 1 && indicator.direction !== -1) addIssue(issues, `${indicatorPath}.direction`, "value", "Direction must be -1 or 1");
    if (!isFiniteNumber(indicator.weight) || indicator.weight <= 0) addIssue(issues, `${indicatorPath}.weight`, "value", "Indicator weight must be finite and positive");
    optionalString(indicator.rationale, `${indicatorPath}.rationale`, issues);
  });
  validateProfileGates(record.gates, `${path}.gates`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateVariant(record: SpecialistVariantRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.sourceKey, `${path}.sourceKey`, issues);
  requiredString(record.name, `${path}.name`, issues);
  requiredString(record.description, `${path}.description`, issues);
  validateRequirements(record.requirements, `${path}.requirements`, issues);
  validateProfileGates(record.gates, `${path}.gates`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateSpecialist(record: SpecialistProfileRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.name, `${path}.name`, issues);
  requiredString(record.specialistId, `${path}.specialistId`, issues);
  const itemIds = requiredArray(record.itemIds, `${path}.itemIds`, issues);
  itemIds?.forEach((itemId, index) => requiredString(itemId, `${path}.itemIds[${index}]`, issues));
  if (!isObject(record.activation)) addIssue(issues, `${path}.activation`, "type", "Expected activation object");
  if (record.outputType !== "primary" && record.outputType !== "diagnostic") addIssue(issues, `${path}.outputType`, "value", "Unknown specialist output type");
  validateRequirements(record.requirements ?? [], `${path}.requirements`, issues);
  validateProfileGates(record.gates, `${path}.gates`, issues);
  const variants = record.variants;
  if (variants !== undefined) variants.forEach((variant, index) => validateVariant(variant, `${path}.variants[${index}]`, issues));
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateCandidate(record: SpecialistCandidateRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.sourceKey, `${path}.sourceKey`, issues);
  requiredString(record.moduleId, `${path}.moduleId`, issues);
  requiredString(record.name, `${path}.name`, issues);
  requiredString(record.description, `${path}.description`, issues);
  validateRequirements(record.requirements, `${path}.requirements`, issues);
  validateProfileGates(record.gates, `${path}.gates`, issues);
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateModule(record: SpecialistModuleRecord, path: string, issues: ValidationIssue[]): void {
  for (const key of ["id", "version", "title", "shortTitle", "description", "invitationNote"]) {
    requiredString(record[key as keyof SpecialistModuleRecord], `${path}.${key}`, issues);
  }
  if (!isFiniteNumber(record.estimatedMinutes) || record.estimatedMinutes < 0) addIssue(issues, `${path}.estimatedMinutes`, "value", "Estimated minutes must be finite and >= 0");
  for (const key of ["itemIds", "constructIds", "candidateIds", "outputProfileIds"]) {
    const values = requiredArray(record[key as keyof SpecialistModuleRecord], `${path}.${key}`, issues);
    values?.forEach((value, index) => requiredString(value, `${path}.${key}[${index}]`, issues));
  }
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateNode(record: OntologyNodeRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.label, `${path}.label`, issues);
  optionalString(record.domainId, `${path}.domainId`, issues);
  optionalString(record.parentId, `${path}.parentId`, issues);
  for (const key of ["canonicalDefinition", "boundaryStatement", "family", "subfamily", "legacyDisposition", "conceptualStatus", "measurementStatus", "publicRoleStatus"]) {
    optionalString(record[key as keyof OntologyNodeRecord], `${path}.${key}`, issues);
  }
  if (record.weight !== undefined && !isFiniteNumber(record.weight)) addIssue(issues, `${path}.weight`, "value", "Ontology weight must be finite");
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateRelation(record: OntologyRelationRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.sourceNodeId, `${path}.sourceNodeId`, issues);
  requiredString(record.targetNodeId, `${path}.targetNodeId`, issues);
  if (!ONTOLOGY_RELATION_TYPES.includes(record.relationType)) addIssue(issues, `${path}.relationType`, "value", "Unknown ontology relation type");
  if (record.evidence !== undefined && !isFiniteNumber(record.evidence)) addIssue(issues, `${path}.evidence`, "value", "Evidence must be finite");
  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);
}

function validateProvenance(record: ProvenanceSourceRecord, path: string, issues: ValidationIssue[]): void {
  requiredString(record.id, `${path}.id`, issues);
  requiredString(record.kind, `${path}.kind`, issues);
  requiredString(record.title, `${path}.title`, issues);
  requiredString(record.location, `${path}.location`, issues);
  optionalString(record.url, `${path}.url`, issues);
  optionalString(record.publisher, `${path}.publisher`, issues);
  optionalString(record.recordId, `${path}.recordId`, issues);
  optionalString(record.note, `${path}.note`, issues);
}

export function validateContentSchema(
  value: unknown,
): ValidationReport<CanonicalContentBundle> {
  const issues: ValidationIssue[] = [];
  if (!isObject(value)) {
    return { success: false, issues: [{ path: "$", code: "type", message: "Expected content bundle object" }] };
  }
  if (!isObject(value.metadata)) addIssue(issues, "metadata", "type", "Expected metadata object");
  else {
    for (const key of ["contentSchemaVersion", "contentVersion", "contentFingerprint", "scoringVersion", "responseSchemaVersion", "resultSchemaVersion", "researchSchemaVersion"]) requiredString(value.metadata[key], `metadata.${key}`, issues);
  }
  const domains = requiredArray(value.domains, "domains", issues) as DomainRecord[] | undefined;
  const constructs = requiredArray(value.constructs, "constructs", issues) as ConstructRecord[] | undefined;
  const items = requiredArray(value.items, "items", issues) as ItemRecord[] | undefined;
  const profiles = requiredArray(value.profiles, "profiles", issues) as PrimaryProfileRecord[] | undefined;
  const modifiers = requiredArray(value.modifiers, "modifiers", issues) as ModifierProfileRecord[] | undefined;
  const specialists = requiredArray(value.specialists, "specialists", issues) as SpecialistProfileRecord[] | undefined;
  const modules = requiredArray(value.specialistModules, "specialistModules", issues) as SpecialistModuleRecord[] | undefined;
  const candidates = requiredArray(value.specialistCandidates, "specialistCandidates", issues) as SpecialistCandidateRecord[] | undefined;
  const nodes = requiredArray(value.ontologyNodes, "ontologyNodes", issues) as OntologyNodeRecord[] | undefined;
  const relations = requiredArray(value.ontologyRelations, "ontologyRelations", issues) as OntologyRelationRecord[] | undefined;
  const sources = requiredArray(value.provenanceSources, "provenanceSources", issues) as ProvenanceSourceRecord[] | undefined;
  if (!isObject(value.specialistAssignment)) addIssue(issues, "specialistAssignment", "type", "Expected specialist assignment object");
  else {
    requiredString(value.specialistAssignment.strategy, "specialistAssignment.strategy", issues);
    requiredString(value.specialistAssignment.rosterVersion, "specialistAssignment.rosterVersion", issues);
    const ordered = requiredArray(value.specialistAssignment.orderedModuleIds, "specialistAssignment.orderedModuleIds", issues);
    ordered?.forEach((moduleId, index) => requiredString(moduleId, `specialistAssignment.orderedModuleIds[${index}]`, issues));
  }
  domains?.forEach((record, index) => validateDomain(record, `domains[${index}]`, issues));
  constructs?.forEach((record, index) => validateConstruct(record, `constructs[${index}]`, issues));
  items?.forEach((record, index) => validateItem(record, `items[${index}]`, issues));
  profiles?.forEach((record, index) => validatePrimary(record, `profiles[${index}]`, issues));
  modifiers?.forEach((record, index) => validateModifier(record, `modifiers[${index}]`, issues));
  specialists?.forEach((record, index) => validateSpecialist(record, `specialists[${index}]`, issues));
  modules?.forEach((record, index) => validateModule(record, `specialistModules[${index}]`, issues));
  candidates?.forEach((record, index) => validateCandidate(record, `specialistCandidates[${index}]`, issues));
  nodes?.forEach((record, index) => validateNode(record, `ontologyNodes[${index}]`, issues));
  relations?.forEach((record, index) => validateRelation(record, `ontologyRelations[${index}]`, issues));
  sources?.forEach((record, index) => validateProvenance(record, `provenanceSources[${index}]`, issues));
  return issues.length === 0
    ? { success: true, issues, value: value as unknown as CanonicalContentBundle }
    : { success: false, issues };
}
