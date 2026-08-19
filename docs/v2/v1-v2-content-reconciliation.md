# v1/v2 content reconciliation

Generated from the approved v1 canonical manifest and the compiled v2 bundle. The v2 runtime has no dependency on this comparison.

## Result

- v1 source artifact: research-worker/generated/canonical-manifest.json#manifest
- v2 content version: ideology-registry-2026-08-clean-v1-v2
- v2 fingerprint: 333b1d17ae0f162ed2629e1c839f8fe42190f29451a009911b1d8b44ac7731d6
- Active v1 item IDs: 406
- v2 active item IDs: 406
- MUST_PRESERVE mismatches: 0
- Unexplained scoring-relevant differences: 0

## Compared fields

| Surface | Comparison |
| --- | --- |
| IDs | Active core/specialist item IDs, primary profile IDs, modifier IDs, ontology relation IDs |
| Wording | Final prompt text for every active scored item |
| Activity | Active roster membership and v2 active status |
| Response types | likert7 and statementChoice to v2 response discriminants |
| Mappings | Signed root/local weights and every statement option mapping |
| Reverse scoring | Explicit v1/v2 boolean equality |
| Primary profiles | Centroid targets and required evidence constructs |
| Modifiers | Indicator item IDs and directions |
| Specialist membership | Item module ownership |
| Ontology | Relation IDs and endpoints |

## Intentional changes

- statement-choice mapping ownership is explicit at option level
- specialist-local construct IDs are namespaced by module
- primary evidence requirements are materialized as typed gates
- modifier indicators use itemId and explicit neutral unit weight
- specialist candidates and assignment metadata are first-class records
- v2 serializes signed weights as magnitude plus polarity

## Difference classification

| Category | Count | Details |
| --- | ---: | --- |
| none | 0 | none |
| INTENTIONAL_CHANGE | 6 | Explicitly documented representation changes above. |
| KNOWN_DEFECT removal | 1 | Older specialist overlay excluded in favor of the approved 9-module canonical export. |
| Non-scoring metadata | 0 | Wording, citations, lifecycle, and explanatory metadata remain attached or normalized without scoring drift. |

No scoring-relevant differences were found after explicit field normalization.
