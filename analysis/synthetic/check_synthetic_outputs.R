#!/usr/bin/env Rscript

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Missing required R package: jsonlite")
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript analysis/synthetic/check_synthetic_outputs.R <validation-output> <quality-output>")
}

validation_dir <- args[[1]]
quality_dir <- args[[2]]

assert_true <- function(condition, message) {
  if (!isTRUE(condition)) stop(message, call. = FALSE)
}

read_csv <- function(name, directory = validation_dir) {
  path <- file.path(directory, name)
  assert_true(file.exists(path), paste("Missing expected output:", path))
  utils::read.csv(path, stringsAsFactors = FALSE, check.names = FALSE)
}

summary <- jsonlite::fromJSON(file.path(validation_dir, "validation-summary.json"))
assert_true(summary$submissionCount >= 800, "Synthetic study did not include the expected respondent volume.")
assert_true(summary$eligibleItemCount == 18, "Eligible-item filtering did not retain exactly 18 synthetic Likert items.")
assert_true(summary$excludedNeedsRewriteCount == 1, "The needs-rewrite synthetic item was not excluded.")
assert_true(summary$criterionTop1Rate >= 0.75, "Top-1 criterion concordance failed to recover the injected signal.")
assert_true(summary$criterionTop3Rate >= 0.98, "Top-3 criterion concordance failed to recover the injected signal.")

axis_reliability <- read_csv("axis-reliability.csv")
expected_axes <- c("synthetic-equality", "synthetic-liberty", "synthetic-state-capacity")
assert_true(all(expected_axes %in% axis_reliability$axis_id), "One or more synthetic axes are missing from reliability output.")
axis_reliability <- axis_reliability[match(expected_axes, axis_reliability$axis_id), ]
assert_true(all(axis_reliability$status == "estimated"), "Synthetic axes were not estimated despite adequate sample size.")
assert_true(all(axis_reliability$alpha >= 0.78), "Cronbach alpha did not recover the injected coherent scales.")
assert_true(all(axis_reliability$omega_total >= 0.78), "Omega total did not recover the injected coherent scales.")
assert_true(all(axis_reliability$alpha_ci_low > 0.70), "Alpha bootstrap intervals are unexpectedly weak.")
assert_true(all(axis_reliability$omega_ci_low > 0.70), "Omega bootstrap intervals are unexpectedly weak.")

item_total <- read_csv("item-total-correlations.csv")
retained_item_total <- item_total[item_total$question_id != "syn_eq_6", , drop = FALSE]
assert_true(all(retained_item_total$corrected_item_total > 0.25, na.rm = TRUE), "Most synthetic items should have positive corrected item-total relationships.")

retest <- read_csv("test-retest.csv")
retest <- retest[retest$axis_id %in% expected_axes, , drop = FALSE]
assert_true(nrow(retest) == length(expected_axes), "Test-retest output is missing a synthetic axis.")
assert_true(all(retest$pair_n >= 175), "Too few synthetic retest pairs were recovered.")
assert_true(all(retest$test_retest_correlation >= 0.65), "Test-retest analysis did not recover the injected temporal stability.")
assert_true(all(retest$ci_low > 0.50), "Test-retest bootstrap intervals are unexpectedly weak.")

source_coverage <- read_csv("source-coverage.csv")
assert_true(source_coverage$descriptive_items[[1]] == 6, "Descriptive item count is incorrect.")
assert_true(source_coverage$sourced_rate[[1]] == 1, "Synthetic source coverage should be complete.")
assert_true(source_coverage$operationalized_rate[[1]] == 1, "Synthetic operational-definition coverage should be complete.")

cfa_fit <- read_csv("cfa-fit.csv")
normative_fit <- cfa_fit[cfa_fit$layer == "normative" & cfa_fit$status == "estimated", , drop = FALSE]
assert_true(nrow(normative_fit) >= 1, "Held-out normative CFA was not estimated.")
assert_true(normative_fit$cfi[[1]] >= 0.93, "Held-out CFA did not recover the injected two-factor structure.")
assert_true(normative_fit$tli[[1]] >= 0.92, "Held-out CFA TLI is below the synthetic recovery gate.")
assert_true(normative_fit$rmsea[[1]] <= 0.09, "Held-out CFA RMSEA is above the synthetic recovery gate.")
assert_true(normative_fit$srmr[[1]] <= 0.09, "Held-out CFA SRMR is above the synthetic recovery gate.")

efa <- read_csv("efa-loadings.csv")
loading_columns <- grep("^(MR|ML|PA)[0-9]+$", names(efa), value = TRUE)
assert_true(length(loading_columns) >= 2, "EFA did not retain at least two synthetic factors.")
normative_efa <- efa[efa$layer == "normative", , drop = FALSE]
strongest_factor <- apply(abs(as.matrix(normative_efa[, loading_columns, drop = FALSE])), 1, which.max)
names(strongest_factor) <- normative_efa$question_id
mode_value <- function(values) as.integer(names(sort(table(values), decreasing = TRUE))[1])
liberty_mode <- mode_value(strongest_factor[grepl("^syn_lib_", names(strongest_factor))])
equality_mode <- mode_value(strongest_factor[grepl("^syn_eq_", names(strongest_factor))])
assert_true(liberty_mode != equality_mode, "EFA collapsed the two injected normative factors.")
assert_true(sum(strongest_factor[grepl("^syn_lib_", names(strongest_factor))] == liberty_mode) >= 5, "Liberty items did not cluster on one recovered factor.")
assert_true(sum(strongest_factor[grepl("^syn_eq_", names(strongest_factor))] == equality_mode) >= 5, "Equality items did not cluster on one recovered factor.")

dif_path <- file.path(validation_dir, "dif-results.csv")
assert_true(file.exists(dif_path), "DIF output was not produced for the adequately sized synthetic groups.")
dif <- utils::read.csv(dif_path, stringsAsFactors = FALSE, check.names = FALSE)
injected_dif <- dif[
  dif$question_id == "syn_eq_6" & dif$group_variable == "genderGroup",
  ,
  drop = FALSE
]
assert_true(nrow(injected_dif) == 1, "DIF analysis did not return the injected gender-group item effect exactly once.")
assert_true(is.finite(injected_dif$adj_p[[1]]) && injected_dif$adj_p[[1]] < 0.05,
            "Injected DIF was not significant after multiplicity adjustment.")

quality_summary <- jsonlite::fromJSON(file.path(quality_dir, "data-quality-summary.json"))
assert_true(quality_summary$exclusionCandidateCount >= 5, "Data-quality analysis did not flag the deliberately malformed records and duplicate pair.")
quality <- read_csv("submission-quality.csv", quality_dir)
flagged <- quality$participant_id[quality$exclusion_candidate]
for (participant_id in c("bad_fast", "bad_missing", "bad_duplicate", "bad_consent", "syn_0001")) {
  assert_true(participant_id %in% flagged, paste("Expected quality flag missing for", participant_id))
}
assert_true(quality$below_duration_gate[quality$participant_id == "bad_fast"], "Fast-completion gate did not fire.")
assert_true(quality$above_missing_gate[quality$participant_id == "bad_missing"], "Missingness gate did not fire.")
assert_true(!quality$consent_valid[quality$participant_id == "bad_consent"], "Consent validation did not fire.")
assert_true(quality$duplicate_answer_vector[quality$participant_id == "bad_duplicate"], "Duplicate-vector detection did not fire.")

cat("Synthetic validation recovery checks passed.\n")
cat(sprintf("Alpha range: %.3f–%.3f\n", min(axis_reliability$alpha), max(axis_reliability$alpha)))
cat(sprintf("Omega range: %.3f–%.3f\n", min(axis_reliability$omega_total), max(axis_reliability$omega_total)))
cat(sprintf("Retest range: %.3f–%.3f\n", min(retest$test_retest_correlation), max(retest$test_retest_correlation)))
cat(sprintf("Normative CFA: CFI %.3f, TLI %.3f, RMSEA %.3f, SRMR %.3f\n",
            normative_fit$cfi[[1]], normative_fit$tli[[1]], normative_fit$rmsea[[1]], normative_fit$srmr[[1]]))
cat(sprintf("Injected gender DIF adjusted p: %.6g\n", injected_dif$adj_p[[1]]))
