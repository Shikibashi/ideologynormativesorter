# v2 Research Data Export

Exports must be generated from the validated parent envelope plus normalized child rows, never from browser state or result output. The normalized row shape is `submissionId`, `scope`, `itemId`, `state`, `responseType`, `rawValue`, `optionId`, `confidence`, and `priority`.

Before analysis, operators must remove or protect submission IDs, apply the approved access policy, retain version bindings, and preserve the consent version. Export does not add scoring. Replay into the v2 scoring kernel is a separate, offline operation using the stored content fingerprint and response schema; the Worker never performs it.
