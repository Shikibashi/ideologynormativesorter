export function MethodologyScreen({ onBack }: { onBack: () => void }) {
   return (
      <section className="screen methodology-screen">
         <h1>How this test works</h1>
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
         <p>
            When a label fits one layer of your views but not the others, we flag it as a <em>conflation</em>: a single label that would merge your normative, descriptive, and prescriptive positions into one and hide where they diverge. We name which layer matched, which layers it conflates, and the axes where you part from it.
         </p>
         <p>
            Versioning ensures old results remain interpretable.
         </p>
         <button type="button" onClick={onBack}>Back to results</button>
      </section>
   )
}
