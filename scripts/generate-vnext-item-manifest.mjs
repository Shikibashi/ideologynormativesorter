import fs from "node:fs";
import prettier from "prettier";

const auditPath = "docs/full-effective-item-audit-2026-08.md";
const outputPath = "src/data/vnextItemAnnotations.ts";
const text = fs.readFileSync(auditPath, "utf8");
const lines = text.split(/\r?\n/);
const itemPattern = /^(?:q\d{4}|sq\d+|fm-[a-z]+-\d+)$/;
const directionTokenPattern = /^([+\-−])?\s*([a-z][a-z0-9-]*)$/;

function fields(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((field) => field.trim());
}

function parseSemanticDirection(direction) {
  return direction
    .split(";")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const match = directionTokenPattern.exec(token.replaceAll("−", "-"));
      if (!match)
        throw new Error(`Malformed semantic-direction token: ${token}`);
      return {
        sign: match[1] === "-" ? "−" : (match[1] ?? "+"),
        rootId: match[2],
      };
    });
}

function rootsFromDirection(direction) {
  return [
    ...new Set(parseSemanticDirection(direction).map((entry) => entry.rootId)),
  ];
}

function tokens(value) {
  return value
    .split(/[;,]/)
    .map((token) => token.trim())
    .filter(Boolean);
}

const LEGACY_FACET_ALIASES = {
  "regulation.scope": "regulation.domain",
  "regulation.domain-specific": "regulation.domain",
  "market.alternative": "market.alternative",
  "market-alternative": "market.alternative",
  domination: "domination.arbitrariness",
  legitimacy: "authority.source",
  theory: "equality.formal-status",
  "community-boundary": "community.moral-scope",
  traditionalism: "tradition.inherited-authority",
  "nature-priority": "ecology.intrinsic-standing",
};

function canonicalFacetId(facetId) {
  return LEGACY_FACET_ALIASES[facetId] ?? facetId;
}

const OPTION_FACET_BY_ROOT = {
  "authority-legitimacy": "authority.source",
  "property-legitimacy": "property.control-v-title",
  "liberty-noninterference": "liberty.noninterference",
  "equality-theory": "equality.formal-status",
  "political-community-boundary": "community.moral-scope",
  "moral-traditionalism": "tradition.inherited-authority",
  "anti-domination": "domination.contestability",
  "human-nature-priority": "ecology.intrinsic-standing",
  "militarism-pacifism": "force.justification",
  "secularism-religious": "religion.state-neutrality",
  "market-process-confidence": "market.information",
  "state-capacity-confidence": "state.implementation",
  "public-choice-skepticism": "public-choice.capture",
  "democratic-confidence": "democracy.aggregation",
  "expert-confidence": "expert.competence",
  "cultural-plasticity": "culture.policy-malleability",
  "coordination-optimism": "coordination.trust",
  "centralization-preference": "centralization.level",
  "reform-vs-revolution": "change.transition",
  "gradualism-vs-immediatism": "pace.sequencing",
  "state-action-vs-exit": "remedy.state-provision",
  "electoralism-vs-direct-action": "strategy.electoral",
  "compromise-vs-persistence": "bargaining.partial-gain",
  "coercion-strategy": "coercion.threshold",
  "regulation-vs-deregulation": "regulation.domain",
  "redistribution-vs-predistribution": "distribution.transfer",
};

const rows = [];
let inItemRegister = false;
let inOptionAudit = false;
const optionsByItem = new Map();

for (const line of lines) {
  if (line.startsWith("## Complete item-level register")) {
    inItemRegister = true;
    inOptionAudit = false;
    continue;
  }
  if (line.startsWith("## Statement-choice option audit")) {
    inItemRegister = false;
    inOptionAudit = true;
    continue;
  }
  if (
    line.startsWith("## ") &&
    !line.startsWith("## Complete item-level register")
  ) {
    inItemRegister = false;
    inOptionAudit = false;
  }
  if (inItemRegister) {
    const row = fields(line);
    if (itemPattern.test(row[0] ?? "") && row.length >= 15) {
      const [
        itemId,
        surface,
        domainId,
        layer,
        ,
        intendedRoot,
        facetField,
        direction,
        discrimination,
        ,
        flags,
        depth,
        sourceProvenance,
        disposition,
        coverageConsequence,
      ] = row;
      const facetTokens = tokens(facetField);
      const canonicalTokens = facetTokens.map(canonicalFacetId);
      const facetIds = canonicalTokens.filter((token) => token.includes("."));
      const localConstructIds = facetTokens.filter(
        (token) => !canonicalFacetId(token).includes("."),
      );
      const replacementRequired =
        disposition === "rewrite" || disposition === "replace";
      rows.push({
        itemId,
        surface: surface === "core" ? "core" : "specialist",
        ...(surface === "core" ? {} : { moduleId: surface }),
        domainId,
        layer,
        intendedRootIds: [intendedRoot],
        facetIds,
        localConstructIds,
        semanticDirection: direction,
        discrimination,
        riskFlags: flags
          .split(",")
          .map((flag) => flag.trim().replace(/\s+/g, ""))
          .filter(Boolean),
        depth,
        sourceProvenance,
        sourceRecordIds: [
          "full-effective-item-audit-2026-08",
          `full-effective-item-audit-2026-08:${itemId}`,
        ],
        disposition,
        coverageConsequence,
        replacementRequired,
        analysisEligibility:
          surface !== "core"
            ? "specialist-module-only"
            : itemId.startsWith("sq")
              ? "ipsative-only"
              : replacementRequired
                ? "blocked-pending-replacement"
                : "research-only",
      });
    }
  }
  if (inOptionAudit) {
    const row = fields(line);
    if (
      /^sq\d+$/.test(row[0] ?? "") &&
      /^[a-d]$/.test(row[1] ?? "") &&
      row.length >= 4
    ) {
      const [itemId, optionId, optionText, direction] = row;
      const directionRoots = rootsFromDirection(direction);
      const option = {
        optionId,
        text: optionText,
        semanticDirection: direction,
        rootIds: directionRoots,
        facetIds: directionRoots
          .map((rootId) => OPTION_FACET_BY_ROOT[rootId])
          .filter(Boolean),
        localConstructIds: [],
      };
      optionsByItem.set(itemId, [...(optionsByItem.get(itemId) ?? []), option]);
    }
  }
}

for (const row of rows) {
  const options = optionsByItem.get(row.itemId);
  if (options) row.optionRecords = options;
}

const counts = Object.fromEntries(
  [...new Set(rows.map((row) => row.disposition))].map((disposition) => [
    disposition,
    rows.filter((row) => row.disposition === disposition).length,
  ]),
);
const expectedCounts = {
  "empirical review required": 328,
  retain: 49,
  rewrite: 16,
  replace: 10,
  "retain with minor edit": 3,
};
if (rows.length !== 406)
  throw new Error(`Expected 406 audit rows, found ${rows.length}`);
if (
  Object.keys(expectedCounts).some(
    (key) => counts[key] !== expectedCounts[key],
  ) ||
  Object.keys(counts).some((key) => expectedCounts[key] !== counts[key])
) {
  throw new Error(
    `Disposition counts do not match the approved audit: ${JSON.stringify(counts)}`,
  );
}
if (
  optionsByItem.size !== 6 ||
  [...optionsByItem.values()].some((options) => options.length !== 4)
) {
  throw new Error(
    "Statement-choice option audit must contain six four-option records",
  );
}

const output = `// Generated from ${auditPath}; do not hand-edit.\n// I-005 / D-38, D-86-D-90, D-115-D-117.\nimport type { VNextItemAnnotation } from "../types";\nimport { VNEXT_ITEM_ANNOTATIONS_VERSION } from "../validation/vnextVersions";\n\nexport const VNEXT_ITEM_ANNOTATIONS_SOURCE = "${auditPath}" as const;\nexport const vnextItemAnnotationsVersion = VNEXT_ITEM_ANNOTATIONS_VERSION;\nexport const vnextItemAnnotations: readonly VNextItemAnnotation[] = ${JSON.stringify(rows, null, 2)} as const;\n\nexport const vnextItemAnnotationById = new Map(\n  vnextItemAnnotations.map((annotation) => [annotation.itemId, annotation]),\n);\n`;
const formattedOutput = await prettier.format(output, { parser: "typescript" });
const checkOnly = process.argv.includes("--check");
if (checkOnly) {
  const current = fs.readFileSync(outputPath, "utf8");
  if (current !== formattedOutput) {
    console.error(`${outputPath} is not reproducible from ${auditPath}`);
    process.exitCode = 1;
  } else {
    console.log(`Reproducible generated artifact verified: ${outputPath}`);
  }
} else {
  fs.writeFileSync(outputPath, formattedOutput);
}
console.log(`Generated ${rows.length} vNext item annotations at ${outputPath}`);
