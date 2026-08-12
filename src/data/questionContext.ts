import type { Question, QuestionSource } from '../types'

export const QUESTION_CONTEXT_VERSION = '2026-08-question-context-v1'

interface QuestionContext {
  contextNote: string
  sources: QuestionSource[]
}

const nationalismSources: QuestionSource[] = [
  {
    title: 'Nationalism',
    url: 'https://plato.stanford.edu/entries/nationalism/',
    publisher: 'Stanford Encyclopedia of Philosophy',
  },
  {
    title: 'Ethnonationalism',
    url: 'https://doi.org/10.1002/9781118663202.wberen301',
    publisher: 'The Wiley-Blackwell Encyclopedia of Race, Ethnicity, and Nationalism',
  },
]

const islamicDemocracySources: QuestionSource[] = [
  {
    title: 'Constitutional Interpretation and Constitutionalism in the Arab World',
    url: 'https://academic.oup.com/icon/article/11/3/615/789556',
    publisher: 'International Journal of Constitutional Law',
  },
  {
    title: 'The Puzzle of Islamic Democracy',
    url: 'https://doi.org/10.1057/palgrave.polity.2300086',
    publisher: 'Polity',
  },
]

function cloneSources(sources: QuestionSource[]): QuestionSource[] {
  return sources.map((source) => ({ ...source }))
}

export const questionContextById: Readonly<Record<string, QuestionContext>> = {
  q0222: {
    contextNote: 'This item contrasts civic membership with inherited or ascriptive membership. Nationalism scholarship distinguishes these models; it does not assume that every cultural nation demands an independent state.',
    sources: nationalismSources,
  },
  q0225: {
    contextNote: 'This item isolates a normative question about coercive assimilation. Cultural continuity, minority self-government, and voluntary association are distinct policy possibilities rather than interchangeable claims.',
    sources: nationalismSources,
  },
  q0405: {
    contextNote: 'This item concerns whether religious commitments may shape coercive public law. “Islamic democracy” is not identical to theocracy; constitutional models differ over who interprets religious principles and how rights are protected.',
    sources: islamicDemocracySources,
  },
  q0406: {
    contextNote: 'This item asks about the public justification of coercive law, not whether religious citizens may participate in politics. Constitutional arrangements differ over how religious reasons, public reasons, and institutional authority relate.',
    sources: islamicDemocracySources,
  },
  q0414: {
    contextNote: 'This item tests a claim about the hierarchy between civil law and revealed religious law. It does not by itself identify one school of jurisprudence, one constitutional mechanism, or one answer about minority rights.',
    sources: islamicDemocracySources,
  },
  q0415: {
    contextNote: 'This item contrasts civic nationhood with inherited ethnic or religious identity as sources of political membership. The distinction is analytically useful but can be blurred in practice, and civic criteria can also exclude.',
    sources: nationalismSources,
  },
  q0417: {
    contextNote: 'This item asks whether preserving inherited cultural continuity should justify a policy cost in openness. It does not determine whether the continuity is ethnic, religious, linguistic, or civic, nor which immigration instrument would follow.',
    sources: nationalismSources,
  },
}

export function applyQuestionContext(question: Question): Question {
  const context = questionContextById[String(question.id)]
  if (!context || question.active === false) return question

  return {
    ...question,
    contextNote: context.contextNote,
    sources: cloneSources(context.sources),
  }
}
