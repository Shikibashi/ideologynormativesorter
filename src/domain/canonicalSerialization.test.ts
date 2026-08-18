import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  canonicalize,
  canonicalizeBytes,
  CanonicalJsonError,
  parseCanonicalJson,
  sha256Canonical,
} from "./canonicalSerialization";

type Vector = {
  name: string;
  value: unknown;
  schema?: { arrays?: Record<string, "ordered" | "set"> };
  canonical: string;
  sha256: string;
};

type VectorFixture = { version: string; vectors: Vector[] };

const fixtureSource = readFileSync(
  join(
    process.cwd(),
    "tests/fixtures/canonical-serialization/canonical-json-v1.json",
  ),
  "utf8",
);
const fixture = parseCanonicalJson(fixtureSource) as VectorFixture;

describe("canonical-json-v1", () => {
  it("loads shared vectors and preserves their byte-exact forms", async () => {
    expect(fixture.version).toBe("canonical-json-v1");
    for (const vector of fixture.vectors) {
      const canonical = canonicalize(vector.value, vector.schema);
      expect(canonical, vector.name).toBe(vector.canonical);
      expect(
        await sha256Canonical(vector.value, vector.schema),
        vector.name,
      ).toBe(vector.sha256);
    }
  });

  it("normalizes strings to NFC and applies JSON escaping", () => {
    expect(canonicalize("e\u0301")).toBe('"é"');
    expect(canonicalize('quote " \\ newline\n tab\t')).toBe(
      '"quote \\" \\\\ newline\\n tab\\t"',
    );
    expect(Array.from(canonicalizeBytes("é"))).toEqual([
      0x22, 0xc3, 0xa9, 0x22,
    ]);
  });

  it("rejects duplicate keys before object creation", () => {
    expect(() => parseCanonicalJson('{"key":1,"key":2}')).toThrow(
      CanonicalJsonError,
    );
    expect(() => parseCanonicalJson('{"é":1,"é":2}')).toThrow(
      CanonicalJsonError,
    );
  });

  it("rejects unsupported and invalid values instead of coercing them", () => {
    expect(() => canonicalize(Number.NaN)).toThrow(CanonicalJsonError);
    expect(() => canonicalize(Number.POSITIVE_INFINITY)).toThrow(
      CanonicalJsonError,
    );
    expect(() => canonicalize(1n)).toThrow(CanonicalJsonError);
    expect(() => canonicalize(Symbol("unsupported"))).toThrow(
      CanonicalJsonError,
    );
    expect(() => canonicalize("\ud800")).toThrow(CanonicalJsonError);
    expect(() => parseCanonicalJson('"\\ud800"')).toThrow(CanonicalJsonError);

    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    expect(() => canonicalize(cyclic)).toThrow(CanonicalJsonError);

    const sparse = [] as unknown[];
    sparse.length = 1;
    expect(() => canonicalize(sparse)).toThrow(CanonicalJsonError);
  });

  it("normalizes negative zero, keeps null, and omits undefined object members", () => {
    expect(canonicalize(-0)).toBe("0");
    expect(
      canonicalize({ value: -0, nullValue: null, omitted: undefined }),
    ).toBe('{"nullValue":null,"value":0}');
    expect(() => canonicalize([undefined])).toThrow(CanonicalJsonError);
  });

  it("sorts object keys while preserving ordered arrays", () => {
    expect(canonicalize({ z: 1, a: 2, nested: { y: 1, x: 0 } })).toBe(
      '{"a":2,"nested":{"x":0,"y":1},"z":1}',
    );
    expect(canonicalize([2, 1])).toBe("[2,1]");
  });

  it("requires set semantics to be explicit and sorts set members", () => {
    const schema = { arrays: { "/tags": "set" as const } };
    expect(canonicalize({ tags: ["beta", "alpha"] }, schema)).toBe(
      '{"tags":["alpha","beta"]}',
    );
    expect(() => canonicalize({ tags: ["alpha", "alpha"] }, schema)).toThrow(
      CanonicalJsonError,
    );
    expect(canonicalize({ tags: ["😀", "é"] }, schema)).toBe(
      '{"tags":["é","😀"]}',
    );
    expect(canonicalize({ tags: ["beta", "alpha"] })).toBe(
      '{"tags":["beta","alpha"]}',
    );
  });

  it("computes the SHA-256 digest of canonical UTF-8 bytes", async () => {
    expect(await sha256Canonical({ b: 2, a: 1 })).toBe(
      "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
    );
  });
});
