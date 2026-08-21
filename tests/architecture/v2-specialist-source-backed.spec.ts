import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Commitment = { criterionPolicy: string; provenanceRefs: string[]; rationale: string };
type Construct = {
  id: string;
  moduleId: string;
  description: string;
  canonicalDefinition: string;
  conceptualScope: string;
  exclusions: string[];
  boundaryCases: string[];
  semanticLayer: string;
  structureType: string;
  provenanceRefs: string[];
};
type Candidate = { id: string; commitments: Commitment[] };
type Profile = { variants?: Array<{ id: string; commitments: Commitment[] }> };
type Item = { id: string; moduleId: string; status: string };
type ItemAudit = { itemId: string; primaryConstructId: string; moduleId: string; justification: string; provenanceRefs: string[] };
type Nearest = { directCoverage: boolean; leftItemIds: string[]; rightItemIds: string[] };
const read = <T>(path: string) => JSON.parse(readFileSync(path, "utf8")) as T;
const constructs = read<Construct[]>("v2/content/constructs/specialist.json");
const candidates = read<Candidate[]>("v2/content/specialists/candidates.json");
const profiles = read<Profile[]>("v2/content/profiles/specialists.json");
const items = read<Item[]>("v2/content/items/specialist.json");
const sources = new Set(read<Array<{ id: string }>>("v2/content/provenance/sources.json").map((source) => source.id));
const itemAudit = read<{ items: ItemAudit[] }>("docs/v2/specialist-item-audit-v1.json");
const nearest = read<{ status: string; discriminants: Nearest[] }>("docs/v2/specialist-nearest-neighbor-coverage-v1.json");
const constructsById = new Map(constructs.map((construct) => [construct.id, construct]));
const candidatesById = new Map(candidates.map((candidate) => [candidate.id, candidate]));

describe("source-backed specialist content contract", () => {
  it("specifies all 54 local constructs with layer, structure, boundaries, and direct provenance", () => {
    expect(constructs).toHaveLength(54);
    for (const construct of constructs) {
      expect(construct.description).not.toMatch(/measuring endorsement of/i);
      expect(construct.canonicalDefinition).toBeTruthy();
      expect(construct.conceptualScope).toBeTruthy();
      expect(construct.exclusions.length).toBeGreaterThan(0);
      expect(construct.boundaryCases.length).toBeGreaterThan(0);
      expect(["normative", "descriptive", "prescriptive", "mixed"]).toContain(construct.semanticLayer);
      expect(["bipolar", "unipolar", "multidimensional", "conditional"]).toContain(construct.structureType);
      expect(construct.provenanceRefs.some((ref: string) => ref.startsWith("citation:"))).toBe(true);
      expect(construct.provenanceRefs.every((ref: string) => sources.has(ref))).toBe(true);
    }
  });

  it("binds every scored specialist commitment to the explicit semantic evidence policy", () => {
    let count = 0;
    for (const candidate of candidates) {
      for (const commitment of candidate.commitments) {
        count += 1;
        expect(commitment.criterionPolicy).toMatch(/^specialist-commitment-evidence-v1:/);
        expect(commitment.provenanceRefs.some((ref) => ref.startsWith("citation:"))).toBe(true);
        expect(`${commitment.rationale} ${commitment.criterionPolicy}`).not.toMatch(/targetValue|target vector|centroid|legacy gate|reviewed gate/i);
      }
    }
    expect(count).toBeGreaterThan(0);
    for (const profile of profiles) {
      for (const variant of profile.variants ?? []) {
        expect(variant.commitments).toEqual(candidatesById.get(variant.id)?.commitments);
      }
    }
  });

  it("gives every active item one primary local mapping and audits secondary mappings", () => {
    const activeItems = items.filter((item) => item.status === "active");
    expect(itemAudit.items).toHaveLength(activeItems.length);
    for (const entry of itemAudit.items) {
      const item = activeItems.find((candidate) => candidate.id === entry.itemId);
      const primary = constructsById.get(entry.primaryConstructId);
      expect(item).toBeTruthy();
      expect(primary?.moduleId).toBe(item?.moduleId);
      expect(entry.justification).toBeTruthy();
      expect(entry.provenanceRefs.some((ref: string) => ref.startsWith("citation:"))).toBe(true);
    }
  });

  it("claims only directly covered within-module nearest-neighbor distinctions", () => {
    expect(nearest.status).toBe("research-only");
    expect(nearest.discriminants.length).toBeGreaterThan(0);
    expect(nearest.discriminants.every((entry) => entry.directCoverage && entry.leftItemIds.length > 0 && entry.rightItemIds.length > 0)).toBe(true);
  });
});
