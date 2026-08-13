import { describe, expect, it } from "vitest";
import { axes } from "./axes";
import { getIdeologyLayerSummary } from "./ideologyExplainers";
import { labels } from "./labels";

describe("ideology explainer summary coverage part 2", () => {
  it("keeps reviewed layer summaries explicit and qualified", () => {
    const byId = new Map(labels.map((label) => [label.id, label]));
    const cases: Array<
      [string, "normative" | "descriptive" | "prescriptive", RegExp]
    > = [
      [
        "civic-nationalist",
        "prescriptive",
        /inclusive citizenship, common political institutions/,
      ],
      [
        "panarchism",
        "descriptive",
        /territorial monopoly.*voluntary nonterritorial states/,
      ],
      ["indigenism", "normative", /Indigenous collective self-determination/],
      [
        "indigenism",
        "descriptive",
        /imposed state or market institutions.*Indigenous authority/,
      ],
      [
        "indigenism",
        "prescriptive",
        /Indigenous governance, land and resource rights/,
      ],
      ["hindutva", "normative", /Hindu civilizational or national identity/],
      [
        "hindutva",
        "descriptive",
        /culturally unified Hindu nation.*modern, historically developing discourse/,
      ],
      ["hindutva", "prescriptive", /Hindu-nationalist conception of India/],
      [
        "religious-nationalism",
        "normative",
        /religious tradition and the national community/,
      ],
      [
        "religious-nationalism",
        "descriptive",
        /shared religious identity.*national solidarity.*state authority/,
      ],
      ["religious-nationalism", "prescriptive", /religiously informed law/],
      ["zionism", "normative", /Jewish national self-determination/],
      ["zionism", "prescriptive", /Land of Israel/],
      [
        "left-wing-nationalism",
        "normative",
        /social equality, anti-colonial solidarity/,
      ],
      [
        "left-wing-nationalism",
        "descriptive",
        /imperial domination and unequal international integration.*national liberation/,
      ],
      [
        "left-wing-nationalism",
        "prescriptive",
        /national liberation, redistributive or socialist policy/,
      ],
      [
        "expansionist-nationalism",
        "normative",
        /territorial enlargement, external influence/,
      ],
      [
        "expansionist-nationalism",
        "prescriptive",
        /territorial acquisition, imperial administration/,
      ],
      [
        "separatist-nationalism",
        "normative",
        /distinct national or regional community’s self-government/,
      ],
      [
        "separatist-nationalism",
        "descriptive",
        /autonomy, federal reorganization, or independence.*autonomy can reduce it/,
      ],
      [
        "separatist-nationalism",
        "prescriptive",
        /autonomy, federal reorganization, or secession/,
      ],
      [
        "christian-democrat",
        "normative",
        /human dignity, solidarity, family and civil society/,
      ],
      [
        "christian-democrat",
        "prescriptive",
        /democratic constitutionalism, subsidiarity, social-market institutions/,
      ],
      [
        "theocrat",
        "normative",
        /binding religious doctrine or recognized religious authority/,
      ],
      ["theocrat", "prescriptive", /final civil-law legitimacy/],
      [
        "integralism",
        "normative",
        /Catholic truth, the common good, and ordered social authority/,
      ],
      ["integralism", "prescriptive", /Catholicly informed public law/],
      [
        "fundamentalist-theocracy",
        "normative",
        /strict or literal fidelity to authoritative scripture/,
      ],
      [
        "fundamentalist-theocracy",
        "prescriptive",
        /religious law and state institutions enforcing a strict sacred-text interpretation/,
      ],
      [
        "national-traditionalist",
        "normative",
        /national continuity, inherited institutions, cultural tradition/,
      ],
      [
        "national-traditionalist",
        "prescriptive",
        /protecting national institutions, inherited practices/,
      ],
      [
        "fascist-authoritarian",
        "normative",
        /organic national unity, rebirth, hierarchy/,
      ],
      [
        "fascist-authoritarian",
        "prescriptive",
        /authoritarian mass mobilization, centralized leadership/,
      ],
      [
        "eco-fascism",
        "normative",
        /ecological integrity or territorial nature/,
      ],
      [
        "eco-fascism",
        "prescriptive",
        /authoritarian or exclusionary ecological measures/,
      ],
      [
        "strasserism",
        "normative",
        /national rebirth, revolutionary hierarchy and discipline/,
      ],
      [
        "strasserism",
        "prescriptive",
        /fascist mass mobilization and a strong state/,
      ],
      [
        "democratic-socialist",
        "normative",
        /democratic control of economic power and social ownership/,
      ],
      [
        "democratic-socialist",
        "prescriptive",
        /democratic social ownership or control of major productive assets/,
      ],
      ["market-socialist", "normative", /social or worker ownership/],
      [
        "market-socialist",
        "prescriptive",
        /social, public, or cooperative ownership with market pricing/,
      ],
      [
        "socialist-feminism",
        "normative",
        /gender liberation and the transformation of class and property relations/,
      ],
      [
        "socialist-feminism",
        "prescriptive",
        /collective action against patriarchy and capitalist exploitation/,
      ],
      [
        "juche",
        "normative",
        /political autonomy, national self-reliance, collective discipline/,
      ],
      [
        "juche",
        "prescriptive",
        /political independence, state-directed economic self-reliance, military self-defense/,
      ],
      [
        "egalitarian-statist",
        "normative",
        /material equality and effective public provision/,
      ],
      [
        "egalitarian-statist",
        "prescriptive",
        /progressive redistribution, broad social provision/,
      ],
      [
        "social-democrat",
        "normative",
        /freedom and equality as requiring democratic control/,
      ],
      [
        "social-democrat",
        "prescriptive",
        /mixed-economy reform through elections/,
      ],
      ["universal-basic-income", "normative", /unconditional income floor/],
      [
        "universal-basic-income",
        "prescriptive",
        /periodic cash payment to all individuals/,
      ],
      [
        "social-investment-state",
        "normative",
        /capabilities across the life course/,
      ],
      [
        "social-investment-state",
        "prescriptive",
        /build, mobilize, and preserve capabilities/,
      ],
      [
        "right-wing-populism",
        "normative",
        /authentic or national people as the rightful source/,
      ],
      [
        "right-wing-populism",
        "prescriptive",
        /majoritarian, anti-establishment, nationalist/,
      ],
      [
        "left-wing-populism",
        "normative",
        /ordinary people, especially subordinated or working groups/,
      ],
      [
        "left-wing-populism",
        "prescriptive",
        /redistribution, public control, or economic democracy/,
      ],
      [
        "agrarian-populism",
        "normative",
        /small producers, rural communities, land-based livelihoods/,
      ],
      [
        "agrarian-populism",
        "prescriptive",
        /producer protections, cooperative or distributed ownership/,
      ],
      [
        "cultural-populism",
        "normative",
        /cultural belonging, everyday norms, or community recognition/,
      ],
      [
        "cultural-populism",
        "prescriptive",
        /protect or restore a preferred cultural order/,
      ],
      [
        "market-liberal",
        "normative",
        /private property, individual liberty, legal equality/,
      ],
      [
        "market-liberal",
        "prescriptive",
        /competitive markets, secure private property/,
      ],
      [
        "decentralist-market-skeptic-of-state",
        "normative",
        /concentrated authority and dependence on centralized administration/,
      ],
      [
        "decentralist-market-skeptic-of-state",
        "prescriptive",
        /decentralizing provision, expanding exit/,
      ],
      [
        "civil-libertarian-cosmopolitan",
        "normative",
        /individual civil liberty and moral concern beyond national borders/,
      ],
      [
        "civil-libertarian-cosmopolitan",
        "prescriptive",
        /strong civil liberties, decentralized institutions/,
      ],
      [
        "classical-liberalism",
        "normative",
        /individual liberty, private property, voluntary exchange/,
      ],
      [
        "classical-liberalism",
        "prescriptive",
        /constitutionally limited government/,
      ],
      [
        "neoliberalism",
        "descriptive",
        /competition, price signals, expert regulation/,
      ],
      [
        "neoliberalism",
        "prescriptive",
        /competition policy, market mechanisms/,
      ],
      [
        "social-liberalism",
        "normative",
        /individual liberty and equal citizenship/,
      ],
      [
        "social-liberalism",
        "prescriptive",
        /rights-based public provision, social insurance/,
      ],
      [
        "progressivism",
        "normative",
        /deliberate social improvement, equal civic standing/,
      ],
      [
        "progressivism",
        "descriptive",
        /empirical inquiry, public administration, and institutional experimentation/,
      ],
      [
        "progressivism",
        "prescriptive",
        /evidence-informed institutional reform, public programs/,
      ],
      [
        "liberal-feminism",
        "normative",
        /equal rights, autonomy, legal status, and opportunity/,
      ],
      [
        "liberal-feminism",
        "prescriptive",
        /legal reform, equal rights, anti-discrimination protections/,
      ],
      [
        "georgism",
        "normative",
        /value created by their labor and improvements/,
      ],
      ["georgism", "prescriptive", /public capture of land or resource rent/],
      [
        "internationalism",
        "normative",
        /obligations, cooperation, and rights across national boundaries/,
      ],
      [
        "internationalism",
        "prescriptive",
        /international cooperation, institutions, treaties/,
      ],
      [
        "radical-centrism",
        "normative",
        /practical problem-solving, pluralist compromise/,
      ],
      [
        "radical-centrism",
        "prescriptive",
        /pragmatic cross-cutting coalitions/,
      ],
      [
        "constitutional-monarchism",
        "normative",
        /hereditary continuity or a nonpartisan head of state/,
      ],
      [
        "constitutional-monarchism",
        "prescriptive",
        /hereditary crown bounded by constitutional rules/,
      ],
      [
        "anti-imperialism",
        "normative",
        /political equality, self-determination/,
      ],
      [
        "anti-imperialism",
        "prescriptive",
        /decolonization, national or popular self-government/,
      ],
      [
        "traditional-monarchist",
        "normative",
        /dynastic continuity, inherited authority/,
      ],
      [
        "traditional-monarchist",
        "prescriptive",
        /preserving or restoring a hereditary monarchy/,
      ],
      [
        "communitarianism",
        "normative",
        /shared community, social membership, tradition/,
      ],
      [
        "communitarianism",
        "prescriptive",
        /civic participation, institutions that sustain community/,
      ],
      [
        "republicanism",
        "normative",
        /civic self-government, equal civic standing/,
      ],
      [
        "republicanism",
        "descriptive",
        /domination to persist whenever people or groups remain dependent/,
      ],
      [
        "bioregionalism",
        "normative",
        /ecological integrity, place-based belonging/,
      ],
      [
        "bioregionalism",
        "prescriptive",
        /governance, land use, and resource management organized around ecological regions/,
      ],
      [
        "political-islam",
        "normative",
        /Islamic principles as relevant to public authority, law/,
      ],
      [
        "political-islam",
        "prescriptive",
        /public role for Islamic normative or legal principles/,
      ],
      [
        "islamic-democracy",
        "descriptive",
        /elected government, constitutional rights, and Islamic ethical or legal review/,
      ],
      [
        "world-federalism",
        "normative",
        /shared political institutions capable of securing peace/,
      ],
      ["world-federalism", "descriptive", /problems that cross borders/],
      [
        "multiculturalism",
        "normative",
        /cultural membership and the ability to maintain distinctive identities/,
      ],
      [
        "multiculturalism",
        "prescriptive",
        /recognition, accommodation, or group-differentiated rights/,
      ],
      [
        "technocratic-centralist",
        "normative",
        /expert competence and centralized administrative coordination/,
      ],
      [
        "technocratic-centralist",
        "prescriptive",
        /expert-led national agencies, planning/,
      ],
      ["transhumanism", "normative", /human flourishing, autonomy/],
      ["transhumanism", "prescriptive", /human enhancement/],
      ["cyberocracy", "descriptive", /electronic information infrastructures/],
      ["cyberocracy", "prescriptive", /networked information systems/],
      ["accelerationism", "normative", /intensification or acceleration/],
      ["accelerationism", "prescriptive", /strategically intensifying/],
      ["dataism", "normative", /data generation, processing, and circulation/],
      ["dataism", "prescriptive", /data collection, measurement, optimization/],
      ["singularitarianism", "descriptive", /advanced artificial intelligence/],
      ["singularitarianism", "prescriptive", /safety or alignment work/],
      [
        "bright-green-environmentalism",
        "prescriptive",
        /clean energy, efficient infrastructure/,
      ],
      [
        "green-capitalism",
        "descriptive",
        /prices, investment, firms, and innovation/,
      ],
      [
        "objectivism",
        "descriptive",
        /objective reality to constrain thought and reason to provide reliable knowledge/,
      ],
      [
        "neoreactionary",
        "descriptive",
        /electoral democracy to produce instability, elite capture, or short-termism/,
      ],
      [
        "paleolibertarianism",
        "descriptive",
        /welfare-state expansion, interventionist foreign policy/,
      ],
      [
        "welfare-chauvinism",
        "descriptive",
        /bounded national or ethnic welfare community/,
      ],
      [
        "libertarian-municipalism",
        "descriptive",
        /face-to-face local assemblies and confederated municipalities/,
      ],
      [
        "voluntaryism",
        "descriptive",
        /compulsory taxation and state direction to create intrusion/,
      ],
      [
        "national-bolshevism",
        "descriptive",
        /strong, anti-liberal state.*national power/,
      ],
      [
        "fourth-theory",
        "descriptive",
        /civilizational pluralism and multipolar great spaces/,
      ],
      [
        "zionism",
        "descriptive",
        /Jewish national self-determination.*collective survival/,
      ],
      [
        "christian-socialism",
        "descriptive",
        /industrial capitalism’s concentration of wealth and power/,
      ],
      [
        "left-wing-market-anarchism",
        "descriptive",
        /legal privilege and state-backed corporate power/,
      ],
      [
        "queer-anarchism",
        "descriptive",
        /rigid sexual and gender norms.*wider political, economic, and social hierarchies/,
      ],
      [
        "expansionist-nationalism",
        "descriptive",
        /territorial enlargement or external influence.*national strength, security, status/,
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
