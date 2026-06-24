# Deep Interview Spec: Ideology Expansion List

## Metadata
- Interview ID: c1fde96f-87d9-47a0-a0a6-4c051fadd9e2
- Rounds: 6 + topology and restate gates
- Final Ambiguity Score: 4.7%
- Type: brownfield
- Generated: 2026-06-23T17:10:00Z
- Threshold: 0.05
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED
- Auto-Researched Rounds: []
- Auto-Answered Rounds: []
- Architect Failures: 0
- Lateral Reviews: 3 milestone panels
- Lateral Panel Failures: 0
- Refined Rounds: []
- Closure Overrides: none
- Restated Goal: Create a 30-60 row curated ideology expansion backlog from the user-provided Polcompball and Philosophyball source lists, where distinct missing centroids become candidate new labels, notable aliases/subtypes are grouped under existing or candidate parent anchors, each row includes name, source, parent/new-label status, grouping, rationale, and P1/P2/P3 priority, and implementation work is explicitly deferred.

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.96 | 0.35 | 0.336 |
| Constraint Clarity | 0.96 | 0.25 | 0.240 |
| Success Criteria | 0.95 | 0.25 | 0.238 |
| Context Clarity | 0.93 | 0.15 | 0.140 |
| **Total Clarity** | | | **0.953** |
| **Ambiguity** | | | **0.047** |

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| Ideology expansion list | active | Decide the candidate ideology labels to add before any centroid, question-bank, module, or UI implementation work. | Covered by source basis, inclusion rule, backlog size, row contract, existing-label overlap policy, and priority rule. |

## Established Facts
- The expansion list starts from user-curated source lists rather than an agent-invented taxonomy.
- Source lists: `https://polcompball.me/List_of_Ideologies` and `https://philosophyball.miraheze.org/wiki/List_of_Philosophies/Political_Philosophy`.
- Polcompball was tool-readable and broad; Philosophyball was user-cited but tool access was blocked by crawler/CAPTCHA behavior, so rows should preserve source provenance.
- Independent result labels should preferably have distinct scoreable centroids.
- Notable aliases and subtypes may be grouped as children under parent labels.
- The first-pass output is a medium curated backlog of roughly 30-60 rows.
- Each row requires: name, source, parent/new-label status, alias/subtype grouping, inclusion rationale, and priority.
- Existing labels in `src/data/labels.ts` appear only as parent anchors for grouped aliases/subtypes, not as net-new additions.
- Priority rule: P1 = clear missing centroid; P2 = useful subtype/alias group; P3 = interesting but speculative.
- Priority tie-break: borderline candidates favor clear missing centroids over subtype usefulness.
- Parent anchors are taxonomy references only, not inherited scoring constraints.

## Trigger Metadata
No ambiguity-raising triggers were accepted. Ambiguity fell from 100% to 4.7% through source selection, inclusion filtering, backlog sizing, output field definition, overlap handling, and priority definition.

## Lateral Review Panel
- Round 1 milestone initial→progress: researcher, contrarian, and simplifier findings were folded into the inclusion-filter question. Main finding: broad wiki membership is too weak by itself because app labels are scoreable centroids.
- Round 3 milestone progress→refined: researcher, contrarian, and simplifier findings were folded into the output-fields question. Main finding: distinguish new parent labels from alias/subtype children and avoid implementation fields in this phase.
- Round 6 milestone refined→ready: researcher, contrarian, and simplifier closure review found no blocking concern, with wording safeguards for priority tie-breaks and parent-anchor semantics.

## Goal
Create a 30-60 row curated ideology expansion backlog from the user-provided Polcompball and Philosophyball source lists, where distinct missing centroids become candidate new labels, notable aliases/subtypes are grouped under existing or candidate parent anchors, each row includes name, source, parent/new-label status, grouping, rationale, and P1/P2/P3 priority, and implementation work is explicitly deferred.

## Constraints
- Scope is list/specification only; no product source mutation in the deep-interview phase.
- Use the existing app context: labels live in `src/data/labels.ts` as `IdeologyLabel[]` with family/subfamily, description, and centroid data.
- First-pass size is roughly 30-60 rows.
- Source-list candidates must be curated; source-list presence alone is insufficient.
- Parent anchors may reference existing labels, but existing labels are not counted as net-new additions.
- Aliases/subtypes can be grouped as children instead of independent result labels.
- Do not require numeric centroid values, question mappings, UI copy, or test implementation in this list.
- Preserve source provenance, especially where Philosophyball contents cannot be independently retrieved by tools.

## Non-Goals
- No implementation of labels in `src/data/labels.ts` during deep interview.
- No centroid calculation in this phase.
- No question-bank, faction-module, UI, or scoring changes in this phase.
- No exhaustive import of every Polcompball or Philosophyball entry.
- No flat taxonomy that treats aliases, memes, factions, and single-axis doctrines as equal to scoreable ideology labels.

## Acceptance Criteria
- [ ] Produce a curated backlog of roughly 30-60 rows.
- [ ] Every row includes name, source, parent/new-label status, alias/subtype grouping, inclusion rationale, and priority.
- [ ] P1 rows identify clear missing centroids that could plausibly become independent labels.
- [ ] P2 rows identify useful aliases/subtypes grouped under a parent anchor.
- [ ] P3 rows identify interesting but speculative candidates.
- [ ] Existing labels from `src/data/labels.ts` are used only as parent anchors, not repeated as new additions.
- [ ] The backlog preserves source provenance for Polcompball and Philosophyball.
- [ ] The backlog excludes or groups obvious aliases, near-duplicates, memes, tactics, factions, and single-issue stances unless the rationale explains why they are useful.

## Deferrals
- Implementation is deferred until after planning and explicit execution approval.
- Numeric centroid values, question mappings, validation tests, and UI rendering are deferred.
- Convergence pacing deferral: no min-round floor, score-drop cap, or dampening was used; bidirectional scoring remained the pacing mechanism.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| A wiki list can be imported directly. | Polcompball includes canonical ideologies alongside fringe, meme, meta, historical, and single-issue entries. | Use curated inclusion, not raw import. |
| Every recognizable ideology deserves a result label. | The app's labels are scoreable centroids, not encyclopedia entries. | Independent labels should preferably be distinct centroids; aliases/subtypes can be grouped. |
| Existing labels should appear in the expansion list. | Existing labels already exist in `src/data/labels.ts`. | Existing labels appear only as parent anchors for grouped aliases/subtypes. |
| Priority can be curator judgment. | Vibes-based priority would make the list hard to review. | P1/P2/P3 priority rule is explicit. |

## Technical Context
- Brownfield app: React/Vite frontend with pure scoring pipeline.
- Existing ideology labels are static data in `src/data/labels.ts`, exported as `IdeologyLabel[]` with `labelById`.
- Current labels include examples such as Democratic Socialist, Marxist-Leninist, Anarcho-Communist, Geolibertarian, Christian Democrat, Fascist-Authoritarian, Neoreactionary, and others.
- Data rules in `src/data/AGENTS.md` say label changes require validation coverage.
- This spec does not authorize product mutation; it defines the candidate backlog to be planned next.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| IdeologyLabel | core domain | id, name, family, description, centroid, aliases, subtypes, parent anchor role | Existing IdeologyLabel may be a parent anchor for grouped children. |
| CandidateIdeology | core domain | name, source, parent/new-label status, alias/subtype grouping, inclusion rationale, priority | CandidateIdeology may become a P1 new label, P2 grouped child, or P3 speculative backlog item. |
| SourceList | external source | url, access status, candidate names | SourceList supplies CandidateIdeology entries. |
| CuratedBacklog | deliverable | target size, required row fields, priority order, parent anchors | CuratedBacklog contains prioritized CandidateIdeology entries. |
| ScoringAxis | supporting | axisId, centroid value | P1 CandidateIdeology entries represent clear missing centroids across ScoringAxis values. |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 4 | 4 | - | - | - |
| 2 | 4 | 0 | 0 | 4 | 100% |
| 3 | 5 | 1 | 0 | 4 | 80% |
| 4 | 5 | 0 | 0 | 5 | 100% |
| 5 | 5 | 0 | 0 | 5 | 100% |
| 6 | 5 | 0 | 0 | 5 | 100% |

## Interview Transcript
<details>
<summary>Full Q&A (6 rounds)</summary>

### Round 0
**Q:** Is the topology one component: decide the candidate ideology labels to add before any implementation work?
**A:** Looks right.
**Ambiguity:** not scored.

### Round 1
**Q:** What should govern which ideologies make the expansion list?
**A:** Start from a user-curated list that I provide; the user provided Polcompball and Philosophyball source URLs.
**Ambiguity:** 52%.

### Round 2
**Q:** Should a source-list candidate qualify only when it can become a distinct, scoreable result label in this app, or is wiki/cultural recognizability enough even if it overlaps heavily with existing labels?
**A:** Prefer distinct centroids, but allow notable aliases/subtypes as grouped children.
**Ambiguity:** 33.5%.

### Round 3
**Q:** What should the first ideology expansion list look like?
**A:** Medium curated backlog: major additions plus grouped aliases/subtypes, roughly 30-60 items.
**Ambiguity:** 23.2%.

### Round 4
**Q:** For each candidate in the ideology expansion list, what fields are required for the first acceptable version?
**A:** Curatable: name, source, parent/new-label status, alias/subtype grouping, inclusion rationale, priority.
**Ambiguity:** 16.55%.

### Round 5
**Q:** How should the curated backlog handle ideologies that are already present or nearly present in `src/data/labels.ts`?
**A:** Include existing labels only as parent anchors for grouped aliases/subtypes.
**Ambiguity:** 10.5%.

### Round 6
**Q:** How should priority be assigned in the ideology expansion backlog?
**A:** Priority 1 = clear missing centroid; Priority 2 = useful subtype/alias group; Priority 3 = interesting but speculative.
**Ambiguity:** 4.7%.

### Restate Gate
**Q:** If someone read only the restated goal, would they reach the same outcome you have in mind?
**A:** Yes, crystallize.

</details>
