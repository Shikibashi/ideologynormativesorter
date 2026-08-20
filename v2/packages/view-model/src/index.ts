import type {
  AssessmentResult,
  CanonicalContentBundle,
  ConstructRecord,
  ConstructResult,
  ItemRecord,
  ModifierResult,
  PrimaryProfileMatchResult,
  SpecialistModuleRecord,
  SpecialistModuleResult,
} from "../../contracts/src";

export interface QuestionOptionViewModel {
  readonly id: string;
  readonly text: string;
}

export interface QuestionViewModel {
  readonly id: string;
  readonly prompt: string;
  readonly responseType: ItemRecord["responseType"];
  readonly role: ItemRecord["role"];
  readonly layer: ItemRecord["layer"];
  readonly domainLabel: string;
  readonly scaleMin?: number;
  readonly scaleMax?: number;
  readonly scaleStep?: number;
  readonly options: readonly QuestionOptionViewModel[];
  readonly allowDontKnow: boolean;
  readonly contextNote?: string;
  readonly evidenceNote?: string;
}

export interface QuestionnaireViewModel {
  readonly role: "core" | "specialist";
  readonly questions: readonly QuestionViewModel[];
}

export interface SpecialistModuleViewModel {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly invitationNote: string;
  readonly estimatedMinutes: number;
  readonly itemCount: number;
  readonly outputCount: number;
}

export interface PrimaryProfileViewModel {
  readonly id: string;
  readonly name: string;
  readonly status: PrimaryProfileMatchResult["status"];
  readonly similarity: number | null;
  readonly similarityLabel: string;
  readonly rank: number | null;
  readonly tieGroup: number | null;
  readonly evidenceLabel: string;
  readonly uncertaintyLabel: string;
  readonly gateSummary: readonly GateViewModel[];
}

export interface ModifierViewModel {
  readonly id: string;
  readonly name: string;
  readonly status: ModifierResult["status"];
  readonly fit: number | null;
  readonly fitLabel: string;
  readonly measurementLabel: string;
  readonly reason?: string;
}

export interface GateViewModel {
  readonly id: string;
  readonly status: "passed" | "failed" | "unavailable";
  readonly reason: string;
}

export interface SpecialistProfileViewModel {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly similarity: number | null;
  readonly similarityLabel: string;
  readonly rank: number | null;
  readonly tieGroup: string | null;
}

export interface SpecialistModuleResultViewModel extends SpecialistModuleViewModel {
  readonly status: SpecialistModuleResult["status"];
  readonly eligibilityStatus: SpecialistModuleResult["eligibilityStatus"];
  readonly activationStatus: SpecialistModuleResult["activationStatus"];
  readonly evidenceLabel: string;
  readonly profiles: readonly SpecialistProfileViewModel[];
}

export interface ConstructViewModel {
  readonly id: string;
  readonly name: string;
  readonly role: ConstructRecord["role"];
  readonly status: ConstructResult["status"];
  readonly score: number | null;
  readonly scoreLabel: string;
  readonly positionLabel: string;
  readonly evidenceLabel: string;
  readonly diagnosticContributionIds: readonly string[];
}

export interface DiagnosticViewModel {
  readonly id: string;
  readonly severity: string;
  readonly scorePosition: string;
  readonly summary: string;
  readonly contributionCount: number;
  readonly strongestPositiveLabels: readonly string[];
  readonly strongestNegativeLabels: readonly string[];
}

export interface AssessmentViewModel {
  readonly status: AssessmentResult["assessment"]["status"];
  readonly statusLabel: string;
  readonly evidenceLabel: string;
  readonly coreCoverageLabel: string;
  readonly primary: {
    readonly profiles: readonly PrimaryProfileViewModel[];
    readonly hasTie: boolean;
    readonly tieLabel: string;
    readonly uncertaintyLabel: string;
  };
  readonly modifiers: readonly ModifierViewModel[];
  readonly specialists: readonly SpecialistModuleResultViewModel[];
  readonly constructs: readonly ConstructViewModel[];
  readonly diagnostics: readonly DiagnosticViewModel[];
  readonly version: {
    readonly contentVersion: string;
    readonly contentFingerprint: string;
    readonly scoringVersion: string;
    readonly resultSchemaVersion: string;
  };
}

function domainLabel(bundle: CanonicalContentBundle, item: ItemRecord): string {
  return bundle.domains.find((domain) => String(domain.id) === String(item.domainId))?.label ?? String(item.domainId);
}

export function buildQuestionViewModel(
  item: ItemRecord,
  bundle: CanonicalContentBundle,
): QuestionViewModel {
  const base = {
    id: String(item.id),
    prompt: item.prompt,
    responseType: item.responseType,
    role: item.role,
    layer: item.layer,
    domainLabel: domainLabel(bundle, item),
    allowDontKnow: item.allowDontKnow === true,
    ...(item.contextNote === undefined ? {} : { contextNote: item.contextNote }),
    ...(item.evidenceNote === undefined ? {} : { evidenceNote: item.evidenceNote }),
  };
  if (item.responseType === "statement-choice") {
    return {
      ...base,
      options: item.options.map((option) => ({ id: String(option.id), text: option.text })),
    };
  }
  return {
    ...base,
    scaleMin: item.scaleMin,
    scaleMax: item.scaleMax,
    scaleStep: item.scaleStep,
    options: [],
  };
}

export function buildQuestionnaireViewModel(
  bundle: CanonicalContentBundle,
  role: "core" | "specialist" = "core",
): QuestionnaireViewModel {
  const questions = bundle.items
    .filter((item) => item.role === role && item.status === "active")
    .slice()
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map((item) => buildQuestionViewModel(item, bundle));
  return { role, questions };
}

export function buildSpecialistModuleViewModel(
  module: SpecialistModuleRecord,
): SpecialistModuleViewModel {
  return {
    id: String(module.id),
    title: module.title,
    shortTitle: module.shortTitle,
    description: module.description,
    invitationNote: module.invitationNote,
    estimatedMinutes: module.estimatedMinutes,
    itemCount: module.itemIds.length,
    outputCount: module.outputProfileIds.length,
  };
}

export function selectTopProfiles(
  result: AssessmentResult,
  topN = 3,
): readonly PrimaryProfileMatchResult[] {
  const byId = new Map(result.primary.profiles.map((profile) => [String(profile.profileId), profile]));
  const ranking = result.primary.ranking.slice().sort((left, right) => left.rank - right.rank);
  if (ranking.length === 0) return result.primary.profiles.slice(0, topN);
  const cutoff = ranking[Math.min(topN, ranking.length) - 1];
  const selectedIds = ranking
    .filter((entry) => entry.rank <= cutoff.rank || entry.tieGroup === cutoff.tieGroup)
    .map((entry) => String(entry.profileId));
  return selectedIds
    .map((id) => byId.get(id))
    .filter((profile): profile is PrimaryProfileMatchResult => profile !== undefined);
}

export function formatPercent(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "Unavailable" : `${Math.round(value * 100)}%`;
}

export function formatScore(value: number | null): string {
  return value === null || !Number.isFinite(value) ? "Unavailable" : value.toFixed(2);
}

export function formatCoverage(value: number): string {
  return formatPercent(Number.isFinite(value) ? value : null);
}

function statusLabel(status: AssessmentResult["assessment"]["status"]): string {
  switch (status) {
    case "complete": return "Complete evidence set";
    case "partially_scored": return "Partially scored";
    case "insufficient_core_evidence": return "More evidence is needed";
    case "invalid": return "Assessment could not be scored";
  }
}

function profileEvidenceLabel(profile: PrimaryProfileMatchResult): string {
  return `${formatPercent(profile.evidence.comparisonCoverage)} comparable evidence`;
}

function gateViewModels(gates: readonly { gateId: string; status: "passed" | "failed" | "unavailable"; reason: string }[]): readonly GateViewModel[] {
  return gates.map((gate) => ({ id: gate.gateId, status: gate.status, reason: gate.reason }));
}

function constructPositionLabel(position: string): string {
  switch (position) {
    case "negative-side": return "Negative side";
    case "positive-side": return "Positive side";
    case "near-midpoint": return "Near midpoint";
    case "unavailable": return "Unavailable";
    default: return "Not applicable";
  }
}

function specialistResultViewModel(
  module: SpecialistModuleRecord,
  result: AssessmentResult["specialists"]["modules"][number] | undefined,
): SpecialistModuleResultViewModel {
  const presentation = buildSpecialistModuleViewModel(module);
  return {
    ...presentation,
    status: result?.status ?? "not_activated",
    eligibilityStatus: result?.eligibilityStatus ?? "ineligible",
    activationStatus: result?.activationStatus ?? "not_activated",
    evidenceLabel: result ? formatPercent(result.evidence.itemCoverage) : "Not measured",
    profiles: (result?.profiles ?? []).map((profile) => ({
      id: profile.profileId,
      name: profile.name,
      status: profile.status,
      similarity: profile.affinity,
      similarityLabel: formatPercent(profile.affinity),
      rank: profile.rank,
      tieGroup: profile.tieGroup,
    })),
  };
}

export function buildAssessmentViewModel(
  result: AssessmentResult,
  bundle: CanonicalContentBundle,
  options: { readonly topN?: number } = {},
): AssessmentViewModel {
  const diagnosticByConstruct = new Map(result.diagnostics.constructs.map((diagnostic) => [diagnostic.constructId, diagnostic]));
  const constructById = new Map(bundle.constructs.map((construct) => [String(construct.id), construct]));
  const constructs = result.constructs.map((construct) => {
    const diagnostic = diagnosticByConstruct.get(String(construct.constructId));
    const record = constructById.get(String(construct.constructId));
    return {
      id: String(construct.constructId),
      name: record?.name ?? String(construct.constructId),
      role: record?.role ?? "normative",
      status: construct.status,
      score: construct.score,
      scoreLabel: formatScore(construct.score),
      positionLabel: constructPositionLabel(diagnostic?.scorePosition ?? "unavailable"),
      evidenceLabel: formatPercent(construct.support.evidenceRatio),
      diagnosticContributionIds: diagnostic?.contributionIds ?? construct.contributionIds,
    } satisfies ConstructViewModel;
  });
  const diagnostics = result.diagnostics.constructs.map((diagnostic) => ({
    id: diagnostic.constructId,
    severity: diagnostic.severity,
    scorePosition: diagnostic.scorePosition,
    summary: `${constructById.get(diagnostic.constructId)?.name ?? diagnostic.constructId}: ${constructPositionLabel(diagnostic.scorePosition)}`,
    contributionCount: diagnostic.contributionIds.length,
    strongestPositiveLabels: diagnostic.strongestPositiveContributionIds.map((id) => contributionLabel(id, result)),
    strongestNegativeLabels: diagnostic.strongestNegativeContributionIds.map((id) => contributionLabel(id, result)),
  }));
  const primaryProfiles = selectTopProfiles(result, options.topN ?? 3).map((profile) => ({
    id: String(profile.profileId),
    name: profile.name,
    status: profile.status,
    similarity: profile.similarity,
    similarityLabel: formatPercent(profile.similarity),
    rank: profile.rank,
    tieGroup: profile.tieGroup,
    evidenceLabel: profileEvidenceLabel(profile),
    uncertaintyLabel: profile.support.uncertaintyLevel,
    gateSummary: gateViewModels(profile.gates),
  }));
  const moduleById = new Map(bundle.specialistModules.map((module) => [String(module.id), module]));
  const specialists = bundle.specialistAssignment.orderedModuleIds
    .map((id) => moduleById.get(String(id)))
    .filter((module): module is SpecialistModuleRecord => module !== undefined)
    .map((module) => specialistResultViewModel(module, result.specialists.modules.find((entry) => entry.moduleId === module.id)));
  return {
    status: result.assessment.status,
    statusLabel: statusLabel(result.assessment.status),
    evidenceLabel: result.assessment.evidence.status,
    coreCoverageLabel: formatCoverage(result.assessment.evidence.coreCoverage),
    primary: {
      profiles: primaryProfiles,
      hasTie: result.primary.topTie.isTie,
      tieLabel: result.primary.topTie.isTie ? "Substantive tie at the top" : "No top tie reported",
      uncertaintyLabel: result.primary.uncertainty.level,
    },
    modifiers: result.modifiers.map((modifier) => ({
      id: modifier.modifierId,
      name: modifier.name,
      status: modifier.status,
      fit: modifier.fit,
      fitLabel: formatPercent(modifier.fit),
      measurementLabel: modifier.measurementState,
      ...(modifier.reason === undefined ? {} : { reason: modifier.reason }),
    })),
    specialists,
    constructs,
    diagnostics,
    version: {
      contentVersion: String(result.contentVersion),
      contentFingerprint: String(result.contentFingerprint),
      scoringVersion: String(result.scoringVersion),
      resultSchemaVersion: String(result.resultSchemaVersion),
    },
  };
}

function contributionLabel(id: string, result: AssessmentResult): string {
  const trace = result.diagnostics.contributions.find((entry) => entry.contributionId === id);
  return trace ? `${trace.itemId} -> ${trace.constructId}` : id;
}
