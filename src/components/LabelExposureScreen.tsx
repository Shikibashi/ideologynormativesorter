import { useMemo, useState } from "react";
import type {
  Axis,
  LabelExposureAssignment,
  LabelExposureOutcome,
  ResultProfile,
} from "../types";

interface LabelExposureScreenProps {
  assignment: LabelExposureAssignment;
  result: ResultProfile;
  axes: Axis[];
  onComplete: (outcome: LabelExposureOutcome) => void;
}

const RATING_FIELDS = [
  ["perceivedAccuracy", "How accurate did this presentation feel?"],
  ["identityAcceptance", "How much did it feel like a fitting description?"],
  ["confidence", "How confident are you in that reaction?"],
  ["affect", "How positive was your reaction to seeing it?"],
  ["followUpStability", "How stable do you expect this reaction to be?"],
] as const;

function ratingValue(value: string): number | undefined {
  return value ? Number(value) : undefined;
}

export function LabelExposureScreen({
  assignment,
  result,
  axes,
  onComplete,
}: LabelExposureScreenProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const axisNames = useMemo(
    () => new Map(axes.map((axis) => [axis.id, axis.name])),
    [axes],
  );
  const visibleMatches = result.nearestLabels.slice(0, 3);
  const exposedLabelIds =
    assignment.arm === "named-label"
      ? visibleMatches.map((match) => String(match.labelId))
      : [];
  const axisScores = [
    ...result.scores.normative,
    ...result.scores.descriptive,
    ...result.scores.prescriptive,
  ].slice(0, assignment.arm === "dimension-only" ? 8 : 12);

  function complete(missingReason?: LabelExposureOutcome["missingReason"]) {
    if (submitted) return;
    setSubmitted(true);
    onComplete({
      assignment,
      exposureShown: true,
      exposedLabelIds,
      perceivedAccuracy: ratingValue(ratings.perceivedAccuracy),
      identityAcceptance: ratingValue(ratings.identityAcceptance),
      confidence: ratingValue(ratings.confidence),
      affect: ratingValue(ratings.affect),
      followUpStability: ratingValue(ratings.followUpStability),
      missingReason,
    });
  }

  return (
    <section className="screen intro-screen">
      <div className="section-band">
        <span className="section-band-label">
          RESEARCH ARM / LABEL EXPOSURE
        </span>
        <span className="section-band-status">OPTIONAL FOLLOW-UP</span>
      </div>
      <h1>How does this presentation land?</h1>
      <p>
        This optional research arm was assigned after your substantive answers.
        It does not change the score that was computed from those answers.
      </p>
      {assignment.arm === "named-label" ? (
        <div className="result-card">
          <h2>Named-label presentation</h2>
          <p className="muted">Your closest current matches are:</p>
          <ul>
            {visibleMatches.map((match) => (
              <li key={String(match.labelId)}>{match.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="result-card">
          <h2>
            {assignment.arm === "dimension-only"
              ? "Dimension-only presentation"
              : "Unlabeled profile presentation"}
          </h2>
          <p className="muted">
            {assignment.arm === "dimension-only"
              ? "The display names dimensions without assigning an ideology label."
              : "The display shows a profile without naming an ideology label."}
          </p>
          <ul>
            {axisScores.map((score) => (
              <li key={`${score.layer}-${score.axisId}`}>
                {axisNames.get(score.axisId) ?? String(score.axisId)}:{" "}
                {score.normalized.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="form-grid">
        {RATING_FIELDS.map(([field, prompt]) => (
          <label className="form-field" key={field}>
            <span>{prompt}</span>
            <select
              value={ratings[field] ?? ""}
              onChange={(event) =>
                setRatings((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
            >
              <option value="">Prefer not to answer</option>
              <option value="1">1 — not at all</option>
              <option value="2">2</option>
              <option value="3">3 — mixed</option>
              <option value="4">4</option>
              <option value="5">5 — very much</option>
            </select>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={() => complete()}
      >
        Continue to optional profile fields
      </button>
      <button
        type="button"
        className="back-link"
        onClick={() => complete("declined")}
      >
        Continue without rating
      </button>
    </section>
  );
}
