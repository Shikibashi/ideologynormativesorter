---
name: ultradebug
description: Systematic evidence-based debugging workflow. Trigger when the user says ultradebug/uld or asks to diagnose failing tests, runtime errors, regressions, crashes, flaky behavior, or production bugs.
license: MIT
compatibility: OMP / Agent Skills compatible SKILL.md package.
---

# Ultradebug

Use this skill for bugs. Do not guess-patch. Reproduce, isolate, explain, fix, and verify.

## Seven-step debugging loop

1. Capture: record the exact symptom, command, input, stack trace, screenshot, failing test, or log.
2. Reproduce: run the smallest command or scenario that demonstrates the failure.
3. Bound: identify what changed, what code path executes, and which layer owns the failure.
4. Hypothesize: list likely causes ranked by evidence.
5. Test: perform the smallest inspection or experiment that can falsify each hypothesis.
6. Fix: make the minimal durable change that addresses root cause, not just the symptom.
7. Verify: rerun the reproduction, relevant tests, and at least one regression check.

## Anti-patterns to avoid

- Do not make multiple speculative edits before reproduction.
- Do not suppress errors unless the desired behavior is explicitly to tolerate them.
- Do not delete tests to make the suite pass.
- Do not claim a fix without rerunning the failing path or explaining why it cannot be rerun.
- Do not broaden scope into unrelated cleanup unless required for the fix.

## Debug report

```markdown
## Debug report
Symptom:
Reproduction:
Root cause:
Fix:
Verification:
Remaining risk:
```
