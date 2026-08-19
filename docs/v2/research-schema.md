# v2 Research Schema

The root envelope is a strict object with these fields:

`researchSchemaVersion`, `researchProtocolVersion`, `consentVersion`, `submissionId`, `contentSchemaVersion`, `contentVersion`, `contentFingerprint`, `scoringVersion`, `responseSchemaVersion`, `resultSchemaVersion`, `consent`, and `responses`.

`consent` contains `granted: true`, `consentVersion`, `consentedAt`, `purpose: instrument-research`, and `identityLinkage: none`. `responses` contains `core`, `specialist`, and `requestedSpecialistModuleIds`.

Each response is one v2 response state. Answered Likert records carry the response type and integer value; answered statement-choice records carry the response type and explicit option ID. Confidence and priority are optional values from `{1,3,5}`. Non-answered states contain only `state` and `itemId`.

The generated acceptance registry contains active item IDs, response types, scale bounds, option IDs, specialist module membership, and version metadata. It deliberately omits prompts, construct mappings, contribution weights, polarity, profile data, labels, and diagnostics.
