import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { labels } from './labels'

const reviewLedger = readFileSync(
   'docs/ideology-label-editorial-review-2026-08.md',
   'utf8',
)

const revisedCopyExpectations: Array<[string, RegExp]> = [
   ['right-wing-populism', /often combining majoritarian or extra-institutional mobilization/i],
   ['world-federalism', /democratic federal layer of world government/i],
   ['indigenism', /Indigenous peoples.*rights, sovereignty, land and cultural continuity/i],
   ['bioregionalism', /place-based governance, local resilience/i],
   ['religious-nationalism', /Fuses national identity with a particular religious tradition/i],
   ['progressivism', /variants ranging from expert-led administration to participatory/i],
   ['national-socialism', /The Nazi ideology/i],
   ['stirnerism', /Centers Max Stirner’s philosophy of egoism/i],
   ['bright-green-environmentalism', /sometimes market mechanisms/i],
   ['georgism', /historic “single tax” is one formulation/i],
   ['internationalism', /Internationalism is broader than cosmopolitanism/i],
   ['dataism', /central lens for value and governance/i],
   ['singularitarianism', /future-oriented movement/i],
   ['traditional-monarchist', /positions differ on popular sovereignty/i],
   ['cultural-populism', /frames political conflict through cultural identity/i],
   ['transhumanism', /broad family of arguments/i],
   ['political-islam', /not a synonym for Islam/i],
   ['radical-centrism', /broad and contested political style/i],
]

describe('label editorial review', () => {
   it('tracks every current label in the dated review ledger', () => {
      expect(labels).toHaveLength(117)
      for (const label of labels) {
         expect(reviewLedger, `${label.id} is missing from the review ledger`).toContain(`| ${label.id} |`)
      }
   })

   it('guards the scope corrections made to high-risk or overbroad labels', () => {
      for (const [labelId, expectedDescription] of revisedCopyExpectations) {
         const label = labels.find((candidate) => candidate.id === labelId)
         expect(label, `${labelId} must exist`).toBeDefined()
         const copy = `${label!.description} ${label!.usageNote ?? ''} ${label!.cautionNote ?? ''}`
         expect(copy, `${labelId} copy regressed`).toMatch(expectedDescription)
      }
   })

   it('records the intended number of copy revisions', () => {
      const revisedRows = reviewLedger.match(/^\| [^|]+ \| [^|]+ \| Revised \|/gm) ?? []
      expect(revisedRows).toHaveLength(revisedCopyExpectations.length)
   })
})
