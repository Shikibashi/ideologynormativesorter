#!/usr/bin/env node

/**
 * Copy an external canonical contract manifest into the checked-in vector
 * artifact. Canonicalization remains solely in src/domain/canonicalSerialization.ts;
 * this script intentionally does not reimplement those rules.
 */

import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkedInArtifact = resolve(
  root,
  "tests/fixtures/canonical-serialization/canonical-json-v1.json",
);
const sourceManifestRelative = "src/domain/canonicalManifest.ts";
const sourceManifestPath = resolve(root, sourceManifestRelative);
const canonicalDataPath = resolve(root, "src/domain/canonicalData.ts");
const defaultManifestCandidates = [
  resolve(root, "canonical/canonical-json-v1.manifest.json"),
  resolve(root, "canonical-json-v1.manifest.json"),
  resolve(
    root,
    "tests/fixtures/canonical-serialization/canonical-json-v1.manifest.json",
  ),
];

function usage() {
  return [
    "Usage: node scripts/generate-canonical-contract.mjs [--manifest path] [--output path]",
    "A manifest is optional only when the checked-in artifact carries a matching source-manifest hash.",
  ].join("\n");
}

function parseArguments(argv) {
  let manifest;
  let output = checkedInArtifact;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (argument === "--manifest") {
      manifest = argv[++index];
      if (!manifest) throw new Error("--manifest requires a path");
      continue;
    }
    if (argument === "--output") {
      output = argv[++index];
      if (!output) throw new Error("--output requires a path");
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return {
    manifest: manifest ? resolve(root, manifest) : undefined,
    output: resolve(root, output),
  };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function skipWhitespace(text, index) {
  while (/[\u0020\u0009\u000a\u000d]/u.test(text[index] ?? "")) index += 1;
  return index;
}

function scanString(text, start) {
  let index = start + 1;
  while (index < text.length) {
    const code = text.charCodeAt(index);
    if (code === 0x22) return index + 1;
    if (code === 0x5c) index += 2;
    else index += 1;
  }
  throw new Error(`Unterminated JSON string at offset ${start}`);
}

function scanValue(text, start) {
  const index = skipWhitespace(text, start);
  const character = text[index];
  if (character === '"') return scanString(text, index);
  if (character === "{") return scanObject(text, index);
  if (character === "[") {
    let cursor = skipWhitespace(text, index + 1);
    if (text[cursor] === "]") return cursor + 1;
    while (true) {
      cursor = scanValue(text, cursor);
      cursor = skipWhitespace(text, cursor);
      if (text[cursor] === "]") return cursor + 1;
      if (text[cursor] !== ",")
        throw new Error(`Expected ',' at offset ${cursor}`);
      cursor = skipWhitespace(text, cursor + 1);
    }
  }
  let cursor = index;
  while (cursor < text.length && !",]}".includes(text[cursor])) cursor += 1;
  return cursor;
}

function scanObject(text, start) {
  let cursor = skipWhitespace(text, start + 1);
  const keys = new Set();
  if (text[cursor] === "}") return cursor + 1;
  while (true) {
    if (text[cursor] !== '"')
      throw new Error(`Expected object key at offset ${cursor}`);
    const keyEnd = scanString(text, cursor);
    const key = JSON.parse(text.slice(cursor, keyEnd)).normalize("NFC");
    if (keys.has(key)) throw new Error(`Duplicate object key: ${key}`);
    keys.add(key);
    cursor = skipWhitespace(text, keyEnd);
    if (text[cursor] !== ":")
      throw new Error(`Expected ':' at offset ${cursor}`);
    cursor = scanValue(text, cursor + 1);
    cursor = skipWhitespace(text, cursor);
    if (text[cursor] === "}") return cursor + 1;
    if (text[cursor] !== ",")
      throw new Error(`Expected ',' at offset ${cursor}`);
    cursor = skipWhitespace(text, cursor + 1);
  }
}

function parseManifest(text, sourcePath) {
  // Scan before JSON.parse so duplicate keys are rejected before object
  // creation. JSON.parse then remains the syntax/primitive validator.
  const end = scanValue(text, 0);
  if (skipWhitespace(text, end) !== text.length) {
    throw new Error(`Trailing data in ${sourcePath}`);
  }
  return JSON.parse(text);
}

function isRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function consistent(values, label) {
  const present = values.filter((value) => value !== undefined);
  const unique = [...new Set(present)];
  if (unique.length > 1)
    throw new Error(`${label} contains conflicting values`);
  return present[0];
}

function sourceField(source, field) {
  const match =
    source.match(
      new RegExp(`export const ${field}\\s*=\\s*["']([^"']+)["']`),
    ) ?? source.match(new RegExp(`["']${field}["']\\s*:\\s*["']([^"']+)["']`));
  if (!match) throw new Error(`Canonical source is missing ${field}`);
  return match[1];
}

async function assertSourceManifestHash(value, label) {
  if (!isRecord(value)) throw new Error(`${label} must be a JSON object`);
  if (value.sourceManifest !== sourceManifestRelative) {
    throw new Error(
      `${label} must declare sourceManifest=${sourceManifestRelative}`,
    );
  }
  if (
    typeof value.sourceManifestSha256 !== "string" ||
    !/^[0-9a-f]{64}$/u.test(value.sourceManifestSha256)
  ) {
    throw new Error(`${label} must declare sourceManifestSha256`);
  }
  const source = await readFile(sourceManifestPath);
  const actual = createHash("sha256").update(source).digest("hex");
  if (value.sourceManifestSha256 !== actual) {
    throw new Error(
      `${label} sourceManifestSha256 does not match ${sourceManifestRelative}`,
    );
  }

  const hasManifestBinding =
    value.manifest !== undefined ||
    value.manifestVersion !== undefined ||
    value.manifestSchemaVersion !== undefined ||
    value.manifestFingerprint !== undefined ||
    value.canonicalManifestFingerprint !== undefined;
  if (!hasManifestBinding) return;

  const metadata = isRecord(value.metadata) ? value.metadata : {};
  const manifest = isRecord(value.manifest) ? value.manifest : {};
  const manifestMetadata = isRecord(manifest.metadata) ? manifest.metadata : {};
  const sourceText = await readFile(sourceManifestPath, "utf8");
  const expectedSchema = sourceField(
    sourceText,
    "CANONICAL_MANIFEST_SCHEMA_VERSION",
  );
  const expectedVersion = sourceField(sourceText, "CANONICAL_MANIFEST_VERSION");
  const expectedFingerprint = sourceField(
    await readFile(canonicalDataPath, "utf8"),
    "fingerprint",
  );
  const actualSchema = consistent(
    [
      value.manifestSchemaVersion,
      metadata.manifestSchemaVersion,
      manifest.manifestSchemaVersion,
      manifest.schemaVersion,
      manifestMetadata.schemaVersion,
    ],
    "manifest schema version",
  );
  const actualVersion = consistent(
    [
      value.manifestVersion,
      metadata.manifestVersion,
      manifest.manifestVersion,
      manifest.version,
      manifestMetadata.version,
    ],
    "manifest version",
  );
  const actualFingerprint = consistent(
    [
      value.manifestFingerprint,
      value.canonicalManifestFingerprint,
      metadata.manifestFingerprint,
      metadata.canonicalManifestFingerprint,
      manifest.manifestFingerprint,
      manifest.canonicalManifestFingerprint,
      manifest.fingerprint,
      manifestMetadata.fingerprint,
    ],
    "manifest fingerprint",
  );
  if (
    actualSchema !== expectedSchema ||
    actualVersion !== expectedVersion ||
    actualFingerprint !== expectedFingerprint
  ) {
    throw new Error(
      `${label} manifest metadata does not match the canonical source`,
    );
  }
}
async function main() {
  const { manifest: requestedManifest, output } = parseArguments(
    process.argv.slice(2),
  );
  const manifest =
    requestedManifest ??
    (await (async () => {
      for (const candidate of defaultManifestCandidates) {
        if (await exists(candidate)) return candidate;
      }
      return undefined;
    })());

  if (manifest === undefined) {
    const artifactSource = await readFile(checkedInArtifact, "utf8");
    const artifact = parseManifest(artifactSource, checkedInArtifact);
    await assertSourceManifestHash(artifact, checkedInArtifact);
    console.log(relative(root, output));
    return;
  }
  if (!(await exists(manifest))) {
    throw new Error(`Canonical manifest not found: ${manifest}`);
  }

  const source = await readFile(manifest, "utf8");
  const value = parseManifest(source, manifest);
  await assertSourceManifestHash(value, manifest);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  console.log(relative(root, output));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
