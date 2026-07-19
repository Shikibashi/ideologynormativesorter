import type { CitationRecord } from '../types'
import { allFamilyScholarlyCitations } from './familyCatalog'
import { LABEL_BANK_SCHOLARLY_STUB_IDS } from './registry'

export type IngressCitation = CitationRecord & {
  promotedTo?: 'primary-text' | 'scholarly'
  cleanRoomChecked: boolean
  independenceChecked: boolean
}

/**
 * Peer-research / secondary seeds enter here.
 * Family scholarly baselines from audited docs are recorded as promoted scholarly
 * with clean-room + independence checked against the in-repo research docs.
 * Deprecated shared stubs remain unpromoted.
 */
export const ingressQueue: IngressCitation[] = [
  ...allFamilyScholarlyCitations().map(
    (c): IngressCitation => ({
      ...c,
      promotedTo: 'scholarly',
      cleanRoomChecked: true,
      independenceChecked: true,
    }),
  ),
  {
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[0],
    kind: 'secondary-seed',
    title:
      'Deprecated secondary-seed: shared scholarly stub 1 (unused by filled claims)',
    authors: [],
    cleanRoomChecked: false,
    independenceChecked: false,
  },
  {
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[1],
    kind: 'secondary-seed',
    title:
      'Deprecated secondary-seed: shared scholarly stub 2 (unused by filled claims)',
    authors: [],
    cleanRoomChecked: false,
    independenceChecked: false,
  },
]
