import { describe, expect, it } from "vitest";
import {
  assertVNextRosterIntegrity,
  rosterIntegrityReport,
  vnextRosterErrors,
} from "./vnextRosterIntegrity";

describe("vNext roster and compatibility integrity", () => {
  it("keeps the complete role bijection and approved measurement dispositions", () => {
    expect(vnextRosterErrors()).toEqual([]);
    expect(() => assertVNextRosterIntegrity()).not.toThrow();
    expect(rosterIntegrityReport()).toMatchObject({
      currentLabelCount: 145,
      primaryScopeCount: 16,
      directModifierCount: 7,
      focusedModifierCount: 1,
      mappedSpecialistCount: 39,
      provisionalSpecialistCount: 39,
      moduleCount: 9,
    });
  });

  it("keeps Context and retired labels out of measurement endpoints", () => {
    const report = rosterIntegrityReport();
    expect(report.roleCounts).toEqual({
      primary: 16,
      specialist: 78,
      modifier: 24,
      context: 19,
      retired: 8,
    });
  });
});
