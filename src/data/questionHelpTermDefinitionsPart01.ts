import type { TermDefinition } from "./questionHelpTermDefinitionTypes";
import { academicTermDictionary } from "./academicTermDictionary";

export const questionHelpTermDefinitionsPart01: TermDefinition[] = [
  ...academicTermDictionary,
  {
    pattern: /\bexit(?: rights| options|)\b|\bopt[- ]out\b/i,
    definition:
      "“Exit” means leaving a relationship, organization, jurisdiction, or provider, or choosing an alternative. It describes a different response from trying to change the institution from within.",
  },
  {
    pattern: /\bpolitical authority\b/i,
    definition:
      "“Political authority” means a claimed right to make and enforce rules over other people.",
  },
  {
    pattern: /\bterritorial monopoly\b|\bmonopoly government\b/i,
    definition:
      "“Territorial monopoly” means one institution claims exclusive control over law or services in a geographic area.",
  },
  {
    pattern: /\bpublic goods?\b/i,
    definition:
      "“Public goods” means benefits that are difficult to exclude people from and that one person can use without substantially reducing others’ use, such as national defense.",
  },
  {
    pattern: /\bjurisdictions?\b/i,
    definition:
      "“Jurisdiction” means the area, people or subject matter an institution claims authority over.",
  },
  {
    pattern: /\bsovereign\b/i,
    definition:
      "“Sovereign” means a final political authority that claims no higher earthly authority above it.",
  },
  {
    pattern: /\barbitration\b/i,
    definition:
      "“Arbitration” means resolving disputes through a third party outside ordinary court litigation.",
  },
  {
    pattern: /\binstitutional design\b/i,
    definition:
      "“Institutional design” means the rules, incentives and checks built into organizations or political systems.",
  },
  {
    pattern: /\bcivil liberties\b/i,
    definition:
      "“Civil liberties” means protections for speech, conscience, privacy, due process and other individual rights.",
  },
  {
    pattern: /\bproductive assets?\b/i,
    definition:
      "“Productive assets” means resources used to produce goods or services, such as land, tools, factories, capital or software.",
  },
  {
    pattern: /\bprivate property\b/i,
    definition:
      "“Private property” means enforceable control over resources by individuals, firms or private groups rather than the state or a commons.",
  },
  {
    pattern: /\bproperty claims?\b|\bprivate title\b|\bownership claims?\b/i,
    definition:
      "“Property claims” means asserted rights to control, use, exclude others from or transfer a resource.",
  },
  {
    pattern: /\brectif(?:y|ying|ication)\b/i,
    definition:
      "“Rectification” means correcting losses or advantages created by past coercion, theft or unjust privilege.",
  },
  {
    pattern: /\bartificial scarcity\b/i,
    definition:
      "“Artificial scarcity” means scarcity created by legal or institutional barriers rather than by physical limits.",
  },
  {
    pattern: /\benclosure\b/i,
    definition:
      "“Enclosure” means converting shared or commonly used resources into exclusive controlled property.",
  },
  {
    pattern: /\bnationalization\b/i,
    definition:
      "“Nationalization” means transferring ownership or control of an industry or asset to the state.",
  },
  {
    pattern: /\bcooperatives?\b/i,
    definition:
      "“Cooperatives” means organizations owned or governed by members, workers, customers or users.",
  },
  {
    pattern: /\bmutual[- ]aid\b/i,
    definition:
      "“Mutual aid” means people supporting one another through reciprocal, cooperative networks, usually organized by the participants themselves.",
  },
  {
    pattern: /\bpredistribution\b/i,
    definition:
      "“Predistribution” means changing the rules that shape income and power before market outcomes happen.",
  },
  {
    pattern: /\bredistribution\b/i,
    definition:
      "“Redistribution” means transferring resources after income or wealth has already been allocated.",
  },
  {
    pattern: /\bvoluntary (?:exchange|markets?)\b/i,
    definition:
      "“Voluntary exchange” means people trading or cooperating by consent rather than force.",
  },
  {
    pattern: /\bprices?\b/i,
    definition:
      "“Price” means the amount paid or received for a good, service or resource in an exchange.",
  },
  {
    pattern: /\bcentralized planning\b|\bplanning\b|\bplanners?\b/i,
    definition:
      "“Economic planning” means deliberately coordinating production or allocation through collective or administrative decisions; it can be centralized or decentralized.",
    domains: ["markets-planning"],
  },
  {
    pattern: /\bmarket outcomes?\b/i,
    definition:
      "“Market outcomes” means the prices, wages, profits, losses and allocations that result from exchange.",
  },
  {
    pattern: /\bmeans-tested\b/i,
    definition:
      "“Means-tested programs” means benefits or services with eligibility limited by income, assets or other measures of need.",
  },
  {
    pattern: /\buniversal transfers?\b/i,
    definition:
      "“Universal transfers” means cash or benefits provided broadly rather than only to narrowly screened groups.",
  },
  {
    pattern:
      /\b(?:regulatory|agency|bureaucratic) capture\b|\banti-capture\b|\bcaptured (?:agency|regulator|regulation)\b/i,
    definition:
      "“Capture” means agencies or rules serving organized insiders more than the general public.",
  },
  {
    pattern: /\b(?:collective|public-sector|public sector) bargaining\b/i,
    definition:
      "“Collective bargaining” means workers negotiating pay, hours or conditions as a group.",
  },
  {
    pattern: /\bunions?\b/i,
    definition:
      "“Unions” means worker organizations that bargain collectively with employers over pay, conditions and workplace rules.",
  },
  {
    pattern: /\bmonopson(?:y|istic)\b/i,
    definition:
      "“Monopsony” means a market in which workers or sellers face only one buyer, or too few buyers to bargain on equal terms.",
  },
  {
    pattern: /\bworkplace governance\b/i,
    definition:
      "“Workplace governance” means who has authority and voice over decisions inside a workplace.",
  },
  {
    pattern:
      /\bzoning\b|\b(?:building|construction|development|land[- ]use) permits?\b|\bpermit(?:ting)? (?:housing|construction|development)\b/i,
    definition:
      "“Zoning and permitting” means local rules that decide what can be built, where and under what conditions.",
  },
  {
    pattern:
      /\bland values?\b|\bGeorgism\b|\bland rents?\b|\brental value of land\b/i,
    definition:
      "“Land value” means the site value of land apart from buildings or improvements placed on it.",
  },
  {
    pattern: /\bintellectual property\b/i,
    definition:
      "“Intellectual property” means legal control over copying or using ideas, inventions, software, art or information.",
  },
  {
    pattern: /\bpatents?\b/i,
    definition:
      "“Patent” means a time-limited legal right to exclude others from making or using a claimed invention.",
  },
  {
    pattern: /\bcopyright\b/i,
    definition:
      "“Copyright” means legal control over copying and specified uses of an original creative work for a limited period.",
  },
  {
    pattern: /\bdiversion\b/i,
    definition:
      "“Diversion” means sending cases away from punishment and toward treatment, supervision, restitution or support.",
  },
  {
    pattern: /\bdue process\b/i,
    definition:
      "“Due process” means fair procedures before the state may punish, restrict or deprive someone of rights or property.",
  },
  {
    pattern: /\brestorative\b/i,
    definition:
      "“Restorative approaches” means focusing on repairing harm and accountability rather than only punishment.",
  },
  {
    pattern: /\bincarcerat(?:e|ion)\b|\bsentencing\b/i,
    definition:
      "“Incarceration and sentencing” means confinement and legal punishment after a criminal conviction.",
  },
  {
    pattern: /\bpolitical community\b/i,
    definition:
      "“Political community” means the group treated as sharing special political membership or obligations.",
  },
  {
    pattern: /\bsovereignty\b|\bself-determination\b/i,
    definition:
      "“Sovereignty” means a political community’s claimed authority to govern itself and resist outside control.",
  },
  {
    pattern: /\bsecular(?:ism)?\b/i,
    definition:
      "“Secularism” means public institutions staying neutral among religions and non-religion.",
  },
  {
    pattern: /\bmoral traditionalism\b|\btraditional\b/i,
    definition:
      "“Traditionalism” means giving weight to inherited social, family or moral norms.",
  },
  {
    pattern: /\bassimilation\b|\bmulticulturalism\b/i,
    definition:
      "“Assimilation and multiculturalism” means how a society handles cultural difference, integration and shared norms.",
  },
  {
    pattern: /\becological limits?\b/i,
    definition:
      "“Ecological limits” means environmental constraints that can affect production, health and long-run welfare.",
  },
  {
    pattern: /\bexternalit(?:y|ies)\b/i,
    definition:
      "“Externalities” means costs or benefits of an action that fall on people who did not choose it.",
  },
  {
    pattern: /\bcarbon pricing\b|\bcarbon tax\b/i,
    definition:
      "“Carbon pricing” means charging for greenhouse-gas emissions so their climate cost affects decisions.",
  },
  {
    pattern: /\bnuclear power\b/i,
    definition:
      "“Nuclear power” means electricity generated from controlled nuclear reactions rather than fossil fuel combustion.",
  },
  {
    pattern: /\bintervention\b|\bmilitary force\b|\bwar\b/i,
    definition:
      "“Intervention” means using diplomatic, economic or military power to affect conditions outside one’s own country.",
    domains: ["foreign-policy-war"],
  },
  {
    pattern: /\bsanctions?\b/i,
    definition:
      "“Sanctions” means economic or legal penalties used to pressure another government, group or country.",
    domains: ["foreign-policy-war"],
  },
  {
    pattern: /\bpacifism\b|\bmilitarism\b/i,
    definition:
      "“Militarism and pacifism” means opposing views about whether force is a normal policy tool or nearly always wrong.",
  },
  {
    pattern: /\bconstitutionalism\b|\bconstitutions?\b/i,
    definition:
      "“Constitutionalism” means limiting political power through higher rules that ordinary officials cannot easily override.",
  },
  {
    pattern: /\btechnocrats?\b|\btechnocracy\b/i,
    definition:
      "“Technocrats” means officials or advisers chosen for specialized expertise rather than electoral representation.",
  },
  {
    pattern: /\bmajoritarian\b|\bmajority (?:rule|vote|voting)\b/i,
    definition:
      "“Majoritarian decision-making” means choices are made mainly by majority vote.",
  },
  {
    pattern: /\bsurveillance\b/i,
    definition:
      "“Surveillance” means systematic monitoring of people, behavior, communications or data.",
  },
  {
    pattern: /\bAI\b|\bartificial intelligence\b/i,
    definition:
      "“AI” means software systems that perform tasks normally associated with human reasoning, prediction or generation.",
  },
  {
    pattern: /\bdirect action\b/i,
    definition:
      "“Direct action” means pursuing change without relying on elected or administrative intermediaries—for example through strikes, boycotts, occupations, or building alternatives; it is not necessarily violent.",
  },
  {
    pattern: /\bcivil disobedience\b/i,
    definition:
      "“Civil disobedience” means a deliberate, usually public breach of law intended to protest or change an injustice; traditions disagree about whether accepting punishment is required.",
  },
  {
    pattern: /\breform\b|\brevolution\b/i,
    definition:
      "“Reform” means changing existing institutions; “revolution” means replacing them more fundamentally.",
    domains: ["strategy-change"],
  },
  {
    pattern:
      /\bcentralization\b|\bdecentralization\b|\bcentralized\b|\bdecentralized\b/i,
    definition:
      "“Centralization” means concentrating decision-making in fewer authorities; “decentralization” disperses it.",
  },
  {
    pattern: /\bcoercion\b|\bcoercive\b/i,
    definition:
      "“Coercion” means using force, threats or compulsory authority rather than consent.",
  },
  {
    pattern:
      /\bcompeting (?:legal systems?|courts?|(?:private )?protection agencies)\b|\bmonopolistic courts?\b/i,
    definition:
      "“Competing legal or protection systems” means several providers of law, courts or protection operating in the same area instead of one monopoly provider.",
  },
  {
    pattern: /\bextortion\b/i,
    definition:
      "“Extortion” means obtaining something through threats or coercion rather than consent.",
  },
  {
    pattern: /\babolition\b|\babolish(?:ing|ed)?\b/i,
    definition:
      "“Abolition” means completely eliminating an institution or practice rather than reforming it.",
  },
  {
    pattern: /\bbarriers? to entry\b/i,
    definition:
      "“Barriers to entry” means costs or rules that make it harder for new competitors to enter a market.",
  },
  {
    pattern: /\bantitrust\b/i,
    definition:
      "“Antitrust” means laws aimed at preventing monopolies and anti-competitive business practices.",
  },
  {
    pattern: /\bblack markets?\b/i,
    definition:
      "“Black markets” means illegal trade that happens outside, or in defiance of, legal regulation.",
  },
  {
    pattern: /\bexploitation\b/i,
    definition:
      "“Exploitation” means a contested accusation that one party benefits from another under unfair terms. Traditions disagree about what makes the terms unfair.",
  },
  {
    pattern: /\bwealth tax(?:es)?\b/i,
    definition:
      "“Wealth tax” means a tax on the total value of what someone owns, not just their income.",
  },
  {
    pattern: /\buniversal basic income\b|\bUBI\b/,
    definition:
      "“Universal basic income” means a regular, unconditional cash payment given to everyone regardless of need or work.",
  },
  {
    pattern: /\bresource rents?\b|\bnatural-resource rents?\b/i,
    definition:
      "“Resource rents” means the income a natural resource generates beyond what it costs to extract or use it.",
  },
  {
    pattern: /\bcliffs?\b/i,
    definition:
      "“Benefit cliffs” means sudden losses of assistance when earnings cross a threshold, instead of benefits phasing out gradually.",
  },
  {
    pattern: /\bminimum labor standards?\b/i,
    definition:
      "“Minimum labor standards” means legal floors, such as minimum wage, safety rules or required benefits, that employers must meet.",
  },
  {
    pattern: /\bindustrial democracy\b/i,
    definition:
      "“Industrial democracy” means giving workers a formal voice or vote in how their workplace is run.",
  },
  {
    pattern: /\boccupational[- ]licensing\b/i,
    definition:
      "“Occupational licensing” means government permission required before someone may legally work in a trade or profession.",
  },
  {
    pattern: /\bland[- ]value tax(?:ation)?\b/i,
    definition:
      "“Land-value tax” means taxing the value of land itself, separate from any buildings or improvements on it.",
  },
  {
    pattern: /\brent control\b/i,
    definition:
      "“Rent control” means government limits on how much, or how fast, landlords may raise rent.",
  },
  {
    pattern: /\bcapital[- ]reserve mandates?\b|\breserve requirements?\b/i,
    definition:
      "“Capital and reserve requirements” means rules forcing banks to hold a minimum cushion of funds rather than lending out everything they take in.",
  },
  {
    pattern: /\bdeposit insurance\b/i,
    definition:
      "“Deposit insurance” means a government guarantee that depositors get their money back if a bank fails.",
  },
  {
    pattern: /\blender[- ]of[- ]last[- ]resort\b/i,
    definition:
      "“Lender of last resort” means a central bank’s role of lending, in a crisis, to banks that are short on cash but otherwise solvent, when no one else will.",
  },
  {
    pattern: /\bmutual credit\b/i,
    definition:
      "“Mutual credit” means members create reciprocal credits and debts within a shared accounting system; designs differ on fees, interest, governance, and intermediaries.",
  },
  {
    pattern: /\bcompet(?:ing|itive) (?:currenc(?:y|ies)|monies)\b/i,
    definition:
      "“Competing currencies” means allowing multiple forms of money to circulate so people can choose between them instead of using one government-issued currency.",
  },
  {
    pattern: /\bmoney monopoly\b/i,
    definition:
      "“Money monopoly” means a single legally privileged currency issuer with no competing alternative.",
  },
  {
    pattern: /\bcredit allocation\b/i,
    definition:
      "“Credit allocation” means decisions about who receives loans and on what terms.",
  },
  {
    pattern: /\bthreat inflation\b/i,
    definition:
      "“Threat inflation” means exaggerating a danger’s probability or severity to build support for a policy or institution.",
    domains: ["foreign-policy-war"],
  },
  {
    pattern: /\binflation\b/i,
    definition:
      "“Inflation” means a general rise in prices that reduces the purchasing power of money over time.",
    domains: ["money-banking"],
  },
  {
    pattern: /\bbailouts?\b/i,
    definition:
      "“Bailouts” means government financial rescues of failing companies or banks.",
  },
  {
    pattern: /\bdiscretionary monetary policy\b/i,
    definition:
      "“Discretionary monetary policy” means central bankers adjusting policy case by case based on judgment, rather than following a preset rule.",
  },
  {
    pattern: /\brules[- ]based (?:monetary )?frameworks?\b/i,
    definition:
      "“Rules-based framework” means policy bound by a preset formula rather than left to officials’ discretion.",
  },
  {
    pattern: /\basylum\b/i,
    definition:
      "“Asylum” means legal protection granted to someone fleeing persecution in their home country.",
  },
  {
    pattern: /\binterior enforcement\b/i,
    definition:
      "“Interior enforcement” means immigration enforcement carried out away from the border, inside the country.",
  },
  {
    pattern: /\bconscription\b/i,
    definition:
      "“Conscription” means compulsory enlistment of people into military service.",
  },
  {
    pattern: /\bblowback\b/i,
    definition:
      "“Blowback” means unintended harmful consequences, often retaliation, that follow from a policy or military action.",
  },
];
