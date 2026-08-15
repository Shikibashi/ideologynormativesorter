#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "strategy-conjoint", "2026-08-strategy-task-bank-v2", "pre-registered strategy-task attribute effects", 100L, mode = "strategy-conjoint")
