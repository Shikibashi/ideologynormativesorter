import type { Question, QuestionSource, Layer } from "../types";
import { domainById } from "./domains";

/**
 * Context coverage is intentionally an effective-bank overlay. It gives every
 * active public or specialist item a neutral construct frame and source trail
 * without editing the scored question objects themselves.
 */
export const QUESTION_CONTEXT_VERSION = "2026-08-question-context-v33";

const SPECIALIST_MODULE_IDS = new Set([
  "feminist-faction-module",
  "identity-sovereignty-module",
  "anarchist-families-module",
  "green-morphology-module",
  "socialist-families-module",
  "conservative-variants-module",
  "religious-national-politics-module",
  "technology-governance-module",
  "monarchist-municipal-module",
]);

export const questionContextSources: Readonly<Record<string, QuestionSource>> =
  {
    authority: {
      title: "Authority",
      url: "https://plato.stanford.edu/entries/authority/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    politicalObligation: {
      title: "Political Obligation",
      url: "https://plato.stanford.edu/entries/political-obligation/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    property: {
      title: "Property and Ownership",
      url: "https://plato.stanford.edu/entries/property/index.html",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    distributiveJustice: {
      title: "Distributive Justice",
      url: "https://plato.stanford.edu/entries/justice-distributive/index.html",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    housingSupply: {
      title: "The Impact of Zoning on Housing Affordability",
      url: "https://www.nber.org/papers/w8835",
      publisher: "National Bureau of Economic Research",
    },
    housingSupplyAffordability: {
      title: "Housing Supply and Housing Affordability",
      url: "https://www.nber.org/papers/w33694",
      publisher: "National Bureau of Economic Research",
    },
    housingDemandSubsidies: {
      title: "Do Low-Income Housing Subsidies Increase Housing Consumption?",
      url: "https://www.nber.org/papers/w8709",
      publisher: "National Bureau of Economic Research",
    },
    markets: {
      title: "Markets",
      url: "https://plato.stanford.edu/entries/markets/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    socialism: {
      title: "Socialism",
      url: "https://plato.stanford.edu/archives/fall2025/entries/socialism/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    labour: {
      title: "Collective bargaining and labour relations",
      url: "https://www.ilo.org/topics-and-sectors/collective-bargaining-and-labour-relations",
      publisher: "International Labour Organization",
    },
    careWork: {
      title: "Care work and care jobs for the future of decent work",
      url: "https://www.ilo.org/publications/care-work-and-care-jobs-future-decent-work-summary",
      publisher: "International Labour Organization",
    },
    occupationalLicensingEntry: {
      title: "How Much of Barrier to Entry is Occupational Licensing?",
      url: "https://www.nber.org/papers/w25262",
      publisher: "National Bureau of Economic Research",
    },
    employeeGovernance: {
      title: "Employee Governance and the Ownership of the Firm",
      url: "https://www.cambridge.org/core/journals/business-ethics-quarterly/article/abs/employee-governance-and-the-ownership-of-the-firm/F95BA42AF5F782A9BC16FC96FF6375F1",
      publisher: "Cambridge University Press",
    },
    structuralDomination: {
      title: "Structural Domination and Freedom in the Labor Market",
      url: "https://www.cambridge.org/core/journals/american-political-science-review/article/structural-domination-and-freedom-in-the-labor-market-from-voluntariness-to-independence/15DE09962D69039C60D94AE163381C72",
      publisher: "Cambridge University Press",
    },
    labourRights: {
      title: "ILO Helpdesk: Business and collective bargaining",
      url: "https://www.ilo.org/resource/other/ilo-helpdesk-business-and-collective-bargaining",
      publisher: "International Labour Organization",
    },
    freedomAssociation: {
      title: "Freedom of association",
      url: "https://www.ilo.org/topics-and-sectors/freedom-association",
      publisher: "International Labour Organization",
    },
    employmentRelationship: {
      title: "R198 Employment Relationship Recommendation, 2006",
      url: "https://www.ilo.org/resource/other/r198-employment-relationship-recommendation-2006",
      publisher: "International Labour Organization",
    },
    cooperativesWorkRights: {
      title: "Cooperatives and the Fundamental Principles and Rights at Work",
      url: "https://www.ilo.org/publications/cooperatives-and-fundamental-principles-and-rights-work-cooperatives-and-0",
      publisher: "International Labour Organization",
    },
    workerCooperatives: {
      title: "Worker cooperatives",
      url: "https://www.ilo.org/worker-cooperatives",
      publisher: "International Labour Organization",
    },
    monetaryPolicy: {
      title: "The Fed Explained: Monetary Policy",
      url: "https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm",
      publisher: "Board of Governors of the Federal Reserve System",
    },
    bankResolution: {
      title:
        "Key Attributes of Effective Resolution Regimes for Financial Institutions",
      url: "https://www.fsb.org/2014/10/key-attributes-of-effective-resolution-regimes-for-financial-institutions-3/",
      publisher: "Financial Stability Board",
    },
    bankFailureResolution: {
      title: "Failing Bank Resolutions",
      url: "https://www.fdic.gov/resources/resolutions",
      publisher: "Federal Deposit Insurance Corporation",
    },
    privateMoneyPayments: {
      title: "Private money and central bank money as payments go digital",
      url: "https://www.federalreserve.gov/newsevents/speech/brainard20210524a.htm",
      publisher: "Board of Governors of the Federal Reserve System",
    },
    intellectualProperty: {
      title: "Intellectual property",
      url: "https://www.wipo.int/about-ip/en/",
      publisher: "World Intellectual Property Organization",
    },
    civilPoliticalRights: {
      title: "International Covenant on Civil and Political Rights",
      url: "https://2covenants.ohchr.org/About-ICCPR.html",
      publisher: "United Nations Human Rights",
    },
    iccprPrivacy: {
      title: "Human Rights Committee General Comment No. 16 (Article 17)",
      url: "https://docstore.ohchr.org/SelfServices/FilesHandler.ashx?enc=NDHbUvPo0H0e6ReM%2BeoASfvbY3aH6JttLpsRvkmL87wD80W4xnAiRpmKA6ZLwTp9xzCLNUYwTBP35uH1Fw6yqQ%3D%3D",
      publisher: "United Nations Human Rights Committee",
    },
    pleaInnocenceEffect: {
      title: "The Innocence Effect",
      url: "https://scholarship.law.duke.edu/dlj/vol62/iss2/3/",
      publisher: "Duke Law Journal",
    },
    pleaMiscarriageJustice: {
      title: "Plea Bargaining and the Miscarriage of Justice",
      url: "https://link.springer.com/article/10.1007/s10940-019-09441-w",
      publisher: "Journal of Quantitative Criminology / Springer Nature",
    },
    openStandardsDigitalInnovation: {
      title: "Stimulating digital innovation for growth and inclusiveness",
      url: "https://www.oecd.org/en/publications/stimulating-digital-innovation-for-growth-and-inclusiveness_5jlwqvhg3l31-en.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    openStandardsCompetition: {
      title:
        "Data Portability, Interoperability and Digital Platform Competition",
      url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/10/data-portability-interoperability-and-competition_f09a402e/73a083a9-en.pdf",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    copyrightLimitations: {
      title: "Limitations and Exceptions",
      url: "https://www.wipo.int/en/web/copyright/limitations/index",
      publisher: "World Intellectual Property Organization",
    },
    patentExceptions: {
      title: "Exceptions and Limitations to Patent Rights",
      url: "https://www.wipo.int/en/web/patents/topics/exceptions_limitations",
      publisher: "World Intellectual Property Organization",
    },
    patentRightsEnforcement: {
      title: "Managing a patent",
      url: "https://www.uspto.gov/patents/basics/manage",
      publisher: "United States Patent and Trademark Office",
    },
    religionOfficialStatus: {
      title:
        "Many Countries Favor Specific Religions, Officially or Unofficially",
      url: "https://www.pewresearch.org/religion/2017/10/03/many-countries-favor-specific-religions-officially-or-unofficially/",
      publisher: "Pew Research Center",
    },
    religionRestrictions: {
      title:
        "A Closer Look at How Religious Restrictions Have Risen Around the World",
      url: "https://www.pewresearch.org/religion/2019/07/15/a-closer-look-at-how-religious-restrictions-have-risen-around-the-world/",
      publisher: "Pew Research Center",
    },
    superfundLiability: {
      title: "Superfund Liability",
      url: "https://www.epa.gov/enforcement/superfund-liability",
      publisher: "U.S. Environmental Protection Agency",
    },
    superfundEnforcement: {
      title: "Superfund Enforcement",
      url: "https://www.epa.gov/enforcement/superfund-enforcement",
      publisher: "U.S. Environmental Protection Agency",
    },
    gaoFacialRecognitionPrivacy: {
      title:
        "Facial Recognition Services: Federal Law Enforcement Agencies Should Take Actions to Implement Training, and Policies for Civil Liberties",
      url: "https://www.gao.gov/products/gao-25-107302",
      publisher: "U.S. Government Accountability Office",
    },
    liberalism: {
      title: "Liberalism",
      url: "https://plato.stanford.edu/entries/liberalism/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    legalPunishment: {
      title: "Legal Punishment",
      url: "https://plato.stanford.edu/entries/legal-punishment/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    immigration: {
      title: "Immigration",
      url: "https://plato.stanford.edu/archives/win2024/entries/immigration/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    refugeeConvention: {
      title: "The 1951 Refugee Convention",
      url: "https://www.unhcr.org/about-unhcr/overview/1951-refugee-convention",
      publisher: "UNHCR",
    },
    nationalism: {
      title: "Nationalism",
      url: "https://plato.stanford.edu/entries/nationalism/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    ethnonationalism: {
      title: "Ethnonationalism",
      url: "https://doi.org/10.1002/9781118663202.wberen301",
      publisher:
        "The Wiley-Blackwell Encyclopedia of Race, Ethnicity, and Nationalism",
    },
    secularism: {
      title: "Religion and Political Theory",
      url: "https://plato.stanford.edu/entries/religion-politics/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    theocracySecularism: {
      title: "Secularism in Political Philosophy",
      url: "https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223",
      publisher: "Oxford Research Encyclopedia of Politics",
    },
    islamicConstitutionalism: {
      title:
        "Constitutional Interpretation and Constitutionalism in the Arab World",
      url: "https://academic.oup.com/icon/article/11/3/615/789556",
      publisher: "International Journal of Constitutional Law",
    },
    islamicDemocracy: {
      title: "Constitutionalism, Judiciary, and Democracy in Islamic Societies",
      url: "https://doi.org/10.1057/palgrave.polity.2300086",
      publisher: "Polity / University of Chicago Press",
    },
    cambridgeIslamicConstitutionalism2023: {
      title: "Islamic Constitutionalism",
      url: "https://www.cambridge.org/core/books/abs/democracy-under-god/islamic-constitutionalism/3C82791964D0B1824113F0AC38CEDD1B",
      publisher: "Cambridge University Press",
    },
    oxfordHindutvaDefinitions: {
      title: "Hindutva, Hindu Organizations, and the Hindu Diasporas",
      url: "https://academic.oup.com/book/47098/chapter-abstract/416165265",
      publisher: "Oxford University Press",
    },
    cambridgeZionismHistory: {
      title: "Zionism",
      url: "https://www.cambridge.org/core/books/abs/cambridge-history-of-jewish-philosophy/zionism/27CF65008422154713C1885CB5EFDE3C",
      publisher: "Cambridge University Press",
    },
    cambridgeZionismLabour: {
      title:
        "In the Name of Socialism: Zionism and European Social Democracy in the Inter-War Years",
      url: "https://www.cambridge.org/core/journals/international-review-of-social-history/article/in-the-name-of-socialism-zionism-and-european-social-democracy-in-the-interwar-years/8B3D3F22827E7E6D8B2963870C68E09E",
      publisher:
        "International Review of Social History / Cambridge University Press",
    },
    islamicPartyCompetition: {
      title:
        "From Islamists to Muslim Democrats: The Case of Tunisia’s Ennahda",
      url: "https://www.cambridge.org/core/journals/american-political-science-review/article/abs/from-islamists-to-muslim-democrats-the-case-of-tunisias-ennahda/C0D3D82CA222E3C28B108B28ED5A4DD4",
      publisher:
        "American Political Science Review / Cambridge University Press",
    },
    multiculturalism: {
      title: "Multiculturalism",
      url: "https://plato.stanford.edu/entries/multiculturalism/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    feministPolitics: {
      title: "Feminist Political Philosophy",
      url: "https://plato.stanford.edu/entries/feminism-political/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    feministEthics: {
      title: "Feminist Ethics",
      url: "https://plato.stanford.edu/entries/feminism-ethics/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    environmentalEthics: {
      title: "Environmental Ethics",
      url: "https://plato.stanford.edu/entries/ethics-environmental/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    climateAssessment: {
      title: "Climate Change 2023: Synthesis Report",
      url: "https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_FullVolume.pdf",
      publisher: "Intergovernmental Panel on Climate Change",
    },
    war: {
      title: "War",
      url: "https://plato.stanford.edu/entries/war/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    unCharter: {
      title: "United Nations Charter: full text",
      url: "https://www.un.org/en/about-us/un-charter/full-text",
      publisher: "United Nations",
    },
    democracy: {
      title: "Democracy",
      url: "https://plato.stanford.edu/entries/democracy/index.html",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    electoralJustice: {
      title:
        "Electoral Justice: An Overview of the International IDEA Handbook",
      url: "https://www.idea.int/sites/default/files/publications/chapters/electoral-justice-handbook/electoral-justice-handbook-overview.pdf",
      publisher: "International IDEA",
    },
    referendumSafeguards: {
      title: "Revised Code of Good Practice on Referendums",
      url: "https://www.venice.coe.int/webforms/documents/?pdf=CDL-AD%282022%29015-e",
      publisher:
        "European Commission for Democracy through Law (Venice Commission)",
    },
    regulatorGovernance: {
      title:
        "Governance of Regulators' Practices: Accountability, Transparency and Co-ordination",
      url: "https://www.oecd.org/en/publications/governance-of-regulators-practices_9789264255388-en.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    regulatorAppeals: {
      title: "OECD Regulatory Enforcement and Inspections Toolkit",
      url: "https://www.oecd.org/en/publications/oecd-regulatory-enforcement-and-inspections-toolkit_9789264303959-en/full-report/component-11.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    aiEthics: {
      title: "Ethics of Artificial Intelligence and Robotics",
      url: "https://plato.stanford.edu/entries/ethics-ai/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    aiRisk: {
      title: "AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework",
      publisher: "National Institute of Standards and Technology",
    },
    cryptography: {
      title:
        "Guideline for Using Cryptographic Standards in the Federal Government: Cryptographic Mechanisms",
      url: "https://csrc.nist.gov/pubs/sp/800/175/b/r1/final",
      publisher: "National Institute of Standards and Technology",
    },
    decentralizedNetworkGovernance: {
      title:
        "Decentralized Network Governance: Blockchain Technology and the Future of Regulation",
      url: "https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2020.00012/full",
      publisher: "Frontiers in Blockchain",
    },
    accelerationism: {
      title: "Editorial Introduction: Accelerationism and the Left",
      url: "https://www.tandfonline.com/doi/full/10.1080/0969725X.2019.1568729",
      publisher: "Angelaki / Taylor & Francis",
    },
    federalism: {
      title: "Federalism",
      url: "https://plato.stanford.edu/entries/federalism/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    democraticConfederalism: {
      title: "Democratic Confederalism",
      url: "https://www.uplopen.com/books/m/10.1515/9783839472736",
      publisher: "University Press Library Open",
    },
    civilDisobedience: {
      title: "Civil Disobedience",
      url: "https://plato.stanford.edu/archives/fall2025/entries/civil-disobedience/",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    revolution: {
      title: "Revolution",
      url: "https://plato.stanford.edu/entries/revolution/index.html",
      publisher: "Stanford Encyclopedia of Philosophy",
    },
    emergencyPowers: {
      title: "Emergency Powers",
      url: "https://www.idea.int/publications/catalogue/emergency-powers",
      publisher: "International IDEA",
    },
    climateDecoupling: {
      title: "Climate Change 2022: Mitigation of Climate Change, Chapter 2",
      url: "https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-2/",
      publisher: "Intergovernmental Panel on Climate Change",
    },
    intergroupContactUpdated: {
      title: "The Contact Hypothesis Re-evaluated",
      url: "https://www.cambridge.org/core/journals/behavioural-public-policy/article/contact-hypothesis-reevaluated/142C913E7FA9E121277B29E994124EC5",
      publisher: "Cambridge University Press",
    },
    intergroupContactMetaAnalysis: {
      title: "A Meta-Analytic Test of Intergroup Contact Theory",
      url: "https://pubmed.ncbi.nlm.nih.gov/16737372/",
      publisher: "Psychological Bulletin / PubMed",
    },
    polycentricGovernance: {
      title: "Prize lecture: Beyond Markets and States",
      url: "https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/",
      publisher: "Nobel Prize",
    },
    snapRecertification: {
      title: "Program Recertification Costs: Evidence from SNAP",
      url: "https://www.nber.org/papers/w27311",
      publisher: "National Bureau of Economic Research",
    },
    afghanistanReconstruction: {
      title:
        "Lessons from the Coalition: International Experiences from the Afghanistan Reconstruction",
      url: "https://www.sigar.mil/Portals/147/Files/Reports/Lessons-Learned/SIGAR-16-59-LL.pdf",
      publisher: "Special Inspector General for Afghanistan Reconstruction",
    },
    landTenure: {
      title: "Land Policies for Resilient and Equitable Growth in Africa",
      url: "https://www.worldbank.org/en/publication/land-policies-africa",
      publisher: "World Bank",
    },
    stateOwnedGovernance: {
      title:
        "OECD Guidelines on Corporate Governance of State-Owned Enterprises 2024",
      url: "https://www.oecd.org/en/publications/2024/06/oecd-guidelines-on-corporate-governance-of-state-owned-enterprises-2024_68fa05cd/full-report.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    marketsKnowledge: {
      title: "Prize lecture: The Pretence of Knowledge",
      url: "https://www.nobelprize.org/prizes/economic-sciences/1974/hayek/lecture/",
      publisher: "Nobel Prize",
    },
    patentStrategies: {
      title:
        "The Evolving IP Marketplace: Aligning Patent Notice and Remedies With Competition",
      url: "https://www.ftc.gov/reports/evolving-ip-marketplace-aligning-patent-notice-remedies-competition",
      publisher: "U.S. Federal Trade Commission",
    },
    policePerformance: {
      title: "Implementing an Agency-Level Performance Measurement System",
      url: "https://www.ojp.gov/library/publications/implementing-agency-level-performance-measurement-system-guide-law-enforcement",
      publisher: "U.S. Office of Justice Programs",
    },
    forfeitureFunding: {
      title: "Equitable Sharing Program",
      url: "https://www.justice.gov/criminal/criminal-mnf/equitable-sharing-program",
      publisher: "U.S. Department of Justice",
    },
    householdTypologies: {
      title: "Benefit Coverage Rates and Household Typologies",
      url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2004/12/benefit-coverage-rates-and-household-typologies_g17a169d/081036000058.pdf",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    environmentalComplianceCosts: {
      title:
        "Do Environmental Regulations Disproportionately Affect Small Businesses?",
      url: "https://www.epa.gov/sites/default/files/2014-12/documents/do_environmental_regulations_disproportionately_affect_small_businesses.pdf",
      publisher: "U.S. Environmental Protection Agency",
    },
    regulatoryInformationAsymmetry: {
      title: "Regulatory Policy in Perspective",
      url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2015/10/regulatory-policy-in-perspective_g1g596f4/9789264241800-en.pdf",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    occupationalLicensingWelfare: {
      title: "A Welfare Analysis of Occupational Licensing in U.S. States",
      url: "https://www.nber.org/papers/w26383",
      publisher: "National Bureau of Economic Research",
    },
    occupationalLicensingSafety: {
      title: "The Effect of Occupational Licensing on Consumer Welfare",
      url: "https://www.nber.org/papers/w22456",
      publisher: "National Bureau of Economic Research",
    },
    distributionalMonetaryPolicy: {
      title: "The distributional footprint of monetary policy",
      url: "https://www.bis.org/publ/arpdf/ar2021e2.htm",
      publisher: "Bank for International Settlements",
    },
    financialEntryBarriers: {
      title: "Licensing, transparency and preventing barriers to entry",
      url: "https://digitalfinance.worldbank.org/topics/competition/licensing-transparency-and-preventing-barriers-entry",
      publisher: "World Bank",
    },
    financialEntryLicensing: {
      title: "Controlling entry: registration and licensing",
      url: "https://digitalfinance.worldbank.org/topics/digital-credit/controlling-entry-registration-and-licensing",
      publisher: "World Bank",
    },
    paymentSystemIntegrity: {
      title: "Central banks and payments in the digital era",
      url: "https://www.bis.org/publ/arpdf/ar2020e3.htm",
      publisher: "Bank for International Settlements",
    },
    iceEnforcementStatistics: {
      title: "ICE Enforcement and Removal Operations Statistics",
      url: "https://www.ice.gov/spotlight/statistics",
      publisher: "U.S. Immigration and Customs Enforcement",
    },
    policyCapture: {
      title: "Preventing Policy Capture",
      url: "https://www.oecd.org/en/publications/preventing-policy-capture_9789264065239-en.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    competitionAssessment: {
      title: "Competition Assessment Toolkit, Volume 2",
      url: "https://www.oecd.org/en/publications/competition-assessment-toolkit-principles-version-4-0-volume-2_b6b938e9-en.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    currencyCompetition: {
      title: "Can Currency Competition Work?",
      url: "https://www.nber.org/papers/w22157",
      publisher: "National Bureau of Economic Research",
    },
    bankNotesStablecoins: {
      title:
        "A Brief History of Bank Notes in the United States and Lessons for Stablecoins",
      url: "https://www.federalreserve.gov/econres/notes/feds-notes/a-brief-history-of-bank-notes-in-the-united-states-and-some-lessons-for-stablecoins-20260206.html",
      publisher: "Board of Governors of the Federal Reserve System",
    },
    immigrationInterestGroups: {
      title: "Do Interest Groups Affect Immigration?",
      url: "https://www.iza.org/en/publications/dp/3183/do-interest-groups-affect-immigration",
      publisher: "IZA Institute of Labor Economics",
    },
    interethnicCivicNetworks: {
      title: "Ethnic Conflict and Civil Society: India and Beyond",
      url: "https://www.cambridge.org/core/journals/world-politics/article/abs/ethnic-conflict-and-civil-society-india-and-beyond/2F8EEAACC16E9A8366A9914C0301F08D",
      publisher: "World Politics / Cambridge University Press",
    },
    politicalConnectionsDefenseContracts: {
      title:
        "The Lion's Share: Evidence from Federal Contracts on the Value of Political Connections",
      url: "https://www.bis.org/publ/work1058.htm",
      publisher: "Bank for International Settlements",
    },
    democraticInnovations: {
      title:
        "A meta-analysis of the effects of democratic innovations on participants’ attitudes, behaviour and capabilities",
      url: "https://www.cambridge.org/core/journals/european-journal-of-political-research/article/metaanalysis-of-the-effects-of-democratic-innovations-on-participants-attitudes-behaviour-and-capabilities/065F2F246C8B8619D3EE45BFD4DB77A7",
      publisher:
        "European Journal of Political Research / Cambridge University Press",
    },
    democraticBacksliding: {
      title:
        "Designing Resistance: Democratic Institutions and the Threat of Backsliding",
      url: "https://www.idea.int/publications/catalogue/designing-resistance-democratic-institutions-and-threat-backsliding",
      publisher: "International IDEA",
    },
    electoralInformation: {
      title: "Information and Political Accountability",
      url: "https://www.aeaweb.org/articles?id=10.1257%2Fmic.20240340",
      publisher: "American Economic Association",
    },
    evidenceGovernance: {
      title: "Mobilising evidence for good governance",
      url: "https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html",
      publisher: "Organisation for Economic Co-operation and Development",
    },
    socialNormChange: {
      title: "Social Norms",
      url: "https://wbl.worldbank.org/en/publications/thematic-topics/social-norm",
      publisher: "World Bank",
    },
    politicalReform: {
      title: "The Political Economy of Reform",
      url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2009/08/the-political-economy-of-reform_g1ghb568/9789264073111-en.pdf",
      publisher: "Organisation for Economic Co-operation and Development",
    },
  };

const DOMAIN_SOURCE_IDS: Readonly<Record<string, readonly string[]>> = {
  "state-legitimacy": ["authority", "politicalObligation"],
  "property-ownership": ["property", "distributiveJustice"],
  "markets-planning": ["markets", "socialism"],
  "redistribution-welfare": ["distributiveJustice", "liberalism"],
  "labor-unions-workplace": ["labour", "labourRights"],
  "land-housing-georgism": ["property", "distributiveJustice"],
  "money-banking": ["monetaryPolicy", "markets"],
  "intellectual-property-information": ["intellectualProperty", "markets"],
  "civil-liberties-speech": ["civilPoliticalRights", "liberalism"],
  "crime-policing-justice": ["legalPunishment", "civilPoliticalRights"],
  "immigration-borders": ["immigration", "refugeeConvention"],
  "national-identity-sovereignty": ["nationalism", "multiculturalism"],
  "religion-secularism": ["secularism", "civilPoliticalRights"],
  "family-gender-feminism": ["feministPolitics", "feministEthics"],
  "race-ethnicity-multiculturalism": [
    "multiculturalism",
    "civilPoliticalRights",
  ],
  "environment-climate-growth": ["environmentalEthics", "climateAssessment"],
  "foreign-policy-war": ["war", "unCharter"],
  "democracy-expertise-constitutionalism": ["democracy", "electoralJustice"],
  "technology-ai-surveillance": ["aiEthics", "aiRisk"],
  "strategy-change": ["civilDisobedience", "revolution"],
};

const LAYER_FRAMING: Record<Layer, string> = {
  normative:
    "This normative item asks which values, rights, or standards should guide political judgment.",
  descriptive:
    "This descriptive item asks what tends to be true or how an institutional pattern works in practice.",
  prescriptive:
    "This prescriptive item asks which policy, institution, or strategy should be preferred under real conditions.",
};

const LAYER_BOUNDARIES: Record<Layer, string> = {
  normative:
    "It does not by itself establish that a preferred value has one necessary institutional expression or that the associated empirical claims are true.",
  descriptive:
    "Read the evidence as claim-specific: population, timeframe, comparison, outcome, and mechanism matter, and an empirical tendency is not a policy recommendation.",
  prescriptive:
    "It does not by itself settle implementation details, tradeoffs, feasibility, or whether adjacent strategies should receive the same priority.",
};

const DOMAIN_CONTEXT_NOTES: Readonly<Record<string, string>> = {
  "state-legitimacy":
    "Political legitimacy, de facto control, and political obligation are different questions: an institution may control territory, be accepted by many people, or claim a right to rule without those facts settling whether coercion is justified. The relevant alternatives include consent, democratic authorization, fair procedures, protection of rights, and functional arguments about coordination.",
  "property-ownership":
    "Property is a bundle of rules about use, exclusion, transfer, inheritance, and control rather than a single natural relation between a person and a thing. A question in this domain can concern initial acquisition, productive ownership, personal possession, or redistribution, and those issues should not be collapsed into one verdict about all private property.",
  "markets-planning":
    "Markets are institutions for exchange and price formation, not a synonym for every feature of capitalism, while planning can range from centralized command to participatory or indicative coordination. Comparisons should distinguish information, incentives, power, ownership, externalities, and the sector or scale being discussed rather than treating one mechanism as universally superior.",
  "redistribution-welfare":
    "Redistribution questions involve both the distribution of material resources and the design of institutions that address need, risk, bargaining power, or inherited inequality. Universal and targeted programs, cash and in-kind benefits, taxation, social insurance, and public services can produce different tradeoffs in coverage, administration, stigma, incentives, and political durability.",
  "labor-unions-workplace":
    "Workplace governance concerns who controls production, how workers bargain, how employment risks are allocated, and whether collective organization can counter unequal dependence. Union recognition, strikes, codetermination, worker ownership, professional autonomy, and state labor regulation are related but distinct institutional choices.",
  "land-housing-georgism":
    "Land differs from produced improvements because location and natural opportunity are scarce and socially affected by infrastructure, regulation, and surrounding development. Housing questions therefore involve tenure, zoning, construction capacity, rents, displacement, and land value; a claim about land taxation is not automatically a claim about every housing or planning policy.",
  "money-banking":
    "Money and banking questions separate the functions of a medium of exchange, credit creation, payments, lender-of-last-resort support, and monetary stabilization. Central-bank choices affect prices, employment, financial conditions, and distribution through uncertain transmission channels, so a preference for or against monetary authority does not specify one inflation or banking outcome.",
  "intellectual-property-information":
    "Information is often non-rival: one person’s use need not prevent another’s. Intellectual-property rules create temporary or conditional exclusion to pursue incentives, attribution, investment, or control, but they can also raise access costs and affect follow-on creation. Copyright, patents, trade secrets, software, and public knowledge have different policy problems.",
  "civil-liberties-speech":
    "Civil-liberties questions concern expression, conscience, privacy, association, movement, and due process under conditions where rights can conflict with safety or other public aims. It helps to distinguish a right’s scope from permissible limits, and formal protection from actual access, enforcement, surveillance, or unequal burdens.",
  "crime-policing-justice":
    "Justice policy includes prevention, investigation, adjudication, punishment, rehabilitation, restoration, and accountability for state agents. Claims about deterrence or public order should be separated from questions of desert, proportionality, due process, legitimacy, institutional bias, and the effects of policing or incarceration on victims, defendants, families, and communities.",
  "immigration-borders":
    "Border policy combines admission, residence, citizenship, asylum, deportation, labor mobility, family unity, and state security. Arguments may appeal to territorial self-determination, equal moral status, economic effects, public capacity, cultural continuity, or protection from persecution; a position on one channel does not settle all movement or membership questions.",
  "national-identity-sovereignty":
    "National identity can refer to shared citizenship, political institutions, language, religion, culture, ancestry, or a story of common history. National self-determination can mean democratic self-government, autonomy, or independence, and civic criteria can still exclude; the domain should not force a simple civic-versus-ethnic binary onto every case.",
  "religion-secularism":
    "Religion-and-state questions distinguish neutrality among beliefs, institutional separation, accommodation, establishment, religious law, and the use of religious reasons in public justification. Different constitutional systems assign interpretive authority differently, and support for religious participation in public life is not identical to support for clerical rule or one theology.",
  "family-gender-feminism":
    "Family and gender questions examine how intimate relationships, care work, sexuality, reproduction, social norms, and law distribute autonomy and dependence. Formal equality, material conditions, cultural expectations, and protection from violence can point toward different interventions, while “the family” is not one uniform institution across societies.",
  "race-ethnicity-multiculturalism":
    "Race, ethnicity, and multiculturalism involve both social classification and institutions that distribute status, resources, recognition, and vulnerability. Equal treatment, anti-discrimination, accommodation, representation, reparative policy, assimilation, and self-government are distinct responses to distinct histories; cultural difference should not be assumed to explain every racialized inequality.",
  "environment-climate-growth":
    "Environmental questions connect ecological limits, human welfare, nonhuman value, pollution, energy, growth, technology, and intergenerational justice. A policy can have different effects across regions and social groups, and “green” or “sustainable” does not by itself specify whether the preferred tool is regulation, markets, public ownership, conservation, adaptation, or reduced consumption.",
  "foreign-policy-war":
    "Foreign-policy questions separate national interest, sovereignty, deterrence, alliance commitments, humanitarian protection, economic coercion, and the morality or legality of force. The just-war tradition and international law distinguish reasons for entering conflict from conduct during conflict and from the responsibilities needed for a stable peace.",
  "democracy-expertise-constitutionalism":
    "Democratic governance involves participation, representation, contestation, accountability, competence, minority protection, and the allocation of authority among voters, officials, courts, experts, and administrative institutions. More participation is not automatically more inclusive or informed, and more expertise is not automatically independent, accountable, or legitimate.",
  "technology-ai-surveillance":
    "Technology changes the distribution of information, capability, dependence, and oversight rather than operating outside politics. AI and surveillance questions should distinguish accuracy, privacy, autonomy, discrimination, security, labor effects, explainability, institutional power, and lifecycle governance; a useful tool can still create systemic concentration or unaccountable control.",
  "strategy-change":
    "Strategy questions concern how political change is pursued rather than only which outcome is desired. Reform, elections, strikes, civil disobedience, mutual aid, direct action, insurrection, and revolution differ in legality, publicity, coercion, organizational demands, time horizon, and risks to bystanders and future institutions.",
};

/** Explicit notes keep the highest-risk existing pilot items more specific. */
import type { QuestionContextRecord } from "./questionContextTypes";
export type { QuestionContextRecord } from "./questionContextTypes";
import { questionContextPart01 } from "./questionContextParts/questionContextPart01";
import { questionContextPart02 } from "./questionContextParts/questionContextPart02";
import { questionContextPart03 } from "./questionContextParts/questionContextPart03";

export const questionContextById: Readonly<
  Record<string, QuestionContextRecord>
> = {
  ...questionContextPart01,
  ...questionContextPart02,
  ...questionContextPart03,
};

export function isQuestionContextTarget(question: Question): boolean {
  return (
    question.module === undefined || SPECIALIST_MODULE_IDS.has(question.module)
  );
}

function genericContextNote(question: Question): string {
  const domain = domainById.get(String(question.domain));
  const domainDescription =
    DOMAIN_CONTEXT_NOTES[String(question.domain)] ??
    (domain
      ? `${domain.name}: ${domain.description}`
      : `the ${String(question.domain)} topic area`);

  return `${LAYER_FRAMING[question.layer]} The item concerns ${domainDescription} ${LAYER_BOUNDARIES[question.layer]} The sources provide background for interpreting the construct and do not determine how you should answer.`;
}

function sourceListFor(question: Question): QuestionSource[] {
  const record = questionContextById[String(question.id)];
  const sourceIds =
    record?.sourceIds ?? DOMAIN_SOURCE_IDS[String(question.domain)] ?? [];
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyQuestionContext(question: Question): Question {
  if (!isQuestionContextTarget(question) || question.active === false)
    return question;

  const context = questionContextById[String(question.id)];
  const sources = question.sources?.length
    ? question.sources.map((source) => ({ ...source }))
    : sourceListFor(question);

  return {
    ...question,
    contextNote: context?.contextNote ?? genericContextNote(question),
    sources,
  };
}
