import { useMemo, useState } from "react";
import type {
  Axis,
  LabelExposureOutcome,
  LabelExposureRating,
  ResultProfile,
} from "../types";
import {
  buildLabelExposurePresentation,
  labelExposureCoverageText,
} from "../research/labelExposure";

interface LabelExposureScreenProps {
  assignment: import("../types").LabelExposureAssignment;
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

function ratingValue(value: string): LabelExposureRating {
  return value ? Number(value) : "prefer_not_to_answer";
}

export function LabelExposureScreen({
  assignment,
  result,
  axes,
  onComplete,
}: LabelExposureScreenProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const presentation = useMemo(
    () => buildLabelExposurePresentation(result, axes),
    [axes, result],
  );
  const visibleMatches = result.nearestLabels.slice(0, 3);
  const exposedLabelIds =
    assignment.arm === "named-label"
      ? visibleMatches.map((match) => String(match.labelId))
      : [];

  function complete(): void {
    if (submitted) return;
    setSubmitted(true);
    const completedRatings: LabelExposureOutcome["ratings"] = {
      perceivedAccuracy: ratingValue(ratings.perceivedAccuracy ?? ""),
      identityAcceptance: ratingValue(ratings.identityAcceptance ?? ""),
      confidence: ratingValue(ratings.confidence ?? ""),
      affect: ratingValue(ratings.affect ?? ""),
      followUpStability: ratingValue(ratings.followUpStability ?? ""),
    };
    onComplete({
      assignment,
      exposureShown: true,
      presentation,
      exposedLabelIds,
      ratings: completedRatings,
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
        It does not change the profile that was computed from those answers.
      </p>
      <p className="muted">
        This is a profile-similarity comparison, not a diagnosis, probability,
        validated identity, or population claim. Some dimensions are more
        tentative when answer coverage is limited.
      </p>
      <div className="result-card" data-exposure-profile>
        <h2>Your profile comparison</h2>
        <p className="muted">
          The same substantive profile is shown in every presentation condition.
          Positions are described in plain language, with answer coverage shown
          separately.
        </p>
        <h3>Profile dimensions</h3>
        <ul aria-label="Profile dimensions">
          {presentation.axes.map((axis) => {
            const score = result.scores[axis.layer].find(
              (candidate) => String(candidate.axisId) === axis.axisId,
            );
            const position =
              axis.position === "near midpoint" ||
              axis.position === "unmeasured"
                ? axis.position
                : `${axis.position} ${axis.pole}`;
            return (
              <li key={`${axis.layer}-${axis.axisId}`}>
                <span>
                  {axis.name}: {position}
                </span>{" "}
                <span className="muted">
                  (
                  {labelExposureCoverageText(
                    axis.coverageBand,
                    score?.itemCount ?? 0,
                  )}
                  )
                </span>
              </li>
            );
          })}
        </ul>
        {assignment.arm === "named-label" && (
          <>
            <h3>Closest current profile matches</h3>
            <ul aria-label="Closest current profile matches">
              {visibleMatches.map((match) => (
                <li key={String(match.labelId)}>{match.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="form-grid">
        {RATING_FIELDS.map(([field, prompt]) => (
          <label className="form-field" key={field}>
            <span>{prompt}</span>
            <select
              aria-label={prompt}
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
      <button type="button" className="primary-button" onClick={complete}>
        Continue to optional profile fields
      </button>
      <button type="button" className="back-link" onClick={complete}>
        Continue without rating
      </button>
    </section>
  );
}
