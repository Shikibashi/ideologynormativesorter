# v2 Private Import and Export

Private export is an explicit user action and produces a JSON file named with
the `.v2-save.json` suffix. It is sensitive assessment data and must not be
described or treated as a public share.

Import performs size/JSON parsing, exact schema and dangerous-key checks,
SHA-256 verification, content/response/scoring freshness classification, and
public-engine `validateAssessmentInput` validation before state restore. An
incompatible content or response contract is rejected. Valid input with an
older scoring/content version is accepted for replay. An import failure leaves
the active assessment unchanged.
