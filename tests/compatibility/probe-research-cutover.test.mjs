import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertProbeReport,
  probeCutover,
  syntheticFixture,
  validateOperationalCommand,
} from "../../scripts/probe-research-cutover.mjs";

describe("synthetic research cutover probe", () => {
  it("covers route health, replay dedupe, errors, retry headers, and operations offline", async () => {
    const report = await probeCutover({ fixture: syntheticFixture() });
    assertProbeReport(report);
    assert.equal(report.passed, true);
    assert.equal(report.old.contractRoute, "research-old");
    assert.equal(report.new.cohort, "clean-rebuild-v1");
    for (const side of [report.old, report.new]) {
      const names = new Set(side.checks.map((check) => check.name));
      for (const name of [
        "health",
        "accepted",
        "deduplicated",
        "exact-retry",
        "conflict",
        "forbidden",
        "too-large",
        "invalid",
        "rate-limited",
        "storage-failure",
        "upstream-failure",
        "gateway-timeout",
        "unavailable",
      ])
        assert.equal(names.has(name), true, `${name} missing`);
      assert.equal(
        side.checks
          .filter((check) => check.name.endsWith(":retry-after"))
          .every((check) => check.passed),
        true,
      );
      const retry = side.checks.find((check) => check.name === "exact-retry");
      assert.equal(retry.payloadSha256.length, 64);
      assert.equal(retry.firstPayloadBytes, retry.retryPayloadBytes);
    }
  });

  it("fails closed when endpoints or operational commands are absent or unsafe", async () => {
    await assert.rejects(
      () => probeCutover({ commands: { rollback: "x", drain: "y" } }),
      /Both old and new endpoints/,
    );
    await assert.rejects(
      () =>
        probeCutover({
          fixture: syntheticFixture(),
          commands: { rollback: "x; curl evil", drain: "kubectl drain" },
        }),
      /shell control characters/,
    );
    assert.throws(
      () => validateOperationalCommand("rm -rf /", "rollback"),
      /destructive/,
    );
  });
});
