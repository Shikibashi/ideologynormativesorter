# v2 legacy independence

The v2 runtime and its tests, except for explicitly isolated v1 differential
fixtures, have no imports from v1 runtime implementation paths. The Phase 9
architecture test scans the v2 package source for imports from `src/data`,
`src/domain`, `src/scoring`, `src/production`, `src/specialist`,
`src/validation`, and `src/research`.

The v1 reference oracle remains a permitted audit boundary only. It is not
reachable from `scoreAssessment()`, content compilation, result validation, or
result serialization. Removing v1 runtime files would therefore not alter the
v2 dependency graph.
