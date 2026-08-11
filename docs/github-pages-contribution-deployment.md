# Enabling website contributions on GitHub Pages

## Why an endpoint is required

[GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages): it can publish this app's HTML, CSS, and JavaScript, but it cannot execute a request handler or privately store submitted records. Do not place a GitHub token, database secret, or service credential in Vite variables; every `VITE_*` value is shipped to the browser.

The production design is therefore:

1. GitHub Pages continues to host `ideologynormativesorter.edriffles.us`.
2. A Cloudflare Worker receives `POST /submit` requests.
3. A private D1 database stores the validated JSON records.
4. The public Pages build receives only the Worker's HTTPS URL through `RESEARCH_ENDPOINT`.

The Worker in `research-worker/` restricts browser requests to the production origin, validates the expected schema,
consent, complete Balanced (158-item) or Full-depth (336-item) profile and answer coverage, caps payload size, applies an
edge rate limit, and deduplicates retries by submission ID. It also accepts the explicitly configured 120-item matrix
form used by controlled research links. It does not expose a public read endpoint.

## Current production resources

- Worker: `political-judgment-contributions`
- Endpoint: `https://political-judgment-contributions.hiramurayuki.workers.dev/submit`
- Health route: `https://political-judgment-contributions.hiramurayuki.workers.dev/health`
- D1 database: `political-judgment-contributions` (`5681f1c3-960b-4872-b0ea-396a590d3708`)
- Region: ENAM

The Worker, schema, D1 binding, 20-request-per-minute rate limit, origin restriction, and live end-to-end persistence path were verified on 2026-08-10. The synthetic verification record was deleted and the database returned to zero rows. GitHub Pages collection is active with the repository URL as the public contact and a published 24-month retention period.

## One-time Cloudflare setup

Wrangler `4.120.1` is pinned as a project development dependency. Authenticate the local CLI before future account operations:

```bash
npx wrangler login
```

The production resource identifiers are tracked in `research-worker/wrangler.jsonc`; they are not credentials. No Cloudflare API token or other secret belongs in that file. To create a replacement database, start from `research-worker/wrangler.example.jsonc`, create the database, and insert its returned ID.

Validate, migrate, and deploy with the repository scripts:

```bash
npm run worker:check
npm run worker:migrate
npm run worker:deploy
```

Verify the read-only health route after each deployment:

```bash
curl https://political-judgment-contributions.hiramurayuki.workers.dev/health
```

The expected response is `{"ok":true}`. A custom API subdomain can be added later, but it is not required for collection.

## Activate the GitHub Pages frontend

The current public build settings are:

- contact: `https://github.com/Shikibashi/ideologynormativesorter`
- retention: `Contributions are retained for up to 24 months for question and label review, then deleted.`

These settings and the endpoint are repository variables, not secrets. To replace them, update the variables and redeploy:

```bash
gh variable set RESEARCH_ENDPOINT --body 'https://political-judgment-contributions.hiramurayuki.workers.dev/submit'
gh variable set RESEARCH_CONTACT --body 'YOUR PUBLIC CONTACT'
gh variable set RESEARCH_RETENTION_NOTICE --body 'YOUR RETENTION AND DELETION STATEMENT'
gh workflow run deploy.yml
```

After the Pages deployment succeeds, the home-page profile selector enables the optional contribution checkbox. The
consent screen states that the chosen profile doubles as the contribution, and accepted contributions receive a
submission receipt.

## Private access and operations

D1 is private to the Cloudflare account unless a read API is deliberately created. Review and export records through authenticated Wrangler/D1 commands or the Cloudflare dashboard. Store exports under `private-data/`, which is ignored by Git, and never commit respondent records.

Monitor Worker errors and HTTP 429 responses. If automated abuse appears despite the edge rate limit, add Cloudflare Turnstile; Cloudflare requires every Turnstile token to be validated by the server, so a client-only widget is not sufficient.

Cloudflare's current documentation covers [D1 Worker bindings](https://developers.cloudflare.com/d1/worker-api/d1-database/), [Worker rate-limit bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), and [server-side Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
