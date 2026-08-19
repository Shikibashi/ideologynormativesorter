# Phase 12 Persistence Completion Report

Status: **GO**

## Authoritative sources

The implementation follows the Phase 0/1 contracts in `docs/v2/architecture.md`,
`measurement-contract.md`, `source-classification.md`, `migration-decisions.md`,
`known-defects.md`, `contracts.md`, `content-schema.md`, and `versioning.md`.
The v2 canonical bundle at `v2/generated/content.bundle.json` is the content
binding. Legacy persistence evidence was audited from the v1 save, specialist
save, share, and research-storage boundaries, but v1 runtime code is not a v2
dependency.

## Canonical content binding

- Content version: `v2-content-phase8.1`
- Content fingerprint: `bb1dfddf12db1224215440d48f14cf876b9228a850d585e70d49d18b455aaa72`
- Response schema: `response-v2.phase1.1`
- Scoring version: `scoring-v2.phase7.1`
- Result schema: `result-v2.phase9.1`

The extracted inventory is: 80 constructs (26 root and 54 specialist), 20
domains, 338 active core items, 68 specialist items, 16 primary profiles, 24
modifiers, 78 specialist profiles, 9 specialist modules, 145 ontology nodes,
42 ontology relations, 4 diagnostic relations, and 1,013 explicit contribution
mappings. Response types are 400 likert7 and 6 statement-choice records; no
reversed active items remain in the canonical inventory.

## Persistence binding

- Private save schema: `save-v2.phase12.1`
- Public share schema: `share-v2.phase12.1`
- Private save limit: 2 MiB
- Public share limit: 64 KiB
- Full private sample: 31,290 UTF-8 bytes
- Full public projection sample: 8,495 UTF-8 bytes

Private save data is local-only and uses the versioned key
`ideology-sorter:v2:saves:current` through an explicit storage adapter. Import
validates schema, integrity, freshness, and the public assessment input before
restoring state. Saved result objects are never scoring authority. Public
shares are explicit result projections and exclude raw responses, item IDs,
contribution traces, diagnostics, session progress, local IDs, and research
metadata.

## Migration and reconciliation decisions

- MUST_PRESERVE scoring mismatches: none unresolved.
- Intentional changes: v1 keys remain untouched; v1 raw answer shares do not
  become v2 public shares; private export is a separate sensitive format;
  cached results are replayed rather than trusted; legacy migration is exact-ID
  only.
- Known-defect handling: legacy salience-skipped answers and unsupported or
  ambiguous choices are reported and dropped rather than assigned defaults;
  `dont_know` and `prefer_not_to_answer` become explicit abstained/refused
  states. No unresolved Phase 12 methodology question remains.
- Legacy pending research, participant identity, display preferences, and
  result-only comparison data remain archive-only boundaries for later work.

## Validation evidence

- `npm run v2:persistence:typecheck`: passed.
- `npm run v2:persistence:test`: 16 passed.
- Cross-phase v2 Vitest suite: 128 passed, 1 intentional skip.
- `npm run v2:reference:verify`: 21 cases, 56 behaviors, frozen reference
  commit `f0324dbf27dfc6e35ff557992e4643e3df15ee0e`.
- `npm run v2:web:test`: 11 passed.
- `npm run v2:web:typecheck`: passed.
- `npm run v2:web:build`: passed.
- Full Playwright browser matrix: 12 passed.
- Accessibility gate: passed within the full browser matrix.
- Visual snapshots: regenerated and full visual coverage passed.
- `npm run lint -- --no-warn-ignored`: passed.
- `npm run v2:web:performance`: 2 assets, 1,413,264 bytes total, 1,404,609
  JavaScript bytes, 8,655 CSS bytes.
- `git diff --check`: passed.

## Scope and next phase

No scoring engine, UI route activation, deployment, production build entrypoint,
Cloudflare configuration, D1 mutation, v1 removal, or commit was performed.
The exact recommended starting point is **Phase 13: research and operational
integration**, beginning from this GO receipt and preserving the private-save,
public-share, and no-production-activation boundaries.
