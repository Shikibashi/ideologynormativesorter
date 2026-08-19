# v2 Public Share Schema

The current public share schema is `share-v2.phase12.1`. It is generated only
from an `AssessmentResult` by `projectPublicShare` and serialized with a
deterministic SHA-256 integrity field. The 64 KiB limit is enforced before
display/export.

The projection contains version metadata, tie-preserving primary matches,
active modifiers, scored specialist modules, and a compact evidence summary.
It excludes raw responses, item IDs, response choices, contribution traces,
diagnostics, session progress, local participant identifiers, and research
metadata. It does not contain enough information to replay or rescore an
assessment.
