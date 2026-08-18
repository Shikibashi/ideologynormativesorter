import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const VERSIONED_METADATA_KEYS = Object.freeze([
  "contractVersion",
  "manifestSchemaVersion",
  "manifestVersion",
  "manifestFingerprint",
  "serializationVersion",
  "serializationFingerprint",
  "schemaContractVersion",
  "schemaFingerprint",
  "cohortVersion",
  "cohortFingerprint",
  "sourceManifestSha256",
  "payloadSha256",
  "schemaVersion",
  "taxonomyVersion",
  "scoringVersion",
  "bankVersion",
  "formVersion",
  "qualityRuleVersion",
  "registryVersion",
  "profileVersion",
  "resultVersion",
]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function shouldIgnoreKey(key, allowed) {
  return allowed.has(key);
}

function compareValues(oldValue, newValue, path, differences, allowed) {
  if (shouldIgnoreKey(path.at(-1) ?? "", allowed)) return;
  if (Array.isArray(oldValue) || Array.isArray(newValue)) {
    if (!Array.isArray(oldValue) || !Array.isArray(newValue)) {
      differences.push({ path, old: oldValue, new: newValue, reason: "type" });
      return;
    }
    if (oldValue.length !== newValue.length) {
      differences.push({
        path: `${path}.length`,
        old: oldValue.length,
        new: newValue.length,
        reason: "length",
      });
    }
    const length = Math.max(oldValue.length, newValue.length);
    for (let index = 0; index < length; index += 1)
      compareValues(
        oldValue[index],
        newValue[index],
        `${path}[${index}]`,
        differences,
        allowed,
      );
    return;
  }
  if (isRecord(oldValue) || isRecord(newValue)) {
    if (!isRecord(oldValue) || !isRecord(newValue)) {
      differences.push({ path, old: oldValue, new: newValue, reason: "type" });
      return;
    }
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of [...keys].sort()) {
      if (shouldIgnoreKey(key, allowed)) continue;
      if (!(key in oldValue) || !(key in newValue)) {
        differences.push({
          path: `${path}.${key}`,
          old: oldValue[key],
          new: newValue[key],
          reason: "missing",
        });
      } else {
        compareValues(
          oldValue[key],
          newValue[key],
          `${path}.${key}`,
          differences,
          allowed,
        );
      }
    }
    return;
  }
  if (!Object.is(oldValue, newValue))
    differences.push({ path, old: oldValue, new: newValue, reason: "value" });
}

export function comparePublicResults(oldValue, newValue, options = {}) {
  const allowed = new Set([
    ...VERSIONED_METADATA_KEYS,
    ...(options.allowMetadata ?? options.allowedMetadata ?? []),
  ]);
  const differences = [];
  compareValues(oldValue, newValue, "$", differences, allowed);
  return {
    equal: differences.length === 0,
    differences,
    ignoredMetadata: [...allowed].sort(),
  };
}

export function assertNoPublicDrift(oldValue, newValue, options = {}) {
  const report = comparePublicResults(oldValue, newValue, options);
  if (!report.equal) {
    const details = report.differences
      .slice(0, 8)
      .map((difference) => `${difference.path} (${difference.reason})`)
      .join(", ");
    throw new Error(`Public result drift detected: ${details}`);
  }
  return report;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (!token.startsWith("--"))
      throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2).replaceAll("-", "_");
    const value = argv[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for --${key.replaceAll("_", "-")}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

function requiredPath(args) {
  const oldPath = args.old ?? args.old_fixture;
  const newPath = args.new ?? args.new_fixture;
  if (!oldPath || !newPath)
    throw new Error("Both --old and --new fixture paths are required");
  return { oldPath, newPath };
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    if (args.help) {
      console.log(
        "Usage: node scripts/side-by-side-replay.mjs --old FILE --new FILE [--allow-metadata key,key]",
      );
      return 0;
    }
    const paths = requiredPath(args);
    const [oldText, newText] = await Promise.all([
      readFile(paths.oldPath, "utf8"),
      readFile(paths.newPath, "utf8"),
    ]);
    let oldValue;
    let newValue;
    try {
      oldValue = JSON.parse(oldText);
      newValue = JSON.parse(newText);
    } catch {
      throw new Error("Replay fixtures must contain valid JSON");
    }
    const allowMetadata = args.allow_metadata
      ? args.allow_metadata
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];
    const report = assertNoPublicDrift(oldValue, newValue, { allowMetadata });
    console.log(JSON.stringify(report, null, 2));
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await main();
}
