import { describe, it, expect } from 'vitest'
import { questionWaves, labelWaves, allWaves } from './partition'
import { questions as effectiveActiveQuestions } from '../../../data/effectiveQuestions'
import { moduleQuestions } from '../../../data/moduleQuestions'
import { statementQuestions } from '../../../data/statementQuestions'
import { labels } from '../../../data/labels'
import { WP0_FREEZE } from '../inventory/freeze'

describe('wave partition', () => {
  it('partitions effective-active main into chunks of 40 (last may be smaller)', () => {
    const main = questionWaves().filter((w) => w.corpus === 'main')
    expect(main.length).toBe(10)
    expect(main.slice(0, -1).every((w) => w.subjectIds.length === 40)).toBe(true)
    expect(main.at(-1)!.subjectIds.length).toBe(3)
    expect(main.flatMap((w) => w.subjectIds).sort()).toEqual(
      effectiveActiveQuestions.map((q) => q.id).sort(),
    )
  })

  it('partitions module into chunks of 40', () => {
    const mod = questionWaves().filter((w) => w.corpus === 'module')
    expect(mod.length).toBe(4)
    expect(mod.flatMap((w) => w.subjectIds).sort()).toEqual(
      moduleQuestions.map((q) => q.id).sort(),
    )
  })

  it('partitions statement into a single chunk of 17', () => {
    const stmt = questionWaves().filter((w) => w.corpus === 'statement')
    expect(stmt).toHaveLength(1)
    expect(stmt[0].subjectIds).toHaveLength(17)
    expect(stmt[0].subjectIds.sort()).toEqual(
      statementQuestions.map((q) => q.id).sort(),
    )
  })

  it('partitions labels into chunks of 8 with family ordering', () => {
    const waves = labelWaves()
    expect(waves.flatMap((w) => w.subjectIds)).toHaveLength(WP0_FREEZE.labelCount)
    expect(waves.slice(0, -1).every((w) => w.subjectIds.length === 8)).toBe(true)
    // First wave should start with anarchist family labels.
    const firstLabel = labels.find((l) => l.id === waves[0].subjectIds[0])!
    expect(firstLabel.family).toBe('anarchist')
  })

  it('allWaves combines question and label waves without id collisions', () => {
    const ids = allWaves().map((w) => w.waveId)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
