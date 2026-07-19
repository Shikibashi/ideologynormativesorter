import type { AxisId, LabelId, QuestionId, ResponseType, Layer, TheoryContext } from '../../types/common'

// ---------------------------------------------------------------------------
// Union-type enums
// ---------------------------------------------------------------------------

export type CorpusId = 'main' | 'module' | 'statement'

export type InventorySetId =
  | 'raw'
  | 'overlay'
  | 'effective-active'
  | 'effective-retained'
  | 'post-correction-active'
  | 'post-correction-retained'

export type IssueClass =
  | 'sign-inversion'
  | 'construct-mismatch'
  | 'template-carryover'
  | 'double-barreled'
  | 'non-discriminating'
  | 'underspecified'
  | 'hierarchy-inconsistency'
  | 'centroid-invalid'
  | 'near-duplicate-centroid'
  | 'insufficient-discriminator'
  | 'perturbation-instability'
  | 'evidence-strength'
  | 'misleading-tie'
  | 'layer-conflation'
  | 'non-separable-label'
  | 'affinity-quarantine'
  | 'version-drift'
  | 'copy-overclaim'

export type Severity = 'blocker' | 'major' | 'minor' | 'info'

export type GateKind = 'textual' | 'expert' | 'empirical' | 'artifact' | 'test'

export type GateStatus =
  | 'not-started'
  | 'in-review'
  | 'pass'
  | 'fail'
  | 'insufficient-data'
  | 'deferred'

export type ReviewerRole = 'domain' | 'measurement' | 'adjudicator'

export type ReviewerQualificationStatus = 'provisional-agent' | 'qualified-expert'

export type Disposition =
  | 'no-change'
  | 'correct-overlay'
  | 'correct-source'
  | 'deactivate'
  | 'merge'
  | 'construct-split'
  | 'reactivate-after-measurement'
  | 'park-separability'
  | 'reject-forced-spread'

export type FindingLifecycle =
  | 'proposed'
  | 'domain-reviewed'
  | 'measurement-reviewed'
  | 'adjudicated'
  | 'approved'
  | 'applied'
  | 'superseded'

export type LabelLifecycle =
  | 'active'
  | 'deactivated'
  | 'merged-away'
  | 'split-pending'
  | 'split-active'
  | 'survivor'

export type PerspectiveKind = 'sympathetic' | 'critical' | 'neutral'

export type CitationKind = 'primary-text' | 'scholarly' | 'secondary-seed'

export type VersionBumpClass =
  | 'question-bank'
  | 'semantic-overlay'
  | 'centroid-taxonomy'
  | 'scoring-algorithm'
  | 'none'

// ---------------------------------------------------------------------------
// Core record interfaces
// ---------------------------------------------------------------------------

export interface ResponseContributionRecord {
  id: string // rc:{questionId}:{responseKey}:{axisId}
  corpus: CorpusId
  inventorySet: InventorySetId
  questionId: QuestionId
  responseKey: string
  responseType: ResponseType
  responseValue: number | string | null
  reverseScored: boolean
  layer: Layer
  theoryContext: TheoryContext
  axisId: AxisId
  configuredWeight: number
  normalizedUnit: number | null
  salience: number
  effectiveSignedContribution: number | null
  exclusionReason: string | null
  constructRationale: string // required before approval
  evidenceCiteIds: string[]
  domainReviewId?: string
  measurementReviewId?: string
  adjudicationReviewId?: string
  disposition: Disposition
  linkedTestIds: string[]
  bankVersion: string
  overlayVersion: string
  scoringVersion: string
}

export interface PerspectiveEntry {
  text?: string
  unavailableReason?: string
}

export interface ClaimMatrixEntry {
  claimId: string // claim:{labelId}:{fieldPath}:{n}
  labelId: LabelId
  fieldPath: string // e.g. 'definition', 'family', 'centroid.authority-legitimacy'
  statement: string
  primaryCiteId: string
  scholarlyCiteIds: string[] // length >= 2
  perspectives: Record<PerspectiveKind, PerspectiveEntry>
  textualStatus: GateStatus
  expertStatus: GateStatus
  empiricalStatus: GateStatus // must be 'insufficient-data' or 'deferred' until pilot
}

export interface IdeologyDossier {
  dossierId: string // dossier:{labelId}
  labelId: LabelId
  lifecycle: LabelLifecycle
  family: string
  subfamily?: string
  aliases: string[]
  survivorOf: LabelId[]
  mergedInto?: LabelId
  splitFrom?: LabelId
  claims: ClaimMatrixEntry[]
  centroid: Record<AxisId, number> // every AxisId in [-1,1]
  centroidRationales: Record<AxisId, string>
  cautionNote?: string
  usageNote?: string
  matchPoolMember: boolean
  linkedFindingIds: string[]
  linkedTestIds: string[]
  provisionalExpertOnly: boolean
}

export interface ReviewRecord {
  reviewId: string // review:{findingId}:{role}:{seq}
  findingId: string
  role: ReviewerRole
  qualificationStatus: ReviewerQualificationStatus
  reviewerKey: string
  decision: Disposition
  rationale: string
  evidenceCiteIds: string[]
  timestamp: string // ISO
  bankVersion: string
  scoringVersion: string
  supersedesReviewId?: string
  linkedTestIds: string[]
}

export interface AuditFinding {
  findingId: string // finding:{issueClass}:{subjectId}:{n}
  severity: Severity
  issueClass: IssueClass
  subjectIds: string[]
  inventorySet: InventorySetId
  evidence: string
  evidenceCiteIds: string[]
  proposedDisposition: Disposition
  domainReviewId?: string
  measurementReviewId?: string
  adjudicationReviewId?: string
  lifecycle: FindingLifecycle
  resultingChange?: string
  versionImpact: VersionBumpClass
  linkedTestIds: string[]
  supersedesFindingId?: string
}

export interface ValidationGateRecord {
  gate: GateKind
  status: GateStatus
  subjectId: string
  updatedAt: string // ISO
  evidenceRefs: string[]
}

export interface CitationRecord {
  citeId: string // cite:{sha256-16 of normalized URL or bib key}
  kind: CitationKind
  title: string
  authors: string[]
  year?: number
  venue?: string
  url?: string
  normalizedUrl?: string
}

export interface InventorySnapshot {
  snapshotId: string // inv:{set}:{corpus-or-catalog}:{isoDate}
  inventorySet: InventorySetId
  corpus: CorpusId | 'catalog'
  generatedAt: string // ISO
  questionCount?: number
  labelCount?: number
  axisCount?: number
  familyCount?: number
  bankVersion: string
  overlayVersion?: string
  scoringVersion: string
  fingerprint: string
}

export interface ReleaseSummary {
  releaseId: string // release:{bankVersion}:{scoringVersion}
  generatedAt: string
  generatedFrom: {
    bankFingerprint: string
    scoringVersion: string
  }
  lastAppliedDispositionTimestamp?: string
  totalContributions: number
  totalDossiers: number
  totalFindings: number
  unresolvedActiveCount: number
  gateStatuses: ValidationGateRecord[]
  linkedTestIds: string[]
}
