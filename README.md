# Political Judgment Decomposition

A multidimensional political self-reflection instrument that separates:

- **normative judgments** — what authority, rights, equality, and institutions are morally legitimate;
- **descriptive beliefs** — how political, economic, and social systems are believed to work in practice;
- **prescriptive strategy** — what should be done under present constraints.

Ideology labels are secondary profile-similarity summaries. They are not probabilities, diagnoses, or validated identity estimates.

## Validation status

The instrument is **under empirical validation**. The repository contains:

- a complete manual semantic question-to-axis audit;
- a versioned effective question bank with high-confidence mapping corrections;
- explicit `needs-rewrite` exclusions for ambiguous or non-discriminating items;
- classical respondent-grounded diagnostics;
- an opt-in consented research mode;
- deterministic balanced matrix forms and test/retest order;
- a pseudonymous collector and local JSON export;
- preregistered data-quality rules;
- R workflows for alpha, omega, bootstrap intervals, EFA, held-out CFA, test-retest analysis, criterion concordance, and DIF.

No real pilot dataset is included, so the repository does not claim established reliability, factor structure, temporal stability, criterion validity, or subgroup invariance.

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

GitHub Actions runs those checks, validates the reference collector syntax, and parses the R analysis scripts.

## Question-bank architecture

The original source bank remains in `src/data/questions.ts` for traceability. Runtime scoring uses the reviewed overlay in:

- `src/data/semanticAudit.ts`
- `src/data/effectiveQuestions.ts`

High-confidence sign or construct corrections are applied through the overlay. Ambiguous items are marked `needs-rewrite` rather than assigned a speculative interpretation. Bank and scoring versions are embedded in result and research records.

## Research mode

Research mode is never enabled silently. An initial matrix-sampled administration can be launched with:

```text
?research=1&study=pilot-2026&formSize=120
```

A retest uses:

```text
?research=1&study=pilot-2026&administration=retest&formSize=120
```

The flow:

1. requires explicit adult, voluntary-participation, and data-use consent;
2. assigns a stable pseudonymous participant code in the same browser;
3. creates a balanced deterministic form and randomized presentation order;
4. records answers, confidence/priority, versions, timing, resume status, and item metadata;
5. captures optional self-identification before results are shown;
6. posts only to a configured HTTPS endpoint or lets the participant download the JSON record.

Set the endpoint during the frontend build:

```bash
VITE_RESEARCH_ENDPOINT=https://research.example.org/submit npm run build
```

Without that variable, no record is transmitted.

## Reference collector

The repository includes a minimal dependency-free collector for controlled deployments:

```bash
ALLOWED_ORIGIN=http://localhost:5173 \
RESEARCH_OUTPUT_FILE=./private-data/submissions.ndjson \
node research-collector/server.mjs
```

This reference service is not production-hardening by itself. Production use requires HTTPS, rate limiting, encrypted storage and backups, restricted access, retention/deletion controls, monitoring, incident response, and the applicable ethics/privacy review. Raw records must never be committed to Git.

## Analysis

Install the R dependencies:

```r
install.packages(c("jsonlite", "psych", "lavaan", "mirt", "boot"))
```

Run preregistered data-quality flags:

```bash
Rscript analysis/run_data_quality.R private-data/submissions.ndjson analysis/output
```

Run psychometric analyses:

```bash
Rscript analysis/run_validation.R private-data/submissions.ndjson analysis/output
```

Detailed inputs, thresholds, and outputs are documented in `analysis/README.md`.

## Study documents

- `docs/semantic-question-audit-2026-07.md`
- `docs/psychometric-validation-protocol.md`
- `docs/pilot-preregistration.md`
- `docs/recruitment-and-retest-operations.md`

Freeze the preregistration, instrument versions, quality rules, and code revision before examining outcome-dependent study results.

## Design reference

The validation design takes limited product inspiration from Find My Politics: multiple test lengths, directional item-balance monitoring, contextual sources, pre-result self-identification, and presenting labels as nearby neighborhoods. No question wording, scoring model, historical-person placement, country placement, or validation claim is copied.

## Privacy

Ordinary quiz state is stored locally in the browser. Shared result links encode answer data and should be treated as disclosures to anyone receiving the link. Research records are separate, opt-in, versioned, and pseudonymous; they intentionally omit name, email, exact age, precise location, employer, party registration, and contact information.
