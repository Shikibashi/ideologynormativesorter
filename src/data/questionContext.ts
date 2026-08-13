import type { Question, QuestionSource, Layer } from '../types'
import { domainById } from './domains'

/**
 * Context coverage is intentionally an effective-bank overlay. It gives every
 * active public or specialist item a neutral construct frame and source trail
 * without editing the scored question objects themselves.
 */
export const QUESTION_CONTEXT_VERSION = '2026-08-question-context-v33'

export interface QuestionContextRecord {
  contextNote?: string
  sourceIds?: readonly string[]
}

const SPECIALIST_MODULE_IDS = new Set([
  'feminist-faction-module',
  'identity-sovereignty-module',
  'anarchist-families-module',
  'green-morphology-module',
  'socialist-families-module',
  'conservative-variants-module',
  'religious-national-politics-module',
  'technology-governance-module',
  'monarchist-municipal-module',
])

export const questionContextSources: Readonly<Record<string, QuestionSource>> = {
  authority: {
    title: 'Authority',
    url: 'https://plato.stanford.edu/entries/authority/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  politicalObligation: {
    title: 'Political Obligation',
    url: 'https://plato.stanford.edu/entries/political-obligation/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  property: {
    title: 'Property and Ownership',
    url: 'https://plato.stanford.edu/entries/property/index.html',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  distributiveJustice: {
    title: 'Distributive Justice',
    url: 'https://plato.stanford.edu/entries/justice-distributive/index.html',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  housingSupply: {
    title: 'The Impact of Zoning on Housing Affordability',
    url: 'https://www.nber.org/papers/w8835',
    publisher: 'National Bureau of Economic Research',
  },
  housingSupplyAffordability: {
    title: 'Housing Supply and Housing Affordability',
    url: 'https://www.nber.org/papers/w33694',
    publisher: 'National Bureau of Economic Research',
  },
  housingDemandSubsidies: {
    title: 'Do Low-Income Housing Subsidies Increase Housing Consumption?',
    url: 'https://www.nber.org/papers/w8709',
    publisher: 'National Bureau of Economic Research',
  },
  markets: {
    title: 'Markets',
    url: 'https://plato.stanford.edu/entries/markets/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  socialism: {
    title: 'Socialism',
    url: 'https://plato.stanford.edu/archives/fall2025/entries/socialism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  labour: {
    title: 'Collective bargaining and labour relations',
    url: 'https://www.ilo.org/topics-and-sectors/collective-bargaining-and-labour-relations',
    publisher: 'International Labour Organization',
  },
  careWork: {
    title: 'Care work and care jobs for the future of decent work',
    url: 'https://www.ilo.org/publications/care-work-and-care-jobs-future-decent-work-summary',
    publisher: 'International Labour Organization',
  },
  occupationalLicensingEntry: {
    title: 'How Much of Barrier to Entry is Occupational Licensing?',
    url: 'https://www.nber.org/papers/w25262',
    publisher: 'National Bureau of Economic Research',
  },
  employeeGovernance: {
    title: 'Employee Governance and the Ownership of the Firm',
    url: 'https://www.cambridge.org/core/journals/business-ethics-quarterly/article/abs/employee-governance-and-the-ownership-of-the-firm/F95BA42AF5F782A9BC16FC96FF6375F1',
    publisher: 'Cambridge University Press',
  },
  structuralDomination: {
    title: 'Structural Domination and Freedom in the Labor Market',
    url: 'https://www.cambridge.org/core/journals/american-political-science-review/article/structural-domination-and-freedom-in-the-labor-market-from-voluntariness-to-independence/15DE09962D69039C60D94AE163381C72',
    publisher: 'Cambridge University Press',
  },
  labourRights: {
    title: 'ILO Helpdesk: Business and collective bargaining',
    url: 'https://www.ilo.org/resource/other/ilo-helpdesk-business-and-collective-bargaining',
    publisher: 'International Labour Organization',
  },
  freedomAssociation: {
    title: 'Freedom of association',
    url: 'https://www.ilo.org/topics-and-sectors/freedom-association',
    publisher: 'International Labour Organization',
  },
  employmentRelationship: {
    title: 'R198 Employment Relationship Recommendation, 2006',
    url: 'https://www.ilo.org/resource/other/r198-employment-relationship-recommendation-2006',
    publisher: 'International Labour Organization',
  },
  cooperativesWorkRights: {
    title: 'Cooperatives and the Fundamental Principles and Rights at Work',
    url: 'https://www.ilo.org/publications/cooperatives-and-fundamental-principles-and-rights-work-cooperatives-and-0',
    publisher: 'International Labour Organization',
  },
  workerCooperatives: {
    title: 'Worker cooperatives',
    url: 'https://www.ilo.org/worker-cooperatives',
    publisher: 'International Labour Organization',
  },
  monetaryPolicy: {
    title: 'The Fed Explained: Monetary Policy',
    url: 'https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm',
    publisher: 'Board of Governors of the Federal Reserve System',
  },
  bankResolution: {
    title: 'Key Attributes of Effective Resolution Regimes for Financial Institutions',
    url: 'https://www.fsb.org/2014/10/key-attributes-of-effective-resolution-regimes-for-financial-institutions-3/',
    publisher: 'Financial Stability Board',
  },
  bankFailureResolution: {
    title: 'Failing Bank Resolutions',
    url: 'https://www.fdic.gov/resources/resolutions',
    publisher: 'Federal Deposit Insurance Corporation',
  },
  privateMoneyPayments: {
    title: 'Private money and central bank money as payments go digital',
    url: 'https://www.federalreserve.gov/newsevents/speech/brainard20210524a.htm',
    publisher: 'Board of Governors of the Federal Reserve System',
  },
  intellectualProperty: {
    title: 'Intellectual property',
    url: 'https://www.wipo.int/about-ip/en/',
    publisher: 'World Intellectual Property Organization',
  },
  civilPoliticalRights: {
    title: 'International Covenant on Civil and Political Rights',
    url: 'https://2covenants.ohchr.org/About-ICCPR.html',
    publisher: 'United Nations Human Rights',
  },
  iccprPrivacy: {
    title: 'Human Rights Committee General Comment No. 16 (Article 17)',
    url: 'https://docstore.ohchr.org/SelfServices/FilesHandler.ashx?enc=NDHbUvPo0H0e6ReM%2BeoASfvbY3aH6JttLpsRvkmL87wD80W4xnAiRpmKA6ZLwTp9xzCLNUYwTBP35uH1Fw6yqQ%3D%3D',
    publisher: 'United Nations Human Rights Committee',
  },
  pleaInnocenceEffect: {
    title: 'The Innocence Effect',
    url: 'https://scholarship.law.duke.edu/dlj/vol62/iss2/3/',
    publisher: 'Duke Law Journal',
  },
  pleaMiscarriageJustice: {
    title: 'Plea Bargaining and the Miscarriage of Justice',
    url: 'https://link.springer.com/article/10.1007/s10940-019-09441-w',
    publisher: 'Journal of Quantitative Criminology / Springer Nature',
  },
  openStandardsDigitalInnovation: {
    title: 'Stimulating digital innovation for growth and inclusiveness',
    url: 'https://www.oecd.org/en/publications/stimulating-digital-innovation-for-growth-and-inclusiveness_5jlwqvhg3l31-en.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  openStandardsCompetition: {
    title: 'Data Portability, Interoperability and Digital Platform Competition',
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/10/data-portability-interoperability-and-competition_f09a402e/73a083a9-en.pdf',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  copyrightLimitations: {
    title: 'Limitations and Exceptions',
    url: 'https://www.wipo.int/en/web/copyright/limitations/index',
    publisher: 'World Intellectual Property Organization',
  },
  patentExceptions: {
    title: 'Exceptions and Limitations to Patent Rights',
    url: 'https://www.wipo.int/en/web/patents/topics/exceptions_limitations',
    publisher: 'World Intellectual Property Organization',
  },
  patentRightsEnforcement: {
    title: 'Managing a patent',
    url: 'https://www.uspto.gov/patents/basics/manage',
    publisher: 'United States Patent and Trademark Office',
  },
  religionOfficialStatus: {
    title: 'Many Countries Favor Specific Religions, Officially or Unofficially',
    url: 'https://www.pewresearch.org/religion/2017/10/03/many-countries-favor-specific-religions-officially-or-unofficially/',
    publisher: 'Pew Research Center',
  },
  religionRestrictions: {
    title: 'A Closer Look at How Religious Restrictions Have Risen Around the World',
    url: 'https://www.pewresearch.org/religion/2019/07/15/a-closer-look-at-how-religious-restrictions-have-risen-around-the-world/',
    publisher: 'Pew Research Center',
  },
  superfundLiability: {
    title: 'Superfund Liability',
    url: 'https://www.epa.gov/enforcement/superfund-liability',
    publisher: 'U.S. Environmental Protection Agency',
  },
  superfundEnforcement: {
    title: 'Superfund Enforcement',
    url: 'https://www.epa.gov/enforcement/superfund-enforcement',
    publisher: 'U.S. Environmental Protection Agency',
  },
  gaoFacialRecognitionPrivacy: {
    title: 'Facial Recognition Services: Federal Law Enforcement Agencies Should Take Actions to Implement Training, and Policies for Civil Liberties',
    url: 'https://www.gao.gov/products/gao-25-107302',
    publisher: 'U.S. Government Accountability Office',
  },
  liberalism: {
    title: 'Liberalism',
    url: 'https://plato.stanford.edu/entries/liberalism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  legalPunishment: {
    title: 'Legal Punishment',
    url: 'https://plato.stanford.edu/entries/legal-punishment/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  immigration: {
    title: 'Immigration',
    url: 'https://plato.stanford.edu/archives/win2024/entries/immigration/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  refugeeConvention: {
    title: 'The 1951 Refugee Convention',
    url: 'https://www.unhcr.org/about-unhcr/overview/1951-refugee-convention',
    publisher: 'UNHCR',
  },
  nationalism: {
    title: 'Nationalism',
    url: 'https://plato.stanford.edu/entries/nationalism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  ethnonationalism: {
    title: 'Ethnonationalism',
    url: 'https://doi.org/10.1002/9781118663202.wberen301',
    publisher: 'The Wiley-Blackwell Encyclopedia of Race, Ethnicity, and Nationalism',
  },
  secularism: {
    title: 'Religion and Political Theory',
    url: 'https://plato.stanford.edu/entries/religion-politics/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  theocracySecularism: {
    title: 'Secularism in Political Philosophy',
    url: 'https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223',
    publisher: 'Oxford Research Encyclopedia of Politics',
  },
  islamicConstitutionalism: {
    title: 'Constitutional Interpretation and Constitutionalism in the Arab World',
    url: 'https://academic.oup.com/icon/article/11/3/615/789556',
    publisher: 'International Journal of Constitutional Law',
  },
  islamicDemocracy: {
    title: 'Constitutionalism, Judiciary, and Democracy in Islamic Societies',
    url: 'https://doi.org/10.1057/palgrave.polity.2300086',
    publisher: 'Polity / University of Chicago Press',
  },
  cambridgeIslamicConstitutionalism2023: {
    title: 'Islamic Constitutionalism',
    url: 'https://www.cambridge.org/core/books/abs/democracy-under-god/islamic-constitutionalism/3C82791964D0B1824113F0AC38CEDD1B',
    publisher: 'Cambridge University Press',
  },
  oxfordHindutvaDefinitions: {
    title: 'Hindutva, Hindu Organizations, and the Hindu Diasporas',
    url: 'https://academic.oup.com/book/47098/chapter-abstract/416165265',
    publisher: 'Oxford University Press',
  },
  cambridgeZionismHistory: {
    title: 'Zionism',
    url: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-jewish-philosophy/zionism/27CF65008422154713C1885CB5EFDE3C',
    publisher: 'Cambridge University Press',
  },
  cambridgeZionismLabour: {
    title: 'In the Name of Socialism: Zionism and European Social Democracy in the Inter-War Years',
    url: 'https://www.cambridge.org/core/journals/international-review-of-social-history/article/in-the-name-of-socialism-zionism-and-european-social-democracy-in-the-interwar-years/8B3D3F22827E7E6D8B2963870C68E09E',
    publisher: 'International Review of Social History / Cambridge University Press',
  },
  islamicPartyCompetition: {
    title: 'From Islamists to Muslim Democrats: The Case of Tunisia’s Ennahda',
    url: 'https://www.cambridge.org/core/journals/american-political-science-review/article/abs/from-islamists-to-muslim-democrats-the-case-of-tunisias-ennahda/C0D3D82CA222E3C28B108B28ED5A4DD4',
    publisher: 'American Political Science Review / Cambridge University Press',
  },
  multiculturalism: {
    title: 'Multiculturalism',
    url: 'https://plato.stanford.edu/entries/multiculturalism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  feministPolitics: {
    title: 'Feminist Political Philosophy',
    url: 'https://plato.stanford.edu/entries/feminism-political/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  feministEthics: {
    title: 'Feminist Ethics',
    url: 'https://plato.stanford.edu/entries/feminism-ethics/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  environmentalEthics: {
    title: 'Environmental Ethics',
    url: 'https://plato.stanford.edu/entries/ethics-environmental/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  climateAssessment: {
    title: 'Climate Change 2023: Synthesis Report',
    url: 'https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_FullVolume.pdf',
    publisher: 'Intergovernmental Panel on Climate Change',
  },
  war: {
    title: 'War',
    url: 'https://plato.stanford.edu/entries/war/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  unCharter: {
    title: 'United Nations Charter: full text',
    url: 'https://www.un.org/en/about-us/un-charter/full-text',
    publisher: 'United Nations',
  },
  democracy: {
    title: 'Democracy',
    url: 'https://plato.stanford.edu/entries/democracy/index.html',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  electoralJustice: {
    title: 'Electoral Justice: An Overview of the International IDEA Handbook',
    url: 'https://www.idea.int/sites/default/files/publications/chapters/electoral-justice-handbook/electoral-justice-handbook-overview.pdf',
    publisher: 'International IDEA',
  },
  referendumSafeguards: {
    title: 'Revised Code of Good Practice on Referendums',
    url: 'https://www.venice.coe.int/webforms/documents/?pdf=CDL-AD%282022%29015-e',
    publisher: 'European Commission for Democracy through Law (Venice Commission)',
  },
  regulatorGovernance: {
    title: "Governance of Regulators' Practices: Accountability, Transparency and Co-ordination",
    url: 'https://www.oecd.org/en/publications/governance-of-regulators-practices_9789264255388-en.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  regulatorAppeals: {
    title: 'OECD Regulatory Enforcement and Inspections Toolkit',
    url: 'https://www.oecd.org/en/publications/oecd-regulatory-enforcement-and-inspections-toolkit_9789264303959-en/full-report/component-11.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  aiEthics: {
    title: 'Ethics of Artificial Intelligence and Robotics',
    url: 'https://plato.stanford.edu/entries/ethics-ai/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  aiRisk: {
    title: 'AI Risk Management Framework',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    publisher: 'National Institute of Standards and Technology',
  },
  cryptography: {
    title: 'Guideline for Using Cryptographic Standards in the Federal Government: Cryptographic Mechanisms',
    url: 'https://csrc.nist.gov/pubs/sp/800/175/b/r1/final',
    publisher: 'National Institute of Standards and Technology',
  },
  decentralizedNetworkGovernance: {
    title: 'Decentralized Network Governance: Blockchain Technology and the Future of Regulation',
    url: 'https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2020.00012/full',
    publisher: 'Frontiers in Blockchain',
  },
  accelerationism: {
    title: 'Editorial Introduction: Accelerationism and the Left',
    url: 'https://www.tandfonline.com/doi/full/10.1080/0969725X.2019.1568729',
    publisher: 'Angelaki / Taylor & Francis',
  },
  federalism: {
    title: 'Federalism',
    url: 'https://plato.stanford.edu/entries/federalism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  democraticConfederalism: {
    title: 'Democratic Confederalism',
    url: 'https://www.uplopen.com/books/m/10.1515/9783839472736',
    publisher: 'University Press Library Open',
  },
  civilDisobedience: {
    title: 'Civil Disobedience',
    url: 'https://plato.stanford.edu/archives/fall2025/entries/civil-disobedience/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  revolution: {
    title: 'Revolution',
    url: 'https://plato.stanford.edu/entries/revolution/index.html',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  emergencyPowers: {
    title: 'Emergency Powers',
    url: 'https://www.idea.int/publications/catalogue/emergency-powers',
    publisher: 'International IDEA',
  },
  climateDecoupling: {
    title: 'Climate Change 2022: Mitigation of Climate Change, Chapter 2',
    url: 'https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-2/',
    publisher: 'Intergovernmental Panel on Climate Change',
  },
  intergroupContactUpdated: {
    title: 'The Contact Hypothesis Re-evaluated',
    url: 'https://www.cambridge.org/core/journals/behavioural-public-policy/article/contact-hypothesis-reevaluated/142C913E7FA9E121277B29E994124EC5',
    publisher: 'Cambridge University Press',
  },
  intergroupContactMetaAnalysis: {
    title: 'A Meta-Analytic Test of Intergroup Contact Theory',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16737372/',
    publisher: 'Psychological Bulletin / PubMed',
  },
  polycentricGovernance: {
    title: 'Prize lecture: Beyond Markets and States',
    url: 'https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/',
    publisher: 'Nobel Prize',
  },
  snapRecertification: {
    title: 'Program Recertification Costs: Evidence from SNAP',
    url: 'https://www.nber.org/papers/w27311',
    publisher: 'National Bureau of Economic Research',
  },
  afghanistanReconstruction: {
    title: 'Lessons from the Coalition: International Experiences from the Afghanistan Reconstruction',
    url: 'https://www.sigar.mil/Portals/147/Files/Reports/Lessons-Learned/SIGAR-16-59-LL.pdf',
    publisher: 'Special Inspector General for Afghanistan Reconstruction',
  },
  landTenure: {
    title: 'Land Policies for Resilient and Equitable Growth in Africa',
    url: 'https://www.worldbank.org/en/publication/land-policies-africa',
    publisher: 'World Bank',
  },
  stateOwnedGovernance: {
    title: 'OECD Guidelines on Corporate Governance of State-Owned Enterprises 2024',
    url: 'https://www.oecd.org/en/publications/2024/06/oecd-guidelines-on-corporate-governance-of-state-owned-enterprises-2024_68fa05cd/full-report.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  marketsKnowledge: {
    title: 'Prize lecture: The Pretence of Knowledge',
    url: 'https://www.nobelprize.org/prizes/economic-sciences/1974/hayek/lecture/',
    publisher: 'Nobel Prize',
  },
  patentStrategies: {
    title: 'The Evolving IP Marketplace: Aligning Patent Notice and Remedies With Competition',
    url: 'https://www.ftc.gov/reports/evolving-ip-marketplace-aligning-patent-notice-remedies-competition',
    publisher: 'U.S. Federal Trade Commission',
  },
  policePerformance: {
    title: 'Implementing an Agency-Level Performance Measurement System',
    url: 'https://www.ojp.gov/library/publications/implementing-agency-level-performance-measurement-system-guide-law-enforcement',
    publisher: 'U.S. Office of Justice Programs',
  },
  forfeitureFunding: {
    title: 'Equitable Sharing Program',
    url: 'https://www.justice.gov/criminal/criminal-mnf/equitable-sharing-program',
    publisher: 'U.S. Department of Justice',
  },
  householdTypologies: {
    title: 'Benefit Coverage Rates and Household Typologies',
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2004/12/benefit-coverage-rates-and-household-typologies_g17a169d/081036000058.pdf',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  environmentalComplianceCosts: {
    title: 'Do Environmental Regulations Disproportionately Affect Small Businesses?',
    url: 'https://www.epa.gov/sites/default/files/2014-12/documents/do_environmental_regulations_disproportionately_affect_small_businesses.pdf',
    publisher: 'U.S. Environmental Protection Agency',
  },
  regulatoryInformationAsymmetry: {
    title: 'Regulatory Policy in Perspective',
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2015/10/regulatory-policy-in-perspective_g1g596f4/9789264241800-en.pdf',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  occupationalLicensingWelfare: {
    title: 'A Welfare Analysis of Occupational Licensing in U.S. States',
    url: 'https://www.nber.org/papers/w26383',
    publisher: 'National Bureau of Economic Research',
  },
  occupationalLicensingSafety: {
    title: 'The Effect of Occupational Licensing on Consumer Welfare',
    url: 'https://www.nber.org/papers/w22456',
    publisher: 'National Bureau of Economic Research',
  },
  distributionalMonetaryPolicy: {
    title: 'The distributional footprint of monetary policy',
    url: 'https://www.bis.org/publ/arpdf/ar2021e2.htm',
    publisher: 'Bank for International Settlements',
  },
  financialEntryBarriers: {
    title: 'Licensing, transparency and preventing barriers to entry',
    url: 'https://digitalfinance.worldbank.org/topics/competition/licensing-transparency-and-preventing-barriers-entry',
    publisher: 'World Bank',
  },
  financialEntryLicensing: {
    title: 'Controlling entry: registration and licensing',
    url: 'https://digitalfinance.worldbank.org/topics/digital-credit/controlling-entry-registration-and-licensing',
    publisher: 'World Bank',
  },
  paymentSystemIntegrity: {
    title: 'Central banks and payments in the digital era',
    url: 'https://www.bis.org/publ/arpdf/ar2020e3.htm',
    publisher: 'Bank for International Settlements',
  },
  iceEnforcementStatistics: {
    title: 'ICE Enforcement and Removal Operations Statistics',
    url: 'https://www.ice.gov/spotlight/statistics',
    publisher: 'U.S. Immigration and Customs Enforcement',
  },
  policyCapture: {
    title: 'Preventing Policy Capture',
    url: 'https://www.oecd.org/en/publications/preventing-policy-capture_9789264065239-en.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  competitionAssessment: {
    title: 'Competition Assessment Toolkit, Volume 2',
    url: 'https://www.oecd.org/en/publications/competition-assessment-toolkit-principles-version-4-0-volume-2_b6b938e9-en.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  currencyCompetition: {
    title: 'Can Currency Competition Work?',
    url: 'https://www.nber.org/papers/w22157',
    publisher: 'National Bureau of Economic Research',
  },
  bankNotesStablecoins: {
    title: 'A Brief History of Bank Notes in the United States and Lessons for Stablecoins',
    url: 'https://www.federalreserve.gov/econres/notes/feds-notes/a-brief-history-of-bank-notes-in-the-united-states-and-some-lessons-for-stablecoins-20260206.html',
    publisher: 'Board of Governors of the Federal Reserve System',
  },
  immigrationInterestGroups: {
    title: 'Do Interest Groups Affect Immigration?',
    url: 'https://www.iza.org/en/publications/dp/3183/do-interest-groups-affect-immigration',
    publisher: 'IZA Institute of Labor Economics',
  },
  interethnicCivicNetworks: {
    title: 'Ethnic Conflict and Civil Society: India and Beyond',
    url: 'https://www.cambridge.org/core/journals/world-politics/article/abs/ethnic-conflict-and-civil-society-india-and-beyond/2F8EEAACC16E9A8366A9914C0301F08D',
    publisher: 'World Politics / Cambridge University Press',
  },
  politicalConnectionsDefenseContracts: {
    title: "The Lion's Share: Evidence from Federal Contracts on the Value of Political Connections",
    url: 'https://www.bis.org/publ/work1058.htm',
    publisher: 'Bank for International Settlements',
  },
  democraticInnovations: {
    title: 'A meta-analysis of the effects of democratic innovations on participants’ attitudes, behaviour and capabilities',
    url: 'https://www.cambridge.org/core/journals/european-journal-of-political-research/article/metaanalysis-of-the-effects-of-democratic-innovations-on-participants-attitudes-behaviour-and-capabilities/065F2F246C8B8619D3EE45BFD4DB77A7',
    publisher: 'European Journal of Political Research / Cambridge University Press',
  },
  democraticBacksliding: {
    title: 'Designing Resistance: Democratic Institutions and the Threat of Backsliding',
    url: 'https://www.idea.int/publications/catalogue/designing-resistance-democratic-institutions-and-threat-backsliding',
    publisher: 'International IDEA',
  },
  electoralInformation: {
    title: 'Information and Political Accountability',
    url: 'https://www.aeaweb.org/articles?id=10.1257%2Fmic.20240340',
    publisher: 'American Economic Association',
  },
  evidenceGovernance: {
    title: 'Mobilising evidence for good governance',
    url: 'https://www.oecd.org/en/publications/mobilising-evidence-for-good-governance_3f6f736b-en/full-report/component-5.html',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
  socialNormChange: {
    title: 'Social Norms',
    url: 'https://wbl.worldbank.org/en/publications/thematic-topics/social-norm',
    publisher: 'World Bank',
  },
  politicalReform: {
    title: 'The Political Economy of Reform',
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2009/08/the-political-economy-of-reform_g1ghb568/9789264073111-en.pdf',
    publisher: 'Organisation for Economic Co-operation and Development',
  },
}

const DOMAIN_SOURCE_IDS: Readonly<Record<string, readonly string[]>> = {
  'state-legitimacy': ['authority', 'politicalObligation'],
  'property-ownership': ['property', 'distributiveJustice'],
  'markets-planning': ['markets', 'socialism'],
  'redistribution-welfare': ['distributiveJustice', 'liberalism'],
  'labor-unions-workplace': ['labour', 'labourRights'],
  'land-housing-georgism': ['property', 'distributiveJustice'],
  'money-banking': ['monetaryPolicy', 'markets'],
  'intellectual-property-information': ['intellectualProperty', 'markets'],
  'civil-liberties-speech': ['civilPoliticalRights', 'liberalism'],
  'crime-policing-justice': ['legalPunishment', 'civilPoliticalRights'],
  'immigration-borders': ['immigration', 'refugeeConvention'],
  'national-identity-sovereignty': ['nationalism', 'multiculturalism'],
  'religion-secularism': ['secularism', 'civilPoliticalRights'],
  'family-gender-feminism': ['feministPolitics', 'feministEthics'],
  'race-ethnicity-multiculturalism': ['multiculturalism', 'civilPoliticalRights'],
  'environment-climate-growth': ['environmentalEthics', 'climateAssessment'],
  'foreign-policy-war': ['war', 'unCharter'],
  'democracy-expertise-constitutionalism': ['democracy', 'electoralJustice'],
  'technology-ai-surveillance': ['aiEthics', 'aiRisk'],
  'strategy-change': ['civilDisobedience', 'revolution'],
}

const LAYER_FRAMING: Record<Layer, string> = {
  normative: 'This normative item asks which values, rights, or standards should guide political judgment.',
  descriptive: 'This descriptive item asks what tends to be true or how an institutional pattern works in practice.',
  prescriptive: 'This prescriptive item asks which policy, institution, or strategy should be preferred under real conditions.',
}

const LAYER_BOUNDARIES: Record<Layer, string> = {
  normative: 'It does not by itself establish that a preferred value has one necessary institutional expression or that the associated empirical claims are true.',
  descriptive: 'Read the evidence as claim-specific: population, timeframe, comparison, outcome, and mechanism matter, and an empirical tendency is not a policy recommendation.',
  prescriptive: 'It does not by itself settle implementation details, tradeoffs, feasibility, or whether adjacent strategies should receive the same priority.',
}

const DOMAIN_CONTEXT_NOTES: Readonly<Record<string, string>> = {
  'state-legitimacy': 'Political legitimacy, de facto control, and political obligation are different questions: an institution may control territory, be accepted by many people, or claim a right to rule without those facts settling whether coercion is justified. The relevant alternatives include consent, democratic authorization, fair procedures, protection of rights, and functional arguments about coordination.',
  'property-ownership': 'Property is a bundle of rules about use, exclusion, transfer, inheritance, and control rather than a single natural relation between a person and a thing. A question in this domain can concern initial acquisition, productive ownership, personal possession, or redistribution, and those issues should not be collapsed into one verdict about all private property.',
  'markets-planning': 'Markets are institutions for exchange and price formation, not a synonym for every feature of capitalism, while planning can range from centralized command to participatory or indicative coordination. Comparisons should distinguish information, incentives, power, ownership, externalities, and the sector or scale being discussed rather than treating one mechanism as universally superior.',
  'redistribution-welfare': 'Redistribution questions involve both the distribution of material resources and the design of institutions that address need, risk, bargaining power, or inherited inequality. Universal and targeted programs, cash and in-kind benefits, taxation, social insurance, and public services can produce different tradeoffs in coverage, administration, stigma, incentives, and political durability.',
  'labor-unions-workplace': 'Workplace governance concerns who controls production, how workers bargain, how employment risks are allocated, and whether collective organization can counter unequal dependence. Union recognition, strikes, codetermination, worker ownership, professional autonomy, and state labor regulation are related but distinct institutional choices.',
  'land-housing-georgism': 'Land differs from produced improvements because location and natural opportunity are scarce and socially affected by infrastructure, regulation, and surrounding development. Housing questions therefore involve tenure, zoning, construction capacity, rents, displacement, and land value; a claim about land taxation is not automatically a claim about every housing or planning policy.',
  'money-banking': 'Money and banking questions separate the functions of a medium of exchange, credit creation, payments, lender-of-last-resort support, and monetary stabilization. Central-bank choices affect prices, employment, financial conditions, and distribution through uncertain transmission channels, so a preference for or against monetary authority does not specify one inflation or banking outcome.',
  'intellectual-property-information': 'Information is often non-rival: one person’s use need not prevent another’s. Intellectual-property rules create temporary or conditional exclusion to pursue incentives, attribution, investment, or control, but they can also raise access costs and affect follow-on creation. Copyright, patents, trade secrets, software, and public knowledge have different policy problems.',
  'civil-liberties-speech': 'Civil-liberties questions concern expression, conscience, privacy, association, movement, and due process under conditions where rights can conflict with safety or other public aims. It helps to distinguish a right’s scope from permissible limits, and formal protection from actual access, enforcement, surveillance, or unequal burdens.',
  'crime-policing-justice': 'Justice policy includes prevention, investigation, adjudication, punishment, rehabilitation, restoration, and accountability for state agents. Claims about deterrence or public order should be separated from questions of desert, proportionality, due process, legitimacy, institutional bias, and the effects of policing or incarceration on victims, defendants, families, and communities.',
  'immigration-borders': 'Border policy combines admission, residence, citizenship, asylum, deportation, labor mobility, family unity, and state security. Arguments may appeal to territorial self-determination, equal moral status, economic effects, public capacity, cultural continuity, or protection from persecution; a position on one channel does not settle all movement or membership questions.',
  'national-identity-sovereignty': 'National identity can refer to shared citizenship, political institutions, language, religion, culture, ancestry, or a story of common history. National self-determination can mean democratic self-government, autonomy, or independence, and civic criteria can still exclude; the domain should not force a simple civic-versus-ethnic binary onto every case.',
  'religion-secularism': 'Religion-and-state questions distinguish neutrality among beliefs, institutional separation, accommodation, establishment, religious law, and the use of religious reasons in public justification. Different constitutional systems assign interpretive authority differently, and support for religious participation in public life is not identical to support for clerical rule or one theology.',
  'family-gender-feminism': 'Family and gender questions examine how intimate relationships, care work, sexuality, reproduction, social norms, and law distribute autonomy and dependence. Formal equality, material conditions, cultural expectations, and protection from violence can point toward different interventions, while “the family” is not one uniform institution across societies.',
  'race-ethnicity-multiculturalism': 'Race, ethnicity, and multiculturalism involve both social classification and institutions that distribute status, resources, recognition, and vulnerability. Equal treatment, anti-discrimination, accommodation, representation, reparative policy, assimilation, and self-government are distinct responses to distinct histories; cultural difference should not be assumed to explain every racialized inequality.',
  'environment-climate-growth': 'Environmental questions connect ecological limits, human welfare, nonhuman value, pollution, energy, growth, technology, and intergenerational justice. A policy can have different effects across regions and social groups, and “green” or “sustainable” does not by itself specify whether the preferred tool is regulation, markets, public ownership, conservation, adaptation, or reduced consumption.',
  'foreign-policy-war': 'Foreign-policy questions separate national interest, sovereignty, deterrence, alliance commitments, humanitarian protection, economic coercion, and the morality or legality of force. The just-war tradition and international law distinguish reasons for entering conflict from conduct during conflict and from the responsibilities needed for a stable peace.',
  'democracy-expertise-constitutionalism': 'Democratic governance involves participation, representation, contestation, accountability, competence, minority protection, and the allocation of authority among voters, officials, courts, experts, and administrative institutions. More participation is not automatically more inclusive or informed, and more expertise is not automatically independent, accountable, or legitimate.',
  'technology-ai-surveillance': 'Technology changes the distribution of information, capability, dependence, and oversight rather than operating outside politics. AI and surveillance questions should distinguish accuracy, privacy, autonomy, discrimination, security, labor effects, explainability, institutional power, and lifecycle governance; a useful tool can still create systemic concentration or unaccountable control.',
  'strategy-change': 'Strategy questions concern how political change is pursued rather than only which outcome is desired. Reform, elections, strikes, civil disobedience, mutual aid, direct action, insurrection, and revolution differ in legality, publicity, coercion, organizational demands, time horizon, and risks to bystanders and future institutions.',
}

/** Explicit notes keep the highest-risk existing pilot items more specific. */
export const questionContextById: Readonly<Record<string, QuestionContextRecord>> = {
  q0001: {
    contextNote: 'This normative item concerns the legitimacy of compulsory membership in a political order when people cannot decline a service without criminal penalty. Exit can be relevant to authority, but practical exit may be costly, collective goods may be difficult to provide privately, and refusal of one service does not necessarily amount to refusal of every law or institution.',
    sourceIds: ['authority', 'politicalObligation', 'markets'],
  },
  q0003: {
    contextNote: 'This normative item isolates moral suspicion of territorial monopoly government from the separate question whether public goods can be supplied. “Monopoly” describes an institution’s claimed exclusive jurisdiction; the item does not establish that competition is feasible for every service or that useful output makes coercion legitimate.',
    sourceIds: ['authority', 'politicalObligation', 'markets'],
  },
  q0004: {
    contextNote: 'This normative item tests whether emergency need is sufficient by itself to justify unlimited authority. It leaves necessity, proportionality, duration, rights limits, renewal, legislative or judicial review, and return to ordinary constitutional order as distinct safeguards rather than treating every emergency measure as equivalent.',
    sourceIds: ['authority', 'politicalObligation', 'emergencyPowers'],
  },
  q0005: {
    contextNote: 'This normative item concerns the presumption of obedience when institutions are unjust and peaceful resistance is available. It does not define how severe the injustice must be, whether resistance is effective or lawful, or whether a duty to resist follows; legitimacy, political obligation, and the justification of a tactic remain distinct questions.',
    sourceIds: ['politicalObligation', 'civilDisobedience', 'authority'],
  },
  q0006: {
    contextNote: 'This normative item compares consent and exit with elections and inherited territorial membership as standards of political legitimacy. These standards can overlap without being identical: an election may authorize officials without establishing individual consent, while exit may be legally available yet materially unrealistic; the item does not prescribe one institutional form.',
    sourceIds: ['authority', 'politicalObligation', 'democracy'],
  },
  q0021: {
    contextNote: 'This normative item distinguishes claims based on labor from privileges created by law or conquest. It does not assume that labor alone settles initial appropriation, inherited title, collective production, taxation, compensation, or the rights of people affected by an owner’s use; those are separate property and justice questions.',
    sourceIds: ['property', 'distributiveJustice'],
  },
  q0022: {
    contextNote: 'This normative item tests whether exclusionary ownership loses moral force under conditions of nonuse, lack of improvement, or lack of consent. It does not imply that all unused property is illegitimate or that use and improvement are the only relevant grounds; possession, transfer, common resources, and background justice may matter too.',
    sourceIds: ['property', 'distributiveJustice'],
  },
  q0023: {
    contextNote: 'This normative item limits the legitimacy of private productive ownership when title originates in conquest or legal privilege. It does not settle how historical injustice should be proved or rectified, whether later purchasers acted in good faith, or whether state ownership is the only alternative to an unjust title.',
    sourceIds: ['property', 'distributiveJustice', 'politicalObligation'],
  },
  q0024: {
    contextNote: 'This normative item separates rectification of wealth produced by coercive privilege from protection of ordinary personal possessions. It does not define which gains count as privilege, who may claim compensation, how far historical correction reaches, or whether a chosen remedy must be confiscatory, redistributive, or institutional.',
    sourceIds: ['property', 'distributiveJustice'],
  },
  q0025: {
    contextNote: 'This normative item treats independence from politically favored owners as a possible purpose of property rules. It is not a claim that private ownership always creates dependence or that public ownership automatically produces autonomy; concentration, access, labor relations, legal privilege, and exit can affect the result.',
    sourceIds: ['property', 'distributiveJustice', 'markets'],
  },
  q0026: {
    contextNote: 'This normative item links property legitimacy to other people’s meaningful access to livelihood and exit. It does not specify a minimum baseline, a particular labor or welfare policy, or a complete theory of ownership; the relevant comparison is between title claims and the background conditions needed for non-domination.',
    sourceIds: ['property', 'distributiveJustice', 'politicalObligation'],
  },
  q0034: {
    contextNote: 'This prescriptive item favors targeting monopoly privilege, artificial scarcity, and entry barriers as reform objects. It does not imply that every restriction is artificial or that removing a barrier is sufficient; public harms, safety, information, transition costs, and institutional enforcement still require separate assessment.',
    sourceIds: ['markets', 'property', 'distributiveJustice'],
  },
  q0035: {
    contextNote: 'This prescriptive item distinguishes transferring ownership to the state from solving the incentives and accountability problems that can produce privilege. It does not reject public ownership categorically or endorse private ownership categorically; governance, worker voice, monitoring, entry, and public purpose remain design questions.',
    sourceIds: ['stateOwnedGovernance', 'socialism', 'property'],
  },
  q0038: {
    contextNote: 'This prescriptive item favors making ownership contestable rather than assuming that a public manager is preferable to a private manager. “Contestable” can involve entry, exit, cooperative governance, competition, disclosure, or legal challenge; the item does not specify which mechanism works in every sector or under every public-good constraint.',
    sourceIds: ['markets', 'property', 'socialism'],
  },
  q0039: {
    contextNote: 'This normative item rejects treating property rules as morally absolute when they give some people command over others without reciprocal obligation. It does not deny all property rights or define reciprocity by itself; personal possessions, productive assets, common resources, and coercively created titles can require different analysis.',
    sourceIds: ['property', 'distributiveJustice', 'politicalObligation'],
  },
  q0041: {
    contextNote: 'This normative item concerns the moral permission to engage in peaceful exchange even when its aggregate pattern differs from a planner’s preferred outcome. It does not assume that every exchange is informed or noncoercive, that markets are competitive, or that voluntary agreement settles background questions about property and bargaining power.',
    sourceIds: ['markets', 'property', 'liberalism'],
  },
  q0042: {
    contextNote: 'This normative item raises an anti-instrumental concern about economic planning when one collective blueprint overrides plural individual ends. “Planning” can be centralized, democratic, participatory, or limited to particular sectors; the item does not treat every coordination rule as a single coercive blueprint or establish that markets avoid instrumentalization.',
    sourceIds: ['markets', 'socialism', 'liberalism'],
  },
  q0043: {
    contextNote: 'This normative item values plural ends in economic coordination rather than one official hierarchy of goals. It does not decide whether pluralism requires markets, democratic planning, federalism, or mixed institutions, and it leaves open how conflicts among legitimate ends should be handled when resources are scarce.',
    sourceIds: ['markets', 'socialism', 'liberalism'],
  },
  q0044: {
    contextNote: 'This normative item limits deference to market outcomes when access to exchange has been restricted by law or violence. It does not claim that every unequal outcome reflects coercion or that all intervention corrects it; the relevant distinction is between ordinary exchange results and results shaped by exclusionary rules or force.',
    sourceIds: ['markets', 'property', 'distributiveJustice'],
  },
  q0045: {
    contextNote: 'This normative item distinguishes removing privilege from substituting officials’ preferences for participants’ choices. Both may involve state action, but the item does not assume that privilege is always easy to identify, that removal is administratively neutral, or that a narrow remedy avoids all distributional consequences.',
    sourceIds: ['markets', 'property', 'politicalObligation'],
  },
  q0046: {
    contextNote: 'This normative item makes the moral case for markets conditional on real entry, exit, and competition rather than nominal permission alone. It does not equate those conditions with perfect competition or efficiency, and it leaves open which public rules are needed to prevent coercion, monopoly, fraud, or exclusion.',
    sourceIds: ['markets', 'property', 'liberalism'],
  },
  q0061: {
    contextNote: 'This normative item concerns a duty to prevent severe deprivation when the cost to others is described as modest. It does not specify a complete theory of distributive justice, the threshold of destitution, who bears the sacrifice, or whether the duty is best met through cash, services, predistribution, or private association.',
    sourceIds: ['distributiveJustice', 'liberalism'],
  },
  q0062: {
    contextNote: 'This normative item treats material security as protection against domination rather than only as an increase in consumption. It does not imply that every inequality is domination or that a material floor requires one particular welfare state; dependence, bargaining power, rights, and the feasibility of exit remain distinct considerations.',
    sourceIds: ['distributiveJustice', 'liberalism', 'civilPoliticalRights'],
  },
  q0063: {
    contextNote: 'This normative item prioritizes agency in the design of aid and rejects making assistance depend on a recipient’s perceived moral worth. It does not prohibit eligibility rules, fraud controls, or conditions in every program; it distinguishes respect for equal standing from the administrative question of how a benefit is delivered.',
    sourceIds: ['distributiveJustice', 'liberalism', 'civilPoliticalRights'],
  },
  q0064: {
    contextNote: 'This normative item distinguishes claims arising from state-created scarcity from ordinary losses in competitive exchange. It does not establish that every policy restriction is unjust or that affected people are owed one fixed remedy; the relevant questions include causation, privilege, compensation, and background property rules.',
    sourceIds: ['distributiveJustice', 'property', 'housingSupply'],
  },
  q0065: {
    contextNote: 'This normative item evaluates welfare administration partly by whether it subjects recipients to surveillance and humiliation. It does not claim that all verification is humiliating or that privacy always overrides fraud prevention; dignity, due process, proportionality, administrative accuracy, and program access can pull in different directions.',
    sourceIds: ['distributiveJustice', 'civilPoliticalRights', 'liberalism'],
  },
  q0066: {
    contextNote: 'This normative item gives stronger moral weight to redistribution when the distribution being corrected was shaped by privilege. It does not define privilege as every unequal outcome or determine whether rectification, regulation, public provision, or transfers is the appropriate remedy; historical cause and present remedy remain separate.',
    sourceIds: ['distributiveJustice', 'property'],
  },
  q0073: {
    contextNote: 'This prescriptive item favors a safety net that secures basic agency while limiting paternalistic supervision. It does not specify a benefit level or prohibit all conditions; cash, services, work requirements, safeguards, and institutional oversight can be evaluated separately for their effects on autonomy and access.',
    sourceIds: ['distributiveJustice', 'liberalism', 'snapRecertification'],
  },
  q0074: {
    contextNote: 'This prescriptive item prefers cash over narrow in-kind or behavior-directing programs as a way to preserve recipient choice. It does not claim that cash is always sufficient or that all in-kind provision is paternalistic; information, children’s welfare, public goods, administrative burden, and market access may justify different tools in different settings.',
    sourceIds: ['distributiveJustice', 'liberalism', 'snapRecertification'],
  },
  q0076: {
    contextNote: 'This prescriptive item targets benefit cliffs in which a small increase in earnings can reduce eligibility or disposable resources. It does not say that every phase-out is a cliff, that marginal effective tax rates are always harmful, or that a particular universal or means-tested design is required; the relevant question is how rules shape work and household decisions.',
    sourceIds: ['snapRecertification', 'householdTypologies', 'distributiveJustice'],
  },
  q0077: {
    contextNote: 'This prescriptive item supports local experimentation when recipients have meaningful ways to leave a bad program. It does not assume that exit is costless or that local variation is automatically innovative; accountability, portability, comparability, rights floors, and the distribution of administrative capacity remain necessary safeguards.',
    sourceIds: ['polycentricGovernance', 'distributiveJustice', 'snapRecertification'],
  },
  q0079: {
    contextNote: 'This normative item treats freedom from starvation-based dependence as a condition of agency. It does not establish that a public transfer is the only route to independence or that all dependence is coercive; wages, family relations, mutual aid, markets, and public institutions can create different kinds of reliance and exit.',
    sourceIds: ['distributiveJustice', 'liberalism', 'politicalObligation'],
  },
  q0081: {
    contextNote: 'This normative item isolates workers’ freedom to form organizations of their choice and bargain collectively without legal favoritism or retaliation. Refusal of particular work, exit from employment, starting a rival firm, union recognition, strike rules, and employer property are distinct freedoms and institutional questions; agreement does not prescribe one bargaining structure.',
    sourceIds: ['freedomAssociation', 'labourRights'],
  },
  q0082: {
    contextNote: 'This normative item evaluates employment contracts by meaningful exit and by the background rules that shape bargaining power. It does not treat every unequal bargain as invalid or define meaningful exit as merely formal resignation; labor law, social insurance, discrimination rules, and dependence can affect whether consent is genuinely usable.',
    sourceIds: ['employmentRelationship', 'labourRights', 'liberalism'],
  },
  q0083: {
    contextNote: 'This normative item treats insulated workplace authority as morally suspect when workers lack voice, exit, or competitive alternatives. It does not imply that every manager must be elected or that competition removes domination; the item distinguishes internal governance from the firm’s ownership and from the external labor market.',
    sourceIds: ['labour', 'labourRights', 'property'],
  },
  q0084: {
    contextNote: 'This normative item questions whether employer power by itself justifies state-backed union privilege. It does not deny collective bargaining or assume private association is always noncoercive; the relevant design choices include membership, representation, strike rights, public funding, and protections for nonmembers and service users.',
    sourceIds: ['labourRights', 'labour', 'employmentRelationship'],
  },
  q0085: {
    contextNote: 'This normative item isolates the claim that legally restricted entry or exit can create labor-market coercion. Occupational licensing, immigration status, housing access, and employer power are distinct mechanisms with different purposes and effects; the item does not treat them as equivalent or imply that removing a barrier automatically improves work.',
    sourceIds: ['occupationalLicensingEntry', 'labourRights', 'employmentRelationship'],
  },
  q0094: {
    contextNote: 'This prescriptive item frames repeal of licensing barriers as labor reform rather than only deregulation. It does not imply that all licensing is unnecessary or that consumer risks disappear; the policy question is whether a credential rule protects the public or mainly restricts entry and incumbent competition.',
    sourceIds: ['labourRights', 'employmentRelationship', 'labour'],
  },
  q0095: {
    contextNote: 'This prescriptive item compares public-sector bargaining rules with private voluntary association when services are financed through compulsory taxation. It does not assume that public employees are ordinary insiders or that private bargaining has no spillovers; representation, fiscal accountability, service continuity, and worker rights are separate design concerns.',
    sourceIds: ['labour', 'labourRights', 'politicalObligation'],
  },
  q0096: {
    contextNote: 'This prescriptive item favors benefits that remain portable when a worker changes employers or union positions. It does not specify whether portability should be achieved through individual accounts, public insurance, sectoral funds, or collective plans, and it leaves risk pooling, financing, and coverage adequacy open.',
    sourceIds: ['labourRights', 'employmentRelationship', 'labour'],
  },
  q0097: {
    contextNote: 'This prescriptive item supports simplifying law for worker cooperatives without imposing one ownership model on every firm. It does not assume that cooperative governance always outperforms investor ownership or that legal simplification is enough; member control, capital access, information, liability, and worker rights remain relevant.',
    sourceIds: ['workerCooperatives', 'cooperativesWorkRights', 'labour'],
  },
  q0098: {
    contextNote: 'This prescriptive item prioritizes worker exit options before mandatory bargaining structures. It does not treat exit as a substitute for collective power where employers or labor markets are concentrated; portability, organizing rights, bargaining coverage, and the costs of changing employers are separate institutional levers.',
    sourceIds: ['labour', 'employmentRelationship', 'labourRights'],
  },
  q0099: {
    contextNote: 'This normative item rejects state-backed exclusion of peaceful labor competitors. It does not imply that every restriction on labor organization is peaceful or justified, nor that employer property settles all labor rights; association, collective action, safety, discrimination, and coercive monopoly must be distinguished.',
    sourceIds: ['labourRights', 'labour', 'liberalism'],
  },
  q0101: {
    contextNote: 'This normative item gives unimproved land value a different justificatory status from improvements made by people. It does not by itself endorse a land-value tax or deny private possession; original appropriation, exclusion, community-created value, assessment, and compensation are distinct property questions.',
    sourceIds: ['property', 'landTenure', 'distributiveJustice'],
  },
  q0102: {
    contextNote: 'This normative item protects building freedom when concrete harms to others are absent. It does not treat every externality as concrete or assume that a private parcel is free from infrastructure, safety, environmental, or neighborhood effects; the item distinguishes harm-based limits from aesthetic vetoes and general scarcity protection.',
    sourceIds: ['housingSupply', 'property', 'housingSupplyAffordability'],
  },
  q0104: {
    contextNote: 'This normative item limits incumbent homeowners’ moral claims to exclude newcomers merely to protect asset prices. It does not deny residents’ interests in safety, noise, infrastructure, or direct nuisance, and it does not imply that every supply restriction is motivated by exclusion; the issue is the justification for blocking access to opportunity.',
    sourceIds: ['housingSupply', 'housingSupplyAffordability', 'property'],
  },
  q0105: {
    contextNote: 'This normative item characterizes rent burdens caused by legal scarcity as political extraction rather than a neutral market fact. It does not establish that every high rent is legally caused or that supply reform is the only remedy; incidence, demand, construction, tenant protection, and land ownership can all matter.',
    sourceIds: ['housingSupply', 'housingSupplyAffordability', 'property'],
  },
  q0106: {
    contextNote: 'This normative item makes private landholding more defensible when land rents are not permanently captured by one owner. It does not specify whether the remedy is taxation, common ownership, leasehold, public investment, or another arrangement, and it distinguishes land value from privately produced improvements.',
    sourceIds: ['property', 'landTenure', 'distributiveJustice'],
  },
  q0115: {
    contextNote: 'This prescriptive item supports replacing worse taxes with a land-value tax only when assessment institutions are credible. It does not assume that valuation is simple or politically neutral, that the tax is sufficient for every public purpose, or that tax incidence and transition effects disappear once the base is chosen.',
    sourceIds: ['landTenure', 'property', 'distributiveJustice'],
  },
  q0116: {
    contextNote: 'This prescriptive item seeks tenant protection without freezing housing supply or shifting all scarcity costs onto newcomers. It does not decide which rent, eviction, construction, or subsidy instrument works best; incumbent protection, access for new households, mobility, and long-run supply are separate outcomes.',
    sourceIds: ['housingSupplyAffordability', 'housingSupply', 'housingDemandSubsidies'],
  },
  q0117: {
    contextNote: 'This prescriptive item favors capturing rising land values created partly by public infrastructure rather than taxing unrelated productive activity. It does not establish that all appreciation is publicly created or that land-value capture is administratively costless; valuation, timing, ownership, and infrastructure financing remain open.',
    sourceIds: ['landTenure', 'property', 'housingSupply'],
  },
  q0119: {
    contextNote: 'This normative item gives access to high-opportunity locations greater moral weight than preserving neighborhood aesthetics alone. It does not erase legitimate claims concerning safety, infrastructure, heritage, or direct nuisance, and it does not prescribe a specific density, zoning, or housing-finance policy.',
    sourceIds: ['housingSupplyAffordability', 'housingSupply', 'distributiveJustice'],
  },
  q0121: {
    contextNote: 'This normative item concerns freedom to use a peaceful monetary alternative when a state privileges one money. It does not assume that alternatives are stable, redeemable, widely accepted, or free of fraud and network effects; legal tender, payments access, and monetary policy are related but distinct questions.',
    sourceIds: ['monetaryPolicy', 'privateMoneyPayments', 'liberalism'],
  },
  q0122: {
    contextNote: 'This normative item objects to opaque redistribution through monetary institutions. It does not claim that every monetary policy distribution is illegitimate or that transparency removes all distributional effects; the relevant concerns include disclosure, accountability, inflation, credit access, asset prices, and political discretion.',
    sourceIds: ['monetaryPolicy', 'privateMoneyPayments', 'distributiveJustice'],
  },
  q0124: {
    contextNote: 'This normative item questions bailouts that socialize losses after private gains. It does not establish that every rescue is a bailout or that letting a bank fail is costless; resolution design must distinguish shareholders, managers, creditors, depositors, taxpayers, systemic risk, and payment continuity.',
    sourceIds: ['bankResolution', 'bankFailureResolution', 'distributiveJustice'],
  },
  q0125: {
    contextNote: 'This normative item rejects permanent incumbent favoritism as a consequence of financial-stability concerns. It does not deny that stability can require regulation or temporary intervention; the boundary is between protecting critical functions and insulating established institutions from competition or accountability.',
    sourceIds: ['bankResolution', 'markets', 'monetaryPolicy'],
  },
  q0126: {
    contextNote: 'This normative item treats consent, transparency, and protection from political manipulation as elements of monetary legitimacy. It does not specify whether money must be private, public, commodity-backed, or central-bank issued, and it does not reduce technical stability or purchasing power to consent alone.',
    sourceIds: ['monetaryPolicy', 'privateMoneyPayments', 'politicalObligation'],
  },
  q0133: {
    contextNote: 'This prescriptive item combines currency competition, transparent reserves, and opposition to a privileged issuer. These are separable institutional choices: competition depends on switching and trust, reserves depend on disclosure and redemption, and issuer privilege can concern legal tender, payments infrastructure, or central-bank access.',
    sourceIds: ['privateMoneyPayments', 'monetaryPolicy', 'bankResolution'],
  },
  q0134: {
    contextNote: 'This prescriptive item limits discretionary permission when agencies are aligned with incumbent banks. It does not imply that payment innovation needs no licensing or supervision; the relevant design problem is how to distinguish demonstrable fraud, insolvency, and systemic risk from rules that protect incumbents from entry.',
    sourceIds: ['privateMoneyPayments', 'markets', 'bankResolution'],
  },
  q0137: {
    contextNote: 'This prescriptive item applies narrowness, disclosure, and automatic sunset to central-bank emergency powers. It does not define which emergencies qualify or deny the need for rapid action; authorization, review, collateral, beneficiaries, renewal, and return to ordinary facilities remain separate safeguards.',
    sourceIds: ['monetaryPolicy', 'emergencyPowers', 'bankResolution'],
  },
  q0138: {
    contextNote: 'This prescriptive item prioritizes fraud and insolvency controls over protecting established intermediaries from competition. It does not imply that competition alone ensures stability or that prudential rules are incumbent protection; the item distinguishes a public-risk rationale from a favoritism rationale.',
    sourceIds: ['bankResolution', 'markets', 'privateMoneyPayments'],
  },
  q0139: {
    contextNote: 'This normative item challenges the idea that expert administration makes a money monopoly morally neutral. It does not claim that expertise is irrelevant or that competing issuers are automatically legitimate; authority, transparency, exit, stability, and distributional effects remain distinct grounds for evaluation.',
    sourceIds: ['monetaryPolicy', 'politicalObligation', 'markets'],
  },
  q0161: {
    contextNote: 'This normative item tests whether rights protections matter most when the person exercising them is unpopular. Speech, religion, association, and criminal due process involve related but distinct liberties; the item does not imply that every act described as speech is immune from rules addressing direct harm, fraud, or coercion.',
    sourceIds: ['civilPoliticalRights', 'liberalism'],
  },
  q0162: {
    contextNote: 'This normative item rejects a general official power to decide which peaceful opinions adults may hear. It does not deny narrowly defined restrictions on direct threats, fraud, or rights violations, and it distinguishes state censorship from private association rules and from the empirical question whether open debate corrects error.',
    sourceIds: ['civilPoliticalRights', 'liberalism', 'democracy'],
  },
  q0163: {
    contextNote: 'This normative item treats privacy as a condition that can support dissent, experimentation, and minority life. It does not make privacy absolute or specify one surveillance regime; lawful search, consent, data security, public safety, anonymity, and the power to challenge collection are separate design questions.',
    sourceIds: ['iccprPrivacy', 'civilPoliticalRights', 'liberalism'],
  },
  q0164: {
    contextNote: 'This normative item limits censorship justified only by fear that adults may encounter bad ideas. It does not settle how to handle direct incitement, fraud, targeted harassment, or threats, nor does it assume that platform moderation and state punishment have identical authority or consequences.',
    sourceIds: ['civilPoliticalRights', 'liberalism', 'democracy'],
  },
  q0165: {
    contextNote: 'This normative item treats due process as a protection that applies regardless of whether the accused is in fact guilty. The item does not depend on a claim that officials are uniquely incompetent or malicious; notice, hearing, counsel, evidence, review, and proportionate procedure are separate components of fair adjudication.',
    sourceIds: ['civilPoliticalRights', 'liberalism'],
  },
  q0166: {
    contextNote: 'This normative item treats civil liberty as a constraint on current majorities rather than a discretionary benefit. It does not deny democratic lawmaking; it asks whether equal rights, due process, conscience, expression, and association should limit what a majority may authorize against minorities or dissenters.',
    sourceIds: ['civilPoliticalRights', 'liberalism', 'democracy'],
  },
  q0174: {
    contextNote: 'This prescriptive item requires a direct connection between speech restrictions and a specified harm such as fraud, threat, harassment, or another rights violation. It does not define the legal threshold for each category or imply that every restriction meeting a formal connection is proportionate or administratively safe.',
    sourceIds: ['civilPoliticalRights', 'liberalism', 'democracy'],
  },
  q0175: {
    contextNote: 'This prescriptive item favors adversarial authorization and later notice for surveillance powers. It does not assume that every search can be disclosed immediately or that a warrant alone prevents abuse; necessity, scope, minimization, independent review, remedies, and emergency exceptions remain distinct safeguards.',
    sourceIds: ['iccprPrivacy', 'civilPoliticalRights', 'democracy'],
  },
  q0176: {
    contextNote: 'This prescriptive item applies automatic sunset and strict reauthorization to emergency restrictions on assembly or movement. It does not say that every emergency limit is invalid or that a sunset clause is sufficient; necessity, proportionality, review, geographic scope, and restoration of ordinary rights must also be assessed.',
    sourceIds: ['emergencyPowers', 'civilPoliticalRights', 'democracy'],
  },
  q0177: {
    contextNote: 'This prescriptive item favors disclosure when governments ask platforms to remove or suppress lawful speech. It does not require disclosure that would expose a victim, an investigative method, or a genuinely necessary secret, and it distinguishes transparency about state requests from a general verdict on platform moderation.',
    sourceIds: ['civilPoliticalRights', 'iccprPrivacy', 'democracy'],
  },
  q0178: {
    contextNote: 'This prescriptive item applies the same judicial review to emergency surveillance regardless of which party controls government. It does not assume that courts are infallible or that political neutrality is automatic; equal review, independent authorization, notice, remedies, and evidentiary standards are separate institutional safeguards.',
    sourceIds: ['iccprPrivacy', 'emergencyPowers', 'civilPoliticalRights'],
  },
  q0179: {
    contextNote: 'This normative item treats the possibility of being wrong as part of equal political standing. It does not imply that all beliefs are equally well supported or that false statements causing direct harm receive no regulation; it concerns whether officials or majorities may deny civic standing merely for dissent or error.',
    sourceIds: ['civilPoliticalRights', 'liberalism', 'democracy'],
  },
  q0201: {
    contextNote: 'This normative item treats birthplace as morally arbitrary when used to exclude peaceful people from work, housing, and association. It does not settle all questions about admission, public finance, security, labor regulation, or asylum; it isolates the moral relevance of being born on one side of a border.',
    sourceIds: ['immigration', 'civilPoliticalRights', 'nationalism'],
  },
  q0202: {
    contextNote: 'This normative item treats movement for self-improvement as a liberty claim against state restriction. It does not imply unrestricted entry in every circumstance or settle public-health, security, labor, housing, or asylum administration; freedom of movement and the institutional conditions for receiving newcomers are distinct questions.',
    sourceIds: ['immigration', 'civilPoliticalRights', 'politicalObligation'],
  },
  q0203: {
    contextNote: 'This normative item rejects treating citizenship as hereditary ownership of opportunity. It does not deny that political communities may have membership rules or special obligations, and it does not determine whether opportunity should be allocated through open admission, equal rights, global justice, or a particular welfare arrangement.',
    sourceIds: ['immigration', 'nationalism', 'civilPoliticalRights'],
  },
  q0204: {
    contextNote: 'This normative item rejects a permanent exclusionary veto based only on earlier arrival. It does not erase claims about democratic authorization, public capacity, housing, labor conditions, or obligations to current residents; it distinguishes temporal priority from a complete moral title to exclude.',
    sourceIds: ['immigration', 'politicalObligation', 'civilPoliticalRights'],
  },
  q0205: {
    contextNote: 'This normative item makes border enforcement harder to justify when it traps people under violence or extreme poverty. It does not define the threshold of danger or poverty, establish a universal right of entry, or remove the need to distinguish asylum, ordinary migration, rescue, due process, and feasible protection.',
    sourceIds: ['immigration', 'refugeeConvention', 'civilPoliticalRights'],
  },
  q0206: {
    contextNote: 'This normative item allows a political community to preserve institutions while rejecting the treatment of outsiders as rightless threats. It does not prescribe open borders or deny membership distinctions; it concerns minimum equal human standing, non-discrimination, due process, and protection from arbitrary coercion.',
    sourceIds: ['immigration', 'refugeeConvention', 'civilPoliticalRights'],
  },
  q0213: {
    contextNote: 'This prescriptive item favors peaceful migration without treating national borders as ownership claims. It does not specify admission administration, citizenship, fiscal membership, security screening, or asylum rules, and it distinguishes a critique of ownership language from a complete border policy.',
    sourceIds: ['immigration', 'nationalism', 'politicalObligation'],
  },
  q0214: {
    contextNote: 'This prescriptive item favors broad and quick work authorization even when citizenship remains more restrictive. It does not equate a work permit with permanent membership or asylum, and it leaves labor standards, employer enforcement, portability, fiscal access, and status review as separate implementation questions.',
    sourceIds: ['immigration', 'labourRights', 'civilPoliticalRights'],
  },
  q0216: {
    contextNote: 'This prescriptive item targets administrative limbo in asylum systems. It does not predetermine who qualifies as a refugee or require approval of every claim; it concerns timely procedures, lawful status during review, non-refoulement, access to counsel, and the human costs of prolonged uncertainty.',
    sourceIds: ['refugeeConvention', 'immigration', 'civilPoliticalRights'],
  },
  q0219: {
    contextNote: 'This normative item treats the ability to sell labor as a liberty that should not disappear solely at a state border. It does not settle employer regulation, citizenship, public benefits, licensing, or labor-market effects; movement, work authorization, and equal workplace rights are distinct policy dimensions.',
    sourceIds: ['immigration', 'labourRights', 'liberalism'],
  },
  q0221: {
    contextNote: 'This normative item permits national identity as voluntary belonging while rejecting its use to rule dissenters or exclude outsiders. It does not deny cultural continuity or collective memory; it separates identification with a nation from coercive sovereignty, inherited privilege, and treatment of minorities.',
    sourceIds: ['nationalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  q0223: {
    contextNote: 'This normative item values local self-government for possible exit and pluralism while rejecting the assumption that every local majority is just. It does not prescribe full local sovereignty; representation, interdependence, rights floors, fiscal capacity, and safeguards against local domination remain separate institutional questions.',
    sourceIds: ['federalism', 'multiculturalism', 'democracy'],
  },
  q0224: {
    contextNote: 'This normative item limits sovereignty when it is used to shield rulers from criticism by their own subjects. It does not deny external self-determination or constitutional authority; it distinguishes a community’s claim to govern itself from an incumbent government’s claim to suppress internal accountability.',
    sourceIds: ['nationalism', 'civilPoliticalRights', 'politicalObligation'],
  },
  q0226: {
    contextNote: 'This normative item treats a nation as a community of memory without treating persons inside its borders as owned by that community. It does not reject shared history, civic obligation, or public culture; it separates collective identity from property-like control over individual membership and dissent.',
    sourceIds: ['nationalism', 'politicalObligation', 'civilPoliticalRights'],
  },
  q0233: {
    contextNote: 'This prescriptive item favors layered identities across local, regional, national, and cosmopolitan affiliations. It does not specify a federal, confederal, or world-government design, and it leaves open how overlapping jurisdictions should allocate authority, rights, taxation, mobility, and democratic accountability.',
    sourceIds: ['nationalism', 'multiculturalism', 'federalism'],
  },
  q0234: {
    contextNote: 'This prescriptive item evaluates secession by more than majority sentiment, adding exit rights and minority protections. It does not deny a people’s claim to self-determination or require that every secession fail; territory, consent, borders, security, minority status, and institutional continuity can affect the judgment.',
    sourceIds: ['nationalism', 'federalism', 'civilPoliticalRights'],
  },
  q0235: {
    contextNote: 'This prescriptive item limits sovereignty claims when they conflict with basic civil liberties or peaceful migration. It does not settle the entire hierarchy of international and domestic authority, and it distinguishes legitimate self-government from immunity for arbitrary detention, censorship, discrimination, or exclusion.',
    sourceIds: ['nationalism', 'civilPoliticalRights', 'immigration'],
  },
  q0236: {
    contextNote: 'This prescriptive item requires decentralization to include safeguards against local caste, ethnic, or religious domination. It does not treat centralization as the only safeguard or local autonomy as inherently oppressive; representation, judicial review, equal citizenship, exit, and intergovernmental rights floors are separate choices.',
    sourceIds: ['federalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  q0239: {
    contextNote: 'This normative item separates love of place from coercively freezing culture. It does not deny that communities may preserve language, memory, institutions, or heritage through voluntary association and public policy; it asks whether those aims justify coercion against peaceful residents or cultural change.',
    sourceIds: ['nationalism', 'multiculturalism', 'liberalism'],
  },
  q0241: {
    contextNote: 'This normative item protects religious conviction while rejecting political supremacy over nonbelievers or dissenters. It does not require hostility to religion or a single secular regime; conscience, equal citizenship, public justification, accommodation, and coercive establishment are distinct questions.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'religionOfficialStatus'],
  },
  q0243: {
    contextNote: 'This normative item protects voluntary religious communities’ internal norms when members can genuinely leave. It does not treat every community rule as voluntary or permit coercion, abuse, fraud, or denial of civil rights; association, exit, legal status, and protection from harm must be distinguished.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'liberalism'],
  },
  q0244: {
    contextNote: 'This normative item rejects civil criminalization of blasphemy, apostasy, and heresy. It does not deny that threats, violence, incitement, fraud, or targeted harassment can be regulated, and it distinguishes protection of religious belief from protection of a doctrine against criticism.',
    sourceIds: ['secularism', 'civilPoliticalRights'],
  },
  q0245: {
    contextNote: 'This normative item rejects state favoritism toward a culturally dominant religion. It does not require identical treatment in every historical or institutional context or deny voluntary public recognition; it concerns coercive privilege, equal citizenship, public funding, office, and access to legal remedies.',
    sourceIds: ['secularism', 'religionOfficialStatus', 'civilPoliticalRights'],
  },
  q0246: {
    contextNote: 'This normative item treats freedom of religion as including freedom from religiously backed coercive law. It does not claim that religious reasons may never enter public debate or that secular reasons are automatically neutral; the boundary is whether civil coercion preserves equal conscience and dissent.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'liberalism'],
  },
  q0253: {
    contextNote: 'This prescriptive item applies one civil-liberty principle to religious exercise and nonreligious dissent. It does not require identical accommodations in every case; equal standing, burden, harm to third parties, public neutrality, and the practical ability to opt out can justify distinctions in implementation.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'liberalism'],
  },
  q0254: {
    contextNote: 'This prescriptive item protects religious practice while limiting coercion of third parties. It does not define every third-party burden as coercion or every exemption as justified; courts and lawmakers may need to distinguish direct harm, public funding, employment, services, equality, and feasible accommodation.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'multiculturalism'],
  },
  q0255: {
    contextNote: 'This prescriptive item limits state funding or enforcement of religious doctrine through education, family law, or speech restrictions. It does not prohibit public services from partnering with faith-based providers on equal terms, and it distinguishes institutional cooperation from compulsory doctrine or unequal civic status.',
    sourceIds: ['secularism', 'religionOfficialStatus', 'civilPoliticalRights'],
  },
  q0256: {
    contextNote: 'This prescriptive item requires faith-based organizations receiving public funds to meet the same privilege standard as secular associations. It does not require identical organizational missions or prohibit contracting with religious providers; the issue is public money, equal access, accountability, and coercive religious preference.',
    sourceIds: ['religionOfficialStatus', 'civilPoliticalRights', 'liberalism'],
  },
  q0257: {
    contextNote: 'This prescriptive item conditions enforcement of religious arbitration on genuinely voluntary participation and exit. It does not reject private dispute resolution or imply that exit is real whenever a form is signed; informed consent, unequal dependency, due process, public law, and protection from coercion remain relevant.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'liberalism'],
  },
  q0258: {
    contextNote: 'This prescriptive item treats secularism as a limit on state power over conscience rather than a doctrine the state imposes. It does not require public institutions to erase all religious history or prohibit private conviction; neutrality, equal treatment, accommodation, and non-establishment can be arranged in different ways.',
    sourceIds: ['secularism', 'liberalism', 'civilPoliticalRights'],
  },
  q0259: {
    contextNote: 'This normative item treats conscience as a personal moral faculty that cannot simply be delegated to a legislature, priesthood, or expert committee. It does not deny the need for shared law or institutional interpretation; it distinguishes personal responsibility from the authority to impose coercive rules on others.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'liberalism'],
  },
  q0261: {
    contextNote: 'This normative item protects adult household choice when arrangements do not rely on coercion or fraud. It does not resolve questions about children, dependents, property, inheritance, care, abuse, or legal recognition; consensual adult association and protection of vulnerable people are separate policy dimensions.',
    sourceIds: ['feministPolitics', 'feministEthics', 'civilPoliticalRights'],
  },
  q0262: {
    contextNote: 'This normative item treats gender norms as less legitimate when enforced by law rather than persuasion or association. It does not claim that informal norms are harmless or that all legal rules concerning sex are illegitimate; consent, equality, safety, family law, and protection from discrimination remain distinct considerations.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights', 'liberalism'],
  },
  q0263: {
    contextNote: 'This normative item gives social respect to unpaid and informal care work outside market employment. It does not specify who should pay for care or imply that all unpaid work is freely chosen; recognition, redistribution, dependency, family obligation, labor markets, and public provision are separate questions.',
    sourceIds: ['feministPolitics', 'feministEthics', 'distributiveJustice'],
  },
  q0264: {
    contextNote: 'This normative item limits the moral force of formal consent when law, violence, or economic dependency blocks meaningful exit. It does not treat every unequal relationship as invalid or define one family form as ideal; the relevant distinction is between nominal agreement and agency under coercive constraint.',
    sourceIds: ['feministPolitics', 'feministEthics', 'civilPoliticalRights'],
  },
  q0265: {
    contextNote: 'This normative item rejects state enforcement of one model of masculinity, femininity, marriage, or parenthood. It does not prohibit public rules protecting children, preventing violence, or assigning legal responsibilities; it separates a state-prescribed social ideal from neutral rights and welfare safeguards.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights', 'liberalism'],
  },
  q0266: {
    contextNote: 'This normative item balances protection of children and dependents against criminalizing peaceful adult difference. It does not define every cultural disagreement as harmless or every intervention as justified; concrete abuse, neglect, capacity, consent, dependency, and equal legal standing require separate assessment.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights', 'liberalism'],
  },
  q0275: {
    contextNote: 'This prescriptive item limits child-welfare intervention to concrete abuse or neglect rather than mere deviation from dominant culture. It does not deny the need for protective action or culturally informed assessment; the policy boundary is between demonstrable harm and state enforcement of a majority norm.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights', 'multiculturalism'],
  },
  q0276: {
    contextNote: 'This prescriptive item favors caregiver support that does not lock people into dependence on employers or spouses. It does not prescribe cash, services, leave, public care, or workplace regulation, and it leaves open how support can protect both caregiver agency and the needs of children or dependents.',
    sourceIds: ['feministPolitics', 'distributiveJustice', 'labourRights'],
  },
  q0278: {
    contextNote: 'This prescriptive item favors expanding real options rather than prescribing one route to liberation through market work, domestic work, or communal care. It does not treat all options as equally accessible or deny structural constraints; material resources, care, law, culture, and bargaining power affect whether choice is usable.',
    sourceIds: ['feministPolitics', 'liberalism', 'labourRights'],
  },
  q0279: {
    contextNote: 'This normative item distinguishes a freely chosen role from the same role imposed by law or economic captivity. It does not assume that choice is always fully autonomous or that imposed roles are always visible; dependency, social sanctions, violence, resources, and meaningful exit shape the moral difference.',
    sourceIds: ['feministPolitics', 'feministEthics', 'liberalism'],
  },
  q0404: {
    contextNote: 'This normative item favors public framing that does not assume one religion in ceremonies, schools, or official holidays. It does not require hostility to inherited traditions or prohibit voluntary religious observance; it concerns equal civic standing, public neutrality, accommodation, and state endorsement.',
    sourceIds: ['secularism', 'civilPoliticalRights', 'religionOfficialStatus'],
  },
  q0421: {
    contextNote: 'This normative item treats gender and sexual hierarchy as unjust even when formal legal equality exists. It does not imply that every unequal outcome proves discrimination or specify one remedy; informal norms, care burdens, violence, economic dependence, representation, and institutional power are distinct mechanisms.',
    sourceIds: ['feministPolitics', 'feministEthics', 'civilPoliticalRights'],
  },
  q0478: {
    contextNote: 'This descriptive item concerns the durability of norm change when new behavior becomes publicly expected and socially reinforced. Legal permission may be necessary without being sufficient; enforcement, reference groups, sanctions, material incentives, and unequal effects can mediate whether a change persists across settings.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0479: {
    contextNote: 'This descriptive item separates formal rule change from persistence of older informal expectations. It does not claim that law cannot change norms or that group sanctions always preserve the status quo; the timing and direction of change can depend on enforcement, institutions, social learning, and material dependence.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0446: {
    contextNote: 'This normative item isolates a conflict between aggregate human welfare and the possibility that ecosystem destruction is independently wrong. It does not specify how welfare is measured, whether every ecosystem has equal standing, or which policy should resolve a concrete tradeoff.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0447: {
    contextNote: 'This normative item distinguishes intrinsic nonhuman moral standing from human-interest stewardship. It does not settle whether standing belongs to individual organisms, species, ecosystems, or future ecological relationships.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0448: {
    contextNote: 'This normative item tests a human-priority exception under costly alternatives. It does not define necessity, acceptable harm, property rights, or the threshold at which a cheaper human option becomes morally insufficient.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0449: {
    contextNote: 'This normative item isolates conditional justification for defensive force. It leaves necessity, proportionality, civilian protection, and who may authorize force open rather than treating any claimed security interest as sufficient.',
    sourceIds: ['war', 'unCharter'],
  },
  q0450: {
    contextNote: 'This normative item tests a restraint on force when a less violent alternative can address the same immediate threat. It is not a general claim that nonviolent policy is always feasible or that military force is never permissible.',
    sourceIds: ['war', 'unCharter'],
  },
  q0451: {
    contextNote: 'This normative item concerns defensive force despite domestic burdens. It does not decide whether the burden should fall on conscripts, taxpayers, or volunteers, nor whether a particular war is necessary or lawful.',
    sourceIds: ['war', 'civilPoliticalRights'],
  },
  q0452: {
    contextNote: 'This normative item distinguishes symbolic recognition of religion from coercive establishment. Equal civic standing is held constant, but the item does not specify whether recognition includes funding, ceremonies, exemptions, or constitutional privilege.',
    sourceIds: ['secularism', 'civilPoliticalRights'],
  },
  q0453: {
    contextNote: 'This normative item tests neutrality toward a majority tradition, not hostility to religion. It leaves open whether public reasons may be religiously motivated and whether accommodation is compatible with equal citizenship.',
    sourceIds: ['secularism', 'civilPoliticalRights'],
  },
  q0454: {
    contextNote: 'This normative item isolates opposition to unchecked clerical legal authority. It does not imply that religious interpretation must be excluded from public life or that courts, elected officials, or constitutional texts are automatically neutral.',
    sourceIds: ['secularism', 'civilPoliticalRights'],
  },
  q0455: {
    contextNote: 'This descriptive item is scoped to accountability conditions in which voters can compare evidence and observe consequences. It does not imply that voters receive equal information, that elections select competent leaders, or that accountability always improves policy.',
    sourceIds: ['electoralInformation', 'democracy'],
  },
  q0456: {
    contextNote: 'This descriptive item isolates retrospective attribution failure under competitive elections. Identity cues and misinformation are possible mechanisms, not universal explanations, and the item does not claim that voters are incapable of learning.',
    sourceIds: ['electoralInformation', 'democracy'],
  },
  q0457: {
    contextNote: 'This descriptive item separates participation from information and deliberative quality. It does not imply that mass participation is harmful or that expert filtering reliably produces better decisions.',
    sourceIds: ['democracy', 'democraticInnovations'],
  },
  q0458: {
    contextNote: 'This descriptive item concerns institutional conditions that make expert advice more useful: independent checking, transparent methods, and reported uncertainty. It does not treat transparency as proof of correctness or as a replacement for authorization.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0459: {
    contextNote: 'This descriptive item tests a public-choice risk within professional expertise. It does not assert that all expert bodies are captured or that ordinary political control is free of status and self-interest effects.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0460: {
    contextNote: 'This descriptive item asks whether contestable and bounded expertise can improve public decisions. It leaves the quality of the evidence, the independence of reviewers, and the allocation of final authority open.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0461: {
    contextNote: 'This descriptive item tests a mediated account of legal norm change: rules matter partly through enforcement and social incentives. It does not claim that law alone changes culture or that every norm responds at the same speed.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0462: {
    contextNote: 'This descriptive item isolates persistence under stable relational and economic dependencies. It does not make path dependence permanent or deny that legal change can alter incentives and reference groups.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0463: {
    contextNote: 'This descriptive item separates institutional influence on expectations from unanimous moral conversion. It does not specify whether the change is desirable, how coercive the institution is, or whether effects are equal across groups.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0464: {
    contextNote: 'This prescriptive item measures conditional reform preference when reform can remove the injustice without preserving the same power. It does not presume that existing institutions are legitimate or that reform is always available.',
    sourceIds: ['politicalReform', 'revolution'],
  },
  q0465: {
    contextNote: 'This prescriptive item measures conditional support for replacement when a core institutional function is inseparable from domination and no credible reform path exists. It leaves the design and accountability of the replacement open.',
    sourceIds: ['revolution', 'politicalReform'],
  },
  q0466: {
    contextNote: 'This prescriptive item rejects disruption as a sufficient reason to expect revolutionary improvement. It does not reject disruptive tactics categorically or assume that existing institutions are more accountable.',
    sourceIds: ['revolution', 'politicalReform'],
  },
  q0467: {
    contextNote: 'This prescriptive item treats elections as a potentially useful movement tactic under a condition of continued independent organizing. It does not equate electoral work with party loyalty or passive institutionalism.',
    sourceIds: ['democracy', 'electoralJustice', 'politicalReform'],
  },
  q0468: {
    contextNote: 'This prescriptive item tests direct action under repeated institutional exclusion. Direct action can include organizing, protest, strikes, or civil disobedience with different legal and coercive risks; it is not synonymous with violence.',
    sourceIds: ['civilDisobedience', 'democracy', 'revolution'],
  },
  q0469: {
    contextNote: 'This prescriptive item measures opposition to electoral exclusivity rather than opposition to elections themselves. It leaves the relative value of organizing, protest, mutual aid, and office-holding open.',
    sourceIds: ['democracy', 'civilDisobedience', 'politicalReform'],
  },
  q0470: {
    contextNote: 'This prescriptive item isolates conditional compromise: real gains plus a credible route to correction. It does not imply that every partial agreement is reversible or that immediate gains outweigh entrenched injustice.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0471: {
    contextNote: 'This prescriptive item tests persistence when a settlement would permanently entrench the injustice. It does not require maximal demands in ordinary negotiation or deny the value of temporary gains that preserve future correction.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0472: {
    contextNote: 'This prescriptive item treats verifiable concessions and revisability as conditions supporting negotiation. It does not claim that every issue is open to revision or that evidence and power are evenly distributed between opponents.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0473: {
    contextNote: 'This descriptive item distinguishes what expert evidence can clarify from the normative choice among competing values and distributional priorities. It does not treat evidence as politically neutral, imply that experts should decide values, or deny that transparent assumptions, uncertainty, contestability, and public representation affect the usefulness of advice.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0427: {
    contextNote: 'This normative item isolates the claim that species survival can have moral value independent of direct human benefit. It does not settle whether all species have equal standing, how ecological tradeoffs should be compared, or which institution should enforce a duty toward nonhuman life.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0428: {
    contextNote: 'This normative item asks whether destruction can wrong a species or ecosystem even without a measurable human loss. It is distinct from stewardship for human welfare, aesthetic preference, biodiversity policy, and any particular theory of legal standing or conservation governance.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0429: {
    contextNote: 'This normative item tests whether extraction claims are limited by effects on other species’ conditions of flourishing. It does not specify a property regime, a pollution instrument, a threshold for ecological harm, or how to weigh human needs against nonhuman interests in a concrete case.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0430: {
    contextNote: 'This descriptive item is scoped to deliberative mini-publics and related democratic innovations where participants receive structured information and time to deliberate. Evidence of average knowledge gains does not establish that every deliberative design improves decisions, represents absent groups, or produces the same effect outside the studied settings.',
    sourceIds: ['democraticInnovations'],
  },
  q0431: {
    contextNote: 'This descriptive item isolates an accountability mechanism: observable outcomes and credible alternatives can help voters connect performance to officeholders. Information effects vary with media, institutions, issue salience, and who receives the signal, so the item is not a claim that elections reliably select competent leaders in every setting.',
    sourceIds: ['electoralInformation', 'democracy'],
  },
  q0432: {
    contextNote: 'This descriptive item concerns incomplete or unequal electoral information rather than a blanket judgment about voters. Performance signals can be noisy, strategically supplied, or unevenly distributed, and information can alter accountability in different ways across voters, issues, and political environments.',
    sourceIds: ['electoralInformation', 'democracy'],
  },
  q0433: {
    contextNote: 'This descriptive item concerns the institutional conditions under which expert advice is more useful: transparent evidence, stated assumptions, uncertainty, and opportunities for challenge. It does not imply that expertise replaces democratic authorization or that transparency guarantees a correct recommendation.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0434: {
    contextNote: 'This descriptive item isolates the risk that technical agencies become detached when their evidence and decisions are insulated from scrutiny. Independence can protect expertise from short-term pressure, while review and contestability can protect the public from insulation; the item does not treat either value as universally dominant.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0435: {
    contextNote: 'This descriptive item separates formal legal change from durable norm change. Enforcement, incentives, reference groups, public acceptance, and time can mediate whether a new rule changes expectations and behavior; agreement does not imply that law alone determines family or gender norms.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0436: {
    contextNote: 'This prescriptive item measures a conditional preference for reform over rupture when ordinary action can materially reduce coercion. It does not say that existing institutions are generally legitimate, that reform is always available, or that disruptive action is never justified.',
    sourceIds: ['civilDisobedience', 'revolution', 'politicalReform'],
  },
  q0437: {
    contextNote: 'This prescriptive item measures a conditional willingness to pursue revolutionary rupture when ordinary reform cannot remove a central injustice. It leaves open what counts as revolutionary, how feasibility and civilian risk are assessed, and whether a proposed replacement would be more accountable.',
    sourceIds: ['revolution', 'civilDisobedience', 'politicalReform'],
  },
  q0438: {
    contextNote: 'This prescriptive item tests support for elections as one instrument within a broader movement strategy. It does not equate electoral participation with passive reliance on parties, and it leaves the meaning of durable gains, independent organizing, and institutional safeguards open to the respondent.',
    sourceIds: ['democracy', 'electoralJustice', 'politicalReform'],
  },
  q0439: {
    contextNote: 'This prescriptive item tests whether direct action should supplement formal participation when affected people lack meaningful influence. Direct action can include organizing, protest, civil disobedience, strikes, or other tactics with different legal and coercive risks; it is not a synonym for violence or rejection of elections.',
    sourceIds: ['civilDisobedience', 'democracy', 'revolution'],
  },
  q0440: {
    contextNote: 'This prescriptive item measures willingness to accept partial gains under a nonideal condition: material improvement plus a credible route to further change. It does not assume that every compromise is reversible or that a partial reform is worthwhile when it entrenches the underlying injustice.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0441: {
    contextNote: 'This prescriptive item tests persistence when a compromise would entrench the injustice at issue. It does not require maximal demands in every negotiation; the relevant distinction is whether the agreement preserves or blocks meaningful correction and whether short-term gains justify that risk.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0442: {
    contextNote: 'This prescriptive item treats revisability as a condition for compromise. Negotiation can be preferable when an agreement permits learning and correction, but the item does not imply that all evidence is neutral, all policy harms are reversible, or maximal demands are never necessary.',
    sourceIds: ['politicalReform', 'civilDisobedience'],
  },
  q0443: {
    contextNote: 'This prescriptive item tests a strong direct-action preference under a condition of systematic exclusion from meaningful influence. Direct action can include protest, strikes, civil disobedience, or other tactics with different legal and coercive risks; the condition does not imply that every formal institution is equally closed.',
    sourceIds: ['civilDisobedience', 'democracy', 'revolution'],
  },
  q0302: {
    contextNote: 'This normative item isolates nonhuman standing from the separate question of who owns or governs a resource. Environmental ethics contains competing accounts of intrinsic value, rights, welfare, and stewardship; agreement does not select one conservation instrument or deny human needs.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0303: {
    contextNote: 'This normative item connects the value of economic growth to ecological conditions for future choice. It does not define “improves lives,” assume one technology or ownership system, or claim that relative decoupling automatically satisfies absolute ecological limits.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0322: {
    contextNote: 'This normative item concerns the state’s use of its own population for prestige, empire, or ideological projects. It is distinct from whether defensive force can ever be justified and from empirical claims about military effectiveness, alliance behavior, or national security.',
    sourceIds: ['war', 'unCharter'],
  },
  q0323: {
    contextNote: 'This normative item distinguishes defense against attack from regime transformation abroad. It does not decide the legality or morality of every intervention, and separate judgments about necessity, proportionality, civilian protection, and postwar governance remain relevant.',
    sourceIds: ['war', 'unCharter'],
  },
  q0339: {
    contextNote: 'This normative item asks whether a government can claim moral credit for external freedom while imposing coercive burdens on conscripts and taxpayers at home. It concerns the relationship between means and justification, not whether taxation, military service, or foreign assistance is always impermissible.',
    sourceIds: ['war', 'civilPoliticalRights'],
  },
  q0444: {
    contextNote: 'This descriptive item separates formal legal change from the pace of change in gender and family practices. Enforcement, material dependence, reference groups, and public acceptance can mediate whether a new legal rule becomes ordinary behavior; the claim is not that law is irrelevant or that persistence is permanent.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0445: {
    contextNote: 'This descriptive item tests whether campaigns and institutions can shift social expectations through incentives and reference-group behavior. Change can be gradual, contested, and uneven, and the item does not treat public messaging as sufficient without institutional support or enforcement.',
    sourceIds: ['socialNormChange', 'feministPolitics'],
  },
  q0396: {
    contextNote: 'This prescriptive item rejects revolutionary strategy under a specified institutional risk: predictable replacement by a less accountable ruling class. It does not define every revolution as harmful or imply that existing institutions deserve deference when reform cannot address the injustice.',
    sourceIds: ['revolution', 'politicalReform'],
  },
  q0397: {
    contextNote: 'This prescriptive item treats reform as a strategy that can build constituencies for further change, while warning against permanent administrative dependency. It does not claim that liberalization is the only legitimate direction or that all reforms have the same political feedback effects.',
    sourceIds: ['politicalReform', 'revolution'],
  },
  q0412: {
    contextNote: 'This prescriptive item isolates willingness to centralize authority during a revolutionary transition away from capitalism. It raises a distinct question from the justice of the goal: transitional concentration can affect accountability, coercion, opposition, and the institutions that emerge afterward.',
    sourceIds: ['revolution', 'democracy'],
  },
  q0016: {
    contextNote: 'This prescriptive item tests sequencing: abolition of state functions is preferred only alongside credible replacement institutions. It does not establish that gradual change is always better, that replacement institutions must be centralized, or that existing state functions are legitimate by default.',
    sourceIds: ['politicalReform', 'revolution', 'civilDisobedience'],
  },
  q0413: {
    contextNote: 'This prescriptive item distinguishes organized shared strategy from purely spontaneous or affinity-based action. Collective discipline can improve coordination while creating risks of hierarchy and coercion; support for it does not specify a party structure or reject decentralization altogether.',
    sourceIds: ['civilDisobedience', 'democracy', 'revolution'],
  },
  q0423: {
    contextNote: 'This prescriptive item isolates willingness to accept a partial negotiated welfare expansion when the full reform cannot pass. It does not settle whether the policy is universal or targeted, whether partial implementation is administratively sound, or whether the compromise leaves a credible path to further change.',
    sourceIds: ['politicalReform', 'distributiveJustice'],
  },
  q0135: {
    contextNote: 'This prescriptive item concerns bank resolution rather than ordinary bankruptcy or monetary policy. Resolution standards distinguish shareholders, unsecured or uninsured creditors, insured depositors, and public solvency support; jurisdictions vary in the exact hierarchy and safeguards, and management accountability is a separate governance question.',
    sourceIds: ['bankResolution', 'bankFailureResolution'],
  },
  q0029: {
    contextNote: 'This descriptive item concerns one mechanism that can help sustain ownership concentration: political access that creates entry barriers or other advantages for incumbents. The cited policy-capture and competition research does not imply that every concentration is politically created; technology, scale, network effects, and consumer demand remain separate explanations, and an association with access is not by itself proof of unlawful capture.',
    sourceIds: ['policyCapture', 'competitionAssessment'],
  },
  q0127: {
    contextNote: 'This descriptive item is conditional on users being able to compare issuers and switch at low cost. Competition may discipline some issuers, but redeemability, reserves, network effects, confidence, runs, settlement, and consumer protection can alter the result; historical private notes and contemporary digital systems are not interchangeable evidence.',
    sourceIds: ['currencyCompetition', 'bankNotesStablecoins'],
  },
  q0208: {
    contextNote: 'This descriptive item is scoped to U.S. industry-level immigration and H-1B data linked to lobbying expenditures. The reported relationship compares sectors and organized-group influence; it is an association with model-based inferences, not a universal causal law about all migration restrictions, workers, or bargaining power, and sector demand may affect both lobbying and policy.',
    sourceIds: ['immigrationInterestGroups'],
  },
  q0227: {
    contextNote: 'This descriptive item is scoped to paired studies of Indian cities that compared stronger interethnic civic associations with mainly intraethnic networks. The evidence concerns associations and communal violence in those cases; it does not show that civic rituals alone build trust, that all intraethnic organization is harmful, or that the relationship is a universal city-level law.',
    sourceIds: ['interethnicCivicNetworks'],
  },
  q0329: {
    contextNote: 'This descriptive item is scoped to U.S. federal defense procurement around the post-September 11 spending increase. The study reports larger awards for politically connected or lobbying firms, but warns that its data do not identify causality; the result does not establish that every contractor, security agency, or public threat assessment benefits from inflationary rhetoric.',
    sourceIds: ['politicalConnectionsDefenseContracts'],
  },
  q0347: {
    contextNote: 'This descriptive item is scoped to a meta-analysis of 100 quantitative studies of deliberative mini-publics in established democracies. Its clearest average participant-level capability effect was increased political knowledge; effects on attitudes, behavior, deliberative quality, and decisions vary by design, so the finding does not prove that every deliberative process works better or internalizes absent groups’ costs.',
    sourceIds: ['democraticInnovations'],
  },
  q0350: {
    contextNote: 'This descriptive item is scoped to documented democratic backsliding episodes in which governing actors sometimes weakened checks through formal or informal institutional changes. Flexible interpretation is one possible mechanism among many, and the evidence does not imply that courts, parties, or agencies always benefit from erosion or that constitutional constraints inevitably fail.',
    sourceIds: ['democraticBacksliding'],
  },
  q0136: {
    contextNote: 'This prescriptive item concerns permission to hold or use alternative forms of money. Private, foreign, commodity-linked, and digital instruments differ in legal-tender status, redemption, consumer protection, fraud exposure, run risk, and payment-system effects; support for currency choice does not imply that all forms are interchangeable.',
    sourceIds: ['privateMoneyPayments', 'monetaryPolicy'],
  },
  q0318: {
    contextNote: 'This prescriptive item compares technology-and-efficiency strategies with broad consumption limits. Carbon intensity, energy intensity, material intensity, GDP growth, and absolute emissions are distinct measures; observed decoupling varies across countries and periods and is not by itself sufficient for climate stabilization.',
    sourceIds: ['climateDecoupling', 'climateAssessment'],
  },
  q0007: {
    contextNote: 'This descriptive item is scoped to U.S. metropolitan police-service comparisons in Ostrom’s research. “Autonomous providers” refers to multiple service-producing units and their relative output or efficiency, not necessarily privatization, competitive contracting, or reliable individual exit; the result should not be generalized to every public service.',
    sourceIds: ['polycentricGovernance'],
  },
  q0067: {
    contextNote: 'This descriptive item is scoped to a randomized interview-timing study of SNAP recertification cases in San Francisco. Later interview assignments reduced recertification and subsequent participation for affected cases, while many people re-enrolled; the result identifies an administrative-burden margin rather than proving that every closed case was eligible or that all welfare programs respond identically.',
    sourceIds: ['snapRecertification'],
  },
  q0107: {
    contextNote: 'This descriptive item is scoped to high-cost metropolitan housing markets where land-use controls may constrain construction. The cited zoning research connects restrictive controls with higher housing costs but describes its evidence as suggestive and does not by itself settle density, displacement, segregation, infrastructure, or distributional effects.',
    sourceIds: ['housingSupply'],
  },
  q0328: {
    contextNote: 'This descriptive item is scoped to the Afghanistan reconstruction lessons reviewed by SIGAR and USIP. Local knowledge and buy-in are treated as conditions that can improve development success; the item does not claim that all projects failed or that this case supplies a universal law of intervention.',
    sourceIds: ['afghanistanReconstruction'],
  },
  q0402: {
    contextNote: 'This normative item isolates anticipatory self-defense: force against an attack judged sufficiently imminent. It should be distinguished from preventive war against a remote future threat, and from separate judgments about necessity, proportionality, legality, and moral legitimacy; Article 51 and state practice leave the scope of anticipatory action contested.',
    sourceIds: ['war', 'unCharter'],
  },
  q0425: {
    contextNote: 'This normative item asks whether inherited succession can itself provide a legitimate basis for political office. Hereditary office, constitutional limits, consent, equal citizenship, competence, and claims about continuity or social order are distinct considerations; continuity is a claimed justification, not proof that the arrangement is legitimate or stable.',
    sourceIds: ['authority', 'democracy'],
  },
  q0171: {
    contextNote: 'This descriptive item concerns institutional safeguards against exceptional powers becoming ordinary law. Emergency-law frameworks use sunset clauses, renewal limits, and periodic review because persistence is a recognized risk; the item does not claim that every crisis law outlasts its trigger or that all emergency powers are illegitimate.',
    sourceIds: ['emergencyPowers', 'democracy'],
  },
  q0050: {
    contextNote: 'This descriptive item isolates information asymmetry in regulation. Regulated firms can possess technical information regulators need, while regulators still need independent verification and diverse stakeholder input; information dependence creates a capture risk, not proof that a specific agency has been captured.',
    sourceIds: ['regulatoryInformationAsymmetry'],
  },
  q0089: {
    contextNote: 'This descriptive item is scoped to U.S. occupations whose licensing rules differ across states. Licensing can change labor supply, wages, employment, prices, quality, and safety; findings from one occupation or welfare model should not be generalized to every license.',
    sourceIds: ['occupationalLicensingWelfare', 'occupationalLicensingSafety'],
  },
  q0108: {
    contextNote: 'This descriptive item is scoped to high-demand U.S. housing markets. Zoning and other land-use controls can restrict construction and raise prices, but local land-use rules also address externalities and distribute costs and benefits in different ways; the item does not infer a single motive for every zoning board.',
    sourceIds: ['housingSupply'],
  },
  q0128: {
    contextNote: 'This descriptive item isolates heterogeneous monetary-policy transmission. Households differ in asset ownership, debt, borrowing constraints, income sources, and labor-market exposure, so the direction and size of effects should be measured rather than inferred from asset ownership alone.',
    sourceIds: ['distributionalMonetaryPolicy'],
  },
  q0130: {
    contextNote: 'This descriptive item is scoped to financial-sector licensing and compliance. Uniform rules can burden smaller entrants more than established firms with dedicated compliance capacity, while proportionate or activity-based regulation can change that effect; the item does not imply that all financial regulation protects incumbents.',
    sourceIds: ['financialEntryBarriers'],
  },
  q0207: {
    contextNote: 'This descriptive item is scoped to a review of randomized intergroup-contact experiments whose outcomes were measured at least one day after contact began. The review found a small and heterogeneous policy-relevant evidence base: most comparisons were positive, but effects varied by target group, larger studies tended to show weaker effects, and the review found no evidence about interracial contact effects on adults over 25. The older larger meta-analysis and this delayed-outcome review answer related but different questions; neither makes contact a universal policy guarantee.',
    sourceIds: ['intergroupContactUpdated', 'intergroupContactMetaAnalysis'],
  },
  q0033: {
    contextNote: 'This item asks whether a property regime should distinguish personal possessions from ownership or control of productive assets. Property rules for possessions, land, natural resources, and means of production can differ; agreement here is not a verdict on land taxation, redistribution, or private property generally.',
    sourceIds: ['property', 'distributiveJustice'],
  },
  q0036: {
    contextNote: 'This item isolates the legal and institutional conditions for workers to form and govern worker-owned cooperatives. Worker cooperatives, small firms, mutual-aid associations, and independent contracting are different organizational forms; agreement with this item does not treat them as interchangeable.',
    sourceIds: ['workerCooperatives', 'cooperativesWorkRights'],
  },
  q0075: {
    contextNote: 'This item tests one sequencing preference: whether governments should remove legal or supply-side barriers before adding tax-funded benefits. It does not claim that every basic good has the same cost mechanism or that every benefit should wait.',
    sourceIds: ['distributiveJustice', 'housingSupply'],
  },
  q0093: {
    contextNote: 'This item asks whether basic worker protection should follow the facts of the work relationship across employees, independent contractors, and cooperative workers. These classifications are not interchangeable: unions are collective organizations rather than a worker-status category, partnerships concern firm organization, and equal legal protection does not mean identical bargaining power, ownership, or workplace outcomes.',
    sourceIds: ['employmentRelationship', 'cooperativesWorkRights', 'labourRights'],
  },
  q0114: {
    contextNote: 'This prescriptive item compares supply-side permitting reform with broad demand subsidies in housing markets where supply is constrained. New construction, infrastructure, land availability, local approval, tenure, displacement, subsidy targeting, and time horizons can change the result; targeted assistance and supply reform are not mutually exclusive, and evidence from one market should not be generalized to every housing system.',
    sourceIds: ['housingSupplyAffordability', 'housingDemandSubsidies'],
  },
  q0123: {
    contextNote: 'This normative item measures a presumption in favor of contestable entry into saving, lending, and payment services. These activities have different risk profiles: proportionate rules may address capital, fit-and-proper standards, disclosure, complaints, fraud, AML/CFT, cyber resilience, settlement, and payment integrity rather than applying one identical licensing regime to all providers.',
    sourceIds: ['financialEntryBarriers', 'financialEntryLicensing', 'paymentSystemIntegrity'],
  },
  q0142: {
    contextNote: 'This normative item separates attribution from exclusive downstream control. Copyright systems distinguish economic rights, moral or attribution interests, licensing, and limitations or exceptions; criticism, research, repair, and follow-on creation can be treated differently across jurisdictions and uses, and the item does not deny compensation or voluntary support.',
    sourceIds: ['copyrightLimitations', 'intellectualProperty'],
  },
  q0154: {
    contextNote: 'This prescriptive item distinguishes patent term, claim scope, statutory exceptions, licensing, injunctions, and damages. It tests whether narrowing the breadth or duration of exclusivity should precede broader enforcement remedies; it does not assume that one national patent regime or technology sector has the same effects as another.',
    sourceIds: ['patentExceptions', 'patentRightsEnforcement'],
  },
  q0158: {
    contextNote: 'This prescriptive item compares interoperability and follow-on access with broad exclusionary enforcement. Open protocols require choices about standards governance, compatibility, privacy, security, and liability, while licensing and infringement remedies concern particular works or inventions; openness does not automatically create competition.',
    sourceIds: ['openStandardsDigitalInnovation', 'openStandardsCompetition', 'copyrightLimitations'],
  },
  q0217: {
    contextNote: 'This prescriptive item concerns priority-setting within interior immigration enforcement. Civil removal authority, criminal enforcement, work authorization, immigration status, fraud, public-safety threats, lawful orders, and due process are distinct categories; exact priority rules vary by jurisdiction and policy, and the item does not treat nonviolent status violations as harmless.',
    sourceIds: ['iceEnforcementStatistics', 'civilPoliticalRights'],
  },
  q0222: {
    contextNote: 'This item contrasts civic membership with inherited or ascriptive membership. Nationalism scholarship distinguishes these models; it does not assume that every cultural nation demands an independent state.',
    sourceIds: ['nationalism', 'ethnonationalism'],
  },
  q0173: {
    contextNote: 'This item tests one default-protection principle across several rights. Expression, association, religion, encryption, and due process have different legal sources, threat models, and limitation tests; encryption is a technical means of protecting communications rather than a separate ICCPR article. Agreement therefore does not imply identical limits or identical enforcement for every example.',
    sourceIds: ['civilPoliticalRights', 'cryptography', 'liberalism'],
  },
  q0191: {
    contextNote: 'This descriptive item asks about a pressure mechanism in plea-bargaining systems, not a universal claim that pleas are coercive or that most pleas are false. Studies find both that some defendants who maintain innocence accept pleas and that innocent defendants can reject offers attractive to similarly situated guilty defendants; real-world trial/plea comparisons are affected by selection, unobserved case strength, and jurisdiction-specific rules.',
    sourceIds: ['pleaInnocenceEffect', 'pleaMiscarriageJustice', 'legalPunishment', 'civilPoliticalRights'],
  },
  q0147: {
    contextNote: 'This descriptive item is scoped to digital markets and asks about interoperability and switching or integration barriers, not a universal claim that openness always increases innovation. Open standards can reduce dependence on a single provider in some settings, while standard-setting can impose maintenance costs or entrench a technology depending on design and market conditions.',
    sourceIds: ['openStandardsDigitalInnovation', 'openStandardsCompetition'],
  },
  q0248: {
    contextNote: 'This descriptive item is scoped to cross-national evidence on official or preferred religions and the legal or practical privileges attached to them. State religion, favored religion, restrictions on minority groups, and clerical adjudicative authority are related but distinct arrangements; the pattern varies substantially across jurisdictions.',
    sourceIds: ['religionOfficialStatus', 'religionRestrictions'],
  },
  q0307: {
    contextNote: 'This descriptive item is scoped to CERCLA/Superfund enforcement: identifying potentially responsible parties can trigger cleanup obligations or payment, but the mechanism depends on hazardous-substance release, responsible-party identification, evidence, and enforceability. It is not a general estimate of pollution reduction under every liability regime.',
    sourceIds: ['superfundLiability', 'superfundEnforcement'],
  },
  q0368: {
    contextNote: 'This descriptive item is scoped to the federal law-enforcement facial-recognition services reviewed by GAO. It asks about use across purposes and the adequacy of training and privacy safeguards in that review, not every detection technology or every federal agency.',
    sourceIds: ['gaoFacialRecognitionPrivacy'],
  },
  q0193: {
    contextNote: 'This item isolates a necessity threshold for incapacitation, a liberty-restricting justice intervention. Restitution, rehabilitation, deterrence, and prevention are distinct aims; agreement does not imply that incapacitation is justified whenever it is administratively convenient.',
    sourceIds: ['legalPunishment', 'civilPoliticalRights'],
  },
  q0215: {
    contextNote: 'This item asks whether lawful migration should remain open while housing and labor markets adjust. It does not assume that admission policy, housing supply, and labor-market rules are one instrument or that adjustment costs are distributed equally.',
    sourceIds: ['immigration', 'housingSupply', 'labour'],
  },
  q0274: {
    contextNote: 'This item reduces several examples to one construct: whether adults can exit unwanted legal or economic dependency in intimate life. Divorce, contraception, adoption, and independent work involve different institutions and should not be treated as one empirical outcome.',
    sourceIds: ['feministPolitics', 'feministEthics', 'labour'],
  },
  q0314: {
    contextNote: 'This item asks about a general regulatory stance toward low-carbon deployment. Technologies and infrastructure have distinct safety, land-use, and distributional issues; agreement is not a claim that one policy works everywhere.',
    sourceIds: ['climateAssessment', 'environmentalEthics', 'housingSupply'],
  },
  q0354: {
    contextNote: 'This item isolates procedural accountability for consequential expert-agency decisions: affected people should receive reasons and have a meaningful way to challenge them. Sunset review, competitive alternatives, and the precise appeal body are separate institutional choices.',
    sourceIds: ['regulatorGovernance', 'regulatorAppeals'],
  },
  q0376: {
    contextNote: 'This item isolates contestability when a public algorithm contributes to a consequential decision. Audit access and appeal are related but distinct safeguards, and their design depends on the decision context, legal authority, confidentiality, and error costs.',
    sourceIds: ['aiEthics', 'aiRisk', 'civilPoliticalRights'],
  },
  q0375: {
    contextNote: 'This item isolates case-specific legal authorization for government access to private data. Privacy law and human-rights guidance also address necessity, proportionality, designated authorization, oversight, complaints, and remedies; a preference for authorization does not specify one universal warrant procedure.',
    sourceIds: ['iccprPrivacy', 'civilPoliticalRights'],
  },
  q0355: {
    contextNote: 'This item isolates pre-vote review of referendum proposals for compatibility with fundamental rights. Fiscal notes, clear question wording, campaign fairness, and anti-discrimination safeguards are related but distinct design choices; agreement does not specify one review body or settle every referendum rule.',
    sourceIds: ['referendumSafeguards', 'civilPoliticalRights'],
  },
  q0012: {
    contextNote: 'This descriptive item is scoped to documented common-pool and polycentric settings. Predictable rules, monitoring, graduated sanctions, and accessible conflict resolution describe how some communities sustain cooperation; they do not establish that every stable order can dispense with a sovereign or that polycentric governance always works.',
    sourceIds: ['polycentricGovernance'],
  },
  q0027: {
    contextNote: 'This descriptive item concerns land and resource-tenure systems. Clear rules for possession, transfer, and dispute resolution can reduce overlapping claims in some settings, while the same legal system can distribute scarcity, access, and bargaining power; agreement does not endorse every title system or treat scarcity as purely artificial.',
    sourceIds: ['property', 'landTenure'],
  },
  q0030: {
    contextNote: 'This descriptive item concerns state-owned enterprises. Public ownership changes the principal, board, and accountability chain, but it does not by itself remove managerial hierarchy or settle questions of autonomy, disclosure, performance, and political influence.',
    sourceIds: ['stateOwnedGovernance'],
  },
  q0047: {
    contextNote: 'This descriptive item isolates one information function of prices: they can transmit some dispersed signals among market participants without any participant knowing the whole economy. It does not imply that prices solve market power, externalities, missing markets, or distributional conflicts.',
    sourceIds: ['marketsKnowledge'],
  },
  q0048: {
    contextNote: 'This descriptive item isolates the local and changing-information problem in centralized planning. Honest or technically capable planners can still face information that is dispersed, tacit, or difficult to update; the item does not claim that markets solve every coordination problem or that planners never improve outcomes.',
    sourceIds: ['marketsKnowledge', 'polycentricGovernance'],
  },
  q0148: {
    contextNote: 'This descriptive item concerns patent-intensive sectors and separates portfolio uses: commercialization, licensing, cross-licensing, litigation strategy, and defensive accumulation. Patent law’s disclosure function and a portfolio’s strategic use are distinct questions, so the item does not claim that patents generally fail to disclose inventions.',
    sourceIds: ['patentStrategies'],
  },
  q0188: {
    contextNote: 'This descriptive item distinguishes activity measures such as arrests, response times, and budgets from outcomes such as safety, perceived safety, trust, and satisfaction. A performance system can include both; the item asks whether activity is easier to count and therefore can displace outcome measurement.',
    sourceIds: ['policePerformance'],
  },
  q0190: {
    contextNote: 'This descriptive item is scoped to forfeiture systems in which agencies can receive or spend proceeds or equitable-sharing payments. That funding structure creates a potential resource incentive around seizures; it does not establish improper motive in a particular case or imply that all forfeiture is revenue-seeking.',
    sourceIds: ['forfeitureFunding'],
  },
  q0269: {
    contextNote: 'This descriptive item concerns tax-transfer and benefit rules that classify households by marriage, children, cohabitation, or other characteristics. Different classifications can produce different eligibility and net-transfer outcomes; the item does not claim that any one household form is universally privileged or that unclassified households are literally invisible.',
    sourceIds: ['householdTypologies'],
  },
  q0308: {
    contextNote: 'This descriptive item tests whether environmental compliance costs alter competitive conditions when they vary by establishment or firm size. The cited EPA/Census study reports that pollution-abatement cost intensity can vary by size and, in its main results, increases with establishment and firm size; the broader literature is mixed, so the item does not assume a universal small-firm penalty or incumbent advantage.',
    sourceIds: ['environmentalComplianceCosts'],
  },
  q0348: {
    contextNote: 'This descriptive item is scoped to low-salience elections or policy domains. Information acquisition can vary with issue salience, electoral institutions, media exposure, and the expected effect of an individual vote; it does not claim that voters are generally uninformed or that expertise should replace democratic judgment.',
    sourceIds: ['democracy', 'electoralJustice'],
  },
  q0411: {
    contextNote: 'This prescriptive item isolates a preference for worker-council governance of production in a post-capitalist economy. Neighborhood assemblies, confederal territorial administration, party organization, transition sequencing, and the performance of council systems are distinct; the item does not claim that federated councils solve coordination or accountability problems.',
    sourceIds: ['employeeGovernance', 'democraticConfederalism', 'democracy'],
  },
  q0225: {
    contextNote: 'This item isolates a normative question about coercive assimilation. Cultural continuity, minority self-government, and voluntary association are distinct policy possibilities rather than interchangeable claims.',
    sourceIds: ['nationalism', 'multiculturalism'],
  },
  q0405: {
    contextNote: 'This item concerns whether religious commitments may shape coercive public law. “Islamic democracy” is not identical to theocracy; constitutional models differ over who interprets religious principles and how rights are protected.',
    sourceIds: ['islamicConstitutionalism', 'islamicDemocracy'],
  },
  q0406: {
    contextNote: 'This item asks whether a religious institution may hold final legal authority over people who reject its doctrines. That institutional question is distinct from whether religious citizens may participate in public reasoning or offer religious arguments for a law.',
    sourceIds: ['islamicConstitutionalism', 'civilPoliticalRights'],
  },
  q0242: {
    contextNote: 'This item asks about the justificatory standard for coercive law: whether citizens must be able to assess the justification without accepting one religious authority. That is distinct from whether a religious institution may hold final legal power.',
    sourceIds: ['secularism', 'civilPoliticalRights'],
  },
  q0414: {
    contextNote: 'This item tests a claim about the hierarchy between civil law and revealed religious law. It does not by itself identify one school of jurisprudence, one constitutional mechanism, or one answer about minority rights.',
    sourceIds: ['islamicConstitutionalism', 'islamicDemocracy'],
  },
  q0415: {
    contextNote: 'This item contrasts civic membership with ancestry as sources of political membership. Civic and ethnic categories are ideal types that can be blended in practice, and civic criteria such as language, loyalty, or naturalization can still exclude; religious authority is tested separately by the religion-and-law items.',
    sourceIds: ['nationalism', 'multiculturalism'],
  },
  q0417: {
    contextNote: 'This item asks whether preserving inherited cultural continuity should justify a policy cost in openness. It does not determine whether the continuity is ethnic, religious, linguistic, or civic, nor which immigration instrument would follow.',
    sourceIds: ['nationalism', 'immigration'],
  },
  q0420: {
    contextNote: 'This prescriptive item compares binding limits on material throughput with a strategy centered on green economic growth. GDP growth, greenhouse-gas emissions, material use, and ecological harm are related but not interchangeable; evidence on relative and absolute decoupling varies by country, consumption accounting, time period, rebound effects, and climate-target compatibility.',
    sourceIds: ['climateDecoupling', 'climateAssessment', 'environmentalEthics'],
  },
  'fm-fem-1': {
    contextNote: 'This item measures an institutional reform orientation, not whether formal equality is the only valid feminist diagnosis. A respondent can support equal rights while also believing that structural patriarchy or material dependence requires additional analysis.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights'],
  },
  'fm-fem-5': {
    contextNote: 'This item isolates whether gender liberation requires reorganizing paid and unpaid labor and care rather than relying only on formal anti-discrimination law. It does not also ask about ownership, workplace governance, or one preferred policy instrument; those are separate questions.',
    sourceIds: ['feministPolitics', 'careWork', 'labour'],
  },
  'fm-fem-6': {
    contextNote: 'This item measures the strategic value assigned to legislation, courts, and public institutions. It separates institutional strategy from a diagnosis of patriarchy and from the broader goal of gender equality.',
    sourceIds: ['feministPolitics', 'democracy', 'civilPoliticalRights'],
  },
  'fm-fem-7': {
    contextNote: 'This item asks whether permanent centralized hierarchy is compatible with liberation. It measures an anti-hierarchical strategy preference and does not imply that every state action, public institution, or temporary coordination structure has the same status.',
    sourceIds: ['feministPolitics', 'authority', 'democracy'],
  },
  'fm-te-1': {
    contextNote: 'This prescriptive item asks how technically complex decisions should allocate authority between qualified expertise and ordinary public accountability. Expertise can improve analysis without settling legitimacy, representation, value conflict, or appeal; the item therefore does not imply that experts should replace democratic institutions or that every technical decision needs the same delegation model.',
    sourceIds: ['democracy', 'electoralJustice', 'aiEthics'],
  },
  'fm-te-3': {
    contextNote: 'This descriptive item separates technical affordances from political outcomes: cryptography can provide security services such as confidentiality, integrity, and authentication, while distributed or peer-to-peer architectures can alter where coordination and trust are placed. Those properties may reduce dependence on a central intermediary in some uses, but they do not by themselves establish democratic governance, equal control, or durable decentralization.',
    sourceIds: ['cryptography', 'decentralizedNetworkGovernance', 'aiEthics'],
  },
  'fm-mm-4': {
    contextNote: 'This prescriptive item isolates a preference for confederal coordination among municipalities or regions, with higher-level authority limited rather than sovereign over local communities. It is distinct from generic decentralization, ordinary federalism, and the descriptive question of whether local units can coordinate effectively.',
    sourceIds: ['federalism', 'democraticConfederalism', 'democracy'],
  },
  'fm-id-5': {
    contextNote: 'This item isolates language and cultural accommodation as one form of pluralist citizenship. It does not also ask about religious exemptions, reserved representation, self-government, or territorial separation; those are measured separately.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-19': {
    contextNote: 'This item isolates conscience or religious exemptions and adds a harm-limiting condition. It does not imply that every claimed exemption is justified or that exemptions settle questions about representation, self-government, or clerical authority.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'secularism'],
  },
  'fm-id-20': {
    contextNote: 'This item isolates guaranteed or reserved representation as a possible equality remedy. Representation is distinct from language accommodation, individual exemption, autonomy, and territorial sovereignty, and its justification can depend on institutional history and design.',
    sourceIds: ['multiculturalism', 'democracy', 'civilPoliticalRights'],
  },
  'fm-id-21': {
    contextNote: 'This item measures whether formal recognition and treaty implementation can strengthen Indigenous authority. It is separate from the descriptive claim that colonial dispossession continues and from the prescriptive possibility of rebuilding institutions without waiting for recognition.',
    sourceIds: ['nationalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-22': {
    contextNote: 'This item measures autonomous resurgence as an institutional strategy. It is not the opposite of every negotiated agreement: Indigenous movements can pursue autonomous institution-building while also using treaties, recognition, or other forms of external engagement.',
    sourceIds: ['nationalism', 'revolution', 'civilPoliticalRights'],
  },
  'fm-rn-5': {
    contextNote: 'This prescriptive item isolates constitutional review as a rights constraint on ordinary lawmaking. Review may be judicial, legislative, or mixed, and systems differ over appointment, interpretive authority, amendment, and democratic control; the item does not imply that courts are always more legitimate or accurate than elected bodies.',
    sourceIds: ['islamicConstitutionalism', 'democracy', 'civilPoliticalRights'],
  },
  'fm-rn-6': {
    contextNote: 'This prescriptive item isolates peaceful party competition and alternation in government. Electoral eligibility, party organization, equal citizenship, constitutional limits, and religious or ideological restrictions are distinct design choices; support for competition does not settle every question about majoritarianism, judicial review, or state neutrality.',
    sourceIds: ['islamicPartyCompetition', 'democracy', 'civilPoliticalRights'],
  },
  'fm-rn-7': {
    contextNote: 'This normative item tests whether Islamic ethical or legal traditions may contribute to constitutional public authority while equal civic standing and citizen accountability remain requirements. Islamic constitutionalism has multiple historical and institutional forms; the item does not identify one school of jurisprudence or require clerical rule.',
    sourceIds: ['cambridgeIslamicConstitutionalism2023', 'islamicConstitutionalism', 'civilPoliticalRights'],
  },
  'fm-rn-8': {
    contextNote: 'This prescriptive item isolates who may interpret and contest Islamic principles in public law. Judicial review, party competition, constitutional rights, popular sovereignty, and clerical authority can be arranged in different combinations; support for interpretive pluralism is not a claim that courts or majorities are always correct.',
    sourceIds: ['islamicDemocracy', 'islamicPartyCompetition', 'democracy', 'civilPoliticalRights'],
  },
  'fm-rn-9': {
    contextNote: 'This normative item tests Hindu civilizational belonging as a specific account of Indian political membership, not Hinduism as a personal religion. Scholarship distinguishes several uses of Hindutva and debates how cultural identity, majoritarian citizenship, secularism, and state power relate; agreement does not specify one party program or treatment of minorities.',
    sourceIds: ['oxfordHindutvaDefinitions', 'ethnonationalism', 'civilPoliticalRights'],
  },
  'fm-rn-10': {
    contextNote: 'This normative item isolates Jewish collective self-determination as a political aim while leaving borders, religion, economic system, and constitutional form open. Zionist currents have included liberal, socialist, religious, revisionist, and other projects; agreement does not identify one current government or one position on the Israeli-Palestinian conflict.',
    sourceIds: ['cambridgeZionismHistory', 'cambridgeZionismLabour', 'nationalism'],
  },
  'fm-te-5': {
    contextNote: 'This prescriptive item isolates the direction of accelerationist strategy: intensifying market competition and existing economic dynamics rather than redirecting technological capacity toward post-capitalist ends. Accelerationism includes left, right, unconditional, and technology-centered uses; the item does not define the whole family or imply that disruption is beneficial in every context.',
    sourceIds: ['accelerationism', 'markets'],
  },
  'fm-te-6': {
    contextNote: 'This prescriptive specialist item isolates centralized administrative coordination from the separate question of whether technical expertise is valuable. A single national authority can be expert or non-expert, and local or voluntary institutions can use expertise; the item therefore does not by itself identify technocracy, cyberocracy, or any particular technology policy.',
    sourceIds: ['authority', 'federalism', 'evidenceGovernance'],
  },
  sq01: {
    contextNote: 'This normative statement-choice item separates the source of authority from the conditions that constrain its exercise. Consent, lawful procedure, accountability, necessity, and toleration are different legitimacy arguments; choosing one statement does not establish that every authority using that rationale is justified in practice or that the other considerations never matter.',
    sourceIds: ['authority', 'politicalObligation', 'democracy'],
  },
  sq02: {
    contextNote: 'This normative item concerns the moral basis and scope of ownership in productive assets, not merely whether markets are efficient. First appropriation, personal use, distributive equality, and a secure material baseline are distinct claims that can be combined with different property institutions; the options do not specify a complete tax, workplace, or inheritance regime.',
    sourceIds: ['property', 'distributiveJustice', 'socialism'],
  },
  sq06: {
    contextNote: 'This normative item separates equal human obligations, special duties to co-members, graded proximity-based duties, and freedom of movement. It does not by itself decide admission procedures, asylum and non-refoulement duties, fiscal capacity, or the legal authority of a state to regulate borders; those institutional questions can produce different answers from the same moral principle.',
    sourceIds: ['immigration', 'refugeeConvention', 'politicalObligation'],
  },
  sq07: {
    contextNote: 'This normative item asks how human use, nonhuman value, and ecological limits should be weighed, rather than asking for a particular conservation instrument. Human-priority, stewardship, intrinsic standing, and conditional limits can differ over species, ecosystems, extraction, and necessity; choosing a statement does not settle how tradeoffs should be governed.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  sq13: {
    contextNote: 'This normative statement-choice item separates strong title, anti-privilege market freedom, special treatment for land and natural opportunities, and collective ownership of productive capital. These are not four points on one simple private-versus-public scale: a respondent can support markets while rejecting rent, or support property while favoring cooperative production; the options do not specify the full legal regime.',
    sourceIds: ['property', 'markets', 'socialism'],
  },
  sq15: {
    contextNote: 'This normative item separates civic membership, inherited peoplehood, religious-civilizational identity, and national self-determination as a defense against external domination. These accounts can overlap but have different implications for citizenship, minority rights, assimilation, sovereignty, and state neutrality; choosing one does not specify an exclusionary policy or one historical nationalism.',
    sourceIds: ['nationalism', 'ethnonationalism', 'multiculturalism'],
  },
  q0301: {
    contextNote: 'This normative item concerns duties to people who will live under the consequences of present decisions. It does not determine how future interests should be discounted, represented, or balanced against urgent present needs; intergenerational justice, ecological thresholds, uncertainty, and institutional responsibility are separate parts of the judgment.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0304: {
    contextNote: 'This normative item treats diffuse pollution as a problem of imposed harm and unequal voice. It does not specify whether liability, regulation, taxation, compensation, or collective action is the right remedy, and it does not assume that identifying victims or causation is administratively simple in every environmental case.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0305: {
    contextNote: 'This normative item asks whether stewardship language can conceal protection of incumbent interests. It does not imply that every environmental rule is captured or that incumbent firms never provide useful capacity; ecological protection, policy capture, distribution, and institutional trust are distinct questions.',
    sourceIds: ['environmentalEthics', 'policyCapture', 'climateAssessment'],
  },
  q0313: {
    contextNote: 'This prescriptive item favors accounting for environmental harms while limiting open-ended administrative control over production. It does not choose among prices, liability, standards, public ownership, or planning, and the feasibility of each instrument depends on measurement, enforcement, distribution, and ecological urgency.',
    sourceIds: ['climateDecoupling', 'environmentalEthics', 'marketsKnowledge'],
  },
  q0315: {
    contextNote: 'This prescriptive item supports rules keyed to measured harm rather than a mandated technology, except where a technology creates distinctive risks. Technology neutrality does not mean identical treatment of unequal hazards, and implementation still depends on monitoring, information, compliance cost, innovation, and enforcement capacity.',
    sourceIds: ['climateAssessment', 'regulatoryInformationAsymmetry', 'environmentalComplianceCosts'],
  },
  q0316: {
    contextNote: 'This prescriptive item distinguishes rewarding verified stewardship from penalizing demonstrated environmental harm. It does not define who qualifies as a steward, whether compensation should be public or market-based, or how to resolve conflicts among conservation, livelihoods, property, and ecological uncertainty.',
    sourceIds: ['environmentalEthics', 'climateAssessment', 'environmentalComplianceCosts'],
  },
  q0317: {
    contextNote: 'This prescriptive item asks for environmental subsidies that can expire and be reviewed for capture. A sunset clause is a governance safeguard, not proof that the policy is effective or temporary in practice; review design, evidence, distribution, and political influence remain separate considerations.',
    sourceIds: ['climateAssessment', 'policyCapture', 'regulatorGovernance'],
  },
  q0319: {
    contextNote: 'This normative item frames environmental quality as a distributive and public-health concern rather than a luxury consumed only through private distance. It does not specify an equal outcome, one pollution remedy, or a theory of ecological value; exposure, capability, rights, and ecological limits can interact differently across communities.',
    sourceIds: ['climateAssessment', 'environmentalEthics', 'civilPoliticalRights'],
  },
  q0418: {
    contextNote: 'This normative item tests whether nonhuman habitats can constrain projects with substantial human benefits. It does not settle whether habitats, species, organisms, or ecological relations bear moral standing, nor does it define necessity, proportionality, ownership, or the institution that should resolve a concrete tradeoff.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  q0321: {
    contextNote: 'This normative item rejects the assumption that national borders alone reduce the moral importance of foreign civilians. It does not erase special duties to co-members or answer questions about asylum, intervention, taxation, or military feasibility; equal moral concern, political obligation, sovereignty, and lawful force are distinct dimensions.',
    sourceIds: ['war', 'unCharter', 'civilPoliticalRights'],
  },
  q0324: {
    contextNote: 'This normative item treats urgency claims as a reason for stronger scrutiny rather than automatic deference. It does not deny that some threats require rapid action, and it leaves open which body should review the decision, what information can remain secret, and how necessity and proportionality are assessed.',
    sourceIds: ['war', 'emergencyPowers', 'democracy'],
  },
  q0325: {
    contextNote: 'This normative item characterizes compulsory military service as a coercive labor burden even when the public supports the cause. It does not decide whether any emergency can justify conscription, whether alternative service is adequate, or how military obligation relates to equal citizenship, liberty, and civilian protection.',
    sourceIds: ['war', 'civilPoliticalRights', 'labourRights'],
  },
  q0326: {
    contextNote: 'This normative item separates solidarity with an oppressed population from the right to control that population through force. It does not reject humanitarian assistance, defense, diplomacy, or collective action; it asks whether concern for liberation can itself authorize domination, occupation, or externally imposed political design.',
    sourceIds: ['war', 'unCharter', 'afghanistanReconstruction'],
  },
  q0334: {
    contextNote: 'This prescriptive item asks that intervention be tied to a defensive purpose, a route out, and public accounting of costs. It does not assume that these safeguards make intervention legitimate or effective, and it leaves civilian protection, postwar governance, alliance commitments, secrecy, and local consent as further conditions.',
    sourceIds: ['war', 'unCharter', 'afghanistanReconstruction'],
  },
  q0336: {
    contextNote: 'This prescriptive item supports legislative authorization with narrow scope and automatic expiry for war powers. It does not imply that legislatures are always better informed or that expiration ends a real threat; authorization, renewal, judicial review, secrecy, and emergency execution are separate design questions.',
    sourceIds: ['emergencyPowers', 'democracy', 'unCharter'],
  },
  q0337: {
    contextNote: 'This prescriptive item treats arms transfers as requiring assessment of civilian harm, retaliation or blowback, and political entrenchment. It does not presume that every transfer has the same effects or that scrutiny alone resolves the case; end use, recipient capacity, diversion, international law, and alternatives matter separately.',
    sourceIds: ['war', 'unCharter', 'afghanistanReconstruction'],
  },
  q0338: {
    contextNote: 'This prescriptive item adopts epistemic humility about planners’ knowledge of local societies. It does not mean that outside actors know nothing or that local knowledge is always unified; the practical implications concern consultation, adaptation, consent, feedback, institutional learning, and limits on imposed political design.',
    sourceIds: ['afghanistanReconstruction', 'war', 'democracy'],
  },
  q0401: {
    contextNote: 'This normative item applies a demanding justification standard to force across borders and within a state. It does not assert that the cases are identical in law or circumstance; necessity, proportionality, civilian status, sovereignty, self-defense, and accountability can alter how the standard is applied.',
    sourceIds: ['war', 'unCharter', 'civilPoliticalRights'],
  },
  q0403: {
    contextNote: 'This normative item tests whether military projection should count as evidence of national greatness. It does not define greatness, deny defensive capability, or settle whether power protects citizens; prestige, security, domination, economic cost, civilian risk, and international order are distinct considerations.',
    sourceIds: ['war', 'nationalism', 'unCharter'],
  },
  q0341: {
    contextNote: 'This normative item treats democratic authorization as bounded by protections for dissenters, minorities, and meaningful exit. It does not specify whether those protections are constitutional, judicial, federal, or social, and it does not claim that every restriction on majority rule is automatically legitimate.',
    sourceIds: ['democracy', 'civilPoliticalRights'],
  },
  q0342: {
    contextNote: 'This normative item assigns expertise an advisory role without treating technical knowledge as a substitute for consent or accountability. It does not reject delegation or claim that popular judgment is always informed; evidence, uncertainty, authorization, contestation, and affected interests must be kept distinct.',
    sourceIds: ['democracy', 'evidenceGovernance'],
  },
  q0343: {
    contextNote: 'This normative item gives constitutional rights a stabilizing role against short-term political pressure. It does not resolve who interprets the constitution, how rights can be amended, or whether judicial review is superior to legislative or mixed safeguards; durability and democratic accountability can pull in different directions.',
    sourceIds: ['democracy', 'civilPoliticalRights'],
  },
  q0344: {
    contextNote: 'This normative item identifies a risk that electoral majorities can impose domination on minorities or outsiders. It does not imply that majority rule is always oppressive or that minority status settles every policy dispute; equal citizenship, rights protection, representation, and accountability are separate institutional questions.',
    sourceIds: ['democracy', 'civilPoliticalRights', 'multiculturalism'],
  },
  q0345: {
    contextNote: 'This normative item treats technocratic authority as less legitimate when affected people cannot challenge its assumptions or leave its reach. It does not deny the value of expertise or imply that exit is always feasible; review, transparency, appeal, representation, and delegated competence are distinct safeguards.',
    sourceIds: ['democracy', 'evidenceGovernance', 'regulatorAppeals'],
  },
  q0356: {
    contextNote: 'This prescriptive item prioritizes rights protection by independent courts over unconstrained administrative discretion. It does not assume courts are unbiased or technically superior, and it leaves appointment, standing, remedies, deference, legislative review, and emergency exceptions open for separate evaluation.',
    sourceIds: ['democracy', 'civilPoliticalRights', 'regulatorAppeals'],
  },
  q0357: {
    contextNote: 'This prescriptive item allows local experimentation only within portable rights and freedom of movement. It does not require uniform policy or deny local self-government; federal allocation, equal citizenship, mobility, fiscal effects, and the enforcement of common rights are distinct design choices.',
    sourceIds: ['federalism', 'civilPoliticalRights', 'democracy'],
  },
  q0359: {
    contextNote: 'This normative item distinguishes being counted in a decision from having consented to the resulting coercive rule. It does not imply that unanimous consent is feasible or that all collective decisions are illegitimate; authority, participation, dissent, exit, and rights constraints address different legitimacy claims.',
    sourceIds: ['democracy', 'civilPoliticalRights', 'politicalObligation'],
  },
  q0474: {
    contextNote: 'This descriptive item isolates implementation capacity: staff, information, coordination, and enforcement can mediate whether a formally adopted policy works in practice. It does not claim that every implementation failure has the same cause or that a larger state, a smaller state, or a more ambitious policy automatically resolves capacity constraints.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0475: {
    contextNote: 'This descriptive item treats observed performance on defined tasks as evidence about implementation rather than treating formal authority or policy ambition as proof of capacity. It does not claim that one indicator captures the whole state, that outcomes are easy to attribute, or that measured performance settles the policy’s normative value.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0476: {
    contextNote: 'This descriptive item concerns the legitimacy conditions around expert advice: assumptions, conflicts, uncertainty, and limits can remain visible to political challenge. It does not claim that transparency guarantees accuracy or that public contestation supplies technical knowledge without institutions for evidence and review.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0477: {
    contextNote: 'This descriptive item separates expert analysis from democratic authorization of value-laden choices. Delegation can weaken accountability when affected people cannot scrutinize or contest a decision, but the item does not make all expert delegation illegitimate or imply that public challenge alone resolves technical uncertainty.',
    sourceIds: ['evidenceGovernance', 'democracy'],
  },
  q0361: {
    contextNote: 'This normative item treats private communication as a protected interest that should not require a person to prove innocence in advance. It does not settle lawful access, targeted warrants, metadata, technical limits, or safeguards against abuse; privacy, security, investigation, and due process are related but separate concerns.',
    sourceIds: ['cryptography', 'civilPoliticalRights'],
  },
  q0362: {
    contextNote: 'This normative item conditions human enhancement on informed adult choice without coercive hierarchy. It does not define enhancement, assume equal access, or settle risks to dependents, future generations, labor markets, or social status; consent, safety, justice, and power relations require separate assessment.',
    sourceIds: ['aiEthics', 'civilPoliticalRights'],
  },
  q0363: {
    contextNote: 'This normative item values technology when it expands agency rather than making people continuously legible to managers or police. It does not reject measurement, administration, or safety tools in every case; the relevant distinctions concern purpose limitation, power, consent, contestability, and who controls the resulting data.',
    sourceIds: ['aiEthics', 'civilPoliticalRights', 'decentralizedNetworkGovernance'],
  },
  q0364: {
    contextNote: 'This normative item rejects treating safety as an unlimited justification for surveillance infrastructure. It does not deny genuine security needs or require zero data collection; necessity, proportionality, retention, access, oversight, error correction, and function creep are separate safeguards.',
    sourceIds: ['aiRisk', 'civilPoliticalRights'],
  },
  q0365: {
    contextNote: 'This normative item requires contestability when algorithmic decisions affect rights. It does not require disclosure of every proprietary detail or assume that an appeal automatically corrects a model; notice, explanation, human review, evidence, remedy, and institutional accountability are distinct requirements.',
    sourceIds: ['aiEthics', 'regulatorAppeals', 'civilPoliticalRights'],
  },
  q0374: {
    contextNote: 'This prescriptive item favors AI safety rules tied to demonstrable harms while protecting small-scale open research from blanket criminalization. It does not imply that open systems are harmless or that only realized harm matters; capability, misuse, privacy, security, proportionality, and enforcement design remain separate questions.',
    sourceIds: ['aiRisk', 'aiEthics', 'openStandardsDigitalInnovation'],
  },
  q0377: {
    contextNote: 'This prescriptive item prefers interoperability as a way to reduce durable platform concentration rather than treating concentration as a permanent object of regulation. It does not assume mandates are costless or safe; standards governance, privacy, security, switching costs, innovation, and liability must be evaluated together.',
    sourceIds: ['openStandardsCompetition', 'competitionAssessment', 'decentralizedNetworkGovernance'],
  },
  q0379: {
    contextNote: 'This normative item rejects a future in which powerful tools mainly render ordinary people objects of management. It does not oppose expertise, automation, or coordination as such; agency, consent, distribution of control, accountability, and the ability to contest or exit a system are the relevant boundaries.',
    sourceIds: ['aiEthics', 'civilPoliticalRights'],
  },
  q0381: {
    contextNote: 'This normative item separates the justice of a political end from the permissibility of every means used to reach it. It does not prescribe reform or revolution, and it leaves proportionality, civilian risk, coercion, publicity, necessity, and the accountability of the resulting institutions open.',
    sourceIds: ['revolution', 'civilDisobedience', 'politicalReform'],
  },
  q0382: {
    contextNote: 'This normative item supports building alternative institutions without waiting for permission from existing authorities. It does not imply that all informal institutions are emancipatory or that coordination needs no rules; autonomy, mutual aid, legality, accountability, resources, and relations with public power are distinct questions.',
    sourceIds: ['democraticConfederalism', 'civilDisobedience', 'revolution'],
  },
  q0383: {
    contextNote: 'This normative item requires a reform strategy to respect the agency of people it claims to liberate. It does not define agency as simple consent or reject leadership and coordination; participation, representation, coercion, knowledge, material dependence, and the right to dissent or exit must be considered separately.',
    sourceIds: ['civilDisobedience', 'democracy', 'politicalReform'],
  },
  q0384: {
    contextNote: 'This normative item makes systematic exclusion a condition that can strengthen the case for civil disobedience. It does not make every unlawful act justified or assume that legal channels are equally closed to all groups; publicity, nonviolence, proportionality, harm, repression, and alternative routes remain relevant.',
    sourceIds: ['civilDisobedience', 'civilPoliticalRights', 'democracy'],
  },
  q0385: {
    contextNote: 'This normative item denies that revolutionary coercion becomes morally clean merely because its target is an unjust regime. It does not deny that resistance can be justified or that regimes can block peaceful change; necessity, discrimination, civilian protection, proportionality, and post-victory accountability remain separate judgments.',
    sourceIds: ['revolution', 'war', 'civilDisobedience'],
  },
  q0394: {
    contextNote: 'This prescriptive item favors building exit options and mutual aid before depending on a single moment of political capture. It does not imply that electoral or state action is never useful; resilience, sequencing, organization, resource constraints, public provision, and the risk of administrative dependence can point in different directions.',
    sourceIds: ['politicalReform', 'civilDisobedience', 'democraticConfederalism'],
  },
  q0399: {
    contextNote: 'This normative item claims that a free society cannot be created solely through command relationships. It does not deny the need for temporary coordination, rules, or emergency authority; the distinct questions are whether power is accountable, revisable, participatory, contestable, and capable of being relinquished.',
    sourceIds: ['revolution', 'civilDisobedience', 'democracy'],
  },
  q0015: {
    contextNote: 'This prescriptive item favors decentralization as a safeguard against concentrated reform power. It does not assume that local units are benevolent or that fragmentation is harmless; accountability, coordination, rights portability, fiscal capacity, and the ability to correct local abuse are separate design questions.',
    sourceIds: ['federalism', 'democracy', 'politicalReform'],
  },
  q0017: {
    contextNote: 'This prescriptive item prioritizes civil-liberty safeguards before expanding enforcement capacity. It does not imply that agencies can never act during an emergency or that rights protection requires no public-safety institutions; legal authority, oversight, remedies, proportionality, and implementation are distinct conditions.',
    sourceIds: ['civilPoliticalRights', 'authority', 'emergencyPowers'],
  },
  q0018: {
    contextNote: 'This prescriptive item treats rulers as ordinary actors with incentives rather than as guardians above politics. It does not claim that every official is corrupt or that expertise is irrelevant; the institutional implications concern checks, transparency, contestability, succession, and limits on discretionary power.',
    sourceIds: ['authority', 'politicalObligation', 'democracy'],
  },
  q0019: {
    contextNote: 'This normative item treats constitutional limits as protection against rulers treating residents as objects of administration. It does not specify a single constitution, court, or rights catalogue; equal status, due process, accountability, emergency powers, and democratic authorization can be arranged in different ways.',
    sourceIds: ['democracy', 'civilPoliticalRights', 'authority'],
  },
  q0053: {
    contextNote: 'This prescriptive item favors decentralized economic experimentation over one mandatory production plan. It does not imply that every decentralized arrangement coordinates well or that public planning has no legitimate role; information, externalities, distribution, ownership, and interoperability remain separate questions.',
    sourceIds: ['marketsKnowledge', 'polycentricGovernance', 'socialism'],
  },
  q0054: {
    contextNote: 'This prescriptive item prioritizes contestable entry before direct control of prices or output. It does not imply that entry remedies solve every market-power problem or that price regulation is never justified; merger effects, natural monopoly, externalities, consumer protection, and enforcement capacity require separate analysis.',
    sourceIds: ['competitionAssessment', 'markets', 'financialEntryBarriers'],
  },
  q0055: {
    contextNote: 'This prescriptive item favors market-failure remedies that are narrow, transparent, and reversible. It does not assume that every intervention can be cleanly bounded or that reversibility is always preferable to durable protection; diagnosis, monitoring, capture, distribution, and administrative feasibility remain distinct.',
    sourceIds: ['markets', 'regulatorGovernance', 'policyCapture'],
  },
  q0058: {
    contextNote: 'This prescriptive item values rules that allow discovery by participants rather than requiring officials to know the best arrangement in advance. It does not treat decentralized discovery as a substitute for rights, safety, infrastructure, or public goods, and it leaves institutional learning and correction open.',
    sourceIds: ['marketsKnowledge', 'polycentricGovernance', 'regulatoryInformationAsymmetry'],
  },
  q0059: {
    contextNote: 'This normative item protects peaceful exchange from prior political permission. It does not define every exchange as harmless or deny rules against fraud, coercion, exclusion, or external harm; private ordering, property, contract, public authority, and equal civic standing are separate dimensions.',
    sourceIds: ['markets', 'property', 'civilPoliticalRights'],
  },
  q0141: {
    contextNote: 'This normative item distinguishes copying non-rival information from taking exclusive control of a rival physical object. It does not settle whether limited intellectual-property rights can be justified for incentive, attribution, privacy, or fraud reasons; scarcity, control, labor, and downstream effects are separate issues.',
    sourceIds: ['intellectualProperty', 'copyrightLimitations'],
  },
  q0144: {
    contextNote: 'This normative item gives special weight to repair, archiving, and interoperability uses when copyright is used to block them. It does not imply that every use is noninfringing or that authors have no economic interests; exceptions, security, privacy, attribution, and competition must be designed together.',
    sourceIds: ['copyrightLimitations', 'openStandardsCompetition', 'intellectualProperty'],
  },
  q0145: {
    contextNote: 'This normative item questions the strength of a patent claim when independent discovery was likely soon. It does not itself define novelty, non-obviousness, disclosure, or the counterfactual evidence needed to assess timing; patent incentives, cumulative innovation, and access are distinct considerations.',
    sourceIds: ['patentExceptions', 'intellectualProperty'],
  },
  q0146: {
    contextNote: 'This normative item treats fraud prevention as a stronger basis for information control than artificial scarcity. It does not imply that all fraud remedies are narrow or that scarcity has no incentive rationale; deception, attribution, privacy, safety, competition, and expression can require different legal tools.',
    sourceIds: ['intellectualProperty', 'copyrightLimitations', 'civilPoliticalRights'],
  },
  q0153: {
    contextNote: 'This prescriptive item favors attribution and fraud remedies without broad copying monopolies. It does not specify whether attribution is moral, contractual, or statutory, nor how to fund creation; exceptions, licensing, reputation, privacy, and enforcement scope remain separate design choices.',
    sourceIds: ['copyrightLimitations', 'intellectualProperty'],
  },
  q0155: {
    contextNote: 'This prescriptive item supports broad copyright exceptions for repair, archiving, research, remix, and interoperability. It does not make all uses automatically lawful or ignore security, attribution, privacy, or creator compensation; each exception can have a different scope and safeguard.',
    sourceIds: ['copyrightLimitations', 'openStandardsCompetition', 'intellectualProperty'],
  },
  q0156: {
    contextNote: 'This prescriptive item favors default open access for publicly funded research. It does not settle embargoes, sensitive data, patents, repository costs, author rights, or the difference between free-to-read and reusable publication; access, stewardship, incentives, and research integrity are separate issues.',
    sourceIds: ['intellectualProperty', 'openStandardsDigitalInnovation'],
  },
  q0157: {
    contextNote: 'This prescriptive item prioritizes ordinary ownership and lawful repair or use of purchased devices over broad anti-circumvention control. It does not erase copyright, security, privacy, or safety concerns; the relevant boundary is between bypassing a technological restriction and infringing a separate right.',
    sourceIds: ['copyrightLimitations', 'intellectualProperty'],
  },
  q0159: {
    contextNote: 'This normative item rejects treating ordinary sharing as automatically equivalent to a just claim of monopoly privilege. It does not deny that creators may need support or that deception and commercial infringement can cause harm; copying, compensation, attribution, access, and enforcement are separate questions.',
    sourceIds: ['copyrightLimitations', 'intellectualProperty', 'civilPoliticalRights'],
  },
  q0181: {
    contextNote: 'This normative item places a higher justificatory burden on punishment than on restitution, restraint, or repair. It does not imply that punishment is never legitimate or that victims’ safety is secondary; retribution, deterrence, incapacitation, restoration, proportionality, and due process are distinct rationales.',
    sourceIds: ['legalPunishment', 'civilPoliticalRights'],
  },
  q0182: {
    contextNote: 'This normative item preserves rights for people accused or convicted of crime. It does not deny that lawful restraints can protect others or enforce a sentence; presumption of innocence, humane treatment, due process, proportionality, rehabilitation, and post-conviction status must not be collapsed into one claim.',
    sourceIds: ['civilPoliticalRights', 'legalPunishment'],
  },
  q0183: {
    contextNote: 'This normative item gives victims’ repair a central place rather than treating offender suffering as sufficient. It does not prescribe compensation, restitution, mediation, public services, or punishment as the universal remedy; victim consent, safety, capacity, and accountability require separate assessment.',
    sourceIds: ['legalPunishment', 'distributiveJustice', 'civilPoliticalRights'],
  },
  q0184: {
    contextNote: 'This normative item distinguishes public safety from the moral legitimacy of imposing punishment. It does not deny the possibility of necessary restraint or imply that every offender can be safely released; evidence, proportionality, due process, rehabilitation, and least-restrictive means remain distinct.',
    sourceIds: ['legalPunishment', 'civilPoliticalRights'],
  },
  q0185: {
    contextNote: 'This normative item treats state violence as requiring special justification because public authority can make coercion routine and difficult to escape. It does not equate every police action with punishment or deny emergency defense; necessity, oversight, force limits, remedy, and institutional accountability are separate safeguards.',
    sourceIds: ['legalPunishment', 'civilPoliticalRights', 'policePerformance'],
  },
  q0186: {
    contextNote: 'This normative item tests whether justice should be measured by reduced harm and restored agency rather than by severity alone. It does not eliminate accountability or victims’ claims; prevention, repair, incapacitation, proportionality, and the conditions for safe reintegration can point to different interventions.',
    sourceIds: ['legalPunishment', 'distributiveJustice', 'civilPoliticalRights'],
  },
  q0195: {
    contextNote: 'This prescriptive item narrows immunity when officials violate clear rights. It does not remove the need to distinguish good-faith error from abuse or to protect lawful discretion; notice, remedy, deterrence, damages, institutional liability, and appellate review are separate design questions.',
    sourceIds: ['civilPoliticalRights', 'legalPunishment', 'regulatorAppeals'],
  },
  q0197: {
    contextNote: 'This prescriptive item limits pretrial detention to specific findings about flight or danger rather than inability to pay. It does not assume risk assessment is error-free or that release needs no conditions; presumption of innocence, equal treatment, due process, public safety, and least-restrictive supervision must be considered together.',
    sourceIds: ['civilPoliticalRights', 'legalPunishment'],
  },
  q0198: {
    contextNote: 'This prescriptive item reduces official discretion where oversight is weak. It does not imply that rigid rules eliminate judgment or that discretion is always abusive; clear standards, transparent reasons, appeals, supervision, professional capacity, and room for individualized justice are separate safeguards.',
    sourceIds: ['legalPunishment', 'regulatorAppeals', 'policePerformance'],
  },
  q0199: {
    contextNote: 'This normative item links irreversible punishment to an institution’s ability to recognize and correct its own errors. It does not settle whether any sanction can be irreversible or deny the need to protect people from serious danger; accuracy, remedy, finality, accountability, and proportionality are distinct.',
    sourceIds: ['legalPunishment', 'civilPoliticalRights', 'regulatorAppeals'],
  },
  q0281: {
    contextNote: 'This normative item rejects inherited group status as a basis for legal standing, political rights, or opportunity. It does not deny that historical group disadvantage can justify targeted remedies or that people may form cultural associations; equal citizenship, anti-discrimination, self-organization, and remedial policy are separate questions.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'ethnonationalism'],
  },
  q0282: {
    contextNote: 'This normative item rejects cultural uniformity as a condition of equal citizenship. It does not require every practice to be exempt from law or deny a shared public language and common rights; voluntary association, coercive assimilation, minority autonomy, and universal safeguards are distinct.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'nationalism'],
  },
  q0283: {
    contextNote: 'This normative item prioritizes protection against domination over symbolic diversity by itself. It does not make recognition or representation irrelevant; the relevant distinction is between visible difference and actual power, rights, material access, voice, and freedom from coercive hierarchy.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'distributiveJustice'],
  },
  q0284: {
    contextNote: 'This normative item treats historical injustice as potentially relevant to present claims even when current individuals did not choose the original wrong. It does not establish collective guilt or one remedy; continuity, institutional responsibility, compensation, equal rights, and feasible repair require separate reasoning.',
    sourceIds: ['multiculturalism', 'nationalism', 'civilPoliticalRights'],
  },
  q0285: {
    contextNote: 'This normative item rejects collective guilt as a substitute for identifying institutions that still restrict people. It does not deny structural effects or historical responsibility; the distinction is between assigning inherited blame to persons and tracing current rules, practices, incentives, and remedies.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'nationalism'],
  },
  q0293: {
    contextNote: 'This prescriptive item combines equal individual rights with room for voluntary cultural association. It does not prescribe state funding, group vetoes, assimilation, or autonomy, and it does not imply that every association is voluntary or harmless; membership, exit, anti-discrimination, and public-order safeguards remain separate.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'nationalism'],
  },
  q0294: {
    contextNote: 'This prescriptive item favors removing institutional barriers before relying on permanent administrative sorting by group. It does not rule out temporary or targeted remedies where barriers persist; diagnosis, measurement, proportionality, sunset review, enforcement, and the risk of reproducing categories are distinct considerations.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'policyCapture'],
  },
  q0295: {
    contextNote: 'This prescriptive item focuses anti-discrimination enforcement on conduct and barriers rather than compelled ideological rituals. It does not define every workplace or public-service rule as ideological or deny the importance of equal treatment; evidence, intent, effect, accommodation, speech, and remedy require separate analysis.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'liberalism'],
  },
  q0296: {
    contextNote: 'This prescriptive item treats school and housing boundaries as possible mechanisms that reproduce inherited advantage. It does not assume that every boundary is discriminatory or that one desegregation tool works everywhere; zoning, school assignment, mobility, housing supply, safety, and distribution must be assessed separately.',
    sourceIds: ['multiculturalism', 'civilPoliticalRights', 'housingSupply'],
  },
  q0299: {
    contextNote: 'This normative item denies that ancestry gives any group a natural right to rule, exclude, or be ruled. It does not deny cultural self-government, voluntary association, or claims of national self-determination; equal standing, consent, sovereignty, minority rights, and anti-domination are distinct questions.',
    sourceIds: ['nationalism', 'ethnonationalism', 'civilPoliticalRights'],
  },
  q0407: {
    contextNote: 'This normative item isolates a direct worker governance claim over productive assets. Employee participation, employee ownership, residual control, management, capital provision, compensation, and firm performance are related but distinct arrangements; agreement does not prescribe one cooperative or public-enterprise model.',
    sourceIds: ['employeeGovernance', 'structuralDomination', 'property', 'socialism'],
  },
  q0408: {
    contextNote: 'This normative item distinguishes the unimproved value of land and natural opportunities from privately created improvements. It does not specify land taxation, common ownership, leasehold, compensation, or the treatment of buildings and labor; title, rent, access, stewardship, and distributive justice are separate issues.',
    sourceIds: ['property', 'landTenure', 'distributiveJustice'],
  },
  q0424: {
    contextNote: 'This prescriptive item favors replacing broad taxes on labor and productive investment with taxes on unimproved land value where feasible. It does not imply that land-value taxation is administratively simple or sufficient for all revenue needs; assessment, incidence, transition, public finance, housing supply, and local capacity require separate evaluation.',
    sourceIds: ['landTenure', 'property', 'distributiveJustice'],
  },
  'fm-fem-2': {
    contextNote: 'This descriptive specialist item separates formal sex neutrality in law from persistent institutional and relational hierarchy. It does not claim that every unequal outcome proves male domination or that formal equality has no effect; enforcement, informal norms, care, violence, work, and representation are distinct mechanisms.',
    sourceIds: ['feministPolitics', 'feministEthics', 'socialNormChange'],
  },
  'fm-fem-3': {
    contextNote: 'This normative specialist item treats sexuality, reproduction, and family roles as sites of political power rather than only private choice. It does not deny personal agency or imply one feminist theory; consent, law, economic dependence, care, violence, and social norms can support different diagnoses.',
    sourceIds: ['feministPolitics', 'feministEthics', 'civilPoliticalRights'],
  },
  'fm-fem-4': {
    contextNote: 'This descriptive specialist item links economic dependence to unpaid care, household labor, and the organization of paid work. It does not claim that all dependence has one cause or that paid employment automatically liberates; bargaining power, social provision, family structure, labor law, and choice are separate variables.',
    sourceIds: ['feministPolitics', 'labour', 'distributiveJustice'],
  },
  'fm-fem-8': {
    contextNote: 'This prescriptive specialist item favors decentralized and self-governing feminist associations over centralized leadership. It does not imply that coordination, representation, expertise, or delegated authority are unnecessary; the relevant tradeoff is between autonomy and collective capacity, with accountability and inclusion kept distinct.',
    sourceIds: ['feministPolitics', 'democraticConfederalism', 'democracy'],
  },
  'fm-id-1': {
    contextNote: 'This normative specialist item defines nationhood through ancestry and inherited culture rather than citizenship alone. It does not by itself prescribe exclusion, racial hierarchy, or one state policy; ethnic membership, civic membership, assimilation, minority rights, and self-determination are distinct positions.',
    sourceIds: ['nationalism', 'ethnonationalism', 'multiculturalism'],
  },
  'fm-id-2': {
    contextNote: 'This normative specialist item treats civic adoption as sufficient for full national membership regardless of ancestry. It does not settle the content of civic institutions or public culture, nor does it guarantee inclusion in practice; naturalization, equal rights, language, socialization, and cultural pluralism can vary independently.',
    sourceIds: ['nationalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-3': {
    contextNote: 'This normative specialist item tests a priority for preserving a historic core nation’s demographic and cultural predominance. It does not specify whether priority means symbolic recognition, immigration policy, legal privilege, or exclusion; national continuity, equal citizenship, minority rights, and ethnocracy are separate possibilities.',
    sourceIds: ['ethnonationalism', 'nationalism', 'civilPoliticalRights'],
  },
  'fm-id-4': {
    contextNote: 'This normative specialist item rejects a permanent privileged political status for a majority ethnocultural group. It does not prohibit cultural majorities from organizing or receiving ordinary representation; equal citizenship, constitutional safeguards, minority accommodation, and anti-domination are distinct institutional questions.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'ethnonationalism'],
  },
  'fm-id-6': {
    contextNote: 'This normative specialist item favors common public rules over group-differentiated accommodation as a route to common citizenship. It does not imply that uniform rules are always neutral or that accommodation is always justified; equal treatment, unequal effects, conscience, language, and self-government require separate assessment.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'liberalism'],
  },
  'fm-id-7': {
    contextNote: 'This normative specialist item tests whether a coercively incorporated people can claim durable self-government beyond the equal individual rights of its members. It does not dictate secession, federalism, or one form of autonomy; history, consent, territoriality, minority protection, and institutional accountability remain distinct.',
    sourceIds: ['federalism', 'multiculturalism', 'nationalism'],
  },
  'fm-id-8': {
    contextNote: 'This prescriptive specialist item favors influence through shared political institutions over autonomous minority government. It does not deny that common institutions can exclude or that autonomy can fragment rights; representation, self-rule, exit, equal citizenship, and practical capacity must be weighed separately.',
    sourceIds: ['nationalism', 'federalism', 'democracy'],
  },
  'fm-id-9': {
    contextNote: 'This prescriptive specialist item supports independent community institutions as a route to collective autonomy for historically subordinated groups. It does not require territorial separation or deny public cooperation; voluntary association, resource access, anti-discrimination, internal accountability, and cross-group rights are separate considerations.',
    sourceIds: ['multiculturalism', 'nationalism', 'civilPoliticalRights'],
  },
  'fm-id-10': {
    contextNote: 'This normative specialist item treats collective self-reliance as potentially valuable without requiring a separate state or territorial separation. It does not imply isolation or collective uniformity; autonomy, mutual aid, public institutions, individual exit, internal dissent, and interdependence can coexist in different forms.',
    sourceIds: ['multiculturalism', 'nationalism', 'civilPoliticalRights'],
  },
  'fm-id-11': {
    contextNote: 'This normative specialist item allows separate statehood to be morally preferable under durable domination. It does not treat secession as automatically peaceful, feasible, or just; autonomy, borders, minority rights, consent, security, displacement, and post-separation accountability remain open questions.',
    sourceIds: ['nationalism', 'federalism', 'civilPoliticalRights'],
  },
  'fm-id-12': {
    contextNote: 'This prescriptive specialist item prefers minority autonomy within a shared state when robust self-government is possible. It does not rule out independence where autonomy is fictive or domination persists; constitutional guarantees, fiscal capacity, territoriality, mobility, and exit options are distinct safeguards.',
    sourceIds: ['federalism', 'nationalism', 'democracy'],
  },
  'fm-id-13': {
    contextNote: 'This descriptive specialist item concerns the persistence of colonial dispossession through present institutions despite formal citizenship and voting rights. It does not claim that every disparity has one colonial cause or that formal rights are meaningless; land, jurisdiction, administration, material resources, and political voice are separate mechanisms.',
    sourceIds: ['nationalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-14': {
    contextNote: 'This normative specialist item recognizes treaties, traditional territories, and continuing relationships to land as possible grounds of Indigenous authority beyond ordinary private title or municipal jurisdiction. It does not settle the legal form, territorial extent, internal governance, or relationship to equal individual rights.',
    sourceIds: ['nationalism', 'landTenure', 'multiculturalism'],
  },
  'fm-id-15': {
    contextNote: 'This prescriptive specialist item favors negotiated recognition, treaty implementation, and self-government agreements as routes to restoring Indigenous authority. It does not assume existing negotiations are sufficient or that recognition always precedes institution-building; consent, jurisdiction, resources, enforcement, and accountability remain distinct.',
    sourceIds: ['federalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-16': {
    contextNote: 'This prescriptive specialist item permits rebuilding Indigenous legal and political institutions without waiting for settler-state recognition. It does not reject treaties or public negotiation, and it does not specify a single institutional model; resurgence, autonomy, resources, external coercion, and internal legitimacy are separate issues.',
    sourceIds: ['nationalism', 'revolution', 'civilPoliticalRights'],
  },
  'fm-id-17': {
    contextNote: 'This normative specialist item treats cross-border solidarity among African peoples and diasporas as a political reason, not merely a cultural sentiment. It does not prescribe one state structure or erase differences within Africa and the diaspora; anti-domination, self-determination, citizenship, and international institutions remain distinct.',
    sourceIds: ['nationalism', 'multiculturalism', 'civilPoliticalRights'],
  },
  'fm-id-18': {
    contextNote: 'This prescriptive specialist item tests whether African unity can justify continental or transnational institutions that limit some state discretion. It does not assume centralization is automatically emancipatory or that existing states are the only legitimate units; representation, subsidiarity, mobility, security, and accountability require separate design.',
    sourceIds: ['nationalism', 'federalism', 'democracy'],
  },
  'fm-an-1': {
    contextNote: 'This normative specialist item treats imposed political hierarchy as a problem not solved merely by making rulers answerable. It does not deny that accountability can reduce abuse or that coordination may require roles; authority, domination, consent, exit, reciprocity, and institutional replacement are separate dimensions.',
    sourceIds: ['authority', 'revolution', 'civilDisobedience'],
  },
  'fm-an-2': {
    contextNote: 'This descriptive specialist item asks whether markets and private exchange can coordinate social activity without a centralized state directing production. It does not claim that markets eliminate hierarchy, public goods, externalities, or coercion; price signals, polycentric rules, ownership, enforcement, and exit are distinct mechanisms.',
    sourceIds: ['marketsKnowledge', 'polycentricGovernance', 'authority'],
  },
  'fm-an-3': {
    contextNote: 'This normative specialist item favors common or worker-and-community governance of productive resources over absentee control. It does not specify whether common ownership is municipal, cooperative, federated, or state-run; property, workplace authority, investment, coordination, and affected-community standing can be arranged differently.',
    sourceIds: ['property', 'socialism', 'labour'],
  },
  'fm-an-4': {
    contextNote: 'This prescriptive specialist item prioritizes federated association, mutual aid, and direct organization over capturing a central state. It does not imply that elections, public institutions, or delegated coordination are always rejected; sequencing, scale, accountability, legality, and resistance risk remain separate strategic questions.',
    sourceIds: ['civilDisobedience', 'democraticConfederalism', 'revolution'],
  },
  'fm-gr-1': {
    contextNote: 'This normative specialist item gives the nonhuman world moral standing that can constrain human convenience. It does not identify whether standing belongs to organisms, species, ecosystems, or relations, and it does not choose a policy instrument; necessity, distribution, ecological thresholds, and human welfare remain distinct.',
    sourceIds: ['environmentalEthics', 'climateAssessment'],
  },
  'fm-gr-2': {
    contextNote: 'This prescriptive specialist item favors reducing material throughput in high-income societies rather than treating aggregate growth as the default solution. It does not equate GDP, energy use, material use, emissions, welfare, or poverty reduction; distribution, absolute decoupling, rebound effects, and feasibility require separate evaluation.',
    sourceIds: ['climateDecoupling', 'climateAssessment', 'distributiveJustice'],
  },
  'fm-gr-3': {
    contextNote: 'This prescriptive specialist item treats private investment and technological innovation as central ecological-transition tools when public rules correct external harms. It does not imply that markets self-correct or that public ownership is excluded; finance, regulation, innovation, distribution, capture, and measured emissions outcomes are distinct.',
    sourceIds: ['climateDecoupling', 'environmentalComplianceCosts', 'policyCapture'],
  },
  'fm-gr-4': {
    contextNote: 'This prescriptive specialist item favors democratic and locally accountable control over both corporate and centralized state power. It does not assume local control automatically protects ecosystems or coordinates across borders; participation, expertise, federation, rights, scale, and ecological limits must be considered together.',
    sourceIds: ['environmentalEthics', 'democraticConfederalism', 'democracy'],
  },
  'fm-gr-5': {
    contextNote: 'This normative specialist item isolates collective or worker-and-community control of productive assets within ecological transition. It does not decide whether that control is cooperative, municipal, federated, or state-run, and it does not imply that private investment, markets, or technical expertise are absent from every ecosocialist proposal.',
    sourceIds: ['property', 'socialism', 'labour'],
  },
  'fm-so-1': {
    contextNote: 'This normative specialist item favors social or worker ownership of productive assets over control through private capital markets. It does not specify a single socialist institution or deny the need for investment and coordination; ownership, control, allocation, incentives, workplace voice, and public accountability are distinct.',
    sourceIds: ['socialism', 'property', 'labour'],
  },
  'fm-so-2': {
    contextNote: 'This descriptive specialist item asks whether democratic planning and collective decision-making can coordinate complex production without relying entirely on prices. It does not claim that planning eliminates information problems or that prices are sufficient; knowledge, participation, computation, ownership, logistics, and correction are separate mechanisms.',
    sourceIds: ['socialism', 'marketsKnowledge', 'polycentricGovernance'],
  },
  'fm-so-3': {
    contextNote: 'This prescriptive specialist item favors durable socialist gains through elections, law, unions, and public institutions rather than immediate rupture. It does not imply that existing institutions are neutral or that rupture is never justified; coalition-building, reform feedback, labor power, repression, and transition risks remain distinct.',
    sourceIds: ['politicalReform', 'democracy', 'labour'],
  },
  'fm-so-4': {
    contextNote: 'This prescriptive specialist item tests whether a disciplined revolutionary organization may centralize authority during transition. It does not establish that centralization is temporary, accountable, or effective; emergency power, opposition, coercion, organizational capacity, and post-transition institutional release require separate judgment.',
    sourceIds: ['revolution', 'democracy', 'politicalReform'],
  },
  'fm-co-1': {
    contextNote: 'This normative specialist item values inherited institutional knowledge and cautions against deliberate redesign. It does not imply that all inherited institutions are legitimate or that reform is impossible; continuity, experimentation, path dependence, justice, and the distribution of authority are distinct considerations.',
    sourceIds: ['politicalReform', 'marketsKnowledge', 'authority'],
  },
  'fm-co-2': {
    contextNote: 'This prescriptive specialist item favors public law upholding inherited family and sexual norms over leaving those matters mainly to individual choice. It does not specify which norms or how to protect adults and dependents; tradition, consent, equality, religion, safety, and state coercion must be distinguished.',
    sourceIds: ['feministPolitics', 'civilPoliticalRights', 'secularism'],
  },
  'fm-co-3': {
    contextNote: 'This normative specialist item gives a historic national culture special priority in political community. It does not define whether continuity means civic institutions, language, religion, ancestry, or symbolic recognition; equal citizenship, minority rights, immigration, and ethnonational exclusion are separate possibilities.',
    sourceIds: ['nationalism', 'ethnonationalism', 'multiculturalism'],
  },
  'fm-co-4': {
    contextNote: 'This prescriptive specialist item supports assertive foreign policy and alliances as defenses of a liberal order. It does not settle when force, sanctions, arms, or alliance commitments are justified; deterrence, escalation, civilian harm, sovereignty, local agency, and accountability require separate analysis.',
    sourceIds: ['war', 'unCharter', 'nationalism'],
  },
  'fm-rn-1': {
    contextNote: 'This normative specialist item requires constitutional authority to remain publicly accountable even when religious law or tradition informs interpretation. It does not exclude religious reasoning or require one secular model; popular sovereignty, interpretive authority, rights, judicial review, and clerical power can be combined differently.',
    sourceIds: ['cambridgeIslamicConstitutionalism2023', 'islamicConstitutionalism', 'democracy'],
  },
  'fm-rn-2': {
    contextNote: 'This prescriptive specialist item gives a recognized religious authority final power to reject conflicting civil laws. It does not identify which authority, interpretive school, or constitutional safeguard is intended, and it separates clerical veto power from private religious participation and equal citizenship.',
    sourceIds: ['theocracySecularism', 'secularism', 'civilPoliticalRights'],
  },
  'fm-rn-11': {
    contextNote: 'This normative specialist item tests ultimate civil-law legitimacy within a recognized religious-legal authority arrangement. It does not identify one religion, doctrine, interpretive school, or regime form, and it is distinct from religious advocacy, establishment, statutory accommodation, or a religious party participating under pluralist constitutional rules.',
    sourceIds: ['theocracySecularism', 'secularism', 'civilPoliticalRights'],
  },
  'fm-rn-3': {
    contextNote: 'This normative specialist item tests whether the state should express a historic majority religious or civilizational identity rather than remain neutral. It does not by itself prescribe theocracy, unequal rights, or one nationalist program; establishment, accommodation, symbolism, coercion, and minority standing are distinct.',
    sourceIds: ['nationalism', 'secularism', 'religionOfficialStatus'],
  },
  'fm-rn-4': {
    contextNote: 'This normative specialist item preserves equal legal and political standing for minorities even when the state adopts a majority religious or national tradition. It does not settle whether establishment is symbolic or coercive; citizenship, accommodation, representation, conversion, dissent, and institutional safeguards require separate assessment.',
    sourceIds: ['civilPoliticalRights', 'multiculturalism', 'religionOfficialStatus'],
  },
  'fm-te-2': {
    contextNote: 'This prescriptive specialist item permits algorithmic systems to substantially determine public decisions when measured performance exceeds human officials. It does not treat accuracy as sufficient for legitimacy; bias, objective choice, contestability, privacy, distribution, due process, and who remains accountable are separate requirements.',
    sourceIds: ['aiEthics', 'aiRisk', 'democracy'],
  },
  'fm-te-4': {
    contextNote: 'This prescriptive specialist item favors rapid technological acceleration despite destabilizing existing institutions. It does not specify which technology or who bears the transition costs; acceleration, innovation, disruption, safety, labor, political power, and democratic capacity are distinct considerations.',
    sourceIds: ['accelerationism', 'aiEthics', 'politicalReform'],
  },
  'fm-mm-1': {
    contextNote: 'This normative specialist item treats hereditary or traditional authority as potentially legitimate without continuous ordinary election. It does not establish that inheritance supplies consent or competence; continuity, constitutional limits, equal citizenship, accountability, succession, and exit are separate grounds for evaluation.',
    sourceIds: ['authority', 'democracy', 'nationalism'],
  },
  'fm-mm-2': {
    contextNote: 'This prescriptive specialist item assigns a monarch a constitutional-symbolic role while reserving final political authority to elected institutions. It does not settle appointment powers, reserve powers, succession, neutrality, cost, or public consent; ceremonial status and effective authority must be distinguished.',
    sourceIds: ['authority', 'democracy', 'politicalObligation'],
  },
  'fm-mm-3': {
    contextNote: 'This normative specialist item favors subsidiarity: local decision-making except where higher-level coordination is necessary. It does not imply that local units can solve every externality or that higher authority is illegitimate; scale, rights portability, mobility, fiscal capacity, federation, and polycentric coordination are separate questions.',
    sourceIds: ['federalism', 'democraticConfederalism', 'polycentricGovernance'],
  },
}

export function isQuestionContextTarget(question: Question): boolean {
  return question.module === undefined || SPECIALIST_MODULE_IDS.has(question.module)
}

function genericContextNote(question: Question): string {
  const domain = domainById.get(String(question.domain))
  const domainDescription = DOMAIN_CONTEXT_NOTES[String(question.domain)]
    ?? (domain ? `${domain.name}: ${domain.description}` : `the ${String(question.domain)} topic area`)

  return `${LAYER_FRAMING[question.layer]} The item concerns ${domainDescription} ${LAYER_BOUNDARIES[question.layer]} The sources provide background for interpreting the construct and do not determine how you should answer.`
}

function sourceListFor(question: Question): QuestionSource[] {
  const record = questionContextById[String(question.id)]
  const sourceIds = record?.sourceIds ?? DOMAIN_SOURCE_IDS[String(question.domain)] ?? []
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }))
}

export function applyQuestionContext(question: Question): Question {
  if (!isQuestionContextTarget(question) || question.active === false) return question

  const context = questionContextById[String(question.id)]
  const sources = question.sources?.length
    ? question.sources.map((source) => ({ ...source }))
    : sourceListFor(question)

  return {
    ...question,
    contextNote: context?.contextNote ?? genericContextNote(question),
    sources,
  }
}
