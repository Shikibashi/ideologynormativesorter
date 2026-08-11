import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { MethodologyScreen } from './components/MethodologyScreen'
import { QuizScreen, type QuizScreenStatus } from './components/QuizScreen'
import { ResearchConsentScreen } from './components/ResearchConsentScreen'
import { ResearchReceipt } from './components/ResearchReceipt'
import { ResultsScreen } from './components/ResultsScreen'
import { SelfIdentificationScreen } from './components/SelfIdentificationScreen'
import { SpecialistCriterionScreen } from './components/SpecialistCriterionScreen'
import { SpecialistModuleInvite } from './components/SpecialistModuleInvite'
import { SpecialistModuleResultScreen } from './components/SpecialistModuleResultScreen'
import { SiteShell, type ShellContext } from './components/SiteShell'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { QUESTION_BANK_VERSION, questionById, questions, questionsForTier } from './data/effectiveQuestions'
import { primaryScoringLabels, publicCatalogLabels, researchIdentityLabels } from './data/labelTaxonomy'
import {
   buildResearchSubmission,
   buildSpecialistDispositionSubmission,
   buildSpecialistResearchSubmission,
   getOrCreateParticipantId,
   isResearchMode,
   researchAdministration,
   researchRecruitmentSource,
   RESEARCH_SCHEMA_VERSION,
   researchStudyId,
   submitResearchSubmission,
   type ResearchConsent,
   type CoreResearchSubmission,
   type ResearchIdentity,
   type ResearchSubmission,
   type ResearchSubmissionStatus,
   type SpecialistDisposition,
   type SpecialistResearchSubmission,
} from './research'
import {
   buildResearchQuestionForm,
   RESEARCH_FORM_VERSION,
   researchFormFingerprint,
   researchFormSize,
} from './research/forms'
import { buildResultProfile, RESULT_SCORING_VERSION } from './scoring'
import { quizTierLabel } from './quizTiers'
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
import {
   clearPendingResearchRecord,
   clearQuizState,
   getQuizProgress,
   loadPendingResearchRecord,
   loadQuizState,
   savePendingResearchRecord,
   saveQuizState,
   type QuizSave,
} from './save'
import { announceStatus } from './status'

type Stage =
   | 'intro'
   | 'methodology'
   | 'consent'
   | 'quiz'
   | 'self-identification'
   | 'specialist-invite'
   | 'specialist-quiz'
   | 'specialist-criterion'
   | 'specialist-result'
   | 'results'

const TIERS: QuizTier[] = ['blitz', 'quick', 'moderate', 'extensive']
type RestoreOutcome = 'in-progress' | 'completed' | false

function answersForQuestions(source: AnswerMap, questionList: Question[]): AnswerMap {
   const allowed = new Set(questionList.map((question) => String(question.id)))
   return Object.fromEntries(
      Object.entries(source).filter(([questionId]) => allowed.has(questionId)),
   ) as AnswerMap
}

function requestedMethodology(): boolean {
   if (typeof window === 'undefined') return false
   return new URLSearchParams(window.location.search).get('view') === 'methodology'
      && !/(?:^|[#&?])r=/.test(window.location.hash)
}

function App() {
   const shareMeta = useMemo(
      () => ({ bankVersion: QUESTION_BANK_VERSION, scoringVersion: RESULT_SCORING_VERSION }),
      [],
   )
   const [shareLoad] = useState(() => readSharedResult(shareMeta))
   const sharedAnswers = shareLoad.answers
   const initialResearchMode = useMemo(() => isResearchMode(), [])
   const administration = useMemo(() => researchAdministration(), [])
   const studyId = useMemo(() => researchStudyId(), [])
   const recruitmentSource = useMemo(() => researchRecruitmentSource(), [])
   const formSize = useMemo(() => researchFormSize(), [])
   const [researchEnabled, setResearchEnabled] = useState(initialResearchMode)
   const [participantId] = useState(() => initialResearchMode
      ? getOrCreateParticipantId(window.localStorage, undefined, studyId)
      : '')
   const [loadedPendingResearch] = useState(loadPendingResearchRecord)
   const pendingCoreResearch = !sharedAnswers
      && loadedPendingResearch?.submission.recordType === 'core'
      && loadedPendingResearch.submission.schemaVersion === RESEARCH_SCHEMA_VERSION
      && loadedPendingResearch.submission.studyId === studyId
      && loadedPendingResearch.submission.participantId === participantId
      && loadedPendingResearch.submission.administration === administration
      && loadedPendingResearch.submission.bankVersion === QUESTION_BANK_VERSION
      && loadedPendingResearch.submission.scoringVersion === RESULT_SCORING_VERSION
      ? loadedPendingResearch
      : null
   const pendingCoreSubmission: CoreResearchSubmission | null = pendingCoreResearch?.submission.recordType === 'core'
      ? pendingCoreResearch.submission
      : null
   const specialistAssignment = useMemo(
      () => initialResearchMode && participantId ? assignSpecialistModule(participantId, studyId) : null,
      [initialResearchMode, participantId, studyId],
   )
   const assignedSpecialistModule = useMemo(
      () => specialistAssignment ? specialistModuleById.get(specialistAssignment.moduleId) ?? null : null,
      [specialistAssignment],
   )

   const [researchConsent, setResearchConsent] = useState<ResearchConsent | null>(null)
   const [researchSubmission, setResearchSubmission] = useState<ResearchSubmission | null>(
      pendingCoreSubmission,
   )
   const [researchStatus, setResearchStatus] = useState<ResearchSubmissionStatus | null>(
      pendingCoreResearch?.status ?? null,
   )
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
   const [resumeAfterConsent, setResumeAfterConsent] = useState<'quiz' | 'self-identification' | null>(null)
   const [resumeIndex, setResumeIndex] = useState(0)
   const [quizStartedAt, setQuizStartedAt] = useState<string | null>(null)
   const [quizCompletedAt, setQuizCompletedAt] = useState<string | null>(null)
   const [wasResumed, setWasResumed] = useState(false)
   const [loadError, setLoadError] = useState<string | null>(
      shareLoad.malformed
         ? "We couldn't open that shared result link — it may be incomplete or out of date. You can start the test below to build your own profile."
         : null,
   )
   const [compareAnswers] = useState<AnswerMap | null>(() => readCompareAnswers(shareMeta))
   const [stage, setStage] = useState<Stage>(
      sharedAnswers || pendingCoreSubmission
         ? 'results'
         : requestedMethodology()
            ? 'methodology'
            : initialResearchMode
               ? 'consent'
               : 'intro',
   )
   const [activeQuestions, setActiveQuestions] = useState(() => pendingCoreSubmission
      ? pendingCoreSubmission.presentationOrder
         .map((questionId) => questionById.get(questionId))
         .filter((question): question is Question => Boolean(question))
      : questions)
   const initialAnswers = sharedAnswers ?? pendingCoreSubmission?.answers ?? {}
   const [answers, setAnswers] = useState<AnswerMap>(initialAnswers)
   const [result, setResult] = useState<ResultProfile | null>(() =>
      sharedAnswers || pendingCoreSubmission
         ? buildResultProfile(questions, initialAnswers, axes, primaryScoringLabels)
         : null,
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
   const expectedResearchItemCount = useMemo(
      () => buildResearchQuestionForm(questionsForTier(pendingTier), participantId, administration, formSize).length,
      [administration, formSize, participantId, pendingTier],
   )
   const [savedProgress, setSavedProgress] = useState(() => getQuizProgress())
   const [quizShellStatus, setQuizShellStatus] = useState<QuizScreenStatus>(() => ({
      current: 1,
      total: activeQuestions.length,
      layer: activeQuestions[0]?.layer ?? 'normative',
      save: 'current',
   }))

   useEffect(() => {
      function handleHistoryChange(): void {
         const nextSharedResult = readSharedResult(shareMeta)
         if (nextSharedResult.answers) {
            const nextCompareAnswers = readCompareAnswers(shareMeta)
            setAnswers(nextSharedResult.answers)
            setResult(buildResultProfile(questions, nextSharedResult.answers, axes, primaryScoringLabels))
            setCompareResult(nextCompareAnswers
               ? buildResultProfile(questions, nextCompareAnswers, axes, primaryScoringLabels)
               : null)
            setLoadError(null)
            setStage('results')
            return
         }

         if (requestedMethodology()) {
            setStage('methodology')
         } else if (stage === 'methodology') {
            setStage(result ? 'results' : 'intro')
         }
      }

      window.addEventListener('popstate', handleHistoryChange)
      window.addEventListener('hashchange', handleHistoryChange)
      return () => {
         window.removeEventListener('popstate', handleHistoryChange)
         window.removeEventListener('hashchange', handleHistoryChange)
      }
   }, [result, shareMeta, stage])

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

   const persistCoreProgress = useCallback(
      ({ answers: currentAnswers, index }: { answers: AnswerMap; index: number }) => {
         if (!quizStartedAt) {
            return { saved: false as const, reason: 'Progress could not be saved because the session start time is missing.' }
         }
         return saveQuizState({
            questions: activeQuestions,
            answers: currentAnswers,
            index,
            tier: pendingTier,
            startedAt: quizStartedAt,
            research: researchEnabled
               ? {
                  participantId,
                  studyId,
                  administration,
                  bankVersion: QUESTION_BANK_VERSION,
                  formVersion: RESEARCH_FORM_VERSION,
                  formFingerprint: researchFormFingerprint(activeQuestions),
                  requestedItemCount: formSize,
               }
               : undefined,
         })
      },
      [activeQuestions, administration, formSize, participantId, pendingTier, quizStartedAt, researchEnabled, studyId],
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
      setQuizShellStatus({
         current: 1,
         total: assigned.length,
         layer: assigned[0]?.layer ?? 'normative',
         save: 'current',
      })
      setStage('quiz')
      announceStatus(`Started the ${quizTierLabel(tier).toLowerCase()}.`)
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

   function restoreSavedQuiz(saved: QuizSave): RestoreOutcome {
      const expectedResearchQuestions = saved.research
         ? buildResearchQuestionForm(
            questionsForTier(saved.tier),
            participantId,
            administration,
            formSize,
         )
         : []
      const researchContextMatches = saved.research
         && saved.research.participantId === participantId
         && saved.research.studyId === studyId
         && saved.research.administration === administration
         && saved.research.bankVersion === QUESTION_BANK_VERSION
         && saved.research.formVersion === RESEARCH_FORM_VERSION
         && saved.research.requestedItemCount === formSize
         && saved.research.formFingerprint === researchFormFingerprint(saved.questions)
         && saved.research.formFingerprint === researchFormFingerprint(expectedResearchQuestions)
         && saved.questions.map((question) => question.id).join('|')
            === expectedResearchQuestions.map((question) => question.id).join('|')
      if (researchEnabled && !researchContextMatches) return false

      const reviewedQuestions = saved.research
         ? saved.questions
         : saved.questions
            .map((question) => questionById.get(question.id) ?? question)
            .filter((question) => question.active !== false)
      if (reviewedQuestions.length === 0) {
         clearQuizState()
         refreshSavedProgress()
         setLoadError('The saved quiz used an older question bank and has no active questions to resume.')
         return false
      }

      const firstUnanswered = reviewedQuestions.findIndex((question) => saved.answers[question.id] === undefined)
      setActiveQuestions(reviewedQuestions)
      setAnswers(saved.answers)
      setPendingTier(saved.tier)
      setResumeIndex(firstUnanswered >= 0 ? firstUnanswered : Math.max(0, reviewedQuestions.length - 1))
      setQuizStartedAt(saved.startedAt ?? new Date().toISOString())
      setQuizCompletedAt(saved.completedAt ?? null)
      setWasResumed(true)
      setResuming(!saved.completedAt)
      if (saved.completedAt) {
         setResult(buildResultProfile(questions, saved.answers, axes, primaryScoringLabels))
         return 'completed'
      }
      return 'in-progress'
   }

   function handleResume(): void {
      setLoadError(null)
      const saved = loadQuizState()
      if (!saved) {
         refreshSavedProgress()
         return
      }
      const restored = restoreSavedQuiz(saved)
      if (!restored) return

      if (researchEnabled) {
         setResumeAfterConsent(restored === 'completed' ? 'self-identification' : 'quiz')
         setStage('consent')
      } else {
         setStage(restored === 'completed' ? 'results' : 'quiz')
         announceStatus('Resumed saved assessment progress.')
      }
   }

   function handleConsent(consent: ResearchConsent): void {
      setResearchConsent(consent)
      if (resumeAfterConsent) {
         const destination = resumeAfterConsent
         setResumeAfterConsent(null)
         setStage(destination)
         return
      }
      const saved = loadQuizState()
      const restored = saved?.research ? restoreSavedQuiz(saved) : false
      if (restored) {
         setStage(restored === 'completed' ? 'self-identification' : 'quiz')
         announceStatus('Resumed saved research assessment progress.')
         return
      }
      beginQuiz(pendingTier, true)
   }

   function handleResearchCancel(): void {
      setResearchEnabled(false)
      setResearchConsent(null)
      if (resumeAfterConsent) {
         const destination = resumeAfterConsent === 'self-identification' ? 'results' : 'quiz'
         setResumeAfterConsent(null)
         setStage(destination)
         return
      }
      beginQuiz(pendingTier, false)
   }

   function handleComplete(newAnswers: AnswerMap): void {
      const completedAt = new Date().toISOString()
      if (researchEnabled && researchConsent && quizStartedAt) {
         saveQuizState({
            questions: activeQuestions,
            answers: newAnswers,
            index: Math.max(0, activeQuestions.length - 1),
            tier: pendingTier,
            startedAt: quizStartedAt,
            completedAt,
            research: {
               participantId,
               studyId,
               administration,
               bankVersion: QUESTION_BANK_VERSION,
               formVersion: RESEARCH_FORM_VERSION,
               formFingerprint: researchFormFingerprint(activeQuestions),
               requestedItemCount: formSize,
            },
         })
         refreshSavedProgress()
      } else {
         clearQuizState()
         setSavedProgress(null)
      }
      setAnswers(newAnswers)
      setQuizCompletedAt(completedAt)
      setResult(buildResultProfile(questions, newAnswers, axes, primaryScoringLabels))
      setStage(researchEnabled && researchConsent ? 'self-identification' : 'results')
      announceStatus('Assessment complete. Results are ready.')
   }

   async function handleResearchIdentity(identity: ResearchIdentity): Promise<void> {
      if (!result || !researchConsent || !quizStartedAt || !quizCompletedAt) {
         throw new Error('The contribution is missing its consent, timing, or result context.')
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
         requestedFormSize: formSize,
         recruitmentSource,
         locale: navigator.language,
      })
      const status = await submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
      if (status.status === 'submitted') {
         clearPendingResearchRecord()
         clearQuizState()
         setSavedProgress(null)
      } else {
         const pendingSave = savePendingResearchRecord({ submission, status })
         if (pendingSave.saved) {
            clearQuizState()
            setSavedProgress(null)
         }
      }
      setResearchSubmission(submission)
      setResearchStatus(status)
      announceStatus(status.status === 'failed' ? 'Contribution could not be submitted.' : 'Contribution prepared.')

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
      announceStatus('Specialist follow-up complete. Self-description is ready.')
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
         throw new Error('The topic contribution is missing its consent, assignment, timing, or module context.')
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
         locale: navigator.language,
      })
      const status = await submitResearchSubmission(submission, import.meta.env.VITE_RESEARCH_ENDPOINT)
      setSpecialistOutcome(outcome)
      setSpecialistSubmission(submission)
      setSpecialistStatus(status)
      setStage('specialist-result')
      announceStatus(status.status === 'failed' ? 'Specialist follow-up could not be submitted.' : 'Specialist follow-up submitted.')
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
      clearPendingResearchRecord()
      setSavedProgress(null)
      announceStatus('Saved assessment progress cleared.')
   }

   function handleMethodologyBack(): void {
      const url = new URL(window.location.href)
      url.searchParams.delete('view')
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
   }

   function handleRestart(): void {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
      clearQuizState()
      clearPendingResearchRecord()
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
      announceStatus('Assessment reset. Start page ready.')
      requestAnimationFrame(() => document.getElementById('app-content')?.focus())
   }

   const shellContext = useMemo<ShellContext>(() => {
      const composition: ShellContext['composition'] = stage === 'results' || stage === 'methodology'
         ? 'workbench'
         : 'page'
      let contextItems: ShellContext['contextItems'] = [
         { label: 'MODE', value: composition === 'workbench' ? 'WORKBENCH' : 'ASSESSMENT' },
         { label: 'STORAGE', value: 'BROWSER LOCAL' },
         { label: 'INSTRUMENT', value: 'CURRENT' },
         { label: 'OUTPUT', value: 'THREE-LAYER PROFILE' },
      ]
      let statusItems: ShellContext['statusItems'] = [
         { label: 'STAGE', value: stage.replaceAll('-', ' ') },
         { label: 'SAVE', value: 'LOCAL' },
      ]

      if (stage === 'intro') {
         statusItems = [
            { label: 'STAGE', value: 'START' },
            { label: 'LENGTH', value: quizTierLabel(pendingTier) },
            { label: 'SAVE', value: savedProgress ? 'RESUMABLE' : 'LOCAL' },
            { label: 'MODE', value: 'STANDARD' },
         ]
      } else if (stage === 'quiz' || stage === 'specialist-quiz') {
         if (researchEnabled || stage === 'specialist-quiz') {
            contextItems = [
               { label: 'MODE', value: stage === 'specialist-quiz' ? 'CONTRIBUTION FOLLOW-UP' : 'CONTRIBUTION' },
               { label: 'COLLECTION', value: studyId },
               { label: 'ADMIN', value: administration },
               { label: 'FORM', value: String(quizShellStatus.total) },
            ]
         }
         statusItems = [
            { label: 'STAGE', value: stage === 'quiz' ? 'QUESTION' : 'FOLLOW-UP QUESTION' },
            { label: 'PROGRESS', value: `${quizShellStatus.current} / ${quizShellStatus.total}` },
            { label: 'LAYER', value: quizShellStatus.layer },
            { label: 'SAVE', value: quizShellStatus.save },
         ]
      } else if (stage === 'consent' || stage === 'self-identification') {
         contextItems = [
            { label: 'MODE', value: 'CONTRIBUTION' },
            { label: 'COLLECTION', value: studyId },
            { label: 'ADMIN', value: administration },
            { label: 'FORM', value: String(expectedResearchItemCount) },
         ]
         statusItems = [
            { label: 'STAGE', value: stage === 'consent' ? 'PRIVACY CHOICE' : 'OPTIONAL PROFILE' },
            { label: 'SUBMISSION', value: researchStatus?.status ?? 'NOT SENT' },
            { label: 'SAVE', value: 'LOCAL' },
         ]
      } else if (stage.startsWith('specialist')) {
         contextItems = [
            { label: 'MODE', value: 'CONTRIBUTION FOLLOW-UP' },
            { label: 'COLLECTION', value: studyId },
            { label: 'MODULE', value: assignedSpecialistModule?.shortTitle ?? 'OPTIONAL' },
            { label: 'ADMIN', value: administration },
         ]
         statusItems = [
            { label: 'STAGE', value: stage.replaceAll('specialist-', '').replaceAll('-', ' ') },
            { label: 'SUBMISSION', value: specialistStatus?.status ?? 'NOT SENT' },
            { label: 'SAVE', value: specialistProgress ? 'RESUMABLE' : 'LOCAL' },
         ]
      } else if (stage === 'results') {
         contextItems = [
            { label: 'MODE', value: 'WORKBENCH' },
            { label: 'OUTPUT', value: 'THREE-LAYER PROFILE' },
            { label: 'LABELS', value: 'REFERENCE ONLY' },
            { label: 'COMPARE', value: compareResult ? 'ACTIVE' : 'INACTIVE' },
         ]
         statusItems = [
            { label: 'STAGE', value: 'RESULTS' },
            { label: 'VIEW', value: 'LAYERED PROFILE' },
            { label: 'LABELS', value: 'SECONDARY' },
            { label: 'COMPARE', value: compareResult ? 'ACTIVE' : 'INACTIVE' },
         ]
      } else if (stage === 'methodology') {
         contextItems = [
            { label: 'MODE', value: 'DOCUMENTATION' },
            { label: 'INSTRUMENT', value: 'CURRENT' },
            { label: 'VERSIONING', value: 'TRACKED' },
            { label: 'HISTORY', value: 'BROWSER NATIVE' },
         ]
         statusItems = [
            { label: 'STAGE', value: 'METHODOLOGY' },
            { label: 'SECTION', value: 'METHODS' },
            { label: 'VERSIONING', value: 'TRACKED' },
         ]
      }

      return { stage, composition, contextItems, statusItems }
   }, [
      administration,
      assignedSpecialistModule?.shortTitle,
      compareResult,
      expectedResearchItemCount,
      pendingTier,
      quizShellStatus,
      researchEnabled,
      researchStatus?.status,
      savedProgress,
      specialistProgress,
      specialistStatus?.status,
      stage,
      studyId,
   ])

   function renderStage() {
   if (stage === 'intro') {
      return (
         <IntroScreen
            questionCounts={questionCounts}
            domainCount={domainCount}
            savedProgress={savedProgress}
            onResume={handleResume}
            onStart={handleStart}
            onTierChange={setPendingTier}
            onClearSavedProgress={handleClearSavedProgress}
            contributionAvailable={Boolean(import.meta.env.VITE_RESEARCH_ENDPOINT?.trim()) || import.meta.env.DEV}
            loadError={loadError}
            onDismissLoadError={() => setLoadError(null)}
         />
      )
   }

   if (stage === 'methodology') {
      return <MethodologyScreen onBack={handleMethodologyBack} />
   }

   if (stage === 'consent') {
      return (
         <ResearchConsentScreen
            participantId={participantId}
            administration={administration}
            expectedCoreItemCount={expectedResearchItemCount}
            endpointConfigured={Boolean(import.meta.env.VITE_RESEARCH_ENDPOINT?.trim())}
            allowOfflinePreview={import.meta.env.DEV}
            researchContact={import.meta.env.VITE_RESEARCH_CONTACT}
            retentionNotice={import.meta.env.VITE_RESEARCH_RETENTION_NOTICE}
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
            progressSaver={persistCoreProgress}
            allowRefusal={researchEnabled}
            onStatusChange={setQuizShellStatus}
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
            allowRefusal
            onStatusChange={setQuizShellStatus}
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

   return <SiteShell context={shellContext}>{renderStage()}</SiteShell>
}

export default App
