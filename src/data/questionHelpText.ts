import type { Question } from '../types'
import { academicTermDictionary } from './academicTermDictionary'
import { domainById } from './domains'

interface TermDefinition {
  pattern: RegExp
  definition: string
}

const DOMAIN_DEFINITIONS: Record<string, string> = {
  'state-legitimacy': '“Political legitimacy” means whether an institution has a justified right to rule, tax, enforce rules or settle disputes.',
  'property-ownership': '“Property rules” means the rules deciding who may use, exclude others from or transfer resources.',
  'markets-planning': '“Economic coordination” means how people, firms and institutions align plans and allocate scarce resources.',
  'redistribution-welfare': '“Welfare policy” means the rules and programs used to address material need or redistribute resources.',
  'labor-unions-workplace': '“Workplace governance” means how authority, bargaining power and decision-making are arranged at work.',
  'land-housing-georgism': '“Land-use policy” means zoning, permitting, land taxes and other rules shaping where housing and business activity can happen.',
  'money-banking': '“Monetary policy” means how money, credit, interest rates and financial stability are managed.',
  'intellectual-property-information': '“Intellectual property” means legal control over copying or using ideas, inventions, software, art or information.',
  'civil-liberties-speech': '“Civil liberties” means protections for individual expression, conscience, privacy and due process.',
  'crime-policing-justice': '“Justice policy” means policing, courts, punishment, diversion, accountability and repair after harm.',
  'immigration-borders': '“Border policy” means rules about who may enter, leave, live or work across political boundaries.',
  'national-identity-sovereignty': '“Sovereignty” means a political community’s claimed authority to govern itself and resist outside control.',
  'religion-secularism': '“Secularism” means public institutions staying neutral among religions and non-religion.',
  'family-gender-feminism': '“Social norms” means shared expectations about family life, gender roles, sex and personal conduct.',
  'race-ethnicity-multiculturalism': '“Assimilation and multiculturalism” means how a society handles cultural difference, integration and historical inequity.',
  'environment-climate-growth': '“Ecological limits” means environmental constraints that can affect production, health and long-run welfare.',
  'foreign-policy-war': '“Foreign policy” means decisions about war, alliances, sanctions, diplomacy and involvement beyond national borders.',
  'democracy-expertise-constitutionalism': '“Institutional decision-making” means how collective choices are made and constrained by voters, experts, courts or constitutions.',
  'technology-ai-surveillance': '“Technology governance” means rules and institutions that shape how new tools, data systems and AI are used.',
  'strategy-change': '“Political strategy” means the route used to pursue change, such as reform, elections, organizing or direct action.',
}

const TERM_DEFINITIONS: TermDefinition[] = [
  ...academicTermDictionary,
  {
    pattern: /\bexit(?: rights| options|)\b|\bopt[- ]out\b/i,
    definition: '“Exit” means a real ability to leave, opt out or choose another provider.',
  },
  {
    pattern: /\bpolitical authority\b/i,
    definition: '“Political authority” means a claimed right to make and enforce rules over other people.',
  },
  {
    pattern: /\bterritorial monopoly\b|\bmonopoly government\b/i,
    definition: '“Territorial monopoly” means one institution claims exclusive control over law or services in a geographic area.',
  },
  {
    pattern: /\bpublic goods?\b/i,
    definition: '“Public goods” means benefits that are hard to limit to paying users, such as national defense or clean air.',
  },
  {
    pattern: /\bjurisdictions?\b/i,
    definition: '“Jurisdiction” means the area, people or subject matter an institution claims authority over.',
  },
  {
    pattern: /\bsovereign\b/i,
    definition: '“Sovereign” means a final political authority that claims no higher earthly authority above it.',
  },
  {
    pattern: /\barbitration\b/i,
    definition: '“Arbitration” means resolving disputes through a third party outside ordinary court litigation.',
  },
  {
    pattern: /\binstitutional design\b/i,
    definition: '“Institutional design” means the rules, incentives and checks built into organizations or political systems.',
  },
  {
    pattern: /\bcivil liberties\b/i,
    definition: '“Civil liberties” means protections for speech, conscience, privacy, due process and other individual rights.',
  },
  {
    pattern: /\bproductive assets?\b/i,
    definition: '“Productive assets” means resources used to produce goods or services, such as land, tools, factories, capital or software.',
  },
  {
    pattern: /\bprivate property\b/i,
    definition: '“Private property” means enforceable control over resources by individuals, firms or private groups rather than the state or a commons.',
  },
  {
    pattern: /\bproperty claims?\b|\bprivate title\b|\bownership claims?\b/i,
    definition: '“Property claims” means asserted rights to control, use, exclude others from or transfer a resource.',
  },
  {
    pattern: /\brectif(?:y|ying|ication)\b/i,
    definition: '“Rectification” means correcting losses or advantages created by past coercion, theft or unjust privilege.',
  },
  {
    pattern: /\bartificial scarcity\b/i,
    definition: '“Artificial scarcity” means scarcity created by legal or institutional barriers rather than by physical limits.',
  },
  {
    pattern: /\benclosure\b/i,
    definition: '“Enclosure” means converting shared or commonly used resources into exclusive controlled property.',
  },
  {
    pattern: /\bnationalization\b/i,
    definition: '“Nationalization” means transferring ownership or control of an industry or asset to the state.',
  },
  {
    pattern: /\bcooperatives?\b/i,
    definition: '“Cooperatives” means organizations owned or governed by members, workers, customers or users.',
  },
  {
    pattern: /\bmutual[- ]aid\b/i,
    definition: '“Mutual aid” means voluntary support networks where people help one another without relying on a central agency.',
  },
  {
    pattern: /\bpredistribution\b/i,
    definition: '“Predistribution” means changing the rules that shape income and power before market outcomes happen.',
  },
  {
    pattern: /\bredistribution\b/i,
    definition: '“Redistribution” means transferring resources after income or wealth has already been allocated.',
  },
  {
    pattern: /\bvoluntary (?:exchange|markets?)\b/i,
    definition: '“Voluntary exchange” means people trading or cooperating by consent rather than force.',
  },
  {
    pattern: /\bprices?\b/i,
    definition: '“Prices” means signals that reflect what people are willing to pay or accept for goods, services or resources.',
  },
  {
    pattern: /\bcentralized planning\b|\bplanning\b|\bplanners?\b/i,
    definition: '“Planning” means decisions about production or allocation made through administrative direction rather than decentralized exchange.',
  },
  {
    pattern: /\bmarket outcomes?\b/i,
    definition: '“Market outcomes” means the prices, wages, profits, losses and allocations that result from exchange.',
  },
  {
    pattern: /\bmeans-tested\b/i,
    definition: '“Means-tested programs” means benefits or services with eligibility limited by income, assets or other measures of need.',
  },
  {
    pattern: /\buniversal transfers?\b/i,
    definition: '“Universal transfers” means cash or benefits provided broadly rather than only to narrowly screened groups.',
  },
  {
    pattern: /\badministrative capacity\b/i,
    definition: '“Administrative capacity” means an institution’s practical ability to implement rules and deliver services well.',
  },
  {
    pattern: /\bpublic choice\b|\bcapture\b|\bcaptured\b/i,
    definition: '“Capture” means agencies or rules serving organized insiders more than the general public.',
  },
  {
    pattern: /\b(?:collective|public-sector|public sector) bargaining\b/i,
    definition: '“Collective bargaining” means workers negotiating pay, hours or conditions as a group.',
  },
  {
    pattern: /\bunions?\b/i,
    definition: '“Unions” means worker organizations that bargain collectively with employers over pay, conditions and workplace rules.',
  },
  {
    pattern: /\bworkplace governance\b/i,
    definition: '“Workplace governance” means who has authority and voice over decisions inside a workplace.',
  },
  {
    pattern: /\bzoning\b|\bpermitting\b/i,
    definition: '“Zoning and permitting” means local rules that decide what can be built, where and under what conditions.',
  },
  {
    pattern: /\bland value\b|\bGeorgism\b/i,
    definition: '“Land value” means the site value of land apart from buildings or improvements placed on it.',
  },
  {
    pattern: /\bintellectual property\b/i,
    definition: '“Intellectual property” means legal control over copying or using ideas, inventions, software, art or information.',
  },
  {
    pattern: /\bpatents?\b|\bcopyright\b/i,
    definition: '“Patent and copyright” means legal exclusivity over inventions or creative works for a limited period.',
  },
  {
    pattern: /\bdiversion\b/i,
    definition: '“Diversion” means sending cases away from punishment and toward treatment, supervision, restitution or support.',
  },
  {
    pattern: /\bdue process\b/i,
    definition: '“Due process” means fair procedures before the state may punish, restrict or deprive someone of rights or property.',
  },
  {
    pattern: /\brestorative\b/i,
    definition: '“Restorative approaches” means focusing on repairing harm and accountability rather than only punishment.',
  },
  {
    pattern: /\bincarcerat(?:e|ion)\b|\bsentencing\b/i,
    definition: '“Incarceration and sentencing” means confinement and legal punishment after a criminal conviction.',
  },
  {
    pattern: /\bpolitical community\b/i,
    definition: '“Political community” means the group treated as sharing special political membership or obligations.',
  },
  {
    pattern: /\bsovereignty\b|\bself-determination\b/i,
    definition: '“Sovereignty” means a political community’s claimed authority to govern itself and resist outside control.',
  },
  {
    pattern: /\bsecular(?:ism)?\b/i,
    definition: '“Secularism” means public institutions staying neutral among religions and non-religion.',
  },
  {
    pattern: /\bmoral traditionalism\b|\btraditional\b/i,
    definition: '“Traditionalism” means giving weight to inherited social, family or moral norms.',
  },
  {
    pattern: /\bassimilation\b|\bmulticulturalism\b/i,
    definition: '“Assimilation and multiculturalism” means how a society handles cultural difference, integration and shared norms.',
  },
  {
    pattern: /\becological limits?\b/i,
    definition: '“Ecological limits” means environmental constraints that can affect production, health and long-run welfare.',
  },
  {
    pattern: /\bexternalit(?:y|ies)\b/i,
    definition: '“Externalities” means costs or benefits of an action that fall on people who did not choose it.',
  },
  {
    pattern: /\bcarbon pricing\b|\bcarbon tax\b/i,
    definition: '“Carbon pricing” means charging for greenhouse-gas emissions so their climate cost affects decisions.',
  },
  {
    pattern: /\bnuclear power\b/i,
    definition: '“Nuclear power” means electricity generated from controlled nuclear reactions rather than fossil fuel combustion.',
  },
  {
    pattern: /\bintervention\b|\bmilitary force\b|\bwar\b/i,
    definition: '“Intervention” means using diplomatic, economic or military power to affect conditions outside one’s own country.',
  },
  {
    pattern: /\bsanctions?\b/i,
    definition: '“Sanctions” means economic or legal penalties used to pressure another government, group or country.',
  },
  {
    pattern: /\bpacifism\b|\bmilitarism\b/i,
    definition: '“Militarism and pacifism” means opposing views about whether force is a normal policy tool or nearly always wrong.',
  },
  {
    pattern: /\bconstitutionalism\b|\bconstitution\b/i,
    definition: '“Constitutionalism” means limiting political power through higher rules that ordinary officials cannot easily override.',
  },
  {
    pattern: /\btechnocrats?\b|\btechnocracy\b|\bexpert\b/i,
    definition: '“Technocrats” means officials or advisers chosen for specialized expertise rather than electoral representation.',
  },
  {
    pattern: /\bmajoritarian\b|\bdemocratic\b/i,
    definition: '“Majoritarian decision-making” means choices are made mainly by majority vote.',
  },
  {
    pattern: /\bsurveillance\b/i,
    definition: '“Surveillance” means systematic monitoring of people, behavior, communications or data.',
  },
  {
    pattern: /\bAI\b|\bartificial intelligence\b/i,
    definition: '“AI” means software systems that perform tasks normally associated with human reasoning, prediction or generation.',
  },
  {
    pattern: /\bdirect action\b/i,
    definition: '“Direct action” means trying to create change outside normal electoral or official channels.',
  },
  {
    pattern: /\bcivil disobedience\b/i,
    definition: '“Civil disobedience” means openly breaking a law or order to protest injustice while accepting public accountability.',
  },
  {
    pattern: /\breform\b|\brevolution\b/i,
    definition: '“Reform” means changing existing institutions; “revolution” means replacing them more fundamentally.',
  },
  {
    pattern: /\bcentralization\b|\bdecentralization\b|\bcentralized\b|\bdecentralized\b/i,
    definition: '“Centralization” means concentrating decision-making in fewer authorities; “decentralization” disperses it.',
  },
  {
    pattern: /\bcoercion\b|\bcoercive\b/i,
    definition: '“Coercion” means using force, threats or compulsory authority rather than consent.',
  },
  {
    pattern: /\bcompeting (?:legal systems?|courts?|protection agencies)\b/i,
    definition: '“Competing legal or protection systems” means several providers of law, courts or protection operating in the same area instead of one monopoly provider.',
  },
  {
    pattern: /\bextortion\b/i,
    definition: '“Extortion” means obtaining something through threats or coercion rather than consent.',
  },
  {
    pattern: /\babolition\b|\babolish(?:ing|ed)?\b/i,
    definition: '“Abolition” means completely eliminating an institution or practice rather than reforming it.',
  },
  {
    pattern: /\bbarriers? to entry\b/i,
    definition: '“Barriers to entry” means costs or rules that make it harder for new competitors to enter a market.',
  },
  {
    pattern: /\bantitrust\b/i,
    definition: '“Antitrust” means laws aimed at preventing monopolies and anti-competitive business practices.',
  },
  {
    pattern: /\bblack markets?\b/i,
    definition: '“Black markets” means illegal trade that happens outside, or in defiance of, legal regulation.',
  },
  {
    pattern: /\bexploitation\b/i,
    definition: '“Exploitation” means extracting value from someone’s labor or position unfairly, especially when they lack a real alternative.',
  },
  {
    pattern: /\bwealth tax(?:es)?\b/i,
    definition: '“Wealth tax” means a tax on the total value of what someone owns, not just their income.',
  },
  {
    pattern: /\buniversal basic income\b|\bUBI\b/,
    definition: '“Universal basic income” means a regular, unconditional cash payment given to everyone regardless of need or work.',
  },
  {
    pattern: /\bresource rents?\b|\bnatural-resource rents?\b/i,
    definition: '“Resource rents” means the income a natural resource generates beyond what it costs to extract or use it.',
  },
  {
    pattern: /\bcliffs?\b/i,
    definition: '“Benefit cliffs” means sudden losses of assistance when earnings cross a threshold, instead of benefits phasing out gradually.',
  },
  {
    pattern: /\bminimum labor standards?\b/i,
    definition: '“Minimum labor standards” means legal floors, such as minimum wage, safety rules or required benefits, that employers must meet.',
  },
  {
    pattern: /\bindustrial democracy\b/i,
    definition: '“Industrial democracy” means giving workers a formal voice or vote in how their workplace is run.',
  },
  {
    pattern: /\boccupational licensing\b/i,
    definition: '“Occupational licensing” means government permission required before someone may legally work in a trade or profession.',
  },
  {
    pattern: /\bland[- ]value tax(?:ation)?\b/i,
    definition: '“Land-value tax” means taxing the value of land itself, separate from any buildings or improvements on it.',
  },
  {
    pattern: /\brent control\b/i,
    definition: '“Rent control” means government limits on how much, or how fast, landlords may raise rent.',
  },
  {
    pattern: /\bcapital[- ]reserve mandates?\b|\breserve requirements?\b/i,
    definition: '“Capital and reserve requirements” means rules forcing banks to hold a minimum cushion of funds rather than lending out everything they take in.',
  },
  {
    pattern: /\bdeposit insurance\b/i,
    definition: '“Deposit insurance” means a government guarantee that depositors get their money back if a bank fails.',
  },
  {
    pattern: /\blender[- ]of[- ]last[- ]resort\b/i,
    definition: '“Lender of last resort” means a central bank’s role of lending to banks in a crisis when no one else will.',
  },
  {
    pattern: /\bmutual credit\b/i,
    definition: '“Mutual credit” means a system where members extend each other interest-free credit that nets out within the group, without a bank.',
  },
  {
    pattern: /\bcompet(?:ing|itive) (?:currenc(?:y|ies)|monies)\b/i,
    definition: '“Competing currencies” means allowing multiple forms of money to circulate so people can choose between them instead of using one government-issued currency.',
  },
  {
    pattern: /\bmoney monopoly\b/i,
    definition: '“Money monopoly” means a single legally privileged currency issuer with no competing alternative.',
  },
  {
    pattern: /\bcredit allocation\b/i,
    definition: '“Credit allocation” means decisions about who receives loans and on what terms.',
  },
  {
    pattern: /\binflation\b/i,
    definition: '“Inflation” means a general rise in prices that reduces the purchasing power of money over time.',
  },
  {
    pattern: /\bbailouts?\b/i,
    definition: '“Bailouts” means government financial rescues of failing companies or banks.',
  },
  {
    pattern: /\bdiscretionary monetary policy\b/i,
    definition: '“Discretionary monetary policy” means central bankers adjusting policy case by case based on judgment, rather than following a preset rule.',
  },
  {
    pattern: /\brules[- ]based (?:monetary )?frameworks?\b/i,
    definition: '“Rules-based framework” means policy bound by a preset formula rather than left to officials’ discretion.',
  },
  {
    pattern: /\basylum\b/i,
    definition: '“Asylum” means legal protection granted to someone fleeing persecution in their home country.',
  },
  {
    pattern: /\binterior enforcement\b/i,
    definition: '“Interior enforcement” means immigration enforcement carried out away from the border, inside the country.',
  },
  {
    pattern: /\bconscription\b/i,
    definition: '“Conscription” means compulsory enlistment of people into military service.',
  },
  {
    pattern: /\bblowback\b/i,
    definition: '“Blowback” means unintended harmful consequences, often retaliation, that follow from a policy or military action.',
  },
  {
    pattern: /\bsupranational\b/i,
    definition: '“Supranational” means authority held by an institution above and across individual national governments.',
  },
  {
    pattern: /\bblasphemy\b|\bapostasy\b|\bheresy\b/i,
    definition: '“Blasphemy, apostasy and heresy” means speech or belief treated as violating a religion’s official doctrines.',
  },
  {
    pattern: /\bcolorblind\b/i,
    definition: '“Colorblind policy” means treating people the same regardless of race or ethnicity, without group-based remedies.',
  },
  {
    pattern: /\bquota systems?\b/i,
    definition: '“Quota systems” means fixed numerical targets or limits set aside for particular groups.',
  },
  {
    pattern: /\bcollective guilt\b/i,
    definition: '“Collective guilt” means treating an entire group as morally responsible for wrongs committed by some of its members or ancestors.',
  },
  {
    pattern: /\bpatronage\b/i,
    definition: '“Patronage” means distributing jobs, contracts or favors based on political loyalty rather than merit.',
  },
  {
    pattern: /\bcare work\b/i,
    definition: '“Care work” means the labor of caring for children, the elderly or the sick, whether paid or unpaid.',
  },
  {
    pattern: /\bdegrowth\b/i,
    definition: '“Degrowth” means deliberately shrinking material production and consumption rather than pursuing continued economic growth.',
  },
  {
    pattern: /\bcommand[- ]and[- ]control\b/i,
    definition: '“Command-and-control regulation” means rules that mandate specific methods or limits directly, rather than using prices or incentives.',
  },
  {
    pattern: /\bveto points?\b|\bveto power\b|\bveto tools?\b/i,
    definition: '“Veto points” means places in a political or legal process where an actor can block a decision.',
  },
  {
    pattern: /\bqualified immunity\b/i,
    definition: '“Qualified immunity” means a legal doctrine shielding government officials from civil lawsuits unless they violated a clearly established right.',
  },
  {
    pattern: /\bmandatory minimums?\b/i,
    definition: '“Mandatory minimums” means laws requiring a fixed minimum prison sentence for a crime, regardless of circumstances.',
  },
  {
    pattern: /\bplea bargain(?:ing)?\b/i,
    definition: '“Plea bargaining” means a defendant pleading guilty, often to a lesser charge, in exchange for a lighter sentence.',
  },
  {
    pattern: /\bpretrial detention\b/i,
    definition: '“Pretrial detention” means holding a person in jail before their trial has happened or they have been convicted.',
  },
  {
    pattern: /\b(?:civil )?asset forfeiture\b/i,
    definition: '“Asset forfeiture” means the government seizing property it alleges was connected to a crime, sometimes without a conviction.',
  },
  {
    pattern: /\balgorithmic\b/i,
    definition: '“Algorithmic” means decisions made by automated rules or software rather than direct human judgment case by case.',
  },
  {
    pattern: /\binteroperab(?:le|ility)\b/i,
    definition: '“Interoperability” means different systems or platforms being able to work together and exchange data.',
  },
  {
    pattern: /\bencryption\b/i,
    definition: '“Encryption” means scrambling data so only authorized parties holding the right key can read it.',
  },
  {
    pattern: /\bdigital identity\b/i,
    definition: '“Digital identity” means government- or platform-issued electronic credentials used to verify who someone is online.',
  },
  {
    pattern: /\b(?:data )?minimization\b/i,
    definition: '“Minimization” means collecting or retaining only the data actually necessary for a stated purpose.',
  },
  {
    pattern: /\block-in\b/i,
    definition: '“Lock-in” means being stuck with one provider or platform because switching is costly or technically blocked.',
  },
  {
    pattern: /\bprefigurative\b/i,
    definition: '“Prefigurative” means building the social relations and institutions you want to see now, rather than waiting until after a larger political change.',
  },
  {
    pattern: /\bunited front\b/i,
    definition: '“United front” means a temporary alliance between groups with different ideologies against a shared opponent.',
  },
  {
    pattern: /\bsectarian(?:ism)?\b/i,
    definition: '“Sectarianism” means prioritizing the purity or distinctness of one’s own faction over cooperation with allies.',
  },
  {
    pattern: /\baffinity groups?\b/i,
    definition: '“Affinity groups” means small, informal activist groups organized around mutual trust rather than formal hierarchy.',
  },
  {
    pattern: /\bclerics?\b/i,
    definition: '“Clerics” means religious officials with formal authority within a faith tradition.',
  },
  {
    pattern: /\breligious nationalism\b/i,
    definition: '“Religious nationalism” means political movements that fuse national identity with a particular religion.',
  },
  {
    pattern: /\brevealed (?:religious )?law\b/i,
    definition: '“Revealed law” means religious law understood as divinely given rather than created by human legislators.',
  },
  {
    pattern: /\bcoalition discipline\b/i,
    definition: '“Coalition discipline” means members of an alliance suppressing internal disagreement to maintain a unified front.',
  },
  {
    pattern: /\bconstitutional patriotism\b/i,
    definition: '“Constitutional patriotism” means civic attachment to a society’s constitutional principles and laws rather than to ethnic or religious identity.',
  },
  {
    pattern: /\bteleolog(?:y|ical)\b/i,
    definition: '“Teleology” means explaining or justifying something by its built-in purpose or natural end goal.',
  },
  {
    pattern: /\bliability for pollution\b|\bpolluter[- ]pays\b/i,
    definition: '“Pollution liability” means holding whoever causes pollution legally responsible for the resulting harm.',
  },
  {
    pattern: /\btechnology[- ]neutral\b/i,
    definition: '“Technology-neutral” means rules that target outcomes rather than favoring or banning specific technical methods.',
  },
  {
    pattern: /\bmaterial (?:intensity|throughput)\b/i,
    definition: '“Material throughput” means the total volume of raw materials and energy an economy uses and discards.',
  },
  {
    pattern: /\bgreen growth\b/i,
    definition: '“Green growth” means pursuing continued economic growth while reducing environmental harm through efficiency and clean technology.',
  },
  {
    pattern: /\bdecoupl(?:e|ed|ing)\b/i,
    definition: '“Decoupling” means growing the economy while reducing resource use or emissions, rather than the two rising together.',
  },
  {
    pattern: /\bbioregions?\b|\bwatersheds?\b/i,
    definition: '“Bioregion” means a geographic area defined by shared ecology, such as a watershed, rather than political borders.',
  },
  {
    pattern: /\bglide path\b/i,
    definition: '“Glide path” means a planned, gradual transition schedule rather than an abrupt change.',
  },
  {
    pattern: /\bstewardship\b/i,
    definition: '“Stewardship” means responsibly managing and caring for a resource on behalf of others, including future generations.',
  },
  {
    pattern: /\bnonhuman habitats?\b/i,
    definition: '“Nonhuman habitats” means natural environments evaluated for their own ecological value, not just their usefulness to people.',
  },
  {
    pattern: /\bsecurity dilemmas?\b/i,
    definition: '“Security dilemma” means one state’s defensive buildup making others feel less secure, prompting an arms race even without aggressive intent.',
  },
  {
    pattern: /\bmultilateral(?:ism|ly)?\b/i,
    definition: '“Multilateralism” means coordinating policy through multiple countries or international bodies rather than acting alone.',
  },
  {
    pattern: /\bunilateral(?:ly)?\b/i,
    definition: '“Unilateral action” means a state acting alone without coordinating with allies or international bodies.',
  },
  {
    pattern: /\bregime (?:transformation|change)\b/i,
    definition: '“Regime change” means using force or pressure to remove or replace another country’s government.',
  },
  {
    pattern: /\bconscripts?\b/i,
    definition: '“Conscripts” means people compelled into military service rather than enlisting voluntarily.',
  },
  {
    pattern: /\breferend(?:um|a)\b/i,
    definition: '“Referendum” means a direct public vote on a specific law or policy question.',
  },
  {
    pattern: /\blow[- ]salience\b/i,
    definition: '“Low-salience policy” means an issue most voters do not pay much attention to or have informed opinions on.',
  },
  {
    pattern: /\bgridlock\b/i,
    definition: '“Gridlock” means a political stalemate where competing factions block each other from acting.',
  },
  {
    pattern: /\bfederat(?:e|ed|ion)\b/i,
    definition: '“Federation” means separate groups joining into a larger structure while keeping local self-government.',
  },
  {
    pattern: /\banti-circumvention\b/i,
    definition: '“Anti-circumvention law” means rules banning people from bypassing digital locks, even for otherwise lawful purposes.',
  },
  {
    pattern: /\bopen[- ](?:access|standards?|protocols?|source)\b/i,
    definition: '“Open access and open-source” means knowledge, standards or software made freely available for anyone to use, copy or build on.',
  },
  {
    pattern: /\btrademarks?\b/i,
    definition: '“Trademark” means legal protection for brand names, logos or symbols that identify a product’s source.',
  },
  {
    pattern: /\bdestitution\b/i,
    definition: '“Destitution” means lacking the basic resources needed for survival, such as food, shelter or medical care.',
  },
  {
    pattern: /\bstigma\b/i,
    definition: '“Stigma” means social shame or disapproval attached to receiving help or belonging to a group.',
  },
  {
    pattern: /\bpaternalis(?:m|tic)\b/i,
    definition: '“Paternalism” means restricting someone’s choices for their own supposed benefit, regardless of their own wishes.',
  },
  {
    pattern: /\bcash floor\b/i,
    definition: '“Cash floor” means a guaranteed minimum income provided in cash rather than in-kind benefits.',
  },
  {
    pattern: /\bcensorship\b/i,
    definition: '“Censorship” means suppressing speech, publication or information, typically by state power.',
  },
  {
    pattern: /\bextremis(?:m|t)\b/i,
    definition: '“Extremism” means political views or actions positioned as far outside the mainstream, often used as a basis for restriction.',
  },
  {
    pattern: /\bdissents?\b|\bdissenting\b/i,
    definition: '“Dissent” means openly disagreeing with or opposing prevailing views or authority.',
  },
  {
    pattern: /\bscapegoats?\b/i,
    definition: '“Scapegoat” means blaming a person or group for problems they did not primarily cause.',
  },
  {
    pattern: /\bcaste\b/i,
    definition: '“Caste” means a rigid hereditary social ranking that restricts a person’s status and opportunities from birth.',
  },
  {
    pattern: /\brent[- ]seeking\b/i,
    definition: '“Rent-seeking” means trying to gain wealth by manipulating rules or politics rather than by producing new value.',
  },
  {
    pattern: /\baccessory (?:dwelling )?units?\b/i,
    definition: '“Accessory units” means small secondary housing units, like a converted garage or basement apartment, added to an existing property.',
  },
  {
    pattern: /\bruling class\b/i,
    definition: '“Ruling class” means the group that holds dominant political and economic power in a society.',
  },
  {
    pattern: /\bcryptographic currenc(?:y|ies)\b|\bcrypto-?currenc(?:y|ies)\b/i,
    definition: '“Cryptocurrency” means a digital currency secured by cryptography and typically not issued by a government.',
  },
  {
    pattern: /\bintermediar(?:y|ies)\b/i,
    definition: '“Intermediaries” means institutions, like banks, that stand between savers and borrowers or buyers and sellers.',
  },
]

const LAYER_MEASUREMENT: Record<Question['layer'], string> = {
  normative: 'your moral judgment',
  descriptive: 'your practical belief',
  prescriptive: 'your preferred policy direction',
}

const SALIENCE_HELP_TEXT: Record<'confidence' | 'priority', string> = {
  confidence: '“Confidence” means how sure you are that your answer is accurate. This rating controls how strongly this empirical answer counts in your result.',
  priority: '“Priority” means how important this reform is compared with other changes. This rating controls how strongly this policy preference counts in your result.',
}

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]$/, '')
}

function lowercaseFirst(value: string): string {
  if (!value) return value
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function getQuestionSearchText(question: Question): string {
  const optionText = question.statementOptions?.map((option) => option.text).join(' ') ?? ''
  return `${question.prompt} ${optionText}`
}

function findTermDefinitions(question: Question, limit = 2): string[] {
  const searchText = getQuestionSearchText(question)
  const definitions: string[] = []

  for (const { pattern, definition } of TERM_DEFINITIONS) {
    if (!pattern.test(searchText) || definitions.includes(definition)) continue
    definitions.push(definition)
    if (definitions.length >= limit) break
  }

  return definitions
}

function fallbackDomainDefinition(question: Question): string {
  const domain = domainById.get(question.domain)
  if (!domain) return 'This item uses a general political judgment prompt.'

  return `“${domain.name}” means ${lowercaseFirst(stripTerminalPunctuation(domain.description))}.`
}

function getResponseQualifier(question: Question): string {
  return question.responseType === 'statementChoice' ? 'which statement you choose' : 'how strongly you agree'
}

export function getQuestionHelpText(question: Question): string {
  const definitions = findTermDefinitions(question)
  const definitionText = definitions.length > 0 ? definitions.join(' ') : DOMAIN_DEFINITIONS[question.domain] ?? fallbackDomainDefinition(question)
  const domain = domainById.get(question.domain)
  const domainPhrase = domain ? domain.name.toLowerCase() : 'this topic'
  const responseQualifier = getResponseQualifier(question)

  return `${definitionText} This question measures ${LAYER_MEASUREMENT[question.layer]} about ${domainPhrase}, based on ${responseQualifier}.`
}

export function getSalienceHelpText(kind: 'confidence' | 'priority'): string {
  return SALIENCE_HELP_TEXT[kind]
}
