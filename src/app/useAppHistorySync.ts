import { useEffect } from "react";
import { questions } from "../data/effectiveQuestions";
import {
  modifierScoringLabels,
  primaryScoringLabels,
} from "../data/labelTaxonomy";
import { buildResultProfile } from "../scoring";
import { readCompareAnswers, readSharedResult, type ShareMeta } from "../share";
import type { AnswerMap, Axis, ResultProfile } from "../types";
import type { Stage } from "./types";

interface HistorySyncInput {
  axes: Axis[];
  result: ResultProfile | null;
  setAnswers: (answers: AnswerMap) => void;
  setCompareResult: (result: ResultProfile | null) => void;
  setLoadError: (error: string | null) => void;
  setResult: (result: ResultProfile | null) => void;
  setStage: (stage: Stage) => void;
  shareMeta: ShareMeta;
  stage: Stage;
}

export function useAppHistorySync({
  axes,
  result,
  setAnswers,
  setCompareResult,
  setLoadError,
  setResult,
  setStage,
  shareMeta,
  stage,
}: HistorySyncInput): void {
  useEffect(() => {
    function handleHistoryChange(): void {
      const nextSharedResult = readSharedResult(shareMeta);
      if (nextSharedResult.answers) {
        const nextCompareAnswers = readCompareAnswers(shareMeta);
        setAnswers(nextSharedResult.answers);
        setResult(
          buildResultProfile(
            questions,
            nextSharedResult.answers,
            axes,
            primaryScoringLabels,
            modifierScoringLabels,
          ),
        );
        setCompareResult(
          nextCompareAnswers
            ? buildResultProfile(
                questions,
                nextCompareAnswers,
                axes,
                primaryScoringLabels,
                modifierScoringLabels,
              )
            : null,
        );
        setLoadError(null);
        setStage("results");
        return;
      }

      if (requestedMethodology()) setStage("methodology");
      else if (stage === "methodology") setStage(result ? "results" : "intro");
    }

    window.addEventListener("popstate", handleHistoryChange);
    window.addEventListener("hashchange", handleHistoryChange);
    return () => {
      window.removeEventListener("popstate", handleHistoryChange);
      window.removeEventListener("hashchange", handleHistoryChange);
    };
  }, [
    axes,
    result,
    setAnswers,
    setCompareResult,
    setLoadError,
    setResult,
    setStage,
    shareMeta,
    stage,
  ]);
}

function requestedMethodology(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("view") === "methodology" &&
    !/(?:^|[#&?])r=/.test(window.location.hash)
  );
}
