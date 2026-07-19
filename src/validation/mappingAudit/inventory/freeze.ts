import { questions as rawMainQuestions, QUESTION_BANK_VERSION } from '../../../data/questions'
import {
  questions as effectiveActiveQuestions,
  coreQuestions as effectiveRetainedQuestions,
  QUESTION_BANK_VERSION as EFFECTIVE_BANK_VERSION,
} from '../../../data/effectiveQuestions'
import { moduleQuestions } from '../../../data/moduleQuestions'
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
  frozenAt: '2026-07-19T00:00:00.000Z',
  rawMainQuestionCount: 443,
  effectiveActiveQuestionCount: 363,
  effectiveRetainedQuestionCount: 443,
  moduleQuestionCount: 123,
  statementQuestionCount: 17,
  labelCount: 117,
  axisCount: 26,
  familyCount: 16,
  subfamilyPairCount: 77,
  overlayCorrectionCount: 101,
  needsRewriteCount: 80,
  rawMainContributionCardinality: 9591,
  effectiveActiveContributionCardinality: 7779,
  moduleContributionCardinality: 1481,
  statementContributionCardinality: 120,
  families: [
    'anarchist',
    'authoritarian',
    'communitarian',
    'conservative',
    'democratic',
    'distributist',
    'green',
    'indigenist',
    'liberal',
    'libertarian-leaning',
    'nationalist',
    'populist',
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
    moduleQuestionCount: moduleQuestions.length,
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
    moduleContributionCardinality: expectedContributionCardinality(moduleQuestions),
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
