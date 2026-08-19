# v2 `scoreAssessment()` API

The supported end-to-end engine entrypoint is:

```ts
scoreAssessment(input: AssessmentInput, bundle: CanonicalContentBundle): AssessmentResult
```

`AssessmentInput` contains the response schema version, the canonical content
fingerprint, core responses, optional specialist responses, and an explicit
`requestedSpecialistModuleIds` array. An empty module array means no specialist
module is activated. Specialist responses are never routed by browser state.

Execution order is fixed:

1. validate content, versions, fingerprint, input shape, and response routing;
2. normalize core responses and create explicit contributions;
3. aggregate root constructs;
4. match primary profiles;
5. match modifiers;
6. prepare and score explicitly requested specialist modules;
7. build downstream diagnostics;
8. assemble and semantically validate the immutable result.

Lower-level functions remain available as advanced/testable primitives. Normal
consumers must not compose those primitives to create alternate result paths.
There are no semantic options, timestamps, random IDs, network reads, or UI
scorers.
