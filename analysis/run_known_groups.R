#!/usr/bin/env Rscript

# Research-only known-groups validity analysis.
#
# This runner deliberately does not infer group membership from the instrument's
# own ideology labels. The group file must be independently sourced, de-identified,
# and linked by the study's approved participant code. The score file is expected to
# contain frozen production scores, not scores recomputed after inspecting outcomes.

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 4) {
  stop(
    paste(
      "Usage: Rscript analysis/run_known_groups.R",
      "<scores.csv> <known-groups.csv> <plan.csv> <output-dir>"
    ),
    call. = FALSE
  )
}

scores_path <- args[[1]]
groups_path <- args[[2]]
plan_path <- args[[3]]
output_dir <- args[[4]]

fail <- function(message) {
  stop(paste("known-groups validation failed:", message), call. = FALSE)
}

read_csv <- function(path, description) {
  if (!file.exists(path)) {
    fail(paste(description, "does not exist:", path))
  }

  result <- tryCatch(
    read.csv(path, stringsAsFactors = FALSE, check.names = FALSE),
    error = function(error) fail(paste("could not read", description, "-", error$message))
  )

  if (nrow(result) == 0) {
    fail(paste(description, "is empty"))
  }
  result
}

require_columns <- function(data, columns, description) {
  missing <- setdiff(columns, names(data))
  if (length(missing) > 0) {
    fail(paste(description, "is missing columns:", paste(missing, collapse = ", ")))
  }
}

trim_columns <- function(data, columns) {
  for (column in intersect(columns, names(data))) {
    data[[column]] <- trimws(as.character(data[[column]]))
  }
  data
}

scores <- read_csv(scores_path, "score file")
groups <- read_csv(groups_path, "known-groups file")
plan <- read_csv(plan_path, "known-groups plan")

require_columns(
  scores,
  c("participant_id", "administration", "score_id", "score"),
  "score file"
)
require_columns(
  groups,
  c("participant_id", "group_variable", "group_level"),
  "known-groups file"
)
require_columns(
  plan,
  c(
    "hypothesis_id",
    "group_variable",
    "score_id",
    "higher_group",
    "lower_group",
    "expected_direction",
    "min_group_n"
  ),
  "known-groups plan"
)

scores <- trim_columns(scores, c("participant_id", "administration", "score_id"))
groups <- trim_columns(groups, c("participant_id", "group_variable", "group_level"))
plan <- trim_columns(
  plan,
  c(
    "hypothesis_id",
    "group_variable",
    "score_id",
    "higher_group",
    "lower_group",
    "expected_direction"
  )
)

scores$administration <- tolower(scores$administration)
scores$score <- suppressWarnings(as.numeric(scores$score))
plan$min_group_n <- suppressWarnings(as.integer(plan$min_group_n))

if (any(is.na(scores$score))) {
  fail("score contains non-numeric values")
}
if (any(is.na(plan$min_group_n) | plan$min_group_n < 2L)) {
  fail("min_group_n must be an integer of at least 2")
}
if (any(!plan$expected_direction %in% c("higher", "lower"))) {
  fail("expected_direction must be 'higher' or 'lower'")
}
if (anyDuplicated(plan$hypothesis_id)) {
  fail("hypothesis_id values must be unique")
}
if (anyDuplicated(scores[c("participant_id", "administration", "score_id")])) {
  fail("score file has duplicate participant/administration/score_id rows")
}
if (anyDuplicated(groups[c("participant_id", "group_variable")])) {
  fail("known-groups file has more than one group assignment per participant/variable")
}

scores <- scores[scores$administration == "test", , drop = FALSE]
if (nrow(scores) == 0) {
  fail("score file has no administration='test' rows")
}

plan_keys <- unique(paste(plan$group_variable, plan$score_id, sep = "\u001f"))
available_keys <- unique(paste(scores$score_id, scores$score_id, sep = "\u001f"))
if (any(!plan$score_id %in% scores$score_id)) {
  missing_scores <- unique(plan$score_id[!plan$score_id %in% scores$score_id])
  fail(paste("plan refers to score_id values absent from score file:", paste(missing_scores, collapse = ", ")))
}

groups$participant_id <- as.character(groups$participant_id)
scores$participant_id <- as.character(scores$participant_id)

empty_result <- function(row, status, n_higher = NA_integer_, n_lower = NA_integer_) {
  data.frame(
    hypothesis_id = row$hypothesis_id,
    group_variable = row$group_variable,
    score_id = row$score_id,
    higher_group = row$higher_group,
    lower_group = row$lower_group,
    expected_direction = row$expected_direction,
    status = status,
    n_higher = n_higher,
    n_lower = n_lower,
    mean_higher = NA_real_,
    mean_lower = NA_real_,
    mean_difference_higher_minus_lower = NA_real_,
    hedges_g = NA_real_,
    p_value = NA_real_,
    ci_low = NA_real_,
    ci_high = NA_real_,
    direction_supported = NA,
    stringsAsFactors = FALSE
  )
}

results <- vector("list", nrow(plan))

for (index in seq_len(nrow(plan))) {
  hypothesis <- plan[index, , drop = FALSE]
  group_rows <- groups[groups$group_variable == hypothesis$group_variable, , drop = FALSE]
  score_rows <- scores[scores$score_id == hypothesis$score_id, , drop = FALSE]
  merged <- merge(group_rows, score_rows, by = "participant_id", all = FALSE)

  higher <- merged$score[merged$group_level == hypothesis$higher_group]
  lower <- merged$score[merged$group_level == hypothesis$lower_group]
  n_higher <- length(higher)
  n_lower <- length(lower)

  if (n_higher == 0 || n_lower == 0) {
    results[[index]] <- empty_result(hypothesis, "no-data", n_higher, n_lower)
    next
  }
  if (n_higher < hypothesis$min_group_n || n_lower < hypothesis$min_group_n) {
    results[[index]] <- empty_result(hypothesis, "insufficient-data", n_higher, n_lower)
    next
  }

  test <- tryCatch(
    t.test(higher, lower, paired = FALSE, var.equal = FALSE),
    error = function(error) NULL
  )
  if (is.null(test)) {
    results[[index]] <- empty_result(hypothesis, "non-estimable", n_higher, n_lower)
    next
  }

  mean_higher <- mean(higher)
  mean_lower <- mean(lower)
  difference <- mean_higher - mean_lower
  sd_higher <- stats::sd(higher)
  sd_lower <- stats::sd(lower)
  pooled_sd <- sqrt(((n_higher - 1) * sd_higher^2 + (n_lower - 1) * sd_lower^2) /
    (n_higher + n_lower - 2))
  cohen_d <- if (is.finite(pooled_sd) && pooled_sd > 0) difference / pooled_sd else NA_real_
  correction <- 1 - (3 / (4 * (n_higher + n_lower) - 9))
  hedges_g <- if (is.na(cohen_d)) NA_real_ else correction * cohen_d
  direction_supported <- if (hypothesis$expected_direction == "higher") difference > 0 else difference < 0

  results[[index]] <- data.frame(
    hypothesis_id = hypothesis$hypothesis_id,
    group_variable = hypothesis$group_variable,
    score_id = hypothesis$score_id,
    higher_group = hypothesis$higher_group,
    lower_group = hypothesis$lower_group,
    expected_direction = hypothesis$expected_direction,
    status = "contrast-estimable",
    n_higher = n_higher,
    n_lower = n_lower,
    mean_higher = mean_higher,
    mean_lower = mean_lower,
    mean_difference_higher_minus_lower = difference,
    hedges_g = hedges_g,
    p_value = unname(test$p.value),
    ci_low = unname(test$conf.int[[1]]),
    ci_high = unname(test$conf.int[[2]]),
    direction_supported = direction_supported,
    stringsAsFactors = FALSE
  )
}

result_table <- do.call(rbind, results)
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
write.csv(
  result_table,
  file.path(output_dir, "known-groups-results.csv"),
  row.names = FALSE,
  na = ""
)

summary_lines <- c(
  "Known-groups validity analysis",
  "status=research-only",
  paste("hypotheses=", nrow(plan), sep = ""),
  paste("contrast_estimable=", sum(result_table$status == "contrast-estimable"), sep = ""),
  paste("insufficient_data=", sum(result_table$status == "insufficient-data"), sep = ""),
  paste("no_data=", sum(result_table$status == "no-data"), sep = ""),
  paste("non_estimable=", sum(result_table$status == "non-estimable"), sep = ""),
  "interpretation_gate=Do not describe the instrument as validated from this file alone.",
  "independence_gate=Group membership must come from an approved external criterion, not this instrument's labels.",
  "multiplicity_gate=Apply the preregistered multiplicity and sensitivity plan before interpreting p-values."
)
writeLines(summary_lines, file.path(output_dir, "known-groups-summary.txt"))

if (requireNamespace("jsonlite", quietly = TRUE)) {
  jsonlite::write_json(
    list(
      status = "research-only",
      hypotheses = nrow(plan),
      contrast_estimable = sum(result_table$status == "contrast-estimable"),
      insufficient_data = sum(result_table$status == "insufficient-data"),
      no_data = sum(result_table$status == "no-data"),
      non_estimable = sum(result_table$status == "non-estimable")
    ),
    file.path(output_dir, "known-groups-summary.json"),
    auto_unbox = TRUE,
    pretty = TRUE
  )
}

message("Known-groups analysis written to ", normalizePath(output_dir, mustWork = FALSE))
