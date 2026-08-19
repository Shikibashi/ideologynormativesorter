# Research readiness and evidence disposition

Status date: 2026-08-19
Instrument: `clean-rebuild`
Presentation projection: `2026-08-runtime-presentation-v1`

This record separates completed implementation work from evidence that requires
real people, qualified reviewers, or an approved study. No expert endorsement,
participant response, interview finding, reliability coefficient, validity
coefficient, subgroup result, or DIF conclusion is manufactured here.

## Decision summary

| Workstream | Current disposition | What is required before a stronger claim |
| --- | --- | --- |
| Definitions, boundaries, and specialist mappings | Textual/editorial review is versioned; qualified-expert gate remains in review | At least three independent reviewers with relevant political theory, survey measurement, or psychometric expertise; blinded ratings, adjudication, and a signed review record |
| Pilot reliability | Not collected | A consented pilot with item-level completeness sufficient for internal-consistency estimates; report alpha/omega with uncertainty and item diagnostics |
| Test-retest stability | Not collected | Matched consented retest observations after 2-4 weeks; report stability and measurement error, not only correlation |
| Known-groups validity | Not collected | Pre-specified groups and hypotheses, independent comparison measures, and effect estimates with uncertainty |
| Subgroup/DIF analysis | Not collected | Adequate subgroup sizes, pre-specified grouping variables, item-level DIF screening, and substantive review of flagged items |
| Cognitive interviews | Intentionally out of scope | Not part of the respondent-only evidence design; content and response-process validity remain unestablished |
| Specialist depth modules | 39 labels explicitly catalog-only; 39 labels have focused experimental module mappings | Construct-matched items, expert review, cognitive testing, reliability, stability, false-positive separation, and fairness evidence before promotion |
| Validation design | Respondent-only; expert review and cognitive interviews intentionally out of scope | Respondent evidence may support `respondent-supported-scored`, but `validated-scoped-public` remains blocked |
| Descriptive operational evidence | Complete for the active scored and mapped descriptive bank: 58 core + 6 specialist = 64/64 | Preserve scope/source metadata in every canonical runtime projection; sources remain context evidence, not answer keys or psychometric validation |

## Expert review protocol

The review packet should use independent reviewers who can evaluate political
theory definitions and boundaries as well as survey measurement. Each reviewer
rates, for every root and specialist mapping:

1. Definition fidelity: does the description identify a defensible family
   resemblance without treating a contested tradition as uniform?
2. Boundary validity: does the mapping distinguish the label from adjacent
   traditions and avoid inferring a defining doctrine from nearby axes?
3. Layer fit: is each item genuinely normative, descriptive, or prescriptive?
4. Theory-context fit: is the item ideal, non-ideal, or mixed as presented?
5. Construct coverage: are the mapped constructs necessary and sufficient for
   the proposed comparison?
6. Wording and response-process risk: is the prompt single-idea, interpretable,
   non-leading, and answerable at the declared level?

Reviewers record a confidence rating and a short rationale. Disagreements are
adjudicated after independent scoring. A provisional agent or editorial pass is
not a qualified-expert pass, and an expert pass does not establish respondent
reliability or validity.

## Cognitive interview protocol

Use a purposive small sample rather than treating a convenience click-through as
validation. For each item, ask the respondent to think aloud, paraphrase the
prompt, identify the time/place or population they considered, explain how they
selected an answer, and describe what would change their answer. Probe whether
“what is legitimate,” “what is empirically true,” “what should be done,” “under
good conditions,” and “under real constraints” are being read as distinct tasks.

The implementation target remains 20-30 interviews across ideological
backgrounds, with a second round if recurring interpretation problems appear.
Findings must identify the item, interpretation failure, affected construct or
layer, proposed rewrite, and new version. They must not be converted into
synthetic respondent records.

## Pilot and retest analysis plan

The existing analysis apparatus is research-only. It must refuse to estimate
coefficients when the required data are absent or inadequate. The planned
sequence is:

1. Freeze the item, mapping, recruitment, subgroup, and known-groups hypotheses
   before inspecting outcomes.
2. Collect consented pilot records with exact presented wording, response scale,
   layer, theory context, confidence/priority, and provenance metadata.
3. Check response quality, missingness, speed, straight-lining, and duplicate or
   ineligible records before estimation.
4. Estimate internal consistency only for coherent multi-item constructs, then
   inspect item-total behavior and omega/alpha uncertainty.
5. Estimate test-retest stability from matched respondents after 2-4 weeks and
   report measurement error alongside the association.
6. Test known-groups hypotheses against independent measures, with effect sizes,
   uncertainty, and preregistered directionality.
7. Screen subgroup/DIF behavior only when subgroup support is adequate; review
   flagged items for wording, construct, and response-process explanations.
8. Keep specialist outputs experimental until the evidence supports separation
   from the broad anchor and neighboring labels.

The one browser-generated completion used for UI verification is not a pilot
sample, is not a retest pair, and must not enter these analyses.

## Specialist disposition

The following 39 specialist labels have no construct-matched respondent module
and are therefore catalog-only in this version:

`agorist`, `agrarian-populism`, `anarcho-primitivism`, `bioregionalism`,
`bleeding-heart-libertarianism`, `christian-reconstructionism`,
`christian-socialism`, `eco-fascism`, `eco-authoritarianism`,
`fascist-authoritarian`, `georgism`, `geolibertarian`, `integralism`, `juche`,
`kemalism`, `left-wing-market-anarchism`, `national-bolshevism`,
`national-socialism`, `neoreactionary`, `objectivism`, `ordoliberalism`,
`paleoconservatism`, `paleolibertarianism`, `participism`, `stirnerism`,
`strasserism`, `voluntaryism`, `third-way`, `distributism`, `neoliberalism`,
`developmentalism`, `pan-arabism`, `arab-socialism`, `radical-feminism`,
`black-feminism`, `queer-politics`, `confucian-political-revival`,
`queer-anarchism`, `welfare-chauvinism`.

They remain searchable and explainable in the catalog. The system must not
infer them from generic authority, market, national, religious, welfare,
ecological, or technology preferences. Building a module for any of them is a
future, versioned research decision rather than a completion task to be filled
with unsupported items.

## Descriptive evidence disposition

The reviewed effective bank contains 58 active core descriptive items and every
one has an operational scope note plus public sources. The nine canonical
specialist modules contribute six active descriptive items, also all scoped and
sourced. The clean-runtime projection now carries the reviewed wording, theory
context, evidence note, confidence prompt, and priority prompt into the browser
selector boundary, so the methodology count can reflect 64/64 rather than the
stale 22/64 canonical projection.

Sources clarify the empirical claim’s population, mechanism, and limits. They do
not validate a respondent’s answer, establish causality beyond their stated
scope, or establish the psychometric properties of this instrument.

## Research basis

- [AERA/APA/NCME Standards for Educational and Psychological Testing](https://www.apa.org/science/programs/testing/standards)
- [CDC cognitive interviewing guidance](https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html)
- [COSMIN research and measurement-property guidance](https://www.cosmin.nl/research-publications/)
- [ETS guidelines for fairness and DIF review](https://www.ets.org/pdfs/about/ell-guidelines.pdf)
