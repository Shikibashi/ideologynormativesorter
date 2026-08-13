import type { LabelId } from "../types";
import type {
  SpecialistModuleDefinition,
  SpecialistOutcome,
} from "../specialist";
import { labelById } from "../data/labels";
import { getIdeologyLabelSources } from "../data/labelSources";
import { constructSignalLabel, labelProximityLabel } from "../resultLanguage";

interface SpecialistModuleResultScreenProps {
  module: SpecialistModuleDefinition;
  outcome: SpecialistOutcome;
  onContinue: () => void;
}

/** Public experimental results are stricter than the internal candidate roster. */
const MINIMUM_VISIBLE_FIT = 0.6;
const MINIMUM_VISIBLE_EVIDENCE_COVERAGE = 0.6;

function formatConstructName(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function SpecialistModuleResultScreen({
  module,
  outcome,
  onContinue,
}: SpecialistModuleResultScreenProps) {
  const visibleMatches = outcome.matches
    .filter(
      (match) =>
        !match.insufficientEvidence && match.fit >= MINIMUM_VISIBLE_FIT,
    )
    .filter(
      (match) =>
        (match.evidenceCoverage ?? 0) >= MINIMUM_VISIBLE_EVIDENCE_COVERAGE,
    )
    .filter(
      (match) =>
        match.gateStatus !== "blocked" &&
        match.gateStatus !== "insufficient-evidence",
    )
    .slice(0, 5);
  const candidateById = new Map(
    module.criterionOptions.map((candidate) => [
      candidate.traditionId,
      candidate,
    ]),
  );
  const constructs = Object.entries(outcome.constructScores).sort(
    (left, right) => Math.abs(right[1]) - Math.abs(left[1]),
  );

  return (
    <section className="screen results-screen">
      <div className="section-band">
        <span className="section-band-label">COMMUNITY INPUT / EXPERIMENT</span>
        <span className="section-band-status">MAIN RESULT UNCHANGED</span>
      </div>
      <h1>Experimental follow-up result</h1>
      <p>
        This is an early result for <strong>{module.title}</strong>.
        Contributions help the site owner see whether these finer distinctions
        are useful. It does not alter your main ideology result.
      </p>
      <p className="muted">
        The matches below are experimental comparisons, not authoritative claims
        about your political identity.
      </p>
      <p className="muted">
        “Sufficient” evidence here means that enough mapped constructs were
        answered to display a provisional comparison; it is not a reliability,
        validity, or population-representativeness finding.
      </p>
      {outcome.evidence?.status === "insufficient-evidence" ? (
        <p className="notice-card" role="status">
          Overall module coverage is sparse. Any match shown below is limited to
          a profile with enough defining construct evidence; unanswered
          dimensions remain unclassified.
        </p>
      ) : outcome.evidence ? (
        <p className="muted">
          Evidence coverage:{" "}
          {Math.round(outcome.evidence.answeredCoverage * 100)}% of items
          answered;{" "}
          {Math.round(outcome.evidence.weightedAnsweredCoverage * 100)}%
          weighted coverage.
        </p>
      ) : null}

      <div className="result-block">
        <h2>Closest experimental matches</h2>
        {visibleMatches.length > 0 ? (
          <div className="label-grid">
            {visibleMatches.map((match) => {
              const candidate = candidateById.get(match.id);
              const label = labelById.get(match.id as LabelId);
              const sources = label ? getIdeologyLabelSources(label, true) : [];
              return (
                <article
                  className="label-card"
                  key={`${match.id}:${match.variant ?? ""}`}
                >
                  <h5>
                    {match.name}
                    {match.variant ? ` — ${match.variant}` : ""}
                  </h5>
                  <p className="muted">
                    {labelProximityLabel(match.fit)} · experimental candidate
                    comparison
                  </p>
                  {(candidate?.description ?? label?.description) && (
                    <p className="muted">
                      {candidate?.description ?? label?.description}
                    </p>
                  )}
                  {label && (label.usageNote || label.cautionNote) && (
                    <details className="label-context-disclosure">
                      <summary>Scope and limitations</summary>
                      {label.usageNote && (
                        <p className="muted">{label.usageNote}</p>
                      )}
                      {label.cautionNote && (
                        <p className="muted">{label.cautionNote}</p>
                      )}
                    </details>
                  )}
                  {sources.length > 0 && (
                    <details className="label-source-disclosure">
                      <summary>Sources and scope</summary>
                      <p className="muted">
                        These sources interpret the tradition; they do not
                        validate this experimental comparison or establish an
                        identity claim.
                      </p>
                      <ul>
                        {sources.map((source) => (
                          <li key={source.sourceId}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {source.title}
                            </a>
                            {source.publisher && (
                              <span className="muted">
                                {" "}
                                · {source.publisher}
                              </span>
                            )}
                            <div className="muted">{source.note}</div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="muted">
            No candidate profile met the experimental display threshold. That is
            useful feedback too.
          </p>
        )}
      </div>

      <div className="result-block">
        <h2>Measured follow-up dimensions</h2>
        <div className="axis-list">
          {constructs.map(([constructId, score]) => (
            <div className="axis-row" key={constructId}>
              <div className="axis-label">
                <span>{formatConstructName(constructId)}</span>
                <span>{constructSignalLabel(score)}</span>
              </div>
              <div
                className="progress-track"
                aria-label={`${formatConstructName(constructId)}: ${constructSignalLabel(score)}`}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${Math.abs(score) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="primary-button" onClick={onContinue}>
        Continue to main results
      </button>
    </section>
  );
}
