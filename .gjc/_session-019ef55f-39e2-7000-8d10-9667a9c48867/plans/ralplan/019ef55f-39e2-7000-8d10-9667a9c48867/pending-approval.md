# RALPLAN Final Pending-Approval Plan: Ideology Expansion Backlog

## Status
- Status: pending approval
- Source spec: `.gjc/_session-019ef55f-39e2-7000-8d10-9667a9c48867/specs/deep-interview-ideology-expansion-list.md`
- Planner: `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef578-edeb-7000-8fc0-1fcde0f14f22/plans/ralplan/019ef578-edeb-7000-8fc0-1fcde0f14f22/stage-01-planner.md`
- Architect: `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef57c-0c71-7000-8c72-f505618b07a4/plans/ralplan/019ef57c-0c71-7000-8c72-f505618b07a4/stage-02-architect.md` (CLEAR / APPROVE)
- Critic: `/var/home/tcs/Code/ideologynormativesorter/.gjc/_session-019ef57e-33da-7000-ab2d-8193e9c4f86b/plans/ralplan/019ef57e-33da-7000-ab2d-8193e9c4f86b/stage-03-critic.md` (OKAY)
- Execution: not approved; do not mutate product source until separate explicit approval.

## Decision
Use a centroid-first curated matrix with grouped aliases/subtypes to produce a reviewable 30-60 row ideology expansion backlog document. The plan creates a documentation/backlog artifact only; it does not edit label data, compute centroids, change questions, alter scoring, or run product implementation.

## Principles
1. Scoreable centroid first: P1 candidates must plausibly represent distinct positions in the app's axis space.
2. Group aliases/subtypes instead of duplicating labels: existing labels are parent anchors only.
3. Preserve provenance and uncertainty: every row records source provenance, including Philosophyball access caveats.
4. Keep the backlog reviewable: target 30-60 rows with concise rationale and P1/P2/P3 priority.
5. Defer implementation details: no numeric centroids, label ids, question mappings, UI copy, or tests in this phase.

## Decision Drivers
1. Centroid distinctiveness against existing labels in `src/data/labels.ts`.
2. Source-list provenance and curation quality.
3. Implementation safety: produce an artifact that can later drive data/test work without forcing premature schema or UI decisions.

## Alternatives Considered
### Option A: Raw source-list import then prune
- Pros: fast large inventory; minimizes initial omissions.
- Cons: imports memes, factions, tactics, duplicate aliases, historical curiosities, and single-issue stances; conflicts with scoreable-centroid model.
- Rejected because it makes the backlog noisy and hard to review.

### Option B: Centroid-first curated matrix with grouped aliases/subtypes
- Pros: aligns with existing scoring architecture; avoids duplicate current labels; preserves useful aliases/subtypes; keeps output reviewable.
- Cons: requires judgment calls on borderline candidates and may omit recognizable wiki entries without distinct scoreable profiles.
- Chosen because it best matches the deep-interview spec and Architect/Critic approval.

### Option C: Existing-label extension only
- Pros: safest and easiest to validate.
- Cons: fails to identify major missing centroids and under-serves P1 expansion candidates.
- Rejected because it is too narrow for the user's expansion goal.

## Plan
1. Establish current anchors by reading existing label names/families/subfamilies from `src/data/labels.ts` so current labels are used only as parent anchors.
2. Collect source candidates from Polcompball and the user-provided Philosophyball political philosophy material, preserving source provenance and access status.
3. Normalize and de-duplicate aliases, spelling variants, redirects, and near-identical entries.
4. Exclude obvious memes/meta entries, tactics, narrow single-issue stances, individual parties/factions, and already-represented labels unless useful as grouped aliases/subtypes.
5. Assign each retained item one of: `new-label candidate`, `alias/subtype under existing label`, `alias/subtype under candidate parent`, or `speculative candidate`.
6. Screen qualitatively for axis distinctiveness using current axis concepts such as authority legitimacy, property legitimacy, equality theory, community boundary, secular/religious public order, market/state confidence, democratic/expert confidence, centralization, reform/revolution, direct action/electoralism, coercion strategy, regulation/deregulation, and redistribution/predistribution.
7. Assign priority: P1 = clear missing centroid; P2 = useful subtype/alias group; P3 = interesting but speculative. Tie-break borderline cases in favor of centroid distinctiveness.
8. Shape the backlog to 30-60 rows, balancing political families and avoiding over-representation of source clusters.
9. After execution approval, create `docs/ideology-expansion-backlog.md` containing methodology, required table, non-goals, and deferrals.
10. Self-check the artifact for row count, required fields, source provenance, duplicate handling, priority semantics, and absence of implementation scope.

## Required Backlog Row Fields
- `name`
- `source`
- `parent/new-label status`
- `alias/subtype grouping`
- `inclusion rationale`
- `priority`

## Acceptance Criteria
- [ ] Backlog artifact contains 30-60 included rows.
- [ ] Every row has all required fields.
- [ ] Source values preserve Polcompball/Philosophyball provenance and dual-source status where applicable.
- [ ] P1 rows are defensible as clear missing scoreable centroids relative to current labels.
- [ ] P2 rows are defensible as useful aliases/subtypes under existing or candidate parent anchors.
- [ ] P3 rows are marked speculative and do not crowd out P1/P2 coverage.
- [ ] Existing labels from `src/data/labels.ts` are not repeated as net-new additions.
- [ ] Obvious aliases, near-duplicates, memes, tactics, factions, and single-issue stances are excluded or grouped with rationale.
- [ ] Artifact explicitly defers numeric centroids, question mappings, validation tests, UI/scoring changes, and source-code edits.

## Verification After Approval
- Count included rows and confirm 30 <= rows <= 60.
- Confirm required columns are present and non-empty for every row.
- Cross-check every existing-label parent anchor against `src/data/labels.ts`; ensure existing labels are not marked as net-new.
- Check duplicate/alias normalization by sorting candidate names and parent groupings.
- Review P1/P2/P3 assignments against the explicit priority rule and tie-break.
- Spot-check source provenance against captured source material; preserve uncertainty where Philosophyball access is user-cited rather than tool-confirmed.
- Confirm the final artifact contains no numeric centroid values, code snippets, implementation TODOs, or test changes.

## Risks and Mitigations
- Wiki source noise: mitigate with exclusion pass and centroid-first rationale.
- Philosophyball access uncertainty: mitigate by preserving provenance and using user-provided extracts where needed.
- Duplicate current labels: mitigate with current anchor list and no net-new status for existing labels.
- Curator bias: mitigate with explicit priority rules, tie-breaks, and rationales.
- Scope creep into implementation: mitigate with artifact-level acceptance criteria and explicit deferrals.
- Overfitting to current axes: mitigate by marking culturally important but weakly separable entries as P2/P3 or excluding them unless an axis pattern is explainable.

## ADR
### Decision
Create a documentation/backlog artifact using a centroid-first curated matrix with grouped aliases/subtypes.

### Drivers
- Alignment with the app's scoreable label model.
- Reviewable 30-60 row scope.
- Safe separation between curation and later implementation.

### Alternatives Considered
- Raw source-list import then prune.
- Existing-label extension only.
- Centroid-first curated matrix with grouped aliases/subtypes.

### Why Chosen
The chosen approach best preserves the user's source-list intent while avoiding false precision and duplicate labels in a scoring system where result labels are centroids, not encyclopedia entries.

### Consequences
- Slower than a raw import, but more defensible.
- Requires qualitative curation judgment.
- Produces a clean input for later implementation planning without committing to centroids or schema changes.

### Follow-ups
- Obtain explicit execution approval before creating `docs/ideology-expansion-backlog.md`.
- If later label data changes are approved, run a separate implementation plan covering `src/data/labels.ts`, centroid values, data validation, tests, and UI/scoring implications.

## Approval Boundary
This plan is pending approval. No product source files have been changed. Execution should proceed only after the user explicitly approves an execution path, preferably a focused ultragoal execution for the backlog artifact; team is unnecessary unless the user wants tmux-based parallel curation lanes.
