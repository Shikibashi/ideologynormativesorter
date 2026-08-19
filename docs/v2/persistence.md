# v2 Persistence Boundary

Phase 12 adds versioned, local-only persistence without changing the scoring
kernel. The persistence package at `v2/packages/persistence/src` owns save
envelopes, integrity checks, storage adapters, explicit import/export, public
share projection, and legacy-format classification.

The browser uses the versioned key
`ideology-sorter:v2:saves:current` through an injected `Storage` adapter. It
does not read, overwrite, or delete v1 keys. There is no cloud sync, research
submission, participant identity collection, or database persistence in this
phase.

Resume validates the saved `AssessmentInput` through the public engine facade.
An exact save may resume at its saved session stage. A scoring/content-version
change keeps the input but requires replay. A content-fingerprint or response
contract change is incompatible. A cached result is diagnostic convenience
only and is never the source of a displayed result.

The canonical flow is:

`state -> private save envelope -> storage/export`

`private import -> schema/integrity/freshness -> engine input validation -> state`

`AssessmentResult -> explicit public projection -> share serialization`

The generated runtime content bundle remains authoritative for content and is
not patched by persistence code.
