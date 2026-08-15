import { describe, expect, it } from "vitest";
import { resolveVNextRole, resolveAllVNextRoles } from "./vnextRoleResolver";

describe("vNext role resolver", () => {
  it("resolves every current ID without deriving role from fit", () => {
    expect(resolveAllVNextRoles()).toHaveLength(145);
    expect(resolveVNextRole("social-democrat")).toMatchObject({
      currentRole: "primary",
      derivedRole: "primary",
      ordinaryScoringEligible: false,
    });
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
});
