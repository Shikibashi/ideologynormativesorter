import type { AxisWeight, Question } from '../types'
import { axisById } from './axes'
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
  {
    pattern: /\bexit(?: rights| options|)\b|\bopt[- ]out\b/i,
    definition: '“Exit” means a real ability to leave, opt out or choose another provider.',
  },
  {
    pattern: /\bpolitical authority\b|\blegitima(?:te|cy)\b/i,
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
    pattern: /\bvoluntary exchange\b/i,
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
    definition: '“Means-tested” programs limit eligibility based on income, assets or other measures of need.',
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
    pattern: /\bcollective bargaining\b/i,
    definition: '“Collective bargaining” means workers negotiating pay, hours or conditions as a group.',
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
    pattern: /\brestorative\b/i,
    definition: '“Restorative” approaches focus on repairing harm and accountability rather than only punishment.',
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
    definition: '“Majoritarian” decision-making means choices are made mainly by majority vote.',
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
]

const LAYER_MEASUREMENT: Record<Question['layer'], string> = {
  normative: 'what you think is morally justified',
  descriptive: 'what you believe usually happens in practice',
  prescriptive: 'which policy direction or strategy you would prioritize',
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

function findTermDefinition(prompt: string): string | undefined {
  return TERM_DEFINITIONS.find(({ pattern }) => pattern.test(prompt))?.definition
}

function fallbackDomainDefinition(question: Question): string {
  const domain = domainById.get(question.domain)
  if (!domain) return 'This item uses a general political judgment prompt.'

  return `“${domain.name}” means ${lowercaseFirst(stripTerminalPunctuation(domain.description))}.`
}

function collectAxisWeights(question: Question): AxisWeight[] {
  if (question.axisWeights.length > 0) return question.axisWeights

  return question.statementOptions?.flatMap((option) => option.axisWeights) ?? []
}

function getPrimaryAxisWeight(question: Question): AxisWeight | undefined {
  return collectAxisWeights(question).reduce<AxisWeight | undefined>((primary, current) => {
    if (!primary) return current
    return Math.abs(current.weight) > Math.abs(primary.weight) ? current : primary
  }, undefined)
}

function getMeasurementFocus(question: Question): string {
  const primaryAxisWeight = getPrimaryAxisWeight(question)
  const axis = primaryAxisWeight ? axisById.get(primaryAxisWeight.axisId) : undefined

  if (!axis) {
    const domain = domainById.get(question.domain)
    return domain ? lowercaseFirst(domain.name) : 'this topic'
  }

  return `${axis.name.toLowerCase()}: ${lowercaseFirst(stripTerminalPunctuation(axis.description))}`
}

export function getQuestionHelpText(question: Question): string {
  const definition = findTermDefinition(question.prompt) ?? DOMAIN_DEFINITIONS[question.domain] ?? fallbackDomainDefinition(question)
  const measurement = getMeasurementFocus(question)

  return `${definition} This question measures ${LAYER_MEASUREMENT[question.layer]} through ${measurement}.`
}

export function getSalienceHelpText(kind: 'confidence' | 'priority'): string {
  return SALIENCE_HELP_TEXT[kind]
}
