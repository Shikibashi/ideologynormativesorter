import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest, validateEnvelope } from "../src/worker.mjs";
import registry from "../generated/acceptance-registry.json" with { type: "json" };

function envelope(id = "rs_00000000-0000-4000-8000-000000000001") {
  const missing = (item) => ({ state: "missing", itemId: item.id });
  return {
    researchSchemaVersion: registry.researchSchemaVersion,
    researchProtocolVersion: registry.researchProtocolVersion,
    consentVersion: registry.consentVersion,
    submissionId: id,
    ...registry.metadata,
    consent: { granted: true, consentVersion: registry.consentVersion, consentedAt: "2026-08-19T12:00:00.000Z", purpose: "instrument-research", identityLinkage: "none" },
    responses: { core: registry.items.filter((item) => item.role === "core").map(missing), specialist: [], requestedSpecialistModuleIds: [] },
  };
}

class FakeStatement {
  constructor(db, sql) { this.db = db; this.sql = sql; }
  bind(...args) { this.args = args; return this; }
  async first() { return this.db.first(this.sql, this.args); }
}
class FakeDb {
  constructor() { this.parents = new Map(); this.children = []; }
  prepare(sql) { return new FakeStatement(this, sql); }
  first(sql, args) { if (sql.startsWith("SELECT payload_digest")) { const digest = this.parents.get(args[0]); return digest ? { payload_digest: digest } : null; } return null; }
  async batch(statements) {
    const parent = statements[0];
    const id = parent.args[0];
    if (this.parents.has(id)) throw new Error("UNIQUE");
    this.parents.set(id, parent.args[12]);
    this.children.push(...statements.slice(1));
    return statements.map(() => ({ success: true }));
  }
}

const env = (db, overrides = {}) => ({ RESEARCH_DB: db, DEPLOYMENT_ENVIRONMENT: "local", RESEARCH_WRITES_ENABLED: "true", RESEARCH_ALLOWED_ORIGINS: "http://127.0.0.1:4174", ...overrides });
const request = (payload, init = {}) => new Request("https://research.local/submit", { method: "POST", headers: { Origin: "http://127.0.0.1:4174", "Content-Type": "application/json", ...init.headers }, body: JSON.stringify(payload), ...init });

test("validates the real v2 registry and accepts a local submission", async () => {
  const payload = envelope();
  assert.equal(validateEnvelope(payload).ok, true);
  const db = new FakeDb();
  const response = await handleRequest(request(payload), env(db));
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: true, deduplicated: false, submissionId: payload.submissionId });
  assert.equal(db.parents.size, 1);
  assert.equal(db.children.length, 338);
});

test("deduplicates the same payload and rejects a same-id payload collision", async () => {
  const db = new FakeDb();
  const payload = envelope();
  const first = await handleRequest(request(payload), env(db));
  const second = await handleRequest(request(payload), env(db));
  assert.equal(first.status, 202);
  assert.deepEqual(await second.json(), { accepted: true, deduplicated: true, submissionId: payload.submissionId });
  const changed = structuredClone(payload);
  changed.consent.consentedAt = "2026-08-19T12:00:01.000Z";
  const collision = await handleRequest(request(changed), env(db));
  assert.equal(collision.status, 409);
  assert.deepEqual(await collision.json(), { accepted: false, conflict: true, submissionId: payload.submissionId });
});

test("rejects malformed, cross-scope, wrong-version, origin, and production-write requests", async () => {
  const db = new FakeDb();
  const payload = envelope();
  const malformed = structuredClone(payload);
  malformed.responses.core[0].extra = true;
  assert.equal((await handleRequest(request(malformed), env(db))).status, 400);
  const wrongVersion = structuredClone(payload);
  wrongVersion.contentFingerprint = "wrong";
  assert.equal((await handleRequest(request(wrongVersion), env(db))).status, 400);
  const wrongOrigin = await handleRequest(request(payload, { headers: { Origin: "https://evil.invalid" } }), env(db));
  assert.equal(wrongOrigin.status, 403);
  const production = await handleRequest(request(payload), env(db, { DEPLOYMENT_ENVIRONMENT: "production" }));
  assert.equal(production.status, 503);
  const noJson = await handleRequest(new Request("https://research.local/submit", { method: "POST", headers: { Origin: "http://127.0.0.1:4174" }, body: "{}" }), env(db));
  assert.equal(noJson.status, 415);
  const tooLarge = new Request("https://research.local/submit", { method: "POST", headers: { Origin: "http://127.0.0.1:4174", "Content-Type": "application/json" }, body: "x".repeat(registry.maxPayloadBytes + 1) });
  assert.equal((await handleRequest(tooLarge, env(db))).status, 413);
});

test("requires an explicit valid statement-choice option", () => {
  const payload = envelope();
  const item = registry.items.find((candidate) => candidate.role === "core" && candidate.responseType === "statement-choice");
  assert.ok(item);
  const response = payload.responses.core.find((candidate) => candidate.itemId === item.id);
  assert.ok(response);
  response.state = "answered";
  response.responseType = "statement-choice";
  response.optionId = item.optionIds[0];
  assert.equal(validateEnvelope(payload).ok, true);
  response.optionId = "not-an-option";
  assert.equal(validateEnvelope(payload).ok, false);
});
