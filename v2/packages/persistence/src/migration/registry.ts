import { SAVE_SCHEMA_VERSION } from "../types";

export interface SaveMigrationStep {
  readonly from: string;
  readonly to: string;
  readonly loss: "LOSSLESS" | "LOSSY" | "IMPOSSIBLE";
  readonly status: "supported" | "unsupported";
}

export const SAVE_MIGRATION_REGISTRY: readonly SaveMigrationStep[] = Object.freeze([
  { from: SAVE_SCHEMA_VERSION, to: SAVE_SCHEMA_VERSION, loss: "LOSSLESS", status: "supported" },
]);
