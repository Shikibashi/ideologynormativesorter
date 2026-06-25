---
name: ultraresearch
description: Performs exhaustive research with source comparison, primary-source preference, citations, and implementation relevance. Trigger when the user says ultraresearch/ulr or asks for best practices, current docs, package behavior, standards, or external technical facts.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Ultraresearch

Use this skill when correctness depends on facts outside the current model context or repository: current library docs, browser/platform behavior, API changes, security guidance, standards, pricing, release notes, or niche implementation details.

## Research rules

1. Prefer primary sources: official docs, specs, RFCs, release notes, source repositories, changelogs, and maintainer comments.
2. Use secondary sources only to triangulate or explain, not as the main authority.
3. Compare source dates and versions. Do not mix stale docs with current APIs without saying so.
4. Cite every non-trivial factual claim with enough detail for the user to verify it.
5. Distinguish facts from inference.
6. For package/library questions, identify the installed version in the repository when possible before using external docs.
7. For security-sensitive guidance, prefer vendor/security advisories and current CVE/advisory databases.

## Output format

```markdown
## Research answer
Finding:
Sources checked:
Current version / date sensitivity:
Recommendation:
Implementation implications:
Uncertainties:
```

If the agent lacks web access, use local docs, lockfiles, package metadata, README files, source comments, and installed package types. State that web verification was unavailable.
