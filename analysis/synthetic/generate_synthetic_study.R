#!/usr/bin/env Rscript

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Missing required R package: jsonlite")
}

args <- commandArgs(trailingOnly = TRUE)
output_path <- if (length(args) >= 1) args[[1]] else "analysis/synthetic/output/submissions.ndjson"
dir.create(dirname(output_path), recursive = TRUE, showWarnings = FALSE)

set.seed(as.integer(Sys.getenv("SYNTHETIC_RANDOM_SEED", "20260718")))

n_test <- as.integer(Sys.getenv("SYNTHETIC_TEST_N", "600"))
n_retest <- min(as.integer(Sys.getenv("SYNTHETIC_RETEST_N", "200")), n_test)

axis_specs <- list(
  list(prefix = "syn_lib", axis_id = "synthetic-liberty", layer = "normative", item_count = 6L),
  list(prefix = "syn_eq", axis_id = "synthetic-equality", layer = "normative", item_count = 6L),
  list(prefix = "syn_cap", axis_id = "synthetic-state-capacity", layer = "descriptive", item_count = 6L)
)

make_item <- function(question_id, axis_id, layer, weight = 1, reverse_scored = FALSE,
                      review_status = "approved", response_type = "likert7") {
  item <- list(
    questionId = question_id,
    layer = layer,
    responseType = response_type,
    axisWeights = list(list(axisId = axis_id, weight = weight)),
    reverseScored = reverse_scored,
    reviewStatus = review_status,
    sourceCount = if (identical(layer, "descriptive")) 1L else 0L
  )
  if (identical(layer, "descriptive")) {
    item$evidenceNote <- "Synthetic operational definition used only to test source-coverage reporting."
  }
  item
}

item_map <- list()
for (spec in axis_specs) {
  for (item_index in seq_len(spec$item_count)) {
    question_id <- paste0(spec$prefix, "_", item_index)
    weight <- if (identical(question_id, "syn_lib_6")) -1 else 1
    reverse_scored <- identical(question_id, "syn_lib_5")
    item_map[[length(item_map) + 1]] <- make_item(
      question_id,
      spec$axis_id,
      spec$layer,
      weight = weight,
      reverse_scored = reverse_scored
    )
  }
}
item_map[[length(item_map) + 1]] <- make_item(
  "syn_rewrite_1", "synthetic-liberty", "normative", review_status = "needs-rewrite"
)
item_map[[length(item_map) + 1]] <- make_item(
  "syn_choice_1", "synthetic-equality", "normative", response_type = "statementChoice"
)
item_ids <- vapply(item_map, function(item) item$questionId, character(1))
item_by_id <- setNames(item_map, item_ids)

sigma <- matrix(c(
  1.00, 0.30, 0.15,
  0.30, 1.00, 0.10,
  0.15, 0.10, 1.00
), nrow = 3, byrow = TRUE)
latent_test <- matrix(stats::rnorm(n_test * 3), nrow = n_test, ncol = 3) %*% chol(sigma)
colnames(latent_test) <- c("liberty", "equality", "capacity")

participant_ids <- sprintf("syn_%04d", seq_len(n_test))
gender_groups <- rep(c("woman", "man"), length.out = n_test)
age_bands <- rep(c("18-24", "25-34"), each = ceiling(n_test / 2))[seq_len(n_test)]

ordinal_response <- function(linear_predictor) {
  thresholds <- c(-1.50, -1.00, -0.50, 0.00, 0.50, 1.00)
  as.integer(cut(linear_predictor, breaks = c(-Inf, thresholds, Inf), labels = FALSE)) - 4L
}

item_response <- function(theta, item, item_index, gender_group, administration) {
  axis_id <- item$axisWeights[[1]]$axisId
  latent_index <- switch(
    axis_id,
    "synthetic-liberty" = 1L,
    "synthetic-equality" = 2L,
    "synthetic-state-capacity" = 3L,
    1L
  )
  weight <- as.numeric(item$axisWeights[[1]]$weight)
  orientation <- sign(weight)
  if (isTRUE(item$reverseScored)) orientation <- -orientation
  loading <- 0.82 + ((item_index %% 3L) * 0.04)
  intercept <- ((item_index - 3.5) / 12)
  dif_shift <- if (identical(item$questionId, "syn_eq_6") && identical(gender_group, "man")) 0.90 else 0
  administration_noise <- if (identical(administration, "retest")) 0.05 else 0
  linear <- orientation * loading * theta[[latent_index]] + intercept + dif_shift + administration_noise + stats::rnorm(1, 0, 0.58)
  ordinal_response(linear)
}

iso_time <- function(seconds_from_origin) {
  format(
    as.POSIXct("2026-07-18 12:00:00", tz = "UTC") + seconds_from_origin,
    "%Y-%m-%dT%H:%M:%OS3Z",
    tz = "UTC"
  )
}

self_label <- function(theta) {
  if (theta[[1]] >= theta[[2]]) "liberty-neighborhood" else "equality-neighborhood"
}

predicted_labels <- function(label, correct_top1 = TRUE) {
  alternative <- if (identical(label, "liberty-neighborhood")) "equality-neighborhood" else "liberty-neighborhood"
  if (correct_top1) c(label, alternative, "mixed-neighborhood") else c(alternative, label, "mixed-neighborhood")
}

make_answers <- function(theta, gender_group, administration, missing_rate = 0.02, dont_know_rate = 0.04) {
  answers <- list()
  for (item_index in seq_along(item_map)) {
    item <- item_map[[item_index]]
    question_id <- item$questionId

    if (identical(question_id, "syn_choice_1")) {
      answers[[question_id]] <- list(questionId = question_id, value = if (theta[[2]] >= 0) 1L else 0L)
      next
    }
    if (identical(question_id, "syn_rewrite_1")) {
      answers[[question_id]] <- list(questionId = question_id, value = ordinal_response(theta[[1]] + stats::rnorm(1, 0, 0.8)))
      next
    }

    if (stats::runif(1) < missing_rate) next
    if (identical(item$layer, "descriptive") && stats::runif(1) < dont_know_rate) {
      answers[[question_id]] <- list(questionId = question_id, value = "dont_know")
      next
    }

    value <- item_response(theta, item, item_index, gender_group, administration)
    answer <- list(questionId = question_id, value = value)
    if (identical(item$layer, "descriptive")) answer$confidence <- sample(2:5, 1)
    answers[[question_id]] <- answer
  }
  answers
}

make_record <- function(participant_id, administration, theta, gender_group, age_band,
                        record_index, answers = NULL, duration_ms = NULL, consent_valid = TRUE) {
  answers <- answers %||% make_answers(theta, gender_group, administration)
  duration_ms <- duration_ms %||% round(stats::runif(1, 420000, 900000))
  started_seconds <- record_index * 1200
  completed_seconds <- started_seconds + duration_ms / 1000
  label <- self_label(theta)
  top1_correct <- stats::runif(1) < 0.84

  list(
    schemaVersion = "synthetic-2026-07-v1",
    studyId = "synthetic-pipeline-smoke-test",
    participantId = participant_id,
    administration = administration,
    submittedAt = iso_time(completed_seconds + 10),
    startedAt = iso_time(started_seconds),
    completedAt = iso_time(completed_seconds),
    durationMs = duration_ms,
    resumed = FALSE,
    presentationOrder = item_ids,
    bankVersion = "synthetic-bank-v1",
    scoringVersion = "synthetic-scoring-v1",
    tier = "extensive",
    consent = list(
      ageConfirmed = consent_valid,
      voluntaryParticipation = consent_valid,
      dataUseAccepted = consent_valid,
      consentVersion = "synthetic-consent-v1",
      consentedAt = iso_time(max(0, started_seconds - 60))
    ),
    identity = list(selfLabelId = label, ageBand = age_band, genderGroup = gender_group),
    predictedLabelIds = as.list(predicted_labels(label, top1_correct)),
    answers = answers,
    itemMap = item_map
  )
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

records <- vector("list", n_test + n_retest + 4L)
clean_test_records <- vector("list", n_test)

for (index in seq_len(n_test)) {
  record <- make_record(
    participant_ids[[index]],
    "test",
    latent_test[index, ],
    gender_groups[[index]],
    age_bands[[index]],
    index
  )
  records[[index]] <- record
  clean_test_records[[index]] <- record
}

for (index in seq_len(n_retest)) {
  retest_theta <- latent_test[index, ] + stats::rnorm(3, 0, 0.28)
  records[[n_test + index]] <- make_record(
    participant_ids[[index]],
    "retest",
    retest_theta,
    gender_groups[[index]],
    age_bands[[index]],
    n_test + index
  )
}

bad_offset <- n_test + n_retest
zero_answers <- setNames(lapply(item_ids, function(question_id) list(questionId = question_id, value = 0L)), item_ids)
records[[bad_offset + 1L]] <- make_record(
  "bad_fast", "test", c(0, 0, 0), "woman", "18-24", bad_offset + 1L,
  answers = zero_answers, duration_ms = 1000
)

missing_answers <- clean_test_records[[2]]$answers
for (question_id in head(item_ids, 13)) {
  missing_answers[[question_id]] <- list(questionId = question_id, value = "dont_know")
}
records[[bad_offset + 2L]] <- make_record(
  "bad_missing", "test", c(0, 0, 0), "man", "25-34", bad_offset + 2L,
  answers = missing_answers, duration_ms = 600000
)

records[[bad_offset + 3L]] <- make_record(
  "bad_duplicate", "test", latent_test[1, ], gender_groups[[1]], age_bands[[1]], bad_offset + 3L,
  answers = clean_test_records[[1]]$answers, duration_ms = 650000
)

records[[bad_offset + 4L]] <- make_record(
  "bad_consent", "test", c(0.2, -0.1, 0.3), "woman", "18-24", bad_offset + 4L,
  duration_ms = 600000, consent_valid = FALSE
)

json_lines <- vapply(records, function(record) {
  jsonlite::toJSON(record, auto_unbox = TRUE, null = "null", digits = NA)
}, character(1))
writeLines(json_lines, output_path, useBytes = TRUE)
cat("Wrote", length(records), "synthetic records to", normalizePath(output_path), "\n")
