import type { SpecialistModuleDefinition } from "../specialist";

interface SpecialistModuleInviteProps {
  module: SpecialistModuleDefinition;
  answeredCount?: number;
  totalCount?: number;
  onStart: () => void;
  onSkip: () => void;
}

export function SpecialistModuleInvite({
  module,
  answeredCount = 0,
  totalCount = module.questions.length,
  onStart,
  onSkip,
}: SpecialistModuleInviteProps) {
  const resuming = answeredCount > 0;

  return (
    <section className="screen intro-screen">
      <div className="section-band">
        <span className="section-band-label">COMMUNITY INPUT / FOLLOW-UP</span>
        <span className="section-band-status">OPTIONAL MODULE</span>
      </div>
      <h1>Optional specialist follow-up</h1>
      <p>
        You were assigned <strong>{module.title}</strong> as an optional
        contribution follow-up. Your random contribution code spreads different
        topics across contributors instead of asking everyone to choose a
        favorite topic.
      </p>
      <div className="result-block">
        <h2>{module.shortTitle}</h2>
        <p>{module.description}</p>
        <p className="muted">
          About {module.estimatedMinutes} minutes · {module.questions.length}{" "}
          questions
        </p>
        <p className="muted">{module.invitationNote}</p>
        {resuming && (
          <p className="muted">
            Saved follow-up progress: {Math.min(answeredCount, totalCount)} of{" "}
            {totalCount} questions answered.
          </p>
        )}
      </div>
      <button type="button" className="primary-button" onClick={onStart}>
        {resuming ? "Resume assigned follow-up" : "Start assigned follow-up"}
      </button>
      <button type="button" className="back-link" onClick={onSkip}>
        Skip follow-up and view main results
      </button>
    </section>
  );
}
