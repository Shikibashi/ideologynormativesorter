/**
 * Stable, compact fingerprints for the ordered scoring rosters recorded with
 * a research submission. The canonical sort makes a fingerprint about the
 * active membership of a roster, not its presentation order.
 */
function hash32(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function labelRosterFingerprint(
  role: 'primary' | 'modifier',
  labelIds: readonly string[],
  taxonomyVersion: string,
  modifierMeasurementVersion?: string,
): string {
  const canonicalIds = [...new Set(labelIds)].sort().join('|')
  const measurementScope = modifierMeasurementVersion ?? 'not-applicable'
  const payload = `${taxonomyVersion}:${role}:${measurementScope}:${canonicalIds}`
  return `lr_${hash32(payload).toString(16).padStart(8, '0')}`
}
