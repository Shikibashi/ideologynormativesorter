import { describe, expect, it } from "vitest";
import { sha256Canonical } from "./canonicalSerialization";
import {
  CANONICAL_MANIFEST,
  CANONICAL_MANIFEST_FINGERPRINT,
  CANONICAL_MANIFEST_SCHEMA_VERSION,
  CANONICAL_MANIFEST_VERSION,
  canonicalManifestFingerprintInput,
  type CanonicalManifest,
} from "./canonicalManifest";

const emptyManifest: CanonicalManifest = {
  metadata: {
    schemaVersion: CANONICAL_MANIFEST_SCHEMA_VERSION,
    version: "test",
    fingerprint: null,
  },
  taxonomy: [],
  ontology: [],
  constructs: [],
  facets: [],
  items: [],
  mappings: [],
  contexts: { taxonomy: [], question: [] },
};

describe("canonical manifest", () => {
  it("exports an immutable canonical authority with both Context namespaces", () => {
    expect(CANONICAL_MANIFEST.metadata.schemaVersion).toBe(
      CANONICAL_MANIFEST_SCHEMA_VERSION,
    );
    expect(CANONICAL_MANIFEST.metadata.version).toBe(
      CANONICAL_MANIFEST_VERSION,
    );
    expect(CANONICAL_MANIFEST.contexts.taxonomy).toHaveLength(19);
    expect(CANONICAL_MANIFEST.contexts.question).toEqual([]);
    expect(CANONICAL_MANIFEST.constructs).toHaveLength(26);
    expect(CANONICAL_MANIFEST.items).toHaveLength(406);
    expect(CANONICAL_MANIFEST.metadata.fingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(Object.isFrozen(CANONICAL_MANIFEST)).toBe(true);
    expect(Object.isFrozen(CANONICAL_MANIFEST.metadata)).toBe(true);
    expect(Object.isFrozen(CANONICAL_MANIFEST.contexts)).toBe(true);
    expect(Object.isFrozen(CANONICAL_MANIFEST.items)).toBe(true);
  });

  it("hashes the versioned manifest payload deterministically", async () => {
    expect(await sha256Canonical(canonicalManifestFingerprintInput())).toBe(
      CANONICAL_MANIFEST_FINGERPRINT,
    );
  });

  it("keeps the test manifest shape usable without legacy data", () => {
    expect(emptyManifest.items).toHaveLength(0);
    expect(emptyManifest.mappings).toHaveLength(0);
  });
});
