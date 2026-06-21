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
import type { AnswerMap, QuizTier, ResultProfile } from './types'

type Stage = 'intro' | 'quiz' | 'results'

const TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']

function App() {
  const [stage, setStage] = useState<Stage>('intro')
  const [activeQuestions, setActiveQuestions] = useState(questions)
  const [result, setResult] = useState<ResultProfile | null>(null)

  const domainCount = useMemo(() => new Set(questions.map((q) => q.domain)).size, [])
  const questionCounts = useMemo(
    () => Object.fromEntries(TIERS.map((tier) => [tier, questionsForTier(tier).length])) as Record<QuizTier, number>,
    [],
  )

  function handleStart(tier: QuizTier) {
    setActiveQuestions(questionsForTier(tier))
    setStage('quiz')
  }

  function handleComplete(answers: AnswerMap) {
    setResult(buildResultProfile(activeQuestions, answers, axes, labels))
    setStage('results')
  }

  function handleRestart() {
    setResult(null)
    setStage('intro')
  }

  if (stage === 'intro') {
    return <IntroScreen questionCounts={questionCounts} domainCount={domainCount} onStart={handleStart} />
  }

  if (stage === 'quiz') {
    return <QuizScreen questions={activeQuestions} onComplete={handleComplete} />
  }

  return result ? (
    <ResultsScreen result={result} axes={axes} domains={domains} onRestart={handleRestart} />
  ) : null
}

export default App
