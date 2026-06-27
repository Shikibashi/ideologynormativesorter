import { describe, expect, it } from 'vitest'
import type { Layer, QuizTier } from '../types'
import { axes, axisById } from './axes'
import { domainById, domains } from './domains'
import { labels } from './labels'
import { allQuestions, questionById, questions, questionsForTier } from './questions'
import { moduleQuestions } from './moduleQuestions'

const TIERS: QuizTier[] = ['blitz', 'quick', 'moderate', 'extensive']
const FULL_COVERAGE_TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']

const LAYERS: Layer[] = ['normative', 'descriptive', 'prescriptive']

describe('domains', () => {
   it('covers all 20 required policy domains exactly once', () => {
      expect(domains).toHaveLength(20)
      expect(new Set(domains.map((d) => d.id)).size).toBe(20)
   })
})

describe('axes', () => {
   it('defines 26 axes, split 10 normative / 7 descriptive / 9 prescriptive', () => {
      expect(axes).toHaveLength(26)
      const expectedPerLayer: Record<Layer, number> = { normative: 10, descriptive: 7, prescriptive: 9 }
      for (const layer of LAYERS) {
         expect(axes.filter((a) => a.layer === layer)).toHaveLength(expectedPerLayer[layer])
      }
   })

   it('has no duplicate axis ids', () => {
      expect(new Set(axes.map((a) => a.id)).size).toBe(axes.length)
   })
})

describe('questions', () => {
   it('has at least 30 items', () => {
      expect(questions.length).toBeGreaterThanOrEqual(30)
   })

   it('has no duplicate question ids', () => {
      expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
   })

   it('only references domains that exist', () => {
      for (const question of questions) {
         expect(domainById.has(question.domain), `${question.id} references unknown domain ${question.domain}`).toBe(true)
      }
   })

   it('only references axes that exist and share the question layer', () => {
      for (const question of questions) {
         for (const weight of question.axisWeights) {
            const axis = axisById.get(weight.axisId)
            expect(axis, `${question.id} references unknown axis ${weight.axisId}`).toBeDefined()
            expect(axis!.layer, `${question.id} (${question.layer}) references ${weight.axisId} (${axis!.layer})`).toBe(question.layer)
         }
      }
   })

   it('keeps every question axis weight finite and in range', () => {
      for (const question of allQuestions) {
         for (const weight of question.axisWeights) {
            expect(Number.isFinite(weight.weight), `${question.id}/${weight.axisId} weight is not finite`).toBe(true)
            expect(weight.weight, `${question.id}/${weight.axisId} weight is below -1`).toBeGreaterThanOrEqual(-1)
            expect(weight.weight, `${question.id}/${weight.axisId} weight is above 1`).toBeLessThanOrEqual(1)
         }
      }
   })

   it('does not repeat axis ids on a question', () => {
      for (const question of allQuestions) {
         const axisIds = question.axisWeights.map((weight) => weight.axisId)
         expect(new Set(axisIds).size, `${question.id} repeats an axis id`).toBe(axisIds.length)
      }
   })

   it('every domain has at least one item in each layer', () => {
      for (const domain of domains) {
         for (const layer of LAYERS) {
            const count = questions.filter((q) => q.domain === domain.id && q.layer === layer).length
            expect(count, `${domain.id} has no ${layer} item`).toBeGreaterThan(0)
         }
      }
   })

   it('has at least one domain with both an ideal and a nonideal item, to support gap scoring', () => {
      const domainsWithBoth = domains.filter((domain) => {
         const items = questions.filter((q) => q.domain === domain.id)
         return items.some((q) => q.theoryContext === 'ideal') && items.some((q) => q.theoryContext === 'nonideal')
      })
      expect(domainsWithBoth.length).toBeGreaterThan(0)
   })

   it('every descriptive item that allows dont_know provides a confidence prompt', () => {
      for (const question of questions.filter((q) => q.layer === 'descriptive' && q.allowDontKnow)) {
         expect(question.confidencePrompt, `${question.id} is missing a confidencePrompt`).toBeTruthy()
      }
   })

   it('every prescriptive item provides a priority prompt', () => {
      for (const question of questions.filter((q) => q.layer === 'prescriptive')) {
         expect(question.priorityPrompt, `${question.id} is missing a priorityPrompt`).toBeTruthy()
      }
   })
})

describe('statementChoice questions', () => {
   const statementQuestions = questions.filter((q) => q.responseType === 'statementChoice')

   it('has at least one statement-choice item', () => {
      expect(statementQuestions.length).toBeGreaterThan(0)
   })

   it('provides at least 3 options per item, each referencing valid same-layer axes', () => {
      for (const question of statementQuestions) {
         expect(question.statementOptions?.length ?? 0, `${question.id} needs statementOptions`).toBeGreaterThanOrEqual(3)
         for (const option of question.statementOptions ?? []) {
            for (const weight of option.axisWeights) {
               const axis = axisById.get(weight.axisId)
               expect(axis, `${question.id}/${option.id} references unknown axis ${weight.axisId}`).toBeDefined()
               expect(axis!.layer, `${question.id}/${option.id} (${question.layer}) references ${weight.axisId} (${axis!.layer})`).toBe(question.layer)
            }
         }
      }
   })

   it('has no duplicate option ids within an item', () => {
      for (const question of statementQuestions) {
         const ids = (question.statementOptions ?? []).map((o) => o.id)
         expect(new Set(ids).size, `${question.id} has duplicate option ids`).toBe(ids.length)
      }
   })

   it('keeps statement-option weights finite, in range, and non-repeated', () => {
      for (const question of allQuestions.filter((q) => q.responseType === 'statementChoice')) {
         for (const option of question.statementOptions ?? []) {
            const axisIds = option.axisWeights.map((weight) => weight.axisId)
            expect(new Set(axisIds).size, `${question.id}/${option.id} repeats an axis id`).toBe(axisIds.length)
            for (const weight of option.axisWeights) {
               expect(Number.isFinite(weight.weight), `${question.id}/${option.id}/${weight.axisId} weight is not finite`).toBe(true)
               expect(weight.weight, `${question.id}/${option.id}/${weight.axisId} weight is below -1`).toBeGreaterThanOrEqual(-1)
               expect(weight.weight, `${question.id}/${option.id}/${weight.axisId} weight is above 1`).toBeLessThanOrEqual(1)
            }
         }
      }
   })
})

describe('quiz tiers', () => {
   it('nests blitz within quick within moderate within extensive', () => {
      const blitz = new Set(questionsForTier('blitz').map((q) => q.id))
      const quick = new Set(questionsForTier('quick').map((q) => q.id))
      const moderate = new Set(questionsForTier('moderate').map((q) => q.id))
      const extensive = new Set(questionsForTier('extensive').map((q) => q.id))

      expect(extensive.size).toBe(questions.length)
      for (const id of blitz) expect(quick.has(id)).toBe(true)
      for (const id of quick) expect(moderate.has(id)).toBe(true)
      for (const id of moderate) expect(extensive.has(id)).toBe(true)
   })

   it('keeps module questions out of ordinary tier pools but discoverable explicitly', () => {
      const tierIds = new Set(TIERS.flatMap((tier) => questionsForTier(tier).map((q) => q.id)))

      for (const question of moduleQuestions) {
         expect(tierIds.has(question.id), `${question.id} leaked into a tier pool`).toBe(false)
         expect(allQuestions.some((q) => q.id === question.id), `${question.id} missing from allQuestions`).toBe(true)
         expect(questionById.get(question.id), `${question.id} missing from questionById`).toBe(question)
      }
   })

   it('documents that module questions are data-only until a registry exists', () => {
      expect(moduleQuestions.length).toBeGreaterThan(0)
      expect(moduleQuestions.every((q) => typeof q.module === 'string' && q.module.length > 0)).toBe(true)
   })

   it('every domain has at least one item per layer in every full-coverage tier', () => {
      for (const tier of FULL_COVERAGE_TIERS) {
         const pool = questionsForTier(tier)
         for (const domain of domains) {
            for (const layer of LAYERS) {
               const count = pool.filter((q) => q.domain === domain.id && q.layer === layer).length
               expect(count, `${domain.id}/${layer} has no item in the ${tier} tier`).toBeGreaterThan(0)
            }
         }
      }
   })

   it('blitz tier has exactly one normative item per domain and 20 items total', () => {
      const pool = questionsForTier('blitz')
      expect(pool).toHaveLength(20)
      for (const domain of domains) {
         const items = pool.filter((q) => q.domain === domain.id)
         expect(items, `${domain.id} should have exactly 1 blitz item`).toHaveLength(1)
         expect(items[0].layer, `${domain.id} blitz item should be normative`).toBe('normative')
      }
   })

})

describe('labels', () => {
   it('has no duplicate label ids', () => {
      expect(new Set(labels.map((l) => l.id)).size).toBe(labels.length)
   })

   it('every label centroid has exactly the known axis keys with finite in-range values', () => {
      const axisIds = axes.map((a) => a.id)
      const axisIdSet = new Set(axisIds)
      for (const label of labels) {
         const centroidIds = Object.keys(label.centroid)
         expect(new Set(centroidIds), `${label.id} centroid keys differ from axes`).toEqual(axisIdSet)
         for (const axisId of centroidIds) {
            const value = label.centroid[axisId]
            expect(Number.isFinite(value), `${label.id}/${axisId} centroid is not finite`).toBe(true)
            expect(value, `${label.id}/${axisId} centroid is below -1`).toBeGreaterThanOrEqual(-1)
            expect(value, `${label.id}/${axisId} centroid is above 1`).toBeLessThanOrEqual(1)
         }
      }
   })

   it('every centroid covers every axis', () => {
      const axisIds = axes.map((a) => a.id)
      for (const label of labels) {
         for (const axisId of axisIds) {
            expect(label.centroid[axisId], `${label.id} is missing a centroid value for ${axisId}`).toBeTypeOf('number')
         }
      }
   })

   it('every label declares a non-empty subfamily within its family', () => {
      for (const label of labels) {
         expect(typeof label.subfamily, `${label.id} is missing a subfamily`).toBe('string')
         expect((label.subfamily ?? '').length, `${label.id} has an empty subfamily`).toBeGreaterThan(0)
      }
   })

   it('subTheories, if present, must be a string[]', () => {
      for (const label of labels) {
         if (label.subTheories !== undefined) {
            expect(Array.isArray(label.subTheories), `${label.id}: subTheories must be an array`).toBe(true)
            for (const st of label.subTheories) {
               expect(typeof st, `${label.id}: subTheories entry "${String(st)}" is not a string`).toBe('string')
            }
         }
      }
   })

   it('ethicalTheory, if present, must be a string[]', () => {
      for (const label of labels) {
         if (label.ethicalTheory !== undefined) {
            expect(Array.isArray(label.ethicalTheory), `${label.id}: ethicalTheory must be an array`).toBe(true)
            for (const et of label.ethicalTheory) {
               expect(typeof et, `${label.id}: ethicalTheory entry "${String(et)}" is not a string`).toBe('string')
            }
         }
      }
   })

   it('layer-specific philosophy arrays are subsets of philosophies', () => {
      for (const label of labels) {
         const philosophies = label.philosophies ?? []
         const sets: [string, string[] | undefined][] = [
            ['normativePhilosophies', label.normativePhilosophies],
            ['descriptivePhilosophies', label.descriptivePhilosophies],
            ['prescriptivePhilosophies', label.prescriptivePhilosophies],
         ]
         for (const [field, arr] of sets) {
            if (arr !== undefined) {
               expect(Array.isArray(arr), `${label.id}: ${field} must be an array`).toBe(true)
               for (const entry of arr) {
                  expect(philosophies.includes(entry), `${label.id}: ${field} "${entry}" not found in philosophies`).toBe(true)
               }
            }
         }
      }
   })

   it('all philosophies are classified into at least one layer', () => {
      for (const label of labels) {
         const philosophies = label.philosophies ?? []
         const normative = label.normativePhilosophies ?? []
         const descriptive = label.descriptivePhilosophies ?? []
         const prescriptive = label.prescriptivePhilosophies ?? []

         for (const p of philosophies) {
            const isClassified =
               normative.includes(p) ||
               descriptive.includes(p) ||
               prescriptive.includes(p)
            expect(
               isClassified,
               `${label.id}: philosophy "${p}" is not classified in normativePhilosophies, descriptivePhilosophies, or prescriptivePhilosophies`
            ).toBe(true)
         }
      }
   })

   it('no label alias matches the name of another label', () => {
      const allNames = new Set(labels.map((l) => l.name.toLowerCase()))
      for (const label of labels) {
         const aliases = label.aliases ?? []
         for (const alias of aliases) {
            const aliasLower = alias.toLowerCase()
            if (allNames.has(aliasLower)) {
               const otherLabel = labels.find((l) => l.name.toLowerCase() === aliasLower)!
               if (otherLabel.id !== label.id) {
                  expect.fail(
                     `${label.id} has alias "${alias}" which is the name of another label (${otherLabel.id})`
                  )
               }
            }
         }
      }
   })

   it('philosophyInfluences entries have valid structure and axis references', () => {
      const validAxisIds = new Set(axes.map((a) => a.id))
      for (const label of labels) {
         const influences = label.philosophyInfluences
         if (influences === undefined) continue
         expect(Array.isArray(influences), `${label.id}: philosophyInfluences must be an array`).toBe(true)
         for (let i = 0; i < influences.length; i++) {
            const entry = influences[i]
            expect(typeof entry.philosophy, `${label.id}: philosophyInfluences[${i}] philosophy is not a string`).toBe('string')
            expect(typeof entry.description, `${label.id}: philosophyInfluences[${i}] description is not a string`).toBe('string')
            expect(Array.isArray(entry.affectedAxes), `${label.id}: philosophyInfluences[${i}] affectedAxes must be an array`).toBe(true)
            for (const axisId of entry.affectedAxes) {
               expect(validAxisIds.has(axisId), `${label.id}: philosophyInfluences[${i}] references unknown axis "${axisId}"`).toBe(true)
            }
         }
      }
   })

   it('keeps label portrayal copy descriptive rather than slogan-like', () => {
      const disallowedPatterns = [
         /restore national greatness/i,
         /natural order/i,
         /demanding total subordination/i,
         /supreme loyalty/i,
      ]

      for (const label of labels) {
         const copy = [
            label.description,
            ...(label.philosophyInfluences?.map((influence) => influence.description) ?? []),
         ].join(' ')

         for (const pattern of disallowedPatterns) {
            expect(copy, `${label.id} uses loaded portrayal phrase ${pattern}`).not.toMatch(pattern)
         }
      }
   })

   it('does not reduce broad philosophies to one label-specific use case', () => {
      const antiImperialism = labels.find((label) => label.id === 'anti-imperialism')
      const socialism = antiImperialism?.philosophyInfluences?.find((influence) => influence.philosophy === 'Socialism')

      expect(socialism?.description).toMatch(/social ownership/i)
      expect(socialism?.description).not.toMatch(/driving force behind imperial expansion/i)
   })
})


