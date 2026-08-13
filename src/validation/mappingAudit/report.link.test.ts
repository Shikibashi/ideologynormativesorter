import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { latestRelease } from "./release/summary";
import { responseContributions } from "./manifests/responseContributions";
import { dossiers } from "./dossiers/index";
import { findings } from "./findings/ledger";

const REPORT_PATH = "docs/ideology-mapping-validation-audit-report.md";

describe("report.link", () => {
  it("human audit report exists", () => {
    expect(existsSync(REPORT_PATH)).toBe(true);
  });

  it("report links machine artifact ids and does not replace them", () => {
    const report = readFileSync(REPORT_PATH, "utf8");
    expect(report.length).toBeGreaterThan(500);

    expect(report).toMatch(/responseContributions|rc:/);
    expect(report).toMatch(/dossier:|dossiers/);
    expect(report).toMatch(/finding:|findings/);
    expect(report).toMatch(/release:/);

    // Report is a human index — machine ledgers remain authoritative.
    expect(responseContributions.length).toBeGreaterThan(0);
    expect(dossiers.length).toBeGreaterThan(0);
    expect(findings.length).toBeGreaterThan(0);
    expect(latestRelease()?.releaseId).toMatch(/^release:/);
  });

  it("report withholds empirical accuracy claims", () => {
    const report = readFileSync(REPORT_PATH, "utf8").toLowerCase();
    expect(report).toMatch(
      /insufficient-data|insufficient data|deferred|non-empirical/,
    );
    expect(report.includes("empirically proven ideology match")).toBe(false);
    expect(report.includes("validated against respondents")).toBe(false);
  });
});
