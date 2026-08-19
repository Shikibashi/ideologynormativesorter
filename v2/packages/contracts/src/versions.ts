import { Branded } from "./ids";

export type ContentSchemaVersion = Branded<"ContentSchemaVersion">;
export type ContentVersion = Branded<"ContentVersion">;
export type ContentFingerprint = Branded<"ContentFingerprint">;
export type ScoringVersion = Branded<"ScoringVersion">;
export type ResultSchemaVersion = Branded<"ResultSchemaVersion">;
export type ResponseSchemaVersion = Branded<"ResponseSchemaVersion">;
export type ResearchSchemaVersion = Branded<"ResearchSchemaVersion">;

export const createContentSchemaVersion = (
  value: string,
): ContentSchemaVersion => value as ContentSchemaVersion;
export const createContentVersion = (value: string): ContentVersion =>
  value as ContentVersion;
export const createContentFingerprint = (value: string): ContentFingerprint =>
  value as ContentFingerprint;
export const createScoringVersion = (value: string): ScoringVersion =>
  value as ScoringVersion;
export const createResultSchemaVersion = (value: string): ResultSchemaVersion =>
  value as ResultSchemaVersion;
export const createResponseSchemaVersion = (value: string): ResponseSchemaVersion =>
  value as ResponseSchemaVersion;
export const createResearchSchemaVersion = (value: string): ResearchSchemaVersion =>
  value as ResearchSchemaVersion;

export interface VersionFields {
  contentSchemaVersion: ContentSchemaVersion;
  contentVersion: ContentVersion;
  scoringVersion: ScoringVersion;
  responseSchemaVersion: ResponseSchemaVersion;
  resultSchemaVersion: ResultSchemaVersion;
  researchSchemaVersion: ResearchSchemaVersion;
  contentFingerprint: ContentFingerprint;
}
