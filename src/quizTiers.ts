import type { QuizTier } from "./types";

const QUIZ_TIER_LABELS: Record<QuizTier, string> = {
  blitz: "Legacy short profile",
  quick: "Legacy overview profile",
  moderate: "Balanced profile",
  extensive: "Full-depth profile",
};

export function quizTierLabel(tier: QuizTier): string {
  return QUIZ_TIER_LABELS[tier];
}
