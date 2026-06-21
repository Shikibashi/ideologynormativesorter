interface IntroScreenProps {
  questionCount: number
  domainCount: number
  onStart: () => void
}

export function IntroScreen({ questionCount, domainCount, onStart }: IntroScreenProps) {
  return (
    <section className="screen intro-screen">
      <h1>Political Judgment Decomposition</h1>
      <p className="lede">
        Most political quizzes collapse three different kinds of judgment into a single left-right score. This one keeps
        them separate.
      </p>

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

      <p className="muted">
        {questionCount} questions across {domainCount} policy domains. You can answer "I don't know" on empirical items.
      </p>

      <button type="button" className="primary-button" onClick={onStart}>
        Begin
      </button>
    </section>
  )
}
