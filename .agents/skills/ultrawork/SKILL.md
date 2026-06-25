---
name: ultrawork
description: Executes a coding task end-to-end with aggressive decomposition, progress tracking, implementation, validation, and final evidence. Trigger when the user says ultrawork/ulw, asks to do all fixes, or wants no partial implementation.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Ultrawork

Use this skill when the user wants maximum execution rather than a casual suggestion. This is an execution discipline: decompose, implement, validate, and report evidence.

## Trigger phrases

Activate when the prompt includes `ultrawork`, `ulw`, `fix all`, `finish this`, `do the whole thing`, `no partials`, or equivalent intent.

## Execution contract

1. Start with a short task decomposition.
2. Use `ultragoal`-style goal tracking for multi-step work.
3. Delegate reading, search, critique, or validation when subagents are available and useful.
4. Make reasonable local implementation decisions when the repository provides precedent.
5. Do not bypass permission gates, secret handling, destructive operation safeguards, or user approval requirements.
6. Prefer complete implementation. If completion is blocked, produce the most useful verified partial result and disclose the blocker.
7. End only after validation has passed, failed with actionable diagnostics, or is impossible to run for a stated reason.

## Required behavior

- Read existing code patterns before introducing new architecture.
- Avoid rewriting unrelated code.
- Preserve public APIs unless the task explicitly requires changing them.
- Add or update tests when the repository has a relevant test pattern.
- Run the narrowest useful validation first, then broader checks if necessary.
- Keep the final answer focused on what changed and how it was verified.

## Final report

```markdown
Done:
Changed:
Validation:
Risks / notes:
```
