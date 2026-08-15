import fs from "node:fs";

const qualityGate = JSON.parse(fs.readFileSync("quality-gate.json", "utf8"));
const contract = qualityGate.currentContract;
const expected = {
  architectureVersion: "2026-08-measurement-architecture-v1",
  decisionLogVersion: "2026-08-methodological-decisions-v1",
  implementationSpecVersion: "2026-08-implementation-spec-v1",
  activeCoreQuestions: 338,
  specialistQuestions: 68,
  liveQuestions: 406,
  ordinaryPrimaryLabels: 16,
  axes: 26,
  taxonomyVersion: "2026-08-taxonomy-v13",
  primaryMeasurementVersion: "2026-08-primary-core-v1",
  modifierMeasurementVersion: "2026-08-modifier-construct-v1",
  researchSchema: "2026-08-v19",
  specialistRoster: "2026-08-specialist-roster-v1",
  specialistAssignment: "balanced-hash-v2",
};

const errors = [];
if (
  qualityGate.artifact.baselineCommit !==
  "3d1e2d09b76247ce91bb04a51bdd28033a7c50f9"
) {
  errors.push(
    "quality-gate baselineCommit drifted from the frozen release baseline",
  );
}
for (const [key, value] of Object.entries(expected)) {
  if (contract[key] !== value) errors.push(`${key} expected ${value}`);
}
if (
  !fs.existsSync("docs/vnext-codex-implementation-specification-2026-08.md")
) {
  errors.push("approved vNext Codex implementation specification is missing");
}
if (errors.length > 0) {
  console.error(`vNext baseline check failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("vNext baseline check passed: frozen v13 contract is intact.");
}
