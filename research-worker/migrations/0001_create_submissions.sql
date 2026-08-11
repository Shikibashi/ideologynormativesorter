CREATE TABLE IF NOT EXISTS submissions (
  submission_id TEXT PRIMARY KEY,
  record_type TEXT NOT NULL CHECK (record_type IN ('core', 'specialist', 'specialist-disposition')),
  participant_id TEXT NOT NULL,
  study_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  received_at TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL,
  payload_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS submissions_participant_id_idx
  ON submissions (participant_id);

CREATE INDEX IF NOT EXISTS submissions_received_at_idx
  ON submissions (received_at);
