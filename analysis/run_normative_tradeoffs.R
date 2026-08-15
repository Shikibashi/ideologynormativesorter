#!/usr/bin/env Rscript
script_path <- sub("^--file=", "", commandArgs(trailingOnly = FALSE)[grep("^--file=", commandArgs(trailingOnly = FALSE))][[1]])
source(file.path(dirname(script_path), "research_contracts.R"))
run_research_analysis(commandArgs(trailingOnly = TRUE), "normative-tradeoffs", "2026-08-normative-tradeoff-v1", "pre-registered normative trade-off preferences", 100L, mode = "normative-tradeoffs")
