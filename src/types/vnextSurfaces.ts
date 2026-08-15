export const VNEXT_ANALYSIS_SURFACES = [
  "core",
  "specialist",
  "research-task",
  "expert-review",
  "bridge",
] as const;
export type VNextAnalysisSurface = (typeof VNEXT_ANALYSIS_SURFACES)[number];

export interface VNextSurfaceManifest {
  manifestId: string;
  manifestVersion: string;
  surface: VNextAnalysisSurface;
  status: "active-design" | "research-only" | "not-applicable";
  moduleIds: readonly string[];
  formIds: readonly string[];
  itemIds: readonly string[];
  itemFingerprint: string;
  formFingerprint: string;
  constructScope: readonly string[];
  candidateCodeRevision: string;
  frozenProductionBaselineRevision: string;
  versionTuple: Readonly<Record<string, string>>;
  provenance: readonly string[];
}
