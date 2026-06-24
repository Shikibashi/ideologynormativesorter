# Ideology labels — first curated batch: 26-axis centroid rationale

Review artifact accompanying the 15 new `IdeologyLabel` entries added to
`src/data/labels.ts` in this batch. For each label, the table below lists every
one of the 26 axes, the centroid value assigned (range −1..1), and a one-line
rationale citing the axis pole from `src/data/axes.ts`.

Centroid values were authored to (a) self-resolve in the archetype sweep or (b)
fall under a documented `NEAR_TIE_EXCEPTIONS` entry in
`src/scoring/archetype-sweep.test.ts`. One genuine near-tie remains:
`market-liberal`/`classical-liberalism` (margin 0.006); `minarchist`'s existing
near-tie was extended to include `classical-liberalism`.

Pole abbreviations used below: neg = negativePole, pos = positivePole.

---

## classical-liberalism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.5 | State authority requires constant justification (neg pole) — constitutional limits, not presumption. |
| property-legitimacy | 0.6 | Private property strongly legitimate (pos), but secondary to liberty. |
| liberty-noninterference | 0.9 | Liberty means non-interference (pos pole, near-max) — the master value. |
| equality-theory | -0.3 | Formal equality acceptable (neg) — equal rights, not equal outcomes. |
| political-community-boundary | 0.3 | Mildly universal obligations (pos) — rights are individual, not national. |
| moral-traditionalism | -0.1 | Pluralism mildly appropriate (neg) — personal morals left open. |
| anti-domination | 0.4 | Unaccountable power suspect (pos) — necessary check on even limited state. |
| human-nature-priority | -0.1 | Human use of nature mildly priority (neg) — anthropocentric baseline. |
| market-process-confidence | 0.5 | Markets coordinate fairly well (pos) — but not the central axiom. |
| state-capacity-confidence | -0.2 | States often fail complex tasks (neg) — distrust of administrative ambition. |
| public-choice-skepticism | 0.4 | Officials somewhat captured (pos) — capture risk justifies limits. |
| democratic-confidence | 0.3 | Voters sometimes sound (pos) — majority rule acceptable but bounded. |
| expert-confidence | -0.4 | Expert bodies tend to cartelize (neg) — skepticism toward technocracy. |
| cultural-plasticity | -0.2 | Culture path-dependent (neg) — institutions should respect settlement. |
| coordination-optimism | 0.5 | Voluntary coordination robust (pos) — civil society and markets suffice. |
| centralization-preference | -0.4 | Decentralize (neg) — strong subsidiarity/devolution. |
| reform-vs-revolution | -0.7 | Change through existing institutions (neg) — constitutionalism, gradual. |
| gradualism-vs-immediatism | -0.3 | Phase in gradually (neg) — avoid rupturing the rule of law. |
| state-action-vs-exit | -0.5 | Exit over state action (neg) — private/civil remedies preferred. |
| electoralism-vs-direct-action | 0.5 | Electoral channels (pos) — formal constitutional politics. |
| compromise-vs-persistence | 0.4 | Compromise worthwhile (pos) — constitutional negotiation. |
| coercion-strategy | -0.7 | Peaceful only (neg) — rejection of political coercion. |
| regulation-vs-deregulation | -0.4 | Remove some rules (neg) — regulation to protect liberty only. |
| redistribution-vs-predistribution | -0.5 | Alter rules before distribution (neg) — predistribution via fair rights, not transfers. |
| militarism-pacifism | -0.2 | Force rarely legitimate (neg) — noninterventionist default. |
| secularism-religious | -0.3 | Institutions neutral (neg) — separation of church and state. |

---

## neoliberalism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.2 | Central authority mildly presumptively legitimate (pos) — needs to police market rules. |
| property-legitimacy | 0.7 | Private property strongly legitimate (pos). |
| liberty-noninterference | 0.3 | Non-interference positive (pos) — but balanced by framework rules. |
| equality-theory | -0.2 | Formal equality acceptable (neg) — opportunity over outcomes. |
| political-community-boundary | 0.8 | Obligations universal (pos, strong) — global economic integration. |
| moral-traditionalism | -0.1 | Pluralism mildly appropriate (neg). |
| anti-domination | -0.1 | Mild hierarchy acceptance (neg) — market outcomes tolerated. |
| human-nature-priority | -0.2 | Human use of nature priority (neg). |
| market-process-confidence | 0.8 | Markets coordinate well (pos, strong) — strong confidence. |
| state-capacity-confidence | 0.6 | States can execute complex policy (pos) — to manage market frameworks. |
| public-choice-skepticism | 0.3 | Officials somewhat captured (pos) — but mitigable by rules. |
| democratic-confidence | 0.4 | Voters sometimes sound (pos). |
| expert-confidence | 0.7 | Experts improve governance (pos, strong) — technocratic delegation. |
| cultural-plasticity | 0.2 | Culture somewhat malleable (pos) — institutions can reshape. |
| coordination-optimism | 0.4 | Voluntary coordination usually robust (pos). |
| centralization-preference | 0.2 | Mild centralization (pos) — supra-national rule-making. |
| reform-vs-revolution | -0.4 | Change through institutions (neg). |
| gradualism-vs-immediatism | -0.2 | Gradual (neg) — managed transition. |
| state-action-vs-exit | -0.1 | Mild exit preference (neg) — privatization over provision. |
| electoralism-vs-direct-action | 0.6 | Electoral channels (pos). |
| compromise-vs-persistence | 0.5 | Compromise worthwhile (pos). |
| coercion-strategy | -0.6 | Peaceful (neg) — market discipline, not force. |
| regulation-vs-deregulation | -0.6 | Remove rules (neg) — deregulate. |
| redistribution-vs-predistribution | -0.5 | Alter rules before distribution (neg) — predistribution via market access. |
| militarism-pacifism | 0.1 | Force occasionally legitimate (pos, mild) — liberal order enforcement. |
| secularism-religious | -0.4 | Institutions neutral (neg). |

---

## ordoliberalism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.2 | Central authority mildly legitimate (pos) — needed to police competition. |
| property-legitimacy | 0.6 | Private property strongly legitimate (pos). |
| liberty-noninterference | 0.3 | Non-interference positive (pos) — within rule framework. |
| equality-theory | 0.1 | Formal equality nearly neutral (pos, mild) — fair competition baseline. |
| political-community-boundary | 0.4 | Obligations somewhat universal (pos). |
| moral-traditionalism | 0 | Neutral — cultural stance incidental. |
| anti-domination | 0.1 | Mild anti-domination (pos) — anti-cartel. |
| human-nature-priority | -0.2 | Human use priority (neg). |
| market-process-confidence | 0.7 | Markets coordinate well (pos). |
| state-capacity-confidence | 0.5 | States can execute complex policy (pos) — enforce competition. |
| public-choice-skepticism | 0.3 | Officials somewhat captured (pos) — demand-rule discipline to counter. |
| democratic-confidence | 0.4 | Voters sometimes sound (pos). |
| expert-confidence | 0.4 | Experts improve governance (pos) — judicial/admin expertise. |
| cultural-plasticity | 0 | Neutral. |
| coordination-optimism | 0.1 | Mild voluntary coordination (pos) — but with rules. |
| centralization-preference | 0.1 | Mild centralization (pos) — rule-setting authority. |
| reform-vs-revolution | -0.5 | Change through institutions (neg) — constitutional reform. |
| gradualism-vs-immediatism | -0.3 | Gradual (neg). |
| state-action-vs-exit | 0.1 | Mild state action (pos) — framework provision. |
| electoralism-vs-direct-action | 0.5 | Electoral channels (pos). |
| compromise-vs-persistence | 0.4 | Compromise worthwhile (pos). |
| coercion-strategy | -0.6 | Peaceful (neg) — rules not force. |
| regulation-vs-deregulation | 0.5 | Add rules (pos) — pro-regulatory to police competition. |
| redistribution-vs-predistribution | -0.2 | Alter rules before distribution (neg, mild) — predistribution via fair rules. |
| militarism-pacifism | -0.1 | Force rarely legitimate (neg, mild). |
| secularism-religious | -0.2 | Institutions neutral (neg). |

---

## social-liberalism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.1 | Central authority mildly legitimate (pos) — to secure opportunity. |
| property-legitimacy | 0.3 | Private property mildly legitimate (pos) — bounded by social claims. |
| liberty-noninterference | 0.4 | Non-interference positive (pos) — positive liberty supplement. |
| equality-theory | 0.5 | Substantive equality primary (pos) — fair life chances. |
| political-community-boundary | 0.5 | Obligations somewhat universal (pos). |
| moral-traditionalism | -0.1 | Pluralism mildly appropriate (neg). |
| anti-domination | 0.3 | Unaccountable power mild suspect (pos). |
| human-nature-priority | 0.1 | Mild ecocentric (pos) — sustainability concern. |
| market-process-confidence | 0.5 | Markets coordinate fairly well (pos) — but need welfare scaffold. |
| state-capacity-confidence | 0.4 | States can execute policy (pos) — provision of opportunity. |
| public-choice-skepticism | 0 | Neutral — captures but mitigable. |
| democratic-confidence | 0.6 | Voters deliberate reasonably (pos) — majoritarian provision. |
| expert-confidence | 0.3 | Experts somewhat improve (pos). |
| cultural-plasticity | 0.2 | Culture somewhat malleable (pos). |
| coordination-optimism | 0.2 | Mild voluntary coordination (pos). |
| centralization-preference | 0.1 | Mild centralization (pos). |
| reform-vs-revolution | -0.6 | Change through institutions (neg) — progressive reform. |
| gradualism-vs-immediatism | -0.3 | Gradual (neg). |
| state-action-vs-exit | 0.3 | State action (pos) — basic welfare provision. |
| electoralism-vs-direct-action | 0.6 | Electoral channels (pos). |
| compromise-vs-persistence | 0.6 | Compromise worthwhile (pos, strong) — progressive incrementalism. |
| coercion-strategy | -0.6 | Peaceful (neg). |
| regulation-vs-deregulation | -0.2 | Remove rules mildly (neg) — markets but with safety nets. |
| redistribution-vs-predistribution | 0.5 | Redistribute after market outcomes (pos) — transfers. |
| militarism-pacifism | -0.2 | Force rarely legitimate (neg). |
| secularism-religious | -0.2 | Institutions neutral (neg). |

---

## conservative-liberalism (aliases: Liberal Conservatism)

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.2 | Central authority mildly legitimate (pos) — settled institutions. |
| property-legitimacy | 0.7 | Private property strongly legitimate (pos). |
| liberty-noninterference | 0.4 | Non-interference positive (pos). |
| equality-theory | -0.3 | Formal equality acceptable (neg). |
| political-community-boundary | 0.2 | Mild universal obligations (pos). |
| moral-traditionalism | 0.4 | Traditional moral order upheld (pos) — family/cultural continuity. |
| anti-domination | -0.2 | Mild hierarchy acceptance (neg) — settled institutions. |
| human-nature-priority | -0.2 | Human use priority (neg). |
| market-process-confidence | 0.7 | Markets coordinate well (pos). |
| state-capacity-confidence | 0.2 | States somewhat capable (pos, mild). |
| public-choice-skepticism | 0.4 | Officials somewhat captured (pos). |
| democratic-confidence | 0.3 | Voters sometimes sound (pos). |
| expert-confidence | 0.1 | Mild expert trust (pos). |
| cultural-plasticity | -0.3 | Culture path-dependent (neg) — conserve tradition. |
| coordination-optimism | 0.3 | Mild voluntary coordination (pos). |
| centralization-preference | -0.2 | Mild decentralization (neg). |
| reform-vs-revolution | -0.7 | Change through institutions (neg, strong) — Burkean gradualism. |
| gradualism-vs-immediatism | -0.3 | Gradual (neg). |
| state-action-vs-exit | -0.1 | Mild exit (neg) — private/civil over state provision. |
| electoralism-vs-direct-action | 0.5 | Electoral channels (pos). |
| compromise-vs-persistence | 0.4 | Compromise worthwhile (pos). |
| coercion-strategy | -0.5 | Peaceful (neg). |
| regulation-vs-deregulation | -0.6 | Remove rules (neg) — market-friendly. |
| redistribution-vs-predistribution | -0.4 | Alter rules before distribution (neg) — predistribution. |
| militarism-pacifism | 0.1 | Force occasionally legitimate (pos, mild) — strong defense. |
| secularism-religious | 0.1 | Mild religious public order (pos) — deferent to established faiths. |

---

## communitarianism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.1 | Central authority mildly legitimate (pos) — civic community authority. |
| property-legitimacy | 0.1 | Near neutral — neither private nor collective extremes. |
| liberty-noninterference | -0.2 | Liberty bounded by collective constraint (neg) — common goods. |
| equality-theory | 0.3 | Substantive equality somewhat (pos) — social bases of self-respect. |
| political-community-boundary | 0.4 | Obligations somewhat universal (pos) — community extends via civic bonds. |
| moral-traditionalism | 0.2 | Traditional order mild (pos) — community continuity. |
| anti-domination | 0.4 | Unaccountable power suspect (pos) — civic check. |
| human-nature-priority | 0 | Neutral. |
| market-process-confidence | 0.1 | Mild market trust (pos). |
| state-capacity-confidence | 0.2 | Mild state capacity (pos). |
| public-choice-skepticism | -0.2 | Officials reliably public-regarding (neg) — civic trust. |
| democratic-confidence | 0.6 | Voters deliberate reasonably (pos) — civic participation. |
| expert-confidence | 0 | Neutral. |
| cultural-plasticity | -0.1 | Culture path-dependent (neg, mild) — tradition matters. |
| coordination-optimism | 0.1 | Mild voluntary coordination (pos). |
| centralization-preference | 0 | Neutral — neither statist nor laissez-faire. |
| reform-vs-revolution | -0.6 | Change through institutions (neg). |
| gradualism-vs-immediatism | -0.2 | Gradual (neg). |
| state-action-vs-exit | 0.3 | State action (pos) — civic community provision. |
| electoralism-vs-direct-action | 0.5 | Electoral channels (pos). |
| compromise-vs-persistence | 0.4 | Compromise worthwhile (pos). |
| coercion-strategy | -0.5 | Peaceful (neg). |
| regulation-vs-deregulation | 0.1 | Mild rules (pos). |
| redistribution-vs-predistribution | 0.2 | Mild redistribution (pos). |
| militarism-pacifism | -0.2 | Force rarely legitimate (neg). |
| secularism-religious | 0 | Neutral — neither secularist nor confessional. |

---

## republicanism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.3 | State authority requires justification (neg) — anti-arbitrary power. |
| property-legitimacy | 0.2 | Mild private property (pos). |
| liberty-noninterference | 0.3 | Non-interference positive (pos) — but as non-domination. |
| equality-theory | 0.2 | Mild substantive equality (pos) — civic standing, not material. |
| political-community-boundary | -0.2 | Obligations to own community mild (neg) — bounded civic community. |
| moral-traditionalism | 0.2 | Mild traditional order (pos) — civic virtue. |
| anti-domination | 0.6 | Unaccountable power suspect (pos) — non-domination master. |
| human-nature-priority | -0.1 | Human use priority (neg, mild). |
| market-process-confidence | 0.2 | Mild market trust (pos). |
| state-capacity-confidence | 0.3 | States somewhat capable (pos). |
| public-choice-skepticism | 0.2 | Officials somewhat captured (pos, mild). |
| democratic-confidence | 0.7 | Voters deliberate well (pos, strong) — civic self-rule. |
| expert-confidence | 0.1 | Mild expert trust (pos). |
| cultural-plasticity | 0.2 | Culture somewhat malleable (pos) — civic character. |
| coordination-optimism | 0.1 | Mild voluntary coordination (pos). |
| centralization-preference | -0.1 | Mild decentralization (neg) — mixed institutions. |
| reform-vs-revolution | -0.5 | Change through institutions (neg) — civic reform. |
| gradualism-vs-immediatism | -0.2 | Gradual (neg). |
| state-action-vs-exit | 0.2 | Mild state action (pos) — civic provision. |
| electoralism-vs-direct-action | 0.5 | Electoral channels (pos). |
| compromise-vs-persistence | 0.5 | Compromise worthwhile (pos) — civic deliberation. |
| coercion-strategy | -0.4 | Peaceful (neg). |
| regulation-vs-deregulation | 0.1 | Mild rules (pos). |
| redistribution-vs-predistribution | -0.3 | Alter rules before distribution (neg) — predistribution via civic structure. |
| militarism-pacifism | -0.1 | Force rarely legitimate (neg, mild). |
| secularism-religious | -0.2 | Institutions neutral (neg). |

---

## distributism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.1 | Mild central authority (pos) — but subsidiarity limits it. |
| property-legitimacy | -0.2 | Collective claims stronger than private title (neg) — anti-corporate ownership. |
| liberty-noninterference | 0.2 | Non-interference mild (pos) — small ownership freedom. |
| equality-theory | 0.3 | Substantive equality somewhat (pos) — widespread ownership. |
| political-community-boundary | -0.2 | Obligations to own community (neg) — local, bounded. |
| moral-traditionalism | 0.6 | Traditional moral order (pos, strong) — Catholic social teaching. |
| anti-domination | 0.2 | Unaccountable power mild suspect (pos) — anti-corporate domination. |
| human-nature-priority | 0.1 | Mild ecocentric (pos) — stewardship. |
| market-process-confidence | 0.1 | Mild market trust (pos) — limited. |
| state-capacity-confidence | 0.1 | Mild state capacity (pos). |
| public-choice-skepticism | 0.2 | Officials somewhat captured (pos). |
| democratic-confidence | 0.4 | Voters sometimes sound (pos). |
| expert-confidence | -0.1 | Experts tend to detach (neg, mild) — local knowledge preferred. |
| cultural-plasticity | -0.4 | Culture path-dependent (neg) — tradition. |
| coordination-optimism | 0.2 | Voluntary coordination (pos) — guild/cooperative. |
| centralization-preference | -0.4 | Decentralize (neg) — subsidiarity. |
| reform-vs-revolution | -0.6 | Change through institutions (neg). |
| gradualism-vs-immediatism | -0.3 | Gradual (neg). |
| state-action-vs-exit | -0.1 | Mild exit (neg) — local/private provision. |
| electoralism-vs-direct-action | 0.4 | Electoral channels (pos, mild). |
| compromise-vs-persistence | 0.3 | Compromise somewhat worthwhile (pos). |
| coercion-strategy | -0.5 | Peaceful (neg). |
| regulation-vs-deregulation | 0.2 | Mild rules (pos) — regulate anti-concentration. |
| redistribution-vs-predistribution | -0.3 | Alter rules before distribution (neg) — predistribution of ownership. |
| militarism-pacifism | -0.3 | Force rarely legitimate (neg). |
| secularism-religious | 0.2 | Mild religious public order (pos) — Catholic framework. |

---

## libertarian-socialism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.6 | State authority requires justification (neg, strong) — anti-state-socialist. |
| property-legitimacy | -0.5 | Collective claims stronger than private title (neg) — anti-capitalist. |
| liberty-noninterference | 0.5 | Non-interference positive (pos) — but worker self-management. |
| equality-theory | 0.7 | Substantive equality primary (pos) — but distributive not vanguardist. |
| political-community-boundary | 0.4 | Obligations somewhat universal (pos). |
| moral-traditionalism | -0.3 | Pluralism appropriate (neg). |
| anti-domination | 0.8 | Unaccountable power suspect (pos, strong) — anti-hierarchy master. |
| human-nature-priority | 0.2 | Mild ecocentric (pos). |
| market-process-confidence | -0.1 | Mild market skepticism (neg). |
| state-capacity-confidence | -0.2 | States often fail (neg). |
| public-choice-skepticism | 0.3 | Officials somewhat captured (pos). |
| democratic-confidence | 0.5 | Voters sometimes sound (pos). |
| expert-confidence | -0.1 | Experts tend to detach (neg, mild). |
| cultural-plasticity | 0.3 | Culture malleable (pos). |
| coordination-optimism | 0.4 | Voluntary coordination (pos) — federated. |
| centralization-preference | -0.4 | Decentralize (neg) — federated councils. |
| reform-vs-revolution | -0.2 | Change through institutions (neg, mild) — broader than revolutionary. |
| gradualism-vs-immediatism | -0.1 | Gradual (neg, mild). |
| state-action-vs-exit | -0.2 | Mild exit (neg) — counter-institutional. |
| electoralism-vs-direct-action | -0.1 | Near neutral — mixed tactics. |
| compromise-vs-persistence | 0.2 | Compromise somewhat (pos). |
| coercion-strategy | -0.5 | Peaceful (neg). |
| regulation-vs-deregulation | -0.2 | Remove rules mildly (neg). |
| redistribution-vs-predistribution | 0.3 | Mild redistribution (pos). |
| militarism-pacifism | -0.4 | Force rarely legitimate (neg). |
| secularism-religious | -0.4 | Institutions neutral (neg). |

---

## deep-ecology

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.4 | State authority requires justification (neg). |
| property-legitimacy | -0.3 | Collective claims stronger than private title (neg). |
| liberty-noninterference | 0.1 | Near neutral (pos, mild). |
| equality-theory | 0.4 | Substantive equality mildly primary (pos) — but secondary to nature. |
| political-community-boundary | 0.1 | Near universal (pos, mild). |
| moral-traditionalism | -0.2 | Pluralism appropriate (neg). |
| anti-domination | 0.5 | Unaccountable power suspect (pos) — including domination of nature. |
| human-nature-priority | 0.95 | Natural world intrinsic standing (pos, near-max) — the central axiom. |
| market-process-confidence | -0.6 | Markets misallocate (neg) — growth economy harmful. |
| state-capacity-confidence | -0.2 | States often fail (neg). |
| public-choice-skepticism | 0.3 | Officials somewhat captured (pos). |
| democratic-confidence | 0.3 | Voters sometimes sound (pos). |
| expert-confidence | -0.4 | Experts tend to cartelize (neg) — distrust technocratic fixes. |
| cultural-plasticity | -0.3 | Culture path-dependent (neg) — respect ecological limits. |
| coordination-optimism | 0.2 | Mild voluntary coordination (pos) — bioregional. |
| centralization-preference | -0.4 | Decentralize (neg). |
| reform-vs-revolution | 0.4 | Existing institutions should be ruptured (pos) — civilizational shift. |
| gradualism-vs-immediatism | 0.3 | Implement immediately (pos) — ecological urgency. |
| state-action-vs-exit | -0.1 | Mild exit (neg). |
| electoralism-vs-direct-action | -0.3 | Direct action (neg) — direct ecological politics. |
| compromise-vs-persistence | -0.3 | Hold commitments firm (neg). |
| coercion-strategy | -0.3 | Mostly peaceful (neg, mild) — direct action can be assertive. |
| regulation-vs-deregulation | 0.4 | Add rules (pos) — ecological regulation. |
| redistribution-vs-predistribution | 0.2 | Mild redistribution (pos). |
| militarism-pacifism | -0.6 | Force rarely legitimate (neg, strong). |
| secularism-religious | -0.3 | Institutions neutral (neg). |

---

## paleolibertarianism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.5 | State authority requires justification (neg) — anti-state. |
| property-legitimacy | 0.7 | Private property strongly legitimate (pos). |
| liberty-noninterference | 0.8 | Non-interference (pos, strong). |
| equality-theory | -0.4 | Formal equality acceptable (neg). |
| political-community-boundary | -0.1 | Mild own-community obligations (neg) — traditional communities. |
| moral-traditionalism | 0.5 | Traditional moral order (pos) — cultural/social conservatism. |
| anti-domination | 0.3 | Unaccountable power mild suspect (pos) — but accept voluntary hierarchy. |
| human-nature-priority | -0.2 | Human use priority (neg). |
| market-process-confidence | 0.8 | Markets coordinate well (pos, strong). |
| state-capacity-confidence | -0.5 | States fail complex tasks (neg). |
| public-choice-skepticism | 0.7 | Officials captured (pos). |
| democratic-confidence | -0.2 | Voters manipulable (neg). |
| expert-confidence | -0.3 | Experts detach (neg). |
| cultural-plasticity | -0.3 | Culture path-dependent (neg). |
| coordination-optimism | 0.5 | Voluntary coordination robust (pos). |
| centralization-preference | -0.6 | Decentralize (neg, strong). |
| reform-vs-revolution | -0.3 | Change through institutions (neg, mild). |
| gradualism-vs-immediatism | -0.1 | Gradual (neg, mild). |
| state-action-vs-exit | -0.7 | Exit over state action (neg, strong). |
| electoralism-vs-direct-action | 0.1 | Mild electoral channels (pos) — noninterventionist politics. |
| compromise-vs-persistence | -0.2 | Hold commitments firm (neg, mild). |
| coercion-strategy | -0.5 | Peaceful (neg). |
| regulation-vs-deregulation | -0.7 | Remove rules (neg, strong). |
| redistribution-vs-predistribution | -0.7 | Alter rules before distribution (neg, strong) — but here = predistribution via property. |
| militarism-pacifism | 0.1 | Force occasionally legitimate (pos, mild) — conservative defense. |
| secularism-religious | 0.2 | Mild religious public order (pos) — cultural conservatism. |

---

## objectivism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | -0.5 | State authority requires justification (neg) — minimal night-watchman. |
| property-legitimacy | 0.95 | Private property near-max (pos) — absolute productive achievement. |
| liberty-noninterference | 0.95 | Non-interference near-max (pos) — absolute liberty. |
| equality-theory | -0.7 | Formal equality acceptable (neg, strong) — anti-egalitarian. |
| political-community-boundary | 0.4 | Obligations somewhat universal (pos) — individual rights global. |
| moral-traditionalism | -0.3 | Pluralism appropriate (neg) — reason not tradition. |
| anti-domination | -0.1 | Near neutral (neg, mild) — voluntary hierarchy accepted. |
| human-nature-priority | -0.3 | Human use priority (neg). |
| market-process-confidence | 0.9 | Markets coordinate well (pos, near-max) — laissez-faire. |
| state-capacity-confidence | -0.5 | States fail (neg). |
| public-choice-skepticism | 0.7 | Officials captured (pos). |
| democratic-confidence | -0.2 | Voters manipulable (neg). |
| expert-confidence | 0.3 | Experts somewhat improve (pos) — productive reason. |
| cultural-plasticity | 0.2 | Culture malleable (pos, mild). |
| coordination-optimism | 0.6 | Voluntary coordination robust (pos). |
| centralization-preference | -0.5 | Decentralize (neg). |
| reform-vs-revolution | -0.1 | Near neutral (neg, mild). |
| gradualism-vs-immediatism | 0.2 | Moderate speed (pos, mild) — principled not rushed. |
| state-action-vs-exit | -0.7 | Exit (neg, strong). |
| electoralism-vs-direct-action | 0.3 | Electoral channels (pos, mild). |
| compromise-vs-persistence | -0.6 | Hold commitments firm (neg, strong) — no compromise with evil. |
| coercion-strategy | -0.5 | Peaceful (neg) — reject initiatory force. |
| regulation-vs-deregulation | -0.95 | Remove rules (neg, near-max) — pure laissez-faire. |
| redistribution-vs-predistribution | -0.85 | Predistribution (neg, strong) — property over transfers. |
| militarism-pacifism | 0.3 | Force occasionally legitimate (pos) — self-defense. |
| secularism-religious | -0.5 | Institutions neutral (neg) — rationalist anti-faith. |

---

## transhumanism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.2 | Central authority mildly legitimate (pos) — to govern enhancement. |
| property-legitimacy | 0.2 | Mild private property (pos). |
| liberty-noninterference | 0.2 | Mild non-interference (pos) — enhancement freedom. |
| equality-theory | 0.3 | Substantive equality mildly (pos) — access to enhancement. |
| political-community-boundary | 0.5 | Obligations somewhat universal (pos). |
| moral-traditionalism | -0.4 | Pluralism appropriate (neg) — reject natural limits. |
| anti-domination | 0.2 | Unaccountable power mild suspect (pos). |
| human-nature-priority | -0.6 | Human use of nature priority (neg, strong) — reshape nature. |
| market-process-confidence | 0.5 | Markets coordinate fairly (pos). |
| state-capacity-confidence | 0.6 | States can execute (pos) — capability needed for grand enhancement. |
| public-choice-skepticism | -0.1 | Mild public-regarding (neg). |
| democratic-confidence | 0.3 | Voters sometimes sound (pos). |
| expert-confidence | 0.8 | Experts improve governance (pos, strong) — technocracy core. |
| cultural-plasticity | 0.7 | Culture malleable (pos, strong) — reshape humanity. |
| coordination-optimism | 0.1 | Mild voluntary coordination (pos). |
| centralization-preference | 0.2 | Mild centralization (pos). |
| reform-vs-revolution | -0.1 | Near neutral (neg, mild). |
| gradualism-vs-immediatism | 0.3 | Implement immediately (pos) — accelerate. |
| state-action-vs-exit | 0.4 | State action (pos) — provision of enhancement. |
| electoralism-vs-direct-action | 0.4 | Electoral channels (pos, mild). |
| compromise-vs-persistence | 0.3 | Compromise somewhat (pos). |
| coercion-strategy | -0.3 | Mostly peaceful (neg, mild) — but assertive. |
| regulation-vs-deregulation | 0.1 | Mild rules (pos). |
| redistribution-vs-predistribution | 0 | Neutral. |
| militarism-pacifism | 0.1 | Force mildly legitimate (pos) — techno-industrial. |
| secularism-religious | -0.4 | Institutions neutral (neg) — rationalist. |

---

## welfare-chauvinism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.5 | Central authority legitimate (pos) — to enforce boundaries and welfare. |
| property-legitimacy | 0.1 | Near neutral (pos, mild). |
| liberty-noninterference | -0.3 | Liberty bounded by collective constraint (neg). |
| equality-theory | -0.3 | Formal equality acceptable (neg) — in-group above universal equality. |
| political-community-boundary | -0.7 | Obligations to own nation (neg, strong) — bounded welfare. |
| moral-traditionalism | 0.6 | Traditional order (pos, strong). |
| anti-domination | -0.4 | Hierarchy acceptance (neg, mild). |
| human-nature-priority | -0.2 | Human use priority (neg). |
| market-process-confidence | 0.1 | Mild market trust (pos). |
| state-capacity-confidence | 0.4 | States can execute (pos) — welfare administration. |
| public-choice-skepticism | -0.2 | Officials public-regarding (neg) — trust state for in-group. |
| democratic-confidence | 0.3 | Voters sometimes sound (pos). |
| expert-confidence | 0 | Neutral. |
| cultural-plasticity | -0.5 | Culture path-dependent (neg) — national culture. |
| coordination-optimism | -0.2 | Coercive coordination needed (neg). |
| centralization-preference | 0.4 | Centralize (pos) — welfare and border. |
| reform-vs-revolution | -0.3 | Change through institutions (neg, mild). |
| gradualism-vs-immediatism | -0.1 | Gradual (neg, mild). |
| state-action-vs-exit | 0.6 | State action (pos, strong) — welfare provision. |
| electoralism-vs-direct-action | 0.4 | Electoral channels (pos, mild). |
| compromise-vs-persistence | -0.2 | Hold commitments (neg, mild). |
| coercion-strategy | 0.1 | Force mildly acceptable (pos, mild) — border enforcement. |
| regulation-vs-deregulation | 0.4 | Add rules (pos) — welfare regulation. |
| redistribution-vs-predistribution | 0.6 | Redistribution after market outcomes (pos, strong) — transfers. |
| militarism-pacifism | 0.4 | Force legitimate tool (pos) — strong borders. |
| secularism-religious | 0.3 | Religious public order mild (pos) — deferent to majority faith. |

---

## right-wing-populism

| axis | value | rationale |
|---|---|---|
| authority-legitimacy | 0.5 | Central authority legitimate (pos) — strongman leadership. |
| property-legitimacy | 0.2 | Mild private property (pos). |
 | liberty-noninterference | 0.3 | Personal liberty protected (pos) — populist freedom from elite control; less collective-bounded than ethnonationalist. |
| equality-theory | -0.4 | Hierarchy acceptable (neg). |
| political-community-boundary | -0.85 | Obligations to own nation (neg, near-max) — bounded people. |
| moral-traditionalism | 0.6 | Traditional order (pos, strong). |
 | anti-domination | 0.3 | Anti-domination moderate (pos) — populist suspicion of dominant elites distinguishes from hierarchy-accepting ethnonationalist. |
| human-nature-priority | -0.2 | Human use priority (neg). |
| market-process-confidence | 0.1 | Mild market trust (pos). |
| state-capacity-confidence | -0.1 | Mild state capacity skepticism (neg) — deep-state distrust. |
| public-choice-skepticism | 0.7 | Officials captured (pos, strong) — anti-elite. |
| democratic-confidence | -0.7 | Voters manipulable (neg, strong) — manipulated masses. |
| expert-confidence | -0.6 | Experts detach (neg, strong) — anti-technocrat. |
| cultural-plasticity | -0.4 | Culture path-dependent (neg). |
| coordination-optimism | -0.3 | Coercive coordination needed (neg, mild). |
| centralization-preference | 0.5 | Centralize (pos) — strongman. |
| reform-vs-revolution | 0.7 | Rupture existing institutions (pos, strong) — anti-establishment. |
| gradualism-vs-immediatism | 0.4 | Implement immediately (pos) — urgency. |
| state-action-vs-exit | 0.3 | Mild state action (pos) — state for the people. |
| electoralism-vs-direct-action | -0.4 | Direct action (neg) — extra-institutional mobilization. |
| compromise-vs-persistence | -0.5 | Hold commitments firm (neg). |
| coercion-strategy | 0.5 | Coercive strategies acceptable (pos) — street tactics. |
| regulation-vs-deregulation | 0.2 | Mild rules (pos) — protect national economy. |
| redistribution-vs-predistribution | -0.2 | Alter rules before distribution (neg, mild) — predistribution via native preference. |
| militarism-pacifism | 0.4 | Force legitimate (pos) — strong national identity. |
| secularism-religious | 0.3 | Religious public order mild (pos) — traditional faith. |

---

## Documented near-ties

One genuine near-tie remains (per the authoring rubric, conservative-on-conflict):

- **market-liberal ↔ classical-liberalism** (margin 0.006). Both occupy the constitutional civil-libertarian liberal cluster; the base bank heavily probes market-process-confidence, on which they agree in sign. Documented at `NEAR_TIE_EXCEPTIONS['market-liberal'] = { tiesWith: 'classical-liberalism', maxMargin: 0.01 }`.

Additionally, **minarchist**'s existing near-tie (with `civil-libertarian-cosmopolitan`) was extended to include `classical-liberalism`, since the new classical-liberalism centroid pulls minarchist's fixture toward the civil-libertarian cluster. All other existing near-ties continue to hold at their documented margins.