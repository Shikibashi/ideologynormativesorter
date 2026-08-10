import { describe, expect, it } from 'vitest'
import type { IdeologyLabel } from '../types'
import { axes } from './axes'
import { getIdeologyLayerSummary, getIdeologyTermDefinitions, LAYER_EXPLAINERS } from './ideologyExplainers'
import { labels } from './labels'

describe('ideology explainers', () => {
   it('defines the three layers without collapsing them into one political preference', () => {
      expect(LAYER_EXPLAINERS.normative.measurement).toMatch(/morally legitimate/)
      expect(LAYER_EXPLAINERS.descriptive.measurement).toMatch(/true in the world/)
      expect(LAYER_EXPLAINERS.prescriptive.measurement).toMatch(/should be done/)
      expect(LAYER_EXPLAINERS.normative.measurement).not.toBe(LAYER_EXPLAINERS.prescriptive.measurement)
   })

   it('produces a readable layer explanation for every catalog label', () => {
      for (const label of labels) {
         for (const layer of ['normative', 'descriptive', 'prescriptive'] as const) {
            const summary = getIdeologyLayerSummary(label, axes, layer)
            expect(summary, `${label.id}/${layer} is missing an explainer`).toMatch(/This layer asks/)
            expect(summary.length, `${label.id}/${layer} explainer is too long`).toBeLessThanOrEqual(700)
         }
      }
   })

   it('uses the intended definitions for high-confusion ideology terms', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, RegExp]> = [
         ['right-wing-populism', /thin-centered/],
         ['zionism', /Jewish national self-determination/],
         ['accelerationism', /left, right, and technology-centered/],
         ['fascist-authoritarian', /nationalist politics of national rebirth/],
         ['national-socialism', /Nazi ideology of racial hierarchy/],
         ['indigenism', /Indigenous self-determination/],
         ['political-islam', /broad family of projects/],
         ['transhumanism', /broad family of arguments/],
         ['dataism', /emerging techno-philosophical term/],
         ['world-federalism', /democratic federal layer/],
      ]

      for (const [id, expected] of cases) {
         const label = byId.get(id)
         expect(label, `${id} must exist`).toBeDefined()
         expect(getIdeologyTermDefinitions(label!)).toEqual(expect.arrayContaining([expect.stringMatching(expected)]))
      }
   })

   it('does not require a complete ideology to have a named philosophy in every layer', () => {
      const label: IdeologyLabel = {
         id: 'test-label',
         name: 'Test Label',
         family: 'test',
         description: 'A test label.',
         centroid: Object.fromEntries(axes.map((axis) => [axis.id, 0])),
      }

      expect(getIdeologyLayerSummary(label, axes, 'normative')).toContain('does not assign a separate named philosophical influence')
   })
})
