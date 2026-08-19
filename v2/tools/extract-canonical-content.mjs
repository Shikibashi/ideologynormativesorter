import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { transformSync } from "esbuild";

const root = process.cwd();
const sourceManifestPath = path.join(
  root,
  "research-worker/generated/canonical-manifest.json",
);
const domainSourcePath = path.join(root, "src/data/domains.ts");
const specialistSourcePath = path.join(root, "src/specialist/index.ts");
const outputRoot = path.join(root, "v2/content");

const sourceArtifact =
  "research-worker/generated/canonical-manifest.json#manifest";
const sourceCommit = "f0324dbf27dfc6e35ff557992e4643e3df15ee0e";
const methodologyCommit = "b1ac3e3e147e3761faccec8588d7c822a875d4dc";
const extractionVersion = "v2-phase2-audited-extraction-1";

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function loadNamedTypeScriptExport(filePath, exportName) {
  const source = readFileSync(filePath, "utf8");
  const transformed = transformSync(source, {
    loader: "ts",
    format: "esm",
    target: "es2022",
  }).code;
  const encoded = Buffer.from(transformed, "utf8").toString("base64");
  const loaded = await import(`data:text/javascript;base64,${encoded}`);
  if (!(exportName in loaded)) {
    throw new Error(`Missing ${exportName} export in ${filePath}`);
  }
  return loaded[exportName];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sortedById(values) {
  return [...values].sort((left, right) =>
    String(left.id).localeCompare(String(right.id)),
  );
}

function titleFromId(value) {
  return value
    .replace(/^specialist:[^:]+:/u, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

const EXCLUDED_FINGERPRINT_KEYS = new Set(["contentFingerprint", "counts", "display"]);

function canonicalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    const normalized = value.map(canonicalize);
    if (
      normalized.every(
        (entry) =>
          entry && typeof entry === "object" && !Array.isArray(entry) &&
          typeof entry.id === "string",
      )
    ) {
      return [...normalized].sort((left, right) =>
        String(left.id).localeCompare(String(right.id)),
      );
    }
    return normalized;
  }
  const result = {};
  for (const key of Object.keys(value).sort()) {
    if (EXCLUDED_FINGERPRINT_KEYS.has(key)) continue;
    result[key.normalize("NFC")] = canonicalize(value[key]);
  }
  return result;
}

function citationKey(citation) {
  return `citation:${sha256(
    `${citation.url}\u0000${citation.title}\u0000${citation.publisher ?? ""}`,
  ).slice(0, 16)}`;
}

function addCitation(citation, citations) {
  if (!citation?.title || !citation?.url) return undefined;
  const id = citationKey(citation);
  if (!citations.has(id)) {
    citations.set(id, {
      id,
      kind: "citation",
      title: citation.title,
      location: citation.url,
      url: citation.url,
      publisher: citation.publisher,
      note: citation.note,
    });
  }
  return id;
}

function refsFor(citations, records = []) {
  return [
    "source:v1-canonical-manifest",
    ...records.map((record) => addCitation(record, citations)).filter(Boolean),
  ];
}

function signedContributions(weights, localConstructId) {
  return Object.entries(weights ?? {}).map(([constructId, value]) => {
    assert(
      typeof value === "number" && Number.isFinite(value) && value !== 0,
      `Invalid mapping weight for ${constructId}`,
    );
    return {
      constructId: localConstructId ? localConstructId(constructId) : constructId,
      weight: Math.abs(value),
      polarity: value < 0 ? -1 : 1,
    };
  });
}

function gateRecords(rawGates, localConstructId, prefix) {
  return (rawGates ?? []).map((rawGate, index) => {
    const constructId = rawGate.constructId
      ? localConstructId(rawGate.constructId)
      : undefined;
    const minimum = rawGate.min;
    const maximum = rawGate.max;
    assert(
      constructId && (typeof minimum === "number" || typeof maximum === "number"),
      `Unsupported specialist gate at ${prefix}[${index}]`,
    );
    const gate = {
      id: `gate:${prefix}:${constructId}`,
      constructId,
    };
    if (typeof minimum === "number" && typeof maximum === "number") {
      return { ...gate, operator: "interval", minimum, maximum };
    }
    if (typeof minimum === "number") {
      return { ...gate, operator: "minimum", minimum };
    }
    return { ...gate, operator: "maximum", maximum };
  });
}

function extractAssignmentConfig(source) {
  const text = readFileSync(source, "utf8");
  const strategy = text.match(
    /export const SPECIALIST_ASSIGNMENT_STRATEGY = ["']([^"']+)["']/u,
  )?.[1];
  const rosterVersion = text.match(
    /export const SPECIALIST_ASSIGNMENT_ROSTER_VERSION =\s*["']([^"']+)["']/u,
  )?.[1];
  const rosterText = text.match(
    /export const SPECIALIST_ASSIGNMENT_MODULE_IDS = \[([\s\S]*?)\] as const/u,
  )?.[1];
  assert(strategy && rosterVersion && rosterText, "Specialist assignment metadata is incomplete");
  const orderedModuleIds = [...rosterText.matchAll(/["']([^"']+)["']/gu)].map(
    (match) => match[1],
  );
  return { strategy, rosterVersion, orderedModuleIds };
}

function makeSourceRecords(citations) {
  return [
    {
      id: "source:v1-canonical-manifest",
      kind: "artifact",
      title: "Approved v1 canonical manifest export",
      location: sourceArtifact,
      recordId: "manifest",
      note: "Final approved v1 content export used as the Phase 2 extraction authority.",
    },
    {
      id: "source:v1-domain-registry",
      kind: "authority",
      title: "v1 policy-domain registry",
      location: "src/data/domains.ts",
      note: "The canonical manifest stores item domain IDs but does not include the domain labels and descriptions.",
    },
    {
      id: "source:v1-canonical-migration",
      kind: "artifact",
      title: "v1 canonical migration boundary",
      location: "src/domain/canonicalMigration.ts",
      note: "Used for reconciliation and frozen roster/count comparison only; not imported by v2 runtime.",
    },
    {
      id: "source:phase0-measurement-contract",
      kind: "decision",
      title: "v2 measurement contract",
      location: "docs/v2/measurement-contract.md",
      note: "Defines the approved item salience, evidence, mapping, and gating semantics.",
    },
    {
      id: "source:phase0-known-defects",
      kind: "decision",
      title: "v2 known-defect register",
      location: "docs/v2/known-defects.md",
      note: "Documents v1 behaviors deliberately excluded from the v2 canonical source.",
    },
    ...[...citations.values()],
  ].sort((left, right) => left.id.localeCompare(right.id));
}

function buildBundle(manifest, domains, assignment) {
  const canonical = manifest.manifest;
  assert(canonical, "The v1 artifact has no manifest object");
  const citations = new Map();
  const domainIds = new Set(domains.map((domain) => domain.id));
  const rootConstructIds = new Set(canonical.constructs.map((construct) => construct.id));
  const moduleById = new Map(canonical.specialistModules.map((module) => [module.id, module]));
  const localConstructId = (moduleId, rawId) =>
    `specialist:${moduleId}:${rawId}`;
  const localConstructIds = new Map();
  for (const module of canonical.specialistModules) {
    for (const rawId of module.constructIds) {
      localConstructIds.set(`${module.id}:${rawId}`, localConstructId(module.id, rawId));
    }
  }
  const localIdForModule = (moduleId) => (rawId) => {
    const id = localConstructIds.get(`${moduleId}:${rawId}`);
    assert(id, `Unknown specialist construct ${moduleId}:${rawId}`);
    return id;
  };

  for (const domain of domains) {
    assert(domainIds.has(domain.id), `Domain source contains duplicate ${domain.id}`);
  }
  for (const item of canonical.items) {
    assert(domainIds.has(item.domain), `Item ${item.id} references unknown domain ${item.domain}`);
  }

  const rootConstructs = sortedById(
    canonical.constructs.map((construct) => ({
      id: construct.id,
      name: construct.name,
      role: construct.layer,
      scope: "root",
      description: construct.description,
      poles: {
        negative: construct.negativePole,
        positive: construct.positivePole,
      },
      sourceKey: construct.id,
      lifecycle: {
        conceptualStatus: construct.conceptualStatus,
        measurementStatus: construct.measurementStatus,
        publicRoleStatus: construct.publicRoleStatus,
      },
      display: {
        shortLabel: construct.name,
        longLabel: construct.name,
      },
      provenanceRefs: ["source:v1-canonical-manifest", "source:phase0-measurement-contract"],
    })),
  );

  const localConstructs = sortedById(
    canonical.specialistModules.flatMap((module) =>
      module.constructIds.map((rawId) => ({
        id: localConstructId(module.id, rawId),
        name: titleFromId(rawId),
        role: "specialist",
        scope: "specialist",
        moduleId: module.id,
        sourceKey: rawId,
        lifecycle: {
          conceptualStatus: "candidate",
          measurementStatus: "research-candidate",
          publicRoleStatus: "specialist",
        },
        provenanceRefs: [
          "source:v1-canonical-manifest",
          "source:phase0-measurement-contract",
        ],
      })),
    ),
  );

  const activeIds = new Set([
    ...(canonical.activeCoreItemIds ?? []),
    ...(canonical.conditionalSpecialistItemIds ?? []),
  ]);
  const items = sortedById(
    canonical.items
      .filter((item) => activeIds.has(item.id) && item.active !== false)
      .map((item) => {
        const moduleId = item.moduleId;
        const mapLocal = moduleId ? localIdForModule(moduleId) : undefined;
        const responseType =
          item.responseType === "statementChoice"
            ? "statement-choice"
            : item.responseType;
        assert(
          responseType === "likert7" || responseType === "statement-choice",
          `Unsupported response type ${item.responseType} on ${item.id}`,
        );
        const options = (item.statementOptions ?? []).map((option) => ({
          id: option.id,
          text: option.text,
          contributions: signedContributions(option.rootConstructWeights),
        }));
        if (responseType === "statement-choice") {
          assert(options.length > 0, `Statement-choice item ${item.id} has no options`);
          for (const option of options) {
            assert(
              option.contributions.length > 0,
              `Statement-choice option ${item.id}/${option.id} has no mapping`,
            );
          }
        }
        const contributions = [
          ...signedContributions(item.rootConstructWeights),
          ...(mapLocal ? signedContributions(item.localConstructWeights, mapLocal) : []),
        ];
        if (responseType !== "statement-choice") {
          assert(contributions.length > 0, `Item ${item.id} has no explicit mapping`);
        }
        const record = {
          id: item.id,
          domainId: item.domain,
          prompt: item.prompt,
          responseType,
          scoring: {
            mappingMode: responseType === "statement-choice" ? "options" : "item",
            contributions,
          },
          role: item.role,
          layer: item.layer,
          tier: item.tier,
          status: item.active === false ? "inactive" : "active",
          moduleId,
          reverseScored: item.reverseScored === true,
          allowDontKnow: item.allowDontKnow,
          confidencePrompt: item.confidencePrompt,
          priorityPrompt: item.priorityPrompt,
          contextNote: item.contextNote,
          evidenceNote: item.evidenceNote,
          reviewStatus: item.reviewStatus,
          version: item.version,
          sourceKey: item.id,
          provenanceRefs: refsFor(citations, item.sources),
        };
        if (responseType === "statement-choice") {
          return {
            ...record,
            options,
          };
        }
        return {
          ...record,
          scaleMin: -3,
          scaleMax: 3,
          scaleStep: 1,
        };
      }),
  );

  const nodeById = new Map(canonical.nodes.map((node) => [node.id, node]));
  const profiles = sortedById(
    canonical.productionProfiles.map((profile) => {
      const node = nodeById.get(profile.nodeId);
      const requirements = Object.entries(profile.centroid).map(
        ([constructId, targetValue]) => ({
          constructId,
          targetValue,
          weight: 1,
        }),
      );
      const gates = profile.requiredRootConstructIds.map((constructId) => ({
        id: `gate:${profile.labelId}:evidence:${constructId}`,
        operator: "evidenceMinimum",
        constructId,
        minimumEvidenceRatio: 0.5,
        minimumItemCount: profile.minimumItemCounts?.[constructId],
      }));
      return {
        id: profile.id,
        name: node?.canonicalName ?? profile.labelId,
        role: "primary",
        requirements,
        gates,
        minimumEvidenceRatio: 0.5,
        status: profile.status,
        version: profile.version,
        targetNodeId: profile.nodeId,
        rationale: profile.rationale || undefined,
        provenanceRefs: refsFor(citations, node?.sources),
      };
    }),
  );

  const itemsById = new Set(items.map((item) => item.id));
  const modifiers = sortedById(
    canonical.modifierContracts.map((modifier) => ({
      id: `profile:${modifier.id}`,
      name: modifier.constructName,
      role: "modifier",
      modifierId: modifier.id,
      availability: modifier.availability,
      constructName: modifier.constructName,
      note: modifier.note,
      requirements: [],
      indicators: (modifier.indicators ?? []).map((indicator) => {
        assert(itemsById.has(indicator.questionId), `Modifier ${modifier.id} references unknown item ${indicator.questionId}`);
        return {
          itemId: indicator.questionId,
          direction: indicator.direction,
          weight: 1,
          rationale: indicator.rationale,
        };
      }),
      minimumAnsweredItems: modifier.minimumAnsweredItems,
      gates: [],
      status: modifier.availability,
      version: "2026-08-modifier-construct-v1",
      targetNodeId: modifier.nodeId,
      provenanceRefs: ["source:v1-canonical-manifest", "source:phase0-measurement-contract"],
    })),
  );

  const candidateOccurrence = new Map();
  const candidateRecords = [];
  const candidateRowsByNode = new Map();
  for (const candidate of canonical.specialistCandidates) {
    const occurrenceKey = `${candidate.moduleId}:${candidate.id}`;
    const occurrence = (candidateOccurrence.get(occurrenceKey) ?? 0) + 1;
    candidateOccurrence.set(occurrenceKey, occurrence);
    const variantSlug = candidate.variant
      ? candidate.variant.toLowerCase().replace(/[^a-z0-9]+/gu, "-")
      : "base";
    const id = `candidate:${candidate.moduleId}:${candidate.id}:${variantSlug}${occurrence > 1 ? `-${occurrence}` : ""}`;
    const mapLocal = localIdForModule(candidate.moduleId);
    const requirements = Object.entries(candidate.signals ?? {}).map(
      ([constructId, targetValue]) => ({
        constructId: mapLocal(constructId),
        targetValue,
        weight: 1,
      }),
    );
    const gates = gateRecords(
      candidate.gates,
      mapLocal,
      `${candidate.moduleId}:${candidate.id}:${variantSlug}`,
    );
    const record = {
      id,
      sourceKey: candidate.id,
      nodeId: nodeById.has(candidate.nodeId ?? candidate.id)
        ? candidate.nodeId ?? candidate.id
        : undefined,
      moduleId: candidate.moduleId,
      name: candidate.name,
      description: candidate.description,
      status: candidate.status,
      variant: candidate.variant,
      requirements,
      gates,
      provenanceRefs: ["source:v1-canonical-manifest"],
    };
    candidateRecords.push(record);
    const rows = candidateRowsByNode.get(candidate.id) ?? [];
    rows.push(record);
    candidateRowsByNode.set(candidate.id, rows);
  }

  const specialistNodes = canonical.nodes.filter(
    (node) => node.publicRoleView === "specialist",
  );
  const specialists = sortedById(
    specialistNodes.map((node) => {
      const rows = candidateRowsByNode.get(node.id) ?? [];
      const moduleIds = [...new Set(rows.map((row) => row.moduleId))];
      assert(moduleIds.length <= 1, `Specialist ${node.id} crosses modules`);
      return {
        id: `profile:specialist:${node.id}`,
        name: node.canonicalName,
        role: "specialist",
        specialistId: node.id,
        itemIds: moduleIds[0]
          ? moduleById.get(moduleIds[0]).itemIds
          : [],
        activation: {},
        outputType: "diagnostic",
        moduleId: moduleIds[0],
        variants: rows.map((row) => ({
          id: row.id,
          sourceKey: row.sourceKey,
          name: row.name,
          description: row.description,
          variant: row.variant,
          status: row.status,
          requirements: row.requirements,
          gates: row.gates,
          provenanceRefs: row.provenanceRefs,
        })),
        requirements: [],
        gates: [],
        status: node.measurementStatus,
        version: node.version,
        targetNodeId: node.id,
        rationale: node.description,
        provenanceRefs: refsFor(citations, node.sources),
      };
    }),
  );

  const moduleRecords = sortedById(
    canonical.specialistModules.map((module) => {
      const candidateIds = candidateRecords
        .filter((candidate) => candidate.moduleId === module.id)
        .map((candidate) => candidate.id)
        .sort();
      const outputProfileIds = candidateRecords
        .filter(
          (candidate) =>
            candidate.moduleId === module.id &&
            candidate.nodeId &&
            nodeById.get(candidate.nodeId)?.publicRoleView === "specialist",
        )
        .map((candidate) => `profile:specialist:${candidate.nodeId}`)
        .filter((value, index, values) => values.indexOf(value) === index)
        .sort();
      return {
        id: module.id,
        version: module.version,
        title: module.title,
        shortTitle: module.shortTitle,
        description: module.description,
        invitationNote: module.invitationNote,
        estimatedMinutes: module.estimatedMinutes,
        itemIds: [...module.itemIds].sort(),
        constructIds: module.constructIds
          .map((id) => localConstructId(module.id, id))
          .sort(),
        candidateIds,
        outputProfileIds,
        provenanceRefs: ["source:v1-canonical-manifest", "source:phase0-measurement-contract"],
      };
    }),
  );

  const ontologyNodes = sortedById(
    canonical.nodes.map((node) => ({
      id: node.id,
      label: node.canonicalName,
      nodeScope: node.publicRoleView,
      parentId: node.parentId,
      canonicalDefinition: node.canonicalDefinition,
      boundaryStatement: node.boundaryStatement,
      aliases: node.aliases,
      family: node.family,
      subfamily: node.subfamily,
      legacyDisposition: node.legacyDisposition,
      conceptualStatus: node.conceptualStatus,
      measurementStatus: node.measurementStatus,
      publicRoleStatus: node.publicRoleStatus ?? node.publicRoleView,
      metadata: {
        version: node.version,
        cautionNote: node.cautionNote,
        usageNote: node.usageNote,
        legacyComponents: node.legacyComponents,
      },
      provenanceRefs: refsFor(citations, node.sources),
    })),
  );

  const ontologyRelations = sortedById(
    canonical.relations.map((relation) => ({
      id: relation.id,
      sourceNodeId: relation.source.id,
      targetNodeId: relation.target.id,
      relationType: relation.relation,
      note: relation.note,
      provenanceRefs: ["source:v1-canonical-manifest"],
    })),
  );

  const normalizedDomains = sortedById(
    domains.map((domain) => ({
      id: domain.id,
      label: domain.name,
      description: domain.description,
      provenanceRefs: ["source:v1-domain-registry"],
    })),
  );

  const metadata = {
    contentSchemaVersion: "content-schema-v2.phase2.1",
    contentVersion: "ideology-registry-2026-08-clean-v1-v2",
    contentFingerprint: "pending",
    scoringVersion: "scoring-v2.measurement-contract.1",
    responseSchemaVersion: "response-v2.phase1.1",
    resultSchemaVersion: "result-v2.phase1.1",
    researchSchemaVersion: "research-v2.phase1.1",
    sourceCommit,
    methodologyCommit,
    extractionVersion,
    sourceArtifact,
  };
  const bundle = {
    metadata,
    domains: normalizedDomains,
    constructs: [...rootConstructs, ...localConstructs],
    items,
    profiles,
    modifiers,
    specialists,
    specialistModules: moduleRecords,
    specialistCandidates: sortedById(candidateRecords),
    specialistAssignment: assignment,
    ontologyNodes,
    ontologyRelations,
    provenanceSources: [],
  };
  bundle.provenanceSources = makeSourceRecords(citations);
  const counts = {
    domains: bundle.domains.length,
    constructsRoot: rootConstructs.length,
    constructsSpecialist: localConstructs.length,
    constructsTotal: bundle.constructs.length,
    coreItems: bundle.items.filter((item) => item.role === "core").length,
    specialistItems: bundle.items.filter((item) => item.role === "specialist").length,
    likert7Items: bundle.items.filter((item) => item.responseType === "likert7").length,
    statementChoiceItems: bundle.items.filter((item) => item.responseType === "statement-choice").length,
    reversedItems: bundle.items.filter((item) => item.reverseScored).length,
    primaryProfiles: bundle.profiles.length,
    modifierProfiles: bundle.modifiers.length,
    specialistProfiles: bundle.specialists.length,
    specialistCandidates: bundle.specialistCandidates.length,
    specialistModules: bundle.specialistModules.length,
    ontologyNodes: bundle.ontologyNodes.length,
    ontologyRelations: bundle.ontologyRelations.length,
    explicitContributionMappings:
      bundle.items.reduce(
        (total, item) =>
          total +
          item.scoring.contributions.length +
          (item.options?.reduce(
            (optionTotal, option) => optionTotal + option.contributions.length,
            0,
          ) ?? 0),
        0,
      ),
  };
  bundle.metadata.counts = counts;
  bundle.metadata.contentFingerprint = sha256(JSON.stringify(canonicalize(bundle)));
  return bundle;
}

function writeSourceTree(bundle) {
  const files = {
    domains: "domains.json",
    constructs: {
      normative: "constructs/normative.json",
      descriptive: "constructs/descriptive.json",
      prescriptive: "constructs/prescriptive.json",
      specialist: "constructs/specialist.json",
    },
    items: {
      core: "items/core.json",
      specialist: "items/specialist.json",
    },
    profiles: {
      primary: "profiles/primary.json",
      modifiers: "profiles/modifiers.json",
      specialists: "profiles/specialists.json",
    },
    specialists: {
      modules: "specialists/modules.json",
      candidates: "specialists/candidates.json",
      assignment: "specialists/assignment.json",
    },
    ontology: {
      nodes: "ontology/nodes.json",
      relations: "ontology/relations.json",
    },
    provenance: { sources: "provenance/sources.json" },
  };
  writeJson(path.join(outputRoot, files.domains), bundle.domains);
  for (const [role, file] of Object.entries(files.constructs)) {
    writeJson(
      path.join(outputRoot, file),
      bundle.constructs.filter((construct) =>
        role === "specialist"
          ? construct.scope === "specialist"
          : construct.scope === "root" && construct.role === role,
      ),
    );
  }
  writeJson(
    path.join(outputRoot, files.items.core),
    bundle.items.filter((item) => item.role === "core"),
  );
  writeJson(
    path.join(outputRoot, files.items.specialist),
    bundle.items.filter((item) => item.role === "specialist"),
  );
  writeJson(path.join(outputRoot, files.profiles.primary), bundle.profiles);
  writeJson(path.join(outputRoot, files.profiles.modifiers), bundle.modifiers);
  writeJson(path.join(outputRoot, files.profiles.specialists), bundle.specialists);
  writeJson(path.join(outputRoot, files.specialists.modules), bundle.specialistModules);
  writeJson(path.join(outputRoot, files.specialists.candidates), bundle.specialistCandidates);
  writeJson(path.join(outputRoot, files.specialists.assignment), bundle.specialistAssignment);
  writeJson(path.join(outputRoot, files.ontology.nodes), bundle.ontologyNodes);
  writeJson(path.join(outputRoot, files.ontology.relations), bundle.ontologyRelations);
  writeJson(path.join(outputRoot, files.provenance.sources), bundle.provenanceSources);
  writeJson(path.join(outputRoot, "manifest.json"), {
    manifestVersion: "v2-content-source-manifest-1",
    metadata: bundle.metadata,
    files,
    extraction: {
      authority: sourceArtifact,
      sourceCommit,
      methodologyCommit,
      extractionVersion,
      generatedCounts: bundle.metadata.counts,
    },
  });
}

const source = readJson(sourceManifestPath);
const domains = await loadNamedTypeScriptExport(domainSourcePath, "domains");
const assignment = extractAssignmentConfig(specialistSourcePath);
const bundle = buildBundle(source, domains, assignment);
writeSourceTree(bundle);
console.log(
  JSON.stringify(
    {
      outputRoot: path.relative(root, outputRoot),
      fingerprint: bundle.metadata.contentFingerprint,
      counts: bundle.metadata.counts,
    },
    null,
    2,
  ),
);
