import { describe, expect, it } from "vitest";
import {
  getIdeologyLabelSources,
  ideologyLabelSourceCatalog,
} from "./labelSources";
import { labels } from "./labels";
import {
  modifierScoringLabels,
  primaryScoringLabels,
  publicCatalogLabels,
  roleForLabel,
} from "./labelTaxonomy";

describe("ideology label sources", () => {
  it("provides public definition or boundary sources for every scored label", () => {
    expect(primaryScoringLabels.length).toBe(16);

    for (const label of primaryScoringLabels) {
      expect(
        label.sources?.length ?? 0,
        `${label.id} has no scored-label sources`,
      ).toBeGreaterThan(0);
      for (const source of label.sources ?? []) {
        expect(source.sourceId).toBeTruthy();
        expect(source.title).toBeTruthy();
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.supports.length).toBeGreaterThan(0);
        expect(source.supports).toContain("definition");
        expect(source.supports).toContain("boundary");
        expect(source.note).not.toMatch(
          /validate.*(?:score|centroid)|prove.*(?:score|centroid)/i,
        );
      }
      expect(
        label.sources?.some((source) =>
          source.supports.some(
            (scope) =>
              scope === "normative" ||
              scope === "descriptive" ||
              scope === "prescriptive",
          ),
        ),
        `${label.id} has no layer-scoped source`,
      ).toBe(true);
    }
  });

  it("provides source coverage for every public modifier, including catalog-only ones", () => {
    const publicModifiers = publicCatalogLabels.filter(
      (label) => roleForLabel(label.id) === "modifier",
    );
    expect(publicModifiers.length).toBeGreaterThan(
      modifierScoringLabels.length,
    );

    for (const label of publicModifiers) {
      expect(
        label.sources?.length ?? 0,
        `${label.id} has no modifier sources`,
      ).toBeGreaterThan(0);
      expect(
        label.sources?.some((source) => source.supports.includes("boundary")),
        `${label.id} has no boundary-scoped modifier source`,
      ).toBe(true);
    }
  });

  it("does not render the same public source twice for one label", () => {
    for (const label of publicCatalogLabels) {
      const sourceUrls = (label.sources ?? []).map((source) => source.url);
      expect(new Set(sourceUrls).size, `${label.id} repeats a source URL`).toBe(
        sourceUrls.length,
      );
    }

    const conservative = publicCatalogLabels.find(
      (label) => label.id === "conservative",
    )!;
    expect(conservative.sources?.map((source) => source.sourceId)).toEqual([
      "sep-prudential-conservatism",
    ]);
  });

  it("does not let family baselines masquerade as subtype evidence", () => {
    for (const label of [...primaryScoringLabels, ...modifierScoringLabels]) {
      const explicitSources = getIdeologyLabelSources(label);
      expect(
        explicitSources.length,
        `${label.id} has no explicit label source`,
      ).toBeGreaterThan(0);
      expect(
        explicitSources.some((source) =>
          source.supports.some(
            (scope) =>
              scope === "normative" ||
              scope === "descriptive" ||
              scope === "prescriptive",
          ),
        ),
        `${label.id} has no explicit layer-scoped source`,
      ).toBe(true);

      const familyOnlySources = (label.sources ?? []).filter(
        (source) =>
          !explicitSources.some(
            (explicit) => explicit.sourceId === source.sourceId,
          ),
      );
      for (const source of familyOnlySources) {
        expect(source.supports).toEqual(["definition", "boundary"]);
      }
    }
  });

  it("provides inspectable sources for every context-only catalog entry", () => {
    const contextLabels = publicCatalogLabels.filter(
      (label) => roleForLabel(label.id) === "context",
    );
    expect(contextLabels.length).toBeGreaterThanOrEqual(15);
    for (const label of contextLabels) {
      expect(
        label.sources?.length ?? 0,
        `${label.id} has no context source`,
      ).toBeGreaterThan(0);
      expect(
        label.sources?.every((source) =>
          source.supports.includes("definition"),
        ),
      ).toBe(true);
      expect(
        label.sources?.every((source) => source.supports.includes("boundary")),
      ).toBe(true);
    }
  });

  it("adds bespoke source coverage to the high-priority labels", () => {
    const byId = new Map(publicCatalogLabels.map((label) => [label.id, label]));
    const expectations: Record<string, RegExp> = {
      "social-liberalism": /cambridge-social-liberalism-positive-liberty/,
      distributism: /cambridge-chesterton-distributism/,
      "welfare-chauvinism": /oxford-welfare-chauvinism/,
      "anti-imperialism": /cambridge-decolonization-self-determination/,
      regionalism: /princeton-regionalism-regionalization/,
      "christian-democrat":
        /eui-christian-democracy|cambridge-christian-democracy-subsidiarity/,
      "social-democrat": /routledge-social-democracy/,
      "democratic-socialist": /oxford-american-democratic-socialism/,
      communitarianism: /sep-communitarianism/,
      "marxist-leninist": /cambridge-marxism-leninism-discourse/,
      republicanism: /sep-republicanism/,
      "libertarian-socialism": /sep-anarchism/,
      "fascist-authoritarian":
        /cambridge-fascist-palingenetic-ultranationalism/,
      "civic-nationalist": /cambridge-civic-patriotism/,
      corporatism: /cambridge-corporatism/,
      kemalism: /cambridge-kemalism/,
      "fiscal-conservatism": /sage-fiscal-conservatism/,
      "national-conservatism": /tandf-national-conservatism/,
      "liberal-conservatism": /oxford-conservative-liberalism/,
      "social-conservatism": /sage-social-conservatism/,
      theocrat: /oxford-theocracy-secularism/,
      "eco-authoritarianism": /cambridge-eco-authoritarianism/,
      internationalism: /oxford-internationalism-political-ideology/,
      neoliberalism: /oxford-neoliberalism-contested-uses/,
      progressivism: /cambridge-progressivism-reform/,
      "expansionist-nationalism": /cambridge-imperial-nationalism/,
      "separatist-nationalism": /cambridge-substate-nationalism-variation/,
      "right-wing-populism": /cambridge-populist-zeitgeist/,
      "left-wing-populism": /cambridge-populist-zeitgeist/,
      ethnonationalist: /oxford-ethnonationalism/,
      "islamic-democracy": /cambridge-islamic-constitutionalism/,
      "fourth-theory": /springer-fourth-political-theory/,
      hindutva: /oxford-hindutva/,
      zionism: /cambridge-zionism/,
      cyberocracy: /rand-cyberocracy/,
      accelerationism: /tandf-accelerationism/,
      "anarcho-capitalist": /cambridge-anarcho-capitalism-state/,
      mutualist: /cambridge-mutualist-social-science/,
      "anarcho-primitivism": /sage-primitivism-political-philosophy/,
      syndicalist: /cambridge-syndicalism-strikes/,
      "anarcho-syndicalism": /cambridge-anarcho-syndicalism-history/,
      agorist: /konkin-new-libertarian-manifesto/,
      "political-islam": /oxford-political-islam/,
      integralism:
        /cambridge-integralism-christian-nationalism|oxford-catholic-integralism/,
      juche: /oxford-juche-history|cambridge-north-korea-socialism-style/,
      "national-socialism": /ushmm-national-socialism/,
      neoreactionary: /sage-neoreactionary-dark-enlightenment/,
      "council-communist": /cambridge-council-communism-workers-control/,
      "degrowth-green": /oxford-degrowth-planning/,
      "deep-ecology": /oxford-deep-ecology/,
      ecosocialist: /oxford-radical-environmentalism/,
      "absolute-monarchist": /cambridge-absolute-monarchy-theory/,
      maoism: /cambridge-maoism-definition/,
      trotskyism: /cambridge-trotskyism-historiography/,
      participism: /erasmus-participatory-economics/,
      "individualist-anarchism": /wiley-individualist-anarchism/,
      neoconservative: /oxford-neoconservatism/,
      ecomodernist: /mit-ecomodernism-technology-politics/,
      "socialist-feminism": /cambridge-socialist-feminism-history/,
      "christian-socialism": /oxford-christian-socialism-history/,
      "guild-socialism": /oxford-guild-socialism/,
      indigenism: /oxford-indigenism-human-rights/,
      "libertarian-municipalism": /res-publica-libertarian-municipalism/,
      georgism: /oxford-georgism-land-value-tax/,
      paleoconservatism: /cambridge-paleoconservatism-morphology/,
      "left-wing-market-anarchism": /routledge-left-market-anarchism/,
      "traditional-monarchist": /oxford-monarchism-authoritarian-politics/,
      paleolibertarianism: /ucm-paleolibertarianism/,
      "eco-fascism": /cambridge-ecofascism-illiberal-environmentalism/,
      "national-bolshevism": /sciencedirect-red-brown-politics/,
      strasserism: /sciencedirect-red-brown-politics/,
      "techno-anarchism": /wiley-anarchism-politics-technology/,
      "utopian-socialism": /cambridge-utopian-socialism-social-science/,
      voluntaryism: /journal-libertarian-studies-voluntaryism/,
      stirnerism: /cambridge-stirner-egoism/,
      "anarcha-feminism": /cambridge-anarcho-feminism-history/,
      "bleeding-heart-libertarianism":
        /independent-rawls-bleeding-heart-libertarianism/,
      "christian-reconstructionism": /oxford-christian-reconstruction/,
      "queer-anarchism": /sage-queer-theory-anarchism/,
      "religious-nationalism": /oxford-religious-nationalism/,
    };

    for (const [labelId, sourceIdPattern] of Object.entries(expectations)) {
      const label = byId.get(labelId);
      expect(label, `${labelId} missing from public catalog`).toBeDefined();
      expect(
        label!.sources?.map((source) => source.sourceId).join(" "),
      ).toMatch(sourceIdPattern);
    }

    expect(
      byId
        .get("corporatism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("corporatism")
        ?.sources?.every((source) => !source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("kemalism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("fiscal-conservatism")
        ?.sources?.some((source) => source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("national-conservatism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("liberal-conservatism")
        ?.sources?.some((source) => source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("social-conservatism")
        ?.sources?.some((source) => source.supports.includes("normative")),
    ).toBe(true);
    expect(
      byId
        .get("theocrat")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("eco-authoritarianism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("internationalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("neoliberalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("progressivism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("expansionist-nationalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("separatist-nationalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("islamic-democracy")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("hindutva")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("zionism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("cyberocracy")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("accelerationism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("christian-democrat")
        ?.sources?.some((source) => source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("social-democrat")
        ?.sources?.some((source) => source.supports.includes("definition")),
    ).toBe(true);
    expect(
      byId
        .get("fascist-authoritarian")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("civic-nationalist")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("social-liberalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("distributism")
        ?.sources?.some((source) => source.supports.includes("normative")),
    ).toBe(true);
    expect(
      byId
        .get("welfare-chauvinism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("anti-imperialism")
        ?.sources?.some((source) => source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("regionalism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("political-islam")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("national-socialism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("agorist")
        ?.sources?.find(
          (source) => source.sourceId === "konkin-new-libertarian-manifesto",
        )?.kind,
    ).toBe("primary-text");
    expect(
      byId
        .get("council-communist")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("degrowth-green")
        ?.sources?.some((source) => source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("deep-ecology")
        ?.sources?.some((source) => source.supports.includes("normative")),
    ).toBe(true);
    expect(
      byId
        .get("participism")
        ?.sources?.every((source) => !source.supports.includes("prescriptive")),
    ).toBe(true);

    const platformism = byId.get("platformism")!;
    expect(
      platformism.sources?.find(
        (source) => source.sourceId === "platformist-organisational-platform",
      )?.kind,
    ).toBe("primary-text");
    expect(
      byId
        .get("ecomodernist")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("georgism")
        ?.sources?.some((source) => source.supports.includes("normative")),
    ).toBe(true);
    expect(
      byId
        .get("socialist-feminism")
        ?.sources?.every((source) => !source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("eco-fascism")
        ?.sources?.every((source) => !source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("national-bolshevism")
        ?.sources?.some((source) => source.supports.includes("descriptive")),
    ).toBe(true);
    expect(
      byId
        .get("strasserism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
    expect(
      byId
        .get("utopian-socialism")
        ?.sources?.every((source) => !source.supports.includes("prescriptive")),
    ).toBe(true);
    expect(
      byId
        .get("bleeding-heart-libertarianism")
        ?.sources?.some((source) => source.supports.includes("boundary")),
    ).toBe(true);
  });

  it("keeps researched source scopes claim-matched instead of overstating scholarship", () => {
    const byId = new Map(publicCatalogLabels.map((label) => [label.id, label]));
    const zionism = byId.get("zionism")!;
    expect(zionism.sources?.map((source) => source.sourceId)).toEqual([
      "cambridge-zionism",
      "cambridge-zionism-revisionism",
      "cambridge-zionism-labour",
    ]);
    expect(zionism.sources?.every((source) => source.supports.length > 0)).toBe(
      true,
    );
    expect(
      zionism.sources?.every(
        (source) => !source.supports.includes("normative"),
      ),
    ).toBe(true);
    expect(
      zionism.sources?.every(
        (source) => !source.supports.includes("prescriptive"),
      ),
    ).toBe(true);

    const islamicDemocracy = byId.get("islamic-democracy")!;
    expect(islamicDemocracy.sources?.map((source) => source.sourceId)).toEqual([
      "cambridge-islamic-constitutionalism",
      "annualreviews-islamic-constitutionalism",
      "polity-islamic-democracy",
    ]);
    expect(
      islamicDemocracy.sources?.find(
        (source) => source.sourceId === "polity-islamic-democracy",
      )?.supports,
    ).toEqual(["definition", "descriptive", "prescriptive", "boundary"]);
    expect(
      islamicDemocracy.sources?.find(
        (source) =>
          source.sourceId === "annualreviews-islamic-constitutionalism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const geolibertarian = byId.get("geolibertarian")!;
    expect(
      geolibertarian.sources?.find(
        (source) => source.sourceId === "oxford-georgism-land-value-tax",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);

    const minarchist = byId.get("minarchist")!;
    expect(
      minarchist.sources?.find(
        (source) => source.sourceId === "cambridge-libertarianism-state",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);

    const anarchoCommunist = byId.get("anarcho-communist")!;
    expect(
      anarchoCommunist.sources?.find(
        (source) => source.sourceId === "cambridge-anarchist-communism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const mutualist = byId.get("mutualist")!;
    expect(
      mutualist.sources?.find(
        (source) => source.sourceId === "c4ss-what-is-c4ss",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);
    expect(
      mutualist.sources?.find(
        (source) => source.sourceId === "swartz-what-is-mutualism",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);
    expect(
      mutualist.sources?.find(
        (source) => source.sourceId === "c4ss-history-2006",
      )?.supports,
    ).toEqual(["boundary"]);
    expect(
      mutualist.sources?.find(
        (source) => source.sourceId === "c4ss-carson-first-paid-staff",
      )?.supports,
    ).toEqual(["boundary"]);

    const cyberocracy = byId.get("cyberocracy")!;
    expect(cyberocracy.sources?.map((source) => source.sourceId)).toContain(
      "rand-cyberocracy-original",
    );
    expect(
      cyberocracy.sources?.find(
        (source) => source.sourceId === "rand-cyberocracy-original",
      )?.url,
    ).toBe("https://www.rand.org/pubs/papers/P7745.html");
    expect(
      cyberocracy.sources?.every(
        (source) => !source.supports.includes("normative"),
      ),
    ).toBe(true);

    const accelerationism = byId.get("accelerationism")!;
    expect(accelerationism.sources?.map((source) => source.sourceId)).toEqual([
      "tandf-accelerationism",
      "cambridge-accelerationism-spectrum",
      "oxford-reactionary-accelerationism",
    ]);
    expect(
      accelerationism.sources?.every(
        (source) => !source.supports.includes("normative"),
      ),
    ).toBe(true);

    const hindutva = byId.get("hindutva")!;
    expect(hindutva.sources?.map((source) => source.sourceId)).toEqual([
      "oxford-hindutva",
      "cambridge-hindutva-markets",
    ]);
    expect(
      hindutva.sources?.find(
        (source) => source.sourceId === "cambridge-hindutva-markets",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const technoAnarchism = byId.get("techno-anarchism")!;
    expect(technoAnarchism.sources?.map((source) => source.sourceId)).toEqual([
      "wiley-anarchism-politics-technology",
      "anarchist-studies-cryptoanarchist-governance",
    ]);
    expect(
      technoAnarchism.sources?.every(
        (source) => !source.supports.includes("normative"),
      ),
    ).toBe(true);

    const fourthTheory = byId.get("fourth-theory")!;
    expect(
      fourthTheory.sources?.find(
        (source) => source.sourceId === "dugin-fourth-political-theory-primary",
      )?.kind,
    ).toBe("primary-text");
    expect(
      fourthTheory.sources?.find(
        (source) => source.sourceId === "dugin-fourth-political-theory-primary",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);
    expect(
      fourthTheory.sources?.find(
        (source) => source.sourceId === "springer-fourth-political-theory",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const deepEcology = byId.get("deep-ecology")!;
    expect(deepEcology.sources?.map((source) => source.sourceId)).toEqual([
      "oxford-deep-ecology",
      "oxford-radical-environmentalism",
    ]);
    expect(
      deepEcology.sources?.find(
        (source) => source.sourceId === "oxford-radical-environmentalism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const participism = byId.get("participism")!;
    expect(
      participism.sources?.find(
        (source) => source.sourceId === "erasmus-participatory-economics",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const neoconservative = byId.get("neoconservative")!;
    expect(
      neoconservative.sources?.find(
        (source) => source.sourceId === "oxford-neoconservatism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "prescriptive", "boundary"]);

    const socialDemocrat = byId.get("social-democrat")!;
    expect(socialDemocrat.sources?.map((source) => source.sourceId)).toEqual([
      "sep-socialism",
      "iep-socialism",
      "routledge-social-democracy",
      "oxford-ethics-social-democracy",
    ]);
    expect(
      socialDemocrat.sources?.find(
        (source) => source.sourceId === "oxford-ethics-social-democracy",
      )?.supports,
    ).toEqual(["definition", "normative", "boundary"]);

    const fascistAuthoritarian = byId.get("fascist-authoritarian")!;
    expect(
      fascistAuthoritarian.sources?.find(
        (source) => source.sourceId === "wiley-doctrine-of-fascism",
      )?.kind,
    ).toBe("primary-text");
    expect(
      fascistAuthoritarian.sources?.find(
        (source) => source.sourceId === "wiley-doctrine-of-fascism",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);

    const regionalism = byId.get("regionalism")!;
    expect(regionalism.sources?.map((source) => source.sourceId)).toEqual([
      "sep-nationalism",
      "princeton-regionalism-regionalization",
      "oxford-regional-authority-preferences",
    ]);
    expect(
      regionalism.sources?.find(
        (source) => source.sourceId === "oxford-regional-authority-preferences",
      )?.supports,
    ).toEqual(["definition", "normative", "prescriptive", "boundary"]);

    const nationalConservatism = byId.get("national-conservatism")!;
    expect(
      nationalConservatism.sources?.find(
        (source) => source.sourceId === "tandf-national-conservatism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const liberalConservatism = byId.get("liberal-conservatism")!;
    expect(
      liberalConservatism.sources?.find(
        (source) => source.sourceId === "oxford-conservative-liberalism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "prescriptive", "boundary"]);

    const socialConservatism = byId.get("social-conservatism")!;
    expect(
      socialConservatism.sources?.find(
        (source) => source.sourceId === "sage-social-conservatism",
      )?.supports,
    ).toEqual(["definition", "normative", "descriptive", "boundary"]);

    const theocrat = byId.get("theocrat")!;
    expect(
      theocrat.sources?.find(
        (source) => source.sourceId === "oxford-theocracy-secularism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);
    expect(
      theocrat.sources?.find(
        (source) => source.sourceId === "cambridge-theocracy-variants",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const ecoAuthoritarianism = byId.get("eco-authoritarianism")!;
    expect(
      ecoAuthoritarianism.sources?.find(
        (source) => source.sourceId === "cambridge-eco-authoritarianism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const internationalism = byId.get("internationalism")!;
    expect(
      internationalism.sources?.find(
        (source) =>
          source.sourceId === "oxford-internationalism-political-ideology",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const neoliberalism = byId.get("neoliberalism")!;
    expect(
      neoliberalism.sources?.find(
        (source) => source.sourceId === "oxford-neoliberalism-contested-uses",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const progressivism = byId.get("progressivism")!;
    expect(
      progressivism.sources?.find(
        (source) => source.sourceId === "cambridge-progressivism-reform",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const expansionistNationalism = byId.get("expansionist-nationalism")!;
    expect(
      expansionistNationalism.sources?.find(
        (source) => source.sourceId === "cambridge-imperial-nationalism",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);

    const separatistNationalism = byId.get("separatist-nationalism")!;
    expect(
      separatistNationalism.sources?.find(
        (source) =>
          source.sourceId === "cambridge-substate-nationalism-variation",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);
  });

  it("keeps researched high-confusion labels explicit about neighboring traditions", () => {
    const byId = new Map(labels.map((label) => [label.id, label]));
    expect(byId.get("social-democrat")?.cautionNote).toMatch(
      /democratic socialism|Nordic/i,
    );
    expect(byId.get("christian-democrat")?.cautionNote).toMatch(
      /theocracy|distributism/i,
    );
    expect(byId.get("civic-nationalist")?.cautionNote).toMatch(
      /liberal|cosmopolitan|minority/i,
    );
    expect(byId.get("libertarian-socialism")?.cautionNote).toMatch(
      /right-libertarianism|property/i,
    );
    expect(byId.get("social-liberalism")?.cautionNote).toMatch(
      /social democracy|progressive/i,
    );
    expect(byId.get("distributism")?.cautionNote).toMatch(
      /small-business|agrarian|productive ownership/i,
    );
    expect(byId.get("welfare-chauvinism")?.cautionNote).toMatch(
      /immigration|welfare state|ethnic/i,
    );
    expect(byId.get("anti-imperialism")?.cautionNote).toMatch(
      /domination|domestic regime|economic system/i,
    );
    expect(byId.get("regionalism")?.cautionNote).toMatch(
      /federalism|secession|unitary/i,
    );
  });

  it("adds bespoke source coverage to broad anchors and identity or expertise specialists", () => {
    const byId = new Map(publicCatalogLabels.map((label) => [label.id, label]));
    const expectedSourceIds: Record<string, RegExp> = {
      conservative: /sep-prudential-conservatism/,
      "green-politics": /sep-green-political-ecology/,
      "social-anarchism": /sep-social-communal-anarchism/,
      "market-right-libertarianism": /sep-market-right-libertarianism/,
      "marxian-socialism": /sep-marxian-socialism/,
      "technocratic-orientation": /routledge-technocracy/,
      "black-nationalism": /oxford-black-nationalism/,
      "pan-africanism": /oxford-pan-africanism/,
    };
    const expectedLayerScopes: Record<string, readonly string[]> = {
      conservative: ["descriptive", "prescriptive"],
      "green-politics": ["normative"],
      "social-anarchism": ["normative", "prescriptive"],
      "market-right-libertarianism": ["normative", "prescriptive"],
      "marxian-socialism": ["normative", "prescriptive"],
      "technocratic-orientation": ["descriptive"],
      "black-nationalism": ["descriptive", "prescriptive"],
      "pan-africanism": ["descriptive", "prescriptive"],
    };

    for (const [labelId, sourceIdPattern] of Object.entries(
      expectedSourceIds,
    )) {
      const label = byId.get(labelId);
      expect(label, `${labelId} missing from public catalog`).toBeDefined();
      expect(
        label!.sources?.map((source) => source.sourceId).join(" "),
      ).toMatch(sourceIdPattern);
      for (const scope of expectedLayerScopes[labelId]) {
        expect(
          label!.sources?.some((source) =>
            source.supports.includes(
              scope as "normative" | "descriptive" | "prescriptive",
            ),
          ),
          `${labelId} missing ${scope} source`,
        ).toBe(true);
      }
    }
  });

  it("sources provisional specialists without promoting them into ordinary scoring", () => {
    const specialists = publicCatalogLabels.filter(
      (label) => roleForLabel(label.id) === "specialist",
    );
    expect(specialists.length).toBeGreaterThan(0);
    for (const label of specialists) {
      expect(
        label.sources?.length ?? 0,
        `${label.id} has no specialist source record`,
      ).toBeGreaterThan(0);
      expect(
        getIdeologyLabelSources(
          labels.find((candidate) => candidate.id === label.id)!,
        ),
      ).toHaveLength(label.sources?.length ?? 0);
      expect(
        primaryScoringLabels.some((candidate) => candidate.id === label.id),
      ).toBe(false);
      expect(
        modifierScoringLabels.some((candidate) => candidate.id === label.id),
      ).toBe(false);
    }
  });

  it("keeps the source catalog itself structurally valid", () => {
    expect(ideologyLabelSourceCatalog.length).toBeGreaterThan(10);
    expect(
      new Set(ideologyLabelSourceCatalog.map((source) => source.sourceId)).size,
    ).toBe(ideologyLabelSourceCatalog.length);
    expect(
      ideologyLabelSourceCatalog.every((source) =>
        source.url.startsWith("https://"),
      ),
    ).toBe(true);
  });

  it("keeps bespoke caution coverage focused on the requested ambiguous labels", () => {
    const targetedIds = [
      "technocratic-centralist",
      "geolibertarian",
      "market-socialist",
      "classical-liberalism",
      "ordoliberalism",
      "multiculturalism",
      "radical-democracy",
      "one-nation-conservatism",
      "democratic-confederalism",
      "liberal-feminism",
      "left-wing-nationalism",
      "agrarian-populism",
      "green-capitalism",
      "anarcho-communist",
      "minarchist",
      "objectivism",
      "world-federalism",
      "bioregionalism",
    ] as const;
    const byId = new Map(labels.map((label) => [label.id, label]));
    const sourceIdsByLabel: Record<string, string> = {
      "technocratic-centralist": "routledge-technocracy",
      geolibertarian: "oxford-georgism-land-value-tax",
      "market-socialist": "cambridge-market-socialism",
      "classical-liberalism": "sep-liberalism",
      ordoliberalism: "cambridge-ordoliberalism",
      multiculturalism: "sep-multiculturalism",
      "radical-democracy": "sep-radical-democracy",
      "one-nation-conservatism": "wiley-one-nation-conservatism",
      "democratic-confederalism": "open-democratic-confederalism",
      "liberal-feminism": "sep-feminist-political-philosophy",
      "left-wing-nationalism": "oxford-anti-colonial-nationalism",
      "agrarian-populism": "oxford-agrarian-populism",
      "green-capitalism": "cambridge-green-capitalism",
      "anarcho-communist": "cambridge-anarchist-communism",
      minarchist: "cambridge-libertarianism-state",
      objectivism: "sep-ayn-rand",
      "world-federalism": "sep-world-government",
      bioregionalism: "wiley-contemporary-bioregionalism",
    };

    for (const labelId of targetedIds) {
      const note = `${byId.get(labelId)?.usageNote ?? ""}${byId.get(labelId)?.cautionNote ?? ""}`;
      expect(note.length, `${labelId} needs bespoke context`).toBeGreaterThan(
        30,
      );
      const catalogLabel = publicCatalogLabels.find(
        (label) => label.id === labelId,
      );
      expect(
        catalogLabel?.sources?.map((source) => source.sourceId),
        `${labelId} needs a claim-matched source`,
      ).toContain(sourceIdsByLabel[labelId]);
    }
  });

  it("scopes technocratic centralism to expert rule, coordination, and institutional boundaries", () => {
    const technocraticCentralism = publicCatalogLabels.find(
      (label) => label.id === "technocratic-centralist",
    )!;
    const supportsBySource = new Map(
      (technocraticCentralism.sources ?? []).map((source) => [
        source.sourceId,
        source.supports,
      ]),
    );
    expect(supportsBySource.get("routledge-technocracy")).toEqual([
      "definition",
      "boundary",
    ]);
    expect(
      supportsBySource.get("cambridge-technocracy-democracy-hybrids"),
    ).toEqual(["definition", "descriptive", "boundary"]);
  });

  it("keeps populist sources scoped to the thin core and host-ideology distinction", () => {
    const byId = new Map(publicCatalogLabels.map((label) => [label.id, label]));
    for (const labelId of [
      "right-wing-populism",
      "left-wing-populism",
    ] as const) {
      const label = byId.get(labelId);
      expect(label?.sources?.map((source) => source.sourceId)).toEqual(
        expect.arrayContaining([
          "cambridge-populist-zeitgeist",
          "cambridge-populist-people-elite",
        ]),
      );
      expect(
        label?.sources?.find(
          (source) => source.sourceId === "cambridge-populist-zeitgeist",
        )?.supports,
      ).toEqual(["definition", "normative", "boundary"]);
      expect(
        label?.sources?.find(
          (source) => source.sourceId === "cambridge-populist-people-elite",
        )?.supports,
      ).toEqual(["definition", "descriptive", "boundary"]);
    }

    const agrarian = byId.get("agrarian-populism");
    expect(agrarian?.sources?.map((source) => source.sourceId)).toEqual(
      expect.arrayContaining([
        "oxford-agrarian-populism",
        "cambridge-populist-zeitgeist",
      ]),
    );
  });

  it("keeps Catholic integralism distinct from clerical fascism at the source boundary", () => {
    const integralism = publicCatalogLabels.find(
      (label) => label.id === "integralism",
    )!;
    expect(integralism.sources?.map((source) => source.sourceId)).toEqual(
      expect.arrayContaining([
        "cambridge-integralism-christian-nationalism",
        "oxford-catholic-integralism",
      ]),
    );
    expect(
      integralism.sources?.find(
        (source) => source.sourceId === "oxford-catholic-integralism",
      )?.supports,
    ).toEqual(["definition", "normative", "boundary"]);
  });

  it("keeps Juche scoped to the DPRK/Kimist state project rather than literal autarky", () => {
    const juche = publicCatalogLabels.find((label) => label.id === "juche")!;
    expect(juche.sources?.map((source) => source.sourceId)).toEqual(
      expect.arrayContaining([
        "oxford-juche-history",
        "cambridge-north-korea-socialism-style",
      ]),
    );
    expect(
      juche.sources?.find(
        (source) => source.sourceId === "cambridge-north-korea-socialism-style",
      )?.supports,
    ).toEqual(["definition", "descriptive", "boundary"]);
  });
});
