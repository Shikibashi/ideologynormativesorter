import { readFileSync } from "node:fs";

const constructs = JSON.parse(readFileSync("v2/content/constructs/specialist.json", "utf8"));
const items = JSON.parse(readFileSync("v2/content/items/specialist.json", "utf8"));
const profiles = JSON.parse(readFileSync("v2/content/profiles/specialists.json", "utf8"));

const itemUses = new Map();
for (const item of items) {
  for (const mapping of item?.scoring?.contributions ?? []) {
    const id = String(mapping.constructId ?? "");
    if (!id) continue;
    const list = itemUses.get(id) ?? [];
    list.push({
      itemId: String(item.id),
      prompt: String(item.prompt ?? item.text ?? ""),
      weight: mapping.weight,
      polarity: mapping.polarity,
      optionId: mapping.optionId ?? null,
    });
    itemUses.set(id, list);
  }
}

const commitmentUses = new Map();
const legacyRequirementUses = new Map();
const addCommitmentUse = (profile, variant, commitment) => {
  const id = String(commitment?.constructId ?? "");
  if (!id) return;
  const list = commitmentUses.get(id) ?? [];
  list.push({
    profileId: String(profile.id),
    variantId: variant ? String(variant.id) : null,
    commitmentId: String(commitment.id ?? ""),
    relation: commitment.relation ?? null,
    criterion: commitment.criterion ?? null,
    weight: commitment.weight ?? 1,
    minimumAnsweredItems: commitment.minimumAnsweredItems ?? null,
  });
  commitmentUses.set(id, list);
};
const addLegacyRequirementUse = (profile, variant, requirement) => {
  const id = String(requirement?.constructId ?? "");
  if (!id) return;
  const list = legacyRequirementUses.get(id) ?? [];
  list.push({
    profileId: String(profile.id),
    variantId: variant ? String(variant.id) : null,
    targetValue: requirement.targetValue,
    weight: requirement.weight,
    minimumAnsweredItems: requirement.minimumAnsweredItems ?? null,
  });
  legacyRequirementUses.set(id, list);
};
for (const profile of profiles) {
  for (const commitment of profile.commitments ?? []) addCommitmentUse(profile, null, commitment);
  for (const requirement of profile.requirements ?? []) addLegacyRequirementUse(profile, null, requirement);
  for (const variant of profile.variants ?? []) {
    for (const commitment of variant.commitments ?? []) addCommitmentUse(profile, variant, commitment);
    for (const requirement of variant.requirements ?? []) addLegacyRequirementUse(profile, variant, requirement);
  }
}

const useSort = (left, right) =>
  `${left.profileId}:${left.variantId ?? ""}:${left.commitmentId ?? ""}`.localeCompare(
    `${right.profileId}:${right.variantId ?? ""}:${right.commitmentId ?? ""}`,
  );
const audit = constructs.map((construct) => ({
  id: String(construct.id),
  name: String(construct.name ?? construct.id),
  moduleId: String(construct.moduleId ?? ""),
  sourceKey: String(construct.sourceKey ?? ""),
  description: construct.description ?? null,
  poles: construct.poles ?? null,
  boundaryStatement: construct.boundaryStatement ?? null,
  items: (itemUses.get(String(construct.id)) ?? []).sort((a, b) => a.itemId.localeCompare(b.itemId)),
  commitmentUses: (commitmentUses.get(String(construct.id)) ?? []).sort(useSort),
  legacyRequirementUses: (legacyRequirementUses.get(String(construct.id)) ?? []).sort(useSort),
}));

console.log(JSON.stringify({
  summary: {
    constructCount: constructs.length,
    itemCount: items.length,
    profileCount: profiles.length,
    constructsMissingDefinition: audit.filter(
      (entry) => !entry.description || !entry.poles?.negative || !entry.poles?.positive || !entry.boundaryStatement,
    ).length,
    constructsWithoutMappedItems: audit.filter((entry) => entry.items.length === 0).length,
    constructsWithoutCommitmentUses: audit.filter((entry) => entry.commitmentUses.length === 0).length,
  },
  constructs: audit,
}, null, 2));
