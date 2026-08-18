import type { ResearchAdministration } from "../research";
import { quizTierLabel } from "../quizTiers";
import { TAXONOMY_VERSION } from "../domain/selectors";
import type { QuizTier } from "../types";
import type { QuizScreenStatus } from "../components/QuizScreen";
import type { ShellContext } from "../components/SiteShell";
import type { Stage } from "./types";

interface ShellContextInput {
  stage: Stage;
  administration: ResearchAdministration;
  assignedSpecialistTitle?: string;
  compareActive: boolean;
  expectedResearchItemCount: number;
  pendingTier: QuizTier;
  quizShellStatus: QuizScreenStatus;
  researchEnabled: boolean;
  researchStatus?: string;
  savedProgress: boolean;
  specialistProgress: boolean;
  specialistStatus?: string;
  studyId: string;
}

export function buildShellContext({
  stage,
  administration,
  assignedSpecialistTitle,
  compareActive,
  expectedResearchItemCount,
  pendingTier,
  quizShellStatus,
  researchEnabled,
  researchStatus,
  savedProgress,
  specialistProgress,
  specialistStatus,
  studyId,
}: ShellContextInput): ShellContext {
  const composition: ShellContext["composition"] =
    stage === "results" || stage === "methodology" ? "workbench" : "page";
  let contextItems: ShellContext["contextItems"] = [
    {
      label: "MODE",
      value: composition === "workbench" ? "WORKBENCH" : "ASSESSMENT",
    },
    { label: "STORAGE", value: "BROWSER LOCAL" },
    { label: "INSTRUMENT", value: "CURRENT" },
    { label: "TAXONOMY", value: TAXONOMY_VERSION },
    { label: "OUTPUT", value: "THREE-LAYER PROFILE" },
  ];
  let statusItems: ShellContext["statusItems"] = [
    { label: "STAGE", value: stage.replaceAll("-", " ") },
    { label: "SAVE", value: "LOCAL" },
  ];

  if (stage === "intro") {
    statusItems = [
      { label: "STAGE", value: "START" },
      { label: "LENGTH", value: quizTierLabel(pendingTier) },
      { label: "SAVE", value: savedProgress ? "RESUMABLE" : "LOCAL" },
      { label: "MODE", value: "STANDARD" },
    ];
  } else if (stage === "quiz" || stage === "specialist-quiz") {
    if (researchEnabled || stage === "specialist-quiz") {
      contextItems = [
        {
          label: "MODE",
          value:
            stage === "specialist-quiz"
              ? "CONTRIBUTION FOLLOW-UP"
              : "CONTRIBUTION",
        },
        { label: "COLLECTION", value: studyId },
        { label: "ADMIN", value: administration },
        { label: "FORM", value: String(quizShellStatus.total) },
      ];
    }
    statusItems = [
      {
        label: "STAGE",
        value: stage === "quiz" ? "QUESTION" : "FOLLOW-UP QUESTION",
      },
      {
        label: "PROGRESS",
        value: `${quizShellStatus.current} / ${quizShellStatus.total}`,
      },
      { label: "LAYER", value: quizShellStatus.layer },
      { label: "SAVE", value: quizShellStatus.save },
    ];
  } else if (stage === "consent" || stage === "self-identification") {
    contextItems = [
      { label: "MODE", value: "CONTRIBUTION" },
      { label: "COLLECTION", value: studyId },
      { label: "ADMIN", value: administration },
      { label: "FORM", value: String(expectedResearchItemCount) },
    ];
    statusItems = [
      {
        label: "STAGE",
        value: stage === "consent" ? "PRIVACY CHOICE" : "OPTIONAL PROFILE",
      },
      { label: "SUBMISSION", value: researchStatus ?? "NOT SENT" },
      { label: "SAVE", value: "LOCAL" },
    ];
  } else if (stage.startsWith("specialist")) {
    contextItems = [
      { label: "MODE", value: "CONTRIBUTION FOLLOW-UP" },
      { label: "COLLECTION", value: studyId },
      { label: "MODULE", value: assignedSpecialistTitle ?? "OPTIONAL" },
      { label: "ADMIN", value: administration },
    ];
    statusItems = [
      {
        label: "STAGE",
        value: stage.replaceAll("specialist-", "").replaceAll("-", " "),
      },
      { label: "SUBMISSION", value: specialistStatus ?? "NOT SENT" },
      { label: "SAVE", value: specialistProgress ? "RESUMABLE" : "LOCAL" },
    ];
  } else if (stage === "results") {
    contextItems = [
      { label: "MODE", value: "WORKBENCH" },
      { label: "OUTPUT", value: "THREE-LAYER PROFILE" },
      { label: "LABELS", value: "REFERENCE ONLY" },
      { label: "COMPARE", value: compareActive ? "ACTIVE" : "INACTIVE" },
    ];
    statusItems = [
      { label: "STAGE", value: "RESULTS" },
      { label: "VIEW", value: "LAYERED PROFILE" },
      { label: "LABELS", value: "SECONDARY" },
      { label: "COMPARE", value: compareActive ? "ACTIVE" : "INACTIVE" },
    ];
  } else if (stage === "methodology") {
    contextItems = [
      { label: "MODE", value: "DOCUMENTATION" },
      { label: "INSTRUMENT", value: "CURRENT" },
      { label: "VERSIONING", value: "TRACKED" },
      { label: "HISTORY", value: "BROWSER NATIVE" },
    ];
    statusItems = [
      { label: "STAGE", value: "METHODOLOGY" },
      { label: "SECTION", value: "METHODS" },
      { label: "VERSIONING", value: "TRACKED" },
    ];
  }

  return { stage, composition, contextItems, statusItems };
}
