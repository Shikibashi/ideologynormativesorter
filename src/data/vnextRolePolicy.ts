import type {
  VNextConceptualKind,
  VNextConceptualStatus,
  VNextEvidenceRequirements,
  VNextGraphRelationType,
  VNextMeasurementStatus,
  VNextPublicRole,
} from "../types";
import { VNEXT_ROLE_POLICY_VERSION } from "../validation/vnextVersions";

export interface VNextEvidenceCoverage {
  satisfiedComponentIds: readonly string[];
  missingComponentIds: readonly string[];
  respondentEvidenceState: "absent" | "partial" | "complete";
  prerequisiteModuleIds: readonly string[];
  satisfiedPrerequisiteModuleIds: readonly string[];
}

export interface VNextRolePolicyInput {
  conceptualKind: VNextConceptualKind;
  secondaryKinds?: readonly VNextConceptualKind[];
  conceptualStatus?: VNextConceptualStatus;
  eligibleRoles?: readonly VNextPublicRole[];
  measurementStatus: VNextMeasurementStatus;
  evidenceRequirements?: VNextEvidenceRequirements;
  evidenceCoverage?: VNextEvidenceCoverage;
  highRiskClassification?: "ordinary" | "high-risk";
  moduleId?: string;
  relationTypes: readonly VNextGraphRelationType[];
  explicitPromotion: boolean;
  // Compatibility-only input. It is intentionally ignored by role derivation.
  currentRole?: VNextPublicRole;
  // Compatibility aliases for callers that have not yet built structured data.
  highRisk?: boolean;
  hasDirectConstructEvidence?: boolean;
  hasRespondentEvidence?: boolean;
}

export interface VNextRolePolicyResult {
  policyVersion: typeof VNEXT_ROLE_POLICY_VERSION;
  derivedRole: VNextPublicRole;
  ordinaryScoringEligible: boolean;
  publicDisplayEligible: boolean;
  blockingReasons: readonly string[];
  roleBasis: readonly string[];
}

const CONTEXT_KINDS = new Set<VNextConceptualKind>([
  "policy-proposal",
  "governance-model",
  "discourse-frame",
  "historical-reference",
  "speculative-technological-current",
]);
const PRIMARY_KINDS = new Set<VNextConceptualKind>([
  "family-anchor",
  "broad-tradition",
  "bridge-tradition",
]);

function roleCandidates(input: VNextRolePolicyInput): VNextPublicRole[] {
  if (input.eligibleRoles?.length) return [...input.eligibleRoles];
  if (
    input.conceptualStatus === "retired" ||
    input.measurementStatus === "retired-alias"
  )
    return ["retired"];
  if (input.conceptualKind === "cross-cutting-orientation") return ["modifier"];
  if (input.moduleId && !PRIMARY_KINDS.has(input.conceptualKind))
    return ["specialist"];
  if (CONTEXT_KINDS.has(input.conceptualKind)) return ["context"];
  if (PRIMARY_KINDS.has(input.conceptualKind)) return ["primary"];
  return ["specialist", "context"];
}

function deriveRole(input: VNextRolePolicyInput): {
  role: VNextPublicRole;
  basis: string[];
} {
  const candidates = roleCandidates(input);
  const role =
    input.conceptualStatus === "retired" ||
    input.measurementStatus === "retired-alias"
      ? "retired"
      : input.relationTypes.includes("alias_of")
        ? "retired"
        : input.moduleId &&
            candidates.includes("specialist") &&
            !PRIMARY_KINDS.has(input.conceptualKind)
          ? "specialist"
          : (candidates[0] ?? "context");
  return {
    role,
    basis: [
      `conceptual-kind:${input.conceptualKind}`,
      `secondary-kinds:${[...(input.secondaryKinds ?? [])].sort().join(",") || "none"}`,
      `conceptual-status:${input.conceptualStatus ?? "current"}`,
      `eligible-roles:${candidates.join(",")}`,
      ...(input.currentRole ? [`compatibility-role:${input.currentRole}`] : []),
      `measurement-status:${input.measurementStatus}`,
      `module:${input.moduleId ?? "none"}`,
      `graph-relations:${[...input.relationTypes].sort().join(",") || "none"}`,
      `high-risk:${input.highRiskClassification ?? (input.highRisk ? "high-risk" : "ordinary")}`,
      `respondent-evidence:${input.evidenceCoverage?.respondentEvidenceState ?? (input.hasRespondentEvidence ? "complete" : "absent")}`,
      `promotion:${input.explicitPromotion ? "explicit" : "none"}`,
      ...(input.currentRole
        ? [`legacy-role-compatibility:${input.currentRole}`]
        : []),
    ],
  };
}

export function resolveVNextRolePolicy(
  input: VNextRolePolicyInput,
): VNextRolePolicyResult {
  const blockingReasons: string[] = [];
  const derived = deriveRole(input);
  const requirements = input.evidenceRequirements;
  const coverage = input.evidenceCoverage;
  const highRisk =
    input.highRiskClassification === "high-risk" || input.highRisk === true;
  const hasRespondentEvidence =
    coverage?.respondentEvidenceState === "complete" ||
    input.hasRespondentEvidence === true;
  const hasDirectConstructEvidence =
    Boolean(input.hasDirectConstructEvidence) ||
    Boolean(
      requirements &&
        coverage &&
        requirements.requiredConstructIds.length > 0 &&
        coverage.respondentEvidenceState !== "absent",
    );
  const missingComponents = new Set([
    ...(requirements?.requiredEvidenceComponents ?? []),
    ...(coverage?.missingComponentIds ?? []),
  ]);
  for (const componentId of coverage?.satisfiedComponentIds ?? [])
    missingComponents.delete(componentId);

  if (derived.role === "context")
    blockingReasons.push("Context objects are not ordinary scoring endpoints");
  if (derived.role === "retired")
    blockingReasons.push("Retired compatibility objects cannot be reactivated");
  if (!hasRespondentEvidence)
    blockingReasons.push("respondent evidence is required");
  if (requirements && missingComponents.size > 0)
    blockingReasons.push(
      `required evidence components are incomplete: ${[...missingComponents].sort().join(", ")}`,
    );
  if (
    requirements &&
    coverage &&
    requirements.prerequisiteModuleIds.some(
      (id) => !coverage.satisfiedPrerequisiteModuleIds.includes(id),
    )
  ) {
    blockingReasons.push(
      "required Specialist/module prerequisites are incomplete",
    );
  }
  if (
    input.measurementStatus === "not-started" ||
    input.measurementStatus === "catalog-only"
  )
    blockingReasons.push("measurement status is catalog-only or not-started");
  if (input.measurementStatus === "held")
    blockingReasons.push("measurement evidence is held");
  if (highRisk && !input.explicitPromotion)
    blockingReasons.push(
      "high-risk object requires an explicit scoped promotion",
    );
  if (derived.role === "modifier" && !hasDirectConstructEvidence)
    blockingReasons.push(
      "ordinary Modifier output requires direct construct evidence",
    );

  const approved =
    input.measurementStatus === "validated-scoped-public" &&
    input.explicitPromotion &&
    hasRespondentEvidence &&
    missingComponents.size === 0;
  return {
    policyVersion: VNEXT_ROLE_POLICY_VERSION,
    derivedRole: derived.role,
    ordinaryScoringEligible: derived.role === "primary" && approved,
    publicDisplayEligible:
      derived.role !== "context" &&
      derived.role !== "retired" &&
      approved &&
      (!highRisk || input.explicitPromotion),
    blockingReasons: [...new Set(blockingReasons)],
    roleBasis: derived.basis,
  };
}
