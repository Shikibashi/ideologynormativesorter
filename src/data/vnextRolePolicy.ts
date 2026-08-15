import type {
  VNextConceptualKind,
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
}

export interface VNextRolePolicyResult {
  policyVersion: typeof VNEXT_ROLE_POLICY_VERSION;
  derivedRole: VNextPublicRole;
  ordinaryScoringEligible: boolean;
  publicDisplayEligible: boolean;
  blockingReasons: readonly string[];
}

export function resolveVNextRolePolicy(
  input: VNextRolePolicyInput,
): VNextRolePolicyResult {
  const blockingReasons: string[] = [];
  if (input.currentRole === "context") {
    blockingReasons.push("Context objects are not ordinary scoring endpoints");
  }
  if (input.currentRole === "retired") {
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
  if (input.currentRole === "modifier" && !input.hasDirectConstructEvidence) {
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
    derivedRole: input.currentRole,
    ordinaryScoringEligible: input.currentRole === "primary" && approved,
    publicDisplayEligible:
      input.currentRole !== "context" &&
      input.currentRole !== "retired" &&
      approved &&
      (!input.highRisk || input.explicitPromotion),
    blockingReasons,
  };
}
