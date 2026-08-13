import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import { questions } from './effectiveQuestions'
import { primaryScoringLabels } from './labelTaxonomy'
import { PRIMARY_MEASUREMENT_VERSION, primaryScoringScopeByLabelId } from './primaryMeasurement'
import { buildResultProfile } from '../scoring'
import type { AnswerMap } from '../types'

function touchesAxis(question: (typeof questions)[number], axisId: string): boolean {
   return question.axisWeights.some((weight) => weight.axisId === axisId)
      || question.statementOptions?.some((option) => option.axisWeights.some((weight) => weight.axisId === axisId)) === true
}

describe('source-backed primary measurement scopes', () => {
   it('gives every ordinary primary a scoped, sourced, measurable comparator', () => {
      expect(Object.keys(primaryScoringScopeByLabelId).sort()).toEqual(
         primaryScoringLabels.map((label) => label.id).sort(),
      )

      for (const label of primaryScoringLabels) {
         const scope = label.scoringScope
         expect(scope, `${label.id} is missing its primary scoring scope`).toBeDefined()
         expect(scope!.version).toBe(PRIMARY_MEASUREMENT_VERSION)
         expect(scope!.axisIds.length, `${label.id} has no comparison constructs`).toBeGreaterThan(0)
         expect(scope!.axisIds.length, `${label.id} still scores over the full centroid`).toBeLessThan(Object.keys(label.centroid).length)
         expect(scope!.requiredAxisIds.length, `${label.id} has no required core evidence`).toBeGreaterThan(0)

         for (const [axisId, minimumItemCount] of Object.entries(scope!.minimumItemCounts ?? {})) {
            expect(scope!.requiredAxisIds).toContain(axisId)
            expect(minimumItemCount, `${label.id} has an invalid minimum for ${axisId}`).toBeGreaterThanOrEqual(1)
         }

         for (const axisId of scope!.axisIds) {
            expect(axes.some((axis) => axis.id === axisId), `${label.id} references an unknown axis ${axisId}`).toBe(true)
            expect(label.centroid[axisId], `${label.id} lacks centroid value for ${axisId}`).toBeTypeOf('number')
         }
         for (const axisId of scope!.requiredAxisIds) {
            expect(scope!.axisIds).toContain(axisId)
         }
         for (const sourceId of scope!.sourceIds) {
            expect(label.sources?.some((source) => source.sourceId === sourceId), `${label.id} scope source ${sourceId} is not disclosed`).toBe(true)
         }
      }
   })

   it('does not use social-conservatism or empirical-voter-confidence proxies as primary cores', () => {
      const byId = new Map(primaryScoringLabels.map((label) => [label.id, label]))

      expect(byId.get('market-liberal')?.scoringScope?.requiredAxisIds).toContain('authority-legitimacy')
      expect(byId.get('conservative')?.scoringScope?.axisIds).not.toContain('moral-traditionalism')
      expect(byId.get('liberal-conservatism')?.scoringScope?.axisIds).not.toContain('moral-traditionalism')
      expect(byId.get('radical-democracy')?.scoringScope?.axisIds).not.toContain('democratic-confidence')
      expect(byId.get('republicanism')?.scoringScope?.axisIds).not.toContain('democratic-confidence')
      expect(byId.get('social-liberalism')?.centroid['liberty-noninterference']).toBeLessThan(0)
      expect(byId.get('republicanism')?.centroid['liberty-noninterference']).toBeLessThan(0)
      expect(byId.get('radical-democracy')?.centroid['democratic-confidence']).toBe(0)
      expect(byId.get('republicanism')?.centroid['democratic-confidence']).toBe(0)
   })

   it('withholds Green Politics when ecological moral standing was never measured', () => {
      const answers: AnswerMap = Object.fromEntries(
         questions
            .filter((question) => question.responseType !== 'statementChoice')
            .filter((question) => !touchesAxis(question, 'human-nature-priority'))
            .map((question) => [question.id, {
               questionId: question.id,
               value: 0,
               ...(question.layer === 'descriptive' ? { confidence: 5 } : {}),
               ...(question.layer === 'prescriptive' ? { priority: 5 } : {}),
            }]),
      )

      const result = buildResultProfile(questions, answers, axes, primaryScoringLabels)

      expect(result.scores.normative.find((score) => score.axisId === 'human-nature-priority')?.itemCount).toBe(0)
      expect(result.nearestLabels.map((match) => match.labelId)).not.toContain('green-politics')
   })

   it('withholds Market Liberalism when constitutional-authority evidence was never measured', () => {
      const marketLiberal = primaryScoringLabels.find((label) => label.id === 'market-liberal')!
      const allowedScopeAxes = new Set(
         marketLiberal.scoringScope!.axisIds.filter((axisId) => axisId !== 'authority-legitimacy'),
      )
      const answers: AnswerMap = Object.fromEntries(
         questions
            .filter((question) => !touchesAxis(question, 'authority-legitimacy'))
            .filter((question) => question.axisWeights.some((weight) => allowedScopeAxes.has(weight.axisId)))
            .map((question) => [question.id, {
               questionId: question.id,
               value: 0,
               ...(question.layer === 'descriptive' ? { confidence: 5 } : {}),
               ...(question.layer === 'prescriptive' ? { priority: 5 } : {}),
            }]),
      )

      const result = buildResultProfile(questions, answers, axes, primaryScoringLabels)

      expect(result.scores.normative.find((score) => score.axisId === 'authority-legitimacy')?.itemCount).toBe(0)
      expect(result.nearestLabels.map((match) => match.labelId)).not.toContain('market-liberal')
   })

   it('shows Green Politics only after two direct ecological-standing responses', () => {
      const ecologicalItems = questions
         .filter((question) => question.axisWeights.some((weight) => weight.axisId === 'human-nature-priority'))
         .slice(0, 2)
      const answers: AnswerMap = Object.fromEntries(ecologicalItems.map((question) => [question.id, {
         questionId: question.id,
         value: 3,
      }]))

      const result = buildResultProfile(questions, answers, axes, primaryScoringLabels)
      const green = result.nearestLabels.find((match) => match.labelId === 'green-politics')

      const oneAnswerResult = buildResultProfile(
         questions,
         { [ecologicalItems[0].id]: { questionId: ecologicalItems[0].id, value: 3 } },
         axes,
         primaryScoringLabels,
      )

      expect(ecologicalItems).toHaveLength(2)
      expect(oneAnswerResult.nearestLabels.map((match) => match.labelId)).not.toContain('green-politics')
      expect(green?.coreGateStatus).toBe('passed')
      expect(green?.measuredAxisCount).toBe(1)
      expect(green?.totalAxisCount).toBe(1)
   })
})
