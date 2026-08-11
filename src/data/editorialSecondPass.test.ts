import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { axisById } from './axes'
import { publicCatalogLabels, roleForLabel } from './labelTaxonomy'
import { labels } from './labels'

const review = readFileSync('docs/editorial-review-second-pass-2026-08.md', 'utf8')
const labelById = new Map(labels.map((label) => [label.id, label]))

describe('editorial second pass', () => {
  it('guards corrected ideology scope and taxonomy metadata', () => {
    const accelerationism = labelById.get('accelerationism')!
    expect(accelerationism.name).toBe('Technology-Centered Accelerationism')
    expect(accelerationism.philosophies).not.toContain('Neo-Reaction')
    expect(accelerationism.normativePhilosophies).not.toContain('Neo-Reaction')

    const ecomodernist = labelById.get('ecomodernist')!
    expect(ecomodernist.family).toBe('green')
    expect(ecomodernist.prescriptivePhilosophies).not.toContain('Technocracy')

    expect(roleForLabel('religious-nationalism')).toBe('modifier')
    expect(labelById.get('religious-nationalism')!.normativePhilosophies).not.toContain('Theocracy')

    expect(labelById.get('political-islam')!.family).toBe('religious-political')
    expect(labelById.get('political-islam')!.description).toMatch(/sometimes including Sharia-based legislation/)

    expect(labelById.get('constitutional-monarchism')!.family).toBe('monarchist')
    expect(labelById.get('constitutional-monarchism')!.description).toMatch(/parliamentary democracy/)
  })

  it('keeps broad synthetic display-name overrides out of the public catalog', () => {
    const publicById = new Map(publicCatalogLabels.map((label) => [label.id, label]))
    expect(publicById.get('technocratic-centralist')!.name).toBe('Technocratic Centralist')
    expect(publicById.has('civil-libertarian-cosmopolitan')).toBe(false)
  })

  it('keeps subtype names out of aliases', () => {
    expect(labelById.get('maoism')!.aliases ?? []).not.toContain('Maoism-Third Worldism')
    expect(labelById.get('zionism')!.aliases ?? []).not.toContain('Labour Zionism')
    expect(labelById.get('strasserism')!.aliases ?? []).not.toContain('National Syndicalism')
    expect(labelById.get('libertarian-municipalism')!.aliases ?? []).not.toContain('Social Ecology')
  })

  it('keeps revised pole wording inside its declared conceptual layer', () => {
    expect(axisById.get('militarism-pacifism')!.positivePole).toMatch(/morally justified under specified conditions/)
    expect(axisById.get('coercion-strategy')!.positivePole).toMatch(/^Change may be pursued/)
    expect(axisById.get('anti-domination')!.negativePole).not.toMatch(/normal feature/)
  })

  it('records resolved and empirically deferred findings in the dated review', () => {
    for (const id of ['accelerationism', 'ecomodernist', 'political-islam', 'constitutional-monarchism', 'q0002', 'q0409', 'sq04', 'sq12']) {
      expect(review, `${id} is missing from the second-pass review`).toContain(`\`${id}\``)
    }
    expect(review).toContain('No centroid or axis weight was changed')
    expect(review).toContain('Directional keying is severely imbalanced')
  })
})
