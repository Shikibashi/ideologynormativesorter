import type { ReactElement } from "react";
import type {
  Axis,
  AxisId,
  AxisReliability,
  LabelMatch,
  LabelReliability,
} from "../types";
import {
  getIdeologyLayerSummary,
  getIdeologyTermDefinitions,
  LAYER_EXPLAINERS,
} from "../data/ideologyExplainers";
import {
  coverageLabel,
  axisPositionLabel,
  comparisonStabilityLabel,
  labelProximityLabel,
  layerAgreementLabel,
} from "../resultLanguage";
import { LAYERS, LAYER_LABELS } from "./resultsShared";
import type { LabelWithInfluences } from "./resultsPhilosophy";

const SOURCE_SCOPE_LABELS = {
  definition: "Definition",
  normative: "Normative interpretation",
  descriptive: "Descriptive interpretation",
  prescriptive: "Prescriptive interpretation",
  boundary: "Boundary or distinction",
} as const;

function taxonomyStatusLabel(
  taxonomy?: LabelWithInfluences["taxonomy"],
): string | null {
  if (!taxonomy) return null;
  if (taxonomy.measurementStatus === "core-primary")
    return "primary scored family";
  if (taxonomy.measurementStatus === "modifier-scored")
    return "modifier scored independently";
  if (taxonomy.measurementStatus === "modifier-follow-up")
    return "modifier available through focused follow-up";
  if (taxonomy.measurementStatus === "modifier-catalog-only")
    return "catalog modifier · not currently scored";
  if (taxonomy.measurementStatus === "validated-specialist")
    return "validated specialist follow-up";
  if (taxonomy.measurementStatus === "provisional-specialist")
    return "provisional specialist";
  if (taxonomy.measurementStatus === "context-only")
    return "context / institution";
  return "compatibility alias";
}

function taxonomyScaleLabel(
  taxonomy?: LabelWithInfluences["taxonomy"],
): string | null {
  if (!taxonomy) return null;
  const respondentScale = taxonomy.analyticalScale.respondentMeasurementScale
    ? ` · respondent estimate: ${taxonomy.analyticalScale.respondentMeasurementScale}-level uptake`
    : "";
  return `common analytical scales: ${taxonomy.analyticalScale.commonScales.join(" / ")}${respondentScale}`;
}

function labelEvidenceSummary(
  label: LabelWithInfluences,
  match?: LabelMatch,
  labelReliability?: LabelReliability,
  axisReliabilities?: Record<AxisId, AxisReliability>,
  axisById?: Map<AxisId, Axis>,
): string {
  if (match?.modifierConstruct) {
    const {
      name,
      answeredQuestionIds,
      indicatorQuestionIds,
      minimumAnsweredItems,
    } = match.modifierConstruct;
    return `direct ${name} coverage: ${answeredQuestionIds.length} of ${indicatorQuestionIds.length} indicators answered (minimum ${minimumAnsweredItems}) · not inferred from the full ${label.name} profile`;
  }

  const comparisonAxes =
    label.scoringScope?.axisIds ?? Object.keys(label.centroid);
  const sparseAxes = comparisonAxes
    .filter((axisId): axisId is AxisId => {
      const reliability = axisReliabilities?.[axisId];
      return (
        !reliability ||
        reliability.band === "insufficient" ||
        reliability.itemCount < 3
      );
    })
    .map((axisId) => axisById?.get(axisId)?.name ?? axisId)
    .slice(0, 2);
  const reliabilityText = labelReliability
    ? coverageLabel(labelReliability.band)
    : "answer coverage unavailable";
  const scopeText = label.scoringScope
    ? `primary core comparison: ${match?.measuredAxisCount ?? 0} of ${label.scoringScope.axisIds.length} constructs measured · `
    : "";
  const sparseText =
    sparseAxes.length > 0 ? ` · less certain on ${sparseAxes.join(", ")}` : "";
  return `${scopeText}${reliabilityText}${sparseText}`;
}

function LabelCardSummary({
  label,
  match,
  labelReliability,
  axisReliabilities,
  axisById,
  compact,
}: LabelCardProps): ReactElement {
  return (
    <>
      <h5>{label.name}</h5>
      {taxonomyStatusLabel(label.taxonomy) && (
        <p className="muted label-taxonomy-status">
          {taxonomyStatusLabel(label.taxonomy)}
        </p>
      )}
      {taxonomyScaleLabel(label.taxonomy) && (
        <p className="muted label-taxonomy-status">
          {taxonomyScaleLabel(label.taxonomy)}
        </p>
      )}
      {match && (
        <p className="muted">
          {labelProximityLabel(match.fit)} ·{" "}
          {comparisonStabilityLabel(match.uncertaintyBand)}
          {match.runnerUpMargin !== undefined &&
            match.runnerUpMargin < 0.08 && (
              <> · several labels are similarly close</>
            )}
        </p>
      )}
      {match && (
        <p className="muted label-evidence">
          {labelEvidenceSummary(
            label,
            match,
            labelReliability,
            axisReliabilities,
            axisById,
          )}
        </p>
      )}
      {match?.modifierConstruct && (
        <p className="muted label-note">
          <strong>{match.modifierConstruct.name}:</strong>{" "}
          {match.modifierConstruct.note}
        </p>
      )}
      <p>{label.description}</p>
      {compact ? (
        (label.usageNote || label.cautionNote) && (
          <details className="label-context-disclosure">
            <summary>Usage and caution</summary>
            {label.usageNote && (
              <p className="muted label-note">{label.usageNote}</p>
            )}
            {label.cautionNote && (
              <p className="muted label-note">Note: {label.cautionNote}</p>
            )}
          </details>
        )
      ) : (
        <>
          {label.usageNote && (
            <p className="muted label-note">{label.usageNote}</p>
          )}
          {label.cautionNote && (
            <p className="muted label-note">Note: {label.cautionNote}</p>
          )}
        </>
      )}
    </>
  );
}

function LabelCardScope({
  label,
  axisById,
}: Pick<LabelCardProps, "label" | "axisById">): ReactElement {
  return (
    <>
      {label.taxonomy && (
        <details className="label-scale-disclosure">
          <summary>Analytical scale and scope</summary>
          <p className="muted">{label.taxonomy.analyticalScale.note}</p>
          <p className="muted">
            Common scales:{" "}
            {label.taxonomy.analyticalScale.commonScales.join(", ")}. Scale
            registry: {label.taxonomy.analyticalScaleVersion}.
          </p>
          {label.taxonomy.analyticalScale.respondentMeasurementScale && (
            <p className="muted">
              Respondent estimate: micro-level uptake of the tradition’s claims.
              This is not a nano-level inference from a single answer.
            </p>
          )}
          <ul>
            {label.taxonomy.analyticalScale.sources.map((source) => (
              <li key={source.sourceId}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
                <span className="muted"> · {source.publisher}</span>
                <div className="muted">{source.note}</div>
              </li>
            ))}
          </ul>
        </details>
      )}
      {label.scoringScope && (
        <details className="label-scale-disclosure">
          <summary>Ordinary scoring construct scope</summary>
          <p className="muted">
            This broad-primary comparison uses only its named core constructs.
            It does not use the rest of the catalog centroid as a proxy for
            beliefs the instrument did not measure.
          </p>
          <p className="muted">{label.scoringScope.rationale}</p>
          <ul>
            {label.scoringScope.axisIds.map((axisId) => (
              <li key={axisId}>
                {axisById?.get(axisId)?.name ?? axisId}
                {label.scoringScope!.requiredAxisIds.includes(axisId) && (
                  <span className="muted">
                    {" "}
                    · {label.scoringScope!.minimumItemCounts?.[axisId] ??
                      1}{" "}
                    direct response
                    {(label.scoringScope!.minimumItemCounts?.[axisId] ?? 1) ===
                    1
                      ? ""
                      : "s"}{" "}
                    required before this label can be shown
                  </span>
                )}
              </li>
            ))}
          </ul>
          {label.scoringScope.limitation && (
            <p className="muted">
              Current limit: {label.scoringScope.limitation}
            </p>
          )}
          {label.sources && (
            <p className="muted">
              Scope sources:{" "}
              {label.sources
                .filter((source) =>
                  label.scoringScope!.sourceIds.includes(source.sourceId),
                )
                .map((source) => source.title)
                .join(", ")}
              .
            </p>
          )}
        </details>
      )}
    </>
  );
}

function LabelCardInterpretation({
  label,
  axisById,
}: Pick<LabelCardProps, "label" | "axisById">): ReactElement {
  return (
    <>
      <details className="label-layer-explainer">
        <summary>How this label reads across the three layers</summary>
        {LAYERS.map((layer) => (
          <section key={layer} className="label-layer-section">
            <h6>{LAYER_EXPLAINERS[layer].label}</h6>
            <p>
              {getIdeologyLayerSummary(
                label,
                axisById ? Array.from(axisById.values()) : [],
                layer,
              )}
            </p>
          </section>
        ))}
      </details>
      {getIdeologyTermDefinitions(label).length > 0 && (
        <details className="label-term-guide">
          <summary>Term guide</summary>
          {getIdeologyTermDefinitions(label).map((definition) => (
            <p key={definition}>{definition}</p>
          ))}
        </details>
      )}
      {label.sources && label.sources.length > 0 && (
        <details className="label-source-disclosure">
          <summary>Sources and scope</summary>
          <p className="muted">
            These are public background sources for interpreting the label. They
            do not validate your score, the label centroid, or the claim that
            you hold the tradition.
          </p>
          <ul>
            {label.sources.map((source) => (
              <li key={source.sourceId}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
                {source.publisher && (
                  <span className="muted"> · {source.publisher}</span>
                )}
                <div className="muted label-source-scope">
                  Supports:{" "}
                  {source.supports
                    .map((scope) => SOURCE_SCOPE_LABELS[scope])
                    .join(", ")}
                </div>
                <div className="muted">{source.note}</div>
              </li>
            ))}
          </ul>
        </details>
      )}
      {label.philosophies && label.philosophies.length > 0 && (
        <p className="muted">
          Philosophies: {label.philosophies.slice(0, 5).join(", ")}
        </p>
      )}
    </>
  );
}

function LabelCardReasoning({
  label,
  match,
  axisById,
}: Pick<LabelCardProps, "label" | "match" | "axisById">): ReactElement | null {
  if (!match?.reasoning || !axisById) return null;
  return (
    <details className="label-reasoning">
      <summary>Why is this nearby?</summary>
      {match.layerEvidence && (
        <div className="reasoning-group">
          <strong>Layer-level proximity</strong>
          <ul>
            {LAYERS.map((layer) => {
              const evidence = match.layerEvidence![layer];
              const summary =
                evidence.fit === null
                  ? "not measured for this comparison"
                  : `${layerAgreementLabel(evidence.fit)} · ${evidence.measuredAxisCount} of ${evidence.totalAxisCount} relevant axes measured`;
              return (
                <li key={layer}>
                  {LAYER_LABELS[layer]}: {summary}
                </li>
              );
            })}
          </ul>
          <p className="muted">
            Each layer is compared independently. A close value in one layer
            does not turn disagreement in another into agreement.
          </p>
        </div>
      )}
      {match.reasoning.sharedExtremeAxes.length > 0 && (
        <div className="reasoning-group">
          <strong>Top Shared Values</strong>
          <ul>
            {match.reasoning.sharedExtremeAxes.map((item) => (
              <li key={item.axisId}>
                {axisById.get(item.axisId)?.name}: you are{" "}
                {axisPositionLabel(item.userScore, axisById.get(item.axisId)!)},
                and {label.name} is{" "}
                {axisPositionLabel(item.labelScore, axisById.get(item.axisId)!)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {match.reasoning.divergentAxes.length > 0 && (
        <div className="reasoning-group">
          <strong>Biggest Differences</strong>
          <ul>
            {match.reasoning.divergentAxes.map((item) => (
              <li key={item.axisId}>
                {axisById.get(item.axisId)?.name}: you are{" "}
                {axisPositionLabel(item.userScore, axisById.get(item.axisId)!)},
                while {label.name} is{" "}
                {axisPositionLabel(item.labelScore, axisById.get(item.axisId)!)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </details>
  );
}

interface LabelCardProps {
  label: LabelWithInfluences;
  match?: LabelMatch;
  labelReliability?: LabelReliability;
  axisReliabilities?: Record<AxisId, AxisReliability>;
  axisById?: Map<AxisId, Axis>;
  compact?: boolean;
}

export function LabelCard({
  label,
  match,
  labelReliability,
  axisReliabilities,
  axisById,
  compact = false,
}: LabelCardProps): ReactElement {
  return (
    <article className={`label-card${compact ? " label-card-compact" : ""}`}>
      <LabelCardSummary
        label={label}
        match={match}
        labelReliability={labelReliability}
        axisReliabilities={axisReliabilities}
        axisById={axisById}
        compact={compact}
      />
      <LabelCardScope label={label} axisById={axisById} />
      <LabelCardInterpretation label={label} axisById={axisById} />
      <LabelCardReasoning label={label} match={match} axisById={axisById} />
    </article>
  );
}
