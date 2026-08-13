export type Stage =
  | "intro"
  | "methodology"
  | "consent"
  | "quiz"
  | "self-identification"
  | "specialist-invite"
  | "specialist-quiz"
  | "specialist-criterion"
  | "specialist-result"
  | "results";

export type RestoreOutcome = "in-progress" | "completed" | false;
