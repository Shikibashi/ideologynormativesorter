export interface TermDefinition {
  pattern: RegExp;
  definition: string;
  domains?: string[];
}
