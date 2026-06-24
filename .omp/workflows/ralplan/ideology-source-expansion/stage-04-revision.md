# Pending Approval Plan: Ideology Source Expansion — Revision 1

**Revisions applied:** This revision addresses Architect (stage-02) and Critic (stage-03) reviews. All three blocking flags, 6 must-fix items, 5 should-fix items, and 4 warnings are resolved below.

**Revision origins:**
- BLOCKING-1 (23 vs ~18 scope): Resolved in §§1, 3 — wave-based model, explicit 23-label budget with per-candidate assessment.
- BLOCKING-2 (module-trigger impact): Resolved in §4 — full module-audit table added.
- BLOCKING-3 (centroid revision loop): Resolved in §2 — revision protocol with retest before exception registration.
- Critic must-fix items 4-6: Resolved in §§3, 6, 7.
- All warnings and should-fix items: Addressed inline.

---

## RALPLAN-DR Summary (unchanged core)

### Principles
1. **Centroid distinctiveness over source recognizability.** A candidate earns independent label status only when its 26-axis centroid is separable from existing labels — not because it appears in Polcompball or Philosophyball.
2. **Existing-validation invariant priority.** No change may weaken passing data validity tests, archetype-sweep coverage, or scoring invariants to accommodate a new label.
3. **Smallest additive unit.** Each label + fixture lands as the smallest independently testable addition; dense clusters get extra fixtures.
4. **Fail gracefully, document explicitly.** P1 candidates that fail separability or validation under the moderate gate are downgraded to P2 aliases with a parent link, or deferred with written rationale — never silently dropped.
5. **Revise before exception.** A centroid that fails the archetype sweep by a large margin is revised and retested before registering a near-tie exception.

### Decision Drivers
1. **Backlog gap completeness** — 25 P1 candidates from the curated backlog remain absent from `src/data/labels.ts`; the first-order decision is which pass the independent-label test.
2. **Annotation burden** — Each independent label needs a 26-axis centroid seeded by LLM from wiki descriptions, plus manual review per axis.
3. **Dense cluster risk** — Several clusters (green/eco, authoritarian/nationalist, democratic/municipalist) will see multiple new entries that risk near-ties requiring registered exceptions and extra fixtures.
4. **Module-trigger surface** — New labels sit in families with existing modules (authoritarian, green, nationalist); module impact must be assessed per label.

### Viable Options (architect-critiqued, replaced by wave-based model)
The original Option A/B/C framework was architecturally unsound because it assessed candidate independence from backlog rationale rather than measured axis separation. **Replaced with a wave-based cluster-then-sweep model** (see Implementation Plan §3): all 23 candidates are attempted as independent labels, but their independence is proven by sweep success — not pre-declared. The "~18" estimate was aspirational; the new model commits to a process, not a count.

---

## 1. Scope Resolution (BLOCKING-1 fix)

**Decision:** All 23 P1 candidates will be attempted as independent labels through the wave-based process described in §3. The final count is determined by sweep results, not by pre-planning.

Candidates are pre-categorized into **three tiers** based on expected centroid separability:

| Tier | Count | Definition | Examples |
|---|---|---|---|
| **Solid** | ~10 | Family is sparse or label occupies a region of axis-space with few neighbors | Panarchism, World Federalism, Indigenism, Multiculturalism, Guild Socialism, Techno-Anarchism, Liquid Democracy, Cyberocracy, Bioregionalism, Paleoconservatism |
| **Probable** | ~8 | Clear direction but sits in a dense family — near-ties expected; may need exceptions | Eco-Authoritarianism, Eco-Fascism, Democratic Confederalism, Zionism, Religious Nationalism, Hindutva, One-Nation Conservatism, Accelerationism |
| **At-risk** | ~5 | High overlap with existing neighbors; centroid revision or downgrade likely | National Bolshevism, Strasserism, Integralism, Islamic Democracy, Juche |

These tiers are **planning labels, not commitments**. Labels in the At-risk tier have a pre-planned escape: if they fail sweep (margin > 0.05), they enter the centroid revision loop; if margin < 0.05 and no reasonable revision helps, they downgrade to P2 alias or defer.

**Candidates that pre-flag for P2 downgrade with rationale:**

| Candidate | Parent | Rationale |
|---|---|---|
| Libertarian Municipalism | Democratic Confederalism | Same Bookchin tradition; backlogs itself notes "could group under Democratic Confederalism if later merged" — centroid inseparability is expected |
| Fourth Theory | Integralism | Third-position syncretic authoritarian traditionalism; distinguishable from Integralism/NR only by geopolitical strategy framing, which the current axis set does not weigh independently |

**Candidates that pre-flag for deferral (if centroid revision fails):**

| Candidate | Rationale |
|---|---|
| None yet reserved | Deferral only if: (a) centroid revision loop exhausted (2 attempts), (b) no sensible parent exists. Criteria in §6. |

---

## 2. Centroid Revision Loop (BLOCKING-3 fix)

Replace the binary "exception vs downgrade" with a **three-step revision loop** for labels that fail the archetype sweep:

```
  ┌─────────────────────────────────────┐
  │ Label fails archetype sweep          │
  └──────────┬──────────────────────────┘
             │
             ▼
  ┌─────────────────────────────────────┐
  │ Step R1: CLASSIFY FAILURE            │
  │ margin = own.confidence - top.confidence
  │                                      │
  │ margin > 0.05 → CENTROID NEEDS       │
  │   REVISION (go to R2)               │
  │                                      │
  │ margin ≤ 0.05 → TIE; check if       │
  │   the tying label is in same wave    │
  │   → investigate centroid separation  │
  │   → register NEAR_TIE_EXCEPTION      │
  │   or downgrade to P2 alias           │
  └──────────┬──────────────────────────┘
             │ (margin > 0.05)
             ▼
  ┌─────────────────────────────────────┐
  │ Step R2: REVISE CENTROID             │
  │ Adjust axis values for distinguishing
  │ axes that the sweep proved under-     │
  │ weighted or mis-signed.               │
  │ Re-seed from source description,      │
  │ adjust up to 4 axes max per revision. │
  │  limit: 2 revisions per label         │
  └──────────┬──────────────────────────┘
             │
             ▼
  ┌─────────────────────────────────────┐
  │ Step R3: RETEST                      │
  │ Re-run archetype sweep.              │
  │                                      │
  │ Pass → commit label ✅               │
  │ Fail with margin ≤ 0.05              │
  │   → register NEAR_TIE_EXCEPTION      │
  │ Fail with margin > 0.05 again        │
  │   → downgrade to P2 alias or defer   │
  └─────────────────────────────────────┘
```

**Rules:**
- A label gets **max 2 centroid revisions** per plan pass.
- Each revision adjusts **at most 4 axes** — not a full re-seed — to prevent chasing the sweep metric.
- After 2 revisions, the label is either: (a) committed with near-tie exception (if margin ≤ 0.05), (b) downgraded to P2 alias under the nearest sensible parent, or (c) deferred with rationale.
- Revision decisions are documented per-label in the working notes.

---

## 3. Wave-Based Cluster-then-Sweep Execution Model (BLOCKING-1 + Critic must-fix #4)

Replace the single-pass 23-label batch with four waves:

### Wave 1 — Distant Anchors (5 labels, sparse families)

Execute and sweep before proceeding.

| Label | Family | Rationale for Wave 1 |
|---|---|---|
| Panarchism | anarchist / new: panarchist | Very sparse family space; likely clean pass |
| World Federalism | liberal / new: world-federalist | No close existing neighbor |
| Indigenism | new: indigenist | Entirely new family; no neighbor collision |
| Guild Socialism | socialist / new: guild-socialist | Socialist family is dense but guild-socialism occupies a novel coordination mode |
| Multiculturalism | liberal / new: multiculturalist | Liberal family dense but multiculturalism is normatively distinct |

**Wave 1 success criteria:** All 5 pass sweep or pass after ≤1 centroid revision. If any fails ≥2 revisions, pause and investigate fixture pipeline integrity before proceeding to Wave 2.

### Wave 2 — Family Clusters (8-10 labels, added by sub-cluster, sweep after each)

**Sub-cluster 2a — Green/Eco (3 labels)**

| Label | Family | Risk |
|---|---|---|
| Bioregionalism | green / new: bioregional | Moderate — Ecosocialist and Degrowth Green near-neighbors |
| Eco-Authoritarianism | authoritarian / new: eco-authoritarian | Moderate — distinct from Ecosocialist on state-coercion but may near-tie |
| Eco-Fascism | authoritarian / new: eco-fascist | At-risk — may near-tie with Fascist-Authoritarian on multiple axes |

**Sub-cluster 2b — Nationalist (3 labels)**

| Label | Family | Risk |
|---|---|---|
| Religious Nationalism | nationalist / new: religious-nationalist | Moderate — sits between Theocrat and Ethnonationalist |
| Hindutva | nationalist / new: hindutva | Moderate — overlaps Ethnonationalist and Theocrat territory |
| Zionism | nationalist / new: zionist | Probable — national self-determination profile distinct from Ethnonationalist |

**Sub-cluster 2c — Authoritarian (3 labels)**

| Label | Family | Risk |
|---|---|---|
| National Bolshevism | authoritarian / new: national-bolshevist | At-risk — syncretic; may fall between Marxist-Leninist and Fascist-Authoritarian |
| Strasserism | authoritarian / new: strasserist | At-risk — very close to Fascist-Authoritarian |
| Integralism | conservative / new: integralist | Probable — distinct from Theocrat on state-church integration model |

**Wave 2 success criteria:** Each sub-cluster runs sweep independently. Near-ties within a sub-cluster are expected and documented. If a sub-cluster produces >2 labels that fail centroid revision, consider merging near-indistinguishable labels into aliases before proceeding to Wave 3.

### Wave 3 — Borderline Candidates (remaining, 5-7 labels)

| Label | Family | Risk |
|---|---|---|
| Democratic Confederalism | democratic / new: confederal-democratic | Probable — may near-tie with Participism or Council Communist |
| Paleoconservatism | conservative / new: paleoconservative | Solid — distinct from National Traditionalist on foreign policy |
| One-Nation Conservatism | conservative / new: one-nation-conservative | Probable — overlaps Christian Democrat |
| Islamic Democracy | conservative / new: islamic-democratic | At-risk — may be hard to separate from Christian Democrat + secularism flip |
| Liquid Democracy | democratic / new: liquid-democratic | Solid — novel democratic mechanism |
| Accelerationism | technocratic / new: accelerationist | Probable — distinct from Transhumanism on strategy vs. human-enhancement |
| Juche | socialist / new: juche | At-risk — overlaps Marxist-Leninist on many axes, differs on nationalism |
| Techno-Anarchism | anarchist / new: techno-anarchist | Solid — anarchist family dense but techno-anarchism occupies a distinct mechanism niche |

**Wave 3 success criteria:** This is where the downgrade/defer escape hatch applies. If a label fails centroid revision (2 attempts), it is downgraded to P2 alias under the nearest sensible parent, or deferred if no parent exists. Each downgrade or deferral is documented with rationale.

### Wave 4 — Mechanical (P2 aliases + documentation)

Added only after Waves 1-3 are committed:

| P2 Name | Parent Label | Mechanism |
|---|---|---|
| Libertarian Municipalism | democratic-confederalism | `aliases: ['Libertarian Municipalism']` |
| National Communism | national-bolshevism | `aliases: ['National Communism']` |
| National Syndicalism | strasserism | `aliases: ['National Syndicalism']` |
| Clerical Fascism | integralism | `aliases: ['Clerical Fascism']` |
| Islamic Theocracy | theocrat | `aliases: ['Islamic Theocracy']` (existing label) |
| Labour Zionism | zionism | `aliases: ['Labour Zionism']` |
| Noocracy | technocratic-centralist | `aliases: ['Noocracy']` (existing label) |
| Scientocracy | technocratic-centralist | `aliases: ['Scientocracy']` (existing label) |

Also verify existing backlog aliases for completeness: Georgism under Geolibertarian, Liberal Conservatism under Conservative Liberalism.

---

## 4. Module-Trigger Impact Analysis (BLOCKING-2 fix)

Each proposed label is audited against `factionModules.ts` for trigger impact:

### Existing modules and their triggerLabelIds

| Module | triggerLabelIds | subtypeLabelIds |
|---|---|---|
| left-faction-module | democratic-socialist, revolutionary-collectivist, egalitarian-statist | democratic-socialist, social-democrat, market-socialist, council-communist, marxist-leninist, syndicalist, revolutionary-collectivist |
| anarchist-faction-module | mutualist, anarcho-communist, left-wing-market-anarchism, individualist-anarchism, anarcho-primitivism | mutualist, anarcho-communist, agorist, anarcho-capitalist, left-wing-market-anarchism, individualist-anarchism, anarcho-primitivism |
| green-faction-module | ecosocialist, degrowth-green, deep-ecology | ecosocialist, degrowth-green, deep-ecology, ecomodernist |
| conservative-faction-module | national-traditionalist, christian-democrat, neoconservative | national-traditionalist, christian-democrat, neoconservative, theocrat |
| liberal-faction-module | market-liberal, civil-libertarian-cosmopolitan, classical-liberalism | market-liberal, civil-libertarian-cosmopolitan, classical-liberalism, neoliberalism, ordoliberalism, social-liberalism, conservative-liberalism |
| technocracy-faction-module | technocratic-centralist, ecomodernist | technocratic-centralist, ecomodernist, transhumanism |
| nationalist-faction-module | civic-nationalist, ethnonationalist, right-wing-populism, welfare-chauvinism | ethnonationalist, civic-nationalist, right-wing-populism, welfare-chauvinism |
| authoritarian-faction-module | fascist-authoritarian, absolute-monarchist, neoreactionary | fascist-authoritarian, absolute-monarchist, neoreactionary |
| social-democratic-faction-module | egalitarian-statist, social-democrat | egalitarian-statist, social-democrat, communitarianism |
| distributist-faction-module | distributism | distributism |
| populist-faction-module | left-wing-populism, right-wing-populism | left-wing-populism, right-wing-populism |

### Per-label module trigger audit

| New Label | Would trigger existing module? | Correct? | Action |
|---|---|---|---|
| **Eco-Authoritarianism** | No — no trigger includes `eco-authoritarian` | Yes — no existing module fits this hybrid eco/authoritarian profile | No action; note for future module work |
| **Eco-Fascism** | No — no trigger matches | Yes — same reasoning | No action |
| **Bioregionalism** | No — green module triggers on ecosocialist/degrowth-green/deep-ecology only | Correct — bioregionalism is ecologically decentralist, not state-planning or deep-ecology | Could consider adding to green module in future pass; out of scope now |
| **Democratic Confederalism** | No — closest is anarchist mod (via left-wing-market-anarchism participism territory) but no direct trigger | Correct — stateless confederal democracy distinct from existing anarchist triggers | No action |
| **Paleoconservatism** | No — conservative module triggers on nat-trad/christian-dem/neocon only | Correct — paleoconservatism would need its own module path or adjunction to conservative mod | Could add to conservative mod triggers in future pass; out of scope now |
| **One-Nation Conservatism** | No — conservative module triggers don't include | Borderline — fair to add to conservative module triggers but plan defers module changes | No action this pass |
| **National Bolshevism** | No — no trigger matches this syncretic label | Correct — would need its own module for sub-type resolution | No action |
| **Strasserism** | No — closest authoritarian module but fascist-authoritarian trigger doesn't cover | Correct — would need new module path | No action |
| **Integralism** | No — conservative module doesn't include | Correct — integralism is religious-corporatist not national-conservative | No action |
| **Islamic Democracy** | No — no trigger matches | Correct — would need its own or conservative module adjunction | No action |
| **Hindutva** | No — nationalist module triggers on civic/ethno/right-populist/welfare-chauvinist | Borderline — could be added to nationalist module triggers in future | No action this pass |
| **Religious Nationalism** | No — no trigger matches this cross-cutting label | Correct — sits between nationalist and conservative modules, would need a sub-module | No action |
| **Zionism** | No — no trigger matches | Correct — national self-determination is distinct from existing triggers | No action |
| **Panarchism** | No — anarchist module triggers on mutualist/anarcho-communist/lwma/individualist-anarchism/anarcho-primitivism only | Correct — panarchism's voluntary jurisdiction pluralism is mechanism-not-family based | No action |
| **Liquid Democracy** | No — closest democratic module doesn't exist yet | Correct — no existing module covers process-focused democracy | No action |
| **Cyberocracy** | No — technocracy module triggers on technocratic-centralist/ecomodernist only | Borderline — cyberocracy could trigger technocracy module in future; not now | No action |
| **Accelerationism** | No — technocracy module doesn't match | Correct — accelerationism is strategy-focused, not institution-focused | No action |
| **Juche** | No — left module doesn't include (nationalist state socialism) | Correct — would need a new module path | No action |
| **Guild Socialism** | No — closest is left-module (democratic-socialist trigger) | Correct — guild socialism differs from existing socialist subtypes | No action |
| **Techno-Anarchism** | No — anarchist module triggers don't include | Borderline — could be added to anarchist mod in future | No action this pass |
| **World Federalism** | No — no trigger matches | Correct — global governance perspective has no existing module | No action |
| **Multiculturalism** | No — no trigger matches | Correct — pluralist integration perspective not covered by existing triggers | No action |
| **Indigenism** | No — no trigger matches | Correct — sovereign indigenous decolonial perspective not covered | No action |

**Conclusion from module audit:** No new label will inadvertently trigger an existing module or cause incorrect subtype resolution, because the existing modules all use specific `triggerLabelIds` (not family-based matching). No changes to `factionModules.ts` are needed.

**Verification:** After labels are added, run `npx vitest run src/data/dataValidity.test.ts` — the existing module reference checks verify that `triggerLabelIds` and `subtypeLabelIds` still reference valid LabelIds.

---

## 5. Failure-Triage Protocol (Architect §3 recommendation, Critic must-fix #6)

For any label that fails the archetype sweep in any wave:

```
Step T1: CLASSIFY
  margin = own.confidence - top.confidence
  Is margin > 0.05 → go to Step T2 (centroid revision)
  Is margin ≤ 0.05 → go to Step T3 (tie investigation)

Step T2: REVISE (centroid revision loop - see §2)
  Max 2 revisions, max 4 axes per revision.
  If margin ≤ 0.05 after revision → document exception.
  If margin > 0.05 exhausted → go to Step T4.

Step T3: INVESTIGATE TIE
  Is tying label in same wave?
    YES → Check centroid separation on distinguishing axes.
           If axes differ by < 0.3 on axis pairs → downgrade one to P2 alias.
           If axes differ by ≥ 0.3 → register NEAR_TIE_EXCEPTION with margin documentation.
    NO → Register NEAR_TIE_EXCEPTION with margin and note about cross-family proximity.
  
  Check question-bank coverage:
    Are the distinguishing axes well-weighted in base questions?
    If no → note "axis coverage gap" in exception documentation.

Step T4: DOWNGRADE OR DEFER (see §6)
```

---

## 6. Deferral vs Downgrade Criteria (Critic must-fix #5)

### "Sensible parent" definition
A parent is **sensible** for P2 downgrade if:
1. The parent's family matches or encompasses the candidate's axis directions (e.g., authoritarian family for eco-fascist)
2. The candidate label would appear as a reasonable named child or subtype in the parent's entry (e.g., `aliases: ['Clerical Fascism']` under Integralism is sensible; under Egalitarian-Statist it is not)
3. Adding the alias does not create contradictory signal in label-match display (e.g., Ecclesiastical label under secular parent)

### Decision tree

```
  Candidate fails centroid revision (2 attempts)
  │
  ├─ Does a parent exist matching criteria 1-3 above?
  │   YES → Downgrade to P2 alias under that parent with rationale.
  │   NO  → Defer with full rationale including:
  │          - Why no parent works (which criteria fail)
  │          - Candidate's measured issues (centroid closeness, axis coverage)
  │          - Conditions under which it could be re-evaluated (e.g., new module, axis addition)
  │
  └─ Example application:
     Fourth Theory → parent Integralism (sensible: same authoritarian traditionalist space, 
                       similar axis sign pattern) → downgrade to P2 alias
     Candidate with no family match → defer
```

### Deferral documentation template
Each deferred candidate gets a block:
```
## Deferred: [name]
- Candidate: [name]
- Decision: Defer (no sensible parent)
- Reason: [which parent candidates were considered and why they fail criteria 1-3]
- Axis measurement summary: [nearest existing labels and distances]
- Re-evaluation condition: [what would make this viable later — new module, axis addition, question coverage]
- Reviewer: [name]
- Date: [YYYY-MM-DD]
```

---

## 7. Wave-by-Wave File Impact

| Wave | Files Changed | Change |
|---|---|---|
| Wave 1 | `src/data/labels.ts` | +5 new labels: panarchism, world-federalism, indigenism, guild-socialism, multiculturalism |
| Wave 1 | `src/scoring/calibration.fixtures.ts` | +5 IDs to targetIds |
| Wave 1 | `src/scoring/archetype-sweep.test.ts` | No changes expected (clean pass) |
| Wave 2a | `src/data/labels.ts` | +3 labels: bioregionalism, eco-authoritarianism, eco-fascism |
| Wave 2a | `src/scoring/calibration.fixtures.ts` | +3 IDs |
| Wave 2a | `src/scoring/archetype-sweep.test.ts` | +near-tie exceptions for eco cluster |
| Wave 2b | `src/data/labels.ts` | +3 labels: religious-nationalism, hindutva, zionism |
| Wave 2b | `src/scoring/calibration.fixtures.ts` | +3 IDs |
| Wave 2b | `src/scoring/archetype-sweep.test.ts` | +near-tie exceptions if needed |
| Wave 2c | `src/data/labels.ts` | +3 labels: national-bolshevism, strasserism, integralism |
| Wave 2c | `src/scoring/calibration.fixtures.ts` | +3 IDs |
| Wave 2c | `src/scoring/archetype-sweep.test.ts` | +near-tie exceptions likely |
| Wave 3 | `src/data/labels.ts` | +6-8 labels: democratic-confederalism, paleoconservatism, one-nation-conservatism, islamic-democracy, liquid-democracy, accelerationism, juche, techno-anarchism |
| Wave 3 | `src/scoring/calibration.fixtures.ts` | +6-8 IDs |
| Wave 3 | `src/scoring/archetype-sweep.test.ts` | +near-tie exceptions as needed; possible label deletions |
| Wave 4 | `src/data/labels.ts` | aliases arrays on 7 existing/new labels |

---

## 8. Verification Plan (Revised)

### Per-wave verification
After each wave's labels are added to `src/data/labels.ts` and `src/scoring/calibration.fixtures.ts`:
```
npx vitest run src/data/dataValidity.test.ts          # structural integrity
npx vitest run src/scoring/archetype-sweep.test.ts     # archetype sweep
```
Wave 1 additionally runs `npx vitest run src/scoring/` to confirm no scoring regression from the enlarged corpus.

### Manual verification for dense clusters
For each sub-cluster in Wave 2, after sweep:
```
npx vitest run src/scoring/archetype-sweep.test.ts -t <labelId>
# Document top-3 nearest labels and confidence margins
```

### Module-trigger verification
After all waves:
```
npx vitest run src/data/dataValidity.test.ts   # includes factionModule reference validation
```
No new factionModule tests needed — the existing test verifies all triggerLabelIds and subtypeLabelIds resolve.

### `labelById` completeness check
After each wave, add a one-line test or manual check:
```typescript
const allIds = labels.map(l => l.id)
const mapIds = Array.from(labelById.keys())
// assert: every label ID is in labelById and vice versa
```

### Final verification
```
npx tsc --noEmit                                     # typecheck
npx vitest run src/data/dataValidity.test.ts          # data integrity
npx vitest run src/scoring/archetype-sweep.test.ts    # calibration coverage
npx vitest run src/scoring/                            # full scoring suite
```

---

## 9. Risk and Rollback

### Per-wave rollback
Each wave is independently revertible. If Wave 2a introduces unresolvable near-ties:
1. Revert the 3 files touched in that wave (`labels.ts`, `calibration.fixtures.ts`, `archetype-sweep.test.ts`)
2. Document the failure (which labels and why)
3. Proceed to Wave 2b with the plan unchanged

### Risk register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Centroid revision loop exhausted for multiple labels | Medium | Scope compression | Wave-based model limits blast radius; per-wave downgrades expected |
| Module-trigger side effect not captured by audit | Low | Silent behavior change | Module audit table covers all 23 labels; data validity test catches ref mismatches |
| Family string collision with future code | Low | Rendering glitch | Family is display-only; all proposed families follow kebab-case pattern |
| Question-bank coverage gap for distinguishing axes | Medium | Systematic sweep failure | Architect's WARNING-4 addressed by manual check per cluster; if gap found, document as near-tie root cause |
| Fixture generation loses gradient (ternary +3/0/-3 mapping) | Medium | Labels appear closer than centroid suggests | Accept — this is an existing constraint, not new. Registered exceptions document it |

---

## 10. Open Questions — Resolved from Prior Round

| Question | Resolution |
|---|---|
| Q1: Fourth Theory — independent or downgrade? | **Downgrade to P2 alias under Integralism.** Fourth Theory shares axis profile with Integrism (authority-legitimacy positive, moral-traditionalism positive, anti-domination negative, secularism-religious positive) with only geopolitical-multipolarity differences. Current axis set doesn't weigh geopolitical strategy independently. |
| Q2: Eco-Fascism parent of Eco-Authoritarianism? | **Both independent P1 labels.** Eco-Authoritarianism (eco + state coercion) and Eco-Fascism (eco + ethnic exclusion + hierarchy) are separable on political-community-boundary and anti-domination axes. They may near-tie in sweep; if so, register exceptions rather than merge. |
| Q3: Democratic Confederalism vs Guild Socialism separability? | **Both independent P1 labels.** DemConf emphasizes stateless confederal democracy and ecological feminism; Guild Socialism emphasizes functional guild governance of production. They differ on centralization-preference, state-action-vs-exit, and coercion-strategy axes. If sweep shows near-tie, register exception. |
| Q4: Democratic Confederalism family value? | **`democratic`** family with **`confederal-democratic`** subfamily. This maintains consistency with existing `democratic` family (which contains `radical-democracy`). |
| Q5: Indigenism family — new or under nationalist? | **New family: `indigenist`** with subfamily `indigenist`. Indigenism's sovereignty, land, decolonial authority, and communal-indigenous-rights profile does not fit nationalist (inclusive-national or ethnic-national) framing. |

---

## 11. Edge Case Coverage

### E-1: Module question fixture dependency
Check performed per cluster. The `createCentroidAlignedFixture` helper only iterates base `questions`, not `moduleQuestions`. If a label's distinguishing axis is predominantly covered by module questions, the fixture will not probe that axis.

**Audit result:** No proposed label depends primarily on module-covered axes for its sign pattern. The 26-axis centroid distribution across base questions is sufficient to separate each new label's directional profile. The eco-cluster's distinguishing axis (human-nature-priority) is well-covered by base questions. The nationalist cluster's distinguishing axis (political-community-boundary) is well-covered. The authoritarian cluster's (militarism-pacifism, coercion-strategy) are well-covered.

### E-2: 3-way eco tie (Eco-Authoritarianism, Eco-Fascism, Fascist-Authoritarian)
If sweep shows 3-way tie, the exception is registered with all three labels in `tiesWith` array, similar to existing 3-way exceptions (`egalitarian-statist` ties with `['democratic-socialist', 'ecosocialist']`).

### E-3: DemConf/Guild indistinguishability
If sweep shows near-tie between Democratic Confederalism and Guild Socialism (or both with Participism), the tie is investigated under Step T3 (tie investigation). If margin ≤ 0.03, the exception is registered; if margin > 0.05, centroid revision loop activates. Both remain independent unless centroid revision fails AND no distinguishing axis can be strengthened.

### E-4: Family proliferation side-effects
Before introducing new families (`indigenist`, `confederal-democratic` as subfamily of `democratic`, etc.), verify that `buildResultProfile` family-tree rendering does not use string matching on family names that would break with new families. Search for `family` string references in scoring code:

```
search pattern: "\.family" in src/scoring/
```
If family is only used for tree grouping (display-only), new families are safe. If any code path uses family-name equality checks, those paths must be updated.

---

## 12. Execution Recommendation

**ultragoal** — revised wave-based model fits naturally into a goal ledger:

| Goal ID | Name | Depends On |
|---|---|---|
| G1 | Wave 1: Distant anchors | — |
| G2 | Wave 2a: Green/eco cluster | G1 |
| G3 | Wave 2b: Nationalist cluster | G2 |
| G4 | Wave 2c: Authoritarian cluster | G3 |
| G5 | Wave 3: Borderline candidates | G4 |
| G6 | Wave 4: P2 aliases + documentation | G5 |
| G7 | Final verification + deferral docs | G6 |

Each goal includes: add labels → add fixtures → run validation → document near-ties → checkpoint. The centroid revision loop and failure-triage protocol apply per-goal.

Status: pending approval
