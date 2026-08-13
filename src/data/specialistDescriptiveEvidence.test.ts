import { describe, expect, it } from 'vitest'
import { specialistModuleDefinitions } from '../specialist'
import {
  SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION,
  specialistDescriptiveEvidenceById,
} from './specialistDescriptiveEvidence'
import { QUESTION_BANK_VERSION } from './effectiveQuestions'

describe('specialist descriptive evidence', () => {
  it('versions and operationalizes all explicitly sourced specialist descriptive items', () => {
    expect(QUESTION_BANK_VERSION).toContain(SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION)
    expect(Object.keys(specialistDescriptiveEvidenceById)).toEqual(['fm-fem-2', 'fm-fem-4', 'fm-id-13', 'fm-an-2', 'fm-so-2', 'fm-te-3'])

    const questions = specialistModuleDefinitions.flatMap((module) => module.questions)
    for (const [id, evidence] of Object.entries(specialistDescriptiveEvidenceById)) {
      const question = questions.find((candidate) => candidate.id === id)
      expect(question, `${id} evidence references a missing specialist item`).toBeDefined()
      expect(question!.layer).toBe('descriptive')
      expect(question!.evidenceNote).toBe(evidence.evidenceNote)
      expect(question!.evidenceNote!.length).toBeGreaterThan(100)
      expect(question!.sources).toEqual(evidence.sources)
      expect(evidence.sources.length).toBeGreaterThanOrEqual(2)
      for (const source of evidence.sources) {
        expect(source.title.length).toBeGreaterThan(2)
        expect(source.publisher?.length ?? 0).toBeGreaterThan(2)
        expect(source.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('leaves no active specialist descriptive item without an evidence scope', () => {
    const descriptive = specialistModuleDefinitions
      .flatMap((module) => module.questions)
      .filter((question) => question.layer === 'descriptive' && question.active !== false)

    expect(descriptive).toHaveLength(6)
    expect(descriptive.every((question) => Boolean(question.evidenceNote?.trim()))).toBe(true)
    expect(descriptive.every((question) => (question.sources?.length ?? 0) > 0)).toBe(true)
  })
})
