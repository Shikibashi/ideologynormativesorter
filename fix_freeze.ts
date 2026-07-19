import fs from 'fs'
import { liveFreezeMetrics } from './src/validation/mappingAudit/inventory/freeze'

const metrics = liveFreezeMetrics()

let str = fs.readFileSync('src/validation/mappingAudit/inventory/freeze.ts', 'utf-8');

str = str.replace(/rawMainQuestionCount: \d+,/, `rawMainQuestionCount: ${metrics.rawMainQuestionCount},`);
str = str.replace(/effectiveActiveQuestionCount: \d+,/, `effectiveActiveQuestionCount: ${metrics.effectiveActiveQuestionCount},`);
str = str.replace(/effectiveRetainedQuestionCount: \d+,/, `effectiveRetainedQuestionCount: ${metrics.effectiveRetainedQuestionCount},`);
str = str.replace(/rawMainContributionCardinality: \d+,/, `rawMainContributionCardinality: ${metrics.rawMainContributionCardinality},`);
str = str.replace(/effectiveActiveContributionCardinality: \d+,/, `effectiveActiveContributionCardinality: ${metrics.effectiveActiveContributionCardinality},`);

fs.writeFileSync('src/validation/mappingAudit/inventory/freeze.ts', str);
console.log('Fixed freeze');
