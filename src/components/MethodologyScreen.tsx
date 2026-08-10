export function MethodologyScreen({ onBack }: { onBack: () => void }) {
   return (
      <section className="screen methodology-screen page-mode" aria-labelledby="methodology-heading">
         <div className="section-band">
            <span className="section-band-label">DOCUMENTATION / METHOD</span>
            <span className="section-band-status">VERSIONED INSTRUMENT</span>
         </div>
         <h1 id="methodology-heading">How this test works</h1>
         <p>
            This test separates your normative values (what you think is morally legitimate), descriptive beliefs (what you think is empirically true), and prescriptive strategy (what should be done now).
         </p>
         <p>
            It also distinguishes ideal theory (under good conditions) from non-ideal (under real constraints like scarcity and capture).
         </p>
         <p>
            Labels are secondary outputs. The primary output is your layered profile and divergences.
         </p>
         <p>
            Label percentages are heuristic profile-similarity scores on the test's own axes. They are not probabilities, diagnoses, or validated estimates of ideological identity.
         </p>
         <p>
            Evidence-coverage bands reflect how many relevant questions were answered. They are not psychometric reliability estimates and do not measure internal consistency, test-retest stability, or measurement error.
         </p>
         <h2>Current validation status</h2>
         <p>
            The question bank has received a prompt-to-axis semantic review. High-confidence sign inversions and construct mismatches are corrected in the current bank version; ambiguous, double-barreled, or non-discriminating items are marked for rewrite rather than silently reweighted.
         </p>
         <p>
            Empirical psychometric validation is not yet established. No real respondent dataset has yet been analyzed for internal consistency, factor structure, test-retest stability, criterion agreement, or subgroup measurement differences. The project includes analysis code for these checks, but it reports insufficient data until a consented study dataset is supplied.
         </p>
         <p>
            Descriptive items should eventually include an operational scope and public sources. Source coverage is tracked as a bank-quality measure; a source explains the claim's context but does not dictate how a respondent should answer.
         </p>
         <p>
            When a label fits one layer of your views but not the others, we flag it as a <em>conflation</em>: a single label that would merge your normative, descriptive, and prescriptive positions into one and hide where they diverge. We name which layer matched, which layers it conflates, and the axes where you part from it.
         </p>
         <p>
            Versioning ensures old results remain interpretable.
         </p>
         <button type="button" className="primary-button" onClick={onBack}>Back to results</button>
      </section>
   )
}
