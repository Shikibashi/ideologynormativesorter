import type { AxisWeight, Question } from '../types'

export const EDITORIAL_FIFTH_PASS_VERSION = '2026-08-editorial-v5'
export const EDITORIAL_FIFTH_PASS_DATE = '2026-08-11'

export interface FifthPassMappingCorrection {
  axisWeights: AxisWeight[]
  rationale: string
}

export interface FifthPassWordingCorrection {
  prompt: string
  rationale: string
}

export interface FifthPassReplacementFinding {
  issue: 'layer-mismatch' | 'double-barreled' | 'forced-choice-mismatch' | 'construct-mismatch' | 'non-discriminating' | 'duplicate' | 'underspecified'
  rationale: string
  proposedReplacement: string
}

const w = (axisId: AxisWeight['axisId'], weight: number): AxisWeight => ({ axisId, weight })

/**
 * High-confidence semantic corrections. These are content-validity repairs,
 * not empirical calibration: no respondent coefficient is inferred here.
 */
export const fifthPassMappingCorrectionsById: Readonly<Record<string, FifthPassMappingCorrection>> = {
  q0015: { axisWeights: [w('centralization-preference', -1)], rationale: 'The revised item asks only whether reform authority should be dispersed or concentrated.' },
  q0017: { axisWeights: [w('coercion-strategy', -0.8), w('gradualism-vs-immediatism', -0.5)], rationale: 'Civil-liberties safeguards constrain enforcement and sequence expansion; they do not imply state exit or geographic decentralization.' },
  q0018: { axisWeights: [w('centralization-preference', -1)], rationale: 'The revised item directly contrasts divided and concentrated enforcement authority.' },
  q0021: { axisWeights: [w('property-legitimacy', 0.5), w('anti-domination', 0.4)], rationale: 'Rejecting legal privilege and conquest supports, rather than opposes, anti-domination.' },
  q0023: { axisWeights: [w('property-legitimacy', -0.4), w('anti-domination', 0.5)], rationale: 'Conditioning title on origins in conquest or privilege weakens unconditional private-title legitimacy and supports anti-domination.' },
  q0024: { axisWeights: [w('anti-domination', 0.5), w('equality-theory', 0.4)], rationale: 'Rectification of privilege concerns domination and distribution, not stronger private-title legitimacy.' },
  q0026: { axisWeights: [w('property-legitimacy', -0.5), w('anti-domination', 0.5), w('equality-theory', 0.3)], rationale: 'Making title conditional on livelihood and exit points away from unconditional private-title legitimacy.' },
  q0030: { axisWeights: [w('public-choice-skepticism', 0.5)], rationale: 'A transfer of control to state managers supports a public-choice concern, not a definite claim about market performance or state capacity.' },
  q0042: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.4)], rationale: 'The revised item asks about treating people as instruments, a domination and liberty judgment.' },
  q0047: { axisWeights: [w('market-process-confidence', 1), w('coordination-optimism', 0.7)], rationale: 'Price coordination does not by itself imply distrust of expertise.' },
  q0058: { axisWeights: [w('regulation-vs-deregulation', -1)], rationale: 'The revised item asks whether competing business approaches should be permitted under uncertainty.' },
  q0067: { axisWeights: [w('state-capacity-confidence', -0.5), w('public-choice-skepticism', 0.4)], rationale: 'Administrative burden can bear on capacity and institutional incentives, not expert competence in general.' },
  q0069: { axisWeights: [w('state-capacity-confidence', -1), w('public-choice-skepticism', 0.8)], rationale: 'Benefit cliffs concern administration and political incentives, not cultural malleability.' },
  q0088: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'Regulatory capture directly tests political incentives; market quality and state capacity do not follow.' },
  q0089: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'Incumbent protection through licensing is a public-choice claim, not general market or capacity evidence.' },
  q0094: { axisWeights: [w('regulation-vs-deregulation', -1)], rationale: 'The revised item directly asks whether occupational licensing should be reduced.' },
  q0096: { axisWeights: [w('state-action-vs-exit', -1)], rationale: 'Individual control and portability establish exit only when the account holder is explicit.' },
  q0119: { axisWeights: [w('property-legitimacy', -0.5), w('equality-theory', 0.6), w('anti-domination', 0.5)], rationale: 'Rejecting exclusion for aesthetics weakens strong exclusion claims and supports equal access and anti-domination.' },
  q0148: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'The item asks about incumbent influence over information rules, not markets or expert judgment generally.' },
  q0149: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'The item asks about incumbent influence over information rules, not markets or expert judgment generally.' },
  q0150: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'The item asks about incumbent influence over information rules, not markets or expert judgment generally.' },
  q0156: { axisWeights: [w('regulation-vs-deregulation', 1)], rationale: 'An open-access condition on public funding is targeted regulation; it implies neither policy pace nor private exit.' },
  q0167: { axisWeights: [w('democratic-confidence', 0.6), w('coordination-optimism', 0.5)], rationale: 'Public contestation concerns democratic and coordination processes, not distrust of expertise.' },
  q0168: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Emergency-power persistence concerns institutional incentives and administrative self-limitation, not democracy in general.' },
  q0169: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Emergency-power persistence concerns institutional incentives and administrative self-limitation, not democracy in general.' },
  q0170: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Emergency-power persistence concerns institutional incentives and administrative self-limitation, not democracy in general.' },
  q0171: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Emergency-power persistence concerns institutional incentives and administrative self-limitation, not democracy in general.' },
  q0177: { axisWeights: [w('regulation-vs-deregulation', 0.6), w('coercion-strategy', -0.6)], rationale: 'Transparency for state removal requests adds oversight while constraining coercive suppression.' },
  q0178: { axisWeights: [w('coercion-strategy', -0.8), w('regulation-vs-deregulation', 0.4)], rationale: 'Equal judicial review constrains emergency surveillance; it does not imply private exit.' },
  q0179: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8)], rationale: 'The right to be wrong concerns civic liberty and standing, not material equality or moral traditionalism.' },
  q0180: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Institutional persistence concerns incentives and capacity, not democratic confidence in general.' },
  q0181: { axisWeights: [w('anti-domination', 0.8), w('authority-legitimacy', -0.4)], rationale: 'Punitive authority requires scrutiny; material equality is not asked.' },
  q0182: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.4), w('authority-legitimacy', -0.4)], rationale: 'Rights after accusation or conviction concern liberty, domination, and limits on authority.' },
  q0183: { axisWeights: [w('anti-domination', 0.5)], rationale: 'The item concerns punitive domination; it does not locate material equality or authority legitimacy cleanly.' },
  q0184: { axisWeights: [w('liberty-noninterference', 0.7), w('anti-domination', 0.5), w('authority-legitimacy', -0.4)], rationale: 'Rejecting victimless crimes is a civil-liberty and anti-coercion judgment.' },
  q0185: { axisWeights: [w('anti-domination', 1), w('authority-legitimacy', -0.6), w('liberty-noninterference', 0.3)], rationale: 'Stricter scrutiny of unavoidable state violence points against presumed authority.' },
  q0186: { axisWeights: [w('anti-domination', 1), w('authority-legitimacy', -0.5)], rationale: 'Unchecked criminal-justice discretion concerns domination and authority, not material equality.' },
  q0188: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Institutional incentives and implementation are asked; cultural plasticity is not.' },
  q0190: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Institutional incentives and implementation are asked; cultural plasticity is not.' },
  q0191: { axisWeights: [w('public-choice-skepticism', 1), w('state-capacity-confidence', -0.8)], rationale: 'Institutional incentives and implementation are asked; cultural plasticity is not.' },
  q0199: { axisWeights: [w('anti-domination', 0.8), w('authority-legitimacy', -0.5)], rationale: 'Irreversible punishment under institutional error concerns domination and limits on authority.' },
  q0202: { axisWeights: [w('political-community-boundary', 0.8), w('liberty-noninterference', 0.7)], rationale: 'The revised border item directly asks about movement liberty and equal standing across nationality.' },
  q0210: { axisWeights: [w('state-capacity-confidence', -0.5), w('market-process-confidence', -0.2)], rationale: 'The prompt does not ask whether culture is fixed or malleable.' },
  q0223: { axisWeights: [w('anti-domination', 0.6), w('liberty-noninterference', 0.4)], rationale: 'Local exit and pluralism do not establish national partiality or personal moral traditionalism.' },
  q0224: { axisWeights: [w('anti-domination', 0.8), w('authority-legitimacy', -0.5)], rationale: 'Sovereignty used to shield rulers concerns domination and authority, not national obligation.' },
  q0225: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.4)], rationale: 'Rejecting forced assimilation does not imply rejecting tradition or all national partiality.' },
  q0227: { axisWeights: [w('coordination-optimism', 0.6), w('cultural-plasticity', 0.5)], rationale: 'The item asks about identity formation and coordination, not confidence in democracy.' },
  q0240: { axisWeights: [w('cultural-plasticity', 1), w('democratic-confidence', -0.8)], rationale: 'The prompt does not cleanly ask about general coordination optimism.' },
  q0243: { axisWeights: [w('liberty-noninterference', 0.6), w('anti-domination', 0.5)], rationale: 'Voluntary religious association with real exit is compatible with secular public neutrality.' },
  q0248: { axisWeights: [w('public-choice-skepticism', 1), w('cultural-plasticity', 0.8)], rationale: 'The prompt does not establish general state capacity.' },
  q0258: { axisWeights: [w('coercion-strategy', -0.7)], rationale: 'The revised item asks whether state power over conscience should be constrained.' },
  q0259: { axisWeights: [w('liberty-noninterference', 0.7), w('anti-domination', 0.6), w('authority-legitimacy', -0.3)], rationale: 'Personal conscience concerns liberty and unchecked authority, not secularism alone.' },
  q0260: { axisWeights: [w('public-choice-skepticism', 1), w('cultural-plasticity', 0.8)], rationale: 'The prompt does not establish general state capacity.' },
  q0263: { axisWeights: [w('equality-theory', 0.7)], rationale: 'Material support for unpaid care directly concerns substantive equality.' },
  q0264: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.5), w('equality-theory', 0.3)], rationale: 'Blocked family exit is principally a domination and liberty construct.' },
  q0279: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.6), w('equality-theory', 0.2)], rationale: 'Distinguishing chosen from imposed roles does not itself reject traditional roles.' },
  q0282: { axisWeights: [w('political-community-boundary', 0.7), w('anti-domination', 0.4)], rationale: 'Equal citizenship without cultural uniformity concerns civic standing and domination, not material equality.' },
  q0284: { axisWeights: [w('equality-theory', 0.8), w('anti-domination', 0.3)], rationale: 'Present rectification claims concern distribution and durable domination, not national versus universal duties.' },
  q0285: { axisWeights: [w('political-community-boundary', 0.4), w('anti-domination', 0.3)], rationale: 'Rejecting inherited blame supports individual civic standing rather than national partiality.' },
  q0289: { axisWeights: [w('state-capacity-confidence', -0.4), w('public-choice-skepticism', 0.3)], rationale: 'The prompt does not test whether culture is malleable.' },
  q0301: { axisWeights: [w('human-nature-priority', 0.8)], rationale: 'The revised item isolates nonhuman moral standing.' },
  q0303: { axisWeights: [w('human-nature-priority', 1)], rationale: 'The revised item directly contrasts nonhuman standing with human prosperity.' },
  q0304: { axisWeights: [w('anti-domination', 0.5), w('liberty-noninterference', 0.4)], rationale: 'Diffuse pollution harm is a human-harm and collective-action judgment, not necessarily ecocentrism.' },
  q0305: { axisWeights: [w('anti-domination', 0.6)], rationale: 'Incumbent protection concerns political domination and capture, not nonhuman moral standing.' },
  q0319: { axisWeights: [w('equality-theory', 0.8)], rationale: 'Unequal exposure to pollution is a distributive environmental-justice claim.' },
  q0321: { axisWeights: [w('political-community-boundary', 0.8), w('anti-domination', 0.4)], rationale: 'Equal civilian standing across borders does not itself entail pacifism.' },
  q0322: { axisWeights: [w('anti-domination', 0.8), w('militarism-pacifism', -0.5), w('authority-legitimacy', -0.4)], rationale: 'Using a population instrumentally points against domination and presumed authority.' },
  q0323: { axisWeights: [w('militarism-pacifism', -0.5), w('anti-domination', 0.3)], rationale: 'Accepting defensive force but rejecting regime transformation is a limited anti-intervention judgment.' },
  q0324: { axisWeights: [w('anti-domination', 0.8), w('authority-legitimacy', -0.6), w('militarism-pacifism', -0.3)], rationale: 'Emergency war powers without scrutiny point against presumed authority.' },
  q0325: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.6), w('authority-legitimacy', -0.5)], rationale: 'Rejecting conscription does not establish pacifism or cosmopolitanism.' },
  q0326: { axisWeights: [w('anti-domination', 0.6), w('militarism-pacifism', -0.4), w('political-community-boundary', 0.2)], rationale: 'Solidarity abroad with limits on military control is mildly universal and anti-interventionist.' },
  q0327: { axisWeights: [w('market-process-confidence', 0.6), w('coordination-optimism', 0.5)], rationale: 'The prompt does not establish confidence in democracy.' },
  q0328: { axisWeights: [w('state-capacity-confidence', -1), w('public-choice-skepticism', 0.8)], rationale: 'The prompt does not establish confidence in democracy.' },
  q0338: { axisWeights: [w('coercion-strategy', -0.8)], rationale: 'The revised item turns limited local knowledge into an explicit policy against military intervention.' },
  q0339: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.5), w('authority-legitimacy', -0.5), w('militarism-pacifism', -0.3)], rationale: 'Conscription and compelled support concern liberty, domination, authority, and limited military force.' },
  q0340: { axisWeights: [w('state-capacity-confidence', -1), w('public-choice-skepticism', 0.8)], rationale: 'The prompt does not establish confidence in democracy.' },
  q0344: { axisWeights: [w('anti-domination', 0.8), w('authority-legitimacy', -0.5), w('liberty-noninterference', 0.3)], rationale: 'The revised item makes a normative judgment about unchecked majority power.' },
  q0348: { axisWeights: [w('democratic-confidence', -0.5), w('expert-confidence', -0.4), w('public-choice-skepticism', 0.3)], rationale: 'Low voter incentives reduce rather than increase confidence in democratic judgment.' },
  q0354: { axisWeights: [w('centralization-preference', -1), w('state-action-vs-exit', -0.8)], rationale: 'The item asks for checks and alternatives, not bargaining compromise.' },
  q0355: { axisWeights: [w('centralization-preference', 0.5), w('state-action-vs-exit', -0.4)], rationale: 'The item asks about referendum safeguards, not persistence in bargaining.' },
  q0356: { axisWeights: [w('centralization-preference', 1), w('state-action-vs-exit', 0.8)], rationale: 'The item asks about courts and administration, not bargaining compromise.' },
  q0357: { axisWeights: [w('centralization-preference', 0.7), w('state-action-vs-exit', 0.3)], rationale: 'National rights limits on local rules point toward higher-level authority.' },
  q0359: { axisWeights: [w('authority-legitimacy', -0.8), w('liberty-noninterference', 0.4), w('anti-domination', 0.3)], rationale: 'The revised item directly asks whether being outvoted creates a duty to obey.' },
  q0361: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8), w('authority-legitimacy', -0.3)], rationale: 'Private communication without presumed guilt points against unchecked authority.' },
  q0362: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8)], rationale: 'Voluntary enhancement does not imply presumed centralized authority.' },
  q0363: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8), w('authority-legitimacy', -0.3)], rationale: 'Rejecting managerial and police legibility points against unchecked authority.' },
  q0364: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8), w('authority-legitimacy', -0.3)], rationale: 'Rejecting surveillance blank checks points against unchecked authority.' },
  q0365: { axisWeights: [w('liberty-noninterference', 1), w('anti-domination', 0.8), w('authority-legitimacy', -0.3)], rationale: 'A right to contest consequential decisions constrains authority.' },
  q0368: { axisWeights: [w('public-choice-skepticism', 1), w('expert-confidence', -0.8)], rationale: 'The prompt does not establish general state capacity.' },
  q0379: { axisWeights: [w('anti-domination', 0.8), w('liberty-noninterference', 0.6)], rationale: 'The revised item isolates ordinary people’s control rather than presumed authority.' },
  q0380: { axisWeights: [w('public-choice-skepticism', 1), w('expert-confidence', -0.8)], rationale: 'The prompt does not establish general state capacity.' },
  q0388: { axisWeights: [w('public-choice-skepticism', 1)], rationale: 'Failure to relinquish emergency authority directly tests institutional incentives.' },
  q0401: { axisWeights: [w('political-community-boundary', 0.5), w('anti-domination', 0.3)], rationale: 'Equal justification across borders does not establish whether force is usually legitimate.' },
  q0407: { axisWeights: [w('property-legitimacy', -0.8), w('anti-domination', 0.6), w('equality-theory', 0.3)], rationale: 'The revised item makes outside ownership the explicit contrast.' },
  q0413: { axisWeights: [w('centralization-preference', 0.6)], rationale: 'Standing coordination versus autonomous groups is a centralization construct, not electoralism or bargaining persistence.' },
  q0418: { axisWeights: [w('human-nature-priority', 1)], rationale: 'Nonhuman habitat claims directly isolate ecological moral standing.' },
  q0420: { axisWeights: [w('regulation-vs-deregulation', 0.8), w('redistribution-vs-predistribution', 0.4)], rationale: 'Binding material caps do not state a pace of implementation.' },
  q0421: { axisWeights: [w('anti-domination', 0.8), w('equality-theory', 0.7), w('moral-traditionalism', -0.5)], rationale: 'The revised item is a foundational judgment about hierarchy beyond formal rights.' },
  q0424: { axisWeights: [w('redistribution-vs-predistribution', -0.9)], rationale: 'Replacing taxes on labor and investment with land-value tax changes underlying market rules; it does not distinguish state action or scale.' },
  q0425: { axisWeights: [w('authority-legitimacy', 0.8), w('moral-traditionalism', 0.7)], rationale: 'Inherited office concerns authority and tradition, not material equality.' },
}

/** Neutral, single-construct rewrites whose direction is fixed by the mapping above. */
export const fifthPassWordingCorrectionsById: Readonly<Record<string, FifthPassWordingCorrection>> = {
  q0015: { prompt: 'Reform authority should be distributed across independently accountable institutions rather than concentrated in one national body.', rationale: 'Replace loaded language and isolate institutional centralization.' },
  q0017: { prompt: 'Civil-liberties safeguards should be enacted before an agency receives additional enforcement powers.', rationale: 'State the sequencing rule directly.' },
  q0018: { prompt: 'Enforcement agencies should be divided among independently accountable bodies rather than placed under one executive authority.', rationale: 'Replace a descriptive premise with a concrete institutional choice.' },
  q0023: { prompt: 'Private ownership of productive assets is legitimate only when titles do not originate in conquest or legal privilege.', rationale: 'Make the property-legitimacy contrast explicit.' },
  q0024: { prompt: 'Correcting wealth created by legal privilege can be legitimate while ordinary personal possessions remain protected.', rationale: 'Remove ambiguity between productive property and personal possessions.' },
  q0042: { prompt: 'Economic planning is morally suspect when it treats people as instruments of a single collective blueprint.', rationale: 'Isolate the domination judgment.' },
  q0058: { prompt: 'When regulators are uncertain which business model will work, they should permit competing approaches unless a specific harm is demonstrated.', rationale: 'Turn an abstract discovery maxim into one policy choice.' },
  q0094: { prompt: 'Occupational-licensing requirements should be reduced when they block entry into ordinary jobs.', rationale: 'Ask whether licensing should change instead of how repeal should be categorized.' },
  q0096: { prompt: 'Workers should control benefit accounts that remain theirs when they change employers.', rationale: 'Specify individual control so portability maps to exit.' },
  q0178: { prompt: 'Emergency surveillance powers should face the same judicial review regardless of which party controls government.', rationale: 'Replace partisan rhetoric with a concrete institutional safeguard.' },
  q0202: { prompt: 'States should not restrict peaceful adults from crossing borders solely to improve their lives.', rationale: 'Replace a circular freedom claim with a direct moral tradeoff.' },
  q0258: { prompt: 'Secular public institutions should limit state power over conscience rather than impose an official state doctrine.', rationale: 'Replace the loaded phrase “state creed” and isolate limits on coercion.' },
  q0301: { prompt: 'Future nonhuman life has moral standing even when protecting it does not benefit humans now.', rationale: 'Future people alone do not distinguish ecocentric from anthropocentric views.' },
  q0303: { prompt: 'The natural world has moral standing even when protecting it would reduce long-run human prosperity.', rationale: 'Make the ecocentric-versus-anthropocentric tradeoff explicit.' },
  q0305: { prompt: 'Environmental policy loses legitimacy when it protects incumbent firms rather than ecological goods.', rationale: 'Remove rhetorical framing while retaining the capture judgment.' },
  q0338: { prompt: 'When officials lack reliable local knowledge about another country, government should avoid military intervention.', rationale: 'Convert a descriptive premise into an explicit policy choice.' },
  q0344: { prompt: 'Majority rule is not morally sufficient when it leaves minorities or outsiders subject to unchecked power.', rationale: 'Convert a descriptive possibility into a normative judgment.' },
  q0357: { prompt: 'National rights protections should limit local experimentation when the two conflict.', rationale: 'State the higher-level-versus-local authority tradeoff directly.' },
  q0359: { prompt: 'Being outvoted does not by itself create a moral obligation to obey.', rationale: 'Turn a conceptual distinction into a discriminating legitimacy judgment.' },
  q0379: { prompt: 'Powerful technologies should increase ordinary people’s control over their lives rather than institutions’ control over them.', rationale: 'Replace vague language about being managed with a direct domination contrast.' },
  q0407: { prompt: 'Productive assets should be owned or governed collectively by the people who work with them rather than by outside private owners.', rationale: 'Make the competing ownership forms explicit.' },
  q0413: { prompt: 'Anti-authoritarian movements should use standing coordinating bodies rather than rely only on autonomous affinity groups.', rationale: 'Isolate organizational centralization from electoral and compromise constructs.' },
  q0421: { prompt: 'Gender and sexual hierarchies remain unjust even when everyone has equal formal legal rights.', rationale: 'Keep a normative equality judgment in the normative layer.' },
}

/** Items whose defect requires a split, a new construct, or a redesigned choice set. */
export const fifthPassReplacementRequiredById: Readonly<Record<string, FifthPassReplacementFinding>> = {
  q0031: { issue: 'double-barreled', rationale: 'Capital access, member exit, and managerial accountability are distinct institutional mechanisms, while “poorly designed” makes the combined claim difficult to disagree with meaningfully.', proposedReplacement: 'Limited access to outside finance makes worker-owned firms less able to fund capital-intensive expansion than otherwise comparable investor-owned firms.' },
  q0037: { issue: 'construct-mismatch', rationale: 'Rectification priority is not represented by the assigned policy axes.', proposedReplacement: 'Add a rectification/compensation construct before scoring this judgment.' },
  q0057: { issue: 'construct-mismatch', rationale: 'A subsidy sunset rule does not identify exit, decentralization, or regulation direction on the available axes.', proposedReplacement: 'Create a program-sunset or fiscal-rules item on a construct that measures it.' },
  q0068: { issue: 'double-barreled', rationale: 'The item combines distinct administrative mechanisms that can receive different answers.', proposedReplacement: 'Split the administrative mechanisms into separately answerable claims.' },
  q0090: { issue: 'double-barreled', rationale: 'The item combines worker exit and labor-market monopsony in one response.', proposedReplacement: 'Ask separately about job-switching options and employer concentration.' },
  q0111: { issue: 'double-barreled', rationale: 'The item combines several housing and land mechanisms in one causal claim.', proposedReplacement: 'Choose one named policy and one observable housing outcome.' },
  q0131: { issue: 'double-barreled', rationale: 'The item combines distinct banking mechanisms and outcomes.', proposedReplacement: 'Split the banking mechanisms into separately answerable claims.' },
  q0189: { issue: 'double-barreled', rationale: 'The item combines separable justice institutions and causal claims.', proposedReplacement: 'Ask about one institution and one observable outcome.' },
  q0194: { issue: 'double-barreled', rationale: 'Decriminalizing victimless offenses and sequencing police budgets are independent policies.', proposedReplacement: 'Victimless offenses should be decriminalized.' },
  q0209: { issue: 'double-barreled', rationale: 'The item combines multiple migration mechanisms and consequences.', proposedReplacement: 'Ask about one named admission rule and one observable outcome.' },
  q0220: { issue: 'double-barreled', rationale: 'The item combines multiple identity mechanisms and consequences.', proposedReplacement: 'Ask about one institution and one observable identity outcome.' },
  q0247: { issue: 'double-barreled', rationale: 'The item combines distinct religious and institutional mechanisms.', proposedReplacement: 'Ask about one named institution and one observable outcome.' },
  q0251: { issue: 'underspecified', rationale: 'The claim lacks an operational threshold or observable outcome.', proposedReplacement: 'Name the institution, jurisdiction, period, and outcome being compared.' },
  q0291: { issue: 'double-barreled', rationale: 'The item combines distinct mechanisms of classification and inequality.', proposedReplacement: 'Ask about one classification rule and one observable outcome.' },
  q0311: { issue: 'construct-mismatch', rationale: 'The nuclear-barriers claim overreduces distinct financing, regulatory, supply-chain, and construction constraints and has no defensible current mapping.', proposedReplacement: 'Ask separately about financing costs, approval delay, supply chains, and construction performance.' },
  q0335: { issue: 'double-barreled', rationale: 'Trade, immigration, and coercive nation-building are independent foreign-policy choices.', proposedReplacement: 'Government should avoid coercive nation-building abroad.' },
  q0347: { issue: 'double-barreled', rationale: 'The item combines multiple democratic mechanisms and outcomes.', proposedReplacement: 'Ask about one institution and one observable democratic outcome.' },
  q0360: { issue: 'double-barreled', rationale: 'Agency survival combines institutional incentives, democratic control, and expertise in one claim.', proposedReplacement: 'Agencies can persist after the problem they were created to solve has diminished.' },
  q0369: { issue: 'duplicate', rationale: 'The item substantially duplicates the retained, neutrally rewritten regulatory-barrier claim in q0380.', proposedReplacement: 'No replacement is required while q0380 remains active.' },
  q0373: { issue: 'double-barreled', rationale: 'Encryption, interoperability, portability, and user control are four separable protections.', proposedReplacement: 'Users should have a legal right to export their data to competing services.' },
  q0387: { issue: 'construct-mismatch', rationale: 'Prefigurative practical knowledge has no clean mapping to the listed descriptive confidence axes.', proposedReplacement: 'Create a construct that directly measures learning through institutional experimentation.' },
  q0410: { issue: 'duplicate', rationale: 'The item duplicates the local-information problem already asked in q0048 while adding unsupported motive language.', proposedReplacement: 'No replacement is required while q0048 remains active.' },
  q0423: { issue: 'construct-mismatch', rationale: 'Universal and targeted public benefits occupy the same side of the available state-action and redistribution axes.', proposedReplacement: 'Add a universal-versus-targeted provision construct before scoring this choice.' },
  sq05: { issue: 'forced-choice-mismatch', rationale: 'Policing, treatment, devolution, and oversight are compatible interventions on different constructs.', proposedReplacement: 'Present the four interventions as separate priority ratings.' },
  sq09: { issue: 'forced-choice-mismatch', rationale: 'Zoning, assistance, land taxation, and tenant protection are compatible policies.', proposedReplacement: 'Present the four policies as separate priority ratings.' },
  sq14: { issue: 'forced-choice-mismatch', rationale: 'Every option bundles organizational form, reform strategy, action type, centralization, and compromise.', proposedReplacement: 'Use one forced choice per strategy axis.' },
  sq17: { issue: 'forced-choice-mismatch', rationale: 'The stem restricts all respondents to libertarian-leaning strategies and each option bundles independent policies.', proposedReplacement: 'Move label-specific strategies to an optional specialist module and rate them separately.' },
}

export function applyEditorialFifthPass(question: Question): Question {
  const id = String(question.id)
  const replacement = fifthPassReplacementRequiredById[id]
  if (replacement) {
    return {
      ...question,
      active: false,
      reviewStatus: 'needs-rewrite',
      version: EDITORIAL_FIFTH_PASS_VERSION,
      updatedAt: EDITORIAL_FIFTH_PASS_DATE,
      deprecationReason: replacement.rationale,
    }
  }

  if (question.active === false || question.reviewStatus === 'needs-rewrite') return question

  const mapping = fifthPassMappingCorrectionsById[id]
  const wording = fifthPassWordingCorrectionsById[id]
  if (!mapping && !wording) return question

  return {
    ...question,
    ...(mapping ? { axisWeights: mapping.axisWeights.map((axisWeight) => ({ ...axisWeight })) } : {}),
    ...(wording ? { prompt: wording.prompt } : {}),
    reviewStatus: 'approved',
    version: EDITORIAL_FIFTH_PASS_VERSION,
    updatedAt: EDITORIAL_FIFTH_PASS_DATE,
  }
}
