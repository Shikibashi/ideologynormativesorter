import {
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  primaryScoringLabels,
} from "../data/labelTaxonomy";
import {
  vnextEvidenceCards,
  vnextEvidenceCardById,
  vnextEvidenceCardByLegacyId,
  vnextPromotionRecords,
} from "../data/vnextEvidenceCards";
import { vnextOntologyById } from "../data/vnextOntology";
import { VNEXT_EVIDENCE_COMPONENT_IDS } from "../types";
import type { VNextEvidenceCard } from "../types";

const EXPECTED_CARD_COUNT =
  primaryScoringLabels.length + SPECIALIST_LABEL_IDS.length;

export function vnextEvidenceCardErrors(
  cards: readonly VNextEvidenceCard[] = vnextEvidenceCards,
): string[] {
  const errors: string[] = [];
  if (cards.length !== EXPECTED_CARD_COUNT) {
    errors.push(
      `expected ${EXPECTED_CARD_COUNT} evidence cards, found ${cards.length}`,
    );
  }
  const cardIds = new Set<string>();
  const labelIds = new Set<string>();
  for (const card of cards) {
    if (cardIds.has(card.cardId))
      errors.push(`duplicate evidence card ${card.cardId}`);
    if (labelIds.has(card.labelId))
      errors.push(`duplicate evidence label ${card.labelId}`);
    cardIds.add(card.cardId);
    labelIds.add(card.labelId);
    if (!card.cardId.endsWith(":validation-v1")) {
      errors.push(`${card.labelId} has an unstable card ID`);
    }
    for (const componentId of VNEXT_EVIDENCE_COMPONENT_IDS) {
      const component = card.evidence[componentId];
      if (!component) {
        errors.push(`${card.labelId} is missing ${componentId}`);
        continue;
      }
      if (component.status === "pass") {
        errors.push(
          `${card.labelId}:${componentId} is prematurely marked pass`,
        );
      }
      if (component.preregistered || component.reviewerDecision !== "pending") {
        errors.push(
          `${card.labelId}:${componentId} has premature empirical metadata`,
        );
      }
    }
    if (card.promotionDecision !== "not-started") {
      errors.push(`${card.labelId} has a premature promotion decision`);
    }
    if (card.claimTierCeiling !== "PC0" && card.claimTierCeiling !== "PC1") {
      errors.push(
        `${card.labelId} exceeds the current PC0/qualified-PC1 ceiling`,
      );
    }
    if (
      [
        "compound-tradition",
        "bridge-tradition",
        "hybrid-configuration",
      ].includes(card.conceptualKind) &&
      (!card.m0HostId || !vnextOntologyById.has(card.m0HostId))
    ) {
      errors.push(`${card.labelId} lacks an authoritative M0 host`);
    }
    if (card.m0HostId && card.m0ModifierOrFacetIds.length === 0) {
      errors.push(`${card.labelId} lacks M0 facet/residual scope`);
    }
  }
  for (const labelId of [
    ...primaryScoringLabels.map((label) => label.id),
    ...SPECIALIST_LABEL_IDS,
  ]) {
    if (!labelIds.has(labelId))
      errors.push(`missing evidence card for ${labelId}`);
  }
  if (vnextPromotionRecords.length !== cards.length) {
    errors.push("promotion records do not have one-to-one card coverage");
  }
  for (const legacyId of RETIRED_LABEL_IDS) {
    const taxonomyCard = vnextEvidenceCardByLegacyId.get(legacyId);
    if (taxonomyCard && taxonomyCard.labelId === legacyId) {
      errors.push(
        `legacy ID ${legacyId} created a duplicate canonical evidence endpoint`,
      );
    }
  }
  return errors;
}

export function assertVNextEvidenceCards(): void {
  const errors = vnextEvidenceCardErrors();
  if (errors.length > 0)
    throw new Error(`vNext evidence-card violation: ${errors.join("; ")}`);
}

export function evidenceCardFor(
  labelId: string,
): VNextEvidenceCard | undefined {
  return (
    vnextEvidenceCardById.get(labelId) ??
    vnextEvidenceCardByLegacyId.get(labelId)
  );
}
