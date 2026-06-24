# Deep Interview Spec: Ideology Source Expansion

## Metadata
- Interview ID: 019ef687-b823-7000-91c3-65f508c9d328
- Rounds: 7 + topology and restate gates
- Final Ambiguity Score: 3.4%
- Type: brownfield
- Generated: 2026-06-23T22:53:00Z
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
- Closure Overrides: 1, resolved by Round 7 validation clarification
- Restated Goal: Implement a bounded ideology expansion pass that processes the remaining high-confidence P1 gaps from the existing backlog into scoreable 26-axis result labels when they pass baseline archetype/calibration coverage, downgrades or defers failures with rationale, and handles P2 aliases/subtypes only as aliases or module-resolved outcomes when representative fixture evidence justifies them.

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.97 | 0.35 | 0.340 |
| Constraint Clarity | 0.96 | 0.25 | 0.240 |
| Success Criteria | 0.97 | 0.25 | 0.243 |
| Context Clarity | 0.96 | 0.15 | 0.144 |
| **Total Clarity** | | | **0.966** |
| **Ambiguity** | | | **0.034** |

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| Source candidate curation | active | Use Polcompball and Philosophyball as source lists while preserving provenance and filtering non-scoreable entries. | Covered by existing curated backlog, source provenance, remaining-P1 comparison, and downgrade/defer rule. |
| Result-label expansion | active | Decide which candidates become independent ideology labels versus aliases or subtypes under parent anchors. | Covered by P1 independent-label rule, P2 alias/module rule, and failure downgrade/defer policy. |
| Centroid/layer modeling | active | Map accepted independent labels onto normative, descriptive, and prescriptive axes so they are scoreable. | Covered by 26-axis centroid requirement, baseline archetype/calibration coverage, and dense-cluster extra fixture rule. |
| Product integration and validation | active | Ensure expanded ideology outcomes appear through the existing results flow and pass validation tests. | Covered by data validity, every-independent-label baseline archetype/calibration coverage, representative dense-cluster fixtures, and P2 reachability evidence when modules are added. |

## Established Facts
- Existing result labels live in `src/data/labels.ts` as `IdeologyLabel[]` entries with family, subfamily, description, and centroid values.
- Current label matching in `src/scoring/labelMatch.ts` uses centroid-distance matching and returns nearest labels.
- Questions in `src/data/questions.ts` provide normative, descriptive, and prescriptive scoring signals.
- Existing validation patterns include data validity tests and every-label archetype/calibration coverage in scoring tests.
- The current repo has 53 ideology labels.
- `docs/ideology-expansion-backlog.md` is the accepted curated source boundary for this pass.
- The first pass should process remaining high-confidence P1 gaps from that backlog, not import all Polcompball or Philosophyball entries.
- A candidate becomes an independent base result only if it can be modeled as a distinct 26-axis centroid and satisfy validation gates.
- P2 aliases/subtypes are included as aliases or module-resolved outcomes only when representative fixture evidence justifies them.
- If a P1 candidate fails separability or validation, it is downgraded to P2 when there is a sensible parent; otherwise it is deferred with rationale.
- Every added independent P1 label requires baseline archetype/calibration coverage; dense or near-tie clusters require extra representative fixtures.

## Trigger Metadata
| Round | Trigger | Status | Affected Component / Dimension | Ambiguity Direction | Evidence |
|-------|---------|--------|--------------------------------|---------------------|----------|
| 1 | none | none | Result-label expansion / Goal | 100% -> 56.5% down | User selected P1 independent labels plus P2 aliases/subtypes. |
| 2 | none | none | Centroid/layer modeling / Criteria | 56.5% -> 39.4% down | User selected balanced admission rule. |
| 3 | none | none | Source candidate curation / Constraints | 39.4% -> 28.4% down | User selected remaining high-confidence P1 gaps from existing backlog. |
| 4 | none | none | Product integration and validation / Criteria | 28.4% -> 17.8% down | User selected moderate validation gate. |
| 5 | none | none | Result-label expansion / Constraints | 17.8% -> 12.5% down | User selected balanced P2 scope. |
| 6 | none | none | Centroid/layer modeling / Constraints | 12.5% -> 4.8% down | User selected downgrade/defer policy for failed P1s. |
| 7 | closure override | resolved | Product integration and validation / Criteria | 4.8% -> 3.4% down | User confirmed every independent P1 label gets baseline archetype/calibration coverage. |

## Lateral Review Panel
- Round 1, initial -> progress: researcher, contrarian, and simplifier findings were folded into the independence-rule question. Main finding: source-list recognition is weaker than centroid distinctiveness.
- Round 3, progress -> refined: researcher, contrarian, and simplifier findings were folded into validation scope. Main finding: product readiness must prove obtainability, not just structural shape.
- Ready milestone closure panel: researcher, contrarian, and simplifier checked crystallization. One blocker was found and resolved: moderate validation must still include baseline archetype/calibration coverage for every added independent label.

## Goal
Implement a bounded ideology expansion pass that processes the remaining high-confidence P1 gaps from the existing backlog into scoreable 26-axis result labels when they pass baseline archetype/calibration coverage, downgrades or defers failures with rationale, and handles P2 aliases/subtypes only as aliases or module-resolved outcomes when representative fixture evidence justifies them.

## Constraints
- Use `docs/ideology-expansion-backlog.md` as the curated source boundary.
- Prioritize remaining high-confidence P1 gaps currently absent from `src/data/labels.ts`.
- Do not import Polcompball or Philosophyball wholesale.
- Each independent label must have a full 26-axis centroid across the existing normative, descriptive, prescriptive, and cross-cutting axes.
- Every added independent label must receive baseline archetype/calibration coverage.
- Dense or near-tie clusters require extra representative fixtures beyond baseline coverage.
- P2 outcomes are aliases by default unless module-resolved subtype evidence is justified by fixtures.
- Module-resolved P2 outcomes require a reachable trigger path and subtype-resolution evidence.
- Candidates that fail validation are downgraded to P2 under a sensible parent or deferred with rationale.
- Do not weaken existing validation invariants to fit new labels.

## Non-Goals
- No raw import of every source-list entry.
- No new scoring axes unless a later plan explicitly justifies them.
- No broad UI redesign.
- No treating source recognizability alone as sufficient for independent label status.
- No adding P2 module outcomes without reachability evidence.

## Acceptance Criteria
- [ ] Compare `docs/ideology-expansion-backlog.md` against `src/data/labels.ts` and enumerate remaining high-confidence P1 gaps.
- [ ] For each remaining P1 candidate, decide one of: independent label, P2 downgrade under a parent, or deferral with rationale.
- [ ] Every added independent label has `id`, `name`, `family`, `subfamily`, `description`, and a full centroid over all existing axes.
- [ ] Every added independent label has baseline archetype/calibration coverage.
- [ ] Dense or near-tie clusters have representative extra fixtures documenting expected obtainability and acceptable near-ties.
- [ ] Every implemented P2 subtype is either display-only alias/group metadata or has module trigger and subtype-resolution evidence.
- [ ] Data validity tests pass without weakening label, centroid, or module reference checks.
- [ ] Scoring/archetype tests pass without silently relaxing existing coverage invariants.
- [ ] Candidate deferrals and downgrades are documented with rationale.

## Deferrals
- Exact centroid values are deferred to implementation/planning, but every independent label must receive a full 26-axis centroid before shipping.
- Exact module-question additions are deferred unless representative fixtures justify a P2 module outcome in the selected implementation pass.
- Exact Philosophyball source parity remains a provenance caveat because tool access to the page was CAPTCHA-gated; the curated backlog remains the operative source boundary.
- Convergence pacing deferral: no min-round floor, score-drop cap, or dampening was used; bidirectional scoring remained the pacing mechanism.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Source-list recognition is enough for a result label. | The app is a 26-axis score matcher, not a taxonomy browser. | Independent labels require distinct centroid modeling and validation. |
| All P1 backlog candidates must ship as base labels. | Some P1s may prove too close to existing labels or too mechanism-like. | Failed P1s downgrade to P2 under a sensible parent or defer with rationale. |
| Moderate validation can mean fixtures only for dense clusters. | Current repo expects every label to have baseline archetype/calibration coverage. | Every independent label gets baseline coverage; dense clusters get extra fixtures. |
| P2 module outcomes are cheap. | Modules must be reachable and subtype resolution must be evidenced. | P2s default to aliases unless representative fixture evidence justifies module work. |

## Technical Context
- `src/data/labels.ts`: static `IdeologyLabel[]` corpus; current comparison found 53 labels and 25 missing P1 backlog names.
- Missing P1 names identified during interview: Eco-Authoritarianism, Eco-Fascism, Bioregionalism, Democratic Confederalism, Libertarian Municipalism, Paleoconservatism, One-Nation Conservatism, National Bolshevism, Strasserism, Fourth Theory, Integralism, Islamic Democracy, Hindutva, Religious Nationalism, Zionism, Panarchism, Liquid Democracy, Cyberocracy, Accelerationism, Juche, Guild Socialism, Techno-Anarchism, World Federalism, Multiculturalism, Indigenism.
- `src/scoring/labelMatch.ts`: centroid-distance matching and module subtype ranking.
- `src/data/questions.ts`: source of normative, descriptive, and prescriptive axis signals.
- `src/data/factionModules.ts` and `src/data/moduleQuestions.ts`: module trigger/subtype mechanism for narrow outcomes.
- `src/data/dataValidity.test.ts` and `src/scoring/archetype-sweep.test.ts`: validation and calibration patterns that must not be weakened.
- Polcompball Category:Ideologies was readable and broad; Philosophyball List of Philosophies was CAPTCHA-gated via tool access. The curated backlog is the accepted practical source boundary.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| SourceList | external source | url, provenance, access status | Supplies source evidence for backlog candidates. |
| ExpansionBacklog | planning artifact | P1 rows, P2 rows, missing current labels | Bounds candidate selection for this implementation pass. |
| CandidateIdeology | core domain | name, priority, missing status, downgrade/defer outcome | May become IdeologyLabel, P2 alias/subtype, or deferral. |
| IdeologyLabel | core domain | id, name, family, subfamily, description, centroid | Matched against respondent scores by centroid distance. |
| Centroid | scoring model | 26 axis values across normative/descriptive/prescriptive/cross-cutting axes | Makes an IdeologyLabel scoreable and distinguishable. |
| ModuleSubtype | scoring subtype | trigger parent, candidate labels, module questions | Distinguishes narrow P2 outcomes when justified. |
| ResultOutcome | product output | primary label, confidence, subtype/module result | The user-visible ideology result. |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|--------------|-----|---------|--------|-----------------|
| 1 | 5 | 5 | - | - | - |
| 2 | 6 | 1 | 0 | 5 | 83% |
| 3 | 7 | 1 | 0 | 6 | 86% |
| 4 | 7 | 0 | 0 | 7 | 100% |
| 5 | 7 | 0 | 0 | 7 | 100% |
| 6 | 7 | 0 | 0 | 7 | 100% |
| 7 | 7 | 0 | 0 | 7 | 100% |

## Interview Transcript
<details>
<summary>Full Q&A (7 rounds)</summary>

### Round 0
**Q:** Is the topology four components: source candidate curation, result-label expansion, centroid/layer modeling, and product integration/validation?
**A:** Looks right.
**Ambiguity:** not scored.

### Round 1
**Q:** For the first implementation pass, what should count as success for the result-label expansion?
**A:** Add P1 independent labels plus P2 aliases/subtypes as grouped or module-resolved outcomes.
**Ambiguity:** 56.5%.

### Round 2
**Q:** What should be the admission rule for turning a Polcompball/Philosophyball candidate into an independent base result label?
**A:** Balanced: add distinct 26-axis labels, and allow narrow subtypes only when an existing or new module can distinguish them.
**Ambiguity:** 39.4%.

### Round 3
**Q:** Which source slice should the first balanced implementation pass prioritize?
**A:** Finish remaining high-confidence P1 gaps from the existing backlog, regardless of family.
**Ambiguity:** 28.4%.

### Round 4
**Q:** What should the acceptance gate be for product readiness?
**A:** Moderate: structural data validity plus representative archetype fixtures for the densest clusters only.
**Ambiguity:** 17.8%.

### Round 5
**Q:** For P2 aliases and subtypes in this first pass, what scope boundary should we use?
**A:** Balanced: add aliases plus module-resolved subtypes only for clusters that already need representative fixtures.
**Ambiguity:** 12.5%.

### Round 6
**Q:** If a remaining P1 candidate cannot be made distinguishable under the moderate validation gate, what should happen?
**A:** Downgrade it to P2 alias/subtype if there is a sensible parent; otherwise defer with rationale.
**Ambiguity:** 4.8%.

### Round 7
**Q:** Should the final spec require every added independent P1 label to receive baseline archetype/calibration coverage, with extra representative fixtures for dense or near-tie clusters?
**A:** Yes: every independent P1 label gets baseline archetype/calibration coverage; dense clusters get extra fixtures.
**Ambiguity:** 3.4%.

### Restate Gate
**Q:** If someone read only the restated goal, would they reach the same outcome you have in mind?
**A:** Yes, crystallize.

</details>
