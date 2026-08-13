# Recruitment and retest operations

This is an operational template for the validation study. It does not authorize recruitment or replace ethics, privacy, legal, or institutional review.

## Roles and separation of duties

Assign distinct responsibilities where staffing permits:

- a recruitment coordinator who can access contact information but not raw responses;
- a data custodian who can access pseudonymous study records but not recruitment identities;
- an analysis lead working from a frozen, de-identified extract;
- an independent content-review panel with varied political priors;
- a release approver responsible for disclosure control and version labeling.

Never put email addresses, names, phone numbers, recruitment-platform IDs, IP addresses, or exact locations in the research submission record.

## Study URLs

Initial administration:

```text
https://SITE/?research=1&study=community-2026-v4&formSize=120
```

Retest administration:

```text
https://SITE/?research=1&study=community-2026-v4&administration=retest&formSize=120
```

The same browser retains the pseudonymous participant code. Cross-device retest linkage requires a separate random linking token managed outside the response collector. Do not use an email address as the participant code.

## Recruitment frame

Use several channels with different expected political compositions, such as general online panels, universities or adult-education lists, civic organizations, professional networks, and ideologically diverse communities. Do not rely exclusively on the application's existing audience.

Maintain a recruitment log containing only aggregate operational counts by channel:

- invitations distributed;
- study starts;
- consented starts;
- completed records;
- retest invitations;
- matched retest completions;
- incentive costs.

The response dataset may include a coarse preregistered recruitment-channel code only when needed for sampling diagnostics and only when cells will remain sufficiently large.

## Quotas and monitoring

Before launch, define target ranges for broad age bands, gender groups, political self-label families, and recruitment channels. Monitor only aggregate counts. Avoid continuously inspecting item statistics or ideology outcomes while recruitment is active.

Use targeted supplementation when a group is severely underrepresented. Do not stop or expand a subgroup because its preliminary coefficients are favorable or unfavorable.

## Invitation copy requirements

Recruitment copy must state:

- the study concerns development of a political-attitudes instrument;
- participation is voluntary and restricted to adults;
- approximate assigned-form burden based on cognitive-pilot timing;
- whether an incentive is offered;
- that responses are pseudonymous and political views are sensitive data;
- that participants may stop before submission;
- the study contact and data-controller contact maintained outside the response system;
- the retest possibility and planned interval, when applicable.

Do not advertise a guaranteed ideology diagnosis or validated accuracy.

## Consent and withdrawal

The in-app consent records permission to submit the pseudonymous response record. Provide a separate study information page with the full data controller, retention period, risks, benefits, contact process, and jurisdiction-specific rights.

Because the response collector does not know participant identity, post-submission withdrawal requires the participant to retain and provide their random participant code. State this limitation before consent. Establish a protected process for receiving deletion requests without attaching identity to the analysis dataset.

## Incentives

Use a fixed incentive independent of answers and result labels. Keep payment identifiers in the recruitment system. Mark completion in that system using a one-time completion token or manual process that cannot be reversed into the answer record.

Document fraud controls before launch. Do not collect unnecessary device fingerprints or covert tracking data as a shortcut.

## Initial administration procedure

1. Direct the participant to the versioned research URL.
2. Show the study information and in-app consent before questions.
3. Assign a deterministic balanced form and randomized presentation order.
4. Permit `I don't know` on descriptive items and optional confidence/priority ratings.
5. Capture optional self-identification before displaying model-generated results.
6. Submit over HTTPS to the configured endpoint or allow local record download if the study uses manual transfer.
7. Show the participant code and advise retaining it for withdrawal or retest linkage.
8. Keep the public result explicitly labeled as an under-validation output.

## Retest procedure

Schedule the retest invitation 14–28 days after the initial completion according to the preregistered interval. Invitations and reminders remain in the recruitment system.

The retest must use:

- the same study ID;
- the same question-bank and scoring versions;
- the same taxonomy, assignment strategy, and assignment-roster versions;
- the same assigned item coverage where a matrix form was used;
- a different deterministic presentation order;
- the same pseudonymous participant code;
- `administration=retest` in the study URL.

Do not expose the participant's prior answers during retest. The ordered specialist roster must remain frozen for this study; a roster change requires a new study cohort or assignment strategy rather than reassignment during retest. Record major external political events affecting the whole study period in an aggregate study log. Do not ask participants for detailed personal political events unless separately approved and necessary.

## Reminder schedule

A default schedule may use:

- one invitation on the eligible retest date;
- one reminder after 3–4 days;
- a final reminder before the 28-day window closes.

Do not continue contacting participants after withdrawal, completion, or the preregistered window.

## Collector deployment controls

The reference collector is not production-hardened by itself. Production deployment requires:

- HTTPS termination;
- strict allowed origin;
- request-size limits;
- rate limiting and denial-of-service controls;
- encrypted storage and backups;
- access logging that excludes request bodies and minimizes network identifiers;
- secret management outside the repository;
- retention and deletion automation;
- restricted operator access;
- monitoring for write failures and storage exhaustion;
- an incident-response procedure.

Raw NDJSON files belong in a private data environment and must never be committed to Git.

## Daily operational checks

Review only operational metrics during active collection:

- collector availability and rejected-request counts;
- total consented submissions by administration and version;
- malformed or incompatible records;
- item assignment counts, without examining response direction;
- duration and missingness distributions for gross technical faults;
- recruitment quota progress;
- storage, backup, and encryption status.

Freeze an incident log. Any change to the instrument, consent, form assignment, or collector creates a documented version boundary.

## Data freeze

At the preregistered close:

1. stop new invitations and record the close timestamp;
2. export a read-only snapshot;
3. compute a cryptographic checksum in the protected environment;
4. retain the untouched raw snapshot;
5. create a derived analysis copy;
6. apply preregistered quality flags without deleting raw records;
7. produce the participant flow table;
8. freeze the analysis code revision and environment manifest;
9. run development analyses;
10. preserve the confirmation sample from outcome-driven changes.

## Release controls

Before publishing results:

- confirm that all coefficients refer to explicit bank, scoring, schema, and sample versions;
- suppress small demographic or recruitment cells;
- remove participant codes and raw answer vectors;
- report every exclusion count and model failure;
- distinguish development and confirmation results;
- report null, poor-fit, and non-estimable findings;
- retain the statement that the instrument is low-stakes and not a diagnosis.
