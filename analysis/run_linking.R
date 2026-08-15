#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "longitudinal-linking", "2026-08-unfolding-analysis-v1", "longitudinal test-retest and anchor-linked change", 100L, mode = "longitudinal-linking")
