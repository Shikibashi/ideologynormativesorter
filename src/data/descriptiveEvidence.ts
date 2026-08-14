import type { Question, QuestionSource } from "../types";

export const DESCRIPTIVE_EVIDENCE_VERSION = "2026-08-descriptive-evidence-v1";

interface DescriptiveEvidence {
  evidenceNote: string;
  sources: QuestionSource[];
}

const source = (
  title: string,
  url: string,
  publisher: string,
): QuestionSource => ({ title, url, publisher });

/**
 * Public background for descriptive items with an operationally sourceable
 * scope. A source explains context; it neither supplies the respondent's
 * answer nor validates the question's psychometric behavior.
 */
export const descriptiveEvidenceById: Readonly<
  Record<string, DescriptiveEvidence>
> = {
  q0012: {
    evidenceNote:
      "General tendency in documented common-pool and polycentric settings: durable order is associated with explicit rules, monitoring, graduated sanctions, and accessible conflict-resolution arrangements, sometimes without one central sovereign.",
    sources: [
      source(
        "Prize lecture: Beyond Markets and States",
        "https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/",
        "Nobel Prize",
      ),
    ],
  },
  q0027: {
    evidenceNote:
      "Scope to land and resource-tenure systems: assess whether clearly documented use, possession, transfer, and dispute-resolution rules are associated with fewer overlapping claims and conflicts.",
    sources: [
      source(
        "Land Policies for Resilient and Equitable Growth in Africa",
        "https://www.worldbank.org/en/publication/land-policies-africa",
        "World Bank",
      ),
    ],
  },
  q0029: {
    evidenceNote:
      "General tendency across regulated markets: test whether political influence, licensing, exclusive rights, subsidies, or entry restrictions are associated with incumbent concentration after accounting for technology and scale.",
    sources: [
      source(
        "Preventing Policy Capture",
        "https://www.oecd.org/en/publications/preventing-policy-capture_9789264065239-en.html",
        "OECD",
      ),
      source(
        "Competition Assessment Toolkit, Volume 2",
        "https://www.oecd.org/en/publications/competition-assessment-toolkit-principles-version-4-0-volume-2_b6b938e9-en.html",
        "OECD",
      ),
    ],
  },
  q0030: {
    evidenceNote:
      "Scope to state-owned enterprises: ownership changes the principal and governance chain, but observed managerial hierarchy, board autonomy, disclosure, and accountability vary by institutional design.",
    sources: [
      source(
        "OECD Guidelines on Corporate Governance of State-Owned Enterprises 2024",
        "https://www.oecd.org/en/publications/2024/06/oecd-guidelines-on-corporate-governance-of-state-owned-enterprises-2024_68fa05cd/full-report.html",
        "OECD",
      ),
    ],
  },
  q0047: {
    evidenceNote:
      "General market-coordination tendency under decentralized exchange: prices aggregate dispersed supply-and-demand information, subject to market power, externalities, missing markets, and information failures.",
    sources: [
      source(
        "Prize lecture: The Pretence of Knowledge",
        "https://www.nobelprize.org/prizes/economic-sciences/1974/hayek/lecture/",
        "Nobel Prize",
      ),
    ],
  },
  q0048: {
    evidenceNote:
      "General knowledge constraint on centralized allocation: required local and changing information may be dispersed and costly to collect, so performance should be assessed in a specified sector and planning system.",
    sources: [
      source(
        "Prize lecture: The Pretence of Knowledge",
        "https://www.nobelprize.org/prizes/economic-sciences/1974/hayek/lecture/",
        "Nobel Prize",
      ),
      source(
        "Prize lecture: Beyond Markets and States",
        "https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/",
        "Nobel Prize",
      ),
    ],
  },
  q0050: {
    evidenceNote:
      "General regulatory-risk tendency: where agencies depend heavily on regulated firms for technical data or expertise, evaluate disclosure, independent verification, stakeholder balance, and capture safeguards.",
    sources: [
      source(
        "Preventing Policy Capture",
        "https://www.oecd.org/en/publications/preventing-policy-capture_9789264065239-en.html",
        "OECD",
      ),
    ],
  },
  q0089: {
    evidenceNote:
      "Scope to U.S. occupational licensing: compare entry, employment, wages, prices, quality, and consumer satisfaction across licensed and less-restricted markets.",
    sources: [
      source(
        "A Welfare Analysis of Occupational Licensing in U.S. States",
        "https://www.nber.org/papers/w26383",
        "National Bureau of Economic Research",
      ),
      source(
        "Occupational Licensing and Labor Market Fluidity",
        "https://www.nber.org/papers/w27568",
        "National Bureau of Economic Research",
      ),
    ],
  },
  q0107: {
    evidenceNote:
      "Scope to metropolitan housing markets: compare permitted density, infrastructure capacity, approval time, completions, prices, and displacement; density enables supply only where projects can actually be built.",
    sources: [
      source(
        "The Impact of Zoning on Housing Affordability",
        "https://www.nber.org/papers/w8835",
        "National Bureau of Economic Research",
      ),
    ],
  },
  q0108: {
    evidenceNote:
      "Scope to local land-use decisions: compare who participates, which projects are approved, permitted unit counts, and price or exclusion effects across discretionary and by-right systems.",
    sources: [
      source(
        "The Impact of Zoning on Housing Affordability",
        "https://www.nber.org/papers/w8835",
        "National Bureau of Economic Research",
      ),
      source(
        "World Development Report 2017: Governance and the Law",
        "https://www.worldbank.org/en/publication/wdr2017",
        "World Bank",
      ),
    ],
  },
  q0127: {
    evidenceNote:
      "Scope to historical or contemporary private-note and digital-currency systems with redeemability and low switching costs; examine issuer entry, redemption, failures, runs, and price stability.",
    sources: [
      source(
        "Can Currency Competition Work?",
        "https://www.nber.org/papers/w22157",
        "National Bureau of Economic Research",
      ),
      source(
        "A Brief History of Bank Notes in the United States and Lessons for Stablecoins",
        "https://www.federalreserve.gov/econres/notes/feds-notes/a-brief-history-of-bank-notes-in-the-united-states-and-some-lessons-for-stablecoins-20260206.html",
        "Federal Reserve Board",
      ),
    ],
  },
  q0128: {
    evidenceNote:
      "Scope to contemporary advanced-economy monetary transmission: trace policy changes through asset prices, mortgages, bank credit, employment, and household balance sheets by income and asset ownership.",
    sources: [
      source(
        "Distributional Footprints of Monetary Policy",
        "https://www.bis.org/publ/arpdf/ar2021e2.htm",
        "Bank for International Settlements",
      ),
    ],
  },
  q0130: {
    evidenceNote:
      "Scope to a named financial jurisdiction and rule set: estimate fixed and recurring compliance costs by firm size, entry and exit rates, concentration, and consumer-risk outcomes.",
    sources: [
      source(
        "Financial Sector Policy and Regulation",
        "https://digitalfinance.worldbank.org/topics/competition/financial-sector-policy-and-regulation",
        "World Bank",
      ),
      source(
        "Time for a Regulatory Reset",
        "https://www.oecd.org/en/publications/oecd-economic-outlook-volume-2025-issue-2_9f653ca1-en/full-report/time-for-a-regulatory-reset_90ca6147.html",
        "OECD",
      ),
    ],
  },
  q0147: {
    evidenceNote:
      "General tendency in technical markets: test whether open, interoperable standards and accessible knowledge reduce switching or integration costs and are associated with entry, complementary products, and diffusion.",
    sources: [
      source(
        "Principles for Effective Domestic and International Standards Development",
        "https://www.nist.gov/speech-testimony/promoting-innovation-competition-and-economic-growth-principles-effective-domestic",
        "National Institute of Standards and Technology",
      ),
    ],
  },
  q0148: {
    evidenceNote:
      "Scope to patent-intensive sectors: distinguish patents held for product commercialization, licensing, cross-licensing, litigation deterrence, and defensive portfolio strategies.",
    sources: [
      source(
        "The Evolving IP Marketplace: Aligning Patent Notice and Remedies With Competition",
        "https://www.ftc.gov/reports/evolving-ip-marketplace-aligning-patent-notice-remedies-competition",
        "U.S. Federal Trade Commission",
      ),
      source(
        "Patent Assertion Entity Activity: An FTC Study",
        "https://www.ftc.gov/reports/patent-assertion-entity-activity-ftc-study",
        "U.S. Federal Trade Commission",
      ),
    ],
  },
  q0171: {
    evidenceNote:
      "Scope to formally declared emergencies: record sunset clauses, renewals, legislative and judicial review, and which restrictions or delegated powers remain after the triggering conditions end.",
    sources: [
      source(
        "Respect for Democracy, Human Rights and the Rule of Law during States of Emergency",
        "https://www.venice.coe.int/webforms/documents/default.aspx?pdffile=CDL-AD%282020%29014-e",
        "Venice Commission",
      ),
      source(
        "Global State of Democracy Report 2021",
        "https://www.idea.int/gsod-2021/global-report/",
        "International IDEA",
      ),
    ],
  },
  q0188: {
    evidenceNote:
      "Scope to police agencies: distinguish activity outputs such as stops, arrests, clearances, and response time from outcomes such as victimization, perceived safety, legitimacy, and public trust.",
    sources: [
      source(
        "Revisiting Measuring What Matters",
        "https://ojp.gov/library/publications/revisiting-measuring-what-matters-developing-suite-standardized-performance",
        "U.S. Office of Justice Programs",
      ),
    ],
  },
  q0190: {
    evidenceNote:
      "Scope to U.S. federal and participating state or local forfeiture programs: report seizure value, fund flows, equitable-sharing receipts, budget dependence, notice, contest rates, and case outcomes.",
    sources: [
      source(
        "Oversight of Cash Seizure and Forfeiture Activities",
        "https://oig.justice.gov/news/doj-oig-releases-report-dojs-oversight-cash-seizure-and-forfeiture-activities",
        "U.S. Department of Justice Office of Inspector General",
      ),
      source(
        "Assets Forfeiture Fund",
        "https://www.justice.gov/afp/assets-forfeiture-fund-aff",
        "U.S. Department of Justice",
      ),
    ],
  },
  q0191: {
    evidenceNote:
      "Scope to U.S. plea systems: measure charge and sentence differentials, detention status, counsel resources, plea rates, trial waivers, Alford pleas, and later exonerations.",
    sources: [
      source(
        "2023 Plea Bargain Task Force Report",
        "https://www.americanbar.org/news/abanews/aba-news-archives/2023/02/plea-bargain-task-force/",
        "American Bar Association",
      ),
    ],
  },
  q0248: {
    evidenceNote:
      "Scope to jurisdictions where religious doctrine has formal legal status or clerical adjudicative authority: record which disputes become enforceable legal rules and effects on minority faiths or dissenters.",
    sources: [
      source(
        "Many Countries Favor Specific Religions, Officially or Unofficially",
        "https://www.pewresearch.org/religious-landscape-study/2017/10/03/many-countries-favor-specific-religions-officially-or-unofficially/",
        "Pew Research Center",
      ),
    ],
  },
  q0269: {
    evidenceNote:
      "Scope to a specified tax-benefit or family-policy system: compare eligibility and net transfers across married, cohabiting, single-parent, multigenerational, and other household types.",
    sources: [
      source(
        "Evaluation of the Tax-Transfer Treatment of Married Couples",
        "https://www.oecd.org/en/publications/an-evaluation-of-the-tax-transfer-treatment-of-married-couples-in-european-countries_227200406151.html",
        "OECD",
      ),
    ],
  },
  q0307: {
    evidenceNote:
      "Scope to identifiable pollution under a specified liability regime: measure responsible-party identification, enforcement, cleanup, compensation, delay, and residual harms.",
    sources: [
      source(
        "Finding Potentially Responsible Parties",
        "https://www.epa.gov/enforcement/finding-potentially-responsible-parties-prp",
        "U.S. Environmental Protection Agency",
      ),
    ],
  },
  q0308: {
    evidenceNote:
      "Scope to a named command-and-control environmental rule: estimate fixed compliance cost, firm-size incidence, entry and exit, concentration, emissions, and alternative policy outcomes.",
    sources: [
      source(
        "Indicators of the Economic Burdens of Environmental Policy Design",
        "https://www.oecd.org/en/publications/the-indicators-of-the-economic-burdens-of-environmental-policy-design_5jxrjnbnbm8v-en.html",
        "OECD",
      ),
      source(
        "Competition Assessment Toolkit, Volume 2",
        "https://www.oecd.org/en/publications/competition-assessment-toolkit-principles-version-4-0-volume-2_b6b938e9-en.html",
        "OECD",
      ),
    ],
  },
  q0328: {
    evidenceNote:
      "Scope to reconstruction or intervention programs in specified conflicts: compare project design with local political, security, and institutional knowledge, local buy-in, unintended effects, and adaptation.",
    sources: [
      source(
        "Lessons from the Coalition: International Experiences from the Afghanistan Reconstruction",
        "https://www.sigar.mil/Reports/Article-Display/Article/4020346/lessons-from-the-coalition-international-experiences-from-the-afghanistan-recon/",
        "Special Inspector General for Afghanistan Reconstruction",
      ),
    ],
  },
  q0348: {
    evidenceNote:
      "Scope to eligible voters in a named election: measure policy knowledge and information acquisition by issue salience, voting incentives, media exposure, and participation rules.",
    sources: [
      source(
        "The Effect of Electoral Institutions on Political Knowledge",
        "https://www.aeaweb.org/articles?id=10.1257%2Fpol.6.4.380",
        "American Economic Association",
      ),
    ],
  },
  q0350: {
    evidenceNote:
      "Scope to identified backsliding episodes: code formal and informal weakening of courts, legislatures, election bodies, term limits, media protections, and other checks by actors controlling government.",
    sources: [
      source(
        "Designing Resistance: Democratic Institutions and the Threat of Backsliding",
        "https://www.idea.int/publications/catalogue/designing-resistance-democratic-institutions-and-threat-backsliding",
        "International IDEA",
      ),
    ],
  },
  q0368: {
    evidenceNote:
      "Scope to named surveillance technologies and agencies: compare authorized purpose, actual uses, data sharing, retention, warrants, audits, and later expansion across programs and time.",
    sources: [
      source(
        "Facial Recognition Services: Federal Law Enforcement Agencies Should Take Actions to Implement Training, and Policies for Civil Liberties",
        "https://www.gao.gov/products/gao-25-107302",
        "U.S. Government Accountability Office",
      ),
    ],
  },
};

export function applyDescriptiveEvidence(question: Question): Question {
  const evidence = descriptiveEvidenceById[String(question.id)];
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
