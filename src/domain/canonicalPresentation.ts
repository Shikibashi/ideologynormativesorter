/**
 * Generated clean-runtime presentation projection.
 *
 * Source review pipeline: src/data/effectiveQuestions.ts
 * This artifact carries reviewed respondent-facing wording and layer context
 * into the canonical selector boundary without importing the legacy data tree.
 */

export const CANONICAL_PRESENTATION_VERSION = "2026-08-runtime-presentation-v1" as const;
export const CANONICAL_PRESENTATION_SOURCE = "src/data/effectiveQuestions.ts" as const;

export type CanonicalTheoryContext = "ideal" | "nonideal" | "mixed";

export interface CanonicalQuestionPresentation {
  readonly prompt: string;
  readonly theoryContext: CanonicalTheoryContext;
  readonly evidenceNote?: string;
  readonly confidencePrompt?: string;
  readonly priorityPrompt?: string;
}

export const CANONICAL_QUESTION_PRESENTATION: Readonly<
  Record<string, CanonicalQuestionPresentation>
> = Object.freeze({
  "q0001": {
    "id": "q0001",
    "prompt": "Do you agree that a political order is more legitimate when people can refuse its services without being treated as criminals?",
    "theoryContext": "ideal"
  },
  "q0003": {
    "id": "q0003",
    "prompt": "Do you agree that monopoly government is morally suspect even when it produces some useful public goods?",
    "theoryContext": "ideal"
  },
  "q0004": {
    "id": "q0004",
    "prompt": "Do you agree that emergency conditions do not by themselves create unlimited political authority?",
    "theoryContext": "nonideal"
  },
  "q0005": {
    "id": "q0005",
    "prompt": "Do you agree that when existing institutions are unjust, obedience deserves a weaker presumption than peaceful resistance?",
    "theoryContext": "nonideal"
  },
  "q0006": {
    "id": "q0006",
    "prompt": "Do you agree that political authority should be judged by consent and exit, not merely by elections or inherited borders?",
    "theoryContext": "mixed"
  },
  "q0007": {
    "id": "q0007",
    "prompt": "Do you agree that in U.S. metropolitan police-service comparisons, more autonomous service providers were not associated with lower efficiency and were sometimes associated with higher efficiency?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to U.S. metropolitan police-service comparisons summarized in Ostrom’s work: compare measured service output and efficiency across arrangements with more and fewer autonomous producers. The evidence does not imply that every service benefits from fragmentation, that autonomy is the same as privatization, or that the result is causal in every setting.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0012": {
    "id": "q0012",
    "prompt": "Do you agree that in documented common-pool and polycentric settings, durable cooperation has relied on predictable rules, monitoring, graduated sanctions, and accessible conflict resolution?",
    "theoryContext": "mixed",
    "evidenceNote": "Scope to documented common-pool and polycentric settings: compare whether predictable rules, monitoring, graduated sanctions, and accessible conflict resolution are present where cooperation persists. The evidence does not establish that every stable order can dispense with a sovereign or that polycentric governance always works.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0015": {
    "id": "q0015",
    "prompt": "Do you agree that reform authority should be distributed across independently accountable institutions rather than concentrated in one national body?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0016": {
    "id": "q0016",
    "prompt": "Do you agree that abolition of state functions should be sequenced around credible replacement institutions, not slogans?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0017": {
    "id": "q0017",
    "prompt": "Do you agree that civil-liberties safeguards should be enacted before an agency receives additional enforcement powers?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0018": {
    "id": "q0018",
    "prompt": "Do you agree that enforcement agencies should be divided among independently accountable bodies rather than placed under one executive authority?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0019": {
    "id": "q0019",
    "prompt": "Do you agree that a constitution can be morally valuable when it blocks rulers from treating residents as administrative property?",
    "theoryContext": "ideal"
  },
  "q0021": {
    "id": "q0021",
    "prompt": "Do you agree that people are entitled to the products of their labor more strongly than to privileges created by law or conquest?",
    "theoryContext": "ideal"
  },
  "q0022": {
    "id": "q0022",
    "prompt": "Do you agree that property claims lose moral force when they depend on exclusion without use, improvement, or consent?",
    "theoryContext": "ideal"
  },
  "q0023": {
    "id": "q0023",
    "prompt": "Do you agree that private ownership of productive assets is legitimate only when titles do not originate in conquest or legal privilege?",
    "theoryContext": "ideal"
  },
  "q0024": {
    "id": "q0024",
    "prompt": "Do you agree that correcting wealth created by legal privilege can be legitimate while ordinary personal possessions remain protected?",
    "theoryContext": "nonideal"
  },
  "q0025": {
    "id": "q0025",
    "prompt": "Do you agree that a property system should protect independence rather than making most people dependent on politically favored owners?",
    "theoryContext": "nonideal"
  },
  "q0026": {
    "id": "q0026",
    "prompt": "Do you agree that the legitimacy of property depends partly on whether others retain meaningful access to livelihood and exit?",
    "theoryContext": "mixed"
  },
  "q0027": {
    "id": "q0027",
    "prompt": "Do you agree that in documented land-tenure systems, clear rules for possession, transfer, and dispute resolution can reduce overlapping claims?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to land and resource-tenure systems: compare documented use, possession, transfer, and dispute-resolution rules with the incidence of overlapping claims and conflicts. Distribution of access or bargaining power is a separate institutional outcome; this item does not imply that clear rules are fair, universally effective, or equivalent to one title system.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0029": {
    "id": "q0029",
    "prompt": "Do you agree that large concentrations of ownership are easier to sustain when firms can convert political access into barriers against rivals?",
    "theoryContext": "nonideal",
    "evidenceNote": "General tendency across regulated markets: test whether political influence, licensing, exclusive rights, subsidies, or entry restrictions are associated with incumbent concentration after accounting for technology and scale.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0030": {
    "id": "q0030",
    "prompt": "Do you agree that in state-owned enterprises, public ownership changes the governance chain but does not by itself remove managerial hierarchy or accountability problems?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to state-owned enterprises: compare ownership, board autonomy, managerial hierarchy, disclosure, and accountability. Public ownership changes the principal and governance chain but does not by itself determine how much control political managers exercise or how well the enterprise performs.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0033": {
    "id": "q0033",
    "prompt": "Do you agree that an ideal property regime should distinguish personal possessions from ownership or control of productive assets?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to the distinction between personal possessions and ownership or control of productive resources. Property scholarship treats land, natural resources, means of production, and manufactured goods as potentially different objects of property rules; agreement here does not settle land taxation, redistribution, or the legitimacy of private property generally.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0034": {
    "id": "q0034",
    "prompt": "Do you agree that reform should target monopoly privilege, artificial scarcity, and title systems that block ordinary entry?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0035": {
    "id": "q0035",
    "prompt": "Do you agree that broad nationalization should not be treated as a cure for privilege unless governance incentives are solved first?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0036": {
    "id": "q0036",
    "prompt": "Do you agree that legal systems should make it easier for workers to form and govern worker-owned cooperatives?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to legal and institutional conditions for worker cooperatives. The ILO describes these as member-worker-owner enterprises with democratic governance; that does not make cooperatives, small firms, mutual-aid associations, and independent contracting interchangeable or imply that every business-form barrier should be removed.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0038": {
    "id": "q0038",
    "prompt": "Do you agree that policy should make ownership more contestable rather than merely moving control from private managers to public managers?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0039": {
    "id": "q0039",
    "prompt": "Do you agree that no property rule should be treated as sacred if it gives some people command over others without reciprocal obligation?",
    "theoryContext": "ideal"
  },
  "q0041": {
    "id": "q0041",
    "prompt": "Do you agree that adults should be free to trade peacefully even when the resulting pattern is not what planners would choose?",
    "theoryContext": "ideal"
  },
  "q0042": {
    "id": "q0042",
    "prompt": "Do you agree that economic planning is morally suspect when it treats people as instruments of a single collective blueprint?",
    "theoryContext": "ideal"
  },
  "q0043": {
    "id": "q0043",
    "prompt": "Do you agree that economic coordination should respect plural ends rather than forcing one official hierarchy of social goals?",
    "theoryContext": "ideal"
  },
  "q0044": {
    "id": "q0044",
    "prompt": "Do you agree that market outcomes deserve less deference when access to markets has been restricted by law or violence?",
    "theoryContext": "nonideal"
  },
  "q0045": {
    "id": "q0045",
    "prompt": "Do you agree that intervention is more legitimate when it removes privilege than when it substitutes officials' preferences for participants' choices?",
    "theoryContext": "nonideal"
  },
  "q0046": {
    "id": "q0046",
    "prompt": "Do you agree that the moral case for markets is strongest when entry, exit, and competition are real rather than nominal?",
    "theoryContext": "mixed"
  },
  "q0047": {
    "id": "q0047",
    "prompt": "Do you agree that in market exchanges, prices can transmit some dispersed information without any participant knowing the whole economy, although market power and externalities can limit that function?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to the information function of prices in market exchange. Prices can transmit some dispersed signals without centralized knowledge, but this does not resolve market power, externalities, missing markets, distributional conflict, or every coordination problem.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0048": {
    "id": "q0048",
    "prompt": "Do you agree that centralized planners may lack access to changing, local, or tacit information even when they are honest and technically competent?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to centralized planning and the availability of local, changing, or tacit information. The item concerns information access rather than planner motives or intelligence; it does not imply that markets solve every coordination problem or that planning never improves outcomes.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0050": {
    "id": "q0050",
    "prompt": "Do you agree that regulated firms can possess technical information that regulators need, creating an information asymmetry that can increase capture risk?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to information asymmetry in regulation: regulated firms can hold technical information regulators need, while independent verification and diverse stakeholder input can mitigate the resulting risk. The item does not establish that a particular agency has been captured.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0053": {
    "id": "q0053",
    "prompt": "Do you agree that an ideal economy would allow decentralized experimentation instead of one mandatory production plan?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0054": {
    "id": "q0054",
    "prompt": "Do you agree that competition policy should focus on removing barriers to entry before micromanaging prices or output?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0055": {
    "id": "q0055",
    "prompt": "Do you agree that where market failures are real, remedies should be narrow, transparent, and reversible?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0058": {
    "id": "q0058",
    "prompt": "Do you agree that when regulators are uncertain which business model will work, they should permit competing approaches unless a specific harm is demonstrated?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0059": {
    "id": "q0059",
    "prompt": "Do you agree that no one should have to justify every peaceful exchange to a political authority before acting?",
    "theoryContext": "ideal"
  },
  "q0061": {
    "id": "q0061",
    "prompt": "Do you agree that a society should not tolerate destitution when preventing it would require only modest sacrifices from others?",
    "theoryContext": "ideal"
  },
  "q0062": {
    "id": "q0062",
    "prompt": "Do you agree that material security matters because people without it are easier to dominate, not merely because they consume less?",
    "theoryContext": "ideal"
  },
  "q0063": {
    "id": "q0063",
    "prompt": "Do you agree that aid should preserve agency rather than making recipients prove moral worth to administrators?",
    "theoryContext": "ideal"
  },
  "q0064": {
    "id": "q0064",
    "prompt": "Do you agree that people harmed by state-created scarcity have stronger claims than people who merely lost ordinary market competition?",
    "theoryContext": "nonideal"
  },
  "q0065": {
    "id": "q0065",
    "prompt": "Do you agree that a welfare system becomes less legitimate when it conditions help on surveillance and humiliation?",
    "theoryContext": "nonideal"
  },
  "q0066": {
    "id": "q0066",
    "prompt": "Do you agree that the moral case for redistribution is stronger when the distribution being corrected was shaped by privilege?",
    "theoryContext": "mixed"
  },
  "q0067": {
    "id": "q0067",
    "prompt": "Do you agree that, in a U.S. SNAP study, later recertification interview assignments reduced successful recertification and subsequent participation among affected cases?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to the randomized interview-timing study of SNAP recertification cases in San Francisco. Later assigned interview dates reduced recertification and lowered SNAP participation in the following year for affected cases; many cases re-enrolled, so the item does not claim that every closure reflected ineligibility or that one administrative rule has the same effect elsewhere.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0073": {
    "id": "q0073",
    "prompt": "Do you agree that an ideal safety net would secure basic agency while minimizing paternalistic supervision?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0074": {
    "id": "q0074",
    "prompt": "Do you agree that cash assistance should be favored over programs that force recipients into narrow approved consumption categories?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0075": {
    "id": "q0075",
    "prompt": "Do you agree that before adding new tax-funded benefits, governments should remove legal barriers that make essential goods and services unnecessarily expensive?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0076": {
    "id": "q0076",
    "prompt": "Do you agree that benefit rules should be designed to avoid cliffs that punish additional earnings?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0077": {
    "id": "q0077",
    "prompt": "Do you agree that local experimentation in welfare design should be permitted when recipients can exit bad programs?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0079": {
    "id": "q0079",
    "prompt": "Do you agree that no person should be forced into dependence on a boss, spouse, agency, or party to avoid starvation?",
    "theoryContext": "ideal"
  },
  "q0081": {
    "id": "q0081",
    "prompt": "Do you agree that workers should be free to form organizations of their choice and bargain collectively without legal favoritism?",
    "theoryContext": "ideal"
  },
  "q0082": {
    "id": "q0082",
    "prompt": "Do you agree that employment contracts are legitimate only when exit is meaningful and background rules are not rigged for employers?",
    "theoryContext": "ideal"
  },
  "q0083": {
    "id": "q0083",
    "prompt": "Do you agree that a workplace is morally suspect when authority inside it is insulated from voice, exit, and competition?",
    "theoryContext": "ideal"
  },
  "q0084": {
    "id": "q0084",
    "prompt": "Do you agree that state-backed union privilege is not automatically justified by employer power?",
    "theoryContext": "nonideal"
  },
  "q0085": {
    "id": "q0085",
    "prompt": "Do you agree that legal barriers that restrict workers’ ability to enter or leave employment can be forms of labor-market coercion?",
    "theoryContext": "nonideal"
  },
  "q0089": {
    "id": "q0089",
    "prompt": "Do you agree that in the U.S. occupations studied, licensing increased wages for licensed workers while reducing employment, with effects varying by occupation and model?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to the U.S. occupations and policy margin studied by Kleiner and Soltas: licensing was associated with higher wages and lower employment, with estimated incidence on both workers and consumers. Other research finds consumer-safety effects in particular occupations, so this result is not a universal verdict on licensing.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0093": {
    "id": "q0093",
    "prompt": "Do you agree that an ideal labor regime would extend basic legal protection to workers regardless of whether they are classified as employees, independent contractors, or members of a worker cooperative?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to the ILO distinction among employees, self-employed workers, and workers in cooperatives: compare whether workers receive the protection due under the facts of the work relationship, including where contractual labels may disguise dependence. Equal baseline protection does not mean identical rules for every contract, equal bargaining power, or that unions and partnerships are employment-status categories.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0094": {
    "id": "q0094",
    "prompt": "Do you agree that occupational-licensing requirements should be reduced when they block entry into ordinary jobs?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0095": {
    "id": "q0095",
    "prompt": "Do you agree that public-sector union rules should be stricter than private voluntary association because public services are coercively funded?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0096": {
    "id": "q0096",
    "prompt": "Do you agree that workers should control benefit accounts that remain theirs when they change employers?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0097": {
    "id": "q0097",
    "prompt": "Do you agree that worker-cooperative law should be simplified without forcing all firms into one ownership model?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0098": {
    "id": "q0098",
    "prompt": "Do you agree that labor policy should increase exit options before relying on mandatory bargaining structures?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0099": {
    "id": "q0099",
    "prompt": "Do you agree that no one has a right to use the state to prevent peaceful competitors from offering their labor?",
    "theoryContext": "ideal"
  },
  "q0101": {
    "id": "q0101",
    "prompt": "Do you agree that no person created land, so exclusive claims to its unimproved value require special justification?",
    "theoryContext": "ideal"
  },
  "q0102": {
    "id": "q0102",
    "prompt": "Do you agree that people should be free to build housing on their property when they do not impose concrete harms on others?",
    "theoryContext": "ideal"
  },
  "q0104": {
    "id": "q0104",
    "prompt": "Do you agree that incumbent homeowners have weak moral claims to keep newcomers out to protect asset prices?",
    "theoryContext": "nonideal"
  },
  "q0105": {
    "id": "q0105",
    "prompt": "Do you agree that rent burdens caused by legal scarcity are a form of political extraction, not a neutral market fact?",
    "theoryContext": "nonideal"
  },
  "q0106": {
    "id": "q0106",
    "prompt": "Do you agree that the moral case for private landholding is strongest when land rents are not privately captured forever?",
    "theoryContext": "mixed"
  },
  "q0107": {
    "id": "q0107",
    "prompt": "Do you agree that in high-cost metropolitan housing markets, permitting additional construction can moderate price pressure when land-use rules constrain supply?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to high-cost metropolitan housing markets in which zoning or other land-use controls constrain new construction. The cited evidence links restrictive controls to higher housing costs, but it is suggestive rather than universal and does not by itself establish effects on displacement, segregation, or every kind of housing access.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0108": {
    "id": "q0108",
    "prompt": "Do you agree that in high-demand U.S. housing markets, zoning and other land-use controls can raise prices by restricting construction?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to high-demand U.S. housing markets: zoning and other land-use controls can restrict construction and contribute to higher prices. The item does not claim that every local rule has the same purpose, effect, or distributional consequence.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0114": {
    "id": "q0114",
    "prompt": "Do you agree that where housing supply is constrained, policy should remove barriers to apartments, accessory units, and mixed-use construction before broadly subsidizing demand?",
    "theoryContext": "nonideal",
    "evidenceNote": "This prescriptive item compares supply-side permitting reform with broad demand subsidies in constrained housing markets. Supply constraints can bind, while subsidies can have different effects by market, program design, income group, and construction response; it does not claim that targeted assistance is never appropriate or that permitting reform is sufficient by itself.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0115": {
    "id": "q0115",
    "prompt": "Do you agree that a land-value tax should replace worse taxes where assessment institutions can be made credible?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0116": {
    "id": "q0116",
    "prompt": "Do you agree that tenant protection should not freeze the housing stock or make newcomers bear the full cost of scarcity?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0117": {
    "id": "q0117",
    "prompt": "Do you agree that infrastructure finance should capture rising land values rather than taxing unrelated activity?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0119": {
    "id": "q0119",
    "prompt": "Do you agree that excluding people from a high-opportunity location requires more justification than preserving a neighborhood aesthetic?",
    "theoryContext": "ideal"
  },
  "q0121": {
    "id": "q0121",
    "prompt": "Do you agree that people should not be forced to use a politically privileged money when peaceful alternatives are available?",
    "theoryContext": "ideal"
  },
  "q0122": {
    "id": "q0122",
    "prompt": "Do you agree that monetary institutions should not secretly redistribute purchasing power through opaque privilege?",
    "theoryContext": "ideal"
  },
  "q0123": {
    "id": "q0123",
    "prompt": "Do you agree that saving, lending, and payment services should generally be open to new providers, subject to proportionate safeguards for capital, disclosure, consumer protection, and payment integrity?",
    "theoryContext": "ideal",
    "evidenceNote": "This normative item measures a presumption in favor of contestable entry, not a claim that all financial services need the same licensing regime. Proportionate rules may address capital, fit-and-proper standards, disclosure, complaints, fraud, AML/CFT, cyber resilience, settlement, and payment-system integrity; the appropriate design varies by activity and jurisdiction."
  },
  "q0124": {
    "id": "q0124",
    "prompt": "Do you agree that bailouts are least legitimate when losses are socialized after gains were privatized?",
    "theoryContext": "nonideal"
  },
  "q0125": {
    "id": "q0125",
    "prompt": "Do you agree that financial stability does not justify permanent favoritism toward incumbent banks?",
    "theoryContext": "nonideal"
  },
  "q0126": {
    "id": "q0126",
    "prompt": "Do you agree that the legitimacy of money depends on consent, transparency, and protection from political manipulation?",
    "theoryContext": "mixed"
  },
  "q0127": {
    "id": "q0127",
    "prompt": "Do you agree that competitive currencies can discipline issuers when users can switch at low cost?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to historical or contemporary private-note and digital-currency systems with redeemability and low switching costs; examine issuer entry, redemption, failures, runs, and price stability.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0128": {
    "id": "q0128",
    "prompt": "Do you agree that because households differ in asset ownership, borrowing constraints, income sources, and labor-market exposure, monetary policy can affect them unevenly in ways policymakers cannot fully target?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to household-level monetary-policy transmission: asset ownership, debt, borrowing constraints, income, and labor-market exposure can change the direction and size of effects. The item does not claim that monetary policy benefits only asset owners or that one distributional outcome is universal.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0130": {
    "id": "q0130",
    "prompt": "Do you agree that in financial-sector licensing and compliance, uniform requirements can burden smaller entrants more than established firms with dedicated compliance capacity?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to financial-sector licensing and compliance: uniform or institution-based requirements can impose disproportionate burdens on smaller entrants, while activity-based or proportionate approaches can alter that effect. The item does not imply that all regulation protects incumbents or that firm size alone determines compliance outcomes.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0133": {
    "id": "q0133",
    "prompt": "Do you agree that an ideal monetary order would allow competing monies, transparent reserves, and no privileged issuer?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0134": {
    "id": "q0134",
    "prompt": "Do you agree that payment innovation should not require discretionary permission from agencies aligned with incumbent banks?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0135": {
    "id": "q0135",
    "prompt": "Do you agree that bank-resolution rules should protect insured depositors while allocating losses to shareholders and unsecured or uninsured creditors before public funds?",
    "theoryContext": "nonideal",
    "evidenceNote": "This prescriptive item concerns bank resolution rather than ordinary bankruptcy or monetary policy. International standards distinguish shareholders, unsecured or uninsured creditors, insured depositors, and public solvency support; jurisdictions vary in the exact hierarchy and safeguards, so the item does not prescribe one national resolution procedure.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0136": {
    "id": "q0136",
    "prompt": "Do you agree that people should generally be free to hold and use private, foreign, or digital currencies, subject to rules addressing fraud, insolvency, consumer protection, and payment-system stability?",
    "theoryContext": "nonideal",
    "evidenceNote": "This prescriptive item concerns permission to hold or use alternative forms of money, not a claim that all currencies are interchangeable. Private and digital monies can expand payment choice but may create fraud, redemption, consumer-protection, run, and payment-fragmentation risks; foreign-currency use also depends on jurisdictional law and monetary conditions.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0137": {
    "id": "q0137",
    "prompt": "Do you agree that central-bank emergency powers should be narrow, disclosed, and automatically sunset?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0138": {
    "id": "q0138",
    "prompt": "Do you agree that financial regulation should target fraud and insolvency rather than protecting established intermediaries from competition?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0139": {
    "id": "q0139",
    "prompt": "Do you agree that a money monopoly is not morally neutral merely because it is administered by experts?",
    "theoryContext": "ideal"
  },
  "q0141": {
    "id": "q0141",
    "prompt": "Do you agree that copying information is not morally equivalent to taking a rival physical object?",
    "theoryContext": "ideal"
  },
  "q0142": {
    "id": "q0142",
    "prompt": "Do you agree that creators should ordinarily receive attribution, but legal control over downstream uses should be limited when it would unnecessarily restrict criticism, research, repair, or follow-on creation?",
    "theoryContext": "ideal",
    "evidenceNote": "This normative item concerns the moral and legal balance between attribution and downstream exclusion. Copyright systems distinguish economic rights, moral or attribution interests, licensing, and limitations or exceptions; the exact balance varies across jurisdictions and uses, so agreement is not a verdict on every copyright remedy."
  },
  "q0144": {
    "id": "q0144",
    "prompt": "Do you agree that using copyright to block repair, archiving, or interoperability is especially hard to justify?",
    "theoryContext": "nonideal"
  },
  "q0145": {
    "id": "q0145",
    "prompt": "Do you agree that patent claims are weaker when independent inventors would likely discover the same thing soon?",
    "theoryContext": "nonideal"
  },
  "q0146": {
    "id": "q0146",
    "prompt": "Do you agree that the strongest case for information control is fraud prevention, not artificial scarcity?",
    "theoryContext": "mixed"
  },
  "q0147": {
    "id": "q0147",
    "prompt": "Do you agree that in some digital markets, open and interoperable standards can reduce switching or integration barriers?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to digital-market interoperability research and policy analysis: compare whether open or interoperable standards lower switching or integration barriers and support diffusion in a defined market. The effects are conditional; standard-setting can impose maintenance costs or entrench technologies and gatekeepers when markets change quickly.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0148": {
    "id": "q0148",
    "prompt": "Do you agree that in patent-intensive sectors, portfolios can be used for cross-licensing and litigation leverage as well as for protecting inventions, potentially affecting entry and competition?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to patent-intensive sectors and distinguish commercialization, licensing, cross-licensing, litigation strategy, and defensive accumulation. The item does not claim that patents generally fail to disclose inventions or that one portfolio motive dominates across industries.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0153": {
    "id": "q0153",
    "prompt": "Do you agree that an ideal information regime would protect attribution and fraud remedies without broad copying monopolies?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0154": {
    "id": "q0154",
    "prompt": "Do you agree that patent policy should narrow patent exclusivity—through shorter terms, narrower claims, or broader exceptions—before expanding enforcement remedies?",
    "theoryContext": "nonideal",
    "evidenceNote": "This prescriptive item expresses a sequencing preference between reducing the breadth or duration of patent exclusivity and expanding enforcement remedies. Patent term, claim scope, exceptions, licensing, injunctions, and damages are distinct legal tools; national law and the applicable technology sector determine their effects.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0155": {
    "id": "q0155",
    "prompt": "Do you agree that copyright exceptions for repair, archiving, research, remix, and interoperability should be broad?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0156": {
    "id": "q0156",
    "prompt": "Do you agree that publicly funded research should be released under open-access terms by default?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0157": {
    "id": "q0157",
    "prompt": "Do you agree that anti-circumvention law should not override ordinary ownership of devices people bought?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0158": {
    "id": "q0158",
    "prompt": "Do you agree that information policy should favor interoperable, open protocols and licensing that preserves follow-on use over broad exclusionary enforcement?",
    "theoryContext": "mixed",
    "evidenceNote": "This prescriptive item compares interoperability and follow-on access with broad exclusionary enforcement. Open standards can require governance, compatibility, privacy, security, and liability choices, while licensing and infringement remedies concern rights over particular works or inventions; the item does not assume that openness automatically creates competition.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0159": {
    "id": "q0159",
    "prompt": "Do you agree that a society that criminalizes ordinary sharing has confused monopoly privilege with justice?",
    "theoryContext": "ideal"
  },
  "q0161": {
    "id": "q0161",
    "prompt": "Do you agree that rights are most important when the speaker, religion, association, or defendant is unpopular?",
    "theoryContext": "ideal"
  },
  "q0162": {
    "id": "q0162",
    "prompt": "Do you agree that the state should not decide which peaceful opinions are too dangerous for adults to hear?",
    "theoryContext": "ideal"
  },
  "q0163": {
    "id": "q0163",
    "prompt": "Do you agree that privacy is a precondition for dissent, experimentation, and minority life?",
    "theoryContext": "ideal"
  },
  "q0164": {
    "id": "q0164",
    "prompt": "Do you agree that fear of bad ideas does not justify giving officials a general censorship power?",
    "theoryContext": "nonideal"
  },
  "q0165": {
    "id": "q0165",
    "prompt": "Do you agree that due process should protect guilty and innocent people alike?",
    "theoryContext": "nonideal"
  },
  "q0166": {
    "id": "q0166",
    "prompt": "Do you agree that civil liberty should be treated as a constraint on politics, not as a benefit granted by current majorities?",
    "theoryContext": "mixed"
  },
  "q0171": {
    "id": "q0171",
    "prompt": "Do you agree that emergency-law frameworks use sunset clauses, renewal limits, and periodic review because exceptional powers can persist beyond the conditions that prompted them?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to institutional safeguards for exceptional powers: sunset clauses, renewal limits, and periodic review are used because emergency measures can persist after their original justification changes. The item does not claim that every crisis law outlasts its trigger or that all emergency powers are illegitimate.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0173": {
    "id": "q0173",
    "prompt": "Do you agree that an ideal rights regime would protect core civil liberties by default, requiring any restriction on expression, association, religion, encryption, or due process to satisfy a specific, publicly justified legal test?",
    "theoryContext": "ideal",
    "evidenceNote": "Read this as a normative standard for default protection and publicly justified limits, not as a claim that expression, association, religion, encryption, and due process have identical legal rules. The ICCPR recognizes several civil and political rights and lawful limitation or emergency frameworks; encryption is a technical protection whose security properties and policy limits require separate analysis.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0174": {
    "id": "q0174",
    "prompt": "Do you agree that restrictions on speech should require direct connection to fraud, threat, harassment, or specific rights violation?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0175": {
    "id": "q0175",
    "prompt": "Do you agree that surveillance powers should require adversarial warrants and meaningful notice after secrecy expires?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0176": {
    "id": "q0176",
    "prompt": "Do you agree that emergency limits on assembly or movement should sunset automatically unless reauthorized under strict review?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0177": {
    "id": "q0177",
    "prompt": "Do you agree that platforms should disclose state requests to remove or suppress lawful speech?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0178": {
    "id": "q0178",
    "prompt": "Do you agree that emergency surveillance powers should face the same judicial review regardless of which party controls government?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0179": {
    "id": "q0179",
    "prompt": "Do you agree that the right to be wrong is part of political equality?",
    "theoryContext": "ideal"
  },
  "q0181": {
    "id": "q0181",
    "prompt": "Do you agree that punishment should require more justification than restitution, restraint, or repair?",
    "theoryContext": "ideal"
  },
  "q0182": {
    "id": "q0182",
    "prompt": "Do you agree that a person does not forfeit all rights because they are accused or convicted of a crime?",
    "theoryContext": "ideal"
  },
  "q0183": {
    "id": "q0183",
    "prompt": "Do you agree that victims deserve repair, not merely symbolic suffering imposed on offenders?",
    "theoryContext": "ideal"
  },
  "q0184": {
    "id": "q0184",
    "prompt": "Do you agree that laws that create victimless crimes are morally weaker than laws against force and fraud?",
    "theoryContext": "nonideal"
  },
  "q0185": {
    "id": "q0185",
    "prompt": "Do you agree that state violence deserves stricter scrutiny because its victims cannot legally opt out?",
    "theoryContext": "nonideal"
  },
  "q0186": {
    "id": "q0186",
    "prompt": "Do you agree that public safety does not justify unlimited discretion for police, prosecutors, or prison officials?",
    "theoryContext": "mixed"
  },
  "q0188": {
    "id": "q0188",
    "prompt": "Do you agree that law-enforcement agencies can improve apparent performance by emphasizing countable activity measures over outcomes such as safety, trust, and perceived legitimacy?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to law-enforcement performance measurement: distinguish activity measures such as arrests, response times, and budgets from outcomes such as safety, perceived safety, trust, and satisfaction. The item does not say that activity measures are useless or that every agency gives them priority.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0190": {
    "id": "q0190",
    "prompt": "Do you agree that when law-enforcement agencies can receive or spend forfeiture proceeds, the funding structure creates a potential resource incentive around seizures?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to forfeiture systems with agency access to proceeds or equitable-sharing payments. The funding structure creates a potential resource incentive around seizures; this does not establish improper motive in a particular case or imply that all forfeiture is revenue-seeking.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0191": {
    "id": "q0191",
    "prompt": "Do you agree that in plea-bargaining systems, the prospect of a substantially harsher outcome after trial can pressure some defendants—including some who maintain innocence—to accept a plea, although the size and direction of the effect vary by case and are difficult to estimate?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to empirical plea-bargaining research: experimental and observational studies identify cases in which defendants who maintain innocence accept pleas or in which plea/trial selection is associated with miscarriage-of-justice concerns, while other work finds innocent defendants can reject offers attractive to similarly situated guilty defendants. Factual innocence and counterfactual trial outcomes are difficult to observe, and the strongest real-case estimates are jurisdiction-specific; this is not a claim about a universal coercion rate.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0193": {
    "id": "q0193",
    "prompt": "Do you agree that an ideal justice system should use incapacitation only when necessary to prevent serious harm?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to the use of incapacitation as a preventive restriction on liberty. The item does not deny restitution, rehabilitation, deterrence, or other justice aims; it asks whether incapacitation requires a necessity condition tied to preventing serious harm rather than administrative convenience or retribution alone.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0195": {
    "id": "q0195",
    "prompt": "Do you agree that qualified immunity and similar shields should be narrowed when officials violate clear rights?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0197": {
    "id": "q0197",
    "prompt": "Do you agree that pretrial detention should be limited to specific flight or danger findings, not inability to pay?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0198": {
    "id": "q0198",
    "prompt": "Do you agree that justice reform should reduce official discretion where oversight is weak?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0199": {
    "id": "q0199",
    "prompt": "Do you agree that a justice system that cannot admit its own errors is not morally entitled to irreversible punishments?",
    "theoryContext": "ideal"
  },
  "q0201": {
    "id": "q0201",
    "prompt": "Do you agree that birthplace is a morally arbitrary basis for excluding peaceful people from work, housing, and association?",
    "theoryContext": "ideal"
  },
  "q0202": {
    "id": "q0202",
    "prompt": "Do you agree that states should not restrict peaceful adults from crossing borders solely to improve their lives?",
    "theoryContext": "ideal"
  },
  "q0203": {
    "id": "q0203",
    "prompt": "Do you agree that citizenship should not operate as hereditary ownership of opportunity?",
    "theoryContext": "ideal"
  },
  "q0204": {
    "id": "q0204",
    "prompt": "Do you agree that natives do not have a permanent veto over newcomers merely because they arrived earlier?",
    "theoryContext": "nonideal"
  },
  "q0205": {
    "id": "q0205",
    "prompt": "Do you agree that border enforcement is harder to justify when it traps people under violence or extreme poverty?",
    "theoryContext": "nonideal"
  },
  "q0206": {
    "id": "q0206",
    "prompt": "Do you agree that a political community may preserve institutions, but not by treating outsiders as rightless threats?",
    "theoryContext": "mixed"
  },
  "q0207": {
    "id": "q0207",
    "prompt": "Do you agree that in randomized intergroup-contact studies with outcomes measured at least one day later, most comparisons reported lower measured prejudice, but effect sizes varied by target group and evidence for durable reductions in adults’ racial or ethnic prejudice was limited?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to the 27 randomized intergroup-contact experiments in the review with outcomes measured at least one day after the intervention began: most comparisons reported positive effects, but effects varied significantly by target group, larger studies tended to show weaker effects, and the evidence did not include interracial contact effects on adults over 25. This is evidence about a defined, policy-relevant research subset, not a guarantee that contact will reduce prejudice in every setting.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0208": {
    "id": "q0208",
    "prompt": "Do you agree that in U.S. industry data, migration barriers were lower where business lobbies spent more and higher where labor unions were more influential?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to U.S. industry-level immigration and H-1B data linked to immigration-lobbying expenditures: compare migration barriers across sectors while distinguishing business and labor-group influence; the study reports associations and model-based inferences, not a universal rule.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0213": {
    "id": "q0213",
    "prompt": "Do you agree that an ideal order would allow peaceful migration without treating national borders as ownership claims?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0214": {
    "id": "q0214",
    "prompt": "Do you agree that work authorization should be broad and quick even when citizenship rules remain stricter?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0215": {
    "id": "q0215",
    "prompt": "Do you agree that lawful immigration pathways should expand even when housing and labor markets need time to adjust?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0216": {
    "id": "q0216",
    "prompt": "Do you agree that asylum systems should be simplified so legal status does not depend on years of administrative limbo?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0217": {
    "id": "q0217",
    "prompt": "Do you agree that interior immigration enforcement should prioritize serious violence and fraud over otherwise nonviolent violations of immigration status or work authorization, with due process protections?",
    "theoryContext": "nonideal",
    "evidenceNote": "This prescriptive item concerns priority-setting within interior immigration enforcement, not a claim that status violations are harmless or that every fraud case is equally serious. Immigration agencies distinguish civil removal authority from criminal enforcement and state that enforcement remains subject to lawful orders and due process; the item leaves the precise priority categories and implementation to the jurisdiction.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0219": {
    "id": "q0219",
    "prompt": "Do you agree that a person's right to sell labor should not disappear at a line drawn by states?",
    "theoryContext": "ideal"
  },
  "q0221": {
    "id": "q0221",
    "prompt": "Do you agree that national identity is legitimate as voluntary belonging, not as a claim to rule dissenters or exclude outsiders?",
    "theoryContext": "ideal"
  },
  "q0222": {
    "id": "q0222",
    "prompt": "Do you agree that civic membership should be open to people who accept equal legal status, not restricted by blood or ancestry?",
    "theoryContext": "ideal"
  },
  "q0223": {
    "id": "q0223",
    "prompt": "Do you agree that local self-government is valuable because it protects exit and pluralism, not because every local majority is just?",
    "theoryContext": "ideal"
  },
  "q0224": {
    "id": "q0224",
    "prompt": "Do you agree that sovereignty is least defensible when used to protect rulers from criticism by their own subjects?",
    "theoryContext": "nonideal"
  },
  "q0225": {
    "id": "q0225",
    "prompt": "Do you agree that cultural continuity does not justify coercive assimilation of peaceful minorities?",
    "theoryContext": "nonideal"
  },
  "q0226": {
    "id": "q0226",
    "prompt": "Do you agree that a nation may be a community of memory without being a moral owner of persons inside its borders?",
    "theoryContext": "mixed"
  },
  "q0227": {
    "id": "q0227",
    "prompt": "Do you agree that in paired studies of Indian cities, stronger interethnic civic associations were associated with less communal violence than mainly intraethnic networks?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to paired-city studies of Hindu-Muslim violence in India: distinguish interethnic civic associations from associations organized mainly within one community and compare their relationship with episodes of communal violence; the cases do not establish a universal city-level law.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0233": {
    "id": "q0233",
    "prompt": "Do you agree that an ideal order would allow layered identities: local, regional, national, and cosmopolitan?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0234": {
    "id": "q0234",
    "prompt": "Do you agree that secession should be judged by exit rights and minority protections, not only by majority sentiment?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0235": {
    "id": "q0235",
    "prompt": "Do you agree that sovereignty claims should not override basic civil liberties or peaceful migration?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0236": {
    "id": "q0236",
    "prompt": "Do you agree that decentralization should include safeguards against local caste, ethnic, or religious domination?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0239": {
    "id": "q0239",
    "prompt": "Do you agree that love of place is not a license to coercively freeze culture?",
    "theoryContext": "ideal"
  },
  "q0241": {
    "id": "q0241",
    "prompt": "Do you agree that religious conviction deserves protection, but not political supremacy over nonbelievers or dissenters?",
    "theoryContext": "ideal"
  },
  "q0242": {
    "id": "q0242",
    "prompt": "Do you agree that coercive civil laws should be justifiable to citizens without requiring them to accept one religious authority?",
    "theoryContext": "ideal"
  },
  "q0243": {
    "id": "q0243",
    "prompt": "Do you agree that voluntary religious communities should be free to set internal norms when exit is real?",
    "theoryContext": "ideal"
  },
  "q0244": {
    "id": "q0244",
    "prompt": "Do you agree that blasphemy, apostasy, and heresy should not be civil crimes?",
    "theoryContext": "nonideal"
  },
  "q0245": {
    "id": "q0245",
    "prompt": "Do you agree that state favoritism toward a religion is unjust even when that religion is culturally dominant?",
    "theoryContext": "nonideal"
  },
  "q0246": {
    "id": "q0246",
    "prompt": "Do you agree that freedom of religion includes freedom from religion-backed law?",
    "theoryContext": "mixed"
  },
  "q0248": {
    "id": "q0248",
    "prompt": "Do you agree that in countries with an official or preferred religion, governments are more likely to restrict other religious groups than in countries without one?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to Pew Research Center’s coding of 199 countries and territories and its Government Restrictions Index comparisons. The analysis reports higher median restrictions and more frequent interference or bans in countries with official or preferred religions, while the category includes ceremonial, preferential, restrictive, and hostile arrangements that must not be treated as identical.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0253": {
    "id": "q0253",
    "prompt": "Do you agree that an ideal legal regime would protect religious exercise and nonreligious dissent under the same civil liberty principle?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0254": {
    "id": "q0254",
    "prompt": "Do you agree that religious exemptions should protect peaceful practice without allowing coercion of third parties?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0255": {
    "id": "q0255",
    "prompt": "Do you agree that the state should not fund or enforce religious doctrine through education, family law, or speech restrictions?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0256": {
    "id": "q0256",
    "prompt": "Do you agree that faith-based organizations receiving public funds should not gain privileges unavailable to secular associations?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0257": {
    "id": "q0257",
    "prompt": "Do you agree that religious arbitration should be enforceable only when participation and exit are genuinely voluntary?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0258": {
    "id": "q0258",
    "prompt": "Do you agree that secular public institutions should limit state power over conscience rather than impose an official state doctrine?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0259": {
    "id": "q0259",
    "prompt": "Do you agree that conscience cannot be delegated to a legislature, priesthood, or expert committee?",
    "theoryContext": "ideal"
  },
  "q0261": {
    "id": "q0261",
    "prompt": "Do you agree that adults should be free to choose household forms that do not rely on coercion or fraud?",
    "theoryContext": "ideal"
  },
  "q0262": {
    "id": "q0262",
    "prompt": "Do you agree that gender norms are least legitimate when enforced by law rather than persuasion and association?",
    "theoryContext": "ideal"
  },
  "q0263": {
    "id": "q0263",
    "prompt": "Do you agree that care work deserves social respect even when it is unpaid, informal, or outside market employment?",
    "theoryContext": "ideal"
  },
  "q0264": {
    "id": "q0264",
    "prompt": "Do you agree that formal consent inside families is not enough when exit is blocked by law, violence, or economic dependency?",
    "theoryContext": "nonideal"
  },
  "q0265": {
    "id": "q0265",
    "prompt": "Do you agree that the state should not enforce a single model of masculinity, femininity, marriage, or parenthood?",
    "theoryContext": "nonideal"
  },
  "q0266": {
    "id": "q0266",
    "prompt": "Do you agree that family policy should protect children and dependents without making peaceful adult difference illegal?",
    "theoryContext": "mixed"
  },
  "q0269": {
    "id": "q0269",
    "prompt": "Do you agree that complex tax-transfer classifications can make eligibility and net benefits difficult for similarly situated households to predict?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to tax-transfer and benefit rules that classify households by marriage, children, cohabitation, or other characteristics. The item asks about different eligibility and net-transfer outcomes, not whether one household form is universally privileged or another is literally invisible.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0274": {
    "id": "q0274",
    "prompt": "Do you agree that family policy should expand adults’ ability to exit unwanted legal or economic dependency?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0275": {
    "id": "q0275",
    "prompt": "Do you agree that child welfare intervention should target concrete abuse or neglect, not mere deviation from dominant culture?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0276": {
    "id": "q0276",
    "prompt": "Do you agree that caregiver support should avoid locking people into dependency on either employers or spouses?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0278": {
    "id": "q0278",
    "prompt": "Do you agree that policy should expand real options rather than prescribing whether liberation means market work, domestic work, or communal care?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0279": {
    "id": "q0279",
    "prompt": "Do you agree that a role chosen freely is different from the same role imposed by law or economic captivity?",
    "theoryContext": "ideal"
  },
  "q0281": {
    "id": "q0281",
    "prompt": "Do you agree that inherited group status should not determine legal standing, political rights, or access to opportunity?",
    "theoryContext": "ideal"
  },
  "q0282": {
    "id": "q0282",
    "prompt": "Do you agree that a just society would not require cultural uniformity as the price of equal citizenship?",
    "theoryContext": "ideal"
  },
  "q0283": {
    "id": "q0283",
    "prompt": "Do you agree that anti-domination matters more than symbolic diversity alone?",
    "theoryContext": "ideal"
  },
  "q0284": {
    "id": "q0284",
    "prompt": "Do you agree that historical injustice can create present claims even when no current individual chose the original wrong?",
    "theoryContext": "nonideal"
  },
  "q0285": {
    "id": "q0285",
    "prompt": "Do you agree that collective guilt is a poor substitute for identifying institutions that still restrict people?",
    "theoryContext": "nonideal"
  },
  "q0293": {
    "id": "q0293",
    "prompt": "Do you agree that an ideal legal order would combine equal individual rights with freedom for voluntary cultural association?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0294": {
    "id": "q0294",
    "prompt": "Do you agree that reform should remove institutional barriers that create group disparities before relying on permanent administrative sorting?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0295": {
    "id": "q0295",
    "prompt": "Do you agree that anti-discrimination enforcement should focus on conduct and barriers, not compelled ideological rituals?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0296": {
    "id": "q0296",
    "prompt": "Do you agree that school and housing reform should attack exclusionary boundaries that reproduce inherited advantage?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0299": {
    "id": "q0299",
    "prompt": "Do you agree that no ancestry group has a natural right to rule, exclude, or be ruled?",
    "theoryContext": "ideal"
  },
  "q0301": {
    "id": "q0301",
    "prompt": "Do you agree that future nonhuman life has moral standing even when protecting it does not benefit humans now?",
    "theoryContext": "ideal"
  },
  "q0302": {
    "id": "q0302",
    "prompt": "Do you agree that nonhuman life deserves more than whatever price current owners can extract from it?",
    "theoryContext": "ideal"
  },
  "q0303": {
    "id": "q0303",
    "prompt": "Do you agree that the natural world has moral standing even when protecting it would reduce long-run human prosperity?",
    "theoryContext": "ideal"
  },
  "q0304": {
    "id": "q0304",
    "prompt": "Do you agree that polluters should not be allowed to impose diffuse harms merely because victims are hard to organize?",
    "theoryContext": "nonideal"
  },
  "q0305": {
    "id": "q0305",
    "prompt": "Do you agree that environmental policy loses legitimacy when it protects incumbent firms rather than ecological goods?",
    "theoryContext": "nonideal"
  },
  "q0307": {
    "id": "q0307",
    "prompt": "Do you agree that under CERCLA/Superfund, identifying a liable party can trigger a cleanup obligation or recovery of cleanup costs?",
    "theoryContext": "ideal",
    "evidenceNote": "Scope to U.S. CERCLA/Superfund: hazardous-substance presence, release or possible release, response costs, and a liable potentially responsible party can trigger cleanup costs, damages, or injunctive relief. This item describes a legal enforcement mechanism; it does not estimate pollution reduction or generalize to every liability regime.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0308": {
    "id": "q0308",
    "prompt": "Do you agree that environmental regulations can alter competitive conditions when compliance costs vary by establishment or firm size?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to a named command-and-control environmental rule and compare compliance costs by firm size, industry, and facility. Research finds that incidence can run in different directions across rules and sectors; the item does not claim that regulation generally favors incumbents, burdens small firms, or produces one fixed entry or concentration outcome.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0313": {
    "id": "q0313",
    "prompt": "Do you agree that an ideal environmental order would internalize harms without giving planners open-ended control over all production?",
    "theoryContext": "ideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0314": {
    "id": "q0314",
    "prompt": "Do you agree that climate policy should reduce legal barriers to deploying low-carbon technologies and infrastructure?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0315": {
    "id": "q0315",
    "prompt": "Do you agree that pollution rules should be technology-neutral unless a specific technology creates unique risks?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0316": {
    "id": "q0316",
    "prompt": "Do you agree that conservation policy should compensate genuine stewardship and punish demonstrated harm, not merely signal virtue?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0317": {
    "id": "q0317",
    "prompt": "Do you agree that environmental subsidies should include sunset clauses and anti-capture review?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0318": {
    "id": "q0318",
    "prompt": "Do you agree that climate policy should prioritize reducing carbon and material intensity through technology and efficiency rather than broad consumption limits?",
    "theoryContext": "mixed",
    "evidenceNote": "This prescriptive item compares technology-and-efficiency strategies with broad consumption limits. Carbon intensity, energy intensity, material intensity, GDP growth, and absolute emissions are different measures; IPCC evidence finds decoupling varies by place and period and is not by itself sufficient for climate stabilization.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0319": {
    "id": "q0319",
    "prompt": "Do you agree that a clean environment is not a luxury good reserved for those who can buy distance from pollution?",
    "theoryContext": "ideal"
  },
  "q0321": {
    "id": "q0321",
    "prompt": "Do you agree that political borders do not make foreign civilians morally less important than domestic civilians?",
    "theoryContext": "ideal"
  },
  "q0322": {
    "id": "q0322",
    "prompt": "Do you agree that a state has no right to use its population as instruments of prestige, empire, or ideological crusade?",
    "theoryContext": "ideal"
  },
  "q0323": {
    "id": "q0323",
    "prompt": "Do you agree that defensive force is easier to justify than projects of regime transformation abroad?",
    "theoryContext": "ideal"
  },
  "q0324": {
    "id": "q0324",
    "prompt": "Do you agree that war powers should be distrusted most when officials claim urgency prevents scrutiny?",
    "theoryContext": "nonideal"
  },
  "q0325": {
    "id": "q0325",
    "prompt": "Do you agree that conscription is forced labor even when the cause is popular?",
    "theoryContext": "nonideal"
  },
  "q0326": {
    "id": "q0326",
    "prompt": "Do you agree that solidarity with oppressed people abroad does not automatically justify military control over them?",
    "theoryContext": "mixed"
  },
  "q0328": {
    "id": "q0328",
    "prompt": "Do you agree that in the Afghanistan reconstruction, outside planners often struggled to adapt projects to local political and institutional conditions?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to the Afghanistan reconstruction lessons reviewed by SIGAR and USIP. The record emphasizes local knowledge and buy-in as conditions for development success; this item does not claim that every project failed, that local knowledge has one institutional form, or that the case determines all intervention outcomes.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0329": {
    "id": "q0329",
    "prompt": "Do you agree that in U.S. federal procurement data, defense contractors that lobbied received larger contract awards than contractors that did not lobby?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to U.S. federal defense contracts around the spending increase after September 11: compare lobbying and other political connections with contract amounts while preserving the study’s warning that its data do not identify a causal link.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0334": {
    "id": "q0334",
    "prompt": "Do you agree that military intervention should require clear defensive purpose, exit criteria, and public cost accounting?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0336": {
    "id": "q0336",
    "prompt": "Do you agree that war powers should require legislative authorization with narrow scope and automatic expiration?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0337": {
    "id": "q0337",
    "prompt": "Do you agree that arms transfers should be scrutinized for blowback, civilian harm, and entrenchment of client regimes?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0338": {
    "id": "q0338",
    "prompt": "Do you agree that when officials lack reliable local knowledge about another country, government should avoid military intervention?",
    "theoryContext": "mixed",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0339": {
    "id": "q0339",
    "prompt": "Do you agree that no government earns moral credit for spreading freedom by denying freedom to its own conscripts and taxpayers?",
    "theoryContext": "ideal"
  },
  "q0341": {
    "id": "q0341",
    "prompt": "Do you agree that democracy is legitimate only within limits that protect dissenters, minorities, and exit rights?",
    "theoryContext": "ideal"
  },
  "q0342": {
    "id": "q0342",
    "prompt": "Do you agree that expert knowledge should inform policy without replacing the need for consent and accountability?",
    "theoryContext": "ideal"
  },
  "q0343": {
    "id": "q0343",
    "prompt": "Do you agree that constitutions matter because some rights should not depend on daily political moods?",
    "theoryContext": "ideal"
  },
  "q0344": {
    "id": "q0344",
    "prompt": "Do you agree that majority rule is not morally sufficient when it leaves minorities or outsiders subject to unchecked power?",
    "theoryContext": "nonideal"
  },
  "q0345": {
    "id": "q0345",
    "prompt": "Do you agree that technocratic authority is less legitimate when affected people cannot challenge assumptions or leave?",
    "theoryContext": "nonideal"
  },
  "q0347": {
    "id": "q0347",
    "prompt": "Do you agree that across a meta-analysis of 100 studies in established democracies, participating in deliberative mini-publics increased participants' political knowledge on average?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to a meta-analysis of 100 quantitative studies published from 1980 through 2020 in established democracies: compare participants before and after a deliberative mini-public or with a control group; the clearest average capability effect was increased political knowledge, not proof that every deliberative design or resulting decision is sound.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0348": {
    "id": "q0348",
    "prompt": "Do you agree that in low-salience elections or policy domains, information acquisition can be limited by the small expected effect of an individual vote and by issue salience?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to low-salience elections or policy domains: information acquisition can vary with issue salience, electoral institutions, media exposure, and the expected effect of an individual vote. The item does not claim that voters are generally uninformed or that expertise should replace democratic judgment.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0350": {
    "id": "q0350",
    "prompt": "Do you agree that in documented democratic backsliding episodes, governing actors have sometimes weakened constitutional constraints through flexible interpretation by courts, parties, or agencies?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to identified backsliding episodes: code formal and informal weakening of courts, legislatures, election bodies, term limits, media protections, and other checks by actors controlling government.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0354": {
    "id": "q0354",
    "prompt": "Do you agree that expert agencies should give affected people transparent reasons for consequential decisions and a meaningful way to appeal them?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to procedural accountability for consequential agency decisions. Transparency, reasons, and appeal are distinct safeguards that can be implemented in different ways; sunset review and competitive alternatives remain separate institutional choices and are not implied by agreement with this item.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0355": {
    "id": "q0355",
    "prompt": "Do you agree that referendum proposals should be reviewable for compatibility with fundamental rights before the vote?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to pre-vote review of referendum proposals for compatibility with fundamental rights. Fiscal notes, question clarity, campaign fairness, and rules against targeting minorities are related but distinct safeguards; agreement with this item does not specify one review body or imply that fiscal analysis is unnecessary.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0356": {
    "id": "q0356",
    "prompt": "Do you agree that independent courts should protect civil liberties more than administrative discretion?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0357": {
    "id": "q0357",
    "prompt": "Do you agree that national rights protections should limit local experimentation when the two conflict?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0359": {
    "id": "q0359",
    "prompt": "Do you agree that being outvoted does not by itself create a moral obligation to obey?",
    "theoryContext": "ideal"
  },
  "q0361": {
    "id": "q0361",
    "prompt": "Do you agree that a person should be able to communicate privately without proving innocence first?",
    "theoryContext": "ideal"
  },
  "q0362": {
    "id": "q0362",
    "prompt": "Do you agree that human enhancement is legitimate when chosen by informed adults without coercive hierarchy?",
    "theoryContext": "ideal"
  },
  "q0363": {
    "id": "q0363",
    "prompt": "Do you agree that technological progress should expand agency rather than make people legible to managers and police?",
    "theoryContext": "ideal"
  },
  "q0364": {
    "id": "q0364",
    "prompt": "Do you agree that safety claims should not become a blank check for surveillance infrastructure?",
    "theoryContext": "nonideal"
  },
  "q0365": {
    "id": "q0365",
    "prompt": "Do you agree that algorithmic decisions affecting rights should be contestable by the people subject to them?",
    "theoryContext": "nonideal"
  },
  "q0368": {
    "id": "q0368",
    "prompt": "Do you agree that in GAO’s review of DHS law-enforcement technologies, agencies reported using many detection, observation, and monitoring tools in public spaces, while technology policies did not always address key privacy protections?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to GAO-25-107302’s review of selected DHS law-enforcement agencies and technologies in fiscal year 2023. The report found agencies used more than 20 types of detection, observation, and monitoring technologies in public spaces and that reviewed policies did not always address collection, purpose specification, sharing, security, retention, and accountability protections.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0374": {
    "id": "q0374",
    "prompt": "Do you agree that AI safety rules should target demonstrable harms without criminalizing small-scale open research?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0375": {
    "id": "q0375",
    "prompt": "Do you agree that government access to private data should require case-specific authorization under clear legal rules?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to the legal authorization of government access to private data. UN Human Rights Committee guidance treats privacy interference as requiring a lawful basis, defined circumstances, designated authorization, case-by-case control, and avenues for complaint; the item does not claim that every jurisdiction must use a U.S.-style warrant or that authorization alone guarantees proportionality.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0376": {
    "id": "q0376",
    "prompt": "Do you agree that people affected by a consequential public algorithm should be able to inspect an audit of its use and challenge the resulting decision?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope to contestability when a public algorithm contributes to a consequential decision. Audit access and appeal rights are related but distinct safeguards, and their design depends on the decision context, legal authority, confidentiality, and error costs; agreement does not imply one universal algorithmic procedure.",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0377": {
    "id": "q0377",
    "prompt": "Do you agree that interoperability mandates are preferable to treating platform concentration as permanent and regulating around it forever?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0379": {
    "id": "q0379",
    "prompt": "Do you agree that powerful technologies should increase ordinary people’s control over their lives rather than institutions’ control over them?",
    "theoryContext": "ideal"
  },
  "q0381": {
    "id": "q0381",
    "prompt": "Do you agree that the justice of an end does not automatically justify every means used to pursue it?",
    "theoryContext": "ideal"
  },
  "q0382": {
    "id": "q0382",
    "prompt": "Do you agree that people may build alternative institutions without waiting for permission from existing authorities?",
    "theoryContext": "ideal"
  },
  "q0383": {
    "id": "q0383",
    "prompt": "Do you agree that a reform strategy should respect the agency of the people it claims to liberate?",
    "theoryContext": "ideal"
  },
  "q0384": {
    "id": "q0384",
    "prompt": "Do you agree that civil disobedience is easier to justify when legal channels systematically exclude the affected people?",
    "theoryContext": "nonideal"
  },
  "q0385": {
    "id": "q0385",
    "prompt": "Do you agree that revolutionary coercion is not purified by being directed at an unjust regime?",
    "theoryContext": "nonideal"
  },
  "q0394": {
    "id": "q0394",
    "prompt": "Do you agree that movements should build exit options and mutual aid before relying on a single moment of political capture?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0396": {
    "id": "q0396",
    "prompt": "Do you agree that revolutionary strategy should be rejected when it predictably produces a less accountable ruling class?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0397": {
    "id": "q0397",
    "prompt": "Do you agree that reforms should be designed to create constituencies for further liberalization, not permanent dependency on administrators?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0399": {
    "id": "q0399",
    "prompt": "Do you agree that a free society cannot be built entirely through habits of command?",
    "theoryContext": "ideal"
  },
  "q0401": {
    "id": "q0401",
    "prompt": "Do you agree that the threat or use of military force against another society should require justification as strong as the use of force against one's own citizens?",
    "theoryContext": "ideal"
  },
  "q0402": {
    "id": "q0402",
    "prompt": "Do you agree that a country may legitimately use force in anticipatory self-defense when an armed attack is sufficiently imminent?",
    "theoryContext": "nonideal",
    "evidenceNote": "This normative item distinguishes anticipatory self-defense against a sufficiently imminent attack from preventive war against a threat that may arise in the future. Article 51 refers to self-defense if an armed attack occurs, while international-law sources debate the scope of anticipatory action; legality, necessity, proportionality, and moral legitimacy are related but separate judgments."
  },
  "q0403": {
    "id": "q0403",
    "prompt": "Do you agree that national greatness is partly measured by willingness to project military power abroad?",
    "theoryContext": "mixed"
  },
  "q0404": {
    "id": "q0404",
    "prompt": "Do you agree that government ceremonies, public schools, and official holidays should be framed in terms that do not assume any particular religion?",
    "theoryContext": "ideal"
  },
  "q0405": {
    "id": "q0405",
    "prompt": "Do you agree that religious tradition may legitimately inform public law even when some citizens do not share it?",
    "theoryContext": "nonideal"
  },
  "q0406": {
    "id": "q0406",
    "prompt": "Do you agree that no religious institution should have final legal authority over citizens who do not accept its doctrines?",
    "theoryContext": "mixed"
  },
  "q0407": {
    "id": "q0407",
    "prompt": "Do you agree that productive assets are most legitimate when the people who work with them have a direct governance claim over how they are used?",
    "theoryContext": "ideal"
  },
  "q0408": {
    "id": "q0408",
    "prompt": "Do you agree that the unimproved value of land and natural opportunities belongs morally to the community, even when improvements are privately made?",
    "theoryContext": "ideal"
  },
  "q0411": {
    "id": "q0411",
    "prompt": "Do you agree that production in a post-capitalist economy should be governed through federated workers’ councils rather than a party-state bureaucracy?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0412": {
    "id": "q0412",
    "prompt": "Do you agree that a disciplined revolutionary organization should be prepared to centralize authority during a transition away from capitalism?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0413": {
    "id": "q0413",
    "prompt": "Do you agree that anti-authoritarian movements should use standing coordinating bodies rather than rely only on autonomous affinity groups?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0414": {
    "id": "q0414",
    "prompt": "Do you agree that civil law may legitimately be subordinate to revealed religious law when the two conflict?",
    "theoryContext": "ideal"
  },
  "q0415": {
    "id": "q0415",
    "prompt": "Do you agree that a nation’s political membership should be defined by shared citizenship and institutions rather than ancestry?",
    "theoryContext": "ideal"
  },
  "q0417": {
    "id": "q0417",
    "prompt": "Do you agree that immigration policy should be used to preserve inherited cultural continuity, even at the cost of economic openness?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0418": {
    "id": "q0418",
    "prompt": "Do you agree that nonhuman habitats can have moral claims strong enough to override projects that would materially benefit people?",
    "theoryContext": "ideal"
  },
  "q0420": {
    "id": "q0420",
    "prompt": "Do you agree that rich societies should impose binding caps on total material throughput instead of treating green growth as the main climate strategy?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0421": {
    "id": "q0421",
    "prompt": "Do you agree that gender and sexual hierarchies remain unjust even when everyone has equal formal legal rights?",
    "theoryContext": "ideal"
  },
  "q0423": {
    "id": "q0423",
    "prompt": "Do you agree that when a welfare reform cannot pass in full, accepting a partial negotiated expansion is preferable to waiting for the complete policy?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0424": {
    "id": "q0424",
    "prompt": "Do you agree that taxing unimproved land value should replace broad taxes on labor and productive investment wherever possible?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0425": {
    "id": "q0425",
    "prompt": "Do you agree that inherited office can be a legitimate source of political authority when it anchors continuity and social order?",
    "theoryContext": "ideal"
  },
  "q0427": {
    "id": "q0427",
    "prompt": "Do you agree that the survival of a species can matter morally even when preserving it yields no direct human benefit?",
    "theoryContext": "ideal"
  },
  "q0428": {
    "id": "q0428",
    "prompt": "Do you agree that a species or ecosystem can be wronged by its destruction even when no human being experiences a measurable loss?",
    "theoryContext": "ideal"
  },
  "q0429": {
    "id": "q0429",
    "prompt": "Do you agree that human claims to extract resources should be limited when extraction destroys the conditions for other species to flourish?",
    "theoryContext": "nonideal"
  },
  "q0430": {
    "id": "q0430",
    "prompt": "Do you agree that when citizens receive balanced information and time to deliberate, their political knowledge tends to increase?",
    "theoryContext": "nonideal",
    "evidenceNote": "Scope this claim to deliberative mini-publics and comparable democratic innovations rather than to every form of political discussion. A meta-analysis of 100 studies in established democracies found a positive average effect on participants’ political knowledge, while effects on attitudes, behaviour, and deliberative quality varied by design and context; knowledge gains do not prove that every collective decision is sound.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0431": {
    "id": "q0431",
    "prompt": "Do you agree that elections are more likely to hold poorly performing leaders accountable when voters can observe outcomes and compare credible alternatives?",
    "theoryContext": "nonideal",
    "evidenceNote": "Treat this as a conditional accountability claim: voters need observable outcomes, credible alternatives, and enough information to connect performance with officeholders. Research on information distribution in elections finds that information can change accountability and welfare, but its effects depend on what is disclosed, who receives it, and how political incentives respond; it is not a universal guarantee of good government.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0432": {
    "id": "q0432",
    "prompt": "Do you agree that unequal or incomplete information can cause voters to reward or punish incumbents for reasons unrelated to policy performance?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item concerns information problems in electoral accountability, not a claim that voters are inherently irrational or that elections are always uninformed. The relevant evidence distinguishes unequal access, incomplete signals, media and campaign information, and the possibility that additional information can have heterogeneous effects across voters and issues.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0433": {
    "id": "q0433",
    "prompt": "Do you agree that expert advice is more likely to improve policy when its evidence, assumptions, and uncertainty are transparent and open to challenge?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item is about conditions under which expertise is more useful, not about whether experts should replace elected institutions. OECD evidence-governance guidance emphasizes transparent methods, stated assumptions, uncertainty, integrity, accountability, contestability, and public representation as safeguards for mobilizing evidence in policy; these are design conditions rather than a guarantee that advice is correct.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0434": {
    "id": "q0434",
    "prompt": "Do you agree that technical agencies can become detached from public needs when their evidence and decisions are insulated from public scrutiny?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item isolates the accountability risk of insulated technical agencies. Evidence-governance frameworks treat transparency, review, contestability, and public representation as ways to reduce detachment and improve the use of expertise; the claim does not imply that independence is always harmful or that public scrutiny supplies technical competence by itself.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0435": {
    "id": "q0435",
    "prompt": "Do you agree that legal reforms can affect social norms, but enforcement, incentives, and public acceptance mediate whether change persists?",
    "theoryContext": "mixed",
    "evidenceNote": "Scope this claim to social norms and legal-institutional change rather than assuming that formal law immediately changes private behavior. World Bank materials on social norms distinguish legal rules from enforcement, incentives, reference groups, public acceptance, and the time needed for new expectations to become durable; effects vary by issue and setting.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0436": {
    "id": "q0436",
    "prompt": "Do you agree that when an institution can be made less coercive through ordinary political action, movements should prefer that reform to a rupture?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0437": {
    "id": "q0437",
    "prompt": "Do you agree that a revolutionary break should be pursued only when ordinary reform cannot remove the institution’s central injustice?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0438": {
    "id": "q0438",
    "prompt": "Do you agree that movements should use elections when doing so can secure durable gains without abandoning independent organizing?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0439": {
    "id": "q0439",
    "prompt": "Do you agree that direct action should supplement electoral participation when formal institutions exclude affected people from meaningful influence?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0440": {
    "id": "q0440",
    "prompt": "Do you agree that accepting a partial reform is worthwhile when it materially improves lives and leaves a credible path to further change?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0441": {
    "id": "q0441",
    "prompt": "Do you agree that a movement should reject a compromise that entrenches the injustice it seeks to end, even if the compromise offers short-term gains?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0442": {
    "id": "q0442",
    "prompt": "Do you agree that negotiation is preferable to maximal demands when an agreement preserves the ability to revise policy as evidence changes?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0443": {
    "id": "q0443",
    "prompt": "Do you agree that direct action should be a primary strategy when formal institutions systematically exclude affected people from meaningful influence?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0444": {
    "id": "q0444",
    "prompt": "Do you agree that when legal rights change, gender and family practices can change more slowly than the law?",
    "theoryContext": "mixed",
    "evidenceNote": "Scope this claim to changes in observed gender and family practices after formal legal reform. Social norms can persist through enforcement gaps, material dependence, reference groups, and public resistance, so legal change does not imply immediate behavioral convergence or identical outcomes across settings.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0445": {
    "id": "q0445",
    "prompt": "Do you agree that public campaigns and institutions can shift social expectations when they change incentives and reference-group behavior over time?",
    "theoryContext": "mixed",
    "evidenceNote": "Scope this claim to campaigns and institutional changes that alter incentives, reference groups, and public expectations over time. Social norm change can be gradual and contested; the item does not claim that campaigns alone succeed or that every population responds in the same way.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0446": {
    "id": "q0446",
    "prompt": "Do you agree that a policy can be morally wrong because it destroys an ecosystem even when it increases aggregate human welfare?",
    "theoryContext": "ideal"
  },
  "q0447": {
    "id": "q0447",
    "prompt": "Do you agree that nonhuman beings can matter morally in their own right, not only because protecting them benefits present or future people?",
    "theoryContext": "ideal"
  },
  "q0448": {
    "id": "q0448",
    "prompt": "Do you agree that when human necessities conflict with nonhuman interests, human use should usually prevail if less harmful alternatives are costly?",
    "theoryContext": "nonideal"
  },
  "q0449": {
    "id": "q0449",
    "prompt": "Do you agree that armed defense can be morally justified when it is necessary to stop grave aggression and no less harmful alternative is available?",
    "theoryContext": "nonideal"
  },
  "q0450": {
    "id": "q0450",
    "prompt": "Do you agree that a government should reject military intervention when a nonviolent policy can protect people from the same immediate threat?",
    "theoryContext": "nonideal"
  },
  "q0451": {
    "id": "q0451",
    "prompt": "Do you agree that a state may use proportionate military force to defend people from attack even when doing so imposes serious costs on its own citizens?",
    "theoryContext": "nonideal"
  },
  "q0452": {
    "id": "q0452",
    "prompt": "Do you agree that public institutions may recognize a religious tradition symbolically while protecting equal civic standing for people who do not practice it?",
    "theoryContext": "ideal"
  },
  "q0453": {
    "id": "q0453",
    "prompt": "Do you agree that public law should not privilege a religious moral code merely because it is traditional or supported by a majority?",
    "theoryContext": "ideal"
  },
  "q0454": {
    "id": "q0454",
    "prompt": "Do you agree that religious authorities should not have final unchecked power to interpret or enforce public law?",
    "theoryContext": "ideal"
  },
  "q0455": {
    "id": "q0455",
    "prompt": "Do you agree that when voters can compare competing evidence and observe consequences, elections can improve accountability for poor performance?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item is scoped to electoral accountability when voters can compare evidence and observe outcomes. Information effects vary with media, issue salience, and who receives the signal; the claim is not that elections always select competent leaders.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0456": {
    "id": "q0456",
    "prompt": "Do you agree that even under competitive elections, identity cues and misinformation can lead voters to reward leaders for outcomes those leaders did not cause?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item concerns retrospective attribution problems under competitive elections. Identity cues and misinformation are possible mechanisms, not universal explanations, and the item does not imply that voters cannot learn from outcomes.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0457": {
    "id": "q0457",
    "prompt": "Do you agree that mass participation alone does not ensure that voters reach well-informed collective judgments?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item separates participation from information and deliberative quality. It does not imply that mass participation is harmful or that expert filtering reliably produces better decisions.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0458": {
    "id": "q0458",
    "prompt": "Do you agree that expert advice is more likely to improve policy when its methods can be independently checked and its uncertainty is reported?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item concerns conditions that can make expert advice more useful: independent checking, transparent methods, and reported uncertainty. These design conditions do not guarantee correctness or replace public authorization.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0459": {
    "id": "q0459",
    "prompt": "Do you agree that professional expert bodies can protect their jurisdiction and status even when their recommendations are presented as neutral evidence?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item tests a public-choice risk within professional expertise. It does not assert that all expert bodies are captured or that ordinary political control is free of status and self-interest effects.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0460": {
    "id": "q0460",
    "prompt": "Do you agree that independent technical expertise can improve public decisions when its assumptions, evidence, and limits remain open to challenge?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item asks whether contestable and bounded expertise can improve public decisions. It leaves the quality of evidence, reviewer independence, and allocation of final authority open.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0461": {
    "id": "q0461",
    "prompt": "Do you agree that changing formal rules can shift social norms when enforcement and social incentives reinforce the new expectations?",
    "theoryContext": "mixed",
    "evidenceNote": "This item tests a mediated account of legal norm change: rules matter partly through enforcement and social incentives. It does not claim that law alone changes culture or that every norm responds at the same speed.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0462": {
    "id": "q0462",
    "prompt": "Do you agree that long-standing norms can persist despite legal change when family, peer, and economic dependencies remain stable?",
    "theoryContext": "mixed",
    "evidenceNote": "This item isolates persistence under stable relational and economic dependencies. It does not make path dependence permanent or deny that legal change can alter incentives and reference groups.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0463": {
    "id": "q0463",
    "prompt": "Do you agree that public institutions can change cultural expectations without making every person share the same moral view?",
    "theoryContext": "mixed",
    "evidenceNote": "This item separates institutional influence on expectations from unanimous moral conversion. It does not specify whether the change is desirable, how coercive the institution is, or whether effects are equal across groups.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0464": {
    "id": "q0464",
    "prompt": "Do you agree that when existing institutions can remove the relevant injustice without preserving the same power, change should work through them?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0465": {
    "id": "q0465",
    "prompt": "Do you agree that replacing an institution is justified when its core function cannot be separated from domination and no credible reform path exists?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0466": {
    "id": "q0466",
    "prompt": "Do you agree that movements should not treat disruption itself as evidence that revolutionary replacement will improve accountability?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0467": {
    "id": "q0467",
    "prompt": "Do you agree that electoral work is worthwhile when it expands durable power for affected people while independent organizing continues?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0468": {
    "id": "q0468",
    "prompt": "Do you agree that direct action is justified when formal channels repeatedly block affected people from meaningful influence?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0469": {
    "id": "q0469",
    "prompt": "Do you agree that formal elections should be treated as one tactic among others rather than the sole legitimate route to political change?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0470": {
    "id": "q0470",
    "prompt": "Do you agree that a partial agreement is preferable when it yields real improvements without preventing later correction?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0471": {
    "id": "q0471",
    "prompt": "Do you agree that a movement should refuse a settlement that permanently entrenches the injustice even if it offers immediate benefits?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0472": {
    "id": "q0472",
    "prompt": "Do you agree that negotiation deserves priority when opponents can make verifiable concessions and the issue remains open to revision?",
    "theoryContext": "nonideal",
    "priorityPrompt": "How important is the policy or strategy you selected, relative to other changes?"
  },
  "q0473": {
    "id": "q0473",
    "prompt": "Do you agree that expert evidence can clarify likely consequences without deciding which competing social values deserve priority?",
    "theoryContext": "mixed",
    "evidenceNote": "This item separates the analytic role of expert evidence from normative priority-setting. OECD evidence-governance guidance emphasizes transparent assumptions, uncertainty, integrity, accountability, contestability, and public representation; those safeguards help decision-makers evaluate advice but do not make evidence politically neutral or determine which values should prevail.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0474": {
    "id": "q0474",
    "prompt": "Do you agree that a policy can fail in practice when implementing agencies lack the staff, information, coordination, or enforcement capacity required by its design?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item isolates implementation capacity from the desirability of a policy and from the state’s overall size. Research distinguishes the hypothetical potential of state capacity from actual bureaucratic performance and emphasizes information, incentives, coordination, and contextual constraints in implementation; failure is therefore conditional rather than inevitable.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0475": {
    "id": "q0475",
    "prompt": "Do you agree that whether a government can implement a policy is better assessed by observed performance on defined tasks than by the policy’s formal existence or ambition alone?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item measures an evidence-oriented view of state capacity: the ability to implement public policy should be distinguished from announcing a policy or possessing formal authority. The measurement literature treats implementation outcomes as a validity problem and does not imply that one indicator captures every dimension of capacity.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0476": {
    "id": "q0476",
    "prompt": "Do you agree that expert recommendations can gain public legitimacy when their assumptions, conflicts, uncertainty, and limits remain open to accountable political challenge?",
    "theoryContext": "mixed",
    "evidenceNote": "This item concerns the institutional conditions that can make expertise more publicly legitimate, not a guarantee that challenge improves technical accuracy in every case. Recent scholarship on evidence use treats expertise as politically contested and emphasizes inclusion, independence safeguards, transparency, and accountability.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0477": {
    "id": "q0477",
    "prompt": "Do you agree that delegating value-laden choices to expert bodies can weaken democratic accountability when affected people cannot meaningfully scrutinize or contest the decision?",
    "theoryContext": "nonideal",
    "evidenceNote": "This item separates expert analysis from the democratic authorization of distributive or value-laden choices. Research on accountability identifies risks when delegation obscures responsibility or leaves affected people without effective scrutiny; it does not claim that all delegation is illegitimate or that public challenge supplies technical expertise by itself.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0478": {
    "id": "q0478",
    "prompt": "Do you agree that norm change is more likely to endure when new behavior becomes publicly expected and socially reinforced, not merely legally permitted?",
    "theoryContext": "mixed",
    "evidenceNote": "This item isolates social reinforcement as a mechanism of durable norm change. Scholarship distinguishes formal legal rules from the expectations, sanctions, reference groups, and institutional practices that make behavior appear normal; the claim is conditional and does not deny that law can itself alter expectations.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "q0479": {
    "id": "q0479",
    "prompt": "Do you agree that changing a formal rule may leave older social expectations in place for a time when informal institutions and group sanctions continue to reward established behavior?",
    "theoryContext": "mixed",
    "evidenceNote": "This item tests conditional persistence rather than cultural immobility. Research on formal and informal institutions describes culture and social norms as capable of persistence while also changing through interaction with law, authority, incentives, and collective action; the item does not make delay permanent or universal.",
    "confidencePrompt": "How confident are you in the answer you just gave?"
  },
  "sq01": {
    "id": "sq01",
    "prompt": "Which comes closest to your view of when political authority is justified?",
    "theoryContext": "mixed"
  },
  "sq02": {
    "id": "sq02",
    "prompt": "Which comes closest to how you think about ownership of productive assets?",
    "theoryContext": "mixed"
  },
  "sq06": {
    "id": "sq06",
    "prompt": "Which best captures your view of obligations across borders?",
    "theoryContext": "mixed"
  },
  "sq07": {
    "id": "sq07",
    "prompt": "Which comes closest to how you weigh nature against human use?",
    "theoryContext": "mixed"
  },
  "sq13": {
    "id": "sq13",
    "prompt": "Which single principle should take priority when property and markets conflict?",
    "theoryContext": "mixed"
  },
  "sq15": {
    "id": "sq15",
    "prompt": "Which account of national identity is closest to yours?",
    "theoryContext": "mixed"
  }
});
