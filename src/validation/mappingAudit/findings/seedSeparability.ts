import type { AuditFinding } from "../types";
import {
  buildNearDuplicateFindings,
  separabilityDiagnostics,
} from "../separability/diagnostics";

/**
 * Append near-duplicate-centroid findings derived from separability diagnostics.
 * Findings remain lifecycle `proposed` (never auto-applied); empty when no
 * match-pool pair is closer than the near-duplicate distance threshold.
 */
export function seedSeparabilityFindings(): AuditFinding[] {
  return buildNearDuplicateFindings(separabilityDiagnostics);
}
