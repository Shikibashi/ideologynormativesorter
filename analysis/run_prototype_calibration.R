#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "prototype-calibration", "2026-08-prototype-calibration-v1", "expert-coded and respondent-bridge prototype calibration", 100L, mode = "prototype-calibration")
