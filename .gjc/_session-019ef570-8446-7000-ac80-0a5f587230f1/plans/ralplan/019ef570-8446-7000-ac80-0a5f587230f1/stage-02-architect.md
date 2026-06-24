## Summary
Researcher review supports asking one focused success-criteria question before producing the 30-60 item backlog. The next question should decide the required output fields for each backlog row, because the current facts define sources, breadth, and centroid preference but not what evidence/rationale each listed item must carry.

## Analysis
Evidence: .gjc/_session-019ef55f-39e2-7000-8d10-9667a9c48867/state/deep-interview-state.json records the source basis as Polcompball plus Philosophyball, the inclusion rule as prefer distinct centroids while allowing notable aliases/subtypes as grouped children, and the desired breadth as a medium curated backlog of roughly 30-60 items. The same state marks the active component weakest dimension as criteria after progress to refined. Repo evidence in src/types/label.ts shows implemented labels currently require id, name, family, optional subfamily, centroid, and description; there are no existing alias/subtype fields. src/data/AGENTS.md says label changes require validation coverage and centroids are used by scoring. The Polcompball page is broad and includes canonical ideologies alongside variants, factions, historical/regional forms, single-issue tendencies, and joke/meta entries; the Philosophyball page was not retrievable through the read tool beyond a CAPTCHA/verification response. That source asymmetry makes per-row provenance/access status important if Philosophyball remains in scope.

The best next single question should not ask for candidate names yet. It should ask the user to choose the row contract: what must be present for every candidate so the later list can distinguish independent labels from grouped children without drifting into implementation.

## Root Cause
The ambiguity is not candidate sourcing anymore; it is deliverable shape. A 30-60 backlog can be a useful planning artifact only if each entry has enough fields to justify inclusion, grouping, and priority.

## Findings
1. MEDIUM — Deep interview state, rounds 2-3: The user chose distinct scoreable centroids plus grouped aliases/subtypes, then chose 30-60 items, but no row-level acceptance fields are fixed. Impact: the produced backlog could mix independent labels and child aliases inconsistently. Fix: ask for the required fields per item.
2. MEDIUM — src/types/label.ts and src/data/AGENTS.md: Current persisted label data has family/subfamily, description, and full centroid vectors, but no alias/subtype structure. Impact: a backlog that omits proposed parent/grouping and distinctiveness rationale will not translate cleanly into the current model or future schema decisions. Fix: require parent/grouping status and centroid-distinctiveness rationale in the backlog.
3. LOW — External source evidence: Polcompball is readable and very broad; Philosophyball is user-cited but tool-blocked by CAPTCHA/verification. Impact: source provenance may become unreliable unless noted per candidate. Fix: include source/provenance and confidence/access status as a field if the user wants traceability.

## Recommendations
Ask one multiple-choice question: What fields must each backlog item include?
A. Minimal: name, source, proposed role (new label vs alias/subtype child), and parent/group if grouped.
B. Scoring-ready (recommended): minimal fields plus one-sentence inclusion rationale, centroid-distinctiveness rationale, family/subfamily, and priority tier.
C. Audit-ready: scoring-ready fields plus excluded/near-miss reason notes, source-access confidence, and implementation risk notes.

Use option B as the default recommendation because it directly supports the centroid preference and alias/subtype grouping without turning the interview into implementation planning.

## Architectural Status
WATCH

## Code Review Recommendation
COMMENT

## Trade-offs
| Option | Pros | Cons |
|---|---|---|
| Minimal | Fastest and keeps the interview lightweight | Too weak to enforce scoreability or grouping consistency |
| Scoring-ready | Best match for current ambiguity; enough to curate a useful 30-60 backlog | Slightly more work per item |
| Audit-ready | Most traceable, especially with blocked Philosophyball access | May overburden a first-pass curated backlog |
