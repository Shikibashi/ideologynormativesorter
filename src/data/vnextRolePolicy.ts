import type {
  VNextConceptualKind,
  VNextGraphRelationType,
  VNextMeasurementStatus,
  VNextPublicRole,
} from "../types";
import { VNEXT_ROLE_POLICY_VERSION } from "../validation/vnextVersions";

export interface VNextRolePolicyInput {
  conceptualKind: VNextConceptualKind;
  currentRole: VNextPublicRole;
  measurementStatus: VNextMeasurementStatus;
  highRisk: boolean;
  hasDirectConstructEvidence: boolean;
  hasRespondentEvidence: boolean;
  explicitPromotion: boolean;
  relationTypes: readonly VNextGraphRelationType[];
}

export interface VNextRolePolicyResult {
  policyVersion: typeof VNEXT_ROLE_POLICY_VERSION;
  derivedRole: VNextPublicRole;
  ordinaryScoringEligible: boolean;
  publicDisplayEligible: boolean;
  blockingReasons: readonly string[];
  roleBasis: readonly string[];
}

function deriveRole(input: VNextRolePolicyInput): {
  role: VNextPublicRole;
  basis: string[];
} {
  const basis = [
    `conceptual-kind:${input.conceptualKind}`,
    `measurement-status:${input.measurementStatus}`,
    `compatibility-role:${input.currentRole}`,
    `graph-relations:${[...input.relationTypes].sort().join(",") || "none"}`,
    `high-risk:${input.highRisk ? "restricted" : "ordinary-policy"}`,
    `respondent-evidence:${input.hasRespondentEvidence ? "present" : "absent"}`,
    `promotion:${input.explicitPromotion ? "explicit" : "none"}`,
  ];
  if (
    input.currentRole === "retired" ||
    input.measurementStatus === "retired-alias" ||
    input.relationTypes.includes("alias_of")
  ) {
    return { role: "retired", basis };
  }
  if (input.currentRole === "context") return { role: "context", basis };
  if (input.currentRole === "modifier") return { role: "modifier", basis };
  if (input.currentRole === "specialist") return { role: "specialist", basis };
  return { role: "primary", basis };
}

export function resolveVNextRolePolicy(
  input: VNextRolePolicyInput,
): VNextRolePolicyResult {
  const blockingReasons: string[] = [];
  const derived = deriveRole(input);
  if (derived.role === "context") {
    blockingReasons.push("Context objects are not ordinary scoring endpoints");
  }
  if (derived.role === "retired") {
    blockingReasons.push("Retired compatibility objects cannot be reactivated");
  }
  if (!input.hasRespondentEvidence) {
    blockingReasons.push("respondent evidence is required");
  }
  if (
    input.measurementStatus === "not-started" ||
    input.measurementStatus === "catalog-only"
  ) {
    blockingReasons.push("measurement status is catalog-only or not-started");
  }
  if (input.measurementStatus === "held") {
    blockingReasons.push("measurement evidence is held");
  }
  if (input.highRisk && !input.explicitPromotion) {
    blockingReasons.push(
      "high-risk object requires an explicit scoped promotion",
    );
  }
  if (derived.role === "modifier" && !input.hasDirectConstructEvidence) {
    blockingReasons.push(
      "ordinary Modifier output requires direct construct evidence",
    );
  }
  const approved =
    input.measurementStatus === "validated-scoped-public" &&
    input.explicitPromotion &&
    input.hasRespondentEvidence;
  return {
    policyVersion: VNEXT_ROLE_POLICY_VERSION,
    derivedRole: derived.role,
    ordinaryScoringEligible: derived.role === "primary" && approved,
    publicDisplayEligible:
      derived.role !== "context" &&
      derived.role !== "retired" &&
      approved &&
      (!input.highRisk || input.explicitPromotion),
    blockingReasons,
    roleBasis: derived.basis,
  };
}
