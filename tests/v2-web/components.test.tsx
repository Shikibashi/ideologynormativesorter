import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LikertControl, QuestionCard } from "../../v2/apps/web/src/components";
import type { QuestionViewModel } from "../../v2/packages/view-model/src";

const question: QuestionViewModel = { id: "fixture", prompt: "How should this response be recorded?", responseType: "likert7", role: "core", layer: "normative", domainLabel: "Fixture domain", scaleMin: -3, scaleMax: 3, scaleStep: 1, options: [], allowDontKnow: false };

describe("Phase 11 generic controls", () => {
  it("exposes keyboard-friendly radio semantics and neutral endpoint", () => {
    render(<LikertControl question={question} onResponse={vi.fn()} />);
    expect(screen.getByRole("radiogroup")).toBeVisible();
    expect(screen.getByRole("radio", { name: "fixture response 0" })).toBeVisible();
    expect(screen.getByText("Neutral")).toBeVisible();
  });

  it("renders response-state choices without changing the scoring meaning", () => {
    render(<QuestionCard question={question} onResponse={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Leave unanswered" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Abstain" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Decline to answer" })).toBeVisible();
  });
});
