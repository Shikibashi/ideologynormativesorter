import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import {
  EDITORIAL_SEVENTH_PASS_VERSION,
  seventhPassReplacementRequiredById,
  seventhPassRewritesById,
} from './editorialSeventhPass'
import { eighthPassReplacementRequiredById } from './editorialEighthPass'
import { QUESTION_BANK_VERSION, questionById, questionsForTier } from './effectiveQuestions'

const axisIds = new Set(axes.map((axis) => axis.id))

describe('seventh editorial pass', () => {
  it('versions and applies each scoped empirical rewrite', () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_SEVENTH_PASS_VERSION)
    expect(Object.keys(seventhPassRewritesById)).toHaveLength(9)

    for (const [id, rewrite] of Object.entries(seventhPassRewritesById)) {
      const question = questionById.get(id)
      expect(question, `${id} rewrite references a missing item`).toBeDefined()
      expect(seventhPassReplacementRequiredById[id], `${id} cannot be rewritten and quarantined together`).toBeUndefined()
      expect(question!.layer).toBe('descriptive')
      expect(question!.prompt).toBe(rewrite.prompt)
      expect(question!.axisWeights).toEqual(rewrite.axisWeights)
      expect(question!.theoryContext).toBe(rewrite.theoryContext)
      if (eighthPassReplacementRequiredById[id]) {
        expect(question!.active).toBe(false)
      } else {
        expect(question!.active).not.toBe(false)
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      }
      expect(rewrite.rationale.length).toBeGreaterThan(40)

      for (const axisWeight of rewrite.axisWeights) {
        expect(axisIds.has(axisWeight.axisId), `${id} references unknown axis ${axisWeight.axisId}`).toBe(true)
        expect(Math.abs(axisWeight.weight)).toBeLessThanOrEqual(1)
      }
    }
  })

  it('quarantines every claim whose source or mapping would preserve an editorial defect', () => {
    expect(Object.keys(seventhPassReplacementRequiredById)).toHaveLength(23)

    for (const [id, finding] of Object.entries(seventhPassReplacementRequiredById)) {
      const question = questionById.get(id)
      expect(question, `${id} quarantine references a missing item`).toBeDefined()
      expect(seventhPassRewritesById[id], `${id} cannot be quarantined and rewritten together`).toBeUndefined()
      expect(question!.active).toBe(false)
      expect(question!.reviewStatus).toBe('needs-rewrite')
      expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION)
      expect(questionsForTier(question!.tier).some((item) => item.id === id)).toBe(false)
      expect(finding.rationale.length).toBeGreaterThan(40)
      expect(finding.proposedReplacement.length).toBeGreaterThan(40)
    }
  })

})
