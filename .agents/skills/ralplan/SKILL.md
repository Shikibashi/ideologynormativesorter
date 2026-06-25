---
name: ralplan
description: Builds and critiques an implementation plan before code mutation. Use for non-trivial features, refactors, migrations, bug fixes with unclear blast radius, or when the user asks for a plan/review before edits.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# RALPlan

Use this skill to create a read-analyze-list-plan-review plan before modifying code. The plan must be grounded in repository evidence and must include validation.

## Workflow

1. Read: inspect relevant source, tests, config, package scripts, schemas, and docs. Avoid broad context loading unless needed.
2. Analyze: identify architecture boundaries, existing patterns, dependencies, and likely failure modes.
3. List: enumerate files likely to change and files likely to be used only for reference.
4. Plan: sequence the implementation into small, reversible steps.
5. Critique: attack the plan before executing it. Look for missing tests, broken APIs, migration risks, data loss, race conditions, accessibility regressions, duplicate logic, and overfitting.
6. Revise: update the plan after critique.
7. Verify: define exact commands or manual checks that will prove correctness.

## Plan quality gates

A usable plan must include:

- File map: read-only references vs intended mutation targets.
- Step order: implementation sequence with dependency ordering.
- Acceptance criteria: testable, not vibes.
- Validation commands: typecheck, lint, unit tests, integration tests, smoke checks, or explicit reason unavailable.
- Rollback or containment: especially for migrations, auth, payments, infra, data writes, or destructive operations.

## Output format

```markdown
## Implementation plan
Context found:
Files to inspect/use:
Files likely to change:
Steps:
Plan critique:
Revised plan:
Validation:
Proceed criteria:
```

Do not start edits until the plan is internally consistent. If the user already approved implementation, continue into `ultragoal` or `ultrawork` after producing the revised plan.
