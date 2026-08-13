export type Appearance = "system" | "dark" | "light";
export type Theme = Exclude<Appearance, "system">;
export type Density = "automatic" | "compact" | "comfortable";
export type ResolvedDensity = Exclude<Density, "automatic">;
export type Contrast = "automatic" | "standard" | "more";
export type ResolvedContrast = Exclude<Contrast, "automatic">;

export const APPEARANCE_STORAGE_KEY = "political-judgment-appearance-v1";
export const LEGACY_THEME_STORAGE_KEY = "political-judgment-theme-v1";
export const DENSITY_STORAGE_KEY = "political-judgment-density-v1";
export const CONTRAST_STORAGE_KEY = "political-judgment-contrast-v1";

interface StorageReader {
  getItem(key: string): string | null;
}

export interface InputCapabilities {
  anyFine: boolean;
  anyHover: boolean;
  coarse: boolean;
  noHover: boolean;
  inlineSize: number;
}

function safelyRead(
  storage: StorageReader | undefined,
  key: string,
): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function readAppearance(storage?: StorageReader): Appearance {
  const stored =
    safelyRead(storage, APPEARANCE_STORAGE_KEY) ??
    safelyRead(storage, LEGACY_THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

export function readDensity(storage?: StorageReader): Density {
  const stored = safelyRead(storage, DENSITY_STORAGE_KEY);
  return stored === "compact" ||
    stored === "comfortable" ||
    stored === "automatic"
    ? stored
    : "automatic";
}

export function readContrast(storage?: StorageReader): Contrast {
  const stored = safelyRead(storage, CONTRAST_STORAGE_KEY);
  return stored === "standard" || stored === "more" || stored === "automatic"
    ? stored
    : "automatic";
}

export function resolveTheme(
  appearance: Appearance,
  systemDark: boolean,
): Theme {
  return appearance === "system" ? (systemDark ? "dark" : "light") : appearance;
}

export function resolveAutomaticDensity(
  capabilities: InputCapabilities,
): ResolvedDensity {
  if (capabilities.inlineSize < 720) return "comfortable";
  if (capabilities.anyFine || capabilities.anyHover) return "compact";
  return capabilities.coarse || capabilities.noHover
    ? "comfortable"
    : "compact";
}

export function resolveDensity(
  density: Density,
  capabilities: InputCapabilities,
): ResolvedDensity {
  return density === "automatic"
    ? resolveAutomaticDensity(capabilities)
    : density;
}

export function resolveContrast(
  contrast: Contrast,
  systemMore: boolean,
): ResolvedContrast {
  return contrast === "automatic"
    ? systemMore
      ? "more"
      : "standard"
    : contrast;
}

export function browserCapabilities(
  inlineSize = window.innerWidth,
): InputCapabilities {
  const matches = (query: string) =>
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;
  return {
    anyFine: matches("(any-pointer: fine)"),
    anyHover: matches("(any-hover: hover)"),
    coarse: matches("(pointer: coarse)"),
    noHover: matches("(hover: none)"),
    inlineSize,
  };
}
