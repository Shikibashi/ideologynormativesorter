import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertNoPublicDrift,
  comparePublicResults,
} from "../../scripts/side-by-side-replay.mjs";

describe("side-by-side public-result replay", () => {
  it("ignores explicitly versioned metadata but rejects public drift", () => {
    const oldResult = {
      contractVersion: "old",
      result: {
        labels: [{ id: "conservative", score: 0.8 }],
        decision: "stable",
      },
      payloadSha256: "old-digest",
    };
    const newResult = {
      contractVersion: "new",
      result: {
        labels: [{ id: "conservative", score: 0.8 }],
        decision: "stable",
      },
      payloadSha256: "new-digest",
    };
    assert.equal(comparePublicResults(oldResult, newResult).equal, true);
    assertNoPublicDrift(oldResult, newResult);
    const drift = comparePublicResults(oldResult, {
      ...newResult,
      result: { ...newResult.result, decision: "changed" },
    });
    assert.equal(drift.equal, false);
    assert.throws(
      () =>
        assertNoPublicDrift(oldResult, {
          ...newResult,
          result: { ...newResult.result, decision: "changed" },
        }),
      /Public result drift/,
    );
  });

  it("does not silently allow unknown metadata keys", () => {
    const oldResult = { result: { labels: [] }, rolloutTag: "old" };
    const newResult = { result: { labels: [] }, rolloutTag: "new" };
    assert.equal(comparePublicResults(oldResult, newResult).equal, false);
    assert.equal(
      comparePublicResults(oldResult, newResult, {
        allowMetadata: ["rolloutTag"],
      }).equal,
      true,
    );
  });
});
