import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { labels } from './data/labels'
import { questions, questionsForTier } from './data/questions'
import { buildResultProfile } from './scoring'
import { readCompareAnswers, readSharedAnswers } from './share'
import type { AnswerMap, QuizTier, ResultProfile } from './types'
import { clearQuizState, loadQuizState, getQuizProgress } from './save'

type Stage = 'intro' | 'quiz' | 'results'

const TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']


function App() {
   const [sharedAnswers] = useState<AnswerMap | null>(() => readSharedAnswers())
   const [compareAnswers] = useState<AnswerMap | null>(() => readCompareAnswers())
   const [stage, setStage] = useState<Stage>(sharedAnswers ? 'results' : 'intro')
   const [activeQuestions, setActiveQuestions] = useState(questions)
   const [answers, setAnswers] = useState<AnswerMap>(sharedAnswers ?? {})
   const [result, setResult] = useState<ResultProfile | null>(() =>
      sharedAnswers ? buildResultProfile(questions, sharedAnswers, axes, labels) : null,
   )
   const [compareResult] = useState<ResultProfile | null>(() =>
      compareAnswers ? buildResultProfile(questions, compareAnswers, axes, labels) : null,
   )
   const [resuming, setResuming] = useState(false)

   const domainCount = useMemo(() => new Set(questions.map((q) => q.domain)).size, [])
   const questionCounts = useMemo(
      () => Object.fromEntries(TIERS.map((tier) => [tier, questionsForTier(tier).length])) as Record<QuizTier, number>,
      [],
   )
   const savedProgress = useMemo(() => getQuizProgress(), [])


   function handleStart(tier: QuizTier) {
      clearQuizState()
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
      setResult(buildResultProfile(questions, newAnswers, axes, labels))
      setStage('results')
   }



   function handleRestart() {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
      clearQuizState()
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
         answers={answers}
         compareResult={compareResult}
         onRestart={handleRestart}
      />
   ) : null
}

export default App
