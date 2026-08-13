import { candidate, gate, spec } from "./experimentalSpecialistBuilder";

export const experimentalSpecialistModuleSpecsPart02 = [
  spec(
    "religious-national-politics-module",
    "Religious and national political projects",
    "Religious-national politics",
    "Separates constitutional religious democracy, religious authority, civilizational nationalism, minority citizenship, and territorial projects.",
    [
      {
        id: "fm-rn-1",
        prompt:
          "Constitutional authority should be publicly accountable to citizens even when religious law or tradition informs interpretation.",
        domain: "religion-secularism",
        layer: "normative",
        constructs: { "popular-constitutionalism": 1 },
        axisWeights: [
          { axisId: "anti-domination", weight: 0.5 },
          { axisId: "secularism-religious", weight: 0.3 },
        ],
      },
      {
        id: "fm-rn-2",
        prompt:
          "A recognized religious authority should have final power to reject civil laws that conflict with its interpretation of religious doctrine.",
        domain: "religion-secularism",
        layer: "prescriptive",
        constructs: { "religious-authority": 1 },
        axisWeights: [{ axisId: "state-action-vs-exit", weight: 0.5 }],
      },
      {
        id: "fm-rn-3",
        prompt:
          "The state should primarily express the historic religious or civilizational identity of the majority nation rather than remain neutral among identities.",
        domain: "national-identity-sovereignty",
        layer: "normative",
        constructs: {
          "civilizational-nationalism": 1,
          "religious-national-fusion": 1,
        },
        axisWeights: [
          { axisId: "political-community-boundary", weight: -0.7 },
          { axisId: "moral-traditionalism", weight: 0.6 },
        ],
      },
      {
        id: "fm-rn-4",
        prompt:
          "Minority citizens should retain equal legal and political standing even when the state adopts a majority religious or national tradition.",
        domain: "race-ethnicity-multiculturalism",
        layer: "normative",
        constructs: { "minority-citizenship": 1 },
        axisWeights: [
          { axisId: "equality-theory", weight: 0.8 },
          { axisId: "anti-domination", weight: 0.6 },
        ],
      },
      {
        id: "fm-rn-5",
        prompt:
          "Constitutional review should be able to invalidate legislation that conflicts with protected rights even when elected majorities support it.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "constitutional-review": 1 },
        axisWeights: [{ axisId: "centralization-preference", weight: 0.3 }],
      },
      {
        id: "fm-rn-6",
        prompt:
          "Political parties and candidates should be able to compete and change governments peacefully, subject to rules that protect equal citizenship.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "party-competition": 1 },
        axisWeights: [{ axisId: "electoralism-vs-direct-action", weight: 0.8 }],
      },
      {
        id: "fm-rn-7",
        prompt:
          "An Islamic ethical or legal tradition may legitimately inform constitutional public authority while citizens remain politically accountable and equal in civic rights.",
        domain: "religion-secularism",
        layer: "normative",
        constructs: { "islamic-public-law": 1 },
        axisWeights: [
          { axisId: "secularism-religious", weight: 0.7 },
          { axisId: "anti-domination", weight: 0.4 },
        ],
      },
      {
        id: "fm-rn-8",
        prompt:
          "A constitutional system should allow citizens and parties to contest how Islamic principles are interpreted rather than assign final interpretive power to one clerical authority.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "interpretive-pluralism": 1 },
        axisWeights: [
          { axisId: "centralization-preference", weight: -0.3 },
          { axisId: "electoralism-vs-direct-action", weight: 0.5 },
        ],
      },
      {
        id: "fm-rn-9",
        prompt:
          "Indian political membership should be grounded primarily in Hindu civilizational belonging rather than only in a religiously neutral civic identity.",
        domain: "national-identity-sovereignty",
        layer: "normative",
        constructs: { "hindu-civilizational-belonging": 1 },
        axisWeights: [
          { axisId: "political-community-boundary", weight: -0.8 },
          { axisId: "moral-traditionalism", weight: 0.6 },
        ],
      },
      {
        id: "fm-rn-10",
        prompt:
          "A Jewish national home or state is a legitimate expression of Jewish collective self-determination, without fixing one border, religion, or constitutional form.",
        domain: "national-identity-sovereignty",
        layer: "normative",
        constructs: { "jewish-national-self-determination": 1 },
        axisWeights: [
          { axisId: "political-community-boundary", weight: -0.8 },
          { axisId: "authority-legitimacy", weight: 0.2 },
        ],
      },
      {
        id: "fm-rn-11",
        prompt:
          "When civil law conflicts with a recognized religious doctrine, that doctrine’s authorized interpreters should determine whether the law is ultimately legitimate.",
        domain: "religion-secularism",
        layer: "normative",
        constructs: { "religious-authority": 1 },
        axisWeights: [
          { axisId: "authority-legitimacy", weight: 0.45 },
          { axisId: "secularism-religious", weight: 0.75 },
        ],
      },
    ],
    [
      candidate(
        "islamic-democracy",
        "Islamic Democratic Constitutionalism",
        "Popular sovereignty and constitutional competition interpreted through Islamic legal and ethical traditions.",
        {
          "popular-constitutionalism": 0.9,
          "religious-authority": 0.25,
          "civilizational-nationalism": 0.2,
          "minority-citizenship": 0.6,
          "constitutional-review": 0.85,
          "party-competition": 0.85,
          "islamic-public-law": 0.95,
          "interpretive-pluralism": 0.8,
        },
        [
          gate("popular-constitutionalism", 0.55),
          gate("constitutional-review", 0.55),
          gate("party-competition", 0.55),
          gate("islamic-public-law", 0.55),
          gate("interpretive-pluralism", 0.45),
        ],
      ),
      candidate(
        "political-islam",
        "Political Islam",
        "Political projects that make Islamic identity or law central to state and movement politics.",
        {
          "popular-constitutionalism": 0.35,
          "religious-authority": 0.65,
          "civilizational-nationalism": 0.55,
          "minority-citizenship": 0.2,
          "constitutional-review": 0.35,
          "party-competition": 0.45,
          "islamic-public-law": 0.7,
          "interpretive-pluralism": 0.15,
        },
        [gate("islamic-public-law", 0.55)],
      ),
      candidate(
        "theocrat",
        "Theocratic Politics (religious-legal authority)",
        "A family-level experimental affinity for final religious authority over civil-law legitimacy. It does not identify a religion, clerical office, constitutional form, or treatment of minorities.",
        { "religious-authority": 0.95 },
        [gate("religious-authority", 0.65)],
      ),
      candidate(
        "hindutva",
        "Hindutva",
        "A majoritarian or civilizational account of Indian national identity centered on Hindu cultural belonging.",
        {
          "popular-constitutionalism": 0.25,
          "religious-authority": 0.25,
          "civilizational-nationalism": 0.95,
          "minority-citizenship": -0.25,
          "constitutional-review": 0.25,
          "party-competition": 0.35,
          "hindu-civilizational-belonging": 0.95,
        },
        [gate("hindu-civilizational-belonging", 0.65)],
      ),
      candidate(
        "zionism",
        "Zionism",
        "A family of Jewish national self-determination projects with divergent territorial and constitutional variants.",
        {
          "popular-constitutionalism": 0.3,
          "religious-authority": 0.2,
          "civilizational-nationalism": 0.75,
          "minority-citizenship": 0.2,
          "constitutional-review": 0.35,
          "party-competition": 0.5,
          "jewish-national-self-determination": 0.95,
        },
        [gate("jewish-national-self-determination", 0.65)],
      ),
      candidate(
        "religious-nationalism",
        "Religious Nationalism",
        "An umbrella fusion of religious identity and national goals whose institutional forms vary over law, citizenship, authority, and minority rights.",
        {
          "popular-constitutionalism": 0.2,
          "religious-authority": 0.45,
          "civilizational-nationalism": 0.78,
          "religious-national-fusion": 0.9,
          "minority-citizenship": 0.05,
          "constitutional-review": 0.2,
          "party-competition": 0.25,
          "islamic-public-law": 0.15,
          "hindu-civilizational-belonging": 0.2,
          "jewish-national-self-determination": 0.15,
        },
        [gate("religious-national-fusion", 0.6)],
      ),
    ],
  ),
  spec(
    "technology-governance-module",
    "Technology and governance variants",
    "Technology and governance",
    "Separates expert administration, centralized governance, algorithmic authority, decentralized technology, and accelerationist strategy.",
    [
      {
        id: "fm-te-1",
        prompt:
          "For technically complex public decisions, legitimate institutions should give qualified expertise substantial weight while preserving public accountability.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "expert-administration": 1 },
        axisWeights: [{ axisId: "centralization-preference", weight: 0.2 }],
      },
      {
        id: "fm-te-2",
        prompt:
          "Algorithmic systems should be allowed to make or substantially determine public decisions when their performance exceeds that of human officials.",
        domain: "technology-ai-surveillance",
        layer: "prescriptive",
        constructs: { "algorithmic-authority": 1 },
        axisWeights: [
          { axisId: "centralization-preference", weight: 0.5 },
          { axisId: "state-action-vs-exit", weight: 0.3 },
        ],
      },
      {
        id: "fm-te-3",
        prompt:
          "Cryptography, distributed networks, and peer-to-peer tools can reduce dependence on centralized states and corporations.",
        domain: "technology-ai-surveillance",
        layer: "descriptive",
        constructs: { "decentralized-technology": 1 },
        axisWeights: [{ axisId: "coordination-optimism", weight: 0.8 }],
      },
      {
        id: "fm-te-4",
        prompt:
          "Rapid technological acceleration should be pursued even when it destabilizes existing institutions and social arrangements.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { "accelerationist-strategy": 1 },
        axisWeights: [
          { axisId: "reform-vs-revolution", weight: 0.7 },
          { axisId: "gradualism-vs-immediatism", weight: 0.7 },
        ],
      },
      {
        id: "fm-te-5",
        prompt:
          "Technological and economic intensification should push market competition further, even when it weakens existing social and political arrangements.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { "market-acceleration": 1 },
        axisWeights: [
          { axisId: "regulation-vs-deregulation", weight: -0.6 },
          { axisId: "reform-vs-revolution", weight: 0.4 },
        ],
      },
      {
        id: "fm-te-6",
        prompt:
          "Technically complex public decisions should be coordinated through one national authority rather than through multiple local or voluntary institutions.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "centralized-administration": 1 },
        axisWeights: [{ axisId: "centralization-preference", weight: 0.8 }],
      },
    ],
    [
      candidate(
        "technocratic-centralist",
        "Technocratic Centralism",
        "Centralized expert administration insulated from ordinary electoral pressure.",
        {
          "expert-administration": 0.95,
          "algorithmic-authority": 0.55,
          "decentralized-technology": -0.45,
          "accelerationist-strategy": 0.1,
          "market-acceleration": 0.15,
          "centralized-administration": 0.95,
        },
        [
          gate("expert-administration", 0.65),
          gate("centralized-administration", 0.6),
        ],
      ),
      candidate(
        "cyberocracy",
        "Cyberocracy",
        "Governance through cybernetic information systems and algorithmic administration.",
        {
          "expert-administration": 0.7,
          "algorithmic-authority": 0.95,
          "decentralized-technology": 0.1,
          "accelerationist-strategy": 0.3,
          "market-acceleration": 0.1,
          "centralized-administration": 0.55,
        },
        [gate("algorithmic-authority", 0.65)],
      ),
      candidate(
        "techno-anarchism",
        "Techno-Anarchism",
        "Decentralized technology and cryptography used against centralized control.",
        {
          "expert-administration": -0.35,
          "algorithmic-authority": -0.25,
          "decentralized-technology": 0.95,
          "accelerationist-strategy": 0.35,
          "market-acceleration": -0.1,
          "centralized-administration": -0.75,
        },
        [
          gate("decentralized-technology", 0.65),
          gate("centralized-administration", undefined, 0.2),
        ],
      ),
      candidate(
        "accelerationism",
        "Accelerationism",
        "Strategic intensification of technological or social change to transform existing institutions.",
        {
          "expert-administration": 0.15,
          "algorithmic-authority": 0.25,
          "decentralized-technology": 0.2,
          "accelerationist-strategy": 0.95,
          "market-acceleration": 0.2,
          "centralized-administration": 0,
        },
        [gate("accelerationist-strategy", 0.65)],
      ),
      candidate(
        "left-accelerationism",
        "Left Accelerationism",
        "A post-capitalist accelerationist current that seeks to redirect technological and economic capacities beyond capitalist social relations.",
        {
          "expert-administration": 0,
          "algorithmic-authority": 0,
          "decentralized-technology": 0,
          "accelerationist-strategy": 1,
          "market-acceleration": -1,
          "centralized-administration": 0,
        },
        [
          gate("accelerationist-strategy", 0.7),
          gate("market-acceleration", undefined, -0.55),
        ],
      ),
      candidate(
        "right-accelerationism",
        "Right Accelerationism",
        "A market-intensifying accelerationist current associated with deepening competition, technological disruption, and the weakening of existing political arrangements.",
        {
          "expert-administration": 0,
          "algorithmic-authority": 0,
          "decentralized-technology": 0,
          "accelerationist-strategy": 1,
          "market-acceleration": 1,
          "centralized-administration": 0,
        },
        [
          gate("accelerationist-strategy", 0.7),
          gate("market-acceleration", 0.55),
        ],
      ),
      candidate(
        "technology-centered-accelerationism",
        "Technology-Centered Accelerationism",
        "A technology-first accelerationist current whose political-economic destination is less specified than its commitment to intensification.",
        {
          "expert-administration": 0,
          "algorithmic-authority": 0,
          "decentralized-technology": 0,
          "accelerationist-strategy": 1,
          "market-acceleration": 0,
          "centralized-administration": 0,
        },
        [gate("accelerationist-strategy", 0.7)],
      ),
      candidate(
        "dataism",
        "Dataism",
        "An epistemic and cultural orientation that gives data-driven systems privileged interpretive authority.",
        {
          "expert-administration": 0.6,
          "algorithmic-authority": 0.75,
          "decentralized-technology": 0.2,
          "accelerationist-strategy": 0.4,
          "market-acceleration": 0.2,
          "centralized-administration": 0.2,
        },
        [gate("algorithmic-authority", 0.55)],
      ),
    ],
  ),
  spec(
    "monarchist-municipal-module",
    "Monarchist and municipal/confederal families",
    "Regime and confederal variants",
    "Separates hereditary authority, constitutional limitation, municipal self-rule, and confederal coordination.",
    [
      {
        id: "fm-mm-1",
        prompt:
          "Hereditary or traditional authority can be legitimate even when it is not continuously authorized through ordinary elections.",
        domain: "state-legitimacy",
        layer: "normative",
        constructs: { "hereditary-authority": 1 },
        axisWeights: [{ axisId: "authority-legitimacy", weight: 0.8 }],
      },
      {
        id: "fm-mm-2",
        prompt:
          "A monarch can serve as a constitutional symbol while elected institutions retain final political authority.",
        domain: "democracy-expertise-constitutionalism",
        layer: "prescriptive",
        constructs: { "constitutional-monarchy": 1 },
        axisWeights: [{ axisId: "electoralism-vs-direct-action", weight: 0.5 }],
      },
      {
        id: "fm-mm-3",
        prompt:
          "Political decisions should be made as locally as possible, with higher-level bodies limited to tasks that local communities cannot coordinate alone.",
        domain: "democracy-expertise-constitutionalism",
        layer: "normative",
        constructs: { "municipal-autonomy": 1 },
        axisWeights: [{ axisId: "anti-domination", weight: 0.5 }],
      },
      {
        id: "fm-mm-4",
        prompt:
          "Political authority should be coordinated through confederal institutions among municipalities or regions rather than concentrated in one centralized state.",
        domain: "strategy-change",
        layer: "prescriptive",
        constructs: { "confederal-coordination": 1 },
        axisWeights: [{ axisId: "centralization-preference", weight: -0.8 }],
      },
    ],
    [
      candidate(
        "absolute-monarchist",
        "Absolute Monarchism",
        "Hereditary authority with concentrated sovereign power.",
        {
          "hereditary-authority": 0.95,
          "constitutional-monarchy": -0.3,
          "municipal-autonomy": -0.4,
          "confederal-coordination": -0.4,
        },
        [
          gate("hereditary-authority", 0.7),
          gate("constitutional-monarchy", undefined, 0.1),
        ],
      ),
      candidate(
        "traditional-monarchist",
        "Traditional Monarchism",
        "Hereditary authority grounded in historical and social continuity.",
        {
          "hereditary-authority": 0.85,
          "constitutional-monarchy": 0.2,
          "municipal-autonomy": 0,
          "confederal-coordination": -0.1,
        },
        [gate("hereditary-authority", 0.7)],
      ),
      candidate(
        "constitutional-monarchism",
        "Constitutional Monarchism",
        "Monarchy constrained by constitutional and elected institutions.",
        {
          "hereditary-authority": 0.45,
          "constitutional-monarchy": 0.95,
          "municipal-autonomy": 0.1,
          "confederal-coordination": 0,
        },
        [gate("constitutional-monarchy", 0.7)],
      ),
      candidate(
        "libertarian-municipalism",
        "Libertarian Municipalism",
        "Municipal democracy and confederal self-government.",
        {
          "hereditary-authority": -0.5,
          "constitutional-monarchy": -0.1,
          "municipal-autonomy": 0.95,
          "confederal-coordination": 0.85,
        },
        [
          gate("municipal-autonomy", 0.7),
          gate("confederal-coordination", 0.55),
        ],
      ),
      candidate(
        "democratic-confederalism",
        "Democratic Confederalism",
        "Decentralized, pluralist, and confederal democratic organization.",
        {
          "hereditary-authority": -0.65,
          "constitutional-monarchy": -0.2,
          "municipal-autonomy": 0.85,
          "confederal-coordination": 0.95,
        },
        [
          gate("municipal-autonomy", 0.7),
          gate("confederal-coordination", 0.65),
        ],
      ),
    ],
  ),
];
