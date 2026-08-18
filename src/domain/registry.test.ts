import { describe, expect, it } from "vitest";
import {
  CANONICAL_MANIFEST_SCHEMA_VERSION,
  type CanonicalManifest,
} from "./canonicalManifest";
import { createCanonicalRegistry } from "./registry";

const manifest: CanonicalManifest = {
  metadata: {
    schemaVersion: CANONICAL_MANIFEST_SCHEMA_VERSION,
    version: "test",
    fingerprint: null,
  },
  taxonomy: [
    {
      id: "taxonomy/example",
      name: "Example",
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
  ],
  ontology: [],
  constructs: [],
  facets: [],
  items: [],
  mappings: [],
  contexts: { taxonomy: [], question: [] },
};

describe("canonical registry", () => {
  it("looks up entries by kind and stable ID", () => {
    const registry = createCanonicalRegistry(manifest);
    expect(registry.get("taxonomy", "taxonomy/example")?.name).toBe("Example");
    expect(registry.get("taxonomy", "missing")).toBeUndefined();
  });

  it("iterates in manifest order without exposing mutable arrays", () => {
    const registry = createCanonicalRegistry(manifest);
    expect([...registry.iterate("taxonomy")].map((entry) => entry.id)).toEqual([
      "taxonomy/example",
    ]);
    expect(registry.list("taxonomy")).toBe(manifest.taxonomy);
  });
});
