export { EXPERIMENTAL_SPECIALIST_VERSION } from "./experimentalSpecialistBuilder";
export type { ExperimentalSpecialistModuleSpec } from "./experimentalSpecialistBuilder";
import type { ExperimentalSpecialistModuleSpec } from "./experimentalSpecialistBuilder";
import { experimentalSpecialistModuleSpecsPart01 } from "./experimentalSpecialistModuleSpecsPart01";
import { experimentalSpecialistModuleSpecsPart02 } from "./experimentalSpecialistModuleSpecsPart02";

export const experimentalSpecialistModuleSpecs: readonly ExperimentalSpecialistModuleSpec[] =
  [
    ...experimentalSpecialistModuleSpecsPart01,
    ...experimentalSpecialistModuleSpecsPart02,
  ];
