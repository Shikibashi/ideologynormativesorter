# Research task protocol — 2026-08

Status: opt-in research scaffold. These tasks are not part of the ordinary
profile and do not alter `buildResultProfile`, axis aggregation, label
matching, or participant-facing profile language.

## Entry and consent

The task application is reachable only through an explicit controlled URL:

```text
?research=1&arm=probability
?research=1&arm=choice
?research=1&arm=allocation
?research=1&arm=similarity
```

The existing research consent screen appears first. The task screen is not
reachable from the ordinary intro or from `contribute=1`. Declining consent
returns to the ordinary start screen without starting a task module.

## Frozen task contract

The current pilot scaffold is `RESEARCH_TASK_BANK_VERSION`
`2026-08-research-task-bank-v2`; its presentation assignment uses
`2026-08-research-task-form-v1`. Each task records its exact prompt, domain,
layer, theory context, criterion IDs, response format, options or stimulus
IDs, and optional task-level randomization key. The assignment records the
participant seed, arm, task membership, presentation order, and fingerprint.

The first scaffold contains one task for each supported format family:

| Arm         | Format             | Research construct                      | Missingness            |
| ----------- | ------------------ | --------------------------------------- | ---------------------- |
| probability | forecast           | descriptive belief and resolved outcome | `dont_know` or refusal |
| choice      | conjoint           | prescriptive strategy under constraints | none / refusal         |
| allocation  | allocation         | normative priority weights              | refusal                |
| similarity  | similarity ratings | research-only profile perception        | refusal                |

The response validator rejects out-of-range probabilities and ratings,
unknown alternatives or stimuli, incomplete sort permutations, duplicate
allocation goods, negative/noninteger allocations, and allocations that do
not sum to the frozen total. Missingness remains explicit rather than being
converted to a midpoint.

## Records and collector boundary

`ResearchTaskSubmission` is a separate record type. It carries the task bank
and form versions, complete version metadata, exact task definitions,
assignment seed, presentation order, and task-specific responses. The
Cloudflare Worker accepts it only when the task/form/version and response
contracts match its configured study. D1 migration `0002` adds the record type
without changing existing rows.

Task records are research outputs. Forecast calibration, conjoint effects,
ipsative allocation weights, and profile-similarity geometry require separate
estimands and later validation. None is a production score, label posterior,
population estimate, or ordinary result input.

## Resume and accessibility

The task screen stores only best-effort local progress keyed by study,
participant, and arm. It checks the assignment fingerprint before resuming.
Every task uses native controls, explicit group labels, progress semantics,
visible refusal controls, and an alert for invalid allocation or response
states. A completed record clears the task-progress draft while retaining the
submission receipt or pending local record.
