import fs from "node:fs";

const auditPath = "docs/full-effective-item-audit-2026-08.md";
const outputPath = "src/data/vnextItemAnnotations.ts";
const text = fs.readFileSync(auditPath, "utf8");
const lines = text.split(/\r?\n/);
const itemPattern = /^(?:q\d{4}|sq\d+|fm-[a-z]+-\d+)$/;
const rootPattern = /[+-]([a-z][a-z0-9-]+)/g;

function fields(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((field) => field.trim());
}

function rootsFromDirection(direction) {
  return [...direction.matchAll(rootPattern)].map((match) => match[1]);
}

function tokens(value) {
  return value
    .split(";")
    .map((token) => token.trim())
    .filter(Boolean);
}

const LEGACY_FACET_ALIASES = {
  "regulation.scope": "regulation.domain",
  "regulation.domain-specific": "regulation.domain",
  "market.alternative": "market-alternative",
};

function canonicalFacetId(facetId) {
  return LEGACY_FACET_ALIASES[facetId] ?? facetId;
}

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
      const facetIds = facetTokens
        .filter((token) => token.includes("."))
        .map(canonicalFacetId);
      const localConstructIds = facetTokens.filter(
        (token) => !token.includes("."),
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
        facetIds: [],
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
fs.writeFileSync(outputPath, output);
console.log(`Generated ${rows.length} vNext item annotations at ${outputPath}`);
