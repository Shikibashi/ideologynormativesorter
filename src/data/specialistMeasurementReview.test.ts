import { describe, expect, it } from 'vitest'
import { primaryScoringLabels, PROVISIONAL_SPECIALIST_LABEL_IDS, roleForLabel, specialistModuleByLabel } from './labelTaxonomy'
import { specialistMeasurementReviews, specialistMeasurementReviewById } from './specialistMeasurementReview'

describe('specialist measurement review registry', () => {
   it('records focused and experimental module work separately', () => {
      expect(specialistMeasurementReviews.map((review) => review.status)).toEqual([
         'focused-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
         'experimental-module',
      ])
      expect(specialistMeasurementReviewById.get('identity-sovereignty')?.moduleId).toBe('identity-sovereignty-module')
      expect(specialistMeasurementReviewById.get('identity-sovereignty')?.relatedTraditionIds).toEqual([
         'black-nationalism',
         'pan-africanism',
      ])
   })

   it('keeps every registry label out of primary scoring unless it is already a primary label', () => {
      const primaryIds = new Set(primaryScoringLabels.map((label) => label.id))

      for (const review of specialistMeasurementReviews) {
         for (const labelId of review.labelIds) {
            if (roleForLabel(labelId) === 'specialist' || roleForLabel(labelId) === 'modifier') {
               expect(primaryIds.has(labelId), `${labelId} leaked into primary scoring`).toBe(false)
            }
         }
      }
   })

   it('keeps experimental specialist labels provisional outside ordinary scoring', () => {
      expect(PROVISIONAL_SPECIALIST_LABEL_IDS.length).toBeLessThan(49)
      for (const labelId of ['islamic-democracy', 'hindutva', 'zionism'] as const) {
         expect(specialistModuleByLabel[labelId]).toBe('religious-national-politics-module')
         expect(PROVISIONAL_SPECIALIST_LABEL_IDS).not.toContain(labelId)
      }
   })

   it('requires every review entry to name constructs and a next gate', () => {
      for (const review of specialistMeasurementReviews) {
         expect(review.constructs.length, `${review.id} has no constructs`).toBeGreaterThanOrEqual(3)
         expect(review.nextGate.length, `${review.id} has no next gate`).toBeGreaterThan(40)
      }
   })
})
