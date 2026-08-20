from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "v2/packages/content/src/validate-semantics.ts"
text = PATH.read_text()

old_candidate = '''  for (const [index, requirement] of candidate.requirements.entries()) {
    const construct = constructMap.get(requirement.constructId);
    if (!construct)
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].requirements[${index}].constructId`,
        "ref",
        `Unknown construct ${requirement.constructId}`,
      );
    else if (
      construct.scope !== "specialist" ||
      construct.moduleId !== candidate.moduleId
    )
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].requirements[${index}].constructId`,
        "scope",
        "Candidate requirement is outside its module scope",
      );
  }
'''
new_candidate = '''  for (const [index, commitment] of candidate.commitments.entries()) {
    const construct = constructMap.get(commitment.constructId);
    if (!construct)
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].commitments[${index}].constructId`,
        "ref",
        `Unknown construct ${commitment.constructId}`,
      );
    else if (
      construct.scope !== "specialist" ||
      construct.moduleId !== candidate.moduleId
    )
      addIssue(
        issues,
        `specialistCandidates[${candidate.id}].commitments[${index}].constructId`,
        "scope",
        "Candidate commitment is outside its module scope",
      );
  }
'''
if old_candidate not in text:
    raise SystemExit("candidate requirement semantic block not found")
text = text.replace(old_candidate, new_candidate, 1)

old_variant = '''  for (const [index, variant] of (profile.variants ?? []).entries()) {
    for (const [
      requirementIndex,
      requirement,
    ] of variant.requirements.entries()) {
      const construct = constructMap.get(requirement.constructId);
      if (!construct)
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].requirements[${requirementIndex}]`,
          "ref",
          "Unknown variant construct",
        );
      else if (
        construct.scope !== "specialist" ||
        construct.moduleId !== profile.moduleId
      )
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].requirements[${requirementIndex}]`,
          "scope",
          "Variant construct is outside profile module",
        );
    }
'''
new_variant = '''  for (const [index, variant] of (profile.variants ?? []).entries()) {
    for (const [commitmentIndex, commitment] of variant.commitments.entries()) {
      const construct = constructMap.get(commitment.constructId);
      if (!construct)
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].commitments[${commitmentIndex}]`,
          "ref",
          "Unknown variant commitment construct",
        );
      else if (
        construct.scope !== "specialist" ||
        construct.moduleId !== profile.moduleId
      )
        addIssue(
          issues,
          `specialists[${profile.id}].variants[${index}].commitments[${commitmentIndex}]`,
          "scope",
          "Variant commitment construct is outside profile module",
        );
    }
'''
if old_variant not in text:
    raise SystemExit("variant requirement semantic block not found")
text = text.replace(old_variant, new_variant, 1)

old_coverage = '''  for (const candidate of bundle.specialistCandidates)
    for (const requirement of candidate.requirements)
      constructCoverage.add(requirement.constructId);
'''
new_coverage = '''  for (const candidate of bundle.specialistCandidates)
    for (const commitment of candidate.commitments)
      constructCoverage.add(commitment.constructId);
'''
if old_coverage not in text:
    raise SystemExit("candidate coverage requirement block not found")
text = text.replace(old_coverage, new_coverage, 1)

PATH.write_text(text)
print("specialist semantic validation migrated")
