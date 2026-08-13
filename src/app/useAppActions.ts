import type { AnswerMap } from "../types";
import type { AppActionContext } from "./actionTypes";
import { createCoreActions } from "./coreActions";
import {
  persistCoreProgress,
  persistSpecialistProgress,
} from "./progressActions";
import { createResearchActions } from "./researchActions";
import { createSpecialistActions } from "./specialistActions";

export function useAppActions(context: AppActionContext) {
  return {
    ...createCoreActions(context),
    ...createResearchActions(context),
    ...createSpecialistActions(context),
    persistCoreProgress: (input: { answers: AnswerMap; index: number }) =>
      persistCoreProgress(context, input),
    persistSpecialistProgress: (input: { answers: AnswerMap; index: number }) =>
      persistSpecialistProgress(context, input),
  };
}
