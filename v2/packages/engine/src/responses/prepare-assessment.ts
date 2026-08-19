import type { CanonicalContentBundle } from "../../../contracts/src/content";
import type { RawResponseEnvelope } from "../../../contracts/src/responses";
import {
  createEngineContentIndex,
  type EngineContentScope,
} from "../content-index";
import { computeContributions } from "../contributions/compute-contributions";
import { normalizeResponses } from "./normalize-response";
import { validateAssessmentResponses } from "./validate-response";
import type { PreparedAssessment, PreparedResponseSummary } from "../types";

function summarizeResponses(
  responses: readonly PreparedAssessment["responses"][number][],
): PreparedResponseSummary {
  const summary = {
    answeredCount: 0,
    missingCount: 0,
    skippedCount: 0,
    abstainedCount: 0,
    refusedCount: 0,
  };
  for (const response of responses) {
    switch (response.state) {
      case "answered":
        summary.answeredCount += 1;
        break;
      case "missing":
        summary.missingCount += 1;
        break;
      case "skipped":
        summary.skippedCount += 1;
        break;
      case "abstained":
        summary.abstainedCount += 1;
        break;
      case "refused":
        summary.refusedCount += 1;
        break;
    }
  }
  return Object.freeze(summary);
}

export function prepareAssessmentResponses(
  input: RawResponseEnvelope | readonly unknown[],
  bundle: CanonicalContentBundle,
  scope?: EngineContentScope,
): PreparedAssessment {
  const contentIndex = createEngineContentIndex(bundle, scope);
  const validated = validateAssessmentResponses(input, contentIndex);
  const responses = normalizeResponses(validated, contentIndex);
  const contributions = computeContributions(responses, contentIndex).filter(
    (contribution) =>
      contentIndex.activeConstructIds.has(contribution.targetConstructId),
  );
  return Object.freeze({
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    responses: Object.freeze(responses),
    contributions: Object.freeze(contributions),
    responseSummary: summarizeResponses(responses),
    ...(scope === undefined ? {} : { scope: contentIndex.scope }),
  });
}
