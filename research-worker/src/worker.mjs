import canonicalManifestArtifact from "../generated/canonical-manifest.json" with { type: "json" };
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const RECORD_TYPES = new Set(["core", "specialist", "specialist-disposition"]);
const LAYERS = new Set(["normative", "descriptive", "prescriptive"]);
const SALIENCE_VALUES = new Set([1, 3, 5]);
const CANONICAL_MANIFEST = isObject(canonicalManifestArtifact?.manifest)
   ? canonicalManifestArtifact.manifest
   : {};
const CANONICAL_MANIFEST_METADATA = isObject(CANONICAL_MANIFEST.metadata)
   ? CANONICAL_MANIFEST.metadata
   : {};
const CANONICAL_ITEMS = Array.isArray(CANONICAL_MANIFEST.items)
   ? CANONICAL_MANIFEST.items
   : [];
const CANONICAL_ITEM_BY_ID = new Map(
   CANONICAL_ITEMS.filter((item) => isObject(item) && validToken(item.id)).map(
      (item) => [item.id, item],
   ),
);
const ACTIVE_CORE_ITEM_IDS = new Set(
   Array.isArray(CANONICAL_MANIFEST.activeCoreItemIds)
      ? CANONICAL_MANIFEST.activeCoreItemIds
      : [],
);
const CONDITIONAL_SPECIALIST_ITEM_IDS = new Set(
   Array.isArray(CANONICAL_MANIFEST.conditionalSpecialistItemIds)
      ? CANONICAL_MANIFEST.conditionalSpecialistItemIds
      : [],
);
const CANONICAL_SPECIALIST_MODULE_BY_ID = new Map(
   Array.isArray(CANONICAL_MANIFEST.specialistModules)
      ? CANONICAL_MANIFEST.specialistModules
         .filter((module) => isObject(module) && validToken(module.id))
         .map((module) => [module.id, module])
      : [],
);
const DEFAULT_CONFIDENCE_PROMPT =
   "How confident are you in the answer you just gave?";
const DEFAULT_PRIORITY_PROMPT =
   "How important is the policy or strategy you selected, relative to other changes?";
const SALIENCE_HELP_TEXT = {
   confidence:
      "“Confidence” means how sure you are that your answer is accurate. This rating controls how strongly this empirical answer counts in your result. Skipping the rating excludes the answer from your result.",
   priority:
      "“Priority” means how important this policy or strategy is compared with other changes. This rating controls how strongly this preference counts in your result. Skipping the rating excludes the answer from your result.",
};
const SALIENCE_OPTIONS = [
   { value: 1, label: "Low" },
   { value: 3, label: "Medium" },
   { value: 5, label: "High" },
   { value: "skipped", label: "Skip rating" },
];
const LIKERT_LABELS = {
   likert5: {
      "-2": "Disagree",
      "-1": "Somewhat disagree",
      0: "Neutral",
      1: "Somewhat agree",
      2: "Agree",
   },
   likert7: {
      "-3": "Strongly disagree",
      "-2": "Disagree",
      "-1": "Somewhat disagree",
      0: "Neutral",
      1: "Somewhat agree",
      2: "Agree",
      3: "Strongly agree",
   },
};

/*
 * The canonical contract and item manifest are generated outside this bounded
 * Worker source tree. Deployments may provide contract metadata through
 * Wrangler vars, but both generated artifacts remain authoritative.
 * Missing or incomplete metadata fails closed.
 */
const CONTRACT_METADATA_FIELDS = [
   "contractVersion",
   "sourceManifestSha256",
   "manifestSchemaVersion",
   "manifestVersion",
   "manifestFingerprint",
   "serializationVersion",
   "serializationFingerprint",
   "schemaContractVersion",
   "schemaFingerprint",
   "contractRoute",
   "cohort",
   "cohortVersion",
   "cohortFingerprint",
];

function nonEmptyValue(value) {
   return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function contractArtifactSource(env) {
   return (
      env.CANONICAL_CONTRACT_ARTIFACT ??
      env.RESEARCH_CONTRACT_ARTIFACT ??
      env.CANONICAL_CONTRACT_JSON ??
      env.CANONICAL_CONTRACT
   );
}

function configuredContractMetadata(env) {
   const values = {
      contractVersion: env.EXPECTED_CONTRACT_VERSION,
      sourceManifestSha256: env.EXPECTED_SOURCE_MANIFEST_SHA256,
      manifestSchemaVersion: env.EXPECTED_MANIFEST_SCHEMA_VERSION,
      manifestVersion: env.EXPECTED_MANIFEST_VERSION,
      manifestFingerprint: env.EXPECTED_MANIFEST_FINGERPRINT,
      serializationVersion: env.EXPECTED_SERIALIZATION_VERSION,
      serializationFingerprint: env.EXPECTED_SERIALIZATION_FINGERPRINT,
      schemaContractVersion: env.EXPECTED_CONTRACT_SCHEMA_VERSION,
      schemaFingerprint: env.EXPECTED_SCHEMA_FINGERPRINT,
      contractRoute: env.EXPECTED_CONTRACT_ROUTE,
      cohort: env.EXPECTED_COHORT ?? env.EXPECTED_CONTRACT_COHORT,
      cohortVersion: env.EXPECTED_COHORT_VERSION,
      cohortFingerprint: env.EXPECTED_COHORT_FINGERPRINT,
   };
   return Object.fromEntries(
      Object.entries(values)
         .map(([key, value]) => [key, nonEmptyValue(value)])
         .filter(([, value]) => value !== undefined),
   );
}
function configuredLegacyContractRoutes(env) {
   if (typeof env.ALLOWED_LEGACY_CONTRACT_ROUTES !== "string") return [];
   return env.ALLOWED_LEGACY_CONTRACT_ROUTES.split(",")
      .map((value) => value.trim())
      .filter((value) => validString(value, 512));
}

function contractArtifactMetadata(env) {
   const source = contractArtifactSource(env);
   const hasArtifactSource = !(
      source === undefined ||
      source === null ||
      source === ""
   );
   const configured = configuredContractMetadata(env);
   if (
      (source === undefined || source === null || source === "") &&
      Object.keys(configured).length === 0
   )
      return { invalid: true };

   let artifact = source;
   if (typeof source === "string") {
      try {
         artifact = JSON.parse(source);
      } catch {
         return { invalid: true };
      }
   }
   if (artifact !== undefined && !isObject(artifact)) return { invalid: true };

   const metadataSource = isObject(artifact?.metadata) ? artifact.metadata : {};
   const manifest = isObject(artifact?.manifest)
      ? artifact.manifest
      : isObject(metadataSource.manifest)
         ? metadataSource.manifest
         : {};
   const manifestMetadata = isObject(manifest.metadata) ? manifest.metadata : {};
   const serialization = isObject(artifact?.serialization)
      ? artifact.serialization
      : isObject(metadataSource.serialization)
         ? metadataSource.serialization
         : {};
   const schema = isObject(artifact?.schema)
      ? artifact.schema
      : isObject(metadataSource.schema)
         ? metadataSource.schema
         : {};
   const cohortObject = isObject(artifact?.cohort)
      ? artifact.cohort
      : isObject(metadataSource.cohort)
         ? metadataSource.cohort
         : {};
   const contract = isObject(artifact?.contract)
      ? artifact.contract
      : isObject(metadataSource.contract)
         ? metadataSource.contract
         : {};

   const metadata = {
      contractVersion:
         artifact?.contractVersion ??
         metadataSource.contractVersion ??
         contract.version,
      sourceManifestSha256:
         artifact?.sourceManifestSha256 ??
         metadataSource.sourceManifestSha256 ??
         manifest.sourceManifestSha256 ??
         manifestMetadata.sourceManifestSha256,
      manifestSchemaVersion:
         artifact?.manifestSchemaVersion ??
         metadataSource.manifestSchemaVersion ??
         manifest.schemaVersion ??
         manifestMetadata.schemaVersion ??
         manifestMetadata.manifestSchemaVersion,
      manifestVersion:
         artifact?.manifestVersion ??
         metadataSource.manifestVersion ??
         manifest.version ??
         manifestMetadata.version ??
         manifestMetadata.manifestVersion,
      manifestFingerprint:
         artifact?.manifestFingerprint ??
         artifact?.canonicalManifestFingerprint ??
         metadataSource.manifestFingerprint ??
         metadataSource.canonicalManifestFingerprint ??
         manifest.fingerprint ??
         manifest.canonicalManifestFingerprint ??
         manifestMetadata.fingerprint ??
         manifestMetadata.manifestFingerprint,
      serializationVersion:
         artifact?.serializationVersion ??
         metadataSource.serializationVersion ??
         serialization.version,
      serializationFingerprint:
         artifact?.serializationFingerprint ??
         metadataSource.serializationFingerprint ??
         serialization.fingerprint,
      schemaContractVersion:
         artifact?.schemaContractVersion ??
         metadataSource.schemaContractVersion ??
         artifact?.schemaVersion ??
         schema.version,
      schemaFingerprint:
         artifact?.schemaFingerprint ??
         metadataSource.schemaFingerprint ??
         schema.fingerprint,
      contractRoute:
         artifact?.contractRoute ??
         metadataSource.contractRoute ??
         artifact?.route ??
         metadataSource.route ??
         (hasArtifactSource ? undefined : configured.contractRoute),
      cohort:
         typeof artifact?.cohort === "string"
            ? artifact.cohort
            : typeof metadataSource.cohort === "string"
               ? metadataSource.cohort
               : (cohortObject.id ??
                  cohortObject.name ??
                  cohortObject.cohort ??
                  (hasArtifactSource ? undefined : configured.cohort)),
      cohortVersion:
         artifact?.cohortVersion ??
         metadataSource.cohortVersion ??
         cohortObject.version,
      cohortFingerprint:
         artifact?.cohortFingerprint ??
         metadataSource.cohortFingerprint ??
         cohortObject.fingerprint,
   };

   for (const field of CONTRACT_METADATA_FIELDS) {
      const value = nonEmptyValue(
         metadata[field] ?? (hasArtifactSource ? undefined : configured[field]),
      );
      if (value !== undefined) metadata[field] = value;
      else delete metadata[field];
   }
   if (
      !CONTRACT_METADATA_FIELDS.every(
         (field) => nonEmptyValue(metadata[field]) !== undefined,
      ) ||
      metadata.manifestSchemaVersion !==
      CANONICAL_MANIFEST_METADATA.schemaVersion ||
      metadata.manifestVersion !== CANONICAL_MANIFEST_METADATA.version ||
      metadata.manifestFingerprint !== CANONICAL_MANIFEST_METADATA.fingerprint ||
      metadata.serializationVersion !== "canonical-json-v1"
   ) {
      return { invalid: true };
   }

   if (
      nonEmptyValue(env.EXPECTED_BANK_VERSION) !==
      CANONICAL_MANIFEST_METADATA.version
   ) {
      return { invalid: true };
   }
   if (
      (metadata.sourceManifestSha256 !== undefined &&
         !/^[0-9a-f]{64}$/u.test(metadata.sourceManifestSha256)) ||
      Object.entries(metadata).some(
         ([field, value]) =>
            field !== "sourceManifestSha256" && !validString(value, 2048),
      )
   ) {
      return { invalid: true };
   }
   return metadata;
}

function suppliedContractMetadata(submission) {
   if (!isObject(submission)) return null;
   const candidates = [
      submission.researchContract,
      submission.contractMetadata,
      submission.canonicalContract,
      submission.contract,
   ];
   const result = {};
   for (const candidate of candidates) {
      if (!isObject(candidate)) continue;
      const candidateFields = CONTRACT_METADATA_FIELDS.filter(
         (field) => candidate[field] !== undefined,
      );
      const candidateHasMetadata =
         candidateFields.length > 0 || candidate === submission.contractMetadata;
      if (candidateHasMetadata) {
         if (
            !CONTRACT_METADATA_FIELDS.every(
               (field) => nonEmptyValue(candidate[field]) !== undefined,
            )
         )
            return { invalid: true };
         if (
            candidate === submission.contractMetadata &&
            !validContractSnapshot(candidate.snapshot)
         )
            return { invalid: true };
      }
      if (
         candidate.snapshot !== undefined &&
         !validContractSnapshot(candidate.snapshot)
      )
         return { invalid: true };
      if (
         candidate.provenance !== undefined &&
         !validBrowserProvenance(candidate.provenance)
      )
         return { invalid: true };
      for (const field of CONTRACT_METADATA_FIELDS) {
         if (candidate[field] === undefined) continue;
         if (result[field] !== undefined && result[field] !== candidate[field])
            return { invalid: true };
         result[field] = candidate[field];
      }
   }
   const topLevelFields = CONTRACT_METADATA_FIELDS.filter(
      (field) => submission[field] !== undefined,
   );
   if (
      topLevelFields.length > 0 &&
      !CONTRACT_METADATA_FIELDS.every(
         (field) => nonEmptyValue(submission[field]) !== undefined,
      )
   )
      return { invalid: true };
   for (const field of CONTRACT_METADATA_FIELDS) {
      if (submission[field] === undefined) continue;
      if (result[field] !== undefined && result[field] !== submission[field])
         return { invalid: true };
      result[field] = submission[field];
   }
   if (
      submission.provenance !== undefined &&
      !validBrowserProvenance(submission.provenance)
   )
      return { invalid: true };
   if (
      submission.observations !== undefined &&
      !validBrowserObservations(submission.observations)
   )
      return { invalid: true };
   return Object.keys(result).length > 0 ? result : null;
}

function contractMetadataMatches(submission, env) {
   const expected = contractArtifactMetadata(env);
   if (expected?.invalid) return false;
   if (!expected) return true;
   const supplied = suppliedContractMetadata(submission);
   if (!supplied || supplied.invalid) return false;
   return CONTRACT_METADATA_FIELDS.every((field) => {
      if (expected[field] === undefined) return false;
      if (supplied[field] === expected[field]) return true;
      return (
         field === "contractRoute" &&
         configuredLegacyContractRoutes(env).includes(supplied[field])
      );
   });
}
function requestContractMetadataMatches(request, submission, env) {
   if (!contractMetadataMatches(submission, env)) return false;
   const expected = contractArtifactMetadata(env);
   if (!expected || expected.invalid) return !expected?.invalid;
   for (const [header, field] of [
      ["x-contract-route", "contractRoute"],
      ["x-cohort", "cohort"],
   ]) {
      const supplied = request.headers.get(header);
      const expectedValue =
         field === "cohort"
            ? (expected.cohort ?? expected.cohortVersion)
            : expected[field];
      if (
         supplied !== null &&
         expectedValue !== undefined &&
         supplied !== expectedValue &&
         !(
            field === "contractRoute" &&
            configuredLegacyContractRoutes(env).includes(supplied)
         )
      )
         return false;
   }
   return true;
}

function attachContractMetadata(submission, env) {
   const metadata = contractArtifactMetadata(env);
   if (!metadata || metadata.invalid) return submission;
   return {
      ...submission,
      researchContract: {
         ...metadata,
      },
   };
}

function isObject(value) {
   return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validToken(value, maximumLength = 128) {
   return (
      typeof value === "string" &&
      value.length > 0 &&
      value.length <= maximumLength &&
      TOKEN_PATTERN.test(value)
   );
}

function validString(value, maximumLength = 10_000) {
   return (
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.length <= maximumLength
   );
}

function validVersion(value, expected) {
   // Bank fingerprints concatenate the versioned review overlays. Keep a
   // bounded field, but allow the configured fingerprint to grow beyond the
   // short metadata limit used by individual module versions.
   return (
      validString(value, 2048) &&
      typeof expected === "string" &&
      value === expected
   );
}

function validTimestamp(value) {
   if (typeof value !== "string") return false;
   const parsed = Date.parse(value);
   return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}
function validBrowserProvenance(value) {
   return (
      isObject(value) &&
      value.source === "browser" &&
      validTimestamp(value.capturedAt) &&
      (value.surface === undefined || validString(value.surface, 512)) &&
      (value.runtimeVersion === undefined ||
         validString(value.runtimeVersion, 512))
   );
}

function validBrowserObservation(value) {
   return (
      isObject(value) &&
      value.kind === "browser-observation" &&
      value.source === "browser" &&
      "value" in value &&
      (value.observedAt === undefined || validTimestamp(value.observedAt))
   );
}

function validBrowserObservations(value) {
   if (
      !isObject(value) ||
      Object.values(value).some(
         (observation) => !validBrowserObservation(observation),
      )
   )
      return false;
   const canonicalItems = value.canonicalItems;
   return (
      canonicalItems === undefined ||
      (Array.isArray(canonicalItems.value) &&
         canonicalItems.value.every(validItem))
   );
}
function validContractSnapshot(snapshot) {
   if (!isObject(snapshot)) return false;
   if (
      ![
         "contractVersion",
         "manifestSchemaVersion",
         "manifestVersion",
         "manifestFingerprint",
         "serializationVersion",
         "serializationFingerprint",
         "schemaVersion",
         "schemaFingerprint",
         "cohortVersion",
         "cohortFingerprint",
      ].every((field) => validString(snapshot[field], 2048))
   )
      return false;
   if (
      (snapshot.sourceManifestSha256 !== undefined &&
         !/^[0-9a-f]{64}$/u.test(snapshot.sourceManifestSha256)) ||
      (snapshot.contractFingerprint !== undefined &&
         !/^[0-9a-f]{64}$/u.test(snapshot.contractFingerprint))
   )
      return false;
   if (
      !isObject(snapshot.study) ||
      !validString(snapshot.study.studyId, 512) ||
      !isObject(snapshot.form) ||
      !validString(snapshot.form.formId, 512) ||
      !validString(snapshot.form.formVersion, 512) ||
      !validString(snapshot.form.fingerprint, 2048) ||
      !validBrowserProvenance(snapshot.provenance) ||
      !validBrowserObservations(snapshot.observations) ||
      !isObject(snapshot.versionBundle)
   )
      return false;
   if (
      ![
         "manifestSchemaVersion",
         "manifestVersion",
         "serializationVersion",
         "schemaVersion",
         "cohortVersion",
      ].every((field) => snapshot.versionBundle[field] === snapshot[field])
   )
      return false;
   return true;
}

function configuredInteger(value, fallback) {
   const parsed = Number(value);
   return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function configuredIntegerSet(value) {
   if (typeof value !== "string") return new Set();
   return new Set(
      value
         .split(",")
         .map((entry) => Number(entry.trim()))
         .filter((entry) => Number.isInteger(entry) && entry > 0),
   );
}

function configuredTokenList(value) {
   if (typeof value !== "string") return [];
   const values = value.split(",").map((entry) => entry.trim());
   if (
      values.length === 0 ||
      !values.every((entry) => validToken(entry)) ||
      new Set(values).size !== values.length
   )
      return [];
   return values;
}

function validConsent(consent, env) {
   return (
      isObject(consent) &&
      consent.ageConfirmed === true &&
      consent.voluntaryParticipation === true &&
      consent.dataUseAccepted === true &&
      consent.consentVersion === env.EXPECTED_CONSENT_VERSION &&
      validTimestamp(consent.consentedAt) &&
      isObject(consent.disclosureSnapshot) &&
      consent.disclosureSnapshot.endpointConfigured === true &&
      validString(consent.disclosureSnapshot.transferAndWithdrawalNotice) &&
      validString(consent.disclosureSnapshot.retentionNotice) &&
      validString(consent.disclosureSnapshot.contactNotice)
   );
}

function validBaseRecord(submission, env) {
   if (
      !(
         isObject(submission) &&
         submission.schemaVersion === env.EXPECTED_SCHEMA_VERSION &&
         RECORD_TYPES.has(submission.recordType) &&
         validToken(submission.submissionId, 96) &&
         submission.studyId === env.EXPECTED_STUDY_ID &&
         validToken(submission.participantId, 96) &&
         (submission.administration === "test" ||
            submission.administration === "retest") &&
         validTimestamp(submission.submittedAt) &&
         validTimestamp(submission.startedAt) &&
         validTimestamp(submission.completedAt) &&
         Number.isInteger(submission.durationMs) &&
         submission.durationMs >= 0 &&
         validConsent(submission.consent, env) &&
         validToken(submission.locale, 32) &&
         submission.qualityRuleVersion === env.EXPECTED_QUALITY_RULE_VERSION
      )
   )
      return false;

   const startedAt = Date.parse(submission.startedAt);
   const completedAt = Date.parse(submission.completedAt);
   const submittedAt = Date.parse(submission.submittedAt);
   const consentedAt = Date.parse(submission.consent.consentedAt);
   return (
      startedAt <= completedAt &&
      completedAt <= submittedAt &&
      consentedAt <= completedAt &&
      submission.durationMs === completedAt - startedAt
   );
}

function validResponseOption(option) {
   return (
      isObject(option) &&
      (typeof option.value === "number" || typeof option.value === "string") &&
      validString(option.label)
   );
}

function validItem(item) {
   return (
      isObject(item) &&
      validToken(item.questionId) &&
      validString(item.prompt) &&
      validString(item.helpText) &&
      validToken(item.domain) &&
      LAYERS.has(item.layer) &&
      Array.isArray(item.responseOptions) &&
      item.responseOptions.length > 0 &&
      item.responseOptions.every(validResponseOption) &&
      (item.sourceCount === undefined ||
         (Number.isInteger(item.sourceCount) && item.sourceCount >= 0)) &&
      (item.provenance === undefined || validBrowserProvenance(item.provenance))
   );
}
const TIER_RANK = {
   blitz: 0,
   quick: 1,
   moderate: 2,
   extensive: 3,
};
const ITEM_SNAPSHOT_FIELDS = new Set([
   "questionId",
   "prompt",
   "helpText",
   "domain",
   "layer",
   "theoryContext",
   "responseType",
   "responseOptions",
   "axisWeights",
   "statementOptions",
   "constructWeights",
   "reverseScored",
   "confidencePrompt",
   "priorityPrompt",
   "salience",
   "reviewStatus",
   "evidenceNote",
   "contextNote",
   "sourceCount",
]);

function canonicalResponseOptions(item) {
   const responseType = item.responseType ?? "likert7";
   const options =
      responseType === "statementChoice"
         ? (Array.isArray(item.statementOptions) ? item.statementOptions : []).map(
            (option, index) => ({
               value: index,
               label: option.text,
               optionId: option.id,
            }),
         )
         : (responseType === "likert5"
            ? [-2, -1, 0, 1, 2]
            : [-3, -2, -1, 0, 1, 2, 3]
         ).map((value) => ({
            value,
            label:
               LIKERT_LABELS[responseType === "likert5" ? "likert5" : "likert7"][
               String(value)
               ],
         }));
   if (item.layer === "descriptive" || item.allowDontKnow === true) {
      options.push({ value: "dont_know", label: "I don't know" });
   }
   options.push({
      value: "prefer_not_to_answer",
      label: "Prefer not to answer",
   });
   return options;
}

function canonicalAxisWeights(item) {
   return Object.entries(item.rootConstructWeights ?? {}).map(
      ([axisId, weight]) => ({ axisId, weight }),
   );
}

function canonicalStatementOptions(item) {
   if (!Array.isArray(item.statementOptions)) return undefined;
   return item.statementOptions.map((option) => ({
      id: option.id,
      text: option.text,
      axisWeights: Object.entries(option.rootConstructWeights ?? {}).map(
         ([axisId, weight]) => ({ axisId, weight }),
      ),
   }));
}

function canonicalSalience(item) {
   if (item.layer !== "descriptive" && item.layer !== "prescriptive")
      return undefined;
   const kind = item.layer === "descriptive" ? "confidence" : "priority";
   return {
      kind,
      prompt:
         kind === "confidence"
            ? (item.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT)
            : (item.priorityPrompt ?? ""),
      helpText: SALIENCE_HELP_TEXT[kind],
      options: SALIENCE_OPTIONS,
   };
}

function canonicalItemContentMatches(item, canonical) {
   if (!Object.keys(item).every((field) => ITEM_SNAPSHOT_FIELDS.has(field)))
      return false;
   const expected = {
      questionId: canonical.id,
      prompt: canonical.prompt,
      domain: canonical.domain,
      layer: canonical.layer,
      theoryContext: "mixed",
      responseType: canonical.responseType ?? "likert7",
      responseOptions:
         canonical.allowDontKnow === true &&
            Array.isArray(item.responseOptions) &&
            !item.responseOptions.some((option) => option?.value === "dont_know")
            ? canonicalResponseOptions({ ...canonical, allowDontKnow: false })
            : canonicalResponseOptions(canonical),
      axisWeights: canonicalAxisWeights(canonical),
      reverseScored: canonical.reverseScored === true,
      reviewStatus: "approved",
   };
   const statementOptions = canonicalStatementOptions(canonical);
   if (statementOptions === undefined && item.statementOptions !== undefined)
      return false;
   if (statementOptions !== undefined)
      expected.statementOptions = statementOptions;
   if (canonical.localConstructWeights === undefined) {
      if (item.constructWeights !== undefined) return false;
   } else {
      expected.constructWeights = canonical.localConstructWeights;
   }
   if (canonical.helpText !== undefined && item.helpText !== undefined)
      expected.helpText = canonical.helpText;
   if (canonical.evidenceNote !== undefined && item.evidenceNote !== undefined)
      expected.evidenceNote = canonical.evidenceNote;
   if (canonical.contextNote !== undefined && item.contextNote !== undefined)
      expected.contextNote = canonical.contextNote;
   if (canonical.layer === "descriptive") {
      expected.confidencePrompt =
         canonical.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT;
   }
   if (
      canonical.layer === "prescriptive" &&
      canonical.priorityPrompt !== undefined
   )
      expected.priorityPrompt = canonical.priorityPrompt;
   const salience = canonicalSalience(canonical);
   if (salience === undefined) delete expected.salience;
   else expected.salience = salience;
   return Object.entries(expected).every(
      ([field, value]) =>
         item[field] !== undefined &&
         canonicalize(item[field]) === canonicalize(value),
   );
}

function validCanonicalItemMap(submission) {
   if (!Array.isArray(submission.itemMap)) return false;
   const maxTier = TIER_RANK[submission.tier];
   if (submission.recordType === "core" && maxTier === undefined) return false;
   return submission.itemMap.every((item) => {
      const canonical = CANONICAL_ITEM_BY_ID.get(item.questionId);
      if (!canonical || !canonicalItemContentMatches(item, canonical))
         return false;
      if (submission.recordType === "core") {
         return (
            canonical.role === "core" &&
            ACTIVE_CORE_ITEM_IDS.has(canonical.id) &&
            TIER_RANK[canonical.tier] <= maxTier
         );
      }
      return (
         canonical.role === "specialist" &&
         CONDITIONAL_SPECIALIST_ITEM_IDS.has(canonical.id) &&
         canonical.moduleId === submission.moduleId
      );
   });
}
function resolvedCanonicalSpecialistModule(moduleId) {
   const module = CANONICAL_SPECIALIST_MODULE_BY_ID.get(moduleId);
   if (
      !isObject(module) ||
      module.id !== moduleId ||
      !validString(module.version, 512) ||
      !Array.isArray(module.itemIds) ||
      module.itemIds.length === 0 ||
      !module.itemIds.every((itemId) => validToken(itemId)) ||
      new Set(module.itemIds).size !== module.itemIds.length
   )
      return undefined;
   return module;
}

function validSpecialistItemMap(submission, module) {
   if (!validCanonicalItemMap(submission)) return false;
   const itemIds = submission.itemMap.map((item) => item.questionId);
   const expectedItemIds = new Set(module.itemIds);
   return (
      itemIds.length === expectedItemIds.size &&
      new Set(itemIds).size === itemIds.length &&
      itemIds.every((itemId) => expectedItemIds.has(itemId))
   );
}

function validSpecialistEvidence(value, itemCount) {
   if (value === undefined || value === null) return true;
   return (
      isObject(value) &&
      (value.answeredItemCount === undefined ||
         (Number.isInteger(value.answeredItemCount) &&
            value.answeredItemCount >= 0 &&
            value.answeredItemCount <= itemCount))
   );
}

function validAnswer(answer, item) {
   if (!isObject(answer) || answer.questionId !== item.questionId) return false;
   if (
      !item.responseOptions.some((option) =>
         Object.is(option.value, answer.value),
      )
   )
      return false;

   const substantive = typeof answer.value === "number";
   const hasConfidence = answer.confidence !== undefined;
   const hasPriority = answer.priority !== undefined;
   const skipped = answer.salienceSkipped === true;
   if (answer.salienceSkipped !== undefined && !skipped) return false;
   if (!substantive) return !hasConfidence && !hasPriority && !skipped;
   if (item.layer === "normative")
      return !hasConfidence && !hasPriority && !skipped;

   const rating =
      item.layer === "descriptive" ? answer.confidence : answer.priority;
   const hasWrongRating =
      item.layer === "descriptive" ? hasPriority : hasConfidence;
   if (hasWrongRating) return false;
   return skipped ? rating === undefined : SALIENCE_VALUES.has(rating);
}

function validAnsweredRecord(submission) {
   if (
      !(
         isObject(submission.answers) &&
         Array.isArray(submission.itemMap) &&
         Array.isArray(submission.presentationOrder) &&
         submission.itemMap.every(validItem)
      )
   )
      return false;

   const itemIds = submission.itemMap.map((item) => item.questionId);
   const answerIds = Object.keys(submission.answers);
   if (
      new Set(itemIds).size !== itemIds.length ||
      itemIds.length !== answerIds.length ||
      itemIds.length !== submission.presentationOrder.length ||
      !submission.presentationOrder.every((id, index) => id === itemIds[index])
   )
      return false;

   const membership = new Set(itemIds);
   return (
      answerIds.every((id) => membership.has(id)) &&
      submission.itemMap.every((item) =>
         validAnswer(submission.answers[item.questionId], item),
      )
   );
}

function hash32(value) {
   let hash = 2166136261;
   for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
   }
   return hash >>> 0;
}

export function researchFormFingerprint(
   itemMap,
   formVersion = "profile-form-v3",
) {
   const canonicalIds = itemMap
      .map((item) => item.questionId)
      .sort()
      .join("|");
   return `rf_${hash32(`${formVersion}:${canonicalIds}`).toString(16).padStart(8, "0")}`;
}

function labelRosterFingerprint(
   role,
   labelIds,
   taxonomyVersion,
   measurementVersion = "not-applicable",
) {
   if (!Array.isArray(labelIds)) return "";
   const canonicalIds = [...new Set(labelIds)].sort().join("|");
   const payload = `${taxonomyVersion}:${role}:${measurementVersion}:${canonicalIds}`;
   return `lr_${hash32(payload).toString(16).padStart(8, "0")}`;
}

function validIdentity(identity) {
   if (!isObject(identity)) return false;
   if (identity.selfLabelId !== undefined && !validToken(identity.selfLabelId))
      return false;
   if (
      identity.selfReportedIdeologies !== undefined &&
      (typeof identity.selfReportedIdeologies !== "string" ||
         identity.selfReportedIdeologies.length > 240)
   )
      return false;
   if (
      identity.ageBand !== undefined &&
      !["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].includes(
         identity.ageBand,
      )
   )
      return false;
   return (
      identity.genderGroup === undefined ||
      ["woman", "man", "nonbinary-or-another"].includes(identity.genderGroup)
   );
}

function validCoreRecord(submission, env) {
   const expectedProfileCount =
      submission.tier === "moderate"
         ? configuredInteger(env.EXPECTED_MODERATE_ITEM_COUNT, 206)
         : submission.tier === "extensive"
            ? configuredInteger(env.EXPECTED_EXTENSIVE_ITEM_COUNT, 338)
            : null;
   const legacyProfileCounts =
      submission.tier === "moderate"
         ? configuredIntegerSet(env.ALLOWED_LEGACY_MODERATE_ITEM_COUNTS)
         : submission.tier === "extensive"
            ? configuredIntegerSet(env.ALLOWED_LEGACY_EXTENSIVE_ITEM_COUNTS)
            : new Set();
   if (expectedProfileCount !== null)
      legacyProfileCounts.add(expectedProfileCount);
   const assignedCount = submission.itemMap?.length;
   const requestedCount = submission.form?.requestedItemCount;
   const allowedMatrixCounts = configuredIntegerSet(
      env.ALLOWED_MATRIX_ITEM_COUNTS,
   );
   const validProfileForm =
      requestedCount === null && legacyProfileCounts.has(assignedCount);
   const validMatrixForm =
      Number.isInteger(requestedCount) &&
      requestedCount === assignedCount &&
      allowedMatrixCounts.has(requestedCount);
   return (
      submission.recordType === "core" &&
      validAnsweredRecord(submission) &&
      validCanonicalItemMap(submission) &&
      (submission.tier === "moderate" || submission.tier === "extensive") &&
      (validProfileForm || validMatrixForm) &&
      typeof submission.resumed === "boolean" &&
      validVersion(submission.bankVersion, env.EXPECTED_BANK_VERSION) &&
      validVersion(submission.scoringVersion, env.EXPECTED_SCORING_VERSION) &&
      validVersion(submission.taxonomyVersion, env.EXPECTED_TAXONOMY_VERSION) &&
      validVersion(
         submission.primaryMeasurementVersion,
         env.EXPECTED_PRIMARY_MEASUREMENT_VERSION,
      ) &&
      validVersion(
         submission.modifierMeasurementVersion,
         env.EXPECTED_MODIFIER_MEASUREMENT_VERSION,
      ) &&
      Array.isArray(submission.primaryLabelIds) &&
      submission.primaryLabelIds.length > 0 &&
      submission.primaryLabelIds.every((id) => validToken(id)) &&
      new Set(submission.primaryLabelIds).size ===
      submission.primaryLabelIds.length &&
      Array.isArray(submission.modifierLabelIds) &&
      submission.modifierLabelIds.every((id) => validToken(id)) &&
      new Set(submission.modifierLabelIds).size ===
      submission.modifierLabelIds.length &&
      validVersion(
         submission.primaryLabelRosterFingerprint,
         env.EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT,
      ) &&
      validVersion(
         submission.modifierLabelRosterFingerprint,
         env.EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT,
      ) &&
      submission.primaryLabelRosterFingerprint ===
      labelRosterFingerprint(
         "primary",
         submission.primaryLabelIds,
         submission.taxonomyVersion,
         submission.primaryMeasurementVersion,
      ) &&
      submission.modifierLabelRosterFingerprint ===
      labelRosterFingerprint(
         "modifier",
         submission.modifierLabelIds,
         submission.taxonomyVersion,
         submission.modifierMeasurementVersion,
      ) &&
      validIdentity(submission.identity) &&
      Array.isArray(submission.predictedLabelIds) &&
      submission.predictedLabelIds.length <= 5 &&
      submission.predictedLabelIds.every((id) => validToken(id)) &&
      new Set(submission.predictedLabelIds).size ===
      submission.predictedLabelIds.length &&
      submission.predictedLabelIds.every((id) =>
         submission.primaryLabelIds.includes(id),
      ) &&
      Array.isArray(submission.predictedModifierIds) &&
      submission.predictedModifierIds.length <= 5 &&
      submission.predictedModifierIds.every((id) => validToken(id)) &&
      new Set(submission.predictedModifierIds).size ===
      submission.predictedModifierIds.length &&
      submission.predictedModifierIds.every((id) =>
         submission.modifierLabelIds.includes(id),
      ) &&
      isObject(submission.form) &&
      submission.form.algorithmVersion === env.EXPECTED_FORM_VERSION &&
      submission.form.assignedItemCount === assignedCount &&
      submission.form.fingerprint ===
      researchFormFingerprint(submission.itemMap, env.EXPECTED_FORM_VERSION) &&
      submission.sampling?.design === "open-opt-in-nonprobability" &&
      submission.sampling?.populationInference === false &&
      submission.sampling?.weighting === "none" &&
      validToken(submission.sampling?.recruitmentSource, 96) &&
      submission.sampling?.recruitmentSourceProvenance ===
      "url-parameter-unverified" &&
      (submission.specialistAssignment === undefined ||
         validAssignment(
            submission.specialistAssignment,
            submission.specialistAssignment.moduleId,
            submission.participantId,
            submission.studyId,
            env,
         ))
   );
}

function validAssignment(assignment, moduleId, participantId, studyId, env) {
   const moduleIds = configuredTokenList(
      env.EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS,
   );
   const expectedModuleId =
      moduleIds[
      hash32(`${studyId}:${participantId}:specialist-assignment`) %
      moduleIds.length
      ];
   return (
      isObject(assignment) &&
      assignment.moduleId === moduleId &&
      validToken(assignment.moduleId) &&
      validToken(assignment.strategy) &&
      assignment.strategy === env.EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY &&
      validToken(assignment.rosterVersion) &&
      assignment.rosterVersion ===
      env.EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION &&
      expectedModuleId === moduleId
   );
}

function validSpecialistRecord(submission, env) {
   const module = resolvedCanonicalSpecialistModule(submission.moduleId);
   const observedEvidence = submission.observations?.evidence?.value;
   return (
      submission.recordType === "specialist" &&
      module !== undefined &&
      validAnsweredRecord(submission) &&
      validSpecialistItemMap(submission, module) &&
      submission.moduleVersion === module.version &&
      validSpecialistEvidence(submission.evidence, module.itemIds.length) &&
      validSpecialistEvidence(observedEvidence, module.itemIds.length) &&
      validVersion(submission.bankVersion, env.EXPECTED_BANK_VERSION) &&
      validVersion(submission.scoringVersion, env.EXPECTED_SCORING_VERSION) &&
      validAssignment(
         submission.assignment,
         submission.moduleId,
         submission.participantId,
         submission.studyId,
         env,
      ) &&
      isObject(submission.criterion) &&
      Array.isArray(submission.criterion.selectedIds) &&
      submission.criterion.selectedIds.every((id) => validToken(id)) &&
      typeof submission.criterion.noneOrUnsure === "boolean" &&
      !(
         submission.criterion.noneOrUnsure &&
         submission.criterion.selectedIds.length > 0
      ) &&
      ["low", "medium", "high"].includes(submission.criterion.confidence) &&
      isObject(submission.constructScores) &&
      Object.values(submission.constructScores).every((score) =>
         Number.isFinite(score),
      ) &&
      Array.isArray(submission.matches) &&
      submission.matches.every(
         (match) =>
            isObject(match) && validToken(match.id) && Number.isFinite(match.fit),
      )
   );
}

function validSpecialistDisposition(submission, env) {
   const module = resolvedCanonicalSpecialistModule(submission.moduleId);
   return (
      submission.recordType === "specialist-disposition" &&
      module !== undefined &&
      submission.moduleVersion === module.version &&
      validAssignment(
         submission.assignment,
         submission.moduleId,
         submission.participantId,
         submission.studyId,
         env,
      ) &&
      [
         "declined-before-start",
         "declined-after-partial",
         "declined-after-completion",
      ].includes(submission.disposition) &&
      Number.isInteger(submission.answeredCount) &&
      submission.answeredCount >= 0 &&
      submission.answeredCount <= module.itemIds.length
   );
}


export function validateSubmission(submission, env) {
   if (!contractMetadataMatches(submission, env)) return false;
   if (!validBaseRecord(submission, env)) return false;
   if (submission.recordType === "core") return validCoreRecord(submission, env);
   if (submission.recordType === "specialist")
      return validSpecialistRecord(submission, env);
   if (submission.recordType === "specialist-disposition")
      return validSpecialistDisposition(submission, env);
   return false;
}

function canonicalize(value) {
   if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
   if (isObject(value)) {
      return `{${Object.keys(value)
         .sort()
         .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
         .join(",")}}`;
   }
   return JSON.stringify(value);
}

async function submissionDigest(submission) {
   const bytes = new TextEncoder().encode(canonicalize(submission));
   const digest = await crypto.subtle.digest("SHA-256", bytes);
   return [...new Uint8Array(digest)]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
}

function responseHeaders(origin, env) {
   const headers = new Headers({
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      vary: "Origin",
   });
   if (origin === env.ALLOWED_ORIGIN)
      headers.set("access-control-allow-origin", origin);
   return headers;
}

function jsonResponse(status, body, origin, env) {
   return new Response(JSON.stringify(body), {
      status,
      headers: responseHeaders(origin, env),
   });
}
function resolvedWriteMode(env) {
   const mode = nonEmptyValue(env.WRITE_MODE)?.toLowerCase();
   return mode === "open" || mode === "drain" ? mode : null;
}

function safeHealthMetadata(env, writeMode) {
   const contract = contractArtifactMetadata(env);
   const metadata = contract?.invalid ? {} : (contract ?? {});
   return {
      contractRoute: metadata.contractRoute ?? null,
      manifestVersion: metadata.manifestVersion ?? null,
      manifestFingerprint: metadata.manifestFingerprint ?? null,
      serializationVersion: metadata.serializationVersion ?? null,
      serializationFingerprint: metadata.serializationFingerprint ?? null,
      cohort: metadata.cohort ?? metadata.cohortVersion ?? null,
      cohortVersion: metadata.cohortVersion ?? null,
      cohortFingerprint: metadata.cohortFingerprint ?? null,
      writeMode: writeMode ?? "unresolved",
   };
}

function persistedContractColumns(submission) {
   const metadata = suppliedContractMetadata(submission) ?? {};
   return {
      canonicalManifestVersion:
         submission.manifestVersion ?? metadata.manifestVersion ?? null,
      canonicalManifestFingerprint:
         submission.manifestFingerprint ?? metadata.manifestFingerprint ?? null,
      serializationVersion:
         submission.serializationVersion ?? metadata.serializationVersion ?? null,
      contractRoute: submission.contractRoute ?? metadata.contractRoute ?? null,
      contractCohort:
         submission.cohort ??
         metadata.cohort ??
         submission.cohortVersion ??
         metadata.cohortVersion ??
         null,
   };
}

async function persistSubmission(submission, env) {
   const digest = await submissionDigest(submission);
   const existing = await env.DB.prepare(
      "SELECT payload_sha256 FROM submissions WHERE submission_id = ?1",
   )
      .bind(submission.submissionId)
      .first();
   if (existing) {
      return existing.payload_sha256 === digest
         ? { duplicate: true, conflict: false }
         : { duplicate: false, conflict: true };
   }

   const receivedAt = new Date().toISOString();
   const contractColumns = persistedContractColumns(submission);
   const result = await env.DB.prepare(
      `INSERT OR IGNORE INTO submissions (
      submission_id, record_type, participant_id, study_id, schema_version,
      received_at, payload_sha256, payload_json,
      canonical_manifest_version, canonical_manifest_fingerprint,
      serialization_version, contract_route, contract_cohort
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)`,
   )
      .bind(
         submission.submissionId,
         submission.recordType,
         submission.participantId,
         submission.studyId,
         submission.schemaVersion,
         receivedAt,
         digest,
         JSON.stringify({ ...submission, receivedAt }),
         contractColumns.canonicalManifestVersion,
         contractColumns.canonicalManifestFingerprint,
         contractColumns.serializationVersion,
         contractColumns.contractRoute,
         contractColumns.contractCohort,
      )
      .run();
   if (result?.success === false) throw new Error("D1 insert failed");
   if (result?.meta?.changes === 0) {
      const raced = await env.DB.prepare(
         "SELECT payload_sha256 FROM submissions WHERE submission_id = ?1",
      )
         .bind(submission.submissionId)
         .first();
      return raced?.payload_sha256 === digest
         ? { duplicate: true, conflict: false }
         : { duplicate: false, conflict: true };
   }
   return { duplicate: false, conflict: false };
}

export async function handleRequest(request, env) {
   const origin = request.headers.get("origin") ?? "";
   const url = new URL(request.url);

   if (request.method === "GET" && url.pathname === "/health") {
      const contract = contractArtifactMetadata(env);
      const writeMode = resolvedWriteMode(env);
      const healthy =
         writeMode !== null &&
         !contract?.invalid &&
         typeof env.RESEARCH_RATE_LIMITER?.limit === "function";
      const metadata = safeHealthMetadata(env, healthy ? writeMode : null);
      const response = jsonResponse(
         healthy ? 200 : 503,
         {
            ok: healthy,
            ...metadata,
         },
         origin,
         env,
      );
      if (metadata.contractRoute !== null)
         response.headers.set("x-contract-route", metadata.contractRoute);
      if (metadata.cohort !== null)
         response.headers.set("x-cohort", metadata.cohort);
      return response;
   }

   if (request.method === "OPTIONS" && url.pathname === "/submit") {
      if (origin !== env.ALLOWED_ORIGIN)
         return jsonResponse(403, { error: "origin-not-allowed" }, origin, env);
      const headers = responseHeaders(origin, env);
      headers.set("access-control-allow-methods", "POST, OPTIONS");
      headers.set("access-control-allow-headers", "content-type");
      return new Response(null, { status: 204, headers });
   }

   if (request.method !== "POST" || url.pathname !== "/submit") {
      return jsonResponse(404, { error: "not-found" }, origin, env);
   }
   if (origin !== env.ALLOWED_ORIGIN)
      return jsonResponse(403, { error: "origin-not-allowed" }, origin, env);
   if (
      !(request.headers.get("content-type") ?? "")
         .toLowerCase()
         .startsWith("application/json")
   ) {
      return jsonResponse(415, { error: "json-required" }, origin, env);
   }
   const writeMode = resolvedWriteMode(env);
   if (writeMode === null)
      return jsonResponse(503, { error: "write-mode-unresolved" }, origin, env);
   if (writeMode === "drain") {
      const retryAfterSeconds = configuredInteger(
         env.WRITE_MODE_GRACE_SECONDS,
         60,
      );
      const response = jsonResponse(
         503,
         { error: "writes-draining" },
         origin,
         env,
      );
      response.headers.set("retry-after", String(retryAfterSeconds));
      return response;
   }

   if (!env.RESEARCH_RATE_LIMITER?.limit)
      return jsonResponse(503, { error: "rate-limiter-unavailable" }, origin, env);
   const actor = request.headers.get("cf-connecting-ip") ?? "unknown";
   const rateLimit = await env.RESEARCH_RATE_LIMITER.limit({
      key: `research:${actor}`,
   });
   if (!rateLimit.success)
      return jsonResponse(429, { error: "rate-limited" }, origin, env);

   const maximumBodyBytes = configuredInteger(env.MAXIMUM_BODY_BYTES, 2_000_000);
   const declaredLength = Number(request.headers.get("content-length") ?? 0);
   if (declaredLength > maximumBodyBytes)
      return jsonResponse(413, { error: "payload-too-large" }, origin, env);
   const body = await request.arrayBuffer();
   if (body.byteLength > maximumBodyBytes)
      return jsonResponse(413, { error: "payload-too-large" }, origin, env);

   let submission;
   try {
      submission = JSON.parse(new TextDecoder().decode(body));
   } catch {
      return jsonResponse(400, { error: "invalid-json" }, origin, env);
   }
   const contract = contractArtifactMetadata(env);
   if (contract?.invalid) {
      return jsonResponse(503, { error: "contract-unavailable" }, origin, env);
   }
   if (!requestContractMetadataMatches(request, submission, env)) {
      return jsonResponse(422, { error: "invalid-submission" }, origin, env);
   }
   if (!validateSubmission(submission, env)) {
      return jsonResponse(422, { error: "invalid-submission" }, origin, env);
   }
   submission = attachContractMetadata(submission, env);

   try {
      const persistence = await persistSubmission(submission, env);
      if (persistence.conflict)
         return jsonResponse(
            409,
            { error: "submission-id-conflict" },
            origin,
            env,
         );
      return jsonResponse(
         202,
         {
            accepted: true,
            submissionId: submission.submissionId,
            deduplicated: persistence.duplicate,
         },
         origin,
         env,
      );
   } catch (error) {
      console.error("Failed to persist contribution", error);
      return jsonResponse(500, { error: "storage-failed" }, origin, env);
   }
}

export default {
   fetch: handleRequest,
};
