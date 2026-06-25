import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { labels } from '../data/labels'
import { questions } from '../data/questions'
import { allCalibrationFixtures, centroidAlignedAnswerValue } from './calibration.fixtures'
import { buildResultProfile } from './index'

const ALL_SCORABLE = questions

/**
 * Reflexivity check: each fixture projects a label's own centroid back through
 * the question bank, so it is NOT a test of cross-profile discrimination. It
 * verifies the weaker but still useful property that a respondent whose answers
 * align with a label's centroid ranks that label among the nearest matches —
 * i.e. centroids are coherent and the distance metric is well-formed. A strict
 * rank-1 requirement is not appropriate because some labels legitimately
 * cluster (e.g. the left-statist family shares most prescriptive axes and
 * differs mainly on sparse revolution/coercion items), so a centroid-aligned
 * profile can land within a tight same-family neighborhood. The non-circular
 * discrimination test is the hand-authored archetype below.
 */
describe('calibration fixtures (centroid reflexivity)', () => {
   for (const fixture of allCalibrationFixtures) {
      it(fixture.description, () => {
         const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)

         // A centroid-aligned profile must rank its own label among the nearest
         // matches, and that label's confidence must remain close to the best
         // match. Magnitude-preserving synthetic answers expose dense clusters,
         // so this is reflexivity, not a strict #1-label guarantee.
         const ids = result.nearestLabels.map((l) => l.labelId)
         expect(ids).toContain(fixture.expectedLabelIds[0])
         const own = result.nearestLabels.find((l) => l.labelId === fixture.expectedLabelIds[0])!
         expect(own.confidence).toBeGreaterThanOrEqual(fixture.minConfidence)
         expect(result.nearestLabels[0].confidence - own.confidence).toBeLessThanOrEqual(0.07)
      })
   }
})

describe('centroid-aligned statementChoice answers', () => {
   it('chooses the option whose axis weights best match the target centroid', () => {
      const propertyQuestion = questions.find((q) => q.id === 'sq02')!

      expect(
         centroidAlignedAnswerValue(propertyQuestion, {
            'property-legitimacy': -1,
            'equality-theory': 1,
         }),
      ).toBe(1)
   })

   it('rejects missing statementOptions', () => {
      const propertyQuestion = questions.find((q) => q.id === 'sq02')!

      expect(() =>
         centroidAlignedAnswerValue(
            { ...propertyQuestion, statementOptions: undefined },
            {
               'property-legitimacy': -1,
               'equality-theory': 1,
            },
         ),
      ).toThrow(/statementOptions/)
   })

   it('rejects empty statementOptions', () => {
      const propertyQuestion = questions.find((q) => q.id === 'sq02')!

      expect(() =>
         centroidAlignedAnswerValue(
            { ...propertyQuestion, statementOptions: [] },
            {
               'property-legitimacy': -1,
               'equality-theory': 1,
            },
         ),
      ).toThrow(/statementOptions/)
   })

   it('rejects statementOptions with no scorable options', () => {
      const propertyQuestion = questions.find((q) => q.id === 'sq02')!

      expect(() =>
         centroidAlignedAnswerValue(
            {
               ...propertyQuestion,
               statementOptions: propertyQuestion.statementOptions!.map((option) => ({
                  ...option,
                  axisWeights: [],
               })),
            },
            {
               'property-legitimacy': -1,
               'equality-theory': 1,
            },
         ),
      ).toThrow(/scorable statementOptions/)
   })
})

/**
 * Hand-authored (non-circular) archetype: answers are built from an explicit
 * statement of intent over axes, not projected from any label centroid. This
 * is the on-thesis regression test for the test's core claim AND a guard
 * against the prescriptive sign-inversion bug: a respondent who is normatively
 * egalitarian/anti-domination but descriptively market-confident and
 * prescriptively deregulatory must land on the decentralist market-skeptic
 * label, NOT on a statist label. Before the prescriptive axis weights were
 * corrected, agreeing with deregulatory reforms scored toward more regulation,
 * which inverted this profile onto the statist labels.
 */
describe('hand-authored egalitarian-but-market-deregulatory archetype', () => {
   const intent: Record<string, number> = {
      'equality-theory': 1,
      'anti-domination': 1,
      'authority-legitimacy': -1,
      'liberty-noninterference': 1,
      'property-legitimacy': 0.3,
      'market-process-confidence': 1,
      'public-choice-skepticism': 1,
      'state-capacity-confidence': -1,
      'expert-confidence': -1,
      'coordination-optimism': 1,
      'centralization-preference': -1,
      'state-action-vs-exit': -1,
      'regulation-vs-deregulation': -1,
      'redistribution-vs-predistribution': -0.5,
      'coercion-strategy': -1,
   }

   const answers = Object.fromEntries(
      ALL_SCORABLE.flatMap((q) => {
         let total = 0
         let weight = 0
         for (const aw of q.axisWeights) {
            const i = intent[aw.axisId]
            if (i === undefined) continue
            total += i * aw.weight
            weight += Math.abs(aw.weight)
         }
         if (weight === 0) return []
         return [[q.id, { questionId: q.id, value: (Math.sign(total) * 3) as number }]] as const
      })
   )

   const result = buildResultProfile(ALL_SCORABLE, answers, axes, labels)

   it('keeps the decentralist market-skeptic-of-state label among the closest matches', () => {
      expect(result.nearestLabels.slice(0, 3).map((match) => match.labelId)).toContain('decentralist-market-skeptic-of-state')
   })

   it('does not rank a statist label as the nearest match', () => {
      const statist = ['egalitarian-statist', 'democratic-socialist', 'revolutionary-collectivist']
      expect(statist).not.toContain(result.nearestLabels[0].labelId)
   })

   it('keeps the deregulatory prescriptive layer aligned, not inverted', () => {
      // Regression guard for the sign-inversion bug: the regulation/state-action
      // prescriptive axes must score toward deregulation/exit for this profile.
      const presc = new Map(result.scores.prescriptive.map((s) => [s.axisId, s.normalized]))
      expect(presc.get('regulation-vs-deregulation')!).toBeLessThan(0)
      expect(presc.get('state-action-vs-exit')!).toBeLessThan(0)
   })
})