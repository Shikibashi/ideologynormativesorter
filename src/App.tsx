import { useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResearchConsentScreen } from './components/ResearchConsentScreen'
import { ResearchReceipt } from './components/ResearchReceipt'
import { ResultsScreen } from './components/ResultsScreen'
import { SelfIdentificationScreen } from './components/SelfIdentificationScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { questionById, questions, questionsForTier } from './data/effectiveQuestions'
import { primaryScoringLabels, publicCatalogLabels, researchIdentityLabels } from './data/labelTaxonomy'
import {
   buildResearchSubmission,
   getOrCreateParticipantId,
   isResearchMode,
   researchAdministration,
   researchStudyId,
   submitResearchSubmission,
   type ResearchConsent,
   type ResearchIdentity,
   type ResearchSubmission,
   type ResearchSubmissionStatus,
} from './research'
import { buildResearchQuestionForm, researchFormSize } from './research/forms'
import { buildResultProfile } from './scoring'
import { readCompareAnswers, readSharedResult } from './share'
import type { AnswerMap, QuizTier, ResultProfile } from './types'
import { clearQuizState, loadQuizState, getQuizProgress } from './save'

type Stage = 'intro' | 'consent' | 'quiz' | 'self-identification' | 'results'

const TIERS: QuizTier[] = ['blitz', 'quick', 'moderate', 'extensive']

function App() {
   const [shareLoad] = useState(readSharedResult)
   const sharedAnswers = shareLoad.answers
   const initialResearchMode = useMemo(() => isResearchMode(), [])
   const administration = useMemo(() => researchAdministration(), [])
   const studyId = useMemo(() => researchStudyId(), [])
   const formSize = useMemo(() => researchFormSize(), [])
   const [researchEnabled, setResearchEnabled] = useState(initialResearchMode)
   const [participantId] = useState(() => initialResearchMode ? getOrCreateParticipantId() : '')
   const [researchConsent, setResearchConsent] = useState<ResearchConsent | null>(null)
   const [researchSubmission, setResearchSubmission] = useState<ResearchSubmission | null>(null)
   const [researchStatus, setResearchStatus] = useState<ResearchSubmissionStatus | null>(null)
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
   const [stage, setStage] = useState<Stage>(sharedAnswers ? 'results' : 'intro')
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

   function refreshSavedProgress(): void {
      setSavedProgress(getQuizProgress())
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
         answers,
         questions: activeQuestions,
         startedAt: quizStartedAt,
         completedAt: quizCompletedAt,
         resumed: wasResumed,
      })
      const status = await submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
      setResearchSubmission(submission)
      setResearchStatus(status)
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
      setSavedProgress(null)
      setResult(null)
      setAnswers({})
      setResearchConsent(null)
      setResearchSubmission(null)
      setResearchStatus(null)
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

   return result ? (
      <>
         {researchSubmission && researchStatus && (
            <ResearchReceipt submission={researchSubmission} status={researchStatus} />
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