/**
 * Clean-room academic concept dictionary used to keep questionnaire help text
 * consistent without copying source text from any external reference work.
 */
export interface AcademicTermDefinition {
  /** Matches stems or statement-choice options that use the concept. */
  pattern: RegExp
  /** Short, customer-facing definition shown before the measurement sentence. */
  definition: string
}

export const academicTermDictionary: AcademicTermDefinition[] = [
  {
    pattern: /\blegitima(?:te|cy)\b|\bpolitical authority\b/i,
    definition: '“Legitimacy” means whether power is accepted as having a justified right to make and enforce rules.',
  },
  {
    pattern: /\bdomination\b|\bdominat(?:e|ion)\b/i,
    definition: '“Domination” means being subject to another person or institution’s unchecked power, even if that power is not always used.',
  },
  {
    pattern: /\bnon[- ]?interference\b|\bnegative liberty\b/i,
    definition: '“Non-interference” means freedom from others blocking, forcing or controlling your choices.',
  },
  {
    pattern: /\bdistributive justice\b|\bequality\b|\binequality\b/i,
    definition: '“Distributive justice” means how fairly benefits, burdens, income, wealth or opportunities are shared.',
  },
  {
    pattern: /\bstate capacity\b|\badministrative capacity\b/i,
    definition: '“State capacity” means how well public institutions can implement rules, collect resources and deliver services.',
  },
  {
    pattern: /\bpublic choice\b|\bcapture\b|\bcaptured\b/i,
    definition: '“Public choice” means analyzing government actors as people with incentives, limits and organized pressures, not as neutral problem-solvers.',
  },
  {
    pattern: /\bcoordination\b|\bcollective action\b/i,
    definition: '“Coordination” means how people align their actions when no single person can solve a problem alone.',
  },
  {
    pattern: /\bsubsidiarity\b/i,
    definition: '“Subsidiarity” means decisions should be handled by the smallest or closest institution that can do the job well.',
  },
  {
    pattern: /\bpluralism\b/i,
    definition: '“Pluralism” means accepting that different groups may live by different values while sharing a political system.',
  },
  {
    pattern: /\bdeliberation\b|\bdeliberative\b/i,
    definition: '“Deliberation” means decision-making through public reasons, discussion and weighing objections before acting.',
  },
]
