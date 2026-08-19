# v2 Research Analysis Data Dictionary

The raw input is one immutable Phase 13 research envelope per line. The analysis projection is long-form and privacy-safe.

| Field | Type | Meaning | Missingness |
| --- | --- | --- | --- |
| `subject_ordinal` | integer | Stable row-local subject key assigned during the run | Never a direct identifier |
| `scope` | `core` or `specialist` | Canonical item scope | Required |
| `module_id` | string or null | Explicit specialist module membership | Null for core items |
| `item_id` | string | Accepted canonical item ID | Required; resolved by registry |
| `response_type` | enum | Canonical response type | Required |
| `state` | enum | Raw response state, or `structural_not_applicable` for an unrequested specialist module | Never collapsed into answered |
| `analysis_state` | enum | `observed`, `missing`, `structural_not_applicable`, or `excluded` | Determined by config, not inferred from values |
| `raw_value` | number or null | Raw Likert value only | Null for choices and non-answered states |
| `option_id` | string or null | Explicit statement-choice option | Null for Likert and non-answered states |
| `content_fingerprint` | string | Canonical content binding | Required |
| `content_version` | string | Canonical content version | Required |
| `scoring_version` | string | Scoring contract binding retained for replay | Required |

The analysis outputs do not emit `submissionId`, prompts, labels, demographics, identity fields, result profiles, or private-save/share data.
