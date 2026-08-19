# v2 Research Worker

The Worker exposes `GET /health`, `OPTIONS /submit`, and `POST /submit`. `/submit` requires JSON, an exact configured origin, the current protocol/content versions, explicit consent, complete active-item coverage, valid response values, and a non-production write flag. Errors return generic response bodies and never echo the submitted payload.

Production writes are hard-disabled when `DEPLOYMENT_ENVIRONMENT=production`, even if another variable is accidentally set. The checked-in v2 Wrangler configuration is local-only and contains a placeholder D1 ID. No deployment or production route is changed by Phase 13.

The Worker is a validation and persistence boundary. It must not import or implement scoring. It does not trust client result fields because result fields are not accepted by the schema.
