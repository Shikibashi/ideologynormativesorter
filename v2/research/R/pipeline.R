args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 4L) stop("Usage: pipeline.R <input.ndjson> <bundle.json> <config.json> <output-dir>")
script_args <- commandArgs()
script_arg <- script_args[grepl("^--file=", script_args)]
script_path <- if (length(script_arg)) sub("^--file=", "", script_arg[[1]]) else "v2/research/R/pipeline.R"
source(file.path(dirname(normalizePath(script_path, mustWork = TRUE)), "analysis-lib.R"), local = TRUE)

input_path <- args[[1]]
bundle_path <- args[[2]]
config_path <- args[[3]]
output_dir <- args[[4]]
bundle <- fromJSON(bundle_path, simplifyVector = FALSE)
config <- fromJSON(config_path, simplifyVector = FALSE)
envelopes <- read_ndjson(input_path)
version_issues <- validate_versions(envelopes, config$expected)
if (length(version_issues) > 0L) stop("Version validation failed")
ids <- vapply(envelopes, function(x) first_or(x$submissionId, ""), character(1))
if (anyDuplicated(ids)) stop("Duplicate submission IDs must be resolved before the R run")

report <- run_analysis(envelopes, bundle, config, config$datasetKind)
long <- project_long(envelopes, bundle)
manifest <- list(
  manifest_schema_version = "research-dataset-manifest-v2.phase14.1",
  dataset_id = config$datasetKind,
  dataset_kind = config$datasetKind,
  analysis_schema_version = config$analysisSchemaVersion,
  source_versions = config$expected,
  accepted_submissions = length(envelopes),
  row_count = nrow(long),
  direct_identifiers_in_analysis_outputs = FALSE,
  submission_ids_emitted = FALSE,
  transformations = c("version_validation", "duplicate_rejection", "subject_ordinal_projection", "structural_specialist_non_applicability"),
  missingness_policy = config$missingness,
  empirical_evidence_status = "NOT_EVALUATED"
)
claims <- lapply(c("reliability", "dimensionality", "item_analysis", "invariance", "test_retest", "profile_analysis"), function(id) list(id = id, claim = "Empirical measurement claim requires approved real-data analysis", status = "NOT_EVALUABLE", evidence_source = "synthetic-fixture", eligible_for_production_claim = FALSE, reason = "Synthetic data exercises code paths but cannot establish population or psychometric claims"))
quality <- list(accepted_submissions = length(envelopes), rows = nrow(long), observed_rows = sum(long$analysis_state == "observed"), missing_rows = sum(long$analysis_state == "missing"), structural_not_applicable_rows = sum(long$analysis_state == "structural_not_applicable"), state_counts = state_summary(long), version_issues = version_issues)

dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
write_json_file(manifest, file.path(output_dir, "dataset-manifest.json"))
write_json_file(report, file.path(output_dir, "analysis-report.json"))
write_json_file(claims, file.path(output_dir, "claims.json"))
write_json_file(quality, file.path(output_dir, "quality.json"))
write.csv(long, file.path(output_dir, "analysis-long.csv"), row.names = FALSE, na = "")
write.csv(report$item_descriptives, file.path(output_dir, "item-descriptives.csv"), row.names = FALSE, na = "")
write.csv(do.call(rbind, lapply(report$reliability, as.data.frame)), file.path(output_dir, "reliability.csv"), row.names = FALSE, na = "")
write_json_file(list(package_versions = vapply(c("jsonlite", "psych", "lavaan", "mirt", "boot"), function(p) as.character(packageVersion(p)), character(1))), file.path(output_dir, "r-environment.json"))
write_json_file(list(direct_identifiers = FALSE, submission_ids = FALSE, raw_prompts = FALSE, result_profiles = FALSE, consented_analysis_only = TRUE), file.path(output_dir, "privacy-audit.json"))
cat(toJSON(list(status = "PASS", sample_size = length(envelopes), output_dir = normalizePath(output_dir)), auto_unbox = TRUE), "\n")
