import { QUESTION_BANK_VERSION, questions, questionsForTier } from '../../../src/data/effectiveQuestions'
import { buildResearchQuestionForm, RESEARCH_FORM_VERSION, researchFormFingerprint } from '../../../src/research/forms'
import { RESULT_SCORING_VERSION } from '../../../src/scoring'
import type { AnswerMap, Question } from '../../../src/types'

export const CONTRIBUTION_PATH = '/?contribute=1&collection=community-2026&formSize=12'
export const PARTICIPANT_ID = 'p_browser_conformance'

function encodedResult(entries: Array<[string, number]>): string {
  const payload = {
    v: 3,
    bk: QUESTION_BANK_VERSION,
    sc: RESULT_SCORING_VERSION,
    a: entries,
  }
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

function sampleEntries(multiplier: 1 | -1): Array<[string, number]> {
  return questions.slice(0, 24).map((question, index) => [String(question.id), ((index % 5) - 2) * multiplier])
}

export function resultPath(compare = false): string {
  const first = encodedResult(sampleEntries(1))
  if (!compare) return `/#r=${first}`
  return `/#r=${first}&c=${encodedResult(sampleEntries(-1))}`
}

function answerMap(questionList: Question[], value: AnswerMap[string]['value']): AnswerMap {
  return Object.fromEntries(questionList.map((question) => [question.id, { questionId: question.id, value }]))
}

export function standardResumeStorage(): Record<string, string> {
  const form = questionsForTier('moderate')
  const answered = form.slice(0, 2)
  return {
    'ideology-quiz-save': JSON.stringify({
      questions: form,
      answers: answerMap(answered, 0),
      index: 2,
      tier: 'moderate',
      startedAt: '2026-08-10T12:00:00.000Z',
    }),
  }
}

export function almostCompletedStandardStorage(): Record<string, string> {
  const form = questionsForTier('moderate')
  const answered = form.slice(0, -1)
  return {
    'ideology-quiz-save': JSON.stringify({
      questions: form,
      answers: answerMap(answered, 0),
      index: Math.max(0, form.length - 1),
      tier: 'moderate',
      startedAt: '2026-08-10T12:00:00.000Z',
    }),
  }
}

export function completedContributionStorage(): Record<string, string> {
  const form = buildResearchQuestionForm(
    questionsForTier('moderate'),
    PARTICIPANT_ID,
    'test',
    12,
  )
  return {
    'political-judgment-research-participant-v1:community-2026': PARTICIPANT_ID,
    'ideology-quiz-save': JSON.stringify({
      questions: form,
      answers: answerMap(form, 'prefer_not_to_answer'),
      index: form.length - 1,
      tier: 'moderate',
      startedAt: '2026-08-10T12:00:00.000Z',
      completedAt: '2026-08-10T12:12:00.000Z',
      research: {
        participantId: PARTICIPANT_ID,
        studyId: 'community-2026',
        administration: 'test',
        bankVersion: QUESTION_BANK_VERSION,
        formVersion: RESEARCH_FORM_VERSION,
        formFingerprint: researchFormFingerprint(form),
        requestedItemCount: 12,
      },
    }),
  }
}
