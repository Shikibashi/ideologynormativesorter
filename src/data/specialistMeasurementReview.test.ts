import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { primaryScoringLabels, PROVISIONAL_SPECIALIST_LABEL_IDS, roleForLabel, specialistModuleByLabel } from './labelTaxonomy'
import { specialistMeasurementReviews, specialistMeasurementReviewById } from './specialistMeasurementReview'

const sensitiveCompoundBoundary = readFileSync('docs/sensitive-compound-output-boundary-2026-08.md', 'utf8')

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
         'candidate-module',
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
      for (const labelId of ['islamic-democracy', 'hindutva', 'zionism', 'theocrat'] as const) {
         expect(specialistModuleByLabel[labelId]).toBe('religious-national-politics-module')
         expect(PROVISIONAL_SPECIALIST_LABEL_IDS).not.toContain(labelId)
      }
   })

   it('records the newly added family-anchor candidates in their experimental waves', () => {
      expect(specialistModuleByLabel['ecomodernist']).toBe('green-morphology-module')
      expect(specialistModuleByLabel['guild-socialism']).toBe('socialist-families-module')
      expect(specialistModuleByLabel['religious-nationalism']).toBe('religious-national-politics-module')
      expect(specialistModuleByLabel['christian-reconstructionism']).toBeUndefined()
      expect(PROVISIONAL_SPECIALIST_LABEL_IDS).toContain('christian-reconstructionism')
      expect(specialistModuleByLabel['fundamentalist-theocracy']).toBeUndefined()
      expect(roleForLabel('fundamentalist-theocracy')).toBe('context')
   })

   it('keeps mutualist lineage claims outside the four-construct family-level module', () => {
      const anarchistFamilies = specialistMeasurementReviewById.get('anarchist-families')
      expect(anarchistFamilies?.measurementCaution).toMatch(/Proudhonian mutualism.*Tuckerite.*C4SS-adjacent/i)
      expect(anarchistFamilies?.nextGate).toMatch(/property or possession claims.*anti-rent.*mutual-credit/i)
   })

   it('requires every review entry to name constructs and a next gate', () => {
      for (const review of specialistMeasurementReviews) {
         expect(review.constructs.length, `${review.id} has no constructs`).toBeGreaterThanOrEqual(3)
         expect(review.nextGate.length, `${review.id} has no next gate`).toBeGreaterThan(40)
      }
   })

   it('records respondent validation as the gate after the v5 breadth modules exist', () => {
      const religiousConstitutionalism = specialistMeasurementReviewById.get('religious-constitutionalism')
      const religiousNationalVariants = specialistMeasurementReviewById.get('religious-national-variants')
      const technologyGovernance = specialistMeasurementReviewById.get('technology-governance-variants')

      expect(religiousConstitutionalism?.constructs).toEqual(expect.arrayContaining([
         'Islamic public-law framing',
         'interpretive pluralism',
      ]))
      expect(religiousConstitutionalism?.labelIds).toContain('theocrat')
      expect(religiousConstitutionalism?.measurementCaution).toMatch(/two-item.*final religious authority/i)
      expect(religiousConstitutionalism?.nextGate).toMatch(/Pool respondent data.*construct-matched module/i)
      expect(religiousNationalVariants?.constructs).toEqual(expect.arrayContaining([
         'Hindu civilizational belonging',
         'Jewish national self-determination',
      ]))
      expect(religiousNationalVariants?.constructs).toContain('religious-national fusion')
      expect(religiousNationalVariants?.nextGate).toMatch(/Pool respondent data.*v10 module/i)
      expect(technologyGovernance?.nextGate).toMatch(/v5 technology-governance module/i)
   })

   it('records the defining constructs needed before sensitive compound outputs can be measured', () => {
      const compounds = specialistMeasurementReviewById.get('sensitive-compound-outputs')

      expect(compounds?.status).toBe('candidate-module')
      expect(compounds?.constructs).toEqual(expect.arrayContaining([
         'palingenetic national rebirth and fascist mobilization',
         'welfare or service access restricted by a named in-group boundary',
         'ecological enforcement that overrides ordinary democratic or rights constraints',
         'theonomic biblical civil-law authority',
         'literalist or fundamentalist scriptural authority in coercive law',
      ]))
   })

  it('publishes the sensitive-compound boundary and cohort separation', () => {
    expect(sensitiveCompoundBoundary).toContain('`religious-national-fusion`')
    expect(sensitiveCompoundBoundary).toContain('`community-2026-v3`')
    expect(sensitiveCompoundBoundary).toContain('palingenetic')
    expect(sensitiveCompoundBoundary).toMatch(/theonomic biblical civil-law authority/i)
    expect(sensitiveCompoundBoundary).toMatch(/final religious legal authority/i)
  })
})
