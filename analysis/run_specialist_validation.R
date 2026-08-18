#!/usr/bin/env Rscript

required_packages <- c("jsonlite", "psych")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(
    "Missing required R packages: ",
    paste(missing_packages, collapse = ", "),
    ". Install them before running this script."
  )
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x
clean_contract_fields <- c(
  "manifest_version",
  "manifest_fingerprint",
  "serialization_version",
  "contract_route",
  "contract_cohort"
)

metadata_value_present <- function(value) {
  is.character(value) &&
    length(value) == 1 &&
    !is.na(value) &&
    nzchar(trimws(value))
}

extract_contract_metadata <- function(record) {
  sources <- list(
    record,
    record$contractMetadata,
    record$researchContract,
    record$canonicalContract,
    record$contract
  )
  sources <- sources[vapply(sources, is.list, logical(1))]
  value_for <- function(keys) {
    for (source in sources) {
      for (key in keys) {
        value <- source[[key]]
        if (metadata_value_present(value)) return(trimws(value))
      }
    }
    ""
  }
  list(
    manifest_version = value_for(c("manifestVersion", "canonicalManifestVersion", "manifest_version")),
    manifest_fingerprint = value_for(c("manifestFingerprint", "canonicalManifestFingerprint", "manifest_fingerprint")),
    serialization_version = value_for(c("serializationVersion", "serialization_version")),
    contract_route = value_for(c("contractRoute", "contract_route", "route")),
    contract_cohort = value_for(c("cohort", "contractCohort", "contract_cohort"))
  )
}

validate_contract_metadata <- function(metadata) {
  if (length(metadata) == 0) return(invisible(NULL))
  clean_flags <- vapply(metadata, function(entry) {
    any(vapply(entry[clean_contract_fields], metadata_value_present, logical(1)))
  }, logical(1))
  if (any(clean_flags)) {
    missing <- vapply(metadata, function(entry) {
      missing_fields <- clean_contract_fields[!vapply(entry[clean_contract_fields], metadata_value_present, logical(1))]
      if (length(missing_fields) == 0) "" else paste(missing_fields, collapse = ", ")
    }, character(1))
    if (any(!clean_flags | nzchar(missing))) {
      stop(
        "Clean contract metadata requires non-empty ",
        paste(clean_contract_fields, collapse = ", "),
        " for every input record; missing fields: ",
        paste(unique(missing[nzchar(missing) | !clean_flags]), collapse = "; ")
      )
    }
    for (entry in metadata) {
      if (any(vapply(entry[clean_contract_fields], function(value) {
        identical(tolower(trimws(value)), "unknown")
      }, logical(1)))) {
        stop("Clean contract metadata must not contain unknown values.")
      }
    }
  }
  for (field in clean_contract_fields) {
    values <- unique(vapply(metadata, `[[`, character(1), field))
    values <- values[nzchar(values)]
    if (length(values) > 1) {
      stop("Mixed non-empty ", field, " values detected in Specialist fixture: ", paste(values, collapse = ", "))
    }
  }
  invisible(NULL)
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 3) {
  stop(
    "Usage: Rscript analysis/run_specialist_validation.R ",
    "<core-submissions.json|jsonl|directory> <specialist-submissions.json|jsonl|directory> <output-directory>"
  )
}

core_input <- args[[1]]
specialist_input <- args[[2]]
output_dir <- args[[3]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
minimum_reliability_n <- as.integer(Sys.getenv("SPECIALIST_MINIMUM_RELIABILITY_N", "30"))
minimum_retest_n <- as.integer(Sys.getenv("SPECIALIST_MINIMUM_RETEST_N", "30"))

read_json_file <- function(path) {
  parsed <- jsonlite::fromJSON(path, simplifyVector = FALSE)
  if (!is.null(parsed$schemaVersion)) list(parsed) else parsed
}

read_records <- function(path) {
  if (dir.exists(path)) {
    files <- list.files(path, pattern = "\\.json$", full.names = TRUE)
    return(unlist(lapply(files, read_json_file), recursive = FALSE))
  }
  if (!file.exists(path)) return(list())
  if (grepl("\\.(jsonl|ndjson)$", path, ignore.case = TRUE)) {
    lines <- readLines(path, warn = FALSE)
    lines <- lines[nzchar(trimws(lines))]
    return(lapply(lines, jsonlite::fromJSON, simplifyVector = FALSE))
  }
  read_json_file(path)
}

core_records <- read_records(core_input)
core_records <- core_records[vapply(core_records, function(record) {
  (is.null(record$recordType) || identical(record$recordType, "core")) &&
    !is.null(record$participantId) && !is.null(record$administration)
}, logical(1))]

specialist_input_records <- read_records(specialist_input)
specialist_records <- specialist_input_records[vapply(specialist_input_records, function(record) {
  identical(record$recordType, "specialist") &&
    !is.null(record$participantId) && !is.null(record$administration) && !is.null(record$moduleId)
}, logical(1))]
disposition_records <- specialist_input_records[vapply(specialist_input_records, function(record) {
  identical(record$recordType, "specialist-disposition") &&
    !is.null(record$participantId) && !is.null(record$administration) && !is.null(record$moduleId)
}, logical(1))]
specialist_contract_metadata <- lapply(
  c(core_records, specialist_records, disposition_records),
  extract_contract_metadata
)
validate_contract_metadata(specialist_contract_metadata)

empty_csv <- function(path, columns) {
  frame <- as.data.frame(setNames(replicate(length(columns), character(0), simplify = FALSE), columns), stringsAsFactors = FALSE)
  utils::write.csv(frame, path, row.names = FALSE)
}

assignment_rows <- lapply(core_records, function(record) {
  assignment <- record$specialistAssignment
  if (is.null(assignment) || is.null(assignment$moduleId)) return(NULL)
  data.frame(
    participant_id = record$participantId,
    administration = record$administration,
    module_id = assignment$moduleId,
    strategy = assignment$strategy %||% "unknown",
    roster_version = assignment$rosterVersion %||% "unknown",
    stringsAsFactors = FALSE
  )
})
assignment_rows <- assignment_rows[!vapply(assignment_rows, is.null, logical(1))]
assignments <- if (length(assignment_rows) > 0) unique(do.call(rbind, assignment_rows)) else data.frame()

completion_rows <- lapply(specialist_records, function(record) {
  assignment <- record$assignment %||% list()
  data.frame(
    participant_id = record$participantId,
    administration = record$administration,
    module_id = record$moduleId,
    strategy = assignment$strategy %||% "unknown",
    roster_version = assignment$rosterVersion %||% "unknown",
    stringsAsFactors = FALSE
  )
})
completions <- if (length(completion_rows) > 0) unique(do.call(rbind, completion_rows)) else data.frame()

disposition_rows <- lapply(disposition_records, function(record) {
  assignment <- record$assignment %||% list()
  data.frame(
    participant_id = record$participantId,
    administration = record$administration,
    module_id = record$moduleId,
    strategy = assignment$strategy %||% "unknown",
    roster_version = assignment$rosterVersion %||% "unknown",
    disposition = record$disposition %||% "unknown",
    answered_count = as.numeric(record$answeredCount %||% 0),
    duration_ms = as.numeric(record$durationMs %||% 0),
    completed_at = record$completedAt %||% "",
    stringsAsFactors = FALSE
  )
})
dispositions <- if (length(disposition_rows) > 0) do.call(rbind, disposition_rows) else data.frame()
if (nrow(dispositions) > 0) {
  utils::write.csv(dispositions, file.path(output_dir, "specialist-dispositions.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-dispositions.csv"), c(
    "participant_id", "administration", "module_id", "strategy", "roster_version", "disposition", "answered_count", "duration_ms", "completed_at"
  ))
}

if (nrow(assignments) > 0) {
  uptake_rows <- list()
  group_keys <- unique(assignments[, c("administration", "module_id", "strategy", "roster_version"), drop = FALSE])
  for (row_index in seq_len(nrow(group_keys))) {
    administration <- group_keys$administration[[row_index]]
    module_id <- group_keys$module_id[[row_index]]
    strategy <- group_keys$strategy[[row_index]]
    roster_version <- group_keys$roster_version[[row_index]]
    assigned <- assignments[
      assignments$administration == administration & assignments$module_id == module_id
        & assignments$strategy == strategy & assignments$roster_version == roster_version,
      , drop = FALSE
    ]
    completed <- if (nrow(completions) > 0) completions[
      completions$administration == administration & completions$module_id == module_id
        & completions$strategy == strategy & completions$roster_version == roster_version,
      , drop = FALSE
    ] else data.frame()
    declined <- if (nrow(dispositions) > 0) dispositions[
      dispositions$administration == administration & dispositions$module_id == module_id
        & dispositions$strategy == strategy & dispositions$roster_version == roster_version,
      , drop = FALSE
    ] else data.frame()

    completed_ids <- if (nrow(completed) > 0) unique(completed$participant_id) else character(0)
    declined_ids <- if (nrow(declined) > 0) unique(declined$participant_id) else character(0)
    declined_ids <- setdiff(declined_ids, completed_ids)
    assigned_ids <- unique(assigned$participant_id)
    unresolved_ids <- setdiff(assigned_ids, union(completed_ids, declined_ids))

    uptake_rows[[length(uptake_rows) + 1]] <- data.frame(
      administration = administration,
      module_id = module_id,
      strategy = strategy,
      roster_version = roster_version,
      assigned_n = length(assigned_ids),
      completed_n = sum(assigned_ids %in% completed_ids),
      explicit_declined_n = sum(assigned_ids %in% declined_ids),
      unresolved_n = length(unresolved_ids),
      completion_rate = if (length(assigned_ids) > 0) sum(assigned_ids %in% completed_ids) / length(assigned_ids) else NA_real_,
      explicit_decline_rate = if (length(assigned_ids) > 0) sum(assigned_ids %in% declined_ids) / length(assigned_ids) else NA_real_,
      unresolved_rate = if (length(assigned_ids) > 0) length(unresolved_ids) / length(assigned_ids) else NA_real_,
      stringsAsFactors = FALSE
    )
  }
  utils::write.csv(do.call(rbind, uptake_rows), file.path(output_dir, "specialist-module-uptake.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-module-uptake.csv"), c(
    "administration", "module_id", "strategy", "roster_version", "assigned_n", "completed_n", "explicit_declined_n", "unresolved_n",
    "completion_rate", "explicit_decline_rate", "unresolved_rate"
  ))
}

if (nrow(dispositions) > 0) {
  disposition_summary <- stats::aggregate(
    list(n = dispositions$participant_id),
    by = list(
      administration = dispositions$administration,
      module_id = dispositions$module_id,
      strategy = dispositions$strategy,
      roster_version = dispositions$roster_version,
      disposition = dispositions$disposition
    ),
    FUN = length
  )
  utils::write.csv(disposition_summary, file.path(output_dir, "specialist-disposition-summary.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-disposition-summary.csv"), c(
    "administration", "module_id", "strategy", "roster_version", "disposition", "n"
  ))
}

match_option_id <- function(match) {
  id <- match$id %||% ""
  variant <- tolower(match$variant %||% "")
  if (identical(id, "black-nationalism") && grepl("community", variant)) return("black-nationalism:community")
  if (identical(id, "black-nationalism") && grepl("separat", variant)) return("black-nationalism:separatist")
  if (identical(id, "indigenism") && grepl("institution", variant)) return("indigenism:institutional")
  if (identical(id, "indigenism") && grepl("resurgence|refusal", variant)) return("indigenism:resurgence")
  id
}

criterion_rows <- list()
criterion_summary_rows <- list()
for (record in specialist_records) {
  selected_ids <- unlist(record$criterion$selectedIds %||% list(), use.names = FALSE)
  matches <- record$matches %||% list()
  eligible_matches <- matches[vapply(matches, function(match) {
    !isTRUE(match$insufficientEvidence) && !identical(match$evidenceStatus, "insufficient-evidence")
  }, logical(1))]
  match_option_ids <- vapply(eligible_matches, match_option_id, character(1))
  match_tradition_ids <- vapply(eligible_matches, function(match) match$id %||% "", character(1))
  selected_tradition_ids <- unique(sub(":.*$", "", selected_ids))

  criterion_summary_rows[[length(criterion_summary_rows) + 1]] <- data.frame(
    participant_id = record$participantId,
    administration = record$administration,
    module_id = record$moduleId,
    none_or_unsure = isTRUE(record$criterion$noneOrUnsure),
    confidence = record$criterion$confidence %||% "unknown",
    selected_count = length(selected_ids),
    stringsAsFactors = FALSE
  )

  if (length(selected_ids) == 0) next
  for (selected_id in selected_ids) {
    tradition_id <- sub(":.*$", "", selected_id)
    criterion_rows[[length(criterion_rows) + 1]] <- data.frame(
      participant_id = record$participantId,
      administration = record$administration,
      module_id = record$moduleId,
      selected_id = selected_id,
      tradition_id = tradition_id,
      confidence = record$criterion$confidence %||% "unknown",
      variant_top1 = length(match_option_ids) >= 1 && identical(match_option_ids[[1]], selected_id),
      variant_top3 = selected_id %in% head(match_option_ids, 3),
      tradition_top1 = length(match_tradition_ids) >= 1 && identical(match_tradition_ids[[1]], tradition_id),
      tradition_top3 = tradition_id %in% head(match_tradition_ids, 3),
      selected_traditions = paste(selected_tradition_ids, collapse = ";"),
      stringsAsFactors = FALSE
    )
  }
}

if (length(criterion_rows) > 0) {
  utils::write.csv(do.call(rbind, criterion_rows), file.path(output_dir, "specialist-criterion-concordance.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-criterion-concordance.csv"), c(
    "participant_id", "administration", "module_id", "selected_id", "tradition_id", "confidence",
    "variant_top1", "variant_top3", "tradition_top1", "tradition_top3", "selected_traditions"
  ))
}
if (length(criterion_summary_rows) > 0) {
  utils::write.csv(do.call(rbind, criterion_summary_rows), file.path(output_dir, "specialist-criterion-response.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-criterion-response.csv"), c(
    "participant_id", "administration", "module_id", "none_or_unsure", "confidence", "selected_count"
  ))
}

evidence_rows <- lapply(specialist_records, function(record) {
  evidence <- record$evidence %||% list()
  data.frame(
    participant_id = record$participantId,
    administration = record$administration,
    module_id = record$moduleId,
    answered_item_count = as.numeric(evidence$answeredItemCount %||% NA),
    total_item_count = as.numeric(evidence$totalItemCount %||% NA),
    answered_coverage = as.numeric(evidence$answeredCoverage %||% NA),
    weighted_answered_coverage = as.numeric(evidence$weightedAnsweredCoverage %||% NA),
    effective_item_count = as.numeric(evidence$effectiveItemCount %||% NA),
    evidence_status = evidence$status %||% "legacy-unknown",
    stringsAsFactors = FALSE
  )
})
if (length(evidence_rows) > 0) {
  utils::write.csv(do.call(rbind, evidence_rows), file.path(output_dir, "specialist-evidence.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-evidence.csv"), c(
    "participant_id", "administration", "module_id", "answered_item_count", "total_item_count",
    "answered_coverage", "weighted_answered_coverage", "effective_item_count", "evidence_status"
  ))
}

safe_ratio <- function(numerator, denominator) {
  if (denominator > 0) numerator / denominator else NA_real_
}

multilabel_rows <- list()
label_metric_rows <- list()
coidentification_rows <- list()
for (record in specialist_records) {
  selected_ids <- unique(unlist(record$criterion$selectedIds %||% list(), use.names = FALSE))
  if (length(selected_ids) == 0) next
  matches <- record$matches %||% list()
  eligible_matches <- matches[vapply(matches, function(match) {
    !isTRUE(match$insufficientEvidence) && !identical(match$evidenceStatus, "insufficient-evidence")
  }, logical(1))]
  ranked_ids <- unique(vapply(eligible_matches, match_option_id, character(1)))
  for (cutoff in c(1L, 3L)) {
    predicted_ids <- head(ranked_ids, cutoff)
    true_positive <- length(intersect(selected_ids, predicted_ids))
    false_positive <- length(setdiff(predicted_ids, selected_ids))
    false_negative <- length(setdiff(selected_ids, predicted_ids))
    precision <- safe_ratio(true_positive, length(predicted_ids))
    recall <- safe_ratio(true_positive, length(selected_ids))
    f1 <- if (is.na(precision) || is.na(recall) || precision + recall == 0) NA_real_ else 2 * precision * recall / (precision + recall)
    union_count <- length(union(selected_ids, predicted_ids))
    multilabel_rows[[length(multilabel_rows) + 1]] <- data.frame(
      participant_id = record$participantId,
      administration = record$administration,
      module_id = record$moduleId,
      cutoff = cutoff,
      selected_count = length(selected_ids),
      predicted_count = length(predicted_ids),
      true_positive = true_positive,
      false_positive = false_positive,
      false_negative = false_negative,
      precision = precision,
      recall = recall,
      f1 = f1,
      jaccard = safe_ratio(true_positive, union_count),
      exact_set_match = setequal(selected_ids, predicted_ids),
      stringsAsFactors = FALSE
    )
    for (label_id in union(selected_ids, predicted_ids)) {
      label_metric_rows[[length(label_metric_rows) + 1]] <- data.frame(
        module_id = record$moduleId,
        cutoff = cutoff,
        label_id = label_id,
        truth = label_id %in% selected_ids,
        predicted = label_id %in% predicted_ids,
        stringsAsFactors = FALSE
      )
    }
  }
  if (length(selected_ids) >= 2) {
    pairs <- combn(sort(selected_ids), 2, simplify = FALSE)
    for (pair in pairs) {
      coidentification_rows[[length(coidentification_rows) + 1]] <- data.frame(
        module_id = record$moduleId,
        first_label_id = pair[[1]],
        second_label_id = pair[[2]],
        stringsAsFactors = FALSE
      )
    }
  }
}
if (length(multilabel_rows) > 0) {
  multilabel_data <- do.call(rbind, multilabel_rows)
  utils::write.csv(multilabel_data, file.path(output_dir, "specialist-criterion-multilabel.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-criterion-multilabel.csv"), c(
    "participant_id", "administration", "module_id", "cutoff", "selected_count", "predicted_count",
    "true_positive", "false_positive", "false_negative", "precision", "recall", "f1", "jaccard", "exact_set_match"
  ))
}
if (length(label_metric_rows) > 0) {
  label_metric_data <- do.call(rbind, label_metric_rows)
  label_groups <- unique(label_metric_data[, c("module_id", "cutoff", "label_id"), drop = FALSE])
  label_summary_rows <- lapply(seq_len(nrow(label_groups)), function(row_index) {
    group <- label_groups[row_index, , drop = FALSE]
    subset_rows <- label_metric_data[
      label_metric_data$module_id == group$module_id[[1]] &
        label_metric_data$cutoff == group$cutoff[[1]] &
        label_metric_data$label_id == group$label_id[[1]],
      , drop = FALSE
    ]
    true_positive <- sum(subset_rows$truth & subset_rows$predicted)
    false_positive <- sum(!subset_rows$truth & subset_rows$predicted)
    false_negative <- sum(subset_rows$truth & !subset_rows$predicted)
    precision <- safe_ratio(true_positive, true_positive + false_positive)
    recall <- safe_ratio(true_positive, true_positive + false_negative)
    data.frame(
      module_id = group$module_id[[1]],
      cutoff = group$cutoff[[1]],
      label_id = group$label_id[[1]],
      support = sum(subset_rows$truth),
      true_positive = true_positive,
      false_positive = false_positive,
      false_negative = false_negative,
      precision = precision,
      recall = recall,
      f1 = if (is.na(precision) || is.na(recall) || precision + recall == 0) NA_real_ else 2 * precision * recall / (precision + recall),
      stringsAsFactors = FALSE
    )
  })
  utils::write.csv(do.call(rbind, label_summary_rows), file.path(output_dir, "specialist-label-metrics.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-label-metrics.csv"), c(
    "module_id", "cutoff", "label_id", "support", "true_positive", "false_positive", "false_negative",
    "precision", "recall", "f1"
  ))
}
if (length(coidentification_rows) > 0) {
  coidentification_data <- do.call(rbind, coidentification_rows)
  coidentification_summary <- stats::aggregate(
    list(coidentification_count = coidentification_data$first_label_id),
    by = coidentification_data[, c("module_id", "first_label_id", "second_label_id"), drop = FALSE],
    FUN = length
  )
  utils::write.csv(coidentification_summary, file.path(output_dir, "specialist-criterion-coidentification.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-criterion-coidentification.csv"), c(
    "module_id", "first_label_id", "second_label_id", "coidentification_count"
  ))
}

construct_rows <- list()
for (record in specialist_records) {
  scores <- record$constructScores %||% list()
  if (length(scores) == 0) next
  for (construct_id in names(scores)) {
    score <- as.numeric(scores[[construct_id]])
    if (!is.finite(score)) next
    construct_rows[[length(construct_rows) + 1]] <- data.frame(
      participant_id = record$participantId,
      administration = record$administration,
      module_id = record$moduleId,
      construct_id = construct_id,
      score = score,
      stringsAsFactors = FALSE
    )
  }
}
construct_data <- if (length(construct_rows) > 0) do.call(rbind, construct_rows) else data.frame()
if (nrow(construct_data) > 0) {
  utils::write.csv(construct_data, file.path(output_dir, "specialist-construct-scores.csv"), row.names = FALSE)
  summary_rows <- list()
  groups <- unique(construct_data[, c("administration", "module_id", "construct_id"), drop = FALSE])
  for (row_index in seq_len(nrow(groups))) {
    subset_rows <- construct_data[
      construct_data$administration == groups$administration[[row_index]] &
        construct_data$module_id == groups$module_id[[row_index]] &
        construct_data$construct_id == groups$construct_id[[row_index]],
      , drop = FALSE
    ]
    summary_rows[[length(summary_rows) + 1]] <- data.frame(
      administration = groups$administration[[row_index]],
      module_id = groups$module_id[[row_index]],
      construct_id = groups$construct_id[[row_index]],
      n = nrow(subset_rows),
      mean = mean(subset_rows$score, na.rm = TRUE),
      sd = stats::sd(subset_rows$score, na.rm = TRUE),
      stringsAsFactors = FALSE
    )
  }
  utils::write.csv(do.call(rbind, summary_rows), file.path(output_dir, "specialist-construct-summary.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-construct-scores.csv"), c(
    "participant_id", "administration", "module_id", "construct_id", "score"
  ))
  empty_csv(file.path(output_dir, "specialist-construct-summary.csv"), c(
    "administration", "module_id", "construct_id", "n", "mean", "sd"
  ))
}

retest_rows <- list()
if (nrow(construct_data) > 0) {
  groups <- unique(construct_data[, c("module_id", "construct_id"), drop = FALSE])
  for (row_index in seq_len(nrow(groups))) {
    module_id <- groups$module_id[[row_index]]
    construct_id <- groups$construct_id[[row_index]]
    subset_rows <- construct_data[
      construct_data$module_id == module_id & construct_data$construct_id == construct_id,
      , drop = FALSE
    ]
    paired <- list()
    for (participant_id in unique(subset_rows$participant_id)) {
      test_value <- subset_rows$score[subset_rows$participant_id == participant_id & subset_rows$administration == "test"]
      retest_value <- subset_rows$score[subset_rows$participant_id == participant_id & subset_rows$administration == "retest"]
      if (length(test_value) == 0 || length(retest_value) == 0) next
      paired[[length(paired) + 1]] <- c(test_value[[1]], retest_value[[1]])
    }
    paired_matrix <- if (length(paired) > 0) do.call(rbind, paired) else matrix(numeric(0), ncol = 2)
    paired_matrix <- paired_matrix[stats::complete.cases(paired_matrix), , drop = FALSE]
    correlation <- if (nrow(paired_matrix) >= minimum_retest_n) stats::cor(paired_matrix[, 1], paired_matrix[, 2]) else NA_real_
    retest_rows[[length(retest_rows) + 1]] <- data.frame(
      module_id = module_id,
      construct_id = construct_id,
      pair_n = nrow(paired_matrix),
      test_retest_correlation = correlation,
      status = if (nrow(paired_matrix) < minimum_retest_n) "insufficient-data" else "estimated",
      stringsAsFactors = FALSE
    )
  }
}
if (length(retest_rows) > 0) {
  utils::write.csv(do.call(rbind, retest_rows), file.path(output_dir, "specialist-test-retest.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-test-retest.csv"), c(
    "module_id", "construct_id", "pair_n", "test_retest_correlation", "status"
  ))
}

safe_alpha <- function(data) {
  data <- as.data.frame(data)
  if (ncol(data) < 2 || nrow(data) < minimum_reliability_n) return(NA_real_)
  variable <- vapply(data, function(column) {
    values <- column[is.finite(column)]
    length(values) >= 3 && stats::sd(values) > 0
  }, logical(1))
  data <- data[, variable, drop = FALSE]
  if (ncol(data) < 2) return(NA_real_)
  tryCatch(
    suppressWarnings(psych::alpha(data, check.keys = FALSE, warnings = FALSE)$total$raw_alpha),
    error = function(error) NA_real_
  )
}

primary_construct_for_item <- function(item) {
  weights <- unlist(item$constructWeights %||% list(), use.names = TRUE)
  numeric_weights <- as.numeric(weights)
  valid <- is.finite(numeric_weights) & numeric_weights != 0
  if (!any(valid)) return(NA_character_)
  weights <- weights[valid]
  names(weights)[which.max(abs(as.numeric(weights)))]
}

reliability_rows <- list()
module_ids <- unique(vapply(specialist_records, function(record) record$moduleId, character(1)))
for (module_id in module_ids) {
  module_records <- specialist_records[vapply(specialist_records, function(record) {
    identical(record$moduleId, module_id) && identical(record$administration, "test")
  }, logical(1))]
  if (length(module_records) == 0) next

  item_registry <- list()
  for (record in module_records) {
    for (item in record$itemMap %||% list()) {
      if (!is.null(item$questionId) && is.null(item_registry[[item$questionId]])) item_registry[[item$questionId]] <- item
    }
  }
  construct_ids <- unique(unlist(lapply(item_registry, function(item) names(item$constructWeights %||% list())), use.names = FALSE))
  for (construct_id in construct_ids) {
    all_item_ids <- names(item_registry)[vapply(item_registry, function(item) {
      weight <- as.numeric((item$constructWeights %||% list())[[construct_id]] %||% 0)
      is.finite(weight) && weight != 0
    }, logical(1))]
    primary_item_ids <- all_item_ids[vapply(all_item_ids, function(item_id) {
      identical(primary_construct_for_item(item_registry[[item_id]]), construct_id)
    }, logical(1))]
    secondary_item_count <- length(setdiff(all_item_ids, primary_item_ids))
    if (length(primary_item_ids) < 2) {
      reliability_rows[[length(reliability_rows) + 1]] <- data.frame(
        module_id = module_id,
        construct_id = construct_id,
        item_count = length(primary_item_ids),
        primary_item_count = length(primary_item_ids),
        secondary_item_count = secondary_item_count,
        respondent_n = length(module_records),
        complete_case_n = 0,
        alpha = NA_real_,
        indicator_policy = "primary-largest-absolute-loading",
        status = "insufficient-primary-indicators",
        stringsAsFactors = FALSE
      )
      next
    }
    item_ids <- primary_item_ids

    matrix_values <- matrix(
      NA_real_,
      nrow = length(module_records),
      ncol = length(item_ids),
      dimnames = list(NULL, item_ids)
    )
    for (record_index in seq_along(module_records)) {
      record <- module_records[[record_index]]
      for (question_id in item_ids) {
        answer <- record$answers[[question_id]]
        value <- answer$value %||% NA
        if (!is.numeric(value) || length(value) != 1) next
        item <- item_registry[[question_id]]
        weight <- as.numeric((item$constructWeights %||% list())[[construct_id]] %||% 0)
        direction <- sign(weight)
        if (isTRUE(item$reverseScored)) direction <- -direction
        matrix_values[record_index, question_id] <- value * direction
      }
    }

    alpha <- safe_alpha(matrix_values)
    reliability_rows[[length(reliability_rows) + 1]] <- data.frame(
      module_id = module_id,
      construct_id = construct_id,
      item_count = length(item_ids),
      primary_item_count = length(primary_item_ids),
      secondary_item_count = secondary_item_count,
      respondent_n = nrow(matrix_values),
      complete_case_n = sum(stats::complete.cases(matrix_values)),
      alpha = alpha,
      indicator_policy = "primary-largest-absolute-loading",
      status = if (nrow(matrix_values) < minimum_reliability_n) "insufficient-data" else if (is.na(alpha)) "estimation-failed" else "estimated",
      stringsAsFactors = FALSE
    )
  }
}
if (length(reliability_rows) > 0) {
  utils::write.csv(do.call(rbind, reliability_rows), file.path(output_dir, "specialist-construct-reliability.csv"), row.names = FALSE)
} else {
  empty_csv(file.path(output_dir, "specialist-construct-reliability.csv"), c(
    "module_id", "construct_id", "item_count", "primary_item_count", "secondary_item_count",
    "respondent_n", "complete_case_n", "alpha", "indicator_policy", "status"
  ))
}

cat(
  "Specialist validation outputs written to ", normalizePath(output_dir, mustWork = FALSE), "\n",
  "Core assignments: ", nrow(assignments), "\n",
  "Specialist completions: ", nrow(completions), "\n",
  "Explicit dispositions: ", nrow(dispositions), "\n",
  sep = ""
)
