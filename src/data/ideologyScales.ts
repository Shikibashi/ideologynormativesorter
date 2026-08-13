/**
 * Analytical scale guidance for the public ideology catalog.
 *
 * These are not additional ideology roles and they are not claims that a
 * person belongs to a group at one fixed social level.  Political traditions
 * can be studied as doctrines, movements, institutions, or everyday uptake;
 * the useful scale depends on the explanatory question.
 */
export type IdeologyAnalyticalScale = "macro" | "meso" | "micro" | "nano";
export type AssignedIdeologyAnalyticalScale = Exclude<
  IdeologyAnalyticalScale,
  "nano"
>;

export interface IdeologyScaleSource {
  sourceId: string;
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export interface IdeologyScaleMetadata {
  /** Common scales for studying the tradition, not an ontological identity claim. */
  commonScales: readonly AssignedIdeologyAnalyticalScale[];
  /**
   * Scale of the respondent-facing estimate, when this entry is actually
   * measured. This keeps a micro-level uptake estimate separate from the
   * macro/meso tradition being described.
   */
  respondentMeasurementScale: "micro" | null;
  /** Plain-language boundary note shown with the catalog entry. */
  note: string;
  /** Academic sources supporting the scale distinction and its limits. */
  sources: readonly IdeologyScaleSource[];
}

export const IDEOLOGY_SCALE_VERSION = "2026-08-analytical-scale-v2";

export const IDEOLOGY_SCALE_SOURCES: readonly IdeologyScaleSource[] = [
  {
    sourceId: "jpi-ideology-discourse-levels",
    title: "Introduction",
    publisher: "Journal of Political Ideologies / Taylor & Francis",
    url: "https://doi.org/10.1080/13569317.2019.1589961",
    note: "Frames ideological discourse as operating through related macro, meso, and micro levels: canonical definition, political appeals/public discourse, and everyday conceptual use.",
  },
  {
    sourceId: "synthese-micro-macro-scales",
    title: "Getting lost with levels: the sociological micro-macro problem",
    publisher: "Synthese / Springer Nature",
    url: "https://link.springer.com/article/10.1007/s11229-024-04841-3",
    note: "Shows that micro, meso, and macro distinctions depend on the explanatory context; the same entity can occupy different scales in different analyses, so scale labels must remain heuristic.",
  },
  {
    sourceId: "routledge-maynard-four-levels",
    title: "Ideological and Non-Ideological: The Levels of Analysis Problem",
    publisher: "Routledge Handbook of Ideology Analysis",
    url: "https://doi.org/10.4324/9781003412007-3",
    note: "Proposes macro, meso, micro, and nano as distinct analytical fields: environment, group, individual, and a sub-individual field of personally adapted ideas and dispositions. The nano proposal is a method-sensitive analytic distinction, not a catalog of standalone ideologies.",
  },
  {
    sourceId: "sep-ideology-social-scope",
    title: "Ideology",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/ideology/",
    note: "Provides the conceptual baseline that ideologies have social content, causes, and effects; it does not establish a fixed macro-to-nano hierarchy for political labels.",
  },
];

const SOURCES = Object.freeze(
  IDEOLOGY_SCALE_SOURCES.map((source) => Object.freeze({ ...source })),
);

function commonSources(): readonly IdeologyScaleSource[] {
  return SOURCES;
}

/**
 * Assign only the common analytical scales that can be defended from the
 * entry's catalog role. No entry is assigned micro or nano as a standalone
 * ideology scale. Scored entries separately record that their respondent-level
 * estimate concerns micro-level uptake. Nano remains an analysis-only sublevel
 * within micro because the reviewed literature treats it as a proposed,
 * method-sensitive field rather than a public ideology label.
 */
export function ideologyScaleMetadataForLabel(
  _labelId: string,
  role: string,
): IdeologyScaleMetadata {
  const respondentMeasurementScale = ["primary", "modifier"].includes(role)
    ? ("micro" as const)
    : null;

  if (role === "primary") {
    return {
      commonScales: ["macro", "meso"],
      respondentMeasurementScale,
      note: "A broad tradition is usually studied at the macro scale as a canon or social order and at the meso scale through parties, movements, organizations, and public appeals. This quiz estimates an individual respondent’s micro-level uptake of those claims; it does not turn the tradition into a distinct micro ideology.",
      sources: commonSources(),
    };
  }

  if (role === "specialist") {
    return {
      commonScales: ["meso", "macro"],
      respondentMeasurementScale,
      note: "A specialist tradition is usually examined through its movement, intellectual current, organization, or historical project at the meso scale, while its doctrine and account of social order remain macro-level claims. The label does not identify a respondent’s local or interpersonal behavior by itself.",
      sources: commonSources(),
    };
  }

  if (role === "modifier") {
    return {
      commonScales: ["meso", "macro"],
      respondentMeasurementScale,
      note: "A modifier is a cross-cutting orientation that appears in political discourse, coalitions, and policy programs at meso scale and can also express a broader macro-level view of authority, membership, or social order. It is not a complete ideology and is not a micro-identity claim.",
      sources: commonSources(),
    };
  }

  if (role === "context") {
    return {
      commonScales: ["meso", "macro"],
      respondentMeasurementScale,
      note: "A context entry is normally studied as an institutional arrangement, strategy, movement project, or speculative program at meso scale, with macro-level consequences or justificatory claims. It is not scored as a complete ideology and should not be read as a personal micro-label.",
      sources: commonSources(),
    };
  }

  return {
    commonScales: ["macro", "meso"],
    respondentMeasurementScale,
    note: "This historical or compatibility entry retains the same scale caution as the underlying tradition: doctrine and social-order claims are commonly macro, while carriers and political use are meso. It is not an active scoring endpoint.",
    sources: commonSources(),
  };
}

export const ANALYTICAL_SCALE_GUIDANCE: Readonly<
  Record<IdeologyAnalyticalScale, string>
> = {
  macro:
    "Canon, doctrine, social order, population, or society-wide institutional pattern.",
  meso: "Party, movement, organization, coalition, regime project, or public political discourse.",
  micro:
    "Individual uptake, local practice, household, or interactional use; the relevant unit depends on the question.",
  nano: "Analysis-only proposed sublevel within micro: personally adapted specific ideas, dispositions, and interactional mechanisms. It is not assigned to catalog labels and is not inferred from one questionnaire response.",
};
