import { parsePrivateAssessmentSave, serializePrivateAssessmentSave } from "./schema";
import { PRIVATE_SAVE_STORAGE_KEY, type AssessmentSaveStore, type PrivateAssessmentSave, type ParsedSaveResult } from "../types";

function browserStorage(): Storage | undefined {
  return typeof globalThis.localStorage === "undefined" ? undefined : globalThis.localStorage;
}

export class LocalStorageAssessmentSaveStore implements AssessmentSaveStore {
  constructor(private readonly storage: Storage | undefined = browserStorage()) {}

  save(save: PrivateAssessmentSave): { saved: true } | { saved: false; reason: string } {
    try {
      const serialized = serializePrivateAssessmentSave(save);
      if (!this.storage) return { saved: false, reason: "Browser storage is unavailable." };
      this.storage.setItem(PRIVATE_SAVE_STORAGE_KEY, serialized);
      return { saved: true };
    } catch (error) {
      return { saved: false, reason: error instanceof Error ? error.message : "The save could not be written." };
    }
  }

  load(): ParsedSaveResult {
    try {
      const serialized = this.storage?.getItem(PRIVATE_SAVE_STORAGE_KEY);
      if (!serialized) return { status: "missing", freshness: { kind: "corrupted", reason: "missing_save" }, warnings: [] };
      return parsePrivateAssessmentSave(serialized);
    } catch {
      return { status: "corrupted", freshness: { kind: "corrupted", reason: "malformed_json" }, warnings: [], error: "The saved assessment could not be read." };
    }
  }

  remove(): boolean {
    try { this.storage?.removeItem(PRIVATE_SAVE_STORAGE_KEY); return true; } catch { return false; }
  }
}

export class MemoryAssessmentSaveStore extends LocalStorageAssessmentSaveStore {
  constructor() {
    const values = new Map<string, string>();
    super({
      get length() { return values.size; },
      clear() { values.clear(); },
      getItem(key: string) { return values.get(key) ?? null; },
      key(index: number) { return [...values.keys()][index] ?? null; },
      removeItem(key: string) { values.delete(key); },
      setItem(key: string, value: string) { values.set(key, value); },
    });
  }
}

export function createBrowserAssessmentSaveStore(): AssessmentSaveStore {
  return new LocalStorageAssessmentSaveStore();
}
