---
name: deep-interview
description: Clarifies vague or high-risk coding requests before planning or code changes. Use when requirements, acceptance criteria, user flows, edge cases, API behavior, data contracts, migration details, or rollout constraints are underspecified.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Deep Interview

Use this skill before implementation when the request is ambiguous, cross-cutting, high-risk, or likely to sprawl. The objective is not to stall; it is to turn an underspecified request into a brief that can be implemented and verified.

## Operating rules

1. Inspect only the files, docs, schemas, routes, and tests needed to ask grounded questions.
2. Prefer solving ambiguity from the repository when the answer is already discoverable.
3. Ask the user only for decisions that cannot be safely inferred.
4. If the user is unavailable or the instruction says to proceed, make conservative assumptions and label them explicitly.
5. Do not mutate code while this skill is active unless the user explicitly asks for immediate changes.

## Interview checklist

Resolve these before handing off to planning:

- Goal: what user-visible or developer-visible outcome is required?
- Scope: which app, package, module, route, command, or workflow is in bounds?
- Non-goals: what should not be changed?
- Inputs and outputs: data contracts, request/response shapes, CLI args, events, files, state.
- UX behavior: loading states, empty states, error states, confirmation states, accessibility, copy.
- Failure modes: validation errors, network errors, permission errors, retries, partial success, rollback.
- Compatibility: browser/runtime versions, package constraints, migration concerns, feature flags.
- Acceptance criteria: concrete checks that prove the work is done.

## Output format

Return a compact resolved brief:

```markdown
## Resolved brief
Problem:
Scope:
Non-goals:
Assumptions:
Acceptance criteria:
Risks / unknowns:
Recommended next step:
```

If the next step is implementation planning, explicitly say to use `ralplan`. If the task is already trivial, produce the brief and proceed with normal execution.
