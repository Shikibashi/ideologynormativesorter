import type { ReactNode } from "react";
import type { QuestionViewModel } from "../../../packages/view-model/src";
import type {
  AssessmentViewModel,
  GateViewModel,
} from "../../../packages/view-model/src";

export function PageShell({ children }: { readonly children: ReactNode }) {
  return <main className="page-shell">{children}</main>;
}

export function PersistenceActions({
  canExport,
  onExport,
  onImport,
  message,
}: {
  readonly canExport: boolean;
  readonly onExport?: () => void;
  readonly onImport: (file: File) => void | Promise<void>;
  readonly message?: string;
}) {
  return (
    <section className="persistence-actions" aria-label="Private assessment save">
      <div>
        <div className="eyebrow">Private device save</div>
        <p>Keep a private v2 save on this device, or move it explicitly as a private file. It is not a public share.</p>
      </div>
      <div className="persistence-buttons">
        <label className="secondary-button file-button">Import private save<input type="file" accept="application/json,.json" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void onImport(file); event.currentTarget.value = ""; }} /></label>
        {canExport && onExport ? <button type="button" className="secondary-button" onClick={onExport}>Export private save</button> : null}
      </div>
      {message ? <p className="persistence-message" role="status">{message}</p> : null}
    </section>
  );
}

export function QuestionCard({
  question,
  response,
  onResponse,
}: {
  readonly question: QuestionViewModel;
  readonly response?: ResponseSelection;
  readonly onResponse: (selection: ResponseSelection) => void;
}) {
  return (
    <section className="question-card" data-testid="question-card" aria-labelledby="question-heading">
      <div className="question-meta">
        <span>{question.domainLabel}</span>
        <span>{question.layer}</span>
      </div>
      <h2 id="question-heading">{question.prompt}</h2>
      {question.contextNote ? <p className="context-note">{question.contextNote}</p> : null}
      {question.responseType === "statement-choice" ? (
        <StatementChoiceControl question={question} response={response} onResponse={onResponse} />
      ) : (
        <LikertControl question={question} response={response} onResponse={onResponse} />
      )}
      <ResponseStateControls response={response} onResponse={onResponse} />
    </section>
  );
}

export type ResponseSelection =
  | { readonly state: "answered"; readonly value: number; readonly confidence?: 1 | 3 | 5; readonly priority?: 1 | 3 | 5 }
  | { readonly state: "answered"; readonly optionId: string; readonly confidence?: 1 | 3 | 5; readonly priority?: 1 | 3 | 5 }
  | { readonly state: "missing" | "skipped" | "abstained" | "refused" };

export function LikertControl({
  question,
  response,
  onResponse,
}: {
  readonly question: QuestionViewModel;
  readonly response?: ResponseSelection;
  readonly onResponse: (selection: ResponseSelection) => void;
}) {
  const values = Array.from({ length: (question.scaleMax ?? 0) - (question.scaleMin ?? 0) + 1 }, (_, index) => (question.scaleMin ?? 0) + index);
  const selected = response?.state === "answered" && "value" in response ? response.value : undefined;
  return (
    <div className="likert-control" data-testid="question-control">
      <div className="likert-labels" aria-hidden="true"><span>Lower</span><span>Neutral</span><span>Higher</span></div>
      <div className="likert-options" role="radiogroup" aria-label={`Response scale for ${question.id}`}>
        {values.map((value) => (
          <button
            type="button"
            role="radio"
            aria-checked={selected === value}
            className={selected === value ? "choice-button selected" : "choice-button"}
            key={value}
            aria-label={`${question.id} response ${value}`}
            onClick={() => onResponse({ state: "answered", value })}
          >{value > 0 ? `+${value}` : value}</button>
        ))}
      </div>
      <ResponseMetaCapture response={response} onResponse={onResponse} />
    </div>
  );
}

export function StatementChoiceControl({
  question,
  response,
  onResponse,
}: {
  readonly question: QuestionViewModel;
  readonly response?: ResponseSelection;
  readonly onResponse: (selection: ResponseSelection) => void;
}) {
  const selected = response?.state === "answered" && "optionId" in response ? response.optionId : undefined;
  return (
    <div className="statement-options" data-testid="question-control" role="radiogroup" aria-label={`Statements for ${question.id}`}>
      {question.options.map((option) => (
        <button
          type="button"
          role="radio"
          aria-checked={selected === option.id}
          className={selected === option.id ? "statement-button selected" : "statement-button"}
          key={option.id}
          onClick={() => onResponse({ state: "answered", optionId: option.id })}
        >{option.text}</button>
      ))}
      <ResponseMetaCapture response={response} onResponse={onResponse} />
    </div>
  );
}

function ResponseMetaCapture({
  response,
  onResponse,
}: {
  readonly response?: ResponseSelection;
  readonly onResponse: (selection: ResponseSelection) => void;
}) {
  if (!response || response.state !== "answered") return null;
  const update = (field: "confidence" | "priority", value: string) => {
    const numeric = value === "" ? undefined : Number(value) as 1 | 3 | 5;
    onResponse({ ...response, ...(field === "confidence" ? { confidence: numeric } : { priority: numeric }) });
  };
  return (
    <div className="response-meta">
      <label>Confidence captured
        <select value={response.confidence ?? ""} onChange={(event) => update("confidence", event.target.value)}>
          <option value="">Not captured</option><option value="1">1</option><option value="3">3</option><option value="5">5</option>
        </select>
      </label>
      <label>Priority captured
        <select value={response.priority ?? ""} onChange={(event) => update("priority", event.target.value)}>
          <option value="">Not captured</option><option value="1">1</option><option value="3">3</option><option value="5">5</option>
        </select>
      </label>
    </div>
  );
}

function ResponseStateControls({
  response,
  onResponse,
}: {
  readonly response?: ResponseSelection;
  readonly onResponse: (selection: ResponseSelection) => void;
}) {
  return (
    <div className="state-controls" aria-label="Response state">
      <button type="button" className={response?.state === "missing" ? "text-button active" : "text-button"} onClick={() => onResponse({ state: "missing" })}>Leave unanswered</button>
      <button type="button" className={response?.state === "skipped" ? "text-button active" : "text-button"} onClick={() => onResponse({ state: "skipped" })}>Skip for now</button>
      <button type="button" className={response?.state === "abstained" ? "text-button active" : "text-button"} onClick={() => onResponse({ state: "abstained" })}>Abstain</button>
      <button type="button" className={response?.state === "refused" ? "text-button active" : "text-button"} onClick={() => onResponse({ state: "refused" })}>Decline to answer</button>
    </div>
  );
}

export function ProgressIndicator({ current, total, label }: { readonly current: number; readonly total: number; readonly label: string }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return <div className="progress-block" aria-label={`${label}: ${current} of ${total}`}><div className="progress-copy"><span>{label}</span><span>{current} / {total}</span></div><div className="progress-track"><span style={{ width: `${percent}%` }} /></div></div>;
}

export function ProfileMatchCard({ profile }: { readonly profile: AssessmentViewModel["primary"]["profiles"][number] }) {
  return <article className="result-card profile-card"><div className="card-kicker">{profile.rank ? `Rank ${profile.rank}` : "No rank"}</div><h3>{profile.name}</h3><strong>{profile.similarityLabel}</strong><p>{profile.evidenceLabel} · {profile.uncertaintyLabel} uncertainty</p><GateStatus gates={profile.gateSummary} /></article>;
}

export function ModifierCard({ modifier }: { readonly modifier: AssessmentViewModel["modifiers"][number] }) {
  return <article className="result-card"><div className="card-kicker">Modifier</div><h3>{modifier.name}</h3><strong>{modifier.fitLabel}</strong><p>{modifier.status} · {modifier.measurementLabel}{modifier.reason ? ` · ${modifier.reason}` : ""}</p></article>;
}

export function SpecialistModuleCard({ module }: { readonly module: AssessmentViewModel["specialists"][number] }) {
  return <article className="result-card"><div className="card-kicker">{module.shortTitle}</div><h3>{module.title}</h3><p>{module.status} · {module.evidenceLabel}</p><div className="specialist-profiles">{module.profiles.map((profile) => <span key={profile.id}>{profile.name}: {profile.similarityLabel}</span>)}</div></article>;
}

export function ConstructScale({ construct }: { readonly construct: AssessmentViewModel["constructs"][number] }) {
  return <article className="construct-row"><div><strong>{construct.name}</strong><span>{construct.positionLabel}</span></div><strong>{construct.scoreLabel}</strong><small>{construct.evidenceLabel} evidence</small></article>;
}

export function EvidenceSummary({ viewModel }: { readonly viewModel: AssessmentViewModel }) {
  return <div className="evidence-summary"><strong>{viewModel.coreCoverageLabel}</strong><span>core evidence coverage</span><span>{viewModel.evidenceLabel} evidence state</span></div>;
}

export function GateStatus({ gates }: { readonly gates: readonly GateViewModel[] }) {
  if (gates.length === 0) return null;
  return <ul className="gate-list">{gates.map((gate) => <li key={gate.id} data-status={gate.status}>{gate.status}: {gate.reason}</li>)}</ul>;
}

export function DiagnosticDetails({ diagnostics }: { readonly diagnostics: AssessmentViewModel["diagnostics"] }) {
  return <div className="diagnostic-list">{diagnostics.slice(0, 8).map((diagnostic) => <details key={diagnostic.id}><summary>{diagnostic.summary}</summary><p>{diagnostic.severity} · {diagnostic.contributionCount} traced contributions</p><p>Positive: {diagnostic.strongestPositiveLabels.join(", ") || "None"}</p><p>Negative: {diagnostic.strongestNegativeLabels.join(", ") || "None"}</p></details>)}</div>;
}

export function VersionInfo({ version }: { readonly version: AssessmentViewModel["version"] }) {
  return <details className="version-info"><summary>Version information</summary><dl><dt>Content</dt><dd>{version.contentVersion}</dd><dt>Content fingerprint</dt><dd className="break-anywhere">{version.contentFingerprint}</dd><dt>Scoring</dt><dd>{version.scoringVersion}</dd><dt>Result schema</dt><dd>{version.resultSchemaVersion}</dd></dl></details>;
}
