import type {
  Axis,
  LabelExposureAxisSnapshot,
  LabelExposureCoverageBand,
  LabelExposurePosition,
  LabelExposurePresentation,
  ResultProfile,
} from "../types";
import { coverageLabel } from "../resultLanguage";
import { LABEL_EXPOSURE_VERSION } from "./versions";

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function labelExposurePresentationFingerprint(
  snapshots: readonly LabelExposureAxisSnapshot[],
): string {
  const canonical = snapshots
    .map((snapshot) =>
      [
        snapshot.axisId,
        snapshot.layer,
        snapshot.name,
        snapshot.position,
        snapshot.pole ?? "",
        snapshot.coverageBand,
      ].join("|"),
    )
    .join("||");
  return `lep_${hash32(canonical).toString(16).padStart(8, "0")}`;
}

function positionFor(
  normalized: number,
  axis: Axis,
): Pick<LabelExposureAxisSnapshot, "position" | "pole"> {
  if (Math.abs(normalized) < 0.12) return { position: "near midpoint" };
  const strength = Math.abs(normalized);
  const position: LabelExposurePosition =
    strength < 0.35
      ? "slightly toward"
      : strength < 0.65
        ? "leans toward"
        : "strongly toward";
  return {
    position,
    pole: normalized > 0 ? axis.positivePole : axis.negativePole,
  };
}

function coverageFor(
  result: ResultProfile,
  axisId: string,
  itemCount: number,
): LabelExposureCoverageBand {
  if (itemCount === 0) return "insufficient";
  return result.axisReliabilities?.[axisId]?.band ?? "insufficient";
}

export function labelExposureCoverageText(
  band: LabelExposureCoverageBand,
  itemCount: number,
): string {
  return itemCount === 0 ? "unmeasured" : coverageLabel(band);
}

export function buildLabelExposurePresentation(
  result: ResultProfile,
  axes: readonly Axis[],
): LabelExposurePresentation {
  const scores = new Map(
    [
      ...result.scores.normative,
      ...result.scores.descriptive,
      ...result.scores.prescriptive,
    ].map((score) => [String(score.axisId), score]),
  );
  const snapshots = axes.map((axis) => {
    const score = scores.get(String(axis.id));
    const position = score
      ? positionFor(score.normalized, axis)
      : { position: "unmeasured" as const };
    return {
      axisId: String(axis.id),
      layer: axis.layer,
      name: axis.name,
      ...position,
      coverageBand: coverageFor(result, String(axis.id), score?.itemCount ?? 0),
    } satisfies LabelExposureAxisSnapshot;
  });
  return {
    version: LABEL_EXPOSURE_VERSION,
    fingerprint: labelExposurePresentationFingerprint(snapshots),
    axes: snapshots,
  };
}

export function labelExposurePresentationErrors(
  presentation: LabelExposurePresentation,
): string[] {
  const errors: string[] = [];
  const layers = new Set(["normative", "descriptive", "prescriptive"]);
  const positions = new Set([
    "near midpoint",
    "slightly toward",
    "leans toward",
    "strongly toward",
    "unmeasured",
  ]);
  const coverageBands = new Set(["insufficient", "low", "medium", "high"]);
  if (presentation.version !== LABEL_EXPOSURE_VERSION)
    errors.push("exposure presentation version is not current");
  if (
    !/^lep_[0-9a-f]{8}$/.test(presentation.fingerprint) ||
    !Array.isArray(presentation.axes) ||
    presentation.axes.length === 0
  ) {
    errors.push("exposure presentation fingerprint or axes are invalid");
    return errors;
  }
  if (
    new Set(presentation.axes.map((axis) => axis.axisId)).size !==
    presentation.axes.length
  )
    errors.push("exposure presentation axes must be unique");
  for (const axis of presentation.axes) {
    if (
      !axis.axisId.trim() ||
      !axis.name.trim() ||
      !layers.has(axis.layer) ||
      !positions.has(axis.position) ||
      !coverageBands.has(axis.coverageBand) ||
      (axis.position !== "near midpoint" &&
        axis.position !== "unmeasured" &&
        !axis.pole?.trim())
    ) {
      errors.push("exposure presentation contains an invalid axis snapshot");
      break;
    }
  }
  if (
    labelExposurePresentationFingerprint(presentation.axes) !==
    presentation.fingerprint
  )
    errors.push("exposure presentation fingerprint does not match its axes");
  return [...new Set(errors)];
}
