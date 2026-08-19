import type { DiagnosticsInput, AssessmentDiagnostics } from "../../../contracts/src/diagnostics";
import { DIAGNOSTICS_VERSION } from "../../../contracts/src/diagnostics";
import { deepFreeze, DiagnosticsError } from "./common";
import { buildContributionTrace } from "./contribution-trace";
import { buildConstructDiagnostics } from "./construct-diagnostics";
import { analyzeConstructDivergences } from "./divergence";
import { buildDomainSummaries } from "./domain-summary";
import { buildProfileDiagnostics } from "./profile-diagnostics";
import { buildModifierDiagnostics } from "./modifier-diagnostics";
import { buildSpecialistDiagnostics } from "./specialist-diagnostics";

function assertVersion(value: { readonly responseSchemaVersion?: string; readonly scoringVersion?: string; readonly contentVersion?: string; readonly contentFingerprint?: string; readonly resultSchemaVersion?: string }, input: DiagnosticsInput): void {
  const metadata = input.bundle.metadata;
  for (const key of ["responseSchemaVersion", "scoringVersion", "contentVersion", "contentFingerprint", "resultSchemaVersion"] as const) {
    if (value[key] !== undefined && String(value[key]) !== String(metadata[key])) throw new DiagnosticsError(`Diagnostics input version mismatch for ${key}`);
  }
}

export function buildAssessmentDiagnostics(input: DiagnosticsInput): AssessmentDiagnostics {
  assertVersion(input.constructs, input);
  if (input.profiles) assertVersion(input.profiles, input);
  if (input.modifiers) assertVersion(input.modifiers, input);
  if (input.specialists) assertVersion(input.specialists, input);
  const contributions = buildContributionTrace(input.constructs, input.bundle);
  const constructs = buildConstructDiagnostics(input.constructs, input.bundle, contributions);
  const divergences = analyzeConstructDivergences(input.constructs, input.bundle, input.divergenceRelations);
  return deepFreeze({
    diagnosticsVersion: DIAGNOSTICS_VERSION,
    responseSchemaVersion: input.constructs.responseSchemaVersion,
    scoringVersion: input.constructs.scoringVersion,
    contentVersion: input.constructs.contentVersion,
    contentFingerprint: input.constructs.contentFingerprint,
    resultSchemaVersion: input.constructs.resultSchemaVersion,
    contributions,
    constructs,
    divergences,
    domains: buildDomainSummaries(input.bundle, constructs, divergences),
    profiles: buildProfileDiagnostics(input.profiles),
    modifiers: buildModifierDiagnostics(input.modifiers, input.constructs, contributions),
    specialists: buildSpecialistDiagnostics(input.specialists, input.bundle),
    evidence: {
      constructCoverage: input.constructs.constructs.length === 0 ? 0 : constructs.filter((result) => result.status === "scored").length / constructs.length,
      scoredConstructCount: constructs.filter((result) => result.status === "scored").length,
      abstainedConstructCount: constructs.filter((result) => result.status === "abstained").length,
      missingResponseCount: input.constructs.responseSummary.missingCount,
      skippedResponseCount: input.constructs.responseSummary.skippedCount,
      abstainedResponseCount: input.constructs.responseSummary.abstainedCount,
      refusedResponseCount: input.constructs.responseSummary.refusedCount,
    },
  });
}
