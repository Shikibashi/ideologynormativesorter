import type { Answer, AnswerMap, Axis, IdeologyLabel, LabelMatch, Question, QuestionId, ResultProfile, AxisReliability, LabelReliability, Contribution } from '../types'
import { computeScoreBreakdown } from './aggregate'
import { computeIdealNonIdealGaps } from './gap'
import { computeConflatedLabels, computeLabelMatches } from './labelMatch'
import { detectDivergencesAndContradictions } from './divergence'
import { computeDomainMiniResults } from './domainResults'
import { computeReasonBreakdowns } from './reasonDecomposition'
import { reliabilityForAxis, reliabilityForLabel } from './reliability'
import { contributionsForAxis } from './explain'
import { domains } from '../data/domains'
import { QUESTION_BANK_VERSION, SCORING_VERSION } from '../data/questions'

export { normalizeAnswer, salienceFactor } from './normalize'
export { computeAxisScores, computeScoreBreakdown, axisScoreMap } from './aggregate'
export { computeIdealNonIdealGaps } from './gap'
export { computeConflatedLabels, computeLabelMatches } from './labelMatch'
export { reliabilityForAxis, reliabilityForLabel } from './reliability'
export { contributionsForAxis } from './explain'
export { detectDivergencesAndContradictions } from './divergence'
export { computeDomainMiniResults } from './domainResults'
export { computeReasonBreakdowns } from './reasonDecomposition'

export function buildResultProfile(questions: Question[], answers: AnswerMap, axes: Axis[], labels: IdeologyLabel[]): ResultProfile {
   const scores = computeScoreBreakdown(questions, answers, axes)
   const gaps = computeIdealNonIdealGaps(questions, answers)
   const nearestLabels = computeLabelMatches(scores, labels)
   const conflatedLabels = computeConflatedLabels(scores, labels, axes)

   const axisScoresMap = new Map([...scores.normative, ...scores.descriptive, ...scores.prescriptive].map(s => [s.axisId, s]))

   const axisReliabilities: Record<string, AxisReliability> = {}
   for (const s of [...scores.normative, ...scores.descriptive, ...scores.prescriptive]) {
      axisReliabilities[s.axisId] = reliabilityForAxis(s)
   }

   const labelReliabilities: Record<string, LabelReliability> = {}
   for (const l of labels) {
      const centroidAxes = Object.keys(l.centroid || {})
      labelReliabilities[l.id] = reliabilityForLabel(l.id, axisScoresMap, centroidAxes)
   }

   const divergences = detectDivergencesAndContradictions(scores, gaps)
   const domainMiniResults = computeDomainMiniResults(questions, answers, domains)
   const reasonBreakdowns = computeReasonBreakdowns(questions, answers, axes)

   const familyTree: Record<string, LabelMatch[]> = {}
   const familySubtree: Record<string, Record<string, LabelMatch[]>> = {}
   for (const match of nearestLabels) {
      const label = labels.find((l) => l.id === match.labelId)
      if (!label) continue
      const family = label.family
      if (!familyTree[family]) familyTree[family] = []
      familyTree[family].push(match)

      const subfamily = label.subfamily ?? label.family
      if (!familySubtree[family]) familySubtree[family] = {}
      if (!familySubtree[family][subfamily]) familySubtree[family][subfamily] = []
      familySubtree[family][subfamily].push(match)
   }

   const contributions: Record<string, Contribution[]> = {}
   for (const ax of axes) {
      contributions[ax.id] = contributionsForAxis(ax.id, questions, answers)
   }

   return {
      scores,
      gaps,
      nearestLabels,
      conflatedLabels,
      axisReliabilities,
      labelReliabilities,
      contributions,
      divergences,
      domainMiniResults,
      reasonBreakdowns,
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: SCORING_VERSION,
      familyTree,
      familySubtree,
   }
}

export function answeredCount(answers: AnswerMap): number {
   return Object.keys(answers).length
}

export function setAnswer(answers: AnswerMap, questionId: QuestionId, answer: Answer): AnswerMap {
   return { ...answers, [questionId]: answer }
}
