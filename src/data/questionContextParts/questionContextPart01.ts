import type { QuestionContextRecord } from "../questionContextTypes";

export const questionContextPart01: Readonly<
  Record<string, QuestionContextRecord>
> = {
  q0001: {
    contextNote:
      "This normative item concerns the legitimacy of compulsory membership in a political order when people cannot decline a service without criminal penalty. Exit can be relevant to authority, but practical exit may be costly, collective goods may be difficult to provide privately, and refusal of one service does not necessarily amount to refusal of every law or institution.",
    sourceIds: ["authority", "politicalObligation", "markets"],
  },
  q0003: {
    contextNote:
      "This normative item isolates moral suspicion of territorial monopoly government from the separate question whether public goods can be supplied. “Monopoly” describes an institution’s claimed exclusive jurisdiction; the item does not establish that competition is feasible for every service or that useful output makes coercion legitimate.",
    sourceIds: ["authority", "politicalObligation", "markets"],
  },
  q0004: {
    contextNote:
      "This normative item tests whether emergency need is sufficient by itself to justify unlimited authority. It leaves necessity, proportionality, duration, rights limits, renewal, legislative or judicial review, and return to ordinary constitutional order as distinct safeguards rather than treating every emergency measure as equivalent.",
    sourceIds: ["authority", "politicalObligation", "emergencyPowers"],
  },
  q0005: {
    contextNote:
      "This normative item concerns the presumption of obedience when institutions are unjust and peaceful resistance is available. It does not define how severe the injustice must be, whether resistance is effective or lawful, or whether a duty to resist follows; legitimacy, political obligation, and the justification of a tactic remain distinct questions.",
    sourceIds: ["politicalObligation", "civilDisobedience", "authority"],
  },
  q0006: {
    contextNote:
      "This normative item compares consent and exit with elections and inherited territorial membership as standards of political legitimacy. These standards can overlap without being identical: an election may authorize officials without establishing individual consent, while exit may be legally available yet materially unrealistic; the item does not prescribe one institutional form.",
    sourceIds: ["authority", "politicalObligation", "democracy"],
  },
  q0021: {
    contextNote:
      "This normative item distinguishes claims based on labor from privileges created by law or conquest. It does not assume that labor alone settles initial appropriation, inherited title, collective production, taxation, compensation, or the rights of people affected by an owner’s use; those are separate property and justice questions.",
    sourceIds: ["property", "distributiveJustice"],
  },
  q0022: {
    contextNote:
      "This normative item tests whether exclusionary ownership loses moral force under conditions of nonuse, lack of improvement, or lack of consent. It does not imply that all unused property is illegitimate or that use and improvement are the only relevant grounds; possession, transfer, common resources, and background justice may matter too.",
    sourceIds: ["property", "distributiveJustice"],
  },
  q0023: {
    contextNote:
      "This normative item limits the legitimacy of private productive ownership when title originates in conquest or legal privilege. It does not settle how historical injustice should be proved or rectified, whether later purchasers acted in good faith, or whether state ownership is the only alternative to an unjust title.",
    sourceIds: ["property", "distributiveJustice", "politicalObligation"],
  },
  q0024: {
    contextNote:
      "This normative item separates rectification of wealth produced by coercive privilege from protection of ordinary personal possessions. It does not define which gains count as privilege, who may claim compensation, how far historical correction reaches, or whether a chosen remedy must be confiscatory, redistributive, or institutional.",
    sourceIds: ["property", "distributiveJustice"],
  },
  q0025: {
    contextNote:
      "This normative item treats independence from politically favored owners as a possible purpose of property rules. It is not a claim that private ownership always creates dependence or that public ownership automatically produces autonomy; concentration, access, labor relations, legal privilege, and exit can affect the result.",
    sourceIds: ["property", "distributiveJustice", "markets"],
  },
  q0026: {
    contextNote:
      "This normative item links property legitimacy to other people’s meaningful access to livelihood and exit. It does not specify a minimum baseline, a particular labor or welfare policy, or a complete theory of ownership; the relevant comparison is between title claims and the background conditions needed for non-domination.",
    sourceIds: ["property", "distributiveJustice", "politicalObligation"],
  },
  q0034: {
    contextNote:
      "This prescriptive item favors targeting monopoly privilege, artificial scarcity, and entry barriers as reform objects. It does not imply that every restriction is artificial or that removing a barrier is sufficient; public harms, safety, information, transition costs, and institutional enforcement still require separate assessment.",
    sourceIds: ["markets", "property", "distributiveJustice"],
  },
  q0035: {
    contextNote:
      "This prescriptive item distinguishes transferring ownership to the state from solving the incentives and accountability problems that can produce privilege. It does not reject public ownership categorically or endorse private ownership categorically; governance, worker voice, monitoring, entry, and public purpose remain design questions.",
    sourceIds: ["stateOwnedGovernance", "socialism", "property"],
  },
  q0038: {
    contextNote:
      "This prescriptive item favors making ownership contestable rather than assuming that a public manager is preferable to a private manager. “Contestable” can involve entry, exit, cooperative governance, competition, disclosure, or legal challenge; the item does not specify which mechanism works in every sector or under every public-good constraint.",
    sourceIds: ["markets", "property", "socialism"],
  },
  q0039: {
    contextNote:
      "This normative item rejects treating property rules as morally absolute when they give some people command over others without reciprocal obligation. It does not deny all property rights or define reciprocity by itself; personal possessions, productive assets, common resources, and coercively created titles can require different analysis.",
    sourceIds: ["property", "distributiveJustice", "politicalObligation"],
  },
  q0041: {
    contextNote:
      "This normative item concerns the moral permission to engage in peaceful exchange even when its aggregate pattern differs from a planner’s preferred outcome. It does not assume that every exchange is informed or noncoercive, that markets are competitive, or that voluntary agreement settles background questions about property and bargaining power.",
    sourceIds: ["markets", "property", "liberalism"],
  },
  q0042: {
    contextNote:
      "This normative item raises an anti-instrumental concern about economic planning when one collective blueprint overrides plural individual ends. “Planning” can be centralized, democratic, participatory, or limited to particular sectors; the item does not treat every coordination rule as a single coercive blueprint or establish that markets avoid instrumentalization.",
    sourceIds: ["markets", "socialism", "liberalism"],
  },
  q0043: {
    contextNote:
      "This normative item values plural ends in economic coordination rather than one official hierarchy of goals. It does not decide whether pluralism requires markets, democratic planning, federalism, or mixed institutions, and it leaves open how conflicts among legitimate ends should be handled when resources are scarce.",
    sourceIds: ["markets", "socialism", "liberalism"],
  },
  q0044: {
    contextNote:
      "This normative item limits deference to market outcomes when access to exchange has been restricted by law or violence. It does not claim that every unequal outcome reflects coercion or that all intervention corrects it; the relevant distinction is between ordinary exchange results and results shaped by exclusionary rules or force.",
    sourceIds: ["markets", "property", "distributiveJustice"],
  },
  q0045: {
    contextNote:
      "This normative item distinguishes removing privilege from substituting officials’ preferences for participants’ choices. Both may involve state action, but the item does not assume that privilege is always easy to identify, that removal is administratively neutral, or that a narrow remedy avoids all distributional consequences.",
    sourceIds: ["markets", "property", "politicalObligation"],
  },
  q0046: {
    contextNote:
      "This normative item makes the moral case for markets conditional on real entry, exit, and competition rather than nominal permission alone. It does not equate those conditions with perfect competition or efficiency, and it leaves open which public rules are needed to prevent coercion, monopoly, fraud, or exclusion.",
    sourceIds: ["markets", "property", "liberalism"],
  },
  q0061: {
    contextNote:
      "This normative item concerns a duty to prevent severe deprivation when the cost to others is described as modest. It does not specify a complete theory of distributive justice, the threshold of destitution, who bears the sacrifice, or whether the duty is best met through cash, services, predistribution, or private association.",
    sourceIds: ["distributiveJustice", "liberalism"],
  },
  q0062: {
    contextNote:
      "This normative item treats material security as protection against domination rather than only as an increase in consumption. It does not imply that every inequality is domination or that a material floor requires one particular welfare state; dependence, bargaining power, rights, and the feasibility of exit remain distinct considerations.",
    sourceIds: ["distributiveJustice", "liberalism", "civilPoliticalRights"],
  },
  q0063: {
    contextNote:
      "This normative item prioritizes agency in the design of aid and rejects making assistance depend on a recipient’s perceived moral worth. It does not prohibit eligibility rules, fraud controls, or conditions in every program; it distinguishes respect for equal standing from the administrative question of how a benefit is delivered.",
    sourceIds: ["distributiveJustice", "liberalism", "civilPoliticalRights"],
  },
  q0064: {
    contextNote:
      "This normative item distinguishes claims arising from state-created scarcity from ordinary losses in competitive exchange. It does not establish that every policy restriction is unjust or that affected people are owed one fixed remedy; the relevant questions include causation, privilege, compensation, and background property rules.",
    sourceIds: ["distributiveJustice", "property", "housingSupply"],
  },
  q0065: {
    contextNote:
      "This normative item evaluates welfare administration partly by whether it subjects recipients to surveillance and humiliation. It does not claim that all verification is humiliating or that privacy always overrides fraud prevention; dignity, due process, proportionality, administrative accuracy, and program access can pull in different directions.",
    sourceIds: ["distributiveJustice", "civilPoliticalRights", "liberalism"],
  },
  q0066: {
    contextNote:
      "This normative item gives stronger moral weight to redistribution when the distribution being corrected was shaped by privilege. It does not define privilege as every unequal outcome or determine whether rectification, regulation, public provision, or transfers is the appropriate remedy; historical cause and present remedy remain separate.",
    sourceIds: ["distributiveJustice", "property"],
  },
  q0073: {
    contextNote:
      "This prescriptive item favors a safety net that secures basic agency while limiting paternalistic supervision. It does not specify a benefit level or prohibit all conditions; cash, services, work requirements, safeguards, and institutional oversight can be evaluated separately for their effects on autonomy and access.",
    sourceIds: ["distributiveJustice", "liberalism", "snapRecertification"],
  },
  q0074: {
    contextNote:
      "This prescriptive item prefers cash over narrow in-kind or behavior-directing programs as a way to preserve recipient choice. It does not claim that cash is always sufficient or that all in-kind provision is paternalistic; information, children’s welfare, public goods, administrative burden, and market access may justify different tools in different settings.",
    sourceIds: ["distributiveJustice", "liberalism", "snapRecertification"],
  },
  q0076: {
    contextNote:
      "This prescriptive item targets benefit cliffs in which a small increase in earnings can reduce eligibility or disposable resources. It does not say that every phase-out is a cliff, that marginal effective tax rates are always harmful, or that a particular universal or means-tested design is required; the relevant question is how rules shape work and household decisions.",
    sourceIds: [
      "snapRecertification",
      "householdTypologies",
      "distributiveJustice",
    ],
  },
  q0077: {
    contextNote:
      "This prescriptive item supports local experimentation when recipients have meaningful ways to leave a bad program. It does not assume that exit is costless or that local variation is automatically innovative; accountability, portability, comparability, rights floors, and the distribution of administrative capacity remain necessary safeguards.",
    sourceIds: [
      "polycentricGovernance",
      "distributiveJustice",
      "snapRecertification",
    ],
  },
  q0079: {
    contextNote:
      "This normative item treats freedom from starvation-based dependence as a condition of agency. It does not establish that a public transfer is the only route to independence or that all dependence is coercive; wages, family relations, mutual aid, markets, and public institutions can create different kinds of reliance and exit.",
    sourceIds: ["distributiveJustice", "liberalism", "politicalObligation"],
  },
  q0081: {
    contextNote:
      "This normative item isolates workers’ freedom to form organizations of their choice and bargain collectively without legal favoritism or retaliation. Refusal of particular work, exit from employment, starting a rival firm, union recognition, strike rules, and employer property are distinct freedoms and institutional questions; agreement does not prescribe one bargaining structure.",
    sourceIds: ["freedomAssociation", "labourRights"],
  },
  q0082: {
    contextNote:
      "This normative item evaluates employment contracts by meaningful exit and by the background rules that shape bargaining power. It does not treat every unequal bargain as invalid or define meaningful exit as merely formal resignation; labor law, social insurance, discrimination rules, and dependence can affect whether consent is genuinely usable.",
    sourceIds: ["employmentRelationship", "labourRights", "liberalism"],
  },
  q0083: {
    contextNote:
      "This normative item treats insulated workplace authority as morally suspect when workers lack voice, exit, or competitive alternatives. It does not imply that every manager must be elected or that competition removes domination; the item distinguishes internal governance from the firm’s ownership and from the external labor market.",
    sourceIds: ["labour", "labourRights", "property"],
  },
  q0084: {
    contextNote:
      "This normative item questions whether employer power by itself justifies state-backed union privilege. It does not deny collective bargaining or assume private association is always noncoercive; the relevant design choices include membership, representation, strike rights, public funding, and protections for nonmembers and service users.",
    sourceIds: ["labourRights", "labour", "employmentRelationship"],
  },
  q0085: {
    contextNote:
      "This normative item isolates the claim that legally restricted entry or exit can create labor-market coercion. Occupational licensing, immigration status, housing access, and employer power are distinct mechanisms with different purposes and effects; the item does not treat them as equivalent or imply that removing a barrier automatically improves work.",
    sourceIds: [
      "occupationalLicensingEntry",
      "labourRights",
      "employmentRelationship",
    ],
  },
  q0094: {
    contextNote:
      "This prescriptive item frames repeal of licensing barriers as labor reform rather than only deregulation. It does not imply that all licensing is unnecessary or that consumer risks disappear; the policy question is whether a credential rule protects the public or mainly restricts entry and incumbent competition.",
    sourceIds: ["labourRights", "employmentRelationship", "labour"],
  },
  q0095: {
    contextNote:
      "This prescriptive item compares public-sector bargaining rules with private voluntary association when services are financed through compulsory taxation. It does not assume that public employees are ordinary insiders or that private bargaining has no spillovers; representation, fiscal accountability, service continuity, and worker rights are separate design concerns.",
    sourceIds: ["labour", "labourRights", "politicalObligation"],
  },
  q0096: {
    contextNote:
      "This prescriptive item favors benefits that remain portable when a worker changes employers or union positions. It does not specify whether portability should be achieved through individual accounts, public insurance, sectoral funds, or collective plans, and it leaves risk pooling, financing, and coverage adequacy open.",
    sourceIds: ["labourRights", "employmentRelationship", "labour"],
  },
  q0097: {
    contextNote:
      "This prescriptive item supports simplifying law for worker cooperatives without imposing one ownership model on every firm. It does not assume that cooperative governance always outperforms investor ownership or that legal simplification is enough; member control, capital access, information, liability, and worker rights remain relevant.",
    sourceIds: ["workerCooperatives", "cooperativesWorkRights", "labour"],
  },
  q0098: {
    contextNote:
      "This prescriptive item prioritizes worker exit options before mandatory bargaining structures. It does not treat exit as a substitute for collective power where employers or labor markets are concentrated; portability, organizing rights, bargaining coverage, and the costs of changing employers are separate institutional levers.",
    sourceIds: ["labour", "employmentRelationship", "labourRights"],
  },
  q0099: {
    contextNote:
      "This normative item rejects state-backed exclusion of peaceful labor competitors. It does not imply that every restriction on labor organization is peaceful or justified, nor that employer property settles all labor rights; association, collective action, safety, discrimination, and coercive monopoly must be distinguished.",
    sourceIds: ["labourRights", "labour", "liberalism"],
  },
  q0101: {
    contextNote:
      "This normative item gives unimproved land value a different justificatory status from improvements made by people. It does not by itself endorse a land-value tax or deny private possession; original appropriation, exclusion, community-created value, assessment, and compensation are distinct property questions.",
    sourceIds: ["property", "landTenure", "distributiveJustice"],
  },
  q0102: {
    contextNote:
      "This normative item protects building freedom when concrete harms to others are absent. It does not treat every externality as concrete or assume that a private parcel is free from infrastructure, safety, environmental, or neighborhood effects; the item distinguishes harm-based limits from aesthetic vetoes and general scarcity protection.",
    sourceIds: ["housingSupply", "property", "housingSupplyAffordability"],
  },
  q0104: {
    contextNote:
      "This normative item limits incumbent homeowners’ moral claims to exclude newcomers merely to protect asset prices. It does not deny residents’ interests in safety, noise, infrastructure, or direct nuisance, and it does not imply that every supply restriction is motivated by exclusion; the issue is the justification for blocking access to opportunity.",
    sourceIds: ["housingSupply", "housingSupplyAffordability", "property"],
  },
  q0105: {
    contextNote:
      "This normative item characterizes rent burdens caused by legal scarcity as political extraction rather than a neutral market fact. It does not establish that every high rent is legally caused or that supply reform is the only remedy; incidence, demand, construction, tenant protection, and land ownership can all matter.",
    sourceIds: ["housingSupply", "housingSupplyAffordability", "property"],
  },
  q0106: {
    contextNote:
      "This normative item makes private landholding more defensible when land rents are not permanently captured by one owner. It does not specify whether the remedy is taxation, common ownership, leasehold, public investment, or another arrangement, and it distinguishes land value from privately produced improvements.",
    sourceIds: ["property", "landTenure", "distributiveJustice"],
  },
  q0115: {
    contextNote:
      "This prescriptive item supports replacing worse taxes with a land-value tax only when assessment institutions are credible. It does not assume that valuation is simple or politically neutral, that the tax is sufficient for every public purpose, or that tax incidence and transition effects disappear once the base is chosen.",
    sourceIds: ["landTenure", "property", "distributiveJustice"],
  },
  q0116: {
    contextNote:
      "This prescriptive item seeks tenant protection without freezing housing supply or shifting all scarcity costs onto newcomers. It does not decide which rent, eviction, construction, or subsidy instrument works best; incumbent protection, access for new households, mobility, and long-run supply are separate outcomes.",
    sourceIds: [
      "housingSupplyAffordability",
      "housingSupply",
      "housingDemandSubsidies",
    ],
  },
  q0117: {
    contextNote:
      "This prescriptive item favors capturing rising land values created partly by public infrastructure rather than taxing unrelated productive activity. It does not establish that all appreciation is publicly created or that land-value capture is administratively costless; valuation, timing, ownership, and infrastructure financing remain open.",
    sourceIds: ["landTenure", "property", "housingSupply"],
  },
  q0119: {
    contextNote:
      "This normative item gives access to high-opportunity locations greater moral weight than preserving neighborhood aesthetics alone. It does not erase legitimate claims concerning safety, infrastructure, heritage, or direct nuisance, and it does not prescribe a specific density, zoning, or housing-finance policy.",
    sourceIds: [
      "housingSupplyAffordability",
      "housingSupply",
      "distributiveJustice",
    ],
  },
  q0121: {
    contextNote:
      "This normative item concerns freedom to use a peaceful monetary alternative when a state privileges one money. It does not assume that alternatives are stable, redeemable, widely accepted, or free of fraud and network effects; legal tender, payments access, and monetary policy are related but distinct questions.",
    sourceIds: ["monetaryPolicy", "privateMoneyPayments", "liberalism"],
  },
  q0122: {
    contextNote:
      "This normative item objects to opaque redistribution through monetary institutions. It does not claim that every monetary policy distribution is illegitimate or that transparency removes all distributional effects; the relevant concerns include disclosure, accountability, inflation, credit access, asset prices, and political discretion.",
    sourceIds: [
      "monetaryPolicy",
      "privateMoneyPayments",
      "distributiveJustice",
    ],
  },
  q0124: {
    contextNote:
      "This normative item questions bailouts that socialize losses after private gains. It does not establish that every rescue is a bailout or that letting a bank fail is costless; resolution design must distinguish shareholders, managers, creditors, depositors, taxpayers, systemic risk, and payment continuity.",
    sourceIds: [
      "bankResolution",
      "bankFailureResolution",
      "distributiveJustice",
    ],
  },
  q0125: {
    contextNote:
      "This normative item rejects permanent incumbent favoritism as a consequence of financial-stability concerns. It does not deny that stability can require regulation or temporary intervention; the boundary is between protecting critical functions and insulating established institutions from competition or accountability.",
    sourceIds: ["bankResolution", "markets", "monetaryPolicy"],
  },
  q0126: {
    contextNote:
      "This normative item treats consent, transparency, and protection from political manipulation as elements of monetary legitimacy. It does not specify whether money must be private, public, commodity-backed, or central-bank issued, and it does not reduce technical stability or purchasing power to consent alone.",
    sourceIds: [
      "monetaryPolicy",
      "privateMoneyPayments",
      "politicalObligation",
    ],
  },
  q0133: {
    contextNote:
      "This prescriptive item combines currency competition, transparent reserves, and opposition to a privileged issuer. These are separable institutional choices: competition depends on switching and trust, reserves depend on disclosure and redemption, and issuer privilege can concern legal tender, payments infrastructure, or central-bank access.",
    sourceIds: ["privateMoneyPayments", "monetaryPolicy", "bankResolution"],
  },
  q0134: {
    contextNote:
      "This prescriptive item limits discretionary permission when agencies are aligned with incumbent banks. It does not imply that payment innovation needs no licensing or supervision; the relevant design problem is how to distinguish demonstrable fraud, insolvency, and systemic risk from rules that protect incumbents from entry.",
    sourceIds: ["privateMoneyPayments", "markets", "bankResolution"],
  },
  q0137: {
    contextNote:
      "This prescriptive item applies narrowness, disclosure, and automatic sunset to central-bank emergency powers. It does not define which emergencies qualify or deny the need for rapid action; authorization, review, collateral, beneficiaries, renewal, and return to ordinary facilities remain separate safeguards.",
    sourceIds: ["monetaryPolicy", "emergencyPowers", "bankResolution"],
  },
  q0138: {
    contextNote:
      "This prescriptive item prioritizes fraud and insolvency controls over protecting established intermediaries from competition. It does not imply that competition alone ensures stability or that prudential rules are incumbent protection; the item distinguishes a public-risk rationale from a favoritism rationale.",
    sourceIds: ["bankResolution", "markets", "privateMoneyPayments"],
  },
  q0139: {
    contextNote:
      "This normative item challenges the idea that expert administration makes a money monopoly morally neutral. It does not claim that expertise is irrelevant or that competing issuers are automatically legitimate; authority, transparency, exit, stability, and distributional effects remain distinct grounds for evaluation.",
    sourceIds: ["monetaryPolicy", "politicalObligation", "markets"],
  },
  q0161: {
    contextNote:
      "This normative item tests whether rights protections matter most when the person exercising them is unpopular. Speech, religion, association, and criminal due process involve related but distinct liberties; the item does not imply that every act described as speech is immune from rules addressing direct harm, fraud, or coercion.",
    sourceIds: ["civilPoliticalRights", "liberalism"],
  },
  q0162: {
    contextNote:
      "This normative item rejects a general official power to decide which peaceful opinions adults may hear. It does not deny narrowly defined restrictions on direct threats, fraud, or rights violations, and it distinguishes state censorship from private association rules and from the empirical question whether open debate corrects error.",
    sourceIds: ["civilPoliticalRights", "liberalism", "democracy"],
  },
  q0163: {
    contextNote:
      "This normative item treats privacy as a condition that can support dissent, experimentation, and minority life. It does not make privacy absolute or specify one surveillance regime; lawful search, consent, data security, public safety, anonymity, and the power to challenge collection are separate design questions.",
    sourceIds: ["iccprPrivacy", "civilPoliticalRights", "liberalism"],
  },
  q0164: {
    contextNote:
      "This normative item limits censorship justified only by fear that adults may encounter bad ideas. It does not settle how to handle direct incitement, fraud, targeted harassment, or threats, nor does it assume that platform moderation and state punishment have identical authority or consequences.",
    sourceIds: ["civilPoliticalRights", "liberalism", "democracy"],
  },
  q0165: {
    contextNote:
      "This normative item treats due process as a protection that applies regardless of whether the accused is in fact guilty. The item does not depend on a claim that officials are uniquely incompetent or malicious; notice, hearing, counsel, evidence, review, and proportionate procedure are separate components of fair adjudication.",
    sourceIds: ["civilPoliticalRights", "liberalism"],
  },
  q0166: {
    contextNote:
      "This normative item treats civil liberty as a constraint on current majorities rather than a discretionary benefit. It does not deny democratic lawmaking; it asks whether equal rights, due process, conscience, expression, and association should limit what a majority may authorize against minorities or dissenters.",
    sourceIds: ["civilPoliticalRights", "liberalism", "democracy"],
  },
  q0174: {
    contextNote:
      "This prescriptive item requires a direct connection between speech restrictions and a specified harm such as fraud, threat, harassment, or another rights violation. It does not define the legal threshold for each category or imply that every restriction meeting a formal connection is proportionate or administratively safe.",
    sourceIds: ["civilPoliticalRights", "liberalism", "democracy"],
  },
  q0175: {
    contextNote:
      "This prescriptive item favors adversarial authorization and later notice for surveillance powers. It does not assume that every search can be disclosed immediately or that a warrant alone prevents abuse; necessity, scope, minimization, independent review, remedies, and emergency exceptions remain distinct safeguards.",
    sourceIds: ["iccprPrivacy", "civilPoliticalRights", "democracy"],
  },
  q0176: {
    contextNote:
      "This prescriptive item applies automatic sunset and strict reauthorization to emergency restrictions on assembly or movement. It does not say that every emergency limit is invalid or that a sunset clause is sufficient; necessity, proportionality, review, geographic scope, and restoration of ordinary rights must also be assessed.",
    sourceIds: ["emergencyPowers", "civilPoliticalRights", "democracy"],
  },
  q0177: {
    contextNote:
      "This prescriptive item favors disclosure when governments ask platforms to remove or suppress lawful speech. It does not require disclosure that would expose a victim, an investigative method, or a genuinely necessary secret, and it distinguishes transparency about state requests from a general verdict on platform moderation.",
    sourceIds: ["civilPoliticalRights", "iccprPrivacy", "democracy"],
  },
  q0178: {
    contextNote:
      "This prescriptive item applies the same judicial review to emergency surveillance regardless of which party controls government. It does not assume that courts are infallible or that political neutrality is automatic; equal review, independent authorization, notice, remedies, and evidentiary standards are separate institutional safeguards.",
    sourceIds: ["iccprPrivacy", "emergencyPowers", "civilPoliticalRights"],
  },
  q0179: {
    contextNote:
      "This normative item treats the possibility of being wrong as part of equal political standing. It does not imply that all beliefs are equally well supported or that false statements causing direct harm receive no regulation; it concerns whether officials or majorities may deny civic standing merely for dissent or error.",
    sourceIds: ["civilPoliticalRights", "liberalism", "democracy"],
  },
  q0201: {
    contextNote:
      "This normative item treats birthplace as morally arbitrary when used to exclude peaceful people from work, housing, and association. It does not settle all questions about admission, public finance, security, labor regulation, or asylum; it isolates the moral relevance of being born on one side of a border.",
    sourceIds: ["immigration", "civilPoliticalRights", "nationalism"],
  },
  q0202: {
    contextNote:
      "This normative item treats movement for self-improvement as a liberty claim against state restriction. It does not imply unrestricted entry in every circumstance or settle public-health, security, labor, housing, or asylum administration; freedom of movement and the institutional conditions for receiving newcomers are distinct questions.",
    sourceIds: ["immigration", "civilPoliticalRights", "politicalObligation"],
  },
  q0203: {
    contextNote:
      "This normative item rejects treating citizenship as hereditary ownership of opportunity. It does not deny that political communities may have membership rules or special obligations, and it does not determine whether opportunity should be allocated through open admission, equal rights, global justice, or a particular welfare arrangement.",
    sourceIds: ["immigration", "nationalism", "civilPoliticalRights"],
  },
  q0204: {
    contextNote:
      "This normative item rejects a permanent exclusionary veto based only on earlier arrival. It does not erase claims about democratic authorization, public capacity, housing, labor conditions, or obligations to current residents; it distinguishes temporal priority from a complete moral title to exclude.",
    sourceIds: ["immigration", "politicalObligation", "civilPoliticalRights"],
  },
  q0205: {
    contextNote:
      "This normative item makes border enforcement harder to justify when it traps people under violence or extreme poverty. It does not define the threshold of danger or poverty, establish a universal right of entry, or remove the need to distinguish asylum, ordinary migration, rescue, due process, and feasible protection.",
    sourceIds: ["immigration", "refugeeConvention", "civilPoliticalRights"],
  },
  q0206: {
    contextNote:
      "This normative item allows a political community to preserve institutions while rejecting the treatment of outsiders as rightless threats. It does not prescribe open borders or deny membership distinctions; it concerns minimum equal human standing, non-discrimination, due process, and protection from arbitrary coercion.",
    sourceIds: ["immigration", "refugeeConvention", "civilPoliticalRights"],
  },
  q0213: {
    contextNote:
      "This prescriptive item favors peaceful migration without treating national borders as ownership claims. It does not specify admission administration, citizenship, fiscal membership, security screening, or asylum rules, and it distinguishes a critique of ownership language from a complete border policy.",
    sourceIds: ["immigration", "nationalism", "politicalObligation"],
  },
  q0214: {
    contextNote:
      "This prescriptive item favors broad and quick work authorization even when citizenship remains more restrictive. It does not equate a work permit with permanent membership or asylum, and it leaves labor standards, employer enforcement, portability, fiscal access, and status review as separate implementation questions.",
    sourceIds: ["immigration", "labourRights", "civilPoliticalRights"],
  },
  q0216: {
    contextNote:
      "This prescriptive item targets administrative limbo in asylum systems. It does not predetermine who qualifies as a refugee or require approval of every claim; it concerns timely procedures, lawful status during review, non-refoulement, access to counsel, and the human costs of prolonged uncertainty.",
    sourceIds: ["refugeeConvention", "immigration", "civilPoliticalRights"],
  },
  q0219: {
    contextNote:
      "This normative item treats the ability to sell labor as a liberty that should not disappear solely at a state border. It does not settle employer regulation, citizenship, public benefits, licensing, or labor-market effects; movement, work authorization, and equal workplace rights are distinct policy dimensions.",
    sourceIds: ["immigration", "labourRights", "liberalism"],
  },
  q0221: {
    contextNote:
      "This normative item permits national identity as voluntary belonging while rejecting its use to rule dissenters or exclude outsiders. It does not deny cultural continuity or collective memory; it separates identification with a nation from coercive sovereignty, inherited privilege, and treatment of minorities.",
    sourceIds: ["nationalism", "multiculturalism", "civilPoliticalRights"],
  },
  q0223: {
    contextNote:
      "This normative item values local self-government for possible exit and pluralism while rejecting the assumption that every local majority is just. It does not prescribe full local sovereignty; representation, interdependence, rights floors, fiscal capacity, and safeguards against local domination remain separate institutional questions.",
    sourceIds: ["federalism", "multiculturalism", "democracy"],
  },
  q0224: {
    contextNote:
      "This normative item limits sovereignty when it is used to shield rulers from criticism by their own subjects. It does not deny external self-determination or constitutional authority; it distinguishes a community’s claim to govern itself from an incumbent government’s claim to suppress internal accountability.",
    sourceIds: ["nationalism", "civilPoliticalRights", "politicalObligation"],
  },
  q0226: {
    contextNote:
      "This normative item treats a nation as a community of memory without treating persons inside its borders as owned by that community. It does not reject shared history, civic obligation, or public culture; it separates collective identity from property-like control over individual membership and dissent.",
    sourceIds: ["nationalism", "politicalObligation", "civilPoliticalRights"],
  },
  q0233: {
    contextNote:
      "This prescriptive item favors layered identities across local, regional, national, and cosmopolitan affiliations. It does not specify a federal, confederal, or world-government design, and it leaves open how overlapping jurisdictions should allocate authority, rights, taxation, mobility, and democratic accountability.",
    sourceIds: ["nationalism", "multiculturalism", "federalism"],
  },
  q0234: {
    contextNote:
      "This prescriptive item evaluates secession by more than majority sentiment, adding exit rights and minority protections. It does not deny a people’s claim to self-determination or require that every secession fail; territory, consent, borders, security, minority status, and institutional continuity can affect the judgment.",
    sourceIds: ["nationalism", "federalism", "civilPoliticalRights"],
  },
  q0235: {
    contextNote:
      "This prescriptive item limits sovereignty claims when they conflict with basic civil liberties or peaceful migration. It does not settle the entire hierarchy of international and domestic authority, and it distinguishes legitimate self-government from immunity for arbitrary detention, censorship, discrimination, or exclusion.",
    sourceIds: ["nationalism", "civilPoliticalRights", "immigration"],
  },
  q0236: {
    contextNote:
      "This prescriptive item requires decentralization to include safeguards against local caste, ethnic, or religious domination. It does not treat centralization as the only safeguard or local autonomy as inherently oppressive; representation, judicial review, equal citizenship, exit, and intergovernmental rights floors are separate choices.",
    sourceIds: ["federalism", "multiculturalism", "civilPoliticalRights"],
  },
  q0239: {
    contextNote:
      "This normative item separates love of place from coercively freezing culture. It does not deny that communities may preserve language, memory, institutions, or heritage through voluntary association and public policy; it asks whether those aims justify coercion against peaceful residents or cultural change.",
    sourceIds: ["nationalism", "multiculturalism", "liberalism"],
  },
  q0241: {
    contextNote:
      "This normative item protects religious conviction while rejecting political supremacy over nonbelievers or dissenters. It does not require hostility to religion or a single secular regime; conscience, equal citizenship, public justification, accommodation, and coercive establishment are distinct questions.",
    sourceIds: ["secularism", "civilPoliticalRights", "religionOfficialStatus"],
  },
  q0243: {
    contextNote:
      "This normative item protects voluntary religious communities’ internal norms when members can genuinely leave. It does not treat every community rule as voluntary or permit coercion, abuse, fraud, or denial of civil rights; association, exit, legal status, and protection from harm must be distinguished.",
    sourceIds: ["secularism", "civilPoliticalRights", "liberalism"],
  },
  q0244: {
    contextNote:
      "This normative item rejects civil criminalization of blasphemy, apostasy, and heresy. It does not deny that threats, violence, incitement, fraud, or targeted harassment can be regulated, and it distinguishes protection of religious belief from protection of a doctrine against criticism.",
    sourceIds: ["secularism", "civilPoliticalRights"],
  },
  q0245: {
    contextNote:
      "This normative item rejects state favoritism toward a culturally dominant religion. It does not require identical treatment in every historical or institutional context or deny voluntary public recognition; it concerns coercive privilege, equal citizenship, public funding, office, and access to legal remedies.",
    sourceIds: ["secularism", "religionOfficialStatus", "civilPoliticalRights"],
  },
  q0246: {
    contextNote:
      "This normative item treats freedom of religion as including freedom from religiously backed coercive law. It does not claim that religious reasons may never enter public debate or that secular reasons are automatically neutral; the boundary is whether civil coercion preserves equal conscience and dissent.",
    sourceIds: ["secularism", "civilPoliticalRights", "liberalism"],
  },
  q0253: {
    contextNote:
      "This prescriptive item applies one civil-liberty principle to religious exercise and nonreligious dissent. It does not require identical accommodations in every case; equal standing, burden, harm to third parties, public neutrality, and the practical ability to opt out can justify distinctions in implementation.",
    sourceIds: ["secularism", "civilPoliticalRights", "liberalism"],
  },
  q0254: {
    contextNote:
      "This prescriptive item protects religious practice while limiting coercion of third parties. It does not define every third-party burden as coercion or every exemption as justified; courts and lawmakers may need to distinguish direct harm, public funding, employment, services, equality, and feasible accommodation.",
    sourceIds: ["secularism", "civilPoliticalRights", "multiculturalism"],
  },
  q0255: {
    contextNote:
      "This prescriptive item limits state funding or enforcement of religious doctrine through education, family law, or speech restrictions. It does not prohibit public services from partnering with faith-based providers on equal terms, and it distinguishes institutional cooperation from compulsory doctrine or unequal civic status.",
    sourceIds: ["secularism", "religionOfficialStatus", "civilPoliticalRights"],
  },
  q0256: {
    contextNote:
      "This prescriptive item requires faith-based organizations receiving public funds to meet the same privilege standard as secular associations. It does not require identical organizational missions or prohibit contracting with religious providers; the issue is public money, equal access, accountability, and coercive religious preference.",
    sourceIds: ["religionOfficialStatus", "civilPoliticalRights", "liberalism"],
  },
  q0257: {
    contextNote:
      "This prescriptive item conditions enforcement of religious arbitration on genuinely voluntary participation and exit. It does not reject private dispute resolution or imply that exit is real whenever a form is signed; informed consent, unequal dependency, due process, public law, and protection from coercion remain relevant.",
    sourceIds: ["secularism", "civilPoliticalRights", "liberalism"],
  },
  q0258: {
    contextNote:
      "This prescriptive item treats secularism as a limit on state power over conscience rather than a doctrine the state imposes. It does not require public institutions to erase all religious history or prohibit private conviction; neutrality, equal treatment, accommodation, and non-establishment can be arranged in different ways.",
    sourceIds: ["secularism", "liberalism", "civilPoliticalRights"],
  },
  q0259: {
    contextNote:
      "This normative item treats conscience as a personal moral faculty that cannot simply be delegated to a legislature, priesthood, or expert committee. It does not deny the need for shared law or institutional interpretation; it distinguishes personal responsibility from the authority to impose coercive rules on others.",
    sourceIds: ["secularism", "civilPoliticalRights", "liberalism"],
  },
  q0261: {
    contextNote:
      "This normative item protects adult household choice when arrangements do not rely on coercion or fraud. It does not resolve questions about children, dependents, property, inheritance, care, abuse, or legal recognition; consensual adult association and protection of vulnerable people are separate policy dimensions.",
    sourceIds: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
  },
  q0262: {
    contextNote:
      "This normative item treats gender norms as less legitimate when enforced by law rather than persuasion or association. It does not claim that informal norms are harmless or that all legal rules concerning sex are illegitimate; consent, equality, safety, family law, and protection from discrimination remain distinct considerations.",
    sourceIds: ["feministPolitics", "civilPoliticalRights", "liberalism"],
  },
  q0263: {
    contextNote:
      "This normative item gives social respect to unpaid and informal care work outside market employment. It does not specify who should pay for care or imply that all unpaid work is freely chosen; recognition, redistribution, dependency, family obligation, labor markets, and public provision are separate questions.",
    sourceIds: ["feministPolitics", "feministEthics", "distributiveJustice"],
  },
  q0264: {
    contextNote:
      "This normative item limits the moral force of formal consent when law, violence, or economic dependency blocks meaningful exit. It does not treat every unequal relationship as invalid or define one family form as ideal; the relevant distinction is between nominal agreement and agency under coercive constraint.",
    sourceIds: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
  },
  q0265: {
    contextNote:
      "This normative item rejects state enforcement of one model of masculinity, femininity, marriage, or parenthood. It does not prohibit public rules protecting children, preventing violence, or assigning legal responsibilities; it separates a state-prescribed social ideal from neutral rights and welfare safeguards.",
    sourceIds: ["feministPolitics", "civilPoliticalRights", "liberalism"],
  },
  q0266: {
    contextNote:
      "This normative item balances protection of children and dependents against criminalizing peaceful adult difference. It does not define every cultural disagreement as harmless or every intervention as justified; concrete abuse, neglect, capacity, consent, dependency, and equal legal standing require separate assessment.",
    sourceIds: ["feministPolitics", "civilPoliticalRights", "liberalism"],
  },
  q0275: {
    contextNote:
      "This prescriptive item limits child-welfare intervention to concrete abuse or neglect rather than mere deviation from dominant culture. It does not deny the need for protective action or culturally informed assessment; the policy boundary is between demonstrable harm and state enforcement of a majority norm.",
    sourceIds: ["feministPolitics", "civilPoliticalRights", "multiculturalism"],
  },
  q0276: {
    contextNote:
      "This prescriptive item favors caregiver support that does not lock people into dependence on employers or spouses. It does not prescribe cash, services, leave, public care, or workplace regulation, and it leaves open how support can protect both caregiver agency and the needs of children or dependents.",
    sourceIds: ["feministPolitics", "distributiveJustice", "labourRights"],
  },
  q0278: {
    contextNote:
      "This prescriptive item favors expanding real options rather than prescribing one route to liberation through market work, domestic work, or communal care. It does not treat all options as equally accessible or deny structural constraints; material resources, care, law, culture, and bargaining power affect whether choice is usable.",
    sourceIds: ["feministPolitics", "liberalism", "labourRights"],
  },
  q0279: {
    contextNote:
      "This normative item distinguishes a freely chosen role from the same role imposed by law or economic captivity. It does not assume that choice is always fully autonomous or that imposed roles are always visible; dependency, social sanctions, violence, resources, and meaningful exit shape the moral difference.",
    sourceIds: ["feministPolitics", "feministEthics", "liberalism"],
  },
  q0404: {
    contextNote:
      "This normative item favors public framing that does not assume one religion in ceremonies, schools, or official holidays. It does not require hostility to inherited traditions or prohibit voluntary religious observance; it concerns equal civic standing, public neutrality, accommodation, and state endorsement.",
    sourceIds: ["secularism", "civilPoliticalRights", "religionOfficialStatus"],
  },
  q0421: {
    contextNote:
      "This normative item treats gender and sexual hierarchy as unjust even when formal legal equality exists. It does not imply that every unequal outcome proves discrimination or specify one remedy; informal norms, care burdens, violence, economic dependence, representation, and institutional power are distinct mechanisms.",
    sourceIds: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
  },
  q0478: {
    contextNote:
      "This descriptive item concerns the durability of norm change when new behavior becomes publicly expected and socially reinforced. Legal permission may be necessary without being sufficient; enforcement, reference groups, sanctions, material incentives, and unequal effects can mediate whether a change persists across settings.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0479: {
    contextNote:
      "This descriptive item separates formal rule change from persistence of older informal expectations. It does not claim that law cannot change norms or that group sanctions always preserve the status quo; the timing and direction of change can depend on enforcement, institutions, social learning, and material dependence.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0446: {
    contextNote:
      "This normative item isolates a conflict between aggregate human welfare and the possibility that ecosystem destruction is independently wrong. It does not specify how welfare is measured, whether every ecosystem has equal standing, or which policy should resolve a concrete tradeoff.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0447: {
    contextNote:
      "This normative item distinguishes intrinsic nonhuman moral standing from human-interest stewardship. It does not settle whether standing belongs to individual organisms, species, ecosystems, or future ecological relationships.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0448: {
    contextNote:
      "This normative item tests a human-priority exception under costly alternatives. It does not define necessity, acceptable harm, property rights, or the threshold at which a cheaper human option becomes morally insufficient.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0449: {
    contextNote:
      "This normative item isolates conditional justification for defensive force. It leaves necessity, proportionality, civilian protection, and who may authorize force open rather than treating any claimed security interest as sufficient.",
    sourceIds: ["war", "unCharter"],
  },
  q0450: {
    contextNote:
      "This normative item tests a restraint on force when a less violent alternative can address the same immediate threat. It is not a general claim that nonviolent policy is always feasible or that military force is never permissible.",
    sourceIds: ["war", "unCharter"],
  },
  q0451: {
    contextNote:
      "This normative item concerns defensive force despite domestic burdens. It does not decide whether the burden should fall on conscripts, taxpayers, or volunteers, nor whether a particular war is necessary or lawful.",
    sourceIds: ["war", "civilPoliticalRights"],
  },
  q0452: {
    contextNote:
      "This normative item distinguishes symbolic recognition of religion from coercive establishment. Equal civic standing is held constant, but the item does not specify whether recognition includes funding, ceremonies, exemptions, or constitutional privilege.",
    sourceIds: ["secularism", "civilPoliticalRights"],
  },
  q0453: {
    contextNote:
      "This normative item tests neutrality toward a majority tradition, not hostility to religion. It leaves open whether public reasons may be religiously motivated and whether accommodation is compatible with equal citizenship.",
    sourceIds: ["secularism", "civilPoliticalRights"],
  },
  q0454: {
    contextNote:
      "This normative item isolates opposition to unchecked clerical legal authority. It does not imply that religious interpretation must be excluded from public life or that courts, elected officials, or constitutional texts are automatically neutral.",
    sourceIds: ["secularism", "civilPoliticalRights"],
  },
  q0455: {
    contextNote:
      "This descriptive item is scoped to accountability conditions in which voters can compare evidence and observe consequences. It does not imply that voters receive equal information, that elections select competent leaders, or that accountability always improves policy.",
    sourceIds: ["electoralInformation", "democracy"],
  },
  q0456: {
    contextNote:
      "This descriptive item isolates retrospective attribution failure under competitive elections. Identity cues and misinformation are possible mechanisms, not universal explanations, and the item does not claim that voters are incapable of learning.",
    sourceIds: ["electoralInformation", "democracy"],
  },
  q0457: {
    contextNote:
      "This descriptive item separates participation from information and deliberative quality. It does not imply that mass participation is harmful or that expert filtering reliably produces better decisions.",
    sourceIds: ["democracy", "democraticInnovations"],
  },
  q0458: {
    contextNote:
      "This descriptive item concerns institutional conditions that make expert advice more useful: independent checking, transparent methods, and reported uncertainty. It does not treat transparency as proof of correctness or as a replacement for authorization.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0459: {
    contextNote:
      "This descriptive item tests a public-choice risk within professional expertise. It does not assert that all expert bodies are captured or that ordinary political control is free of status and self-interest effects.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0460: {
    contextNote:
      "This descriptive item asks whether contestable and bounded expertise can improve public decisions. It leaves the quality of the evidence, the independence of reviewers, and the allocation of final authority open.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0461: {
    contextNote:
      "This descriptive item tests a mediated account of legal norm change: rules matter partly through enforcement and social incentives. It does not claim that law alone changes culture or that every norm responds at the same speed.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0462: {
    contextNote:
      "This descriptive item isolates persistence under stable relational and economic dependencies. It does not make path dependence permanent or deny that legal change can alter incentives and reference groups.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0463: {
    contextNote:
      "This descriptive item separates institutional influence on expectations from unanimous moral conversion. It does not specify whether the change is desirable, how coercive the institution is, or whether effects are equal across groups.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0464: {
    contextNote:
      "This prescriptive item measures conditional reform preference when reform can remove the injustice without preserving the same power. It does not presume that existing institutions are legitimate or that reform is always available.",
    sourceIds: ["politicalReform", "revolution"],
  },
  q0465: {
    contextNote:
      "This prescriptive item measures conditional support for replacement when a core institutional function is inseparable from domination and no credible reform path exists. It leaves the design and accountability of the replacement open.",
    sourceIds: ["revolution", "politicalReform"],
  },
  q0466: {
    contextNote:
      "This prescriptive item rejects disruption as a sufficient reason to expect revolutionary improvement. It does not reject disruptive tactics categorically or assume that existing institutions are more accountable.",
    sourceIds: ["revolution", "politicalReform"],
  },
  q0467: {
    contextNote:
      "This prescriptive item treats elections as a potentially useful movement tactic under a condition of continued independent organizing. It does not equate electoral work with party loyalty or passive institutionalism.",
    sourceIds: ["democracy", "electoralJustice", "politicalReform"],
  },
  q0468: {
    contextNote:
      "This prescriptive item tests direct action under repeated institutional exclusion. Direct action can include organizing, protest, strikes, or civil disobedience with different legal and coercive risks; it is not synonymous with violence.",
    sourceIds: ["civilDisobedience", "democracy", "revolution"],
  },
  q0469: {
    contextNote:
      "This prescriptive item measures opposition to electoral exclusivity rather than opposition to elections themselves. It leaves the relative value of organizing, protest, mutual aid, and office-holding open.",
    sourceIds: ["democracy", "civilDisobedience", "politicalReform"],
  },
  q0470: {
    contextNote:
      "This prescriptive item isolates conditional compromise: real gains plus a credible route to correction. It does not imply that every partial agreement is reversible or that immediate gains outweigh entrenched injustice.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0471: {
    contextNote:
      "This prescriptive item tests persistence when a settlement would permanently entrench the injustice. It does not require maximal demands in ordinary negotiation or deny the value of temporary gains that preserve future correction.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0472: {
    contextNote:
      "This prescriptive item treats verifiable concessions and revisability as conditions supporting negotiation. It does not claim that every issue is open to revision or that evidence and power are evenly distributed between opponents.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0473: {
    contextNote:
      "This descriptive item distinguishes what expert evidence can clarify from the normative choice among competing values and distributional priorities. It does not treat evidence as politically neutral, imply that experts should decide values, or deny that transparent assumptions, uncertainty, contestability, and public representation affect the usefulness of advice.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0427: {
    contextNote:
      "This normative item isolates the claim that species survival can have moral value independent of direct human benefit. It does not settle whether all species have equal standing, how ecological tradeoffs should be compared, or which institution should enforce a duty toward nonhuman life.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0428: {
    contextNote:
      "This normative item asks whether destruction can wrong a species or ecosystem even without a measurable human loss. It is distinct from stewardship for human welfare, aesthetic preference, biodiversity policy, and any particular theory of legal standing or conservation governance.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0429: {
    contextNote:
      "This normative item tests whether extraction claims are limited by effects on other species’ conditions of flourishing. It does not specify a property regime, a pollution instrument, a threshold for ecological harm, or how to weigh human needs against nonhuman interests in a concrete case.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0430: {
    contextNote:
      "This descriptive item is scoped to deliberative mini-publics and related democratic innovations where participants receive structured information and time to deliberate. Evidence of average knowledge gains does not establish that every deliberative design improves decisions, represents absent groups, or produces the same effect outside the studied settings.",
    sourceIds: ["democraticInnovations"],
  },
  q0431: {
    contextNote:
      "This descriptive item isolates an accountability mechanism: observable outcomes and credible alternatives can help voters connect performance to officeholders. Information effects vary with media, institutions, issue salience, and who receives the signal, so the item is not a claim that elections reliably select competent leaders in every setting.",
    sourceIds: ["electoralInformation", "democracy"],
  },
  q0432: {
    contextNote:
      "This descriptive item concerns incomplete or unequal electoral information rather than a blanket judgment about voters. Performance signals can be noisy, strategically supplied, or unevenly distributed, and information can alter accountability in different ways across voters, issues, and political environments.",
    sourceIds: ["electoralInformation", "democracy"],
  },
  q0433: {
    contextNote:
      "This descriptive item concerns the institutional conditions under which expert advice is more useful: transparent evidence, stated assumptions, uncertainty, and opportunities for challenge. It does not imply that expertise replaces democratic authorization or that transparency guarantees a correct recommendation.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0434: {
    contextNote:
      "This descriptive item isolates the risk that technical agencies become detached when their evidence and decisions are insulated from scrutiny. Independence can protect expertise from short-term pressure, while review and contestability can protect the public from insulation; the item does not treat either value as universally dominant.",
    sourceIds: ["evidenceGovernance", "democracy"],
  },
  q0435: {
    contextNote:
      "This descriptive item separates formal legal change from durable norm change. Enforcement, incentives, reference groups, public acceptance, and time can mediate whether a new rule changes expectations and behavior; agreement does not imply that law alone determines family or gender norms.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0436: {
    contextNote:
      "This prescriptive item measures a conditional preference for reform over rupture when ordinary action can materially reduce coercion. It does not say that existing institutions are generally legitimate, that reform is always available, or that disruptive action is never justified.",
    sourceIds: ["civilDisobedience", "revolution", "politicalReform"],
  },
  q0437: {
    contextNote:
      "This prescriptive item measures a conditional willingness to pursue revolutionary rupture when ordinary reform cannot remove a central injustice. It leaves open what counts as revolutionary, how feasibility and civilian risk are assessed, and whether a proposed replacement would be more accountable.",
    sourceIds: ["revolution", "civilDisobedience", "politicalReform"],
  },
  q0438: {
    contextNote:
      "This prescriptive item tests support for elections as one instrument within a broader movement strategy. It does not equate electoral participation with passive reliance on parties, and it leaves the meaning of durable gains, independent organizing, and institutional safeguards open to the respondent.",
    sourceIds: ["democracy", "electoralJustice", "politicalReform"],
  },
  q0439: {
    contextNote:
      "This prescriptive item tests whether direct action should supplement formal participation when affected people lack meaningful influence. Direct action can include organizing, protest, civil disobedience, strikes, or other tactics with different legal and coercive risks; it is not a synonym for violence or rejection of elections.",
    sourceIds: ["civilDisobedience", "democracy", "revolution"],
  },
  q0440: {
    contextNote:
      "This prescriptive item measures willingness to accept partial gains under a nonideal condition: material improvement plus a credible route to further change. It does not assume that every compromise is reversible or that a partial reform is worthwhile when it entrenches the underlying injustice.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0441: {
    contextNote:
      "This prescriptive item tests persistence when a compromise would entrench the injustice at issue. It does not require maximal demands in every negotiation; the relevant distinction is whether the agreement preserves or blocks meaningful correction and whether short-term gains justify that risk.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0442: {
    contextNote:
      "This prescriptive item treats revisability as a condition for compromise. Negotiation can be preferable when an agreement permits learning and correction, but the item does not imply that all evidence is neutral, all policy harms are reversible, or maximal demands are never necessary.",
    sourceIds: ["politicalReform", "civilDisobedience"],
  },
  q0443: {
    contextNote:
      "This prescriptive item tests a strong direct-action preference under a condition of systematic exclusion from meaningful influence. Direct action can include protest, strikes, civil disobedience, or other tactics with different legal and coercive risks; the condition does not imply that every formal institution is equally closed.",
    sourceIds: ["civilDisobedience", "democracy", "revolution"],
  },
  q0302: {
    contextNote:
      "This normative item isolates nonhuman standing from the separate question of who owns or governs a resource. Environmental ethics contains competing accounts of intrinsic value, rights, welfare, and stewardship; agreement does not select one conservation instrument or deny human needs.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0303: {
    contextNote:
      "This normative item connects the value of economic growth to ecological conditions for future choice. It does not define “improves lives,” assume one technology or ownership system, or claim that relative decoupling automatically satisfies absolute ecological limits.",
    sourceIds: ["environmentalEthics", "climateAssessment"],
  },
  q0322: {
    contextNote:
      "This normative item concerns the state’s use of its own population for prestige, empire, or ideological projects. It is distinct from whether defensive force can ever be justified and from empirical claims about military effectiveness, alliance behavior, or national security.",
    sourceIds: ["war", "unCharter"],
  },
  q0323: {
    contextNote:
      "This normative item distinguishes defense against attack from regime transformation abroad. It does not decide the legality or morality of every intervention, and separate judgments about necessity, proportionality, civilian protection, and postwar governance remain relevant.",
    sourceIds: ["war", "unCharter"],
  },
  q0339: {
    contextNote:
      "This normative item asks whether a government can claim moral credit for external freedom while imposing coercive burdens on conscripts and taxpayers at home. It concerns the relationship between means and justification, not whether taxation, military service, or foreign assistance is always impermissible.",
    sourceIds: ["war", "civilPoliticalRights"],
  },
  q0444: {
    contextNote:
      "This descriptive item separates formal legal change from the pace of change in gender and family practices. Enforcement, material dependence, reference groups, and public acceptance can mediate whether a new legal rule becomes ordinary behavior; the claim is not that law is irrelevant or that persistence is permanent.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0445: {
    contextNote:
      "This descriptive item tests whether campaigns and institutions can shift social expectations through incentives and reference-group behavior. Change can be gradual, contested, and uneven, and the item does not treat public messaging as sufficient without institutional support or enforcement.",
    sourceIds: ["socialNormChange", "feministPolitics"],
  },
  q0396: {
    contextNote:
      "This prescriptive item rejects revolutionary strategy under a specified institutional risk: predictable replacement by a less accountable ruling class. It does not define every revolution as harmful or imply that existing institutions deserve deference when reform cannot address the injustice.",
    sourceIds: ["revolution", "politicalReform"],
  },
  q0397: {
    contextNote:
      "This prescriptive item treats reform as a strategy that can build constituencies for further change, while warning against permanent administrative dependency. It does not claim that liberalization is the only legitimate direction or that all reforms have the same political feedback effects.",
    sourceIds: ["politicalReform", "revolution"],
  },
  q0412: {
    contextNote:
      "This prescriptive item isolates willingness to centralize authority during a revolutionary transition away from capitalism. It raises a distinct question from the justice of the goal: transitional concentration can affect accountability, coercion, opposition, and the institutions that emerge afterward.",
    sourceIds: ["revolution", "democracy"],
  },
  q0016: {
    contextNote:
      "This prescriptive item tests sequencing: abolition of state functions is preferred only alongside credible replacement institutions. It does not establish that gradual change is always better, that replacement institutions must be centralized, or that existing state functions are legitimate by default.",
    sourceIds: ["politicalReform", "revolution", "civilDisobedience"],
  },
  q0413: {
    contextNote:
      "This prescriptive item distinguishes organized shared strategy from purely spontaneous or affinity-based action. Collective discipline can improve coordination while creating risks of hierarchy and coercion; support for it does not specify a party structure or reject decentralization altogether.",
    sourceIds: ["civilDisobedience", "democracy", "revolution"],
  },
  q0423: {
    contextNote:
      "This prescriptive item isolates willingness to accept a partial negotiated welfare expansion when the full reform cannot pass. It does not settle whether the policy is universal or targeted, whether partial implementation is administratively sound, or whether the compromise leaves a credible path to further change.",
    sourceIds: ["politicalReform", "distributiveJustice"],
  },
  q0135: {
    contextNote:
      "This prescriptive item concerns bank resolution rather than ordinary bankruptcy or monetary policy. Resolution standards distinguish shareholders, unsecured or uninsured creditors, insured depositors, and public solvency support; jurisdictions vary in the exact hierarchy and safeguards, and management accountability is a separate governance question.",
    sourceIds: ["bankResolution", "bankFailureResolution"],
  },
  q0029: {
    contextNote:
      "This descriptive item concerns one mechanism that can help sustain ownership concentration: political access that creates entry barriers or other advantages for incumbents. The cited policy-capture and competition research does not imply that every concentration is politically created; technology, scale, network effects, and consumer demand remain separate explanations, and an association with access is not by itself proof of unlawful capture.",
    sourceIds: ["policyCapture", "competitionAssessment"],
  },
  q0127: {
    contextNote:
      "This descriptive item is conditional on users being able to compare issuers and switch at low cost. Competition may discipline some issuers, but redeemability, reserves, network effects, confidence, runs, settlement, and consumer protection can alter the result; historical private notes and contemporary digital systems are not interchangeable evidence.",
    sourceIds: ["currencyCompetition", "bankNotesStablecoins"],
  },
  q0208: {
    contextNote:
      "This descriptive item is scoped to U.S. industry-level immigration and H-1B data linked to lobbying expenditures. The reported relationship compares sectors and organized-group influence; it is an association with model-based inferences, not a universal causal law about all migration restrictions, workers, or bargaining power, and sector demand may affect both lobbying and policy.",
    sourceIds: ["immigrationInterestGroups"],
  },
  q0227: {
    contextNote:
      "This descriptive item is scoped to paired studies of Indian cities that compared stronger interethnic civic associations with mainly intraethnic networks. The evidence concerns associations and communal violence in those cases; it does not show that civic rituals alone build trust, that all intraethnic organization is harmful, or that the relationship is a universal city-level law.",
    sourceIds: ["interethnicCivicNetworks"],
  },
  q0329: {
    contextNote:
      "This descriptive item is scoped to U.S. federal defense procurement around the post-September 11 spending increase. The study reports larger awards for politically connected or lobbying firms, but warns that its data do not identify causality; the result does not establish that every contractor, security agency, or public threat assessment benefits from inflationary rhetoric.",
    sourceIds: ["politicalConnectionsDefenseContracts"],
  },
  q0347: {
    contextNote:
      "This descriptive item is scoped to a meta-analysis of 100 quantitative studies of deliberative mini-publics in established democracies. Its clearest average participant-level capability effect was increased political knowledge; effects on attitudes, behavior, deliberative quality, and decisions vary by design, so the finding does not prove that every deliberative process works better or internalizes absent groups’ costs.",
    sourceIds: ["democraticInnovations"],
  },
  q0350: {
    contextNote:
      "This descriptive item is scoped to documented democratic backsliding episodes in which governing actors sometimes weakened checks through formal or informal institutional changes. Flexible interpretation is one possible mechanism among many, and the evidence does not imply that courts, parties, or agencies always benefit from erosion or that constitutional constraints inevitably fail.",
    sourceIds: ["democraticBacksliding"],
  },
  q0136: {
    contextNote:
      "This prescriptive item concerns permission to hold or use alternative forms of money. Private, foreign, commodity-linked, and digital instruments differ in legal-tender status, redemption, consumer protection, fraud exposure, run risk, and payment-system effects; support for currency choice does not imply that all forms are interchangeable.",
    sourceIds: ["privateMoneyPayments", "monetaryPolicy"],
  },
  q0318: {
    contextNote:
      "This prescriptive item compares technology-and-efficiency strategies with broad consumption limits. Carbon intensity, energy intensity, material intensity, GDP growth, and absolute emissions are distinct measures; observed decoupling varies across countries and periods and is not by itself sufficient for climate stabilization.",
    sourceIds: ["climateDecoupling", "climateAssessment"],
  },
  q0007: {
    contextNote:
      "This descriptive item is scoped to U.S. metropolitan police-service comparisons in Ostrom’s research. “Autonomous providers” refers to multiple service-producing units and their relative output or efficiency, not necessarily privatization, competitive contracting, or reliable individual exit; the result should not be generalized to every public service.",
    sourceIds: ["polycentricGovernance"],
  },
  q0067: {
    contextNote:
      "This descriptive item is scoped to a randomized interview-timing study of SNAP recertification cases in San Francisco. Later interview assignments reduced recertification and subsequent participation for affected cases, while many people re-enrolled; the result identifies an administrative-burden margin rather than proving that every closed case was eligible or that all welfare programs respond identically.",
    sourceIds: ["snapRecertification"],
  },
  q0107: {
    contextNote:
      "This descriptive item is scoped to high-cost metropolitan housing markets where land-use controls may constrain construction. The cited zoning research connects restrictive controls with higher housing costs but describes its evidence as suggestive and does not by itself settle density, displacement, segregation, infrastructure, or distributional effects.",
    sourceIds: ["housingSupply"],
  },
};
