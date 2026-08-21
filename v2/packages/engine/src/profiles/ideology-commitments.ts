import type {
  CommitmentCriterion as ContentCommitmentCriterion,
  CommitmentRelation,
  PrimaryProfileRecord,
  SpecialistCommitmentRecord,
} from "../../../contracts/src/content";

export const PRIMARY_COMMITMENT_RELATIONS = [
  "constitutive",
  "core",
  "characteristic",
  "contested",
  "compatible",
  "peripheral",
  "incompatible",
] as const;

export type PrimaryCommitmentRelation = CommitmentRelation;
export type CommitmentCriterion = ContentCommitmentCriterion;
export type PrimaryIdeologyCommitment = SpecialistCommitmentRecord;

export interface PrimaryIdeologyCommitmentSpec {
  readonly profileId: string;
  readonly modelVersion: string;
  readonly rationale: string;
  readonly commitments: readonly PrimaryIdeologyCommitment[];
}

export const DEMOTED_PRIMARY_PROFILE_IDS = Object.freeze([
  "profile:liberal-conservatism",
  "profile:market-liberal",
  "profile:national-conservatism",
  "profile:radical-democracy",
] as const);
const demotedPrimaryIds = new Set<string>(DEMOTED_PRIMARY_PROFILE_IDS);

export function getPrimaryIdeologyCommitmentSpec(
  profile: PrimaryProfileRecord,
): PrimaryIdeologyCommitmentSpec | undefined {
  if (!profile.commitments?.length) return undefined;
  return {
    profileId: String(profile.id),
    modelVersion: profile.version ?? "primary-commitment-unspecified",
    rationale: profile.rationale ?? profile.name,
    commitments: profile.commitments,
  };
}

export function isDemotedPrimaryProfile(profileId: string): boolean {
  return demotedPrimaryIds.has(profileId);
}

export function commitmentCriterionSatisfied(
  score: number,
  criterion: CommitmentCriterion,
): boolean {
  switch (criterion.operator) {
    case "minimum": return score >= criterion.minimum;
    case "maximum": return score <= criterion.maximum;
    case "interval": return score >= criterion.minimum && score <= criterion.maximum;
  }
}

export function commitmentCriterionAnchor(criterion: CommitmentCriterion): number {
  switch (criterion.operator) {
    case "minimum": return criterion.minimum;
    case "maximum": return criterion.maximum;
    case "interval": return (criterion.minimum + criterion.maximum) / 2;
  }
}

export function commitmentAffinityWeight(relation: PrimaryCommitmentRelation): number {
  if (relation === "core") return 2;
  if (relation === "characteristic") return 1;
  return 0;
}

export function isAffinityCommitment(commitment: PrimaryIdeologyCommitment): boolean {
  return commitmentAffinityWeight(commitment.relation) > 0 && commitment.criterion !== undefined;
}

export function isDecisiveCommitment(commitment: PrimaryIdeologyCommitment): boolean {
  return (commitment.relation === "constitutive" || commitment.relation === "incompatible") && commitment.criterion !== undefined;
}
