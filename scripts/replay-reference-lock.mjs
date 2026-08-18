#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_MANIFEST = path.join(
  REPO_ROOT,
  "docs/clean-rebuild/reference-lock/manifest.json",
);
const DEFAULT_CASES = path.join(
  REPO_ROOT,
  "docs/clean-rebuild/reference-lock/cases.json",
);

const TRACKED_LOCK_METADATA = new Set([
  "manifest.json",
  "cases.json",
  "SHA256SUMS",
]);
function fail(message) {
  throw new Error(`reference-lock replay: ${message}`);
}

function usage() {
  return [
    "Usage: node scripts/replay-reference-lock.mjs --baseline <dir> --actual <dir> [options]",
    "",
    "Required:",
    "  --baseline <dir>  Existing, approved baseline directory.",
    "  --actual <dir>    Directory to clean and populate for this replay.",
    "",
    "Options:",
    "  --manifest <file> Manifest JSON (default: docs/clean-rebuild/reference-lock/manifest.json).",
    "  --cases <file>    Cases JSON (default: docs/clean-rebuild/reference-lock/cases.json).",
    "  --help            Show this help.",
  ].join("\n");
}

function parseArgs(argv) {
  const values = {
    baseline: null,
    actual: null,
    manifest: DEFAULT_MANIFEST,
    cases: DEFAULT_CASES,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") {
      console.log(usage());
      process.exit(0);
    }
    if (
      argument !== "--baseline" &&
      argument !== "--baseline-dir" &&
      argument !== "--actual" &&
      argument !== "--actual-dir" &&
      argument !== "--manifest" &&
      argument !== "--cases"
    ) {
      fail(`unknown option ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`${argument} requires a value`);
    }
    index += 1;
    if (argument === "--baseline" || argument === "--baseline-dir") {
      values.baseline = value;
    } else if (argument === "--actual" || argument === "--actual-dir") {
      values.actual = value;
    } else if (argument === "--manifest") {
      values.manifest = path.resolve(value);
    } else {
      values.cases = path.resolve(value);
    }
  }
  if (!values.baseline || !values.actual) {
    fail("--baseline and --actual are required; refusing implicit paths");
  }
  return {
    ...values,
    baseline: path.resolve(values.baseline),
    actual: path.resolve(values.actual),
  };
}

async function readJson(file, label) {
  let text;
  try {
    text = await fs.readFile(file, "utf8");
  } catch (error) {
    fail(`cannot read ${label} ${file}: ${error.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON (${file}): ${error.message}`);
  }
}

function assertSafeRelative(file, label) {
  if (
    typeof file !== "string" ||
    file.length === 0 ||
    path.isAbsolute(file) ||
    file.includes("\\") ||
    file.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    fail(`${label} contains an unsafe relative path: ${String(file)}`);
  }
  return file;
}

function declaredFiles(manifest, cases) {
  const files = new Set();
  const add = (value, label) => files.add(assertSafeRelative(value, label));
  if (manifest.expectedFiles !== undefined) {
    if (!Array.isArray(manifest.expectedFiles)) {
      fail("manifest.expectedFiles must be an array");
    }
    manifest.expectedFiles.forEach((file) =>
      add(file, "manifest.expectedFiles"),
    );
  }
  if (!Array.isArray(cases.cases)) {
    fail("cases.cases must be an array");
  }
  const ids = new Set();
  for (const testCase of cases.cases) {
    if (
      !testCase ||
      typeof testCase !== "object" ||
      typeof testCase.id !== "string" ||
      testCase.id.length === 0 ||
      ids.has(testCase.id)
    ) {
      fail("cases must contain unique, non-empty string ids");
    }
    ids.add(testCase.id);
    if (testCase.expectedFiles !== undefined) {
      if (!Array.isArray(testCase.expectedFiles)) {
        fail(`case ${String(testCase.id)} expectedFiles must be an array`);
      }
      testCase.expectedFiles.forEach((file) =>
        add(file, `case ${String(testCase.id)}.expectedFiles`),
      );
    }
    if (testCase.artifacts !== undefined) {
      if (!Array.isArray(testCase.artifacts)) {
        fail(`case ${String(testCase.id)} artifacts must be an array`);
      }
      for (const artifact of testCase.artifacts) {
        if (!artifact || typeof artifact !== "object") {
          fail(`case ${String(testCase.id)} has an invalid artifact`);
        }
        add(artifact.path, `case ${String(testCase.id)}.artifacts.path`);
      }
    }
  }
  for (const artifact of manifest.metadataArtifacts ?? []) {
    if (!artifact || typeof artifact !== "object") {
      fail("invalid metadata artifact");
    }
    add(artifact.path, "manifest.metadataArtifacts.path");
  }
  return [...files].sort();
}

async function listFiles(root) {
  let stat;
  try {
    stat = await fs.lstat(root);
  } catch (error) {
    if (error.code === "ENOENT") fail(`directory does not exist: ${root}`);
    fail(`cannot inspect directory ${root}: ${error.message}`);
  }
  if (!stat.isDirectory()) fail(`path is not a directory: ${root}`);
  const files = [];
  async function visit(directory, relative = "") {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
      const child = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        fail(`symbolic links are not permitted (${childRelative})`);
      }
      if (entry.isDirectory()) {
        await visit(child, childRelative);
      } else if (entry.isFile()) {
        files.push(assertSafeRelative(childRelative, "directory entry"));
      } else {
        fail(`unsupported filesystem entry (${childRelative})`);
      }
    }
  }
  await visit(root);
  return files.sort();
}

function assertExactFiles(actual, expected, label) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter((file) => !actualSet.has(file));
  const unexpected = actual.filter((file) => !expectedSet.has(file));
  if (missing.length || unexpected.length) {
    const details = [];
    if (missing.length) details.push(`missing: ${missing.join(", ")}`);
    if (unexpected.length)
      details.push(`unexpected/stale: ${unexpected.join(", ")}`);
    fail(`${label} file set does not match the lock (${details.join("; ")})`);
  }
}

function assertDistinctPaths(baseline, actual) {
  if (baseline === actual) {
    fail(
      "baseline and actual paths must be distinct; refusing to delete the baseline",
    );
  }
  const relative = (from, to) => path.relative(from, to);
  if (
    !relative(baseline, actual).startsWith(".." + path.sep) &&
    relative(baseline, actual) !== ".."
  ) {
    fail("actual path must not be inside the baseline path");
  }
  if (
    !relative(actual, baseline).startsWith(".." + path.sep) &&
    relative(actual, baseline) !== ".."
  ) {
    fail("baseline path must not be inside the actual path");
  }
}

function outputEntries(manifest, cases) {
  const entries = [];
  for (const testCase of cases.cases) {
    for (const artifact of testCase.artifacts ?? []) {
      if (artifact.content === undefined) {
        fail(
          `case ${String(testCase.id)} artifact ${artifact.path} has no content`,
        );
      }
      entries.push({
        path: assertSafeRelative(artifact.path, "artifact path"),
        content: artifact.content,
        encoding: artifact.encoding ?? "utf8",
      });
    }
  }
  for (const artifact of manifest.metadataArtifacts ?? []) {
    if (
      !artifact ||
      typeof artifact !== "object" ||
      artifact.content === undefined
    ) {
      fail("manifest.metadataArtifacts entries require path and content");
    }
    entries.push({
      path: assertSafeRelative(artifact.path, "metadata artifact path"),
      content: artifact.content,
      encoding: artifact.encoding ?? "utf8",
    });
  }
  const paths = new Set();
  for (const entry of entries) {
    if (paths.has(entry.path)) fail(`duplicate replay output: ${entry.path}`);
    paths.add(entry.path);
  }
  return entries;
}

function artifactBytes(entry) {
  if (entry.encoding === "json") {
    return Buffer.from(`${JSON.stringify(entry.content)}\n`, "utf8");
  }
  if (entry.encoding !== "utf8" && entry.encoding !== "base64") {
    fail(`unsupported artifact encoding ${entry.encoding}`);
  }
  if (typeof entry.content !== "string") {
    fail(
      `artifact ${entry.path} content must be a string for ${entry.encoding}`,
    );
  }
  return Buffer.from(entry.content, entry.encoding);
}

async function writeOutputs(actual, entries, expected) {
  const expectedSet = new Set(expected);
  for (const entry of entries) {
    if (!expectedSet.has(entry.path)) {
      fail(`replay output ${entry.path} is not declared in expectedFiles`);
    }
    const target = path.join(actual, entry.path);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, artifactBytes(entry));
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await readJson(options.manifest, "manifest");
  const cases = await readJson(options.cases, "cases");
  if (manifest.schemaVersion !== 1 || cases.schemaVersion !== 1) {
    fail("unsupported lock schema version; expected version 1");
  }
  if (manifest.lockId !== cases.lockId) {
    fail("manifest and cases lockId values differ");
  }
  assertDistinctPaths(options.baseline, options.actual);
  const expected = declaredFiles(manifest, cases);
  const baselineFiles = (await listFiles(options.baseline)).filter(
    (file) => !TRACKED_LOCK_METADATA.has(file),
  );
  assertExactFiles(baselineFiles, expected, "baseline");

  await fs.rm(options.actual, { recursive: true, force: true });
  await fs.mkdir(options.actual, { recursive: true });
  await writeOutputs(options.actual, outputEntries(manifest, cases), expected);
  const actualFiles = await listFiles(options.actual);
  assertExactFiles(actualFiles, expected, "replay output");

  console.log(
    JSON.stringify(
      {
        lockId: manifest.lockId,
        cases: cases.cases.length,
        expectedFiles: expected,
        baseline: options.baseline,
        actual: options.actual,
        captureMode: cases.captureMode ?? manifest.capture?.mode ?? "unknown",
        visualParityClaim: false,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
