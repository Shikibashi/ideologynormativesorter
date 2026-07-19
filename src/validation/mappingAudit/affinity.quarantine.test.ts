import { describe, it, expect } from 'vitest'
import { questions } from '../../data/questions'
import { moduleQuestions } from '../../data/moduleQuestions'
import { statementQuestions } from '../../data/statementQuestions'

describe('ideologyAffinities quarantine', () => {
  it('no main bank question populates ideologyAffinities', () => {
    for (const q of questions) {
      expect(
        q.ideologyAffinities === undefined || q.ideologyAffinities.length === 0,
        `question ${q.id} has populated ideologyAffinities`,
      ).toBe(true)
    }
  })

  it('no module question populates ideologyAffinities', () => {
    for (const q of moduleQuestions) {
      expect(
        q.ideologyAffinities === undefined || q.ideologyAffinities.length === 0,
        `question ${q.id} has populated ideologyAffinities`,
      ).toBe(true)
    }
  })

  it('no statement question populates ideologyAffinities', () => {
    for (const q of statementQuestions) {
      expect(
        q.ideologyAffinities === undefined || q.ideologyAffinities.length === 0,
        `question ${q.id} has populated ideologyAffinities`,
      ).toBe(true)
    }
  })

  it('scoring index does not export affinity-related functions', async () => {
    const scoringExports = Object.keys(await import('../../scoring/index'))
    const affinityExports = scoringExports.filter(k =>
      k.toLowerCase().includes('affinity'),
    )
    expect(affinityExports).toEqual([])
  })
})
