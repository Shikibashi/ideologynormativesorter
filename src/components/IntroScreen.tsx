import { useState } from 'react'
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

  return (
    <section className="screen intro-screen">
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
        <div className="resume-banner">
          <p>
            You have a saved session in progress ({savedProgress.answered} of {savedProgress.total} questions answered in
            the {savedProgress.tier} test).
          </p>
          <div>
            <button type="button" className="primary-button" onClick={onResume}>
              Resume
            </button>
            <span style={{ margin: '0 0.5rem' }}>or</span>
            <button
              type="button"
              className="back-link"
              onClick={onClearSavedProgress}
            >
              Start fresh
            </button>
          </div>
        </div>
      )}

      <div className="explainer">
        <div className="explainer-item">
          <h2>Normative</h2>
          <p>What you believe is morally legitimate &mdash; who has rightful authority, and what people are owed.</p>
        </div>
        <div className="explainer-item">
          <h2>Descriptive</h2>
          <p>What you believe is empirically true &mdash; how markets, states, and institutions actually behave.</p>
        </div>
        <div className="explainer-item">
          <h2>Prescriptive</h2>
          <p>What you think should actually be done, given the institutions and constraints we currently have.</p>
        </div>
      </div>

      <p>
        Many items also distinguish <strong>ideal theory</strong> (how things should work under favorable conditions) from{' '}
        <strong>non-ideal theory</strong> (what to do given real-world limits, corruption, or bad actors). People who agree
        on ideals often disagree sharply on what to do right now, and that gap is itself informative.
      </p>

      <p className="muted">
        At the end you'll see your normative, descriptive, and prescriptive profiles separately, plus the gap between your
        ideal and non-ideal answers. We also surface a few nearby ideology labels for context, but these are a secondary,
        approximate summary &mdash; your three profiles are the actual result, and most real positions don't reduce
        cleanly to one label.
      </p>

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
        Begin
      </button>
    </section>
  )
}
