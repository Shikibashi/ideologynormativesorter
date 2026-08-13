import type { IdeologyLabel } from "../../types";
import { broadCentroid } from "../broadCentroid";

export const broadLabelsPart02: IdeologyLabel[] = [
  {
    id: "black-feminism",
    name: "Black Feminism",
    family: "feminist",
    subfamily: "black-feminist",
    description:
      "A feminist tradition analyzing interlocking race, gender, class, sexuality, and state power from Black women’s political experience while developing autonomous organization, coalition, and liberation strategies.",
    usageNote:
      "Black feminism is not generic feminism, Black Nationalism, Socialist Feminism, or Multiculturalism, although it can overlap with each.",
    cautionNote:
      "The tradition is internally plural and should not be reduced to one identity claim or one policy platform.",
    philosophies: [
      "Feminism",
      "Black Feminism",
      "Intersectional Liberation",
      "Anti-Racism",
    ],
    subTheories: ["Black Feminist Thought", "Womanism"],
    normativePhilosophies: ["Feminism", "Anti-Racism"],
    descriptivePhilosophies: ["Intersectional Liberation"],
    prescriptivePhilosophies: ["Black Feminism"],
    centroid: broadCentroid({
      "authority-legitimacy": 0.05,
      "property-legitimacy": -0.15,
      "liberty-noninterference": 0.25,
      "equality-theory": 0.8,
      "political-community-boundary": -0.05,
      "moral-traditionalism": -0.35,
      "anti-domination": 0.9,
      "state-capacity-confidence": 0.1,
      "democratic-confidence": 0.45,
      "cultural-plasticity": 0.35,
      "centralization-preference": -0.05,
      "state-action-vs-exit": 0.2,
      "electoralism-vs-direct-action": 0.2,
      "regulation-vs-deregulation": 0.2,
      "redistribution-vs-predistribution": 0.4,
      "secularism-religious": -0.15,
    }),
  },
  {
    id: "queer-politics",
    name: "Queer Liberation / Queer Politics",
    family: "feminist",
    subfamily: "queer-politics",
    description:
      "A broad family seeking sexual and gender self-determination while critiquing heteronormativity, compulsory categories, policing, medicalization, and fixed identities; strategies range from rights reform to radical transformation.",
    usageNote:
      "Broad queer politics is distinct from Queer Anarchism, Anarcha-Feminism, and any single theory of gender or sexuality.",
    cautionNote:
      "The specialist is intentionally plural and should not be inferred from support for one isolated equality or anti-discrimination policy.",
    philosophies: [
      "Queer Politics",
      "Gender Liberation",
      "Feminism",
      "Anti-Authoritarianism",
    ],
    subTheories: ["Queer Liberation", "Queer Theory"],
    normativePhilosophies: ["Gender Liberation", "Feminism"],
    descriptivePhilosophies: ["Queer Politics"],
    prescriptivePhilosophies: ["Anti-Authoritarianism"],
    centroid: broadCentroid({
      "authority-legitimacy": -0.1,
      "liberty-noninterference": 0.65,
      "equality-theory": 0.55,
      "moral-traditionalism": -0.8,
      "anti-domination": 0.75,
      "democratic-confidence": 0.35,
      "cultural-plasticity": 0.85,
      "centralization-preference": -0.2,
      "state-action-vs-exit": 0.1,
      "electoralism-vs-direct-action": 0.15,
      "regulation-vs-deregulation": 0.15,
      "redistribution-vs-predistribution": 0.2,
      "secularism-religious": -0.5,
    }),
  },
  {
    id: "nationalism",
    name: "Nationalism / National Orientation",
    family: "nationalist",
    subfamily: "national-orientation",
    description:
      "A cross-cutting orientation that treats the nation as a valuable political community entitled to some combination of continuity, solidarity, priority, sovereignty, or self-government.",
    usageNote:
      "This modifier does not decide who belongs, what economic system the nation should adopt, or whether its territorial project is defensive, separatist, unifying, or expansionist.",
    cautionNote:
      "Civic, ethnocultural, religious, left-wing, economic, separatist, and expansionist variants require separate evidence.",
    philosophies: ["Nationalism", "Popular Sovereignty", "Self-Determination"],
    normativePhilosophies: ["Nationalism", "Self-Determination"],
    descriptivePhilosophies: ["Nationalism"],
    prescriptivePhilosophies: ["Popular Sovereignty"],
    centroid: broadCentroid({
      "political-community-boundary": -0.55,
      "state-capacity-confidence": 0.2,
      "democratic-confidence": 0.1,
      "moral-traditionalism": 0.15,
      "anti-domination": 0.1,
      "centralization-preference": 0.1,
      "state-action-vs-exit": 0.25,
      "secularism-religious": 0.1,
    }),
  },
  {
    id: "populism",
    name: "Populism / People-versus-Elite Orientation",
    family: "populist",
    subfamily: "thin-populism",
    description:
      "A thin cross-cutting orientation framing politics as a moral struggle between a virtuous people and a corrupt elite and treating popular sovereignty or a general will as especially authoritative.",
    usageNote:
      "Populism supplies a political frame rather than a complete economic or social program; left, right, agrarian, centrist, and authoritarian hosts must be distinguished separately.",
    cautionNote:
      "Do not infer anti-pluralism, fascism, nationalism, or a specific economic policy from anti-elite language alone.",
    philosophies: ["Populism", "Popular Sovereignty", "Anti-Elitism"],
    normativePhilosophies: ["Popular Sovereignty"],
    descriptivePhilosophies: ["Populism"],
    prescriptivePhilosophies: ["Anti-Elitism"],
    centroid: broadCentroid({
      "authority-legitimacy": 0.15,
      "equality-theory": 0.25,
      "political-community-boundary": -0.15,
      "anti-domination": 0.4,
      "public-choice-skepticism": 0.65,
      "democratic-confidence": 0.25,
      "centralization-preference": 0.1,
      "electoralism-vs-direct-action": 0.15,
      "compromise-vs-persistence": -0.2,
      "coercion-strategy": 0.05,
    }),
  },
  {
    id: "civil-libertarianism",
    name: "Civil Libertarianism",
    family: "liberal",
    subfamily: "civil-libertarian",
    description:
      "A cross-cutting orientation giving strong presumptive protection to speech, press, privacy, association, religion, due process, protest, and bodily autonomy independent of economic ideology.",
    usageNote:
      "Civil libertarianism is about personal and procedural freedom, not necessarily private property, market liberty, minimal government, or cosmopolitanism.",
    cautionNote:
      "Different civil-libertarian traditions disagree over emergency powers, economic regulation, equality, and the scope of bodily autonomy.",
    philosophies: ["Civil Libertarianism", "Liberalism", "Rights"],
    normativePhilosophies: ["Civil Libertarianism", "Rights"],
    descriptivePhilosophies: ["Liberalism"],
    prescriptivePhilosophies: ["Civil Libertarianism"],
    centroid: broadCentroid({
      "liberty-noninterference": 0.85,
      "anti-domination": 0.75,
      "moral-traditionalism": -0.35,
      "democratic-confidence": 0.45,
      "centralization-preference": -0.15,
      "state-action-vs-exit": -0.2,
      "coercion-strategy": -0.8,
      "secularism-religious": -0.25,
    }),
  },
  {
    id: "cosmopolitanism",
    name: "Cosmopolitanism",
    family: "liberal",
    subfamily: "cosmopolitan",
    description:
      "A cross-cutting orientation toward equal moral concern across nationality and some combination of open membership, transnational rights, international cooperation, or supranational institutions.",
    usageNote:
      "Cosmopolitanism concerns the scope of moral and political obligation; it differs from Internationalism’s cooperation emphasis and World Federalism’s specific institutional project.",
    cautionNote:
      "Cosmopolitan commitments can coexist with local attachment, democratic borders, markets, welfare states, or strong civil liberties.",
    philosophies: ["Cosmopolitanism", "Universalism", "Global Justice"],
    normativePhilosophies: ["Cosmopolitanism", "Universalism"],
    descriptivePhilosophies: ["Global Justice"],
    prescriptivePhilosophies: ["Cosmopolitanism"],
    centroid: broadCentroid({
      "political-community-boundary": 0.8,
      "anti-domination": 0.35,
      "cultural-plasticity": 0.45,
      "democratic-confidence": 0.3,
      "centralization-preference": 0.1,
      "state-action-vs-exit": 0.1,
      "militarism-pacifism": 0.1,
    }),
  },
  {
    id: "decentralist-orientation",
    name: "Decentralist Orientation",
    family: "regionalist",
    subfamily: "decentralist",
    description:
      "A cross-cutting preference for local, federal, municipal, polycentric, or voluntarily chosen institutions over concentrated and territorially uniform authority.",
    usageNote:
      "Decentralization can coexist with markets, socialism, nationalism, ecology, or capable national coordination; it is not a synonym for separatism, anarchism, or regionalism.",
    cautionNote:
      "The modifier measures authority distribution and institutional scale, not a complete economic or cultural program.",
    philosophies: ["Decentralism", "Federalism", "Polycentrism"],
    normativePhilosophies: ["Decentralism", "Federalism"],
    descriptivePhilosophies: ["Polycentrism"],
    prescriptivePhilosophies: ["Decentralism"],
    centroid: broadCentroid({
      "authority-legitimacy": -0.35,
      "state-capacity-confidence": -0.1,
      "anti-domination": 0.55,
      "centralization-preference": -0.85,
      "state-action-vs-exit": -0.25,
      "electoralism-vs-direct-action": -0.1,
    }),
  },
  {
    id: "feminist-orientation",
    name: "Feminist Orientation",
    family: "feminist",
    subfamily: "feminist-orientation",
    description:
      "A cross-cutting orientation treating gendered power, exclusion, violence, care, reproduction, labor, or political representation as fundamental political concerns without selecting one feminist school.",
    usageNote:
      "This modifier supports specialist follow-ups for liberal, radical, socialist/Marxist, Black, anarchist, and queer feminisms; it is not itself one of those traditions.",
    cautionNote:
      "General support for equal treatment is not enough to identify a feminist school or a particular theory of patriarchy.",
    philosophies: ["Feminism", "Gender Equality", "Gender Justice"],
    normativePhilosophies: ["Feminism", "Gender Justice"],
    descriptivePhilosophies: ["Gender Equality"],
    prescriptivePhilosophies: ["Feminism"],
    centroid: broadCentroid({
      "liberty-noninterference": 0.2,
      "equality-theory": 0.65,
      "moral-traditionalism": -0.35,
      "anti-domination": 0.75,
      "democratic-confidence": 0.3,
      "cultural-plasticity": 0.35,
      "state-action-vs-exit": 0.1,
      "regulation-vs-deregulation": 0.15,
    }),
  },
  {
    id: "economic-nationalism",
    name: "Economic Nationalism",
    family: "nationalist",
    subfamily: "economic-nationalism",
    description:
      "A cross-cutting orientation prioritizing national productive capacity, strategic autonomy, domestic industry, supply resilience, managed trade, or national control of key assets.",
    usageNote:
      "Economic nationalism can attach to conservative, socialist, developmental, populist, or anti-colonial hosts and is not identical to fiscal conservatism or protectionism in every instance.",
    cautionNote:
      "The modifier measures national economic priority separately from the preferred ownership system, welfare regime, or level of state coercion.",
    philosophies: [
      "Economic Nationalism",
      "Productive Capacity",
      "Strategic Autonomy",
    ],
    normativePhilosophies: ["Economic Nationalism", "Strategic Autonomy"],
    descriptivePhilosophies: ["Productive Capacity"],
    prescriptivePhilosophies: ["Economic Nationalism"],
    centroid: broadCentroid({
      "property-legitimacy": -0.05,
      "political-community-boundary": -0.45,
      "market-process-confidence": -0.05,
      "state-capacity-confidence": 0.45,
      "public-choice-skepticism": -0.1,
      "coordination-optimism": 0.25,
      "centralization-preference": 0.25,
      "state-action-vs-exit": 0.45,
      "regulation-vs-deregulation": 0.35,
      "secularism-religious": 0.05,
    }),
  },
];
