#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/*
 * This guard checks source imports only. It deliberately makes no assumptions
 * about generated adapters, Worker bundles, aliases, or generated contract
 * artifacts being present; those are deployment concerns, not import-DAG
 * authorities.
 */

const SCRIPT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TYPESCRIPT_EXTENSIONS = new Set([".ts", ".tsx"]);
const EXCLUDED_SEGMENT =
  /^(?:test|tests|fixture|fixtures|migration|migrations)$/u;
const TEST_FILE = /(?:\.test|\.spec|\.fixture|\.fixtures)\.(?:ts|tsx)$/u;

const CLEAN_RUNTIME_ROOTS = [
  /^src\/domain\//u,
  /^src\/production\//u,
  /^src\/research\/contractSnapshot\.(?:ts|tsx)$/u,
  /^src\/research\/(?:contract|worker)[^/]*\.(?:ts|tsx)$/u,
  /^src\/worker\//u,
  /^research-worker\/src\//u,
];

const LEGACY_AUTHORITY_NAMES = new Set([
  "axes",
  "domains",
  "effectiveQuestions",
  "labels",
  "questionById",
  "questions",
  "primaryScoringLabels",
  "modifierScoringLabels",
  "PRIMARY_LABEL_IDS",
  "MODIFIER_LABEL_IDS",
  "PRIMARY_MEASUREMENT_VERSION",
  "MODIFIER_MEASUREMENT_VERSION",
  "QUESTION_BANK_VERSION",
  "SPECIALIST_ASSIGNMENT_MODULE_IDS",
  "SPECIALIST_ASSIGNMENT_ROSTER_VERSION",
  "specialistModuleDefinitions",
  "specialistModuleById",
  "responseContributions",
  "mappings",
  "mappingRegistry",
]);

const LEGACY_ROSTER_MODULE = /^src\/specialist(?:\/index)?$/u;
const LEGACY_DATA_MODULE = /^src\/data(?:\/|$)/u;
const MAPPING_AUDIT_MODULE = /^src\/validation\/mappingAudit(?:\/|$)/u;
const LEGACY_RESEARCH_MODULE = /^src\/research(?:\/|$)/u;

function posixPath(value) {
  return value.split(sep).join("/");
}

function relativePath(root, file) {
  return posixPath(relative(root, file));
}

function sourceIsExcluded(filePath) {
  const normalized = posixPath(filePath);
  const segments = normalized.split("/");
  return (
    segments.some((segment) => EXCLUDED_SEGMENT.test(segment)) ||
    TEST_FILE.test(normalized) ||
    normalized.endsWith(".d.ts")
  );
}

function isCleanRuntimeSource(filePath) {
  const normalized = posixPath(filePath);
  return CLEAN_RUNTIME_ROOTS.some((pattern) => pattern.test(normalized));
}
function isRuntimeSource(filePath) {
  const normalized = posixPath(filePath);
  return (
    normalized.startsWith("src/") ||
    normalized.startsWith("research-worker/src/")
  );
}

function listFilesRecursively(root) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_SEGMENT.test(entry.name)) visit(absolute);
        continue;
      }
      if (!entry.isFile() || !TYPESCRIPT_EXTENSIONS.has(extname(entry.name)))
        continue;
      files.push(absolute);
    }
  };
  visit(root);
  return files;
}

function trackedFiles(root) {
  const result = spawnSync(
    "git",
    ["-C", root, "ls-files", "-z", "--", "*.ts", "*.tsx"],
    {
      encoding: "utf8",
    },
  );
  if (result.status !== 0) return listFilesRecursively(root);
  return result.stdout
    .split("\0")
    .filter(Boolean)
    .map((file) => resolve(root, file));
}

function stripComments(source) {
  let output = "";
  let state = "normal";
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (state === "line-comment") {
      if (character === "\n") {
        output += character;
        state = "normal";
      } else {
        output += " ";
      }
      continue;
    }
    if (state === "block-comment") {
      if (character === "*" && next === "/") {
        output += "  ";
        index += 1;
        state = "normal";
      } else {
        output += character === "\n" ? "\n" : " ";
      }
      continue;
    }
    if (
      state === "single-quote" ||
      state === "double-quote" ||
      state === "template"
    ) {
      output += character;
      if (character === "\\") {
        output += next ?? "";
        index += 1;
      } else if (
        (state === "single-quote" && character === "'") ||
        (state === "double-quote" && character === '"') ||
        (state === "template" && character === "`")
      ) {
        state = "normal";
      }
      continue;
    }
    if (character === "/" && next === "/") {
      output += "  ";
      index += 1;
      state = "line-comment";
      continue;
    }
    if (character === "/" && next === "*") {
      output += "  ";
      index += 1;
      state = "block-comment";
      continue;
    }
    output += character;
    if (character === "'") state = "single-quote";
    else if (character === '"') state = "double-quote";
    else if (character === "`") state = "template";
  }
  return output;
}

function lineAndColumn(source, offset) {
  const before = source.slice(0, offset);
  const line = before.split("\n").length;
  const lastNewline = before.lastIndexOf("\n");
  return { line, column: offset - lastNewline };
}

function importedNames(clause) {
  const braces = clause.match(/\{([\s\S]*?)\}/u)?.[1];
  if (!braces) return [];
  return braces
    .split(",")
    .map((part) =>
      part
        .trim()
        .split(/\s+as\s+/u)[0]
        ?.trim(),
    )
    .filter(Boolean);
}

function importRecords(source) {
  const commentFree = stripComments(source);
  const records = [];
  const seen = new Set();

  const add = (offset, specifier, clause = "") => {
    const key = `${offset}:${specifier}`;
    if (seen.has(key)) return;
    seen.add(key);
    records.push({ offset, specifier, names: importedNames(clause) });
  };

  const fromPattern =
    /\b(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*(["'])([^"']+)\2/gu;
  for (const match of commentFree.matchAll(fromPattern)) {
    add(match.index ?? 0, match[3], match[1]);
  }

  const sideEffectPattern = /\bimport\s*(["'])([^"']+)\1/gu;
  for (const match of commentFree.matchAll(sideEffectPattern)) {
    add(match.index ?? 0, match[2]);
  }

  const dynamicPattern = /\bimport\s*\(\s*(["'])([^"']+)\1\s*\)/gu;
  for (const match of commentFree.matchAll(dynamicPattern)) {
    add(match.index ?? 0, match[2]);
  }

  const requirePattern = /\brequire\s*\(\s*(["'])([^"']+)\1\s*\)/gu;
  for (const match of commentFree.matchAll(requirePattern)) {
    add(match.index ?? 0, match[2]);
  }

  return records.sort((left, right) => left.offset - right.offset);
}

function resolveModulePath(root, sourceFile, specifier) {
  const cleanSpecifier = specifier.split("?")[0].split("#")[0];
  let candidate;
  if (cleanSpecifier.startsWith(".")) {
    candidate = resolve(dirname(sourceFile), cleanSpecifier);
  } else if (cleanSpecifier.startsWith("@/")) {
    candidate = resolve(root, "src", cleanSpecifier.slice(2));
  } else if (cleanSpecifier.startsWith("src/")) {
    candidate = resolve(root, cleanSpecifier);
  } else {
    return null;
  }
  return relativePath(root, candidate).replace(/\.(?:ts|tsx|js|jsx|mjs)$/u, "");
}

function authorityKind(target, names) {
  if (target && LEGACY_DATA_MODULE.test(target)) return "legacy-data-import";
  if (target && MAPPING_AUDIT_MODULE.test(target))
    return "mapping-audit-import";
  if (target && LEGACY_ROSTER_MODULE.test(target))
    return "duplicate-roster-import";
  if (
    target &&
    !target.startsWith("src/domain/") &&
    (LEGACY_RESEARCH_MODULE.test(target) ||
      LEGACY_ROSTER_MODULE.test(target) ||
      LEGACY_DATA_MODULE.test(target) ||
      MAPPING_AUDIT_MODULE.test(target)) &&
    names.some((name) => LEGACY_AUTHORITY_NAMES.has(name))
  ) {
    return "duplicate-roster-or-mapping-import";
  }
  return null;
}

function duplicateDefinition(source) {
  const declaration =
    /\b(?:export\s+)?(?:const|let|var)\s+(SPECIALIST_ASSIGNMENT_MODULE_IDS|SPECIALIST_ASSIGNMENT_ROSTER_VERSION|PRIMARY_LABEL_IDS|MODIFIER_LABEL_IDS|MAPPINGS|MAPPING_REGISTRY|ROSTER|ROSTER_IDS|AXIS_WEIGHTS|CONSTRUCT_WEIGHTS|QUESTION_WEIGHTS|duplicateRoster|duplicateMappings?)\b/gu.exec(
      source,
    );
  return declaration ? declaration.index : null;
}

function finding({ file, source, offset, kind, specifier, message, severity }) {
  const location = lineAndColumn(source, offset);
  return {
    file,
    line: location.line,
    column: location.column,
    kind,
    severity,
    ...(specifier ? { specifier } : {}),
    message,
  };
}

export function scanCanonicalImports({
  root = SCRIPT_ROOT,
  files = null,
} = {}) {
  const absoluteRoot = resolve(root);
  const candidates = (files ?? trackedFiles(absoluteRoot))
    .map((file) => resolve(absoluteRoot, file))
    .filter((file, index, all) => all.indexOf(file) === index)
    .filter((file) => TYPESCRIPT_EXTENSIONS.has(extname(file)))
    .filter((file) => isRuntimeSource(relativePath(absoluteRoot, file)))
    .filter((file) => !sourceIsExcluded(relativePath(absoluteRoot, file)))
    .sort((left, right) =>
      relativePath(absoluteRoot, left).localeCompare(
        relativePath(absoluteRoot, right),
      ),
    );

  const diagnostics = [];
  for (const sourceFile of candidates) {
    if (!existsSync(sourceFile) || !statSync(sourceFile).isFile()) continue;
    const source = readFileSync(sourceFile, "utf8");
    const file = relativePath(absoluteRoot, sourceFile);
    const cleanRuntime = isCleanRuntimeSource(file);
    for (const record of importRecords(source)) {
      const target = resolveModulePath(
        absoluteRoot,
        sourceFile,
        record.specifier,
      );
      const kind = authorityKind(target, record.names);
      if (!kind) continue;
      diagnostics.push(
        finding({
          file,
          source,
          offset: record.offset,
          kind,
          specifier: record.specifier,
          severity: cleanRuntime ? "error" : "baseline",
          message: cleanRuntime
            ? `Clean runtime source imports forbidden legacy authority; use src/domain/registry: ${record.specifier}`
            : `Baseline legacy-authority import retained outside clean runtime roots: ${record.specifier}`,
        }),
      );
    }
    if (cleanRuntime) {
      const duplicateOffset = duplicateDefinition(stripComments(source));
      if (duplicateOffset !== null) {
        diagnostics.push(
          finding({
            file,
            source,
            offset: duplicateOffset,
            kind: "duplicate-roster-or-mapping-definition",
            severity: "error",
            message:
              "Clean runtime source declares a roster or mapping authority; use src/domain/registry instead",
          }),
        );
      }
    }
  }

  diagnostics.sort((left, right) =>
    [left.file, left.line, left.column, left.kind, left.specifier ?? ""]
      .join("\0")
      .localeCompare(
        [
          right.file,
          right.line,
          right.column,
          right.kind,
          right.specifier ?? "",
        ].join("\0"),
      ),
  );
  const violations = diagnostics.filter((entry) => entry.severity === "error");
  return {
    root: absoluteRoot,
    files: candidates.map((file) => relativePath(absoluteRoot, file)),
    diagnostics,
    violations,
    ok: violations.length === 0,
  };
}

function parseArguments(argv) {
  const options = { check: false, root: SCRIPT_ROOT, files: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--root") {
      const value = argv[++index];
      if (!value) throw new Error("--root requires a directory");
      options.root = resolve(value);
    } else if (argument === "--file") {
      const value = argv[++index];
      if (!value) throw new Error("--file requires a path");
      options.files ??= [];
      options.files.push(value);
    } else if (argument === "--help" || argument === "-h") {
      console.log(
        "Usage: node scripts/check-canonical-imports.mjs [--check] [--root DIR] [--file PATH]",
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

export function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArguments(argv);
    const report = scanCanonicalImports(options);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (options.check && !report.ok) process.exitCode = 1;
    return report;
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 2;
    return null;
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main();
