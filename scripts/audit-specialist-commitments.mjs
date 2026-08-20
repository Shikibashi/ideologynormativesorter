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

const profileUses = new Map();
const addUse = (profile, variant, requirement) => {
  const id = String(requirement?.constructId ?? "");
  if (!id) return;
  const list = profileUses.get(id) ?? [];
  list.push({
    profileId: String(profile.id),
    variantId: variant ? String(variant.id) : null,
    targetValue: requirement.targetValue,
    weight: requirement.weight,
    minimumAnsweredItems: requirement.minimumAnsweredItems ?? null,
  });
  profileUses.set(id, list);
};
for (const profile of profiles) {
  for (const requirement of profile.requirements ?? []) addUse(profile, null, requirement);
  for (const variant of profile.variants ?? []) {
    for (const requirement of variant.requirements ?? []) addUse(profile, variant, requirement);
  }
}

const audit = constructs.map((construct) => ({
  id: String(construct.id),
  name: String(construct.name ?? construct.id),
  moduleId: String(construct.moduleId ?? ""),
  sourceKey: String(construct.sourceKey ?? ""),
  description: construct.description ?? null,
  poles: construct.poles ?? null,
  items: (itemUses.get(String(construct.id)) ?? []).sort((a, b) => a.itemId.localeCompare(b.itemId)),
  legacyProfileUses: (profileUses.get(String(construct.id)) ?? []).sort((a, b) =>
    `${a.profileId}:${a.variantId ?? ""}`.localeCompare(`${b.profileId}:${b.variantId ?? ""}`),
  ),
}));

console.log(JSON.stringify({
  summary: {
    constructCount: constructs.length,
    itemCount: items.length,
    profileCount: profiles.length,
    constructsMissingDefinition: audit.filter((entry) => !entry.description || !entry.poles?.negative || !entry.poles?.positive).length,
    constructsWithoutMappedItems: audit.filter((entry) => entry.items.length === 0).length,
  },
  constructs: audit,
}, null, 2));
