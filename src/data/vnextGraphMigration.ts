/* Complete disposition ledger for the historical 64-edge compatibility graph. */
import type { VNextGraphMigrationRecord } from "../types";

export const vnextGraphMigrationLedger: readonly VNextGraphMigrationRecord[] = [
  {
    migrationId: "v13:anarcho-capitalist:overlaps_with:market-anarchism",
    oldSourceId: "anarcho-capitalist",
    oldTargetId: "market-anarchism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["anarcho-capitalist:overlaps_with:market-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:anarcho-capitalist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "A contested market-anarchist relative: it shares anti-statism and market coordination but adds a distinctive private-property account.",
  },
  {
    migrationId:
      "v13:anarcho-capitalist:overlaps_with:market-right-libertarianism",
    oldSourceId: "anarcho-capitalist",
    oldTargetId: "market-right-libertarianism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "anarcho-capitalist:overlaps_with:market-right-libertarianism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:anarcho-capitalist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Shares the right-libertarian property and contract tradition, while rejecting the minimal state that some right-libertarians retain.",
  },
  {
    migrationId: "v13:anarcho-communist:contrasts_with:market-anarchism",
    oldSourceId: "anarcho-communist",
    oldTargetId: "market-anarchism",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["anarcho-communist:contrasts_with:market-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical contrasts_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:anarcho-communist:subtype_of:social-anarchism",
    oldSourceId: "anarcho-communist",
    oldTargetId: "social-anarchism",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["anarcho-communist:subtype_of:social-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:anarcho-communist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for anarcho-communist.",
  },
  {
    migrationId: "v13:anarcho-syndicalism:subtype_of:social-anarchism",
    oldSourceId: "anarcho-syndicalism",
    oldTargetId: "social-anarchism",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["anarcho-syndicalism:subtype_of:social-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:anarcho-syndicalism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for anarcho-syndicalism.",
  },
  {
    migrationId: "v13:baathism:regional_variant_of:arab-socialism",
    oldSourceId: "baathism",
    oldTargetId: "arab-socialism",
    oldRelation: "regional_variant_of",
    disposition: "retain-unchanged",
    newRelationIds: ["baathism:regional_variant_of:arab-socialism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:baathism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical regional_variant_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:baathism:regional_variant_of:pan-arabism",
    oldSourceId: "baathism",
    oldTargetId: "pan-arabism",
    oldRelation: "regional_variant_of",
    disposition: "retain-unchanged",
    newRelationIds: ["baathism:regional_variant_of:pan-arabism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:baathism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical regional_variant_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:black-nationalism:often_combines_with:nationalism",
    oldSourceId: "black-nationalism",
    oldTargetId: "nationalism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: ["black-nationalism:often_combines_with:nationalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:black-nationalism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical often_combines_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:black-nationalism:overlaps_with:pan-africanism",
    oldSourceId: "black-nationalism",
    oldTargetId: "pan-africanism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["black-nationalism:overlaps_with:pan-africanism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:black-nationalism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:bright-green-environmentalism:alias_of:ecomodernist",
    oldSourceId: "bright-green-environmentalism",
    oldTargetId: "ecomodernist",
    oldRelation: "alias_of",
    disposition: "retain-unchanged",
    newRelationIds: ["bright-green-environmentalism:alias_of:ecomodernist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:bright-green-environmentalism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical alias_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId:
      "v13:civil-libertarian-cosmopolitan:alias_of:civil-libertarianism",
    oldSourceId: "civil-libertarian-cosmopolitan",
    oldTargetId: "civil-libertarianism",
    oldRelation: "alias_of",
    disposition: "retain-unchanged",
    newRelationIds: [
      "civil-libertarian-cosmopolitan:alias_of:civil-libertarianism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:civil-libertarian-cosmopolitan",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical alias_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:civil-libertarian-cosmopolitan:alias_of:cosmopolitanism",
    oldSourceId: "civil-libertarian-cosmopolitan",
    oldTargetId: "cosmopolitanism",
    oldRelation: "alias_of",
    disposition: "retain-unchanged",
    newRelationIds: ["civil-libertarian-cosmopolitan:alias_of:cosmopolitanism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:civil-libertarian-cosmopolitan",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical alias_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId:
      "v13:communitarianism:overlaps_with:confucian-political-revival",
    oldSourceId: "communitarianism",
    oldTargetId: "confucian-political-revival",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "communitarianism:overlaps_with:confucian-political-revival",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:confucian-political-revival",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:confucian-political-revival:context_for:asian-values",
    oldSourceId: "confucian-political-revival",
    oldTargetId: "asian-values",
    oldRelation: "context_for",
    disposition: "retain-unchanged",
    newRelationIds: ["confucian-political-revival:context_for:asian-values"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:confucian-political-revival",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical context_for relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId:
      "v13:confucian-political-revival:overlaps_with:communitarianism",
    oldSourceId: "confucian-political-revival",
    oldTargetId: "communitarianism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "confucian-political-revival:overlaps_with:communitarianism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:confucian-political-revival",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:deep-ecology:subtype_of:green-politics",
    oldSourceId: "deep-ecology",
    oldTargetId: "green-politics",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["deep-ecology:subtype_of:green-politics"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:deep-ecology",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for deep-ecology.",
  },
  {
    migrationId: "v13:degrowth-green:subtype_of:green-politics",
    oldSourceId: "degrowth-green",
    oldTargetId: "green-politics",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["degrowth-green:subtype_of:green-politics"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:degrowth-green",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for degrowth-green.",
  },
  {
    migrationId: "v13:democratic-socialist:overlaps_with:market-socialist",
    oldSourceId: "democratic-socialist",
    oldTargetId: "market-socialist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["democratic-socialist:overlaps_with:market-socialist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-socialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId:
      "v13:developmental-authoritarianism:hybrid_of:developmentalism",
    oldSourceId: "developmental-authoritarianism",
    oldTargetId: "developmentalism",
    oldRelation: "hybrid_of",
    disposition: "retain-unchanged",
    newRelationIds: [
      "developmental-authoritarianism:hybrid_of:developmentalism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:developmental-authoritarianism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical hybrid_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId:
      "v13:developmental-authoritarianism:incompatible_with_core:radical-democracy",
    oldSourceId: "developmental-authoritarianism",
    oldTargetId: "radical-democracy",
    oldRelation: "incompatible_with_core",
    disposition: "retain-unchanged",
    newRelationIds: [
      "developmental-authoritarianism:incompatible_with_core:radical-democracy",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:developmental-authoritarianism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale: "This is a derived context profile, not a standalone ideology.",
  },
  {
    migrationId:
      "v13:developmental-authoritarianism:requires:technocratic-orientation",
    oldSourceId: "developmental-authoritarianism",
    oldTargetId: "technocratic-orientation",
    oldRelation: "requires",
    disposition: "retain-unchanged",
    newRelationIds: [
      "developmental-authoritarianism:requires:technocratic-orientation",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:developmental-authoritarianism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical requires relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:ecomodernist:subtype_of:green-politics",
    oldSourceId: "ecomodernist",
    oldTargetId: "green-politics",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["ecomodernist:subtype_of:green-politics"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:ecomodernist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for ecomodernist.",
  },
  {
    migrationId: "v13:ecosocialist:hybrid_of:democratic-socialist",
    oldSourceId: "ecosocialist",
    oldTargetId: "democratic-socialist",
    oldRelation: "hybrid_of",
    disposition: "retain-unchanged",
    newRelationIds: ["ecosocialist:hybrid_of:democratic-socialist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:ecosocialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical hybrid_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:ecosocialist:hybrid_of:green-politics",
    oldSourceId: "ecosocialist",
    oldTargetId: "green-politics",
    oldRelation: "hybrid_of",
    disposition: "retain-unchanged",
    newRelationIds: ["ecosocialist:hybrid_of:green-politics"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:ecosocialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical hybrid_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:ecosocialist:subtype_of:green-politics",
    oldSourceId: "ecosocialist",
    oldTargetId: "green-politics",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["ecosocialist:subtype_of:green-politics"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:ecosocialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for ecosocialist.",
  },
  {
    migrationId: "v13:geolibertarian:hybrid_of:georgism",
    oldSourceId: "geolibertarian",
    oldTargetId: "georgism",
    oldRelation: "hybrid_of",
    disposition: "retain-unchanged",
    newRelationIds: ["geolibertarian:hybrid_of:georgism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:geolibertarian",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical hybrid_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:geolibertarian:hybrid_of:market-right-libertarianism",
    oldSourceId: "geolibertarian",
    oldTargetId: "market-right-libertarianism",
    oldRelation: "hybrid_of",
    disposition: "retain-unchanged",
    newRelationIds: ["geolibertarian:hybrid_of:market-right-libertarianism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:geolibertarian",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical hybrid_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:georgism:overlaps_with:market-liberal",
    oldSourceId: "georgism",
    oldTargetId: "market-liberal",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["georgism:overlaps_with:market-liberal"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:georgism:overlaps_with:market-right-libertarianism",
    oldSourceId: "georgism",
    oldTargetId: "market-right-libertarianism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["georgism:overlaps_with:market-right-libertarianism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:georgism:overlaps_with:social-liberalism",
    oldSourceId: "georgism",
    oldTargetId: "social-liberalism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["georgism:overlaps_with:social-liberalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:individualist-anarchism:influenced_by:mutualist",
    oldSourceId: "individualist-anarchism",
    oldTargetId: "mutualist",
    oldRelation: "influenced_by",
    disposition: "retain-unchanged",
    newRelationIds: ["individualist-anarchism:influenced_by:mutualist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:individualist-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Proudhonian mutualism influenced portions of the Tuckerite American individualist tradition, including figures linked to Joseph (Jo) and Laurance Labadie; later revivalist work is not treated as a historical parent, and the broader individualist field is not reducible to mutualism.",
  },
  {
    migrationId:
      "v13:individualist-anarchism:often_combines_with:market-anarchism",
    oldSourceId: "individualist-anarchism",
    oldTargetId: "market-anarchism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "individualist-anarchism:often_combines_with:market-anarchism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical often_combines_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:individualist-anarchism:overlaps_with:mutualist",
    oldSourceId: "individualist-anarchism",
    oldTargetId: "mutualist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["individualist-anarchism:overlaps_with:mutualist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:internationalism:often_combines_with:pan-africanism",
    oldSourceId: "internationalism",
    oldTargetId: "pan-africanism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: ["internationalism:often_combines_with:pan-africanism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:pan-africanism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical often_combines_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:left-wing-market-anarchism:often_combines_with:mutualist",
    oldSourceId: "left-wing-market-anarchism",
    oldTargetId: "mutualist",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "left-wing-market-anarchism:often_combines_with:mutualist",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical often_combines_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:market-anarchism:contrasts_with:anarcho-communist",
    oldSourceId: "market-anarchism",
    oldTargetId: "anarcho-communist",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-anarchism:contrasts_with:anarcho-communist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical contrasts_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId:
      "v13:market-anarchism:often_combines_with:individualist-anarchism",
    oldSourceId: "market-anarchism",
    oldTargetId: "individualist-anarchism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "market-anarchism:often_combines_with:individualist-anarchism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical often_combines_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:market-anarchism:overlaps_with:anarcho-capitalist",
    oldSourceId: "market-anarchism",
    oldTargetId: "anarcho-capitalist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-anarchism:overlaps_with:anarcho-capitalist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Both reject the state and value non-state market coordination, but anarcho-capitalism makes strong private-property commitments that market anarchism as a family does not settle.",
  },
  {
    migrationId: "v13:market-anarchism:overlaps_with:mutualist",
    oldSourceId: "market-anarchism",
    oldTargetId: "mutualist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-anarchism:overlaps_with:mutualist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:market-liberal:overlaps_with:georgism",
    oldSourceId: "market-liberal",
    oldTargetId: "georgism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-liberal:overlaps_with:georgism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId:
      "v13:market-right-libertarianism:overlaps_with:anarcho-capitalist",
    oldSourceId: "market-right-libertarianism",
    oldTargetId: "anarcho-capitalist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "market-right-libertarianism:overlaps_with:anarcho-capitalist",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-right-libertarianism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Anarcho-capitalism is a stateless right-libertarian variant, but the broad family also includes minimal-state positions.",
  },
  {
    migrationId: "v13:market-right-libertarianism:overlaps_with:georgism",
    oldSourceId: "market-right-libertarianism",
    oldTargetId: "georgism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-right-libertarianism:overlaps_with:georgism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:market-socialist:contrasts_with:marxist-leninist",
    oldSourceId: "market-socialist",
    oldTargetId: "marxist-leninist",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-socialist:contrasts_with:marxist-leninist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-socialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Market socialism does not by itself specify a Leninist party-state.",
  },
  {
    migrationId: "v13:market-socialist:overlaps_with:democratic-socialist",
    oldSourceId: "market-socialist",
    oldTargetId: "democratic-socialist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["market-socialist:overlaps_with:democratic-socialist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-socialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:marxian-socialism:contrasts_with:marxist-leninist",
    oldSourceId: "marxian-socialism",
    oldTargetId: "marxist-leninist",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["marxian-socialism:contrasts_with:marxist-leninist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:marxian-socialism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The non-Leninist anchor shares Marxian analysis but does not make vanguard-party organization or centralized transitional state power a defining commitment.",
  },
  {
    migrationId: "v13:marxist-leninist:contrasts_with:market-socialist",
    oldSourceId: "marxist-leninist",
    oldTargetId: "market-socialist",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["marxist-leninist:contrasts_with:market-socialist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:market-socialist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical contrasts_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:marxist-leninist:contrasts_with:marxian-socialism",
    oldSourceId: "marxist-leninist",
    oldTargetId: "marxian-socialism",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["marxist-leninist:contrasts_with:marxian-socialism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:marxist-leninist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Marxism-Leninism combines Marxian analysis with a distinctive theory of revolutionary party organization and state power; it is not a subtype of the non-Leninist anchor.",
  },
  {
    migrationId: "v13:marxist-leninist:contrasts_with:social-anarchism",
    oldSourceId: "marxist-leninist",
    oldTargetId: "social-anarchism",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["marxist-leninist:contrasts_with:social-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:social-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical contrasts_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:minarchist:subtype_of:market-right-libertarianism",
    oldSourceId: "minarchist",
    oldTargetId: "market-right-libertarianism",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["minarchist:subtype_of:market-right-libertarianism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:minarchist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for minarchist.",
  },
  {
    migrationId: "v13:mutualist:often_combines_with:left-wing-market-anarchism",
    oldSourceId: "mutualist",
    oldTargetId: "left-wing-market-anarchism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: [
      "mutualist:often_combines_with:left-wing-market-anarchism",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Some contemporary writers connect mutualist anti-privilege arguments to left-wing market anarchism, but neither label is a subtype of the other.",
  },
  {
    migrationId: "v13:mutualist:overlaps_with:individualist-anarchism",
    oldSourceId: "mutualist",
    oldTargetId: "individualist-anarchism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["mutualist:overlaps_with:individualist-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Proudhon influenced portions of the Tuckerite American individualist-anarchist field, including Joseph (Jo) and Laurance Labadie. That field also includes natural-rights and egoist currents, so the relation is neither identity nor two exhaustive mutualist camps.",
  },
  {
    migrationId: "v13:mutualist:overlaps_with:market-anarchism",
    oldSourceId: "mutualist",
    oldTargetId: "market-anarchism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["mutualist:overlaps_with:market-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Mutualist and market-anarchist currents can share anti-statism and exchange, while differing over property, exploitation, rent, and the meaning of a freed market.",
  },
  {
    migrationId: "v13:mutualist:overlaps_with:social-anarchism",
    oldSourceId: "mutualist",
    oldTargetId: "social-anarchism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["mutualist:overlaps_with:social-anarchism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Mutualist federation and anti-domination can overlap with social or communal anarchism, but mutualism does not inherit that branch’s full economic program.",
  },
  {
    migrationId: "v13:nationalism:often_combines_with:black-nationalism",
    oldSourceId: "nationalism",
    oldTargetId: "black-nationalism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: ["nationalism:often_combines_with:black-nationalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:black-nationalism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical often_combines_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:neoconservative:subtype_of:conservative",
    oldSourceId: "neoconservative",
    oldTargetId: "conservative",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["neoconservative:subtype_of:conservative"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:neoconservative",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Historical parent relation retained as a typed subtype_of edge for neoconservative.",
  },
  {
    migrationId: "v13:pan-africanism:often_combines_with:internationalism",
    oldSourceId: "pan-africanism",
    oldTargetId: "internationalism",
    oldRelation: "often_combines_with",
    disposition: "retain-unchanged",
    newRelationIds: ["pan-africanism:often_combines_with:internationalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:pan-africanism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical often_combines_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:pan-africanism:overlaps_with:black-nationalism",
    oldSourceId: "pan-africanism",
    oldTargetId: "black-nationalism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["pan-africanism:overlaps_with:black-nationalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:pan-africanism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical overlaps_with relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:social-anarchism:contrasts_with:marxist-leninist",
    oldSourceId: "social-anarchism",
    oldTargetId: "marxist-leninist",
    oldRelation: "contrasts_with",
    disposition: "retain-unchanged",
    newRelationIds: ["social-anarchism:contrasts_with:marxist-leninist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:social-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Both may seek social ownership, but they diverge over party-state authority and centralized transition.",
  },
  {
    migrationId: "v13:social-anarchism:overlaps_with:mutualist",
    oldSourceId: "social-anarchism",
    oldTargetId: "mutualist",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["social-anarchism:overlaps_with:mutualist"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:mutualist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId: "v13:social-anarchism:subtype_of:libertarian-socialism",
    oldSourceId: "social-anarchism",
    oldTargetId: "libertarian-socialism",
    oldRelation: "subtype_of",
    disposition: "retain-unchanged",
    newRelationIds: ["social-anarchism:subtype_of:libertarian-socialism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:social-anarchism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical subtype_of relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:social-liberalism:overlaps_with:georgism",
    oldSourceId: "social-liberalism",
    oldTargetId: "georgism",
    oldRelation: "overlaps_with",
    disposition: "retain-unchanged",
    newRelationIds: ["social-liberalism:overlaps_with:georgism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:georgism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The symmetric reverse of the historical overlaps_with relation is retained explicitly so the vNext graph remains undirected in meaning.",
  },
  {
    migrationId:
      "v13:technocratic-centralist:requires:technocratic-orientation",
    oldSourceId: "technocratic-centralist",
    oldTargetId: "technocratic-orientation",
    oldRelation: "requires",
    disposition: "retain-unchanged",
    newRelationIds: [
      "technocratic-centralist:requires:technocratic-orientation",
    ],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:technocratic-centralist",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "Technocratic centralism adds concentrated administrative authority to a broader confidence in expert governance; expert advice alone is insufficient.",
  },
  {
    migrationId: "v13:welfare-chauvinism:requires:nationalism",
    oldSourceId: "welfare-chauvinism",
    oldTargetId: "nationalism",
    oldRelation: "requires",
    disposition: "retain-unchanged",
    newRelationIds: ["welfare-chauvinism:requires:nationalism"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:welfare-chauvinism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical requires relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
  {
    migrationId: "v13:welfare-chauvinism:requires:social-democrat",
    oldSourceId: "welfare-chauvinism",
    oldTargetId: "social-democrat",
    oldRelation: "requires",
    disposition: "retain-unchanged",
    newRelationIds: ["welfare-chauvinism:requires:social-democrat"],
    methodologicalDecision: "D-132",
    sourceRecordIds: [
      "label-taxonomy-v13:welfare-chauvinism",
      "docs/vnext-integrated-system-specification-2026-08.md:5.3",
      "docs/methodological-change-decision-log-2026-08.md:D-132",
    ],
    rationale:
      "The historical requires relation is retained as an explicit vNext edge; its meaning is not inferred from scoring or proximity.",
  },
] as const;

export const vnextGraphMigrationById = new Map(
  vnextGraphMigrationLedger.map((record) => [record.migrationId, record]),
);
