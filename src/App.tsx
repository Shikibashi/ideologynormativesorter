import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResearchConsentScreen } from './components/ResearchConsentScreen'
import { ResearchReceipt } from './components/ResearchReceipt'
import { ResultsScreen } from './components/ResultsScreen'
import { SelfIdentificationScreen } from './components/SelfIdentificationScreen'
import { SpecialistCriterionScreen } from './components/SpecialistCriterionScreen'
import { SpecialistModuleInvite } from './components/SpecialistModuleInvite'
import { SpecialistModuleResultScreen } from './components/SpecialistModuleResultScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { questionById, questions, questionsForTier } from './data/effectiveQuestions'
import { primaryScoringLabels, publicCatalogLabels, researchIdentityLabels } from './data/labelTaxonomy'
import {
   buildResearchSubmission,
   buildSpecialistDispositionSubmission,
   buildSpecialistResearchSubmission,
   getOrCreateParticipantId,
   isResearchMode,
   researchAdministration,
   researchStudyId,
   submitResearchSubmission,
   type ResearchConsent,
   type ResearchIdentity,
   type ResearchSubmission,
   type ResearchSubmissionStatus,
   type SpecialistDisposition,
   type SpecialistResearchSubmission,
} from './research'
import { buildResearchQuestionForm, researchFormSize } from './research/forms'
import { buildResultProfile } from './scoring'
import { readCompareAnswers, readSharedResult } from './share'
import {
   assignSpecialistModule,
   buildSpecialistQuestionForm,
   scoreSpecialistModule,
   specialistModuleById,
   type SpecialistCriterionResponse,
   type SpecialistOutcome,
} from './specialist'
import {
   clearSpecialistProgress,
   loadSpecialistProgress,
   saveSpecialistProgress,
   type SpecialistProgressSave,
} from './specialist/save'
import type { AnswerMap, Question, QuizTier, ResultProfile } from './types'
import { clearQuizState, loadQuizState, getQuizProgress } from './save'

type Stage =
   | 'intro'
   | 'consent'
   | 'quiz'
   | 'self-identification'
   | 'specialist-invite'
   | 'specialist-quiz'
   | 'specialist-criterion'
   | 'specialist-result'
   | 'results'

const TIERS: QuizTier[] = ['blitz', 'quick', 'moderate', 'extensive']

function answersForQuestions(source: AnswerMap, questionList: Question[]): AnswerMap {
   const allowed = new Set(questionList.map((question) => String(question.id)))
   return Object.fromEntries(
      Object.entries(source).filter(([questionId]) => allowed.has(questionId)),
   ) as AnswerMap
}

function App() {
   const [shareLoad] = useState(readSharedResult)
   const sharedAnswers = shareLoad.answers
   const initialResearchMode = useMemo(() => isResearchMode(), [])
   const administration = useMemo(() => researchAdministration(), [])
   const studyId = useMemo(() => researchStudyId(), [])
   const formSize = useMemo(() => researchFormSize(), [])
   const [researchEnabled, setResearchEnabled] = useState(initialResearchMode)
   const [participantId] = useState(() => initialResearchMode ? getOrCreateParticipantId() : '')
   const specialistAssignment = useMemo(
      () => initialResearchMode && participantId ? assignSpecialistModule(participantId, studyId) : null,
      [initialResearchMode, participantId, studyId],
   )
   const assignedSpecialistModule = useMemo(
      () => specialistAssignment ? specialistModuleById.get(specialistAssignment.moduleId) ?? null : null,
      [specialistAssignment],
   )

   const [researchConsent, setResearchConsent] = useState<ResearchConsent | null>(null)
   const [researchSubmission, setResearchSubmission] = useState<ResearchSubmission | null>(null)
   const [researchStatus, setResearchStatus] = useState<ResearchSubmissionStatus | null>(null)
   const [specialistSubmission, setSpecialistSubmission] = useState<SpecialistResearchSubmission | null>(null)
   const [specialistStatus, setSpecialistStatus] = useState<ResearchSubmissionStatus | null>(null)
   const [specialistProgress, setSpecialistProgress] = useState<SpecialistProgressSave | null>(null)
   const [specialistQuestions, setSpecialistQuestions] = useState<Question[]>([])
   const [specialistAnswers, setSpecialistAnswers] = useState<AnswerMap>({})
   const [specialistResumeIndex, setSpecialistResumeIndex] = useState(0)
   const [specialistStartedAt, setSpecialistStartedAt] = useState<string | null>(null)
   const [specialistResuming, setSpecialistResuming] = useState(false)
   const [specialistOutcome, setSpecialistOutcome] = useState<SpecialistOutcome | null>(null)

   const [pendingTier, setPendingTier] = useState<QuizTier>('moderate')
   const [resumeAfterConsent, setResumeAfterConsent] = useState(false)
   const [resumeIndex, setResumeIndex] = useState(0)
   const [quizStartedAt, setQuizStartedAt] = useState<string | null>(null)
   const [quizCompletedAt, setQuizCompletedAt] = useState<string | null>(null)
   const [wasResumed, setWasResumed] = useState(false)
   const [loadError, setLoadError] = useState<string | null>(
      shareLoad.malformed
         ? "We couldn't open that shared result link — it may be incomplete or out of date. You can start the test below to build your own profile."
         : null,
   )
   const [compareAnswers] = useState<AnswerMap | null>(() => readCompareAnswers())
   const [stage, setStage] = useState<Stage>(
      sharedAnswers ? 'results' : initialResearchMode ? 'consent' : 'intro',
   )
   const [activeQuestions, setActiveQuestions] = useState(questions)
   const [answers, setAnswers] = useState<AnswerMap>(sharedAnswers ?? {})
   const [result, setResult] = useState<ResultProfile | null>(() =>
      sharedAnswers ? buildResultProfile(questions, sharedAnswers, axes, primaryScoringLabels) : null,
   )
   const [compareResult, setCompareResult] = useState<ResultProfile | null>(() =>
      compareAnswers ? buildResultProfile(questions, compareAnswers, axes, primaryScoringLabels) : null,
   )
   const [resuming, setResuming] = useState(false)

   const domainCount = useMemo(() => new Set(questions.map((q) => q.domain)).size, [])
   const questionCounts = useMemo(
      () => Object.fromEntries(TIERS.map((tier) => [tier, questionsForTier(tier).length])) as Record<QuizTier, number>,
      [],
   )
   const [savedProgress, setSavedProgress] = useState(() => getQuizProgress())

   const persistSpecialistProgress = useCallback(
      ({ answers: currentAnswers, index }: { answers: AnswerMap; index: number }) => {
         if (!specialistAssignment || !specialistStartedAt) {
            return { saved: false as const, reason: 'Follow-up progress could not be saved because its session context is missing.' }
         }
         return saveSpecialistProgress({
            participantId,
            administration,
            moduleId: specialistAssignment.moduleId,
            answers: currentAnswers,
            index,
            startedAt: specialistStartedAt,
         })
      },
      [administration, participantId, specialistAssignment, specialistStartedAt],
   )

   function refreshSavedProgress(): void {
      setSavedProgress(getQuizProgress())
   }

   function refreshSpecialistProgress(): SpecialistProgressSave | null {
      if (!specialistAssignment) {
         setSpecialistProgress(null)
         return null
      }
      const saved = loadSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
      setSpecialistProgress(saved)
      return saved
   }

   function beginQuiz(tier: QuizTier, researchSession: boolean): void {
      clearQuizState()
      setSavedProgress(null)
      const pool = questionsForTier(tier)
      const assigned = researchSession
         ? buildResearchQuestionForm(pool, participantId, administration, formSize)
         : pool
      setActiveQuestions(assigned)
      setPendingTier(tier)
      setResumeIndex(0)
      setQuizStartedAt(new Date().toISOString())
      setQuizCompletedAt(null)
      setWasResumed(false)
      setResuming(false)
      setStage('quiz')
   }

   function handleStart(tier: QuizTier): void {
      setLoadError(null)
      setPendingTier(tier)
      if (researchEnabled) {
         setStage('consent')
         return
      }
      beginQuiz(tier, false)
   }

   function handleResume(): void {
      setLoadError(null)
      const saved = loadQuizState()
      if (!saved) {
         refreshSavedProgress()
         return
      }

      const reviewedQuestions = saved.questions
         .map((question) => questionById.get(question.id) ?? question)
         .filter((question) => question.active !== false)
      if (reviewedQuestions.length === 0) {
         clearQuizState()
         refreshSavedProgress()
         setLoadError('The saved quiz used an older question bank and has no active questions to resume.')
         return
      }

      const firstUnanswered = reviewedQuestions.findIndex((question) => saved.answers[question.id] === undefined)
      setActiveQuestions(reviewedQuestions)
      setAnswers(saved.answers)
      setPendingTier(saved.tier)
      setResumeIndex(firstUnanswered >= 0 ? firstUnanswered : Math.max(0, reviewedQuestions.length - 1))
      setQuizStartedAt(new Date().toISOString())
      setQuizCompletedAt(null)
      setWasResumed(true)
      setResuming(true)
      if (researchEnabled) {
         setResumeAfterConsent(true)
         setStage('consent')
      } else {
         setStage('quiz')
      }
   }

   function handleConsent(consent: ResearchConsent): void {
      setResearchConsent(consent)
      if (resumeAfterConsent) {
         setResumeAfterConsent(false)
         setStage('quiz')
         return
      }
      beginQuiz(pendingTier, true)
   }

   function handleResearchCancel(): void {
      setResearchEnabled(false)
      setResearchConsent(null)
      if (resumeAfterConsent) {
         setResumeAfterConsent(false)
         setStage('quiz')
         return
      }
      beginQuiz(pendingTier, false)
   }

   function handleComplete(newAnswers: AnswerMap): void {
      const completedAt = new Date().toISOString()
      clearQuizState()
      setSavedProgress(null)
      setAnswers(newAnswers)
      setQuizCompletedAt(completedAt)
      setResult(buildResultProfile(questions, newAnswers, axes, primaryScoringLabels))
      setStage(researchEnabled && researchConsent ? 'self-identification' : 'results')
   }

   async function handleResearchIdentity(identity: ResearchIdentity): Promise<void> {
      if (!result || !researchConsent || !quizStartedAt || !quizCompletedAt) {
         throw new Error('The study record is missing its consent, timing, or result context.')
      }
      const submission = buildResearchSubmission({
         studyId,
         participantId,
         administration,
         bankVersion: result.bankVersion ?? 'unknown-bank',
         scoringVersion: result.scoringVersion ?? 'unknown-scoring',
         tier: pendingTier,
         consent: researchConsent,
         identity,
         predictedLabelIds: result.nearestLabels.slice(0, 5).map((match) => String(match.labelId)),
         specialistAssignment: specialistAssignment ?? undefined,
         answers,
         questions: activeQuestions,
         startedAt: quizStartedAt,
         completedAt: quizCompletedAt,
         resumed: wasResumed,
      })
      const status = await submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
      setResearchSubmission(submission)
      setResearchStatus(status)

      if (specialistAssignment && assignedSpecialistModule) {
         refreshSpecialistProgress()
         setStage('specialist-invite')
      } else {
         setStage('results')
      }
   }

   function handleStartSpecialist(): void {
      if (!specialistAssignment || !assignedSpecialistModule) {
         setStage('results')
         return
      }
      const form = buildSpecialistQuestionForm(specialistAssignment.moduleId, participantId, administration)
      if (form.length === 0) {
         setStage('results')
         return
      }

      const saved = loadSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
      const restoredAnswers = saved ? answersForQuestions(saved.answers, form) : {}
      const firstUnanswered = form.findIndex((question) => restoredAnswers[question.id] === undefined)
      setSpecialistQuestions(form)
      setSpecialistAnswers(restoredAnswers)
      setSpecialistResumeIndex(firstUnanswered >= 0 ? firstUnanswered : Math.max(0, form.length - 1))
      setSpecialistStartedAt(saved?.startedAt ?? new Date().toISOString())
      setSpecialistResuming(Boolean(saved))
      setSpecialistOutcome(null)
      setSpecialistProgress(saved)
      setStage('specialist-quiz')
   }

   function handleExitSpecialistQuiz(): void {
      refreshSpecialistProgress()
      setStage('specialist-invite')
   }

   function recordSpecialistDisposition(
      disposition: SpecialistDisposition,
      answeredCount: number,
      startedAt?: string,
   ): void {
      if (!researchConsent || !specialistAssignment || !assignedSpecialistModule) return
      const submission = buildSpecialistDispositionSubmission({
         studyId,
         participantId,
         administration,
         consent: researchConsent,
         moduleId: specialistAssignment.moduleId,
         moduleVersion: assignedSpecialistModule.version,
         assignment: specialistAssignment,
         disposition,
         answeredCount,
         startedAt,
      })
      void submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
   }

   function handleSkipSpecialist(): void {
      let answeredCount = 0
      let startedAt: string | undefined
      if (specialistAssignment) {
         const saved = loadSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
         answeredCount = saved ? Object.keys(saved.answers).length : 0
         startedAt = saved?.startedAt
         clearSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
      }
      recordSpecialistDisposition(
         answeredCount > 0 ? 'declined-after-partial' : 'declined-before-start',
         answeredCount,
         startedAt,
      )
      setSpecialistProgress(null)
      setSpecialistQuestions([])
      setSpecialistAnswers({})
      setSpecialistResumeIndex(0)
      setSpecialistStartedAt(null)
      setSpecialistResuming(false)
      setSpecialistOutcome(null)
      setStage('results')
   }

   function handleSpecialistComplete(newAnswers: AnswerMap): void {
      if (!specialistAssignment) {
         setStage('results')
         return
      }
      clearSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
      setSpecialistProgress(null)
      setSpecialistAnswers(newAnswers)
      setSpecialistOutcome(scoreSpecialistModule(specialistAssignment.moduleId, newAnswers))
      setSpecialistResuming(false)
      setStage('specialist-criterion')
   }

   async function handleSpecialistCriterion(criterion: SpecialistCriterionResponse): Promise<void> {
      if (
         !result
         || !researchConsent
         || !specialistAssignment
         || !assignedSpecialistModule
         || !specialistStartedAt
         || specialistQuestions.length === 0
      ) {
         throw new Error('The specialist study record is missing its consent, assignment, timing, or module context.')
      }

      const outcome = specialistOutcome ?? scoreSpecialistModule(specialistAssignment.moduleId, specialistAnswers)
      const submission = buildSpecialistResearchSubmission({
         studyId,
         participantId,
         administration,
         consent: researchConsent,
         moduleId: specialistAssignment.moduleId,
         moduleVersion: assignedSpecialistModule.version,
         assignment: specialistAssignment,
         bankVersion: result.bankVersion ?? 'unknown-bank',
         scoringVersion: result.scoringVersion ?? 'unknown-scoring',
         criterion,
         answers: specialistAnswers,
         questions: specialistQuestions,
         constructWeightsByQuestionId: assignedSpecialistModule.constructWeightsByQuestionId,
         outcome,
         startedAt: specialistStartedAt,
         completedAt: new Date().toISOString(),
      })
      const status = await submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
      setSpecialistOutcome(outcome)
      setSpecialistSubmission(submission)
      setSpecialistStatus(status)
      setStage('specialist-result')
   }

   function handleDiscardSpecialistAfterCompletion(): void {
      recordSpecialistDisposition(
         'declined-after-completion',
         Object.keys(specialistAnswers).length,
         specialistStartedAt ?? undefined,
      )
      setSpecialistQuestions([])
      setSpecialistAnswers({})
      setSpecialistResumeIndex(0)
      setSpecialistStartedAt(null)
      setSpecialistResuming(false)
      setSpecialistOutcome(null)
      setStage('results')
   }

   function handleCompare(newCompareAnswers: AnswerMap): void {
      setCompareResult(buildResultProfile(questions, newCompareAnswers, axes, primaryScoringLabels))
   }

   function handleClearSavedProgress(): void {
      clearQuizState()
      setSavedProgress(null)
   }

   function handleRestart(): void {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
      clearQuizState()
      if (specialistAssignment) {
         clearSpecialistProgress(participantId, administration, specialistAssignment.moduleId)
      }
      setSavedProgress(null)
      setResult(null)
      setAnswers({})
      setResearchConsent(null)
      setResearchSubmission(null)
      setResearchStatus(null)
      setSpecialistSubmission(null)
      setSpecialistStatus(null)
      setSpecialistProgress(null)
      setSpecialistQuestions([])
      setSpecialistAnswers({})
      setSpecialistResumeIndex(0)
      setSpecialistStartedAt(null)
      setSpecialistResuming(false)
      setSpecialistOutcome(null)
      setResumeIndex(0)
      setQuizStartedAt(null)
      setQuizCompletedAt(null)
      setWasResumed(false)
      setResuming(false)
      setStage('intro')
   }

   if (stage === 'intro') {
      return (
         <IntroScreen
            questionCounts={questionCounts}
            domainCount={domainCount}
            savedProgress={savedProgress}
            onResume={handleResume}
            onStart={handleStart}
            onClearSavedProgress={handleClearSavedProgress}
            loadError={loadError}
            onDismissLoadError={() => setLoadError(null)}
         />
      )
   }

   if (stage === 'consent') {
      return (
         <ResearchConsentScreen
            participantId={participantId}
            administration={administration}
            onConsent={handleConsent}
            onCancel={handleResearchCancel}
         />
      )
   }

   if (stage === 'quiz') {
      return (
         <QuizScreen
            questions={activeQuestions}
            tier={pendingTier}
            initialAnswers={resuming ? answers : undefined}
            initialIndex={resuming ? resumeIndex : undefined}
            onComplete={handleComplete}
         />
      )
   }

   if (stage === 'self-identification') {
      return <SelfIdentificationScreen labels={researchIdentityLabels} onContinue={handleResearchIdentity} />
   }

   if (stage === 'specialist-invite' && assignedSpecialistModule) {
      return (
         <SpecialistModuleInvite
            module={assignedSpecialistModule}
            answeredCount={specialistProgress ? Object.keys(specialistProgress.answers).length : 0}
            totalCount={assignedSpecialistModule.questions.length}
            onStart={handleStartSpecialist}
            onSkip={handleSkipSpecialist}
         />
      )
   }

   if (stage === 'specialist-quiz' && assignedSpecialistModule && specialistQuestions.length > 0) {
      return (
         <QuizScreen
            questions={specialistQuestions}
            initialAnswers={specialistResuming ? specialistAnswers : undefined}
            initialIndex={specialistResuming ? specialistResumeIndex : undefined}
            contextLabel={assignedSpecialistModule.shortTitle}
            progressSaver={persistSpecialistProgress}
            onExit={handleExitSpecialistQuiz}
            onComplete={handleSpecialistComplete}
         />
      )
   }

   if (stage === 'specialist-criterion' && assignedSpecialistModule) {
      return (
         <SpecialistCriterionScreen
            module={assignedSpecialistModule}
            onContinue={handleSpecialistCriterion}
            onSkip={handleDiscardSpecialistAfterCompletion}
         />
      )
   }

   if (stage === 'specialist-result' && assignedSpecialistModule && specialistOutcome) {
      return (
         <>
            {specialistSubmission && specialistStatus && (
               <ResearchReceipt submission={specialistSubmission} status={specialistStatus} />
            )}
            <SpecialistModuleResultScreen
               module={assignedSpecialistModule}
               outcome={specialistOutcome}
               onContinue={() => setStage('results')}
            />
         </>
      )
   }

   return result ? (
      <>
         {researchSubmission && researchStatus && (
            <ResearchReceipt submission={researchSubmission} status={researchStatus} />
         )}
         {specialistSubmission && specialistStatus && (
            <ResearchReceipt submission={specialistSubmission} status={specialistStatus} />
         )}
         <ResultsScreen
            result={result}
            axes={axes}
            domains={domains}
            labels={publicCatalogLabels}
            answers={answers}
            compareResult={compareResult}
            onCompare={handleCompare}
            onRestart={handleRestart}
         />
      </>
   ) : null
}

export default App
