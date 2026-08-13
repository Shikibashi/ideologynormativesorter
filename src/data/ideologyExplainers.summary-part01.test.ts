import { describe, expect, it } from "vitest";
import { axes } from "./axes";
import { getIdeologyLayerSummary } from "./ideologyExplainers";
import { labels } from "./labels";

describe("ideology explainer summary coverage part 1", () => {
  it("keeps reviewed layer summaries explicit and qualified", () => {
    const byId = new Map(labels.map((label) => [label.id, label]));
    const cases: Array<
      [string, "normative" | "descriptive" | "prescriptive", RegExp]
    > = [
      [
        "ecomodernist",
        "normative",
        /human flourishing and ecological protection/,
      ],
      [
        "ecomodernist",
        "descriptive",
        /technological modernization, urbanization, and intensified production.*global, fast-enough absolute form remains unestablished/,
      ],
      [
        "kemalism",
        "descriptive",
        /secular, scientifically modernizing republic.*unified Turkish national identity.*Kemalist currents differ/,
      ],
      [
        "christian-reconstructionism",
        "descriptive",
        /secular legal neutrality.*theonomic biblical norms.*Christian social order/,
      ],
      [
        "revolutionary-collectivist",
        "descriptive",
        /capitalist property relations.*class domination.*revolutionary seizure.*centralized collective ownership/,
      ],
      [
        "marxist-leninist",
        "descriptive",
        /capitalist class power and crisis.*disciplined vanguard party.*planned social ownership/,
      ],
      [
        "maoism",
        "descriptive",
        /agrarian or peripheral societies.*peasant mobilization.*protracted struggle.*mass-line leadership/,
      ],
      [
        "trotskyism",
        "descriptive",
        /socialism isolated within one country.*bureaucratic degeneration.*international or “permanent” revolution/,
      ],
      [
        "guild-socialism",
        "descriptive",
        /capitalist industrial hierarchy.*workers democratic control.*public ownership and worker guilds/,
      ],
      [
        "paleoconservatism",
        "descriptive",
        /liberal internationalism.*mass immigration.*multiculturalism.*national cohesion.*economic nationalism/,
      ],
      [
        "one-nation-conservatism",
        "descriptive",
        /social division and insecurity.*national cohesion.*paternalist welfare.*competitive enterprise/,
      ],
      [
        "fiscal-conservatism",
        "descriptive",
        /persistent deficits.*debt accumulation.*expansive public budgets.*sustainable public finances/,
      ],
      [
        "social-conservatism",
        "descriptive",
        /rapid changes in family, gender, sexual, or religious norms.*social cohesion.*traditional authority/,
      ],
      [
        "national-conservatism",
        "descriptive",
        /cosmopolitan or supranational institutions.*liberal universalism.*national solidarity.*national sovereignty/,
      ],
      [
        "conservative-liberalism",
        "descriptive",
        /constitutional rules.*competitive market order.*unregulated market power.*centralized economic direction/,
      ],
      [
        "liberal-conservatism",
        "descriptive",
        /abrupt social redesign.*inherited institutions and social order.*constitutional rights.*cautious reform/,
      ],
      [
        "council-communist",
        "descriptive",
        /capitalist and party-state hierarchies.*workers’ self-emancipation.*workers’ councils.*federated direct control/,
      ],
      [
        "syndicalist",
        "descriptive",
        /autonomous worker organizations and direct action.*strikes.*federated unions/,
      ],
      [
        "libertarian-socialism",
        "descriptive",
        /capitalist concentration and centralized party-state control.*worker self-management.*voluntary federation/,
      ],
      [
        "participism",
        "descriptive",
        /participatory worker and consumer councils.*balanced job complexes.*negotiated planning/,
      ],
      [
        "agorist",
        "descriptive",
        /counter-economics.*voluntary exchange outside state licensing and taxation.*state legitimacy/,
      ],
      [
        "degrowth-green",
        "descriptive",
        /indefinite growth and high-throughput production.*ecological limits.*planned reductions in energy and resource use/,
      ],
      [
        "ordoliberalism",
        "descriptive",
        /unregulated competition.*monopoly and interest-group capture.*strong rule-bound state.*competitive market order/,
      ],
      [
        "ethnonationalist",
        "descriptive",
        /shared descent.*inherited culture.*ethnic boundaries.*national solidarity.*voluntary civic membership/,
      ],
      [
        "absolute-monarchist",
        "descriptive",
        /concentrated hereditary sovereignty.*political unity and continuity.*divided constitutional authority/,
      ],
      [
        "regionalism",
        "descriptive",
        /regional self-rule.*local identities and interests.*centralized administration.*federal autonomy/,
      ],
      [
        "anarcho-capitalist",
        "descriptive",
        /private providers.*law, protection, and arbitration.*equal access to law/,
      ],
      [
        "anarcho-capitalist",
        "prescriptive",
        /competitive private provision of law/,
      ],
      [
        "market-socialist",
        "descriptive",
        /markets and prices to coordinate dispersed information/,
      ],
      [
        "christian-democrat",
        "prescriptive",
        /subsidiarity, social-market institutions/,
      ],
      ["republicanism", "prescriptive", /checks on arbitrary power/],
      ["distributism", "prescriptive", /dispersing productive property/],
      [
        "distributism",
        "descriptive",
        /concentrated ownership.*economic independence/,
      ],
      ["world-federalism", "prescriptive", /federal layer of world government/],
      ["radical-democracy", "prescriptive", /beyond periodic elections/],
      [
        "christian-socialism",
        "prescriptive",
        /cooperative organization, labor protection/,
      ],
      [
        "green-capitalism",
        "normative",
        /ecological protection alongside human prosperity/,
      ],
      [
        "green-capitalism",
        "prescriptive",
        /carbon pricing, renewable-energy markets/,
      ],
      [
        "deep-ecology",
        "normative",
        /nonhuman life and ecological systems.*value independent of their usefulness/,
      ],
      [
        "deep-ecology",
        "descriptive",
        /anthropocentric industrial practices, pollution, and resource depletion/,
      ],
      [
        "deep-ecology",
        "prescriptive",
        /restraint in human impacts, respect for ecological diversity/,
      ],
      [
        "eco-authoritarianism",
        "normative",
        /ecological protection as an overriding political priority/,
      ],
      [
        "eco-authoritarianism",
        "descriptive",
        /ecological crisis.*centralized expertise/,
      ],
      [
        "eco-authoritarianism",
        "prescriptive",
        /powerful centralized authority.*command-and-control environmental rules/,
      ],
      [
        "radical-democracy",
        "normative",
        /democratic equality, active participation, and the contestability/,
      ],
      [
        "radical-democracy",
        "descriptive",
        /settled representative institutions and dominant hegemonies/,
      ],
      ["radical-democracy", "prescriptive", /beyond periodic elections/],
      [
        "liquid-democracy",
        "normative",
        /voter autonomy and flexible participation/,
      ],
      [
        "liquid-democracy",
        "descriptive",
        /direct voting and voluntary, revisable proxy delegation/,
      ],
      ["liquid-democracy", "prescriptive", /delegable proxy voting/],
      [
        "democratic-confederalism",
        "normative",
        /grassroots self-government, pluralism, ecological responsibility/,
      ],
      [
        "democratic-confederalism",
        "descriptive",
        /local communities and assemblies, linked through delegated coordination/,
      ],
      [
        "democratic-confederalism",
        "prescriptive",
        /linked local assemblies and councils/,
      ],
      [
        "corporatism",
        "prescriptive",
        /under strong state direction to mediate represented interests/,
      ],
      [
        "corporatism",
        "descriptive",
        /occupational bodies under state direction.*authoritarian state corporatism/,
      ],
      [
        "corporatism",
        "normative",
        /organized occupational and sectoral representation.*social harmony.*coordinated public direction/,
      ],
      [
        "kemalism",
        "normative",
        /republican sovereignty, secular public authority.*scientific modernization/,
      ],
      [
        "fiscal-conservatism",
        "normative",
        /sustainable public finances.*fairness across present and future taxpayers/,
      ],
      [
        "ethnonationalist",
        "prescriptive",
        /protect an inherited ethnic or cultural nation’s continuity.*membership boundaries/,
      ],
      [
        "islamic-democracy",
        "prescriptive",
        /electoral and constitutional government.*Islamic ethical or legal framework/,
      ],
      [
        "fourth-theory",
        "prescriptive",
        /autonomous post-liberal political model.*civilizational plurality and multipolar coordination/,
      ],
      [
        "anarcho-syndicalism",
        "normative",
        /worker solidarity, self-management/,
      ],
      [
        "anarcho-syndicalism",
        "descriptive",
        /industrial unions, direct action, and federated worker organization/,
      ],
      [
        "platformism",
        "normative",
        /anarchist-communist emancipation and coordinated collective action/,
      ],
      [
        "platformism",
        "descriptive",
        /shared political program, tactical coordination, collective responsibility/,
      ],
      ["liberal-feminism", "prescriptive", /legal reform, equal rights/],
      ["mutualist", "prescriptive", /mutual credit, cooperative exchange/],
      [
        "geolibertarian",
        "descriptive",
        /self-ownership and market exchange.*equal claims to natural opportunities/,
      ],
      [
        "mutualist",
        "normative",
        /reciprocity, worker autonomy, equal exchange/,
      ],
      [
        "mutualist",
        "descriptive",
        /cooperative markets and mutual-credit institutions/,
      ],
      [
        "minarchist",
        "normative",
        /individual rights in life, liberty, property, and contract/,
      ],
      [
        "minarchist",
        "descriptive",
        /public system of police, courts, and defense/,
      ],
      [
        "minarchist",
        "prescriptive",
        /minimal state limited mainly to protecting rights/,
      ],
      [
        "ecomodernist",
        "prescriptive",
        /technological innovation, resource-efficient infrastructure/,
      ],
      [
        "ecosocialist",
        "descriptive",
        /capitalist accumulation and profit-driven growth.*collective ownership and democratic planning/,
      ],
      [
        "ecosocialist",
        "prescriptive",
        /social ownership and democratic planning/,
      ],
      ["geolibertarian", "normative", /equal claim to the value of land/],
      ["geolibertarian", "prescriptive", /land or resource rent/],
      ["anarcho-communist", "prescriptive", /stateless federations/],
      [
        "anarcho-communist",
        "descriptive",
        /decentralized communal production and sharing/,
      ],
      [
        "bleeding-heart-libertarianism",
        "normative",
        /individual liberty and social justice/,
      ],
      [
        "bleeding-heart-libertarianism",
        "descriptive",
        /market mechanisms, voluntary cooperation, and property rights.*vulnerable or least-advantaged people/,
      ],
      ["kemalism", "prescriptive", /Six Arrows program/],
      ["christian-reconstructionism", "prescriptive", /theonomic biblical law/],
      [
        "revolutionary-collectivist",
        "prescriptive",
        /centralized public ownership or state power/,
      ],
      [
        "marxist-leninist",
        "prescriptive",
        /disciplined vanguard party taking state power/,
      ],
      [
        "libertarian-socialism",
        "prescriptive",
        /worker self-management, social ownership/,
      ],
      [
        "maoism",
        "prescriptive",
        /mass-line organizing, peasant or peripheral mobilization/,
      ],
      ["trotskyism", "prescriptive", /permanent international revolution/],
      [
        "guild-socialism",
        "prescriptive",
        /public ownership of industry.*democratic worker guilds/,
      ],
      [
        "utopian-socialism",
        "prescriptive",
        /moral persuasion, model communities/,
      ],
      ["neoconservative", "normative", /liberal-democratic institutions/],
      [
        "neoconservative",
        "descriptive",
        /authoritarian or totalitarian threats.*national security, military power/,
      ],
      [
        "neoconservative",
        "prescriptive",
        /assertive U\.S\. or allied international role/,
      ],
      [
        "paleoconservatism",
        "prescriptive",
        /less interventionist foreign policy than neoconservatism/,
      ],
      [
        "one-nation-conservatism",
        "prescriptive",
        /cost-conscious welfare provision/,
      ],
      ["fiscal-conservatism", "prescriptive", /sustainable public finances/],
      [
        "social-conservatism",
        "normative",
        /inherited moral norms and institutions/,
      ],
      [
        "social-conservatism",
        "prescriptive",
        /preserving or reinforcing traditional social institutions/,
      ],
      [
        "national-conservatism",
        "normative",
        /national sovereignty, cultural continuity/,
      ],
      [
        "national-conservatism",
        "prescriptive",
        /strengthening the nation-state/,
      ],
      [
        "national-socialism",
        "descriptive",
        /leader-centered state power.*territorial expansion.*secure the survival/,
      ],
      ["conservative-liberalism", "normative", /liberal rights, rule of law/],
      [
        "conservative-liberalism",
        "prescriptive",
        /constitutional market order and gradual reform/,
      ],
      [
        "liberal-conservatism",
        "normative",
        /conservative concern for continuity/,
      ],
      [
        "liberal-conservatism",
        "prescriptive",
        /cautious reform, a market economy/,
      ],
      [
        "left-wing-market-anarchism",
        "normative",
        /opposition to state privilege, exploitation/,
      ],
      ["left-wing-market-anarchism", "prescriptive", /stateless freed markets/],
      [
        "individualist-anarchism",
        "normative",
        /individual self-direction and voluntary association/,
      ],
      [
        "individualist-anarchism",
        "descriptive",
        /compulsory authority.*individual autonomy.*voluntary cooperation/,
      ],
      [
        "individualist-anarchism",
        "prescriptive",
        /natural-rights, mutualist, and egoist currents/,
      ],
      [
        "anarcho-primitivism",
        "normative",
        /freedom from civilizational domination/,
      ],
      [
        "anarcho-primitivism",
        "descriptive",
        /domestication, agriculture, symbolic systems, division of labor/,
      ],
      ["anarcho-primitivism", "prescriptive", /deindustrialization, rewilding/],
      [
        "voluntaryism",
        "normative",
        /consent, individual liberty, and voluntary support/,
      ],
      ["voluntaryism", "prescriptive", /voluntarily funded minimal state/],
      [
        "stirnerism",
        "normative",
        /fixed moral, political, or social abstractions/,
      ],
      [
        "stirnerism",
        "descriptive",
        /fixed ideas.*independent authorities.*unions of egoists/,
      ],
      ["stirnerism", "prescriptive", /no single institutional blueprint/],
      [
        "utopian-socialism",
        "descriptive",
        /deliberate social reconstruction.*model communities.*cooperative experiments.*Saint-Simonian, Fourierist, and Owenite/,
      ],
      ["anarcha-feminism", "normative", /patriarchy and gender subordination/],
      [
        "anarcha-feminism",
        "descriptive",
        /patriarchy, gendered divisions of labor, sexual regulation/,
      ],
      [
        "anarcha-feminism",
        "prescriptive",
        /intimate life, work, political organization/,
      ],
      ["queer-anarchism", "normative", /coercive sexual and gender hierarchy/],
      [
        "queer-anarchism",
        "prescriptive",
        /does not impose one universal account/,
      ],
      ["techno-anarchism", "normative", /privacy, autonomy, and resistance/],
      [
        "techno-anarchism",
        "descriptive",
        /encryption, anonymity, distributed trust/,
      ],
      [
        "techno-anarchism",
        "prescriptive",
        /encryption, anonymity systems, peer-to-peer protocols/,
      ],
      [
        "civic-nationalist",
        "normative",
        /shared civic membership, political self-government/,
      ],
      [
        "civic-nationalist",
        "descriptive",
        /shared citizenship.*solidarity.*civic criteria can still be exclusionary/,
      ],
    ];

    for (const [id, layer, expected] of cases) {
      const summary = getIdeologyLayerSummary(byId.get(id)!, axes, layer);
      expect(summary, `${id}/${layer}`).toMatch(expected);
      expect(summary, `${id}/${layer}`).not.toMatch(
        /does not currently provide/i,
      );
    }
  });
});
