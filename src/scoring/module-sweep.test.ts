import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { factionModules, factionModuleById } from '../data/factionModules'
import { labelById, labels } from '../data/labels'
import { questions } from '../data/questions'
import { moduleQuestionById } from '../data/moduleQuestions'
import { buildResultProfile, computeModuleSubtype, computeScoreBreakdown, suggestModules } from './index'
import type { AnswerMap, LabelMatch } from '../types'

const ALL = [...questions, ...Array.from(moduleQuestionById.values())]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function answersAlignedTo(labelId: string): AnswerMap {
  const centroid = labelById.get(labelId)!.centroid
  const answers: AnswerMap = {}
  for (const q of ALL) {
    let total = 0
    let weight = 0
    for (const w of q.axisWeights) {
      const c = centroid[w.axisId] ?? 0
      total += c * w.weight
      weight += Math.abs(w.weight)
    }
    answers[q.id] = weight > 0
      ? { questionId: q.id, value: (Math.sign(total) * 3) as number }
      : { questionId: q.id, value: 0 }
  }
  return answers
}

function makeLabelMatch(labelId: string): LabelMatch[] {
  const label = labelById.get(labelId)!
  return [{ labelId: label.id, name: label.name, distance: 0, confidence: 1 }]
}

// ---------------------------------------------------------------------------
// suggestModules unit tests
// ---------------------------------------------------------------------------
describe('suggestModules', () => {
  it('returns modules whose triggerLabelIds overlap the nearest labels', () => {
    // market-liberal triggers market-faction-module, georgist, anti-ip, geolibertarian, ancap
    const result = suggestModules(makeLabelMatch('market-liberal'), factionModules)
    expect(result.length).toBeGreaterThanOrEqual(3)
    const ids = result.map((m) => m.id)
    expect(ids).toContain('market-faction-module')
    expect(ids).toContain('georgist-faction-module')
    expect(ids).toContain('anarcho-capitalist-faction-module')
  })

  it('returns empty when no nearest labels match any trigger', () => {
    const result = suggestModules(makeLabelMatch('egalitarian-statist'), [
      { id: 'ghost', name: 'Ghost', description: '', triggerLabelIds: ['no-such-label'], questionIds: [], subtypeLabelIds: [] },
    ])
    expect(result).toEqual([])
  })

  it('excludes modules in the excludeModuleIds set', () => {
    const result = suggestModules(makeLabelMatch('market-liberal'), factionModules, new Set(['market-faction-module']))
    const ids = result.map((m) => m.id)
    expect(ids).not.toContain('market-faction-module')
    expect(ids).toContain('georgist-faction-module')
  })

  it('can trigger multiple modules at once', () => {
    // national-traditionalist triggers right, authoritarian, religious, nationalist, christian-dem, fascist
    const result = suggestModules(makeLabelMatch('national-traditionalist'), factionModules)
    expect(result.length).toBeGreaterThanOrEqual(4)
  })

  it('returns modules across multiple nearest labels', () => {
    const result = suggestModules(
      [
        { labelId: 'fascist-authoritarian', name: '', distance: 0, confidence: 1 },
        { labelId: 'market-liberal', name: '', distance: 0, confidence: 1 },
        { labelId: 'egalitarian-statist', name: '', distance: 0, confidence: 1 },
      ],
      factionModules,
    )
    expect(result.length).toBeGreaterThanOrEqual(5)
  })
})

// ---------------------------------------------------------------------------
// Near-tie exceptions for the subtype sweep
// ---------------------------------------------------------------------------
// Some subtype centroids are so close that centroid-aligned fixtures near-tie
// within a module's candidate set. These are documented here so the sweep
// tolerates known tight clusters while still catching regressions.
type ModuleException = { tiesWith: string | string[]; maxMargin: number }
const SWEEP_EXCEPTIONS: Record<string, Record<string, ModuleException>> = {
  'anarchist-faction-module': {
    // syndicalist and anarcho-communist share anti-state / anti-capitalist /
    // worker-control commitments; the full-bank fixture maps both to the same
    // cluster without stronger property-axis signal.
    'syndicalist': { tiesWith: 'anarcho-communist', maxMargin: 0.05 },
  },
  'mutualist-faction-module': {
    'syndicalist': { tiesWith: 'anarcho-communist', maxMargin: 0.05 },
  },
}

// ---------------------------------------------------------------------------
// Module subtype sweep
// ---------------------------------------------------------------------------
describe('module subtype resolution sweep', () => {
  for (const module of factionModules) {
    describe(module.id, () => {
      it('each subtypeLabelId resolves to itself via computeModuleSubtype', () => {
        const mgr = factionModuleById.get(module.id)!
        for (const subtypeId of mgr.subtypeLabelIds) {
          const answers = answersAlignedTo(subtypeId)
          const scores = computeScoreBreakdown(ALL, answers, axes)
          const sub = computeModuleSubtype(scores, mgr.subtypeLabelIds, labels)
          expect(sub, `${subtypeId} should resolve in ${module.id}`).not.toBeNull()

          if (sub!.labelId === subtypeId) {
            expect(sub!.confidence).toBeGreaterThan(0.3)
            continue
          }

          // Near-tie: verify it's documented and valid
          const exceptions = SWEEP_EXCEPTIONS[module.id] ?? {}
          const exception = exceptions[subtypeId]
          expect(exception, `${subtypeId} not #1 in ${module.id} (got ${sub!.labelId}) with no documented exception`).toBeDefined()
          const allowedTies = Array.isArray(exception.tiesWith) ? exception.tiesWith : [exception.tiesWith]
          expect(allowedTies.includes(sub!.labelId),
            `${subtypeId} ties with ${allowedTies.join(', ')} but got ${sub!.labelId}`
          ).toBe(true)
        }
      })

      it('each subtypeLabelId resolves via buildResultProfile', () => {
        const mgr = factionModuleById.get(module.id)!
        for (const subtypeId of mgr.subtypeLabelIds) {
          const answers = answersAlignedTo(subtypeId)
          const profile = buildResultProfile(ALL, answers, axes, labels, [module])
          const subtypes = profile.moduleSubtypes ?? {}
          expect(Object.keys(subtypes)).toContain(mgr.id)

          const exceptions = SWEEP_EXCEPTIONS[module.id] ?? {}
          if (subtypes[mgr.id].labelId === subtypeId) {
            expect(subtypes[mgr.id].moduleName).toBe(mgr.name)
          } else {
            expect(mgr.subtypeLabelIds).toContain(subtypes[mgr.id].labelId)
            expect(exceptions[subtypeId],
              `${subtypeId} resolved to ${subtypes[mgr.id].labelId} with no exception`
            ).toBeDefined()
          }
        }
      })

      it('produces a distinct runner-up when multiple candidates exist', () => {
        const mgr = factionModuleById.get(module.id)!
        if (mgr.subtypeLabelIds.length < 2) return
        const answers = answersAlignedTo(mgr.subtypeLabelIds[0])
        const scores = computeScoreBreakdown(ALL, answers, axes)
        const sub = computeModuleSubtype(scores, mgr.subtypeLabelIds, labels)
        expect(sub).not.toBeNull()
        expect(sub!.runnerUpId).not.toBeNull()
        expect(mgr.subtypeLabelIds).toContain(sub!.runnerUpId!)
        expect(sub!.runnerUpId).not.toBe(sub!.labelId)
      })
    })
  }
})

// ---------------------------------------------------------------------------
// Integration: multiple modules
// ---------------------------------------------------------------------------
describe('buildResultProfile with multiple modules', () => {
  it('populates moduleSubtypes for each completed module', () => {
    const answers = answersAlignedTo('anarcho-capitalist')
    const market = factionModuleById.get('market-faction-module')!
    const ancap = factionModuleById.get('anarcho-capitalist-faction-module')!
    const profile = buildResultProfile(ALL, answers, axes, labels, [market, ancap])
    expect(Object.keys(profile.moduleSubtypes ?? {}).sort()).toEqual(
      ['anarcho-capitalist-faction-module', 'market-faction-module'],
    )
  })

  it('each module resolves its subtype independently', () => {
    const answers = answersAlignedTo('marxist-leninist')
    const left = factionModuleById.get('left-faction-module')!
    const auth = factionModuleById.get('authoritarian-faction-module')!
    const profile = buildResultProfile(ALL, answers, axes, labels, [left, auth])
    const subtypes = profile.moduleSubtypes ?? {}
    expect(subtypes[left.id].labelId).toBe('marxist-leninist')
    expect(labelById.get(subtypes[auth.id].labelId)!.centroid['authority-legitimacy']).toBeGreaterThan(0)
  })

  it('empty completedModules produces empty moduleSubtypes', () => {
    expect(buildResultProfile(ALL, answersAlignedTo('market-liberal'), axes, labels).moduleSubtypes).toEqual({})
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------
describe('module edge cases', () => {
  it('computeModuleSubtype returns null for empty candidate list', () => {
    const scores = computeScoreBreakdown(ALL, answersAlignedTo('market-liberal'), axes)
    expect(computeModuleSubtype(scores, [], labels)).toBeNull()
  })

  it('module subtype resolution works even with neutral answers', () => {
    const answers: AnswerMap = {}
    for (const q of ALL) answers[q.id] = { questionId: q.id, value: 0 }
    const scores = computeScoreBreakdown(ALL, answers, axes)
    const sub = computeModuleSubtype(scores, factionModules[0].subtypeLabelIds, labels)
    expect(sub).not.toBeNull()
    expect(factionModules[0].subtypeLabelIds).toContain(sub!.labelId)
  })

  it('suggestModules returns empty for empty nearest labels', () => {
    expect(suggestModules([], factionModules)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Cross-module separation
// ---------------------------------------------------------------------------
describe('module separation validity', () => {
  it('separates left subtypes', () => {
    const module = factionModuleById.get('left-faction-module')!
    const pairs: [string, string][] = [
      ['marxist-leninist', 'council-communist'],
      ['marxist-leninist', 'anarcho-communist'],
      ['syndicalist', 'marxist-leninist'],
      ['democratic-socialist', 'marxist-leninist'],
    ]
    for (const [a, b] of pairs) {
      const aR = computeModuleSubtype(
        computeScoreBreakdown(ALL, answersAlignedTo(a), axes), module.subtypeLabelIds, labels,
      )
      const bR = computeModuleSubtype(
        computeScoreBreakdown(ALL, answersAlignedTo(b), axes), module.subtypeLabelIds, labels,
      )
      expect(aR!.labelId, `${a} vs ${b}`).not.toBe(bR!.labelId)
    }
  })

  it('separates right subtypes', () => {
    const module = factionModuleById.get('right-faction-module')!
    const aR = computeModuleSubtype(
      computeScoreBreakdown(ALL, answersAlignedTo('national-traditionalist'), axes), module.subtypeLabelIds, labels,
    )
    const bR = computeModuleSubtype(
      computeScoreBreakdown(ALL, answersAlignedTo('christian-democrat'), axes), module.subtypeLabelIds, labels,
    )
    expect(aR!.labelId).not.toBe(bR!.labelId)
  })

  it('separates authoritarian subtypes', () => {
    const module = factionModuleById.get('authoritarian-faction-module')!
    const pairs: [string, string][] = [
      ['technocratic-centralist', 'fascist-authoritarian'],
      ['fascist-authoritarian', 'theocrat'],
      ['marxist-leninist', 'technocratic-centralist'],
    ]
    for (const [a, b] of pairs) {
      const aR = computeModuleSubtype(
        computeScoreBreakdown(ALL, answersAlignedTo(a), axes), module.subtypeLabelIds, labels,
      )
      const bR = computeModuleSubtype(
        computeScoreBreakdown(ALL, answersAlignedTo(b), axes), module.subtypeLabelIds, labels,
      )
      expect(aR!.labelId, `${a} vs ${b}`).not.toBe(bR!.labelId)
    }
  })

  it('separates anarchist subtypes', () => {
    const module = factionModuleById.get('anarchist-faction-module')!
    const scores = new Map(
      ['mutualist', 'anarcho-communist', 'syndicalist', 'anarcho-capitalist'].map((id) => [
        id, computeScoreBreakdown(ALL, answersAlignedTo(id), axes),
      ]),
    )
    const results = new Map(
      [...scores.entries()].map(([id, s]) => [id, computeModuleSubtype(s, module.subtypeLabelIds, labels)!.labelId]),
    )
    expect(results.get('mutualist')).not.toBe(results.get('anarcho-communist'))
    expect(results.get('syndicalist')).not.toBe(results.get('anarcho-capitalist'))
  })
})
