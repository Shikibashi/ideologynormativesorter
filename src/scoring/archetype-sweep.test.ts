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
 */
const NEAR_TIE_DEBT_SNAPSHOT: Record<string, { tiesWith: string | string[]; maxMargin: number }> = {
   'egalitarian-statist': { tiesWith: 'anti-imperialism', maxMargin: 0.006 },
   'revolutionary-collectivist': { tiesWith: 'ecosocialist', maxMargin: 0.019 },
   'technocratic-centralist': { tiesWith: 'corporatism', maxMargin: 0.032 },
   'decentralist-market-skeptic-of-state': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.011 },
   'anarcho-capitalist': { tiesWith: 'decentralist-market-skeptic-of-state', maxMargin: 0.013 },
   'fascist-authoritarian': { tiesWith: 'theocrat', maxMargin: 0.008 },
   'council-communist': { tiesWith: 'anarcho-syndicalism', maxMargin: 0.019 },
   'syndicalist': { tiesWith: 'anarcho-syndicalism', maxMargin: 0.003 },
   'anarcho-communist': { tiesWith: 'anarcho-syndicalism', maxMargin: 0.02 },
   'minarchist': { tiesWith: 'bleeding-heart-libertarianism', maxMargin: 0.005 },
   'agorist': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.048 },
   'absolute-monarchist': { tiesWith: 'theocrat', maxMargin: 0.013 },
   'paleolibertarianism': { tiesWith: 'classical-liberalism', maxMargin: 0.006 },
   'objectivism': { tiesWith: 'minarchist', maxMargin: 0.014 },
   'individualist-anarchism': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.009 },
   'maoism': { tiesWith: 'revolutionary-collectivist', maxMargin: 0.017 },
   'trotskyism': { tiesWith: 'ecosocialist', maxMargin: 0.011 },
   'panarchism': { tiesWith: 'bleeding-heart-libertarianism', maxMargin: 0.01 },
   'world-federalism': { tiesWith: 'separatist-nationalism', maxMargin: 0.052 },
   'guild-socialism': { tiesWith: 'libertarian-socialism', maxMargin: 0.053 },
   'cyberocracy': { tiesWith: 'anti-imperialism', maxMargin: 0.017 },
   'bioregionalism': { tiesWith: 'libertarian-socialism', maxMargin: 0.0095 },
   'eco-authoritarianism': { tiesWith: 'fourth-theory', maxMargin: 0.048 },
   'religious-nationalism': { tiesWith: 'hindutva', maxMargin: 0.03 },
   'zionism': { tiesWith: 'expansionist-nationalism', maxMargin: 0.047 },
   'national-bolshevism': { tiesWith: 'fourth-theory', maxMargin: 0.042 },
   'strasserism': { tiesWith: 'theocrat', maxMargin: 0.055 },
   'integralism': { tiesWith: 'theocrat', maxMargin: 0.063 },
   'democratic-confederalism': { tiesWith: 'mutualist', maxMargin: 0.046 },
   'paleoconservatism': { tiesWith: 'national-traditionalist', maxMargin: 0.025 },
   'one-nation-conservatism': { tiesWith: 'political-islam', maxMargin: 0.011 },
   'islamic-democracy': { tiesWith: 'one-nation-conservatism', maxMargin: 0.015 },
   'liquid-democracy': { tiesWith: 'regionalism', maxMargin: 0.003 },
   'juche': { tiesWith: 'fourth-theory', maxMargin: 0.067 },
   'techno-anarchism': { tiesWith: 'mutualist', maxMargin: 0.036 },
   'national-socialism': { tiesWith: 'fourth-theory', maxMargin: 0.019 },
   'utopian-socialism': { tiesWith: 'universal-basic-income', maxMargin: 0.008 },
   'voluntaryism': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.048 },
   'stirnerism': { tiesWith: 'mutualist', maxMargin: 0.021 },
   'libertarian-municipalism': { tiesWith: 'platformism', maxMargin: 0.003 },
   'corporatism': { tiesWith: 'fourth-theory', maxMargin: 0.016 },
   'anarcha-feminism': { tiesWith: 'queer-anarchism', maxMargin: 0.018 },
   'anarcho-syndicalism': { tiesWith: 'platformism', maxMargin: 0.001 },
   'fiscal-conservatism': { tiesWith: 'liberal-conservatism', maxMargin: 0.013 },
   'social-conservatism': { tiesWith: 'political-islam', maxMargin: 0.003 },
   'national-conservatism': { tiesWith: 'political-islam', maxMargin: 0.004 },
   'bright-green-environmentalism': { tiesWith: 'georgism', maxMargin: 0.006 },
   'fundamentalist-theocracy': { tiesWith: 'theocrat', maxMargin: 0.021 },
   'christian-reconstructionism': { tiesWith: 'theocrat', maxMargin: 0.002 },
   'social-investment-state': { tiesWith: 'universal-basic-income', maxMargin: 0.011 },
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
      return [{ target, top: top.labelId, margin: top.confidence - own.confidence }]
   })
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

         const margin = top.confidence - (own!.confidence ?? 0)
         expect(margin, `${target} is a distant outlier from itself`).toBeLessThanOrEqual(0.07)
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
      expect(gate.currentNearTies).toHaveLength(50)
      expect(gate.currentNearTies.length).toBeGreaterThan(gate.maxAllowedExceptions)
      expect(gate.snapshotCount).toBe(50)
      for (const nearTie of gate.currentNearTies) {
         const debt = NEAR_TIE_DEBT_SNAPSHOT[nearTie.target]
         expect(debt, `${nearTie.target} is missing from the debt snapshot`).toBeDefined()
         expect(expectedDebtFor(nearTie.target)).toContain(nearTie.top)
         expect(nearTie.margin).toBeLessThanOrEqual(debt.maxMargin)
      }
   })
})
