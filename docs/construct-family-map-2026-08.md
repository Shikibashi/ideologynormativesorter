# Construct-family map — 2026-08

Map version: `2026-08-construct-family-map-v1`
Architecture: `2026-08-measurement-architecture-v1`
Runtime registry: `src/data/constructFamilies.ts`

The registry currently creates one auditable family for each of the 20 frozen
domain definitions. Each family retains the domain’s existing items and
records separate normative, descriptive, and prescriptive cells. It records
axis IDs, theory contexts, item IDs, response formats, expected future
criterion families, and review-record links without changing any item weight.

Coverage is structural inventory, not psychometric evidence:

- `complete`: at least three active items are present in the cell;
- `partial`: one or two active items are present;
- `missing`: no active item is present;
- `out-of-scope`: the design explicitly does not claim that cell.

The three-item structural threshold is an audit display rule, not an approved
minimum indicator rule, reliability threshold, or activation decision. Every
new family cell still requires content review, cognitive evidence, and the
appropriate research criterion before it can support a production claim.

The map is deliberately domain-derived in this first wave. A future matched
family may split a domain into multiple substantive problems, join items across
domains, or add research-only task IDs after D-02 review. Such changes require
an updated map version and a frozen review record.
