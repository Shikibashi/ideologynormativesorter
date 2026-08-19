# v2 Rollback Runbook

1. Stop the v2 release candidate or disable its isolated route/configuration.
2. Keep v1 routes, scoring, saves, and production research infrastructure unchanged.
3. Preserve the candidate receipt, content fingerprint, analysis fingerprint, logs, and test artifacts.
4. Do not replay v2 result-only or research records through v1.
5. Record the failed gate and open a reviewed fix; do not mutate canonical content or generated artifacts in place.

This runbook has not been exercised against production because Phase 15 performs no deployment or traffic switch.
