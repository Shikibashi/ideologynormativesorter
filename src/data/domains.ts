import type { Domain } from '../types'

export const domains: Domain[] = [
  {
    id: 'state-legitimacy',
    name: 'State Legitimacy',
    description: 'Whether and why a central authority may rightfully hold a monopoly on law, taxation, and force.',
  },
  {
    id: 'property-ownership',
    name: 'Property and Ownership',
    description: 'What kinds of claims over productive assets and resources are legitimate, and who may hold them.',
  },
  {
    id: 'markets-planning',
    name: 'Markets and Planning',
    description: 'How production and exchange should be coordinated, and how well markets versus planning actually work.',
  },
  {
    id: 'redistribution-welfare',
    name: 'Redistribution and Welfare',
    description: 'Obligations to redistribute resources and provide for material need, and how to do so under real constraints.',
  },
  {
    id: 'labor-unions-workplace',
    name: 'Labor, Unions, and Workplace Governance',
    description: 'Rights and power relations between workers, employers, and organized labor.',
  },
  {
    id: 'land-housing-georgism',
    name: 'Land, Housing, Zoning, and Georgism',
    description: 'Claims over land and housing, the institutions that regulate building and rent, and proposals to tax land value rather than improvements.',
  },
  {
    id: 'money-banking',
    name: 'Money, Banking, and Central Banking',
    description: 'Who should control the issuance of money and the institutions that manage banking and monetary policy.',
  },
  {
    id: 'intellectual-property-information',
    name: 'Intellectual Property and Information',
    description: 'Whether ideas and information should be ownable, and how innovation and creative work are actually produced.',
  },
  {
    id: 'civil-liberties-speech',
    name: 'Civil Liberties and Speech',
    description: 'The scope and limits of individual expression and conscience against collective interests.',
  },
  {
    id: 'crime-policing-justice',
    name: 'Crime, Policing, Prisons, and Justice',
    description: 'How rule-breaking should be deterred, punished, and remedied, and who should hold the power to do so.',
  },
  {
    id: 'immigration-borders',
    name: 'Immigration and Borders',
    description: 'Who may rightfully control movement across borders, and what that control actually achieves.',
  },
  {
    id: 'national-identity-sovereignty',
    name: 'National Identity and Sovereignty',
    description: 'What binds a political community together, and how far national self-determination should constrain outside involvement.',
  },
  {
    id: 'religion-secularism',
    name: 'Religion and Secularism',
    description: 'The proper relationship between religious belief or institutions and the apparatus of the state.',
  },
  {
    id: 'family-gender-feminism',
    name: 'Family, Gender, Sex, and Feminism',
    description: 'How family structure, gender roles, and sex-based inequality should be understood and addressed.',
  },
  {
    id: 'race-ethnicity-multiculturalism',
    name: 'Race, Ethnicity, Multiculturalism, and Assimilation',
    description: 'How a society should handle ethnic and racial difference, historical inequities, and the integration of distinct cultural groups.',
  },
  {
    id: 'environment-climate-growth',
    name: 'Environment, Climate, Growth, and Nuclear Power',
    description: 'How to weigh economic growth against ecological limits, and what tools and tradeoffs that weighing implies.',
  },
  {
    id: 'foreign-policy-war',
    name: 'Foreign Policy, War, and Intervention',
    description: 'When, if ever, a state should use or threaten force beyond its own borders, and what role it should play in the affairs of others.',
  },
  {
    id: 'democracy-expertise-constitutionalism',
    name: 'Democracy, Expertise, and Constitutionalism',
    description: 'How collective decisions should be made and constrained — by majorities, by experts, or by entrenched constitutional rules.',
  },
  {
    id: 'technology-ai-surveillance',
    name: 'Technology, AI, and Surveillance',
    description: 'How new technological capability should be governed, and what risks and opportunities it poses to liberty and welfare.',
  },
  {
    id: 'strategy-change',
    name: 'Strategy: Reform, Revolution, and Direct Action',
    description: 'How political change is actually best pursued, independent of what change is being pursued.',
  },
]

export const domainById = new Map(domains.map((d) => [d.id, d]))
