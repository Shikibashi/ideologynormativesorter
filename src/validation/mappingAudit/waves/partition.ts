import { questions as effectiveActiveQuestions } from '../../../data/effectiveQuestions'
import { moduleQuestions } from '../../../data/moduleQuestions'
import { statementQuestions } from '../../../data/statementQuestions'
import { labels } from '../../../data/labels'
import type { CorpusId } from '../types'

export interface AuditWave {
  waveId: string
  corpus: CorpusId | 'labels'
  subjectIds: string[]
}

function chunkSortedIds(
  ids: string[],
  size: number,
  prefix: string,
  corpus: AuditWave['corpus'],
): AuditWave[] {
  const sorted = [...ids].sort((a, b) => a.localeCompare(b))
  return chunkPreservingOrder(sorted, size, prefix, corpus)
}

function chunkPreservingOrder(
  ids: string[],
  size: number,
  prefix: string,
  corpus: AuditWave['corpus'],
): AuditWave[] {
  const waves: AuditWave[] = []
  for (let i = 0; i < ids.length; i += size) {
    const index = Math.floor(i / size) + 1
    waves.push({
      waveId: `${prefix}-${String(index).padStart(2, '0')}`,
      corpus,
      subjectIds: ids.slice(i, i + size),
    })
  }
  return waves
}

/** Question waves: main/module chunk 40; statement chunk 20. */
export function questionWaves(): AuditWave[] {
  return [
    ...chunkSortedIds(
      effectiveActiveQuestions.map((q) => q.id),
      40,
      'WQ-MAIN',
      'main',
    ),
    ...chunkSortedIds(moduleQuestions.map((q) => q.id), 40, 'WQ-MOD', 'module'),
    ...chunkSortedIds(
      statementQuestions.map((q) => q.id),
      20,
      'WQ-STMT',
      'statement',
    ),
  ]
}

/** Label dossier waves: family asc, subfamily asc, labelId asc; chunk 8. */
export function labelWaves(): AuditWave[] {
  const sortedIds = [...labels]
    .sort((a, b) => {
      const family = a.family.localeCompare(b.family)
      if (family !== 0) return family
      const sub = (a.subfamily ?? '').localeCompare(b.subfamily ?? '')
      if (sub !== 0) return sub
      return a.id.localeCompare(b.id)
    })
    .map((l) => l.id)
  return chunkPreservingOrder(sortedIds, 8, 'WL', 'labels')
}

export function allWaves(): AuditWave[] {
  return [...questionWaves(), ...labelWaves()]
}

export function waveById(waveId: string): AuditWave | undefined {
  return allWaves().find((w) => w.waveId === waveId)
}
