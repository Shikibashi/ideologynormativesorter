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
    id: 'labor-unions',
    name: 'Labor, Unions, and Workplace Governance',
    description: 'Rights and power relations between workers, employers, and organized labor.',
  },
  {
    id: 'land-housing-zoning',
    name: 'Land, Housing, and Zoning',
    description: 'Claims over land and housing, and the institutions that regulate building and rent.',
  },
  {
    id: 'money-banking',
    name: 'Money and Central Banking',
    description: 'Who should control the issuance of money and the institutions that manage it.',
  },
  {
    id: 'intellectual-property',
    name: 'Intellectual Property and Information',
    description: 'Whether ideas and information should be ownable, and how innovation is actually produced.',
  },
  {
    id: 'civil-liberties-speech',
    name: 'Civil Liberties and Speech',
    description: 'The scope and limits of individual expression and conscience against collective interests.',
  },
  {
    id: 'immigration-borders',
    name: 'Immigration and Borders',
    description: 'Who may rightfully control movement across borders, and what that control actually achieves.',
  },
]

export const domainById = new Map(domains.map((d) => [d.id, d]))
