import { CANONICAL_JSON_VERSION } from "../domain/canonicalSerialization";
import { CANONICAL_MANIFEST } from "../domain/canonicalManifest";
import type { Question } from "../types";
import type { ResearchAdministration } from "./index";

export const RESEARCH_FORM_VERSION = "profile-form-v3";
export const RESEARCH_CONTRACT_ROUTE = "research-browser";
export const RESEARCH_COHORT = "community-2026-v5";
/** Version and fingerprints projected from the checked-in canonical contract artifact. */
export const RESEARCH_COHORT_VERSION = "clean-rebuild-v1";
export const RESEARCH_COHORT_FINGERPRINT = "clean-rebuild-fingerprint-v1";
/** Exact metadata emitted by the clean browser contract. */
export const RESEARCH_MANIFEST_SCHEMA_VERSION =
  CANONICAL_MANIFEST.metadata.schemaVersion;
export const RESEARCH_SOURCE_MANIFEST_SHA256 =
  "85205575e0aeb218372a31fa6a704cb7399294aaf8ef95ce85a8ef1dd50230a3";
export const RESEARCH_SERIALIZATION_FINGERPRINT =
  "9f4160f096b88d4ced358da37148e56899252fc1b25ed658c94532f1e23ed2bc";
export const RESEARCH_SCHEMA_CONTRACT_VERSION = "research-schema-v1";
export const RESEARCH_SCHEMA_FINGERPRINT =
  "24c5a9e75c4fef6c9f36445588cd143f8074b3015b62ed9d6e3be171291413f0";
export const RESEARCH_CONTRACT_FINGERPRINT =
  "22dfcf63b73be7c5da79e9128bec75e9b777334e072a5b37b452a5766751dee5";
export const RESEARCH_RECORD_CONTRACT_VERSION = "2026-08-v19";
export const RESEARCH_MANIFEST_VERSION = CANONICAL_MANIFEST.metadata.version;
const canonicalManifestFingerprint = CANONICAL_MANIFEST.metadata.fingerprint;
if (!canonicalManifestFingerprint) {
  throw new Error("Canonical research manifest fingerprint is required.");
}
export const RESEARCH_MANIFEST_FINGERPRINT = canonicalManifestFingerprint;
export const RESEARCH_SERIALIZATION_VERSION = CANONICAL_JSON_VERSION;
export const RESEARCH_FORM_CONTRACT_METADATA = Object.freeze({
  manifestVersion: RESEARCH_MANIFEST_VERSION,
  manifestFingerprint: RESEARCH_MANIFEST_FINGERPRINT,
  manifestSchemaVersion: RESEARCH_MANIFEST_SCHEMA_VERSION,
  sourceManifestSha256: RESEARCH_SOURCE_MANIFEST_SHA256,
  serializationVersion: RESEARCH_SERIALIZATION_VERSION,
  serializationFingerprint: RESEARCH_SERIALIZATION_FINGERPRINT,
  schemaContractVersion: RESEARCH_SCHEMA_CONTRACT_VERSION,
  schemaFingerprint: RESEARCH_SCHEMA_FINGERPRINT,
  contractFingerprint: RESEARCH_CONTRACT_FINGERPRINT,
  contractVersion: RESEARCH_RECORD_CONTRACT_VERSION,
  contractRoute: RESEARCH_CONTRACT_ROUTE,
  cohort: RESEARCH_COHORT,
  cohortVersion: RESEARCH_COHORT_VERSION,
  cohortFingerprint: RESEARCH_COHORT_FINGERPRINT,
});

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function primaryAxis(question: Question): string {
  const weights =
    question.responseType === "statementChoice"
      ? (question.statementOptions?.flatMap((option) => option.axisWeights) ??
        [])
      : question.axisWeights;
  if (weights.length === 0) return String(question.domain);
  return String(
    [...weights].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))[0]
      .axisId,
  );
}

function shuffled<T>(
  values: T[],
  seed: string,
  key: (value: T) => string,
): T[] {
  return [...values].sort((left, right) => {
    const leftHash = hash32(`${seed}:${key(left)}`);
    const rightHash = hash32(`${seed}:${key(right)}`);
    return leftHash - rightHash || key(left).localeCompare(key(right));
  });
}

export function researchFormSize(
  search = window.location.search,
): number | null {
  const params = new URLSearchParams(search);
  // Public contribution links now use the complete profile selected on the
  // ordinary start screen. Keep explicit matrix sizes only for controlled
  // research URLs so an old public link cannot silently launch a short form.
  if (params.get("research") !== "1") return null;
  const raw = params.get("formSize");
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 12 ? parsed : null;
}

export function buildContributionQuestionForm(
  questionPool: Question[],
  participantId: string,
  administration: ResearchAdministration,
  requestedSize: number | null,
): Question[] {
  // With no explicit research matrix size, contribution mode is an optional
  // layer on the exact selected consumer profile, not a separate assessment.
  if (requestedSize === null) return [...questionPool];
  return buildResearchQuestionForm(
    questionPool,
    participantId,
    administration,
    requestedSize,
  );
}

export function buildResearchQuestionForm(
  questionPool: Question[],
  participantId: string,
  administration: ResearchAdministration,
  requestedSize: number | null,
): Question[] {
  const eligible = questionPool.filter(
    (question) =>
      question.active !== false && question.reviewStatus !== "needs-rewrite",
  );
  // Item assignment must stay fixed between test and retest. Administration is
  // used only for presentation order so stability is not confounded with two
  // different matrix forms.
  const assignmentSeed = `${RESEARCH_FORM_VERSION}:${participantId}:assignment`;
  const presentationSeed = `${RESEARCH_FORM_VERSION}:${participantId}:${administration}:presentation`;
  const targetSize =
    requestedSize === null
      ? eligible.length
      : Math.min(requestedSize, eligible.length);

  const groups = new Map<string, Question[]>();
  for (const question of eligible) {
    const key = `${question.layer}:${primaryAxis(question)}`;
    const group = groups.get(key) ?? [];
    group.push(question);
    groups.set(key, group);
  }

  const orderedGroups = shuffled(
    [...groups.entries()],
    assignmentSeed,
    ([key]) => key,
  ).map(
    ([key, values]) =>
      [
        key,
        shuffled(values, `${assignmentSeed}:${key}`, (question) =>
          String(question.id),
        ),
      ] as const,
  );
  const selected: Question[] = [];
  let depth = 0;
  while (selected.length < targetSize) {
    let added = false;
    for (const [, group] of orderedGroups) {
      const question = group[depth];
      if (!question) continue;
      selected.push(question);
      added = true;
      if (selected.length === targetSize) break;
    }
    if (!added) break;
    depth += 1;
  }

  return shuffled(selected, presentationSeed, (question) =>
    String(question.id),
  );
}

export function researchFormFingerprint(questions: Question[]): string {
  const canonical = questions
    .map((question) => String(question.id))
    .sort()
    .join("|");
  return `rf_${hash32(`${RESEARCH_FORM_VERSION}:${canonical}`).toString(16).padStart(8, "0")}`;
}
