export type Layer = 'normative' | 'descriptive' | 'prescriptive'

export type TheoryContext = 'ideal' | 'nonideal' | 'mixed'

export type ResponseType = 'likert5' | 'likert7' | 'statementChoice'

/**
 * Which question pool an item belongs to. Pools nest: quick is a subset of
 * moderate, which is a subset of extensive (the full item bank).
 */
export type QuizTier = 'quick' | 'moderate' | 'extensive'

export type DomainId = string
export type AxisId = string
export type LabelId = string
export type QuestionId = string
