/**
 * The canonical-json-v1 wire contract.
 *
 * This module deliberately accepts only JSON-shaped values. JavaScript values
 * which do not have a lossless JSON representation are rejected rather than
 * being coerced by JSON.stringify (for example, NaN and undefined in arrays).
 */

export const CANONICAL_JSON_VERSION = "canonical-json-v1" as const;

export type CanonicalArraySemantics = "ordered" | "set";

export interface CanonicalSerializationSchema {
  /** Semantics used by arrays which do not have a path-specific declaration. */
  readonly arraySemantics?: CanonicalArraySemantics;
  /** JSON-pointer paths (for example, `/labels`) and their array semantics. */
  readonly arrays?: Readonly<Record<string, CanonicalArraySemantics>>;
}

/** Alias retained as the short name used by callers describing a schema. */
export type CanonicalSchema = CanonicalSerializationSchema;

export class CanonicalJsonError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "CanonicalJsonError";
  }
}

const hasOwn = (value: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

function pathForProperty(path: string, key: string): string {
  const escaped = key.replaceAll("~", "~0").replaceAll("/", "~1");
  return `${path}/${escaped}`;
}

function pathForIndex(path: string, index: number): string {
  return `${path}/${index}`;
}

function assertWellFormedUnicode(value: string, path: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (index + 1 >= value.length || next < 0xdc00 || next > 0xdfff) {
        throw new CanonicalJsonError(
          `Unpaired UTF-16 surrogate at ${path || "/"}`,
        );
      }
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new CanonicalJsonError(
        `Unpaired UTF-16 surrogate at ${path || "/"}`,
      );
    }
  }
}

function encodeString(value: string, path: string): string {
  assertWellFormedUnicode(value, path);
  const normalized = value.normalize("NFC");
  const encoded = JSON.stringify(normalized);
  if (encoded === undefined) {
    throw new CanonicalJsonError(`Unable to encode string at ${path || "/"}`);
  }
  return encoded;
}

function encodeNumber(value: number, path: string): string {
  if (!Number.isFinite(value)) {
    throw new CanonicalJsonError(`Non-finite number at ${path || "/"}`);
  }
  if (Object.is(value, -0)) return "0";
  const encoded = JSON.stringify(value);
  if (encoded === undefined || encoded === "null") {
    throw new CanonicalJsonError(`Unable to encode number at ${path || "/"}`);
  }
  return encoded;
}

function isPlainRecord(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function arraySemanticsFor(
  schema: CanonicalSerializationSchema | undefined,
  path: string,
): CanonicalArraySemantics {
  const declared = schema?.arrays;
  if (declared) {
    // Both spellings are useful for the root array and cost no ambiguity for
    // nested pointers. A path-specific declaration always wins the default.
    const pathValue =
      declared[path] ?? (path === "" ? declared["/"] : undefined);
    if (pathValue) return pathValue;
  }
  return schema?.arraySemantics ?? "ordered";
}

/** Compare already-canonical members by their UTF-8 bytes. */
function compareCanonicalBytes(left: string, right: string): number {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.min(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    if (leftBytes[index] !== rightBytes[index]) {
      return leftBytes[index] - rightBytes[index];
    }
  }
  return leftBytes.length - rightBytes.length;
}
function encodeValue(
  value: unknown,
  schema: CanonicalSerializationSchema | undefined,
  path: string,
  active: Set<object>,
): string {
  if (value === null) return "null";

  switch (typeof value) {
    case "string":
      return encodeString(value, path);
    case "boolean":
      return value ? "true" : "false";
    case "number":
      return encodeNumber(value, path);
    case "undefined":
      throw new CanonicalJsonError(
        `Undefined is not a canonical JSON value at ${path || "/"}`,
      );
    case "bigint":
    case "function":
    case "symbol":
      throw new CanonicalJsonError(
        `Unsupported ${typeof value} at ${path || "/"}`,
      );
    case "object":
      break;
    default:
      throw new CanonicalJsonError(`Unsupported value at ${path || "/"}`);
  }

  if (active.has(value)) {
    throw new CanonicalJsonError(`Cyclic value at ${path || "/"}`);
  }
  active.add(value);
  try {
    if (Array.isArray(value)) {
      const encodedValues: string[] = [];
      for (let index = 0; index < value.length; index += 1) {
        if (!hasOwn(value, index)) {
          throw new CanonicalJsonError(
            `Sparse array at ${pathForIndex(path, index)}`,
          );
        }
        encodedValues.push(
          encodeValue(value[index], schema, pathForIndex(path, index), active),
        );
      }

      if (arraySemanticsFor(schema, path) === "set") {
        const uniqueValues = new Set(encodedValues);
        if (uniqueValues.size !== encodedValues.length) {
          throw new CanonicalJsonError(
            `Duplicate member in set array at ${path || "/"}`,
          );
        }
        encodedValues.sort(compareCanonicalBytes);
      }
      return `[${encodedValues.join(",")}]`;
    }

    if (!isPlainRecord(value)) {
      throw new CanonicalJsonError(`Unsupported object type at ${path || "/"}`);
    }

    const symbolKeys = Object.getOwnPropertySymbols(value);
    if (symbolKeys.length > 0) {
      throw new CanonicalJsonError(
        `Symbol property at ${path || "/"} is not canonical JSON`,
      );
    }

    const normalizedKeys = new Map<string, string>();
    for (const key of Object.keys(value)) {
      const normalizedKey = key.normalize("NFC");
      assertWellFormedUnicode(normalizedKey, pathForProperty(path, key));
      if (normalizedKeys.has(normalizedKey)) {
        throw new CanonicalJsonError(
          `Duplicate object key after NFC normalization at ${path || "/"}: ${normalizedKey}`,
        );
      }
      normalizedKeys.set(normalizedKey, key);
    }
    const record = value as Record<string, unknown>;
    const entries: string[] = [];
    for (const normalizedKey of [...normalizedKeys.keys()].sort()) {
      const sourceKey = normalizedKeys.get(normalizedKey);
      // The key was just inserted into the map, so this is unreachable unless
      // a hostile Proxy violates Map's normal invariants.
      if (sourceKey === undefined) {
        throw new CanonicalJsonError(`Missing object key at ${path || "/"}`);
      }
      const propertyValue = record[sourceKey];
      // Undefined has the same meaning as an omitted optional object member.
      // It is intentionally not accepted in arrays or at the root.
      if (propertyValue === undefined) continue;
      entries.push(
        `${encodeString(normalizedKey, pathForProperty(path, normalizedKey))}:${encodeValue(propertyValue, schema, pathForProperty(path, normalizedKey), active)}`,
      );
    }
    return `{${entries.join(",")}}`;
  } finally {
    active.delete(value);
  }
}

/** Serialize a JSON-shaped value according to canonical-json-v1. */
export function canonicalize(
  value: unknown,
  schema?: CanonicalSerializationSchema,
): string {
  return encodeValue(value, schema, "", new Set<object>());
}

/** Return the UTF-8 bytes of {@link canonicalize}. */
export function canonicalizeBytes(
  value: unknown,
  schema?: CanonicalSerializationSchema,
): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(canonicalize(value, schema));
}

/** Compute a lowercase SHA-256 digest of canonical-json-v1 UTF-8 bytes. */
export async function sha256Canonical(
  value: unknown,
  schema?: CanonicalSerializationSchema,
): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new CanonicalJsonError("Web Crypto SHA-256 is unavailable");
  }
  const bytes = canonicalizeBytes(value, schema);
  const digest = await subtle.digest("SHA-256", bytes.buffer as ArrayBuffer);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** A descriptive alias for callers that refer to the serialized form as JSON. */
export const canonicalJson = canonicalize;
/** A descriptive alias for callers that refer to a canonical digest. */
export const canonicalDigest = sha256Canonical;

const JSON_WHITESPACE = new Set([" ", "\n", "\r", "\t"]);

/**
 * Parse JSON while rejecting duplicate keys before JavaScript object creation.
 * This is used by vector/manifest loaders; ordinary object values cannot retain
 * duplicate keys once parsed by JSON.parse.
 */
export function parseCanonicalJson(text: string): unknown {
  if (typeof text !== "string") {
    throw new CanonicalJsonError("Canonical JSON input must be a string");
  }
  return new StrictJsonParser(text).parse();
}

class StrictJsonParser {
  private index = 0;
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  parse(): unknown {
    this.skipWhitespace();
    const value = this.parseValue();
    this.skipWhitespace();
    if (this.index !== this.text.length) {
      this.fail("Trailing data");
    }
    return value;
  }

  private parseValue(): unknown {
    this.skipWhitespace();
    const character = this.text[this.index];
    if (character === "{") return this.parseObject();
    if (character === "[") return this.parseArray();
    if (character === '"') return this.parseString();
    if (character === "t" && this.consume("true")) return true;
    if (character === "f" && this.consume("false")) return false;
    if (character === "n" && this.consume("null")) return null;
    if (character === "-" || (character >= "0" && character <= "9")) {
      return this.parseNumber();
    }
    this.fail("Expected a JSON value");
  }

  private parseObject(): Record<string, unknown> {
    this.index += 1;
    const result: Record<string, unknown> = Object.create(null) as Record<
      string,
      unknown
    >;
    const keys = new Set<string>();
    this.skipWhitespace();
    if (this.text[this.index] === "}") {
      this.index += 1;
      return result;
    }

    while (true) {
      this.skipWhitespace();
      if (this.text[this.index] !== '"') {
        this.fail("Object keys must be strings");
      }
      const key = this.parseString();
      if (typeof key !== "string") this.fail("Invalid object key");
      const normalizedKey = key.normalize("NFC");
      if (keys.has(normalizedKey)) {
        this.fail(`Duplicate object key: ${normalizedKey}`);
      }
      keys.add(normalizedKey);
      this.skipWhitespace();
      if (this.text[this.index] !== ":") this.fail("Expected ':'");
      this.index += 1;
      result[normalizedKey] = this.parseValue();
      this.skipWhitespace();
      if (this.text[this.index] === "}") {
        this.index += 1;
        return result;
      }
      if (this.text[this.index] !== ",") this.fail("Expected ',' or '}'");
      this.index += 1;
    }
  }

  private parseArray(): unknown[] {
    this.index += 1;
    const result: unknown[] = [];
    this.skipWhitespace();
    if (this.text[this.index] === "]") {
      this.index += 1;
      return result;
    }

    while (true) {
      result.push(this.parseValue());
      this.skipWhitespace();
      if (this.text[this.index] === "]") {
        this.index += 1;
        return result;
      }
      if (this.text[this.index] !== ",") this.fail("Expected ',' or ']'");
      this.index += 1;
    }
  }

  private parseString(): string {
    const start = this.index;
    this.index += 1;
    while (this.index < this.text.length) {
      const codeUnit = this.text.charCodeAt(this.index);
      if (codeUnit === 0x22) {
        this.index += 1;
        const token = this.text.slice(start, this.index);
        let value: unknown;
        try {
          value = JSON.parse(token) as unknown;
        } catch {
          this.fail("Invalid JSON string");
        }
        if (typeof value !== "string") this.fail("Invalid JSON string");
        assertWellFormedUnicode(value, `byte ${start}`);
        return value;
      }
      if (codeUnit < 0x20) this.fail("Control character in JSON string");
      if (codeUnit === 0x5c) {
        this.index += 2;
      } else {
        this.index += 1;
      }
    }
    this.fail("Unterminated JSON string");
  }

  private parseNumber(): number {
    const remaining = this.text.slice(this.index);
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(
      remaining,
    );
    if (!match) this.fail("Invalid JSON number");
    const token = match[0];
    this.index += token.length;
    const value = Number(token);
    if (!Number.isFinite(value)) this.fail("Non-finite JSON number");
    return value;
  }

  private consume(token: string): boolean {
    if (this.text.startsWith(token, this.index)) {
      this.index += token.length;
      return true;
    }
    return false;
  }

  private skipWhitespace(): void {
    while (JSON_WHITESPACE.has(this.text[this.index] ?? "")) {
      this.index += 1;
    }
  }

  private fail(message: string): never {
    throw new CanonicalJsonError(`${message} at offset ${this.index}`);
  }
}
