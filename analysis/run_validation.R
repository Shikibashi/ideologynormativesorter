#!/usr/bin/env Rscript

required_packages <- c("jsonlite", "psych", "lavaan", "mirt", "boot")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(
    "Missing required R packages: ",
    paste(missing_packages, collapse = ", "),
    ". Install them before running this script."
  )
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript analysis/run_validation.R <submissions.json|jsonl|directory> <output-directory>")
}

input_path <- args[[1]]
output_dir <- args[[2]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

bootstrap_replicates <- as.integer(Sys.getenv("PSYCH_BOOTSTRAP_REPLICATES", "1000"))
minimum_axis_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_AXIS_N", "100"))
minimum_factor_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_FACTOR_N", "300"))
minimum_dif_group_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_DIF_GROUP_N", "100"))
set.seed(as.integer(Sys.getenv("PSYCH_RANDOM_SEED", "20260718")))

read_json_file <- function(path) {
  parsed <- jsonlite::fromJSON(path, simplifyVector = FALSE)
  if (!is.null(parsed$schemaVersion)) list(parsed) else parsed
}

read_submissions <- function(path) {
  if (dir.exists(path)) {
    files <- list.files(path, pattern = "\\.json$", full.names = TRUE)
    return(unlist(lapply(files, read_json_file), recursive = FALSE))
  }
  if (!file.exists(path)) stop("Input path does not exist: ", path)
  if (grepl("\\.(jsonl|ndjson)$", path, ignore.case = TRUE)) {
    lines <- readLines(path, warn = FALSE)
    lines <- lines[nzchar(trimws(lines))]
    return(lapply(lines, jsonlite::fromJSON, simplifyVector = FALSE))
  }
  read_json_file(path)
}

submissions <- read_submissions(input_path)
submissions <- submissions[vapply(submissions, function(record) {
  !is.null(record$schemaVersion) && !is.null(record$participantId) && !is.null(record$answers)
}, logical(1))]
if (length(submissions) == 0) stop("No valid research submissions were found.")

bank_versions <- unique(vapply(submissions, function(record) record$bankVersion %||% "unknown", character(1)))
scoring_versions <- unique(vapply(submissions, function(record) record$scoringVersion %||% "unknown", character(1)))
if (length(bank_versions) > 1) warning("Multiple bank versions detected: ", paste(bank_versions, collapse = ", "))
if (length(scoring_versions) > 1) warning("Multiple scoring versions detected: ", paste(scoring_versions, collapse = ", "))

item_registry <- list()
for (record in submissions) {
  for (item in record$itemMap %||% list()) {
    question_id <- item$questionId
    if (!is.null(question_id) && is.null(item_registry[[question_id]])) item_registry[[question_id]] <- item
  }
}
if (length(item_registry) == 0) stop("No item metadata was present in the submissions.")

item_ids <- names(item_registry)
respondent_keys <- vapply(submissions, function(record) {
  paste(record$participantId, record$administration %||% "test", sep = "::")
}, character(1))
response_matrix <- matrix(NA_real_, nrow = length(submissions), ncol = length(item_ids),
                          dimnames = list(respondent_keys, item_ids))

for (row_index in seq_along(submissions)) {
  answers <- submissions[[row_index]]$answers
  for (question_id in item_ids) {
    answer <- answers[[question_id]]
    value <- answer$value %||% NA
    if (is.numeric(value) && length(value) == 1) response_matrix[row_index, question_id] <- value
  }
}

primary_axis <- function(item) {
  weights <- item$axisWeights %||% list()
  if (length(weights) == 0) return(NULL)
  magnitudes <- vapply(weights, function(weight) abs(as.numeric(weight$weight %||% 0)), numeric(1))
  weights[[which.max(magnitudes)]]$axisId
}

primary_weight <- function(item) {
  weights <- item$axisWeights %||% list()
  if (length(weights) == 0) return(NA_real_)
  magnitudes <- vapply(weights, function(weight) abs(as.numeric(weight$weight %||% 0)), numeric(1))
  as.numeric(weights[[which.max(magnitudes)]]$weight)
}

eligible_item <- function(item) {
  !identical(item$reviewStatus %||% "approved", "needs-rewrite") &&
    !identical(item$responseType, "statementChoice") &&
    !is.null(primary_axis(item))
}

eligible_ids <- item_ids[vapply(item_registry, eligible_item, logical(1))]
metadata <- data.frame(
  question_id = eligible_ids,
  layer = vapply(item_registry[eligible_ids], function(item) item$layer, character(1)),
  axis_id = vapply(item_registry[eligible_ids], primary_axis, character(1)),
  weight = vapply(item_registry[eligible_ids], primary_weight, numeric(1)),
  source_count = vapply(item_registry[eligible_ids], function(item) as.integer(item$sourceCount %||% 0), integer(1)),
  operationalized = vapply(item_registry[eligible_ids], function(item) nzchar(trimws(item$evidenceNote %||% "")), logical(1)),
  stringsAsFactors = FALSE
)

oriented_matrix <- response_matrix[, eligible_ids, drop = FALSE]
for (question_id in eligible_ids) {
  item <- item_registry[[question_id]]
  sign_value <- sign(primary_weight(item))
  if (isTRUE(item$reverseScored)) sign_value <- -sign_value
  oriented_matrix[, question_id] <- oriented_matrix[, question_id] * sign_value
}

administrations <- vapply(submissions, function(record) record$administration %||% "test", character(1))
test_rows <- administrations == "test"
retest_rows <- administrations == "retest"

safe_alpha <- function(data) {
  data <- as.data.frame(data)
  data <- data[, vapply(data, function(column) stats::sd(column, na.rm = TRUE) > 0, logical(1)), drop = FALSE]
  if (ncol(data) < 2 || nrow(data) < 3) return(NA_real_)
  tryCatch(suppressWarnings(psych::alpha(data, check.keys = FALSE, warnings = FALSE)$total$raw_alpha),
           error = function(error) NA_real_)
}

safe_omega <- function(data) {
  data <- as.data.frame(data)
  data <- data[, vapply(data, function(column) stats::sd(column, na.rm = TRUE) > 0, logical(1)), drop = FALSE]
  if (ncol(data) < 3 || nrow(data) < 10) return(NA_real_)
  tryCatch(
    suppressWarnings(psych::omega(data, nfactors = 1, plot = FALSE, warnings = FALSE)$omega.tot),
    error = function(error) NA_real_
  )
}

bootstrap_interval <- function(data, statistic, replicates) {
  if (nrow(data) < 20 || replicates < 100) return(c(NA_real_, NA_real_))
  result <- tryCatch(
    boot::boot(data = data, statistic = function(values, indices) statistic(values[indices, , drop = FALSE]), R = replicates),
    error = function(error) NULL
  )
  if (is.null(result) || all(is.na(result$t))) return(c(NA_real_, NA_real_))
  interval <- tryCatch(boot::boot.ci(result, type = "perc")$percent[4:5], error = function(error) c(NA_real_, NA_real_))
  as.numeric(interval)
}

axis_ids <- sort(unique(metadata$axis_id))
axis_rows <- list()
item_rows <- list()

for (axis_id in axis_ids) {
  ids <- metadata$question_id[metadata$axis_id == axis_id]
  test_data <- oriented_matrix[test_rows, ids, drop = FALSE]
  complete_n <- sum(stats::complete.cases(test_data))
  alpha_value <- if (sum(test_rows) >= minimum_axis_n) safe_alpha(test_data) else NA_real_
  omega_value <- if (sum(test_rows) >= minimum_axis_n) safe_omega(test_data) else NA_real_
  alpha_ci <- if (!is.na(alpha_value)) bootstrap_interval(test_data, safe_alpha, bootstrap_replicates) else c(NA_real_, NA_real_)
  omega_ci <- if (!is.na(omega_value)) bootstrap_interval(test_data, safe_omega, bootstrap_replicates) else c(NA_real_, NA_real_)

  axis_rows[[length(axis_rows) + 1]] <- data.frame(
    axis_id = axis_id,
    item_count = length(ids),
    test_n = sum(test_rows),
    complete_case_n = complete_n,
    alpha = alpha_value,
    alpha_ci_low = alpha_ci[[1]],
    alpha_ci_high = alpha_ci[[2]],
    omega_total = omega_value,
    omega_ci_low = omega_ci[[1]],
    omega_ci_high = omega_ci[[2]],
    status = if (sum(test_rows) < minimum_axis_n) "insufficient-data" else "estimated",
    stringsAsFactors = FALSE
  )

  if (length(ids) >= 2 && sum(test_rows) >= minimum_axis_n) {
    total_scores <- rowSums(test_data, na.rm = FALSE)
    for (question_id in ids) {
      item_values <- test_data[, question_id]
      remainder <- total_scores - item_values
      correlation <- suppressWarnings(stats::cor(item_values, remainder, use = "pairwise.complete.obs"))
      item_rows[[length(item_rows) + 1]] <- data.frame(
        axis_id = axis_id,
        question_id = question_id,
        corrected_item_total = correlation,
        stringsAsFactors = FALSE
      )
    }
  }
}

axis_reliability <- if (length(axis_rows) > 0) do.call(rbind, axis_rows) else data.frame()
item_total <- if (length(item_rows) > 0) do.call(rbind, item_rows) else data.frame()
utils::write.csv(axis_reliability, file.path(output_dir, "axis-reliability.csv"), row.names = FALSE)
utils::write.csv(item_total, file.path(output_dir, "item-total-correlations.csv"), row.names = FALSE)

participant_ids <- vapply(submissions, function(record) record$participantId, character(1))
axis_score <- function(row_index, ids) {
  values <- oriented_matrix[row_index, ids]
  if (all(is.na(values))) return(NA_real_)
  mean(values, na.rm = TRUE)
}

retest_results <- list()
for (axis_id in axis_ids) {
  ids <- metadata$question_id[metadata$axis_id == axis_id]
  paired <- list()
  for (participant_id in unique(participant_ids)) {
    first <- which(participant_ids == participant_id & test_rows)
    second <- which(participant_ids == participant_id & retest_rows)
    if (length(first) == 0 || length(second) == 0) next
    paired[[length(paired) + 1]] <- c(axis_score(first[[1]], ids), axis_score(second[[1]], ids))
  }
  paired_matrix <- if (length(paired) > 0) do.call(rbind, paired) else matrix(numeric(0), ncol = 2)
  paired_matrix <- paired_matrix[stats::complete.cases(paired_matrix), , drop = FALSE]
  correlation <- if (nrow(paired_matrix) >= 30) stats::cor(paired_matrix[, 1], paired_matrix[, 2]) else NA_real_
  ci <- if (!is.na(correlation)) {
    bootstrap_interval(paired_matrix, function(values) stats::cor(values[, 1], values[, 2]), bootstrap_replicates)
  } else c(NA_real_, NA_real_)
  retest_results[[length(retest_results) + 1]] <- data.frame(
    axis_id = axis_id,
    pair_n = nrow(paired_matrix),
    test_retest_correlation = correlation,
    ci_low = ci[[1]],
    ci_high = ci[[2]],
    status = if (nrow(paired_matrix) < 30) "insufficient-data" else "estimated",
    stringsAsFactors = FALSE
  )
}
utils::write.csv(do.call(rbind, retest_results), file.path(output_dir, "test-retest.csv"), row.names = FALSE)

criterion_records <- lapply(submissions[test_rows], function(record) {
  self_label <- record$identity$selfLabelId %||% ""
  predicted <- unlist(record$predictedLabelIds %||% list(), use.names = FALSE)
  if (!nzchar(self_label)) return(NULL)
  data.frame(
    participant_id = record$participantId,
    self_label_id = self_label,
    top1 = length(predicted) >= 1 && identical(predicted[[1]], self_label),
    top3 = self_label %in% head(predicted, 3),
    stringsAsFactors = FALSE
  )
})
criterion_records <- criterion_records[!vapply(criterion_records, is.null, logical(1))]
criterion_data <- if (length(criterion_records) > 0) do.call(rbind, criterion_records) else data.frame()
utils::write.csv(criterion_data, file.path(output_dir, "criterion-concordance.csv"), row.names = FALSE)

select_factor_items <- function(layer_name, per_axis = 5) {
  layer_metadata <- metadata[metadata$layer == layer_name, , drop = FALSE]
  selected <- unlist(lapply(split(layer_metadata, layer_metadata$axis_id), function(group) {
    group <- group[order(abs(group$weight), decreasing = TRUE), , drop = FALSE]
    head(group$question_id, per_axis)
  }), use.names = FALSE)
  selected
}

sanitize_factor <- function(value) gsub("[^A-Za-z0-9_]", "_", value)

efa_rows <- list()
cfa_rows <- list()
for (layer_name in sort(unique(metadata$layer))) {
  selected_ids <- select_factor_items(layer_name)
  selected_ids <- selected_ids[colSums(!is.na(oriented_matrix[test_rows, selected_ids, drop = FALSE])) >= minimum_factor_n]
  if (length(selected_ids) < 6 || sum(test_rows) < minimum_factor_n) {
    cfa_rows[[length(cfa_rows) + 1]] <- data.frame(layer = layer_name, status = "insufficient-data", n = sum(test_rows))
    next
  }

  layer_data <- as.data.frame(oriented_matrix[test_rows, selected_ids, drop = FALSE])
  usable_rows <- rowSums(!is.na(layer_data)) >= ceiling(ncol(layer_data) * 0.8)
  layer_data <- layer_data[usable_rows, , drop = FALSE]
  if (nrow(layer_data) < minimum_factor_n) {
    cfa_rows[[length(cfa_rows) + 1]] <- data.frame(layer = layer_name, status = "insufficient-data", n = nrow(layer_data))
    next
  }

  split_marker <- sample(c(TRUE, FALSE), nrow(layer_data), replace = TRUE)
  development <- layer_data[split_marker, , drop = FALSE]
  holdout <- layer_data[!split_marker, , drop = FALSE]
  if (nrow(development) < 100 || nrow(holdout) < 100) next

  poly <- tryCatch(psych::polychoric(development, correct = 0.5)$rho, error = function(error) NULL)
  if (!is.null(poly)) {
    parallel <- tryCatch(
      psych::fa.parallel(poly, n.obs = nrow(development), fm = "minres", fa = "fa", plot = FALSE),
      error = function(error) NULL
    )
    factor_count <- max(1, parallel$nfact %||% 1)
    efa <- tryCatch(psych::fa(poly, nfactors = factor_count, n.obs = nrow(development), fm = "minres", rotate = "oblimin"),
                    error = function(error) NULL)
    if (!is.null(efa)) {
      loadings <- as.data.frame(unclass(efa$loadings))
      loadings$question_id <- rownames(loadings)
      loadings$layer <- layer_name
      loadings$factor_count <- factor_count
      efa_rows[[length(efa_rows) + 1]] <- loadings
    }
  }

  factor_groups <- split(metadata$question_id[metadata$question_id %in% selected_ids],
                         metadata$axis_id[metadata$question_id %in% selected_ids])
  factor_groups <- factor_groups[vapply(factor_groups, length, integer(1)) >= 3]
  if (length(factor_groups) < 1) next
  model_lines <- vapply(names(factor_groups), function(axis_id) {
    paste0(sanitize_factor(axis_id), " =~ ", paste(factor_groups[[axis_id]], collapse = " + "))
  }, character(1))
  cfa_model <- paste(model_lines, collapse = "\n")
  ordered_items <- unique(unlist(factor_groups, use.names = FALSE))
  holdout <- holdout[, ordered_items, drop = FALSE]
  fit <- tryCatch(
    lavaan::cfa(cfa_model, data = holdout, ordered = ordered_items, estimator = "WLSMV", std.lv = TRUE),
    error = function(error) NULL
  )
  if (is.null(fit)) {
    cfa_rows[[length(cfa_rows) + 1]] <- data.frame(layer = layer_name, status = "model-failed", n = nrow(holdout))
  } else {
    measures <- lavaan::fitMeasures(fit, c("cfi", "tli", "rmsea", "srmr"))
    cfa_rows[[length(cfa_rows) + 1]] <- data.frame(
      layer = layer_name,
      status = "estimated",
      n = nrow(holdout),
      cfi = unname(measures[["cfi"]]),
      tli = unname(measures[["tli"]]),
      rmsea = unname(measures[["rmsea"]]),
      srmr = unname(measures[["srmr"]]),
      stringsAsFactors = FALSE
    )
  }
}

if (length(efa_rows) > 0) utils::write.csv(do.call(rbind, efa_rows), file.path(output_dir, "efa-loadings.csv"), row.names = FALSE)
if (length(cfa_rows) > 0) utils::write.csv(do.call(rbind, cfa_rows), file.path(output_dir, "cfa-fit.csv"), row.names = FALSE)

run_dif <- function(group_name) {
  groups <- vapply(submissions[test_rows], function(record) record$identity[[group_name]] %||% "", character(1))
  valid <- nzchar(groups)
  groups <- groups[valid]
  if (length(unique(groups)) < 2 || any(table(groups) < minimum_dif_group_n)) return(data.frame())
  data_rows <- which(test_rows)[valid]
  results <- list()
  for (axis_id in axis_ids) {
    ids <- metadata$question_id[metadata$axis_id == axis_id]
    ids <- ids[colSums(!is.na(oriented_matrix[data_rows, ids, drop = FALSE])) >= minimum_dif_group_n * 2]
    if (length(ids) < 5) next
    axis_data <- as.data.frame(oriented_matrix[data_rows, ids, drop = FALSE])
    complete <- stats::complete.cases(axis_data)
    axis_data <- axis_data[complete, , drop = FALSE]
    axis_groups <- droplevels(factor(groups[complete]))
    if (nrow(axis_data) < minimum_dif_group_n * 2 || any(table(axis_groups) < minimum_dif_group_n)) next
    model <- tryCatch(
      mirt::multipleGroup(axis_data, 1, group = axis_groups, itemtype = "graded",
                          invariance = c("slopes", "intercepts", "free_means", "free_var"), verbose = FALSE),
      error = function(error) NULL
    )
    if (is.null(model)) next
    dif <- tryCatch(
      as.data.frame(mirt::DIF(model, which.par = c("a1", "d"), items2test = seq_len(ncol(axis_data)),
                              scheme = "drop", p.adjust = "BH")),
      error = function(error) NULL
    )
    if (is.null(dif) || nrow(dif) == 0) next
    dif$question_id <- rownames(dif)
    dif$axis_id <- axis_id
    dif$group_variable <- group_name
    results[[length(results) + 1]] <- dif
  }
  if (length(results) == 0) data.frame() else do.call(rbind, results)
}

dif_results <- lapply(c("ageBand", "genderGroup"), run_dif)
dif_results <- dif_results[vapply(dif_results, nrow, integer(1)) > 0]
if (length(dif_results) > 0) utils::write.csv(do.call(rbind, dif_results), file.path(output_dir, "dif-results.csv"), row.names = FALSE)

source_summary <- data.frame(
  descriptive_items = sum(metadata$layer == "descriptive"),
  sourced_items = sum(metadata$layer == "descriptive" & metadata$source_count > 0),
  operationalized_items = sum(metadata$layer == "descriptive" & metadata$operationalized),
  stringsAsFactors = FALSE
)
source_summary$sourced_rate <- if (source_summary$descriptive_items == 0) 0 else source_summary$sourced_items / source_summary$descriptive_items
source_summary$operationalized_rate <- if (source_summary$descriptive_items == 0) 0 else source_summary$operationalized_items / source_summary$descriptive_items
utils::write.csv(source_summary, file.path(output_dir, "source-coverage.csv"), row.names = FALSE)

summary <- list(
  generatedAt = format(Sys.time(), tz = "UTC", usetz = TRUE),
  submissionCount = length(submissions),
  uniqueParticipantCount = length(unique(participant_ids)),
  testCount = sum(test_rows),
  retestCount = sum(retest_rows),
  bankVersions = bank_versions,
  scoringVersions = scoring_versions,
  eligibleItemCount = length(eligible_ids),
  excludedNeedsRewriteCount = sum(vapply(item_registry, function(item) identical(item$reviewStatus, "needs-rewrite"), logical(1))),
  criterionCount = nrow(criterion_data),
  criterionTop1Rate = if (nrow(criterion_data) == 0) NULL else mean(criterion_data$top1),
  criterionTop3Rate = if (nrow(criterion_data) == 0) NULL else mean(criterion_data$top3),
  thresholds = list(
    minimumAxisN = minimum_axis_n,
    minimumFactorN = minimum_factor_n,
    minimumDifGroupN = minimum_dif_group_n,
    bootstrapReplicates = bootstrap_replicates
  ),
  limitations = c(
    "Estimates are valid only for the submitted sampling frame and bank/scoring versions.",
    "Ipsative statement-choice items and items marked needs-rewrite are excluded from common-scale reliability and factor analyses.",
    "CFA uses a primary-axis model and WLSMV on a held-out split; cross-loadings require substantive review.",
    "DIF flags require follow-up review and do not by themselves prove bias."
  )
)
jsonlite::write_json(summary, file.path(output_dir, "validation-summary.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
cat("Validation outputs written to", normalizePath(output_dir), "\n")
