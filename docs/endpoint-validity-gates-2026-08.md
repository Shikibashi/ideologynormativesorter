# Endpoint validity gates, 2026-08

Status: governance and analysis gate. This document does not claim that any ideology endpoint has passed empirical validation.

## Status semantics

The canonical node measurement status is authoritative for empirical measurement. A production profile may be exposed for compatibility scoring without being validated. `compatibility-scored-unvalidated` means that the endpoint has an editorial definition, a scored centroid, and constitutive item gates, but lacks sufficient respondent evidence for a validated interpretation.

For this respondent-only study, `respondent-supported-scored` is the highest permitted promotion status. It requires respondent-supported reliability, temporal stability, construct validity, discriminant validity, subgroup review, and a documented interpretation for a defined population and use. `validated-scoped-public` remains blocked because expert and cognitive content-validity evidence was not collected. A profile release or deployment status must not reuse a measurement status name.

## Primary endpoint requirements

Before any primary ideology can move beyond compatibility scoring, the analysis record must include:

- A frozen label-specific construct map and item membership.
- Internal consistency and dimensionality evidence for each score used in the endpoint.
- Test-retest stability with SEM and MDC95, not correlation alone.
- Known-groups or external-criterion evidence with pre-specified directional hypotheses.
- Discriminant evidence against adjacent labels, including false-positive review and a rule for merging or retiring indistinguishable labels.
- DIF and substantive subgroup review for the registered population and intended use.
- An explicit limitation record stating that content validity and response-process validity were not established.

Axis-level reliability or factor fit does not validate a salience-weighted, multidimensional ideology endpoint. Each endpoint must be evaluated as the score that users actually receive.

## Construct and source coverage audit

The source maps record evidence scope by label and layer. The audit output must materialize one row per label and layer with:

```text
label_id,measurement_role,source_ids,normative,descriptive,prescriptive,ideal,nonideal,boundary,scope_note,coverage_status
```

For primary labels, `coverage_status` must be `complete` only when every required layer has a direct or explicitly scoped source. A family-level source cannot silently satisfy a subtype's normative, descriptive, or prescriptive requirement. Missing scope must remain `incomplete`, even when the label has a definition source.

## DIF configuration

The R validation runner uses `PSYCH_DIF_GROUPS` to select registered voluntary grouping variables. The default remains `ageBand,genderGroup`; adding another variable requires that it be collected under the approved consent and privacy protocol, included in the frozen submission schema, and named in the preregistration. A group with insufficient observations produces no DIF estimate.

The DIF output is a screening result. Flagged items require effect-size or impact review, content review, and a substantive decision. A non-significant result in an underpowered group is not evidence of invariance or fairness.

## Promotion rule

No profile is promoted to `respondent-supported-scored` from source coverage, passing software tests, a centroid review, or a successful browser render. Promotion requires the complete respondent evidence record, version-specific analysis outputs, and an explicit decision log. `validated-scoped-public` is unavailable under the respondent-only design.
