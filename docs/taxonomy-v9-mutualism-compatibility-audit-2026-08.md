# Taxonomy v9: Mutualism, retired IDs, and layer evidence

> Historical compatibility snapshot. The executable v10 registry and the
> sensitive-compound boundary now supersede this document’s “no roster change”
> status statement; the Mutualism lineage correction below remains current.

Date: 13 August 2026
Status: implemented catalog and compatibility correction; not respondent validation

## Scope

Taxonomy `2026-08-taxonomy-v9` did not change the primary or modifier roster,
question bank, centroid coordinates, ordinary-match ranking, or specialist
assignment roster. It makes four high-confidence corrections:

1. records an explicit disposition for every retired compatibility ID;
2. corrects Mutualism's historical placement and its measurement boundary; and
3. exposes per-label normative, descriptive, and prescriptive proximity in a
   result explanation without turning a close overall profile into a claim of
   agreement on every layer; and
4. makes experimental specialist result cards disclose a candidate's scope,
   catalog caution, and sources, and withholds low-fit or low-coverage cards.

The frozen v8 pilot documents remain historical cohort records. New research
submissions identify themselves as v9, so an analysis cannot silently pool the
two taxonomy records.

## Mutualism

The public catalog retains **Mutualism** as an anarchist specialist, not a
subtype of Social / Communal Anarchism and not a synonym for Market Anarchism.
It is a plural lineage. Proudhon's mutualist social science is the main
intellectual-history anchor; Proudhon influenced portions of the Tucker-era
American individualist-anarchist field, including Joseph (Jo) and Laurance
Labadie, while individualist anarchism also contains natural-rights and egoist
currents. Swartz supplied a later 1927 Mutualist Associates restatement, and
later Proudhonian and left-market revivals revisit parts of that inheritance in
different ways. The public catalog names these as orientation points without
treating them as mutually exclusive subtypes or pretending that they reduce to
two exhaustive kinds of Mutualism.

Clarence Lee Swartz and Laurance Labadie are therefore shown as historical
orientation anchors in the source disclosure, rather than as generated result
labels. Swartz's _What Is Mutualism?_ is retained as a primary historical text.
The University of Michigan material documents Joseph Labadie's relation to
Benjamin Tucker and American individualist anarchism. C4SS and Kevin Carson are
included only as primary sources for contemporary self-description: C4SS’s own
account places it among diverse left-market-anarchist perspectives, not a
mutualist subtype or a single-author school. Its own organizational history
dates C4SS to 2006, and its 2008 announcement describes Carson as its first
paid staff member; he is therefore not treated as the origin of Mutualism or
C4SS.

Sources: [Prichard, _Pierre-Joseph Proudhon's Mutualist Social Science_](https://www.cambridge.org/core/books/abs/cambridge-history-of-socialism/pierrejoseph-proudhons-mutualist-social-science/E9FC4C18BD9C1577C7AAC1FE69B7E03D),
[SEP, _Anarchism_](https://plato.stanford.edu/entries/anarchism/),
[SEP notes on individualist anarchism](https://plato.stanford.edu/archives/sum2024/entries/nozick-political/notes.html),
[University of Michigan, _Jo Labadie_](https://deepblue.lib.umich.edu/bitstream/2027.42/120256/1/jo_labadie_00.pdf),
[Swartz, _What Is Mutualism?_](https://c4ss.org/wp-content/uploads/2009/06/what-is-mutualism.pdf),
and [Carson, _Are We All Mutualists?_](https://c4ss.org/content/40929), plus
[C4SS, _What Is C4SS?_](https://c4ss.org/content/53795), [C4SS history
(2006)](https://c4ss.org/content/18260), and [C4SS’s Carson appointment
(2008)](https://c4ss.org/content/55).

The existing experimental anarchist module has only four constructs:
anti-authority, market/communal coordination, property regime, and direct
federation/strategy. That supports a family-level affinity only. It cannot
defensibly identify Proudhonian, Tuckerite, Labadie-line, Swartz-associated,
later mutualist or left-market, Carson-associated, or C4SS-linked commitments.
Those are displayed as history and boundaries, not scored variants.

Before adding such variants, a new construct-matched module needs at least
separate, expert-reviewed measures of:

- possession or use claims versus stronger private-property claims;
- anti-rent, anti-monopoly, and exploitation analysis;
- mutual credit, cooperative provision, and exchange design;
- individual sovereignty versus federation and association; and
- counter-economic strategy versus institution-building strategy.

It would then require cognitive testing, construct coverage review,
test-retest evidence, and false-positive separation before it can report a
lineage rather than a broad Mutualist affinity.

## Public experimental-result threshold

The specialist scorer continues to retain internal candidate comparisons for
research review, but the respondent-facing card now requires all of the
following before showing one:

- fit of at least `0.60`;
- at least `0.60` candidate-specific construct coverage; and
- a passed constitutive gate with no evidence-abstention status.

This is a display safeguard, not a validation threshold. It avoids presenting a
weak or sparsely answered nearest neighbour as a meaningful specialist result,
while preserving the underlying evidence record for later calibration work.

## Retired compatibility ledger

| Retired ID                             | v9 disposition | Analysis behavior                                                                                                                 |
| -------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `conservative-liberalism`              | alias          | Canonicalizes to `liberal-conservatism`.                                                                                          |
| `bright-green-environmentalism`        | alias          | Canonicalizes to `ecomodernist`.                                                                                                  |
| `civil-libertarian-cosmopolitan`       | split          | Expands to `civil-libertarianism` and `cosmopolitanism`.                                                                          |
| `decentralist-market-skeptic-of-state` | split          | Expands to `market-liberal` and `decentralist-orientation`.                                                                       |
| `national-traditionalist`              | split          | Expands to `national-conservatism` and `social-conservatism`; religious nationalism is not inferred.                              |
| `cultural-populism`                    | keep retired   | Remains raw historical data because no fixed host ideology or cultural content is safe to infer.                                  |
| `egalitarian-statist`                  | keep retired   | Remains raw historical data because egalitarian ends and state capacity do not identify one active family.                        |
| `revolutionary-collectivist`           | keep retired   | Remains raw historical data because revolutionary strategy and collectivist ownership occur across distinct socialist traditions. |

The ledger is executable metadata in `labelTaxonomy.ts`, not merely a prose
note. `normalizeHistoricalLabelIds()` expands only deterministic splits and
aliases; it deliberately preserves the three ambiguous historical IDs.

## Layer evidence

Each `LabelMatch` now carries separate layer evidence for the axes that the
label actually uses:

- proximity within the normative, descriptive, and prescriptive layer;
- the number of relevant axes measured; and
- each layer's evidence strength.

The result card shows that disclosure under **Why is this nearby?**. The values
are explanatory only: rank, gates, fit thresholding, and uncertainty rules are
unchanged. A missing layer is displayed as not measured rather than as neutral
or agreeing evidence.

## Related correction

The identity-sovereignty specialist registry had one stale status string:
Ethnonationalism was already an ordinary **modifier** in the executable
taxonomy, but the module profile still called it an existing primary. v9 aligns
the profile metadata with the real role. It does not promote or demote any
result.

## Compatibility and validation limits

At the time of this v9 snapshot, `RESULT_SCORING_VERSION` remained `2026-08-13-taxonomy-v4`: no numerical score,
question mapping, gate, primary/modifier roster, or share-answer interpretation
changed. The taxonomy version advances because catalog metadata, historical ID
normalization, source disclosures, and research record metadata changed.

This pass establishes face/content validity and compatibility behavior only. It
does not establish construct validity, factor structure, response-process
validity, test-retest reliability, criterion concordance, or a valid
respondent-level identification of any Mutualist lineage.
