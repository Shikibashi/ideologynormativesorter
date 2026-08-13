import type { Question, QuestionSource } from "../types";

export const DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION =
  "2026-08-descriptive-evidence-v2";

interface DescriptiveEvidence {
  evidenceNote: string;
  sources: QuestionSource[];
}

const source = (
  title: string,
  url: string,
  publisher: string,
): QuestionSource => ({ title, url, publisher });

/** Evidence records for the scoped empirical rewrites in editorial v7. */
export const descriptiveEvidenceSecondPassById: Readonly<
  Record<string, DescriptiveEvidence>
> = {
  q0007: {
    evidenceNote:
      "Scope to U.S. metropolitan police-service studies summarized in Ostrom’s prize lecture: compare service output per input across metropolitan systems with more and fewer autonomous producers; the evidence does not imply that every service benefits from fragmentation.",
    sources: [
      source(
        "Prize lecture: Beyond Markets and States",
        "https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/",
        "Nobel Prize",
      ),
    ],
  },
  q0049: {
    evidenceNote:
      "Scope to the U.S. CERCLA and Superfund tax rules modeled in this study: compare pollution-control costs with the commodity-price changes attributable to the tax system; do not generalize the result to every pollution policy or market.",
    sources: [
      source(
        "Environmental Costs Paid by the Polluter or the Beneficiary? The Case of CERCLA and Superfund",
        "https://www.nber.org/papers/w4418",
        "National Bureau of Economic Research",
      ),
    ],
  },
  q0067: {
    evidenceNote:
      "Scope to SNAP recertification: compare assigned interview timing, successful recertification, and later return to the program; rapid return after procedural closure helps distinguish administrative burden from loss of eligibility.",
    sources: [
      source(
        "Program Recertification Costs: Evidence from SNAP",
        "https://www.nber.org/papers/w27311",
        "National Bureau of Economic Research",
      ),
    ],
  },
  q0168: {
    evidenceNote:
      "Scope to counterterrorism and national-security laws documented by the UN Special Rapporteur: identify vague speech offenses, the expression prosecuted, intent or violence thresholds, and effects on critics, journalists, activists, or minority groups.",
    sources: [
      source(
        "Impact of Measures to Address Terrorism and Violent Extremism on Civic Space and the Rights of Civil Society Actors and Human Rights Defenders",
        "https://www.ohchr.org/sites/default/files/Documents/Issues/Terrorism/SR/A_HRC_40_52_EN.pdf",
        "United Nations Human Rights Council",
      ),
    ],
  },
  q0207: {
    evidenceNote:
      "Scope to randomized intergroup-contact studies with outcomes measured at least one day later: the review finds qualified average prejudice reduction alongside substantial heterogeneity, limited adult racial or ethnic evidence, and weaker effects in several target categories.",
    sources: [
      source(
        "The Contact Hypothesis Re-evaluated",
        "https://www.cambridge.org/core/journals/behavioural-public-policy/article/contact-hypothesis-reevaluated/142C913E7FA9E121277B29E994124EC5",
        "Cambridge University Press",
      ),
    ],
  },
  q0208: {
    evidenceNote:
      "Scope to U.S. industry-level immigration and H-1B data linked to immigration-lobbying expenditures: compare migration barriers across sectors while distinguishing business and labor-group influence; the study reports associations and model-based inferences, not a universal rule.",
    sources: [
      source(
        "Do Interest Groups Affect Immigration?",
        "https://www.iza.org/en/publications/dp/3183/do-interest-groups-affect-immigration",
        "IZA Institute of Labor Economics",
      ),
    ],
  },
  q0210: {
    evidenceNote:
      "Scope to municipalities hosting large, rapid Syrian refugee inflows in Jordan, Lebanon, and the Kurdistan Region of Iraq: assess population change, existing service capacity, financing, staffing, infrastructure, backlogs, and host-community access.",
    sources: [
      source(
        "Coping with the Influx: Service Delivery to Syrian Refugees and Hosts in Jordan, Lebanon, and Kurdistan, Iraq",
        "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/585111595352295241/coping-with-the-influx-service-delivery-to-syrian-refugees-and-hosts-in-jordan-lebanon-and-kurdistan-iraq",
        "World Bank",
      ),
    ],
  },
  q0227: {
    evidenceNote:
      "Scope to paired-city studies of Hindu-Muslim violence in India: distinguish interethnic civic associations from associations organized mainly within one community and compare their relationship with episodes of communal violence; the cases do not establish a universal city-level law.",
    sources: [
      source(
        "Ethnic Conflict and Civil Society: India and Beyond",
        "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/2F8EEAACC16E9A8366A9914C0301F08D/S0043887100020165a.pdf/ethnic-conflict-and-civil-society-india-and-beyond.pdf",
        "Cambridge University Press",
      ),
    ],
  },
  q0329: {
    evidenceNote:
      "Scope to U.S. federal defense contracts around the spending increase after September 11: compare lobbying and other political connections with contract amounts while preserving the study’s warning that its data do not identify a causal link.",
    sources: [
      source(
        "The Lion’s Share: Evidence from Federal Contracts on the Value of Political Connections",
        "https://www.bis.org/publ/work1058.htm",
        "Bank for International Settlements",
      ),
    ],
  },
};

export function applyDescriptiveEvidenceSecondPass(
  question: Question,
): Question {
  const evidence = descriptiveEvidenceSecondPassById[String(question.id)];
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
