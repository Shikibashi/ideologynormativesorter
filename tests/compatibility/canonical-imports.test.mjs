import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = join(process.cwd(), "scripts/check-canonical-imports.mjs");

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), "canonical-imports-"));
  mkdirSync(join(root, "src/production"), { recursive: true });
  mkdirSync(join(root, "src/research"), { recursive: true });
  mkdirSync(join(root, "src/data"), { recursive: true });
  mkdirSync(join(root, "src/validation/mappingAudit"), { recursive: true });
  mkdirSync(join(root, "tests/fixtures"), { recursive: true });
  return root;
}

function writeFixture(root, path, source) {
  const destination = join(root, path);
  writeFileSync(destination, source);
}

function runCheck(root) {
  const result = spawnSync(
    process.execPath,
    [script, "--check", "--root", root],
    {
      encoding: "utf8",
    },
  );
  assert.equal(result.stderr, "");
  return { ...result, report: JSON.parse(result.stdout) };
}

test("canonical import guard rejects clean-runtime legacy authorities only", () => {
  const root = fixtureRoot();
  try {
    writeFixture(
      root,
      "src/production/good.ts",
      'import { canonicalRegistry } from "../domain/registry";\nexport { canonicalRegistry };\n',
    );
    writeFixture(
      root,
      "src/production/bad.ts",
      'import { questions } from "../data/questions";\n',
    );
    writeFixture(
      root,
      "src/production/audit.ts",
      'import { buildAudit } from "../validation/mappingAudit/index";\n',
    );
    writeFixture(
      root,
      "src/research/baseline.ts",
      'import { questions } from "../data/questions";\n',
    );
    writeFixture(
      root,
      "src/validation/mappingAudit/runtime.ts",
      'import { questions } from "../../data/questions";\n',
    );
    writeFixture(
      root,
      "tests/fixtures/ignored.ts",
      'import { questions } from "../../src/data/questions";\n',
    );
    writeFixture(
      root,
      "src/production/roster.ts",
      'import { SPECIALIST_ASSIGNMENT_MODULE_IDS } from "../specialist/index";\n',
    );
    writeFixture(
      root,
      "src/production/localMapping.ts",
      'const MAPPINGS = [{ id: "legacy" }];\n',
    );

    const first = runCheck(root);
    assert.equal(first.status, 1);
    assert.equal(first.report.ok, false);
    assert.deepEqual(
      first.report.violations.map(({ file, kind, specifier }) => ({
        file,
        kind,
        ...(specifier ? { specifier } : {}),
      })),
      [
        {
          file: "src/production/audit.ts",
          kind: "mapping-audit-import",
          specifier: "../validation/mappingAudit/index",
        },
        {
          file: "src/production/bad.ts",
          kind: "legacy-data-import",
          specifier: "../data/questions",
        },
        {
          file: "src/production/localMapping.ts",
          kind: "duplicate-roster-or-mapping-definition",
        },
        {
          file: "src/production/roster.ts",
          kind: "duplicate-roster-import",
          specifier: "../specialist/index",
        },
      ],
    );
    assert.equal(
      first.report.diagnostics.filter((entry) => entry.severity === "baseline")
        .length,
      2,
    );

    const second = runCheck(root);
    assert.equal(second.status, 1);
    assert.deepEqual(second.report, first.report);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("canonical registry imports pass the offline check", () => {
  const root = fixtureRoot();
  try {
    writeFixture(
      root,
      "src/production/good.ts",
      'import { canonicalRegistry } from "../domain/registry";\nexport { canonicalRegistry };\n',
    );
    const result = runCheck(root);
    assert.equal(result.status, 0);
    assert.equal(result.report.ok, true);
    assert.deepEqual(result.report.violations, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
