# Semantic question-to-axis audit — July 2026

## Scope

This review covered the complete core question bank, including Likert items and statement-choice items. Each prompt was read against:

- its declared normative, descriptive, or prescriptive layer;
- the definitions and positive/negative poles of every assigned axis;
- the sign of each weight;
- whether the prompt measured one coherent construct;
- whether an empirical claim was operationalized enough to be answerable;
- whether a block-level weight template had been copied onto a prompt that measured something else.

The review is a content and scoring audit. It is not empirical psychometric validation.

## Outcomes

High-confidence sign inversions, construct mismatches, and template carryover errors are encoded in `src/data/semanticAudit.ts`. The application uses these mappings through `src/data/effectiveQuestions.ts`, leaving the original source bank intact for traceability.

Items that are ambiguous, double-barreled, non-discriminating, or insufficiently operationalized are marked `needs-rewrite` and deactivated from the public quiz, runtime scoring, research forms, and psychometric estimates. They remain addressable through `questionById` for audit history and old-result interpretation, but they cannot influence a new result until rewritten and reviewed.

The effective bank identifier is `2026-06-v4+2026-07-semantic-v1`; the result-scoring identifier is `2026-07-18-semantic-v3`.

## Defect classes

### Sign inversion

The prompt clearly pointed toward one pole but the weight pointed toward the opposite pole. Examples included:

- decentralized order scored as high state-capacity confidence;
- gradual sequencing scored as immediatism;
- limits on coercion scored as acceptance of coercion;
- predistributive rule changes scored as post-outcome redistribution;
- competing currencies scored toward state action rather than exit.

### Construct mismatch

The assigned axis was related to the policy domain but not to the claim being made. Examples included:

- regulator dependence on incumbent information scored as market confidence rather than public-choice skepticism;
- political patronage items scored as cultural plasticity;
- open standards and decentralized auditing scored as expert or state confidence instead of coordination optimism;
- elite threat inflation scored primarily as state capacity rather than public-choice incentives.

### Template carryover

Several domain blocks reused nearly identical weight triples across all items even when individual prompts changed direction or construct. The audit replaced only mappings whose intended direction was sufficiently clear.

### Double-barreled item

Some prompts included both a benefit and a cost, making agreement impossible to interpret as one score. These are deactivated and must be rewritten into separate items.

### Non-discriminating item

Some descriptive prompts only said that many factors matter or that outcomes depend on context. Such statements may be true but do not locate a respondent on a directional axis. These are deactivated.

### Underspecified empirical claim

Some prompts lacked a population, timeframe, outcome measure, comparison, or falsifiable scope. These require an operational definition and sources before they can return to an active empirical bank.

## Forced-choice items

Statement-choice items are treated as ipsative: choosing one option only shows preference relative to the alternatives presented. Options may load on different axes and are not assumed to form a common psychometric scale. They are therefore excluded from Cronbach alpha, item-total correlation, and split-half estimates.

Several empirical forced-choice items are deactivated because their options are not mutually exclusive and span different constructs.

## What remains

1. Rewrite every `needs-rewrite` item, then conduct cognitive interviews before returning it to scoring.
2. Add an operational `evidenceNote` and public `sources` to descriptive items.
3. Obtain independent content review from reviewers with differing political perspectives.
4. Pilot the revised active bank with real respondents.
5. Examine dimensionality, reliability, temporal stability, criterion agreement, and differential item functioning.
6. Recalibrate label centroids only after the axis model is empirically supported.

## Design reference

The review took product inspiration from Find My Politics, particularly its emphasis on multiple test lengths, directional item balance, context and sources for questions, optional pre-result self-identification, and presenting labels as nearby neighborhoods. Those practices are useful design references but are not evidence that either instrument is valid. No wording, scoring model, historical-figure mapping, or country comparison was copied.
