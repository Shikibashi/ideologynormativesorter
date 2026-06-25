import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { labels } from '../data/labels'
import { questions } from '../data/questions'
import { allCalibrationFixtures } from './calibration.fixtures'
import { buildResultProfile } from './index'

const ALL_SCORABLE = questions
const labelById = new Map(labels.map((l) => [l.id, l]))

describe('familyTree output', () => {
   it('groups every nearest label under its own label.family', () => {
      const fixture = allCalibrationFixtures[0]
      const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)

      expect(result.familyTree).toBeDefined()
      const tree = result.familyTree!

      // Every nearest label must appear exactly once, under the family declared on its label.
      const flattened = Object.entries(tree).flatMap(([family, matches]) =>
         matches.map((m) => ({ family, labelId: m.labelId })),
      )
      expect(flattened.length).toBe(result.nearestLabels.length)

      for (const { family, labelId } of flattened) {
         const label = labelById.get(labelId)
         expect(label, `nearest label ${labelId} must exist`).toBeDefined()
         expect(family, `${labelId} grouped under wrong family`).toBe(label!.family)
      }
   })

   it('uses only family names that exist on real labels (no orphan singleton families)', () => {
      const realFamilies = new Set(labels.map((l) => l.family))
      for (const fixture of allCalibrationFixtures) {
         const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)
         for (const family of Object.keys(result.familyTree ?? {})) {
            expect(realFamilies.has(family), `familyTree key ${family} is not a declared label family`).toBe(true)
         }
      }
   })

   it('preserves nearest-label ordering within each family group', () => {
      const fixture = allCalibrationFixtures.find((f) => f.expectedLabelIds[0] === 'market-liberal') ?? allCalibrationFixtures[0]
      const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)
      for (const matches of Object.values(result.familyTree ?? {})) {
         for (let i = 1; i < matches.length; i++) {
            expect(matches[i - 1].fit).toBeGreaterThanOrEqual(matches[i].fit)
         }
      }
   })
})

describe('familySubtree (two-level) output', () => {
   it('groups every nearest label under family -> subfamily matching its label fields', () => {
      const fixture = allCalibrationFixtures[0]
      const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)

      expect(result.familySubtree).toBeDefined()
      const tree = result.familySubtree!

      const flattened = Object.entries(tree).flatMap(([family, subfamilies]) =>
         Object.entries(subfamilies).flatMap(([subfamily, matches]) =>
            matches.map((m) => ({ family, subfamily, labelId: m.labelId })),
         ),
      )
      // Lossless: every nearest label appears exactly once in the two-level tree.
      expect(flattened.length).toBe(result.nearestLabels.length)

      for (const { family, subfamily, labelId } of flattened) {
         const label = labelById.get(labelId)!
         expect(family).toBe(label.family)
         expect(subfamily).toBe(label.subfamily ?? label.family)
      }
   })

   it('nests subfamilies under their parent family for every fixture', () => {
      for (const fixture of allCalibrationFixtures) {
         const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)
         for (const [family, subfamilies] of Object.entries(result.familySubtree ?? {})) {
            for (const matches of Object.values(subfamilies)) {
               for (const m of matches) {
                  expect(labelById.get(m.labelId)!.family).toBe(family)
               }
            }
         }
      }
   })
})
