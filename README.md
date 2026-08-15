# Political Judgment Decomposition

A multidimensional political self-reflection instrument that separates:

- **normative judgments** — what authority, rights, equality, and institutions
  are morally legitimate;
- **descriptive beliefs** — how political, economic, and social systems are
  believed to work in practice;
- **prescriptive strategy** — what should be done under present constraints.

Ideology labels are secondary profile-similarity summaries. They are not
probabilities, diagnoses, or validated identity estimates.

## Validation status

The instrument is **under empirical validation**. The repository contains:

- a complete manual semantic question-to-axis audit;
- a versioned effective question bank with high-confidence mapping corrections;
- explicit `needs-rewrite` exclusions for ambiguous or non-discriminating items;
- classical respondent-grounded diagnostics;
- an opt-in consented research mode;
- deterministic balanced matrix forms and test/retest order;
- a pseudonymous collector and local JSON export;
- draft preregistration-ready data-quality rules;
- R workflows for item-model alpha/omega/EFA/CFA, exact production-score
  reconstruction, test-retest agreement, criterion concordance, and DIF.

No real pilot dataset is included, so the repository does not claim established
reliability, factor structure, temporal stability, criterion validity, or
subgroup invariance.

## Application development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npm test
npm run lint
npm run build
```

GitHub Actions runs those checks, validates the reference collector syntax, and
parses the R analysis scripts.

## Question-bank architecture

The original source bank remains in `src/data/questions.ts` for traceability.
Runtime scoring uses the reviewed overlay in:

- `src/data/semanticAudit.ts`
- `src/data/effectiveQuestions.ts`

High-confidence sign or construct corrections are applied through the overlay.
Ambiguous items are marked `needs-rewrite` rather than assigned a speculative
interpretation. Bank and scoring versions are embedded in result and research
records.

## Community contributions

The ordinary intro screen lets an adult optionally contribute the same Balanced
or Full-depth profile they select for their result. Contribution is not a
separate test: the selected profile keeps its complete 206- or 338-question
form, and the respondent can continue without contributing at consent or skip
submission after answering.

Before results, contributors may optionally provide one or more ideology or
tradition names that are not in the current label set. Those names are stored as
contribution metadata and summarized for later manual review; they do not
automatically alter scoring or add production labels. Controlled
`research=1&study=...` links remain available for explicitly sized matrix forms.
Incompatible saves from older form or consent versions are not resumed as
current contributions.

The flow:

1. requires explicit adult, voluntary-participation, and data-use consent;
2. assigns a stable pseudonymous participant code in the same browser;
3. uses the complete selected consumer profile, while controlled `research=1`
   links may still request a deterministic matrix form;
4. records answers, distinct uncertainty/refusal/skipped-salience states,
   versions, timing, resume status, form fingerprint, and exact presented item
   text/options;
5. captures optional post-questionnaire self-identification before results are
   shown;
6. posts only to the configured HTTPS website endpoint.

Set the endpoint during the frontend build:

```bash
VITE_RESEARCH_ENDPOINT=https://research.example.org/submit npm run build
```

For GitHub Pages deployment, set the repository variables `RESEARCH_ENDPOINT`,
`RESEARCH_CONTACT`, and `RESEARCH_RETENTION_NOTICE`. The deployment workflow
maps them to the frontend build. Without `RESEARCH_ENDPOINT`, the optional
contribution control is disabled and no record is transmitted; local development
still allows an explicitly labeled preview.

GitHub Pages cannot store submissions by itself. The production Cloudflare
Worker/D1 collector and its operating procedure are documented in
[`docs/github-pages-contribution-deployment.md`](docs/github-pages-contribution-deployment.md).
The backend and Pages contribution flow are active; the public project URL is
the contact point and the published retention period is 24 months.

Website contributions form an open opt-in, nonprobability pool. They are useful
for improving this site but cannot estimate population prevalence or support a
sampling margin of error. No population weights are applied.

## Reference collector

The repository includes a minimal dependency-free collector for controlled
deployments:

```bash
set -a
. research-collector/.env.example
set +a
node research-collector/server.mjs
```

The collector validates the schema, consent, quality-rule, form, task, label,
taxonomy, and primary/modifier measurement versions; recomputes matrix-form
fingerprints and validates the serialized form manifest;
enforces timestamp, response-option and confidence/priority consistency;
validates deterministic specialist assignments against the configured strategy,
roster version, and module list; and treats `submissionId` as a persistent
idempotency key. An exact retry is acknowledged without a second append, while
reuse of an ID for different content is rejected. Set the study, bank, scoring,
taxonomy, measurement, and specialist-assignment variables above for a frozen
field deployment. There are no frozen-version defaults: copy the complete
configuration from `research-collector/.env.example` and keep it in a secret
or deployment configuration store.

This reference service is not production-hardening by itself. Production use
requires HTTPS, rate limiting, encrypted storage and backups, restricted access,
retention/deletion controls, monitoring, incident response, and the applicable
ethics/privacy review. Raw records must never be committed to Git.

## Analysis

Install the R dependencies:

```r
install.packages(c("jsonlite", "psych", "lavaan", "mirt", "boot"))
```

Generate data-quality flags and a reviewable inclusion manifest:

```bash
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
```

Resolve every `review-required` manifest row to `include` or `exclude`, freeze
that file, then run psychometric analyses:

```bash
Rscript analysis/run_validation.R \
  private-data/submissions.ndjson \
  analysis/output \
  analysis/output/analysis-inclusion-manifest.csv
```

Detailed inputs, thresholds, and outputs are documented in `analysis/README.md`.

## Study documents

- `docs/measurement-architecture-specification-2026-08.md`
- `docs/methodological-change-decision-log-2026-08.md`
- `docs/measurement-architecture-implementation-specification-2026-08.md`
- `docs/construct-family-map-2026-08.md`
- `docs/research-task-protocol-2026-08.md`
- `docs/semantic-question-audit-2026-07.md`
- `docs/primary-core-measurement-audit-2026-08.md`
- `docs/psychometric-validation-protocol.md`
- `docs/pilot-preregistration.md`
- `docs/recruitment-and-retest-operations.md`

Freeze the preregistration, instrument versions, quality rules, and code
revision before examining outcome-dependent study results.

## Design reference

The validation design takes limited product inspiration from Find My Politics:
multiple test lengths, directional item-balance monitoring, contextual sources,
pre-result display suppression for self-identification, and presenting labels as
nearby neighborhoods. No question wording, scoring model, historical-person
placement, country placement, or validation claim is copied. The
self-identification measure occurs after the questionnaire, so it is treated as
a post-questionnaire convergent comparison rather than an independent baseline
criterion.

## Privacy

Ordinary quiz state is stored locally in the browser. Shared result links encode
answer data and should be treated as disclosures to anyone receiving the link.
Research records are separate, opt-in, versioned, and pseudonymous; they
intentionally omit name, email, exact age, precise location, employer, party
registration, and contact information.
