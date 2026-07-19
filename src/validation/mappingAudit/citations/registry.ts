import type { CitationRecord } from '../types'
import {
  allFamilyScholarlyCitations,
  scholarlyCiteIdsForFamily,
} from './familyCatalog'

/** @deprecated Shared stubs retained only for migration tests; live claims use family scholarly cites. */
export const LABEL_BANK_SCHOLARLY_STUB_IDS = [
  'cite:label-bank-scholarly-stub-1',
  'cite:label-bank-scholarly-stub-2',
] as const

export const citationRegistry: CitationRecord[] = []

export function citationById(citeId: string): CitationRecord | undefined {
  return citationRegistry.find((c) => c.citeId === citeId)
}

/** Normalize a URL for deduplication: lowercase host, strip trailing slash, strip utm_* params. */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    u.hostname = u.hostname.toLowerCase()
    u.pathname = u.pathname.replace(/\/$/, '') || '/'
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith('utm_')) u.searchParams.delete(key)
    }
    u.searchParams.sort()
    return u.toString()
  } catch {
    return url.toLowerCase().replace(/\/$/, '')
  }
}

/** Generate a citeId from a normalized URL or bibliographic key. */
export function makeCiteId(normalizedKey: string): string {
  let hash = 0
  for (let i = 0; i < normalizedKey.length; i++) {
    hash = ((hash << 5) - hash + normalizedKey.charCodeAt(i)) | 0
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').slice(0, 16)
  return `cite:${hex}`
}

export function upsertCitation(record: CitationRecord): void {
  const existing = citationRegistry.findIndex((c) => c.citeId === record.citeId)
  if (existing >= 0) {
    citationRegistry[existing] = record
  } else {
    citationRegistry.push(record)
  }
}

export function labelBankPrimaryCiteId(labelId: string): string {
  return `cite:label-bank-${labelId}`
}

export { scholarlyCiteIdsForFamily }

/**
 * Seed citation registry for claim-matrix fill:
 * - per-label instrument primary (secondary-seed operationalization record)
 * - family scholarly SEP/IEP/specialist baselines (kind: scholarly)
 *
 * Deprecated shared stubs remain registered so older ingress references resolve,
 * but live claims must use scholarlyCiteIdsForFamily().
 */
export function ensureLabelBankCitations(labelIds: readonly string[]): void {
  for (const labelId of labelIds) {
    upsertCitation({
      citeId: labelBankPrimaryCiteId(labelId),
      kind: 'secondary-seed',
      title: `Instrument label-bank operationalization for ${labelId} (src/data/labels.ts)`,
      authors: ['Ideology Normative Sorter catalog'],
      venue: 'ideologynormativesorter label bank',
    })
  }

  for (const scholarly of allFamilyScholarlyCitations()) {
    upsertCitation(scholarly)
  }

  // Keep deprecated stubs resolvable (not used by filled claims).
  upsertCitation({
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[0],
    kind: 'secondary-seed',
    title:
      'Deprecated shared scholarly stub 1 (replaced by family scholarly catalog)',
    authors: [],
  })
  upsertCitation({
    citeId: LABEL_BANK_SCHOLARLY_STUB_IDS[1],
    kind: 'secondary-seed',
    title:
      'Deprecated shared scholarly stub 2 (replaced by family scholarly catalog)',
    authors: [],
  })
}
