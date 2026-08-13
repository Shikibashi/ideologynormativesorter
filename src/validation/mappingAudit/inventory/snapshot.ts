import { createHash } from "node:crypto";
import { questions, QUESTION_BANK_VERSION } from "../../../data/questions";
import { statementQuestions } from "../../../data/statementQuestions";
import { axes } from "../../../data/axes";
import { labels } from "../../../data/labels";
import { SEMANTIC_AUDIT_VERSION } from "../../../data/semanticAudit";
import { RESULT_SCORING_VERSION } from "../../../scoring/index";
import type { InventorySnapshot } from "../types";

/**
 * Deterministic bank fingerprint: sha256-hex-16 of sorted question ids,
 * overlay version, and label ids. Consumers compare this against a stored
 * fingerprint to detect data drift.
 */
export function getBankFingerprint(): string {
  const allQuestionIds = [
    ...questions.map((q) => q.id),
    ...statementQuestions.map((q) => q.id),
  ].sort();

  const labelIds = labels.map((l) => l.id).sort();

  const payload = JSON.stringify({
    questionIds: allQuestionIds,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    labelIds,
  });

  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

/**
 * Generate raw inventory snapshots for the main and statement views plus the catalog.
 * Returns three snapshots: raw-main, raw-statement, raw-catalog.
 */
export function generateInventorySnapshots(): InventorySnapshot[] {
  const now = new Date().toISOString();
  const fingerprint = getBankFingerprint();

  const families = new Set(labels.map((l) => l.family));

  const mainSnapshot: InventorySnapshot = {
    snapshotId: `inv:raw:main:${now}`,
    inventorySet: "raw",
    corpus: "main",
    generatedAt: now,
    questionCount: questions.length,
    bankVersion: QUESTION_BANK_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  };

  const statementSnapshot: InventorySnapshot = {
    snapshotId: `inv:raw:statement:${now}`,
    inventorySet: "raw",
    corpus: "statement",
    generatedAt: now,
    questionCount: statementQuestions.length,
    bankVersion: QUESTION_BANK_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  };

  const catalogSnapshot: InventorySnapshot = {
    snapshotId: `inv:raw:catalog:${now}`,
    inventorySet: "raw",
    corpus: "catalog",
    generatedAt: now,
    labelCount: labels.length,
    axisCount: axes.length,
    familyCount: families.size,
    bankVersion: QUESTION_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    scoringVersion: RESULT_SCORING_VERSION,
    fingerprint,
  };

  return [mainSnapshot, statementSnapshot, catalogSnapshot];
}
