# Specialist commitment scoring migration

Status: draft implementation for issue #19.

Specialist modules remain research-only, explicitly activated, module-local diagnostic surfaces. This migration removes weighted target-vector distance as their scoring authority.

Before a specialist-local construct is used in a commitment criterion, the construct must have an explicit description and negative/positive poles that are consistent with its mapped specialist items. Generated labels alone are not sufficient.

The scorer must preserve module-local construct ownership, evidence accounting, explicit activation, constitutive gates, abstention on missing decisive evidence, deterministic within-module ranking, and the absence of any cross-module global ranking.

Specialist commitment relations use the same vocabulary as primary commitment scoring where appropriate: constitutive, core, characteristic, contested, compatible, peripheral, and incompatible. Core and characteristic relations may contribute to affinity; constitutive and incompatible relations govern eligibility; contested, compatible, and peripheral relations do not create geometric penalties.

Any legacy `targetValue` or requirement weights retained for compatibility must be non-authoritative. Mutation tests must prove that changing those legacy values cannot change specialist results.

Result copy should describe commitment affinity/support rather than Euclidean or RMS distance. The historical result contract may retain compatibility aliases only when they are explicitly documented as non-geometric.
