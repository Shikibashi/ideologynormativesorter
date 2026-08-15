import { strict as assert } from "node:assert";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  collectorConfigurationErrors,
  REQUIRED_COLLECTOR_FROZEN_ENVIRONMENT,
} from "./server.mjs";

const serverPath = fileURLToPath(new URL("./server.mjs", import.meta.url));

function configuredEnvironment() {
  return Object.fromEntries(
    REQUIRED_COLLECTOR_FROZEN_ENVIRONMENT.map((name) => [
      name,
      name === "ALLOWED_ORIGIN" ? "http://localhost:5173" : "configured",
    ]),
  );
}

function waitForProcess(child, predicate, timeoutMs = 5_000) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Timed out waiting for collector output: ${output}`));
    }, timeoutMs);
    const onOutput = (chunk) => {
      output += chunk.toString();
      if (!predicate(output)) return;
      clearTimeout(timer);
      resolve(output);
    };
    child.stdout.on("data", onOutput);
    child.stderr.on("data", onOutput);
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      if (code !== null && !predicate(output)) {
        clearTimeout(timer);
        reject(new Error(`Collector exited with ${code}: ${output}`));
      }
    });
  });
}

test("collector configuration fails closed when required values are absent", () => {
  const errors = collectorConfigurationErrors({});
  assert.deepEqual(
    errors,
    REQUIRED_COLLECTOR_FROZEN_ENVIRONMENT.map((name) => `${name} is required`),
  );
});

test("collector configuration accepts a complete frozen environment", () => {
  assert.deepEqual(collectorConfigurationErrors(configuredEnvironment()), []);
});

test("collector startup exits before listening with missing frozen configuration", async () => {
  const child = spawn(process.execPath, [serverPath], {
    env: { PATH: process.env.PATH },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = await waitForProcess(child, (value) =>
    value.includes("Collector configuration is incomplete"),
  );
  assert.match(output, /RESEARCH_SCHEMA_VERSION is required/);
  assert.equal(await new Promise((resolve) => child.once("exit", resolve)), 1);
});

test("collector starts with a complete frozen configuration", async () => {
  const directory = await mkdtemp(join(tmpdir(), "research-collector-test-"));
  const environment = {
    ...process.env,
    ...configuredEnvironment(),
    PORT: "0",
    RESEARCH_OUTPUT_FILE: join(directory, "core.ndjson"),
    SPECIALIST_RESEARCH_OUTPUT_FILE: join(directory, "specialist.ndjson"),
    RESEARCH_TASK_OUTPUT_FILE: join(directory, "task.ndjson"),
  };
  const child = spawn(process.execPath, [serverPath], {
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const output = await waitForProcess(child, (value) =>
      value.includes("Research collector listening"),
    );
    assert.match(output, /Research collector listening/);
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
