---
name: validator
description: Validates completed coding work using tests, type checks, lint, builds, smoke checks, and review evidence. Use before claiming a task is done or when user asks whether changes are correct.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Validator

Use this skill before final completion claims. Validation is evidence, not optimism.

## Validation hierarchy

Choose the narrowest useful checks first, then broaden:

1. Targeted reproduction or unit test for the changed behavior.
2. Typecheck or compiler check for affected package.
3. Lint or static analysis for affected files.
4. Relevant integration/e2e tests.
5. Build/package command.
6. Manual smoke check when automated coverage is absent.

## Rules

- Report exact commands run.
- Report pass/fail status and important output.
- If a command fails because of pre-existing unrelated errors, isolate and state that with evidence.
- If validation cannot run, explain why and provide the best available substitute.
- Do not mark work complete while required checks are failing.
- Recommend the next fix when validation fails.

## Output format

```markdown
## Validation report
Commands run:
Results:
Evidence:
Failures:
Unrun checks and why:
Completion judgment:
```
