import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import {
  QUESTION_BANK_VERSION,
  questionsForTier,
  questions,
} from "./data/effectiveQuestions";
import {
  buildResearchQuestionForm,
  RESEARCH_FORM_VERSION,
  researchFormFingerprint,
} from "./research/forms";
import { RESULT_SCORING_VERSION } from "./scoring";
import { encodeAnswers, readCompareAnswers, readSharedAnswers } from "./share";
import type { AnswerMap, Question } from "./types";

const moderateQuestions = questionsForTier("moderate");
const SAVE_KEY = "ideology-quiz-save";
const PARTICIPANT_KEY = "political-judgment-research-participant-v1:pilot-2026";
const SHARE_META = {
  bankVersion: QUESTION_BANK_VERSION,
  scoringVersion: RESULT_SCORING_VERSION,
};

function installLocalStorage(): void {
  const store = new Map<string, string>();
  const storage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
}

beforeEach(() => {
  installLocalStorage();
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.restoreAllMocks();
});

function storeValidSave(): void {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      questions: moderateQuestions,
      answers: {
        [moderateQuestions[0].id]: {
          questionId: moderateQuestions[0].id,
          value: 1,
        },
      },
      index: 1,
      tier: "moderate",
    }),
  );
}

function answerOptionButtons(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(".scale-button, .statement-button"),
  );
}

function clickScaleAndAnySalienceFollowUp(index: number) {
  const optionButtons = answerOptionButtons();
  fireEvent.click(optionButtons[index] ?? optionButtons[0]);

  const salienceButtons = screen.queryAllByRole("button", {
    name: /^(low|medium|high)$/i,
  });
  if (salienceButtons.length > 0) {
    fireEvent.click(salienceButtons[1]);
  }
}

// Hand-authored cross-layer intent: egalitarian/anti-domination values with
// traditional-order stress, market-confident empirical beliefs, and
// deregulatory/decentralist strategy.
const CROSS_LAYER_INTENT: Record<string, number> = {
  "equality-theory": 1,
  "anti-domination": 1,
  "authority-legitimacy": -1,
  "liberty-noninterference": 1,
  "moral-traditionalism": 1,
  "property-legitimacy": 0.3,
  "market-process-confidence": 1,
  "public-choice-skepticism": 1,
  "state-capacity-confidence": -1,
  "expert-confidence": -1,
  "coordination-optimism": 1,
  "centralization-preference": -1,
  "state-action-vs-exit": -1,
  "regulation-vs-deregulation": -1,
  "redistribution-vs-predistribution": -0.5,
  "coercion-strategy": -1,
};

function intentDot(weights: { axisId: string; weight: number }[]): number {
  return weights.reduce(
    (s, w) => s + (CROSS_LAYER_INTENT[w.axisId] ?? 0) * w.weight,
    0,
  );
}

/** Answer the currently-rendered question according to the cross-layer intent. */
function answerByIntent(question: Question) {
  const statementButtons = Array.from(
    document.querySelectorAll<HTMLElement>(".statement-button"),
  );
  if (statementButtons.length > 0 && question.statementOptions) {
    let bestIdx = 0;
    let bestScore = -Infinity;
    statementButtons.forEach((btn, i) => {
      const opt = question.statementOptions!.find((o) =>
        (btn.textContent ?? "").startsWith(o.text.slice(0, 30)),
      );
      const score = opt ? intentDot(opt.axisWeights) : -Infinity;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    });
    fireEvent.click(statementButtons[bestIdx]);
    return;
  }

  const scaleButtons = Array.from(
    document.querySelectorAll<HTMLElement>(".scale-button"),
  );
  const sign = Math.sign(intentDot(question.axisWeights));
  // 7-point scale: index 0 = strongly disagree ... 6 = strongly agree
  const index = sign > 0 ? 6 : sign < 0 ? 0 : 3;
  fireEvent.click(scaleButtons[index] ?? scaleButtons[0]);
}

/** Handle a confidence/priority salience sub-screen if one is currently shown. */
function handleSalienceIfPresent() {
  const salienceButtons = screen.queryAllByRole("button", {
    name: /^(low|medium|high)$/i,
  });
  if (salienceButtons.length > 0) {
    fireEvent.click(salienceButtons[salienceButtons.length - 1]); // High
  }
}

describe("App", () => {
  it("upgrades an old public 120-item link to the complete Balanced profile at consent", () => {
    window.history.replaceState(
      null,
      "",
      "/?contribute=1&collection=community-2026-v3&formSize=120",
    );

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /optional profile contribution/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/selected profile contains 206 questions/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue to balanced profile/i }),
    ).toBeDisabled();
    expect(screen.queryByText(/question 1 of 120/i)).not.toBeInTheDocument();
  });

  it("resumes a matching research form after renewed consent without changing item membership", () => {
    const participantId = "p_resume";
    const assigned = buildResearchQuestionForm(
      questionsForTier("moderate"),
      participantId,
      "test",
      120,
    );
    localStorage.setItem(PARTICIPANT_KEY, participantId);
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        questions: assigned,
        answers: { [assigned[0].id]: { questionId: assigned[0].id, value: 1 } },
        index: 1,
        tier: "moderate",
        startedAt: "2026-08-10T12:00:00.000Z",
        research: {
          participantId,
          studyId: "pilot-2026",
          administration: "test",
          bankVersion: QUESTION_BANK_VERSION,
          formVersion: RESEARCH_FORM_VERSION,
          formFingerprint: researchFormFingerprint(assigned),
          requestedItemCount: 120,
        },
      }),
    );
    window.history.replaceState(
      null,
      "",
      "/?research=1&study=pilot-2026&formSize=120",
    );

    render(<App />);
    for (const checkbox of screen.getAllByRole("checkbox"))
      fireEvent.click(checkbox);
    fireEvent.click(
      screen.getByRole("button", { name: /continue to balanced profile/i }),
    );

    expect(
      screen.getByText(`Question 2 of ${assigned.length}`, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(assigned[1].prompt)).toBeInTheDocument();
  });

  it("does not resume a saved research form under a different requested form size", () => {
    const participantId = "p_resume";
    const assigned = buildResearchQuestionForm(
      questionsForTier("moderate"),
      participantId,
      "test",
      120,
    );
    localStorage.setItem(PARTICIPANT_KEY, participantId);
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        questions: assigned,
        answers: { [assigned[0].id]: { questionId: assigned[0].id, value: 1 } },
        index: 1,
        tier: "moderate",
        startedAt: "2026-08-10T12:00:00.000Z",
        research: {
          participantId,
          studyId: "pilot-2026",
          administration: "test",
          bankVersion: QUESTION_BANK_VERSION,
          formVersion: RESEARCH_FORM_VERSION,
          formFingerprint: researchFormFingerprint(assigned),
          requestedItemCount: 120,
        },
      }),
    );
    window.history.replaceState(
      null,
      "",
      "/?research=1&study=pilot-2026&formSize=100",
    );

    render(<App />);
    for (const checkbox of screen.getAllByRole("checkbox"))
      fireEvent.click(checkbox);
    fireEvent.click(
      screen.getByRole("button", { name: /continue to balanced profile/i }),
    );

    expect(
      screen.getByText("Question 1 of 100", { exact: false }),
    ).toBeInTheDocument();
  });

  it("keeps a completed research response recoverable until its record is prepared", () => {
    window.history.replaceState(
      null,
      "",
      "/?research=1&study=pilot-2026&formSize=12",
    );
    render(<App />);
    for (const checkbox of screen.getAllByRole("checkbox"))
      fireEvent.click(checkbox);
    fireEvent.click(
      screen.getByRole("button", { name: /continue to balanced profile/i }),
    );

    for (let index = 0; index < 12; index += 1) {
      clickScaleAndAnySalienceFollowUp(0);
    }

    expect(
      screen.getByRole("heading", { name: /before seeing your result/i }),
    ).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");
    expect(saved.completedAt).toMatch(/^2026-|^20/);
    expect(Object.keys(saved.answers)).toHaveLength(12);
  });

  it("walks through intro, the moderate quiz, and renders results", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /political judgment decomposition/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: /session setup/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/choose the depth of the assessment/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /optionally contribute this balanced profile/i,
      }),
    ).not.toBeChecked();
    expect(
      screen.getByText(/same 206-question profile, not a separate test/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: /blitz/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: /quick/i }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /balanced profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /begin/i }));

    for (let i = 0; i < moderateQuestions.length; i++) {
      expect(
        screen.getByText(`Question ${i + 1} of ${moderateQuestions.length}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
      const optionButtons = answerOptionButtons();
      clickScaleAndAnySalienceFollowUp(Math.floor(optionButtons.length / 2));
    }

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/foundational values profile/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/empirical beliefs profile/i)).toBeInTheDocument();
    expect(screen.getByText(/applied policy profile/i)).toBeInTheDocument();
    expect(screen.getByText(/nearest catalog labels/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(
      screen.getByRole("heading", {
        name: /political judgment decomposition/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/you have a saved session in progress/i),
    ).not.toBeInTheDocument();
  }, 15_000);

  it("attaches optional collection to either selected profile instead of opening a separate test", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("radio", { name: /full-depth profile/i }));
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /optionally contribute this full-depth profile/i,
      }),
    );
    expect(
      screen.getByText(/same 338-question profile, not a separate test/i),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /review contribution details/i }),
    );

    expect(
      screen.getByRole("heading", { name: /optional profile contribution/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/selected profile contains 338 questions/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue to full-depth profile/i }),
    ).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: /continue without contributing/i }),
    );

    expect(
      screen.getByText("Question 1 of 338", { exact: false }),
    ).toBeInTheDocument();
  });

  it("allows a completed respondent to skip upload and see the result", () => {
    window.history.replaceState(
      null,
      "",
      "/?research=1&study=pilot-2026&formSize=12",
    );
    render(<App />);
    for (const checkbox of screen.getAllByRole("checkbox"))
      fireEvent.click(checkbox);
    fireEvent.click(
      screen.getByRole("button", { name: /continue to balanced profile/i }),
    );

    for (let index = 0; index < 12; index += 1)
      clickScaleAndAnySalienceFollowUp(0);
    fireEvent.click(
      screen.getByRole("button", { name: /skip contribution and see result/i }),
    );

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });

  it('lets a descriptive item be answered as "I don\'t know" and still advances', () => {
    render(<App />);
    fireEvent.click(screen.getByRole("radio", { name: /balanced profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /begin/i }));

    const firstDescriptiveIndex = moderateQuestions.findIndex(
      (q) => q.allowDontKnow,
    );
    for (let i = 0; i < firstDescriptiveIndex; i++) {
      clickScaleAndAnySalienceFollowUp(0);
    }

    expect(
      screen.getByText(
        `Question ${firstDescriptiveIndex + 1} of ${moderateQuestions.length}`,
        { exact: false },
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /i don't know/i }));
    expect(
      screen.getByText(
        `Question ${firstDescriptiveIndex + 2} of ${moderateQuestions.length}`,
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it("lets a confidence/priority rating be skipped with explicit result-exclusion wording", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("radio", { name: /balanced profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /begin/i }));

    const ratedIndex = moderateQuestions.findIndex(
      (q) => q.layer !== "normative",
    );
    for (let i = 0; i < ratedIndex; i++) {
      clickScaleAndAnySalienceFollowUp(0);
    }

    fireEvent.click(answerOptionButtons()[0]);
    fireEvent.click(
      screen.getByRole("button", {
        name: /skip rating and exclude this answer from my result/i,
      }),
    );
    expect(
      screen.getByText(
        `Question ${ratedIndex + 2} of ${moderateQuestions.length}`,
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it("lands directly on results when loaded with a shared #r= link", () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/application context/i)).toHaveTextContent(
      /labels reference only/i,
    );
    expect(screen.getByLabelText(/application context/i)).not.toHaveTextContent(
      /2026-/i,
    );
  });

  it("opens a shared result when its hash is applied to the current document", () => {
    render(<App />);
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );

    window.history.pushState(null, "", `/#r=${encoded}`);
    fireEvent(window, new HashChangeEvent("hashchange"));

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
  });

  it("clears malformed saved progress instead of showing a stale resume banner", () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ questions: [], answers: {}, index: 0, tier: "quick" }),
    );

    render(<App />);

    expect(
      screen.queryByText(/you have a saved session in progress/i),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });

  it("start fresh removes saved progress without reloading", () => {
    storeValidSave();

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start fresh/i }));
    expect(
      screen.getByRole("group", { name: /confirm clearing saved session/i }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /clear saved session/i }),
    );

    expect(
      screen.queryByText(/you have a saved session in progress/i),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(
      screen.getByRole("heading", {
        name: /political judgment decomposition/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens methodology from a URL view and returns through history-aware navigation", () => {
    window.history.replaceState(null, "", "/?view=methodology");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /how this test works/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /back to results/i }));

    expect(window.location.search).toBe("");
    expect(
      screen.getByRole("heading", {
        name: /political judgment decomposition/i,
      }),
    ).toBeInTheDocument();
  });

  it("prioritizes a shared result hash over a methodology query", () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/?view=methodology#r=${encoded}`);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
  });

  it("compares a pasted shared result without remounting and preserves hash ordering", () => {
    const current: AnswerMap = { q0001: { questionId: "q0001", value: 2 } };
    const compared: AnswerMap = { q0001: { questionId: "q0001", value: -2 } };
    window.history.replaceState(
      null,
      "",
      `/#r=${encodeAnswers(current, SHARE_META)}`,
    );

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/paste shared url or hash/i), {
      target: { value: `/#r=${encodeAnswers(compared, SHARE_META)}` },
    });
    fireEvent.click(screen.getByRole("button", { name: /^compare$/i }));

    expect(
      screen.getByRole("heading", { name: /comparison view/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /axis comparison/i }),
    ).toBeInTheDocument();
    expect(readSharedAnswers()).toEqual(current);
    expect(readCompareAnswers()).toEqual(compared);
  });

  it("copies a shareable link to the clipboard from the results screen", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /copy link to this result/i }),
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("#r="));
    await screen.findByRole("button", { name: /link copied/i });
  });

  it("shows a sharing fallback when clipboard is unavailable", () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /copy link to this result/i }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      /select the link below/i,
    );
    const linkInput = screen.getByLabelText(/shareable result link/i);
    expect((linkInput as HTMLInputElement).value).toContain("#r=");
  });
  it("renders the layer-conflation section with agreement chips for a cross-layer profile", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("radio", { name: /balanced profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /begin/i }));

    for (let i = 0; i < moderateQuestions.length; i++) {
      expect(
        screen.getByText(`Question ${i + 1} of ${moderateQuestions.length}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
      answerByIntent(moderateQuestions[i]);
      handleSalienceIfPresent();
    }

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    // The cross-layer profile must surface the layer-conflation section.
    expect(
      screen.getByRole("heading", {
        name: /labels that conflate your layers/i,
      }),
    ).toBeInTheDocument();

    // At least one flag with per-layer agreement chips must render.
    const chips = Array.from(document.querySelectorAll(".layer-chip"));
    expect(chips.length).toBeGreaterThanOrEqual(3);
    // Each flag shows all three layers, and exactly one is marked as matched per flag.
    expect(document.querySelector(".layer-chip.matched")).toBeInTheDocument();
    const chipText = chips.map((c) => c.textContent ?? "").join(" ");
    expect(chipText).toMatch(/normative/i);
    expect(chipText).toMatch(/descriptive/i);
    expect(chipText).toMatch(/prescriptive/i);
    expect(chipText).toMatch(/close|mixed|different/i);
    expect(chipText).not.toMatch(/%/);
  }, 15_000);

  it("renders the divergences section on the results screen when layer divergences exist", () => {
    const normativeLibertyQ = questions.find(
      (q) =>
        q.layer === "normative" &&
        q.axisWeights.some((w) => w.axisId === "liberty-noninterference"),
    )!;
    const prescriptiveRegQ = questions.find(
      (q) =>
        q.layer === "prescriptive" &&
        q.axisWeights.some((w) => w.axisId === "regulation-vs-deregulation"),
    )!;

    const answers = {
      [normativeLibertyQ.id]: { questionId: normativeLibertyQ.id, value: 3 },
      [prescriptiveRegQ.id]: { questionId: prescriptiveRegQ.id, value: 3 },
    };

    const encoded = encodeAnswers(answers, SHARE_META);
    window.history.replaceState(null, "", `/#r=${encoded}`);
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /divergences & strategic compromises/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/layer divergence/i, { exact: false }).length,
    ).toBeGreaterThan(0);
  });

  it("renders nearest ideology labels grouped into family-tree groups with readable family names", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("radio", { name: /balanced profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /begin/i }));

    for (let i = 0; i < moderateQuestions.length; i++) {
      answerByIntent(moderateQuestions[i]);
      handleSalienceIfPresent();
    }

    expect(
      screen.getByRole("heading", { name: /your results/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /nearest catalog labels/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not claims that you subscribe to them/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/showing the five closest profiles/i),
    ).toBeInTheDocument();
    expect(document.querySelectorAll("#labels .label-card")).toHaveLength(5);

    // The family-tree grouping must render at least one family group.
    const groups = Array.from(document.querySelectorAll(".family-group"));
    expect(groups.length).toBeGreaterThanOrEqual(1);

    // Family names are rendered human-readable (title-cased, de-hyphenated): no raw kebab-case.
    const familyNames = Array.from(
      document.querySelectorAll(".family-name"),
    ).map((h) => h.textContent ?? "");
    expect(familyNames.length).toBeGreaterThanOrEqual(1);
    for (const name of familyNames) {
      expect(name).not.toMatch(/-/);
      expect(name[0]).toBe(name[0]?.toUpperCase());
    }

    // Each group lists at least one label with consumer-readable comparison language.
    const firstGroupCards = groups[0].querySelectorAll(".label-card");
    expect(firstGroupCards.length).toBeGreaterThanOrEqual(1);
    expect(groups[0].textContent ?? "").toMatch(/axis profile|axis overlap/i);
    expect(groups[0].textContent ?? "").not.toMatch(/axis proximity\s+-?\d/i);
    expect(
      groups[0].querySelector(".label-evidence")?.textContent ?? "",
    ).toMatch(/answer coverage/i);
    expect(
      groups[0].querySelector(".label-source-disclosure")?.textContent ?? "",
    ).toMatch(/background sources/i);
    expect(
      groups[0].querySelector(".label-scale-disclosure")?.textContent ?? "",
    ).toMatch(/analytical scale/i);
  }, 15_000);

  it("keeps the full label browser collapsed by default and searches label metadata", () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);

    render(<App />);

    const browser = document.querySelector<HTMLDetailsElement>(
      ".full-label-browser",
    );
    expect(browser).toBeInTheDocument();
    expect(browser!.open).toBe(false);

    fireEvent.click(screen.getByText(/browse the public label catalog/i));
    expect(browser!.open).toBe(true);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Marxism" },
      },
    );

    expect(
      screen.getByText(
        /search results include public catalog labels and clearly marked related traditions/i,
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll(".full-label-browser .label-card").length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector(".full-label-browser")?.textContent ?? "",
    ).toMatch(/Marxism/i);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Socialist Feminism" },
      },
    );

    expect(
      screen.getByRole("heading", {
        name: /socialist and marxist feminist traditions/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /^related traditions$/i }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Radical Feminism" },
      },
    );

    expect(
      screen.getByRole("heading", { name: /radical feminism/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /^related traditions$/i }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Non-Leninist Marxism" },
      },
    );

    expect(
      screen.getByRole("heading", {
        name: /marxian socialism \(non-leninist\)/i,
      }),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll(".full-label-browser .family-group"),
    ).toHaveLength(1);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Nyerereism" },
      },
    );

    expect(
      screen.getByRole("heading", { name: /ujamaa \/ nyerereism/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/african socialist/i)).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Market Libertarianism" },
      },
    );

    expect(
      within(browser!).getByRole("heading", { name: /right-libertarianism/i }),
    ).toBeInTheDocument();
    expect(
      within(browser!).getByText(/primary scored family/i),
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Black Political Nationalism" },
      },
    );

    expect(
      within(browser!).getByRole("heading", { name: /^black nationalism$/i }),
    ).toBeInTheDocument();
    expect(browser!.querySelector(".label-taxonomy-status")).toHaveTextContent(
      /provisional specialist/i,
    );

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search ideology labels/i }),
      {
        target: { value: "Pan-African Unity" },
      },
    );

    expect(
      within(browser!).getByRole("heading", { name: /^pan-africanism$/i }),
    ).toBeInTheDocument();
    expect(browser!.querySelector(".label-taxonomy-status")).toHaveTextContent(
      /provisional specialist/i,
    );
  });

  it("renders a compact per-layer Philosophy Explorer with affected axes", () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /philosophy explorer/i }),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll(".philosophy-card").length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelectorAll(".philosophy-explorer .axis-chip").length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector(".philosophy-card")?.textContent ?? "",
    ).toMatch(/In these matched labels:/);
    const renderedLayers = Array.from(
      document.querySelectorAll(".philosophy-layer h3"),
    ).map((heading) => heading.textContent);
    expect(renderedLayers.length).toBeGreaterThanOrEqual(1);
    expect(
      document.querySelector(".philosophy-explorer")?.textContent ?? "",
    ).not.toMatch(/: 0\.00/);
  });

  it("shows a dismissible alert when a broken share link is loaded", () => {
    window.history.replaceState(null, "", "/#r=%%%notbase64%%%");
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /political judgment decomposition/i,
      }),
    ).toBeInTheDocument();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/shared result link/i);

    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows actionable error and manual-copy input when clipboard writeText rejects", async () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /copy link to this result/i }),
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/select the link below/i);
    const linkInput = screen.getByLabelText(/shareable result link/i);
    expect((linkInput as HTMLInputElement).value).toContain("#r=");
  });

  it("rejects a junk compare input with an actionable error", () => {
    const encoded = encodeAnswers(
      { q0001: { questionId: "q0001", value: 2 } },
      SHARE_META,
    );
    window.history.replaceState(null, "", `/#r=${encoded}`);
    render(<App />);

    const compareInput = screen.getByLabelText(
      /shared result link to compare/i,
    );
    fireEvent.change(compareInput, { target: { value: "not a link" } });
    fireEvent.click(screen.getByRole("button", { name: /^compare$/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /couldn't read that link/i,
    );
    expect(
      screen.queryByRole("heading", { name: /comparison view/i }),
    ).toBeNull();
  });
});
