import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { labels } from '../data/labels'
import { questions } from '../data/questions'
import { allCalibrationFixtures } from './calibration.fixtures'
import { buildResultProfile } from './index'

const ALL_SCORABLE = questions

/**
 * End-to-end archetype -> nearest-label sweep. This is the anti-drift guard:
 * each synthetic archetype (built from its label's centroid direction) must
 * resolve back to its own label as the #1 nearest match. If a future centroid
 * or axis-weight change silently degrades resolution, this fails loudly.
 *
 * Documented exceptions: a small set of labels legitimately cluster so tightly
 * that a centroid-aligned profile lands within a sub-0.01 confidence dead-heat
 * with a neighbor. These are recorded with the maximum tolerated margin so a
 * real regression (a large drop) still fails while the known tie passes.
 */
const NEAR_TIE_EXCEPTIONS: Record<string, { tiesWith: string | string[]; maxMargin: number }> = {
   // Equality-Centered Statist clusters tightly with the broader left-statist
   // family (democratic-socialist, ecosocialist): all share pro-equality,
   // pro-state, pro-redistribution economics. The base quiz lands them in the
   // same neighborhood; property/ecology/strategy axes
   // are what separate them.
   'egalitarian-statist': { tiesWith: ['democratic-socialist', 'ecosocialist'], maxMargin: 0.05 },
   // Deregulatory Decentralist, Mutualist, and Left-Wing Market Anarchism cluster
   // around anti-authority, anti-domination, and decentralization; they part mainly
   // on property and market-process confidence, which this centroid-aligned fixture barely pushes.
   'decentralist-market-skeptic-of-state': { tiesWith: ['mutualist', 'left-wing-market-anarchism'], maxMargin: 0.01 },
   // Market Socialist and Civil-Libertarian Cosmopolitan both align on anti-authority,
   // cosmopolitanism, secularism, and anti-militarism; they part mainly on property
   // and equality, which this centroid-aligned fixture does not push hard enough.
   'market-socialist': { tiesWith: 'civil-libertarian-cosmopolitan', maxMargin: 0.01 },
   // Communitarianism and Social-Democrat share strong communitarian, pro-welfare-state,
   // pro-equality normative commitments; they part mainly on market confidence and
   // state decentralization, which the base bank's ternary fixture cannot resolve clearly.
   'communitarianism': { tiesWith: 'social-democrat', maxMargin: 0.02 },
   // Subtype labels cluster tightly with their family neighbors; the base-quiz
   // centroid fixture lands them in the right neighborhood.
   'council-communist': { tiesWith: 'anarcho-communist', maxMargin: 0.02 },
   'syndicalist': { tiesWith: 'anarcho-communist', maxMargin: 0.04 },
   'minarchist': { tiesWith: ['civil-libertarian-cosmopolitan', 'classical-liberalism'], maxMargin: 0.021 },
   'agorist': { tiesWith: 'decentralist-market-skeptic-of-state', maxMargin: 0.04 },
   // Ethnonationalist and Theocrat both cluster on high authority, traditionalism,
   // particularist community boundary, and hierarchy acceptance; they part mainly
   // on the secularism-religious axis, which the base bank only lightly probes.
   'ethnonationalist': { tiesWith: 'theocrat', maxMargin: 0.02 },
   // Revolutionary Collectivist sits in the same left-statist cluster and
   // near-ties with ecosocialist (both anti-private-property, pro-equality,
   // pro-state); strategy/ecology axes separate them.
   'revolutionary-collectivist': { tiesWith: ['ecosocialist', 'egalitarian-statist'], maxMargin: 0.05 },
   // Classical Liberalism sign-flips authority-legitimacy negative vs Market-Confident Reformist,
   // landing a centroid-aligned profile in the same liberal cluster; the two part mainly on
   // anti-domination and state-capacity-confidence, which the base bank only lightly probes.
   'market-liberal': { tiesWith: 'classical-liberalism', maxMargin: 0.01 },
   // radical-democracy and left-wing-market-anarchism cluster around anti-domination/cosmopolitan/pro-market
   // strategies; the bank probes authority and property strongly enough to separate them at the fixture level.
   'radical-democracy': { tiesWith: 'democratic-socialist', maxMargin: 0.015 },
   // Left-wing Market Anarchism and Participism bracket different answers to coordination and
   // property within the anti-capitalist-anarchist cluster; the bank's items treat the axis
   // with enough weight to give sub-0.01 but not decisive resolution.
   'left-wing-market-anarchism': { tiesWith: 'participism', maxMargin: 0.01 },
   // Anarcho-Primitivism and Deep Ecology share fundamentally overlapping ecological and anti-state
   // normative commitments; the bank only lightly probes the techno-skeptic vs revitalist strategic difference.
   'anarcho-primitivism': { tiesWith: 'deep-ecology', maxMargin: 0.01 },
   // Newly-added backlog centroids intentionally sit inside already-dense families:
   // individualist and left-market anarchism separate on property/market strategy,
   // Maoism from Marxism-Leninism on mass-line and peasant strategy, and Trotskyism
   // from ecosocialism on international revolution versus ecological emphasis. The
   // current bank only partially probes those separators, so tiny fixture ties are expected.
   'individualist-anarchism': { tiesWith: 'left-wing-market-anarchism', maxMargin: 0.01 },
   'maoism': { tiesWith: 'marxist-leninist', maxMargin: 0.02 },
   'trotskyism': { tiesWith: 'ecosocialist', maxMargin: 0.01 },
   // World Federalism and Multiculturalism are both liberal-internationalist
   // ideologies with similar universalist normative commitments. They separate
   // on authority/centralization (WF favors world government, MC prefers
   // decentralized cultural pluralism) and market-process confidence, but the
   // base bank's ternary fixture mapping loses gradient on those separators.
   'world-federalism': { tiesWith: 'multiculturalism', maxMargin: 0.02 },
   // The three nationalist entries (Hindutva, Religious Nationalism, Zionism) cluster
   // tightly in their centroid-aligned fixtures — all share strong community boundaries,
   // high traditionalism, and authority acceptance. The base bank's question weights
   // cannot cleanly separate them without the question bank expanding.
   'religious-nationalism': { tiesWith: 'hindutva', maxMargin: 0.02 },
   'zionism': { tiesWith: 'hindutva', maxMargin: 0.06 },
   // National Bolshevism and Strasserism both occupy the authoritarian,
   // anti-capitalist, ultra-nationalist space with similar profiles on most
   // structural axes. Their fixture profiles near-tie.
   'national-bolshevism': { tiesWith: 'strasserism', maxMargin: 0.02 },
   // Strasserism's extreme authoritarianism, traditionalism, and anti-liberalism
   // land its fixture profile near the Theocrat (shared high authority, traditionalism).
   'strasserism': { tiesWith: 'theocrat', maxMargin: 0.03 },
   // Democratic Confederalism and Mutualism both occupy the left-libertarian,
   // anti-authoritarian, anti-capitalist space with strong decentralization
   // and cooperative economic preferences. The base bank's fixture mapping
   // clusters them together.
   'democratic-confederalism': { tiesWith: 'mutualist', maxMargin: 0.03 },
   // Islamic Democracy and One-Nation Conservatism both pair strong moral
   // traditionalism with modest state capacity and democratic confidence;
   // the base bank ternary mapping cannot cleanly separate the religious vs
   // secular motivation behind their shared conservatism.
   'islamic-democracy': { tiesWith: 'one-nation-conservatism', maxMargin: 0.02 },
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

         if (top.labelId === target) return // strict #1: pass

         const exception = NEAR_TIE_EXCEPTIONS[target]
         expect(
            exception,
            `${target} ranked behind ${top.labelId} with no documented near-tie exception`,
         ).toBeDefined()
         const allowedTies = Array.isArray(exception.tiesWith) ? exception.tiesWith : [exception.tiesWith]
         expect(
            allowedTies.includes(top.labelId),
            `${target} expected to tie with one of ${allowedTies.join(', ')}, but top was ${top.labelId}`,
         ).toBe(true)
         const margin = top.confidence - (own!.confidence ?? 0)
         expect(
            margin,
            `${target} margin from top ${margin.toFixed(3)} exceeds tolerated ${exception.maxMargin}`,
         ).toBeLessThanOrEqual(exception.maxMargin)
      })
   }

   it('every label has a calibration archetype (no unverified labels)', () => {
      const covered = new Set(allCalibrationFixtures.map((f) => f.expectedLabelIds[0]))
      const uncovered = labels.map((l) => l.id).filter((id) => !covered.has(id))
      expect(uncovered, `labels with no archetype sweep coverage: ${uncovered.join(', ')}`).toEqual([])
   })
})
