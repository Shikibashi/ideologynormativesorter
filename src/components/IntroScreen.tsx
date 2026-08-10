import { useState } from 'react'
import { PUBLIC_RESEARCH_ENTRYPOINT } from '../research'
import type { QuizTier } from '../types'

interface TierOption {
  tier: QuizTier
  label: string
  blurb: string
}

const TIER_OPTIONS: TierOption[] = [
  { tier: 'blitz', label: 'Blitz', blurb: 'Seven items per layer across key domains. A fast snapshot of all three profiles.' },
  { tier: 'quick', label: 'Quick', blurb: 'One item per domain per layer. A fast overview.' },
  { tier: 'moderate', label: 'Moderate', blurb: 'A balanced middle pool with more depth per domain.' },
  { tier: 'extensive', label: 'Extensive', blurb: 'The full item bank, for the most precise profile.' },
]

interface IntroScreenProps {
  questionCounts: Record<QuizTier, number>
  domainCount: number
  savedProgress: { tier: QuizTier; answered: number; total: number } | null
  onResume: () => void
  onStart: (tier: QuizTier) => void
  onClearSavedProgress: () => void
  loadError?: string | null
  onDismissLoadError?: () => void
}

export function IntroScreen({ questionCounts, domainCount, savedProgress, onResume, onStart, onClearSavedProgress, loadError, onDismissLoadError }: IntroScreenProps) {
  const [tier, setTier] = useState<QuizTier>('moderate')
  const [confirmingClear, setConfirmingClear] = useState(false)

  return (
    <section className="screen intro-screen">
      <div className="section-band">
        <span className="section-band-label">ASSESSMENT / START</span>
        <span className="section-band-status">LOCAL SESSION</span>
      </div>
      <h1>Political Judgment Decomposition</h1>
      <p className="lede">
        Most political quizzes collapse three different kinds of judgment into a single left-right score. This one keeps
        them separate.
      </p>

      {loadError && (
        <div className="resume-banner" role="alert">
          <p>{loadError}</p>
          <button type="button" className="back-link" onClick={onDismissLoadError}>
            Dismiss
          </button>
        </div>
      )}

      {savedProgress && (
        <div className="resume-banner" aria-labelledby="saved-session-heading">
          <h2 id="saved-session-heading">Saved session available</h2>
          <p>
            You have a saved session in progress ({savedProgress.answered} of {savedProgress.total} questions answered in
            the {savedProgress.tier} test).
          </p>
          <div className="resume-actions">
            <button type="button" className="primary-button" onClick={onResume}>
              Resume
            </button>
            {!confirmingClear ? (
              <button type="button" className="back-link" onClick={() => setConfirmingClear(true)}>
                Start fresh
              </button>
            ) : (
              <div className="confirm-reset" role="group" aria-label="Confirm clearing saved session">
                <span className="muted">This removes the saved answers from this browser.</span>
                <button type="button" className="back-link" onClick={() => { onClearSavedProgress(); setConfirmingClear(false) }}>
                  Clear saved session
                </button>
                <button type="button" className="back-link" onClick={() => setConfirmingClear(false)}>
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
              <h2>Foundational values <span className="muted">(normative)</span></h2>
              <p>What you consider morally legitimate in an ideal political order &mdash; who has rightful authority, and what people are owed.</p>
            </div>
            <div className="explainer-item">
              <h2>Empirical beliefs <span className="muted">(descriptive)</span></h2>
              <p>What you believe tends to be true &mdash; how markets, states, culture, and institutions actually behave.</p>
            </div>
            <div className="explainer-item">
              <h2>Applied policy and strategy <span className="muted">(prescriptive)</span></h2>
              <p>Which institutions, reforms, or strategies you favor under the ideal, current, or mixed conditions named by an item.</p>
            </div>
          </div>

          <p>
            Many items also distinguish <strong>ideal theory</strong> (how things should work under favorable conditions) from{' '}
            <strong>non-ideal theory</strong> (what to do given real-world limits, corruption, or bad actors). People who agree
            on ideals often disagree sharply on what to do right now, and that gap is itself informative.
          </p>

          <p className="muted">
            At the end you'll see your foundational-values, empirical-beliefs, and applied-policy profiles separately, plus the gap between your
            ideal and non-ideal answers. We also surface a few nearby ideology labels for context, but these are a secondary,
            approximate summary &mdash; your three profiles are the actual result, and most real positions don't reduce
            cleanly to one label.
          </p>
        </div>

        <div className="intro-rail">
          <aside className="intro-setup" aria-labelledby="session-setup-heading">
            <h2 id="session-setup-heading">Session setup</h2>
            <p className="muted">Choose the depth of the assessment before you begin.</p>
            <fieldset className="tier-picker">
              <legend>Choose a length</legend>
              {TIER_OPTIONS.map((option) => (
                <label key={option.tier} className={`tier-option${tier === option.tier ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="tier"
                    value={option.tier}
                    checked={tier === option.tier}
                    onChange={() => setTier(option.tier)}
                  />
                  <span className="tier-option-label">
                    {option.label} &middot; {questionCounts[option.tier]} questions
                  </span>
                  <span className="tier-option-blurb">{option.blurb}</span>
                </label>
              ))}
            </fieldset>

            <p className="muted">
              Covers {domainCount} policy domains. You can answer "I don't know" on empirical items.
            </p>

            <button type="button" className="primary-button" onClick={() => onStart(tier)}>
              Begin assessment
            </button>
          </aside>

          <section className="research-invite" aria-labelledby="research-invite-heading">
            <h2 id="research-invite-heading">Help expand the label set</h2>
            <p>
              Adults can opt into a separate validation study using a balanced 120-question form. Before seeing the result,
              you may name one or more ideologies or traditions you subscribe to, including ones not listed here.
            </p>
            <p className="muted">
              Your optional self-description helps us find candidate labels for later human review. It does not automatically
              change scores or add an ideology to the product. Participation is voluntary and consent appears before questions.
            </p>
            <a className="research-link" href={PUBLIC_RESEARCH_ENTRYPOINT}>
              Enter the validation study
            </a>
          </section>
        </div>
      </div>
    </section>
  )
}
