import { useEffect, useState } from "react";
import {
  buildCompareUrl,
  buildShareUrl,
  decodeCompatibleAnswers,
  extractEncodedAnswers,
} from "../share";
import type {
  AnswerMap,
  Axis,
  Domain,
  LabelMatch,
  ResultProfile,
} from "../types";
import {
  feministSpecialistCandidates,
  type FeministSpecialistCandidate,
} from "../data/feministBreadth";
import {
  catalogRelatedTraditions,
  type CatalogRelatedTradition,
} from "../data/catalogRelatedTraditions";
import { AxisBar } from "./AxisBar";
import { LabelCard } from "./LabelCard";
import { CompassPlot } from "./CompassPlot";
import {
  buildPhilosophyRows,
  philosophyOverview,
  type LabelWithInfluences,
} from "./resultsPhilosophy";
import { announceStatus } from "../status";
import { LAYERS, LAYER_LABELS } from "./resultsShared";
import {
  axisPositionLabel,
  idealGapLabel,
  labelProximityLabel,
  layerAgreementLabel,
} from "../resultLanguage";

interface ResultsScreenProps {
  result: ResultProfile;
  axes: Axis[];
  domains: Domain[];
  labels: LabelWithInfluences[];
  answers: AnswerMap;
  compareResult?: ResultProfile | null;
  onCompare: (answers: AnswerMap) => void;
  onRestart: () => void;
}

const RESULT_SECTION_IDS = new Set([
  "profile",
  "layers",
  "gaps",
  "divergences",
  "labels",
  "modifiers",
]);
const NEAREST_LABEL_PREVIEW_COUNT = 5;

function activeResultSection(hash: string): string {
  const fragment = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(fragment);
  const parameterSection = params.get("section");
  if (parameterSection && RESULT_SECTION_IDS.has(parameterSection))
    return `#${parameterSection}`;
  return RESULT_SECTION_IDS.has(fragment) ? `#${fragment}` : "";
}

function resultSectionHref(section: string): string {
  const fragment = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(fragment);
  if (!params.has("r")) return `#${section}`;
  params.set("section", section);
  return `#${params.toString()}`;
}

function formatFamilyName(family: string): string {
  return family
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function topFit(subfamilies: Record<string, { fit: number }[]>): number {
  let best = 0;
  for (const matches of Object.values(subfamilies)) {
    for (const m of matches) if (m.fit > best) best = m.fit;
  }
  return best;
}

function selectFamilySubtree(
  subtree: Record<string, Record<string, LabelMatch[]>> | undefined,
  matches: LabelMatch[],
): Record<string, Record<string, LabelMatch[]>> {
  if (!subtree) return {};
  const selectedIds = new Set(matches.map((match) => match.labelId));
  const selected: Record<string, Record<string, LabelMatch[]>> = {};

  for (const [family, subfamilies] of Object.entries(subtree)) {
    for (const [subfamily, familyMatches] of Object.entries(subfamilies)) {
      const visibleMatches = familyMatches.filter((match) =>
        selectedIds.has(match.labelId),
      );
      if (visibleMatches.length === 0) continue;
      selected[family] ??= {};
      selected[family][subfamily] = visibleMatches;
    }
  }

  return selected;
}

const LAYER_TITLES = {
  normative:
    "Foundational values profile — ideal legitimacy and moral commitments",
  descriptive: "Empirical beliefs profile — how you think institutions behave",
  prescriptive: "Applied policy profile — practical institutions and strategy",
} as const;

function groupLabels(
  labels: LabelWithInfluences[],
): Record<string, Record<string, LabelWithInfluences[]>> {
  const grouped: Record<string, Record<string, LabelWithInfluences[]>> = {};
  for (const label of labels) {
    const family = label.family;
    const subfamily = label.subfamily ?? label.family;
    grouped[family] ??= {};
    grouped[family][subfamily] ??= [];
    grouped[family][subfamily].push(label);
  }
  return grouped;
}

function labelMatchesSearch(
  label: LabelWithInfluences,
  query: string,
): boolean {
  if (!query) return true;
  const haystack = [
    label.name,
    label.family,
    label.subfamily,
    label.description,
    label.usageNote,
    label.cautionNote,
    label.taxonomy?.analyticalScale.note,
    ...(label.taxonomy?.analyticalScale.commonScales ?? []),
    ...(label.aliases ?? []),
    ...(label.philosophies ?? []),
    ...(label.subTheories ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

interface BrowserRelatedTradition {
  id: string;
  name: string;
  family: string;
  subfamily?: string;
  aliases?: readonly string[];
  description: string;
  sourceUrls?: readonly string[];
  availability: "focused-follow-up" | "catalog-candidate";
}

function relatedTraditionMatchesSearch(
  candidate: BrowserRelatedTradition,
  query: string,
): boolean {
  if (!query) return true;
  const haystack = [
    candidate.name,
    candidate.family,
    candidate.subfamily,
    candidate.description,
    ...(candidate.aliases ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function focusedFeministTradition(
  candidate: FeministSpecialistCandidate,
): BrowserRelatedTradition {
  return {
    id: candidate.id,
    name: candidate.name,
    family: "feminist",
    subfamily: "feminist-specialist",
    aliases: candidate.aliases,
    description: candidate.description,
    availability: "focused-follow-up",
  };
}

function catalogCandidateTradition(
  candidate: CatalogRelatedTradition,
): BrowserRelatedTradition {
  return { ...candidate, availability: candidate.status };
}

function sourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export function ResultsScreen({
  result,
  axes,
  domains,
  labels,
  answers,
  compareResult,
  onCompare,
  onRestart,
}: ResultsScreenProps) {
  const axisById = new Map(axes.map((a) => [a.id, a]));
  const domainById = new Map(domains.map((d) => [d.id, d]));
  const nearestById = new Map(
    result.nearestLabels.map((match) => [match.labelId, match]),
  );
  const modifierMatches = result.modifierMatches ?? [];
  const philosophyRows = buildPhilosophyRows(result, labels, axes);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [compareUrlInput, setCompareUrlInput] = useState("");
  const [compareError, setCompareError] = useState<string | null>(null);
  const [labelSearch, setLabelSearch] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(() =>
    activeResultSection(window.location.hash),
  );
  const visibleLabels = labels.filter((label) =>
    labelMatchesSearch(label, labelSearch),
  );
  const publicLabelIds = new Set(labels.map((label) => label.id));
  const relatedTraditions: BrowserRelatedTradition[] = [
    ...feministSpecialistCandidates
      .filter(
        (candidate) =>
          candidate.status === "candidate-specialist" &&
          !publicLabelIds.has(candidate.id),
      )
      .map(focusedFeministTradition),
    ...catalogRelatedTraditions.map(catalogCandidateTradition),
  ];
  const visibleRelatedTraditions = relatedTraditions.filter((candidate) =>
    relatedTraditionMatchesSearch(candidate, labelSearch),
  );
  const groupedLabels = groupLabels(visibleLabels);
  const nearestPreview = result.nearestLabels.slice(
    0,
    NEAREST_LABEL_PREVIEW_COUNT,
  );
  const nearestPreviewSubtree = selectFamilySubtree(
    result.familySubtree,
    nearestPreview,
  );

  useEffect(() => {
    const update = () => {
      const section = activeResultSection(window.location.hash);
      setActiveSection(section);
      if (
        section &&
        new URLSearchParams(window.location.hash.replace(/^#/, "")).has(
          "section",
        )
      ) {
        requestAnimationFrame(() =>
          document
            .getElementById(section.slice(1))
            ?.scrollIntoView({ block: "start" }),
        );
      }
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  function handleCopyLink() {
    const meta = result.bankVersion
      ? {
          bankVersion: result.bankVersion,
          scoringVersion: result.scoringVersion,
        }
      : undefined;
    const url = buildShareUrl(answers, meta);
    if (!navigator.clipboard?.writeText) {
      setCopied(false);
      setShareUrl(url);
      setCopyError(
        "Automatic copying isn't available here. Select the link below and copy it manually.",
      );
      return;
    }
    setCopying(true);
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setCopyError(null);
        setShareUrl(null);
        setCopying(false);
        announceStatus("Share link copied to the clipboard.");
      },
      (err) => {
        console.error("Clipboard write failed:", err);
        setCopied(false);
        setShareUrl(url);
        setCopyError(
          "We couldn't copy the link automatically. Select the link below and copy it manually.",
        );
        setCopying(false);
        announceStatus("Share link ready to copy manually.");
      },
    );
  }

  function handleCompareLink() {
    const encoded = extractEncodedAnswers(compareUrlInput, "r");
    const expectedMeta = result.bankVersion
      ? {
          bankVersion: result.bankVersion,
          scoringVersion: result.scoringVersion,
        }
      : undefined;
    const parsedAnswers = encoded
      ? decodeCompatibleAnswers(encoded, expectedMeta)
      : null;
    if (!parsedAnswers || Object.keys(parsedAnswers).length === 0) {
      setCompareError(
        "We couldn't read that link. Paste a full shared result link (it should contain '#r=').",
      );
      return;
    }

    onCompare(parsedAnswers);
    setCompareError(null);
    announceStatus("Comparison profile loaded.");
    window.history.replaceState(
      null,
      "",
      buildCompareUrl(answers, parsedAnswers, expectedMeta),
    );
  }

  return (
    <section className="screen results-screen">
      <h1>Your results</h1>
      <p className="muted">
        This test separates your normative values, descriptive beliefs, and
        prescriptive strategy. Labels are secondary.
      </p>

      <button
        type="button"
        className="scale-button copy-link-button"
        onClick={handleCopyLink}
        disabled={copying}
      >
        {copying
          ? "Copying..."
          : copied
            ? "Link copied"
            : "Copy link to this result"}
      </button>
      {copyError && (
        <p className="muted" role="alert">
          {copyError}
        </p>
      )}
      {shareUrl && (
        <input
          type="text"
          className="compare-url-input"
          readOnly
          value={shareUrl}
          aria-label="Shareable result link"
          onFocus={(e) => e.currentTarget.select()}
          style={{ width: "100%", padding: "0.3rem 0.5rem" }}
        />
      )}

      <div className="results-workbench">
        <nav className="results-navigator" aria-label="Result sections">
          <h2>Result index</h2>
          <a
            href={resultSectionHref("profile")}
            aria-current={activeSection === "#profile" ? "location" : undefined}
          >
            <span className="navigator-marker" aria-hidden="true">
              ›
            </span>
            Profile
          </a>
          <a
            href={resultSectionHref("layers")}
            aria-current={activeSection === "#layers" ? "location" : undefined}
          >
            <span className="navigator-marker" aria-hidden="true">
              ›
            </span>
            Layer scores
          </a>
          {result.gaps.length > 0 && (
            <a
              href={resultSectionHref("gaps")}
              aria-current={activeSection === "#gaps" ? "location" : undefined}
            >
              <span className="navigator-marker" aria-hidden="true">
                ›
              </span>
              Ideal vs. non-ideal
            </a>
          )}
          {result.divergences && result.divergences.length > 0 && (
            <a
              href={resultSectionHref("divergences")}
              aria-current={
                activeSection === "#divergences" ? "location" : undefined
              }
            >
              <span className="navigator-marker" aria-hidden="true">
                ›
              </span>
              Divergences
            </a>
          )}
          {modifierMatches.length > 0 && (
            <a
              href={resultSectionHref("modifiers")}
              aria-current={
                activeSection === "#modifiers" ? "location" : undefined
              }
            >
              <span className="navigator-marker" aria-hidden="true">
                ›
              </span>
              Orientations
            </a>
          )}
          <a
            href={resultSectionHref("labels")}
            aria-current={activeSection === "#labels" ? "location" : undefined}
          >
            <span className="navigator-marker" aria-hidden="true">
              ›
            </span>
            Nearest labels
          </a>
          <a href={`${import.meta.env.BASE_URL}?view=methodology`}>
            <span className="navigator-marker" aria-hidden="true">
              ›
            </span>
            Methodology
          </a>
        </nav>
        <div className="results-primary-column">
          <div id="profile" className="result-block compass-block">
            <h2>Compass</h2>
            <CompassPlot
              scores={result.scores}
              compareScores={compareResult?.scores}
            />
          </div>
          {LAYERS.map((layer) => (
            <div
              id={layer === "normative" ? "layers" : undefined}
              className="result-block"
              key={layer}
            >
              <h2>{LAYER_TITLES[layer]}</h2>
              <div className="axis-bar-list">
                {(result.scores[layer] || []).map((score) => {
                  const axis = axisById.get(score.axisId);
                  return axis ? (
                    <AxisBar
                      key={score.axisId}
                      axis={axis}
                      score={score}
                      result={result}
                    />
                  ) : null;
                })}
              </div>
            </div>
          ))}

          {compareResult && (
            <div className="result-block">
              <h2>Axis comparison</h2>
              <p className="muted">
                Your profile and the compared profile, shown on the same
                directional scales.
              </p>
              {LAYERS.map((layer) => (
                <div key={layer}>
                  <h3 style={{ textTransform: "capitalize" }}>{layer}</h3>
                  <div className="axis-bar-list">
                    {(result.scores[layer] || []).map((score) => {
                      const axis = axisById.get(score.axisId);
                      if (!axis) return null;
                      const other = compareResult.scores[layer]?.find(
                        (s) => s.axisId === score.axisId,
                      );
                      return (
                        <div key={score.axisId} className="axis-compare-row">
                          <span className="axis-compare-label">
                            {axis.name}
                          </span>
                          <div
                            className="axis-compare-bars"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              flex: 1,
                            }}
                          >
                            <AxisBar
                              axis={axis}
                              score={score}
                              result={result}
                            />
                            {other && (
                              <AxisBar
                                axis={axis}
                                score={other}
                                result={compareResult}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.gaps.length > 0 && (
            <div id="gaps" className="result-block">
              <h2>Ideal vs. non-ideal gap</h2>
              <p className="muted">
                Large gaps show where your ideal theory diverges from what you
                prescribe under current conditions.
              </p>
              <ul className="gap-list">
                {result.gaps.map((gap) => (
                  <li key={gap.domain}>
                    <strong>
                      {domainById.get(gap.domain)?.name ?? gap.domain}
                    </strong>
                    : {idealGapLabel(gap.gap)}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.divergences && result.divergences.length > 0 && (
            <div id="divergences" className="result-block">
              <h2>Divergences & Strategic Compromises</h2>
              <p className="muted">
                These reports highlight conflicts or trade-offs between
                different layers of your views.
              </p>
              <ul className="gap-list">
                {result.divergences.map((div, i) => (
                  <li key={i}>
                    <strong style={{ textTransform: "capitalize" }}>
                      {div.type.replaceAll("_", " ")}
                    </strong>
                    :{" "}
                    {div.type === "layer_divergence" &&
                    div.affectedAxes?.length === 2
                      ? `Your ${axisById.get(div.affectedAxes[0])?.name ?? "foundational value"} and ${axisById.get(div.affectedAxes[1])?.name ?? "practical strategy"} point in meaningfully different directions.`
                      : div.type === "strategic_compromise" &&
                          div.affectedDomains?.[0]
                        ? `Your ideal-condition and current-condition answers differ substantially in ${domainById.get(div.affectedDomains[0])?.name ?? div.affectedDomains[0]}.`
                        : div.description.replace(/\s*\([^)]*\)/g, "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {philosophyRows.length > 0 && (
            <div className="result-block philosophy-explorer">
              <h2>Philosophy Explorer</h2>
              <p className="muted">
                Top philosophy influences from your nearest labels, grouped by
                the layer and axes where your scores align.
              </p>
              {LAYERS.map((layer) => {
                const rows = philosophyRows.filter(
                  (row) => row.layer === layer,
                );
                if (rows.length === 0) return null;
                return (
                  <div key={layer} className="philosophy-layer">
                    <h3>{LAYER_LABELS[layer]}</h3>
                    <div className="philosophy-list">
                      {rows.map((row) => (
                        <article
                          key={`${row.layer}:${row.philosophy}`}
                          className="philosophy-card"
                        >
                          <h4>{row.philosophy}</h4>
                          <p>{philosophyOverview(row.philosophy, row.layer)}</p>
                          <p className="muted">
                            In these matched labels:{" "}
                            {row.descriptions.slice(0, 2).join("; ")}
                          </p>
                          <p className="muted">
                            Seen in: {row.labelNames.slice(0, 3).join(", ")}
                          </p>
                          <div className="axis-chip-list">
                            {row.axisIds.map((axisId) => {
                              const axis = axisById.get(axisId);
                              const score = result.scores[layer].find(
                                (s) => s.axisId === axisId,
                              );
                              return axis ? (
                                <span key={axisId} className="axis-chip">
                                  {axis.name}:{" "}
                                  {score
                                    ? axisPositionLabel(score.normalized, axis)
                                    : "unmeasured"}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <aside
          className="results-inspector-column"
          aria-label="Comparison and label references"
        >
          {!compareResult && (
            <div className="result-block compare-input-area">
              <h2>Compare with another result</h2>
              <p className="muted">
                Paste a shared result link below to see two profiles side by
                side.
              </p>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="text"
                  className="compare-url-input"
                  value={compareUrlInput}
                  onChange={(e) => setCompareUrlInput(e.target.value)}
                  placeholder="Paste shared URL or hash..."
                  maxLength={5000}
                  style={{ flex: 1, padding: "0.3rem 0.5rem" }}
                  aria-label="Shared result link to compare"
                  aria-invalid={compareError ? true : undefined}
                  aria-describedby={compareError ? "compare-error" : undefined}
                />
                <button
                  type="button"
                  className="scale-button"
                  onClick={handleCompareLink}
                >
                  Compare
                </button>
              </div>
              {compareError && (
                <p className="muted" role="alert" id="compare-error">
                  {compareError}
                </p>
              )}
            </div>
          )}

          {modifierMatches.length > 0 && (
            <div
              id="modifiers"
              className="result-block results-inspector-block"
            >
              <h2>Orientations and modifiers</h2>
              <p className="muted">
                These are independently measured cross-cutting tendencies, not
                primary ideology claims. A modifier can coexist with several
                different political families.
              </p>
              <div className="label-card-list">
                {modifierMatches.map((match) => {
                  const label = labels.find(
                    (candidate) => candidate.id === match.labelId,
                  );
                  return label ? (
                    <LabelCard
                      key={match.labelId}
                      label={label}
                      match={match}
                      labelReliability={result.labelReliabilities?.[label.id]}
                      axisReliabilities={result.axisReliabilities}
                      axisById={axisById}
                      compact
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {compareResult && (
            <div className="result-block compare-banner">
              <h2>Comparison view</h2>
              <p className="muted">
                Showing both profiles side by side — your scores on the left,
                compared profile on the right.
              </p>
            </div>
          )}

          <div id="labels" className="result-block results-inspector-block">
            <h2>Nearest catalog labels</h2>
            <p className="muted">
              These are the closest reference profiles among the scored labels,
              not claims that you subscribe to them. Proximity can coexist with
              important disagreements; open “Why is this nearby?” to compare
              directions.
            </p>
            {result.nearestLabels.length > NEAREST_LABEL_PREVIEW_COUNT && (
              <p className="muted nearest-preview-note">
                Showing the five closest profiles. Browse the full catalog below
                to inspect every label.
              </p>
            )}
            {Object.keys(nearestPreviewSubtree).length > 0 ? (
              Object.entries(nearestPreviewSubtree)
                .sort((a, b) => topFit(b[1]) - topFit(a[1]))
                .map(([family, subfamilies]) => (
                  <details key={family} className="family-group" open>
                    <summary className="family-name">
                      {formatFamilyName(family)}
                    </summary>
                    {Object.entries(subfamilies)
                      .sort((a, b) => (b[1][0]?.fit ?? 0) - (a[1][0]?.fit ?? 0))
                      .map(([subfamily, matches]) => (
                        <details
                          key={subfamily}
                          className="subfamily-group"
                          open
                        >
                          <summary className="subfamily-name">
                            {subfamily !== family
                              ? formatFamilyName(subfamily)
                              : "Top matches"}
                          </summary>
                          <div className="label-card-list">
                            {matches.map((match) => {
                              const label = labels.find(
                                (l) => l.id === match.labelId,
                              );
                              return label ? (
                                <LabelCard
                                  key={match.labelId}
                                  label={label}
                                  match={match}
                                  labelReliability={
                                    result.labelReliabilities?.[label.id]
                                  }
                                  axisReliabilities={result.axisReliabilities}
                                  axisById={axisById}
                                  compact
                                />
                              ) : null;
                            })}
                          </div>
                        </details>
                      ))}
                  </details>
                ))
            ) : (
              <ol className="label-list">
                {nearestPreview.map((match) => (
                  <li key={match.labelId}>
                    {match.name}{" "}
                    <span className="muted">
                      ({labelProximityLabel(match.fit).toLowerCase()})
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <details className="result-block full-label-browser results-inspector-block">
            <summary>
              <h2>Browse the public label catalog</h2>
            </summary>
            <p className="muted">
              Search primary scored labels, specialist labels, cross-cutting
              modifiers, and context or institutional entries by name, family,
              subfamily, aliases, or philosophy. Related traditions are listed
              separately and are not general-quiz matches.
            </p>
            <input
              type="search"
              className="label-search-input"
              value={labelSearch}
              maxLength={200}
              onChange={(e) => setLabelSearch(e.target.value)}
              placeholder="Search labels, families, aliases, philosophies..."
              aria-label="Search ideology labels"
            />
            <p className="muted">
              Search results include public catalog labels and clearly marked
              related traditions.
            </p>
            {Object.entries(groupedLabels)
              .sort(([a], [b]) =>
                formatFamilyName(a).localeCompare(formatFamilyName(b)),
              )
              .map(([family, subfamilies]) => {
                return (
                  <details
                    key={family}
                    className="family-group"
                    open={Boolean(labelSearch)}
                  >
                    <summary className="family-name">
                      {formatFamilyName(family)}
                    </summary>
                    {Object.entries(subfamilies)
                      .sort(([a], [b]) =>
                        formatFamilyName(a).localeCompare(formatFamilyName(b)),
                      )
                      .map(([subfamily, familyLabels]) => (
                        <details
                          key={subfamily}
                          className="subfamily-group"
                          open={Boolean(labelSearch)}
                        >
                          <summary className="subfamily-name">
                            {subfamily !== family
                              ? formatFamilyName(subfamily)
                              : "Labels"}
                          </summary>
                          <div className="label-card-list">
                            {familyLabels
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((label) => (
                                <LabelCard
                                  key={label.id}
                                  label={label}
                                  match={nearestById.get(label.id)}
                                  labelReliability={
                                    result.labelReliabilities?.[label.id]
                                  }
                                  axisReliabilities={result.axisReliabilities}
                                  axisById={axisById}
                                />
                              ))}
                          </div>
                        </details>
                      ))}
                  </details>
                );
              })}
            {visibleRelatedTraditions.length > 0 && (
              <section
                className="focused-traditions"
                aria-labelledby="focused-traditions-heading"
              >
                <h3 id="focused-traditions-heading">Related traditions</h3>
                <p className="muted">
                  These historically meaningful traditions are not ranked by the
                  general quiz. A focused follow-up is available where the
                  current question bank can support one.
                </p>
                <div className="label-card-list">
                  {visibleRelatedTraditions.map((candidate) => (
                    <article
                      key={candidate.id}
                      className="label-card focused-tradition-card"
                    >
                      <h5>{candidate.name}</h5>
                      <p className="muted">
                        {formatFamilyName(candidate.family)} ·{" "}
                        {formatFamilyName(
                          candidate.subfamily ?? candidate.family,
                        )}{" "}
                        ·{" "}
                        {candidate.availability === "focused-follow-up"
                          ? "focused follow-up available"
                          : "not ranked by the general quiz"}
                      </p>
                      <p>{candidate.description}</p>
                      {candidate.aliases && candidate.aliases.length > 0 && (
                        <p className="muted">
                          Also called: {candidate.aliases.join(", ")}
                        </p>
                      )}
                      {candidate.sourceUrls &&
                        candidate.sourceUrls.length > 0 && (
                          <details className="label-source-disclosure">
                            <summary>Sources for this catalog summary</summary>
                            <ul>
                              {candidate.sourceUrls.map((url) => (
                                <li key={url}>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {sourceHost(url)}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </details>

          {result.conflatedLabels.length > 0 && (
            <div className="result-block results-inspector-block">
              <h2>Labels that conflate your layers</h2>
              <p className="muted">
                These labels fit one layer of your views but would conflate it
                with the others, where you diverge.
              </p>
              <ul className="conflated-list">
                {result.conflatedLabels.map((flag) => (
                  <li key={flag.labelId}>
                    {flag.reason}
                    <span className="layer-agreement">
                      {LAYERS.map((layer) => (
                        <span
                          key={layer}
                          className={
                            layer === flag.matchedLayer
                              ? "layer-chip matched"
                              : "layer-chip"
                          }
                        >
                          {layer}:{" "}
                          {layerAgreementLabel(flag.layerAgreement[layer])}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <button type="button" className="primary-button" onClick={onRestart}>
        Start over
      </button>
    </section>
  );
}
