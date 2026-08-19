# v2 Private Save Schema

The current private save schema is `save-v2.phase12.1`. A save contains the
envelope kind, content/response/scoring version bindings, a session stage and
explicit presentation cursor, the exact v2 `AssessmentInput`, an optional
cached result, and a SHA-256 digest over the canonical envelope without
`integrity`.

Objects are canonicalized with sorted keys, arrays retain semantic order, and
non-finite numbers and dangerous object keys are rejected. Private saves are
limited to 2 MiB. A checksum detects accidental corruption; it does not prove
authorship, confidentiality, or resistance to tampering by a holder of the
file.

The parser reports missing, loaded, and corrupted states. Malformed data is
not silently deleted. Users must explicitly clear a saved assessment.
