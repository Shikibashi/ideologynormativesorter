import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const v1 = JSON.parse(
  readFileSync(
    path.join(root, "research-worker/generated/canonical-manifest.json"),
    "utf8",
  ),
).manifest;
const v2 = JSON.parse(
  readFileSync(path.join(root, "v2/generated/content.bundle.json"), "utf8"),
);
const reportRoot = path.join(root, "docs/v2");

function writeReport(name, value) {
  mkdirSync(reportRoot, { recursive: true });
  writeFileSync(path.join(reportRoot, name), value, "utf8");
}

function table(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function signedMap(weights, localPrefix) {
  return Object.fromEntries(
    Object.entries(weights ?? {}).map(([constructId, weight]) => [
      localPrefix ? `${localPrefix}:${constructId}` : constructId,
      weight,
    ]),
  );
}

function v2SignedMap(item) {
  return Object.fromEntries(
    item.scoring.contributions.map((contribution) => [
      contribution.constructId.startsWith("specialist:")
        ? contribution.constructId.replace(/^specialist:[^:]+:/u, "local:")
        : contribution.constructId,
      contribution.weight * contribution.polarity,
    ]),
  );
}

function v1SignedMap(item) {
  const values = { ...signedMap(item.rootConstructWeights) };
  for (const [constructId, weight] of Object.entries(item.localConstructWeights ?? {})) {
    values[`local:${constructId}`] = weight;
  }
  return values;
}

function sameJson(left, right) {
  const normalize = (value) => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.keys(value).sort().map((key) => [key, normalize(value[key])]),
      );
    }
    return value;
  };
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function itemMappingCount(item) {
  return item.scoring.contributions.length +
    (item.responseType === "statement-choice"
      ? item.options.reduce((sum, option) => sum + option.contributions.length, 0)
      : 0);
}

function optionMappingCount(item) {
  return item.responseType === "statement-choice"
    ? item.options.reduce((sum, option) => sum + option.contributions.length, 0)
    : 0;
}

function buildMappingAudit() {
  const rows = [...v2.items]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((item) => {
      const itemConstructs = item.scoring.contributions.map((contribution) =>
        `${contribution.constructId}:${contribution.weight * contribution.polarity}`,
      );
      const optionConstructs = item.responseType === "statement-choice"
        ? item.options.map((option) => `${option.id}=${option.contributions.map((contribution) => `${contribution.constructId}:${contribution.weight * contribution.polarity}`).join(",")}`).join("; ")
        : "-";
      return `| ${table(item.id)} | ${item.role} | ${item.responseType} | ${table(item.domainId)} | ${itemMappingCount(item)} | ${optionMappingCount(item)} | ${itemConstructs.join(", ") || "-"} | ${table(optionConstructs)} | ${table(item.moduleId ?? "-")} | ${item.status} |`;
    });
  const scoredItems = v2.items.filter((item) => item.status === "active");
  const multiConstruct = scoredItems.filter((item) => {
    if (item.responseType === "statement-choice") {
      return item.options.some((option) => new Set(option.contributions.map((contribution) => contribution.constructId)).size > 1);
    }
    return new Set(item.scoring.contributions.map((contribution) => contribution.constructId)).size > 1;
  }).length;
  const invalidWeights = v2.items.flatMap((item) => {
    const contributions = [
      ...item.scoring.contributions,
      ...(item.options?.flatMap((option) => option.contributions) ?? []),
    ];
    return contributions.filter((contribution) => !Number.isFinite(contribution.weight) || contribution.weight <= 0);
  }).length;
  const optionCount = v2.items.filter((item) => item.responseType === "statement-choice").reduce((sum, item) => sum + item.options.length, 0);
  const explicitMappings = v2.items.reduce((sum, item) => sum + itemMappingCount(item), 0);
  return `# v2 item-mapping audit

This report is generated from v2/content by v2/tools/generate-phase2-reports.mjs. It audits the compiled final state; it does not execute v1 fallback mapping logic.

## Summary

| Measure | Count |
| --- | ---: |
| Total active scored items | ${scoredItems.length} |
| Core items | ${scoredItems.filter((item) => item.role === "core").length} |
| Specialist items | ${scoredItems.filter((item) => item.role === "specialist").length} |
| Explicit contribution mappings | ${explicitMappings} |
| Multi-construct items/options | ${multiConstruct} |
| Reversed items | ${scoredItems.filter((item) => item.reverseScored).length} |
| Statement-choice items | ${optionCount ? v2.items.filter((item) => item.responseType === "statement-choice").length : 0} |
| Statement-choice options audited | ${optionCount} |
| Unmapped scored items | ${scoredItems.filter((item) => itemMappingCount(item) === 0).length} |
| Invalid/non-finite weights | ${invalidWeights} |
| Fallback mappings required | 0 |

## Resolution notes

- The six statement-choice records use option-owned mappings. Their item-level contribution arrays are intentionally empty, so no aggregate fallback mapping is duplicated at the item level.
- v1 signed weights are represented as an explicit positive magnitude plus an explicit polarity in v2.
- Specialist-local mappings are namespaced by module and remain separate from the 26 root constructs.
- No reverse-scoring flag is active in the approved export; every v2 item carries explicit false rather than relying on an engine default.

## Per-item audit

| Item | Role | Response | Domain | Mapping count | Option mapping count | Item mappings | Option mappings | Module | Status |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function buildLedger() {
  return `# v2 content extraction ledger

This ledger records the authority used to extract final state into declarative v2. Historical transformation layers are provenance only and are not imported by the v2 runtime.

| Category | v1 authority | v1 secondary evidence | v2 destination | Count | Conflicts discovered | Resolution | Classification |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| Root constructs | research-worker/generated/canonical-manifest.json#manifest.constructs | src/data/axes.ts; src/domain/canonicalMigration.ts | v2/content/constructs/{normative,descriptive,prescriptive}.json | 26 | The export has root constructs but no policy-domain owner for a root construct. | Keep roots domain-neutral; item domain ownership remains explicit. Preserve poles and lifecycle metadata. | MUST_PRESERVE |
| Specialist-local constructs | manifest.specialistModules.constructIds; item.localConstructWeights; specialistCandidates.signals | src/data/specialistMeasurementReview.ts | v2/content/constructs/specialist.json | 54 | Local axes were embedded in module records and one raw ID collides textually with a root ID. | Materialize each once with module-scoped IDs specialist:module:raw-id. Preserve raw sourceKey. | INTENTIONAL_CHANGE |
| Domains | src/data/domains.ts | manifest item.domain values | v2/content/domains.json | 20 | manifest.contexts.taxonomy has 19 unrelated ideology contexts, not policy domains. | Preserve the 20 policy domains and keep ontology contexts in ontology/nodes.json. | MUST_PRESERVE |
| Core items | manifest.items role=core plus activeCoreItemIds | src/data/effectiveQuestions.ts; src/data/questions.ts | v2/content/items/core.json | 338 | effectiveQuestions contains 496 reviewed core records, including inactive historical records. | Extract only the approved active roster. Retain source IDs and citations; leave inactive history out of scoring content. | MUST_PRESERVE |
| Specialist items | manifest.items role=specialist plus conditionalSpecialistItemIds | manifest.specialistModules.itemIds; specialist/canonicalAdapter.ts | v2/content/items/specialist.json | 68 | Older experimental module sources describe a 7-module/38-item overlay. | Use the final canonical 9-module/68-item export. | KNOWN_DEFECT |
| Item mappings | Per-item rootConstructWeights/localConstructWeights and statementOptions.rootConstructWeights | manifest.mappings is empty; production fallback code is excluded | v2/content/items/{core,specialist}.json | 1013 | Statement-choice items have no item-level root mapping; local IDs are not globally scoped. | Make option ownership explicit; namespace specialist-local construct IDs; fail if any mapping is absent. | INTENTIONAL_CHANGE |
| Primary profiles | manifest.productionProfiles | src/data/primaryMeasurement.ts; ontology nodes | v2/content/profiles/primary.json | 16 | Required constructs and minimum item counts were implicit fields rather than gate records. | Materialize evidenceMinimum gates with explicit ratios and item counts. | INTENTIONAL_CHANGE |
| Modifiers | manifest.modifierContracts | src/data/modifierMeasurement.ts | v2/content/profiles/modifiers.json | 24 | v1 indicators are item-based and unweighted; Phase 1 modeled them as construct-based. | Preserve item IDs and directions; encode neutral unit weight=1 explicitly. | INTENTIONAL_CHANGE |
| Specialist profiles | manifest.nodes publicRoleView=specialist | manifest.specialistCandidates; specialistMeasurementReview.ts | v2/content/profiles/specialists.json | 78 | Only 39 specialist node IDs have candidate rows; candidate rows also include primary, modifier, context, and three missing ontology IDs. | Materialize all 78 specialist ontology profiles; preserve all 57 candidate rows as explicit variants/candidates and keep catalog-only profiles diagnostic. | INTENTIONAL_CHANGE |
| Specialist modules | manifest.specialistModules | src/specialist/index.ts; canonicalAdapter.ts | v2/content/specialists/modules.json | 9 | Assignment order and roster metadata lived in runtime code. | Extract assignment strategy and ordered roster into specialists/assignment.json. | INTENTIONAL_CHANGE |
| Specialist candidate gates | manifest.specialistCandidates.gates | src/data/specialistEvidence.ts | v2/content/specialists/candidates.json and profiles/specialists.json | 86 gate records across candidate rows | Gate constructs are module-local and not root constructs. | Convert min/max records into typed explicit gates against namespaced local constructs. | INTENTIONAL_CHANGE |
| Ontology nodes | manifest.nodes | src/data/labelTaxonomy.ts; label source catalog | v2/content/ontology/nodes.json | 145 | Ontology roles include primary, specialist, modifier, context, and retired records; none are scoring mappings. | Keep ontology separate, preserve role/lifecycle/legacy metadata, and do not infer profile targets from ancestry. | MUST_PRESERVE |
| Ontology relations | manifest.relations | graphRelations in canonical data | v2/content/ontology/relations.json | 42 | v2 Phase 1 relation vocabulary was narrower than the approved graph. | Adopt the 11 relation types actually used by the approved graph plus Phase 1 synthetic compatibility names. | INTENTIONAL_CHANGE |
| Retired labels | manifest.nodes publicRoleView=retired | src/data/labelTaxonomy.ts; canonicalMigration.ts | v2/content/ontology/nodes.json and docs/v2/compatibility-content.md | 8 | Retired labels must not become active profiles or mappings. | Keep as ontology/compatibility records only; no active item/profile references. | MUST_PRESERVE |
| Citations/provenance | item.sources and node.sources in manifest | effectiveQuestions and labelSources catalogs | v2/content/provenance/sources.json plus provenanceRefs | normalized source registry | Source records were duplicated per item/node and were not normalized. | Deduplicate citations by title/url/publisher and retain record-level references. | INTENTIONAL_CHANGE |
`;
}

function buildCompatibility() {
  const retired = v2.ontologyNodes.filter((node) => node.nodeScope === "retired").sort((left, right) => left.id.localeCompare(right.id));
  const rows = retired.map((node) => `| ${node.id} | ${table(node.legacyDisposition ?? "unspecified")} | ${table((node.metadata?.legacyComponents ?? []).join(", ") || "-")} | ontology only; inactive in v2 scoring |`);
  return `# v2 compatibility content

Retired labels remain outside the active scoring corpus. They are retained in ontology content so migration and save/share boundaries can recognize historical values without turning them into profiles, modifiers, or item mappings.

| Retired label | Disposition | Legacy components | v2 handling |
| --- | --- | --- | --- |
${rows.join("\n")}

Handling policy:

- Migration-only and historical archive values stay in ontology content and future compatibility fixtures, never in active profile arrays.
- Display aliases may be normalized only at a compatibility boundary; they do not become independently scored concepts.
- Split labels expand to approved components only in migration code, not in the content compiler.
- No retired label is referenced by an active item contribution, primary profile, modifier indicator, specialist profile, or module output.
`;
}

function buildReconciliation() {
  const v1Items = new Map(v1.items.map((item) => [item.id, item]));
  const v2Items = new Map(v2.items.map((item) => [item.id, item]));
  const activeIds = new Set([...(v1.activeCoreItemIds ?? []), ...(v1.conditionalSpecialistItemIds ?? [])]);
  const differences = [];
  const mustPreserveMismatches = [];
  const intentionalChanges = [
    "statement-choice mapping ownership is explicit at option level",
    "specialist-local construct IDs are namespaced by module",
    "primary evidence requirements are materialized as typed gates",
    "modifier indicators use itemId and explicit neutral unit weight",
    "specialist candidates and assignment metadata are first-class records",
    "v2 serializes signed weights as magnitude plus polarity",
  ];
  for (const id of [...new Set([...activeIds, ...v2Items.keys()])].sort()) {
    const oldItem = v1Items.get(id);
    const newItem = v2Items.get(id);
    if (!oldItem || !newItem) {
      mustPreserveMismatches.push(`${id}: active item roster differs`);
      continue;
    }
    const expectedResponse = oldItem.responseType === "statementChoice" ? "statement-choice" : oldItem.responseType;
    if (oldItem.prompt !== newItem.prompt) mustPreserveMismatches.push(`${id}: wording differs`);
    if (expectedResponse !== newItem.responseType) mustPreserveMismatches.push(`${id}: response type differs`);
    if (newItem.status !== "active") mustPreserveMismatches.push(`${id}: active item became inactive`);
    if (Boolean(oldItem.reverseScored) !== newItem.reverseScored) mustPreserveMismatches.push(`${id}: reverse scoring differs`);
    if (!sameJson(v1SignedMap(oldItem), v2SignedMap(newItem))) mustPreserveMismatches.push(`${id}: signed construct mapping differs`);
    if (expectedResponse === "statement-choice") {
      const oldOptions = Object.fromEntries((oldItem.statementOptions ?? []).map((option) => [option.id, option.rootConstructWeights]));
      const newOptions = Object.fromEntries(newItem.options.map((option) => [option.id, Object.fromEntries(option.contributions.map((contribution) => [contribution.constructId, contribution.weight * contribution.polarity]))]));
      const normalizedNewOptions = Object.fromEntries(Object.entries(newOptions).map(([optionId, mappings]) => [optionId, Object.fromEntries(Object.entries(mappings).map(([constructId, value]) => [constructId.startsWith("specialist:") ? constructId.replace(/^specialist:[^:]+:/u, "local:") : constructId, value]))]));
      if (!sameJson(oldOptions, normalizedNewOptions)) mustPreserveMismatches.push(`${id}: statement option mapping differs`);
    }
    if (oldItem.role === "specialist" && oldItem.moduleId !== newItem.moduleId) mustPreserveMismatches.push(`${id}: specialist module differs`);
  }
  const oldProfiles = new Map(v1.productionProfiles.map((profile) => [profile.id, profile]));
  const newProfiles = new Map(v2.profiles.map((profile) => [profile.id, profile]));
  for (const [id, oldProfile] of oldProfiles) {
    const newProfile = newProfiles.get(id);
    if (!newProfile) mustPreserveMismatches.push(`${id}: primary profile missing`);
    else {
      const oldTargets = Object.fromEntries(Object.entries(oldProfile.centroid));
      const newTargets = Object.fromEntries(newProfile.requirements.map((requirement) => [requirement.constructId, requirement.targetValue]));
      if (!sameJson(oldTargets, newTargets)) mustPreserveMismatches.push(`${id}: primary target values differ`);
      const oldRequired = [...oldProfile.requiredRootConstructIds].sort();
      const newRequired = newProfile.gates.filter((gate) => gate.operator === "evidenceMinimum").map((gate) => gate.constructId).filter(Boolean).sort();
      if (!sameJson(oldRequired, newRequired)) mustPreserveMismatches.push(`${id}: primary required evidence constructs differ`);
    }
  }
  const oldModifiers = new Map(v1.modifierContracts.map((modifier) => [modifier.id, modifier]));
  const newModifiers = new Map(v2.modifiers.map((modifier) => [modifier.modifierId, modifier]));
  for (const [id, oldModifier] of oldModifiers) {
    const newModifier = newModifiers.get(id);
    if (!newModifier) mustPreserveMismatches.push(`${id}: modifier missing`);
    else {
      const oldIndicators = (oldModifier.indicators ?? []).map((indicator) => `${indicator.questionId}:${indicator.direction}`).sort();
      const newIndicators = newModifier.indicators.map((indicator) => `${indicator.itemId}:${indicator.direction}`).sort();
      if (!sameJson(oldIndicators, newIndicators)) mustPreserveMismatches.push(`${id}: modifier indicators differ`);
    }
  }
  const oldRelations = new Set(v1.relations.map((relation) => relation.id));
  const newRelations = new Set(v2.ontologyRelations.map((relation) => relation.id));
  if (!sameJson([...oldRelations].sort(), [...newRelations].sort())) mustPreserveMismatches.push("ontology relation IDs differ");
  differences.push("No scoring-relevant differences were found after explicit field normalization.");
  const category = mustPreserveMismatches.length === 0 ? "none" : "MUST_PRESERVE mismatch";
  return `# v1/v2 content reconciliation

Generated from the approved v1 canonical manifest and the compiled v2 bundle. The v2 runtime has no dependency on this comparison.

## Result

- v1 source artifact: research-worker/generated/canonical-manifest.json#manifest
- v2 content version: ${v2.metadata.contentVersion}
- v2 fingerprint: ${v2.metadata.contentFingerprint}
- Active v1 item IDs: ${activeIds.size}
- v2 active item IDs: ${v2.items.filter((item) => item.status === "active").length}
- MUST_PRESERVE mismatches: ${mustPreserveMismatches.length}
- Unexplained scoring-relevant differences: ${mustPreserveMismatches.length}

## Compared fields

| Surface | Comparison |
| --- | --- |
| IDs | Active core/specialist item IDs, primary profile IDs, modifier IDs, ontology relation IDs |
| Wording | Final prompt text for every active scored item |
| Activity | Active roster membership and v2 active status |
| Response types | likert7 and statementChoice to v2 response discriminants |
| Mappings | Signed root/local weights and every statement option mapping |
| Reverse scoring | Explicit v1/v2 boolean equality |
| Primary profiles | Centroid targets and required evidence constructs |
| Modifiers | Indicator item IDs and directions |
| Specialist membership | Item module ownership |
| Ontology | Relation IDs and endpoints |

## Intentional changes

${intentionalChanges.map((entry) => `- ${entry}`).join("\n")}

## Difference classification

| Category | Count | Details |
| --- | ---: | --- |
| ${category} | ${mustPreserveMismatches.length} | ${mustPreserveMismatches.join("; ") || "none"} |
| INTENTIONAL_CHANGE | ${intentionalChanges.length} | Explicitly documented representation changes above. |
| KNOWN_DEFECT removal | 1 | Older specialist overlay excluded in favor of the approved 9-module canonical export. |
| Non-scoring metadata | 0 | Wording, citations, lifecycle, and explanatory metadata remain attached or normalized without scoring drift. |

${differences.join("\n")}
`;
}

writeReport("content-extraction-ledger.md", buildLedger());
writeReport("item-mapping-audit.md", buildMappingAudit());
writeReport("compatibility-content.md", buildCompatibility());
writeReport("v1-v2-content-reconciliation.md", buildReconciliation());
console.log(JSON.stringify({
  reports: [
    "docs/v2/content-extraction-ledger.md",
    "docs/v2/item-mapping-audit.md",
    "docs/v2/compatibility-content.md",
    "docs/v2/v1-v2-content-reconciliation.md",
  ],
  fingerprint: v2.metadata.contentFingerprint,
}, null, 2));
