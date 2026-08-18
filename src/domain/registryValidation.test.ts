import { describe, expect, it } from "vitest";
import {
  CANONICAL_MANIFEST_SCHEMA_VERSION,
  type CanonicalManifest,
} from "./canonicalManifest";
import { validateCanonicalManifest } from "./registryValidation";

const status = {
  conceptualStatus: "canonical" as const,
  measurementStatus: "validated" as const,
  publicRoleStatus: "primary" as const,
};

const validManifest: CanonicalManifest = {
  metadata: {
    schemaVersion: CANONICAL_MANIFEST_SCHEMA_VERSION,
    version: "test",
    fingerprint: null,
  },
  taxonomy: [{ ...status, id: "taxonomy/example", name: "Example" }],
  ontology: [],
  constructs: [
    {
      ...status,
      id: "construct/example",
      name: "Example construct",
      taxonomyId: "taxonomy/example",
    },
  ],
  facets: [],
  items: [
    {
      ...status,
      id: "item/example",
      prompt: "Example item",
      constructIds: ["construct/example"],
    },
  ],
  mappings: [
    {
      ...status,
      id: "mapping/example",
      source: { kind: "item", id: "item/example" },
      target: { kind: "construct", id: "construct/example" },
      relation: "measures",
      weight: 1,
    },
  ],
  contexts: {
    taxonomy: [
      {
        ...status,
        id: "context/taxonomy/example",
        namespace: "taxonomy",
        publicRoleStatus: "context",
        measurementStatus: "unmeasured",
      },
    ],
    question: [],
  },
};

describe("canonical manifest validation", () => {
  it("accepts valid references, mappings, and separate Context namespaces", () => {
    const result = validateCanonicalManifest(validManifest);
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("reports duplicate IDs, missing references, and duplicate authority", () => {
    const invalid: CanonicalManifest = {
      ...validManifest,
      taxonomy: [
        { ...validManifest.taxonomy[0], authorityKey: "same" },
        { ...validManifest.taxonomy[0], authorityKey: "same" },
        { ...validManifest.taxonomy[0], authorityKey: "same" },
      ],
      constructs: [
        {
          ...validManifest.constructs[0],
          id: "construct/duplicate",
          taxonomyId: "taxonomy/missing",
        },
      ],
    };
    const result = validateCanonicalManifest(invalid);
    expect(result.issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining([
        "duplicate-id",
        "missing-reference",
        "duplicate-authority",
      ]),
    );
  });

  it("rejects namespace mismatches and context role leakage", () => {
    const invalid: CanonicalManifest = {
      ...validManifest,
      contexts: {
        taxonomy: [
          {
            ...validManifest.contexts.taxonomy[0],
            namespace: "question",
            measurementStatus: "validated",
          },
        ],
        question: [],
      },
      mappings: [
        {
          ...validManifest.mappings[0],
          target: { kind: "context", id: "context/taxonomy/example" },
        },
      ],
    };
    const result = validateCanonicalManifest(invalid);
    expect(result.issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["context-namespace", "role-leakage"]),
    );
  });
  it("fails closed for malformed metadata, names, statuses, and containers", () => {
    const malformed = {
      ...validManifest,
      metadata: null,
      taxonomy: [{ ...validManifest.taxonomy[0], name: { invalid: true } }],
      contexts: { taxonomy: null, question: [] },
      items: [{ ...validManifest.items[0], constructIds: "construct/example" }],
    };
    expect(() =>
      validateCanonicalManifest(malformed as unknown as CanonicalManifest),
    ).not.toThrow();
    const result = validateCanonicalManifest(
      malformed as unknown as CanonicalManifest,
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((entry) => entry.code === "invalid-shape")).toBe(
      true,
    );
    expect(() =>
      validateCanonicalManifest(null as unknown as CanonicalManifest),
    ).not.toThrow();
  });
});
