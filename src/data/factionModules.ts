import type { FactionModule } from '../types'

/**
 * Seed data only. Not yet triggered by the MVP quiz flow — reserved for a
 * follow-up iteration once broad-profile scoring has been validated.
 */
export const factionModules: FactionModule[] = [
  {
    id: 'left-faction-module',
    name: 'Socialist/Left Depth Module',
    description: 'Follow-up items distinguishing reform, council, and revolutionary currents within the left.',
    triggerLabelIds: ['democratic-socialist', 'revolutionary-collectivist', 'egalitarian-statist'],
    questionIds: [],
  },
  {
    id: 'market-faction-module',
    name: 'Libertarian/Market Depth Module',
    description: 'Follow-up items distinguishing minarchist, market-anarchist, and geolibertarian currents.',
    triggerLabelIds: ['market-liberal', 'decentralist-market-skeptic-of-state'],
    questionIds: [],
  },
]
