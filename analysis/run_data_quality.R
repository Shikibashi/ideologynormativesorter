#!/usr/bin/env Rscript

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Missing required R package: jsonlite")
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

parse_iso_timestamp_ms <- function(value) {
  if (!is.character(value) || length(value) != 1 || !nzchar(value)) return(NA_real_)
  parsed <- suppressWarnings(as.POSIXct(value, format = "%Y-%m-%dT%H:%M:%OSZ", tz = "UTC"))
  if (length(parsed) != 1 || is.na(parsed)) return(NA_real_)
  as.numeric(parsed) * 1000
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: Rscript analysis/run_data_quality.R <submissions.json|jsonl|directory> <output-directory>")
}

input_path <- args[[1]]
output_dir <- args[[2]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

minimum_duration_ms <- as.numeric(Sys.getenv("QUALITY_MINIMUM_DURATION_MS", "0"))
minimum_ms_per_item <- as.numeric(Sys.getenv("QUALITY_MINIMUM_MS_PER_ITEM", "0"))
maximum_missing_rate <- as.numeric(Sys.getenv("QUALITY_MAXIMUM_MISSING_RATE", "0.40"))
maximum_invariant_rate <- as.numeric(Sys.getenv("QUALITY_MAXIMUM_INVARIANT_RATE", "0.95"))
required_consent_version <- Sys.getenv("QUALITY_REQUIRED_CONSENT_VERSION", "2026-08-10-v5")

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
  likert_values <- numeric(0)
  observed_count <- 0L
  missing_count <- 0L
  dont_know_count <- 0L
  refusal_count <- 0L

  signature_parts <- character(0)
  for (question_id in sort(item_ids)) {
    answer <- answers[[question_id]]
    item <- NULL
    for (candidate in record$itemMap %||% list()) {
      if (identical(candidate$questionId, question_id)) {
        item <- candidate
        break
      }
    }
    value <- answer$value %||% NA
    confidence <- answer$confidence %||% NA
    priority <- answer$priority %||% NA
    is_dont_know <- is.character(value) && identical(value, "dont_know")
    is_refusal <- is.character(value) && identical(value, "prefer_not_to_answer")
    is_observed <- is.numeric(value) && length(value) == 1 && is.finite(value)

    if (is_observed) {
      observed_count <- observed_count + 1L
      if (item$responseType %in% c("likert5", "likert7")) {
        likert_values <- c(likert_values, as.numeric(value))
      }
      signature_value <- as.character(value)
    } else {
      missing_count <- missing_count + 1L
      if (is_dont_know) dont_know_count <- dont_know_count + 1L
      if (is_refusal) refusal_count <- refusal_count + 1L
      signature_value <- if (is_dont_know) "dont_know" else if (is_refusal) "refusal" else "missing"
    }
    signature_parts <- c(signature_parts, paste(question_id, signature_value, sep = "="))

    answer_rows[[length(answer_rows) + 1]] <- data.frame(
      submission_id = record$submissionId %||% "",
      participant_id = record$participantId,
      record_type = record$recordType %||% "core",
      administration = record$administration %||% "test",
      study_id = record$studyId %||% "unknown",
      bank_version = record$bankVersion %||% "unknown",
      question_id = question_id,
      layer = item$layer %||% "unknown",
      response_type = item$responseType %||% "unknown",
      value = if (is_observed) as.numeric(value) else NA_real_,
      dont_know = is_dont_know,
      refusal = is_refusal,
      missing = !is_observed,
      salience_skipped = isTRUE(answer$salienceSkipped),
      confidence = if (is.numeric(confidence)) as.numeric(confidence) else NA_real_,
      priority = if (is.numeric(priority)) as.numeric(priority) else NA_real_,
      stringsAsFactors = FALSE
    )
  }

  total_count <- length(item_ids)
  likert_observed_count <- length(likert_values)
  invariant_rate <- if (likert_observed_count == 0) NA_real_ else max(table(likert_values)) / likert_observed_count
  duration_ms <- as.numeric(record$durationMs %||% NA)
  started_at_ms <- parse_iso_timestamp_ms(record$startedAt %||% NA)
  completed_at_ms <- parse_iso_timestamp_ms(record$completedAt %||% NA)
  submitted_at_ms <- parse_iso_timestamp_ms(record$submittedAt %||% NA)
  consented_at_ms <- parse_iso_timestamp_ms(record$consent$consentedAt %||% NA)
  submission_id_valid <- is.character(record$submissionId) &&
    length(record$submissionId) == 1 &&
    grepl("^[A-Za-z0-9_-]{1,96}$", record$submissionId)
  consent_valid <- isTRUE(record$consent$ageConfirmed) &&
    isTRUE(record$consent$voluntaryParticipation) &&
    isTRUE(record$consent$dataUseAccepted) &&
    identical(record$consent$consentVersion %||% "", required_consent_version) &&
    is.finite(consented_at_ms) &&
    is.logical(record$consent$disclosureSnapshot$endpointConfigured) &&
    length(record$consent$disclosureSnapshot$endpointConfigured) == 1 &&
    is.character(record$consent$disclosureSnapshot$transferAndWithdrawalNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$transferAndWithdrawalNotice)) &&
    is.character(record$consent$disclosureSnapshot$retentionNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$retentionNotice)) &&
    is.character(record$consent$disclosureSnapshot$contactNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$contactNotice))
  timestamps_valid <- is.finite(duration_ms) &&
    duration_ms >= 0 &&
    is.finite(started_at_ms) &&
    is.finite(completed_at_ms) &&
    is.finite(submitted_at_ms) &&
    completed_at_ms >= started_at_ms &&
    submitted_at_ms >= completed_at_ms &&
    consented_at_ms <= completed_at_ms &&
    abs(duration_ms - (completed_at_ms - started_at_ms)) < 1
  missing_rate <- if (total_count == 0) 1 else missing_count / total_count
  dont_know_rate <- if (total_count == 0) 0 else dont_know_count / total_count
  refusal_rate <- if (total_count == 0) 0 else refusal_count / total_count
  duration_ms_per_item <- if (!is.finite(duration_ms) || total_count == 0) NA_real_ else duration_ms / total_count
  answer_signatures[[record_index]] <- paste(signature_parts, collapse = "|")

  submission_rows[[length(submission_rows) + 1]] <- data.frame(
    submission_id = record$submissionId %||% "",
    participant_id = record$participantId,
    record_type = record$recordType %||% "core",
    administration = record$administration %||% "test",
    study_id = record$studyId %||% "unknown",
    schema_version = record$schemaVersion %||% "unknown",
    bank_version = record$bankVersion %||% "unknown",
    scoring_version = record$scoringVersion %||% "unknown",
    assigned_item_count = total_count,
    observed_count = observed_count,
    likert_observed_count = likert_observed_count,
    missing_count = missing_count,
    dont_know_count = dont_know_count,
    refusal_count = refusal_count,
    missing_rate = missing_rate,
    dont_know_rate = dont_know_rate,
    refusal_rate = refusal_rate,
    invariant_rate = invariant_rate,
    duration_ms = duration_ms,
    duration_ms_per_item = duration_ms_per_item,
    resumed = isTRUE(record$resumed),
    submission_id_valid = submission_id_valid,
    consent_valid = consent_valid,
    timestamps_valid = timestamps_valid,
    below_duration_gate = timestamps_valid && (
      (minimum_duration_ms > 0 && duration_ms < minimum_duration_ms) ||
      (minimum_ms_per_item > 0 && is.finite(duration_ms_per_item) && duration_ms_per_item < minimum_ms_per_item)
    ),
    above_missing_gate = missing_rate > maximum_missing_rate,
    above_invariant_gate = is.finite(invariant_rate) && invariant_rate >= maximum_invariant_rate,
    stringsAsFactors = FALSE
  )
}

submission_quality <- do.call(rbind, submission_rows)
answer_quality <- do.call(rbind, answer_rows)
submission_quality$duplicate_submission_id <-
  duplicated(submission_quality$submission_id) |
  duplicated(submission_quality$submission_id, fromLast = TRUE)
record_keys <- paste(
  submission_quality$study_id,
  submission_quality$participant_id,
  submission_quality$administration,
  submission_quality$record_type,
  sep = "::"
)
submission_quality$duplicate_record_key <- duplicated(record_keys) | duplicated(record_keys, fromLast = TRUE)
submission_quality$shared_answer_vector <- duplicated(answer_signatures) | duplicated(answer_signatures, fromLast = TRUE)
submission_quality$exclusion_candidate <- !submission_quality$submission_id_valid |
  submission_quality$duplicate_submission_id |
  !submission_quality$consent_valid |
  !submission_quality$timestamps_valid |
  submission_quality$below_duration_gate |
  submission_quality$above_missing_gate |
  submission_quality$above_invariant_gate |
  submission_quality$duplicate_record_key

item_quality <- aggregate(
  cbind(
    missing = as.integer(answer_quality$missing),
    dont_know = as.integer(answer_quality$dont_know),
    refusal = as.integer(answer_quality$refusal),
    salience_skipped = as.integer(answer_quality$salience_skipped)
  ) ~
    record_type + bank_version + question_id + layer,
  data = answer_quality,
  FUN = mean
)
names(item_quality)[names(item_quality) == "missing"] <- "missing_rate"
names(item_quality)[names(item_quality) == "dont_know"] <- "dont_know_rate"
names(item_quality)[names(item_quality) == "refusal"] <- "refusal_rate"
names(item_quality)[names(item_quality) == "salience_skipped"] <- "salience_skipped_rate"
answer_quality$observed <- as.integer(!answer_quality$missing)
observed_by_item <- aggregate(observed ~ record_type + bank_version + question_id + layer, data = answer_quality, FUN = sum)
item_quality <- merge(item_quality, observed_by_item, by = c("record_type", "bank_version", "question_id", "layer"), all = TRUE)
names(item_quality)[names(item_quality) == "observed"] <- "observed_count"

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

inclusion_manifest <- submission_quality[, c(
  "submission_id", "study_id", "participant_id", "administration", "record_type", "schema_version", "bank_version", "scoring_version"
), drop = FALSE]
inclusion_manifest$decision <- ifelse(submission_quality$exclusion_candidate, "review-required", "include")
inclusion_manifest$reason <- ifelse(
  submission_quality$exclusion_candidate,
  "Resolve every flagged quality field before analysis; do not tune rules after viewing outcomes.",
  "Passed preregistered automatic gates."
)
utils::write.csv(inclusion_manifest, file.path(output_dir, "analysis-inclusion-manifest.csv"), row.names = FALSE)
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
  duplicateSubmissionIdCount = sum(submission_quality$duplicate_submission_id),
  duplicateRecordKeyCount = sum(submission_quality$duplicate_record_key),
  sharedAnswerVectorCount = sum(submission_quality$shared_answer_vector),
  selfReportedIdeologyCandidateCount = nrow(self_reported_ideology_summary),
  medianDurationMs = stats::median(submission_quality$duration_ms, na.rm = TRUE),
  medianMissingRate = stats::median(submission_quality$missing_rate, na.rm = TRUE),
  thresholds = list(
    minimumDurationMs = minimum_duration_ms,
    minimumMsPerItem = minimum_ms_per_item,
    maximumMissingRate = maximum_missing_rate,
    maximumInvariantRate = maximum_invariant_rate,
    requiredConsentVersion = required_consent_version
  ),
  note = "Exclusion candidates require the preregistered review rule; this file does not delete records."
)
jsonlite::write_json(summary, file.path(output_dir, "data-quality-summary.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
cat("Data-quality outputs written to", normalizePath(output_dir), "\n")
