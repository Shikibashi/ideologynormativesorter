# Clean-rebuild staging and cutover runbook

**Status: staging scaffold; not a deployment authorization.**

This runbook implements the approved static Pages → Cloudflare Worker → private D1 topology. It is intentionally executable only after the release/infra owner fills every required field and signs the gates. The staging Wrangler file contains sentinels by design. No production resource ID, route, endpoint, credential, or secret belongs in it or in this runbook.

No deployment or migration command was run while creating this scaffold.

## 1. Topology and invariants

```text
isolated Pages preview (release SHA)
          │ VITE_RESEARCH_ENDPOINT=$STAGING_WORKER/submit
          ▼
isolated staging Worker (versioned route/cohort)
          │ private binding DB
          ▼
isolated staging D1 (append-only submissions)
```

The existing production Pages artifact and v1 Worker route remain the rollback target. New Pages traffic and persisted writes are separate approvals. There is no public D1 read endpoint. Staging records are synthetic only and are purged after evidence is archived.

The staging Worker must use a distinct name/route, D1 database, rate-limit namespace, origin, and contract cohort. Pending records retain their original route and cohort. Structural registry/scoring changes use a new route/cohort; versions are never silently coerced.

## 2. Required fields and owners

Fill the table before any dry-run, migration, traffic change, or write-mode change. A blank, `TBD`, or `REPLACE_WITH_*` value closes the gate.

| Field                            | Required value                                                                           | Owner / sign-off         |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
| Release/infra owner              | `[REQUIRED: name and approval reference]`                                                | Release/infra            |
| Domain architect                 | `[REQUIRED: name and manifest/import-DAG sign-off]`                                      | Domain                   |
| Product/methodology owner        | `[REQUIRED: name and replay/copy sign-off]`                                              | Product/methodology      |
| UI/reference-lock owner          | `[REQUIRED: name and Pages artifact sign-off]`                                           | UI/reference             |
| Worker/persistence owner         | `[REQUIRED: name and migration/write-health sign-off]`                                   | Worker/persistence       |
| Research/data steward            | `[REQUIRED: name and privacy/retention/cohort sign-off]`                                 | Research/data            |
| Analysis owner                   | `[REQUIRED: name and version-partition sign-off]`                                        | Analysis                 |
| Persistence owner                | `[REQUIRED: name and pending/D1 probe sign-off]`                                         | Persistence              |
| Specialist actions owner         | `[REQUIRED: name and Specialist/disposition probe sign-off]`                             | Specialist               |
| Controller/stage UI owner        | `[REQUIRED: name and receipt/recovery sign-off]`                                         | UI                       |
| Staging Pages artifact SHA       | `[REQUIRED: immutable release SHA]`                                                      | UI/reference             |
| Staging Pages preview URL/origin | `[REQUIRED: non-production URL]`                                                         | Release/infra            |
| Staging Worker name              | `[REQUIRED: isolated name; recommended clean-staging suffix]`                            | Release/infra            |
| Staging Worker route/endpoint    | `[REQUIRED: versioned route and `/submit`, `/health` URLs]`                              | Release/infra            |
| Staging D1 name                  | `[REQUIRED: newly provisioned isolated name]`                                            | Release/infra            |
| Staging D1 ID                    | `[REQUIRED: newly provisioned ID]`                                                       | Release/infra            |
| Staging rate-limit namespace ID  | `[REQUIRED: newly provisioned ID]`                                                       | Release/infra            |
| `writeMode` control              | `[REQUIRED: audited drain/open toggle and command/API]`                                  | Release/infra            |
| Grace start/end                  | `[REQUIRED: ISO-8601 dates; 14 days default, 30-day maximum without architect approval]` | Release/infra            |
| Migration window                 | `[REQUIRED: start/end and 2× p99 latency evidence]`                                      | Worker/persistence       |
| New study/schema/cohort IDs      | `[REQUIRED: approved values or explicit same-cohort decision]`                           | Research/data + analysis |
| Promotion mechanism              | `[REQUIRED: immutable Pages promotion or approved route/DNS switch]`                     | Release/infra            |
| Rollback target                  | `[REQUIRED: last-known-good Pages SHA and v1 Worker route]`                              | Release/infra            |
| Rollback command                 | `[REQUIRED: reviewed, non-destructive command/API reference]`                            | Release/infra            |
| Monitoring and incident owner    | `[REQUIRED: dashboard, alert thresholds, contact]`                                       | Release/infra            |
| Evidence location                | `[REQUIRED: timestamped private release bundle]`                                         | UI/reference             |

**Refusal gate:** do not run `wrangler deploy`, `wrangler d1 migrations apply`, a Pages promotion, a route switch, or a write-mode change while any required field is unresolved. Do not substitute a production value to unblock staging. Obtain owner approval in the evidence bundle first.

## 3. Non-secret contract and config preflight

1. Copy no values from a production config except the intentionally reviewed, non-secret contract version rules. Keep `research-worker/wrangler.staging.jsonc` as the only staging config.
2. Replace only the staging sentinels in that file: origin, study/schema/form/bank/scoring values, generated manifest/serialization fingerprints, D1 name/ID, rate-limit namespace ID, write-mode control, grace dates, and approval reference.
3. Confirm the generated canonical artifact and all producers agree on the contract version, manifest version/fingerprint, serialization version/fingerprint, schema fingerprint, cohort version/fingerprint, and route. Health may expose these safe metadata fields, but never payloads, participant data, credentials, or secrets.
4. Confirm the Pages build contains only the staging `/submit` endpoint and staging contact/retention text. Search the built bundle for a production endpoint or secret; either finding blocks the gate.
5. Record the config hash, artifact hash, release SHA, owner approvals, and exact sentinel replacement list. Do not commit secrets or private respondent records.

## 4. Dry-run gate (staging only)

After Sections 2–3 are signed, run the dry-run from the repository root with the staging config. This is a command template, not a command run for this change:

```bash
npx wrangler deploy --dry-run --config research-worker/wrangler.staging.jsonc
```

The dry-run must show only the isolated staging Worker, staging D1 binding, staging rate-limit binding, staging vars, and expected migration directory. It must not show a production ID, route, endpoint, or secret. Save the output and config hash in the evidence bundle. A dry-run error, unresolved sentinel, unexpected binding, or metadata mismatch is a hard stop.

Build the Pages preview with the staging endpoint only:

```bash
VITE_RESEARCH_ENDPOINT="$STAGING_WORKER/submit" npm run build
```

Use the release owner’s approved build/publish mechanism for the preview; do not point a production Pages deployment at this config.

## 5. Health and contract gate

After the Worker is provisioned by the release owner, check the read-only route:

```bash
curl --fail --silent --show-error "$STAGING_WORKER/health"
```

Pass criteria:

- HTTP 200 and `ok: true`.
- Safe metadata identifies the expected staging contract route, manifest version/fingerprint, serialization version/fingerprint, cohort, and `writeMode`.
- `writeMode` is explicitly `drain` before a migration and explicitly `open` only after the migration gate.
- The response contains no payload, submission record, participant identifier, secret, or credential.
- Repeated health checks remain stable and are recorded with timestamp and release SHA.

Any health failure twice, metadata drift, unexpected open mode, privacy leak, or unknown route is a hard stop.

## 6. Staging migration

Use the isolated D1 name from Section 2. Snapshot schema, row count, and `submission_id`/`payload_sha256` pairs through authenticated Wrangler access before applying anything. Never use a production database selector.

Set the affected staging route(s) to `writeMode=drain`; drain returns `503` with a valid `Retry-After`. Wait at least twice observed p99 submit latency and no more than 15 minutes. Unresolved pending keys, storage errors, or any caller bypassing per-submission durable storage block migration.

Apply only the additive migration after the drain evidence is signed (command template; not run here):

```bash
npx wrangler d1 migrations apply "$STAGING_D1_DATABASE_NAME" --remote --config research-worker/wrangler.staging.jsonc
```

Verify the migration and indexes, then prove old values/row counts/hashes are unchanged. Post one synthetic v1-route fixture and one v2-route fixture, plus duplicate (same ID and bytes) and conflict (same ID, different bytes) fixtures. Expected outcomes are accepted or deduplicated `202`, `409` for a conflicting ID, and no mutation of the old rows. Record the migration result and snapshot hashes.

If no shared D1 migration is required, record the reason and a zero-duration window; do not claim that a drain occurred.

## 7. Drain/open and persisted-write approval

The release/infra owner controls the audited `writeMode` toggle. The default sequence is:

1. Announce the window and capture active write rate, last accepted ID, p99 submit latency, and pending-key count.
2. Set both affected Worker routes to `drain`; verify health reports `drain` and new writes receive `503` plus `Retry-After`.
3. Wait the bounded window from Section 6. User-triggered retries preserve immutable submission ID, exact payload bytes/SHA, route, and cohort; there are no background retries.
4. Complete migration and old/new HTTP, idempotency, privacy, and D1 invariants.
5. Obtain separate persisted-write approval from the release/infra and Worker/persistence owners.
6. Set the intended route to `open`; verify health and a synthetic write. Record who changed the mode, when, how, and the response evidence.

Opening writes is not frontend promotion. Keep the old route available for active tabs throughout the approved grace window (default 14 days; maximum 30 days without architect approval). Pending keys continue to target their original route/cohort during grace.

## 8. Side-by-side replay

Run old and new fixtures against their own routes; never send synthetic replay traffic to a production resource:

```bash
node scripts/side-by-side-replay.mjs \
  --old tests/fixtures/compatibility/old-result.json \
  --new tests/fixtures/compatibility/new-result.json
```

Also run the research cutover probe with staging endpoints and synthetic fixtures:

```bash
node scripts/probe-research-cutover.mjs \
  --old-endpoint "$OLD_ENDPOINT" \
  --new-endpoint "$NEW_ENDPOINT" \
  --fixture tests/fixtures/compatibility/cutover.json \
  --rollback-command "$ROLLBACK_COMMAND" \
  --drain-command "$DRAIN_COMMAND"
```

The replay passes only when approved public-result fixtures match except explicitly versioned metadata; contract, manifest, serialization, cohort, and route metadata are exact; old tabs remain accepted by v1; new tabs use v2; duplicate/conflict semantics, origin/body/rate controls, terminal HTTP outcomes, pending recovery, and privacy boundaries match the contract. Unknown versions fail closed and are never coerced.

## 9. Frontend promotion and rollback

Promote the immutable Pages artifact only after staging health, migration, serializer/checker, browser/a11y/reference-lock, privacy, side-by-side, and all core/Specialist/disposition pending/HTTP probes pass. Frontend traffic promotion and persisted-write opening require separate owner approvals and timestamps.

Trigger rollback for any data loss or contract mismatch; two consecutive health failures; sustained `5xx > 1%` or submit latency above `2×` baseline for five minutes; unexpected duplicate/conflict behavior; privacy leakage; lost retry state/key; accepted-cleanup corruption; or screenshot/public-semantic failure.

Rollback procedure:

1. Stop promotion and record the incident, mode, last accepted ID, and evidence bundle.
2. Set the new route to `drain`; do not delete new rows or retained pending keys.
3. Restore the last-known-good Pages artifact and v1 Worker route using the reviewed rollback command in Section 2.
4. Confirm old health, old-route read/write behavior, old/new row/hash visibility, and all per-submission pending probes.
5. Keep new rows partitioned by route/cohort for analysis or quarantine; do not rewrite or merge them silently.
6. Obtain release/infra and research/data sign-off before any later retry of the cutover.

A rollback drill must be completed before promotion. The drill must prove post-rollback reads and writes, old active-tab submission, duplicate/conflict behavior, and preservation of every pending key without destructive D1 operations.

## 10. Synthetic purge and evidence closeout

Use only IDs from the staging synthetic-fixture manifest. Before purge, export the fixture IDs and payload hashes to the private evidence bundle and verify no fixture uses a real participant ID or production endpoint. Purge only those rows through authenticated, reviewed D1 access; do not run a blanket table delete and do not purge pending records until their explicit retention/deletion evidence is archived.

After purge, assert that every synthetic ID is absent, the staging schema/indexes remain intact, and no non-synthetic row changed. Record before/after counts, hashes, operator, timestamp, command/API reference, and owner approval. A failed or over-broad purge blocks closeout and requires incident handling.

Close the staging gate only when the evidence bundle contains the config/artifact hashes, dry-run output, health samples, migration snapshot/result, drain/open audit, side-by-side and HTTP/pending reports, privacy check, rollback drill, purge proof, and all required owner signatures. Staging evidence never authorizes production deployment by itself.

## 11. Final checklist

- [ ] Every required owner/resource/control field is populated and signed.
- [ ] No production IDs, routes, endpoints, secrets, credentials, or respondent records appear in staging config, build, logs, or evidence.
- [ ] Dry-run inspected isolated Worker/D1/rate-limit bindings only.
- [ ] Health is 200, safe metadata is exact, and write mode is explicitly audited.
- [ ] Additive migration preserved old rows and hashes; no destructive migration ran.
- [ ] Drain/open window, `Retry-After`, pending recovery, and separate persisted-write approval are recorded.
- [ ] Side-by-side old/new replay, browser/a11y/reference-lock, contract, privacy, and all HTTP/idempotency probes passed.
- [ ] Rollback drill restored old behavior while preserving new rows and pending keys.
- [ ] Synthetic staging rows were purged selectively and independently verified.
- [ ] Release/infra owner explicitly refuses production deployment until every gate above is complete.
