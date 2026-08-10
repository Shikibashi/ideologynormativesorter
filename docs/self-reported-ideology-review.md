# Self-reported ideology candidate review

The research flow allows respondents to name one or more ideologies, traditions, or movements that are not in the current label selector. These entries are stored as optional research metadata in `identity.selfReportedIdeologies` and are summarized privately by:

```text
self-reported-ideology-candidates.csv
```

The report counts distinct initial-administration respondents by study, bank version, and normalized candidate text. It must be generated from a protected research extract and must not be published with participant codes or raw answer vectors.

## Interpretation

The candidate report is a discovery queue, not a vote and not evidence that a new ideology deserves a production score. Frequency can reflect recruitment composition, naming conventions, aliases, coordinated submissions, or a tradition that requires several distinct constructs rather than one label.

Before promoting a candidate, the research team should specify and document:

- the minimum respondent and subgroup evidence threshold;
- an academic definition and scope note;
- whether the candidate is a primary ideology, a specialist module, a modifier, or an alias;
- a dedicated item set that distinguishes it from nearby existing labels;
- respondent-grounded reliability, separability, and stability checks;
- content-review and privacy/disclosure decisions.

No candidate is added to `src/data/labels.ts`, the scoring pool, or a public result merely because it appears in this report.
