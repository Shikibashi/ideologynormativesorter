PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS research_submissions (
  submission_id TEXT PRIMARY KEY NOT NULL,
  research_schema_version TEXT NOT NULL,
  research_protocol_version TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  content_schema_version TEXT NOT NULL,
  content_version TEXT NOT NULL,
  content_fingerprint TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  response_schema_version TEXT NOT NULL,
  result_schema_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  payload_digest TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  UNIQUE (submission_id, payload_digest)
);

CREATE TABLE IF NOT EXISTS research_submission_responses (
  submission_id TEXT NOT NULL REFERENCES research_submissions(submission_id) ON DELETE RESTRICT,
  scope TEXT NOT NULL CHECK (scope IN ('core', 'specialist')),
  item_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('answered', 'missing', 'skipped', 'abstained', 'refused')),
  response_type TEXT,
  raw_value INTEGER,
  option_id TEXT,
  confidence INTEGER,
  priority INTEGER,
  PRIMARY KEY (submission_id, scope, item_id)
);

CREATE TABLE IF NOT EXISTS research_submission_modules (
  submission_id TEXT NOT NULL REFERENCES research_submissions(submission_id) ON DELETE RESTRICT,
  module_id TEXT NOT NULL,
  PRIMARY KEY (submission_id, module_id)
);

CREATE INDEX IF NOT EXISTS research_submissions_received_idx ON research_submissions(received_at);
CREATE INDEX IF NOT EXISTS research_submissions_fingerprint_idx ON research_submissions(content_fingerprint);
CREATE INDEX IF NOT EXISTS research_submission_responses_item_idx ON research_submission_responses(item_id, state);
