import { describe, expect, it } from 'vitest'
import type { IdeologyLabel } from '../types'
import { axes } from './axes'
import { getIdeologyLayerSummary, getIdeologyTermDefinitions, LAYER_EXPLAINERS } from './ideologyExplainers'
import { labels } from './labels'

describe('ideology explainers', () => {
   it('defines the three layers without collapsing them into one political preference', () => {
      expect(LAYER_EXPLAINERS.normative.measurement).toMatch(/morally legitimate/)
      expect(LAYER_EXPLAINERS.descriptive.measurement).toMatch(/true in the world/)
      expect(LAYER_EXPLAINERS.prescriptive.measurement).toMatch(/policies, institutions, or strategies/)
      expect(LAYER_EXPLAINERS.normative.label).toMatch(/Foundational values/)
      expect(LAYER_EXPLAINERS.prescriptive.label).toMatch(/Applied policy/)
      expect(LAYER_EXPLAINERS.normative.measurement).not.toBe(LAYER_EXPLAINERS.prescriptive.measurement)
   })

   it('produces a readable layer explanation for every catalog label', () => {
      for (const label of labels) {
         for (const layer of ['normative', 'descriptive', 'prescriptive'] as const) {
            const summary = getIdeologyLayerSummary(label, axes, layer)
            expect(summary, `${label.id}/${layer} is missing an explainer`).toMatch(/this layer asks/i)
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

   it('does not infer term guides from rejected or comparator traditions in prose', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))

      expect(getIdeologyTermDefinitions(byId.get('national-traditionalist')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Fascism/)]))
      expect(getIdeologyTermDefinitions(byId.get('fascist-authoritarian')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism/)]))
      expect(getIdeologyTermDefinitions(byId.get('social-conservatism')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Progressivism/)]))
      expect(getIdeologyTermDefinitions(byId.get('national-bolshevism')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism|Socialism/)]))
      expect(getIdeologyTermDefinitions(byId.get('fourth-theory')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism|Fascism/)]))
   })

   it('keeps National Socialism separate from the generic socialism definition', () => {
      const label = labels.find((candidate) => candidate.id === 'national-socialism')!
      const definitions = getIdeologyTermDefinitions(label)

      expect(definitions).toHaveLength(1)
      expect(definitions[0]).toMatch(/Nazi ideology/)
      expect(definitions[0]).toMatch(/does not make it socialism/)
   })

   it('defines theocracy and high-confusion labels directly from stable ids', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directCases: Array<[string, RegExp]> = [
         ['fundamentalist-theocracy', /Theocratic politics/],
         ['neoreactionary', /anti-democratic current/],
         ['distributism', /dispersed ownership/],
         ['deep-ecology', /nonhuman life/],
         ['objectivism', /Ayn Rand/],
         ['democratic-confederalism', /local assemblies/],
         ['libertarian-municipalism', /local assemblies/],
      ]

      for (const [id, expected] of directCases) {
         expect(getIdeologyTermDefinitions(byId.get(id)!)[0], id).toMatch(expected)
      }
   })

   it('includes cutoff ties deterministically instead of depending on axis order', () => {
      const label = labels.find((candidate) => candidate.id === 'anarcho-capitalist')!
      const forward = getIdeologyLayerSummary(label, axes, 'normative')
      const reversed = getIdeologyLayerSummary(label, [...axes].reverse(), 'normative')

      expect(forward).toBe(reversed)
      expect(forward).toContain('authority requires constant justification')
      expect(forward).toContain('private property rights are strongly legitimate')
      expect(forward).toContain('liberty means non-interference with personal choice')
   })
})
