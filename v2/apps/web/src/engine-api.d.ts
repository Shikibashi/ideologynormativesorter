import type { AssessmentInput, AssessmentResult, CanonicalContentBundle } from "../../../packages/contracts/src";

export declare function scoreAssessment(input: AssessmentInput, bundle: CanonicalContentBundle): AssessmentResult;
export declare function validateAssessmentInput(input: unknown, bundle: CanonicalContentBundle): AssessmentInput;
