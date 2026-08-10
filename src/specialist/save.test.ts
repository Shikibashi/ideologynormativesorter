import { beforeEach, describe, expect, it } from 'vitest'
import { clearSpecialistProgress, loadSpecialistProgress, saveSpecialistProgress } from './save'

describe('specialist progress storage', () => {
  beforeEach(() => localStorage.clear())

  it('stores progress separately by module and administration', () => {
    const first = {
      participantId: 'p_1',
      administration: 'test' as const,
      moduleId: 'feminist-faction-module' as const,
      answers: { q1: { questionId: 'q1', value: 2 } },
      index: 1,
      startedAt: '2026-08-10T12:00:00.000Z',
    }
    const second = {
      ...first,
      administration: 'retest' as const,
      answers: { q1: { questionId: 'q1', value: -2 } },
    }

    expect(saveSpecialistProgress(first)).toEqual({ saved: true })
    expect(saveSpecialistProgress(second)).toEqual({ saved: true })
    expect(loadSpecialistProgress('p_1', 'test', 'feminist-faction-module')?.answers.q1.value).toBe(2)
    expect(loadSpecialistProgress('p_1', 'retest', 'feminist-faction-module')?.answers.q1.value).toBe(-2)
  })

  it('clears only the requested module progress', () => {
    expect(saveSpecialistProgress({
      participantId: 'p_1',
      administration: 'test',
      moduleId: 'identity-sovereignty-module',
      answers: { q1: { questionId: 'q1', value: 1 } },
      index: 0,
      startedAt: '2026-08-10T12:00:00.000Z',
    })).toEqual({ saved: true })

    expect(clearSpecialistProgress('p_1', 'test', 'identity-sovereignty-module')).toBe(true)
    expect(loadSpecialistProgress('p_1', 'test', 'identity-sovereignty-module')).toBeNull()
  })
})
