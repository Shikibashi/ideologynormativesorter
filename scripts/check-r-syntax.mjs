import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const analysisDirectory = resolve("analysis");
const entrypoints = (await readdir(analysisDirectory))
  .filter((name) => name.endsWith(".R"))
  .sort()
  .map((name) => resolve(analysisDirectory, name));

if (entrypoints.length === 0) {
  throw new Error("No supported R analysis entrypoints were found.");
}

for (const entrypoint of entrypoints) {
  const result = spawnSync(
    "Rscript",
    ["-e", `invisible(parse(file=${JSON.stringify(entrypoint)}))`],
    { encoding: "utf8" },
  );
  if (result.error?.code === "ENOENT") {
    throw new Error(
      "Rscript is unavailable. Run npm run research:r-syntax in the configured R environment or CI.",
    );
  }
  if (result.status !== 0) {
    throw new Error(
      `R syntax check failed for ${entrypoint}:\n${result.stderr || result.stdout}`,
    );
  }
}

console.log(`Parsed ${entrypoints.length} R files: ${entrypoints.join(", ")}`);
