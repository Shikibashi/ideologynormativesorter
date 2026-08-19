# v2 Phase 9 performance baseline

The baseline is measured by the Phase 9 full-corpus test harness rather than by
the browser or persistence layers. It covers a complete core assessment, an
incomplete core assessment, and one explicitly activated specialist module.

The canonical result intentionally excludes raw responses and the content
bundle. Its size is therefore a measurement-output size, not a questionnaire
transport size. The exact byte-stable serialized result is recorded by the
deterministic serialization tests and should be refreshed whenever a result
schema version changes.

Baseline run on 2026-08-19 using the generated canonical bundle:

| Scenario | Score time | Serialized result |
| --- | ---: | ---: |
| Complete core | 121.592 ms | 1,044,587 bytes |
| Complete core plus one specialist module | 85.051 ms | 1,105,056 bytes |
| Insufficient core evidence | 84.237 ms | 866,867 bytes |

The content bundle was 1,094,250 bytes. These are a baseline for regression
detection, not release-performance claims.

Phase 9 does not introduce a fast scorer or parallel semantic path. Future
performance work must optimize this same pipeline and preserve its output.
