# v2 Research Performance

The performance receipt is generated from the real v2 acceptance registry and a maximum-coverage research envelope. The payload limit is 131072 bytes. Browser collection is one bounded request after consent; transient failures retry at most twice after the initial attempt, with the same immutable payload.

The Worker validates in memory, computes one payload digest, and executes one atomic D1 batch. No scoring, result calculation, external API, or read-after-write result path is included. Measured bytes and timings are recorded by `v2/tools/measure-research-performance.mjs` and must remain attached to the current content fingerprint.
