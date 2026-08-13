import type { Question, QuestionSource } from "../types";

export const DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION =
  "2026-08-descriptive-evidence-v3";

interface DescriptiveEvidence {
  evidenceNote: string;
  sources: QuestionSource[];
}

export const descriptiveEvidenceThirdPassById: Readonly<
  Record<string, DescriptiveEvidence>
> = {
  q0347: {
    evidenceNote:
      "Scope to a meta-analysis of 100 quantitative studies published from 1980 through 2020 in established democracies: compare participants before and after a deliberative mini-public or with a control group; the clearest average capability effect was increased political knowledge, not proof that every deliberative design or resulting decision is sound.",
    sources: [
      {
        title:
          "A meta-analysis of the effects of democratic innovations on participants’ attitudes, behaviour and capabilities",
        url: "https://www.cambridge.org/core/journals/european-journal-of-political-research/article/metaanalysis-of-the-effects-of-democratic-innovations-on-participants-attitudes-behaviour-and-capabilities/065F2F246C8B8619D3EE45BFD4DB77A7",
        publisher: "Cambridge University Press",
      },
    ],
  },
};

export function applyDescriptiveEvidenceThirdPass(
  question: Question,
): Question {
  const evidence = descriptiveEvidenceThirdPassById[String(question.id)];
  if (
    !evidence ||
    question.active === false ||
    question.layer !== "descriptive"
  )
    return question;

  return {
    ...question,
    evidenceNote: evidence.evidenceNote,
    sources: evidence.sources.map((source) => ({ ...source })),
  };
}
