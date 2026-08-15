#!/usr/bin/env Rscript

if (!requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Missing required R package: jsonlite")
}

`%||%` <- function(x, y) if (is.null(x) || length(x) == 0) y else x

required_version_bundle_keys <- c(
  "architectureVersion", "implementationSpecVersion", "decisionLogVersion",
  "bankVersion", "scoringVersion", "taxonomyVersion",
  "primaryMeasurementVersion", "modifierMeasurementVersion", "formVersion",
  "schemaVersion", "consentVersion", "qualityRuleVersion", "studyId",
  "specialistRosterVersion", "specialistAssignmentStrategy",
  "researchTaskBankVersion", "researchEstimatorVersion",
  "descriptiveCalibrationVersion", "strategyTaskBankVersion",
  "normativeTradeoffVersion", "modelComparisonVersion",
  "unfoldingAnalysisVersion", "perceptionGeometryVersion",
  "profileDiscoveryVersion", "prototypeCodingVersion", "deploymentScopeVersion",
  "constructFamilyMapVersion", "criterionPlanVersion", "validatorBatteryVersion",
  "prototypeCalibrationVersion", "difPlanVersion", "contentReviewVersion",
  "cognitiveReviewVersion", "labelExposureVersion", "formEquivalenceVersion",
  "anchorRotationVersion", "validationReportVersion", "itemMetadataVersion"
)

contract_stop <- function(message) {
  stop(paste0("Research analysis contract violation: ", message), call. = FALSE)
}

read_contract_records <- function(path) {
  if (!file.exists(path) && !dir.exists(path)) {
    contract_stop(paste0("input path does not exist: ", path))
  }

  read_json <- function(file_path) {
    parsed <- jsonlite::fromJSON(file_path, simplifyVector = FALSE)
    if (!is.null(parsed$schemaVersion) || !is.null(parsed$recordType)) {
      list(parsed)
    } else if (is.list(parsed)) {
      parsed
    } else {
      contract_stop(paste0("input is not a JSON record or record list: ", file_path))
    }
  }

  if (dir.exists(path)) {
    files <- list.files(path, pattern = "\\.(json|jsonl|ndjson)$", full.names = TRUE)
    if (length(files) == 0) contract_stop("input directory contains no JSON files")
    return(unlist(lapply(files, read_json), recursive = FALSE))
  }

  if (grepl("\\.(jsonl|ndjson)$", path, ignore.case = TRUE)) {
    lines <- readLines(path, warn = FALSE)
    lines <- lines[nzchar(trimws(lines))]
    if (length(lines) == 0) contract_stop("input contains no JSON records")
    return(lapply(lines, jsonlite::fromJSON, simplifyVector = FALSE))
  }

  read_json(path)
}

record_id <- function(record) {
  value <- record$submissionId %||% record$recordId %||% record$id %||% ""
  if (!is.character(value) || length(value) != 1) "" else value
}

read_inclusion_manifest <- function(path, records) {
  if (!file.exists(path)) contract_stop(paste0("inclusion manifest does not exist: ", path))
  manifest <- utils::read.csv(path, stringsAsFactors = FALSE, check.names = FALSE)
  required <- c("submission_id", "decision")
  missing <- setdiff(required, names(manifest))
  if (length(missing) > 0) {
    contract_stop(paste0("inclusion manifest is missing: ", paste(missing, collapse = ", ")))
  }
  if (nrow(manifest) == 0) contract_stop("inclusion manifest is empty")
  if (any(!nzchar(manifest$submission_id)) || anyDuplicated(manifest$submission_id)) {
    contract_stop("inclusion manifest must contain one unique non-empty submission_id per record")
  }
  if (any(!manifest$decision %in% c("include", "exclude"))) {
    contract_stop("every manifest decision must be include or exclude; unresolved rows are not analyzable")
  }

  ids <- vapply(records, record_id, character(1))
  if (any(!nzchar(ids)) || anyDuplicated(ids)) {
    contract_stop("input records must contain unique non-empty submissionId, recordId, or id values")
  }
  if (length(setdiff(ids, manifest$submission_id)) > 0) {
    contract_stop("inclusion manifest does not resolve every input record")
  }
  if (length(setdiff(manifest$submission_id, ids)) > 0) {
    contract_stop("inclusion manifest contains records absent from the input")
  }

  for (row_index in seq_len(nrow(manifest))) {
    record <- records[[match(manifest$submission_id[[row_index]], ids)]]
    if ("study_id" %in% names(manifest) &&
        nzchar(manifest$study_id[[row_index]]) &&
        !identical(manifest$study_id[[row_index]], as.character(record$studyId %||% ""))) {
      contract_stop(paste0("manifest study_id does not match record ", manifest$submission_id[[row_index]]))
    }
    if ("participant_id" %in% names(manifest) &&
        nzchar(manifest$participant_id[[row_index]]) &&
        !identical(manifest$participant_id[[row_index]], as.character(record$participantId %||% ""))) {
      contract_stop(paste0("manifest participant_id does not match record ", manifest$submission_id[[row_index]]))
    }
  }

  manifest
}

version_bundle_for <- function(record) {
  bundle <- record$versionBundle
  if (is.null(bundle) || !is.list(bundle) || length(bundle) == 0) {
    contract_stop(paste0("record ", record_id(record), " has no machine-readable versionBundle"))
  }
  missing_keys <- setdiff(required_version_bundle_keys, names(bundle))
  extra_keys <- setdiff(names(bundle), required_version_bundle_keys)
  if (length(missing_keys) > 0 || length(extra_keys) > 0) {
    contract_stop(paste0(
      "record ", record_id(record),
      " has an incomplete versionBundle (missing: ", paste(missing_keys, collapse = ", "),
      "; extra: ", paste(extra_keys, collapse = ", "), ")"
    ))
  }
  values <- unlist(bundle, use.names = TRUE)
  values <- values[nzchar(names(values)) & !is.na(values)]
  if (length(values) == 0 || any(!nzchar(as.character(values)))) {
    contract_stop(paste0("record ", record_id(record), " has an empty versionBundle field"))
  }
  as.list(as.character(values)) |> setNames(names(values))
}

common_version_bundle <- function(records) {
  bundles <- lapply(records, version_bundle_for)
  keys <- unique(unlist(lapply(bundles, names), use.names = FALSE))
  result <- list()
  for (key in keys) {
    values <- unique(vapply(bundles, function(bundle) as.character(bundle[[key]] %||% ""), character(1)))
    if (length(values) != 1 || !nzchar(values[[1]])) {
      contract_stop(paste0("mixed or missing versionBundle field: ", key))
    }
    result[[key]] <- values[[1]]
  }
  result
}

first_nonempty <- function(records, fields) {
  for (record in records) {
    for (field in fields) {
      value <- record[[field]] %||% ""
      if (is.character(value) && length(value) == 1 && nzchar(trimws(value))) return(value)
    }
  }
  ""
}

numeric_answer_values <- function(record) {
  answers <- record$answers %||% list()
  if (!is.list(answers)) return(numeric(0))
  values <- vapply(answers, function(answer) {
    value <- answer$value %||% NA_real_
    if (is.numeric(value) && length(value) == 1 && is.finite(value)) as.numeric(value) else NA_real_
  }, numeric(1))
  values[is.finite(values)]
}

summarize_observations <- function(records) {
  observed <- vapply(records, function(record) length(numeric_answer_values(record)), integer(1))
  total_items <- vapply(records, function(record) length(record$answers %||% list()), integer(1))
  data.frame(
    record_count = length(records),
    observed_response_count = sum(observed),
    answer_slot_count = sum(total_items),
    observed_rate = if (sum(total_items) == 0) NA_real_ else sum(observed) / sum(total_items),
    stringsAsFactors = FALSE
  )
}

parse_contract_args <- function(args, analysis_id, analysis_version, estimand, minimum_n = 2L) {
  if (length(args) < 3) {
    contract_stop(paste0(
      "usage: Rscript <entrypoint>.R <records.json|jsonl|directory> <output-directory> <analysis-inclusion-manifest.csv>"
    ))
  }
  list(
    input = args[[1]],
    output = args[[2]],
    manifest = args[[3]],
    analysisId = analysis_id,
    analysisVersion = analysis_version,
    estimand = estimand,
    minimumN = as.integer(Sys.getenv("ANALYSIS_MINIMUM_N", as.character(minimum_n))),
    seed = as.integer(Sys.getenv("ANALYSIS_SEED", "20260814")),
    codeRevision = Sys.getenv("ANALYSIS_CODE_REVISION", ""),
    studyId = Sys.getenv("ANALYSIS_STUDY_ID", ""),
    denominatorDescription = Sys.getenv(
      "ANALYSIS_DENOMINATOR_DESCRIPTION",
      "Records selected by the frozen, explicitly resolved inclusion manifest"
    ),
    fingerprint = Sys.getenv("ANALYSIS_FINGERPRINT", "")
  )
}

run_research_analysis <- function(args, analysis_id, analysis_version, estimand, minimum_n = 2L,
                                  required_packages = character(0), mode = analysis_id) {
  missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
  if (length(missing_packages) > 0) {
    contract_stop(paste0("missing required R package(s): ", paste(missing_packages, collapse = ", ")))
  }

  config <- parse_contract_args(args, analysis_id, analysis_version, estimand, minimum_n)
  if (length(config$seed) != 1 || is.na(config$seed)) contract_stop("ANALYSIS_SEED must be an integer")
  records <- read_contract_records(config$input)
  manifest <- read_inclusion_manifest(config$manifest, records)
  included_ids <- manifest$submission_id[manifest$decision == "include"]
  records <- records[vapply(records, function(record) record_id(record) %in% included_ids, logical(1))]
  if (length(records) == 0) contract_stop("the resolved manifest includes no records")

  versions <- common_version_bundle(records)
  code_revision <- config$codeRevision
  if (!nzchar(code_revision)) {
    code_revision <- tryCatch(
      system2("git", c("rev-parse", "HEAD"), stdout = TRUE, stderr = FALSE)[[1]],
      error = function(error) ""
    )
  }
  if (!is.character(code_revision) || length(code_revision) != 1 || !nzchar(code_revision)) {
    contract_stop("ANALYSIS_CODE_REVISION is required when git revision cannot be resolved")
  }

  study_id <- config$studyId
  if (!nzchar(study_id)) study_id <- first_nonempty(records, c("studyId", "studyID"))
  if (!nzchar(study_id)) contract_stop("study id is required")

  fingerprint <- config$fingerprint
  if (!nzchar(fingerprint)) {
    fingerprint <- first_nonempty(records, c("itemFingerprint", "taskFingerprint", "formFingerprint", "membershipFingerprint"))
  }
  if (!nzchar(fingerprint)) contract_stop("ANALYSIS_FINGERPRINT or a record fingerprint is required")

  observation_summary <- summarize_observations(records)
  status <- if (nrow(observation_summary) == 0 || observation_summary$record_count < config$minimumN) {
    "insufficient-data"
  } else {
    "contract-valid"
  }
  metadata <- list(
    recordType = "analysis",
    analysisId = config$analysisId,
    analysisVersion = config$analysisVersion,
    studyId = study_id,
    codeRevision = code_revision,
    inclusionManifestId = basename(normalizePath(config$manifest, mustWork = FALSE)),
    sample = list(
      includedN = length(records),
      excludedN = sum(manifest$decision == "exclude"),
      denominatorDescription = config$denominatorDescription
    ),
    estimand = config$estimand,
    seed = config$seed,
    versionBundle = versions,
    itemFingerprint = fingerprint
  )
  results <- list(
    recordType = "analysis-results",
    analysisId = config$analysisId,
    analysisVersion = config$analysisVersion,
    mode = mode,
    status = status,
    metadata = metadata,
    observationSummary = observation_summary,
    productionPromotion = "blocked-until-confirmation",
    note = "This output is research-only and does not alter the production scoring contract."
  )
  output_dir <- config$output
  dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
  jsonlite::write_json(metadata, file.path(output_dir, "analysis-metadata.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
  jsonlite::write_json(results, file.path(output_dir, "analysis-results.json"), pretty = TRUE, auto_unbox = TRUE, null = "null")
  jsonlite::write_json(
    list(
      recordType = "analysis-status",
      analysisId = config$analysisId,
      analysisVersion = config$analysisVersion,
      status = status,
      includedN = length(records),
      minimumN = config$minimumN,
      failClosed = TRUE
    ),
    file.path(output_dir, "analysis-status.json"),
    pretty = TRUE,
    auto_unbox = TRUE,
    null = "null"
  )
  utils::write.csv(observation_summary, file.path(output_dir, "observation-summary.csv"), row.names = FALSE)
  cat("Research analysis outputs written to ", normalizePath(output_dir, mustWork = FALSE), "\n", sep = "")
}
