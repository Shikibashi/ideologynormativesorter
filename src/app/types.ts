export type Stage =
  | "intro"
  | "methodology"
  | "consent"
  | "research-tasks"
  | "label-exposure"
  | "quiz"
  | "self-identification"
  | "specialist-invite"
  | "specialist-quiz"
  | "specialist-criterion"
  | "specialist-result"
  | "results";

export type RestoreOutcome = "in-progress" | "completed" | false;
