import type { Layer, Question, QuizTier } from "../types";
import type { ResearchAdministration } from "./index";

export const RESEARCH_FORM_VERSION = "profile-form-v3";

export type ResearchFormRole = "consumer-profile" | "controlled-matrix";

export interface ResearchFormManifest {
  algorithmVersion: string;
  role: ResearchFormRole;
  sourceTier: QuizTier;
  administration: ResearchAdministration;
  requestedItemCount: number | null;
  assignedItemCount: number;
  membershipFingerprint: string;
  presentationFingerprint: string;
  layerCounts: Record<Layer, number>;
  axisIds: string[];
}

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

export function researchPresentationFingerprint(
  questions: Question[],
  administration: ResearchAdministration,
): string {
  const ordered = questions.map((question) => String(question.id)).join("|");
  return `rfo_${hash32(`${RESEARCH_FORM_VERSION}:${administration}:${ordered}`).toString(16).padStart(8, "0")}`;
}

export function researchFormManifest(
  questionPool: Question[],
  participantId: string,
  administration: ResearchAdministration,
  requestedSize: number | null,
  sourceTier: QuizTier = "extensive",
): ResearchFormManifest {
  const form = buildContributionQuestionForm(
    questionPool,
    participantId,
    administration,
    requestedSize,
  );
  const layerCounts: Record<Layer, number> = {
    normative: 0,
    descriptive: 0,
    prescriptive: 0,
  };
  const axisIds = new Set<string>();
  for (const question of form) {
    layerCounts[question.layer] += 1;
    for (const weight of question.axisWeights)
      axisIds.add(String(weight.axisId));
    for (const option of question.statementOptions ?? []) {
      for (const weight of option.axisWeights)
        axisIds.add(String(weight.axisId));
    }
  }
  return {
    algorithmVersion: RESEARCH_FORM_VERSION,
    role: requestedSize === null ? "consumer-profile" : "controlled-matrix",
    sourceTier,
    administration,
    requestedItemCount: requestedSize,
    assignedItemCount: form.length,
    membershipFingerprint: researchFormFingerprint(form),
    presentationFingerprint: researchPresentationFingerprint(
      form,
      administration,
    ),
    layerCounts,
    axisIds: [...axisIds].sort(),
  };
}

export function researchFormManifestErrors(
  manifest: ResearchFormManifest,
  form: Question[],
  requiredAxisIds: readonly string[] = [],
): string[] {
  const errors: string[] = [];
  if (manifest.algorithmVersion !== RESEARCH_FORM_VERSION) {
    errors.push("form manifest version does not match the current form");
  }
  if (manifest.assignedItemCount !== form.length) {
    errors.push("form manifest item count does not match assigned items");
  }
  if (manifest.membershipFingerprint !== researchFormFingerprint(form)) {
    errors.push("form manifest membership fingerprint does not match items");
  }
  if (
    manifest.presentationFingerprint !==
    researchPresentationFingerprint(form, manifest.administration)
  ) {
    errors.push("form manifest presentation fingerprint does not match items");
  }
  const layerTotal = Object.values(manifest.layerCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  if (layerTotal !== form.length) {
    errors.push("form manifest layer counts do not sum to assigned items");
  }
  if (
    form.length > 0 &&
    Object.values(manifest.layerCounts).some((count) => count === 0)
  ) {
    errors.push(
      "form must retain at least one item from each measurement layer",
    );
  }
  const actualAxisIds = new Set<string>();
  for (const question of form) {
    for (const weight of question.axisWeights)
      actualAxisIds.add(String(weight.axisId));
    for (const option of question.statementOptions ?? []) {
      for (const weight of option.axisWeights)
        actualAxisIds.add(String(weight.axisId));
    }
  }
  if (
    [...actualAxisIds].sort().join("|") !==
    [...manifest.axisIds].sort().join("|")
  ) {
    errors.push("form manifest axis coverage does not match assigned items");
  }
  if (requiredAxisIds.some((axisId) => !actualAxisIds.has(axisId))) {
    errors.push("form is missing a required axis");
  }
  return errors;
}

export function researchFormAssignmentErrors(
  testForm: Question[],
  retestForm: Question[],
  expectedItemCount?: number,
): string[] {
  const errors: string[] = [];
  const testIds = testForm.map((question) => String(question.id));
  const retestIds = retestForm.map((question) => String(question.id));
  if (new Set(testIds).size !== testIds.length) {
    errors.push("test form has duplicate items");
  }
  if (new Set(retestIds).size !== retestIds.length) {
    errors.push("retest form has duplicate items");
  }
  if (
    researchFormFingerprint(testForm) !== researchFormFingerprint(retestForm)
  ) {
    errors.push("test/retest membership fingerprints differ");
  }
  for (const [name, form] of [
    ["test", testForm],
    ["retest", retestForm],
  ] as const) {
    const layers = new Set(form.map((question) => question.layer));
    if (form.length > 0 && layers.size < 3)
      errors.push(`${name} form does not cover all measurement layers`);
  }
  if (
    expectedItemCount !== undefined &&
    testForm.length !== expectedItemCount
  ) {
    errors.push("test form item count does not match the requested count");
  }
  if (
    testForm.some(
      (question) =>
        question.active === false || question.reviewStatus === "needs-rewrite",
    )
  ) {
    errors.push("test form contains an inactive or needs-rewrite item");
  }
  if (
    retestForm.some(
      (question) =>
        question.active === false || question.reviewStatus === "needs-rewrite",
    )
  ) {
    errors.push("retest form contains an inactive or needs-rewrite item");
  }
  return errors;
}
