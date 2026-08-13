import { describe, expect, it } from 'vitest'
import { labels } from './labels'
import { questionById } from './effectiveQuestions'

describe('truthfulness guardrails', () => {
  it('does not present bounded traditions as absolute or universal doctrines', () => {
    const byId = new Map(labels.map((label) => [label.id, label]))

    expect(byId.get('anarcho-capitalist')?.description).toMatch(/seeks to replace the state/i)
    expect(byId.get('anarcho-capitalist')?.description).not.toMatch(/entirely|all legitimate/i)
    expect(byId.get('marxist-leninist')?.description).toMatch(/national and historical variants differ/i)
    expect(byId.get('marxist-leninist')?.description).not.toMatch(/party must seize/i)
    expect(byId.get('communitarianism')?.description).toMatch(/vary over markets, welfare, state power/i)
    expect(byId.get('universal-basic-income')?.description).toMatch(/defined population/i)
    expect(byId.get('universal-basic-income')?.description).not.toMatch(/every citizen or resident/i)

    expect(byId.get('agorist')?.description).toMatch(/primary emphasis on counter-economics rather than electoral politics/i)
    expect(byId.get('agorist')?.description).not.toMatch(/rejects electoral politics entirely/i)
    expect(byId.get('minarchist')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Minarchism')?.description)
      .toMatch(/minimal rights-protecting state/i)
    expect(byId.get('minarchist')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Minarchism')?.description)
      .not.toMatch(/\bonly\b/i)
    expect(byId.get('anarcho-capitalist')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Libertarianism')?.description)
      .not.toMatch(/absolute commitment/i)
    expect(byId.get('agorist')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Libertarianism')?.description)
      .not.toMatch(/absolute private property/i)
    expect(byId.get('stirnerism')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Egoism')?.description)
      .not.toMatch(/all external constraints/i)
    expect(byId.get('individualist-anarchism')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Anarchism')?.description)
      .not.toMatch(/rejection of all coercive authority/i)
    expect(byId.get('queer-anarchism')?.philosophyInfluences?.find((influence) => influence.philosophy === 'Anarchism')?.description)
      .not.toMatch(/rejection of all coercive hierarchy/i)

    for (const id of ['democratic-socialist', 'marxist-leninist', 'neoconservative', 'one-nation-conservatism']) {
      expect(byId.get(id)?.cautionNote, id).toBeTruthy()
    }
  })

  it('gives high-confusion scored labels both scope and boundary notes', () => {
    const byId = new Map(labels.map((label) => [label.id, label]))
    const reviewedIds = [
      'theocrat',
      'ethnonationalist',
      'classical-liberalism',
      'neoliberalism',
      'communitarianism',
      'republicanism',
      'right-wing-populism',
      'radical-democracy',
      'left-wing-populism',
      'multiculturalism',
      'eco-authoritarianism',
      'religious-nationalism',
      'progressivism',
      'left-wing-nationalism',
      'fiscal-conservatism',
      'social-conservatism',
      'national-conservatism',
      'liberal-conservatism',
      'internationalism',
      'expansionist-nationalism',
      'separatist-nationalism',
    ]

    for (const id of reviewedIds) {
      const label = byId.get(id)
      expect(label?.usageNote?.length ?? 0, `${id} needs a usage note`).toBeGreaterThan(30)
      expect(label?.cautionNote?.length ?? 0, `${id} needs a caution note`).toBeGreaterThan(30)
    }
  })

  it('gives named high-priority specialist variants bespoke boundary notes', () => {
    const byId = new Map(labels.map((label) => [label.id, label]))
    const reviewedIds = [
      'technocratic-centralist',
      'geolibertarian',
      'market-socialist',
      'ordoliberalism',
      'democratic-confederalism',
      'liberal-feminism',
      'agrarian-populism',
      'green-capitalism',
    ]

    for (const id of reviewedIds) {
      expect(byId.get(id)?.cautionNote?.length ?? 0, `${id} needs a bespoke boundary note`).toBeGreaterThan(80)
    }
  })

  it('keeps descriptive evidence aligned with the construct named by the axis', () => {
    expect(questionById.get('q0027')?.axisWeights).toEqual([
      { axisId: 'coordination-optimism', weight: 0.8 },
    ])
    expect(questionById.get('q0048')?.axisWeights).not.toEqual(expect.arrayContaining([
      { axisId: 'expert-confidence', weight: expect.any(Number) },
    ]))
    expect(questionById.get('q0128')?.prompt).toMatch(/policymakers cannot fully target/i)
    expect(questionById.get('q0148')?.prompt).toMatch(/entry and competition/i)
    expect(questionById.get('q0269')?.prompt).toMatch(/difficult for similarly situated households to predict/i)
    expect(questionById.get('q0307')?.axisWeights).toEqual([
      { axisId: 'state-capacity-confidence', weight: 0.6 },
    ])
  })

  it('keeps historically bounded state ideologies from reading as universal doctrines', () => {
    const byId = new Map(labels.map((label) => [label.id, label]))
    const juche = byId.get('juche')!
    const nationalBolshevism = byId.get('national-bolshevism')!

    expect(juche.description).toMatch(/DPRK\/Kimist state ideology/)
    expect(juche.description).not.toMatch(/economic self-sufficiency/)
    expect(juche.cautionNote).toMatch(/not.*economically autarkic/)
    expect(juche.normativePhilosophies).toContain('Juche')
    expect(nationalBolshevism.description).toMatch(/historically variable set of attempts/)
    expect(nationalBolshevism.cautionNote).toMatch(/do not share one settled program/)
  })

  it('keeps ecological priority aligned between the eco-authoritarian definition and centroid', () => {
    const ecoAuthoritarianism = labels.find((label) => label.id === 'eco-authoritarianism')!
    expect(ecoAuthoritarianism.description).toMatch(/ecological crisis as the overriding political priority/i)
    expect(ecoAuthoritarianism.centroid['human-nature-priority']).toBeGreaterThan(0.4)
  })
})
