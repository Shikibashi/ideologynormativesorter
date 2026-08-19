import type { AssessmentResult } from "../../contracts/src";
import { canonicalJson, hasForbiddenKeys, utf8ByteLength } from "./canonical-json";
import { sha256Hex } from "./integrity";
import { MAX_PUBLIC_SHARE_BYTES, SHARE_SCHEMA_VERSION, PersistenceError } from "./types";

export interface PublicShareProfile {
  readonly profileId: string;
  readonly name: string;
  readonly similarity: number | null;
  readonly rank: number | null;
  readonly tieGroup: number | string | null;
  readonly status: "scored" | "abstained";
}

export interface PublicShareResult {
  readonly kind: "public-share";
  readonly shareSchemaVersion: typeof SHARE_SCHEMA_VERSION;
  readonly contentVersion: string;
  readonly scoringVersion: string;
  readonly resultSchemaVersion: string;
  readonly primaryMatches: readonly PublicShareProfile[];
  readonly primaryTie: {
    readonly isTie: boolean;
    readonly profileIds: readonly string[];
    readonly similarityDelta: number | null;
    readonly tolerance: number;
  };
  readonly modifiers: readonly { readonly modifierId: string; readonly name: string; readonly status: "active" | "inactive" | "below-threshold" | "unavailable"; readonly fit: number | null }[];
  readonly specialists: readonly { readonly moduleId: string; readonly status: string; readonly profiles: readonly PublicShareProfile[] }[];
  readonly evidenceSummary: { readonly status: string; readonly coreCoverage: number; readonly uncertaintyLevel: string };
  readonly methodologyMetadata: { readonly profileLanguage: "similarity"; readonly rawResponsesIncluded: false; readonly diagnosticsIncluded: false };
  readonly integrity?: { readonly algorithm: "sha256"; readonly digest: string };
}

function withoutIntegrity(value: PublicShareResult): Omit<PublicShareResult, "integrity"> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "integrity")) as Omit<PublicShareResult, "integrity">;
}

function shareProfiles(result: AssessmentResult, topN: number): readonly PublicShareProfile[] {
  const byId = new Map(result.primary.profiles.map((profile) => [String(profile.profileId), profile]));
  const ranking = result.primary.ranking.slice().sort((left, right) => left.rank - right.rank);
  if (ranking.length === 0) return result.primary.profiles.slice(0, topN).map((profile) => ({ profileId: String(profile.profileId), name: profile.name, similarity: profile.similarity, rank: profile.rank, tieGroup: profile.tieGroup, status: profile.status }));
  const cutoff = ranking[Math.min(topN, ranking.length) - 1];
  return ranking.filter((entry) => entry.rank <= cutoff.rank || entry.tieGroup === cutoff.tieGroup).map((entry) => byId.get(String(entry.profileId))).filter((profile): profile is NonNullable<typeof profile> => profile !== undefined).map((profile) => ({ profileId: String(profile.profileId), name: profile.name, similarity: profile.similarity, rank: profile.rank, tieGroup: profile.tieGroup, status: profile.status }));
}

export function projectPublicShare(result: AssessmentResult, options: { readonly topN?: number } = {}): PublicShareResult {
  const primaryMatches = shareProfiles(result, options.topN ?? 3);
  return {
    kind: "public-share",
    shareSchemaVersion: SHARE_SCHEMA_VERSION,
    contentVersion: String(result.contentVersion),
    scoringVersion: String(result.scoringVersion),
    resultSchemaVersion: String(result.resultSchemaVersion),
    primaryMatches,
    primaryTie: { isTie: result.primary.topTie.isTie, profileIds: result.primary.topTie.profileIds, similarityDelta: result.primary.topTie.similarityDelta, tolerance: result.primary.topTie.tolerance },
    modifiers: result.modifiers.filter((modifier) => modifier.status === "active").map((modifier) => ({ modifierId: modifier.modifierId, name: modifier.name, status: modifier.status, fit: modifier.fit })),
    specialists: result.specialists.modules.filter((module) => module.status === "scored").map((module) => ({ moduleId: module.moduleId, status: module.status, profiles: module.profiles.slice(0, options.topN ?? 3).map((profile) => ({ profileId: profile.profileId, name: profile.name, similarity: profile.similarity, rank: profile.rank, tieGroup: profile.tieGroup, status: profile.status })) })),
    evidenceSummary: { status: result.assessment.evidence.status, coreCoverage: result.assessment.evidence.coreCoverage, uncertaintyLevel: result.assessment.evidence.uncertaintyLevel },
    methodologyMetadata: { profileLanguage: "similarity", rawResponsesIncluded: false, diagnosticsIncluded: false },
  };
}

export function serializePublicShare(share: PublicShareResult): string {
  const base = withoutIntegrity(share);
  const serialized = canonicalJson({ ...base, integrity: { algorithm: "sha256", digest: sha256Hex(canonicalJson(base)) } });
  if (utf8ByteLength(serialized) > MAX_PUBLIC_SHARE_BYTES) throw new PersistenceError("SHARE_TOO_LARGE", "The public share exceeds the supported size limit.");
  return serialized;
}

export function parsePublicShare(serialized: string): PublicShareResult {
  if (utf8ByteLength(serialized) > MAX_PUBLIC_SHARE_BYTES) throw new PersistenceError("SHARE_TOO_LARGE", "The public share exceeds the supported size limit.");
  let value: unknown;
  try { value = JSON.parse(serialized); } catch { throw new PersistenceError("INVALID_SHARE", "The public share is not valid JSON."); }
  if (hasForbiddenKeys(value) || !value || typeof value !== "object" || (value as { kind?: unknown }).kind !== "public-share" || (value as { shareSchemaVersion?: unknown }).shareSchemaVersion !== SHARE_SCHEMA_VERSION) throw new PersistenceError("INVALID_SHARE", "The public share schema is invalid.");
  const share = value as PublicShareResult;
  if (!share.integrity || share.integrity.algorithm !== "sha256" || share.integrity.digest !== sha256Hex(canonicalJson(withoutIntegrity(share)))) throw new PersistenceError("SHARE_INTEGRITY_FAILED", "The public share integrity check failed.");
  return share;
}
