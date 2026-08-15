#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "descriptive-calibration", "2026-08-descriptive-calibration-v1", "observed descriptive construct response calibration", 30L, required_packages = c("psych"))
