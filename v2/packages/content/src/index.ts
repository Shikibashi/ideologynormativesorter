export { validateContentSchema } from "./validate-schema";
export { countExplicitMappings, validateContentSemantics } from "./validate-semantics";
export { stableSerialize } from "./serialization";
export { computeContentFingerprint } from "./fingerprint";
export {
  applyItemMappingCorrections,
} from "./apply-item-corrections";
export type { ItemMappingCorrection } from "./apply-item-corrections";
export {
  buildContentInventory,
  compileContent,
  ContentCompilationError,
} from "./compiler";
export type { CompiledContent, ContentInventory } from "./compiler";
