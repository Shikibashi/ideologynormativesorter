import { describe, expect, it } from "vitest";
import {
  bridgeResponseRecordErrors,
  deploymentScopeMetadataErrors,
  expertCodeRecordErrors,
  labelExposureOutcomeErrors,
  scopeLinkErrors,
} from "./linking";
import {
  DEPLOYMENT_SCOPE_VERSION,
  LABEL_EXPOSURE_VERSION,
  PROTOTYPE_CODING_VERSION,
} from "./versions";
import type {
  BridgeResponseRecord,
  DeploymentScopeMetadata,
  ExpertCodeRecord,
  LabelExposureOutcome,
} from "../types";
import { buildLabelExposureAssignment } from "./index";

const scope: DeploymentScopeMetadata = {
  version: DEPLOYMENT_SCOPE_VERSION,
  locale: "en-US",
  language: "en",
  countryOrRegion: "US",
  translationVersion: "translation-en-v1",
  labelScopeVersion: "label-scope-v1",
  backTranslationReviewed: true,
  invarianceStatus: "not-tested",
};

describe("research linking and exposure contracts", () => {
  it("requires explicit deployment scope and prevents mismatched pooling", () => {
    expect(deploymentScopeMetadataErrors(scope)).toEqual([]);
    expect(
      scopeLinkErrors(scope, {
        ...scope,
        translationVersion: "translation-fr-v1",
      }),
    ).toContain(
      "scope-linked records require matching translation and label scope versions",
    );
  });

  it("keeps expert and bridge records bounded and provenance-linked", () => {
    const expert: ExpertCodeRecord = {
      codingVersion: PROTOTYPE_CODING_VERSION,
      labelId: "label-a",
      sourceUnitId: "source-unit-a",
      scope,
      codedAxisProfile: { equality: 0.5 },
      uncertainty: { equality: 0.2 },
      bridgeItemIds: ["q1"],
      independentCoderId: "coder-private-a",
      sourceIds: ["source-a"],
    };
    expect(expertCodeRecordErrors(expert)).toEqual([]);
    const bridge: BridgeResponseRecord = {
      bridgeStudyId: "bridge-1",
      codingVersion: PROTOTYPE_CODING_VERSION,
      participantId: "p1",
      expertSourceUnitId: "source-unit-a",
      itemVersion: "item-v1",
      scopeVersion: DEPLOYMENT_SCOPE_VERSION,
      observedAxisValues: { equality: 0.25 },
      missingAxisIds: [],
    };
    expect(bridgeResponseRecordErrors(bridge)).toEqual([]);
    expect(
      bridgeResponseRecordErrors({
        ...bridge,
        missingAxisIds: ["equality"],
      }),
    ).toContain("bridge axis cannot be both observed and missing");
  });

  it("requires post-response randomized exposure and explicit missingness", () => {
    const assignment = {
      ...buildLabelExposureAssignment("study-1", "p1"),
      version: LABEL_EXPOSURE_VERSION,
      assignedAfterSubstantiveResponses: true,
    } as const;
    const outcome: LabelExposureOutcome = {
      assignment,
      exposureShown: true,
      exposedLabelIds:
        assignment.arm === "named-label" ? ["label-a"] : undefined,
      perceivedAccuracy: 4,
      identityAcceptance: 3,
      confidence: 4,
      affect: 2,
    };
    expect(labelExposureOutcomeErrors(outcome)).toEqual([]);
    expect(
      labelExposureOutcomeErrors({
        ...outcome,
        assignment: {
          ...outcome.assignment,
          arm:
            outcome.assignment.arm === "named-label"
              ? "dimension-only"
              : "named-label",
        },
      }),
    ).toContain("exposure arm does not match the frozen assignment rule");
    expect(
      labelExposureOutcomeErrors({
        ...outcome,
        exposureShown: false,
      }),
    ).toContain("unshown exposure outcomes require a missingReason");
  });
});
