from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

RELATIONS = {
    "constitutive",
    "core",
    "characteristic",
    "contested",
    "compatible",
    "peripheral",
    "incompatible",
}


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text)


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    if old not in text:
        raise SystemExit(f"expected anchor missing in {path}: {old[:160]!r}")
    write(path, text.replace(old, new, 1))


def replace_between(path: str, start: str, end: str, replacement: str) -> None:
    text = read(path)
    start_index = text.find(start)
    if start_index < 0:
        raise SystemExit(f"start marker missing in {path}: {start!r}")
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f"end marker missing in {path}: {end!r}")
    write(path, text[:start_index] + replacement + text[end_index:])


def criterion_from_gate(gate: dict) -> dict | None:
    operator = gate.get("operator")
    if operator == "minimum":
        return {"operator": "minimum", "minimum": gate["minimum"]}
    if operator == "maximum":
        return {"operator": "maximum", "maximum": gate["maximum"]}
    if operator == "interval":
        return {
            "operator": "interval",
            "minimum": gate["minimum"],
            "maximum": gate["maximum"],
        }
    return None


def categorical_commitment(requirement: dict, gates: list[dict], names: dict[str, str], prefix: str, index: int) -> dict:
    construct_id = str(requirement["constructId"])
    target = float(requirement["targetValue"])
    matching_gate = next(
        (
            gate
            for gate in gates
            if str(gate.get("constructId", "")) == construct_id
            and gate.get("operator") in {"minimum", "maximum", "interval"}
        ),
        None,
    )
    if matching_gate is not None:
        relation = "constitutive"
        criterion = criterion_from_gate(matching_gate)
        rationale = (
            f"Constitutive specialist criterion retained from the reviewed gate for {names.get(construct_id, construct_id)}; "
            "failure excludes the variant and missing evidence abstains."
        )
    elif target >= 0.6:
        relation = "core"
        criterion = {"operator": "minimum", "minimum": 0.3}
        rationale = (
            f"Core endorsement of {names.get(construct_id, construct_id)} in this module. "
            "The criterion is categorical and deliberately does not preserve the legacy centroid target magnitude."
        )
    elif target >= 0.2:
        relation = "characteristic"
        criterion = {"operator": "minimum", "minimum": 0.0}
        rationale = (
            f"Characteristic endorsement of {names.get(construct_id, construct_id)} in this module. "
            "The criterion records direction rather than distance to the retired target vector."
        )
    elif target <= -0.6:
        relation = "core"
        criterion = {"operator": "maximum", "maximum": -0.3}
        rationale = (
            f"Core rejection of {names.get(construct_id, construct_id)} in this module. "
            "The criterion is categorical and deliberately does not preserve the legacy centroid target magnitude."
        )
    elif target <= -0.2:
        relation = "characteristic"
        criterion = {"operator": "maximum", "maximum": 0.0}
        rationale = (
            f"Characteristic rejection of {names.get(construct_id, construct_id)} in this module. "
            "The criterion records direction rather than distance to the retired target vector."
        )
    else:
        relation = "characteristic"
        criterion = {"operator": "interval", "minimum": -0.25, "maximum": 0.25}
        rationale = (
            f"Characteristic non-extreme position on {names.get(construct_id, construct_id)} in this module. "
            "The interval is categorical and not a retained numeric ideology target."
        )
    result = {
        "id": f"{prefix}:commitment:{index + 1}",
        "constructId": construct_id,
        "relation": relation,
        "criterion": criterion,
        "weight": float(requirement.get("weight", 1)),
        "rationale": rationale,
    }
    if requirement.get("minimumAnsweredItems") is not None:
        result["minimumAnsweredItems"] = requirement["minimumAnsweredItems"]
    return result


def migrate_json_content() -> None:
    construct_path = ROOT / "v2/content/constructs/specialist.json"
    constructs = json.loads(construct_path.read_text())
    module_path = ROOT / "v2/content/specialists/modules.json"
    modules = json.loads(module_path.read_text())
    module_titles = {str(module["id"]): module["title"] for module in modules}
    names = {str(record["id"]): record["name"] for record in constructs}

    for record in constructs:
        module_id = str(record.get("moduleId", ""))
        label = record["name"]
        module_title = module_titles.get(module_id, module_id or "specialist module")
        record["description"] = (
            f"Research-only module-local construct measuring endorsement of {label} within {module_title}. "
            "It is an operational comparison dimension for this specialist module, not a global ideology axis."
        )
        record["poles"] = {
            "negative": f"rejects, opposes, or deprioritizes {label}",
            "positive": f"endorses or prioritizes {label}",
        }
        record["boundaryStatement"] = (
            f"Scoped to {module_title}; this construct alone cannot establish an ideology label outside its module."
        )
        lifecycle = record.setdefault("lifecycle", {})
        lifecycle["conceptualStatus"] = "provisional-defined"
        lifecycle["measurementStatus"] = "research-candidate"
        lifecycle["publicRoleStatus"] = "research-only"
    construct_path.write_text(json.dumps(constructs, indent=2, ensure_ascii=False) + "\n")

    for relative in [
        "v2/content/profiles/specialists.json",
        "v2/content/specialists/candidates.json",
    ]:
        path = ROOT / relative
        records = json.loads(path.read_text())
        migrated = 0
        for record in records:
            targets = record.get("variants") if relative.endswith("profiles/specialists.json") else None
            if targets is None:
                targets = [record]
            for target in targets:
                requirements = target.pop("requirements", None)
                if not requirements:
                    # Unscored catalog-only specialist records remain without commitments.
                    target.setdefault("commitments", [])
                    continue
                prefix = str(target.get("id", record.get("id", "specialist")))
                target["commitments"] = [
                    categorical_commitment(req, target.get("gates", []), names, prefix, index)
                    for index, req in enumerate(requirements)
                ]
                migrated += 1
            if relative.endswith("profiles/specialists.json"):
                # Top-level specialist requirements were compatibility placeholders and must stay empty.
                record["requirements"] = []
                record.setdefault("commitments", [])
        path.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
        print(f"{relative}: migrated {migrated} scored target records")


def patch_contracts() -> None:
    replace_once(
        "v2/packages/contracts/src/content.ts",
        "  description?: string;\n  sourceKey?: string;",
        "  description?: string;\n  poles?: { negative: string; positive: string };\n  boundaryStatement?: string;\n  sourceKey?: string;",
    )
    replace_once(
        "v2/packages/contracts/src/content.ts",
        "export interface ConstructRequirement {\n  constructId: ConstructId;\n  targetValue: number;\n  weight: number;\n  minimumAnsweredItems?: number;\n}\n",
        '''export interface ConstructRequirement {\n  constructId: ConstructId;\n  targetValue: number;\n  weight: number;\n  minimumAnsweredItems?: number;\n}\n\nexport const COMMITMENT_RELATIONS = [\n  "constitutive",\n  "core",\n  "characteristic",\n  "contested",\n  "compatible",\n  "peripheral",\n  "incompatible",\n] as const;\nexport type CommitmentRelation = (typeof COMMITMENT_RELATIONS)[number];\n\nexport type CommitmentCriterion =\n  | { operator: "minimum"; minimum: number }\n  | { operator: "maximum"; maximum: number }\n  | { operator: "interval"; minimum: number; maximum: number };\n\nexport interface SpecialistCommitmentRecord {\n  id: string;\n  constructId: ConstructId;\n  relation: CommitmentRelation;\n  criterion?: CommitmentCriterion;\n  weight?: number;\n  minimumAnsweredItems?: number;\n  rationale: string;\n}\n''',
    )
    replace_once(
        "v2/packages/contracts/src/content.ts",
        "  requirements: ConstructRequirement[];\n  gates: ConstitutiveGate[];\n  provenanceRefs?: string[];\n}\n\nexport interface SpecialistProfileRecord",
        "  commitments: SpecialistCommitmentRecord[];\n  gates: ConstitutiveGate[];\n  provenanceRefs?: string[];\n}\n\nexport interface SpecialistProfileRecord",
    )
    replace_once(
        "v2/packages/contracts/src/content.ts",
        "  moduleId?: SpecialistModuleId;\n  variants?: SpecialistVariantRecord[];\n}",
        "  moduleId?: SpecialistModuleId;\n  commitments?: SpecialistCommitmentRecord[];\n  variants?: SpecialistVariantRecord[];\n}",
    )
    replace_once(
        "v2/packages/contracts/src/content.ts",
        "  requirements: ConstructRequirement[];\n  gates: ConstitutiveGate[];\n  provenanceRefs?: string[];\n}\n\nexport interface SpecialistModuleRecord",
        "  commitments: SpecialistCommitmentRecord[];\n  gates: ConstitutiveGate[];\n  provenanceRefs?: string[];\n}\n\nexport interface SpecialistModuleRecord",
    )

    replace_once(
        "v2/packages/contracts/src/specialists.ts",
        "export interface SpecialistProfileConstructComparison {\n  readonly constructId: string;\n  readonly targetValue: number;",
        "export interface SpecialistProfileConstructComparison {\n  readonly commitmentId: string;\n  readonly constructId: string;\n  readonly relation: string;\n  readonly criterion?: Readonly<Record<string, unknown>>;\n  /** Deprecated compatibility field; commitment scoring never reads it. */\n  readonly targetValue?: number;",
    )
    replace_once(
        "v2/packages/contracts/src/specialists.ts",
        "  readonly weight: number;\n  readonly squaredError: number | null;\n  readonly weightedSquaredError: number | null;",
        "  readonly weight: number;\n  readonly commitmentSupport: number | null;\n  /** Deprecated compatibility fields; commitment scoring never populates them. */\n  readonly squaredError?: number | null;\n  readonly weightedSquaredError?: number | null;",
    )
    replace_once(
        "v2/packages/contracts/src/specialists.ts",
        "  readonly distance: number | null;\n  readonly similarity: number | null;",
        "  readonly affinity: number | null;\n  readonly support: number | null;\n  /** Deprecated aliases: distance = 1 - affinity, similarity = affinity. */\n  readonly distance: number | null;\n  readonly similarity: number | null;",
    )
    replace_once(
        "v2/packages/contracts/src/specialists.ts",
        "  readonly similarity: number;\n  readonly tieGroup: string | null;",
        "  readonly affinity: number;\n  /** Deprecated alias for affinity. */\n  readonly similarity: number;\n  readonly tieGroup: string | null;",
    )


def patch_schema_validation() -> None:
    replace_once(
        "v2/packages/content/src/validate-schema.ts",
        "  SpecialistCandidateRecord,\n  SpecialistModuleRecord,",
        "  SpecialistCandidateRecord,\n  SpecialistCommitmentRecord,\n  SpecialistModuleRecord,",
    )
    replace_once(
        "v2/packages/content/src/validate-schema.ts",
        "import { ONTOLOGY_RELATION_TYPES } from \"../../contracts/src/index\";",
        "import { COMMITMENT_RELATIONS, ONTOLOGY_RELATION_TYPES } from \"../../contracts/src/index\";",
    )
    replace_once(
        "v2/packages/content/src/validate-schema.ts",
        "  optionalString(record.description, `${path}.description`, issues);\n  optionalString(record.sourceKey, `${path}.sourceKey`, issues);",
        '''  optionalString(record.description, `${path}.description`, issues);\n  optionalString(record.boundaryStatement, `${path}.boundaryStatement`, issues);\n  if (record.scope === "specialist") {\n    requiredString(record.description, `${path}.description`, issues);\n    requiredString(record.boundaryStatement, `${path}.boundaryStatement`, issues);\n    if (!isObject(record.poles)) addIssue(issues, `${path}.poles`, "type", "Specialist construct requires explicit poles");\n    else {\n      requiredString(record.poles.negative, `${path}.poles.negative`, issues);\n      requiredString(record.poles.positive, `${path}.poles.positive`, issues);\n    }\n  }\n  optionalString(record.sourceKey, `${path}.sourceKey`, issues);''',
    )
    insert_anchor = "function validateProfileGates(\n"
    text = read("v2/packages/content/src/validate-schema.ts")
    idx = text.find(insert_anchor)
    if idx < 0:
        raise SystemExit("validateProfileGates anchor missing")
    commitment_validator = '''function validateCommitments(\n  values: unknown,\n  path: string,\n  issues: ValidationIssue[],\n): void {\n  const commitments = requiredArray(values, path, issues);\n  if (!commitments) return;\n  const ids = new Set<string>();\n  commitments.forEach((value, index) => {\n    const commitmentPath = `${path}[${index}]`;\n    if (!isObject(value)) {\n      addIssue(issues, commitmentPath, "type", "Expected commitment object");\n      return;\n    }\n    requiredString(value.id, `${commitmentPath}.id`, issues);\n    requiredString(value.constructId, `${commitmentPath}.constructId`, issues);\n    requiredString(value.rationale, `${commitmentPath}.rationale`, issues);\n    if (typeof value.id === "string") {\n      if (ids.has(value.id)) addIssue(issues, `${commitmentPath}.id`, "collision", "Duplicate commitment id");\n      ids.add(value.id);\n    }\n    if (!COMMITMENT_RELATIONS.includes(value.relation as SpecialistCommitmentRecord["relation"])) {\n      addIssue(issues, `${commitmentPath}.relation`, "value", "Unknown commitment relation");\n    }\n    optionalFiniteNumber(value.weight, `${commitmentPath}.weight`, issues);\n    optionalFiniteNumber(value.minimumAnsweredItems, `${commitmentPath}.minimumAnsweredItems`, issues);\n    if (isFiniteNumber(value.weight) && value.weight <= 0) addIssue(issues, `${commitmentPath}.weight`, "value", "Commitment weight must be positive");\n    const decisive = value.relation === "constitutive" || value.relation === "incompatible";\n    const affinityBearing = value.relation === "core" || value.relation === "characteristic";\n    if ((decisive || affinityBearing) && !isObject(value.criterion)) {\n      addIssue(issues, `${commitmentPath}.criterion`, "value", "Decisive/core/characteristic commitment requires a criterion");\n      return;\n    }\n    if (value.criterion !== undefined) {\n      if (!isObject(value.criterion)) {\n        addIssue(issues, `${commitmentPath}.criterion`, "type", "Expected criterion object");\n        return;\n      }\n      const operator = value.criterion.operator;\n      if (!["minimum", "maximum", "interval"].includes(String(operator))) {\n        addIssue(issues, `${commitmentPath}.criterion.operator`, "value", "Unknown criterion operator");\n      }\n      for (const key of ["minimum", "maximum"]) {\n        if (value.criterion[key] !== undefined && !isFiniteNumber(value.criterion[key])) {\n          addIssue(issues, `${commitmentPath}.criterion.${key}`, "value", `${key} must be finite`);\n        }\n      }\n    }\n  });\n}\n\n'''
    write("v2/packages/content/src/validate-schema.ts", text[:idx] + commitment_validator + text[idx:])
    replace_once(
        "v2/packages/content/src/validate-schema.ts",
        "  validateRequirements(record.requirements, `${path}.requirements`, issues);\n  validateProfileGates(record.gates, `${path}.gates`, issues);",
        "  validateCommitments(record.commitments, `${path}.commitments`, issues);\n  if (!record.commitments.length) addIssue(issues, `${path}.commitments`, \"value\", \"Scored specialist variant requires commitments\");\n  validateProfileGates(record.gates, `${path}.gates`, issues);",
    )
    replace_once(
        "v2/packages/content/src/validate-schema.ts",
        "  validateRequirements(record.requirements, `${path}.requirements`, issues);\n  validateProfileGates(record.gates, `${path}.gates`, issues);\n  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);\n}\n\nfunction validateModule",
        "  validateCommitments(record.commitments, `${path}.commitments`, issues);\n  if (!record.commitments.length) addIssue(issues, `${path}.commitments`, \"value\", \"Scored specialist candidate requires commitments\");\n  validateProfileGates(record.gates, `${path}.gates`, issues);\n  validateRefs(record.provenanceRefs, `${path}.provenanceRefs`, issues);\n}\n\nfunction validateModule",
    )


def patch_specialist_engine() -> None:
    replace_once(
        "v2/packages/engine/src/specialists/index.ts",
        "  ConstructRequirement,\n  SpecialistModuleRecord,",
        "  SpecialistCommitmentRecord,\n  SpecialistModuleRecord,",
    )
    replace_once(
        "v2/packages/engine/src/specialists/index.ts",
        "const SPECIALIST_MAX_DISTANCE = 2;\nconst SPECIALIST_TIE_TOLERANCE = 1e-12;",
        "const SPECIALIST_TIE_TOLERANCE = 1e-12;",
    )
    replace_between(
        "v2/packages/engine/src/specialists/index.ts",
        "function emptyProfileEvidence(\n",
        "function gateResult(\n",
        '''function commitmentWeight(commitment: SpecialistCommitmentRecord): number {\n  const explicit = commitment.weight ?? 1;\n  if (!finite(explicit) || explicit <= 0) return 0;\n  if (commitment.relation === "core") return explicit * 1.25;\n  if (commitment.relation === "characteristic") return explicit;\n  return 0;\n}\n\nfunction commitmentIsEvidenceBearing(commitment: SpecialistCommitmentRecord): boolean {\n  return commitment.relation === "constitutive" ||\n    commitment.relation === "incompatible" ||\n    commitment.relation === "core" ||\n    commitment.relation === "characteristic";\n}\n\nfunction criterionSatisfied(score: number, criterion: SpecialistCommitmentRecord["criterion"]): boolean {\n  if (!criterion) return true;\n  if (criterion.operator === "minimum") return score >= criterion.minimum;\n  if (criterion.operator === "maximum") return score <= criterion.maximum;\n  return score >= criterion.minimum && score <= criterion.maximum;\n}\n\nfunction criterionSupport(score: number, criterion: SpecialistCommitmentRecord["criterion"]): number {\n  if (!criterion) return 0;\n  if (criterion.operator === "minimum") {\n    const minimum = criterion.minimum;\n    if (score >= minimum) return minimum >= 1 ? 1 : 0.5 + 0.5 * ratio(score - minimum, 1 - minimum);\n    return minimum <= -1 ? 0 : 0.5 * ratio(score + 1, minimum + 1);\n  }\n  if (criterion.operator === "maximum") {\n    const maximum = criterion.maximum;\n    if (score <= maximum) return maximum <= -1 ? 1 : 0.5 + 0.5 * ratio(maximum - score, maximum + 1);\n    return maximum >= 1 ? 0 : 0.5 * ratio(1 - score, 1 - maximum);\n  }\n  if (score >= criterion.minimum && score <= criterion.maximum) return 1;\n  if (score < criterion.minimum) return ratio(score + 1, criterion.minimum + 1);\n  return ratio(1 - score, 1 - criterion.maximum);\n}\n\nfunction emptyProfileEvidence(\n  commitments: readonly SpecialistCommitmentRecord[],\n  minimumEvidenceRatio: number,\n): SpecialistProfileEvidence {\n  const evidenceBearing = commitments.filter(commitmentIsEvidenceBearing);\n  const totalWeight = evidenceBearing.reduce(\n    (sum, commitment) => sum + Math.max(commitmentWeight(commitment), commitment.relation === "constitutive" || commitment.relation === "incompatible" ? (commitment.weight ?? 1) : 0),\n    0,\n  );\n  return Object.freeze({\n    requiredConstructCount: evidenceBearing.length,\n    measuredRequiredConstructCount: 0,\n    unavailableRequiredConstructCount: evidenceBearing.length,\n    totalWeight,\n    measuredWeight: 0,\n    unavailableWeight: totalWeight,\n    comparisonCoverage: 0,\n    minimumEvidenceRatio,\n    meetsMinimumEvidence: false,\n    unavailableConstructIds: Object.freeze([...new Set(evidenceBearing.map((entry) => String(entry.constructId)))].sort()),\n  });\n}\n\n''',
    )
    replace_between(
        "v2/packages/engine/src/specialists/index.ts",
        "interface VariantTarget {\n",
        "function matchProfile(\n",
        '''interface VariantTarget {\n  readonly id: string;\n  readonly name: string;\n  readonly description: string;\n  readonly status: string;\n  readonly variant?: string;\n  readonly commitments: readonly SpecialistCommitmentRecord[];\n  readonly gates: readonly ConstitutiveGate[];\n}\n\nfunction profileTargets(\n  profile: SpecialistProfileRecord,\n): readonly VariantTarget[] {\n  const variants = profile.variants ?? [];\n  if (variants.length > 0) {\n    return variants.map((variant: SpecialistVariantRecord) => ({\n      id: String(variant.id),\n      name: variant.name,\n      description: variant.description,\n      status: variant.status,\n      ...(variant.variant === undefined ? {} : { variant: variant.variant }),\n      commitments: variant.commitments,\n      gates: variant.gates,\n    }));\n  }\n  return [\n    {\n      id: String(profile.id),\n      name: profile.name,\n      description: profile.rationale ?? profile.name,\n      status: profile.status ?? "active",\n      commitments: profile.commitments ?? [],\n      gates: profile.gates,\n    },\n  ];\n}\n\nfunction profileEvidence(\n  profile: SpecialistProfileRecord,\n  target: VariantTarget,\n  constructs: ReadonlyMap<string, ConstructResult>,\n  module: SpecialistModuleRecord,\n): {\n  readonly comparisons: readonly SpecialistProfileConstructComparison[];\n  readonly evidence: SpecialistProfileEvidence;\n  readonly gates: readonly SpecialistGateEvaluation[];\n  readonly gateStatus: "passed" | "failed" | "unavailable";\n  readonly affinity: number | null;\n  readonly support: number | null;\n  readonly distance: number | null;\n  readonly similarity: number | null;\n  readonly reason?: string;\n} {\n  const commitments = [...target.commitments].sort((left, right) => left.id.localeCompare(right.id));\n  const evidenceBearing = commitments.filter(commitmentIsEvidenceBearing);\n  const minimumEvidenceRatio = profile.minimumEvidenceRatio ?? module.activation.minimumConstructCoverageRatio;\n  const comparisons: SpecialistProfileConstructComparison[] = [];\n  const unavailableConstructIds: string[] = [];\n  let totalWeight = 0;\n  let measuredWeight = 0;\n  let affinityWeight = 0;\n  let affinityNumerator = 0;\n  let decisiveFailed = false;\n  let decisiveUnavailable = false;\n\n  for (const commitment of commitments) {\n    const constructId = String(commitment.constructId);\n    const evidenceWeight = commitmentIsEvidenceBearing(commitment)\n      ? Math.max(commitmentWeight(commitment), commitment.relation === "constitutive" || commitment.relation === "incompatible" ? (commitment.weight ?? 1) : 0)\n      : 0;\n    totalWeight += evidenceWeight;\n    const construct = constructs.get(constructId);\n    const unavailable = !construct || construct.status !== "scored" || !finite(construct.score) ||\n      (commitment.minimumAnsweredItems !== undefined && construct.evidence.answeredItemCount < commitment.minimumAnsweredItems);\n    if (unavailable) {\n      if (commitmentIsEvidenceBearing(commitment)) unavailableConstructIds.push(constructId);\n      if (commitment.relation === "constitutive" || commitment.relation === "incompatible") decisiveUnavailable = true;\n      comparisons.push({\n        commitmentId: commitment.id,\n        constructId,\n        relation: commitment.relation,\n        ...(commitment.criterion === undefined ? {} : { criterion: commitment.criterion as unknown as Readonly<Record<string, unknown>> }),\n        observedScore: construct?.score ?? null,\n        weight: evidenceWeight,\n        commitmentSupport: null,\n        included: false,\n        exclusionReason: commitment.minimumAnsweredItems !== undefined && construct ? "minimum_answered_items_not_met" : "construct_unavailable",\n      });\n      continue;\n    }\n\n    measuredWeight += evidenceWeight;\n    const criterion = commitment.criterion;\n    const satisfied = criterionSatisfied(construct.score, criterion);\n    const support = criterion === undefined ? null : criterionSupport(construct.score, criterion);\n    if (commitment.relation === "constitutive" && !satisfied) decisiveFailed = true;\n    if (commitment.relation === "incompatible" && satisfied) decisiveFailed = true;\n    const weight = commitmentWeight(commitment);\n    const affinityBearing = weight > 0 && support !== null;\n    if (affinityBearing) {\n      affinityWeight += weight;\n      affinityNumerator += weight * support;\n    }\n    comparisons.push({\n      commitmentId: commitment.id,\n      constructId,\n      relation: commitment.relation,\n      ...(criterion === undefined ? {} : { criterion: criterion as unknown as Readonly<Record<string, unknown>> }),\n      observedScore: construct.score,\n      weight,\n      commitmentSupport: support,\n      included: affinityBearing,\n      ...(affinityBearing ? {} : { exclusionReason: "non_affinity_relation" }),\n    });\n  }\n\n  const comparisonCoverage = ratio(measuredWeight, totalWeight);\n  const evidence = Object.freeze({\n    requiredConstructCount: evidenceBearing.length,\n    measuredRequiredConstructCount: evidenceBearing.length - unavailableConstructIds.length,\n    unavailableRequiredConstructCount: unavailableConstructIds.length,\n    totalWeight,\n    measuredWeight,\n    unavailableWeight: Math.max(0, totalWeight - measuredWeight),\n    comparisonCoverage,\n    minimumEvidenceRatio,\n    meetsMinimumEvidence: evidenceBearing.length > 0 && comparisonCoverage >= minimumEvidenceRatio,\n    unavailableConstructIds: Object.freeze([...new Set(unavailableConstructIds)].sort()),\n  });\n  const gateEvaluation = evaluateSpecialistGates(target.gates, constructs, evidence);\n\n  const abstain = (reason: string) => ({\n    comparisons: Object.freeze(comparisons),\n    evidence,\n    gates: gateEvaluation.evaluations,\n    gateStatus: gateEvaluation.status,\n    affinity: null,\n    support: null,\n    distance: null,\n    similarity: null,\n    reason,\n  });\n\n  if (affinityWeight <= 0) return abstain("no_comparable_constructs");\n  if (decisiveUnavailable) return abstain("decisive_commitment_unavailable");\n  if (!evidence.meetsMinimumEvidence) return abstain("insufficient_evidence");\n  if (decisiveFailed || gateEvaluation.status === "failed") return abstain("constitutive_gate_failed");\n  if (gateEvaluation.status === "unavailable") return abstain("constitutive_gate_unavailable");\n\n  const affinity = Math.max(0, Math.min(1, affinityNumerator / affinityWeight));\n  return {\n    comparisons: Object.freeze(comparisons),\n    evidence,\n    gates: gateEvaluation.evaluations,\n    gateStatus: gateEvaluation.status,\n    affinity,\n    support: affinity,\n    distance: 1 - affinity,\n    similarity: affinity,\n  };\n}\n\n''',
    )
    text = read("v2/packages/engine/src/specialists/index.ts")
    text = text.replace(
        "entry.evaluated.reason === undefined &&\n      entry.evaluated.similarity !== null,",
        "entry.evaluated.reason === undefined &&\n      entry.evaluated.affinity !== null,",
    )
    text = text.replace(
        "const leftSimilarity = left.evaluated.similarity ?? -1;\n    const rightSimilarity = right.evaluated.similarity ?? -1;\n    return (\n      rightSimilarity - leftSimilarity ||\n      (left.evaluated.distance ?? Number.POSITIVE_INFINITY) -\n        (right.evaluated.distance ?? Number.POSITIVE_INFINITY) ||",
        "const leftAffinity = left.evaluated.affinity ?? -1;\n    const rightAffinity = right.evaluated.affinity ?? -1;\n    return (\n      rightAffinity - leftAffinity ||",
    )
    text = text.replace("profile.requirements ?? [],", "profile.commitments ?? [],")
    text = text.replace(
        "      distance: null,\n      similarity: null,",
        "      affinity: null,\n      support: null,\n      distance: null,\n      similarity: null,",
        1,
    )
    text = text.replace(
        "    distance: reason === undefined ? evaluated.distance : null,\n    similarity: reason === undefined ? evaluated.similarity : null,",
        "    affinity: reason === undefined ? evaluated.affinity : null,\n    support: reason === undefined ? evaluated.support : null,\n    distance: reason === undefined ? evaluated.distance : null,\n    similarity: reason === undefined ? evaluated.similarity : null,",
    )
    text = text.replace(
        'profile.status === "scored" && profile.similarity !== null,',
        'profile.status === "scored" && profile.affinity !== null,',
    )
    text = text.replace(
        "(right.similarity ?? -1) - (left.similarity ?? -1)",
        "(right.affinity ?? -1) - (left.affinity ?? -1)",
    )
    text = text.replace("let lastSimilarity: number | undefined;", "let lastAffinity: number | undefined;")
    text = text.replace(
        "lastSimilarity === undefined ||\n      Math.abs((profile.similarity ?? 0) - lastSimilarity)",
        "lastAffinity === undefined ||\n      Math.abs((profile.affinity ?? 0) - lastAffinity)",
    )
    text = text.replace("lastSimilarity = profile.similarity ?? 0;", "lastAffinity = profile.affinity ?? 0;")
    text = text.replace(
        "Math.abs((candidate.similarity ?? 0) - (profile.similarity ?? 0))",
        "Math.abs((candidate.affinity ?? 0) - (profile.affinity ?? 0))",
    )
    text = text.replace(
        "        similarity: profile.similarity!,\n        tieGroup: position.tieGroup,",
        "        affinity: profile.affinity!,\n        similarity: profile.affinity!,\n        tieGroup: position.tieGroup,",
    )
    write("v2/packages/engine/src/specialists/index.ts", text)


def patch_tests() -> None:
    path = "tests/engine/v2-phase7-specialists.spec.ts"
    text = read(path)
    old = '''        requirements: [\n          { constructId: `${moduleId}:one`, targetValue: 1, weight: 1 },\n        ],'''
    new = '''        commitments: [\n          {\n            id: `${variantId}:commitment`,\n            constructId: `${moduleId}:one`,\n            relation: "core",\n            criterion: { operator: "minimum", minimum: 0.25 },\n            weight: 1,\n            rationale: "Synthetic specialist commitment",\n          },\n        ],'''
    if old not in text:
        raise SystemExit("synthetic specialist requirement anchor missing")
    text = text.replace(old, new, 1)
    insert = '''\n  it("does not let retained legacy target vectors affect specialist results", () => {\n    const bundle = syntheticBundle();\n    const legacyMutated = JSON.parse(JSON.stringify(bundle)) as CanonicalContentBundle;\n    for (const profile of legacyMutated.specialists) {\n      for (const requirement of profile.requirements ?? []) {\n        requirement.targetValue = requirement.targetValue > 0 ? -1 : 1;\n        requirement.weight = 999;\n      }\n    }\n    const input = {\n      requestedModuleIds: ["module:a"],\n      responses: [answered("a:one"), answered("a:two"), answered("a:three")],\n    };\n    const firstPrepared = prepareSpecialistAssessment(input, bundle);\n    const secondPrepared = prepareSpecialistAssessment(input, legacyMutated);\n    const first = scoreSpecialists(coreAssessment(bundle), firstPrepared, bundle);\n    const second = scoreSpecialists(coreAssessment(legacyMutated), secondPrepared, legacyMutated);\n    expect(second.modules).toEqual(first.modules);\n  });\n'''
    marker = '\n  it("covers the real canonical specialist corpus without cross-module ownership", () => {'
    if marker not in text:
        raise SystemExit("specialist test insertion marker missing")
    text = text.replace(marker, insert + marker, 1)
    write(path, text)


def main() -> None:
    migrate_json_content()
    patch_contracts()
    patch_schema_validation()
    patch_specialist_engine()
    patch_tests()
    print("specialist commitment migration applied")


if __name__ == "__main__":
    main()
