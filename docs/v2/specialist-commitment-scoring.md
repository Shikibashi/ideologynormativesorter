# Specialist commitment scoring migration

Status: implemented on the issue #19 branch; pending final full-suite PR verification before merge.

Specialist modules remain research-only, explicitly activated, module-local diagnostic surfaces. This migration removes weighted target-vector distance as their scoring authority.

Before a specialist-local construct is used in a commitment criterion, the construct must have an explicit description, negative/positive poles, and a module boundary statement consistent with its mapped specialist items. Generated labels alone are not sufficient.

The scorer preserves module-local construct ownership, evidence accounting, explicit activation, constitutive gates, abstention on missing decisive evidence, deterministic within-module ranking, and the absence of any cross-module global ranking.

Specialist commitment relations use the same vocabulary as primary commitment scoring where appropriate: constitutive, core, characteristic, contested, compatible, peripheral, and incompatible. Core and characteristic relations may contribute to affinity; constitutive and incompatible relations govern eligibility; contested, compatible, and peripheral relations do not create geometric penalties.

Legacy `targetValue` vectors are no longer the specialist scoring authority. The committed mutation test proves specialist results are unchanged when retained legacy target values are altered. Compatibility result fields may remain only as documented aliases: `similarity` aliases commitment affinity and `distance` aliases `1 - affinity`; neither is a geometric distance calculation.

The canonical bundle and Phase 9/10 frozen reference artifacts were regenerated after the migration. Their current v2 content fingerprint is `38dfece4db8d2265f77ec7c204dc23f3f23aa187bd7d29481d9ff58f03bb0e05`.

This migration does not establish empirical validity or promote specialist labels to ordinary production outcomes. Expert content review, cognitive interviewing, pilot/retest evidence, known-groups or criterion evidence, and DIF/invariance work remain separate release requirements.
