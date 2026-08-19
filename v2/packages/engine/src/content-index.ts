import type {
  CanonicalContentBundle,
  ConstructRole,
} from "../../contracts/src/content";
import { throwScoringError } from "./errors/scoring-error";

export type EngineResponseType = "likert5" | "likert7" | "statement-choice";

export interface EngineContentScope {
  readonly itemIds?: readonly string[];
  readonly constructIds?: readonly string[];
}

export interface EngineItem {
  readonly id: string;
  readonly responseType: EngineResponseType;
  readonly status: string;
  readonly raw: Readonly<Record<string, unknown>>;
}

export interface EngineConstruct {
  readonly id: string;
  readonly role: ConstructRole;
  readonly raw: Readonly<Record<string, unknown>>;
}

export interface EngineMapping {
  readonly constructId: string;
  readonly weight: number;
  readonly polarity: -1 | 1;
  readonly optionId?: string;
}

export interface EngineContentIndex {
  readonly bundle: CanonicalContentBundle;
  readonly scope: Readonly<EngineContentScope>;
  readonly items: ReadonlyMap<string, EngineItem>;
  readonly activeItems: readonly EngineItem[];
  readonly activeItemIds: ReadonlySet<string>;
  readonly constructs: ReadonlyMap<string, EngineConstruct>;
  readonly activeConstructs: readonly EngineConstruct[];
  readonly activeConstructIds: ReadonlySet<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readRequiredString(
  record: Record<string, unknown>,
  key: string,
  context: string,
): string {
  const value = readString(record, key);
  if (!value) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      context + " must contain a non-empty " + key,
      { path: context + "." + key },
    );
  }
  return value;
}

function readArray(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      path + " must be an array",
      { path },
    );
  }
  return value;
}

function constructRole(value: unknown, path: string): ConstructRole {
  if (
    value === "normative" ||
    value === "descriptive" ||
    value === "prescriptive" ||
    value === "specialist"
  ) {
    return value;
  }
  throwScoringError(
    "INVALID_SCORING_CONFIGURATION",
    path + " must be a known construct role",
    { path, details: { value } },
  );
}

function responseType(value: unknown, path: string): EngineResponseType {
  if (
    value === "likert5" ||
    value === "likert7" ||
    value === "statement-choice"
  ) {
    return value;
  }
  throwScoringError(
    "INVALID_SCORING_CONFIGURATION",
    path + " must be a supported response type",
    { path, details: { value } },
  );
}

function validateMappingArray(
  value: unknown,
  path: string,
  constructs: ReadonlyMap<string, EngineConstruct>,
): void {
  const mappings = readArray(value, path);
  if (mappings.length === 0) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      path + " must contain at least one explicit contribution mapping",
      { path },
    );
  }

  const seenConstructIds = new Set<string>();
  for (const [index, candidate] of mappings.entries()) {
    if (!isRecord(candidate)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        path + "[" + index + "] must be an object",
        { path: path + "[" + index + "]" },
      );
    }
    const parsed = parseMapping(candidate, path + "[" + index + "]");
    const constructId = parsed.constructId;
    if (!constructs.has(constructId)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        path + "[" + index + "] references an unknown construct",
        {
          path: path + "[" + index + "].constructId",
          details: { constructId },
        },
      );
    }
    if (seenConstructIds.has(constructId)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        path + " contains a duplicate construct mapping",
        { path, details: { constructId } },
      );
    }
    seenConstructIds.add(constructId);
  }
}

function parseMapping(value: unknown, path: string): EngineMapping {
  if (!isRecord(value)) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      path + " must be an object",
      { path },
    );
  }
  const constructId = readRequiredString(value, "constructId", path);
  const weight = value.weight;
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      path + ".weight must be a finite positive number",
      { path: path + ".weight", details: { weight } },
    );
  }
  if (value.polarity !== -1 && value.polarity !== 1) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      path + ".polarity must be -1 or 1",
      { path: path + ".polarity", details: { polarity: value.polarity } },
    );
  }
  return {
    constructId,
    weight,
    polarity: value.polarity === -1 ? -1 : 1,
  };
}

export function getDeclaredItemMappings(
  item: EngineItem,
  optionId?: string,
): readonly EngineMapping[] {
  const scoring = item.raw.scoring;
  if (!isRecord(scoring)) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Item " + item.id + " is missing scoring configuration",
      { itemId: item.id },
    );
  }
  if (item.responseType !== "statement-choice") {
    if (!Array.isArray(scoring.contributions)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "Item " + item.id + " is missing item-level mappings",
        { itemId: item.id },
      );
    }
    return Object.freeze(
      scoring.contributions
        .map((candidate, index) =>
          parseMapping(
            candidate,
            "items." + item.id + ".scoring.contributions[" + index + "]",
          ),
        )
        .sort((left, right) =>
          left.constructId.localeCompare(right.constructId),
        ),
    );
  }

  const options = readArray(item.raw.options, "items." + item.id + ".options");
  const selectedOptions: readonly Record<string, unknown>[] = options.filter(
    (option): option is Record<string, unknown> =>
      isRecord(option) && (optionId === undefined || option.id === optionId),
  );
  if (optionId !== undefined && selectedOptions.length !== 1) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Statement-choice item " +
        item.id +
        " has no declared option " +
        optionId,
      { itemId: item.id, details: { optionId } },
    );
  }
  return Object.freeze(
    selectedOptions
      .flatMap((option, optionIndex) => {
        if (!Array.isArray(option.contributions)) {
          throwScoringError(
            "INVALID_SCORING_CONFIGURATION",
            "Statement-choice item " + item.id + " has invalid option mappings",
            { itemId: item.id, details: { optionId: option.id } },
          );
        }
        return option.contributions.map((candidate, mappingIndex) => {
          const parsed = parseMapping(
            candidate,
            "items." +
              item.id +
              ".options[" +
              optionIndex +
              "].contributions[" +
              mappingIndex +
              "]",
          );
          return {
            ...parsed,
            optionId: readRequiredString(
              option,
              "id",
              "items." + item.id + ".options[" + optionIndex + "]",
            ),
          };
        });
      })
      .sort(
        (left, right) =>
          left.constructId.localeCompare(right.constructId) ||
          (left.optionId ?? "").localeCompare(right.optionId ?? ""),
      ),
  );
}

function validateItemConfiguration(
  item: EngineItem,
  constructs: ReadonlyMap<string, EngineConstruct>,
): void {
  const scoring = item.raw.scoring;
  if (!isRecord(scoring)) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Item " + item.id + " is missing its explicit scoring configuration",
      { itemId: item.id, path: "items." + item.id + ".scoring" },
    );
  }

  const expectedMode =
    item.responseType === "statement-choice" ? "options" : "item";
  if (scoring.mappingMode !== expectedMode) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Item " + item.id + " must use " + expectedMode + " scoring mappings",
      { itemId: item.id, path: "items." + item.id + ".scoring.mappingMode" },
    );
  }

  if (item.responseType !== "statement-choice") {
    validateMappingArray(
      scoring.contributions,
      "items." + item.id + ".scoring.contributions",
      constructs,
    );
    return;
  }

  const options = readArray(item.raw.options, "items." + item.id + ".options");
  if (options.length === 0) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Statement-choice item " + item.id + " must declare options",
      { itemId: item.id, path: "items." + item.id + ".options" },
    );
  }
  const seenOptionIds = new Set<string>();
  for (const [index, candidate] of options.entries()) {
    if (!isRecord(candidate)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "items." + item.id + ".options[" + index + "] must be an object",
        {
          itemId: item.id,
          path: "items." + item.id + ".options[" + index + "]",
        },
      );
    }
    const optionId = readRequiredString(
      candidate,
      "id",
      "items." + item.id + ".options[" + index + "]",
    );
    if (seenOptionIds.has(optionId)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "Statement-choice item " + item.id + " contains a duplicate option",
        {
          itemId: item.id,
          path: "items." + item.id + ".options",
          details: { optionId },
        },
      );
    }
    seenOptionIds.add(optionId);
    validateMappingArray(
      candidate.contributions,
      "items." + item.id + ".options[" + index + "].contributions",
      constructs,
    );
  }
}

export function createEngineContentIndex(
  bundle: CanonicalContentBundle,
  requestedScope: EngineContentScope = {},
): EngineContentIndex {
  const bundleRecord = bundle as unknown as Record<string, unknown>;
  const rawConstructs = readArray(bundleRecord.constructs, "constructs");
  const constructs = new Map<string, EngineConstruct>();

  for (const [index, candidate] of rawConstructs.entries()) {
    if (!isRecord(candidate)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "constructs[" + index + "] must be an object",
        { path: "constructs[" + index + "]" },
      );
    }
    const id = readRequiredString(candidate, "id", "constructs[" + index + "]");
    if (constructs.has(id)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "Duplicate construct ID " + id,
        { path: "constructs[" + index + "].id", details: { constructId: id } },
      );
    }
    const roleValue =
      candidate.role ??
      candidate.constructType ??
      candidate.family ??
      candidate.type;
    constructs.set(id, {
      id,
      role: constructRole(roleValue, "constructs[" + index + "].role"),
      raw: candidate,
    });
  }

  const requestedConstructIds = requestedScope.constructIds
    ? [...new Set(requestedScope.constructIds)].sort()
    : undefined;
  if (requestedConstructIds) {
    for (const constructId of requestedConstructIds) {
      if (!constructs.has(constructId)) {
        throwScoringError(
          "INVALID_SCORING_CONFIGURATION",
          "Scoped scoring references unknown construct " + constructId,
          { details: { constructId } },
        );
      }
    }
  }
  const activeConstructs = [...constructs.values()]
    .filter(
      (construct) =>
        requestedConstructIds === undefined ||
        requestedConstructIds.includes(construct.id),
    )
    .sort((left, right) => left.id.localeCompare(right.id));

  const rawItems = readArray(bundleRecord.items, "items");
  const items = new Map<string, EngineItem>();
  for (const [index, candidate] of rawItems.entries()) {
    if (!isRecord(candidate)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "items[" + index + "] must be an object",
        { path: "items[" + index + "]" },
      );
    }
    const id = readRequiredString(candidate, "id", "items[" + index + "]");
    if (items.has(id)) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "Duplicate item ID " + id,
        { path: "items[" + index + "].id", details: { itemId: id } },
      );
    }
    const item: EngineItem = {
      id,
      responseType: responseType(
        candidate.responseType,
        "items[" + index + "].responseType",
      ),
      status: readRequiredString(candidate, "status", "items[" + index + "]"),
      raw: candidate,
    };
    items.set(id, item);
  }

  const requestedItemIds = requestedScope.itemIds
    ? [...new Set(requestedScope.itemIds)].sort()
    : undefined;
  if (requestedItemIds) {
    for (const itemId of requestedItemIds) {
      const item = items.get(itemId);
      if (!item) {
        throwScoringError(
          "INVALID_SCORING_CONFIGURATION",
          "Scoped scoring references unknown item " + itemId,
          { itemId },
        );
      }
      if (item.status !== "active") {
        throwScoringError(
          "INVALID_SCORING_CONFIGURATION",
          "Scoped scoring references inactive item " + itemId,
          { itemId },
        );
      }
    }
  }
  const activeItems = [...items.values()]
    .filter((item) => item.status === "active")
    .filter(
      (item) =>
        requestedItemIds === undefined || requestedItemIds.includes(item.id),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  for (const item of activeItems) {
    validateItemConfiguration(item, constructs);
    if (
      item.raw.reverseScored !== undefined &&
      typeof item.raw.reverseScored !== "boolean"
    ) {
      throwScoringError(
        "INVALID_SCORING_CONFIGURATION",
        "Item " + item.id + ".reverseScored must be boolean when present",
        { itemId: item.id, path: "items." + item.id + ".reverseScored" },
      );
    }
  }

  return {
    bundle,
    scope: Object.freeze({
      ...(requestedItemIds === undefined
        ? {}
        : { itemIds: Object.freeze(requestedItemIds) }),
      ...(requestedConstructIds === undefined
        ? {}
        : { constructIds: Object.freeze(requestedConstructIds) }),
    }),
    items,
    activeItems: Object.freeze(activeItems),
    activeItemIds: new Set(activeItems.map((item) => item.id)),
    constructs,
    activeConstructs: Object.freeze(activeConstructs),
    activeConstructIds: new Set(
      activeConstructs.map((construct) => construct.id),
    ),
  };
}

export function getEngineItem(
  index: EngineContentIndex,
  itemId: string,
): EngineItem {
  const item = index.items.get(itemId);
  if (!item) {
    throwScoringError(
      "UNKNOWN_ITEM",
      "Response references unknown item " + itemId,
      { itemId },
    );
  }
  if (item.status !== "active") {
    throwScoringError(
      "INACTIVE_ITEM",
      "Response references inactive item " + itemId,
      { itemId },
    );
  }
  if (!index.activeItemIds.has(item.id)) {
    throwScoringError(
      "INVALID_RESPONSE_SHAPE",
      "Response item " + itemId + " is outside the active scoring scope",
      { itemId },
    );
  }
  return item;
}

export function getEngineConstruct(
  index: EngineContentIndex,
  constructId: string,
): EngineConstruct {
  const construct = index.constructs.get(constructId);
  if (!construct) {
    throwScoringError(
      "INVALID_SCORING_CONFIGURATION",
      "Scoring mapping references unknown construct " + constructId,
      { details: { constructId } },
    );
  }
  return construct;
}

export function isRecordValue(
  value: unknown,
): value is Record<string, unknown> {
  return isRecord(value);
}
