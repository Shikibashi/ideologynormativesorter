import type { Question, QuestionSource } from "../types";

export const SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION =
  "2026-08-specialist-descriptive-v3";

interface SpecialistDescriptiveEvidence {
  evidenceNote: string;
  sources: QuestionSource[];
}

const source = (
  title: string,
  url: string,
  publisher: string,
): QuestionSource => ({
  title,
  url,
  publisher,
});

/**
 * Operational scope for the descriptive items in the respondent-facing
 * specialist modules. These records narrow the claims without changing their
 * wording, local construct weights, or global compatibility weights.
 */
export const specialistDescriptiveEvidenceById: Readonly<
  Record<string, SpecialistDescriptiveEvidence>
> = {
  "fm-fem-2": {
    evidenceNote:
      "Scope to cross-national comparisons such as the World Bank Women, Business and the Law 2024 study of 190 economies: distinguish formal legal rules from implementation systems and observed outcomes in safety, childcare, pay enforcement, and economic participation. The evidence does not create one universal measure of male dominance across every institution or relationship.",
    sources: [
      source(
        "Women, Business and the Law 2024",
        "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099110624115537381",
        "World Bank",
      ),
      source(
        "Care work and care jobs for the future of decent work",
        "https://www.ilo.org/publications/major-publications/care-work-and-care-jobs-future-decent-work",
        "International Labour Organization",
      ),
    ],
  },
  "fm-fem-4": {
    evidenceNote:
      "Scope to time-use and labour-market studies summarized by the ILO across countries: compare women’s and men’s unpaid care and household-work hours with labour-force participation, employment, earnings, and progression. Treat unpaid care, household labour, and the organization of paid work as related but separately measured mechanisms rather than one universal causal coefficient.",
    sources: [
      source(
        "Care work and care jobs for the future of decent work",
        "https://www.ilo.org/publications/major-publications/care-work-and-care-jobs-future-decent-work",
        "International Labour Organization",
      ),
      source(
        "The unpaid care work and the labour market",
        "https://www.ilo.org/publications/unpaid-care-work-and-labour-market-analysis-time-use-data-based-latest",
        "International Labour Organization",
      ),
    ],
  },
  "fm-id-13": {
    evidenceNote:
      "Scope to Indigenous peoples in countries with colonial or settler histories: compare formal citizenship and voting rights with recognition and implementation of collective land and territory rights, participation in decisions affecting traditional lands, treaty or consultation practice, and documented dispossession or forced relocation. The claim concerns institutional continuity, not every Indigenous experience or one global causal estimate.",
    sources: [
      source(
        "Indigenous Peoples at the United Nations",
        "https://www.un.org/development/desa/indigenouspeoples/about-us-html",
        "United Nations Department of Economic and Social Affairs",
      ),
      source(
        "Understanding the Indigenous and Tribal Peoples Convention",
        "https://www.ilo.org/publications/understanding-indigenous-and-tribal-peoples-convention",
        "International Labour Organization",
      ),
    ],
  },
  "fm-an-2": {
    evidenceNote:
      "Scope to the institutional conditions under which market exchange and private coordination use dispersed information, including property rules, contract enforcement, infrastructure, and public goods. The claim does not say that markets are self-sufficient, that every market is competitive, or that decentralized exchange removes all state or corporate power; market performance varies by sector and institutional design.",
    sources: [
      source(
        "Markets",
        "https://plato.stanford.edu/entries/markets/",
        "Stanford Encyclopedia of Philosophy",
      ),
      source(
        "Anarchism",
        "https://plato.stanford.edu/entries/anarchism/",
        "Stanford Encyclopedia of Philosophy",
      ),
    ],
  },
  "fm-so-2": {
    evidenceNote:
      "Scope to proposals and historical debates about democratic or participatory planning in which workers, consumers, or public institutions coordinate production through deliberation, negotiated plans, or computational tools. The claim does not equate democratic planning with centralized command, imply that planning always outperforms markets, or settle the information, incentive, and accountability tradeoffs across sectors.",
    sources: [
      source(
        "Socialism",
        "https://plato.stanford.edu/archives/fall2025/entries/socialism/",
        "Stanford Encyclopedia of Philosophy",
      ),
      source(
        "A Brief Sketch of Four Models of Democratic Economic Planning",
        "https://academic.oup.com/policy-press-scholarship-online/book/61193/chapter/532422630",
        "Oxford Academic",
      ),
    ],
  },
  "fm-te-3": {
    evidenceNote:
      "Scope to technical and governance mechanisms rather than a universal political outcome: cryptography can provide confidentiality, integrity, and authentication, while distributed networks can change how trust and coordination are organized. The claim does not establish that such tools eliminate intermediaries, equalize control, or produce democratic decentralization in every deployment.",
    sources: [
      source(
        "Guideline for Using Cryptographic Standards in the Federal Government: Cryptographic Mechanisms",
        "https://csrc.nist.gov/pubs/sp/800/175/b/r1/final",
        "National Institute of Standards and Technology",
      ),
      source(
        "Decentralized Network Governance: Blockchain Technology and the Future of Regulation",
        "https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2020.00012/full",
        "Frontiers in Blockchain",
      ),
    ],
  },
};

export function applySpecialistDescriptiveEvidence(
  question: Question,
): Question {
  const evidence = specialistDescriptiveEvidenceById[String(question.id)];
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
