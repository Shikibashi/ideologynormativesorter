import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labels } from "./labels";

const reviewLedger = readFileSync(
  "docs/ideology-label-editorial-review-2026-08.md",
  "utf8",
);

const revisedCopyExpectations: Array<[string, RegExp]> = [
  [
    "right-wing-populism",
    /often combining majoritarian or extra-institutional mobilization/i,
  ],
  ["world-federalism", /democratic federal layer of global authority/i],
  [
    "indigenism",
    /Indigenous peoples.*rights, sovereignty, land and cultural continuity/i,
  ],
  [
    "bioregionalism",
    /place-based ecological political current.*local resilience/i,
  ],
  [
    "religious-nationalism",
    /Connects national identity or sovereignty with a particular religious tradition/i,
  ],
  ["hindutva", /contested political term, not Hinduism as a religion/i],
  [
    "progressivism",
    /variants ranging from expert-led administration to participatory/i,
  ],
  ["national-socialism", /The Nazi ideology/i],
  ["stirnerism", /Centers Max Stirner’s philosophy of egoism/i],
  ["bright-green-environmentalism", /sometimes market mechanisms/i],
  ["georgism", /historic “single tax” is one formulation/i],
  ["internationalism", /Internationalism is broader than cosmopolitanism/i],
  ["dataism", /central lens for value and governance/i],
  ["singularitarianism", /future-oriented movement/i],
  ["traditional-monarchist", /positions differ on popular sovereignty/i],
  ["cultural-populism", /frames political conflict through cultural identity/i],
  ["transhumanism", /broad family of arguments/i],
  ["political-islam", /not a synonym for Islam/i],
  ["radical-centrism", /broad and contested political style/i],
  [
    "anarcho-communist",
    /stateless communist order.*productive resources are held in common/i,
  ],
  ["minarchist", /generally permits a minimal state.*force, theft, fraud/i],
  ["objectivism", /Ayn Rand’s philosophical system/i],
  [
    "anarcha-feminism",
    /differ over which institutions must be abolished or transformed/i,
  ],
  ["national-bolshevism", /historically variable set of attempts/i],
  ["juche", /state-directed self-reliance/i],
];

const bespokeContextExpectations: Array<[string, RegExp]> = [
  ["mutualist", /reciprocal exchange.*mutual credit/i],
  ["council-communist", /anti-vanguardist.*workers.*councils/i],
  ["agorist", /counter-economic strategy/i],
  ["ecosocialist", /ecological limits.*socialist ownership/i],
  ["degrowth-green", /affluent-economy.*material-throughput/i],
  ["deep-ecology", /nonhuman nature intrinsic value/i],
  ["maoism", /mass-line politics.*peasant mobilization/i],
  ["trotskyism", /international revolution.*Stalinist bureaucracy/i],
  ["guild-socialism", /worker self-government.*industrial guilds/i],
  ["liquid-democracy", /voting and delegation procedure/i],
  ["utopian-socialism", /retrospective umbrella.*diverse/i],
  ["libertarian-municipalism", /municipal assemblies.*ecology.*confederation/i],
  ["anarcho-syndicalism", /worker organization.*direct action/i],
  ["platformism", /tactical unity.*collective responsibility/i],
  ["georgism", /land- and resource-rent doctrine/i],
  [
    "bleeding-heart-libertarianism",
    /liberty and market commitments.*social justice/i,
  ],
  ["constitutional-monarchism", /regime form, not a complete ideology/i],
  ["fundamentalist-theocracy", /religious establishment.*clerical influence/i],
  [
    "universal-basic-income",
    /policy proposal rather than a complete ideology/i,
  ],
  ["social-investment-state", /capabilities and life-course investment/i],
];

describe("label editorial review", () => {
  it("tracks every current label in the dated review ledger", () => {
    expect(labels).toHaveLength(145);
    for (const label of labels) {
      expect(
        reviewLedger.split(/\r?\n/).some((line) => {
          const cells = line.split("|").map((cell) => cell.trim());
          return cells[1] === label.id;
        }),
        `${label.id} is missing from the review ledger`,
      ).toBe(true);
    }
  });

  it("guards the scope corrections made to high-risk or overbroad labels", () => {
    for (const [labelId, expectedDescription] of revisedCopyExpectations) {
      const label = labels.find((candidate) => candidate.id === labelId);
      expect(label, `${labelId} must exist`).toBeDefined();
      const copy = `${label!.description} ${label!.usageNote ?? ""} ${label!.cautionNote ?? ""}`;
      expect(copy, `${labelId} copy regressed`).toMatch(expectedDescription);
    }
  });

  it("keeps bespoke context on narrow or easily conflated catalog entries", () => {
    for (const [labelId, expectedContext] of bespokeContextExpectations) {
      const label = labels.find((candidate) => candidate.id === labelId);
      expect(label, `${labelId} must exist`).toBeDefined();
      expect(
        `${label!.usageNote ?? ""} ${label!.cautionNote ?? ""}`,
        `${labelId} context regressed`,
      ).toMatch(expectedContext);
    }
  });

  it("records the intended number of copy revisions", () => {
    const revisedRows =
      reviewLedger.match(/^\|\s*[^|]+?\s*\|\s*[^|]+?\s*\|\s*Revised\s*\|/gm) ??
      [];
    expect(revisedRows).toHaveLength(revisedCopyExpectations.length);
  });
});
