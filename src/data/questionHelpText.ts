import type { Question } from "../types";
import { domainById } from "./domains";
import { LAYER_EXPLAINERS } from "./ideologyExplainers";
import { TERM_DEFINITIONS } from "./questionHelpTermDefinitions";

const DOMAIN_DEFINITIONS: Record<string, string> = {
  "state-legitimacy":
    "“Political legitimacy” means whether an institution has a justified right to rule, tax, enforce rules or settle disputes.",
  "property-ownership":
    "“Property rules” means the rules deciding who may use, exclude others from or transfer resources.",
  "markets-planning":
    "“Economic coordination” means how people, firms and institutions align plans and allocate scarce resources.",
  "redistribution-welfare":
    "“Welfare policy” means the rules and programs used to address material need or redistribute resources.",
  "labor-unions-workplace":
    "“Workplace governance” means how authority, bargaining power and decision-making are arranged at work.",
  "land-housing-georgism":
    "“Land-use policy” means zoning, permitting, land taxes and other rules shaping where housing and business activity can happen.",
  "money-banking":
    "“Monetary policy” means how money, credit, interest rates and financial stability are managed.",
  "intellectual-property-information":
    "“Intellectual property” means legal control over copying or using ideas, inventions, software, art or information.",
  "civil-liberties-speech":
    "“Civil liberties” means protections for individual expression, conscience, privacy and due process.",
  "crime-policing-justice":
    "“Justice policy” means policing, courts, punishment, diversion, accountability and repair after harm.",
  "immigration-borders":
    "“Border policy” means rules about who may enter, leave, live or work across political boundaries.",
  "national-identity-sovereignty":
    "“Sovereignty” means a political community’s claimed authority to govern itself and resist outside control.",
  "religion-secularism":
    "“Secularism” means public institutions staying neutral among religions and non-religion.",
  "family-gender-feminism":
    "“Social norms” means shared expectations about family life, gender roles, sex and personal conduct.",
  "race-ethnicity-multiculturalism":
    "“Assimilation and multiculturalism” means how a society handles cultural difference, integration and historical inequity.",
  "environment-climate-growth":
    "“Ecological limits” means environmental constraints that can affect production, health and long-run welfare.",
  "foreign-policy-war":
    "“Foreign policy” means decisions about war, alliances, sanctions, diplomacy and involvement beyond national borders.",
  "democracy-expertise-constitutionalism":
    "“Institutional decision-making” means how collective choices are made and constrained by voters, experts, courts or constitutions.",
  "technology-ai-surveillance":
    "“Technology governance” means rules and institutions that shape how new tools, data systems and AI are used.",
  "strategy-change":
    "“Political strategy” means the route used to pursue change, such as reform, elections, organizing or direct action.",
};

const SALIENCE_HELP_TEXT: Record<"confidence" | "priority", string> = {
  confidence:
    "“Confidence” means how sure you are that your answer is accurate. This rating controls how strongly this empirical answer counts in your result. Skipping the rating excludes the answer from your result.",
  priority:
    "“Priority” means how important this policy or strategy is compared with other changes. This rating controls how strongly this preference counts in your result. Skipping the rating excludes the answer from your result.",
};

/** Context-specific definitions for ordinary words that would otherwise
 * trigger a different specialist meaning. */
const QUESTION_DEFINITION_OVERRIDES: Readonly<Record<string, string>> = {
  q0094:
    "“Occupational licensing” means government permission required before someone may legally work in a trade or profession.",
  q0104: "“Asset prices” means the market value of homes and other assets.",
  q0152:
    "“Artistic patronage” means financial support for creators from donors, institutions, customers, or sponsors.",
  q0179:
    "“Political equality” means equal standing as a citizen, including freedom to hold mistaken or unpopular views.",
  q0238:
    "“Civic equality” means equal legal and political standing regardless of ancestry or cultural background.",
  q0259:
    "“Delegating conscience” means allowing another person or institution to determine what one must believe or accept as morally binding.",
  q0270:
    "“Workplace equality policy” means rules intended to reduce unequal treatment or opportunity at work.",
  q0282:
    "“Equal citizenship” means equal legal and political standing without requiring everyone to share one culture.",
  q0302: "“Price” means the amount paid or received in an exchange.",
  q0334:
    "“Exit criteria” means the stated conditions for ending a military operation. “Intervention” means using diplomatic, economic, or military power to influence events in another country.",
  q0342:
    "“Expert knowledge” means specialized knowledge used to inform a decision; it does not by itself determine who should have final authority.",
  q0365:
    "“Contestable decision” means one a person can understand, challenge, and appeal before an independent reviewer.",
  q0400:
    "“Institutional capacity” means a movement’s ability to organize people, make decisions, obtain resources, and carry out plans over time.",
};

const QUESTION_MEASUREMENT_OVERRIDES: Readonly<Record<string, string>> = {
  q0104:
    "how much moral weight you give homeowners’ financial interests when they conflict with newcomers’ access to housing",
  q0302:
    "how you weigh nonhuman moral standing against owners’ economic claims",
};

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]$/, "");
}

function lowercaseFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function getQuestionSearchText(question: Question): string {
  return question.prompt;
}

function findTermDefinitions(question: Question, limit = 2): string[] {
  const searchText = getQuestionSearchText(question);
  const definitions: string[] = [];

  for (const { pattern, definition, domains } of TERM_DEFINITIONS) {
    if (domains && !domains.includes(question.domain)) continue;
    if (!pattern.test(searchText) || definitions.includes(definition)) continue;
    definitions.push(definition);
    if (definitions.length >= limit) break;
  }

  return definitions;
}

function fallbackDomainDefinition(question: Question): string {
  const domain = domainById.get(question.domain);
  if (!domain) return "This item uses a general political judgment prompt.";

  return `“${domain.name}” means ${lowercaseFirst(stripTerminalPunctuation(domain.description))}.`;
}

function getResponseQualifier(question: Question): string {
  return question.responseType === "statementChoice"
    ? "which statement you choose"
    : "how strongly you agree";
}

function getQuestionMeasurement(question: Question): string {
  if (question.layer !== "prescriptive")
    return LAYER_EXPLAINERS[question.layer].measurement;
  if (question.theoryContext === "ideal") {
    return "which policies, institutions, or strategies you would favor under ideal conditions";
  }
  if (question.theoryContext === "nonideal") {
    return "which policies, institutions, or strategies you would favor under current constraints";
  }
  return "which practical policy or strategy direction you favor under the conditions named in the question";
}

export function getQuestionHelpText(question: Question): string {
  const definitions = findTermDefinitions(question);
  const definitionText =
    QUESTION_DEFINITION_OVERRIDES[String(question.id)] ??
    (definitions.length > 0
      ? definitions.join(" ")
      : (DOMAIN_DEFINITIONS[question.domain] ??
        fallbackDomainDefinition(question)));
  const domain = domainById.get(question.domain);
  const domainPhrase = domain ? domain.name.toLowerCase() : "this topic";
  const measurement =
    QUESTION_MEASUREMENT_OVERRIDES[String(question.id)] ??
    `${getQuestionMeasurement(question)} about ${domainPhrase}`;
  const responseQualifier = getResponseQualifier(question);

  return `${definitionText} This question measures ${measurement}, based on ${responseQualifier}.`;
}

export function getSalienceHelpText(kind: "confidence" | "priority"): string {
  return SALIENCE_HELP_TEXT[kind];
}
