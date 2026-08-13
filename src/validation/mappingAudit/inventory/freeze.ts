import { questions as rawMainQuestions, QUESTION_BANK_VERSION } from '../../../data/questions'
import {
  questions as effectiveActiveQuestions,
  coreQuestions as effectiveRetainedQuestions,
  QUESTION_BANK_VERSION as EFFECTIVE_BANK_VERSION,
} from '../../../data/effectiveQuestions'
import { statementQuestions } from '../../../data/statementQuestions'
import { axes } from '../../../data/axes'
import { labels } from '../../../data/labels'
import {
  SEMANTIC_AUDIT_VERSION,
  semanticCorrections,
  needsRewriteById,
} from '../../../data/semanticAudit'
import { RESULT_SCORING_VERSION } from '../../../scoring/index'
import { expectedContributionCardinality } from '../manifests/expand'
import { getBankFingerprint, generateInventorySnapshots } from './snapshot'
import type { InventorySnapshot } from '../types'

/**
 * WP0 freeze constants — live recount at freeze time.
 * Tests fail if live bank drifts without regenerating this freeze.
 */
export const WP0_FREEZE = {
  frozenAt: '2026-08-13T00:00:00.000Z',
  rawMainQuestionCount: 496,
  effectiveActiveQuestionCount: 338,
  effectiveRetainedQuestionCount: 496,
  statementQuestionCount: 17,
  labelCount: 145,
  axisCount: 26,
  familyCount: 20,
  subfamilyPairCount: 110,
  overlayCorrectionCount: 101,
  needsRewriteCount: 80,
  rawMainContributionCardinality: 9986,
  effectiveActiveContributionCardinality: 5510,
  statementContributionCardinality: 120,
  families: [
    'anarchist',
    'anti-colonial',
    'authoritarian',
    'communitarian',
    'conservative',
    'democratic',
    'distributist',
    'feminist',
    'green',
    'indigenist',
    'liberal',
    'monarchist',
    'nationalist',
    'populist',
    'regionalist',
    'religious-political',
    'republican',
    'social-democratic',
    'socialist',
    'technocratic',
  ] as const,
  versions: {
    questionBank: QUESTION_BANK_VERSION,
    effectiveBank: EFFECTIVE_BANK_VERSION,
    semanticAudit: SEMANTIC_AUDIT_VERSION,
    resultScoring: RESULT_SCORING_VERSION,
  },
  fingerprint: getBankFingerprint(),
} as const

export function liveFreezeMetrics() {
  const families = [...new Set(labels.map((l) => l.family))].sort()
  const subfamilies = [
    ...new Set(labels.map((l) => `${l.family}|${l.subfamily ?? ''}`)),
  ].sort()

  return {
    rawMainQuestionCount: rawMainQuestions.length,
    effectiveActiveQuestionCount: effectiveActiveQuestions.length,
    effectiveRetainedQuestionCount: effectiveRetainedQuestions.length,
    statementQuestionCount: statementQuestions.length,
    labelCount: labels.length,
    axisCount: axes.length,
    familyCount: families.length,
    subfamilyPairCount: subfamilies.length,
    overlayCorrectionCount: Object.keys(semanticCorrections).length,
    needsRewriteCount: Object.keys(needsRewriteById).length,
    rawMainContributionCardinality: expectedContributionCardinality(rawMainQuestions),
    effectiveActiveContributionCardinality: expectedContributionCardinality(
      effectiveActiveQuestions,
    ),
    statementContributionCardinality: expectedContributionCardinality(statementQuestions),
    families,
    versions: {
      questionBank: QUESTION_BANK_VERSION,
      effectiveBank: EFFECTIVE_BANK_VERSION,
      semanticAudit: SEMANTIC_AUDIT_VERSION,
      resultScoring: RESULT_SCORING_VERSION,
    },
    fingerprint: getBankFingerprint(),
  }
}

/** Full WP0 inventory: raw + effective-active/retained + catalog. */
export function generateFullInventorySnapshots(): InventorySnapshot[] {
  const now = new Date().toISOString()
  const fingerprint = getBankFingerprint()
  const families = new Set(labels.map((l) => l.family))
  const base = generateInventorySnapshots()

  const effectiveActive: InventorySnapshot = {
    snapshotId: `inv:effective-active:main:${now}`,
    inventorySet: 'effective-active',
    corpus: 'main',
    generatedAt: now,
    questionCount: effectiveActiveQuestions.length,
    bankVersion: EFFECTIVE_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  }

  const effectiveRetained: InventorySnapshot = {
    snapshotId: `inv:effective-retained:main:${now}`,
    inventorySet: 'effective-retained',
    corpus: 'main',
    generatedAt: now,
    questionCount: effectiveRetainedQuestions.length,
    bankVersion: EFFECTIVE_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  }

  const overlayCatalog: InventorySnapshot = {
    snapshotId: `inv:overlay:catalog:${now}`,
    inventorySet: 'overlay',
    corpus: 'catalog',
    generatedAt: now,
    questionCount:
      Object.keys(semanticCorrections).length + Object.keys(needsRewriteById).length,
    labelCount: labels.length,
    axisCount: axes.length,
    familyCount: families.size,
    bankVersion: EFFECTIVE_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  }

  return [...base, effectiveActive, effectiveRetained, overlayCatalog]
}
