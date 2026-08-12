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

parse_iso_timestamp_ms <- function(value) {
  if (!is.character(value) || length(value) != 1 || !nzchar(value)) return(NA_real_)
  parsed <- suppressWarnings(as.POSIXct(value, format = "%Y-%m-%dT%H:%M:%OSZ", tz = "UTC"))
  if (length(parsed) != 1 || is.na(parsed)) return(NA_real_)
  as.numeric(parsed) * 1000
}

fnv_multiply <- function(hash) {
  low <- hash %% 65536
  high <- floor(hash / 65536)
  low_product <- low * 403
  result_low <- low_product %% 65536
  result_high <- (floor(low_product / 65536) + low * 256 + high * 403) %% 65536
  result_high * 65536 + result_low
}

fnv1a_32 <- function(value) {
  hash <- 2166136261
  for (code in utf8ToInt(value)) {
    low <- hash %% 65536
    high <- floor(hash / 65536)
    hash <- high * 65536 + bitwXor(as.integer(low), as.integer(code))
    hash <- fnv_multiply(hash)
  }
  hash
}

hex32 <- function(value) {
  paste0(
    sprintf("%04x", as.integer(floor(value / 65536) %% 65536)),
    sprintf("%04x", as.integer(value %% 65536))
  )
}

research_form_fingerprint <- function(item_ids, form_version) {
  canonical <- paste(sort(item_ids), collapse = "|")
  paste0("rf_", hex32(fnv1a_32(paste0(form_version, ":", canonical))))
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 3) {
  stop("Usage: Rscript analysis/run_validation.R <submissions.json|jsonl|directory> <output-directory> <analysis-inclusion-manifest.csv>")
}

input_path <- args[[1]]
output_dir <- args[[2]]
manifest_path <- args[[3]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

bootstrap_replicates <- as.integer(Sys.getenv("PSYCH_BOOTSTRAP_REPLICATES", "1000"))
minimum_axis_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_AXIS_N", "100"))
minimum_factor_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_FACTOR_N", "300"))
minimum_dif_group_n <- as.integer(Sys.getenv("PSYCH_MINIMUM_DIF_GROUP_N", "100"))
required_schema_version <- Sys.getenv("PSYCH_REQUIRED_SCHEMA_VERSION", "2026-08-v7")
required_consent_version <- Sys.getenv("PSYCH_REQUIRED_CONSENT_VERSION", "2026-08-12-v7")
required_form_version <- Sys.getenv("PSYCH_REQUIRED_FORM_VERSION", "profile-form-v3")
required_quality_rule_version <- Sys.getenv("PSYCH_REQUIRED_QUALITY_RULE_VERSION", "data-quality-v2")
required_bank_version <- Sys.getenv("PSYCH_REQUIRED_BANK_VERSION", "")
required_scoring_version <- Sys.getenv("PSYCH_REQUIRED_SCORING_VERSION", "")
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
  !is.null(record$schemaVersion) &&
    !is.null(record$participantId) &&
    !is.null(record$answers) &&
    identical(record$recordType %||% "core", "core")
}, logical(1))]
if (length(submissions) == 0) stop("No valid research submissions were found.")

if (!file.exists(manifest_path)) stop("Inclusion manifest does not exist: ", manifest_path)
manifest <- utils::read.csv(manifest_path, stringsAsFactors = FALSE)
required_manifest_columns <- c("submission_id", "study_id", "participant_id", "administration", "record_type", "decision")
missing_manifest_columns <- setdiff(required_manifest_columns, names(manifest))
if (length(missing_manifest_columns) > 0) {
  stop("Inclusion manifest is missing columns: ", paste(missing_manifest_columns, collapse = ", "))
}
manifest <- manifest[manifest$record_type == "core", , drop = FALSE]
if (any(!manifest$decision %in% c("include", "exclude"))) {
  stop("Every core manifest row must be explicitly resolved to include or exclude before validation.")
}
manifest_keys <- manifest$submission_id
if (any(!nzchar(manifest_keys)) || anyDuplicated(manifest_keys)) {
  stop("Inclusion manifest must contain one unique, non-empty submission_id per core record.")
}
included_keys <- manifest_keys[manifest$decision == "include"]
submission_keys <- vapply(submissions, function(record) record$submissionId %||% "", character(1))
if (any(!grepl("^[A-Za-z0-9_-]{1,96}$", submission_keys))) stop("Input contains an invalid submissionId.")
if (anyDuplicated(submission_keys)) stop("Input contains duplicate submissionId values; deduplicate exact retries before validation.")
unresolved_keys <- setdiff(submission_keys, manifest_keys)
if (length(unresolved_keys) > 0) stop("Inclusion manifest does not resolve every input core record.")
extra_manifest_keys <- setdiff(manifest_keys, submission_keys)
if (length(extra_manifest_keys) > 0) stop("Inclusion manifest contains core submission_id values absent from the input.")
for (manifest_index in seq_len(nrow(manifest))) {
  record <- submissions[[match(manifest$submission_id[[manifest_index]], submission_keys)]]
  if (!identical(manifest$study_id[[manifest_index]], record$studyId %||% "unknown") ||
      !identical(manifest$participant_id[[manifest_index]], record$participantId) ||
      !identical(manifest$administration[[manifest_index]], record$administration %||% "test")) {
    stop("Inclusion manifest metadata does not match submission_id ", manifest$submission_id[[manifest_index]], ".")
  }
}
submissions <- submissions[submission_keys %in% included_keys]
if (length(submissions) == 0) stop("The resolved inclusion manifest selected no core records.")
submission_keys <- vapply(submissions, function(record) record$submissionId, character(1))
included_administration_keys <- vapply(submissions, function(record) {
  paste(record$studyId %||% "unknown", record$participantId, record$administration %||% "test", sep = "::")
}, character(1))
if (anyDuplicated(included_administration_keys)) {
  stop("The resolved manifest includes more than one core record for the same study, participant, and administration.")
}

study_ids <- unique(vapply(submissions, function(record) record$studyId %||% "unknown", character(1)))
schema_versions <- unique(vapply(submissions, function(record) record$schemaVersion %||% "unknown", character(1)))
bank_versions <- unique(vapply(submissions, function(record) record$bankVersion %||% "unknown", character(1)))
scoring_versions <- unique(vapply(submissions, function(record) record$scoringVersion %||% "unknown", character(1)))
form_versions <- unique(vapply(submissions, function(record) record$form$algorithmVersion %||% "unknown", character(1)))
quality_rule_versions <- unique(vapply(submissions, function(record) record$qualityRuleVersion %||% "unknown", character(1)))
if (length(study_ids) > 1) stop("Multiple study IDs detected; analyze one preregistered cohort at a time.")
if (length(schema_versions) > 1 || !identical(schema_versions[[1]], required_schema_version)) {
  stop("Expected only schema ", required_schema_version, "; found: ", paste(schema_versions, collapse = ", "))
}
if (length(bank_versions) > 1) stop("Multiple bank versions detected: ", paste(bank_versions, collapse = ", "))
if (length(scoring_versions) > 1) stop("Multiple scoring versions detected: ", paste(scoring_versions, collapse = ", "))
if (length(form_versions) > 1 || !identical(form_versions[[1]], required_form_version)) {
  stop("Expected only form algorithm ", required_form_version, "; found: ", paste(form_versions, collapse = ", "))
}
if (length(quality_rule_versions) > 1 || !identical(quality_rule_versions[[1]], required_quality_rule_version)) {
  stop("Expected only quality rule ", required_quality_rule_version, "; found: ", paste(quality_rule_versions, collapse = ", "))
}
if (nzchar(required_bank_version) && !identical(bank_versions[[1]], required_bank_version)) {
  stop("Expected bank version ", required_bank_version, "; found: ", bank_versions[[1]])
}
if (nzchar(required_scoring_version) && !identical(scoring_versions[[1]], required_scoring_version)) {
  stop("Expected scoring version ", required_scoring_version, "; found: ", scoring_versions[[1]])
}

for (record_index in seq_along(submissions)) {
  record <- submissions[[record_index]]
  record_id <- submission_keys[[record_index]]
  started_at_ms <- parse_iso_timestamp_ms(record$startedAt %||% NA)
  completed_at_ms <- parse_iso_timestamp_ms(record$completedAt %||% NA)
  submitted_at_ms <- parse_iso_timestamp_ms(record$submittedAt %||% NA)
  consented_at_ms <- parse_iso_timestamp_ms(record$consent$consentedAt %||% NA)
  duration_ms <- as.numeric(record$durationMs %||% NA)
  timing_valid <- is.finite(started_at_ms) &&
    is.finite(completed_at_ms) &&
    is.finite(submitted_at_ms) &&
    is.finite(consented_at_ms) &&
    completed_at_ms >= started_at_ms &&
    submitted_at_ms >= completed_at_ms &&
    consented_at_ms <= completed_at_ms &&
    is.finite(duration_ms) &&
    duration_ms >= 0 &&
    abs(duration_ms - (completed_at_ms - started_at_ms)) < 1
  consent_valid <- isTRUE(record$consent$ageConfirmed) &&
    isTRUE(record$consent$voluntaryParticipation) &&
    isTRUE(record$consent$dataUseAccepted) &&
    identical(record$consent$consentVersion %||% "", required_consent_version) &&
    is.logical(record$consent$disclosureSnapshot$endpointConfigured) &&
    length(record$consent$disclosureSnapshot$endpointConfigured) == 1 &&
    is.character(record$consent$disclosureSnapshot$transferAndWithdrawalNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$transferAndWithdrawalNotice)) &&
    is.character(record$consent$disclosureSnapshot$retentionNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$retentionNotice)) &&
    is.character(record$consent$disclosureSnapshot$contactNotice) &&
    nzchar(trimws(record$consent$disclosureSnapshot$contactNotice))
  if (!timing_valid || !consent_valid) stop("Invalid timing or consent method metadata for submissionId ", record_id, ".")

  item_ids_for_record <- vapply(record$itemMap %||% list(), function(item) item$questionId %||% "", character(1))
  presentation_order <- unlist(record$presentationOrder %||% list(), use.names = FALSE)
  answer_ids <- names(record$answers %||% list())
  if (length(item_ids_for_record) == 0 || any(!nzchar(item_ids_for_record)) || anyDuplicated(item_ids_for_record)) {
    stop("Invalid or duplicate item IDs for submissionId ", record_id, ".")
  }
  if (!identical(presentation_order, item_ids_for_record) || !setequal(answer_ids, item_ids_for_record)) {
    stop("Answer, item snapshot, and ordered presentation IDs differ for submissionId ", record_id, ".")
  }

  assigned_count <- as.numeric(record$form$assignedItemCount %||% NA)
  requested_count <- record$form$requestedItemCount
  requested_valid <- is.null(requested_count) || (
    is.numeric(requested_count) &&
    length(requested_count) == 1 &&
    is.finite(requested_count) &&
    requested_count == floor(requested_count) &&
    requested_count >= 12 &&
    requested_count >= assigned_count
  )
  expected_fingerprint <- research_form_fingerprint(item_ids_for_record, required_form_version)
  if (!is.finite(assigned_count) ||
      assigned_count != length(item_ids_for_record) ||
      !requested_valid ||
      !identical(record$form$fingerprint %||% "", expected_fingerprint)) {
    stop("Invalid form count or fingerprint for submissionId ", record_id, ".")
  }
  if (!identical(record$sampling$design %||% "", "open-opt-in-nonprobability") ||
      !identical(record$sampling$populationInference, FALSE) ||
      !identical(record$sampling$weighting %||% "", "none") ||
      !identical(record$sampling$recruitmentSourceProvenance %||% "", "url-parameter-unverified") ||
      !is.character(record$sampling$recruitmentSource) ||
      length(record$sampling$recruitmentSource) != 1 ||
      !grepl("^[A-Za-z0-9_-]{1,96}$", record$sampling$recruitmentSource)) {
    stop("Invalid sampling metadata for submissionId ", record_id, ".")
  }
}

validated_administrations <- vapply(submissions, function(record) record$administration %||% "test", character(1))
validated_participant_ids <- vapply(submissions, function(record) record$participantId, character(1))
validated_form_fingerprints <- vapply(submissions, function(record) record$form$fingerprint, character(1))
for (participant_id in unique(validated_participant_ids)) {
  first <- which(validated_participant_ids == participant_id & validated_administrations == "test")
  second <- which(validated_participant_ids == participant_id & validated_administrations == "retest")
  if (length(first) == 0 || length(second) == 0) next
  if (length(first) != 1 || length(second) != 1) {
    stop("Expected at most one included test and retest record for participant ", participant_id, ".")
  }
  if (!identical(validated_form_fingerprints[[first]], validated_form_fingerprints[[second]])) {
    stop("Test/retest form fingerprint mismatch for participant ", participant_id, ".")
  }
}

item_registry <- list()
for (record in submissions) {
  for (item in record$itemMap %||% list()) {
    question_id <- item$questionId
    if (is.null(question_id)) next
    if (is.null(item_registry[[question_id]])) {
      item_registry[[question_id]] <- item
    } else {
      existing <- jsonlite::toJSON(item_registry[[question_id]], auto_unbox = TRUE, null = "null")
      current <- jsonlite::toJSON(item, auto_unbox = TRUE, null = "null")
      if (!identical(existing, current)) stop("Inconsistent item snapshot for question ID: ", question_id)
    }
  }
}
if (length(item_registry) == 0) stop("No item metadata was present in the submissions.")

item_ids <- names(item_registry)
respondent_keys <- vapply(submissions, function(record) {
  paste(record$participantId, record$administration %||% "test", sep = "::")
}, character(1))
response_matrix <- matrix(NA_real_, nrow = length(submissions), ncol = length(item_ids),
                          dimnames = list(respondent_keys, item_ids))
assignment_matrix <- matrix(FALSE, nrow = length(submissions), ncol = length(item_ids),
                            dimnames = list(respondent_keys, item_ids))

for (row_index in seq_along(submissions)) {
  record <- submissions[[row_index]]
  answers <- record$answers
  presented_ids <- vapply(record$itemMap %||% list(), function(item) item$questionId %||% "", character(1))
  answer_ids <- names(answers)
  presentation_order <- unlist(record$presentationOrder %||% list(), use.names = FALSE)
  if (!identical(presented_ids, presentation_order) || !setequal(presented_ids, answer_ids)) {
    stop("Answer, item snapshot, and presentation-order IDs differ for record: ", submission_keys[[row_index]])
  }
  for (question_id in presented_ids) {
    assignment_matrix[row_index, question_id] <- TRUE
    answer <- answers[[question_id]]
    item <- item_registry[[question_id]]
    value <- answer$value %||% NA
    if (!identical(answer$questionId %||% "", question_id)) {
      stop("Answer questionId does not match its map key for submissionId ", submission_keys[[row_index]], ".")
    }
    if (!(item$layer %in% c("normative", "descriptive", "prescriptive")) ||
        !(item$responseType %in% c("likert5", "likert7", "statementChoice"))) {
      stop("Invalid item layer or response type for question ID: ", question_id)
    }
    response_options <- item$responseOptions %||% list()
    value_presented <- any(vapply(response_options, function(option) identical(option$value, value), logical(1)))
    if (!value_presented) stop("Response was not among the presented options for question ID: ", question_id)

    substantive <- is.numeric(value) && length(value) == 1 && is.finite(value)
    skipped <- isTRUE(answer$salienceSkipped)
    valid_confidence <- is.numeric(answer$confidence) && length(answer$confidence) == 1 && answer$confidence %in% c(1, 3, 5)
    valid_priority <- is.numeric(answer$priority) && length(answer$priority) == 1 && answer$priority %in% c(1, 3, 5)
    salience_valid <- if (!substantive || identical(item$layer, "normative")) {
      is.null(answer$confidence) && is.null(answer$priority) && !skipped
    } else if (identical(item$layer, "descriptive")) {
      is.null(answer$priority) && ((skipped && is.null(answer$confidence)) || (!skipped && valid_confidence))
    } else {
      is.null(answer$confidence) && ((skipped && is.null(answer$priority)) || (!skipped && valid_priority))
    }
    if (!salience_valid) stop("Invalid confidence, priority, or skipped-salience state for question ID: ", question_id)

    if (is.numeric(value) && length(value) == 1 && is.finite(value)) {
      valid_numeric <- if (identical(item$responseType, "likert5")) {
        value %in% -2:2
      } else if (identical(item$responseType, "likert7")) {
        value %in% -3:3
      } else if (identical(item$responseType, "statementChoice")) {
        value %in% (seq_along(item$statementOptions %||% list()) - 1)
      } else {
        FALSE
      }
      if (!valid_numeric) stop("Invalid numeric response category for question ID: ", question_id)
      response_matrix[row_index, question_id] <- value
    } else if (!is.character(value) || !value %in% c("dont_know", "prefer_not_to_answer")) {
      stop("Invalid nonresponse category for question ID: ", question_id)
    }
  }
}

form_summary <- as.data.frame(table(vapply(submissions, function(record) {
  record$form$fingerprint %||% "unknown"
}, character(1))), stringsAsFactors = FALSE)
names(form_summary) <- c("form_fingerprint", "respondent_count")
utils::write.csv(form_summary, file.path(output_dir, "form-incidence-summary.csv"), row.names = FALSE)

position_rows <- do.call(rbind, lapply(submissions, function(record) {
  order <- record$presentationOrder %||% character(0)
  data.frame(
    form_fingerprint = record$form$fingerprint %||% "unknown",
    question_id = order,
    position = seq_along(order),
    stringsAsFactors = FALSE
  )
}))
utils::write.csv(position_rows, file.path(output_dir, "item-position-distribution.csv"), row.names = FALSE)

item_assignment_counts <- data.frame(
  question_id = item_ids,
  assigned_n = as.integer(colSums(assignment_matrix)),
  stringsAsFactors = FALSE
)
utils::write.csv(item_assignment_counts, file.path(output_dir, "item-assignment-counts.csv"), row.names = FALSE)

pair_counts <- crossprod(assignment_matrix)
pair_index <- which(upper.tri(pair_counts, diag = TRUE), arr.ind = TRUE)
pair_overlap <- data.frame(
  question_id_1 = colnames(pair_counts)[pair_index[, 1]],
  question_id_2 = colnames(pair_counts)[pair_index[, 2]],
  coassigned_n = as.integer(pair_counts[pair_index]),
  stringsAsFactors = FALSE
)
utils::write.csv(pair_overlap, file.path(output_dir, "item-pair-overlap.csv"), row.names = FALSE)

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

# Recompute the exact production axis contract separately from the primary-axis
# item measurement model above. These scores retain every cross-loading weight
# and the confidence/priority multiplier used by the application.
production_axis_ids <- character(0)
for (item in item_registry) {
  production_axis_ids <- c(
    production_axis_ids,
    vapply(item$axisWeights %||% list(), function(weight) weight$axisId %||% "", character(1))
  )
  for (option in item$statementOptions %||% list()) {
    production_axis_ids <- c(
      production_axis_ids,
      vapply(option$axisWeights %||% list(), function(weight) weight$axisId %||% "", character(1))
    )
  }
}
production_axis_ids <- sort(unique(production_axis_ids[nzchar(production_axis_ids)]))
production_score_matrix <- matrix(
  NA_real_,
  nrow = length(submissions),
  ncol = length(production_axis_ids),
  dimnames = list(respondent_keys, production_axis_ids)
)

for (row_index in seq_along(submissions)) {
  record <- submissions[[row_index]]
  numerators <- stats::setNames(rep(0, length(production_axis_ids)), production_axis_ids)
  denominators <- stats::setNames(rep(0, length(production_axis_ids)), production_axis_ids)
  for (item in record$itemMap %||% list()) {
    question_id <- item$questionId
    answer <- record$answers[[question_id]]
    value <- answer$value %||% NA
    if (!is.numeric(value) || length(value) != 1 || !is.finite(value) || isTRUE(answer$salienceSkipped)) next

    if (identical(item$responseType, "statementChoice")) {
      option_index <- as.integer(value) + 1L
      options <- item$statementOptions %||% list()
      if (option_index < 1 || option_index > length(options)) next
      unit <- 1
      weights <- options[[option_index]]$axisWeights %||% list()
    } else {
      maximum <- if (identical(item$responseType, "likert5")) 2 else 3
      unit <- max(-1, min(1, as.numeric(value) / maximum))
      if (isTRUE(item$reverseScored)) unit <- -unit
      weights <- item$axisWeights %||% list()
    }

    rating <- if (identical(item$layer, "descriptive")) {
      answer$confidence %||% NA
    } else if (identical(item$layer, "prescriptive")) {
      answer$priority %||% NA
    } else {
      NA
    }
    salience <- if (is.numeric(rating) && length(rating) == 1 && is.finite(rating)) {
      max(0.2, min(1, as.numeric(rating) / 5))
    } else {
      1
    }

    for (weight in weights) {
      axis_id <- weight$axisId %||% ""
      weight_value <- as.numeric(weight$weight %||% 0)
      if (!nzchar(axis_id) || !axis_id %in% production_axis_ids || !is.finite(weight_value)) next
      numerators[[axis_id]] <- numerators[[axis_id]] + unit * weight_value * salience
      denominators[[axis_id]] <- denominators[[axis_id]] + abs(weight_value)
    }
  }
  measured <- denominators > 0
  production_score_matrix[row_index, measured] <- pmax(-1, pmin(1, numerators[measured] / denominators[measured]))
}

production_score_rows <- do.call(rbind, lapply(seq_along(submissions), function(row_index) {
  data.frame(
    participant_id = submissions[[row_index]]$participantId,
    administration = submissions[[row_index]]$administration %||% "test",
    axis_id = production_axis_ids,
    score = as.numeric(production_score_matrix[row_index, ]),
    stringsAsFactors = FALSE
  )
}))
utils::write.csv(production_score_rows, file.path(output_dir, "production-axis-scores.csv"), row.names = FALSE)

administrations <- vapply(submissions, function(record) record$administration %||% "test", character(1))
test_rows <- administrations == "test"
retest_rows <- administrations == "retest"
participant_ids <- vapply(submissions, function(record) record$participantId, character(1))

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

minimum_pairwise_n <- function(data) {
  observed <- !is.na(as.matrix(data))
  if (ncol(observed) < 2) return(sum(observed))
  counts <- crossprod(observed)
  min(counts[upper.tri(counts)])
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
  pairwise_n <- minimum_pairwise_n(test_data)
  estimable <- length(ids) >= 2 && pairwise_n >= minimum_axis_n
  alpha_value <- if (estimable) safe_alpha(test_data) else NA_real_
  omega_value <- if (estimable && length(ids) >= 3) safe_omega(test_data) else NA_real_
  alpha_ci <- if (!is.na(alpha_value)) bootstrap_interval(test_data, safe_alpha, bootstrap_replicates) else c(NA_real_, NA_real_)
  omega_ci <- if (!is.na(omega_value)) bootstrap_interval(test_data, safe_omega, bootstrap_replicates) else c(NA_real_, NA_real_)

  axis_rows[[length(axis_rows) + 1]] <- data.frame(
    axis_id = axis_id,
    item_count = length(ids),
    test_n = sum(test_rows),
    complete_case_n = complete_n,
    minimum_pairwise_n = pairwise_n,
    alpha = alpha_value,
    alpha_ci_low = alpha_ci[[1]],
    alpha_ci_high = alpha_ci[[2]],
    omega_total = omega_value,
    omega_ci_low = omega_ci[[1]],
    omega_ci_high = omega_ci[[2]],
    status = if (!estimable) "insufficient-data" else if (is.na(alpha_value)) "estimation-failed" else "estimated",
    stringsAsFactors = FALSE
  )

  if (estimable) {
    for (question_id in ids) {
      item_values <- test_data[, question_id]
      remainder_data <- test_data[, setdiff(ids, question_id), drop = FALSE]
      remainder_observed <- rowSums(!is.na(remainder_data))
      remainder <- rowMeans(remainder_data, na.rm = TRUE)
      remainder[remainder_observed == 0] <- NA_real_
      complete_pair <- stats::complete.cases(item_values, remainder)
      pair_n <- sum(complete_pair)
      correlation <- if (
        pair_n >= 3 &&
        stats::sd(item_values[complete_pair]) > 0 &&
        stats::sd(remainder[complete_pair]) > 0
      ) {
        suppressWarnings(stats::cor(item_values[complete_pair], remainder[complete_pair]))
      } else {
        NA_real_
      }
      item_rows[[length(item_rows) + 1]] <- data.frame(
        axis_id = axis_id,
        question_id = question_id,
        pair_n = pair_n,
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
  mean_change <- if (nrow(paired_matrix) > 0) mean(paired_matrix[, 2] - paired_matrix[, 1]) else NA_real_
  sd_change <- if (nrow(paired_matrix) > 1) stats::sd(paired_matrix[, 2] - paired_matrix[, 1]) else NA_real_
  concordance <- if (nrow(paired_matrix) >= 30) {
    numerator <- 2 * stats::cov(paired_matrix[, 1], paired_matrix[, 2])
    denominator <- stats::var(paired_matrix[, 1]) + stats::var(paired_matrix[, 2]) +
      (mean(paired_matrix[, 1]) - mean(paired_matrix[, 2]))^2
    if (denominator > 0) numerator / denominator else NA_real_
  } else NA_real_
  ci <- if (!is.na(correlation)) {
    bootstrap_interval(paired_matrix, function(values) stats::cor(values[, 1], values[, 2]), bootstrap_replicates)
  } else c(NA_real_, NA_real_)
  retest_results[[length(retest_results) + 1]] <- data.frame(
    axis_id = axis_id,
    pair_n = nrow(paired_matrix),
    test_retest_correlation = correlation,
    concordance_correlation = concordance,
    mean_change = mean_change,
    sd_change = sd_change,
    ci_low = ci[[1]],
    ci_high = ci[[2]],
    status = if (nrow(paired_matrix) < 30) "insufficient-data" else "estimated",
    stringsAsFactors = FALSE
  )
}
utils::write.csv(do.call(rbind, retest_results), file.path(output_dir, "test-retest.csv"), row.names = FALSE)

production_retest_results <- list()
for (axis_id in production_axis_ids) {
  paired <- list()
  for (participant_id in unique(participant_ids)) {
    first <- which(participant_ids == participant_id & test_rows)
    second <- which(participant_ids == participant_id & retest_rows)
    if (length(first) == 0 || length(second) == 0) next
    paired[[length(paired) + 1]] <- c(
      production_score_matrix[first[[1]], axis_id],
      production_score_matrix[second[[1]], axis_id]
    )
  }
  paired_matrix <- if (length(paired) > 0) do.call(rbind, paired) else matrix(numeric(0), ncol = 2)
  paired_matrix <- paired_matrix[stats::complete.cases(paired_matrix), , drop = FALSE]
  correlation <- if (nrow(paired_matrix) >= 30) stats::cor(paired_matrix[, 1], paired_matrix[, 2]) else NA_real_
  concordance <- if (nrow(paired_matrix) >= 30) {
    numerator <- 2 * stats::cov(paired_matrix[, 1], paired_matrix[, 2])
    denominator <- stats::var(paired_matrix[, 1]) + stats::var(paired_matrix[, 2]) +
      (mean(paired_matrix[, 1]) - mean(paired_matrix[, 2]))^2
    if (denominator > 0) numerator / denominator else NA_real_
  } else NA_real_
  production_retest_results[[length(production_retest_results) + 1]] <- data.frame(
    axis_id = axis_id,
    pair_n = nrow(paired_matrix),
    test_retest_correlation = correlation,
    concordance_correlation = concordance,
    mean_change = if (nrow(paired_matrix) > 0) mean(paired_matrix[, 2] - paired_matrix[, 1]) else NA_real_,
    sd_change = if (nrow(paired_matrix) > 1) stats::sd(paired_matrix[, 2] - paired_matrix[, 1]) else NA_real_,
    status = if (nrow(paired_matrix) < 30) "insufficient-data" else "estimated",
    stringsAsFactors = FALSE
  )
}
utils::write.csv(
  do.call(rbind, production_retest_results),
  file.path(output_dir, "production-score-test-retest.csv"),
  row.names = FALSE
)

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
  initial_layer_data <- as.data.frame(oriented_matrix[test_rows, selected_ids, drop = FALSE])
  pairwise_n <- if (length(selected_ids) >= 2) minimum_pairwise_n(initial_layer_data) else 0
  if (length(selected_ids) < 6 || pairwise_n < minimum_factor_n) {
    cfa_rows[[length(cfa_rows) + 1]] <- data.frame(layer = layer_name, status = "insufficient-data", n = sum(test_rows))
    next
  }

  layer_data <- initial_layer_data
  usable_rows <- rowSums(!is.na(layer_data)) >= 2
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
    lavaan::cfa(
      cfa_model,
      data = holdout,
      ordered = ordered_items,
      estimator = "WLSMV",
      missing = "pairwise",
      std.lv = TRUE
    ),
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
    usable <- rowSums(!is.na(axis_data)) >= 3
    axis_data <- axis_data[usable, , drop = FALSE]
    axis_groups <- droplevels(factor(groups[usable]))
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
  schemaVersions = schema_versions,
  formVersions = form_versions,
  qualityRuleVersions = quality_rule_versions,
  requiredMethodContract = list(
    schemaVersion = required_schema_version,
    consentVersion = required_consent_version,
    formVersion = required_form_version,
    qualityRuleVersion = required_quality_rule_version,
    bankVersion = if (nzchar(required_bank_version)) required_bank_version else NULL,
    scoringVersion = if (nzchar(required_scoring_version)) required_scoring_version else NULL
  ),
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
    "Primary-axis item-model coefficients do not validate the multidimensional salience-weighted production score; production scores are reported separately.",
    "Ipsative statement-choice items and items marked needs-rewrite are excluded from common-scale reliability and factor analyses.",
    "CFA uses a primary-axis model and WLSMV on a held-out split; cross-loadings require substantive review.",
    "DIF flags require follow-up review and do not by themselves prove bias."
  )
)
jsonlite::write_json(summary, file.path(output_dir, "validation-summary.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
cat("Validation outputs written to", normalizePath(output_dir), "\n")
