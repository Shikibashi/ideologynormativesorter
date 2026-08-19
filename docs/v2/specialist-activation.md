# v2 specialist activation

The approved activation strategy is `explicit-request`. A response cannot
silently activate a module. The authoritative module result records whether the
module was eligible, explicitly requested, activated, or not activated.

Phase 8 reports the activation rule ID, activation status, eligibility status,
request membership, and authoritative reason. It does not infer activation from
answered item counts or reconstruct module gates.
