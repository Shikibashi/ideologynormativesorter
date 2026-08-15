#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "model-comparison", "2026-08-model-comparison-v1", "held-out comparison against the frozen production baseline", 300L, mode = "model-comparison")
