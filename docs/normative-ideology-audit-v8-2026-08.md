# Normative ideology audit v8

Date: 13 August 2026

This pass audits the executable v7 taxonomy and the respondent-facing specialist
registry. It preserves the instrument's three-layer decomposition: normative
items measure moral commitments, descriptive items measure empirical beliefs,
and prescriptive items measure policy or strategic preferences. A label is not
treated as a single personality type when those layers diverge.

## Current executable inventory

The registry currently exposes 145 catalog records:

- 17 broad primary labels used by ordinary scoring;
- 73 provisional specialist labels, browsable but not ordinary-scored;
- 28 cross-cutting modifiers, scored through the separate thresholded path;
- 19 context or institutional entries, browsable and non-scored; and
- 8 retired records retained for decoding and historical analysis.

The effective core instrument has 338 active questions. Across the combined
core-plus-specialist registry there are 405 items: 193 normative, 64 descriptive,
and 148 prescriptive layer assignments. The opt-in specialist question bank is
`2026-08-specialist-v8`; its frozen assignment roster is
`2026-08-specialist-roster-v1` under `balanced-hash-v2`. The ordered module
identifiers and hash seed preserve participant-to-module allocation for this
cohort, including test/retest.

## Implemented measurement safeguards

### Compound primary matching

Centroid distance is no longer sufficient for the most compound ordinary labels.
`src/data/compoundGates.ts` records necessary measured commitments and rationales.
The scoring path now distinguishes three states:

- `passed`: all necessary axes are measured and satisfy their bounds;
- `blocked`: at least one measured necessary axis contradicts the label; and
- `insufficient-evidence`: a necessary axis has not been adequately measured.

Blocked and insufficient compound labels are withheld from ordinary nearest-label
results. The initial gate roster covers fascist-authoritarian, Marxist-Leninist,
welfare chauvinism, religious nationalism, theocrat, eco-authoritarianism,
National Socialism, Christian Reconstructionism, geolibertarianism,
anarcho-capitalism, anarcho-communism, Maoism, National Bolshevism, and
Strasserism. These gates are deliberately conservative: they reduce false
positives caused by a nearby generic centroid, but they cannot establish that a
respondent is or is not a historical ideology.

### Specialist constitutive gates

Experimental candidates now use the same abstention principle at construct level.
The anarchist, green, socialist, conservative, religious-national,
technology-governance, and monarchist/municipal waves require their defining
constructs to be both answered and within candidate bounds. This prevents, for
example, market confidence alone from producing anarcho-capitalism, ecological
concern alone from producing ecosocialism, or expert confidence alone from
producing technocratic centralism. The specialist UI does not render candidates
blocked by a measured contradiction or candidates lacking required evidence.

Two high-value separations were added:

- `fm-gr-5` measures collective or worker-and-community control of productive
  assets separately from ecological standing, post-growth preference, and
  market-technology confidence;
- `fm-te-6` measures preference for centralized administrative coordination
  separately from the value assigned to technical expertise, algorithmic
  authority, cryptography, and acceleration.

Both items have bespoke context and source records. Their output remains opt-in,
experimental, and non-promotional.

## Taxonomy and copy corrections

- The ecological-priority centroid for Eco-Authoritarianism is now aligned with
  its definition rather than pointing toward anthropocentric neutrality.
- Market Liberal now explains an enabling state, public goods, macroeconomic
  institutions, regulation, and a limited safety net. It explicitly does not
  imply small government or a single tax, welfare, trade, or regulatory program.
- The v7 family architecture remains in force: Market Anarchism is in the
  anarchist family, Mutualism has its own mutualist-anarchist subfamily rather
  than being collapsed into social anarchism, and Right-Libertarianism remains
  the public name for the market/property primary anchor.
- State Corporatism, Kemalism, Fiscal Conservatism, Ethnonationalism, Islamic
  Democratic Constitutionalism, and Dugin's Fourth Political Theory remain
  sourced explainers or provisional specialist/context records rather than
  ordinary fallback labels.

## Evidence boundary

The conceptual boundaries follow the literature but the numeric centroids,
construct gates, and candidate thresholds remain hypotheses for pilot testing.
The following sources support the distinctions without validating the instrument:

- [Stanford Encyclopedia of Philosophy, “Anarchism”](https://plato.stanford.edu/entries/anarchism/), which describes anarchism as a family of anti-authoritarian positions with socialist, individualist, and market strands rather than one required economic program.
- [Stanford Encyclopedia of Philosophy, “Authority”](https://plato.stanford.edu/entries/authority/), which distinguishes authority, coercion, legitimacy, and obedience instead of treating all state power as one axis.
- [Oxford Research Encyclopedia, “Liberalism”](https://academic.oup.com/edited-volume/62239/chapter-abstract/550776269), which treats liberalism as compatible with constitutionalism, rights, markets, public goods, and a social minimum across variants.
- [Oxford Research Encyclopedia, “Cyberlibertarianism”](https://academic.oup.com/edited-volume/61798/chapter/546177566), which supports separating cryptographic or network decentralization from generic market liberalism and from centralized expertise.
- [Cambridge, “Islamic Constitutionalism”](https://www.cambridge.org/core/books/abs/democracy-under-god/islamic-constitutionalism/3C82791964D0B1824113F0AC38CEDD1B), which supports separating popular accountability, constitutional interpretation, religious authority, and institutional design in the religious-national module.

## Deferred empirical work

The implementation does not claim improved reliability merely because a gate or
question is theoretically defensible. Before any specialist is promoted, the
project still needs cognitive interviews, response-process review, pilot sample
size and subgroup coverage, internal consistency or alternative reliability
estimates appropriate to each construct, test-retest stability, criterion and
known-groups evidence, differential item functioning/invariance checks, and
qualified domain review. Gating can create false negatives if thresholds are too
strict; those failures must be measured rather than silently relaxed.

Future review should also inspect the remaining narrow labels' bespoke usage and
caution notes, relationship typing such as historical succession or influence,
and the distinction between regional variants, contexts, and ideological
families. Those are catalog-quality tasks and should not be back-filled with
generic boilerplate or promoted to ordinary scoring without evidence.
