import { describe, expect, it } from "vitest";
import { resolveVNextRolePolicy } from "../data/vnextRolePolicy";
import { resolveVNextRole, resolveAllVNextRoles } from "./vnextRoleResolver";

describe("vNext role resolver", () => {
  it("resolves every current ID without deriving role from fit", () => {
    expect(resolveAllVNextRoles()).toHaveLength(145);
    expect(resolveVNextRole("social-democrat")).toMatchObject({
      currentRole: "primary",
      derivedRole: "primary",
      ordinaryScoringEligible: false,
    });
    expect(resolveVNextRole("social-democrat")?.roleBasis).toEqual(
      expect.arrayContaining([
        "conceptual-kind:broad-tradition",
        "measurement-status:compatibility-scored-unvalidated",
        "compatibility-role:primary",
        "respondent-evidence:absent",
      ]),
    );
  });

  it("keeps Specialist, Context, and retired boundaries explicit", () => {
    expect(resolveVNextRole("anarcho-communist")).toMatchObject({
      currentRole: "specialist",
      derivedRole: "specialist",
      ordinaryScoringEligible: false,
    });
    expect(resolveVNextRole("liquid-democracy")).toMatchObject({
      currentRole: "context",
      derivedRole: "context",
      ordinaryScoringEligible: false,
    });
    expect(resolveVNextRole("conservative-liberalism")).toMatchObject({
      currentRole: "retired",
      derivedRole: "retired",
      ordinaryScoringEligible: false,
    });
  });

  it("cannot be redefined by changing the compatibility role alone", () => {
    const base = {
      conceptualKind: "broad-tradition" as const,
      conceptualStatus: "compatibility" as const,
      eligibleRoles: ["primary" as const],
      measurementStatus: "compatibility-scored-unvalidated" as const,
      relationTypes: [] as const,
      explicitPromotion: false,
    };
    const primaryCompatibility = resolveVNextRolePolicy({
      ...base,
      currentRole: "primary",
    });
    const specialistCompatibility = resolveVNextRolePolicy({
      ...base,
      currentRole: "specialist",
    });
    expect(specialistCompatibility.derivedRole).toBe(
      primaryCompatibility.derivedRole,
    );
    expect(specialistCompatibility.ordinaryScoringEligible).toBe(
      primaryCompatibility.ordinaryScoringEligible,
    );
  });

  it("holds high-risk and evidence-incomplete candidates independently of conceptual role", () => {
    const result = resolveVNextRolePolicy({
      conceptualKind: "compound-tradition",
      secondaryKinds: ["hybrid-configuration"],
      conceptualStatus: "compatibility",
      eligibleRoles: ["specialist"],
      measurementStatus: "experimental",
      highRiskClassification: "high-risk",
      evidenceRequirements: {
        requiredConstructIds: ["authority-legitimacy"],
        requiredFacetIds: ["authority.source"],
        requiredEvidenceComponents: ["contentValidity"],
        prerequisiteModuleIds: ["religious-national-politics"],
        minimumEvidenceState: "respondent-supported",
        abstentionRule: "abstain when required evidence is absent",
      },
      evidenceCoverage: {
        satisfiedComponentIds: [],
        missingComponentIds: ["contentValidity"],
        respondentEvidenceState: "absent",
        prerequisiteModuleIds: ["religious-national-politics"],
        satisfiedPrerequisiteModuleIds: [],
      },
      moduleId: "religious-national-politics",
      relationTypes: ["hybrid_of"],
      explicitPromotion: false,
    });
    expect(result.derivedRole).toBe("specialist");
    expect(result.ordinaryScoringEligible).toBe(false);
    expect(result.blockingReasons).toEqual(
      expect.arrayContaining([
        "respondent evidence is required",
        "high-risk object requires an explicit scoped promotion",
        "required Specialist/module prerequisites are incomplete",
      ]),
    );
  });
});
