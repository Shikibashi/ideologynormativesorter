const DEFAULT_EXCLUDED_KEYS = new Set([
  "display",
  "displayMetadata",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertJsonValue(value: unknown, path: string): void {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Non-finite number cannot be serialized at ${path}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonValue(item, `${path}[${index}]`));
    return;
  }
  if (isRecord(value)) {
    const normalizedKeys = new Set<string>();
    for (const key of Object.keys(value)) {
      const normalizedKey = key.normalize("NFC");
      if (normalizedKeys.has(normalizedKey)) {
        throw new Error(`Duplicate normalized object key ${normalizedKey} at ${path}`);
      }
      normalizedKeys.add(normalizedKey);
      assertJsonValue(value[key], `${path}.${key}`);
    }
    return;
  }
  throw new Error(`Unsupported non-JSON value at ${path}`);
}

function canonicalizeValue(
  value: unknown,
  options: { excludeKeys: Set<string> },
  path: string,
): unknown {
  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    const normalizedItems = value.map((item, index) =>
      canonicalizeValue(item, options, `${path}[${index}]`),
    );
    const hasExplicitId = normalizedItems.every(
      (item) => isRecord(item) && typeof item.id === "string",
    );
    if (hasExplicitId) {
      return [...normalizedItems].sort((left, right) => {
        const leftId = String((left as { id: string }).id);
        const rightId = String((right as { id: string }).id);
        return leftId.localeCompare(rightId);
      });
    }
    return normalizedItems;
  }

  if (!isRecord(value)) return value;
  const normalized: Record<string, unknown> = {};
  const normalizedKeys = new Set<string>();
  for (const key of Object.keys(value).sort()) {
    if (options.excludeKeys.has(key)) continue;
    const normalizedKey = key.normalize("NFC");
    if (normalizedKeys.has(normalizedKey)) {
      throw new Error(`Duplicate normalized object key ${normalizedKey} at ${path}`);
    }
    normalizedKeys.add(normalizedKey);
    normalized[normalizedKey] = canonicalizeValue(
      value[key],
      options,
      `${path}.${key}`,
    );
  }
  return normalized;
}

export interface StableSerializeOptions {
  excludeKeys?: string[];
}

export function stableSerialize(
  value: unknown,
  options: StableSerializeOptions = {},
): string {
  assertJsonValue(value, "$" );
  const excludeKeys = new Set(DEFAULT_EXCLUDED_KEYS);
  for (const key of options.excludeKeys ?? []) excludeKeys.add(key);
  const normalized = canonicalizeValue(value, { excludeKeys }, "$" );
  const text = JSON.stringify(normalized);
  if (text === undefined) throw new Error("Cannot serialize non-JSON values");
  return text;
}
