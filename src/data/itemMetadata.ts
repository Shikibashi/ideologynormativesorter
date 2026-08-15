// Decision IDs: D-02, D-04, D-21, D-26.
import type { Question, ResearchItemMetadata } from "../types";

export const ITEM_METADATA_VERSION = "2026-08-item-metadata-v1" as const;

export function constructFamilyIdForDomain(domainId: string): string {
  return `domain:${domainId}`;
}

function responseProcessTags(question: Question): string[] {
  const tags: string[] = [question.responseType];
  if (question.layer === "descriptive") tags.push("epistemic-confidence");
  if (question.layer === "prescriptive") tags.push("priority-salience");
  if (question.responseType === "statementChoice") {
    tags.push("substantive-option-choice");
  }
  return tags;
}

export function researchItemMetadata(question: Question): ResearchItemMetadata {
  return {
    familyId: constructFamilyIdForDomain(String(question.domain)),
    // Active status is not calibration evidence. Review must promote this in
    // a later evidence-gated wave.
    calibrationEligibility: "pending-review",
    ...(question.module ? { linkingRole: "specialist-only" as const } : {}),
    wordingFormId: `${ITEM_METADATA_VERSION}:${question.id}`,
    responseProcessTags: responseProcessTags(question),
  };
}

export function applyResearchItemMetadata(question: Question): Question {
  return { ...question, ...researchItemMetadata(question) };
}
