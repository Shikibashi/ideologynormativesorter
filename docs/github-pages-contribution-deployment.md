# Enabling website contributions on GitHub Pages

## Why an endpoint is required

[GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages): it can publish this app's HTML, CSS, and JavaScript, but it cannot execute a request handler or privately store submitted records. Do not place a GitHub token, database secret, or service credential in Vite variables; every `VITE_*` value is shipped to the browser.

The production design is therefore:

1. GitHub Pages continues to host `ideologynormativesorter.edriffles.us`.
2. A Cloudflare Worker receives `POST /submit` requests.
3. A private D1 database stores the validated JSON records.
4. The public Pages build receives only the Worker's HTTPS URL through `RESEARCH_ENDPOINT`.

The Worker in `research-worker/` restricts browser requests to the production origin, validates the expected schema, consent, 120-item core form and answer coverage, caps payload size, applies an edge rate limit, and deduplicates retries by submission ID. It does not expose a public read endpoint.

## One-time Cloudflare setup

Cloudflare recommends a project-local Wrangler CLI. These commands pin the version reviewed for this setup:

```bash
npx wrangler@4.120.1 login
npx wrangler@4.120.1 d1 create political-judgment-contributions
```

Copy the example configuration and replace `REPLACE_WITH_D1_DATABASE_ID` with the database ID returned by `d1 create`:

```bash
cp research-worker/wrangler.example.jsonc research-worker/wrangler.jsonc
```

The D1 database ID identifies a resource but is not a secret. The configuration can be committed after it contains the real ID. Do not add Cloudflare API tokens or other credentials to the file.

Create the production table and deploy the Worker:

```bash
npx wrangler@4.120.1 d1 migrations apply political-judgment-contributions --remote --config research-worker/wrangler.jsonc
npx wrangler@4.120.1 deploy --config research-worker/wrangler.jsonc
```

Wrangler prints a `workers.dev` URL. Verify the read-only health route:

```bash
curl https://YOUR-WORKER.workers.dev/health
```

The expected response is `{"ok":true}`. A custom API subdomain can be added later, but it is not required for collection.

## Activate the GitHub Pages frontend

Choose and publish a real site-owner contact and retention statement before enabling collection. Then configure the repository variables; these are public build settings, not secrets:

```bash
gh variable set RESEARCH_ENDPOINT --body 'https://YOUR-WORKER.workers.dev/submit'
gh variable set RESEARCH_CONTACT --body 'YOUR PUBLIC CONTACT'
gh variable set RESEARCH_RETENTION_NOTICE --body 'YOUR RETENTION AND DELETION STATEMENT'
gh workflow run deploy.yml
```

After the Pages deployment succeeds, the home-page invitation changes from unavailable status to the `Contribute responses` link. The consent screen will state that records are transmitted, and accepted contributions will receive a submission receipt.

## Private access and operations

D1 is private to the Cloudflare account unless a read API is deliberately created. Review and export records through authenticated Wrangler/D1 commands or the Cloudflare dashboard. Store exports under `private-data/`, which is ignored by Git, and never commit respondent records.

Monitor Worker errors and HTTP 429 responses. If automated abuse appears despite the edge rate limit, add Cloudflare Turnstile; Cloudflare requires every Turnstile token to be validated by the server, so a client-only widget is not sufficient.

Cloudflare's current documentation covers [D1 Worker bindings](https://developers.cloudflare.com/d1/worker-api/d1-database/), [Worker rate-limit bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), and [server-side Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
