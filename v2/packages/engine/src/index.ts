export {
  createEngineContentIndex,
  getEngineConstruct,
  getEngineItem,
} from "./content-index";
export { prepareAssessmentResponses } from "./responses/prepare-assessment";
export {
  computeItemContributions,
  computeSalienceFactor,
} from "./contributions/compute-item-contribution";
export { computeContributions } from "./contributions/compute-contributions";
export {
  normalizeResponse,
  normalizeResponses,
} from "./responses/normalize-response";
export { validateAssessmentResponses } from "./responses/validate-response";
export {
  ENGINE_ERROR_CODES,
  ScoringError,
  throwScoringError,
} from "./errors/scoring-error";
export type {
  EngineErrorCode,
  EngineErrorCategory,
  ScoringErrorIssue,
} from "./errors/scoring-error";
export type {
  PreparedAssessment,
  PreparedResponseSummary,
  SalienceComputation,
  ValidatedAssessmentResponses,
  SpecialistPreparedAssessment,
  SpecialistPreparedModule,
} from "./types";
export type {
  EngineContentIndex,
  EngineContentScope,
  EngineConstruct,
  EngineItem,
  EngineResponseType,
} from "./content-index";
export { aggregateConstruct } from "./constructs/aggregate-construct";
export { computeConstructEvidence } from "./constructs/evidence";
export { determineConstructScorability } from "./constructs/scorability";
export {
  scoreConstructLayer,
  scoreConstructs,
} from "./constructs/score-constructs";
export { CONSTRUCT_NUMERIC_TOLERANCE } from "./constructs/numeric";
export type {
  ConstructAssessment,
  ConstructEvidence,
  ConstructResult,
  ConstructSupportSummary,
} from "../../contracts/src/constructs";
export {
  MODIFIER_DEFAULT_EVIDENCE_THRESHOLD,
  MODIFIER_DEFAULT_FIT_THRESHOLD,
  MODIFIER_MAX_ACTIVE_UNCERTAINTY,
  matchModifiers,
  scoreModifiers,
} from "./modifiers";
export {
  evaluateModifierGates,
  validateModifierGateConfiguration,
} from "./modifiers";
export type {
  ModifierAssessment,
  ModifierEvidence,
  ModifierGateEvaluation,
  ModifierIndicatorComparison,
  ModifierResult,
  ModifierUncertainty,
} from "../../contracts/src/modifiers";
export {
  prepareSpecialistAssessment,
  scoreSpecialistModules,
  scoreSpecialists,
} from "./specialists";
export type {
  SpecialistAssessment,
  SpecialistAssessmentInput,
  SpecialistModuleEvidence,
  SpecialistModuleResult,
  SpecialistProfileMatchResult,
} from "../../contracts/src/specialists";
export {
  emptyProfileEvidence,
  evaluateConstitutiveGates,
  evaluatePrimaryProfileEvidence,
  matchPrimaryProfiles,
  PROFILE_MAX_DISTANCE,
  PROFILE_TIE_TOLERANCE,
  rankPrimaryProfiles,
  scorePrimaryProfiles,
  validatePrimaryProfileConfiguration,
} from "./profiles";
export type {
  PrimaryProfileAssessment,
  PrimaryProfileMatchResult,
  PrimaryProfileRankingEntry,
  ProfileGateEvaluation,
  ScoredPrimaryProfile,
  AbstainedPrimaryProfile,
} from "../../contracts/src/profiles";
export {
  buildAssessmentDiagnostics,
  buildConstructDiagnostics,
  buildContributionTrace,
  buildDomainSummaries,
  buildModifierDiagnostics,
  buildProfileDiagnostics,
  buildSpecialistDiagnostics,
  analyzeConstructDivergences,
  contributionIdentity,
  DiagnosticsError,
} from "./diagnostics";
export type {
  AssessmentDiagnostics,
  ConstructDiagnostic,
  ContributionTrace,
  DivergenceDiagnostic,
  DomainSummaryDiagnostic,
  ModifierDiagnostic,
  ProfileDiagnostic,
  SpecialistDiagnostic,
} from "./diagnostics";

// Public end-to-end API. The lower-level exports above remain advanced/testable
// primitives so consumers do not need to compose scoring layers themselves.
export {
  assembleAssessmentResult,
  scoreAssessment,
  serializeAssessmentResult,
  validateAssessmentInput,
  validateAssessmentResult,
  SUPPORTED_CONTENT_SCHEMA_VERSION,
  SUPPORTED_RESPONSE_SCHEMA_VERSION,
  SUPPORTED_RESULT_SCHEMA_VERSION,
  SUPPORTED_SCORING_VERSION,
} from "./assessment";
export type { AssessmentLayers } from "./assessment";
export type {
  AssessmentEvidenceSummary,
  AssessmentInput,
  AssessmentPrimaryResult,
  AssessmentResponseSummary,
  AssessmentResult,
  AssessmentSpecialistModuleResult,
  AssessmentSpecialistResult,
  AssessmentStatus,
  AssessmentSummary,
} from "../../contracts/src/results";
