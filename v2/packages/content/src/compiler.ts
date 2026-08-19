import type { CanonicalContentBundle } from "../../contracts/src/index";
import { computeContentFingerprint } from "./fingerprint";
import { stableSerialize } from "./serialization";
import { validateContentSchema } from "./validate-schema";
import { countExplicitMappings, validateContentSemantics } from "./validate-semantics";

export interface ContentInventory {
  domains: number;
  constructsRoot: number;
  constructsSpecialist: number;
  constructsTotal: number;
  constructsByFamily: Record<string, number>;
  coreItems: number;
  specialistItems: number;
  responseTypes: Record<string, number>;
  reversedItems: number;
  statementChoiceItems: number;
  primaryProfiles: number;
  modifierProfiles: number;
  specialistProfiles: number;
  specialistCandidates: number;
  specialistModules: number;
  ontologyNodes: number;
    ontologyRelations: number;
  diagnosticRelations: number;
  explicitContributionMappings: number;
  contentVersion: string;
  contentFingerprint: string;
}

export interface CompiledContent {
  bundle: Readonly<CanonicalContentBundle>;
  serialized: string;
  fingerprint: string;
  inventory: ContentInventory;
}

export class ContentCompilationError extends Error {
  constructor(
    message: string,
    readonly issues: readonly { path: string; code: string; message: string }[],
  ) {
    super(message);
    this.name = "ContentCompilationError";
  }
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return value;
}

function cloneBundle(bundle: CanonicalContentBundle): CanonicalContentBundle {
  return JSON.parse(JSON.stringify(bundle)) as CanonicalContentBundle;
}

export function buildContentInventory(bundle: CanonicalContentBundle, fingerprint: string): ContentInventory {
  const constructsByFamily = Object.fromEntries(
    [...new Set(bundle.constructs.map((construct) => construct.role))]
      .sort()
      .map((role) => [role, bundle.constructs.filter((construct) => construct.role === role).length]),
  );
  const responseTypes = Object.fromEntries(
    [...new Set(bundle.items.map((item) => item.responseType))]
      .sort()
      .map((responseType) => [responseType, bundle.items.filter((item) => item.responseType === responseType).length]),
  );
  return {
    domains: bundle.domains.length,
    constructsRoot: bundle.constructs.filter((construct) => construct.scope === "root").length,
    constructsSpecialist: bundle.constructs.filter((construct) => construct.scope === "specialist").length,
    constructsTotal: bundle.constructs.length,
    constructsByFamily,
    coreItems: bundle.items.filter((item) => item.role === "core").length,
    specialistItems: bundle.items.filter((item) => item.role === "specialist").length,
    responseTypes,
    reversedItems: bundle.items.filter((item) => item.reverseScored).length,
    statementChoiceItems: bundle.items.filter((item) => item.responseType === "statement-choice").length,
    primaryProfiles: bundle.profiles.length,
    modifierProfiles: bundle.modifiers.length,
    specialistProfiles: bundle.specialists.length,
    specialistCandidates: bundle.specialistCandidates.length,
    specialistModules: bundle.specialistModules.length,
    ontologyNodes: bundle.ontologyNodes.length,
    ontologyRelations: bundle.ontologyRelations.length,
    diagnosticRelations: bundle.diagnosticRelations?.length ?? 0,
    explicitContributionMappings: countExplicitMappings(bundle),
    contentVersion: String(bundle.metadata.contentVersion),
    contentFingerprint: fingerprint,
  };
}

export function compileContent(bundle: CanonicalContentBundle): CompiledContent {
  const schema = validateContentSchema(bundle);
  if (!schema.success) throw new ContentCompilationError("Content schema validation failed", schema.issues);
  const semantics = validateContentSemantics(schema.value!);
  if (!semantics.success) throw new ContentCompilationError("Content semantic validation failed", semantics.issues);

  const compiled = cloneBundle(schema.value!);
  const fingerprint = computeContentFingerprint(compiled);
  const suppliedFingerprint = String(compiled.metadata.contentFingerprint);
  if (
    !suppliedFingerprint.startsWith("pending") &&
    !suppliedFingerprint.startsWith("synthetic-") &&
    suppliedFingerprint !== fingerprint
  ) {
    throw new ContentCompilationError("Content fingerprint does not match canonical bytes", [
      {
        path: "metadata.contentFingerprint",
        code: "fingerprint",
        message: `Expected ${fingerprint} but received ${suppliedFingerprint}`,
      },
    ]);
  }
  compiled.metadata.contentFingerprint = fingerprint as typeof compiled.metadata.contentFingerprint;
  const inventory = buildContentInventory(compiled, fingerprint);
  compiled.metadata.counts = {
    domains: inventory.domains,
    constructsRoot: inventory.constructsRoot,
    constructsSpecialist: inventory.constructsSpecialist,
    constructsTotal: inventory.constructsTotal,
    coreItems: inventory.coreItems,
    specialistItems: inventory.specialistItems,
    primaryProfiles: inventory.primaryProfiles,
    modifierProfiles: inventory.modifierProfiles,
    specialistProfiles: inventory.specialistProfiles,
    specialistCandidates: inventory.specialistCandidates,
    specialistModules: inventory.specialistModules,
    ontologyNodes: inventory.ontologyNodes,
    ontologyRelations: inventory.ontologyRelations,
    diagnosticRelations: inventory.diagnosticRelations,
    explicitContributionMappings: inventory.explicitContributionMappings,
  };
  const serialized = stableSerialize(compiled);
  return {
    bundle: deepFreeze(compiled),
    serialized,
    fingerprint,
    inventory,
  };
}
