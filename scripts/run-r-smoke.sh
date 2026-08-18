#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT_DIR=${1:-"$ROOT/artifacts/r-smoke"}
R_LIBS_USER=${R_LIBS_USER:-}
export R_LIBS_USER
export QUALITY_MINIMUM_DURATION_MS="${QUALITY_MINIMUM_DURATION_MS:-0}"
export QUALITY_MINIMUM_MS_PER_ITEM="${QUALITY_MINIMUM_MS_PER_ITEM:-0}"
export QUALITY_MAXIMUM_MISSING_RATE="${QUALITY_MAXIMUM_MISSING_RATE:-1.1}"
export QUALITY_MAXIMUM_INVARIANT_RATE="${QUALITY_MAXIMUM_INVARIANT_RATE:-1.1}"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

Rscript "$ROOT/analysis/run_data_quality.R" \
  "$ROOT/analysis/fixtures/clean-rebuild-r-smoke/core.json" \
  "$OUT_DIR/quality"

Rscript "$ROOT/analysis/run_validation.R" \
  "$ROOT/analysis/fixtures/clean-rebuild-r-smoke/core.json" \
  "$OUT_DIR/validation" \
  "$OUT_DIR/quality/analysis-inclusion-manifest.csv"

Rscript "$ROOT/analysis/run_specialist_validation.R" \
  "$ROOT/analysis/fixtures/clean-rebuild-r-smoke/core.json" \
  "$ROOT/analysis/fixtures/clean-rebuild-r-smoke/specialist.json" \
  "$OUT_DIR/specialist"

Rscript - "$OUT_DIR" <<'RS'
args <- commandArgs(trailingOnly = TRUE)
out <- args[[1]]
required <- c(
  "quality/submission-quality.csv",
  "quality/analysis-inclusion-manifest.csv",
  "validation/form-incidence-summary.csv",
  "specialist/specialist-dispositions.csv"
)
missing <- required[!file.exists(file.path(out, required))]
if (length(missing) > 0) stop("R smoke outputs missing: ", paste(missing, collapse = ", "))
manifest <- read.csv(file.path(out, "quality/analysis-inclusion-manifest.csv"), stringsAsFactors = FALSE)
stopifnot(nrow(manifest) == 1L, manifest$decision[[1]] == "include")
stopifnot(manifest$manifest_version[[1]] == "clean-rebuild-v1")
stopifnot(manifest$manifest_fingerprint[[1]] == "fp-smoke")
stopifnot(manifest$serialization_version[[1]] == "canonical-json-v1")
stopifnot(manifest$contract_route[[1]] == "research-browser")
stopifnot(manifest$contract_cohort[[1]] == "community-2026-v5")
RS

echo "R smoke outputs written to $OUT_DIR"
