import type { Question, QuestionSource } from "../types";

export const DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION =
  "2026-08-descriptive-evidence-v4";

interface DescriptiveEvidence {
  evidenceNote: string;
  sources: QuestionSource[];
}

const source = (
  title: string,
  url: string,
  publisher: string,
): QuestionSource => ({ title, url, publisher });

/** Evidence records for the confidence-coverage items added in v1. */
export const descriptiveEvidenceFourthPassById: Readonly<
  Record<string, DescriptiveEvidence>
> = {
  q0430: {
    evidenceNote:
      "Scope this claim to deliberative mini-publics and comparable democratic innovations rather than to every form of political discussion. A meta-analysis of 100 studies in established democracies found a positive average effect on participants’ political knowledge, while effects on attitudes, behaviour, and deliberative quality varied by design and context; knowledge gains do not prove that every collective decision is sound.",
    sources: [
      source(
        "A meta-analysis of the effects of democratic innovations on participants’ attitudes, behaviour and capabilities",
        "https://www.cambridge.org/core/journals/european-journal-of-political-research/article/metaanalysis-of-the-effects-of-democratic-innovations-on-participants-attitudes-behaviour-and-capabilities/065F2F246C8B8619D3EE45BFD4DB77A7",
        "European Journal of Political Research / Cambridge University Press",
      ),
    ],
  },
  q0431: {
    evidenceNote:
      "Treat this as a conditional accountability claim: voters need observable outcomes, credible alternatives, and enough information to connect performance with officeholders. Research on information distribution in elections finds that information can change accountability and welfare, but its effects depend on what is disclosed, who receives it, and how political incentives respond; it is not a universal guarantee of good government.",
    sources: [
      source(
        "Information and Political Accountability",
        "https://www.aeaweb.org/articles?id=10.1257%2Fmic.20240340",
        "American Economic Association",
      ),
    ],
  },
  q0432: {
    evidenceNote:
      "This item concerns information problems in electoral accountability, not a claim that voters are inherently irrational or that elections are always uninformed. The relevant evidence distinguishes unequal access, incomplete signals, media and campaign information, and the possibility that additional information can have heterogeneous effects across voters and issues.",
    sources: [
      source(
        "Information and Political Accountability",
        "https://www.aeaweb.org/articles?id=10.1257%2Fmic.20240340",
        "American Economic Association",
      ),
    ],
  },
  q0433: {
    evidenceNote:
      "This item is about conditions under which expertise is more useful, not about whether experts should replace elected institutions. OECD evidence-governance guidance emphasizes transparent methods, stated assumptions, uncertainty, integrity, accountability, contestability, and public representation as safeguards for mobilizing evidence in policy; these are design conditions rather than a guarantee that advice is correct.",
    sources: [
      source(
        "Mobilising evidence for good governance",
        "https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html",
        "Organisation for Economic Co-operation and Development",
      ),
    ],
  },
  q0434: {
    evidenceNote:
      "This item isolates the accountability risk of insulated technical agencies. Evidence-governance frameworks treat transparency, review, contestability, and public representation as ways to reduce detachment and improve the use of expertise; the claim does not imply that independence is always harmful or that public scrutiny supplies technical competence by itself.",
    sources: [
      source(
        "Mobilising evidence for good governance",
        "https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html",
        "Organisation for Economic Co-operation and Development",
      ),
    ],
  },
  q0435: {
    evidenceNote:
      "Scope this claim to social norms and legal-institutional change rather than assuming that formal law immediately changes private behavior. World Bank materials on social norms distinguish legal rules from enforcement, incentives, reference groups, public acceptance, and the time needed for new expectations to become durable; effects vary by issue and setting.",
    sources: [
      source(
        "Social Norms",
        "https://wbl.worldbank.org/en/publications/thematic-topics/social-norm",
        "World Bank",
      ),
    ],
  },
  q0444: {
    evidenceNote:
      "Scope this claim to changes in observed gender and family practices after formal legal reform. Social norms can persist through enforcement gaps, material dependence, reference groups, and public resistance, so legal change does not imply immediate behavioral convergence or identical outcomes across settings.",
    sources: [
      source(
        "Social Norms",
        "https://wbl.worldbank.org/en/publications/thematic-topics/social-norm",
        "World Bank",
      ),
    ],
  },
  q0445: {
    evidenceNote:
      "Scope this claim to campaigns and institutional changes that alter incentives, reference groups, and public expectations over time. Social norm change can be gradual and contested; the item does not claim that campaigns alone succeed or that every population responds in the same way.",
    sources: [
      source(
        "Social Norms",
        "https://wbl.worldbank.org/en/publications/thematic-topics/social-norm",
        "World Bank",
      ),
    ],
  },
  q0473: {
    evidenceNote:
      "This item separates the analytic role of expert evidence from normative priority-setting. OECD evidence-governance guidance emphasizes transparent assumptions, uncertainty, integrity, accountability, contestability, and public representation; those safeguards help decision-makers evaluate advice but do not make evidence politically neutral or determine which values should prevail.",
    sources: [
      source(
        "Mobilising evidence for good governance",
        "https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html",
        "Organisation for Economic Co-operation and Development",
      ),
    ],
  },
};

export function applyDescriptiveEvidenceFourthPass(
  question: Question,
): Question {
  const evidence = descriptiveEvidenceFourthPassById[String(question.id)];
  if (
    !evidence ||
    question.active === false ||
    question.layer !== "descriptive"
  )
    return question;

  return {
    ...question,
    evidenceNote: evidence.evidenceNote,
    sources: evidence.sources.map((item) => ({ ...item })),
  };
}
