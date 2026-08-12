import { describe, expect, it } from 'vitest'
import { getIdeologyLabelSources, ideologyLabelSourceCatalog } from './labelSources'
import { labels } from './labels'
import { modifierScoringLabels, primaryScoringLabels, publicCatalogLabels, roleForLabel } from './labelTaxonomy'

describe('ideology label sources', () => {
   it('provides public definition or boundary sources for every scored label', () => {
      expect(primaryScoringLabels.length).toBeGreaterThanOrEqual(20)

      for (const label of primaryScoringLabels) {
         expect(label.sources?.length ?? 0, `${label.id} has no scored-label sources`).toBeGreaterThan(0)
         for (const source of label.sources ?? []) {
            expect(source.sourceId).toBeTruthy()
            expect(source.title).toBeTruthy()
            expect(source.url).toMatch(/^https:\/\//)
            expect(source.supports.length).toBeGreaterThan(0)
            expect(source.supports).toContain('definition')
            expect(source.supports).toContain('boundary')
            expect(source.supports.some((scope) => scope === 'normative' || scope === 'descriptive' || scope === 'prescriptive')).toBe(true)
            expect(source.note).not.toMatch(/validate.*(?:score|centroid)|prove.*(?:score|centroid)/i)
         }
      }
   })

   it('provides source coverage for every scored modifier', () => {
      for (const label of modifierScoringLabels) {
         expect(label.sources?.length ?? 0, `${label.id} has no modifier sources`).toBeGreaterThan(0)
         expect(label.sources?.some((source) => source.supports.includes('boundary')), `${label.id} has no boundary-scoped modifier source`).toBe(true)
      }
   })

   it('adds bespoke source coverage to the six high-priority labels', () => {
      const byId = new Map(publicCatalogLabels.map((label) => [label.id, label]))
      const expectations: Record<string, RegExp> = {
         corporatism: /cambridge-corporatism/,
         kemalism: /cambridge-kemalism/,
         'fiscal-conservatism': /sage-fiscal-conservatism/,
         ethnonationalist: /oxford-ethnonationalism/,
         'islamic-democracy': /cambridge-islamic-constitutionalism/,
         'fourth-theory': /springer-fourth-political-theory/,
      }

      for (const [labelId, sourceIdPattern] of Object.entries(expectations)) {
         const label = byId.get(labelId)
         expect(label, `${labelId} missing from public catalog`).toBeDefined()
         expect(label!.sources?.map((source) => source.sourceId).join(' ')).toMatch(sourceIdPattern)
      }

      expect(byId.get('corporatism')?.sources?.some((source) => source.supports.includes('normative'))).toBe(true)
      expect(byId.get('kemalism')?.sources?.some((source) => source.supports.includes('descriptive'))).toBe(true)
      expect(byId.get('fiscal-conservatism')?.sources?.some((source) => source.supports.includes('prescriptive'))).toBe(true)
      expect(byId.get('islamic-democracy')?.sources?.some((source) => source.supports.includes('boundary'))).toBe(true)
   })

   it('does not silently source unreviewed specialist labels as scored evidence', () => {
      const agorist = publicCatalogLabels.find((label) => label.id === 'agorist')
      expect(roleForLabel('agorist')).toBe('specialist')
      expect(agorist?.sources ?? []).toHaveLength(0)
      expect(getIdeologyLabelSources(labels.find((label) => label.id === 'agorist')!)).toHaveLength(0)
   })

   it('keeps the source catalog itself structurally valid', () => {
      expect(ideologyLabelSourceCatalog.length).toBeGreaterThan(10)
      expect(new Set(ideologyLabelSourceCatalog.map((source) => source.sourceId)).size).toBe(ideologyLabelSourceCatalog.length)
      expect(ideologyLabelSourceCatalog.every((source) => source.url.startsWith('https://'))).toBe(true)
   })

   it('keeps bespoke caution coverage focused on the requested ambiguous labels', () => {
      const targetedIds = [
         'technocratic-centralist',
         'geolibertarian',
         'market-socialist',
         'classical-liberalism',
         'ordoliberalism',
         'multiculturalism',
         'radical-democracy',
         'one-nation-conservatism',
         'democratic-confederalism',
         'liberal-feminism',
         'left-wing-nationalism',
         'agrarian-populism',
         'green-capitalism',
      ] as const
      const byId = new Map(labels.map((label) => [label.id, label]))

      for (const labelId of targetedIds) {
         const note = `${byId.get(labelId)?.usageNote ?? ''}${byId.get(labelId)?.cautionNote ?? ''}`
         expect(note.length, `${labelId} needs bespoke context`).toBeGreaterThan(30)
      }
   })
})
