suppressPackageStartupMessages(library(jsonlite))

read_ndjson <- function(path) {
  lines <- readLines(path, warn = FALSE, encoding = "UTF-8")
  lines <- lines[nzchar(trimws(lines))]
  lapply(lines, function(line) fromJSON(line, simplifyVector = FALSE))
}

write_json_file <- function(value, path) {
  dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
  writeLines(toJSON(value, auto_unbox = TRUE, null = "null", pretty = TRUE, digits = 16), path, useBytes = TRUE)
}

first_or <- function(value, fallback = NA_character_) {
  if (length(value) == 0 || is.null(value)) fallback else as.character(value[[1]])
}

safe_number <- function(value) {
  if (length(value) == 0 || is.null(value) || !is.numeric(value)) NA_real_ else as.numeric(value[[1]])
}

validate_versions <- function(envelopes, expected) {
  fields <- names(expected)
  issues <- list()
  for (i in seq_along(envelopes)) {
    envelope <- envelopes[[i]]
    for (field in fields) {
      received <- first_or(envelope[[field]], "")
      if (!identical(received, as.character(expected[[field]]))) {
        issues[[length(issues) + 1L]] <- list(index = i, field = field, received = received, expected = as.character(expected[[field]]))
      }
    }
  }
  issues
}

response_map <- function(envelope, scope) {
  responses <- envelope$responses[[scope]]
  if (length(responses) == 0) return(list())
  keys <- vapply(responses, function(response) first_or(response$itemId, ""), character(1))
  setNames(responses, keys)
}

project_long <- function(envelopes, bundle) {
  rows <- list()
  row_index <- 0L
  items <- bundle$items
  for (subject in seq_along(envelopes)) {
    envelope <- envelopes[[subject]]
    requested <- unlist(envelope$responses$requestedSpecialistModuleIds, use.names = FALSE)
    core_map <- response_map(envelope, "core")
    specialist_map <- response_map(envelope, "specialist")
    for (item in items) {
      scope <- first_or(item$role, "")
      module_id <- if (is.null(item$moduleId)) NA_character_ else first_or(item$moduleId)
      structural_na <- identical(scope, "specialist") && !is.na(module_id) && !(module_id %in% requested)
      response <- if (structural_na) NULL else if (identical(scope, "core")) core_map[[first_or(item$id)]] else specialist_map[[first_or(item$id)]]
      row_index <- row_index + 1L
      state <- if (structural_na) "structural_not_applicable" else if (is.null(response)) "missing" else first_or(response$state, "missing")
      answered <- identical(state, "answered")
      response_type <- first_or(item$responseType, "")
      rows[[row_index]] <- list(
        subject_ordinal = subject,
        scope = scope,
        module_id = module_id,
        item_id = first_or(item$id),
        response_type = response_type,
        state = state,
        analysis_state = if (structural_na) "structural_not_applicable" else if (answered) "observed" else "missing",
        raw_value = if (answered && identical(response_type, "statement-choice")) NA_real_ else if (answered) safe_number(response$value) else NA_real_,
        option_id = if (answered && identical(response_type, "statement-choice")) first_or(response$optionId) else NA_character_,
        content_fingerprint = first_or(envelope$contentFingerprint),
        content_version = first_or(envelope$contentVersion),
        scoring_version = first_or(envelope$scoringVersion)
      )
    }
  }
  as.data.frame(do.call(rbind, lapply(rows, as.data.frame, stringsAsFactors = FALSE)), stringsAsFactors = FALSE)
}

state_summary <- function(long) {
  counts <- table(long$state)
  value <- list()
  for (name in names(counts)) value[[name]] <- unname(as.integer(counts[[name]]))
  value
}

item_descriptives <- function(long) {
  observed <- long[long$analysis_state == "observed" & !is.na(long$raw_value), , drop = FALSE]
  all_items <- unique(long[, c("scope", "module_id", "item_id", "response_type")])
  rows <- lapply(seq_len(nrow(all_items)), function(i) {
    item <- all_items[i, ]
    values <- observed$raw_value[observed$item_id == item$item_id]
    data.frame(scope = item$scope, module_id = item$module_id, item_id = item$item_id, response_type = item$response_type,
      n_observed = length(values), mean = if (length(values)) mean(values) else NA_real_, sd = if (length(values) > 1) sd(values) else NA_real_,
      min = if (length(values)) min(values) else NA_real_, max = if (length(values)) max(values) else NA_real_,
      stringsAsFactors = FALSE)
  })
  do.call(rbind, rows)
}

alpha <- function(matrix_values) {
  complete <- matrix_values[complete.cases(matrix_values), , drop = FALSE]
  if (nrow(complete) < 3L || ncol(complete) < 2L) return(NA_real_)
  total_variance <- var(rowSums(complete))
  if (!is.finite(total_variance) || total_variance <= 0) return(NA_real_)
  (ncol(complete) / (ncol(complete) - 1)) * (1 - sum(vapply(seq_len(ncol(complete)), function(i) var(complete[, i]), numeric(1))) / total_variance)
}

construct_matrices <- function(long, bundle) {
  root_constructs <- Filter(function(x) identical(first_or(x$scope), "root"), bundle$constructs)
  values <- long[long$scope == "core" & long$analysis_state == "observed" & !is.na(long$raw_value), , drop = FALSE]
  result <- list()
  for (construct in root_constructs) {
    construct_id <- first_or(construct$id)
    item_ids <- vapply(Filter(function(item) {
      contributions <- item$scoring$contributions
      any(vapply(contributions, function(contribution) identical(first_or(contribution$constructId), construct_id), logical(1)))
    }, Filter(function(item) identical(first_or(item$role), "core"), bundle$items)), function(item) first_or(item$id), character(1))
    item_ids <- unique(item_ids)
    if (length(item_ids) < 2L) next
    subjects <- sort(unique(long$subject_ordinal))
    matrix_values <- matrix(NA_real_, nrow = length(subjects), ncol = length(item_ids), dimnames = list(subjects, item_ids))
    for (j in seq_along(item_ids)) {
      selected <- values[values$item_id == item_ids[[j]], c("subject_ordinal", "raw_value")]
      matrix_values[match(selected$subject_ordinal, subjects), j] <- selected$raw_value
    }
    result[[construct_id]] <- matrix_values
  }
  result
}

run_module_status <- function(name, n, minimum, reason = NULL) {
  list(module = name, status = if (n >= minimum) "evaluated" else "NOT_EVALUABLE", n = n, minimum = minimum, reason = if (n >= minimum) "gate_met" else first_or(reason, "minimum_sample_gate_not_met"))
}

run_analysis <- function(envelopes, bundle, config, dataset_kind) {
  long <- project_long(envelopes, bundle)
  item_stats <- item_descriptives(long)
  matrices <- construct_matrices(long, bundle)
  reliability <- lapply(names(matrices), function(id) {
    matrix_values <- matrices[[id]]
    list(construct_id = id, n = nrow(matrix_values), items = ncol(matrix_values), alpha = alpha(matrix_values), status = if (nrow(matrix_values) >= config$gates$minimumReliabilitySubmissions) "evaluated" else "NOT_EVALUABLE", evidence_status = "NOT_EVALUATED")
  })
  dimensionality <- list(run_module_status("dimensionality", length(envelopes), config$gates$minimumDimensionalitySubmissions, "synthetic_fixture_is_not_empirical_evidence"), method = "polychoric_or_correlation_pca_in_approved_real_run", evidence_status = "NOT_EVALUATED")
  item_analysis <- list(status = if (length(envelopes) >= config$gates$minimumDescriptiveSubmissions) "evaluated" else "NOT_EVALUABLE", evidence_status = "NOT_EVALUATED", n = length(envelopes), item_count = nrow(item_stats), outputs = "item-descriptives.csv")
  invariance <- run_module_status("invariance", 0L, config$gates$minimumInvarianceGroupSize, "no_approved_group_variable_in_research_envelope")
  invariance$evidence_status <- "NOT_EVALUATED"
  retest <- run_module_status("test_retest", 0L, config$gates$minimumRetestPairs, "no_retest_pair_key_in_research_envelope")
  retest$evidence_status <- "NOT_EVALUATED"
  profiles <- run_module_status("profile_analysis", 0L, config$gates$minimumProfileCases, "raw_research_envelope_contains_no_profile_result_authority")
  profiles$evidence_status <- "NOT_EVALUATED"
  list(
    dataset_kind = dataset_kind,
    sample_size = length(envelopes),
    row_count = nrow(long),
    state_counts = state_summary(long),
    item_descriptives = item_stats,
    reliability = reliability,
    dimensionality = dimensionality,
    item_analysis = item_analysis,
    invariance = invariance,
    test_retest = retest,
    profile_analysis = profiles,
    missingness_policy = config$missingness,
    empirical_evidence_status = "NOT_EVALUATED",
    claims_eligible_for_production = FALSE
  )
}
