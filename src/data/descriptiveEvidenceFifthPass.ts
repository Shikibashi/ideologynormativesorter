import type { Question, QuestionSource } from '../types'

/**
 * Fifth descriptive-evidence pass. The existing evidence records remain the
 * primary claim records; these additional sources triangulate the mechanism,
 * boundary, or setting so a single study is not presented as the whole basis
 * for an empirical answer.
 */
export const DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION = '2026-08-descriptive-evidence-v5'

const source = (title: string, url: string, publisher: string): QuestionSource => ({ title, url, publisher })

export const descriptiveEvidenceFifthPassById: Readonly<Record<string, QuestionSource>> = {
  q0007: source(
    'Metropolitan Governance: Polycentric Solutions for Complex Problems',
    'https://academic.oup.com/book/35300/chapter/299919173',
    'Oxford University Press',
  ),
  q0012: source(
    'Suspicious Collaborators: How Governments in Polycentric Systems Monitor Behavior and Enforce Public Good Provision Rules Against One Another',
    'https://thecommonsjournal.org/articles/924',
    'International Journal of the Commons',
  ),
  q0030: source(
    'Organising the State Ownership Function',
    'https://www.oecd.org/en/publications/organising-the-state-ownership-function_91344c3d-en.html',
    'Organisation for Economic Co-operation and Development',
  ),
  q0047: source(
    'Markets',
    'https://plato.stanford.edu/entries/markets/',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0050: source(
    'Regulatory Capture in Banking',
    'https://www.elibrary.imf.org/view/journals/001/2006/034/article-A001-en.xml',
    'International Monetary Fund',
  ),
  q0067: source(
    'SNAP Eligibility Enforcement and Program Adoption',
    'https://www.nber.org/reporter/2024number3/snap-eligibility-enforcement-and-program-adoption',
    'National Bureau of Economic Research',
  ),
  q0107: source(
    'The Supply Side of Housing Markets',
    'https://www.nber.org/reporter/2009number2/supply-side-housing-markets',
    'National Bureau of Economic Research',
  ),
  q0108: source(
    'The Supply Side of Housing Markets',
    'https://www.nber.org/reporter/2009number2/supply-side-housing-markets',
    'National Bureau of Economic Research',
  ),
  q0128: source(
    'The effect of monetary policy on inflation heterogeneity along the income distribution',
    'https://www.bis.org/publ/work1124.htm',
    'Bank for International Settlements',
  ),
  q0130: source(
    'Controlling entry: registration and licensing',
    'https://digitalfinance.worldbank.org/topics/digital-credit/controlling-entry-registration-and-licensing',
    'World Bank',
  ),
  q0148: source(
    'FTC Report Sheds New Light on How Patent Assertion Entities Operate',
    'https://www.ftc.gov/news-events/news/press-releases/2016/10/ftc-report-sheds-new-light-on-how-patent-assertion-entities-operate-recommends-patent-litigation',
    'U.S. Federal Trade Commission',
  ),
  q0188: source(
    'Revisiting “Measuring What Matters”: Developing a Suite of Standardized Performance Measures for Policing',
    'https://nij.ojp.gov/library/publications/revisiting-measuring-what-matters-developing-suite-standardized-performance',
    'National Institute of Justice',
  ),
  q0190: source(
    'Civil asset forfeiture, equitable sharing, and policing for profit in the United States',
    'https://www.sciencedirect.com/science/article/pii/S0047235211000316',
    'Journal of Criminal Justice / Elsevier',
  ),
  q0208: source(
    'Firms and the Economics of Skilled Immigration',
    'https://www.journals.uchicago.edu/doi/full/10.1086/680061',
    'Innovation Policy and the Economy / University of Chicago Press',
  ),
  q0227: source(
    'Is Ethnic Violence Self-Perpetuating? Quasi-Experimental Evidence From Hindu-Muslim Riots in India',
    'https://journals.sagepub.com/doi/10.1177/00220027251383563',
    'Journal of Conflict Resolution / SAGE',
  ),
  q0269: source(
    'Modernising Access to Social Protection: Non-take-up and the digital transformation of social programmes',
    'https://www.oecd.org/en/publications/modernising-access-to-social-protection_af31746d-en/full-report/component-5.html',
    'Organisation for Economic Co-operation and Development',
  ),
  q0308: source(
    'Do Environmental Regulations Disproportionately Affect Small Businesses? Evidence from the Pollution Abatement Costs and Expenditures survey',
    'https://www.sciencedirect.com/science/article/pii/S0095069613000697',
    'Journal of Environmental Economics and Management / Elsevier',
  ),
  q0328: source(
    'Afghanistan Reconstruction: Lessons from the Long War',
    'https://ndupress.ndu.edu/Media/News/News-Article-View/Article/1980479/afghanistan-reconstruction-lessons-from-the-long-war/',
    'National Defense University Press',
  ),
  q0329: source(
    'Bureaucratic discretion and contracting outcomes',
    'https://www.sciencedirect.com/science/article/pii/S036136821830179X',
    'Accounting, Organizations and Society / Elsevier',
  ),
  q0347: source(
    'Does Interpersonal Discussion Increase Political Knowledge? A Meta-Analysis',
    'https://journals.sagepub.com/doi/10.1177/0093650219866357',
    'Communication Research / SAGE',
  ),
  q0350: source(
    'Annual Review of Constitution Building: 2024',
    'https://www.idea.int/publications/catalogue/html/annual-review-constitution-building-2024',
    'International IDEA',
  ),
  q0368: source(
    'AI Risk Management Framework',
    'https://www.nist.gov/itl/ai-risk-management-framework',
    'National Institute of Standards and Technology',
  ),
  q0430: source(
    'Does Interpersonal Discussion Increase Political Knowledge? A Meta-Analysis',
    'https://journals.sagepub.com/doi/10.1177/0093650219866357',
    'Communication Research / SAGE',
  ),
  q0431: source(
    'Democracy',
    'https://plato.stanford.edu/entries/democracy/index.html',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0432: source(
    'Democracy',
    'https://plato.stanford.edu/entries/democracy/index.html',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0433: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
  q0434: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
  q0435: source(
    'Shifts in Social Norms Often Underpin Change',
    'https://doi.org/10.1093/oso/9780198899952.003.0004',
    'Oxford Scholarship Online / Oxford University Press',
  ),
  q0444: source(
    'Shifts in Social Norms Often Underpin Change',
    'https://doi.org/10.1093/oso/9780198899952.003.0004',
    'Oxford Scholarship Online / Oxford University Press',
  ),
  q0445: source(
    'Shifts in Social Norms Often Underpin Change',
    'https://doi.org/10.1093/oso/9780198899952.003.0004',
    'Oxford Scholarship Online / Oxford University Press',
  ),
  q0455: source(
    'Democracy',
    'https://plato.stanford.edu/entries/democracy/index.html',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0456: source(
    'Democracy',
    'https://plato.stanford.edu/entries/democracy/index.html',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0457: source(
    'Democracy',
    'https://plato.stanford.edu/entries/democracy/index.html',
    'Stanford Encyclopedia of Philosophy',
  ),
  q0458: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
  q0459: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
  q0460: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
  q0461: source(
    'Formal and informal institutions: some problems of meaning, impact, and interaction',
    'https://doi.org/10.1017/S1744137424000249',
    'Journal of Institutional Economics / Cambridge University Press',
  ),
  q0462: source(
    'Formal and informal institutions: some problems of meaning, impact, and interaction',
    'https://doi.org/10.1017/S1744137424000249',
    'Journal of Institutional Economics / Cambridge University Press',
  ),
  q0463: source(
    'Formal and informal institutions: some problems of meaning, impact, and interaction',
    'https://doi.org/10.1017/S1744137424000249',
    'Journal of Institutional Economics / Cambridge University Press',
  ),
  q0473: source(
    'Reflections on evidence use in policy making: Expertise under pressure',
    'https://doi.org/10.1017/S1682098326100538',
    'European Political Science / Cambridge University Press',
  ),
}

export function applyDescriptiveEvidenceFifthPass(question: Question): Question {
  const additional = descriptiveEvidenceFifthPassById[String(question.id)]
  if (!additional || question.active === false || question.layer !== 'descriptive') return question

  const existing = question.sources ?? []
  if (existing.some((item) => item.url === additional.url)) return question

  return {
    ...question,
    sources: [...existing.map((item) => ({ ...item })), { ...additional }],
  }
}
