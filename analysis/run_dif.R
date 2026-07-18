#!/usr/bin/env Rscript

required_packages <- c("jsonlite", "mirt")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop("Missing required R packages: ", paste(missing_packages, collapse = ", "))
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

bind_rows_fill <- function(rows) {
  if (length(rows) == 0) return(data.frame())
  columns <- unique(unlist(lapply(rows, names), use.names = FALSE))
  normalized <- lapply(rows, function(row) {
    for (column in setdiff(columns, names(row))) row[[column]] <- NA
    row[, columns, drop = FALSE]
  })
  do.call(rbind, normalized)
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript analysis/run_dif.R <submissions.json|jsonl|directory> <output-directory>")
}

input_path <- args[[1]]
output_dir <- args[[2]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
minimum_group_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_DIF_GROUP_N", "100"))

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

recode_ordinal <- function(data) {
  result <- lapply(data, function(column) {
    observed_levels <- sort(unique(column))
    as.integer(match(column, observed_levels) - 1L)
  })
  as.data.frame(result, check.names = FALSE)
}

sanitize_group_labels <- function(values) {
  sanitized <- values
  observed <- unique(values[nzchar(values)])
  mapping <- setNames(make.names(observed, unique = TRUE), observed)
  sanitized[nzchar(values)] <- unname(mapping[values[nzchar(values)]])
  sanitized
}

submissions <- read_submissions(input_path)
submissions <- submissions[vapply(submissions, function(record) {
  !is.null(record$schemaVersion) && !is.null(record$participantId) && !is.null(record$answers) &&
    identical(record$administration %||% "test", "test")
}, logical(1))]
if (length(submissions) == 0) stop("No valid test-administration records were found.")

item_registry <- list()
for (record in submissions) {
  for (item in record$itemMap %||% list()) {
    question_id <- item$questionId
    if (!is.null(question_id) && is.null(item_registry[[question_id]])) item_registry[[question_id]] <- item
  }
}
eligible_ids <- names(item_registry)[vapply(item_registry, eligible_item, logical(1))]
if (length(eligible_ids) == 0) stop("No eligible Likert items were found.")

metadata <- data.frame(
  question_id = eligible_ids,
  axis_id = vapply(item_registry[eligible_ids], primary_axis, character(1)),
  stringsAsFactors = FALSE
)
response_matrix <- matrix(
  NA_real_,
  nrow = length(submissions),
  ncol = length(eligible_ids),
  dimnames = list(vapply(submissions, function(record) record$participantId, character(1)), eligible_ids)
)

for (row_index in seq_along(submissions)) {
  answers <- submissions[[row_index]]$answers
  for (question_id in eligible_ids) {
    value <- answers[[question_id]]$value %||% NA
    if (is.numeric(value) && length(value) == 1 && is.finite(value)) {
      item <- item_registry[[question_id]]
      sign_value <- sign(primary_weight(item))
      if (isTRUE(item$reverseScored)) sign_value <- -sign_value
      response_matrix[row_index, question_id] <- as.numeric(value) * sign_value
    }
  }
}

resolve_question_ids <- function(dif, tested_items) {
  row_ids <- rownames(dif)
  if (length(row_ids) == nrow(dif) && all(row_ids %in% tested_items)) return(row_ids)
  numeric_ids <- suppressWarnings(as.integer(row_ids))
  if (length(numeric_ids) == nrow(dif) && all(!is.na(numeric_ids)) && all(numeric_ids >= 1 & numeric_ids <= length(tested_items))) {
    return(tested_items[numeric_ids])
  }
  if (nrow(dif) == length(tested_items)) return(tested_items)
  row_ids
}

result_rows <- list()
diagnostic_rows <- list()

for (group_name in c("ageBand", "genderGroup")) {
  raw_groups <- vapply(submissions, function(record) {
    identity <- record$identity %||% list()
    identity[[group_name]] %||% ""
  }, character(1))
  valid_group <- nzchar(raw_groups)
  group_counts <- table(raw_groups[valid_group])
  if (length(group_counts) < 2 || any(group_counts < minimum_group_n)) {
    diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
      group_variable = group_name,
      axis_id = NA_character_,
      status = "insufficient-groups",
      usable_n = sum(valid_group),
      message = paste(names(group_counts), group_counts, collapse = "; "),
      stringsAsFactors = FALSE
    )
    next
  }
  groups <- sanitize_group_labels(raw_groups)

  for (axis_id in sort(unique(metadata$axis_id))) {
    item_ids <- metadata$question_id[metadata$axis_id == axis_id]
    item_ids <- item_ids[colSums(!is.na(response_matrix[valid_group, item_ids, drop = FALSE])) >= minimum_group_n * 2]
    if (length(item_ids) < 5) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "insufficient-items",
        usable_n = sum(valid_group),
        message = paste("eligible items:", length(item_ids)),
        stringsAsFactors = FALSE
      )
      next
    }

    axis_data <- as.data.frame(response_matrix[valid_group, item_ids, drop = FALSE])
    complete <- stats::complete.cases(axis_data)
    axis_data <- axis_data[complete, , drop = FALSE]
    axis_groups <- droplevels(factor(groups[valid_group][complete]))
    if (nrow(axis_data) < minimum_group_n * 2 || any(table(axis_groups) < minimum_group_n)) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "insufficient-complete-cases",
        usable_n = nrow(axis_data),
        message = paste(names(table(axis_groups)), table(axis_groups), collapse = "; "),
        stringsAsFactors = FALSE
      )
      next
    }

    axis_data <- recode_ordinal(axis_data)
    baseline <- tryCatch(
      mirt::multipleGroup(
        axis_data,
        1,
        group = axis_groups,
        itemtype = "graded",
        invariance = c(colnames(axis_data), "free_means", "free_var"),
        verbose = FALSE
      ),
      error = function(error) error
    )
    if (inherits(baseline, "error")) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "baseline-failed",
        usable_n = nrow(axis_data),
        message = conditionMessage(baseline),
        stringsAsFactors = FALSE
      )
      next
    }

    fitted_parameters <- unique(mirt::mod2values(baseline)$name)
    threshold_parameters <- grep("^d[0-9]+$", fitted_parameters, value = TRUE)
    which_parameters <- unique(c("a1", threshold_parameters))
    which_parameters <- which_parameters[which_parameters %in% fitted_parameters]
    if (length(which_parameters) < 2) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "parameters-unavailable",
        usable_n = nrow(axis_data),
        message = paste("available:", paste(fitted_parameters, collapse = ", ")),
        stringsAsFactors = FALSE
      )
      next
    }

    dif <- tryCatch(
      as.data.frame(mirt::DIF(
        baseline,
        which.par = which_parameters,
        items2test = colnames(axis_data),
        scheme = "drop",
        p.adjust = "BH",
        verbose = FALSE
      )),
      error = function(error) error
    )
    if (inherits(dif, "error")) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "dif-failed",
        usable_n = nrow(axis_data),
        message = conditionMessage(dif),
        stringsAsFactors = FALSE
      )
      next
    }
    if (nrow(dif) == 0) {
      diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
        group_variable = group_name,
        axis_id = axis_id,
        status = "no-results",
        usable_n = nrow(axis_data),
        message = "DIF returned zero rows.",
        stringsAsFactors = FALSE
      )
      next
    }

    dif$question_id <- resolve_question_ids(dif, colnames(axis_data))
    dif$axis_id <- axis_id
    dif$group_variable <- group_name
    result_rows[[length(result_rows) + 1]] <- dif
    diagnostic_rows[[length(diagnostic_rows) + 1]] <- data.frame(
      group_variable = group_name,
      axis_id = axis_id,
      status = "estimated",
      usable_n = nrow(axis_data),
      message = paste("tested items:", ncol(axis_data), "parameters:", paste(which_parameters, collapse = ",")),
      stringsAsFactors = FALSE
    )
  }
}

results <- bind_rows_fill(result_rows)
if (nrow(results) == 0) {
  results <- data.frame(
    question_id = character(0),
    axis_id = character(0),
    group_variable = character(0),
    stringsAsFactors = FALSE
  )
}
utils::write.csv(results, file.path(output_dir, "dif-results.csv"), row.names = FALSE)
utils::write.csv(bind_rows_fill(diagnostic_rows), file.path(output_dir, "dif-diagnostics.csv"), row.names = FALSE)
cat("DIF outputs written to", normalizePath(output_dir), "\n")
