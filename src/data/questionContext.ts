import type { Question, QuestionSource, Layer } from '../types'
import { domainById } from './domains'

/**
 * Context coverage is intentionally an effective-bank overlay. It gives every
 * active public or specialist item a neutral construct frame and source trail
 * without editing the scored question objects themselves.
 */
export const QUESTION_CONTEXT_VERSION = '2026-08-question-context-v2'

export interface QuestionContextRecord {
  contextNote?: string
  sourceIds?: readonly string[]
}

const SPECIALIST_MODULE_IDS = new Set([
  'feminist-faction-module',
  'identity-sovereignty-module',
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
  labourRights: {
    title: 'ILO Helpdesk: Business and collective bargaining',
    url: 'https://www.ilo.org/resource/other/ilo-helpdesk-business-and-collective-bargaining',
    publisher: 'International Labour Organization',
  },
  monetaryPolicy: {
    title: 'The Fed Explained: Monetary Policy',
    url: 'https://www.federalreserve.gov/aboutthefed/fedexplained/monetary-policy.htm',
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
  islamicConstitutionalism: {
    title: 'Constitutional Interpretation and Constitutionalism in the Arab World',
    url: 'https://academic.oup.com/icon/article/11/3/615/789556',
    publisher: 'International Journal of Constitutional Law',
  },
  islamicDemocracy: {
    title: 'The Puzzle of Islamic Democracy',
    url: 'https://doi.org/10.1057/palgrave.polity.2300086',
    publisher: 'Polity',
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
  q0222: {
    contextNote: 'This item contrasts civic membership with inherited or ascriptive membership. Nationalism scholarship distinguishes these models; it does not assume that every cultural nation demands an independent state.',
    sourceIds: ['nationalism', 'ethnonationalism'],
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
    contextNote: 'This item asks about the public justification of coercive law, not whether religious citizens may participate in politics. Constitutional arrangements differ over how religious reasons, public reasons, and institutional authority relate.',
    sourceIds: ['islamicConstitutionalism', 'civilPoliticalRights'],
  },
  q0414: {
    contextNote: 'This item tests a claim about the hierarchy between civil law and revealed religious law. It does not by itself identify one school of jurisprudence, one constitutional mechanism, or one answer about minority rights.',
    sourceIds: ['islamicConstitutionalism', 'islamicDemocracy'],
  },
  q0415: {
    contextNote: 'This item contrasts civic nationhood with inherited ethnic or religious identity as sources of political membership. The distinction is analytically useful but can be blurred in practice, and civic criteria can also exclude.',
    sourceIds: ['nationalism', 'multiculturalism'],
  },
  q0417: {
    contextNote: 'This item asks whether preserving inherited cultural continuity should justify a policy cost in openness. It does not determine whether the continuity is ethnic, religious, linguistic, or civic, nor which immigration instrument would follow.',
    sourceIds: ['nationalism', 'immigration'],
  },
}

export function isQuestionContextTarget(question: Question): boolean {
  return question.module === undefined || SPECIALIST_MODULE_IDS.has(question.module)
}

function genericContextNote(question: Question): string {
  const domain = domainById.get(String(question.domain))
  const domainDescription = DOMAIN_CONTEXT_NOTES[String(question.domain)]
    ?? (domain ? `${domain.name}: ${domain.description}` : `the ${String(question.domain)} topic area`)

  return `${LAYER_FRAMING[question.layer]} It focuses on ${domainDescription} ${LAYER_BOUNDARIES[question.layer]} The sources provide background for interpreting the construct and do not determine how you should answer.`
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
