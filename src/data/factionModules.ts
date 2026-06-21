import type { FactionModule } from '../types'

/**
 * Optional depth modules offered after the base quiz, once a respondent's
 * nearest labels are known. Triggering is a simple label-id match (see
 * scoring/moduleSuggestions.ts) rather than full adaptive branching.
 */
export const factionModules: FactionModule[] = [
  {
    id: 'left-faction-module',
    name: 'Socialist/Left Depth Module',
    description: 'Follow-up items distinguishing reform, council, and revolutionary currents within the left.',
    triggerLabelIds: ['democratic-socialist', 'revolutionary-collectivist', 'egalitarian-statist'],
    questionIds: ['fm-left-1', 'fm-left-2', 'fm-left-3', 'fm-left-4'],
  },
  {
    id: 'right-faction-module',
    name: 'Right/Conservative Depth Module',
    description: 'Follow-up items distinguishing traditionalist, nationalist-economic, and reformist currents on the right.',
    triggerLabelIds: ['national-traditionalist'],
    questionIds: ['fm-right-1', 'fm-right-2', 'fm-right-3', 'fm-right-4'],
  },
  {
    id: 'authoritarian-faction-module',
    name: 'Authoritarian Depth Module',
    description: 'Follow-up items probing support for centralized, coercive, and expertise-led governance over deliberative process.',
    triggerLabelIds: ['technocratic-centralist', 'national-traditionalist'],
    questionIds: ['fm-auth-1', 'fm-auth-2', 'fm-auth-3', 'fm-auth-4'],
  },
  {
    id: 'anarchist-faction-module',
    name: 'Anarchist Depth Module',
    description: 'Follow-up items distinguishing anti-statist currents that reject permanent centralized authority.',
    triggerLabelIds: ['decentralist-market-skeptic-of-state', 'revolutionary-collectivist'],
    questionIds: ['fm-anar-1', 'fm-anar-2', 'fm-anar-3', 'fm-anar-4'],
  },
  {
    id: 'market-faction-module',
    name: 'Libertarian/Market Depth Module',
    description: 'Follow-up items distinguishing minarchist, market-anarchist, and geolibertarian currents.',
    triggerLabelIds: ['market-liberal', 'decentralist-market-skeptic-of-state'],
    questionIds: ['fm-market-1', 'fm-market-2', 'fm-market-3', 'fm-market-4'],
  },
  {
    id: 'green-faction-module',
    name: 'Green/Ecology Depth Module',
    description: 'Follow-up items on ecological standing, growth, and centralization of environmental enforcement.',
    triggerLabelIds: ['egalitarian-statist', 'decentralist-market-skeptic-of-state'],
    questionIds: ['fm-green-1', 'fm-green-2', 'fm-green-3', 'fm-green-4'],
  },
  {
    id: 'religious-faction-module',
    name: 'Religious Politics Depth Module',
    description: 'Follow-up items on the role of religious tradition and authority in public and family life.',
    triggerLabelIds: ['national-traditionalist'],
    questionIds: ['fm-religious-1', 'fm-religious-2', 'fm-religious-3', 'fm-religious-4'],
  },
  {
    id: 'nationalist-faction-module',
    name: 'Nationalist/Sovereigntist Depth Module',
    description: 'Follow-up items on the boundaries of political obligation, borders, and willingness to act unilaterally.',
    triggerLabelIds: ['national-traditionalist'],
    questionIds: ['fm-nat-1', 'fm-nat-2', 'fm-nat-3', 'fm-nat-4'],
  },
  {
    id: 'technocracy-faction-module',
    name: 'Technocracy/Futurism Depth Module',
    description: 'Follow-up items on expert authority, centralized technical governance, and speed of adopting new technology.',
    triggerLabelIds: ['technocratic-centralist'],
    questionIds: ['fm-tech-1', 'fm-tech-2', 'fm-tech-3', 'fm-tech-4'],
  },
  {
    id: 'georgist-faction-module',
    name: 'Georgist/Land Depth Module',
    description: 'Follow-up items on land-value taxation, zoning, and predistribution versus redistribution for housing.',
    triggerLabelIds: ['market-liberal', 'decentralist-market-skeptic-of-state'],
    questionIds: ['fm-georgist-1', 'fm-georgist-2', 'fm-georgist-3', 'fm-georgist-4'],
  },
  {
    id: 'anti-ip-faction-module',
    name: 'Anti-IP/Information Politics Depth Module',
    description: 'Follow-up items on the legitimacy of patent and copyright monopolies and how quickly to dismantle them.',
    triggerLabelIds: ['civil-libertarian-cosmopolitan', 'market-liberal'],
    questionIds: ['fm-antiip-1', 'fm-antiip-2', 'fm-antiip-3', 'fm-antiip-4'],
  },
]

export const factionModuleById = new Map(factionModules.map((m) => [m.id, m]))
