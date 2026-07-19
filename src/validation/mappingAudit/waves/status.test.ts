import { describe, it, expect } from 'vitest'
import { allWaves } from './partition'
import { waveStatusRecords, waveStatusById } from './status'

describe('wave status registry', () => {
  it('records every question and label wave with no silent skips', () => {
    const waves = allWaves()
    expect(waveStatusRecords.length).toBe(waves.length)

    for (const wave of waves) {
      const status = waveStatusById(wave.waveId)
      expect(status, wave.waveId).toBeDefined()
      expect(status!.subjectCount).toBe(wave.subjectIds.length)
      expect(status!.subjectsWithRationaleOrClaims).toBe(wave.subjectIds.length)
      expect(status!.openIssueSubjects).toEqual([])
      expect(
        status!.status === 'complete-provisional' ||
          status!.status === 'complete-applied',
      ).toBe(true)
    }
  })
})
