import { describe, expect, it } from 'vitest'
import { DESCRIPTIVE_EVIDENCE_VERSION, descriptiveEvidenceById } from './descriptiveEvidence'
import { thirteenthPassRewritesById } from './editorialThirteenthPass'
import { fourteenthPassRewritesById } from './editorialFourteenthPass'
import { seventeenthPassRewritesById } from './editorialSeventeenthPass'
import { eighteenthPassRewritesById } from './editorialEighteenthPass'
import { nineteenthPassRewritesById } from './editorialNineteenthPass'
import { twentiethPassRewritesById } from './editorialTwentiethPass'
import { questionContextSources } from './questionContext'
import { QUESTION_BANK_VERSION, coreQuestions, questionById } from './effectiveQuestions'

describe('descriptive evidence context', () => {
  it('versions the bank and attaches every reviewed evidence record to an active descriptive item', () => {
    expect(QUESTION_BANK_VERSION).toContain(DESCRIPTIVE_EVIDENCE_VERSION)
    expect(Object.keys(descriptiveEvidenceById)).toHaveLength(27)

    for (const [id, evidence] of Object.entries(descriptiveEvidenceById)) {
      const question = questionById.get(id)
      expect(question, `${id} evidence references a missing item`).toBeDefined()
      expect(question!.active, `${id} evidence references an inactive item`).not.toBe(false)
      expect(question!.layer).toBe('descriptive')
      const laterRewrite = twentiethPassRewritesById[id]
        ?? nineteenthPassRewritesById[id]
        ?? eighteenthPassRewritesById[id]
        ?? seventeenthPassRewritesById[id]
        ?? fourteenthPassRewritesById[id]
        ?? thirteenthPassRewritesById[id]
      expect(question!.evidenceNote).toBe(laterRewrite?.evidenceNote ?? evidence.evidenceNote)
      const expectedSources = laterRewrite
        ? laterRewrite.sourceIds.map((sourceId) => questionContextSources[sourceId])
        : evidence.sources
      expect(question!.sources?.slice(0, expectedSources.length)).toEqual(expectedSources)
      expect(question!.sources?.length).toBeGreaterThanOrEqual(expectedSources.length)
      expect(evidence.evidenceNote.length).toBeGreaterThan(80)
      expect(evidence.sources.length).toBeGreaterThan(0)
      for (const source of evidence.sources) {
        expect(source.title.length).toBeGreaterThan(8)
        expect(source.publisher?.length ?? 0).toBeGreaterThan(2)
        expect(source.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('preserves first-pass evidence while the effective bank reaches complete active-item coverage', () => {
    const activeDescriptive = coreQuestions.filter((question) => question.active !== false && question.layer === 'descriptive')
    const sourced = activeDescriptive.filter((question) => (question.sources?.length ?? 0) > 0)
    const operationalized = activeDescriptive.filter((question) => Boolean(question.evidenceNote?.trim()))

      expect(activeDescriptive).toHaveLength(58)
      expect(sourced).toHaveLength(58)
      expect(operationalized).toHaveLength(58)
  })
})
