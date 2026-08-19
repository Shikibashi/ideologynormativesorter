import { useEffect, useMemo, useReducer, useState } from "react";
import { scoreAssessment, validateAssessmentInput } from "@v2/engine-api";
import type { AssessmentInput, AssessmentResult, RawResponse } from "../../../packages/contracts/src";
import { createResearchSubmission, sendResearchSubmission, type ResearchBundle, type ResearchSubmissionEnvelope } from "../../../packages/research/src";
import {
  createBrowserAssessmentSaveStore,
  createPrivateAssessmentSave,
  evaluateSavedAssessmentFreshness,
  exportPrivateAssessment,
  importPrivateAssessment,
  projectPublicShare,
  serializePublicShare,
  type AssessmentSaveStore,
  type PrivateAssessmentSave,
} from "../../../packages/persistence/src";
import { buildAssessmentViewModel, buildQuestionnaireViewModel, buildQuestionViewModel, buildSpecialistModuleViewModel, type QuestionViewModel } from "../../../packages/view-model/src";
import { canonicalBundle } from "./bundle";
import {
  ConstructScale,
  DiagnosticDetails,
  EvidenceSummary,
  ModifierCard,
  PageShell,
  ProfileMatchCard,
  ProgressIndicator,
  QuestionCard,
  SpecialistModuleCard,
  VersionInfo,
  PersistenceActions,
  type ResponseSelection,
} from "./components";
import { ResearchPanel, type ResearchPanelState } from "./research-panel";

type AppPhase = "landing" | "core-questionnaire" | "specialist-routing" | "specialist-questionnaire" | "ready-to-score" | "results" | "error";
type StoredResponse = RawResponse;
type ResponseMap = Readonly<Record<string, StoredResponse>>;

interface AppState {
  readonly phase: AppPhase;
  readonly coreIndex: number;
  readonly specialistModuleIndex: number;
  readonly specialistItemIndex: number;
  readonly coreResponses: ResponseMap;
  readonly specialistResponses: ResponseMap;
  readonly selectedModuleIds: readonly string[];
  readonly result?: AssessmentResult;
  readonly errorMessage?: string;
}

type Action =
  | { readonly type: "start" }
  | { readonly type: "core-response"; readonly response: StoredResponse }
  | { readonly type: "core-next" }
  | { readonly type: "core-back" }
  | { readonly type: "toggle-module"; readonly moduleId: string }
  | { readonly type: "specialist-start" }
  | { readonly type: "specialist-response"; readonly response: StoredResponse }
  | { readonly type: "specialist-next" }
  | { readonly type: "specialist-back" }
  | { readonly type: "skip-specialists" }
  | { readonly type: "routing-back" }
  | { readonly type: "ready-back" }
  | { readonly type: "scored"; readonly result: AssessmentResult }
  | { readonly type: "score-error"; readonly message: string }
  | { readonly type: "restart" }
  | { readonly type: "restore-save"; readonly save: PrivateAssessmentSave }
  | { readonly type: "load-test-fixture"; readonly input: AssessmentInput };

const initialState: AppState = {
  phase: "landing",
  coreIndex: 0,
  specialistModuleIndex: 0,
  specialistItemIndex: 0,
  coreResponses: {},
  specialistResponses: {},
  selectedModuleIds: [],
};

function responseMapWith(responseMap: ResponseMap, response: StoredResponse): ResponseMap {
  return { ...responseMap, [String(response.itemId)]: response };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "start": return { ...initialState, phase: "core-questionnaire" };
    case "core-response": return { ...state, coreResponses: responseMapWith(state.coreResponses, action.response) };
    case "core-next": return state.coreIndex + 1 < coreQuestions.length ? { ...state, coreIndex: state.coreIndex + 1 } : { ...state, phase: "specialist-routing" };
    case "core-back": return state.coreIndex > 0 ? { ...state, coreIndex: state.coreIndex - 1 } : { ...state, phase: "landing" };
    case "toggle-module": {
      const selected = state.selectedModuleIds.includes(action.moduleId) ? state.selectedModuleIds.filter((id) => id !== action.moduleId) : [...state.selectedModuleIds, action.moduleId];
      return { ...state, selectedModuleIds: selected };
    }
    case "specialist-start": return state.selectedModuleIds.length === 0 ? { ...state, phase: "ready-to-score" } : { ...state, phase: "specialist-questionnaire", specialistModuleIndex: 0, specialistItemIndex: 0 };
    case "specialist-response": return { ...state, specialistResponses: responseMapWith(state.specialistResponses, action.response) };
    case "specialist-next": return nextSpecialistState(state);
    case "specialist-back": return previousSpecialistState(state);
    case "skip-specialists": return { ...state, phase: "ready-to-score" };
    case "routing-back": return { ...state, phase: "core-questionnaire", coreIndex: Math.max(0, coreQuestions.length - 1) };
    case "ready-back": return { ...state, phase: "specialist-routing" };
    case "scored": return { ...state, phase: "results", result: action.result, errorMessage: undefined };
    case "score-error": return { ...state, phase: "error", errorMessage: action.message };
    case "restart": return initialState;
    case "restore-save": return restoreStateFromSave(action.save);
    case "load-test-fixture": return { ...initialState, phase: "ready-to-score", coreResponses: records(action.input.coreResponses), specialistResponses: records(action.input.specialistResponses ?? []), selectedModuleIds: action.input.requestedSpecialistModuleIds };
  }
}

const bundle = canonicalBundle;
const coreQuestions = buildQuestionnaireViewModel(bundle, "core").questions;
const modulePresentation = new Map(bundle.specialistModules.map((module) => [String(module.id), buildSpecialistModuleViewModel(module)]));

function selectedSpecialistItems(state: AppState): readonly QuestionViewModel[] {
  const moduleId = state.selectedModuleIds[state.specialistModuleIndex];
  return specialistItemsForModule(moduleId);
}

function specialistItemsForModule(moduleId: string | undefined): readonly QuestionViewModel[] {
  const module = bundle.specialistModules.find((entry) => String(entry.id) === moduleId);
  if (!module) return [];
  const byId = new Map(bundle.items.map((item) => [String(item.id), item]));
  return module.itemIds.map((itemId) => byId.get(String(itemId))).filter((item): item is NonNullable<typeof item> => item !== undefined).map((item) => buildQuestionViewModel(item, bundle));
}

function nextSpecialistState(state: AppState): AppState {
  const items = selectedSpecialistItems(state);
  if (state.specialistItemIndex + 1 < items.length) return { ...state, specialistItemIndex: state.specialistItemIndex + 1 };
  if (state.specialistModuleIndex + 1 < state.selectedModuleIds.length) return { ...state, specialistModuleIndex: state.specialistModuleIndex + 1, specialistItemIndex: 0 };
  return { ...state, phase: "ready-to-score" };
}

function previousSpecialistState(state: AppState): AppState {
  if (state.specialistItemIndex > 0) return { ...state, specialistItemIndex: state.specialistItemIndex - 1 };
  if (state.specialistModuleIndex > 0) {
    const previousModuleId = state.selectedModuleIds[state.specialistModuleIndex - 1];
    const previousModule = bundle.specialistModules.find((module) => String(module.id) === previousModuleId);
    return { ...state, specialistModuleIndex: state.specialistModuleIndex - 1, specialistItemIndex: Math.max(0, (previousModule?.itemIds.length ?? 1) - 1) };
  }
  return { ...state, phase: "specialist-routing" };
}

function records(responses: readonly RawResponse[]): ResponseMap {
  return Object.fromEntries(responses.map((response) => [String(response.itemId), response]));
}

function responseFromSelection(itemId: string, selection: ResponseSelection): StoredResponse {
  if (selection.state !== "answered") return { itemId, state: selection.state } as unknown as StoredResponse;
  const item = bundle.items.find((entry) => String(entry.id) === itemId);
  if ("value" in selection) return { itemId, state: "answered", responseType: item?.responseType === "likert5" ? "likert5" : "likert7", value: selection.value, ...(selection.confidence === undefined ? {} : { confidence: selection.confidence }), ...(selection.priority === undefined ? {} : { priority: selection.priority }) } as unknown as StoredResponse;
  return { itemId, state: "answered", responseType: "statement-choice", optionId: selection.optionId, ...(selection.confidence === undefined ? {} : { confidence: selection.confidence }), ...(selection.priority === undefined ? {} : { priority: selection.priority }) } as unknown as StoredResponse;
}

function orderedResponses(items: readonly QuestionViewModel[], responseMap: ResponseMap): RawResponse[] {
  return items.map((item) => responseMap[item.id]).filter((response): response is RawResponse => response !== undefined);
}

function makeInput(state: AppState): AssessmentInput {
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: orderedResponses(coreQuestions, state.coreResponses),
    specialistResponses: orderedSpecialistResponses(state),
    requestedSpecialistModuleIds: state.selectedModuleIds,
  };
}

function saveForState(state: AppState): PrivateAssessmentSave {
  const currentCore = coreQuestions[state.coreIndex];
  const currentSpecialist = selectedSpecialistItems(state)[state.specialistItemIndex];
  return createPrivateAssessmentSave({
    contentVersion: bundle.metadata.contentVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    scoringVersion: bundle.metadata.scoringVersion,
    session: {
      stage: state.phase,
      ...(state.phase === "core-questionnaire" && currentCore ? { currentItemId: currentCore.id } : {}),
      ...(state.phase === "specialist-questionnaire" && currentSpecialist ? { currentItemId: currentSpecialist.id } : {}),
      ...(state.selectedModuleIds[state.specialistModuleIndex] ? { currentSpecialistModuleId: state.selectedModuleIds[state.specialistModuleIndex] } : {}),
      presentationProgress: { coreIndex: state.coreIndex, specialistModuleIndex: state.specialistModuleIndex, specialistItemIndex: state.specialistItemIndex },
    },
    assessmentInput: makeInput(state),
    ...(state.result === undefined ? {} : { cachedResult: state.result }),
  });
}

function restoreStateFromSave(save: PrivateAssessmentSave): AppState {
  const selectedModuleIds = save.assessmentInput.requestedSpecialistModuleIds.filter((moduleId) => bundle.specialistModules.some((module) => String(module.id) === moduleId));
  const progress = save.session.presentationProgress;
  const coreIndex = Math.min(Math.max(progress?.coreIndex ?? 0, 0), Math.max(0, coreQuestions.length - 1));
  const specialistModuleIndex = Math.min(Math.max(progress?.specialistModuleIndex ?? 0, 0), Math.max(0, selectedModuleIds.length - 1));
  const currentModuleItems = specialistItemsForModule(selectedModuleIds[specialistModuleIndex]);
  const specialistItemIndex = Math.min(Math.max(progress?.specialistItemIndex ?? 0, 0), Math.max(0, currentModuleItems.length - 1));
  const base: AppState = {
    ...initialState,
    coreIndex,
    specialistModuleIndex,
    specialistItemIndex,
    coreResponses: records(save.assessmentInput.coreResponses),
    specialistResponses: records(save.assessmentInput.specialistResponses ?? []),
    selectedModuleIds,
  };
  if (save.session.stage === "core-questionnaire" && coreQuestions[coreIndex] && (!save.session.currentItemId || save.session.currentItemId === coreQuestions[coreIndex].id)) return { ...base, phase: "core-questionnaire" };
  if (save.session.stage === "specialist-routing") return { ...base, phase: "specialist-routing" };
  if (save.session.stage === "specialist-questionnaire" && currentModuleItems[specialistItemIndex] && (!save.session.currentItemId || save.session.currentItemId === currentModuleItems[specialistItemIndex].id)) return { ...base, phase: "specialist-questionnaire" };
  if (save.session.stage === "ready-to-score" || save.session.stage === "results") return { ...base, phase: "ready-to-score" };
  return { ...base, phase: "ready-to-score" };
}

function orderedSpecialistResponses(state: AppState): RawResponse[] {
  const items = state.selectedModuleIds.flatMap((moduleId) => bundle.specialistModules.find((module) => String(module.id) === moduleId)?.itemIds ?? []);
  return items.map((itemId) => state.specialistResponses[String(itemId)]).filter((response): response is RawResponse => response !== undefined);
}

function isTestMode(): boolean {
  return import.meta.env.MODE === "test";
}

function buildTestInput(): AssessmentInput {
  const module = bundle.specialistModules[0];
  const specialistItems = module.itemIds.map((itemId) => bundle.items.find((item) => String(item.id) === String(itemId))).filter((item): item is NonNullable<typeof item> => item !== undefined);
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: coreQuestions.map((item, index) => {
      const source = bundle.items.find((entry) => String(entry.id) === item.id);
      return source?.responseType === "statement-choice"
        ? { state: "answered", itemId: item.id, responseType: "statement-choice", optionId: item.options[0].id }
        : { state: "answered", itemId: item.id, responseType: item.responseType as "likert5" | "likert7", value: (item.scaleMin ?? 0) + (index % ((item.scaleMax ?? 0) - (item.scaleMin ?? 0) + 1)), ...(source?.layer === "descriptive" ? { confidence: 5 as const } : {}), ...(source?.layer === "prescriptive" ? { priority: 5 as const } : {}) };
    }),
    specialistResponses: specialistItems.map((item) => item.responseType === "statement-choice"
      ? { state: "answered", itemId: item.id, responseType: "statement-choice", optionId: item.options[0].id }
      : { state: "answered", itemId: item.id, responseType: item.responseType as "likert5" | "likert7", value: 0 }),
    requestedSpecialistModuleIds: [module.id],
  } as unknown as AssessmentInput;
}

function buildPartialTestInput(): AssessmentInput {
  return {
    responseSchemaVersion: bundle.metadata.responseSchemaVersion,
    contentFingerprint: bundle.metadata.contentFingerprint,
    coreResponses: [],
    specialistResponses: [],
    requestedSpecialistModuleIds: [],
  };
}

declare global {
  interface Window {
    __V2_TEST_INPUT__?: AssessmentInput;
    __V2_RESEARCH_CONFIG__?: { readonly enabled: boolean; readonly endpoint?: string };
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [saveStore] = useState<AssessmentSaveStore>(() => createBrowserAssessmentSaveStore());
  const [storedSave, setStoredSave] = useState(() => saveStore.load());
  const [persistenceMessage, setPersistenceMessage] = useState<string>();
  const currentCore = coreQuestions[state.coreIndex];
  const currentSpecialist = selectedSpecialistItems(state)[state.specialistItemIndex];
  const testInput = isTestMode() ? window.__V2_TEST_INPUT__ ?? buildTestInput() : undefined;
  const partialTestInput = isTestMode() ? buildPartialTestInput() : undefined;
  const researchConfig = isTestMode() ? window.__V2_RESEARCH_CONFIG__ ?? { enabled: false } : { enabled: false };
  const storedFreshness = storedSave.status === "loaded" && storedSave.save ? evaluateSavedAssessmentFreshness(storedSave.save, bundle) : storedSave.freshness;

  useEffect(() => {
    if (state.phase === "landing") return;
    const outcome = saveStore.save(saveForState(state));
    if (!outcome.saved) {
      const timer = window.setTimeout(() => setPersistenceMessage(outcome.reason), 0);
      return () => window.clearTimeout(timer);
    }
  }, [saveStore, state]);

  const resume = () => {
    if (!storedSave.save || (storedFreshness.kind !== "exact_match" && storedFreshness.kind !== "replay_required")) return;
    try {
      validateAssessmentInput(storedSave.save.assessmentInput, bundle);
      dispatch({ type: "restore-save", save: storedSave.save });
      setPersistenceMessage(storedFreshness.kind === "replay_required" ? "This save will be replayed with the current v2 scoring version." : "Private assessment resumed.");
    } catch (error) {
      setPersistenceMessage(error instanceof Error ? error.message : "The saved assessment could not be resumed.");
    }
  };

  const clearSave = () => {
    saveStore.remove();
    setStoredSave({ status: "missing", freshness: { kind: "corrupted", reason: "missing_save" }, warnings: [] });
    setPersistenceMessage("The v2 saved assessment was cleared. Older v1 storage was not changed.");
  };

  const importSave = async (file: File) => {
    try {
      const imported = importPrivateAssessment(await file.text(), bundle);
      validateAssessmentInput(imported.save.assessmentInput, bundle);
      dispatch({ type: "restore-save", save: imported.save });
      setStoredSave({ status: "loaded", save: imported.save, freshness: imported.freshness, warnings: imported.warnings });
      setPersistenceMessage(imported.freshness.kind === "replay_required" ? "Private save imported; the current v2 scorer will replay it." : "Private save imported and validated.");
    } catch (error) {
      setPersistenceMessage(error instanceof Error ? error.message : "The private save was rejected. The active assessment was unchanged.");
    }
  };

  const exportSave = () => {
    try {
      const serialized = exportPrivateAssessment(saveForState(state));
      const url = URL.createObjectURL(new Blob([serialized], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ideology-assessment.v2-save.json";
      anchor.click();
      URL.revokeObjectURL(url);
      setPersistenceMessage("Private save exported. Treat that file as sensitive assessment data.");
    } catch (error) {
      setPersistenceMessage(error instanceof Error ? error.message : "The private save could not be exported.");
    }
  };

  const restart = () => {
    saveStore.remove();
    setStoredSave({ status: "missing", freshness: { kind: "corrupted", reason: "missing_save" }, warnings: [] });
    setPersistenceMessage(undefined);
    dispatch({ type: "restart" });
  };

  const score = () => {
    if (state.phase !== "ready-to-score") return;
    try {
      const input = validateAssessmentInput(makeInput(state), bundle);
      dispatch({ type: "scored", result: scoreAssessment(input, bundle) });
    } catch (error) {
      dispatch({ type: "score-error", message: error instanceof Error ? error.message : "The assessment could not be scored." });
    }
  };

  const setCoreResponse = (selection: ResponseSelection) => dispatch({ type: "core-response", response: responseFromSelection(currentCore.id, selection) });
  const setSpecialistResponse = (selection: ResponseSelection) => dispatch({ type: "specialist-response", response: responseFromSelection(currentSpecialist.id, selection) });

  if (state.phase === "landing") return <LandingScreen onStart={() => dispatch({ type: "start" })} onResume={resume} onClearSave={storedSave.status === "loaded" || storedSave.status === "corrupted" ? clearSave : undefined} resumeAvailable={storedSave.status === "loaded" && Boolean(storedSave.save) && (storedFreshness.kind === "exact_match" || storedFreshness.kind === "replay_required")} resumeWarning={storedSave.status === "corrupted" || storedFreshness.kind === "incompatible" ? "A saved assessment was found but cannot be resumed automatically. Review it or clear it explicitly." : storedFreshness.kind === "replay_required" ? "This save is valid but will be recomputed with current v2 scoring." : undefined} onFixture={testInput ? () => dispatch({ type: "load-test-fixture", input: testInput }) : undefined} onPartialFixture={partialTestInput ? () => dispatch({ type: "load-test-fixture", input: partialTestInput }) : undefined} onImport={importSave} persistenceMessage={persistenceMessage} />;
  if (state.phase === "core-questionnaire" && currentCore) return <QuestionnaireScreen label="Core questionnaire" current={state.coreIndex + 1} total={coreQuestions.length} question={currentCore} response={asSelection(state.coreResponses[currentCore.id])} onResponse={setCoreResponse} onBack={() => dispatch({ type: "core-back" })} onNext={() => dispatch({ type: "core-next" })} onExport={exportSave} onImport={importSave} persistenceMessage={persistenceMessage} />;
  if (state.phase === "specialist-routing") return <SpecialistRoutingScreen selected={state.selectedModuleIds} onToggle={(moduleId) => dispatch({ type: "toggle-module", moduleId })} onContinue={() => dispatch({ type: "specialist-start" })} onSkip={() => dispatch({ type: "skip-specialists" })} onBack={() => dispatch({ type: "routing-back" })} />;
  if (state.phase === "specialist-questionnaire" && currentSpecialist) return <QuestionnaireScreen label={`Specialist module ${state.specialistModuleIndex + 1} of ${state.selectedModuleIds.length}`} current={state.specialistItemIndex + 1} total={selectedSpecialistItems(state).length} question={currentSpecialist} response={asSelection(state.specialistResponses[currentSpecialist.id])} onResponse={setSpecialistResponse} onBack={() => dispatch({ type: "specialist-back" })} onNext={() => dispatch({ type: "specialist-next" })} onExport={exportSave} onImport={importSave} persistenceMessage={persistenceMessage} />;
  if (state.phase === "ready-to-score") return <ReadyScreen selectedModules={state.selectedModuleIds.length} onBack={() => dispatch({ type: "ready-back" })} onScore={score} onExport={exportSave} onImport={importSave} persistenceMessage={persistenceMessage} />;
  if (state.phase === "error") return <ErrorScreen message={state.errorMessage ?? "The assessment could not be scored."} onBack={() => dispatch({ type: "restart" })} />;
  if (state.phase === "results" && state.result) return <ResultsScreen result={state.result} researchInput={makeInput(state)} researchEnabled={researchConfig.enabled} researchEndpoint={researchConfig.endpoint} onRestart={restart} onExport={exportSave} onImport={importSave} persistenceMessage={persistenceMessage} />;
  return <ErrorScreen message="The questionnaire state could not be recovered." onBack={() => dispatch({ type: "restart" })} />;
}

function asSelection(response: StoredResponse | undefined): ResponseSelection | undefined {
  if (!response) return undefined;
  if (response.state !== "answered") return { state: response.state };
  if ("value" in response) return { state: "answered", value: response.value, ...(response.confidence === undefined ? {} : { confidence: response.confidence }), ...(response.priority === undefined ? {} : { priority: response.priority }) };
  return { state: "answered", optionId: response.optionId, ...(response.confidence === undefined ? {} : { confidence: response.confidence }), ...(response.priority === undefined ? {} : { priority: response.priority }) };
}

function LandingScreen({ onStart, onResume, onClearSave, resumeAvailable, resumeWarning, onFixture, onPartialFixture, onImport, persistenceMessage }: { readonly onStart: () => void; readonly onResume: () => void; readonly onClearSave?: () => void; readonly resumeAvailable: boolean; readonly resumeWarning?: string; readonly onFixture?: () => void; readonly onPartialFixture?: () => void; readonly onImport: (file: File) => void | Promise<void>; readonly persistenceMessage?: string }) {
  return <PageShell><section className="hero"><div className="eyebrow">v2 · declarative assessment</div><h1>Map the principles behind your politics.</h1><p className="hero-copy">A measured questionnaire for comparing your answers with explicit ideological profiles. It reports evidence and fit, not identity or certainty.</p><div className="hero-actions"><button className="primary-button" type="button" onClick={onStart}>Start the core questionnaire</button>{resumeAvailable ? <button className="secondary-button" type="button" onClick={onResume}>Resume saved assessment</button> : null}{onFixture ? <button className="secondary-button" type="button" onClick={onFixture}>Use complete test fixture</button> : null}{onPartialFixture ? <button className="secondary-button" type="button" onClick={onPartialFixture}>Use insufficient test fixture</button> : null}{onClearSave ? <button className="text-button" type="button" onClick={onClearSave}>Clear saved assessment</button> : null}</div>{resumeWarning ? <p className="persistence-warning" role="alert">{resumeWarning}</p> : null}<div className="hero-notes"><span>Core evidence · {coreQuestions.length} items</span><span>Private saves stay explicit</span><span>Specialist follow-ups are optional</span></div></section><PersistenceActions canExport={false} onImport={onImport} message={persistenceMessage} /></PageShell>;
}

function QuestionnaireScreen({ label, current, total, question, response, onResponse, onBack, onNext, onExport, onImport, persistenceMessage }: { readonly label: string; readonly current: number; readonly total: number; readonly question: QuestionViewModel; readonly response?: ResponseSelection; readonly onResponse: (selection: ResponseSelection) => void; readonly onBack: () => void; readonly onNext: () => void; readonly onExport: () => void; readonly onImport: (file: File) => void | Promise<void>; readonly persistenceMessage?: string }) {
  return <PageShell><div className="questionnaire-header"><button type="button" className="back-button" onClick={onBack}>Back</button><ProgressIndicator current={current} total={total} label={label} /></div><QuestionCard question={question} response={response} onResponse={onResponse} /><div className="question-actions"><button type="button" className="secondary-button" onClick={onBack}>Back</button><button type="button" className="primary-button" onClick={onNext}>Next</button></div><PersistenceActions canExport onExport={onExport} onImport={onImport} message={persistenceMessage} /></PageShell>;
}

function SpecialistRoutingScreen({ selected, onToggle, onContinue, onSkip, onBack }: { readonly selected: readonly string[]; readonly onToggle: (moduleId: string) => void; readonly onContinue: () => void; readonly onSkip: () => void; readonly onBack: () => void }) {
  return <PageShell><section className="section-intro"><div className="eyebrow">Optional follow-up</div><h1>Choose a specialist module.</h1><p>These modules are separate from the core result. Select only the areas you want to explore; explicit activation and evidence policy remain in canonical content.</p></section><div className="module-grid">{bundle.specialistAssignment.orderedModuleIds.map((moduleId) => { const module = modulePresentation.get(String(moduleId)); if (!module) return null; return <label className={selected.includes(module.id) ? "module-choice selected" : "module-choice"} key={module.id}><input type="checkbox" checked={selected.includes(module.id)} onChange={() => onToggle(module.id)} /><SpecialistModuleCardPreview module={module} /></label>; })}</div><div className="question-actions"><button type="button" className="secondary-button" onClick={onBack}>Back to core</button><button type="button" className="secondary-button" onClick={onSkip}>Skip specialists</button><button type="button" className="primary-button" onClick={onContinue}>{selected.length ? "Continue to selected modules" : "Continue"}</button></div></PageShell>;
}

function SpecialistModuleCardPreview({ module }: { readonly module: ReturnType<typeof buildSpecialistModuleViewModel> }) {
  return <div><div className="card-kicker">{module.estimatedMinutes} min · {module.itemCount} items</div><h2>{module.title}</h2><p>{module.description}</p><small>{module.invitationNote}</small></div>;
}

function ReadyScreen({ selectedModules, onBack, onScore, onExport, onImport, persistenceMessage }: { readonly selectedModules: number; readonly onBack: () => void; readonly onScore: () => void; readonly onExport: () => void; readonly onImport: (file: File) => void | Promise<void>; readonly persistenceMessage?: string }) {
  return <PageShell><section className="ready-card"><div className="eyebrow">Ready to score</div><h1>Your answers are held in this session.</h1><p>{selectedModules ? `${selectedModules} optional specialist module${selectedModules === 1 ? "" : "s"} selected.` : "No specialist modules selected."} You can return to the questionnaire or calculate the result once.</p><div className="question-actions"><button type="button" className="secondary-button" onClick={onBack}>Back to modules</button><button type="button" className="primary-button" onClick={onScore}>View results</button></div></section><PersistenceActions canExport onExport={onExport} onImport={onImport} message={persistenceMessage} /></PageShell>;
}

function ErrorScreen({ message, onBack }: { readonly message: string; readonly onBack: () => void }) {
  return <PageShell><section className="error-card" role="alert"><div className="eyebrow">Recoverable error</div><h1>We could not finish this assessment.</h1><p>{message}</p><button className="secondary-button" type="button" onClick={onBack}>Restart</button></section></PageShell>;
}

export function ResultsScreen({ result, researchInput, researchEnabled, researchEndpoint, onRestart, onExport, onImport, persistenceMessage }: { readonly result: AssessmentResult; readonly researchInput: AssessmentInput; readonly researchEnabled: boolean; readonly researchEndpoint?: string; readonly onRestart: () => void; readonly onExport: () => void; readonly onImport: (file: File) => void | Promise<void>; readonly persistenceMessage?: string }) {
  const viewModel = useMemo(() => buildAssessmentViewModel(result, bundle), [result]);
  const [shareText, setShareText] = useState<string>();
  const [researchState, setResearchState] = useState<ResearchPanelState>(researchEnabled ? "available" : "unavailable");
  const [researchEnvelope, setResearchEnvelope] = useState<ResearchSubmissionEnvelope>();
  const reviewConsent = () => { if (researchEnabled) setResearchState("review-consent"); };
  const declineResearch = () => { setResearchEnvelope(undefined); setResearchState("declined"); };
  const consentResearch = () => {
    try {
      const envelope = createResearchSubmission(researchInput, bundle as unknown as ResearchBundle);
      setResearchEnvelope(envelope);
      setResearchState("consented");
    } catch {
      setResearchState("retryable-error");
    }
  };
  const sendResearch = async () => {
    if (!researchEnvelope || !researchEndpoint) { setResearchState("retryable-error"); return; }
    setResearchState("sending");
    try { await sendResearchSubmission(researchEnvelope, researchEndpoint); setResearchState("sent"); } catch { setResearchState("retryable-error"); }
  };
  const createShare = () => setShareText(serializePublicShare(projectPublicShare(result)));
  return <PageShell><header className="results-header"><div><div className="eyebrow">Assessment result</div><h1>{viewModel.statusLabel}</h1><p>{viewModel.coreCoverageLabel} core evidence coverage · {viewModel.primary.uncertaintyLabel} uncertainty</p></div><button type="button" className="secondary-button" onClick={onRestart}>Start over</button></header><div className="result-actions"><button type="button" className="secondary-button" onClick={createShare}>Generate public share preview</button><p>A public share contains only the measured result projection, not raw answers or contribution traces.</p>{shareText ? <label className="share-preview">Public share JSON<textarea readOnly value={shareText} aria-label="Public share JSON" /></label> : null}</div>{researchEnabled ? <ResearchPanel state={researchState} onReviewConsent={reviewConsent} onDecline={declineResearch} onConsent={consentResearch} onSend={sendResearch} onRetry={sendResearch} /> : null}<EvidenceSummary viewModel={viewModel} /><section className="result-section"><div className="section-heading"><div><div className="eyebrow">Primary profiles</div><h2>Closest matches</h2></div><span>{viewModel.primary.tieLabel}</span></div><div className="result-grid">{viewModel.primary.profiles.map((profile) => <ProfileMatchCard profile={profile} key={profile.id} />)}</div></section><section className="result-section"><div className="eyebrow">Modifiers</div><h2>Additional measured dimensions</h2><div className="result-grid">{viewModel.modifiers.map((modifier) => <ModifierCard modifier={modifier} key={modifier.id} />)}</div></section><section className="result-section"><div className="eyebrow">Specialists</div><h2>Optional module results</h2><div className="result-grid">{viewModel.specialists.map((module) => <SpecialistModuleCard module={module} key={module.id} />)}</div></section><section className="result-section"><div className="eyebrow">Constructs and evidence</div><h2>Measured dimensions</h2><div className="construct-list">{viewModel.constructs.slice(0, 18).map((construct) => <ConstructScale construct={construct} key={construct.id} />)}</div></section><section className="result-section"><div className="eyebrow">Diagnostics</div><h2>How to read the result</h2><p className="section-copy">These details describe evidence coverage, gates, and traced contributions. They do not create a second scoring calculation.</p><DiagnosticDetails diagnostics={viewModel.diagnostics} /></section><VersionInfo version={viewModel.version} /><PersistenceActions canExport onExport={onExport} onImport={onImport} message={persistenceMessage} /></PageShell>;
}
