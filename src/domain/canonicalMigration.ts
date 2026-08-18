/** Frozen-source migration guards for the clean canonical registry. */
import {
  CANONICAL_MANIFEST_FINGERPRINT,
  type CanonicalManifest,
  type CanonicalManifestCounts,
  type StableId,
} from "./canonicalManifest";

export const FROZEN_SOURCE_COMMIT =
  "f0324dbf27dfc6e35ff557992e4643e3df15ee0e" as const;
export const APPROVED_METHODOLOGY_COMMIT =
  "b1ac3e3e147e3761faccec8588d7c822a875d4dc" as const;
export const CANONICAL_MIGRATION_VERSION =
  "ideology-registry-2026-08-clean-v1" as const;

export const EXPECTED_CANONICAL_COUNTS: CanonicalManifestCounts = {
  roots: 26,
  primary: 16,
  specialist: 78,
  modifier: 24,
  context: 19,
  retired: 8,
  modules: 9,
  activeCoreItems: 338,
  conditionalSpecialistItems: 68,
};

/** Public IDs frozen by the compatibility source; order is significant. */
export const FROZEN_ROSTERS = {
  roots: [
    "authority-legitimacy",
    "property-legitimacy",
    "liberty-noninterference",
    "equality-theory",
    "political-community-boundary",
    "moral-traditionalism",
    "anti-domination",
    "human-nature-priority",
    "militarism-pacifism",
    "secularism-religious",
    "market-process-confidence",
    "state-capacity-confidence",
    "public-choice-skepticism",
    "democratic-confidence",
    "expert-confidence",
    "cultural-plasticity",
    "coordination-optimism",
    "centralization-preference",
    "reform-vs-revolution",
    "gradualism-vs-immediatism",
    "state-action-vs-exit",
    "electoralism-vs-direct-action",
    "compromise-vs-persistence",
    "coercion-strategy",
    "regulation-vs-deregulation",
    "redistribution-vs-predistribution",
  ] as const,
  primary: [
    "conservative",
    "christian-democrat",
    "classical-liberalism",
    "democratic-socialist",
    "green-politics",
    "liberal-conservatism",
    "libertarian-socialism",
    "market-liberal",
    "market-right-libertarianism",
    "marxian-socialism",
    "marxist-leninist",
    "national-conservatism",
    "radical-democracy",
    "republicanism",
    "social-democrat",
    "social-liberalism",
  ] as const,
  specialist: [
    "absolute-monarchist",
    "agorist",
    "agrarian-populism",
    "anarcho-capitalist",
    "anarcho-communist",
    "anarcha-feminism",
    "anarcho-primitivism",
    "anarcho-syndicalism",
    "bioregionalism",
    "bleeding-heart-libertarianism",
    "black-nationalism",
    "christian-reconstructionism",
    "christian-socialism",
    "council-communist",
    "democratic-confederalism",
    "deep-ecology",
    "degrowth-green",
    "eco-fascism",
    "eco-authoritarianism",
    "ecomodernist",
    "ecosocialist",
    "fascist-authoritarian",
    "georgism",
    "geolibertarian",
    "green-capitalism",
    "guild-socialism",
    "hindutva",
    "indigenism",
    "individualist-anarchism",
    "integralism",
    "islamic-democracy",
    "juche",
    "kemalism",
    "left-wing-market-anarchism",
    "market-anarchism",
    "liberal-feminism",
    "libertarian-municipalism",
    "market-socialist",
    "maoism",
    "minarchist",
    "mutualist",
    "national-bolshevism",
    "national-socialism",
    "neoconservative",
    "neoreactionary",
    "objectivism",
    "one-nation-conservatism",
    "ordoliberalism",
    "paleoconservatism",
    "paleolibertarianism",
    "pan-africanism",
    "participism",
    "political-islam",
    "stirnerism",
    "strasserism",
    "socialist-feminism",
    "syndicalist",
    "traditional-monarchist",
    "trotskyism",
    "voluntaryism",
    "zionism",
    "third-way",
    "distributism",
    "neoliberalism",
    "social-anarchism",
    "developmentalism",
    "pan-arabism",
    "arab-socialism",
    "radical-feminism",
    "religious-nationalism",
    "black-feminism",
    "queer-politics",
    "confucian-political-revival",
    "techno-anarchism",
    "technocratic-centralist",
    "theocrat",
    "queer-anarchism",
    "welfare-chauvinism",
  ] as const,
  modifier: [
    "anti-imperialism",
    "civic-nationalist",
    "communitarianism",
    "cosmopolitanism",
    "civil-libertarianism",
    "decentralist-orientation",
    "economic-nationalism",
    "ethnonationalist",
    "expansionist-nationalism",
    "fiscal-conservatism",
    "internationalism",
    "feminist-orientation",
    "left-wing-nationalism",
    "left-wing-populism",
    "multiculturalism",
    "regionalism",
    "right-wing-populism",
    "separatist-nationalism",
    "progressivism",
    "social-conservatism",
    "technocratic-orientation",
    "nationalism",
    "populism",
    "transhumanism",
  ] as const,
  context: [
    "accelerationism",
    "asian-values",
    "baathism",
    "constitutional-monarchism",
    "corporatism",
    "cyberocracy",
    "dataism",
    "developmental-authoritarianism",
    "fourth-theory",
    "fundamentalist-theocracy",
    "liquid-democracy",
    "radical-centrism",
    "singularitarianism",
    "social-investment-state",
    "platformism",
    "panarchism",
    "universal-basic-income",
    "utopian-socialism",
    "world-federalism",
  ] as const,
  retired: [
    "conservative-liberalism",
    "cultural-populism",
    "bright-green-environmentalism",
    "civil-libertarian-cosmopolitan",
    "decentralist-market-skeptic-of-state",
    "egalitarian-statist",
    "national-traditionalist",
    "revolutionary-collectivist",
  ] as const,
} as const;

export interface MigrationSource {
  readonly sourceCommit: string;
  readonly methodologyCommit: string;
  readonly rosters: Readonly<{
    readonly roots: readonly StableId[];
    readonly primary: readonly StableId[];
    readonly specialist: readonly StableId[];
    readonly modifier: readonly StableId[];
    readonly context: readonly StableId[];
    readonly retired: readonly StableId[];
  }>;
  readonly rootIds?: readonly StableId[];
  readonly coreItemIds: readonly StableId[];
  readonly conditionalSpecialistItemIds: readonly StableId[];
  readonly modules: readonly MigrationModule[];
  readonly referenceIds?: Readonly<Record<string, readonly StableId[]>>;
  readonly manifest?: CanonicalManifest;
}

export interface MigrationModule {
  readonly id: StableId;
  readonly itemIds: readonly StableId[];
  readonly candidateIds: readonly StableId[];
}

export interface MigrationDiscrepancy {
  readonly path: string;
  readonly expected: unknown;
  readonly actual: unknown;
}

export interface MigrationReport {
  readonly status: "passed" | "failed";
  readonly sourceCommit: string;
  readonly methodologyCommit: string;
  readonly counts: CanonicalManifestCounts;
  readonly discrepancies: readonly MigrationDiscrepancy[];
}

const sameSequence = (left: readonly unknown[], right: readonly unknown[]) =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const count = (source: MigrationSource): CanonicalManifestCounts => ({
  roots: source.rosters.roots.length,
  primary: source.rosters.primary.length,
  specialist: source.rosters.specialist.length,
  modifier: source.rosters.modifier.length,
  context: source.rosters.context.length,
  retired: source.rosters.retired.length,
  modules: source.modules.length,
  activeCoreItems: source.coreItemIds.length,
  conditionalSpecialistItems: source.conditionalSpecialistItemIds.length,
});

function addDiscrepancy(
  discrepancies: MigrationDiscrepancy[],
  path: string,
  expected: unknown,
  actual: unknown,
): void {
  discrepancies.push({ path, expected, actual });
}

function duplicateIds(ids: readonly StableId[]): StableId[] {
  const seen = new Set<StableId>();
  const duplicates = new Set<StableId>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates].sort();
}

/** Validate a migration input before any output is written. */
export function validateMigrationSource(
  source: MigrationSource,
): MigrationReport {
  const discrepancies: MigrationDiscrepancy[] = [];
  if (source.sourceCommit !== FROZEN_SOURCE_COMMIT)
    addDiscrepancy(
      discrepancies,
      "sourceCommit",
      FROZEN_SOURCE_COMMIT,
      source.sourceCommit,
    );
  if (source.methodologyCommit !== APPROVED_METHODOLOGY_COMMIT)
    addDiscrepancy(
      discrepancies,
      "methodologyCommit",
      APPROVED_METHODOLOGY_COMMIT,
      source.methodologyCommit,
    );
  const actualCount = count(source);
  for (const key of Object.keys(EXPECTED_CANONICAL_COUNTS) as Array<
    keyof CanonicalManifestCounts
  >) {
    if (actualCount[key] !== EXPECTED_CANONICAL_COUNTS[key])
      addDiscrepancy(
        discrepancies,
        `counts.${key}`,
        EXPECTED_CANONICAL_COUNTS[key],
        actualCount[key],
      );
  }
  for (const role of Object.keys(FROZEN_ROSTERS) as Array<
    keyof typeof FROZEN_ROSTERS
  >) {
    if (!sameSequence(source.rosters[role], FROZEN_ROSTERS[role]))
      addDiscrepancy(
        discrepancies,
        `rosters.${role}`,
        FROZEN_ROSTERS[role],
        source.rosters[role],
      );
    const duplicate = duplicateIds(source.rosters[role]);
    if (duplicate.length)
      addDiscrepancy(
        discrepancies,
        `rosters.${role}.duplicates`,
        [],
        duplicate,
      );
  }
  const roots = source.rootIds ?? source.rosters.roots;
  if (!sameSequence(roots, FROZEN_ROSTERS.roots))
    addDiscrepancy(discrepancies, "rootIds", FROZEN_ROSTERS.roots, roots);
  for (const [name, ids] of [
    ["coreItemIds", source.coreItemIds],
    ["conditionalSpecialistItemIds", source.conditionalSpecialistItemIds],
  ] as const) {
    const duplicate = duplicateIds(ids);
    if (duplicate.length)
      addDiscrepancy(discrepancies, `${name}.duplicates`, [], duplicate);
  }
  const moduleIds = source.modules.map((module) => module.id);
  if (duplicateIds(moduleIds).length)
    addDiscrepancy(
      discrepancies,
      "modules.duplicates",
      [],
      duplicateIds(moduleIds),
    );
  const conditional = new Set(source.conditionalSpecialistItemIds);
  const assigned = new Set<StableId>();
  for (const module of source.modules) {
    for (const itemId of module.itemIds) {
      if (!conditional.has(itemId))
        addDiscrepancy(
          discrepancies,
          `modules.${module.id}.itemIds`,
          "conditional specialist item",
          itemId,
        );
      if (assigned.has(itemId))
        addDiscrepancy(
          discrepancies,
          `modules.${module.id}.itemIds`,
          "unique item",
          itemId,
        );
      assigned.add(itemId);
    }
    for (const candidateId of module.candidateIds) {
      if (typeof candidateId !== "string" || candidateId.length === 0)
        addDiscrepancy(
          discrepancies,
          `modules.${module.id}.candidateIds`,
          "non-empty candidate ID",
          candidateId,
        );
    }
  }
  if (assigned.size !== source.conditionalSpecialistItemIds.length)
    addDiscrepancy(
      discrepancies,
      "modules.itemCoverage",
      source.conditionalSpecialistItemIds.length,
      assigned.size,
    );
  for (const [name, ids] of Object.entries(source.referenceIds ?? {})) {
    const known = new Set([
      ...FROZEN_ROSTERS.roots,
      ...FROZEN_ROSTERS.primary,
      ...FROZEN_ROSTERS.specialist,
      ...FROZEN_ROSTERS.modifier,
      ...FROZEN_ROSTERS.context,
      ...FROZEN_ROSTERS.retired,
      ...source.coreItemIds,
      ...source.conditionalSpecialistItemIds,
      ...moduleIds,
    ]);
    for (const id of ids)
      if (!known.has(id))
        addDiscrepancy(
          discrepancies,
          `references.${name}`,
          "known canonical ID",
          id,
        );
  }
  if (source.manifest) {
    const manifest = source.manifest;
    if (manifest.metadata.fingerprint !== CANONICAL_MANIFEST_FINGERPRINT)
      addDiscrepancy(
        discrepancies,
        "manifest.metadata.fingerprint",
        CANONICAL_MANIFEST_FINGERPRINT,
        manifest.metadata.fingerprint,
      );
    if (
      JSON.stringify(manifest.metadata.counts) !==
      JSON.stringify(EXPECTED_CANONICAL_COUNTS)
    ) {
      addDiscrepancy(
        discrepancies,
        "manifest.metadata.counts",
        EXPECTED_CANONICAL_COUNTS,
        manifest.metadata.counts,
      );
    }
    const rootIds = new Set(
      manifest.constructs.map((construct) => construct.id),
    );
    const nodeIds = new Set((manifest.nodes ?? []).map((node) => node.id));
    for (const item of manifest.items) {
      for (const constructId of item.constructIds) {
        if (!rootIds.has(constructId))
          addDiscrepancy(
            discrepancies,
            `manifest.items.${item.id}.constructIds`,
            "root construct",
            constructId,
          );
      }
      for (const constructId of Object.keys(item.rootConstructWeights ?? {})) {
        if (!rootIds.has(constructId))
          addDiscrepancy(
            discrepancies,
            `manifest.items.${item.id}.rootConstructWeights`,
            "root construct",
            constructId,
          );
      }
    }
    for (const relation of manifest.relations ?? []) {
      if (relation.source.kind === "node" && !nodeIds.has(relation.source.id))
        addDiscrepancy(
          discrepancies,
          `manifest.relations.${relation.id}.source`,
          "known node",
          relation.source.id,
        );
      if (relation.target.kind === "node" && !nodeIds.has(relation.target.id))
        addDiscrepancy(
          discrepancies,
          `manifest.relations.${relation.id}.target`,
          "known node",
          relation.target.id,
        );
    }
  }
  return {
    status: discrepancies.length ? "failed" : "passed",
    sourceCommit: source.sourceCommit,
    methodologyCommit: source.methodologyCommit,
    counts: actualCount,
    discrepancies,
  };
}

/** A migration is deliberately a validation boundary; callers write output only on passed. */
export function migrateCanonicalSource(source: MigrationSource): {
  readonly manifest: CanonicalManifest;
  readonly report: MigrationReport;
} {
  const report = validateMigrationSource(source);
  if (report.status === "failed")
    throw new Error(
      `Canonical migration refused: ${report.discrepancies.map((item) => item.path).join(", ")}`,
    );
  if (!source.manifest)
    throw new Error(
      "Canonical migration requires a generated manifest payload",
    );
  return { manifest: source.manifest, report };
}
