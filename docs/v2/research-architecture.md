# v2 Research Architecture

```text
v2 web result -> optional consent panel -> v2 research client projection
                                      -> HTTPS Worker validation
                                      -> D1 parent + normalized child rows
```

The research package consumes contracts and the generated content bundle only. The Worker consumes the generated structural acceptance registry. Neither imports the v1 runtime, the v1 research package, the scoring engine, result calculation, profile matching, modifier matching, or specialist scoring.

The client completes active item coverage explicitly. Omitted responses become `missing`; selected specialist modules are explicit. The Worker validates item ownership, response type, scale, statement option membership, version bindings, consent, origin, payload size, and duplicate-free coverage. It does not normalize or score responses.

The raw validated envelope is the authoritative record. D1 child tables are an atomic, queryable projection used for export and audits. The generated acceptance registry is validation metadata, not a second scoring model.

There is no v2 offline queue in Phase 13. A failed send leaves the result visible and permits a bounded retry of the same immutable envelope and submission ID.
