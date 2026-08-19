# Migration Decisions (Phase 0)

## 1) Non-negotiable v2 boundaries

1. No module from `src/data`, `src/domain`, `src/scoring`, `src/production`, `src/specialist`, `src/validation`, `src/research`, or controller code is imported by v2 deployable runtime.
2. No generated TypeScript file (`canonicalData.ts`) is the content authority for v2.
3. No runtime mapping fallback paths are allowed for item-to-construct resolution.
4. Scoring is single-model and single-result only.
5. Engine package is pure, deterministic, browser-independent, and research-independent.

## 2) Canonical source decisions

1. Keep existing canonical content identities and IDs as frozen IDs.
2. Rebuild content as JSON files under `packages/content/src/data` and compile to `v2/generated/content.bundle.json`.
3. Canonical metadata fields are split into explicit fields:
   - `contentSchemaVersion`
   - `contentVersion`
   - `contentFingerprint`
   - `scoringVersion`
   - `resultSchemaVersion`
   - `researchSchemaVersion`
4. Keep `research-worker/generated/canonical-manifest.json` as historical seed during Phase 0, then migrate into v2-owned source path.
5. Preserve `CANONICAL_MIGRATION_VERSION`, `FROZEN_SOURCE_COMMIT`, `APPROVED_METHODOLOGY_COMMIT`, and fingerprint in a dedicated migration record.

## 3) Scoring model decision

We resolve the confidence/priority conflict by choosing the explicit legacy production model:

- descriptive = confidence
- prescriptive = priority
- normative = neutral 1
- non-normative skipped salience => exclusion

This replaces legacy scoring duality and is the single salience rule for v2.

## 4) Content model decisions

1. Use the suggested declarative tree shape as the canonical shape: `content/manifest.json`, `content/constructs/{normative,descriptive,prescriptive}.json`, `content/items/{core,specialist}.json`, `content/profiles/{primary,modifiers,specialists}.json`, `content/ontology/{nodes,relations}.json`, `content/domains.json`.
2. Keep generated artifacts in an output directory and block manual edits.
3. Require deterministic sorting for arrays where order is not semantic and enforce explicit order where it is semantic.

## 5) Mapping and validation decisions

1. Mapping fallback is disabled by contract.
2. Compiler must fail for missing mapping, unknown construct IDs, invalid weights, duplicate IDs, or unresolved references.
3. Validation must check statement options and construct coverage for multi-construct items.
4. Validate modifier indicators and required construct gates at compile time.
5. Compile-time fingerprint is computed over canonical JSON bytes only.

## 6) Specialist architecture decisions

1. Preserve specialist identity and assignment strategy only via data declarations.
2. Keep specialist module roster and version fields in content, not controller hard-coding.
3. Specialist scoring is computed in engine using the same pure transforms as primary constructs.
4. Specialist results are optional extension output and not required for core profile matching.

## 7) Research decisions

1. Research package receives scored result metadata but does not define scoring rules.
2. Keep research contract versions and route/campaign metadata explicit and immutable.
3. Preserve refusal/missing/abstention states in research output snapshots.

## 8) Frontend decisions

1. Web app receives only `AssessmentResult` and diagnostics.
2. No client-side scoring or rescore paths.
3. Preserve historical UI behavior only where classified as MUST_PRESERVE.

## 9) Legacy coupling decisions

1. Do not preserve App-stage legacy compatibility hacks as runtime behavior.
2. Do not preserve Vite alias dependencies to `src/data/questions`.
3. Remove legacy compatibility shape usage (`LEGACY_QUESTION_BANK_VERSION`, `isCompatibleQuestionBankVersion`) from scoring path.

## 10) Open blockers at end of Phase 0

1. Existing canonical content is in TS form in v1 and must be extracted into JSON source for v2 content package.
2. Source-v2 directory layout and package boundaries are not present and need bootstrap creation in Phase 1.
3. No hard evidence policy for cross-version result compatibility; behavior classification requires explicit fixture generation in Phase 2.

## 11. Phase 2 canonical content decisions

1. The `manifest` object in `research-worker/generated/canonical-manifest.json` is the final approved v1 extraction authority. `src/domain/canonicalData.ts` is treated as a generated mirror, not as a source to serialize.
2. The approved policy-domain registry comes from `src/data/domains.ts`; domain references are explicit in v2 records and are not inferred from labels.
3. Specialist-local constructs are namespaced as `specialist:<module>:<construct>` so local scoring vocabulary cannot collide with root constructs.
4. Statement-choice mappings are owned by their options. The item-level mapping mode records that the item requires option mappings, and no fallback contribution is retained.
5. Primary profile evidence requirements are materialized as typed evidence-minimum gates from the approved required construct and minimum-item-count declarations.
6. Modifier indicators are item-owned in v2. Where v1 provides an indicator item without a scalar magnitude, v2 uses an explicit neutral unit weight and records that representation change in the reconciliation report.
7. All 78 approved specialist ontology profiles and all 57 specialist candidate rows are retained as separate records; candidate variants do not overwrite diagnostic specialist profiles.

## Phase 4 aggregation decisions

## Phase 10 reference-oracle decisions

The v1 reference is frozen to `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`.
Differential fixtures are semantic projections, not blind byte parity. The v2
runtime remains independent of v1; live v1 execution is an isolated adapter and
cannot rewrite captured fixtures without an explicit update receipt.

Phase 4 uses the canonical mapping weight, not the salience-adjusted effective
weight, as the construct score denominator. This preserves the measurement
contract and prevents salience from cancelling itself through denominator
renormalization.

Statement-choice non-answer evidence uses the deterministic union/max policy
documented in construct-aggregation.md. This policy is needed to preserve
missingness evidence without pretending that an unselected alternative was
answered.

Construct aggregation stops at construct results. It does not infer profile
targets from ontology ancestry, activate specialist profiles, or import v1
aggregation/reliability runtime behavior.
