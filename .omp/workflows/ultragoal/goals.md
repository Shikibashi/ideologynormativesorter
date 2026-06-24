# Ultragoal Goals: Ideology Label Expansion

## G001: Type definitions
- objective: Add 6 new optional fields to IdeologyLabel interface
- status: pending
- dependencies: []
- files: [src/types/label.ts, src/types/common.ts]
- acceptance:
  - IdeologyLabel interface has 6 new optional fields: subTheories, ethicalTheory, normativePhilosophies, descriptivePhilosophies, prescriptivePhilosophies, philosophyInfluences
  - philosophyInfluences uses correct AxisId references
  - All fields are optional (backward-compatible)
  - `npx tsc -b` compiles cleanly
- verification:
  - command: npx tsc -b
    expected: zero errors
  - command: npx vitest run src/data/dataValidity.test.ts
    expected: all existing tests pass (no regression)

## G002: Centroid pre-screen
- objective: Run centroid pre-screen on candidate labels from Polcompball ideological subcategories; determine which become full labels vs alias candidates
- status: pending
- dependencies: []
- files: [src/data/labels.ts]
- acceptance:
  - Candidate label list compiled from Polcompball ideological subcategories
  - Each candidate checked against nearest existing family centroid (cosine distance)
  - Candidates ≤ 0.03 from existing centroid → alias candidates
  - Candidates > 0.03 → full label candidates
  - Total distinct candidates meets viability (floor ≥ 115 total after screening)
  - If floor not met, follow-up filed before PR
- verification:
  - command: npx tsx scripts/pre-screen.ts (script to compute distances)
    expected: outputs candidate disposition table

## G003: Enrich existing 88 labels
- objective: Populate all 6 new fields on every existing label with Philosophyball-sourced data
- status: pending
- dependencies: [G001]
- files: [src/data/labels.ts]
- acceptance:
  - Every existing label (88) has populated philosophyInfluences (2-5 entries each)
  - Every existing label has populated subTheories, ethicalTheory, layer-specific arrays where applicable
  - Layer-specific arrays are consistent subsets of philosophies
  - philosophyInfluences.affectedAxes reference valid axis IDs
  - npx tsc -b passes
  - npx vitest run src/data/dataValidity.test.ts passes
- verification:
  - command: npx tsc -b
    expected: zero errors
  - command: npx vitest run src/data/dataValidity.test.ts
    expected: passes

## G004: Add new labels
- objective: Add 27-62 new labels from Polcompball ideological subcategories with all 6 fields populated
- status: pending
- dependencies: [G002]
- files: [src/data/labels.ts]
- acceptance:
  - New labels inserted at end of labels array, after existing 88
  - Each new label has complete centroid (26 axes), description, philosophies, family assignment
  - Each new label has all 6 new fields populated
  - Total label count within floor(115)-cap(150) range
  - npx tsc -b passes
- verification:
  - command: npx tsc -b
    expected: zero errors
  - command: npx vitest run src/data/dataValidity.test.ts
    expected: passes (existing tests)

## G005: Calibration fixtures + sweep test
- objective: Add calibration fixtures for all new labels; measure near-tie margins; register exceptions
- status: pending
- dependencies: [G004]
- files: [src/scoring/calibration.fixtures.ts, src/scoring/archetype-sweep.test.ts]
- acceptance:
  - All new label IDs appended to targetIds in calibration.fixtures.ts
  - Archetype sweep test covers all labels (no orphan labels without fixtures)
  - Near-tie exceptions registered for any fixture not ranking #1
  - Near-tie exception density ≤ 33%
  - Zero P0/P1 failures in archetype sweep
- verification:
  - command: npx vitest run src/scoring/archetype-sweep.test.ts
    expected: all pass or documented exceptions

## G006: Validation tests
- objective: Add validation tests for all 6 new fields in dataValidity.test.ts
- status: pending
- dependencies: [G001]
- files: [src/data/dataValidity.test.ts]
- acceptance:
  - Validation tests for: subTheories array shape, ethicalTheory array shape, layer-specific philosophy subsets, philosophyInfluences structure + axis ID validity
  - All existing validation tests still pass
  - npx vitest run src/data/dataValidity.test.ts passes
- verification:
  - command: npx vitest run src/data/dataValidity.test.ts
    expected: all tests pass

## G007: Full suite + build + deploy
- objective: Run complete verification suite, build production bundle, deploy to GitHub Pages
- status: pending
- dependencies: [G001, G003, G004, G005, G006]
- files: [all modified files]
- acceptance:
  - npx tsc -b: zero errors
  - npx vitest run: 270+ tests all passing
  - npm run build: clean production build
  - git push triggers GitHub Pages deployment
- verification:
  - command: npm run test
    expected: all tests pass
  - command: npm run build
    expected: clean build
