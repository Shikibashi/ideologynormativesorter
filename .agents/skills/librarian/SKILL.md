---
name: librarian
description: Summarizes large files, diffs, logs, docs, dependency changelogs, and search results into concise implementation-relevant notes. Use to preserve main-context focus during broad codebase reading.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Librarian

Use this skill when the agent needs to read a large amount of material without dragging all details into the main reasoning context.

## What to summarize

- Large source files.
- Git diffs and PR patches.
- Test logs, build logs, stack traces.
- Dependency changelogs or migration guides.
- Architecture docs and ADRs.
- Search result clusters.

## Summary requirements

For each artifact, extract:

- path or source identifier;
- purpose of the artifact;
- public interfaces, exported symbols, routes, schemas, commands, or components;
- invariants and assumptions;
- dependencies and side effects;
- test coverage and known gaps;
- lines/sections relevant to the current task;
- risks for modification.

## Output format

```markdown
## Librarian notes
Artifact:
Why it matters:
Key interfaces:
Relevant details:
Risks:
Recommended next read:
```

Keep summaries dense. Do not paste huge blocks unless exact text is required.
