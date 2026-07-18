# Synthetic validation harness

This directory tests whether the research pipeline can recover known properties from generated data. It is a software and statistical-recovery test, not evidence that the political instrument is valid in real respondents.

The generator creates:

- 600 initial administrations and 200 linked retests;
- two correlated normative factors with six Likert items each;
- one descriptive factor with six fully sourced and operationalized synthetic items;
- positive and negative item direction plus a reverse-scored item;
- approximately 84% top-1 and 100% top-3 self-label concordance by construction;
- one deliberately injected gender-group item effect on `syn_eq_6` for DIF recovery;
- low random missingness and descriptive `dont_know` responses;
- deliberately fast, high-missingness, duplicate-vector, and invalid-consent records for data-quality checks;
- one `needs-rewrite` item and one statement-choice item that must remain outside common-scale psychometric estimates.

Run locally after installing the packages listed in `analysis/README.md`:

```bash
mkdir -p analysis/synthetic/output/{quality,validation}
Rscript analysis/synthetic/generate_synthetic_study.R analysis/synthetic/output/submissions.ndjson
QUALITY_MINIMUM_DURATION_MS=60000 \
  Rscript analysis/run_data_quality.R analysis/synthetic/output/submissions.ndjson analysis/synthetic/output/quality
PSYCH_BOOTSTRAP_REPLICATES=200 \
PSYCH_MINIMUM_AXIS_N=100 \
PSYCH_MINIMUM_FACTOR_N=300 \
PSYCH_MINIMUM_DIF_GROUP_N=100 \
  Rscript analysis/run_validation.R analysis/synthetic/output/submissions.ndjson analysis/synthetic/output/validation
Rscript analysis/synthetic/check_synthetic_outputs.R analysis/synthetic/output/validation analysis/synthetic/output/quality
```

The checker fails unless the pipeline recovers the injected reliability, factor, retest, criterion, source-coverage, DIF, and quality-control signals within predetermined bounds. Random seeds are fixed for reproducibility.

Generated records and outputs belong under `analysis/synthetic/output/` and should not be committed.