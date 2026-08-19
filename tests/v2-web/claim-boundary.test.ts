import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function files(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? files(path) : /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
  });
}

describe("Phase 11 UI claim boundary", () => {
  it("does not make identity, probability, diagnosis, or reliability claims", () => {
    const forbidden = /\b(you are|your identity|probability|reliability|classifier confidence|salience multiplier|definitely)\b/i;
    const violations = files(resolve(process.cwd(), "v2/apps/web/src")).flatMap((file) => forbidden.test(readFileSync(file, "utf8")) ? [file] : []);
    expect(violations).toEqual([]);
  });
});
