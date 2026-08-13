# Pilot and retest launch checklist

This is the operational launch surface for the taxonomy-v2 measurement pilot. It does not replace the preregistration, privacy review, or data-management controls in [`pilot-preregistration.md`](./pilot-preregistration.md) and [`recruitment-and-retest-operations.md`](./recruitment-and-retest-operations.md).

## Current links

Use the same frozen study ID for the initial administration and the retest. The participant code is generated and retained by the respondent’s browser, so the same browser must be used for both links.

Initial pilot, balanced matrix form:

`https://ideologynormativesorter.edriffles.us/?research=1&study=community-2026-v5&formSize=120&source=pilot-2026`

Retest, balanced matrix form:

`https://ideologynormativesorter.edriffles.us/?research=1&study=community-2026-v5&administration=retest&formSize=120&source=pilot-2026`

The release-candidate contract for this checklist is schema `2026-08-v15`, consent `2026-08-12-v8`, form `profile-form-v3`, taxonomy registry `2026-08-taxonomy-v13`, primary measurement registry `2026-08-primary-core-v1`, modifier measurement registry `2026-08-modifier-construct-v1`, analytical scale registry `2026-08-analytical-scale-v2`, scoring `2026-08-13-taxonomy-v8`, question-context `2026-08-question-context-v33`, editorial review `2026-08-editorial-v28`, confidence coverage `2026-08-confidence-coverage-v4`, descriptive evidence `2026-08-descriptive-evidence-v5`, experimental specialist waves `2026-08-specialist-v10`, and assignment roster `2026-08-specialist-roster-v1` under `balanced-hash-v2`. The current public profiles contain 206 Balanced and 338 Full-depth items. This v5 cohort uses source-backed primary core scopes, direct modifier constructs, and primary/modifier roster fingerprints; catalog-only modifiers must abstain rather than be inferred from a host ideology. This contract is not live until the frontend and Worker release complete and live markers are verified. The active bank fingerprint is recorded in the preregistration and protocol. Do not mix records from another bank, scoring, taxonomy, primary-measurement, modifier-measurement, or assignment-roster version into this cohort without a frozen linking decision. The `community-2026`, `community-2026-v2`, `community-2026-v3`, and `community-2026-v4` cohorts remain historical and must not be pooled with this cohort without a preregistered linking decision.

## Operator sequence

1. Freeze the preregistration and record the commit, Pages deployment, Worker version, and launch URLs before recruiting.
2. Run a cognitive pilot first. Ask participants to explain what they thought each sampled item meant, which terms were unfamiliar, and whether the specialist invitation felt optional and understandable.
3. Confirm that the initial and retest links preserve the participant code, study ID, administration, and specialist assignment. The specialist item order may change between administrations; the module assignment must not.
4. Keep core records and specialist records in separate private files. Never copy raw records into the repository or an issue tracker.
5. After each export, run `npm run research:check`, then the data-quality workflow. Resolve every inclusion-manifest row before running psychometric or specialist analysis.
6. Run specialist validation only after joining core assignment denominators with completed and disposition records. Sparse specialist matches must remain abstentions.

## Analysis gates

- Cognitive-pilot feedback is reviewed before interpreting coefficients.
- Development and confirmation administrations remain separate.
- Test-retest analysis requires the same participant code, study, bank, scoring, taxonomy, form, and assignment roster versions.
- Specialist results remain experimental until reliability, construct coverage, criterion interpretation, test-retest behavior, false-positive separation, and fairness review meet the preregistered gate.
- No result from this open opt-in convenience sample is a population prevalence estimate.

## Export commands

```bash
QUALITY_REQUIRED_CONSENT_VERSION=2026-08-12-v8 \
Rscript analysis/run_data_quality.R \
  private-data/submissions.ndjson \
  analysis/output

Rscript analysis/run_validation.R \
  private-data/submissions.ndjson \
  analysis/output \
  analysis/output/analysis-inclusion-manifest.csv

Rscript analysis/run_specialist_validation.R \
  private-data/submissions.ndjson \
  private-data/specialist-submissions.ndjson \
  analysis/specialist-output
```
