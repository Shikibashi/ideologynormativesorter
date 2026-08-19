import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const args = ["d1", "migrations", "apply", "RESEARCH_DB", "--local", "--persist-to", "v2/.local-d1", "--config", "v2/research-worker/wrangler.local.jsonc"];
const result = await run("npx", ["wrangler", ...args], { cwd: new URL("../../", import.meta.url), maxBuffer: 10 * 1024 * 1024 });
console.log(result.stdout.trim());
console.log("Local v2 research D1 migration applied.");
