import type { AxisId, LabelId } from '../types'

/**
 * A constitutive gate is deliberately stricter than centroid proximity.  It
 * describes a commitment that must be measured before a compound or highly
 * specific tradition can appear as a match.  A gate is not a definition of a
 * respondent and it is not an empirical validity claim; it is a false-positive
 * safeguard for the interpretation layer.
 */
export interface AxisGate {
  axisId: AxisId
  min?: number
  max?: number
}

export interface CompoundGate {
  labelId: LabelId
  allOf: readonly AxisGate[]
  rationale: string
}

/**
 * Only labels that have genuinely constitutive combinations receive gates.
 * Narrow labels without an ordinary scoring path are still recorded here so a
 * future focused module cannot silently fall back to centroid-only matching.
 */
export const compoundGates: readonly CompoundGate[] = [
  {
    labelId: 'fascist-authoritarian',
    allOf: [
      { axisId: 'authority-legitimacy', min: 0.55 },
      { axisId: 'liberty-noninterference', max: -0.45 },
      { axisId: 'political-community-boundary', max: -0.55 },
      { axisId: 'democratic-confidence', max: -0.3 },
      { axisId: 'centralization-preference', min: 0.45 },
      { axisId: 'coercion-strategy', min: 0.1 },
    ],
    rationale: 'Fascism requires more than generic authority or nationalism: the ordinary gate requires anti-liberal, exclusionary, centralized, and coercive commitments to be measured together.',
  },
  {
    labelId: 'marxist-leninist',
    allOf: [
      { axisId: 'property-legitimacy', max: -0.55 },
      { axisId: 'authority-legitimacy', min: 0.35 },
      { axisId: 'centralization-preference', min: 0.45 },
      { axisId: 'reform-vs-revolution', min: 0.5 },
      { axisId: 'state-action-vs-exit', min: 0.45 },
    ],
    rationale: 'Marxism-Leninism requires a socialist property commitment together with vanguard-style centralization and revolutionary state transition; generic egalitarianism is insufficient.',
  },
  {
    labelId: 'welfare-chauvinism',
    allOf: [
      { axisId: 'political-community-boundary', max: -0.45 },
      { axisId: 'redistribution-vs-predistribution', min: 0.45 },
    ],
    rationale: 'Welfare chauvinism requires both bounded membership and support for redistributive provision; either nationalism or welfare support alone must not produce it.',
  },
  {
    labelId: 'religious-nationalism',
    allOf: [
      { axisId: 'political-community-boundary', max: -0.45 },
      { axisId: 'secularism-religious', min: 0.45 },
    ],
    rationale: 'Religious nationalism requires a national boundary commitment and a public role for religious identity; religiosity or nationalism in isolation is not enough.',
  },
  {
    labelId: 'eco-authoritarianism',
    allOf: [
      { axisId: 'human-nature-priority', min: 0.35 },
      { axisId: 'authority-legitimacy', min: 0.55 },
      { axisId: 'centralization-preference', min: 0.55 },
      { axisId: 'democratic-confidence', max: -0.35 },
    ],
    rationale: 'Eco-authoritarianism requires ecological priority and concentrated, less-pluralist enforcement together; climate concern or state capacity alone is insufficient.',
  },
  {
    labelId: 'national-socialism',
    allOf: [
      { axisId: 'authority-legitimacy', min: 0.55 },
      { axisId: 'liberty-noninterference', max: -0.55 },
      { axisId: 'equality-theory', max: -0.45 },
      { axisId: 'political-community-boundary', max: -0.6 },
      { axisId: 'centralization-preference', min: 0.55 },
      { axisId: 'coercion-strategy', min: 0.55 },
    ],
    rationale: 'The historical Nazi construct requires racial-exclusionary hierarchy and totalizing centralized coercion in addition to generic authoritarian or interventionist views.',
  },
  {
    labelId: 'christian-reconstructionism',
    allOf: [
      { axisId: 'authority-legitimacy', min: 0.4 },
      { axisId: 'moral-traditionalism', min: 0.6 },
      { axisId: 'secularism-religious', min: 0.65 },
    ],
    rationale: 'Christian Reconstructionism requires a theonomic religious-public-order commitment, not generic Christianity, conservatism, or family traditionalism.',
  },
  {
    labelId: 'geolibertarian',
    allOf: [
      { axisId: 'liberty-noninterference', min: 0.45 },
      { axisId: 'property-legitimacy', min: 0.25 },
      { axisId: 'redistribution-vs-predistribution', max: -0.25 },
    ],
    rationale: 'Georgist libertarianism requires both strong individual liberty and a predistributive property-reform orientation; generic market support does not identify its land-rent boundary.',
  },
  {
    labelId: 'anarcho-capitalist',
    allOf: [
      { axisId: 'authority-legitimacy', max: -0.45 },
      { axisId: 'property-legitimacy', min: 0.45 },
      { axisId: 'centralization-preference', max: -0.45 },
      { axisId: 'state-action-vs-exit', max: -0.45 },
    ],
    rationale: 'Anarcho-capitalism requires both anti-state authority and strong private-property commitments; right-libertarian or market views alone do not establish anarcho-capitalism.',
  },
  {
    labelId: 'anarcho-communist',
    allOf: [
      { axisId: 'authority-legitimacy', max: -0.45 },
      { axisId: 'property-legitimacy', max: -0.45 },
      { axisId: 'centralization-preference', max: -0.45 },
      { axisId: 'equality-theory', min: 0.45 },
    ],
    rationale: 'Anarcho-communism requires anti-state authority together with communal or egalitarian property commitments; anti-authoritarianism alone is not enough.',
  },
  {
    labelId: 'maoism',
    allOf: [
      { axisId: 'property-legitimacy', max: -0.55 },
      { axisId: 'centralization-preference', min: 0.45 },
      { axisId: 'reform-vs-revolution', min: 0.55 },
      { axisId: 'state-action-vs-exit', min: 0.45 },
    ],
    rationale: 'Maoism requires revolutionary socialist transformation and centralized transition; egalitarianism or state intervention by themselves do not identify the tradition.',
  },
  {
    labelId: 'national-bolshevism',
    allOf: [
      { axisId: 'political-community-boundary', max: -0.45 },
      { axisId: 'property-legitimacy', max: -0.35 },
      { axisId: 'authority-legitimacy', min: 0.45 },
      { axisId: 'centralization-preference', min: 0.45 },
    ],
    rationale: 'National Bolshevism is a conjunction of strong national priority and authoritarian socialist or state-centered commitments, not a synonym for nationalism or socialism alone.',
  },
  {
    labelId: 'strasserism',
    allOf: [
      { axisId: 'political-community-boundary', max: -0.55 },
      { axisId: 'equality-theory', max: -0.35 },
      { axisId: 'authority-legitimacy', min: 0.45 },
      { axisId: 'coercion-strategy', min: 0.45 },
    ],
    rationale: 'Strasserism requires a fascist-ultranationalist and coercive core; anti-capitalist rhetoric alone must not generate it.',
  },
]

export const compoundGateByLabelId = new Map(
  compoundGates.map((gate) => [gate.labelId, gate]),
)
