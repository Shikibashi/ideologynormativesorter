import { coreQuestions, QUESTION_BANK_VERSION } from '../data/effectiveQuestions'
import { TAXONOMY_VERSION } from '../data/labelTaxonomy'
import { IDEOLOGY_SCALE_VERSION } from '../data/ideologyScales'
import { RESULT_SCORING_VERSION } from '../scoring'
import { specialistModuleDefinitions } from '../specialist'

export function MethodologyScreen({ onBack }: { onBack: () => void }) {
   const activeDescriptive = [
      ...coreQuestions.filter((question) => question.active !== false && question.layer === 'descriptive'),
      ...specialistModuleDefinitions.flatMap((module) => module.questions.filter((question) => question.active !== false && question.layer === 'descriptive')),
   ]
   const sourcedDescriptive = activeDescriptive.filter((question) => (question.sources?.length ?? 0) > 0 && Boolean(question.evidenceNote?.trim()))
   const activeContextItems = [
      ...coreQuestions.filter((question) => question.active !== false),
      ...specialistModuleDefinitions.flatMap((module) => module.questions.filter((question) => question.active !== false)),
   ]
   const sourcedContextItems = activeContextItems.filter((question) => Boolean(question.contextNote?.trim()) && (question.sources?.length ?? 0) > 0)

   return (
      <section className="screen methodology-screen page-mode" aria-labelledby="methodology-heading">
         <div className="section-band">
            <span className="section-band-label">DOCUMENTATION / METHOD</span>
            <span className="section-band-status">VERSIONED INSTRUMENT</span>
         </div>
         <h1 id="methodology-heading">How this test works</h1>
         <h2>What is measured</h2>
         <p>
            This test separates your normative values (what you think is morally legitimate), descriptive beliefs (what you think is empirically true), and prescriptive strategy (what should be done now).
         </p>
         <p>
            It also distinguishes ideal theory (under good conditions) from non-ideal (under real constraints like scarcity and capture).
         </p>
         <p>
            Labels are secondary outputs. The primary output is your layered profile and divergences.
         </p>
         <p data-testid="instrument-version">
            Public contract: taxonomy <code>{TAXONOMY_VERSION}</code>; scoring <code>{RESULT_SCORING_VERSION}</code>;
            question bank <code>{QUESTION_BANK_VERSION}</code>.
         </p>
         <p>
            The label catalog now separates broad primary families, directly measured cross-cutting modifiers,
            context or institutional forms, and narrower specialist traditions. Provisional specialists remain
            browsable but never appear as ordinary quiz matches; a construct-matched follow-up can show only an
            explicitly experimental comparison.
            Modifier matches are capped at five and require sufficient fit and answer coverage on their declared
            direct indicators; a catalog modifier without those indicators remains explainable but does not appear as
            an ordinary result.
            The opt-in specialist roster currently contains anarchist, green, socialist, conservative, religious-national,
            technology-governance, and monarchist/municipal experimental waves; assignment alone does not validate a
            specialist label or promote it into ordinary scoring.
         </p>
         <p>
            Some narrow compound terms require a defining construct that the core profile does not measure. Fascism,
            welfare chauvinism, eco-authoritarianism, religious nationalism, and theocratic politics are therefore
            catalog context or opt-in experimental comparisons only—not ordinary results inferred from nearby authority,
            national, religious, welfare, or ecological answers. The theocratic comparison requires direct evidence
            about final religious legal authority rather than broad religiosity or moral traditionalism.
         </p>
         <p>
            Label comparisons are qualitative summaries of profile distance on the test's own axes. They are not probabilities, diagnoses, accuracy rates, or validated estimates of ideological identity.
         </p>
         <p>
            Broad primary labels use only their published, source-backed core constructs. If a required core construct was not measured, the label is withheld rather than inferred from agreement on nearby axes; the result card identifies the constructs, limits, and background sources for every ordinary primary comparison.
         </p>
         <p>
            The catalog also records analytical scale guidance (<code>{IDEOLOGY_SCALE_VERSION}</code>). Macro refers to
            doctrine, social order, or society-wide patterns; meso refers to movements, parties, organizations,
            coalitions, regimes, and public discourse; micro refers to individual, local, household, or interactional
            uptake. The quiz’s label estimate is therefore a micro-level estimate of how one respondent takes up
            macro/meso ideological claims, not proof that the tradition itself is a micro ideology. Some ideology
            scholarship proposes “nano” as a method-sensitive sublevel within micro for personally adapted ideas,
            dispositions, and interactional mechanisms. The catalog does not assign nano labels or infer nano-level
            commitments from a single response.
         </p>
         <p>
            Consumer label explainers use curated tradition notes. The site does not turn a synthetic comparison coordinate into a claim that every member of a tradition must hold that doctrine.
         </p>
         <p>
            Label descriptions are editorial summaries of contested traditions. Scored label cards now expose curated
            definition, boundary, and—where reviewed—layer-scoped background sources. Those sources explain the
            tradition and its distinctions; they do not validate numeric centroids, respondent identity, or every claim
            associated with a historical movement.
         </p>
         <p>
            Answer-coverage descriptions reflect whether enough relevant questions were answered. They do not measure certainty or
            prove that a label is correct.
         </p>
         <h2>Question and form design</h2>
         <p>
            The current interface uses ordered seven-point agreement scales, statement-choice items where the
            alternatives are substantively distinct, “I don’t know” for empirical uncertainty, and a contribution-only
            refusal option. Confidence and priority follow-ups control how strongly an answer counts; skipping that rating
            excludes the answer from the result. An optional contribution uses the same complete Balanced or Full-depth
            profile selected for the result. Controlled matrix forms remain available for instrument analysis, and the exact
            presented questions and wording version are recorded with every contribution.
         </p>
         <p>
            Randomization distributes order effects; it does not remove them. Agreement formats can also invite
            acquiescence, and mechanically reversed wording can create its own method effects. Any move to item-specific
            response scales or different wording therefore requires a new version and separate evidence before replacing the current item.
         </p>
         <h2>Community contributions and interpretation</h2>
         <p>
            Website contributions come from a voluntary, nonprobability pool. The application applies no population weights,
            reports no sampling margin of error, and cannot estimate population prevalence. A URL-supplied recruitment-source
            tag, form version, exact presented wording and response options are stored for reproducibility. The tag is
            unverified and is not treated as authenticated provenance. A representative
            opinion estimate would require a named target population, a defensible recruitment frame or panel design,
            benchmark variables, weighting diagnostics, and transparent reporting that this application does not provide.
         </p>
         <h2>Current limitations</h2>
         <p>
            The question bank has received a versioned editorial prompt-to-axis review. Items judged ambiguous,
            double-barreled, mismatched, or non-discriminating are quarantined from current scoring rather than silently
            reweighted.
         </p>
         <p>
            The scores and label matches are experimental. They have not been validated as objective classifications and
            should be treated as prompts for reflection, not diagnoses or statements of political identity.
         </p>
         <p>
            In an opt-in specialist follow-up, “sufficient evidence” means only that enough mapped constructs were
            answered for a provisional comparison to be considered. The public result additionally requires at least
            0.60 profile proximity, 60% candidate-construct coverage, and no failed constitutive gate before it is
            displayed. This is not a psychometric reliability or validity result, and the voluntary sample cannot
            establish population prevalence or representativeness.
         </p>
         <p>
            Patterns found in voluntary contributions apply only to the people who chose to contribute. The optional
            post-questionnaire self-description is a comparison point, not proof that a score or label is correct.
         </p>
         <p>
            {sourcedDescriptive.length} of {activeDescriptive.length} active core and specialist descriptive items currently include both an operational scope and public background sources. Items without that support are quarantined from current scoring until they can be rewritten and sourced. A cited source explains a claim’s context; it does not dictate how a respondent should answer or validate the item itself.
         </p>
         <p>
            Some normative and prescriptive items also include a collapsed context disclosure when a source helps clarify a contested term or institutional distinction. Those sources are interpretive background, not empirical evidence or answer keys; the prompt, layer, and scoring weights remain unchanged.
         </p>
         <p>
            {sourcedContextItems.length} of {activeContextItems.length} active core and specialist items currently include a substantive construct context and public sources. This coverage describes the conceptual terrain around each question; it does not turn a source into an answer key or establish that the question itself is empirically valid.
         </p>
         <p>
            When a label fits one layer of your views but not the others, we flag it as a <em>conflation</em>: a single label that would merge your normative, descriptive, and prescriptive positions into one and hide where they diverge. We name which layer matched, which layers it conflates, and the axes where you part from it.
         </p>
         <p>
            Version identifiers make changes traceable; they cannot guarantee that an old result remains substantively valid.
         </p>
         <h2>Method references</h2>
         <p>
            The design rules draw on <a href="https://www.pewresearch.org/writing-survey-questions/" target="_blank" rel="noreferrer">Pew Research Center’s questionnaire guidance</a>,{' '}
            <a href="https://aapor.org/standards-and-ethics/best-practices/" target="_blank" rel="noreferrer">AAPOR survey best practices</a>,{' '}
            <a href="https://aapor.org/standards-and-ethics/disclosure-standards/" target="_blank" rel="noreferrer">AAPOR disclosure standards</a>,{' '}
            <a href="https://yougov.com/en-us/about/methodology" target="_blank" rel="noreferrer">YouGov’s panel methodology</a>, and{' '}
            <a href="https://climatecommunication.yale.edu/publications/global-warmings-six-americas-short-survey-audience-segmentation-of-climate-change-views-using-a-four-question-instrument/" target="_blank" rel="noreferrer">Yale’s cross-validated short-form work</a>.
         </p>
         <button type="button" className="primary-button" onClick={onBack}>Back to results</button>
      </section>
   )
}
