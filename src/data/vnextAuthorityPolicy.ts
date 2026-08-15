import type { VNextHighRiskClassification, VNextPublicRole } from "../types";

/** Explicit sensitive/high-risk registry from the approved primary and
 * specialist boundary decisions. This registry is not inferred from names,
 * legacy roles, scores, or graph degree. */
export const VNEXT_HIGH_RISK_IDS = [
  "anarcho-capitalist",
  "anarcho-communist",
  "christian-reconstructionism",
  "eco-authoritarianism",
  "eco-fascism",
  "ethnonationalist",
  "fascist-authoritarian",
  "fundamentalist-theocracy",
  "geolibertarian",
  "marxist-leninist",
  "maoist",
  "national-bolshevism",
  "national-socialism",
  "neoreactionary",
  "political-islam",
  "religious-nationalism",
  "strasserism",
  "theocrat",
  "welfare-chauvinism",
] as const;

export const vnextHighRiskById = new Set<string>(VNEXT_HIGH_RISK_IDS);

export const VNEXT_ROLE_POLICY_RULES: readonly string[] = [
  "conceptual-kind-and-secondary-kinds",
  "typed-graph-relations",
  "measurement-status",
  "explicit-high-risk-registry",
  "structured-evidence-requirements-and-coverage",
  "construct-and-facet-coverage",
  "specialist-module-prerequisites",
  "explicit-promotion-record",
];

export const VNEXT_MODIFIER_DOMAIN_IDS = [
  "national-community-membership",
  "cross-border-moral-scope",
  "popular-sovereignty-political-style",
  "authority-rights-institutional-distribution",
  "culture-recognition-social-order",
  "political-economy-fiscal",
  "technology-human-futures",
] as const;

export type VNextExpectedRole = VNextPublicRole;
export type VNextExpectedRisk = VNextHighRiskClassification;
