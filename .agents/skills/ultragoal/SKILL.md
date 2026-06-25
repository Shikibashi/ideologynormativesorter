---
name: ultragoal
description: Tracks multi-step coding work through goals, execution, revision, validation, and evidence. Use for complex tasks where progress can drift or when the user asks to finish everything with proof.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Ultragoal

Use this skill when the task needs explicit goal tracking. The point is to prevent half-implementation, forgotten validation, and unproven claims.

## Goal ledger

Create a goal ledger before implementation:

```markdown
## Goal ledger
| ID | Goal | Status | Evidence |
|---|---|---|---|
| G1 | ... | pending | |
```

Statuses: `pending`, `active`, `blocked`, `done`, `cut`.

## Execution rules

1. Convert the approved plan into goals with clear completion criteria.
2. Work one goal at a time unless tasks are safely independent.
3. Update the ledger whenever a goal changes state.
4. Record evidence for every `done` goal: files changed, tests run, outputs observed, screenshots if relevant, or explicit inspection notes.
5. Do not mark a goal `done` based only on intent.
6. If validation fails, revise the goal or add a follow-up goal instead of hand-waving.
7. If the task cannot be completed, report the exact blocker and the smallest useful partial state.

## Definition of done

A task is done only when:

- all required goals are `done` or explicitly `cut` with reason;
- implementation matches the acceptance criteria;
- validation has been run or the inability to run it is explained;
- remaining risks are disclosed.

## Final report

```markdown
## Completion report
Summary:
Goals completed:
Files changed:
Validation run:
Known limitations / risks:
Follow-up needed:
```
