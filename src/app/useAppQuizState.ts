import { useMemo, useState } from "react";
import { questionById, questions, questionsForTier } from "../domain/selectors";
import {
  modifierScoringLabels,
  primaryScoringLabels,
} from "../domain/selectors";
import { buildContributionQuestionForm } from "../research/forms";
import { buildResultProfile } from "../scoring";
import { getQuizProgress } from "../save";
import { readCompareAnswers, type ShareMeta } from "../share";
import type {
  AnswerMap,
  Axis,
  QuizTier,
  ResultProfile,
  Question,
} from "../types";
import type { AppBootstrapState } from "./useAppBootstrapState";
import type { AppResearchState } from "./useAppResearchState";
import type { Stage } from "./types";
import type { QuizScreenStatus } from "../components/QuizScreen";
import type { Setter } from "./actionTypes";

export interface AppQuizState {
  activeQuestions: Question[];
  answers: AnswerMap;
  compareAnswers: AnswerMap | null;
  compareResult: ResultProfile | null;
  domainCount: number;
  expectedResearchItemCount: number;
  loadError: string | null;
  pendingTier: QuizTier;
  questionCounts: Record<QuizTier, number>;
  quizCompletedAt: string | null;
  quizShellStatus: QuizScreenStatus;
  quizStartedAt: string | null;
  result: ResultProfile | null;
  resumeAfterConsent: "quiz" | "self-identification" | null;
  resumeIndex: number;
  resuming: boolean;
  savedProgress: ReturnType<typeof getQuizProgress>;
  setActiveQuestions: Setter<Question[]>;
  setAnswers: Setter<AnswerMap>;
  setCompareResult: Setter<ResultProfile | null>;
  setLoadError: Setter<string | null>;
  setPendingTier: Setter<QuizTier>;
  setQuizCompletedAt: Setter<string | null>;
  setQuizShellStatus: Setter<QuizScreenStatus>;
  setQuizStartedAt: Setter<string | null>;
  setResult: Setter<ResultProfile | null>;
  setResumeAfterConsent: Setter<"quiz" | "self-identification" | null>;
  setResumeIndex: Setter<number>;
  setResuming: Setter<boolean>;
  setSavedProgress: Setter<ReturnType<typeof getQuizProgress>>;
  setStage: Setter<Stage>;
  stage: Stage;
  wasResumed: boolean;
  setWasResumed: Setter<boolean>;
}

interface QuizStateInput {
  bootstrap: AppBootstrapState;
  research: AppResearchState;
  axes: Axis[];
  shareMeta: ShareMeta;
}

export function useAppQuizState({
  bootstrap,
  research,
  axes,
  shareMeta,
}: QuizStateInput): AppQuizState {
  const initialAnswers =
    bootstrap.sharedAnswers ?? research.pendingCoreSubmission?.answers ?? {};
  const [pendingTier, setPendingTier] = useState<QuizTier>(
    bootstrap.loadedInitialQuiz?.tier ?? "moderate",
  );
  const [resumeAfterConsent, setResumeAfterConsent] = useState<
    "quiz" | "self-identification" | null
  >(null);
  const [resumeIndex, setResumeIndex] = useState(0);
  const [quizStartedAt, setQuizStartedAt] = useState<string | null>(null);
  const [quizCompletedAt, setQuizCompletedAt] = useState<string | null>(null);
  const [wasResumed, setWasResumed] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    bootstrap.shareLoad.malformed
      ? "We couldn't open that shared result link — it may be incomplete or out of date. You can start the test below to build your own profile."
      : null,
  );
  const [compareAnswers] = useState<AnswerMap | null>(() =>
    readCompareAnswers(shareMeta),
  );
  const [stage, setStage] = useState<Stage>(
    bootstrap.sharedAnswers || research.pendingCoreSubmission
      ? "results"
      : requestedMethodology()
        ? "methodology"
        : bootstrap.initialResearchMode
          ? "consent"
          : "intro",
  );
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(
    research.pendingCoreSubmission
      ? research.pendingCoreSubmission.presentationOrder
          .map((questionId) => questionById.get(questionId))
          .filter((question): question is Question => Boolean(question))
      : questions,
  );
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  const [result, setResult] = useState<ResultProfile | null>(() =>
    bootstrap.sharedAnswers || research.pendingCoreSubmission
      ? buildResultProfile(
          questions,
          initialAnswers,
          axes,
          primaryScoringLabels,
          modifierScoringLabels,
        )
      : null,
  );
  const [compareResult, setCompareResult] = useState<ResultProfile | null>(
    () =>
      compareAnswers
        ? buildResultProfile(
            questions,
            compareAnswers,
            axes,
            primaryScoringLabels,
            modifierScoringLabels,
          )
        : null,
  );
  const [resuming, setResuming] = useState(false);
  const domainCount = useMemo(
    () => new Set(questions.map((question) => question.domain)).size,
    [],
  );
  const questionCounts = useMemo(
    () =>
      Object.fromEntries(
        (["blitz", "quick", "moderate", "extensive"] as QuizTier[]).map(
          (tier) => [tier, questionsForTier(tier).length],
        ),
      ) as Record<QuizTier, number>,
    [],
  );
  const expectedResearchItemCount = useMemo(
    () =>
      buildContributionQuestionForm(
        questionsForTier(pendingTier),
        bootstrap.participantId,
        bootstrap.administration,
        bootstrap.formSize,
      ).length,
    [
      bootstrap.administration,
      bootstrap.formSize,
      bootstrap.participantId,
      pendingTier,
    ],
  );
  const [savedProgress, setSavedProgress] = useState(() => getQuizProgress());
  const [quizShellStatus, setQuizShellStatus] = useState<QuizScreenStatus>({
    current: 1,
    total: activeQuestions.length,
    layer: activeQuestions[0]?.layer ?? "normative",
    save: "current",
  });

  return {
    activeQuestions,
    answers,
    compareAnswers,
    compareResult,
    domainCount,
    expectedResearchItemCount,
    loadError,
    pendingTier,
    questionCounts,
    quizCompletedAt,
    quizShellStatus,
    quizStartedAt,
    result,
    resumeAfterConsent,
    resumeIndex,
    resuming,
    savedProgress,
    setActiveQuestions,
    setAnswers,
    setCompareResult,
    setLoadError,
    setPendingTier,
    setQuizCompletedAt,
    setQuizShellStatus,
    setQuizStartedAt,
    setResult,
    setResumeAfterConsent,
    setResumeIndex,
    setResuming,
    setSavedProgress,
    setStage,
    stage,
    wasResumed,
    setWasResumed,
  };
}

function requestedMethodology(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("view") === "methodology" &&
    !/(?:^|[#&?])r=/.test(window.location.hash)
  );
}
