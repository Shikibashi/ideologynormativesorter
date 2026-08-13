import { useEffect, useRef, useState } from "react";
import { quizTierLabel } from "../quizTiers";
import type { QuizTier } from "../types";

interface TierOption {
  tier: QuizTier;
  label: string;
  blurb: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    tier: "moderate",
    label: quizTierLabel("moderate"),
    blurb: "Covers every domain with a balanced selection of questions.",
  },
  {
    tier: "extensive",
    label: quizTierLabel("extensive"),
    blurb: "Uses the entire question bank for the most detailed profile.",
  },
];

interface IntroScreenProps {
  questionCounts: Record<QuizTier, number>;
  domainCount: number;
  savedProgress: { tier: QuizTier; answered: number; total: number } | null;
  onResume: () => void;
  onStart: (tier: QuizTier, contribute: boolean) => void;
  onTierChange?: (tier: QuizTier) => void;
  onClearSavedProgress: () => void;
  contributionAvailable: boolean;
  loadError?: string | null;
  onDismissLoadError?: () => void;
}

export function IntroScreen({
  questionCounts,
  domainCount,
  savedProgress,
  onResume,
  onStart,
  onTierChange,
  onClearSavedProgress,
  contributionAvailable,
  loadError,
  onDismissLoadError,
}: IntroScreenProps) {
  const [tier, setTier] = useState<QuizTier>("moderate");
  const [contribute, setContribute] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const startFreshRef = useRef<HTMLButtonElement>(null);
  const confirmClearRef = useRef<HTMLButtonElement>(null);
  const setupHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    onTierChange?.(tier);
  }, [onTierChange, tier]);

  useEffect(() => {
    if (confirmingClear) confirmClearRef.current?.focus();
  }, [confirmingClear]);

  return (
    <section className="screen intro-screen">
      <div className="section-band">
        <span className="section-band-label">ASSESSMENT / START</span>
        <span className="section-band-status">LOCAL SESSION</span>
      </div>
      <h1>Political Judgment Decomposition</h1>
      <p className="lede">
        Most political quizzes collapse three different kinds of judgment into a
        single left-right score. This one keeps them separate.
      </p>

      {loadError && (
        <div className="resume-banner" role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            className="back-link"
            onClick={onDismissLoadError}
          >
            Dismiss
          </button>
        </div>
      )}

      {savedProgress && (
        <div className="resume-banner" aria-labelledby="saved-session-heading">
          <h2 id="saved-session-heading">Saved session available</h2>
          <p>
            You have a saved session in progress ({savedProgress.answered} of{" "}
            {savedProgress.total} questions answered in the{" "}
            {quizTierLabel(savedProgress.tier).toLowerCase()}).
          </p>
          <div className="resume-actions">
            <button type="button" className="primary-button" onClick={onResume}>
              Resume
            </button>
            {!confirmingClear ? (
              <button
                ref={startFreshRef}
                type="button"
                className="back-link"
                onClick={() => setConfirmingClear(true)}
              >
                Start fresh
              </button>
            ) : (
              <div
                className="confirm-reset"
                role="group"
                aria-label="Confirm clearing saved session"
              >
                <span className="muted">
                  This removes the saved answers from this browser.
                </span>
                <button
                  ref={confirmClearRef}
                  type="button"
                  className="back-link"
                  onClick={() => {
                    onClearSavedProgress();
                    setConfirmingClear(false);
                    requestAnimationFrame(() =>
                      setupHeadingRef.current?.focus(),
                    );
                  }}
                >
                  Clear saved session
                </button>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setConfirmingClear(false);
                    requestAnimationFrame(() => startFreshRef.current?.focus());
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="intro-layout">
        <div className="intro-information">
          <div className="explainer">
            <div className="explainer-item">
              <h2>
                Foundational values <span className="muted">(normative)</span>
              </h2>
              <p>
                What you consider morally legitimate in an ideal political order
                &mdash; who has rightful authority, and what people are owed.
              </p>
            </div>
            <div className="explainer-item">
              <h2>
                Empirical beliefs <span className="muted">(descriptive)</span>
              </h2>
              <p>
                What you believe tends to be true &mdash; how markets, states,
                culture, and institutions actually behave.
              </p>
            </div>
            <div className="explainer-item">
              <h2>
                Applied policy and strategy{" "}
                <span className="muted">(prescriptive)</span>
              </h2>
              <p>
                Which institutions, reforms, or strategies you favor under the
                ideal, current, or mixed conditions named by an item.
              </p>
            </div>
          </div>

          <p>
            Many items also distinguish <strong>ideal theory</strong> (how
            things should work under favorable conditions) from{" "}
            <strong>non-ideal theory</strong> (what to do given real-world
            limits, corruption, or bad actors). People who agree on ideals often
            disagree sharply on what to do right now, and that gap is itself
            informative.
          </p>

          <p className="muted">
            At the end you'll see your foundational-values, empirical-beliefs,
            and applied-policy profiles separately, plus the gap between your
            ideal and non-ideal answers. We also surface a few nearby ideology
            labels for context, but these are a secondary, approximate summary
            &mdash; your three profiles are the actual result, and most real
            positions don't reduce cleanly to one label.
          </p>
        </div>

        <div className="intro-rail">
          <aside
            className="intro-setup"
            aria-labelledby="session-setup-heading"
          >
            <h2 ref={setupHeadingRef} id="session-setup-heading" tabIndex={-1}>
              Session setup
            </h2>
            <p className="muted">
              Choose the depth of the assessment before you begin.
            </p>
            <fieldset className="tier-picker">
              <legend>Choose a length</legend>
              {TIER_OPTIONS.map((option) => (
                <label
                  key={option.tier}
                  className={`tier-option${tier === option.tier ? " selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={option.tier}
                    checked={tier === option.tier}
                    onChange={() => setTier(option.tier)}
                  />
                  <span className="tier-option-label">
                    {option.label} &middot; {questionCounts[option.tier]}{" "}
                    questions
                  </span>
                  <span className="tier-option-blurb">{option.blurb}</span>
                </label>
              ))}
            </fieldset>

            <p className="muted">
              Covers {domainCount} policy domains. You can answer "I don't know"
              on empirical items.
            </p>

            <section
              className="research-invite"
              aria-labelledby="research-invite-heading"
            >
              <h2 id="research-invite-heading">Help expand the label set</h2>
              <label
                className={`tier-option contribution-option${contribute ? " selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={contribute}
                  disabled={!contributionAvailable}
                  onChange={(event) => setContribute(event.target.checked)}
                />
                <span className="tier-option-label">
                  Optionally contribute this {quizTierLabel(tier).toLowerCase()}
                </span>
                <span className="tier-option-blurb">
                  This uses the same {questionCounts[tier]}-question profile,
                  not a separate test. After answering, you may name ideologies
                  or traditions you subscribe to before seeing your result.
                </span>
              </label>
              <p className="muted">
                With your consent, the site sends pseudonymous answers and
                optional self-description to help the site owner review
                questions and candidate labels. It never changes your score or
                adds an ideology automatically, and you can still skip
                submission before seeing your result.
              </p>
              {!contributionAvailable && (
                <p className="muted" role="status">
                  Contribution collection is not configured in this build.
                </p>
              )}
            </section>

            <button
              type="button"
              className="primary-button"
              onClick={() => onStart(tier, contribute)}
            >
              {contribute ? "Review contribution details" : "Begin assessment"}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
