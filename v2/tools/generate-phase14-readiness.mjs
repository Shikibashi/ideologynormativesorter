import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const registry = await readJson("research-worker/generated/acceptance-registry.json");
const phase13 = await readJson("research/research-readiness-receipt.json");
const analysis = await readJson("research/generated/phase14-r-output/analysis-report.json");
const manifest = await readJson("research/generated/phase14-r-output/dataset-manifest.json");
const claims = await readJson("research/generated/phase14-r-output/claims.json");
const fingerprint = (await readFile(new URL("research/generated/phase14-r-output/analysis-fingerprint.txt", root), "utf8")).trim();
const receipt = {
  phase: "14",
  status: process.env.RESEARCH_ANALYSIS_TESTS_VERIFIED === "true" && phase13.status === "GO" ? "GO" : "NO-GO",
  primaryStatisticalEnvironment: { name: "R", version: "4.6.1", packageLock: "v2/research/renv.lock" },
  input: { researchSchemaVersion: registry.researchSchemaVersion, contentFingerprint: registry.metadata.contentFingerprint, datasetKind: manifest.dataset_kind, acceptedSyntheticSubmissions: manifest.accepted_submissions },
  analysisSchemaVersion: manifest.analysis_schema_version,
  analysisFingerprint: fingerprint,
  empiricalEvidenceStatus: analysis.empirical_evidence_status,
  claimsEligibleForProduction: analysis.claims_eligible_for_production,
  verification: {
    phase13Go: phase13.status === "GO",
    versionValidation: process.env.RESEARCH_ANALYSIS_VERSION_VERIFIED === "true",
    privacyBoundary: process.env.RESEARCH_ANALYSIS_PRIVACY_VERIFIED === "true",
    deterministicSyntheticRun: process.env.RESEARCH_ANALYSIS_DETERMINISM_VERIFIED === "true",
    rPipeline: process.env.RESEARCH_ANALYSIS_R_VERIFIED === "true",
    claimGuard: claims.every((claim) => claim.eligible_for_production_claim === false),
    replayBridge: process.env.RESEARCH_ANALYSIS_REPLAY_VERIFIED === "true",
  },
  notes: [
    "The synthetic fixture is a regression input only and is not empirical evidence.",
    "No production collection, D1 production write, scoring change, or route activation is authorized by this receipt.",
    "Legacy v1 analysis scripts remain archive-only and were not imported into the v2 pipeline."
  ],
};
await writeFile(new URL("research/analysis-readiness-receipt.json", root), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
