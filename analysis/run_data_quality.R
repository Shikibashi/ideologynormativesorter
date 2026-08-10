#!/usr/bin/env Rscript

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Missing required R package: jsonlite")
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript analysis/run_data_quality.R <submissions.json|jsonl|directory> <output-directory>")
}

input_path <- args[[1]]
output_dir <- args[[2]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

minimum_duration_ms <- as.numeric(Sys.getenv("QUALITY_MINIMUM_DURATION_MS", "0"))
maximum_missing_rate <- as.numeric(Sys.getenv("QUALITY_MAXIMUM_MISSING_RATE", "0.40"))
maximum_invariant_rate <- as.numeric(Sys.getenv("QUALITY_MAXIMUM_INVARIANT_RATE", "0.95"))

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

normalize_self_reported_ideologies <- function(value) {
  if (is.null(value) || length(value) == 0 || !nzchar(trimws(as.character(value[[1]])))) {
    return(character(0))
  }
  raw <- gsub("[\\r\\n]+", ",", as.character(value[[1]]))
  candidates <- unlist(strsplit(raw, "[,;|]+"), use.names = FALSE)
  candidates <- trimws(gsub("\\s+", " ", candidates))
  candidates <- tolower(candidates)
  candidates <- gsub("[^[:alnum:]'&/ _-]", "", candidates)
  candidates <- trimws(candidates)
  candidates <- candidates[nchar(candidates) >= 2 & nchar(candidates) <= 120]
  unique(candidates)
}

answer_rows <- list()
submission_rows <- list()
answer_signatures <- character(length(submissions))
self_reported_ideology_rows <- list()

for (record_index in seq_along(submissions)) {
  record <- submissions[[record_index]]
  if (identical(record$administration %||% "test", "test")) {
    identity <- record$identity %||% list()
    candidates <- normalize_self_reported_ideologies(identity$selfReportedIdeologies)
    if (length(candidates) > 0) {
      self_reported_ideology_rows[[length(self_reported_ideology_rows) + 1]] <- data.frame(
        participant_id = record$participantId,
        study_id = record$studyId %||% "unknown",
        bank_version = record$bankVersion %||% "unknown",
        candidate = candidates,
        stringsAsFactors = FALSE
      )
    }
  }
  item_ids <- vapply(record$itemMap %||% list(), function(item) item$questionId %||% "", character(1))
  item_ids <- item_ids[nzchar(item_ids)]
  answers <- record$answers
  numeric_values <- numeric(0)
  observed_count <- 0L
  missing_count <- 0L
  dont_know_count <- 0L

  signature_parts <- character(0)
  for (question_id in sort(item_ids)) {
    answer <- answers[[question_id]]
    value <- answer$value %||% NA
    confidence <- answer$confidence %||% NA
    priority <- answer$priority %||% NA
    is_dont_know <- is.character(value) && identical(value, "dont_know")
    is_observed <- is.numeric(value) && length(value) == 1 && is.finite(value)

    if (is_observed) {
      observed_count <- observed_count + 1L
      numeric_values <- c(numeric_values, as.numeric(value))
      signature_value <- as.character(value)
    } else {
      missing_count <- missing_count + 1L
      if (is_dont_know) dont_know_count <- dont_know_count + 1L
      signature_value <- if (is_dont_know) "dont_know" else "missing"
    }
    signature_parts <- c(signature_parts, paste(question_id, signature_value, sep = "="))

    item <- NULL
    for (candidate in record$itemMap %||% list()) {
      if (identical(candidate$questionId, question_id)) {
        item <- candidate
        break
      }
    }

    answer_rows[[length(answer_rows) + 1]] <- data.frame(
      participant_id = record$participantId,
      administration = record$administration %||% "test",
      study_id = record$studyId %||% "unknown",
      bank_version = record$bankVersion %||% "unknown",
      question_id = question_id,
      layer = item$layer %||% "unknown",
      value = if (is_observed) as.numeric(value) else NA_real_,
      dont_know = is_dont_know,
      missing = !is_observed,
      confidence = if (is.numeric(confidence)) as.numeric(confidence) else NA_real_,
      priority = if (is.numeric(priority)) as.numeric(priority) else NA_real_,
      stringsAsFactors = FALSE
    )
  }

  total_count <- length(item_ids)
  invariant_rate <- if (length(numeric_values) == 0) 1 else max(table(numeric_values)) / length(numeric_values)
  duration_ms <- as.numeric(record$durationMs %||% NA)
  consent_valid <- isTRUE(record$consent$ageConfirmed) &&
    isTRUE(record$consent$voluntaryParticipation) &&
    isTRUE(record$consent$dataUseAccepted)
  timestamps_valid <- is.finite(duration_ms) && duration_ms >= 0
  missing_rate <- if (total_count == 0) 1 else missing_count / total_count
  dont_know_rate <- if (total_count == 0) 0 else dont_know_count / total_count
  answer_signatures[[record_index]] <- paste(signature_parts, collapse = "|")

  submission_rows[[length(submission_rows) + 1]] <- data.frame(
    participant_id = record$participantId,
    administration = record$administration %||% "test",
    study_id = record$studyId %||% "unknown",
    schema_version = record$schemaVersion %||% "unknown",
    bank_version = record$bankVersion %||% "unknown",
    scoring_version = record$scoringVersion %||% "unknown",
    assigned_item_count = total_count,
    observed_count = observed_count,
    missing_count = missing_count,
    dont_know_count = dont_know_count,
    missing_rate = missing_rate,
    dont_know_rate = dont_know_rate,
    invariant_rate = invariant_rate,
    duration_ms = duration_ms,
    resumed = isTRUE(record$resumed),
    consent_valid = consent_valid,
    timestamps_valid = timestamps_valid,
    below_duration_gate = timestamps_valid && minimum_duration_ms > 0 && duration_ms < minimum_duration_ms,
    above_missing_gate = missing_rate > maximum_missing_rate,
    above_invariant_gate = invariant_rate >= maximum_invariant_rate,
    stringsAsFactors = FALSE
  )
}

submission_quality <- do.call(rbind, submission_rows)
answer_quality <- do.call(rbind, answer_rows)
submission_quality$duplicate_answer_vector <- duplicated(answer_signatures) | duplicated(answer_signatures, fromLast = TRUE)
submission_quality$exclusion_candidate <- !submission_quality$consent_valid |
  !submission_quality$timestamps_valid |
  submission_quality$below_duration_gate |
  submission_quality$above_missing_gate |
  submission_quality$above_invariant_gate |
  submission_quality$duplicate_answer_vector

item_quality <- aggregate(
  cbind(missing = as.integer(answer_quality$missing), dont_know = as.integer(answer_quality$dont_know)) ~
    bank_version + question_id + layer,
  data = answer_quality,
  FUN = mean
)
names(item_quality)[names(item_quality) == "missing"] <- "missing_rate"
names(item_quality)[names(item_quality) == "dont_know"] <- "dont_know_rate"
observed_by_item <- aggregate(value ~ bank_version + question_id + layer, data = answer_quality, FUN = function(values) sum(!is.na(values)))
item_quality <- merge(item_quality, observed_by_item, by = c("bank_version", "question_id", "layer"), all = TRUE)
names(item_quality)[names(item_quality) == "value"] <- "observed_count"

if (length(self_reported_ideology_rows) > 0) {
  self_reported_ideologies <- unique(do.call(rbind, self_reported_ideology_rows))
  self_reported_ideology_summary <- aggregate(
    participant_id ~ study_id + bank_version + candidate,
    data = self_reported_ideologies,
    FUN = function(values) length(unique(values))
  )
  names(self_reported_ideology_summary)[names(self_reported_ideology_summary) == "participant_id"] <- "respondent_count"
  self_reported_ideology_summary <- self_reported_ideology_summary[
    order(
      self_reported_ideology_summary$study_id,
      self_reported_ideology_summary$bank_version,
      -self_reported_ideology_summary$respondent_count,
      self_reported_ideology_summary$candidate
    ),
    ,
    drop = FALSE
  ]
} else {
  self_reported_ideology_summary <- data.frame(
    study_id = character(0),
    bank_version = character(0),
    candidate = character(0),
    respondent_count = integer(0),
    stringsAsFactors = FALSE
  )
}

utils::write.csv(submission_quality, file.path(output_dir, "submission-quality.csv"), row.names = FALSE)
utils::write.csv(item_quality, file.path(output_dir, "item-response-quality.csv"), row.names = FALSE)
utils::write.csv(
  self_reported_ideology_summary,
  file.path(output_dir, "self-reported-ideology-candidates.csv"),
  row.names = FALSE
)
utils::write.csv(
  submission_quality[submission_quality$exclusion_candidate, , drop = FALSE],
  file.path(output_dir, "exclusion-candidates.csv"),
  row.names = FALSE
)

summary <- list(
  generatedAt = format(Sys.time(), tz = "UTC", usetz = TRUE),
  submissionCount = nrow(submission_quality),
  validConsentCount = sum(submission_quality$consent_valid),
  exclusionCandidateCount = sum(submission_quality$exclusion_candidate),
  duplicateVectorCount = sum(submission_quality$duplicate_answer_vector),
  selfReportedIdeologyCandidateCount = nrow(self_reported_ideology_summary),
  medianDurationMs = stats::median(submission_quality$duration_ms, na.rm = TRUE),
  medianMissingRate = stats::median(submission_quality$missing_rate, na.rm = TRUE),
  thresholds = list(
    minimumDurationMs = minimum_duration_ms,
    maximumMissingRate = maximum_missing_rate,
    maximumInvariantRate = maximum_invariant_rate
  ),
  note = "Exclusion candidates require the preregistered review rule; this file does not delete records."
)
jsonlite::write_json(summary, file.path(output_dir, "data-quality-summary.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
cat("Data-quality outputs written to", normalizePath(output_dir), "\n")
