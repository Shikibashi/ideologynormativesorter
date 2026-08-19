const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function normalize(value: unknown, path: string): unknown {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`Non-finite value at ${path}`);
    return Object.is(value, -0) ? 0 : value;
  }
  if (Array.isArray(value)) return value.map((entry, index) => normalize(entry, `${path}[${index}]`));
  if (typeof value !== "object") throw new Error(`Unsupported value at ${path}`);
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    if (FORBIDDEN_KEYS.has(key)) throw new Error(`Dangerous object key at ${path}.${key}`);
    output[key] = normalize((value as Record<string, unknown>)[key], `${path}.${key}`);
  }
  return output;
}

export function canonicalJson(value: unknown): string {
  const serialized = JSON.stringify(normalize(value, "$"));
  if (serialized === undefined) throw new Error("Value cannot be serialized");
  return serialized;
}

export function utf8ByteLength(value: string): number {
  return typeof TextEncoder === "undefined" ? value.length : new TextEncoder().encode(value).byteLength;
}

export function hasForbiddenKeys(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenKeys);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, entry]) => FORBIDDEN_KEYS.has(key) || hasForbiddenKeys(entry));
}
