import type { Question, QuestionSource } from '../types'
import { questionContextSources } from './questionContext'

export const EDITORIAL_EIGHTEENTH_PASS_VERSION = '2026-08-editorial-v18'
export const EDITORIAL_EIGHTEENTH_PASS_DATE = '2026-08-12'

export interface EighteenthPassRewrite {
  prompt: string
  rationale: string
  evidenceNote: string
  sourceIds: readonly string[]
}

/**
 * This pass narrows five remaining active descriptive claims whose initial
 * wording overstated direction, motive, or generality beyond the cited study.
 */
export const eighteenthPassRewritesById: Readonly<Record<string, EighteenthPassRewrite>> = {
  q0050: {
    prompt: 'Regulated firms can possess technical information that regulators need, creating an information asymmetry that can increase capture risk.',
    rationale: 'Replace the broad “often end up” outcome claim with the source-supported information asymmetry and conditional capture mechanism.',
    evidenceNote: 'Scope to information asymmetry in regulation: regulated firms can hold technical information regulators need, while independent verification and diverse stakeholder input can mitigate the resulting risk. The item does not establish that a particular agency has been captured.',
    sourceIds: ['regulatoryInformationAsymmetry'],
  },
  q0089: {
    prompt: 'In U.S. occupations whose licensing rules differ across states, licensing raised wages and reduced employment.',
    rationale: 'Replace the one-sided incumbent-versus-consumer claim with the concrete labor-market result from the cited welfare study, while retaining a separate source for evidence that consumer effects vary by occupation.',
    evidenceNote: 'Scope to the U.S. occupations and policy margin studied by Kleiner and Soltas: licensing was associated with higher wages and lower employment, with estimated incidence on both workers and consumers. Other research finds consumer-safety effects in particular occupations, so this result is not a universal verdict on licensing.',
    sourceIds: ['occupationalLicensingWelfare', 'occupationalLicensingSafety'],
  },
  q0108: {
    prompt: 'In high-demand U.S. housing markets, zoning and other land-use controls can raise prices by restricting construction.',
    rationale: 'Remove the unsupported attribution of a single exclusionary motive to zoning boards and isolate the documented supply-and-price mechanism.',
    evidenceNote: 'Scope to high-demand U.S. housing markets: zoning and other land-use controls can restrict construction and contribute to higher prices. The item does not claim that every local rule has the same purpose, effect, or distributional consequence.',
    sourceIds: ['housingSupply'],
  },
  q0128: {
    prompt: 'Households’ exposure to monetary policy varies with asset ownership, borrowing constraints, income sources, and labor-market exposure.',
    rationale: 'Replace the asset-holder-only framing with the heterogeneous transmission channels documented in distributional monetary-policy research.',
    evidenceNote: 'Scope to household-level monetary-policy transmission: asset ownership, debt, borrowing constraints, income, and labor-market exposure can change the direction and size of effects. The item does not claim that monetary policy benefits only asset owners or that one distributional outcome is universal.',
    sourceIds: ['distributionalMonetaryPolicy'],
  },
  q0130: {
    prompt: 'In financial-sector licensing and compliance, uniform requirements can burden smaller entrants more than established firms with dedicated compliance capacity.',
    rationale: 'Replace the broad claim that complexity generally favors large financial firms with a conditional entry and capacity mechanism supported by financial-sector competition research.',
    evidenceNote: 'Scope to financial-sector licensing and compliance: uniform or institution-based requirements can impose disproportionate burdens on smaller entrants, while activity-based or proportionate approaches can alter that effect. The item does not imply that all regulation protects incumbents or that firm size alone determines compliance outcomes.',
    sourceIds: ['financialEntryBarriers'],
  },
}

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }))
}

export function applyEditorialEighteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined) return question

  const rewrite = eighteenthPassRewritesById[String(question.id)]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: 'approved',
    version: EDITORIAL_EIGHTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_EIGHTEENTH_PASS_DATE,
    deprecationReason: undefined,
  }
}
