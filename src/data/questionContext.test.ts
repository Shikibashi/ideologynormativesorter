import { describe, expect, it } from "vitest";
import { coreQuestions, QUESTION_BANK_VERSION } from "./effectiveQuestions";
import {
  applyQuestionContext,
  isQuestionContextTarget,
  QUESTION_CONTEXT_VERSION,
  questionContextById,
  questionContextSources,
} from "./questionContext";
import { specialistModuleDefinitions } from "../specialist";
import { statementQuestions } from "./statementQuestions";

const activeCoreQuestions = coreQuestions.filter(
  (question) => question.active !== false,
);
const specialistQuestions = specialistModuleDefinitions.flatMap(
  (module) => module.questions,
);
const contextTargets = [...activeCoreQuestions, ...specialistQuestions];

describe("question context overlay", () => {
  it("versions and covers every active core and specialist question", () => {
    expect(QUESTION_BANK_VERSION).toContain(QUESTION_CONTEXT_VERSION);
    expect(activeCoreQuestions).toHaveLength(338);
    expect(specialistQuestions).toHaveLength(68);
    expect(new Set(contextTargets.map((question) => question.id)).size).toBe(
      406,
    );

    for (const question of contextTargets) {
      expect(
        isQuestionContextTarget(question),
        `${question.id} must be an overlay target`,
      ).toBe(true);
      expect(question.contextNote, `${question.id} needs context`).toBeTruthy();
      expect(
        question.contextNote!.length,
        `${question.id} context is too short`,
      ).toBeGreaterThan(100);
      expect(
        question.sources?.length,
        `${question.id} needs public sources`,
      ).toBeGreaterThan(0);
      for (const source of question.sources ?? []) {
        expect(
          source.title.length,
          `${question.id} source title`,
        ).toBeGreaterThan(2);
        expect(
          source.publisher?.length ?? 0,
          `${question.id} source publisher`,
        ).toBeGreaterThan(2);
        expect(source.url, `${question.id} source URL`).toMatch(/^https:\/\//);
      }
    }

    for (const [sourceId, source] of Object.entries(questionContextSources)) {
      expect(source.title, `${sourceId} source title`).toBeTruthy();
      expect(source.url, `${sourceId} source URL`).toMatch(/^https:\/\//);
    }
  });

  it("adds context without changing scored question fields", () => {
    for (const question of contextTargets) {
      const contextualized = applyQuestionContext(question);

      expect(contextualized.prompt).toBe(question.prompt);
      expect(contextualized.layer).toBe(question.layer);
      expect(contextualized.theoryContext).toBe(question.theoryContext);
      expect(contextualized.responseType).toBe(question.responseType);
      expect(contextualized.tier).toBe(question.tier);
      expect(contextualized.axisWeights).toEqual(question.axisWeights);
      expect(contextualized.statementOptions).toEqual(
        question.statementOptions,
      );
      expect(contextualized.reverseScored).toBe(question.reverseScored);
    }
  });

  it("preserves existing descriptive evidence notes and exact source lists", () => {
    for (const question of activeCoreQuestions.filter(
      (item) => item.layer === "descriptive",
    )) {
      const evidenceNote = question.evidenceNote;
      const sources = question.sources;
      const contextualized = applyQuestionContext(question);

      expect(evidenceNote).toBeTruthy();
      expect(contextualized.evidenceNote).toBe(evidenceNote);
      expect(contextualized.sources).toEqual(sources);
    }
  });

  it("keeps explicit high-risk records resolvable", () => {
    for (const [id, record] of Object.entries(questionContextById)) {
      const question = contextTargets.find((candidate) => candidate.id === id);
      expect(
        question,
        `${id} context references a missing target`,
      ).toBeDefined();
      expect(record.contextNote?.length).toBeGreaterThan(100);
      expect(record.sourceIds?.length).toBeGreaterThan(0);
    }
  });

  it("has bespoke records for every active core question", () => {
    for (const question of activeCoreQuestions) {
      expect(
        questionContextById[question.id],
        `${question.id} needs a bespoke record`,
      ).toBeDefined();
      expect(
        questionContextById[question.id]?.sourceIds?.length,
        `${question.id} needs matched sources`,
      ).toBeGreaterThan(0);
    }
  });

  it("has bespoke records for every specialist module question", () => {
    for (const question of specialistQuestions) {
      expect(
        questionContextById[question.id],
        `${question.id} needs a bespoke record`,
      ).toBeDefined();
      expect(
        questionContextById[question.id]?.sourceIds?.length,
        `${question.id} needs matched sources`,
      ).toBeGreaterThan(0);
    }
  });

  it("gives every active statement-choice item bespoke construct boundaries", () => {
    const expectedSources: Record<string, string[]> = {
      sq01: ["authority", "politicalObligation", "democracy"],
      sq02: ["property", "distributiveJustice", "socialism"],
      sq06: ["immigration", "refugeeConvention", "politicalObligation"],
      sq07: ["environmentalEthics", "climateAssessment"],
      sq13: ["property", "markets", "socialism"],
      sq15: ["nationalism", "ethnonationalism", "multiculturalism"],
    };

    const activeStatementQuestions = statementQuestions.filter((question) =>
      activeCoreQuestions.some(
        (activeQuestion) => activeQuestion.id === question.id,
      ),
    );
    expect(activeStatementQuestions).toHaveLength(
      Object.keys(expectedSources).length,
    );
    for (const question of activeStatementQuestions) {
      const record = questionContextById[question.id];
      expect(record, `${question.id} needs bespoke context`).toBeDefined();
      expect(
        record?.contextNote?.length,
        `${question.id} context is too short`,
      ).toBeGreaterThan(100);
      expect(record?.sourceIds).toEqual(expectedSources[question.id]);
    }
  });

  it("uses claim-matched records for conditional cross-domain empirical items", () => {
    const expectedSources: Record<string, string[]> = {
      q0001: ["authority", "politicalObligation", "markets"],
      q0003: ["authority", "politicalObligation", "markets"],
      q0004: ["authority", "politicalObligation", "emergencyPowers"],
      q0005: ["politicalObligation", "civilDisobedience", "authority"],
      q0006: ["authority", "politicalObligation", "democracy"],
      q0021: ["property", "distributiveJustice"],
      q0022: ["property", "distributiveJustice"],
      q0023: ["property", "distributiveJustice", "politicalObligation"],
      q0024: ["property", "distributiveJustice"],
      q0025: ["property", "distributiveJustice", "markets"],
      q0026: ["property", "distributiveJustice", "politicalObligation"],
      q0034: ["markets", "property", "distributiveJustice"],
      q0035: ["stateOwnedGovernance", "socialism", "property"],
      q0038: ["markets", "property", "socialism"],
      q0039: ["property", "distributiveJustice", "politicalObligation"],
      q0041: ["markets", "property", "liberalism"],
      q0042: ["markets", "socialism", "liberalism"],
      q0043: ["markets", "socialism", "liberalism"],
      q0044: ["markets", "property", "distributiveJustice"],
      q0045: ["markets", "property", "politicalObligation"],
      q0046: ["markets", "property", "liberalism"],
      q0061: ["distributiveJustice", "liberalism"],
      q0062: ["distributiveJustice", "liberalism", "civilPoliticalRights"],
      q0063: ["distributiveJustice", "liberalism", "civilPoliticalRights"],
      q0064: ["distributiveJustice", "property", "housingSupply"],
      q0065: ["distributiveJustice", "civilPoliticalRights", "liberalism"],
      q0066: ["distributiveJustice", "property"],
      q0073: ["distributiveJustice", "liberalism", "snapRecertification"],
      q0074: ["distributiveJustice", "liberalism", "snapRecertification"],
      q0075: ["distributiveJustice", "housingSupply"],
      q0076: [
        "snapRecertification",
        "householdTypologies",
        "distributiveJustice",
      ],
      q0077: [
        "polycentricGovernance",
        "distributiveJustice",
        "snapRecertification",
      ],
      q0079: ["distributiveJustice", "liberalism", "politicalObligation"],
      q0081: ["freedomAssociation", "labourRights"],
      q0082: ["employmentRelationship", "labourRights", "liberalism"],
      q0083: ["labour", "labourRights", "property"],
      q0084: ["labourRights", "labour", "employmentRelationship"],
      q0085: [
        "occupationalLicensingEntry",
        "labourRights",
        "employmentRelationship",
      ],
      q0094: ["labourRights", "employmentRelationship", "labour"],
      q0095: ["labour", "labourRights", "politicalObligation"],
      q0096: ["labourRights", "employmentRelationship", "labour"],
      q0097: ["workerCooperatives", "cooperativesWorkRights", "labour"],
      q0098: ["labour", "employmentRelationship", "labourRights"],
      q0099: ["labourRights", "labour", "liberalism"],
      q0101: ["property", "landTenure", "distributiveJustice"],
      q0102: ["housingSupply", "property", "housingSupplyAffordability"],
      q0104: ["housingSupply", "housingSupplyAffordability", "property"],
      q0105: ["housingSupply", "housingSupplyAffordability", "property"],
      q0106: ["property", "landTenure", "distributiveJustice"],
      q0115: ["landTenure", "property", "distributiveJustice"],
      q0116: [
        "housingSupplyAffordability",
        "housingSupply",
        "housingDemandSubsidies",
      ],
      q0117: ["landTenure", "property", "housingSupply"],
      q0119: [
        "housingSupplyAffordability",
        "housingSupply",
        "distributiveJustice",
      ],
      q0121: ["monetaryPolicy", "privateMoneyPayments", "liberalism"],
      q0122: ["monetaryPolicy", "privateMoneyPayments", "distributiveJustice"],
      q0123: [
        "financialEntryBarriers",
        "financialEntryLicensing",
        "paymentSystemIntegrity",
      ],
      q0124: ["bankResolution", "bankFailureResolution", "distributiveJustice"],
      q0125: ["bankResolution", "markets", "monetaryPolicy"],
      q0126: ["monetaryPolicy", "privateMoneyPayments", "politicalObligation"],
      q0133: ["privateMoneyPayments", "monetaryPolicy", "bankResolution"],
      q0134: ["privateMoneyPayments", "markets", "bankResolution"],
      q0137: ["monetaryPolicy", "emergencyPowers", "bankResolution"],
      q0138: ["bankResolution", "markets", "privateMoneyPayments"],
      q0139: ["monetaryPolicy", "politicalObligation", "markets"],
      q0161: ["civilPoliticalRights", "liberalism"],
      q0162: ["civilPoliticalRights", "liberalism", "democracy"],
      q0163: ["iccprPrivacy", "civilPoliticalRights", "liberalism"],
      q0164: ["civilPoliticalRights", "liberalism", "democracy"],
      q0165: ["civilPoliticalRights", "liberalism"],
      q0166: ["civilPoliticalRights", "liberalism", "democracy"],
      q0174: ["civilPoliticalRights", "liberalism", "democracy"],
      q0175: ["iccprPrivacy", "civilPoliticalRights", "democracy"],
      q0176: ["emergencyPowers", "civilPoliticalRights", "democracy"],
      q0177: ["civilPoliticalRights", "iccprPrivacy", "democracy"],
      q0178: ["iccprPrivacy", "emergencyPowers", "civilPoliticalRights"],
      q0179: ["civilPoliticalRights", "liberalism", "democracy"],
      q0201: ["immigration", "civilPoliticalRights", "nationalism"],
      q0202: ["immigration", "civilPoliticalRights", "politicalObligation"],
      q0203: ["immigration", "nationalism", "civilPoliticalRights"],
      q0204: ["immigration", "politicalObligation", "civilPoliticalRights"],
      q0205: ["immigration", "refugeeConvention", "civilPoliticalRights"],
      q0206: ["immigration", "refugeeConvention", "civilPoliticalRights"],
      q0213: ["immigration", "nationalism", "politicalObligation"],
      q0214: ["immigration", "labourRights", "civilPoliticalRights"],
      q0216: ["refugeeConvention", "immigration", "civilPoliticalRights"],
      q0219: ["immigration", "labourRights", "liberalism"],
      q0221: ["nationalism", "multiculturalism", "civilPoliticalRights"],
      q0223: ["federalism", "multiculturalism", "democracy"],
      q0224: ["nationalism", "civilPoliticalRights", "politicalObligation"],
      q0226: ["nationalism", "politicalObligation", "civilPoliticalRights"],
      q0233: ["nationalism", "multiculturalism", "federalism"],
      q0234: ["nationalism", "federalism", "civilPoliticalRights"],
      q0235: ["nationalism", "civilPoliticalRights", "immigration"],
      q0236: ["federalism", "multiculturalism", "civilPoliticalRights"],
      q0239: ["nationalism", "multiculturalism", "liberalism"],
      q0241: ["secularism", "civilPoliticalRights", "religionOfficialStatus"],
      q0243: ["secularism", "civilPoliticalRights", "liberalism"],
      q0244: ["secularism", "civilPoliticalRights"],
      q0245: ["secularism", "religionOfficialStatus", "civilPoliticalRights"],
      q0246: ["secularism", "civilPoliticalRights", "liberalism"],
      q0253: ["secularism", "civilPoliticalRights", "liberalism"],
      q0254: ["secularism", "civilPoliticalRights", "multiculturalism"],
      q0255: ["secularism", "religionOfficialStatus", "civilPoliticalRights"],
      q0256: ["religionOfficialStatus", "civilPoliticalRights", "liberalism"],
      q0257: ["secularism", "civilPoliticalRights", "liberalism"],
      q0258: ["secularism", "liberalism", "civilPoliticalRights"],
      q0259: ["secularism", "civilPoliticalRights", "liberalism"],
      q0261: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
      q0262: ["feministPolitics", "civilPoliticalRights", "liberalism"],
      q0263: ["feministPolitics", "feministEthics", "distributiveJustice"],
      q0264: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
      q0265: ["feministPolitics", "civilPoliticalRights", "liberalism"],
      q0266: ["feministPolitics", "civilPoliticalRights", "liberalism"],
      q0275: ["feministPolitics", "civilPoliticalRights", "multiculturalism"],
      q0276: ["feministPolitics", "distributiveJustice", "labourRights"],
      q0278: ["feministPolitics", "liberalism", "labourRights"],
      q0279: ["feministPolitics", "feministEthics", "liberalism"],
      q0404: ["secularism", "civilPoliticalRights", "religionOfficialStatus"],
      q0421: ["feministPolitics", "feministEthics", "civilPoliticalRights"],
      q0478: ["socialNormChange", "feministPolitics"],
      q0479: ["socialNormChange", "feministPolitics"],
      q0114: ["housingSupplyAffordability", "housingDemandSubsidies"],
      q0142: ["copyrightLimitations", "intellectualProperty"],
      q0154: ["patentExceptions", "patentRightsEnforcement"],
      q0158: [
        "openStandardsDigitalInnovation",
        "openStandardsCompetition",
        "copyrightLimitations",
      ],
      q0217: ["iceEnforcementStatistics", "civilPoliticalRights"],
      q0135: ["bankResolution", "bankFailureResolution"],
      q0136: ["privateMoneyPayments", "monetaryPolicy"],
      q0029: ["policyCapture", "competitionAssessment"],
      q0127: ["currencyCompetition", "bankNotesStablecoins"],
      q0208: ["immigrationInterestGroups"],
      q0227: ["interethnicCivicNetworks"],
      q0329: ["politicalConnectionsDefenseContracts"],
      q0347: ["democraticInnovations"],
      q0350: ["democraticBacksliding"],
      q0318: ["climateDecoupling", "climateAssessment"],
      q0007: ["polycentricGovernance"],
      q0067: ["snapRecertification"],
      q0107: ["housingSupply"],
      q0328: ["afghanistanReconstruction"],
      q0402: ["war", "unCharter"],
      q0425: ["authority", "democracy"],
      q0171: ["emergencyPowers", "democracy"],
      q0207: ["intergroupContactUpdated", "intergroupContactMetaAnalysis"],
      q0420: ["climateDecoupling", "climateAssessment", "environmentalEthics"],
      "fm-rn-5": [
        "islamicConstitutionalism",
        "democracy",
        "civilPoliticalRights",
      ],
      "fm-rn-6": [
        "islamicPartyCompetition",
        "democracy",
        "civilPoliticalRights",
      ],
      "fm-rn-7": [
        "cambridgeIslamicConstitutionalism2023",
        "islamicConstitutionalism",
        "civilPoliticalRights",
      ],
      "fm-rn-8": [
        "islamicDemocracy",
        "islamicPartyCompetition",
        "democracy",
        "civilPoliticalRights",
      ],
      "fm-rn-9": [
        "oxfordHindutvaDefinitions",
        "ethnonationalism",
        "civilPoliticalRights",
      ],
      "fm-rn-10": [
        "cambridgeZionismHistory",
        "cambridgeZionismLabour",
        "nationalism",
      ],
      "fm-rn-11": ["theocracySecularism", "secularism", "civilPoliticalRights"],
      "fm-te-5": ["accelerationism", "markets"],
      "fm-te-6": ["authority", "federalism", "evidenceGovernance"],
      q0301: ["environmentalEthics", "climateAssessment"],
      q0304: ["environmentalEthics", "climateAssessment"],
      q0305: ["environmentalEthics", "policyCapture", "climateAssessment"],
      q0313: ["climateDecoupling", "environmentalEthics", "marketsKnowledge"],
      q0315: [
        "climateAssessment",
        "regulatoryInformationAsymmetry",
        "environmentalComplianceCosts",
      ],
      q0316: [
        "environmentalEthics",
        "climateAssessment",
        "environmentalComplianceCosts",
      ],
      q0317: ["climateAssessment", "policyCapture", "regulatorGovernance"],
      q0319: [
        "climateAssessment",
        "environmentalEthics",
        "civilPoliticalRights",
      ],
      q0418: ["environmentalEthics", "climateAssessment"],
      q0321: ["war", "unCharter", "civilPoliticalRights"],
      q0324: ["war", "emergencyPowers", "democracy"],
      q0325: ["war", "civilPoliticalRights", "labourRights"],
      q0326: ["war", "unCharter", "afghanistanReconstruction"],
      q0334: ["war", "unCharter", "afghanistanReconstruction"],
      q0336: ["emergencyPowers", "democracy", "unCharter"],
      q0337: ["war", "unCharter", "afghanistanReconstruction"],
      q0338: ["afghanistanReconstruction", "war", "democracy"],
      q0401: ["war", "unCharter", "civilPoliticalRights"],
      q0403: ["war", "nationalism", "unCharter"],
      q0341: ["democracy", "civilPoliticalRights"],
      q0342: ["democracy", "evidenceGovernance"],
      q0343: ["democracy", "civilPoliticalRights"],
      q0344: ["democracy", "civilPoliticalRights", "multiculturalism"],
      q0345: ["democracy", "evidenceGovernance", "regulatorAppeals"],
      q0356: ["democracy", "civilPoliticalRights", "regulatorAppeals"],
      q0357: ["federalism", "civilPoliticalRights", "democracy"],
      q0359: ["democracy", "civilPoliticalRights", "politicalObligation"],
      q0474: ["evidenceGovernance", "democracy"],
      q0475: ["evidenceGovernance", "democracy"],
      q0476: ["evidenceGovernance", "democracy"],
      q0477: ["evidenceGovernance", "democracy"],
      q0361: ["cryptography", "civilPoliticalRights"],
      q0362: ["aiEthics", "civilPoliticalRights"],
      q0363: [
        "aiEthics",
        "civilPoliticalRights",
        "decentralizedNetworkGovernance",
      ],
      q0364: ["aiRisk", "civilPoliticalRights"],
      q0365: ["aiEthics", "regulatorAppeals", "civilPoliticalRights"],
      q0374: ["aiRisk", "aiEthics", "openStandardsDigitalInnovation"],
      q0377: [
        "openStandardsCompetition",
        "competitionAssessment",
        "decentralizedNetworkGovernance",
      ],
      q0379: ["aiEthics", "civilPoliticalRights"],
      q0381: ["revolution", "civilDisobedience", "politicalReform"],
      q0382: ["democraticConfederalism", "civilDisobedience", "revolution"],
      q0383: ["civilDisobedience", "democracy", "politicalReform"],
      q0384: ["civilDisobedience", "civilPoliticalRights", "democracy"],
      q0385: ["revolution", "war", "civilDisobedience"],
      q0394: [
        "politicalReform",
        "civilDisobedience",
        "democraticConfederalism",
      ],
      q0399: ["revolution", "civilDisobedience", "democracy"],
      q0015: ["federalism", "democracy", "politicalReform"],
      q0017: ["civilPoliticalRights", "authority", "emergencyPowers"],
      q0018: ["authority", "politicalObligation", "democracy"],
      q0019: ["democracy", "civilPoliticalRights", "authority"],
      q0053: ["marketsKnowledge", "polycentricGovernance", "socialism"],
      q0054: ["competitionAssessment", "markets", "financialEntryBarriers"],
      q0055: ["markets", "regulatorGovernance", "policyCapture"],
      q0058: [
        "marketsKnowledge",
        "polycentricGovernance",
        "regulatoryInformationAsymmetry",
      ],
      q0059: ["markets", "property", "civilPoliticalRights"],
      q0141: ["intellectualProperty", "copyrightLimitations"],
      q0144: [
        "copyrightLimitations",
        "openStandardsCompetition",
        "intellectualProperty",
      ],
      q0145: ["patentExceptions", "intellectualProperty"],
      q0146: [
        "intellectualProperty",
        "copyrightLimitations",
        "civilPoliticalRights",
      ],
      q0153: ["copyrightLimitations", "intellectualProperty"],
      q0155: [
        "copyrightLimitations",
        "openStandardsCompetition",
        "intellectualProperty",
      ],
      q0156: ["intellectualProperty", "openStandardsDigitalInnovation"],
      q0157: ["copyrightLimitations", "intellectualProperty"],
      q0159: [
        "copyrightLimitations",
        "intellectualProperty",
        "civilPoliticalRights",
      ],
      q0181: ["legalPunishment", "civilPoliticalRights"],
      q0182: ["civilPoliticalRights", "legalPunishment"],
      q0183: ["legalPunishment", "distributiveJustice", "civilPoliticalRights"],
      q0184: ["legalPunishment", "civilPoliticalRights"],
      q0185: ["legalPunishment", "civilPoliticalRights", "policePerformance"],
      q0186: ["legalPunishment", "distributiveJustice", "civilPoliticalRights"],
      q0195: ["civilPoliticalRights", "legalPunishment", "regulatorAppeals"],
      q0197: ["civilPoliticalRights", "legalPunishment"],
      q0198: ["legalPunishment", "regulatorAppeals", "policePerformance"],
      q0199: ["legalPunishment", "civilPoliticalRights", "regulatorAppeals"],
      q0281: ["civilPoliticalRights", "multiculturalism", "ethnonationalism"],
      q0282: ["multiculturalism", "civilPoliticalRights", "nationalism"],
      q0283: [
        "multiculturalism",
        "civilPoliticalRights",
        "distributiveJustice",
      ],
      q0284: ["multiculturalism", "nationalism", "civilPoliticalRights"],
      q0285: ["civilPoliticalRights", "multiculturalism", "nationalism"],
      q0293: ["multiculturalism", "civilPoliticalRights", "nationalism"],
      q0294: ["multiculturalism", "civilPoliticalRights", "policyCapture"],
      q0295: ["civilPoliticalRights", "multiculturalism", "liberalism"],
      q0296: ["multiculturalism", "civilPoliticalRights", "housingSupply"],
      q0299: ["nationalism", "ethnonationalism", "civilPoliticalRights"],
      q0407: [
        "employeeGovernance",
        "structuralDomination",
        "property",
        "socialism",
      ],
      q0411: ["employeeGovernance", "democraticConfederalism", "democracy"],
      q0408: ["property", "landTenure", "distributiveJustice"],
      q0424: ["landTenure", "property", "distributiveJustice"],
      "fm-fem-2": ["feministPolitics", "feministEthics", "socialNormChange"],
      "fm-fem-3": [
        "feministPolitics",
        "feministEthics",
        "civilPoliticalRights",
      ],
      "fm-fem-4": ["feministPolitics", "labour", "distributiveJustice"],
      "fm-fem-8": ["feministPolitics", "democraticConfederalism", "democracy"],
      "fm-id-1": ["nationalism", "ethnonationalism", "multiculturalism"],
      "fm-id-2": ["nationalism", "multiculturalism", "civilPoliticalRights"],
      "fm-id-3": ["ethnonationalism", "nationalism", "civilPoliticalRights"],
      "fm-id-4": [
        "civilPoliticalRights",
        "multiculturalism",
        "ethnonationalism",
      ],
      "fm-id-6": ["civilPoliticalRights", "multiculturalism", "liberalism"],
      "fm-id-7": ["federalism", "multiculturalism", "nationalism"],
      "fm-id-8": ["nationalism", "federalism", "democracy"],
      "fm-id-9": ["multiculturalism", "nationalism", "civilPoliticalRights"],
      "fm-id-10": ["multiculturalism", "nationalism", "civilPoliticalRights"],
      "fm-id-11": ["nationalism", "federalism", "civilPoliticalRights"],
      "fm-id-12": ["federalism", "nationalism", "democracy"],
      "fm-id-13": ["nationalism", "multiculturalism", "civilPoliticalRights"],
      "fm-id-14": ["nationalism", "landTenure", "multiculturalism"],
      "fm-id-15": ["federalism", "multiculturalism", "civilPoliticalRights"],
      "fm-id-16": ["nationalism", "revolution", "civilPoliticalRights"],
      "fm-id-17": ["nationalism", "multiculturalism", "civilPoliticalRights"],
      "fm-id-18": ["nationalism", "federalism", "democracy"],
      "fm-an-1": ["authority", "revolution", "civilDisobedience"],
      "fm-an-2": ["marketsKnowledge", "polycentricGovernance", "authority"],
      "fm-an-3": ["property", "socialism", "labour"],
      "fm-an-4": ["civilDisobedience", "democraticConfederalism", "revolution"],
      "fm-gr-1": ["environmentalEthics", "climateAssessment"],
      "fm-gr-2": [
        "climateDecoupling",
        "climateAssessment",
        "distributiveJustice",
      ],
      "fm-gr-3": [
        "climateDecoupling",
        "environmentalComplianceCosts",
        "policyCapture",
      ],
      "fm-gr-4": [
        "environmentalEthics",
        "democraticConfederalism",
        "democracy",
      ],
      "fm-gr-5": ["property", "socialism", "labour"],
      "fm-so-1": ["socialism", "property", "labour"],
      "fm-so-2": ["socialism", "marketsKnowledge", "polycentricGovernance"],
      "fm-so-3": ["politicalReform", "democracy", "labour"],
      "fm-so-4": ["revolution", "democracy", "politicalReform"],
      "fm-co-1": ["politicalReform", "marketsKnowledge", "authority"],
      "fm-co-2": ["feministPolitics", "civilPoliticalRights", "secularism"],
      "fm-co-3": ["nationalism", "ethnonationalism", "multiculturalism"],
      "fm-co-4": ["war", "unCharter", "nationalism"],
      "fm-rn-1": [
        "cambridgeIslamicConstitutionalism2023",
        "islamicConstitutionalism",
        "democracy",
      ],
      "fm-rn-2": ["theocracySecularism", "secularism", "civilPoliticalRights"],
      "fm-rn-3": ["nationalism", "secularism", "religionOfficialStatus"],
      "fm-rn-4": [
        "civilPoliticalRights",
        "multiculturalism",
        "religionOfficialStatus",
      ],
      "fm-te-2": ["aiEthics", "aiRisk", "democracy"],
      "fm-te-4": ["accelerationism", "aiEthics", "politicalReform"],
      "fm-mm-1": ["authority", "democracy", "nationalism"],
      "fm-mm-2": ["authority", "democracy", "politicalObligation"],
      "fm-mm-3": [
        "federalism",
        "democraticConfederalism",
        "polycentricGovernance",
      ],
    };

    for (const [questionId, sourceIds] of Object.entries(expectedSources)) {
      expect(questionContextById[questionId]?.sourceIds).toEqual(sourceIds);
      expect(questionContextById[questionId]?.contextNote).toMatch(
        /specific|scope|conditional|interacting|emergency|relative|decoupling|contact|target group|constitutional|party competition|hierarchy|safeguards|instruments|status|supply|licensing|attribution|patent|interoperability|enforcement|association|causal|backsliding|redeemability|separat|separab|distinct|\bnot\b|rather/i,
      );
    }
  });

  it("leaves no active core or specialist question on generated fallback context", () => {
    const genericQuestions = contextTargets.filter(
      (question) => !questionContextById[question.id],
    );
    expect(genericQuestions).toEqual([]);
  });
});
