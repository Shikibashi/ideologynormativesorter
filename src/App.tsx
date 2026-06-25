import { useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { labels } from './data/labels'
import { questions, questionsForTier } from './data/questions'
import { buildResultProfile } from './scoring'
import { readCompareAnswers, readSharedResult } from './share'
import type { AnswerMap, QuizTier, ResultProfile } from './types'
import { clearQuizState, loadQuizState, getQuizProgress } from './save'

type Stage = 'intro' | 'quiz' | 'results'

const TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']


function App() {
   const [shareLoad] = useState(readSharedResult)
   const sharedAnswers = shareLoad.answers
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
      sharedAnswers ? buildResultProfile(questions, sharedAnswers, axes, labels) : null,
   )
   const [compareResult, setCompareResult] = useState<ResultProfile | null>(() =>
      compareAnswers ? buildResultProfile(questions, compareAnswers, axes, labels) : null,
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


   function handleStart(tier: QuizTier) {
      setLoadError(null)
      clearQuizState()
      setSavedProgress(null)
      setActiveQuestions(questionsForTier(tier))
      setStage('quiz')
   }

   function handleResume() {
      setLoadError(null)
      const saved = loadQuizState()
      if (!saved) {
         refreshSavedProgress()
         return
      }
      setActiveQuestions(saved.questions)
      setAnswers(saved.answers)
      setResuming(true)
      setStage('quiz')
   }

   function handleComplete(newAnswers: AnswerMap) {
      clearQuizState()
      setSavedProgress(null)
      setAnswers(newAnswers)
      setResult(buildResultProfile(questions, newAnswers, axes, labels))
      setStage('results')
   }

   function handleCompare(compareAnswers: AnswerMap): void {
      setCompareResult(buildResultProfile(questions, compareAnswers, axes, labels))
   }

   function handleClearSavedProgress(): void {
      clearQuizState()
      setSavedProgress(null)
   }



   function handleRestart() {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
      clearQuizState()
      setSavedProgress(null)
      setResult(null)
      setAnswers({})
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

   if (stage === 'quiz') {
      const saved = resuming ? loadQuizState() : null
      return (
         <QuizScreen
            questions={activeQuestions}
            tier={resuming ? saved?.tier : undefined}
            initialAnswers={resuming ? saved?.answers : undefined}
            initialIndex={resuming ? saved?.index : undefined}
            onComplete={handleComplete}
         />
      )
   }

   return result ? (
      <ResultsScreen
         result={result}
         axes={axes}
         domains={domains}
         labels={labels}
         answers={answers}
         compareResult={compareResult}
         onCompare={handleCompare}
         onRestart={handleRestart}
      />
   ) : null
}

export default App
