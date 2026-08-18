ALTER TABLE submissions ADD COLUMN canonical_manifest_version TEXT;
ALTER TABLE submissions ADD COLUMN canonical_manifest_fingerprint TEXT;
ALTER TABLE submissions ADD COLUMN serialization_version TEXT;
ALTER TABLE submissions ADD COLUMN contract_route TEXT;
ALTER TABLE submissions ADD COLUMN contract_cohort TEXT;

CREATE INDEX IF NOT EXISTS submissions_canonical_manifest_version_idx
  ON submissions (canonical_manifest_version);

CREATE INDEX IF NOT EXISTS submissions_canonical_manifest_fingerprint_idx
  ON submissions (canonical_manifest_fingerprint);

CREATE INDEX IF NOT EXISTS submissions_serialization_version_idx
  ON submissions (serialization_version);

CREATE INDEX IF NOT EXISTS submissions_contract_route_idx
  ON submissions (contract_route);

CREATE INDEX IF NOT EXISTS submissions_contract_cohort_idx
  ON submissions (contract_cohort);
