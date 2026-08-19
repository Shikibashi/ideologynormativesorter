import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const referenceRoot = resolve(root, "v2/reference");
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) return files(absolute);
    const relative = absolute.slice(root.length + 1);
    return relative === "v2/reference/SHA256SUMS" ? [] : [relative];
  });
}
const entries = files(referenceRoot).sort().map((relative) => `${createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex")}  ${relative}`);
writeFileSync(resolve(referenceRoot, "SHA256SUMS"), `${entries.join("\n")}\n`);
console.log(`${entries.length} reference artifacts hashed`);
