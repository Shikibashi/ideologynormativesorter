import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { factionModules } from './data/factionModules'
import { labels } from './data/labels'
import { moduleQuestionById } from './data/moduleQuestions'
import { questions, questionsForTier } from './data/questions'
import { buildResultProfile, suggestModules } from './scoring'
import { readCompareAnswers, readSharedAnswers } from './share'
import type { AnswerMap, FactionModule, QuizTier, ResultProfile } from './types'
import { clearQuizState, loadQuizState, getQuizProgress } from './save'

type Stage = 'intro' | 'quiz' | 'results'

const TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']

const ALL_SCORABLE_QUESTIONS = [...questions, ...moduleQuestionById.values()]

function App() {
   const [sharedAnswers] = useState<AnswerMap | null>(() => readSharedAnswers())
   const [compareAnswers] = useState<AnswerMap | null>(() => readCompareAnswers())
   const [stage, setStage] = useState<Stage>(sharedAnswers ? 'results' : 'intro')
   const [activeQuestions, setActiveQuestions] = useState(questions)
   const [answers, setAnswers] = useState<AnswerMap>(sharedAnswers ?? {})
   const [result, setResult] = useState<ResultProfile | null>(() =>
      sharedAnswers ? buildResultProfile(ALL_SCORABLE_QUESTIONS, sharedAnswers, axes, labels) : null,
   )
   const [compareResult] = useState<ResultProfile | null>(() =>
      compareAnswers ? buildResultProfile(ALL_SCORABLE_QUESTIONS, compareAnswers, axes, labels) : null,
   )
   const [activeModule, setActiveModule] = useState<FactionModule | null>(null)
   const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set())
   const [completedModules, setCompletedModules] = useState<FactionModule[]>([])
   const [resuming, setResuming] = useState(false)

   const domainCount = useMemo(() => new Set(questions.map((q) => q.domain)).size, [])
   const questionCounts = useMemo(
      () => Object.fromEntries(TIERS.map((tier) => [tier, questionsForTier(tier).length])) as Record<QuizTier, number>,
      [],
   )
   const savedProgress = useMemo(() => getQuizProgress(), [])

   const suggestedModules = useMemo(
      () => (result ? suggestModules(result.nearestLabels, factionModules, completedModuleIds) : []),
      [result, completedModuleIds],
   )

   function handleStart(tier: QuizTier) {
      clearQuizState()
      setActiveModule(null)
      setActiveQuestions(questionsForTier(tier))
      setStage('quiz')
   }

   const handleResume = useCallback(() => {
      const saved = loadQuizState()
      if (!saved) return
      setActiveQuestions(saved.questions)
      setAnswers(saved.answers)
      setResuming(true)
      setStage('quiz')
   }, [])

   function handleComplete(newAnswers: AnswerMap) {
      setAnswers(newAnswers)
      setResult(buildResultProfile(ALL_SCORABLE_QUESTIONS, newAnswers, axes, labels))
      setStage('results')
   }

   function handleStartModule(module: FactionModule) {
      const moduleQuestions = module.questionIds.map((id) => moduleQuestionById.get(id)).filter((q) => q !== undefined)
      setActiveModule(module)
      setActiveQuestions(moduleQuestions)
      setStage('quiz')
   }

   function handleModuleComplete(moduleAnswers: AnswerMap) {
      const merged = { ...answers, ...moduleAnswers }
      setAnswers(merged)
      const nextCompleted = activeModule ? [...completedModules.filter((m) => m.id !== activeModule.id), activeModule] : completedModules
      setResult(buildResultProfile(ALL_SCORABLE_QUESTIONS, merged, axes, labels, nextCompleted))
      if (activeModule) {
         setCompletedModuleIds((prev) => new Set(prev).add(activeModule.id))
         setCompletedModules(nextCompleted)
      }
      setActiveModule(null)
      setStage('results')
   }

   function handleRestart() {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
      clearQuizState()
      setResult(null)
      setAnswers({})
      setCompletedModuleIds(new Set())
      setCompletedModules([])
      setResuming(false)
      setActiveModule(null)
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
         />
      )
   }

   if (stage === 'quiz') {
      const saved = resuming ? loadQuizState() : null
      return (
         <QuizScreen
            questions={activeQuestions}
            tier={resuming ? saved?.tier : undefined}
            initialAnswers={resuming ? saved?.answers : undefined}
            initialIndex={resuming ? saved?.index : undefined}
            onComplete={activeModule ? handleModuleComplete : handleComplete}
         />
      )
   }

   return result ? (
      <ResultsScreen
         result={result}
         axes={axes}
         domains={domains}
         answers={answers}
         compareResult={compareResult}
         suggestedModules={suggestedModules}
         onStartModule={handleStartModule}
         onRestart={handleRestart}
      />
   ) : null
}

export default App
