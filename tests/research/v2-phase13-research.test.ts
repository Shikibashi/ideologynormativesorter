import { describe, expect, it, vi } from "vitest";
import bundleJson from "../../v2/generated/content.bundle.json";
import { scoreAssessment } from "../../v2/packages/engine/src";
import {
  canonicalize,
  createResearchSubmission,
  projectResearchRows,
  researchInputFromSubmission,
  sendResearchSubmission,
  type ResearchBundle,
} from "../../v2/packages/research/src";

const bundle = bundleJson as unknown as ResearchBundle;
const activeCoreItemCount = bundle.items.filter(
  (item) => item.role === "core" && item.status === "active",
).length;
const missingInput = {
  responseSchemaVersion: bundle.metadata.responseSchemaVersion,
  contentFingerprint: bundle.metadata.contentFingerprint,
  coreResponses: [],
  specialistResponses: [],
  requestedSpecialistModuleIds: [],
} as const;

describe("Phase 13 research contract", () => {
  it("projects every active core item exactly once without scoring fields", () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000001" });
    expect(submission.responses.core).toHaveLength(activeCoreItemCount);
    expect(new Set(submission.responses.core.map((response) => response.itemId)).size).toBe(activeCoreItemCount);
    expect(JSON.stringify(submission)).not.toContain("contributions");
    expect(JSON.stringify(submission)).not.toContain("participantId");
  });

  it("projects only explicitly requested specialist modules", () => {
    const moduleId = bundle.specialistModules[0].id;
    const submission = createResearchSubmission({ ...missingInput, requestedSpecialistModuleIds: [moduleId] }, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000002" });
    expect(submission.responses.specialist).toHaveLength(bundle.specialistModules[0].itemIds.length);
    expect(submission.responses.specialist.every((response) => bundle.items.find((item) => item.id === response.itemId)?.moduleId === moduleId)).toBe(true);
  });

  it("round-trips a research envelope to the scoring input shape", () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000003" });
    expect(researchInputFromSubmission(submission)).toEqual({ ...missingInput, coreResponses: submission.responses.core, specialistResponses: submission.responses.specialist });
  });

  it("replays through the unchanged scoring kernel without changing the result", () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000008" });
    const original = scoreAssessment(missingInput as never, bundle as never);
    const replayed = scoreAssessment(researchInputFromSubmission(submission), bundle as never);
    expect(replayed).toEqual(original);
  });

  it("is deeply immutable and canonically serializes independent object key order", () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000004" });
    expect(Object.isFrozen(submission)).toBe(true);
    expect(canonicalize({ b: 2, a: 1 })).toBe(canonicalize({ a: 1, b: 2 }));
  });

  it("retries transient failures with the same envelope and submission id", async () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000005" });
    const bodies: string[] = [];
    const fetchImpl = vi.fn(async (_endpoint: string, init?: RequestInit) => {
      bodies.push(String(init?.body));
      if (bodies.length < 3) return new Response("busy", { status: 503 });
      return new Response(JSON.stringify({ accepted: true, deduplicated: false }), { status: 202, headers: { "Content-Type": "application/json" } });
    });
    const result = await sendResearchSubmission(submission, "https://research.invalid/submit", fetchImpl, async () => undefined);
    expect(result.attempts).toBe(3);
    expect(new Set(bodies).size).toBe(1);
    expect(result.submissionId).toBe(submission.submissionId);
  });

  it("exports only normalized response rows and preserves explicit non-answer states", () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000007" });
    const rows = projectResearchRows(submission);
    expect(rows).toHaveLength(activeCoreItemCount);
    expect(rows[0]).toMatchObject({ state: "missing", rawValue: null, optionId: null });
    expect(rows[0]).not.toHaveProperty("constructId");
  });

  it("does not retry a malformed 4xx response", async () => {
    const submission = createResearchSubmission(missingInput, bundle, { consentedAt: "2026-08-19T12:00:00.000Z", submissionId: "rs_00000000-0000-4000-8000-000000000006" });
    const fetchImpl = vi.fn(async () => new Response("bad", { status: 400 }));
    await expect(sendResearchSubmission(submission, "https://research.invalid/submit", fetchImpl, async () => undefined)).rejects.toThrow("400");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
