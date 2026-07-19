import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { labels } from '../data/labels'
import { questions } from '../data/questions'
import { allCalibrationFixtures } from './calibration.fixtures'
import { buildResultProfile } from './index'

const ALL_SCORABLE = questions

/**
 * End-to-end archetype -> nearest-label sweep. The synthetic answers are built
 * from centroid magnitude, so this file separates two contracts:
 * 1. Reflexivity: each label's own centroid projection must remain close to
 *    that label, even if a dense neighbor ranks first.
 * 2. Debt snapshot: current non-#1 matches are recorded as unresolved
 *    discriminator debt against the 20% Phase 2 target, not as success.
 *
 * Snapshot margins were recorded under the former axis-count-compressed fit
 * formula. Assertions convert corrected fit margins back to that legacy scale
 * so this PR changes display calibration without erasing discriminator debt.
 */
const NEAR_TIE_DEBT_SNAPSHOT: Record<string, { tiesWith: string | string[]; maxMargin: number }> = {
   'egalitarian-statist': { tiesWith: 'anti-imperialism', maxMargin: 0.002 },
   'decentralist-market-skeptic-of-state': { tiesWith: 'mutualist', maxMargin: 0.001 },
   'anarcho-capitalist': { tiesWith: 'decentralist-market-skeptic-of-state', maxMargin: 0.004 },
   'social-democrat': { tiesWith: 'universal-basic-income', maxMargin: 0.002 },
   'council-communist': { tiesWith: 'syndicalist', maxMargin: 0.002 },
   'anarcho-communist': { tiesWith: 'syndicalist', maxMargin: 0.003 },
   'minarchist': { tiesWith: 'classical-liberalism', maxMargin: 0.005 },
   'absolute-monarchist': { tiesWith: 'theocrat', maxMargin: 0.007 },
   'neoliberalism': { tiesWith: 'radical-centrism', maxMargin: 0.005 },
   'social-liberalism': { tiesWith: 'georgism', maxMargin: 0.001 },
   'individualist-anarchism': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.001 },
   'anarcho-primitivism': { tiesWith: 'deep-ecology', maxMargin: 0.001 },
   'maoism': { tiesWith: 'revolutionary-collectivist', maxMargin: 0.004 },
   'world-federalism': { tiesWith: 'multiculturalism', maxMargin: 0.009 },
   'guild-socialism': { tiesWith: 'anti-imperialism', maxMargin: 0.008 },
   'bioregionalism': { tiesWith: 'anti-imperialism', maxMargin: 0.002 },
   'eco-authoritarianism': { tiesWith: 'fourth-theory', maxMargin: 0.001 },
   'religious-nationalism': { tiesWith: 'hindutva', maxMargin: 0.009 },
   'zionism': { tiesWith: 'expansionist-nationalism', maxMargin: 0.009 },
   'national-bolshevism': { tiesWith: 'fourth-theory', maxMargin: 0.006 },
   'strasserism': { tiesWith: 'theocrat', maxMargin: 0.003 },
   'integralism': { tiesWith: 'theocrat', maxMargin: 0.012 },
   'democratic-confederalism': { tiesWith: 'libertarian-socialism', maxMargin: 0.006 },
   'paleoconservatism': { tiesWith: 'distributism', maxMargin: 0.004 },
   'one-nation-conservatism': { tiesWith: 'cultural-populism', maxMargin: 0.003 },
   'islamic-democracy': { tiesWith: 'cultural-populism', maxMargin: 0.006 },
   'liquid-democracy': { tiesWith: 'regionalism', maxMargin: 0.008 },
   'juche': { tiesWith: 'fourth-theory', maxMargin: 0.012 },
   'techno-anarchism': { tiesWith: 'mutualist', maxMargin: 0.001 },
   'progressivism': { tiesWith: 'universal-basic-income', maxMargin: 0.002 },
   'national-socialism': { tiesWith: 'fourth-theory', maxMargin: 0.001 },
   'utopian-socialism': { tiesWith: 'universal-basic-income', maxMargin: 0.003 },
   'libertarian-municipalism': { tiesWith: 'platformism', maxMargin: 0.002 },
   'anarcha-feminism': { tiesWith: 'queer-anarchism', maxMargin: 0.004 },
   'anarcho-syndicalism': { tiesWith: 'platformism', maxMargin: 0.001 },
   'fiscal-conservatism': { tiesWith: 'liberal-conservatism', maxMargin: 0.005 },
   'national-conservatism': { tiesWith: 'political-islam', maxMargin: 0.003 },
   'bright-green-environmentalism': { tiesWith: 'georgism', maxMargin: 0.004 },
   'fundamentalist-theocracy': { tiesWith: 'theocrat', maxMargin: 0.001 },
   'social-investment-state': { tiesWith: 'universal-basic-income', maxMargin: 0.003 },
}

const NEAR_TIE_TARGET_RATE = 0.2

function expectedDebtFor(labelId: string): string[] {
   const debt = NEAR_TIE_DEBT_SNAPSHOT[labelId]
   if (!debt) return []
   return Array.isArray(debt.tiesWith) ? debt.tiesWith : [debt.tiesWith]
}

function collectCurrentNearTies(): Array<{ target: string; top: string; margin: number }> {
   return allCalibrationFixtures.flatMap((fixture) => {
      const target = fixture.expectedLabelIds[0]
      const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)
      const top = result.nearestLabels[0]
      const own = result.nearestLabels.find((l) => l.labelId === target)
      if (!own || top.labelId === target) return []
      return [{ target, top: top.labelId, margin: top.fit - own.fit }]
   })
}

function legacyEquivalentMargin(margin: number): number {
   return margin / Math.sqrt(axes.length)
}

function nearTieGate() {
   return {
      targetRate: NEAR_TIE_TARGET_RATE,
      maxAllowedExceptions: Math.floor(labels.length * NEAR_TIE_TARGET_RATE),
      snapshotCount: Object.keys(NEAR_TIE_DEBT_SNAPSHOT).length,
      currentNearTies: collectCurrentNearTies(),
   }
}


describe('archetype -> nearest-label sweep', () => {
   for (const fixture of allCalibrationFixtures) {
      const target = fixture.expectedLabelIds[0]
      it(`${target} resolves to itself`, () => {
         const result = buildResultProfile(ALL_SCORABLE, fixture.answers, axes, labels)
         const nearest = result.nearestLabels
         const top = nearest[0]
         const own = nearest.find((l) => l.labelId === target)

         // The target must at least appear among the nearest matches.
         expect(own, `${target} not in nearest labels`).toBeDefined()

         const margin = top.fit - (own!.fit ?? 0)
         expect(legacyEquivalentMargin(margin), `${target} is a distant outlier from itself`).toBeLessThanOrEqual(0.07)
      })
   }

   it('every label has a calibration archetype (no unverified labels)', () => {
      const covered = new Set(allCalibrationFixtures.map((f) => f.expectedLabelIds[0]))
      const uncovered = labels.map((l) => l.id).filter((id) => !covered.has(id))
      expect(uncovered, `labels with no archetype sweep coverage: ${uncovered.join(', ')}`).toEqual([])
   })

   it('reports the current near-tie gate reproducibly without enforcing Phase 2 early', () => {
      const gate = nearTieGate()

      expect(gate.targetRate).toBe(0.2)
      expect(gate.maxAllowedExceptions).toBe(23)
      expect(gate.currentNearTies).toHaveLength(40)
      expect(gate.currentNearTies.length).toBeGreaterThan(gate.maxAllowedExceptions)
      expect(gate.snapshotCount).toBe(40)
      for (const nearTie of gate.currentNearTies) {
         const debt = NEAR_TIE_DEBT_SNAPSHOT[nearTie.target]
         expect(debt, `${nearTie.target} is missing from the debt snapshot`).toBeDefined()
         expect(expectedDebtFor(nearTie.target)).toContain(nearTie.top)
         expect(legacyEquivalentMargin(nearTie.margin)).toBeLessThanOrEqual(debt.maxMargin)
      }
   })
})
