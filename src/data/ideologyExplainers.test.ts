import { describe, expect, it } from 'vitest'
import type { IdeologyLabel } from '../types'
import { axes } from './axes'
import {
   CURATED_IDEOLOGY_LAYER_SUMMARIES,
   getIdeologyLayerSummary,
   getIdeologyTermDefinitions,
   LAYER_EXPLAINERS,
} from './ideologyExplainers'
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
         ['council-communist', /workers’ councils/],
         ['syndicalist', /worker-run unions and direct action/],
         ['anarcho-syndicalism', /anti-state aims to syndicalist labor organization/],
         ['platformism', /theoretical and tactical unity/],
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

      expect(getIdeologyLayerSummary(label, axes, 'normative')).toContain('does not currently provide a curated summary')
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

   it('keeps narrowed catalog labels separate from broader family definitions', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const corporatism = getIdeologyTermDefinitions(byId.get('corporatism')!)
      const islamicDemocracy = getIdeologyTermDefinitions(byId.get('islamic-democracy')!)

      expect(corporatism).toHaveLength(1)
      expect(corporatism[0]).toMatch(/State corporatism/)
      expect(corporatism[0]).toMatch(/distinct from democratic societal/)
      expect(islamicDemocracy).toHaveLength(1)
      expect(islamicDemocracy[0]).toMatch(/electoral government, constitutional limits/)
      expect(islamicDemocracy[0]).not.toMatch(/broad family of projects/)
   })

   it('distinguishes council, syndicalist, and platformist organization instead of showing only parent-family guides', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['council-communist', /rather than parliament or a vanguard party/],
         ['syndicalist', /institutional basis for workers’ control afterward/],
         ['anarcho-syndicalism', /abolish capitalism and the state/],
         ['platformism', /collective responsibility, and federalism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
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

   it('uses curated influences deterministically instead of converting centroid poles into doctrine', () => {
      const label = labels.find((candidate) => candidate.id === 'anarcho-capitalist')!
      const forward = getIdeologyLayerSummary(label, axes, 'normative')
      const reversed = getIdeologyLayerSummary(label, [...axes].reverse(), 'normative')

      expect(forward).toBe(reversed)
      expect(forward).toContain('self-ownership and voluntary association')
      expect(forward).not.toContain('strongest distinctions')
      expect(forward).not.toContain('equally strong positions omitted')
   })

   it('uses explicit layer-keyed copy where general influence notes would conflate values, beliefs, and strategy', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))

      for (const [id, summaries] of Object.entries(CURATED_IDEOLOGY_LAYER_SUMMARIES)) {
         const label = byId.get(id)
         expect(label, `${id} must exist`).toBeDefined()
         for (const [layer, expected] of Object.entries(summaries)) {
            expect(getIdeologyLayerSummary(label!, axes, layer as 'normative' | 'descriptive' | 'prescriptive')).toContain(expected)
         }
      }

      expect(getIdeologyLayerSummary(byId.get('national-socialism')!, axes, 'normative')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('technocratic-centralist')!, axes, 'descriptive')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('theocrat')!, axes, 'prescriptive')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('libertarian-municipalism')!, axes, 'prescriptive')).not.toMatch(/does not imply/i)
   })

   it('replaces false missing-summary fallbacks where label metadata already states the layer doctrine', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, 'normative' | 'descriptive' | 'prescriptive', RegExp]> = [
         ['ecomodernist', 'normative', /human flourishing and ecological protection/],
         ['anarcho-capitalist', 'prescriptive', /competitive private provision of law/],
         ['market-socialist', 'descriptive', /market pricing and competition/],
         ['christian-democrat', 'prescriptive', /subsidiarity, social-market institutions/],
         ['republicanism', 'prescriptive', /checks on arbitrary power/],
         ['distributism', 'prescriptive', /dispersing productive property/],
         ['world-federalism', 'prescriptive', /federal layer of world government/],
         ['radical-democracy', 'prescriptive', /beyond periodic elections/],
         ['christian-socialism', 'prescriptive', /social ownership, economic democracy/],
         ['green-capitalism', 'normative', /ecological protection alongside human prosperity/],
         ['green-capitalism', 'prescriptive', /carbon pricing, renewable-energy markets/],
         ['corporatism', 'prescriptive', /under strong state direction to mediate represented interests/],
         ['liberal-feminism', 'prescriptive', /legal reform, equal rights/],
      ]

      for (const [id, layer, expected] of cases) {
         const summary = getIdeologyLayerSummary(byId.get(id)!, axes, layer)
         expect(summary, `${id}/${layer}`).toMatch(expected)
         expect(summary, `${id}/${layer}`).not.toMatch(/does not currently provide/i)
      }
   })

   it('does not invent unrelated layer doctrine for broad or cross-cutting labels', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, 'normative' | 'descriptive' | 'prescriptive', RegExp]> = [
         ['multiculturalism', 'normative', /own nation/i],
         ['panarchism', 'prescriptive', /state action and public provision/i],
         ['eco-authoritarianism', 'prescriptive', /exit into private/i],
         ['transhumanism', 'prescriptive', /electoral channels/i],
         ['voluntaryism', 'prescriptive', /the state is illegitimate/i],
      ]

      for (const [id, layer, forbidden] of cases) {
         expect(getIdeologyLayerSummary(byId.get(id)!, axes, layer), `${id}/${layer}`).not.toMatch(forbidden)
      }

      expect(getIdeologyLayerSummary(byId.get('voluntaryism')!, axes, 'prescriptive')).toMatch(/voluntarily funded minimal state/i)
   })
})
