# Editorial fifth pass — 2026-08-11

This pass reviewed the effective runtime output, not only the source arrays:

- 118 ideology labels and their family, role, subtype, influence, and explainer metadata;
- 443 retained core questions, 17 statement-choice records, and 123 module questions in the historical pre-retirement snapshot;
- generated question helpers and all three generated layer summaries for every label;
- operational scope and public-source feasibility for all 76 descriptive core items that were active before this pass.

The review standard was one construct per question, neutral and concrete wording, a direct prompt-to-axis relationship, and mutually exclusive forced-choice alternatives. The main external baselines were [Pew Research Center's questionnaire guidance](https://www.pewresearch.org/writing-survey-questions/), [AAPOR best practices](https://aapor.org/standards-and-ethics/best-practices/), and political-concept references from the [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/).

## Applied changes

- Added a versioned fifth-pass overlay with explicit rationales for every mapping repair, wording correction, and quarantine decision.
- Corrected high-confidence sign inversions and removed construct-irrelevant secondary weights across normative, descriptive, and prescriptive layers.
- Quarantined items that require a split, a new construct, an operational threshold, or a redesigned forced-choice set. Quarantined items remain in the retained bank for traceability but are excluded from public and contribution forms.
- Reduced the public Balanced and Full-depth profiles to 149 and 309 active items respectively and synchronized the Cloudflare collector's expected cardinalities.
- Added operational context and public background sources to 27 of the 59 remaining active descriptive items. Sources are collapsed during the quiz and explicitly described as context rather than answers.
- Replaced centroid-derived ideology prose with summaries derived from curated, layer-specific tradition notes. Missing layer metadata now produces a limited statement rather than invented doctrine.
- Corrected ideology metadata where the prior catalog conflated a subtype, neighboring tradition, regime form, policy instrument, or ethical theory with the label itself.
- Moved Liberal Feminism to the feminist specialist module, Constitutional Monarchism to context, and the synthetic Civil-Libertarian Cosmopolitan profile to retired compatibility status.

## Deliberately unresolved

- The remaining 32 active descriptive items do not yet have both a sufficiently operational scope and public sources. A citation will not be added until the wording supports it.
- Generic agreement scales retain a known acquiescence risk. Wholesale conversion to bipolar item-specific responses would be a separate instrument version, not an editorial patch.
- Synthetic label centroids remain comparison references. They were not recalibrated in this pass because editorial confidence is not respondent evidence.
- Provisional specialist labels without construct-matched modules remain unscored.

Passing software tests establish data and implementation invariants only. They do not establish psychometric validity or make a political label objectively correct.

The historical `fm-*` module corpus described in this pass was subsequently retired and removed. It is retained in this document only as provenance for the earlier audit decisions.
