import type { CitationRecord } from '../types'
import { LABEL_BANK_SCHOLARLY_STUB_IDS } from './registry'

export type IngressCitation = CitationRecord & {
  promotedTo?: 'primary-text' | 'scholarly'
  cleanRoomChecked: boolean
  independenceChecked: boolean
}

/** Peer-research seeds enter here. Promotion requires clean-room + independence review. */
export const ingressQueue: IngressCitation[] = [
  {
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[0],
    kind: 'secondary-seed',
    title:
      'PENDING secondary-seed: shared scholarly stub 1 for claim-matrix schema minima',
    authors: [],
    cleanRoomChecked: false,
    independenceChecked: false,
  },
  {
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[1],
    kind: 'secondary-seed',
    title:
      'PENDING secondary-seed: shared scholarly stub 2 for claim-matrix schema minima',
    authors: [],
    cleanRoomChecked: false,
    independenceChecked: false,
  },
]
