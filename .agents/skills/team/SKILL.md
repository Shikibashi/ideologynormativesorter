---
name: team
description: Coordinates parallel or role-separated coding work using subagents/workers when materially useful. Use for large tasks needing separate discovery, implementation, validation, review, or research streams.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Team

Use this skill only when role separation or parallelism materially improves quality or speed. Do not create coordination overhead for simple edits.

## When to use

Use team mode for:

- large refactors across multiple modules;
- bug hunts where reproduction, code search, and validation can run separately;
- migrations needing separate schema, app, and test review;
- tasks with independent frontend/backend/docs/test tracks;
- high-risk changes that need an explicit critic or validator.

Avoid team mode when:

- one file or one small function is involved;
- tasks are tightly coupled and parallel edits would conflict;
- the repository is too small to benefit;
- the user asked for a quick single-pass answer.

## Roles

Assign only the roles needed:

- Scout: read-only repository discovery and file map.
- Planner: converts findings into sequence and acceptance criteria.
- Implementer: bounded code edits for one workstream.
- Librarian: summarizes large files, diffs, logs, and docs without polluting main context.
- Critic: read-only review of plan or diff for missing cases.
- Validator: runs checks and reports pass/fail evidence.

## Coordination protocol

1. Define workstreams and ownership.
2. Keep each worker bounded: one goal, expected output, files in scope, and no broad mutation rights unless required.
3. Merge findings into the main thread before editing shared files.
4. Prefer isolated worktrees or separate branches if OMP exposes them and the task is risky.
5. Resolve conflicts in the main thread; do not let workers race on the same file.
6. End with a single validation report.

## Worker prompt template

```markdown
Role:
Goal:
Repo context:
Files in scope:
Do not touch:
Output required:
Validation/evidence required:
```
