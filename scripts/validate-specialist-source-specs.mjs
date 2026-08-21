import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const fail = (message) => {
  throw new Error(message);
};
const every = (values, predicate, message) => {
  for (const value of values) if (!predicate(value)) fail(message(value));
};

const constructs = read("v2/content/constructs/specialist.json");
const items = read("v2/content/items/specialist.json");
const candidates = read("v2/content/specialists/candidates.json");
const profiles = read("v2/content/profiles/specialists.json");
const modules = read("v2/content/specialists/modules.json");
const sources = read("v2/content/provenance/sources.json");
const itemAudit = read("docs/v2/specialist-item-audit-v1.json");
const nearest = read("docs/v2/specialist-nearest-neighbor-coverage-v1.json");
const sourceIds = new Set(sources.map((source) => source.id));
const constructById = new Map(constructs.map((construct) => [construct.id, construct]));
const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));

if (constructs.length !== 54) fail(`Expected 54 specialist constructs, got ${constructs.length}`);
if (candidates.length !== 57) fail(`Expected 57 specialist candidates, got ${candidates.length}`);
if (itemAudit.status !== "research-only" || nearest.status !== "research-only") fail("Specialist audit artifacts must remain research-only");

every(constructs, (construct) => {
  if (!construct.canonicalDefinition || !construct.conceptualScope) return false;
  if (!Array.isArray(construct.exclusions) || !construct.exclusions.length) return false;
  if (!Array.isArray(construct.boundaryCases) || !construct.boundaryCases.length) return false;
  if (!["normative", "descriptive", "prescriptive", "mixed"].includes(construct.semanticLayer)) return false;
  if (!["bipolar", "unipolar", "multidimensional", "conditional"].includes(construct.structureType)) return false;
  if (/measuring endorsement of/i.test(construct.description)) return false;
  if (construct.lifecycle?.conceptualStatus !== "source-backed-candidate") return false;
  if (construct.lifecycle?.publicRoleStatus !== "research-only") return false;
  if (!(construct.provenanceRefs ?? []).some((ref) => ref.startsWith("citation:"))) return false;
  return (construct.provenanceRefs ?? []).every((ref) => sourceIds.has(ref));
}, (construct) => `Invalid source-backed construct ${construct.id}`);

const allCommitments = [];
for (const candidate of candidates) {
  if (!candidate.status || candidate.status === "production") fail(`Candidate ${candidate.id} has an invalid release status`);
  if (!(candidate.provenanceRefs ?? []).some((ref) => ref.startsWith("citation:"))) fail(`Candidate ${candidate.id} lacks direct provenance`);
  for (const commitment of candidate.commitments ?? []) {
    const construct = constructById.get(commitment.constructId);
    if (!construct) fail(`Commitment ${commitment.id} references unknown construct`);
    if (!commitment.criterionPolicy) fail(`Commitment ${commitment.id} lacks an explicit criterion policy`);
    if (!(commitment.provenanceRefs ?? []).some((ref) => ref.startsWith("citation:"))) fail(`Commitment ${commitment.id} lacks direct provenance`);
    if (/targetValue|target vector|centroid|legacy gate|reviewed gate/i.test(`${commitment.rationale} ${commitment.criterionPolicy}`)) fail(`Commitment ${commitment.id} retains retired geometry language`);
    if (!commitment.provenanceRefs.every((ref) => sourceIds.has(ref))) fail(`Commitment ${commitment.id} has an unknown provenance reference`);
    allCommitments.push(commitment);
  }
}
if (!allCommitments.length) fail("No specialist commitments were audited");

for (const profile of profiles) {
  for (const variant of profile.variants ?? []) {
    const candidate = candidateById.get(variant.id);
    if (!candidate) fail(`Profile variant ${variant.id} has no candidate source record`);
    if (JSON.stringify(variant.commitments) !== JSON.stringify(candidate.commitments)) fail(`Profile variant ${variant.id} diverges from candidate source record`);
  }
}

const activeItems = items.filter((item) => item.status === "active");
if (itemAudit.items.length !== activeItems.length) fail(`Item audit covers ${itemAudit.items.length} items, expected ${activeItems.length}`);
const auditIds = new Set();
for (const entry of itemAudit.items) {
  if (auditIds.has(entry.itemId)) fail(`Duplicate item audit ${entry.itemId}`);
  auditIds.add(entry.itemId);
  const item = activeItems.find((candidate) => candidate.id === entry.itemId);
  const primary = constructById.get(entry.primaryConstructId);
  if (!item || !primary || primary.moduleId !== entry.moduleId || primary.moduleId !== item.moduleId) fail(`Invalid primary mapping for ${entry.itemId}`);
  if (!entry.justification || !entry.provenanceRefs?.some((ref) => ref.startsWith("citation:"))) fail(`Item ${entry.itemId} lacks mapping justification or provenance`);
}

if (nearest.discriminants.some((entry) => !entry.directCoverage || !entry.leftItemIds.length || !entry.rightItemIds.length)) fail("A claimed nearest-neighbor discriminant lacks direct item coverage");
const moduleIds = new Set(modules.map((module) => module.id));
if (nearest.discriminants.some((entry) => !moduleIds.has(entry.moduleId))) fail("Nearest-neighbor audit references an unknown module");

console.log(JSON.stringify({
  specialistConstructs: constructs.length,
  specialistCandidates: candidates.length,
  scoredCommitments: allCommitments.length,
  auditedItems: itemAudit.items.length,
  nearestNeighborDiscriminants: nearest.discriminants.length,
  status: "research-only",
}, null, 2));
