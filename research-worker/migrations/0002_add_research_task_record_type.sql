-- W2 research-task records preserve response-process studies separately from
-- core and specialist records. Existing rows are copied unchanged.
ALTER TABLE submissions RENAME TO submissions_legacy;

CREATE TABLE submissions (
  submission_id TEXT PRIMARY KEY,
  record_type TEXT NOT NULL CHECK (record_type IN ('core', 'specialist', 'specialist-disposition', 'research-task')),
  participant_id TEXT NOT NULL,
  study_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  received_at TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL,
  payload_json TEXT NOT NULL
);

INSERT INTO submissions (
  submission_id,
  record_type,
  participant_id,
  study_id,
  schema_version,
  received_at,
  payload_sha256,
  payload_json
)
SELECT
  submission_id,
  record_type,
  participant_id,
  study_id,
  schema_version,
  received_at,
  payload_sha256,
  payload_json
FROM submissions_legacy;

DROP TABLE submissions_legacy;

CREATE INDEX submissions_participant_id_idx
  ON submissions (participant_id);

CREATE INDEX submissions_received_at_idx
  ON submissions (received_at);
