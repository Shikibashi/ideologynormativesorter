# RALPLAN Planner Artifact: Ideology Expansion Backlog

## Summary
Create a curated 30-60 row ideology expansion backlog from the user-provided Polcompball and Philosophyball political ideology source lists. The backlog is a planning/data-specification deliverable, not product implementation: it identifies candidate missing scoreable centroids and useful aliases/subtypes while deferring numeric centroids, question mapping, UI, scoring, faction modules, and validation-test implementation. Repository inspection shows `src/data/labels.ts` exports static `IdeologyLabel[]` entries with `id`, `name`, `family`, `subfamily`, `description`, and 26-axis `centroid` values. `src/data/dataValidity.test.ts` validates label id uniqueness, full centroid coverage, and non-empty subfamilies when label data changes.

### Principles
1. **Scoreable centroid first:** promote a source-list item to P1 only when it plausibly represents a distinct position in the app 26-axis space, not merely because it is culturally recognizable.
2. **Group aliases/subtypes instead of duplicating labels:** existing labels may be parent anchors only; near-duplicates, schools, factions, and named variants should be grouped unless they clearly require a separate centroid.
3. **Preserve provenance and uncertainty:** every row records Polcompball, Philosophyball, or both; Philosophyball access limitations from the interview remain visible rather than silently normalized away.
4. **Keep the backlog reviewable:** target 30-60 rows with concise rationales and explicit P1/P2/P3 priority semantics.
5. **Defer implementation details:** no numeric centroids, label ids, question mappings, code edits, UI copy, or tests are produced in this phase.

### Top 3 Decision Drivers
1. **Centroid distinctiveness against existing labels:** the backlog must avoid re-adding anchors already present in `src/data/labels.ts` such as Democratic Socialist, Marxist-Leninist, Anarcho-Communist, Geolibertarian, Christian Democrat, Fascist-Authoritarian, Neoreactionary, and related current labels.
2. **Source-list provenance and curation quality:** source membership is input evidence, not sufficient inclusion; rows need a clear inclusion rationale and source attribution.
3. **Implementation safety:** this phase should produce an artifact that can later drive label/data/test work without forcing premature schema, scoring, or UI decisions.

## In scope / out of scope
### In scope
- Produce one curated backlog artifact of roughly 30-60 rows.
- Use Polcompball and Philosophyball political ideology lists as source pools.
- Compare candidate names against current label anchors from `src/data/labels.ts`.
- Classify each included row as a new-label candidate or alias/subtype grouped under an existing or candidate parent.
- Include required row fields: `name`, `source`, `parent/new-label status`, `alias/subtype grouping`, `inclusion rationale`, and `priority`.
- Apply priority rule: P1 = clear missing centroid; P2 = useful subtype/alias group; P3 = interesting but speculative.

### Out of scope
- Editing `src/data/labels.ts` or any product source.
- Computing numeric centroid values or adding label ids.
- Changing questions, axes, faction modules, scoring, result UI, or share format.
- Writing validation tests in this phase.
- Exhaustively importing every source-list entry.
- Treating memes, tactics, factions, slogans, single-issue stances, or near-duplicates as equal to scoreable ideology labels without rationale.

## File-level changes
### Planner stage now
- No product-code changes.
- No direct `.gjc/` edits; this artifact is persisted only through `gjc ralplan --write`.
- No tests, build, lint, or format commands run by design.

### Proposed after explicit approval
- Create or update `docs/ideology-expansion-backlog.md` with the curated 30-60 row table and a compact methodology/checklist section.
- Read-only reference inputs: `.gjc/_session-019ef55f-39e2-7000-8d10-9667a9c48867/specs/deep-interview-ideology-expansion-list.md`, `src/data/labels.ts`, `src/data/AGENTS.md`, and source-list pages/user-provided source material.
- Do not edit `src/data/labels.ts`, `src/data/dataValidity.test.ts`, axes, questions, faction modules, scoring, or UI under this plan.

## Options considered
### Option A — Raw source-list import then prune
**Pros**
- Fast to produce a large candidate inventory.
- Minimizes initial curator omissions.

**Cons**
- Likely includes memes, factions, tactics, duplicate aliases, historical curiosities, and single-issue stances.
- Creates review burden and conflicts with the app scoreable-centroid model.
- Makes P1/P2/P3 priority noisy and harder to defend.

### Option B — Centroid-first curated matrix with grouped aliases/subtypes (chosen)
**Pros**
- Directly aligns with the app label model and existing 26-axis scoring architecture.
- Keeps existing labels as parent anchors rather than duplicate additions.
- Produces a reviewable 30-60 row artifact with clear rationale and priority.
- Preserves useful aliases/subtypes without over-expanding result labels.

**Cons**
- Requires judgment calls on borderline candidates.
- May omit recognizable wiki entries that lack a distinct scoreable profile.

### Option C — Existing-label extension only
**Pros**
- Very safe and easy to validate.
- Useful for alias/subtype cleanup.

**Cons**
- Fails the spec goal of identifying major missing centroids.
- Would under-serve P1 expansion candidates and flatten genuinely distinct ideologies.

**Chosen option:** Option B. It best satisfies the deep-interview result: independent labels should preferably be distinct centroids, aliases/subtypes can be grouped, and implementation remains deferred.

## Sequencing and dependencies
1. **Establish current anchors:** make a compact reference list of existing label names/families/subfamilies from `src/data/labels.ts` so current labels are only used as parent anchors.
2. **Collect source candidates:** extract candidate names from Polcompball and the user-provided Philosophyball political philosophy source material, preserving source provenance and access status.
3. **Normalize and de-duplicate:** merge spelling variants, aliases, redirects, and near-identical entries; retain source provenance as `Polcompball`, `Philosophyball`, or `Both`.
4. **Initial exclusion pass:** remove obvious memes/meta entries, tactics, narrow single-issue stances, individual parties/factions, and entries already represented by current labels unless useful as grouped aliases/subtypes.
5. **Anchor/group pass:** assign each remaining candidate one of: `new-label candidate`, `alias/subtype under existing label`, `alias/subtype under candidate parent`, or `speculative candidate`; include the parent anchor/grouping text.
6. **Qualitative centroid screen:** assess whether the candidate implies a distinct pattern across current axes such as authority legitimacy, property legitimacy, equality theory, community boundary, secular/religious public order, market/state confidence, democratic/expert confidence, centralization, reform/revolution, direct action/electoralism, coercion strategy, regulation/deregulation, and redistribution/predistribution.
7. **Priority assignment:** set P1 for clear missing centroid candidates, P2 for useful grouped aliases/subtypes, P3 for interesting speculative items; resolve ties in favor of centroid distinctiveness.
8. **Backlog shaping:** select 30-60 rows, balancing political families and avoiding over-representation of any source cluster; include concise rationales sufficient for reviewer challenge.
9. **Artifact write:** create `docs/ideology-expansion-backlog.md` with a short methodology note, required table, and a non-goals/deferrals note.
10. **Self-check:** verify row count, required fields, priority semantics, source provenance, duplicate handling, and that no product implementation details or source edits have crept in.

Dependencies:
- Source pages or user-provided extracts must be available during execution, especially if Philosophyball remains crawler-blocked.
- Current labels and axes remain read-only reference material for this phase.
- Architect and Critic review should occur before approval; implementation should not start from the planner artifact alone.

## Acceptance criteria
- A backlog artifact exists after approved execution, preferably `docs/ideology-expansion-backlog.md`.
- The backlog contains 30-60 included rows.
- Every row includes name, source, parent/new-label status, alias/subtype grouping, inclusion rationale, and priority.
- Source values preserve Polcompball/Philosophyball provenance and note dual-source candidates where applicable.
- P1 rows are defensible as clear missing scoreable centroids relative to current labels.
- P2 rows are defensible as useful aliases/subtypes under an existing or candidate parent anchor.
- P3 rows are explicitly marked speculative and do not crowd out P1/P2 coverage.
- Existing labels from `src/data/labels.ts` are not repeated as net-new additions.
- Obvious aliases, near-duplicates, memes, tactics, factions, and single-issue stances are excluded or grouped with rationale.
- The artifact explicitly states that numeric centroids, question mappings, validation tests, UI/scoring changes, and source-code edits are deferred.

## Verification
### Planner-stage verification
- Repository facts inspected: deep-interview spec, root `AGENTS.md`, `src/data/AGENTS.md`, `src/data/labels.ts` label names, `src/types/label.ts`, `src/data/axes.ts` axis names, and label validation tests in `src/data/dataValidity.test.ts`.
- No tests/build/lint/formatters are run in this planning-only stage per assignment constraints.

### Approved-execution verification for the backlog artifact
- Count rows and confirm 30 <= included rows <= 60.
- Validate required columns are present and non-empty for every row.
- Cross-check every existing-label parent anchor against `src/data/labels.ts`; ensure existing labels are not marked as net-new.
- Check duplicate/alias normalization by sorting candidate names and parent groupings.
- Review P1/P2/P3 assignments against the explicit priority rule and tie-break.
- Spot-check source provenance against captured source material; preserve uncertainty where Philosophyball access is user-cited rather than tool-confirmed.
- Confirm the final artifact contains no numeric centroid values, code snippets, implementation TODOs, or test changes.

### Future label-data implementation verification (separate approval only)
- If a later plan edits `src/data/labels.ts`, run focused data validation such as `npm test -- dataValidity` and audit tests, then the broader project gates required by repository policy. This is explicitly not part of the backlog-generation plan.

## Risks and mitigations
- **Wiki source noise:** Polcompball-style lists include memes, meta entries, factions, and narrow issues. Mitigate with the initial exclusion pass and centroid-first rationale.
- **Philosophyball access uncertainty:** crawler/CAPTCHA behavior may block independent retrieval. Mitigate by preserving source provenance and using user-provided extracts when necessary rather than pretending independent verification occurred.
- **Duplicate current labels:** source lists may contain entries already represented by existing labels. Mitigate with an anchor list from `src/data/labels.ts` and prohibit existing labels as net-new rows.
- **Curator bias in P1/P2/P3:** qualitative judgment is unavoidable. Mitigate with explicit priority rules, tie-breaks, and concise rationales that reviewers can challenge.
- **Scope creep into implementation:** backlog creation can tempt centroid/test/UI work. Mitigate with artifact-level acceptance criteria and explicit deferrals.
- **Overfitting to current axes:** some ideologies may be culturally important but not separable in current axis-space. Mitigate by marking as P2/P3 or excluding unless a distinct axis pattern is explainable.

## Handoff guidance
- **Architect review:** verify the chosen option fits the current label/scoring architecture and does not smuggle implementation scope.
- **Critic review:** challenge whether acceptance criteria, priority semantics, and verification are concrete enough for approval.
- **Pending approval:** stop after Architect and Critic consensus; do not execute backlog generation until the user explicitly approves.
- **After approval:** a single focused executor can create the documentation artifact; use `team` only if source extraction/curation is split into parallel lanes, which is likely unnecessary for a 30-60 row backlog.
- **Ultragoal:** not needed unless the ideology expansion turns into a long-running multi-phase program covering backlog, labels, centroids, questions, modules, and UI.

## Compact RALPLAN-DR summary
- **Problem:** generate a 30-60 row ideology expansion backlog from Polcompball/Philosophyball without editing product source.
- **Decision drivers:** centroid distinctiveness, source-proven curation, implementation safety.
- **Options:** raw import/prune, centroid-first curated matrix, existing-label extension only.
- **Decision:** choose centroid-first curated matrix with grouped aliases/subtypes.
- **Consequences:** slower than raw import but produces a defensible, reviewable backlog aligned to the app scoring model.
- **Status:** planner artifact only; route to Architect then Critic, then hold pending user approval.
