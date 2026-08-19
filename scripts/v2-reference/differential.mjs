import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "tests/v2-differential"], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
