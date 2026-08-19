export type Branded<T extends string> = string & { readonly __v2Brand: T };

export type DomainId = Branded<"DomainId">;
export type ConstructId = Branded<"ConstructId">;
export type OntologyNodeId = Branded<"OntologyNodeId">;
export type OntologyRelationId = Branded<"OntologyRelationId">;
export type ProfileId = Branded<"ProfileId">;
export type ItemId = Branded<"ItemId">;
export type SpecialistId = Branded<"SpecialistId">;
export type SpecialistModuleId = Branded<"SpecialistModuleId">;
export type SpecialistCandidateId = Branded<"SpecialistCandidateId">;
export type ModifierId = Branded<"ModifierId">;
export type StatementOptionId = Branded<"StatementOptionId">;
export type GateId = Branded<"GateId">;
export type ProvenanceId = Branded<"ProvenanceId">;

export const createDomainId = (value: string): DomainId => value as DomainId;
export const createConstructId = (value: string): ConstructId =>
  value as ConstructId;
export const createOntologyNodeId = (value: string): OntologyNodeId =>
  value as OntologyNodeId;
export const createOntologyRelationId = (value: string): OntologyRelationId =>
  value as OntologyRelationId;
export const createProfileId = (value: string): ProfileId => value as ProfileId;
export const createItemId = (value: string): ItemId => value as ItemId;
export const createSpecialistId = (value: string): SpecialistId =>
  value as SpecialistId;
export const createSpecialistModuleId = (value: string): SpecialistModuleId =>
  value as SpecialistModuleId;
export const createSpecialistCandidateId = (
  value: string,
): SpecialistCandidateId => value as SpecialistCandidateId;
export const createModifierId = (value: string): ModifierId =>
  value as ModifierId;
export const createStatementOptionId = (value: string): StatementOptionId =>
  value as StatementOptionId;
export const createGateId = (value: string): GateId => value as GateId;
export const createProvenanceId = (value: string): ProvenanceId =>
  value as ProvenanceId;
