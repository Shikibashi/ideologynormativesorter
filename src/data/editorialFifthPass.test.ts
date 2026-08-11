import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import {
  EDITORIAL_FIFTH_PASS_VERSION,
  fifthPassMappingCorrectionsById,
  fifthPassReplacementRequiredById,
  fifthPassWordingCorrectionsById,
} from './editorialFifthPass'
import {
  EDITORIAL_SEVENTH_PASS_VERSION,
  seventhPassReplacementRequiredById,
  seventhPassRewritesById,
} from './editorialSeventhPass'
import { allQuestions, QUESTION_BANK_VERSION, questionById, questionsForTier } from './effectiveQuestions'

const axisIds = new Set(axes.map((axis) => axis.id))

describe('fifth editorial pass', () => {
  it('versions the effective bank and applies every high-confidence mapping correction', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_FIFTH_PASS_VERSION)

    for (const [id, correction] of Object.entries(fifthPassMappingCorrectionsById)) {
      const question = questionById.get(id)
      expect(question, `${id} mapping references a missing item`).toBeDefined()
      expect(fifthPassReplacementRequiredById[id], `${id} cannot be mapped and quarantined together`).toBeUndefined()
      const seventhRewrite = seventhPassRewritesById[id]
      const seventhReplacement = seventhPassReplacementRequiredById[id]
      if (seventhReplacement) {
        expect(question!.active).toBe(false)
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      } else if (seventhRewrite) {
        expect(question!.active).not.toBe(false)
        expect(question!.axisWeights).toEqual(seventhRewrite.axisWeights)
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      } else {
        expect(question!.active, `${id} mapping references an inactive item`).not.toBe(false)
        expect(question!.axisWeights).toEqual(correction.axisWeights)
        expect(question!.version).toBe(EDITORIAL_FIFTH_PASS_VERSION)
      }
      expect(correction.rationale.length).toBeGreaterThan(20)

      const seen = new Set<string>()
      for (const axisWeight of correction.axisWeights) {
        expect(axisIds.has(axisWeight.axisId), `${id} references unknown axis ${axisWeight.axisId}`).toBe(true)
        expect(seen.has(axisWeight.axisId), `${id} repeats axis ${axisWeight.axisId}`).toBe(false)
        expect(Math.abs(axisWeight.weight), `${id}/${axisWeight.axisId} has invalid weight`).toBeLessThanOrEqual(1)
        seen.add(axisWeight.axisId)
      }
    }
  })

  it('applies every wording correction without changing layer or response type', () => {
    for (const [id, correction] of Object.entries(fifthPassWordingCorrectionsById)) {
      const question = questionById.get(id)
      expect(question, `${id} wording references a missing item`).toBeDefined()
      expect(fifthPassReplacementRequiredById[id], `${id} cannot be rewritten and quarantined together`).toBeUndefined()
      const seventhRewrite = seventhPassRewritesById[id]
      const seventhReplacement = seventhPassReplacementRequiredById[id]
      if (seventhReplacement) {
        expect(question!.active).toBe(false)
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      } else if (seventhRewrite) {
        expect(question!.prompt).toBe(seventhRewrite.prompt)
        expect(question!.active).not.toBe(false)
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      } else {
        expect(question!.prompt).toBe(correction.prompt)
        expect(question!.active).not.toBe(false)
        expect(question!.version).toBe(EDITORIAL_FIFTH_PASS_VERSION)
      }
      expect(correction.rationale.length).toBeGreaterThan(20)
    }
  })

  it('quarantines items that require a split, new construct, or redesigned choice set', () => {
    for (const [id, finding] of Object.entries(fifthPassReplacementRequiredById)) {
      const question = questionById.get(id)
      expect(question, `${id} quarantine references a missing item`).toBeDefined()
      expect(fifthPassMappingCorrectionsById[id], `${id} cannot be quarantined and remapped together`).toBeUndefined()
      expect(fifthPassWordingCorrectionsById[id], `${id} cannot be quarantined and rewritten together`).toBeUndefined()
      expect(question!.active).toBe(false)
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(EDITORIAL_FIFTH_PASS_VERSION)
      expect(questionsForTier(question!.tier).some((item) => item.id === id)).toBe(false)
      expect(finding.rationale.length).toBeGreaterThan(20)
      expect(finding.proposedReplacement.length).toBeGreaterThan(20)
    }
  })

  it('keeps every active question mapped only to axes in its own layer', () => {
    const layerByAxis = new Map(axes.map((axis) => [axis.id, axis.layer]))
    for (const question of allQuestions.filter((item) => item.active !== false)) {
      for (const axisWeight of question.axisWeights) {
        expect(layerByAxis.get(axisWeight.axisId), `${question.id}/${axisWeight.axisId}`).toBe(question.layer)
      }
    }
  })
})
