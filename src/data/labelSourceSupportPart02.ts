import type { IdeologyLabelSourceScope, LabelId } from "../types";

export const EXPLICIT_SUPPORTS_BY_SOURCE_ID_BY_LABEL_ID: Partial<
  Record<LabelId, Readonly<Record<string, readonly IdeologyLabelSourceScope[]>>>
> = {
  conservative: {
    "sep-prudential-conservatism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "green-politics": {
    "sep-green-political-ecology": ["definition", "normative", "boundary"],
  },
  "social-anarchism": {
    "sep-social-communal-anarchism": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  "market-right-libertarianism": {
    "sep-market-right-libertarianism": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  "marxian-socialism": {
    "sep-marxian-socialism": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  "technocratic-orientation": {
    "routledge-technocracy": ["definition", "descriptive", "boundary"],
  },
  "technocratic-centralist": {
    "routledge-technocracy": ["definition", "boundary"],
    "cambridge-technocracy-democracy-hybrids": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "social-democrat": {
    "oxford-ethics-social-democracy": ["definition", "normative", "boundary"],
  },
  "democratic-socialist": {
    "oxford-american-democratic-socialism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  communitarianism: {
    "sep-communitarianism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "marxist-leninist": {
    "cambridge-marxism-leninism-discourse": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  republicanism: {
    "sep-republicanism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  corporatism: {
    "cambridge-corporatism": ["definition", "descriptive", "boundary"],
  },
  "fascist-authoritarian": {
    "cambridge-fascist-palingenetic-ultranationalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "wiley-doctrine-of-fascism": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
    "ushmm-fascism": ["definition", "descriptive", "boundary"],
  },
  ethnonationalist: {
    "oxford-ethnonationalism": ["definition", "descriptive", "boundary"],
    "cambridge-nationalism-demos-boundary": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  regionalism: {
    "princeton-regionalism-regionalization": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
    "oxford-regional-authority-preferences": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  kemalism: {
    "cambridge-kemalism": ["definition", "descriptive", "boundary"],
  },
  "islamic-democracy": {
    "cambridge-islamic-constitutionalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "annualreviews-islamic-constitutionalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "polity-islamic-democracy": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  integralism: {
    "cambridge-integralism-christian-nationalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "oxford-catholic-integralism": ["definition", "normative", "boundary"],
  },
  "anarcho-communist": {
    "cambridge-anarchist-communism": ["definition", "descriptive", "boundary"],
  },
  minarchist: {
    "cambridge-libertarianism-state": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  geolibertarian: {
    "oxford-georgism-land-value-tax": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
  },
  hindutva: {
    "oxford-hindutva": ["definition", "descriptive", "boundary"],
    "cambridge-hindutva-markets": ["definition", "descriptive", "boundary"],
  },
  zionism: {
    "cambridge-zionism": ["definition", "descriptive", "boundary"],
    "cambridge-zionism-revisionism": ["definition", "descriptive", "boundary"],
    "cambridge-zionism-labour": ["definition", "descriptive", "boundary"],
  },
  cyberocracy: {
    "rand-cyberocracy": ["definition", "descriptive", "boundary"],
    "rand-cyberocracy-original": ["definition", "descriptive", "boundary"],
  },
  accelerationism: {
    "tandf-accelerationism": ["definition", "descriptive", "boundary"],
    "cambridge-accelerationism-spectrum": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "oxford-reactionary-accelerationism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "fourth-theory": {
    "dugin-fourth-political-theory-primary": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
    "springer-fourth-political-theory": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  agorist: {
    "konkin-new-libertarian-manifesto": ["definition", "boundary"],
  },
  mutualist: {
    "cambridge-mutualist-social-science": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
    "sep-individualist-anarchism-boundary": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "umich-jo-labadie-individualist-anarchism": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "swartz-what-is-mutualism": [
      "definition",
      "normative",
      "prescriptive",
      "boundary",
    ],
    "c4ss-laurance-labadie-archive": ["definition", "descriptive", "boundary"],
    "carson-are-we-all-mutualists": ["definition", "descriptive", "boundary"],
    "c4ss-what-is-c4ss": ["definition", "descriptive", "boundary"],
    "c4ss-history-2006": ["boundary"],
    "c4ss-carson-first-paid-staff": ["boundary"],
  },
  "council-communist": {
    "cambridge-council-communism-workers-control": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "degrowth-green": {
    "oxford-degrowth-planning": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "deep-ecology": {
    "oxford-deep-ecology": [
      "definition",
      "normative",
      "descriptive",
      "boundary",
    ],
    "oxford-radical-environmentalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  ecosocialist: {
    "oxford-radical-environmentalism": [
      "definition",
      "normative",
      "descriptive",
      "boundary",
    ],
  },
  "absolute-monarchist": {
    "cambridge-absolute-monarchy-theory": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  maoism: {
    "cambridge-maoism-definition": ["definition", "descriptive", "boundary"],
  },
  trotskyism: {
    "cambridge-trotskyism-historiography": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  participism: {
    "erasmus-participatory-economics": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "individualist-anarchism": {
    "wiley-individualist-anarchism": ["definition", "descriptive", "boundary"],
  },
  "constitutional-monarchism": {
    "cambridge-constitutional-monarchy": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  dataism: {
    "cambridge-dataism-digital-politics": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "fundamentalist-theocracy": {
    "oxford-theocratic-secularism": ["definition", "descriptive", "boundary"],
  },
  "liquid-democracy": {
    "oxford-liquid-democracy": ["definition", "descriptive", "boundary"],
  },
  "radical-centrism": {
    "notre-dame-radical-center": ["definition", "descriptive", "boundary"],
  },
  singularitarianism: {
    "scielo-singularitarianism": ["definition", "descriptive", "boundary"],
  },
  "social-investment-state": {
    "cambridge-social-investment-state": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  platformism: {
    "platformist-organisational-platform": ["definition", "boundary"],
  },
  panarchism: {
    "routledge-panarchy": ["definition", "descriptive", "boundary"],
  },
  transhumanism: {
    "oxford-transhumanist-imaginaries": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "universal-basic-income": {
    "oxford-basic-income": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  neoconservative: {
    "oxford-neoconservatism": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  ecomodernist: {
    "mit-ecomodernism-technology-politics": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "socialist-feminism": {
    "cambridge-socialist-feminism-history": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "christian-socialism": {
    "oxford-christian-socialism-history": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "guild-socialism": {
    "oxford-guild-socialism": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  indigenism: {
    "oxford-indigenism-human-rights": ["definition", "descriptive", "boundary"],
  },
  "libertarian-municipalism": {
    "res-publica-libertarian-municipalism": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  georgism: {
    "oxford-georgism-land-value-tax": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  paleoconservatism: {
    "cambridge-paleoconservatism-morphology": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "left-wing-market-anarchism": {
    "routledge-left-market-anarchism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "traditional-monarchist": {
    "oxford-monarchism-authoritarian-politics": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  paleolibertarianism: {
    "ucm-paleolibertarianism": ["definition", "descriptive", "boundary"],
  },
  "eco-fascism": {
    "cambridge-ecofascism-illiberal-environmentalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "national-bolshevism": {
    "sciencedirect-red-brown-politics": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  juche: {
    "oxford-juche-history": ["definition", "descriptive", "boundary"],
    "cambridge-north-korea-socialism-style": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  strasserism: {
    "sciencedirect-red-brown-politics": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "techno-anarchism": {
    "wiley-anarchism-politics-technology": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "anarchist-studies-cryptoanarchist-governance": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "utopian-socialism": {
    "cambridge-utopian-socialism-social-science": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  voluntaryism: {
    "journal-libertarian-studies-voluntaryism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  stirnerism: {
    "cambridge-stirner-egoism": ["definition", "descriptive", "boundary"],
  },
  "anarcha-feminism": {
    "cambridge-anarcho-feminism-history": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "bright-green-environmentalism": {
    "cambridge-bright-green-environmentalism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "bleeding-heart-libertarianism": {
    "independent-rawls-bleeding-heart-libertarianism": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "christian-reconstructionism": {
    "oxford-christian-reconstruction": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "queer-anarchism": {
    "sage-queer-theory-anarchism": ["definition", "descriptive", "boundary"],
  },
  "religious-nationalism": {
    "oxford-religious-nationalism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "civil-libertarian-cosmopolitan": {
    "oxford-political-cosmopolitanism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "market-anarchism": {
    "sep-anarchism": ["definition", "boundary"],
    "sep-libertarianism": ["definition", "boundary"],
    "routledge-market-anarchism": ["definition", "descriptive", "boundary"],
  },
  "third-way": {
    "cambridge-third-way-social-democracy": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  baathism: {
    "cambridge-baathism-arab-lefts": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "developmental-authoritarianism": {
    "cambridge-developmental-states": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "confucian-political-revival": {
    "sep-modern-confucianism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "asian-values": {
    "cambridge-confucian-asian-values": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "market-liberal": {
    "oxford-market-liberalism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  nationalism: {
    "sep-nationalism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  populism: {
    "cambridge-populist-people-elite": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
    "cambridge-populist-zeitgeist": ["definition", "descriptive", "boundary"],
  },
  "civil-libertarianism": {
    "stanford-civil-liberty": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  cosmopolitanism: {
    "oxford-political-cosmopolitanism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "decentralist-orientation": {
    "oxford-regional-authority-preferences": [
      "definition",
      "descriptive",
      "boundary",
    ],
    "routledge-panarchy": ["definition", "prescriptive", "boundary"],
  },
  "feminist-orientation": {
    "sep-feminist-political-philosophy": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "economic-nationalism": {
    "cambridge-economic-nationalism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  developmentalism: {
    "oxford-developmentalism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
    "cambridge-developmental-states": ["definition", "descriptive", "boundary"],
  },
  "pan-arabism": {
    "oxford-pan-arabism": ["definition", "descriptive", "boundary"],
    "cambridge-panarab-ideology": [
      "definition",
      "normative",
      "descriptive",
      "boundary",
    ],
  },
  "arab-socialism": {
    "cambridge-arab-socialism": ["definition", "descriptive", "boundary"],
    "cambridge-baathism-arab-lefts": ["definition", "descriptive", "boundary"],
  },
  "radical-feminism": {
    "sep-feminist-political-philosophy": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "black-feminism": {
    "annualreviews-black-feminism": [
      "definition",
      "normative",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "queer-politics": {
    "uchicago-queer-liberation-politics": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "national-conservatism": {
    "tandf-national-conservatism": ["definition", "descriptive", "boundary"],
  },
  "liberal-conservatism": {
    "oxford-conservative-liberalism": [
      "definition",
      "descriptive",
      "prescriptive",
      "boundary",
    ],
  },
  "social-conservatism": {
    "sage-social-conservatism": [
      "definition",
      "normative",
      "descriptive",
      "boundary",
    ],
  },
  theocrat: {
    "oxford-theocracy-secularism": ["definition", "descriptive", "boundary"],
    "cambridge-theocracy-variants": ["definition", "descriptive", "boundary"],
  },
  "eco-authoritarianism": {
    "cambridge-eco-authoritarianism": ["definition", "descriptive", "boundary"],
  },
  internationalism: {
    "oxford-internationalism-political-ideology": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  neoliberalism: {
    "oxford-neoliberalism-contested-uses": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  progressivism: {
    "cambridge-progressivism-reform": ["definition", "descriptive", "boundary"],
  },
  "expansionist-nationalism": {
    "cambridge-imperial-nationalism": ["definition", "descriptive", "boundary"],
  },
  "separatist-nationalism": {
    "cambridge-substate-nationalism-variation": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "right-wing-populism": {
    "cambridge-populist-zeitgeist": ["definition", "normative", "boundary"],
    "cambridge-populist-people-elite": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "left-wing-populism": {
    "cambridge-populist-zeitgeist": ["definition", "normative", "boundary"],
    "cambridge-populist-people-elite": [
      "definition",
      "descriptive",
      "boundary",
    ],
  },
  "agrarian-populism": {
    "oxford-agrarian-populism": ["definition", "descriptive", "boundary"],
    "cambridge-populist-zeitgeist": ["definition", "normative", "boundary"],
  },
};
