import type { Layer } from "../../types";

export const summaryCompletionPart01: Readonly<
  Record<string, Partial<Record<Layer, string>>>
> = {
  "revolutionary-collectivist": {
    normative:
      "Treats collective equality, social ownership, and a decisive break with entrenched class power as more legitimate than preserving existing property relations, while historical currents disagree over party rule and political pluralism.",
  },
  "anarcho-capitalist": {
    normative:
      "Treats self-ownership and voluntary association, strong private property rights, voluntary exchange, and the non-aggression principle as central, rejecting a compulsory state as morally unnecessary or illegitimate.",
  },
  "marxist-leninist": {
    normative:
      "Treats class emancipation, social ownership, and disciplined revolutionary organization as legitimate grounds for concentrating transitional political power, while its historical realization raises serious disputes about pluralism and coercion.",
  },
  "council-communist": {
    normative:
      "Treats workers’ self-emancipation and direct collective control of production and political decisions as more legitimate than capitalist ownership or a separate vanguard bureaucracy.",
    prescriptive:
      "Favors workers’ councils, recallable delegates, and federated direct control of workplaces and public decisions rather than parliamentary government or a permanent vanguard party.",
  },
  syndicalist: {
    normative:
      "Treats worker solidarity, collective self-management, and freedom from both capitalist and bureaucratic domination as central political goods, with autonomous labor organization carrying legitimate authority.",
    prescriptive:
      "Favors autonomous unions, strikes, direct action, and federated worker organization as the route to social transformation and as a possible institutional basis for workers’ control afterward.",
  },
  "anarcho-communist": {
    normative:
      "Treats common access according to need, mutual aid, equality, and the abolition of imposed political and economic hierarchy as central goods rather than treating private accumulation or state command as legitimate foundations.",
  },
  agorist: {
    normative:
      "Treats voluntary exchange, individual autonomy, and resistance to compulsory state authority as important, while agorist writers differ over how to judge property, exclusion, and forms of counter-economic exchange.",
    prescriptive:
      "Favors building counter-economic networks, mutual exchange, and parallel institutions outside licensing and taxation as a strategy for reducing dependence on and legitimacy of the state.",
  },
  ecosocialist: {
    normative:
      "Treats ecological integrity and social equality as connected goods, arguing that neither human domination of nature nor class domination should define a legitimate political economy.",
  },
  "degrowth-green": {
    normative:
      "Treats sufficiency, ecological limits, social justice, and human flourishing as preferable to indefinite aggregate production growth, while leaving the desirable level and institutional form of reduction contested.",
    prescriptive:
      "Favors democratically planned reductions in resource and energy throughput where needed, redistribution and universal provision, shorter working time, and well-being measures rather than treating GDP growth as the overriding goal.",
  },
  "absolute-monarchist": {
    normative:
      "Treats indivisible hereditary sovereignty, dynastic continuity, and political unity as legitimate grounds for a ruler’s authority, generally giving the monarch stronger standing than elected or divided institutions.",
    prescriptive:
      "Favors concentrating final executive and legislative authority in a hereditary monarch, subject to whatever religious, customary, or legal limits a particular absolutist theory retains; it is stronger than constitutional monarchy.",
  },
  neoreactionary: {
    normative:
      "Treats hierarchy, order, unequal authority, and exit from democratic mass politics as more defensible than egalitarian popular sovereignty, with different writers grounding that preference in property, competence, tradition, or civilizational arguments.",
    prescriptive:
      "Favors replacing or sharply reducing electoral democracy through highly centralized proprietary, monarchical, or corporate forms of rule and strong exit rights; this is a contested family of proposals rather than one implemented regime.",
  },
  ordoliberalism: {
    normative:
      "Treats a legally constituted competitive order, rule-bound public authority, and protection against private concentrations of power as compatible with liberty and social stability rather than equating freedom with an unregulated market.",
    prescriptive:
      "Favors a strong but rule-bound state that sets competition law, monetary and legal conditions, and limited social safeguards so markets remain competitive; it does not require laissez-faire or state ownership.",
  },
  distributism: {
    normative:
      "Treats widely dispersed productive property, family and community independence, subsidiarity, and human-scale economic participation as preferable to both concentrated private capital and comprehensive state ownership.",
    prescriptive:
      "Favors dispersing productive property through cooperatives, small property, local production, anti-monopoly rules, and supportive credit, while allowing distributists to differ over markets, welfare, and regulation.",
  },
  "libertarian-socialism": {
    normative:
      "Treats freedom from both capitalist dependence and centralized political domination as requiring collective or worker control, voluntary association, and democratic self-management rather than isolated individual exit alone.",
  },
  paleolibertarianism: {
    normative:
      "Treats private property, voluntary exchange, strong individual liberty, and skepticism toward centralized government as central goods, often combined with cultural traditionalism without making that combination universal.",
    prescriptive:
      "Favors sharply reducing state taxation and regulation, defending property and contract, and relying on private or local institutions; paleolibertarian currents vary over immigration, social norms, foreign policy, and the remaining state.",
  },
  objectivism: {
    normative:
      "Treats rational individual judgment, productive achievement, individual rights, and rational self-interest as moral foundations, rejecting altruistic demands that require sacrificing a person’s life or agency to others.",
    prescriptive:
      "Favors laissez-faire capitalism, strong individual rights, and a limited government confined chiefly to protecting against force, fraud, and rights violations; it is not identical to every pro-market or egoist position.",
  },
  "welfare-chauvinism": {
    normative:
      "Treats social benefits as obligations owed primarily or preferentially to an established national in-group, placing bounded solidarity above equal access for migrants or other out-groups.",
    prescriptive:
      "Favors restricting immigrants’ or other out-groups’ eligibility for welfare, services, or social insurance through residence, citizenship, contribution, or deservingness rules; the label concerns access boundaries, not one welfare-state size.",
  },
  participism: {
    normative:
      "Treats self-management, equitable participation, solidarity, and fair distribution of empowering and disempowering work as central goods in economic and political life.",
    prescriptive:
      "Favors worker and consumer councils, balanced job complexes, and negotiated or facilitative planning so people participate in decisions proportionate to how they are affected rather than relying only on markets or command.",
  },
  maoism: {
    normative:
      "Treats revolutionary egalitarianism, anti-imperialism, mass participation under organized leadership, and resistance to class restoration as central political goods, while historical practice involved severe coercion and disputed authority.",
  },
  trotskyism: {
    normative:
      "Treats international working-class emancipation and opposition to bureaucratic privilege as central goods, rejecting the idea that a durable socialist order can be secured through isolated national consolidation.",
  },
  panarchism: {
    normative:
      "Treats freedom of association and the ability to choose among governing arrangements as more important than requiring one territorial authority to rule everyone in a jurisdiction.",
    prescriptive:
      "Favors voluntary, nonterritorial or overlapping jurisdictions that people may join, leave, or help organize, while practical proposals must still address public goods, conflict, mobility, and unequal bargaining power.",
  },
  "guild-socialism": {
    normative:
      "Treats worker control, democratic association, and social ownership as preferable to private capital’s authority or direct bureaucratic management of production.",
  },
  "national-bolshevism": {
    normative:
      "The post-Soviet reference case treats national unity, sovereign power, and revolutionary or anti-liberal transformation as compatible political goods, often subordinating liberal pluralism and universalist class politics to a bounded national project; other historical uses differ.",
    prescriptive:
      "The post-Soviet reference case favors an authoritarian national state using centralized power and anti-capitalist or socialist rhetoric to pursue sovereignty and social mobilization; historical currents differ and the label is not orthodox Marxism-Leninism.",
  },
  paleoconservatism: {
    normative:
      "Treats national sovereignty, inherited culture, local community, constitutional tradition, and social continuity as important political goods, often resisting cosmopolitan or supranational authority.",
  },
  "one-nation-conservatism": {
    normative:
      "Treats social cohesion, reciprocal duties across classes, national community, and responsible stewardship by established institutions as legitimate conservative goods rather than viewing laissez-faire or egalitarian leveling as the only alternatives.",
  },
  "national-socialism": {
    prescriptive:
      "Favors a one-party racial dictatorship, exclusionary and genocidal state power, militarized expansion, and coercive mass mobilization; the movement’s anti-capitalist rhetoric does not make its program socialist in the ordinary ownership or egalitarian sense.",
  },
  "christian-socialism": {
    normative:
      "Treats Christian solidarity, human dignity, economic justice, and obligations to poor and working people as reasons to challenge exploitative social arrangements, while Christian socialist currents differ over church authority, class, and pluralism.",
  },
  "utopian-socialism": {
    normative:
      "Treats cooperation, equality, shared provision, and morally reformed social relations as achievable through consciously designed communities rather than accepting competitive property relations as inevitable.",
  },
  "libertarian-municipalism": {
    normative:
      "Treats direct local self-government, civic participation, ecological responsibility, and freedom from centralized domination as mutually reinforcing political goods.",
  },
  "bleeding-heart-libertarianism": {
    prescriptive:
      "Favors market institutions and civil liberties together with reforms that address poverty, exclusion, or unequal starting points, such as a social minimum or access-enhancing policies; proposals differ over coercion and redistribution.",
  },
  "christian-reconstructionism": {
    normative:
      "Treats biblical authority and a divinely ordered social hierarchy as the basis of legitimate public morality, rejecting the idea that liberal secular neutrality should be the final standard for law.",
  },
  regionalism: {
    normative:
      "Treats regional identity, place-based self-government, and the ability of communities to shape policy close to their social and ecological circumstances as important goods, without requiring independence.",
    prescriptive:
      "Favors regional autonomy, federal or devolved institutions, cultural and economic self-government, or in some cases independence, while the label does not decide how authority should be shared with the wider state.",
  },
  "market-liberal": {
    normative:
      "Treats private property, individual liberty, legal equality, voluntary exchange, and market coordination as important sources of liberty and prosperity while accepting an enabling constitutional state.",
    descriptive:
      "Expects competitive markets and rule-governed economic institutions to coordinate dispersed knowledge and support prosperity, while recognizing public-goods, monopoly, and social-insurance problems.",
    prescriptive:
      "Favors competitive markets, secure private property, private enterprise, trade, public goods, macroeconomic stability, and a limited safety net without requiring laissez-faire or minimal government.",
  },
  nationalism: {
    normative:
      "Treats the nation as a valuable community entitled to some combination of continuity, solidarity, sovereignty, priority, or self-government without fixing membership or economic policy.",
    descriptive:
      "Expects shared national identification and political sovereignty to shape solidarity and legitimacy, while forms differ over civic membership, ethnicity, religion, territory, and international order.",
    prescriptive:
      "Favors institutions that protect national self-government or continuity; territorial and membership projects must be measured separately.",
  },
  populism: {
    normative:
      "Treats a morally unified people and popular sovereignty as especially authoritative against an elite understood as corrupt or self-serving, while leaving pluralism and host ideology open.",
    descriptive:
      "Expects political conflict to reflect a people-versus-elite antagonism, but anti-pluralism, leadership style, nationalism, and economic policy are not entailed by the thin core.",
    prescriptive:
      "Favors direct appeals to the people, anti-elite accountability, and popular control; left/right content and institutional safeguards depend on host commitments.",
  },
  "civil-libertarianism": {
    normative:
      "Treats speech, privacy, association, conscience, due process, protest, and bodily autonomy as strong rights against arbitrary public or private coercion.",
    descriptive:
      "Expects concentrated authority and unchecked surveillance or policing to threaten personal freedom, while rights protections and independent courts can constrain domination.",
    prescriptive:
      "Favors rights safeguards, due process, privacy, free expression, association, and limits on coercive intrusion without deciding economic policy or global membership.",
  },
  cosmopolitanism: {
    normative:
      "Treats equal moral concern across national boundaries as politically important while allowing local attachment and democratic institutional disagreement.",
    descriptive:
      "Expects cross-border interdependence and shared human vulnerability to generate duties that exceed national membership alone.",
    prescriptive:
      "Favors transnational rights, cooperation, mobility, or institutions in forms compatible with differing views about borders, democracy, and world government.",
  },
  "decentralist-orientation": {
    normative:
      "Treats local self-government, polycentric authority, federalism, and exit or voice across institutions as safeguards against concentrated domination.",
    descriptive:
      "Expects dispersed decision-making to use local knowledge and improve accountability, while recognizing coordination, inequality, and capacity problems.",
    prescriptive:
      "Favors devolution, federal or municipal authority, polycentric governance, and voluntary association without specifying one economic or cultural order.",
  },
  "feminist-orientation": {
    normative:
      "Treats gendered domination, exclusion, violence, care, reproductive control, labor, and political representation as fundamental concerns of justice.",
    descriptive:
      "Expects gendered power to operate through law, culture, family, economy, sexuality, and institutions, while feminist schools disagree over causal priority and strategy.",
    prescriptive:
      "Favors reforms or transformations that expand gender justice and autonomy; the modifier does not choose liberal, radical, socialist, Black, anarchist, or queer feminism.",
  },
  "economic-nationalism": {
    normative:
      "Treats national productive capacity, economic sovereignty, domestic industry, resilience, or control of strategic assets as legitimate political priorities.",
    descriptive:
      "Expects unregulated dependence or unequal trade relations to constrain national agency, while state action can also create inefficiency, patronage, or exclusion.",
    prescriptive:
      "Favors industrial policy, strategic procurement, managed trade, supply resilience, or national control of key assets without fixing ownership or welfare policy.",
  },
  developmentalism: {
    normative:
      "Treats productive transformation, administrative capacity, infrastructure, and material development as important grounds of political legitimacy.",
    descriptive:
      "Expects coordinated state–business institutions, industrial policy, technology acquisition, and disciplined investment to accelerate structural transformation, with mixed evidence across cases.",
    prescriptive:
      "Favors capable developmental institutions and strategic coordination while leaving democratic pluralism, markets, ownership, and welfare design open.",
  },
  "pan-arabism": {
    normative:
      "Treats Arabic-speaking peoples as a wider political community entitled to solidarity, sovereignty, cultural unity, or self-determination across existing borders.",
    descriptive:
      "Expects colonial fragmentation and external dependence to constrain Arab agency, while unity and cross-border organization can generate political capacity; historical variants differ.",
    prescriptive:
      "Favors Arab solidarity, cultural and political coordination, or integration without fixing socialism, secularism, party organization, or one constitutional model.",
  },
  "arab-socialism": {
    normative:
      "Treats Arab liberation, social equality, public control of strategic resources, and developmental transformation as compatible political goods.",
    descriptive:
      "Expects colonial and class structures to obstruct national development, while state-led transformation, land reform, and public ownership can expand collective capacity; historical cases diverge.",
    prescriptive:
      "Favors Arab unity or independence, state-led development, social provision, land reform, and public control of strategic sectors without implying Leninist party-state rule.",
  },
  "radical-feminism": {
    normative:
      "Treats patriarchy and male power as fundamental structures of domination requiring more than formal equality or isolated legal reform.",
    descriptive:
      "Expects sexual, family, cultural, and reproductive institutions to reproduce gender hierarchy alongside law and economic power.",
    prescriptive:
      "Favors transforming the institutions and practices that reproduce patriarchy; radical feminist traditions differ over sexuality, gender, race, class, and political strategy.",
  },
  "black-feminism": {
    normative:
      "Treats Black women’s collective dignity, autonomy, and liberation from interlocking racial, gendered, class, and sexual domination as central political goods.",
    descriptive:
      "Expects race, gender, class, sexuality, and state power to interact rather than operate as isolated systems, while Black feminist traditions remain plural.",
    prescriptive:
      "Favors autonomous organization, coalition, institutional transformation, and political practices grounded in Black women’s lived and collective knowledge.",
  },
  "queer-politics": {
    normative:
      "Treats sexual and gender self-determination and resistance to heteronormative domination as politically important goods.",
    descriptive:
      "Expects compulsory categories, policing, medicalization, family norms, and institutional recognition to shape gender and sexual freedom.",
    prescriptive:
      "Favors queer liberation, anti-discrimination, autonomy, and sometimes transformation of policing, borders, family, or fixed identity categories; strategies vary.",
  },
  "confucian-political-revival": {
    normative:
      "Treats moral cultivation, relational obligation, public virtue, harmony, and humane government as politically relevant while leaving hierarchy, equality, rights, and democracy contested.",
    descriptive:
      "Expects modern Confucian arguments to shape debates about authority, development, merit, and democracy, with both democratic and meritocratic branches.",
    prescriptive:
      "May favor civic education, ethical leadership, meritocratic administration, or constitutional democracy; the specialist does not prescribe one regime or economic order.",
  },
  "asian-values": {
    normative:
      "Frames family, duty, social harmony, community, and order as potentially weightier public goods than individualized liberal autonomy, without settling their institutional meaning.",
    descriptive:
      "Expects Asian-values language to organize regional debates about development and democracy, but its uses are heterogeneous and often strategic.",
    prescriptive:
      "May support communitarian, developmental, or authority-centered policies; as context it is not a scored program.",
  },
};
