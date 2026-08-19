import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const exists = async (name) => { try { await readFile(new URL(name, root)); return true; } catch { return false; } };
const phase13 = await readJson("v2/research/research-readiness-receipt.json");
const phase14 = await readJson("v2/research/analysis-readiness-receipt.json");
const contentManifest = await readJson("v2/generated/content-manifest.json");
const analysisManifest = await readJson("v2/research/generated/phase14-r-output/dataset-manifest.json");
const expectedDocs = [
  "docs/v2/phase13-completion-report.md", "docs/v2/phase14-completion-report.md", "docs/v2/research-analysis-audit.md",
  "docs/v2/research-data-dictionary.md", "docs/v2/research-missingness.md", "docs/v2/research-statistical-modules.md",
  "docs/v2/validation-status.md", "docs/v2/release-readiness.md", "docs/v2/release-blocker-register.md",
  "docs/v2/release-notes.md", "docs/v2/migration-runbook.md", "docs/v2/rollback-runbook.md", "docs/v2/maintainer-release-checklist.md",
];
const missingDocs = (await Promise.all(expectedDocs.map(async (name) => [name, await exists(name)]))).filter(([, present]) => !present).map(([name]) => name);
const worktree = execFileSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root.pathname.replace(/\/$/, ""), encoding: "utf8" }).trim().split("\n").filter(Boolean);
const releaseOwned = /^(?:package\.json|playwright\.v2\.config\.ts|v2\/(?:packages\/research\/src\/analysis\.ts|research\/|tools\/(?:generate-phase14-|run-phase14-|phase15-)|release\/|reference\/)|tests\/(?:research\/v2-phase14-|architecture\/v2-phase14-)|docs\/v2\/)/;
const unrelatedWorktreeChanges = worktree.filter((line) => !releaseOwned.test(line.slice(3)));
const env = (name) => process.env[name] === "true";
const verification = {
  phase13Go: phase13.status === "GO",
  phase14Go: phase14.status === "GO",
  freshInstallBuild: env("PHASE15_INSTALL_BUILD_VERIFIED"),
  canonicalAudit: env("PHASE15_CANONICAL_AUDIT_VERIFIED"),
  deterministicArtifacts: env("PHASE15_DETERMINISM_VERIFIED"),
  scoringAuthorityBoundary: env("PHASE15_SCORING_BOUNDARY_VERIFIED"),
  cleanRoomBoundary: env("PHASE15_CLEAN_ROOM_VERIFIED"),
  browserMatrix: env("PHASE15_BROWSER_MATRIX_VERIFIED"),
  accessibility: env("PHASE15_A11Y_VERIFIED"),
  visualRegression: env("PHASE15_VISUAL_VERIFIED"),
  responsiveChecks: env("PHASE15_RESPONSIVE_VERIFIED"),
  performance: env("PHASE15_PERFORMANCE_VERIFIED"),
  privacySecurity: env("PHASE15_PRIVACY_VERIFIED"),
  documentation: missingDocs.length === 0 && env("PHASE15_DOCS_VERIFIED"),
  releaseTests: env("PHASE15_RELEASE_TESTS_VERIFIED"),
};
const blockers = [];
for (const [name, passed] of Object.entries(verification)) if (!passed) blockers.push({ id: `VERIFY_${name.toUpperCase()}`, severity: "blocking", detail: `${name} has not been verified in this release-candidate run` });
if (missingDocs.length) blockers.push({ id: "DOCS_MISSING", severity: "blocking", detail: missingDocs.join(", ") });
if (unrelatedWorktreeChanges.length) blockers.push({ id: "WORKTREE_NOT_CLEAN", severity: "blocking", detail: "Unrelated pre-existing worktree changes remain outside the release-owned file set" });
if (phase13.productionWritesEnabled !== false || phase14.claimsEligibleForProduction !== false) blockers.push({ id: "BOUNDARY_FLAGS", severity: "blocking", detail: "Production writes or empirical claim eligibility is enabled" });
const receipt = {
  phase: "15",
  status: blockers.length === 0 ? "GO" : "NO-GO",
  releaseCandidateOnly: true,
  productionWritesEnabled: false,
  trafficCutoverAuthorized: false,
  empiricalEvidenceStatus: phase14.empiricalEvidenceStatus,
  contentFingerprint: contentManifest.contentFingerprint,
  analysisFingerprint: phase14.analysisFingerprint,
  canonicalCounts: contentManifest.counts,
  syntheticAnalysis: { datasetKind: analysisManifest.dataset_kind, submissions: analysisManifest.accepted_submissions },
  legacySuite: {
    status: "KNOWN_PRE_EXISTING_FAILURES",
    failureCount: 5,
    details: "The untouched v1 suite retains the canonical manifest fingerprint failure, three legacy Worker compatibility failures, and one primary measurement disclosure failure recorded in the Phase 13 receipt.",
  },
  verification,
  missingDocs,
  unrelatedWorktreeChanges,
  blockers,
  rollback: { requiredBeforeCutover: true, productionCutoverPerformed: false, v1Retained: true },
};
await mkdir(new URL("v2/release/", root), { recursive: true });
await writeFile(new URL("v2/release/release-candidate-receipt.json", root), `${JSON.stringify(receipt, null, 2)}\n`);
await mkdir(new URL("docs/v2/", root), { recursive: true });
const blockerLines = blockers.length ? blockers.map((blocker) => `- **${blocker.id}** (${blocker.severity}): ${blocker.detail}`).join("\n") : "- None";
await writeFile(new URL("docs/v2/generated/release-candidate-summary.md", root), `# Generated v2 Release-Candidate Summary\n\n- Status: **${receipt.status}**\n- Production writes: **disabled**\n- Traffic cutover: **not performed**\n- Empirical evidence: **${receipt.empiricalEvidenceStatus}**\n- Content fingerprint: \`${receipt.contentFingerprint}\`\n- Analysis fingerprint: \`${receipt.analysisFingerprint}\`\n\n## Blockers\n\n${blockerLines}\n`);
console.log(JSON.stringify(receipt));
