import { candidate, gate, spec } from "./experimentalSpecialistBuilder";

export const experimentalSpecialistModuleSpecsPart01 = [
  spec(
    "anarchist-families-module",
    "Anarchist and market-libertarian families",
    "Anarchist families",
    "Separates anti-authoritarian social organization, property and market commitments, and political strategy.",
    [
      {
        id: "fm-an-1",
        prompt:
          "Durable political freedom requires dismantling imposed political hierarchy rather than merely making rulers more accountable.",
        domain: "state-legitimacy",
        layer: "normative",
        constructs: { "anti-authority": 1 },
        axisWeights: [
          { axisId: "authority-legitimacy", weight: -1 },
          { axisId: "anti-domination", weight: 0.7 },
        ],
      },
      {
        id: "fm-an-2",
        prompt:
          "Markets and private exchange can coordinate social life without requiring a centralized state to direct production.",
        domain: "markets-planning",
        layer: "descriptive",
        constructs: {
          "market-coordination": 1,
          "communal-coordination": -0.4,
        },
        axisWeights: [
          { axisId: "market-process-confidence", weight: 1 },
          { axisId: "coordination-optimism", weight: 0.6 },
        ],
      },
      {
        id: "fm-an-3",
        prompt:
          "Productive resources should generally be held in common or governed by workers and affected communities rather than by absentee owners.",
        domain: "property-ownership",
        layer: "normative",
        constructs: { "communal-property": 1, "market-property": -0.5 },
        axisWeights: [
          { axisId: "property-legitimacy", weight: -0.8 },
          { axisId: "equality-theory", weight: 0.6 },
        ],
      },
      {
        id: "fm-an-4",
        prompt:
          "Anarchist change should prioritize federated association, mutual aid, and direct organization over electoral capture of a central state.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { "direct-federation": 1 },
        axisWeights: [
          { axisId: "centralization-preference", weight: -0.8 },
          { axisId: "electoralism-vs-direct-action", weight: -0.7 },
        ],
      },
    ],
    [
      candidate(
        "social-anarchism",
        "Social / Communal Anarchism",
        "A family-level experimental affinity for anti-authoritarian, communal, and federated social organization. It does not make mutualism, market anarchism, syndicalism, anarcho-communism, or a single transition strategy a required subtype.",
        {
          "anti-authority": 0.9,
          "market-coordination": -0.25,
          "communal-property": 0.7,
          "direct-federation": 0.8,
        },
        [
          gate("anti-authority", 0.6),
          gate("communal-property", 0.35),
          gate("direct-federation", 0.55),
        ],
      ),
      candidate(
        "anarcho-communist",
        "Anarcho-Communism",
        "Communal ownership and anti-authoritarian federation.",
        {
          "anti-authority": 0.9,
          "market-coordination": -0.6,
          "communal-property": 0.95,
          "direct-federation": 0.8,
        },
        [
          gate("anti-authority", 0.6),
          gate("communal-property", 0.6),
          gate("market-coordination", undefined, 0.25),
        ],
      ),
      candidate(
        "individualist-anarchism",
        "Individualist Anarchism",
        "Anti-authoritarian self-direction and voluntary association without a single required economic program.",
        {
          "anti-authority": 0.9,
          "market-coordination": 0.15,
          "communal-property": -0.1,
          "direct-federation": 0.5,
        },
        [gate("anti-authority", 0.6)],
      ),
      candidate(
        "market-anarchism",
        "Market Anarchism",
        "An anarchist family anchor for voluntary exchange and non-state coordination, without deciding among capitalist, mutualist, or counter-economic variants.",
        {
          "anti-authority": 0.9,
          "market-coordination": 0.8,
          "communal-property": 0,
          "direct-federation": 0.65,
        },
        [gate("anti-authority", 0.6), gate("market-coordination", 0.55)],
      ),
      candidate(
        "mutualist",
        "Mutualism (family-level)",
        "A family-level affinity for reciprocal exchange, federated association, and opposition to privilege; it does not identify Proudhonian, Tuckerite, Labadie-line, Swartz-associated, or later mutualist and left-market variants—or affiliation with C4SS or any writer.",
        {
          "anti-authority": 0.8,
          "market-coordination": 0.45,
          "communal-property": 0.2,
          "direct-federation": 0.8,
        },
        [
          gate("anti-authority", 0.55),
          gate("market-coordination", 0.2, 0.75),
          gate("direct-federation", 0.55),
        ],
      ),
      candidate(
        "anarcho-syndicalism",
        "Anarcho-Syndicalism",
        "Worker organization and direct industrial action under anarchist commitments.",
        {
          "anti-authority": 0.85,
          "market-coordination": -0.2,
          "communal-property": 0.65,
          "direct-federation": 0.95,
        },
        [
          gate("anti-authority", 0.6),
          gate("communal-property", 0.45),
          gate("direct-federation", 0.65),
        ],
      ),
      candidate(
        "anarcho-capitalist",
        "Anarcho-Capitalism",
        "Private property and market exchange without a state.",
        {
          "anti-authority": 0.9,
          "market-coordination": 0.95,
          "communal-property": -0.8,
          "direct-federation": 0.35,
        },
        [
          gate("anti-authority", 0.6),
          gate("market-coordination", 0.65),
          gate("communal-property", undefined, -0.35),
        ],
      ),
      candidate(
        "minarchist",
        "Minarchism",
        "A minimal state limited to protective and adjudicative functions.",
        {
          "anti-authority": 0.35,
          "market-coordination": 0.8,
          "communal-property": -0.6,
          "direct-federation": -0.2,
        },
        [
          gate("market-coordination", 0.55),
          gate("communal-property", undefined, -0.3),
          gate("anti-authority", undefined, 0.7),
        ],
      ),
    ],
  ),
  spec(
    "green-morphology-module",
    "Green political morphology",
    "Green morphology",
    "Measures ecological moral standing separately from growth, ownership, technology, governance, and strategy.",
    [
      {
        id: "fm-gr-1",
        prompt:
          "The nonhuman world has moral standing that should constrain human activity even when doing so reduces material convenience.",
        domain: "environment-climate-growth",
        layer: "normative",
        constructs: { "ecological-standing": 1 },
        axisWeights: [{ axisId: "human-nature-priority", weight: 1 }],
      },
      {
        id: "fm-gr-2",
        prompt:
          "High-income societies should reduce material throughput rather than treating continued aggregate economic growth as the default solution to social problems.",
        domain: "environment-climate-growth",
        layer: "prescriptive",
        constructs: { "post-growth": 1 },
        axisWeights: [{ axisId: "regulation-vs-deregulation", weight: 0.5 }],
      },
      {
        id: "fm-gr-3",
        prompt:
          "Private investment and technological innovation can be central tools for rapid ecological transition when public rules correct external harms.",
        domain: "environment-climate-growth",
        layer: "prescriptive",
        constructs: { "market-technology": 1 },
        axisWeights: [{ axisId: "regulation-vs-deregulation", weight: 0.3 }],
      },
      {
        id: "fm-gr-4",
        prompt:
          "Ecological politics should prioritize democratic and locally accountable control over both corporate and centralized state power.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "democratic-decentralism": 1 },
        axisWeights: [{ axisId: "centralization-preference", weight: -0.6 }],
      },
      {
        id: "fm-gr-5",
        prompt:
          "Ecological transition should give workers or communities meaningful control over productive assets rather than leaving the transition primarily to private capital owners.",
        domain: "property-ownership",
        layer: "normative",
        constructs: { "collective-ownership": 1 },
        axisWeights: [
          { axisId: "property-legitimacy", weight: -0.7 },
          { axisId: "anti-domination", weight: 0.4 },
        ],
      },
    ],
    [
      candidate(
        "deep-ecology",
        "Deep Ecology",
        "Strong independent moral standing for nonhuman nature.",
        {
          "ecological-standing": 0.95,
          "post-growth": 0.5,
          "market-technology": -0.3,
          "democratic-decentralism": 0.5,
        },
        [gate("ecological-standing", 0.6)],
      ),
      candidate(
        "degrowth-green",
        "Degrowth Green",
        "Democratic reduction of material throughput in affluent economies.",
        {
          "ecological-standing": 0.8,
          "post-growth": 0.95,
          "market-technology": -0.35,
          "democratic-decentralism": 0.65,
        },
        [gate("ecological-standing", 0.5), gate("post-growth", 0.65)],
      ),
      candidate(
        "ecosocialist",
        "Ecosocialism",
        "Ecological transformation joined to collective ownership and anti-capitalist politics.",
        {
          "ecological-standing": 0.8,
          "post-growth": 0.75,
          "market-technology": -0.65,
          "democratic-decentralism": 0.45,
          "collective-ownership": 0.8,
        },
        [gate("ecological-standing", 0.5), gate("collective-ownership", 0.55)],
      ),
      candidate(
        "ecomodernist",
        "Ecomodernism",
        "Ecological improvement through innovation, infrastructure, and high-capacity institutions.",
        {
          "ecological-standing": 0.55,
          "post-growth": -0.45,
          "market-technology": 0.85,
          "democratic-decentralism": 0.1,
          "collective-ownership": 0.05,
        },
        [
          gate("ecological-standing", 0.35),
          gate("market-technology", 0.55),
          gate("collective-ownership", undefined, 0.5),
        ],
      ),
      candidate(
        "green-capitalism",
        "Green Capitalism",
        "Market investment and regulation as the main route to ecological transition.",
        {
          "ecological-standing": 0.55,
          "post-growth": -0.2,
          "market-technology": 0.8,
          "democratic-decentralism": 0.2,
          "collective-ownership": -0.55,
        },
        [
          gate("ecological-standing", 0.35),
          gate("market-technology", 0.55),
          gate("collective-ownership", undefined, 0.2),
        ],
      ),
    ],
  ),
  spec(
    "socialist-families-module",
    "Socialist family variants",
    "Socialist variants",
    "Separates ownership, democratic control, planning, reform, and revolutionary strategy across socialist traditions.",
    [
      {
        id: "fm-so-1",
        prompt:
          "Productive assets should be socially or worker owned rather than controlled primarily through private capital markets.",
        domain: "property-ownership",
        layer: "normative",
        constructs: { "social-ownership": 1 },
        axisWeights: [
          { axisId: "property-legitimacy", weight: -1 },
          { axisId: "equality-theory", weight: 0.7 },
        ],
      },
      {
        id: "fm-so-2",
        prompt:
          "Democratic planning and collective decision-making can coordinate complex production without relying entirely on market prices.",
        domain: "markets-planning",
        layer: "descriptive",
        constructs: { "democratic-planning": 1 },
        axisWeights: [
          { axisId: "market-process-confidence", weight: -0.8 },
          { axisId: "democratic-confidence", weight: 0.5 },
        ],
      },
      {
        id: "fm-so-3",
        prompt:
          "Socialist politics should normally pursue durable gains through elections, law, unions, and public institutions rather than immediate rupture.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { reformism: 1, "revolutionary-strategy": -0.5 },
        axisWeights: [
          { axisId: "reform-vs-revolution", weight: -0.8 },
          { axisId: "electoralism-vs-direct-action", weight: 0.6 },
        ],
      },
      {
        id: "fm-so-4",
        prompt:
          "A disciplined revolutionary organization may need to centralize political authority during the transition away from capitalism.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { "revolutionary-strategy": 1 },
        axisWeights: [
          { axisId: "centralization-preference", weight: 0.7 },
          { axisId: "reform-vs-revolution", weight: 0.8 },
        ],
      },
    ],
    [
      candidate(
        "social-democrat",
        "Social Democracy",
        "Reformist welfare and labor politics within a mixed economy.",
        {
          "social-ownership": 0.1,
          "democratic-planning": 0.2,
          reformism: 0.95,
          "revolutionary-strategy": -0.8,
        },
        [gate("reformism", 0.55), gate("social-ownership", undefined, 0.55)],
      ),
      candidate(
        "democratic-socialist",
        "Democratic Socialism",
        "Democratic control or social ownership pursued through pluralist and accountable institutions, with variation over reform and transition.",
        {
          "social-ownership": 0.82,
          "democratic-planning": 0.55,
          reformism: 0.35,
          "revolutionary-strategy": 0.05,
        },
        [gate("social-ownership", 0.55)],
      ),
      candidate(
        "marxian-socialism",
        "Marxian Socialism",
        "A non-Leninist Marxian family centered on class analysis and social ownership, without requiring a party-state model.",
        {
          "social-ownership": 0.86,
          "democratic-planning": 0.55,
          reformism: 0.05,
          "revolutionary-strategy": 0.35,
        },
        [gate("social-ownership", 0.55)],
      ),
      candidate(
        "market-socialist",
        "Market Socialism",
        "Social ownership combined with market exchange or competition.",
        {
          "social-ownership": 0.8,
          "democratic-planning": 0.15,
          reformism: 0.35,
          "revolutionary-strategy": -0.2,
        },
        [
          gate("social-ownership", 0.6),
          gate("democratic-planning", undefined, 0.45),
        ],
      ),
      candidate(
        "guild-socialism",
        "Guild Socialism",
        "Democratic worker control and public or social ownership organized through self-governing functional associations.",
        {
          "social-ownership": 0.85,
          "democratic-planning": 0.7,
          reformism: 0.15,
          "revolutionary-strategy": 0.15,
        },
        [gate("social-ownership", 0.6), gate("democratic-planning", 0.5)],
      ),
      candidate(
        "council-communist",
        "Council Communism",
        "Worker councils and direct democratic control of production and politics.",
        {
          "social-ownership": 0.9,
          "democratic-planning": 0.85,
          reformism: -0.3,
          "revolutionary-strategy": 0.7,
        },
        [
          gate("social-ownership", 0.65),
          gate("democratic-planning", 0.65),
          gate("reformism", undefined, 0.25),
        ],
      ),
      candidate(
        "syndicalist",
        "Syndicalism",
        "Union organization and direct industrial action as the route to social transformation.",
        {
          "social-ownership": 0.8,
          "democratic-planning": 0.65,
          reformism: -0.2,
          "revolutionary-strategy": 0.8,
        },
        [gate("social-ownership", 0.55), gate("democratic-planning", 0.5)],
      ),
      candidate(
        "maoism",
        "Maoism",
        "Revolutionary party organization, mass mobilization, and centralized transition.",
        {
          "social-ownership": 0.9,
          "democratic-planning": 0.7,
          reformism: -0.7,
          "revolutionary-strategy": 0.95,
        },
        [
          gate("social-ownership", 0.65),
          gate("revolutionary-strategy", 0.65),
          gate("reformism", undefined, -0.35),
        ],
      ),
      candidate(
        "trotskyism",
        "Trotskyism",
        "Revolutionary Marxism emphasizing international transformation and party strategy.",
        {
          "social-ownership": 0.9,
          "democratic-planning": 0.65,
          reformism: -0.65,
          "revolutionary-strategy": 0.9,
        },
        [
          gate("social-ownership", 0.65),
          gate("revolutionary-strategy", 0.65),
          gate("reformism", undefined, -0.3),
        ],
      ),
    ],
  ),
  spec(
    "conservative-variants-module",
    "Conservative variants",
    "Conservative variants",
    "Separates prudential continuity from moral traditionalism, nationalism, Christian democracy, liberal conservatism, and neoconservative strategy.",
    [
      {
        id: "fm-co-1",
        prompt:
          "Political reform should normally proceed cautiously because inherited institutions contain knowledge that deliberate redesign can easily destroy.",
        domain: "strategy-change",
        layer: "normative",
        constructs: { prudence: 1 },
        axisWeights: [{ axisId: "authority-legitimacy", weight: 0.4 }],
      },
      {
        id: "fm-co-2",
        prompt:
          "Public law should actively uphold inherited family and sexual norms rather than leave those questions mainly to individual choice.",
        domain: "family-gender-feminism",
        layer: "prescriptive",
        constructs: { "moral-traditionalism": 1 },
        axisWeights: [
          { axisId: "regulation-vs-deregulation", weight: 0.6 },
          { axisId: "state-action-vs-exit", weight: 0.4 },
        ],
      },
      {
        id: "fm-co-3",
        prompt:
          "The political community should give special priority to the continuity and authority of a historic national culture.",
        domain: "national-identity-sovereignty",
        layer: "normative",
        constructs: { "national-continuity": 1 },
        axisWeights: [
          { axisId: "political-community-boundary", weight: -0.8 },
          { axisId: "moral-traditionalism", weight: 0.3 },
        ],
      },
      {
        id: "fm-co-4",
        prompt:
          "A state may need an assertive foreign policy and strong international alliances to defend a liberal order against hostile regimes.",
        domain: "foreign-policy-war",
        layer: "prescriptive",
        constructs: { "assertive-internationalism": 1 },
        axisWeights: [{ axisId: "coercion-strategy", weight: 0.8 }],
      },
    ],
    [
      candidate(
        "conservative",
        "Conservative / Prudential Conservative",
        "Broad prudential continuity and gradual institutional change.",
        {
          prudence: 0.95,
          "moral-traditionalism": 0.25,
          "national-continuity": 0.25,
          "assertive-internationalism": 0,
        },
        [gate("prudence", 0.65)],
      ),
      candidate(
        "social-conservatism",
        "Social Conservatism",
        "Moral and family traditionalism as a cross-cutting political commitment.",
        {
          prudence: 0.5,
          "moral-traditionalism": 0.95,
          "national-continuity": 0.4,
          "assertive-internationalism": 0,
        },
        [gate("moral-traditionalism", 0.65)],
      ),
      candidate(
        "national-conservatism",
        "National Conservatism",
        "National continuity joined to conservative institutional politics.",
        {
          prudence: 0.65,
          "moral-traditionalism": 0.55,
          "national-continuity": 0.95,
          "assertive-internationalism": 0.3,
        },
        [gate("national-continuity", 0.65)],
      ),
      candidate(
        "liberal-conservatism",
        "Liberal Conservatism / Conservative Liberalism",
        "Constitutional liberty and markets combined with social and institutional continuity.",
        {
          prudence: 0.7,
          "moral-traditionalism": 0.3,
          "national-continuity": 0.2,
          "assertive-internationalism": 0.2,
        },
        [gate("prudence", 0.55)],
      ),
      candidate(
        "neoconservative",
        "Neoconservatism",
        "Modern U.S. conservative internationalism with an assertive foreign-policy orientation.",
        {
          prudence: 0.4,
          "moral-traditionalism": 0.35,
          "national-continuity": 0.25,
          "assertive-internationalism": 0.95,
        },
        [gate("assertive-internationalism", 0.65)],
      ),
    ],
  ),
];
