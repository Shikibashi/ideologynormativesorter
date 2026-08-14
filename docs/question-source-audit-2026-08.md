# Effective question source audit — 2026-08

This audit covers the effective bank after the semantic, editorial, evidence,
context, and prompt-review overlays. It does not treat raw question files or
inactive historical items as respondent-facing evidence.

## Coverage

| Population                             | Count | Source contract                                                     |
| -------------------------------------- | ----: | ------------------------------------------------------------------- |
| Active core questions                  |   338 | Context note, matched source record, and at least one public source |
| Respondent-facing specialist questions |    68 | Context note, matched source record, and at least one public source |
| Live questions                         |   406 | Unique IDs and effective prompt/source metadata                     |
| Descriptive live questions             |    64 | Evidence note, confidence prompt, and opt-out/refusal behavior      |

Every live question is checked in `src/data/questionSourceAudit.test.ts` for a
non-empty interrogative prompt, a context note longer than 100 characters, a
bespoke `questionContext` record, at least one HTTPS source, and source title
and publisher metadata. Descriptive items additionally retain an evidence
note, confidence prompt, and `allowDontKnow: true`.

Sources are contextual evidence, not answer keys. For normative and
prescriptive items they document the construct, institution, or boundary under
discussion; they do not establish that a respondent ought to agree. For
descriptive items the evidence note and sources narrow the population,
mechanism, outcome, and uncertainty rather than claiming universal or causal
validity.

## Source repairs

- `q0328` now points to SIGAR's current report page for _Lessons from the
  Coalition_; the effective record also retains the National Defense
  University Press source added in the triangulation pass.
- The Venice Commission records for `q0171` and `q0355` now use the current
  `default.aspx?pdffile=` document endpoint.
- The formal/informal-institutions source used by `q0478` and `q0479` now uses
  the article's current DOI, `10.1017/S1744137424000249`.

These changes update source addresses only. IDs, prompts, layers, response
types, scoring metadata, evidence boundaries, and respondent behavior are
unchanged.

## Validation boundary

The audit test validates source presence and metadata without making the test
suite dependent on third-party network availability. URL reachability was
checked separately during review; access-controlled scholarly hosts can return
`403` to automated requests even when the source is published and usable.
Content relevance remains an editorial judgment recorded in each evidence and
context note, not a claim that the source independently validates the quiz's
psychometric scales.
