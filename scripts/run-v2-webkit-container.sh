#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
RUNTIME=${CONTAINER_RUNTIME:-podman}
IMAGE=${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.62.1-noble}

exec "$RUNTIME" run --rm --pull=missing --ipc=host \
  -v "$ROOT:/work:Z" \
  -w /work \
  "$IMAGE" \
  bash -lc 'npm ci --ignore-scripts && npm run v2:web:test:e2e -- --project=webkit --grep-invert "@visual"'
