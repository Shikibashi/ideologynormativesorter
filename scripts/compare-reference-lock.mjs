#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import zlib from "node:zlib";
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
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const TRACKED_LOCK_METADATA = new Set([
  "manifest.json",
  "cases.json",
  "SHA256SUMS",
]);

function fail(message) {
  throw new Error(`reference-lock compare: ${message}`);
}

function usage() {
  return [
    "Usage: node scripts/compare-reference-lock.mjs --baseline <dir> --actual <dir> [options]",
    "",
    "Required:",
    "  --baseline <dir>  Existing, approved baseline directory.",
    "  --actual <dir>    Replay output directory to compare.",
    "",
    "Options:",
    "  --manifest <file> Manifest JSON (default: docs/clean-rebuild/reference-lock/manifest.json).",
    "  --cases <file>    Cases JSON (default: docs/clean-rebuild/reference-lock/cases.json).",
    "  --help            Show this help.",
    "",
    "Different PNGs are decoded and compared after explicit masks. The unmasked pixel",
    "difference ratio must be <= the manifest's 0.001 (0.1%) threshold. Unsupported",
    "image encodings fail closed; no visual-parity claim is made for metadata-only locks.",
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
function jsonWhitespace(text, index) {
  while (/[\u0020\u0009\u000a\u000d]/u.test(text[index] ?? "")) index += 1;
  return index;
}

function jsonString(text, start) {
  let index = start + 1;
  while (index < text.length) {
    const code = text.charCodeAt(index);
    if (code === 0x22) return index + 1;
    index += code === 0x5c ? 2 : 1;
  }
  throw new Error(`unterminated string at offset ${start}`);
}

function jsonValue(text, start) {
  const index = jsonWhitespace(text, start);
  if (text[index] === '"') return jsonString(text, index);
  if (text[index] === "{") return jsonObject(text, index);
  if (text[index] === "[") {
    let cursor = jsonWhitespace(text, index + 1);
    if (text[cursor] === "]") return cursor + 1;
    while (true) {
      cursor = jsonValue(text, cursor);
      cursor = jsonWhitespace(text, cursor);
      if (text[cursor] === "]") return cursor + 1;
      if (text[cursor] !== ",")
        throw new Error(`expected ',' at offset ${cursor}`);
      cursor = jsonWhitespace(text, cursor + 1);
    }
  }
  let cursor = index;
  while (cursor < text.length && !",]}".includes(text[cursor])) cursor += 1;
  return cursor;
}

function jsonObject(text, start) {
  let cursor = jsonWhitespace(text, start + 1);
  const keys = new Set();
  if (text[cursor] === "}") return cursor + 1;
  while (true) {
    if (text[cursor] !== '"')
      throw new Error(`expected object key at offset ${cursor}`);
    const end = jsonString(text, cursor);
    const key = JSON.parse(text.slice(cursor, end)).normalize("NFC");
    if (keys.has(key)) throw new Error(`duplicate object key: ${key}`);
    keys.add(key);
    cursor = jsonWhitespace(text, end);
    if (text[cursor] !== ":")
      throw new Error(`expected ':' at offset ${cursor}`);
    cursor = jsonValue(text, cursor + 1);
    cursor = jsonWhitespace(text, cursor);
    if (text[cursor] === "}") return cursor + 1;
    if (text[cursor] !== ",")
      throw new Error(`expected ',' at offset ${cursor}`);
    cursor = jsonWhitespace(text, cursor + 1);
  }
}

function parseStrictJson(text, label) {
  try {
    const end = jsonValue(text, 0);
    if (jsonWhitespace(text, end) !== text.length)
      throw new Error("trailing data");
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON without duplicate keys: ${error.message}`);
  }
}

async function readJson(file, label) {
  let text;
  try {
    text = await fs.readFile(file, "utf8");
  } catch (error) {
    fail(`cannot read ${label} ${file}: ${error.message}`);
  }
  return parseStrictJson(text, label);
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
  if (!Array.isArray(cases.cases)) fail("cases.cases must be an array");
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
    if (!artifact || typeof artifact !== "object")
      fail("invalid metadata artifact");
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
      if (entry.isSymbolicLink())
        fail(`symbolic links are not permitted (${childRelative})`);
      if (entry.isDirectory()) await visit(child, childRelative);
      else if (entry.isFile())
        files.push(assertSafeRelative(childRelative, "directory entry"));
      else fail(`unsupported filesystem entry (${childRelative})`);
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
    fail("baseline and actual paths must be distinct");
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

function maskRectangles(manifest, relativeFile) {
  const masks = manifest.maskedDiffPolicy?.masks ?? [];
  if (!Array.isArray(masks)) fail("maskedDiffPolicy.masks must be an array");
  const rectangles = [];
  for (const mask of masks) {
    if (!mask || typeof mask !== "object") fail("every mask must be an object");
    if (mask.path !== relativeFile) continue;
    if (!Array.isArray(mask.rectangles))
      fail(`mask for ${relativeFile} requires rectangles`);
    for (const rectangle of mask.rectangles) {
      if (!rectangle || typeof rectangle !== "object")
        fail(`invalid mask rectangle for ${relativeFile}`);
      const values = [
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height,
      ];
      if (values.some((value) => !Number.isInteger(value) || value < 0)) {
        fail(
          `mask rectangle for ${relativeFile} must use non-negative integer coordinates`,
        );
      }
      rectangles.push(rectangle);
    }
  }
  return rectangles;
}

function pngDecode(buffer, relativeFile) {
  if (
    buffer.length < PNG_SIGNATURE.length ||
    !buffer.subarray(0, 8).equals(PNG_SIGNATURE)
  ) {
    fail(`declared PNG ${relativeFile} has an invalid signature`);
  }
  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  let interlace;
  const idat = [];
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > buffer.length) fail(`truncated PNG ${relativeFile}`);
    const data = buffer.subarray(start, end);
    offset = end + 4;
    if (type === "IHDR") {
      if (length !== 13) fail(`invalid PNG IHDR in ${relativeFile}`);
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }
  if (!width || !height || !idat.length)
    fail(`PNG ${relativeFile} lacks dimensions or image data`);
  if (
    bitDepth !== 8 ||
    (colorType !== 2 && colorType !== 6) ||
    interlace !== 0
  ) {
    fail(
      `PNG ${relativeFile} must be non-interlaced 8-bit RGB/RGBA for comparison`,
    );
  }
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  let inflated;
  try {
    inflated = zlib.inflateSync(Buffer.concat(idat));
  } catch (error) {
    fail(`cannot inflate PNG ${relativeFile}: ${error.message}`);
  }
  const expectedLength = height * (stride + 1);
  if (inflated.length !== expectedLength)
    fail(`unexpected PNG data length in ${relativeFile}`);
  const pixels = Buffer.alloc(height * stride);
  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const rowStart = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[sourceOffset + x];
      const left = x >= channels ? pixels[rowStart + x - channels] : 0;
      const above = y > 0 ? pixels[rowStart - stride + x] : 0;
      const aboveLeft =
        y > 0 && x >= channels ? pixels[rowStart - stride + x - channels] : 0;
      let value;
      if (filter === 0) value = raw;
      else if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + above;
      else if (filter === 3) value = raw + Math.floor((left + above) / 2);
      else if (filter === 4) {
        const predictor = left + above - aboveLeft;
        const pa = Math.abs(predictor - left);
        const pb = Math.abs(predictor - above);
        const pc = Math.abs(predictor - aboveLeft);
        value =
          raw + (pa <= pb && pa <= pc ? left : pb <= pc ? above : aboveLeft);
      } else {
        fail(`unsupported PNG filter ${filter} in ${relativeFile}`);
      }
      pixels[rowStart + x] = value & 0xff;
    }
    sourceOffset += stride;
  }
  return { width, height, channels, pixels };
}

function isMasked(rectangles, x, y) {
  return rectangles.some(
    (rectangle) =>
      x >= rectangle.x &&
      y >= rectangle.y &&
      x < rectangle.x + rectangle.width &&
      y < rectangle.y + rectangle.height,
  );
}

function comparePng(baseline, actual, relativeFile, manifest) {
  const before = pngDecode(baseline, relativeFile);
  const after = pngDecode(actual, relativeFile);
  if (
    before.width !== after.width ||
    before.height !== after.height ||
    before.channels !== after.channels
  ) {
    return {
      equal: false,
      reason: `PNG dimensions or channel counts differ (${before.width}x${before.height}/${before.channels} vs ${after.width}x${after.height}/${after.channels})`,
    };
  }
  const rectangles = maskRectangles(manifest, relativeFile);
  let compared = 0;
  let different = 0;
  for (let y = 0; y < before.height; y += 1) {
    for (let x = 0; x < before.width; x += 1) {
      if (isMasked(rectangles, x, y)) continue;
      compared += 1;
      const index = (y * before.width + x) * before.channels;
      for (let channel = 0; channel < before.channels; channel += 1) {
        if (before.pixels[index + channel] !== after.pixels[index + channel]) {
          different += 1;
          break;
        }
      }
    }
  }
  const ratio = compared === 0 ? 0 : different / compared;
  const allowedRatio = manifest.maskedDiffPolicy?.allowedRatio;
  if (
    typeof allowedRatio !== "number" ||
    allowedRatio < 0 ||
    allowedRatio > 1
  ) {
    fail("maskedDiffPolicy.allowedRatio must be a number between 0 and 1");
  }
  return {
    equal: ratio <= allowedRatio,
    ratio,
    different,
    compared,
    reason:
      ratio <= allowedRatio
        ? undefined
        : `unmasked pixel difference ratio ${ratio} exceeds ${allowedRatio}`,
  };
}

function isPng(relativeFile) {
  return relativeFile.toLowerCase().endsWith(".png");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await readJson(options.manifest, "manifest");
  const cases = await readJson(options.cases, "cases");
  if (manifest.schemaVersion !== 1 || cases.schemaVersion !== 1) {
    fail("unsupported lock schema version; expected version 1");
  }
  if (manifest.lockId !== cases.lockId)
    fail("manifest and cases lockId values differ");
  assertDistinctPaths(options.baseline, options.actual);
  const expected = declaredFiles(manifest, cases);
  const baselineFiles = (await listFiles(options.baseline)).filter(
    (file) => !TRACKED_LOCK_METADATA.has(file),
  );
  const actualFiles = await listFiles(options.actual);
  assertExactFiles(baselineFiles, expected, "baseline");
  assertExactFiles(actualFiles, expected, "actual");

  const results = [];
  for (const relativeFile of expected) {
    const baseline = await fs.readFile(
      path.join(options.baseline, relativeFile),
    );
    const actual = await fs.readFile(path.join(options.actual, relativeFile));
    if (baseline.equals(actual)) {
      results.push({
        file: relativeFile,
        equal: true,
        mode: isPng(relativeFile) ? "png-exact" : "byte-exact",
      });
      continue;
    }
    if (!isPng(relativeFile)) {
      fail(
        `content differs for ${relativeFile}; non-image files require byte equality`,
      );
    }
    const comparison = comparePng(baseline, actual, relativeFile, manifest);
    results.push({ file: relativeFile, mode: "png-masked", ...comparison });
    if (!comparison.equal) fail(`${relativeFile}: ${comparison.reason}`);
  }
  console.log(
    JSON.stringify(
      {
        lockId: manifest.lockId,
        baseline: options.baseline,
        actual: options.actual,
        expectedFiles: expected,
        files: results,
        maskedDiffAllowedRatio: manifest.maskedDiffPolicy?.allowedRatio ?? null,
        visualParityClaim: Boolean(manifest.visualParityClaim),
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
