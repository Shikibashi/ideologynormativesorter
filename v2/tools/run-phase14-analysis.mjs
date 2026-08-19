import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const path = (name) => new URL(name, root).pathname;
const fixture = path("research/fixtures/phase14-synthetic.ndjson");
const output = path("research/generated/phase14-r-output");
const bundle = path("generated/content.bundle.json");
const config = path("research/config/analysis-config.json");
await mkdir(output, { recursive: true });
await new Promise((resolve, reject) => {
  const child = spawn("Rscript", [path("research/R/pipeline.R"), fixture, bundle, config, output], { cwd: root.pathname.replace(/\/$/, ""), stdio: "inherit" });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`Phase 14 R pipeline exited with ${code}`)));
});
const report = JSON.parse(await readFile(`${output}/analysis-report.json`, "utf8"));
const manifest = JSON.parse(await readFile(`${output}/dataset-manifest.json`, "utf8"));
const claims = JSON.parse(await readFile(`${output}/claims.json`, "utf8"));
if (manifest.submission_ids_emitted || manifest.direct_identifiers_in_analysis_outputs) throw new Error("Privacy guard failed");
if (report.empirical_evidence_status !== "NOT_EVALUATED" || report.claims_eligible_for_production !== false) throw new Error("Claim guard failed");
if (claims.some((claim) => claim.eligible_for_production_claim !== false)) throw new Error("Claim registry contains an eligible claim");
const files = ["analysis-report.json", "claims.json", "dataset-manifest.json", "item-descriptives.csv", "quality.json", "privacy-audit.json", "reliability.csv", "r-environment.json"];
const fingerprint = createHash("sha256").update((await Promise.all(files.map(async (file) => `${file}\n${await readFile(`${output}/${file}`, "utf8")}`))).join("\n")).digest("hex");
await writeFile(`${output}/analysis-fingerprint.txt`, `${fingerprint}\n`);
console.log(JSON.stringify({ status: "PASS", output, fingerprint, sampleSize: manifest.accepted_submissions, empiricalEvidenceStatus: report.empirical_evidence_status }));
