#!/usr/bin/env node
/**
 * One-way development migration for the clean canonical authority.
 * It never edits legacy sources and never writes output after a failed guard.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SOURCE_COMMIT = "f0324dbf27dfc6e35ff557992e4643e3df15ee0e";
const METHODOLOGY_COMMIT = "b1ac3e3e147e3761faccec8588d7c822a875d4dc";
const VERSION = "ideology-registry-2026-08-clean-v1";
const EXPECTED_FINGERPRINT =
  "d4bb1fa823a9ae0f4effc39971932c1e0f8444f1a5f0e184439c46d44438a73d";
const EXPECTED_COUNTS = {
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
const FROZEN_ROSTERS = {
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
  ],
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
  ],
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
  ],
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
  ],
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
  ],
  retired: [
    "conservative-liberalism",
    "cultural-populism",
    "bright-green-environmentalism",
    "civil-libertarian-cosmopolitan",
    "decentralist-market-skeptic-of-state",
    "egalitarian-statist",
    "national-traditionalist",
    "revolutionary-collectivist",
  ],
};

function usage() {
  return "Usage: node scripts/migrate-canonical-manifest.mjs [--input source.json] [--output artifact.json] [--report report.json]";
}
function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === "--help" || key === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const name = key.slice(2);
    const value = argv[++i];
    if (!value || value.startsWith("--"))
      throw new Error(`${key} requires a path`);
    result[name] = value;
  }
  result.output ??= "research-worker/generated/canonical-manifest.json";
  result.input ??= result.output;
  return result;
}
function discrepancy(discrepancies, path, expected, actual) {
  discrepancies.push({ path, expected, actual });
}
function sameSequence(a, b) {
  return (
    Array.isArray(a) && a.length === b.length && a.every((v, i) => v === b[i])
  );
}
function duplicates(values) {
  const seen = new Set();
  const result = new Set();
  for (const value of values ?? []) {
    if (seen.has(value)) result.add(value);
    seen.add(value);
  }
  return [...result].sort();
}
function validate(source) {
  const errors = [];
  if (source.sourceCommit !== SOURCE_COMMIT)
    discrepancy(errors, "sourceCommit", SOURCE_COMMIT, source.sourceCommit);
  if (source.methodologyCommit !== METHODOLOGY_COMMIT)
    discrepancy(
      errors,
      "methodologyCommit",
      METHODOLOGY_COMMIT,
      source.methodologyCommit,
    );
  const rosters = source.rosters ?? {};
  for (const role of Object.keys(FROZEN_ROSTERS)) {
    if (!sameSequence(rosters[role], FROZEN_ROSTERS[role]))
      discrepancy(
        errors,
        `rosters.${role}`,
        FROZEN_ROSTERS[role],
        rosters[role],
      );
    const dupe = duplicates(rosters[role]);
    if (dupe.length)
      discrepancy(errors, `rosters.${role}.duplicates`, [], dupe);
  }
  const modules = Array.isArray(source.modules) ? source.modules : [];
  const core = Array.isArray(source.coreItemIds) ? source.coreItemIds : [];
  const conditional = Array.isArray(source.conditionalSpecialistItemIds)
    ? source.conditionalSpecialistItemIds
    : [];
  const counts = {
    roots: rosters.roots?.length ?? 0,
    primary: rosters.primary?.length ?? 0,
    specialist: rosters.specialist?.length ?? 0,
    modifier: rosters.modifier?.length ?? 0,
    context: rosters.context?.length ?? 0,
    retired: rosters.retired?.length ?? 0,
    modules: modules.length,
    activeCoreItems: core.length,
    conditionalSpecialistItems: conditional.length,
  };
  for (const key of Object.keys(EXPECTED_COUNTS))
    if (counts[key] !== EXPECTED_COUNTS[key])
      discrepancy(errors, `counts.${key}`, EXPECTED_COUNTS[key], counts[key]);
  const rootIds = source.rootIds ?? rosters.roots;
  if (!sameSequence(rootIds, FROZEN_ROSTERS.roots))
    discrepancy(errors, "rootIds", FROZEN_ROSTERS.roots, rootIds);
  for (const [name, ids] of [
    ["coreItemIds", core],
    ["conditionalSpecialistItemIds", conditional],
  ]) {
    const dupe = duplicates(ids);
    if (dupe.length) discrepancy(errors, `${name}.duplicates`, [], dupe);
  }
  const moduleIds = modules.map((module) => module.id);
  const moduleDupes = duplicates(moduleIds);
  if (moduleDupes.length)
    discrepancy(errors, "modules.duplicates", [], moduleDupes);
  const expectedItems = new Set(conditional);
  const assigned = new Set();
  const known = new Set([
    ...FROZEN_ROSTERS.roots,
    ...FROZEN_ROSTERS.primary,
    ...FROZEN_ROSTERS.specialist,
    ...FROZEN_ROSTERS.modifier,
    ...FROZEN_ROSTERS.context,
    ...FROZEN_ROSTERS.retired,
    ...core,
    ...conditional,
    ...moduleIds,
  ]);
  for (const module of modules) {
    for (const itemId of module.itemIds ?? []) {
      if (!expectedItems.has(itemId))
        discrepancy(
          errors,
          `modules.${module.id}.itemIds`,
          "conditional specialist item",
          itemId,
        );
      if (assigned.has(itemId))
        discrepancy(
          errors,
          `modules.${module.id}.itemIds`,
          "unique item",
          itemId,
        );
      assigned.add(itemId);
    }
    for (const candidateId of module.candidateIds ?? [])
      if (typeof candidateId !== "string" || candidateId.length === 0)
        discrepancy(
          errors,
          `modules.${module.id}.candidateIds`,
          "non-empty candidate ID",
          candidateId,
        );
  }
  if (assigned.size !== conditional.length)
    discrepancy(
      errors,
      "modules.itemCoverage",
      conditional.length,
      assigned.size,
    );
  for (const [name, ids] of Object.entries(source.referenceIds ?? {}))
    for (const id of ids)
      if (!known.has(id))
        discrepancy(errors, `references.${name}`, "known canonical ID", id);
  return {
    status: errors.length ? "failed" : "passed",
    sourceCommit: source.sourceCommit,
    methodologyCommit: source.methodologyCommit,
    version: VERSION,
    counts,
    discrepancies: errors,
  };
}
function normalizeInput(value) {
  const manifest = value?.manifest ?? value;
  if (value?.rosters && value?.sourceCommit) return value;
  if (!manifest || !manifest.metadata) return value;
  const nodes = manifest.nodes ?? [];
  const rosters = Object.fromEntries(
    ["primary", "specialist", "modifier", "context", "retired"].map((role) => [
      role,
      nodes
        .filter((node) => node.publicRoleView === role)
        .map((node) => node.id),
    ]),
  );
  rosters.roots = (manifest.constructs ?? []).map((construct) => construct.id);
  return {
    sourceCommit: manifest.metadata.sourceCommit,
    methodologyCommit: manifest.metadata.methodologyCommit,
    rosters,
    rootIds: rosters.roots,
    coreItemIds: manifest.activeCoreItemIds ?? [],
    conditionalSpecialistItemIds: manifest.conditionalSpecialistItemIds ?? [],
    modules: (manifest.specialistModules ?? []).map((module) => ({
      id: module.id,
      itemIds: module.itemIds,
      candidateIds: module.candidateIds,
    })),
    manifest,
  };
}
function validateManifest(source, report) {
  const manifest = source.manifest;
  if (!manifest || typeof manifest !== "object") {
    report.discrepancies.push({
      path: "manifest",
      expected: "object",
      actual: manifest,
    });
    report.status = "failed";
    return;
  }
  if (manifest.metadata?.fingerprint !== EXPECTED_FINGERPRINT) {
    report.discrepancies.push({
      path: "manifest.metadata.fingerprint",
      expected: EXPECTED_FINGERPRINT,
      actual: manifest.metadata?.fingerprint,
    });
  }
  if (
    JSON.stringify(manifest.metadata?.counts) !==
    JSON.stringify(EXPECTED_COUNTS)
  ) {
    report.discrepancies.push({
      path: "manifest.metadata.counts",
      expected: EXPECTED_COUNTS,
      actual: manifest.metadata?.counts,
    });
  }
  const roots = new Set(
    (manifest.constructs ?? []).map((construct) => construct.id),
  );
  const nodes = new Set((manifest.nodes ?? []).map((node) => node.id));
  for (const item of manifest.items ?? []) {
    for (const constructId of item.constructIds ?? []) {
      if (!roots.has(constructId))
        report.discrepancies.push({
          path: `manifest.items.${item.id}.constructIds`,
          expected: "root construct",
          actual: constructId,
        });
    }
    for (const constructId of Object.keys(item.rootConstructWeights ?? {})) {
      if (!roots.has(constructId))
        report.discrepancies.push({
          path: `manifest.items.${item.id}.rootConstructWeights`,
          expected: "root construct",
          actual: constructId,
        });
    }
  }
  for (const relation of manifest.relations ?? []) {
    for (const [side, reference] of [
      ["source", relation.source],
      ["target", relation.target],
    ]) {
      if (reference?.kind === "node" && !nodes.has(reference.id))
        report.discrepancies.push({
          path: `manifest.relations.${relation.id}.${side}`,
          expected: "known node",
          actual: reference.id,
        });
    }
  }
  if (report.discrepancies.length > 0) report.status = "failed";
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = normalizeInput(
    JSON.parse(await readFile(resolve(args.input), "utf8")),
  );
  const report = validate(source);
  if (source.manifest && typeof source.manifest === "object") {
    validateManifest(source, report);
  } else {
    report.discrepancies.push({
      path: "manifest",
      expected: "object",
      actual: source.manifest,
    });
    report.status = "failed";
  }
  if (args.report) {
    await mkdir(dirname(resolve(args.report)), { recursive: true });
    await writeFile(
      resolve(args.report),
      JSON.stringify(report, null, 2) + "\n",
    );
  }
  if (report.status !== "passed")
    throw new Error(
      `Canonical migration refused: ${report.discrepancies.map((item) => item.path).join(", ")}`,
    );
  const artifact = {
    artifactVersion: "canonical-manifest-artifact-v1",
    manifestVersion: VERSION,
    manifest: source.manifest,
    receipt: report,
  };
  await mkdir(dirname(resolve(args.output)), { recursive: true });
  await writeFile(
    resolve(args.output),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      output: args.output,
      report: args.report ?? null,
      fingerprint: source.manifest.metadata?.fingerprint,
      counts: report.counts,
    }),
  );
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
