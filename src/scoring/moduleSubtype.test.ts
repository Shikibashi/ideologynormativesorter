import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { labels, labelById } from '../data/labels'
import { factionModuleById } from '../data/factionModules'
import { questions } from '../data/questions'
import { moduleQuestionById } from '../data/moduleQuestions'
import { buildResultProfile, computeModuleSubtype, computeScoreBreakdown } from './index'
import type { AnswerMap, FactionModule } from '../types'

const ALL = [...questions, ...Array.from(moduleQuestionById.values())]

/** Build a full answer map (base bank + module bank) aligned to a label's centroid direction. */
function answersAlignedTo(labelId: string): AnswerMap {
   const centroid = labelById.get(labelId)!.centroid
   const answers: AnswerMap = {}
   for (const q of ALL) {
      let total = 0
      let weight = 0
      for (const w of q.axisWeights) {
         const c = centroid[w.axisId] ?? 0
         total += c * w.weight
         weight += Math.abs(w.weight)
      }
      if (weight > 0) answers[q.id] = { questionId: q.id, value: (Math.sign(total) * 3) as number }
   }
   return answers
}

describe('computeModuleSubtype', () => {
   it('resolves a module to the nearest candidate among only its subtypeLabelIds', () => {
      const module = factionModuleById.get('left-faction-module')!
      // A respondent aligned to council-communist centroid, scored through the full bank.
      const scores = computeScoreBreakdown(ALL, answersAlignedTo('council-communist'), axes)
      const subtype = computeModuleSubtype(scores, module.subtypeLabelIds, labels)
      expect(subtype).not.toBeNull()
      // Resolved subtype must be one of the module's declared candidates.
      expect(module.subtypeLabelIds).toContain(subtype!.labelId)
   })

   it('returns null when the module has no candidate labels', () => {
      const scores = computeScoreBreakdown(ALL, answersAlignedTo('market-liberal'), axes)
      expect(computeModuleSubtype(scores, [], labels)).toBeNull()
   })

   it('distinguishes statist from anti-statist left subtypes', () => {
      const module = factionModuleById.get('left-faction-module')!
      const mlScores = computeScoreBreakdown(ALL, answersAlignedTo('marxist-leninist'), axes)
      const ccScores = computeScoreBreakdown(ALL, answersAlignedTo('council-communist'), axes)
      const ml = computeModuleSubtype(mlScores, module.subtypeLabelIds, labels)!
      const cc = computeModuleSubtype(ccScores, module.subtypeLabelIds, labels)!
      // The vanguard-statist profile must NOT resolve to the same subtype as the
      // anti-state council profile; the module signal separates them.
      expect(ml.labelId).not.toBe(cc.labelId)
      // Each should land on a centralization-consistent candidate.
      expect(labelById.get(ml.labelId)!.centroid['centralization-preference']).toBeGreaterThan(0)
      expect(labelById.get(cc.labelId)!.centroid['centralization-preference']).toBeLessThan(0)
   })
})

describe('buildResultProfile moduleSubtypes', () => {
   it('populates moduleSubtypes only for completed modules', () => {
      const answers = answersAlignedTo('anarcho-capitalist')
      const market: FactionModule = factionModuleById.get('market-faction-module')!

      const without = buildResultProfile(ALL, answers, axes, labels)
      expect(without.moduleSubtypes).toEqual({})

      const withModule = buildResultProfile(ALL, answers, axes, labels, [market])
      expect(Object.keys(withModule.moduleSubtypes ?? {})).toEqual(['market-faction-module'])
      const resolved = withModule.moduleSubtypes!['market-faction-module']
      expect(market.subtypeLabelIds).toContain(resolved.labelId)
      expect(resolved.moduleName).toBe(market.name)
      expect(resolved.confidence).toBeGreaterThan(0)
   })
})
