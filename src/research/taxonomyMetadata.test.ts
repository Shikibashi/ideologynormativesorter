import { describe, expect, it } from 'vitest'
import { labelRosterFingerprint } from './taxonomyMetadata'

describe('research taxonomy roster fingerprints', () => {
  it('is stable across roster presentation order but changes with membership or measurement scope', () => {
    const canonical = labelRosterFingerprint('modifier', ['b', 'a'], 'taxonomy-v1', 'measurement-v1')

    expect(labelRosterFingerprint('modifier', ['a', 'b'], 'taxonomy-v1', 'measurement-v1')).toBe(canonical)
    expect(labelRosterFingerprint('modifier', ['a', 'b', 'c'], 'taxonomy-v1', 'measurement-v1')).not.toBe(canonical)
    expect(labelRosterFingerprint('modifier', ['a', 'b'], 'taxonomy-v1', 'measurement-v2')).not.toBe(canonical)
    expect(labelRosterFingerprint('primary', ['a', 'b'], 'taxonomy-v1')).not.toBe(canonical)
    expect(canonical).toMatch(/^lr_[0-9a-f]{8}$/)
  })

  it('freezes the active v13 roster fingerprints used by the collector contract', async () => {
    const {
      MODIFIER_LABEL_ROSTER_FINGERPRINT,
      PRIMARY_LABEL_ROSTER_FINGERPRINT,
    } = await import('./index')

    expect(PRIMARY_LABEL_ROSTER_FINGERPRINT).toBe('lr_3cc0f435')
    expect(MODIFIER_LABEL_ROSTER_FINGERPRINT).toBe('lr_eb26ed76')
  })
})
