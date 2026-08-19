import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function specialistEngineSource(): string {
  const root = resolve(process.cwd(), "v2/packages/engine/src/specialists");
  return readdirSync(root)
    .filter((file) => file.endsWith(".ts"))
    .sort()
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n");
}

describe("Phase 7 specialist-engine boundary", () => {
  it("uses canonical content and shared construct primitives without v1, UI, or primary/modifier coupling", () => {
    const source = specialistEngineSource();
    expect(source).toMatch(/prepareAssessmentResponses/);
    expect(source).toMatch(/scoreConstructLayer/);
    expect(source).toMatch(/specialistModules/);
    expect(source).not.toMatch(
      /src\/(data|domain|scoring|production|research|specialist)\//i,
    );
    expect(source).not.toMatch(/React|browser|window|document/);
    expect(source).not.toMatch(
      /scorePrimaryProfiles|scoreModifiers|rankPrimaryProfiles/,
    );
    expect(source).not.toMatch(
      /canonicalAdapter|effectiveQuestions|applySemanticCorrections|mergeCanonicalOverlay/,
    );
  });
});
