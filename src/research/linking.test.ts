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
import { labelExposurePresentationFingerprint } from "./labelExposure";

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
    const assignment = Array.from({ length: 20 }, (_, index) =>
      buildLabelExposureAssignment("study-1", `p${index}`),
    ).find((candidate) => candidate.arm === "named-label");
    if (!assignment)
      throw new Error("test fixture did not produce named-label");
    expect(assignment.version).toBe(LABEL_EXPOSURE_VERSION);
    const outcome: LabelExposureOutcome = {
      assignment,
      exposureShown: true,
      presentation: {
        version: LABEL_EXPOSURE_VERSION,
        axes: [
          {
            axisId: "authority-legitimacy",
            layer: "normative",
            name: "Authority Legitimacy",
            position: "near the midpoint",
            coverageBand: "insufficient",
          },
        ],
        fingerprint: "",
      },
      exposedLabelIds: ["label-a", "label-b", "label-c"],
      ratings: {
        perceivedAccuracy: 4,
        identityAcceptance: 3,
        confidence: 4,
        affect: 2,
        followUpStability: "prefer_not_to_answer",
      },
    };
    outcome.presentation!.fingerprint = labelExposurePresentationFingerprint(
      outcome.presentation!.axes,
    );
    const canonicalIds = ["label-a", "label-b", "label-c"];
    expect(labelExposureOutcomeErrors(outcome, canonicalIds)).toEqual([]);
    for (const exposedLabelIds of [
      ["label-b", "label-a", "label-c"],
      ["label-a", "label-b"],
      ["label-a", "label-b", "label-d"],
      ["label-a", "label-b", "label-b"],
      ["label-a", "label-b", "label-c", "label-d"],
    ]) {
      expect(
        labelExposureOutcomeErrors(
          { ...outcome, exposedLabelIds },
          canonicalIds,
        ),
      ).toContain(
        "named-label exposure ids must exactly match canonical ordered top-three label ids",
      );
    }
    expect(
      labelExposureOutcomeErrors(
        {
          ...outcome,
          assignment: {
            ...outcome.assignment,
            arm:
              outcome.assignment.arm === "named-label"
                ? "dimension-only"
                : "named-label",
          },
        },
        canonicalIds,
      ),
    ).toContain("exposure arm does not match the frozen assignment rule");
    expect(
      labelExposureOutcomeErrors(
        {
          ...outcome,
          exposureShown: false,
        },
        canonicalIds,
      ),
    ).toContain("unshown exposure outcomes require a missingReason");
  });
});
