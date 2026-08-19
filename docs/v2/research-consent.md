# v2 Research Consent

Research is optional and occurs only after the result is available. The default production build presents no collection control. A test/local build may expose a control labelled `Review optional research consent`.

The consent copy must state that declining has no effect on the assessment or result, describe the raw response/version fields collected, state that no name, account, device fingerprint, or direct identity is collected, and explain the research purpose, retention boundary, and withdrawal limitation. The choices are `Decline research` and `I consent to optional research`; consent alone does not send data. A separate `Send research submission` action is required.

No consent means no network request. Declining means no network request. Importing an assessment, creating a private save, or opening a public share never sends research data. Withdrawal is honoured prospectively by disabling further sends; already accepted records are handled by the retention and export policy rather than silently rewritten.

The consent version and UTC timestamp are part of the signed-by-digest envelope. Consent is not inferred from a checkbox default, result rendering, navigation, or a previous local-storage value.
