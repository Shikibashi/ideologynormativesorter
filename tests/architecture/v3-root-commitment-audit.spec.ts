import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";

const bundle = JSON.parse(readFileSync("v2/generated/content.bundle.json", "utf8")) as CanonicalContentBundle;
const itemAudit = JSON.parse(readFileSync("docs/v2/item-commitment-audit-v3.json", "utf8"));
const matrix = JSON.parse(readFileSync("docs/v2/primary-commitment-matrix-v3.json", "utf8"));
const neighbors = JSON.parse(readFileSync("docs/v2/nearest-neighbor-coverage-v3.json", "utf8"));
const retired = new Set(["authority-legitimacy","equality-theory","human-nature-priority","militarism-pacifism","moral-traditionalism","political-community-boundary","property-legitimacy","secularism-religious","coordination-optimism","cultural-plasticity","democratic-confidence","expert-confidence","market-process-confidence","public-choice-skepticism","state-capacity-confidence","centralization-preference","coercion-strategy","compromise-vs-persistence","electoralism-vs-direct-action","gradualism-vs-immediatism","redistribution-vs-predistribution","reform-vs-revolution","regulation-vs-deregulation","state-action-vs-exit"]);
const auditKeys = new Set(itemAudit.records.map((entry: { key: string }) => entry.key));
const rootIds = new Set(bundle.constructs.filter((construct) => construct.scope === "root").map((construct) => String(construct.id)));

function rootMappings(contributions: readonly { constructId: unknown }[]) { return contributions.filter((entry) => !String(entry.constructId).startsWith("specialist:")); }

describe("v3 commitment/item architecture", () => {
  it("gives every active item or statement option exactly one primary root construct", () => {
    for (const item of bundle.items.filter((entry) => entry.status === "active")) {
      if (item.responseType === "statement-choice") {
        expect(rootMappings(item.scoring.contributions)).toHaveLength(0);
        for (const option of item.options) {
          expect(rootMappings(option.contributions), `${item.id}#${option.id} root loading count`).toHaveLength(1);
          expect(auditKeys.has(`${item.id}#${option.id}`)).toBe(true);
        }
      } else {
        expect(rootMappings(item.scoring.contributions), `${item.id} root loading count`).toHaveLength(1);
        expect(auditKeys.has(String(item.id))).toBe(true);
      }
    }
  });

  it("removes retired false-binary constructs from all active mappings and production commitments", () => {
    for (const item of bundle.items.filter((entry) => entry.status === "active")) {
      const contributions = item.responseType === "statement-choice" ? item.options.flatMap((option) => option.contributions) : item.scoring.contributions;
      for (const contribution of rootMappings(contributions)) expect(retired.has(String(contribution.constructId))).toBe(false);
    }
    for (const profile of bundle.profiles) {
      for (const commitment of profile.commitments ?? []) {
        expect(retired.has(String(commitment.constructId))).toBe(false);
        expect(rootIds.has(String(commitment.constructId))).toBe(true);
      }
    }
  });

  it("provides direct coverage for every scored primary commitment", () => {
    for (const profile of matrix.profiles) {
      for (const commitment of profile.commitments.filter((entry: { relation: string }) => ["constitutive", "core", "characteristic", "incompatible"].includes(entry.relation))) {
        expect(commitment.directItemIds.length, `${profile.profileId}:${commitment.id} direct coverage`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("provides direct measurement for every claimed nearest-neighbor distinction", () => {
    for (const pair of neighbors.pairs) {
      expect(pair.itemIds.length, pair.id).toBeGreaterThan(0);
      expect(pair.directEvidence.every((entry: { itemIds: unknown[] }) => entry.itemIds.length > 0), pair.id).toBe(true);
    }
  });

  it("keeps empirical validity explicitly unevaluated", () => {
    expect(itemAudit.empiricalValidity).toBe("NOT_EVALUATED");
    expect(matrix.empiricalValidity).toBe("NOT_EVALUATED");
    expect(neighbors.empiricalValidity).toBe("NOT_EVALUATED");
  });
});
