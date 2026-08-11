import type { AxisWeight, Question } from '../types'

export const EDITORIAL_SEVENTH_PASS_VERSION = '2026-08-editorial-v7'
export const EDITORIAL_SEVENTH_PASS_DATE = '2026-08-11'

export interface SeventhPassRewrite {
  prompt: string
  axisWeights: AxisWeight[]
  theoryContext: Question['theoryContext']
  rationale: string
}

export interface SeventhPassReplacementFinding {
  issue: 'double-barreled' | 'construct-mismatch' | 'duplicate' | 'underspecified' | 'unsupported-inference'
  rationale: string
  proposedReplacement: string
}

const w = (axisId: AxisWeight['axisId'], weight: number): AxisWeight => ({ axisId, weight })

/**
 * Narrow empirical rewrites supported by the public evidence records in the
 * second descriptive-evidence pass. These are content-validity repairs, not
 * empirical coefficient estimates.
 */
export const seventhPassRewritesById: Readonly<Record<string, SeventhPassRewrite>> = {
  q0007: {
    prompt: 'In U.S. metropolitan police studies, having more autonomous service providers did not reduce efficiency and sometimes improved it.',
    axisWeights: [w('coordination-optimism', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace a hypothetical market claim with the scoped polycentric-service finding documented in the cited metropolitan police studies.',
  },
  q0049: {
    prompt: 'Under the U.S. Superfund tax rules examined in one study, product prices reflected only a small fraction of hazardous-waste control costs.',
    axisWeights: [w('market-process-confidence', -1)],
    theoryContext: 'nonideal',
    rationale: 'Replace three bundled missing-market conditions with one observable case of pollution costs not being incorporated into prices.',
  },
  q0067: {
    prompt: 'Administrative requirements at SNAP recertification reduce continued participation among otherwise eligible recipients.',
    axisWeights: [w('state-capacity-confidence', -1)],
    theoryContext: 'nonideal',
    rationale: 'Replace a normative comparison of simple and managed benefits with a measured administrative-burden outcome.',
  },
  q0168: {
    prompt: 'Across documented countries, broadly worded counterterrorism laws have criminalized nonviolent political, religious, or journalistic expression.',
    axisWeights: [w('public-choice-skepticism', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace an unspecified censorship-slippage claim with documented use of broad security laws against legitimate expression.',
  },
  q0207: {
    prompt: 'Across randomized intergroup-contact studies with delayed outcomes, contact usually reduced measured prejudice, although effects varied and were weaker for ethnic, racial, religious, and immigrant targets.',
    axisWeights: [w('cultural-plasticity', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace a broad migration-and-cooperation bundle with the qualified finding from a policy-focused review of randomized contact studies.',
  },
  q0208: {
    prompt: 'In U.S. industry data, migration barriers were lower where business lobbies spent more and higher where labor unions were more influential.',
    axisWeights: [w('public-choice-skepticism', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace an insider-bargaining assertion with an observed association between organized-group influence and sector migration barriers.',
  },
  q0210: {
    prompt: 'Large, rapid refugee inflows can increase pressure on municipal services when local funding and capacity do not expand with population.',
    axisWeights: [w('state-capacity-confidence', -1)],
    theoryContext: 'nonideal',
    rationale: 'Replace a housing-law bundle with the scoped municipal service-delivery constraint documented in host communities.',
  },
  q0227: {
    prompt: 'In paired studies of Indian cities, stronger interethnic civic associations were associated with less communal violence than mainly intraethnic networks.',
    axisWeights: [w('coordination-optimism', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace an undefined civic-ritual claim with a scoped comparison of decentralized civic networks and communal violence.',
  },
  q0329: {
    prompt: 'In U.S. federal procurement data, defense contractors that lobbied received larger contract awards than contractors that did not lobby.',
    axisWeights: [w('public-choice-skepticism', 1)],
    theoryContext: 'nonideal',
    rationale: 'Replace a causal threat-inflation claim with the documented noncausal association between lobbying and defense contract awards.',
  },
}

/**
 * Items for which sourcing the current wording would preserve a construct
 * mismatch, compound claim, unsupported mechanism, or active duplicate.
 */
export const seventhPassReplacementRequiredById: Readonly<Record<string, SeventhPassReplacementFinding>> = {
  q0009: { issue: 'construct-mismatch', rationale: 'Territorial monopoly, responsiveness, user exit, and agency intent do not identify one available descriptive construct.', proposedReplacement: 'No replacement is approved until responsiveness and provider exit can be asked as separate observable claims.' },
  q0028: { issue: 'double-barreled', rationale: 'The item mixes a normative judgment about genuine possession with enclosure, subsidy, and regulation as three empirical mechanisms.', proposedReplacement: 'No replacement is required while the sourced incumbent-barrier item q0029 remains active.' },
  q0051: { issue: 'double-barreled', rationale: 'The planning-agency metaphor combines legal protection, competition, bankruptcy, firm scale, and internal planning.', proposedReplacement: 'No replacement is required while the sourced incumbent-barrier item q0029 remains active.' },
  q0069: { issue: 'unsupported-inference', rationale: 'Payments to contractors or administrators do not by themselves establish capture or administrative failure, and the claim supplies no population or comparator.', proposedReplacement: 'Name one benefit program, payment mechanism, jurisdiction, comparator, and observable service or capture outcome.' },
  q0087: { issue: 'double-barreled', rationale: 'Member information, exit rights, managerial discipline, and cooperative governance are distinct mechanisms, while no assigned axis measures workplace democracy directly.', proposedReplacement: 'Ask one operational claim about cooperative governance and add a construct that directly measures workplace authority before scoring it.' },
  q0088: { issue: 'construct-mismatch', rationale: 'The verified research supports compensation effects of unionization and collective bargaining but not the current political-influence mechanism or its public-choice mapping.', proposedReplacement: 'Ask one observable compensation or service outcome without inferring political capture, then map it only if an available construct directly measures that outcome.' },
  q0149: { issue: 'construct-mismatch', rationale: 'Copyright duration and cultural-control concentration do not directly measure public-choice capture, and the prompt does not identify a policy-influence mechanism.', proposedReplacement: 'Name one copyright rule, the rightsholder population, the relevant market, and an observable concentration outcome.' },
  q0150: { issue: 'underspecified', rationale: 'Digital restriction, punishment, legitimate use, large-scale infringement, and frequency are undefined, and the claim does not measure public-choice skepticism.', proposedReplacement: 'Name one technical restriction, lawful user action, infringement comparator, jurisdiction, and measurable outcome.' },
  q0167: { issue: 'construct-mismatch', rationale: 'Correcting error through dissent does not directly measure either majoritarian decision quality or decentralized coordination.', proposedReplacement: 'Add a knowledge-through-contestation construct before scoring a scoped claim about error correction through public criticism.' },
  q0169: { issue: 'construct-mismatch', rationale: 'Whether state pressure makes private moderation censorship is a legal and conceptual classification not represented by the descriptive axes.', proposedReplacement: 'Ask separately about documented state removal requests and platform compliance without assigning a censorship label.' },
  q0170: { issue: 'double-barreled', rationale: 'The item combines three institutional actors, vague-law exploitation, enforcement intensity, and group disparity.', proposedReplacement: 'Name one law, enforcement institution, jurisdiction, period, comparison group, and observable enforcement outcome.' },
  q0180: { issue: 'duplicate', rationale: 'The latent-incentive claim is not operationalized, and a sourced scope-expansion rewrite would substantially duplicate q0168.', proposedReplacement: 'No replacement is required while the scoped counterterrorism-law item q0168 remains active.' },
  q0228: { issue: 'unsupported-inference', rationale: 'The verified party-competition evidence is conditional and sometimes contrary to simple ethnic-outbidding predictions, so the current general causal claim is unsupported.', proposedReplacement: 'Ask a scoped association from a named electoral dataset without generalizing it into an inevitable ethnic-outbidding mechanism.' },
  q0240: { issue: 'double-barreled', rationale: 'The item combines crisis effects, patriotism, compliance, and executive expansion, while neither assigned axis directly measures the compound mechanism.', proposedReplacement: 'No replacement is required while the sourced emergency-power persistence item q0171 remains active.' },
  q0260: { issue: 'construct-mismatch', rationale: 'Coalition discipline is loaded and does not directly measure either public-choice capture or cultural plasticity.', proposedReplacement: 'Name one religious-nationalist institution and one observable coalition or policy outcome before assigning a descriptive construct.' },
  q0271: { issue: 'double-barreled', rationale: 'Moral panic, sexuality, surveillance, families, and schools combine several mechanisms with no direct descriptive-axis match.', proposedReplacement: 'Name one policy episode, institution, surveillance practice, population, and observable change.' },
  q0280: { issue: 'double-barreled', rationale: 'Licensing effects are sourceable, but care-work scope, expense, cartel structure, and asserted protective motives are distinct claims.', proposedReplacement: 'Name one care occupation and compare entry, prices, quality, and concentration under specified licensing rules.' },
  q0289: { issue: 'double-barreled', rationale: 'Quota duration, patronage, policy design, and remedial motivation are bundled, and no verified source supports the general patronage claim.', proposedReplacement: 'Name one quota rule, jurisdiction, duration, allocation process, and observable patronage outcome.' },
  q0327: { issue: 'unsupported-inference', rationale: 'The trade-and-conflict literature does not establish one clean directional mechanism, and migration further compounds the current claim.', proposedReplacement: 'No replacement is approved until trade exposure and conflict onset are scoped and the competing theoretical predictions are represented.' },
  q0340: { issue: 'double-barreled', rationale: 'Concealing errors and learning from errors are separate outcomes, and the stated secrecy mechanism was not securely established.', proposedReplacement: 'Name one intelligence system, disclosure rule, error class, period, and observable correction outcome.' },
  q0367: { issue: 'construct-mismatch', rationale: 'Openness, ownership concentration, and independent auditability are confounded, while technical auditability is not directly represented by the assigned axes.', proposedReplacement: 'Add a technical transparency or auditability construct before scoring a named open-versus-closed system comparison.' },
  q0380: { issue: 'unsupported-inference', rationale: 'The sources establish risks of policy capture and regulatory entry barriers separately but do not establish the prompt’s general motive and causal chain.', proposedReplacement: 'Name one technology sector, rulemaking process, stakeholder-influence measure, compliance cost, and entry outcome.' },
  q0388: { issue: 'duplicate', rationale: 'The emergency-authority retention claim substantially duplicates q0008 and the sourced q0171.', proposedReplacement: 'No replacement is required while q0008 and q0171 remain active.' },
}

export function applyEditorialSeventhPass(question: Question): Question {
  const id = String(question.id)
  const replacement = seventhPassReplacementRequiredById[id]
  if (replacement) {
    return {
      ...question,
      active: false,
      reviewStatus: 'needs-rewrite',
      version: EDITORIAL_SEVENTH_PASS_VERSION,
      updatedAt: EDITORIAL_SEVENTH_PASS_DATE,
      deprecationReason: replacement.rationale,
    }
  }

  if (question.active === false || question.reviewStatus === 'needs-rewrite') return question

  const rewrite = seventhPassRewritesById[id]
  if (!rewrite) return question

  return {
    ...question,
    prompt: rewrite.prompt,
    axisWeights: rewrite.axisWeights.map((axisWeight) => ({ ...axisWeight })),
    theoryContext: rewrite.theoryContext,
    reviewStatus: 'approved',
    version: EDITORIAL_SEVENTH_PASS_VERSION,
    updatedAt: EDITORIAL_SEVENTH_PASS_DATE,
  }
}
