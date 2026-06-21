import { useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { axes } from './data/axes'
import { domains } from './data/domains'
import { labels } from './data/labels'
import { questions } from './data/questions'
import { buildResultProfile } from './scoring'
import type { AnswerMap, ResultProfile } from './types'

type Stage = 'intro' | 'quiz' | 'results'

function App() {
  const [stage, setStage] = useState<Stage>('intro')
  const [result, setResult] = useState<ResultProfile | null>(null)

  const domainCount = useMemo(() => new Set(questions.map((q) => q.domain)).size, [])

  function handleComplete(answers: AnswerMap) {
    setResult(buildResultProfile(questions, answers, axes, labels))
    setStage('results')
  }

  function handleRestart() {
    setResult(null)
    setStage('intro')
  }

  if (stage === 'intro') {
    return <IntroScreen questionCount={questions.length} domainCount={domainCount} onStart={() => setStage('quiz')} />
  }

  if (stage === 'quiz') {
    return <QuizScreen questions={questions} onComplete={handleComplete} />
  }

  return result ? (
    <ResultsScreen result={result} axes={axes} domains={domains} onRestart={handleRestart} />
  ) : null
}

export default App
