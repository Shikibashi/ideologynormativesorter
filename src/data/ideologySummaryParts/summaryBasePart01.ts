import type { Layer } from "../../types";

export const summaryBasePart01: Readonly<
  Record<string, Partial<Record<Layer, string>>>
> = {
  conservative: {
    normative:
      "Treats continuity, inherited institutional knowledge, social order, and practical judgment as legitimate political goods, while leaving economic and cultural policy open to different conservative traditions.",
    descriptive:
      "Expects institutions and practices formed over time to contain knowledge that abstract redesign can miss, while recognizing that inherited arrangements can also preserve injustice or require correction.",
    prescriptive:
      "Favors cautious, evidence-aware reform that preserves workable institutions, adapts rather than discards inherited arrangements, and changes pace when consequences are uncertain; it does not prescribe small government or social traditionalism.",
  },
  "green-politics": {
    normative:
      "Treats ecological integrity, environmental limits, and the conditions of nonhuman and human flourishing as politically important without fixing one theory of intrinsic value or one economic order.",
    descriptive:
      "Expects ecological harms to arise from the interaction of production, consumption, technology, institutions, and power, so green traditions disagree about growth, expertise, markets, and governance.",
    prescriptive:
      "Favors ecological protection and transition strategies whose concrete form may include regulation, public investment, degrowth, technological innovation, democratic decentralization, or market instruments; the broad label does not choose among them.",
  },
  "social-anarchism": {
    normative:
      "Treats imposed hierarchy, concentrated coercive authority, and domination as requiring strong justification, while valuing voluntary association, mutual aid, autonomy, and communal self-government.",
    descriptive:
      "Expects centralized authority and economic dependence to reproduce domination, while decentralized federations, mutual aid, and direct organization may coordinate social life; anarchist currents disagree over feasibility and institutional scale.",
    prescriptive:
      "Favors dismantling or sharply limiting imposed political hierarchy through voluntary association, direct participation, mutual aid, and federated organization, without deciding whether social ownership, mutual exchange, or another economic form is best.",
  },
  "market-right-libertarianism": {
    normative:
      "Treats individual liberty, voluntary exchange, secure property or use rights, and restraint on coercive authority as central political goods, while leaving the justification and extent of property rights contested; these commitments do not by themselves settle whether a position is right-libertarian, mutualist, or another market-anarchist current.",
    descriptive:
      "Expects decentralized market exchange and voluntary coordination to use dispersed knowledge and incentives better than extensive central direction, while variants differ over public goods, inequality, market power, and state legitimacy.",
    prescriptive:
      "Favors expanding voluntary exchange and limiting centralized political intervention, with possible commitments ranging from a minimal protective state to stateless market order, land-rent approaches, or other specialist designs.",
  },
  "marxian-socialism": {
    normative:
      "Treats class domination, private control of productive assets, and alienated labor as central injustices and values social or worker control over the conditions of production.",
    descriptive:
      "Expects capitalist ownership and class relations to shape political power, distribution, and social conflict, while non-Leninist Marxian traditions disagree about the roles of markets, planning, democracy, parties, and revolution.",
    prescriptive:
      "Favors transforming capitalist property and class relations through democratic, worker, council, syndicalist, or other socialist strategies without importing Leninist party-state organization into the broad anchor.",
  },
  "technocratic-orientation": {
    normative:
      "Treats competent inquiry, specialized knowledge, and effective administration as valuable for public decision-making, while leaving democratic equality and public contestation as separate questions rather than assuming expertise overrides them.",
    descriptive:
      "Expects complex policy problems to require domain knowledge, measurement, and administrative capacity, while recognizing that experts can disagree, embed values, reproduce exclusion, or become insulated from affected publics.",
    prescriptive:
      "Favors evidence-informed policy, professional capacity, transparent methods, review, and accountable expert advice; it does not by itself favor rule by an insulated technocratic elite or centralized authority.",
  },
  "black-nationalism": {
    normative:
      "Treats Black collective dignity, solidarity, self-determination, and protection from racial domination as politically important, while leaving the relationship among integration, community autonomy, separatism, and internationalism open to different currents.",
    descriptive:
      "Expects anti-Black racial hierarchy and linked historical experience to shape political interests and collective identity, while Black nationalist traditions differ over class, gender, territory, diaspora, and the institutional meaning of self-determination.",
    prescriptive:
      "Favors forms of Black collective organization, institutional power, cultural affirmation, self-defense, autonomy, or liberation; the label does not entail one separatist territory, racial hierarchy, or strategy.",
  },
  "pan-africanism": {
    normative:
      "Treats solidarity and political or cultural self-determination among African and African-diasporic peoples as important responses to colonialism, racism, and unequal global power, without requiring one account of identity or unity.",
    descriptive:
      "Expects colonial and racialized international structures to fragment or subordinate African peoples, while cooperation, liberation movements, diaspora networks, and continental institutions can create forms of shared agency; historical Pan-Africanism is internally and institutionally diverse.",
    prescriptive:
      "Favors cross-border solidarity, anti-colonial and anti-racist cooperation, cultural exchange, economic or political coordination, and sometimes continental political unity; it does not require Black separatism, a single federation, or one ideology of governance.",
  },
  "market-anarchism": {
    normative:
      "Treats centralized coercive authority as illegitimate or presumptively suspect while valuing voluntary exchange, autonomy, and decentralized association; it leaves the moral status of private, common, and use-based property open to variants.",
    descriptive:
      "Expects non-state markets and voluntary institutions to coordinate exchange and dispute resolution, while market-anarchist traditions disagree about exploitation, inequality, mutual credit, capitalist property, and the feasibility of competing institutions.",
    prescriptive:
      "Favors building or defending decentralized exchange, voluntary association, and non-state institutions; mutualist, agorist, left-wing market, and anarcho-capitalist strategies should not be inferred from the family label alone.",
  },
  "third-way": {
    normative:
      "Retains social-democratic concern with inclusion, equality, and social protection while treating opportunity, responsibility, and adaptive market institutions as compatible political goods.",
    descriptive:
      "Expects traditional nationalized or passive welfare arrangements to face fiscal, economic, and social pressures, while active labor-market policy, education, social investment, and regulated competition can renew center-left governing capacity; critics interpret the shift differently.",
    prescriptive:
      "Favors market-compatible social investment, active labor-market programs, targeted redistribution, public-service reform, fiscal discipline, and conditional or reciprocal welfare commitments rather than a return to either laissez-faire or comprehensive public ownership.",
  },
  baathism: {
    normative:
      "Treats Arab unity, national independence, secular public belonging, and social transformation as legitimate political goods, while the relationship among freedom, party leadership, pluralism, and state authority varies between doctrine and historical branches.",
    descriptive:
      "Expects colonial fragmentation and foreign dependence to block Arab political agency, while a unified movement and state-led development can produce national renewal; Syrian and Iraqi party-states transformed the tradition in different ways.",
    prescriptive:
      "Favors Arab unity, independent state capacity, social and economic transformation, and organized political leadership; the label does not by itself prescribe one constitutional system or justify later authoritarian practice.",
  },
  "developmental-authoritarianism": {
    normative:
      "Treats national development, material transformation, administrative competence, and economic sovereignty as important grounds of political legitimacy, accepting constrained pluralism as a possible tradeoff rather than a universal requirement.",
    descriptive:
      "Expects autonomous or semi-autonomous bureaucracies, industrial policy, state–business coordination, and disciplined investment to accelerate structural transformation, while evidence and cases vary over coercion, distribution, and actual success.",
    prescriptive:
      "Favors strong developmental institutions, industrial policy, coordinated investment, and expert administration, with authoritarian variants limiting opposition or participation; the model does not establish that democracy or rights must be suspended for development.",
  },
  "confucian-political-revival": {
    normative:
      "Treats social roles, moral cultivation, family and civic duty, harmony, and public virtue as politically relevant goods, while contemporary interpreters disagree about hierarchy, equality, rights, and democratic legitimacy.",
    descriptive:
      "Expects appeals to Confucian or Asian-values language to shape arguments about authority, development, and social order, but the discourse is historically situated and can support both authoritarian legitimation and democratic reinterpretation.",
    prescriptive:
      "May favor meritocratic administration, social responsibility, civic education, and public order; as a context label it does not prescribe one regime, economic system, or interpretation of Confucian texts.",
  },
  ecomodernist: {
    normative:
      "Values human flourishing and ecological protection as compatible goals rather than treating prosperity and ecological integrity as inherently opposed.",
    descriptive:
      "Expects technological modernization, urbanization, and intensified production to decouple human well-being from environmental impacts and spare land for nature; evidence reviews distinguish relative from absolute decoupling and find the global, fast-enough absolute form remains unestablished.",
    prescriptive:
      "Favors technological innovation, resource-efficient infrastructure, conservation, and active public institutions to reduce ecological harm while supporting human development.",
  },
  progressivism: {
    normative:
      "Treats deliberate social improvement, equal civic standing, and solving remediable social problems as legitimate public aims, with openness to revising inherited institutions.",
    descriptive:
      "Expects empirical inquiry, public administration, and institutional experimentation to improve social conditions, while progressivist movements vary between expert-led and participatory approaches.",
    prescriptive:
      "Favors evidence-informed institutional reform, public programs, regulation, and sometimes movement-led democratic change; it does not prescribe technocracy or one current policy bundle.",
  },
  "liberal-feminism": {
    normative:
      "Treats individuals of all genders as entitled to equal rights, autonomy, legal status, and opportunity.",
    descriptive:
      "Expects discriminatory law, unequal access, and gendered social expectations to restrict agency, so legal reform and institutional access can expand equality; it does not reduce gender domination to one economic cause.",
    prescriptive:
      "Favors legal reform, equal rights, anti-discrimination protections, equal opportunity, autonomy, and reform of institutions within liberal-democratic constitutionalism; it does not prescribe socialist ownership or one theory of patriarchy.",
  },
  georgism: {
    normative:
      "Treats people as entitled to the value created by their labor and improvements while treating socially generated land and natural-resource rent as subject to common claims.",
    descriptive:
      "Expects private capture of land rent to create unearned inequality and distort access, while competitive use of land and capital can remain compatible with individual enterprise.",
    prescriptive:
      "Favors public capture of land or resource rent, usually through land-value taxation, while leaving the single-tax formulation, other taxes, and service design open to variation.",
  },
  internationalism: {
    normative:
      "Treats obligations, cooperation, and rights across national boundaries as politically important without denying all value to national self-government.",
    descriptive:
      "Expects transnational problems and interdependence to exceed what states can manage alone and sees international institutions or solidarity as ways to coordinate responses.",
    prescriptive:
      "Favors international cooperation, institutions, treaties, transnational solidarity, or universal rights; it does not require abolishing states or creating one global government.",
  },
  "radical-centrism": {
    normative:
      "Treats practical problem-solving, pluralist compromise, effective institutions, and outcomes over ideological purity as political goods.",
    descriptive:
      "Expects fixed left-right coalitions and doctrinal polarization to block workable solutions, while evidence, experimentation, and cross-partisan synthesis can widen the feasible policy space.",
    prescriptive:
      "Favors pragmatic cross-cutting coalitions, evidence-informed reform, and institutional experimentation; the label does not identify one economic program or imply indifference to substantive values.",
  },
  "constitutional-monarchism": {
    normative:
      "Treats hereditary continuity or a nonpartisan head of state as compatible with constitutional rule, lawful government, and democratic self-government; variants differ over how much independent authority the crown should retain.",
    descriptive:
      "Expects constitutional rules, conventions, and elected institutions to channel royal authority, while the monarch may continue to serve as a national figurehead even when day-to-day political power is limited.",
    prescriptive:
      "Favors retaining or establishing a hereditary crown bounded by constitutional rules, with parliamentary ceremonial and executive constrained-monarchy models representing different institutional choices.",
  },
  "anti-imperialism": {
    normative:
      "Treats peoples as entitled to political equality, self-determination, and freedom from colonial domination, military subordination, and exploitative external control.",
    descriptive:
      "Expects imperial power to reproduce unequal dependence through colonial administration, military intervention, or political and economic influence, while the mechanisms and historical targets vary across anti-imperialist traditions.",
    prescriptive:
      "Favors decolonization, national or popular self-government, non-intervention, anti-colonial solidarity, and sometimes non-alignment or economic sovereignty; it does not prescribe one economic system or one strategy of resistance.",
  },
  "traditional-monarchist": {
    normative:
      "Treats dynastic continuity, inherited authority, social hierarchy, and historical or religious legitimacy as important political goods, while monarchist traditions differ over divine right, nation, religion, and constitutional limits.",
    descriptive:
      "Expects established institutions and hereditary succession to preserve continuity, authority, and national representation better than abstract redesign or purely electoral competition, though claims about monarchy’s effects vary.",
    prescriptive:
      "Favors preserving or restoring a hereditary monarchy with a meaningful royal role and prerogative; it can support constitutional limits and does not automatically entail absolute monarchy, rejection of all representation, or one religious doctrine.",
  },
  communitarianism: {
    normative:
      "Treats shared community, social membership, tradition, and common goods as morally important sources of identity and obligation alongside individual rights and autonomy.",
    descriptive:
      "Expects abstract individualism and universal rules to miss how social context, inherited practices, and relationships shape judgment, identity, and the social bases of self-respect; communitarian views differ over pluralism and the reach of community.",
    prescriptive:
      "Favors civic participation, institutions that sustain community and mutual obligation, and policies attentive to common goods and social relationships; it does not prescribe socialism, nationalism, or one level of state intervention.",
  },
  republicanism: {
    normative:
      "Treats civic self-government, equal civic standing, rule of law, and freedom from arbitrary or uncontrolled power as central political goods.",
    descriptive:
      "Expects domination to persist whenever people or groups remain dependent on uncontrolled power even without constant interference, and sees stable public rules and civic participation as ways to reduce that vulnerability.",
    prescriptive:
      "Favors accountable self-government, checks on arbitrary power, civic participation, anti-corruption measures, and public institutions that keep both rulers and private actors contestable; it is compatible with multiple constitutional and economic arrangements.",
  },
  bioregionalism: {
    normative:
      "Treats ecological integrity, place-based belonging, stewardship, and reciprocal human-environment relationships as important goods for political and economic life.",
    descriptive:
      "Expects inherited political boundaries and centralized management to misalign with ecological processes, while local knowledge, citizen engagement, and coordination within watersheds or other bioregions can improve stewardship.",
    prescriptive:
      "Favors governance, land use, and resource management organized around ecological regions, local resilience, and participatory stewardship across existing borders; it does not require isolation, one ownership system, or rejection of all larger institutions.",
  },
  "political-islam": {
    normative:
      "Treats Islamic principles as relevant to public authority, law, political identity, or the common good, while movements differ over sovereignty, jurisprudence, pluralism, democracy, and the role of religious institutions.",
    descriptive:
      "Expects modern political order to be interpreted or reformed through Islamic concepts, with movements adapting differently to elections, constitutionalism, authoritarian rule, social activism, and state-building; the broad label does not imply one strategy or level of coercion.",
    prescriptive:
      "Favors some public role for Islamic normative or legal principles, ranging from democratic constitutional participation to comprehensive Islamist state-building; it does not settle one interpretation of Sharia, church-state separation, minority rights, or political violence.",
  },
  "islamic-democracy": {
    normative:
      "Treats electoral accountability, constitutional limits, and public authority grounded partly in Islamic ethical or legal reasoning as potentially compatible goods, while leaving sovereignty, rights, religious interpretation, and clerical authority contested rather than settled by the label.",
    prescriptive:
      "Favors electoral and constitutional government with public accountability alongside an Islamic ethical or legal framework, while leaving contested questions of interpretation, judicial authority, popular sovereignty, minority rights, and enforcement to institutional design; it is not one settled Sharia model.",
    descriptive:
      "Expects elected government, constitutional rights, and Islamic ethical or legal review to require institutional reconciliation rather than a single settled formula; models differ over judicial authority, popular sovereignty, minority protection, and the scope of religious interpretation.",
  },
  "national-traditionalist": {
    normative:
      "Treats national continuity, inherited institutions, cultural tradition, and social order as important goods, with legitimacy grounded partly in historical belonging and established authority.",
    descriptive:
      "Expects rapid redesign and abstract universalism to weaken cohesion, while national-traditionalist positions vary over democracy, markets, welfare, religion, and membership boundaries.",
    prescriptive:
      "Favors protecting national institutions, inherited practices, cultural continuity, and cautious reform; it does not prescribe racial exclusion, fascist rupture, or one economic model.",
  },
  "fascist-authoritarian": {
    normative:
      "Treats organic national unity, rebirth, hierarchy, discipline, and collective mobilization as superior to liberal individualism and pluralist compromise.",
    descriptive:
      "Expects liberal democracy, perceived decadence, and internal enemies to block national renewal, while fascist movements use mythic rebirth, mass politics, and coercive state power.",
    prescriptive:
      "Favors authoritarian mass mobilization, centralized leadership, coercive state power, and an anti-liberal national-rebirth project; economic arrangements vary and remain subordinate to political-national goals.",
  },
  "eco-fascism": {
    normative:
      "Treats ecological integrity or territorial nature as valuable but subordinates universal human equality to a bounded national or ethnic community and social order.",
    descriptive:
      "Expects environmental crisis to be caused or worsened by demographic mixing, outsiders, liberalism, or disorder, and presents coercive collective control as a remedy; the term is contested and used variously.",
    prescriptive:
      "Favors authoritarian or exclusionary ecological measures, demographic control, territorial protection, or coercive state power in service of a national or ethnic ecology; strong regulation alone is not enough for the label.",
  },
  strasserism: {
    normative:
      "Treats national rebirth, revolutionary hierarchy and discipline, and anti-finance or anti-bourgeois politics as compatible within a fascist order, subordinating individual equality to an organic national community.",
    descriptive:
      "Expects liberal capitalism, finance, Marxist internationalism, and parliamentary pluralism to block national renewal, while Strasserist currents differed over economic organization and their relationship to Nazi leadership.",
    prescriptive:
      "Favors fascist mass mobilization and a strong state with anti-capitalist or corporatist measures subordinate to ultranationalism; it is not democratic socialism or socialism as such.",
  },
  "christian-democrat": {
    normative:
      "Treats human dignity, solidarity, family and civil society, and a layered social order as important goods while accepting constitutional democracy and limits on centralized power.",
    descriptive:
      "Expects institutions between the individual and the state and decentralized authority to support social cohesion; it accepts markets but sees them as requiring moral and social correction and welfare provision.",
    prescriptive:
      "Favors democratic constitutionalism, subsidiarity, social-market institutions, social provision, labor protections, and support for family and civil society; it does not prescribe direct clerical rule.",
  },
  theocrat: {
    normative:
      "Treats binding religious doctrine or recognized religious authority as an ultimate source of public legitimacy, while allowing that the institutional carrier of that authority can vary.",
    descriptive:
      "Expects secular autonomy or pluralist law to conflict with religious truth in some domains, while historical models differ over clerics, judges, rulers, texts, and institutions.",
    prescriptive:
      "Favors a public order in which religious authority or doctrine can control final civil-law legitimacy; the opt-in module tests only a narrow final-authority form and does not identify one religion, regime, or treatment of minorities.",
  },
  integralism: {
    normative:
      "Treats Catholic truth, the common good, and ordered social authority as requiring public power to recognize and remain subordinate to divine moral order.",
    descriptive:
      "Expects liberal separation and individualistic neutrality to fragment social order, while integralist movements differ over church-state arrangements and political strategy.",
    prescriptive:
      "Favors Catholicly informed public law and a subordinate temporal authority rather than liberal church-state separation; clerical-fascist alliances are one historical variant, not the whole term.",
  },
  "fundamentalist-theocracy": {
    normative:
      "Treats strict or literal fidelity to authoritative scripture as necessary to legitimate moral and political order and gives religious conformity priority over secular pluralism.",
    descriptive:
      "Expects modern secularism, doctrinal accommodation, and reinterpretation to corrupt or weaken sacred order, while fundamentalism has distinct histories across religions.",
    prescriptive:
      "Favors religious law and state institutions enforcing a strict sacred-text interpretation, limiting pluralist and secular alternatives; it is more specific than generic religious conservatism or theocracy.",
  },
  "democratic-socialist": {
    normative:
      "Treats democratic control of economic power and social ownership as necessary to extend political equality into production, not merely as a supplement to a capitalist mixed economy.",
    descriptive:
      "Expects private ownership of major productive assets to reproduce class power and limit democratic agency, while democratic-socialist currents differ over reform, worker ownership, public ownership, and transition.",
    prescriptive:
      "Favors democratic social ownership or control of major productive assets through elections, movements, cooperatives, public institutions, or workplace democracy; it does not prescribe authoritarian one-party rule.",
  },
  "market-socialist": {
    normative:
      "Treats social or worker ownership as needed to prevent private capital from dominating economic life while retaining some value in decentralized exchange and choice.",
    descriptive:
      "Expects markets and prices to coordinate dispersed information even when firms or capital are socially owned, while models differ over investment, competition, surplus distribution, and planning.",
    prescriptive:
      "Favors combining social, public, or cooperative ownership with market pricing or competition; it rejects both unqualified private capitalist ownership and the assumption that socialism requires command planning.",
  },
  "socialist-feminism": {
    normative:
      "Treats gender liberation and the transformation of class and property relations as connected political goods, including freedom from domination in paid and unpaid reproductive labor.",
    descriptive:
      "Expects capitalism, patriarchy, household organization, paid work, unpaid care, and social reproduction to interact in producing gendered dependence; socialist and Marxist feminists disagree over the relation between these structures.",
    prescriptive:
      "Favors collective action against patriarchy and capitalist exploitation through changes to ownership, labor, care, reproduction, and social institutions; the combined catalog label does not prescribe one feminist strategy.",
  },
  juche: {
    normative:
      "Treats political autonomy, national self-reliance, collective discipline, and the sovereignty of the Korean revolutionary state as central political goods, as articulated in the DPRK/Kimist tradition.",
    descriptive:
      "Expects foreign dependence or ideological deviation to threaten national independence, while assigning a centralized party-state and supreme leader a guiding role in mobilizing the people; the doctrine developed through changing Marxist-Leninist and Kimist formulations.",
    prescriptive:
      "Favors political independence, state-directed economic self-reliance, military self-defense, centralized party leadership, and leader-centered state authority in the DPRK/Kimist model; it is not a general endorsement of personal self-sufficiency or literal autarky.",
  },
  "egalitarian-statist": {
    normative:
      "Treats material equality and effective public provision as political goods, while regarding capable and accountable state institutions as legitimate tools for reducing durable disadvantage.",
    descriptive:
      "Expects unequal outcomes to be reproduced by market and social structures and assumes public institutions can implement redistributive and universal services competently when designed and held accountable.",
    prescriptive:
      "Favors progressive redistribution, broad social provision, labor protections, and investment in capable public administration; it does not prescribe authoritarian state socialism.",
  },
  "social-democrat": {
    normative:
      "Treats freedom and equality as requiring democratic control over social and economic conditions shaped by capitalism, while preserving pluralist political institutions.",
    descriptive:
      "Expects markets to provide useful coordination but also to produce durable inequality and worker insecurity, so democratic governments, unions, and welfare institutions can temper market outcomes.",
    prescriptive:
      "Favors mixed-economy reform through elections, progressive taxation, public services, collective bargaining, and social insurance rather than revolutionary abolition of existing institutions.",
  },
  "universal-basic-income": {
    normative:
      "Treats an unconditional income floor as a means of securing basic economic freedom, security, or equal standing without making subsistence depend on proving need or work.",
    descriptive:
      "Expects regular individual cash transfers to reduce poverty or insecurity and simplify or complement welfare, while funding, level, labor effects, and relations to services remain contested.",
    prescriptive:
      "Favors a periodic cash payment to all individuals without a means test or work requirement; proposals diverge over taxation, citizenship or residency, payment level, and whether existing benefits are retained.",
  },
  "social-investment-state": {
    normative:
      "Treats capabilities across the life course and inclusive participation as social goods, making human development and resilience central to welfare policy.",
    descriptive:
      "Expects education, childcare, health, skills, work-life supports, and protective buffers to improve both social inclusion and economic performance, while scholarship differs on how far social investment should replace compensatory protection.",
    prescriptive:
      "Favors policies that build, mobilize, and preserve capabilities—especially early education, care, training, employment support, and life-course protection—rather than relying only on passive income maintenance.",
  },
  "right-wing-populism": {
    normative:
      "Treats an authentic or national people as the rightful source of political authority and often gives cohesion, order, or bounded membership priority over pluralist or cosmopolitan claims.",
    descriptive:
      "Expects established elites and institutions to be corrupt or detached from the authentic people, while right-wing hosts interpret who belongs and what threatens the community through national, cultural, or nativist frames.",
    prescriptive:
      "Favors restoring popular control through majoritarian, anti-establishment, nationalist, nativist, or culturally traditional policies; specific economic and institutional programs vary by host.",
  },
  "left-wing-populism": {
    normative:
      "Treats ordinary people, especially subordinated or working groups, as entitled to political voice and economic equality against oligarchic domination.",
    descriptive:
      "Expects concentrated wealth and entrenched elites to distort democracy and sees broad popular mobilization and redistribution as ways to reopen political agency; movements define people and elite differently.",
    prescriptive:
      "Favors majoritarian or participatory mobilization, redistribution, public control, or economic democracy against oligarchic power; it does not prescribe one route between elections, movements, and institutions.",
  },
  "agrarian-populism": {
    normative:
      "Treats small producers, rural communities, land-based livelihoods, or the people of the land as politically and morally undervalued by urban or financial power.",
    descriptive:
      "Expects rural producers to be disadvantaged by concentrated land, credit, commodity, or political power, while agrarian populism can build cross-class alliances with divergent outcomes.",
    prescriptive:
      "Favors producer protections, cooperative or distributed ownership, land or credit reform, and stronger rural representation; no single economic ideology follows from the label.",
  },
  "cultural-populism": {
    normative:
      "Treats cultural belonging, everyday norms, or community recognition as politically important and sees distant elite authority as suspect.",
    descriptive:
      "Expects cultural conflict and perceived status loss to mobilize anti-elite politics, with the people defined through national, religious, family, lifestyle, or other cultural boundaries.",
    prescriptive:
      "Favors policies or political strategies that protect or restore a preferred cultural order and transfer authority from distant elites toward the culturally defined people; concrete positions on economy and state power vary.",
  },
  "market-liberal": {
    normative:
      "Treats private property, individual liberty, legal equality, and predictable rule of law as central goods, with a presumption against concentrated public power.",
    descriptive:
      "Expects competitive markets and secure property rights to coordinate dispersed knowledge and incentives better than extensive administrative direction, while leaving room for failures and regulation.",
    prescriptive:
      "Favors competitive markets, secure private property, limited and constitutional government, and rule-governed reform; it does not prescribe one tax, welfare, or foreign-policy program.",
  },
  "decentralist-market-skeptic-of-state": {
    normative:
      "Treats concentrated authority and dependence on centralized administration as major threats to liberty, valuing voluntary association, exit, and dispersed power.",
    descriptive:
      "Expects decentralized exchange and voluntary institutions to reveal local knowledge and constrain abuse better than centralized state provision, though coordination and public-good limits remain contested.",
    prescriptive:
      "Favors decentralizing provision, expanding exit and voluntary association, and reducing reliance on centralized administration; its market orientation distinguishes it from socialist anarchism.",
  },
  "civil-libertarian-cosmopolitan": {
    normative:
      "Treats individual civil liberty and moral concern beyond national borders as jointly important, with universal obligations not exhausted by citizenship.",
    descriptive:
      "Expects concentrated authority and closed national boundaries to create risks of domination, while transnational norms and decentralized institutions can widen protection.",
    prescriptive:
      "Favors strong civil liberties, decentralized institutions, and cosmopolitan rights or obligations; it leaves economic property and global institutional design open.",
  },
  "classical-liberalism": {
    normative:
      "Treats individual liberty, private property, voluntary exchange, rule of law, and constitutional limits on public power as central to a legitimate order.",
    descriptive:
      "Expects dispersed decisions protected by property and legal constraints to check arbitrary power and support social coordination, while versions differ over welfare and state capacity.",
    prescriptive:
      "Favors constitutionally limited government, civil and economic liberty, secure property, and rule-governed reform; it does not dictate a single libertarian or laissez-faire program.",
  },
  neoliberalism: {
    normative:
      "Values liberal rights and market coordination while treating a competitive capitalist order and credible rules as important conditions for prosperity and institutional stability.",
    descriptive:
      "Expects competition, price signals, expert regulation, and international economic rules to improve coordination, while scholars and critics dispute the term’s effects and boundaries.",
    prescriptive:
      "Favors competition policy, market mechanisms, selective privatization or outsourcing, independent expert institutions, and international economic rules; this is a catalog-specific, contested use of neoliberalism.",
  },
  "social-liberalism": {
    normative:
      "Treats individual liberty and equal citizenship as compatible with public responsibility for capabilities, opportunity, and protection from severe deprivation.",
    descriptive:
      "Expects public services, regulation, and social insurance to expand effective freedom and stabilize a market society without requiring social ownership of production.",
    prescriptive:
      "Favors rights-based public provision, social insurance, regulation, and opportunity-enhancing reform within a liberal constitutional order rather than socialism by definition.",
  },
  "anarcho-capitalist": {
    descriptive:
      "Expects private property, voluntary contracts, and competition among private providers to supply law, protection, and arbitration more responsively than a territorial state; critics dispute whether such systems can secure equal access to law and effective remedies.",
    prescriptive:
      "Favors replacing compulsory public provision with voluntary contract and competitive private provision of law, protection, and arbitration.",
  },
  objectivism: {
    descriptive:
      "Expects objective reality to constrain thought and reason to provide reliable knowledge, while treating productive individual agency and voluntary exchange as capable of coordinating social life; these remain Objectivist philosophical claims, not settled social-science findings.",
  },
  paleolibertarianism: {
    descriptive:
      "Expects welfare-state expansion, interventionist foreign policy, and culturally egalitarian state projects to undermine liberty and inherited social authority, while free markets and local intermediary institutions can preserve order; the historical coalition was brief and internally divided over the state’s role.",
  },
  neoreactionary: {
    descriptive:
      "Expects electoral democracy to produce instability, elite capture, or short-termism, and treats concentrated executive or corporate governance plus exit as more accountable; this is a niche, author-specific critique rather than an established empirical consensus.",
  },
  geolibertarian: {
    normative:
      "Combines self-ownership and voluntary exchange with an equal claim to the value of land and natural opportunities.",
    descriptive:
      "Expects self-ownership and market exchange to coexist with equal claims to natural opportunities, treating land value as socially generated and land rent as a candidate for public capture; variants differ over revenue use and state scope.",
    prescriptive:
      "Favors secure private use of land while collecting land or resource rent for public revenue or equal compensation, usually through a land-value tax.",
  },
  minarchist: {
    normative:
      "Treats individual rights in life, liberty, property, and contract as primary constraints on political authority, while allowing a narrowly limited state to protect those rights.",
    descriptive:
      "Expects a public system of police, courts, and defense to protect against force, fraud, and rights violations more reliably than a wholly stateless arrangement, while remaining skeptical of government expansion.",
    prescriptive:
      "Favors a minimal state limited mainly to protecting rights through courts, policing, and defense.",
  },
  "anarcho-communist": {
    descriptive:
      "Expects decentralized communal production and sharing to meet needs and distribute socially generated wealth without centralized state control, while feasibility, coordination, and the balance between individual and community remain contested questions.",
    prescriptive:
      "Favors stateless federations of freely associated communities, common control of productive resources, and distribution according to need rather than markets or centralized state planning.",
  },
  "bleeding-heart-libertarianism": {
    normative:
      "Treats individual liberty and social justice, especially effects on disadvantaged people, as joint standards for assessing institutions.",
    descriptive:
      "Expects market mechanisms, voluntary cooperation, and property rights to contribute to the well-being of vulnerable or least-advantaged people while preserving individual liberty; proponents disagree over how far social justice permits redistribution or institutional intervention.",
  },
  kemalism: {
    normative:
      "Treats republican sovereignty, secular public authority, national unity, scientific modernization, and state-led reform as central political goods, as expressed in the Six Arrows; Kemalist currents differ over pluralism, citizenship, and how much authority the state should exercise.",
    descriptive:
      "Expects a secular, scientifically modernizing republic and a unified Turkish national identity to overcome Ottoman and religious-political legacies; Kemalist currents differ over citizenship, pluralism, and how strongly the state should guide modernization.",
    prescriptive:
      "Favors the Six Arrows program of republicanism, nationalism, peopleism (halkçılık), statism, laicism, and continuing reformism; this historical program should not be read as a generic contemporary populist platform.",
  },
  "christian-reconstructionism": {
    descriptive:
      "Treats secular legal neutrality as weakening public moral order and expects theonomic biblical norms applied to civil institutions to restore a Christian social order; Reconstructionist currents differ over how literally and comprehensively biblical law should govern public life.",
    prescriptive:
      "Favors reconstructing civil institutions under theonomic biblical law rather than maintaining a religiously neutral legal order.",
  },
  distributism: {
    descriptive:
      "Expects concentrated ownership to weaken economic independence and political freedom, while widely dispersed productive property and local associations can support autonomy and human dignity; contemporary scholarship treats these as a political-economic research program, not settled evidence.",
    prescriptive:
      "Favors dispersing productive property among families, small firms, guilds, cooperatives, and local associations rather than concentrating it in corporations or the state.",
  },
  mutualist: {
    normative:
      "Treats reciprocity, worker autonomy, equal exchange, voluntary association, and resistance to state-granted privilege as safeguards against both capitalist domination and centralized administration. Proudhonian, Tuckerite or individualist, Swartz-associated, and later mutualist currents disagree about the moral basis and extent of property claims.",
    descriptive:
      "Expects state-created monopoly, rent, and privilege to distort exchange, while cooperative markets and mutual-credit institutions, together with federated association, can widen productive access and reduce exploitation. Historical and contemporary currents differ over labor value, currency, land, wage labor, and institutional scale; these are contestable expectations, not settled facts.",
    prescriptive:
      "May favor mutual credit, cooperative exchange, possession or use-based claims, and federated voluntary institutions rather than state administration or concentrated capitalist ownership. The current specialist module reports only a family-level affinity: it cannot identify Proudhonian, Tuckerite, Joseph or Laurance Labadie-associated, Swartz-associated, neo-Proudhonian, or C4SS-affiliated commitments from its present constructs.",
  },
  "civic-nationalist": {
    descriptive:
      "Expects shared citizenship, common political institutions, and commitment to public principles to build solidarity across ancestry or religion, while scholarship finds the civic/ethnic distinction blurred and civic criteria can still be exclusionary in practice.",
    normative:
      "Treats shared civic membership, political self-government, and a common public culture as important grounds of national belonging rather than inherited ancestry alone.",
    prescriptive:
      "Favors inclusive citizenship, common political institutions, constitutional participation, and public nation-building while leaving room for cultural and historical identities within the civic community.",
  },
  indigenism: {
    descriptive:
      "Expects imposed state or market institutions to have disrupted Indigenous authority, land relationships, cultural continuity, and self-government, while Indigenous political traditions differ over sovereignty, territory, state recognition, and relations with non-Indigenous institutions.",
    normative:
      "Treats Indigenous collective self-determination, cultural continuity, land relationships, and authority over community affairs as central goods in a decolonial political order.",
    prescriptive:
      "Favors Indigenous governance, land and resource rights, language and cultural institutions, and decolonial changes to imposed state or market structures; traditions differ over institutional form and territorial scope.",
  },
  hindutva: {
    descriptive:
      "Expects a culturally unified Hindu nation to organize political identity and public life in India, while scholarship treats Hindutva as a modern, historically developing discourse whose relations to Hindu religiosity, state power, and minority inclusion vary across organizations and periods.",
    normative:
      "Treats Hindu civilizational or national identity as central to the political meaning of India and to the boundaries of national belonging.",
    prescriptive:
      "Favors public institutions and national membership organized around a Hindu-nationalist conception of India; programs vary over secularism, minority rights, citizenship, and the role of the state.",
  },
  "religious-nationalism": {
    descriptive:
      "Expects shared religious identity to strengthen national solidarity and political legitimacy, while comparative scholarship shows that religious-nationalist movements differ in how they connect faith, state authority, law, citizenship, and minority inclusion.",
    normative:
      "Treats a religious tradition and the national community as mutually reinforcing sources of identity, obligation, and political legitimacy.",
    prescriptive:
      "Favors public institutions that recognize or advance a nation’s religious tradition, with variants ranging from cultural preference to religiously informed law or formal religious authority.",
  },
  zionism: {
    descriptive:
      "Expects Jewish national self-determination and a state or secure national home to safeguard Jewish collective survival and cultural continuity, while Zionist currents differ over state form, territory, religion, socialism, and relations with Palestinians.",
    normative:
      "Treats the Jewish people as a nation entitled to Jewish national self-determination and a secure political and cultural home.",
    prescriptive:
      "Favors institutions capable of maintaining Jewish national self-determination in the Land of Israel; liberal, socialist, religious, revisionist, and other currents disagree over borders, state structure, religion, and relations with Palestinians.",
  },
  "left-wing-nationalism": {
    descriptive:
      "Expects imperial domination and unequal international integration to block social equality and self-government, while national liberation and popular sovereignty can create conditions for redistribution or anti-colonial transformation; historical trajectories differ and nationalism can conflict with internationalism or minority claims.",
    normative:
      "Treats national self-determination and popular sovereignty as compatible with social equality, anti-colonial solidarity, and opposition to imperial domination.",
    prescriptive:
      "Favors national liberation, redistributive or socialist policy, and popular control of the post-colonial state or nation; movements differ over internationalism, class politics, and minority membership.",
  },
  "expansionist-nationalism": {
    descriptive:
      "Often expects territorial enlargement or external influence to restore national strength, security, status, or historical unity, while research on imperial and irredentist projects shows that expansion can instead intensify conflict and undermine security; rationales and outcomes vary by case.",
    normative:
      "Treats territorial enlargement, external influence, and national power as legitimate or necessary expressions of the nation’s political purpose.",
    prescriptive:
      "Favors territorial acquisition, imperial administration, or irredentist expansion justified through security, historical, civilizing, or strategic claims; it is not a policy-neutral theory of international relations.",
  },
  "separatist-nationalism": {
    descriptive:
      "Expects a distinct regional or national community to gain greater self-government through autonomy, federal reorganization, or independence, while comparative research finds the relationship between autonomy and secession conditional: lost or static autonomy can intensify separatism, whereas adaptable autonomy can reduce it.",
    normative:
      "Treats a distinct national or regional community’s self-government as more important than preserving the existing state’s territorial unity.",
    prescriptive:
      "Favors autonomy, federal reorganization, or secession as routes to self-government, with the preferred route depending on the movement and its political conditions rather than following automatically from the label.",
  },
  "left-wing-market-anarchism": {
    descriptive:
      "Expects legal privilege and state-backed corporate power to distort markets and sustain economic domination, while a genuinely freed market could reduce exploitation through voluntary exchange and more egalitarian access; currents differ over how property, labor, and mutual provision would work.",
    normative:
      "Combines individual liberty and voluntary exchange with opposition to state privilege, exploitation, and concentrated economic domination.",
    prescriptive:
      "Favors stateless freed markets and voluntary institutions while dismantling legal privileges that sustain corporate concentration; currents differ over property, wage labor, rent, and the balance among firms, cooperatives, and mutual provision.",
  },
  "individualist-anarchism": {
    normative:
      "Gives individual self-direction and voluntary association priority over compulsory state authority or demands that subordinate persons to an abstract collective good.",
    descriptive:
      "Expects compulsory authority and group claims to threaten individual autonomy, while voluntary cooperation can preserve autonomy without requiring one market or communal model; disputes remain over whether such cooperation yields market, mutualist, or sharing arrangements.",
    prescriptive:
      "Favors stateless, voluntary forms of association while leaving substantial disagreement among natural-rights, mutualist, and egoist currents over property, exchange, and durable organization.",
  },
  "national-bolshevism": {
    descriptive:
      "The post-Soviet reference case expects a strong, anti-liberal state to unify national power through a synthesis of nationalism and revolutionary-socialist mobilization, while historical versions differ—from interwar German currents to the Limonov–Dugin milieu—and do not form one settled doctrine.",
  },
  "anarcho-primitivism": {
    normative:
      "Treats autonomy, ecological integrity, and freedom from civilizational domination as more important than maintaining industrial scale, technological dependence, or specialized hierarchy.",
    descriptive:
      "Expects domestication, agriculture, symbolic systems, division of labor, and industrial technology to intensify alienation, hierarchy, and ecological harm; adherents vary over which tools and communities fit, and the anthropological claims remain contested.",
    prescriptive:
      "Favors radical decentralization, deindustrialization, rewilding, and reducing dependence on domestication, specialized labor, and large technical systems; adherents differ over transition and acceptable tools.",
  },
  voluntaryism: {
    normative:
      "Treats consent, individual liberty, and voluntary support as the standards by which political institutions and social relationships should be judged.",
    descriptive:
      "Expects compulsory taxation and state direction to create intrusion, dependency, and distorted incentives, while voluntary funding and association can sustain public functions or a limited state; historical Voluntaryists disagree over how far this logic requires statelessness.",
    prescriptive:
      "Favors voluntarily funded and joined institutions; Herbert retained a voluntarily funded minimal state, while later Voluntaryists have favored competing or stateless arrangements.",
  },
  stirnerism: {
    normative:
      "Resists treating fixed moral, political, or social abstractions as obligations that override the self-directed unique individual.",
    descriptive:
      "Expects people to become dominated when fixed ideas—such as Humanity, the State, or morality—are treated as independent authorities, while contingent unions of egoists can coordinate around participants’ own purposes; this is a philosophical account, not a settled empirical model of social behavior.",
    prescriptive:
      "Allows contingent, voluntary unions formed for participants’ purposes but supplies no single institutional blueprint, property system, or public-policy program.",
  },
  "anarcha-feminism": {
    normative:
      "Treats patriarchy and gender subordination as forms of coercive hierarchy inseparable from a broader commitment to autonomy, equality, and freedom from domination.",
    descriptive:
      "Expects patriarchy, gendered divisions of labor, sexual regulation, and other coercive hierarchies to reinforce one another, while gender equality requires changing intimate and social relations as well as formal law; currents differ over the causal links.",
    prescriptive:
      "Favors decentralized and non-coercive social relations that challenge gender hierarchy across intimate life, work, political organization, and other institutions rather than seeking representation within hierarchy alone.",
  },
  "queer-anarchism": {
    descriptive:
      "Expects rigid sexual and gender norms to reinforce wider political, economic, and social hierarchies, while queer and anarchist practices can open forms of autonomy and collective freedom; approaches vary over identity, family, and gender abolition.",
    normative:
      "Opposes coercive sexual and gender hierarchy together with the wider political and social structures that enforce conformity and domination.",
    prescriptive:
      "Favors autonomous, decentralized forms of queer liberation and resistance to institutions that police gender or sexuality; the current does not impose one universal account of identity, family, or gender abolition.",
  },
  "techno-anarchism": {
    normative:
      "Prioritizes privacy, autonomy, and resistance to centralized information control while treating technology as a possible anti-authoritarian tool rather than an authority in itself.",
    descriptive:
      "Expects encryption, anonymity, distributed trust, and peer-to-peer networks to reduce the leverage of centralized surveillance or gatekeepers, while actual systems can create new forms of concentration and the current has no settled institutional model.",
    prescriptive:
      "Favors encryption, anonymity systems, peer-to-peer protocols, and decentralized networks that make surveillance, censorship, or centralized control harder; it is a loose current rather than one settled institutional program.",
  },
  panarchism: {
    descriptive:
      "Expects territorial monopoly to be unnecessary for legitimate government, with voluntary nonterritorial states and exit allowing multiple governance arrangements; feasibility, coordination, and unequal bargaining power remain unresolved theoretical questions.",
  },
  ecosocialist: {
    descriptive:
      "Expects capitalist accumulation and profit-driven growth to conflict structurally with ecological limits, so collective ownership and democratic planning can align production with social needs and ecological equilibrium; approaches differ over technology, scale, and transition strategy.",
    prescriptive:
      "Favors social ownership and democratic planning of production around human need, equality, and ecological limits rather than profit or growth as ends in themselves.",
  },
  "world-federalism": {
    normative:
      "Treats humanity as entitled to shared political institutions capable of securing peace, rights, and justice across borders while preserving self-government at appropriate levels.",
    descriptive:
      "Expects problems that cross borders to exceed the capacity of sovereign states acting alone and to require accountable institutions with global scope.",
    prescriptive:
      "Favors a democratic federal layer of world government with divided powers and enforceable international law above nation-states, while retaining national and local authority in other domains.",
  },
  "fourth-theory": {
    normative:
      "Treats civilizational particularity, traditionalism, and resistance to liberal universalism as political goods in Dugin’s project; this is an author-specific ideological claim, not a settled or neutral account of political legitimacy.",
    prescriptive:
      "Favors building an autonomous post-liberal political model organized around civilizational plurality and multipolar coordination rather than liberal universalism; because Dugin’s project is author-specific, incomplete, and contested, the label does not provide one settled institutional blueprint.",
    descriptive:
      "Expects civilizational pluralism and multipolar great spaces to provide a viable alternative to liberal universalism and a unipolar order, while Dugin presents the project as incomplete and scholars dispute whether its claimed break with fascism is substantive.",
  },
  multiculturalism: {
    normative:
      "Treats cultural membership and the ability to maintain distinctive identities and practices as compatible with equal citizenship, rather than requiring a single assimilated public culture.",
    descriptive:
      "Expects forced assimilation to reproduce unequal status and sees recognition or accommodation as possible tools for inclusion, though group rights can create tensions within and across communities.",
    prescriptive:
      "Favors recognition, accommodation, or group-differentiated rights for minority cultural communities within a shared constitutional order; it does not prescribe separatism or one fixed model of integration.",
  },
  "christian-socialism": {
    descriptive:
      "Often expects industrial capitalism’s concentration of wealth and power to damage solidarity and the standing of poor and working people, while Christian moral commitments and collective organization can support a more just social order; currents differ over cooperation, reform, and social ownership.",
    prescriptive:
      "Favors some combination of cooperative organization, labor protection, social provision, regulation, or social ownership to subordinate economic power to solidarity and the needs of poor and working people; currents disagree over ownership and strategy.",
  },
  "revolutionary-collectivist": {
    descriptive:
      "Expects capitalist property relations to reproduce class domination and treats revolutionary seizure plus centralized collective ownership as a plausible transition to socialism; because this is a catalog umbrella, views on party rule, democracy, and the endpoint vary substantially.",
    prescriptive:
      "Favors a revolutionary break with capitalist property relations and centralized public ownership or state power as the main transition mechanism.",
  },
  "marxist-leninist": {
    descriptive:
      "Expects capitalist class power and crisis to require a disciplined vanguard party and centralized state power to direct a transition toward planned social ownership and communism; national Marxist-Leninist traditions differ in institutions and policies.",
    prescriptive:
      "Favors a disciplined vanguard party taking state power, abolishing private control of major productive assets, and directing a planned transition toward communism.",
  },
  "libertarian-socialism": {
    descriptive:
      "Expects both capitalist concentration and centralized party-state control to reproduce domination, while worker self-management, voluntary federation, and social ownership can coordinate production without vanguard seizure; traditions vary over markets, reform, and direct action.",
    prescriptive:
      "Favors worker self-management, social ownership, and federated institutions without a centralized party-state; traditions vary over markets and the balance between reform and direct action.",
  },
  maoism: {
    descriptive:
      "Maoist revolutionary strategies often expect predominantly agrarian or peripheral societies to depend on peasant mobilization, protracted struggle, mass-line leadership, and continuing opposition to bureaucratic restoration; movements adapt these ideas differently across countries and periods.",
    prescriptive:
      "Favors mass-line organizing, peasant or peripheral mobilization, protracted revolutionary struggle, and continuing campaigns against bureaucratic or capitalist restoration.",
  },
  trotskyism: {
    descriptive:
      "Expects socialism isolated within one country to be vulnerable to bureaucratic degeneration and sees international or “permanent” revolution led by the working class as necessary for durable transformation; Trotskyist currents differ over strategy and adaptation.",
    prescriptive:
      "Favors permanent international revolution led by a revolutionary party, opposing both reformist gradualism and an isolated bureaucratic socialism in one country.",
  },
  "guild-socialism": {
    descriptive:
      "Expects capitalist industrial hierarchy to deny workers democratic control, while public ownership and worker guilds can organize production through industrial democracy and self-government; the balance among guild autonomy, consumer interests, and state coordination remains contested.",
    prescriptive:
      "Favors public ownership of industry combined with democratic worker guilds that administer production and represent producers alongside political institutions representing citizens.",
  },
  "utopian-socialism": {
    descriptive:
      "Expects deliberate social reconstruction through model communities, cooperative experiments, and a more scientific or rational understanding of society to demonstrate alternatives to competitive industrial order; Saint-Simonian, Fourierist, and Owenite projects differed substantially in mechanisms and endpoints.",
    prescriptive:
      "Historically favored moral persuasion, model communities, cooperative experiments, or rational industrial reorganization; the projects grouped under this later label differed substantially.",
  },
  neoconservative: {
    descriptive:
      "Expects authoritarian or totalitarian threats and anti-communist adversaries to endanger liberal-democratic order, while national security, military power, and democracy promotion are treated as instruments of resistance; internal currents and historical periods differ.",
    normative:
      "Defends liberal-democratic institutions against totalitarian or authoritarian threats while often rejecting moral relativism; adherents have differed substantially over domestic policy.",
    prescriptive:
      "Favors an assertive U.S. or allied international role using alliances, pressure, and sometimes military force to defend strategic interests and promote liberal-democratic institutions abroad.",
  },
  paleoconservatism: {
    descriptive:
      "Expects liberal internationalism, mass immigration, and multiculturalism to weaken national cohesion and cultural continuity, while localism, economic nationalism, and non-intervention can protect the republic; paleoconservative currents vary and the label can overlap with nativist politics.",
    prescriptive:
      "Generally favors local or national control, immigration restriction, economic nationalism or skepticism toward free trade, and a less interventionist foreign policy than neoconservatism.",
  },
  "one-nation-conservatism": {
    descriptive:
      "Expects social division and insecurity to threaten national cohesion, while paternalist welfare and moderate state intervention can bind classes together without abolishing competitive enterprise; the tradition varies over how much welfare and state action are compatible with conservatism.",
    prescriptive:
      "Accepts cost-conscious welfare provision and moderate state intervention to preserve social cohesion, security, and opportunity within existing institutions rather than pursue egalitarian transformation.",
  },
  "fiscal-conservatism": {
    normative:
      "Treats sustainable public finances, restraint of deficits or debt, and fairness across present and future taxpayers as important political goods; it does not by itself settle the preferred mix of taxes, spending, social insurance, or fiscal rules.",
    descriptive:
      "Expects persistent deficits, debt accumulation, and expansive public budgets to reduce fiscal room or burden future taxpayers, while spending restraint, revenue changes, or fiscal rules can preserve sustainable public finances; evidence and preferred policy mixes remain contested.",
    prescriptive:
      "Prioritizes sustainable public finances and restraint of deficits or debt; possible means include spending limits, revenue changes, or fiscal rules, so the label does not prescribe one tax level or social program.",
  },
  "social-conservatism": {
    descriptive:
      "Expects rapid changes in family, gender, sexual, or religious norms to weaken social cohesion and moral formation, while inherited institutions and traditional authority can stabilize community life; the content of “tradition” varies across religious and national contexts.",
    normative:
      "Gives inherited moral norms and institutions such as family, religion, and community special weight in sustaining social order and human flourishing.",
    prescriptive:
      "Favors preserving or reinforcing traditional social institutions through law, public policy, or civil society; positions on markets, welfare, and foreign policy remain separate questions.",
  },
  "national-conservatism": {
    descriptive:
      "Expects cosmopolitan or supranational institutions, liberal universalism, and rapid cultural change to weaken national solidarity and inherited institutions, while national sovereignty and culturally continuous communities are expected to restore political cohesion; contemporary currents vary over religion, markets, welfare, and democracy.",
    normative:
      "Gives national sovereignty, cultural continuity, and inherited institutions priority over cosmopolitan or supranational commitments.",
    prescriptive:
      "Favors strengthening the nation-state and protecting national institutions or culture; contemporary currents vary over economic intervention, welfare provision, democracy, and external power.",
  },
  "conservative-liberalism": {
    descriptive:
      "Expects constitutional rules, prudent public authority, and a competitive market order to preserve liberty better than either unregulated market power or centralized economic direction; conservative-liberal currents differ over how strongly the state should discipline markets and democracy.",
    normative:
      "Combines liberal rights, rule of law, and private property with conservative prudence, social continuity, and respect for inherited institutions.",
    prescriptive:
      "Favors a constitutional market order and gradual reform that preserves the legal and social institutions on which liberty is understood to depend.",
  },
  "liberal-conservatism": {
    descriptive:
      "Expects abrupt social redesign to unsettle inherited institutions and social order, while constitutional rights, cautious reform, and a market economy can preserve continuity without restoring a pre-modern order; currents differ over state intervention and the content of inherited institutions.",
    normative:
      "Combines conservative concern for continuity and social order with liberal commitments to constitutional government and civil liberty.",
    prescriptive:
      "Favors cautious reform, a market economy, limited constitutional government, and preservation of established institutions rather than either reaction or radical reconstruction.",
  },
  "green-capitalism": {
    normative:
      "Values ecological protection alongside human prosperity and continued material development.",
    descriptive:
      "Expects prices, investment, firms, and innovation within capitalism to redirect production and consumption toward lower ecological harm, while critics challenge the sufficiency of that mechanism.",
    prescriptive:
      "Favors carbon pricing, renewable-energy markets, eco-labeling, and corporate sustainability as mechanisms of ecological transition.",
  },
  "deep-ecology": {
    normative:
      "Treats nonhuman life and ecological systems as possessing value independent of their usefulness to people, and regards ecological integrity as a condition of a flourishing world.",
    descriptive:
      "Expects anthropocentric industrial practices, pollution, and resource depletion to damage an interdependent biosphere, while treating human beings as embedded in ecological relationships rather than separate from nature.",
    prescriptive:
      "Favors restraint in human impacts, respect for ecological diversity and complexity, decentralization, and far-reaching social change around biocentric limits; it does not prescribe one population or economic policy.",
  },
  "eco-authoritarianism": {
    normative:
      "Treats ecological protection as an overriding political priority and accepts concentrated authority, restricted participation, or reduced individual discretion as possible means to secure it.",
    descriptive:
      "Expects ecological crisis and the perceived slowness or fragmentation of democratic and market institutions to justify centralized expertise, command, and coercive environmental enforcement; real-world environmental authoritarianism varies across regimes and policies.",
    prescriptive:
      "Favors powerful centralized authority, expert or vanguard direction, and command-and-control environmental rules that can override ordinary democratic or individual constraints.",
  },
  "radical-democracy": {
    normative:
      "Treats democratic equality, active participation, and the contestability of concentrated power as central goods, while regarding pluralism and legitimate political conflict as compatible with democratic life.",
    descriptive:
      "Expects settled representative institutions and dominant hegemonies to exclude voices or depoliticize conflict, while social movements, counter-hegemonic struggles, and public contestation can reopen political participation.",
    prescriptive:
      "Favors expanding participation and redesigning institutions so concentrated political and economic power remains contestable beyond periodic elections.",
  },
  "liquid-democracy": {
    normative:
      "Treats voter autonomy and flexible participation as compatible: people should be able to decide directly on issues or authorize another person to decide for them without surrendering ongoing control.",
    descriptive:
      "Expects a mixture of direct voting and voluntary, revisable proxy delegation to combine issue-specific participation with access to trusted expertise or representation; delegation can also create new risks of concentration and manipulation.",
    prescriptive:
      "Favors delegable proxy voting that lets participants vote directly or transfer their vote to a chosen proxy, usually with the ability to revise or withdraw the delegation.",
  },
  "democratic-confederalism": {
    normative:
      "Treats grassroots self-government, pluralism, ecological responsibility, gender equality, and freedom from centralized domination as mutually reinforcing political goods.",
    descriptive:
      "Expects local communities and assemblies, linked through delegated coordination, to handle social decisions more democratically than a centralized nation-state, with ecology, feminism, and multicultural coexistence shaping the model.",
    prescriptive:
      "Favors linked local assemblies and councils with limited coordinating bodies, participatory self-administration, and a non-state or post-nation-state political horizon.",
  },
  "welfare-chauvinism": {
    descriptive:
      "Expects a bounded national or ethnic welfare community to preserve solidarity by limiting out-groups’ access, with judgments shaped by perceived deservingness, contribution, insecurity, and the design of benefits; research finds these patterns vary across groups and contexts.",
  },
  corporatism: {
    normative:
      "Treats organized occupational and sectoral representation, social harmony, and coordinated public direction as more legitimate than adversarial pluralist competition; this label’s state-corporatist variant subordinates independent association to recognized bodies, while wider corporatism also includes democratic and societal forms.",
    descriptive:
      "Expects recognized occupational bodies under state direction to mediate class and sectoral conflict more effectively than pluralist party competition, while scholarship distinguishes authoritarian state corporatism from autonomous societal or neo-corporatism and does not treat them as the same system.",
    prescriptive:
      "Favors organizing recognized occupational and sectoral bodies under strong state direction to mediate represented interests.",
  },
  "anarcho-syndicalism": {
    normative:
      "Treats worker solidarity, self-management, and freedom from both capitalist and state domination as central goods, with labor organization serving as a vehicle for collective autonomy.",
    descriptive:
      "Expects industrial unions, direct action, and federated worker organization to build class power and provide a basis for social coordination, while historical movements differed over reform, revolution, and union structure.",
    prescriptive:
      "Favors replacing capitalism and the state with federated worker organizations, using direct action rather than electoral politics.",
  },
  platformism: {
    normative:
      "Treats anarchist-communist emancipation and coordinated collective action as compatible with anti-authoritarian politics, while rejecting disorganization as an adequate basis for durable movement power.",
    descriptive:
      "Expects a shared political program, tactical coordination, collective responsibility, and federal organization to make anarchist movements more coherent and effective; the tendency originates in the 1926 Organisational Platform and remains contested within anarchism.",
    prescriptive:
      "Favors a unified but decentralized anarchist organization with collective responsibility and tactical coordination.",
  },
  "bright-green-environmentalism": {
    normative:
      "Values ecological protection alongside human prosperity and accepts technology-intensive routes to both.",
    descriptive:
      "Expects technology, urbanization, and sometimes markets to reduce ecological harm without ending prosperity.",
    prescriptive:
      "Favors technological innovation, clean energy, efficient infrastructure, urban redesign, and scalable policy or market instruments to reduce ecological harm while preserving or expanding prosperity.",
  },
  "national-socialism": {
    normative:
      "Treats racial hierarchy, antisemitic exclusion, ultranationalism, and totalizing racial-national authority as foundational commitments.",
    descriptive:
      "Expects racial hierarchy, leader-centered state power, and territorial expansion to secure the survival and regeneration of a racially defined German national community; these were Nazi ideological claims, not valid findings about human societies.",
  },
  "technocratic-centralist": {
    normative:
      "Treats expert competence and centralized administrative coordination as important grounds of political legitimacy, with less confidence in unmediated electoral judgment.",
    descriptive:
      "Its advocates may expect centralized expert administration to solve complex coordination problems more reliably than fragmented institutions or short-term majorities. That is a contestable empirical expectation, not a settled finding or a premise shared by every use of expertise in government.",
    prescriptive:
      "Favors expert-led national agencies, planning, or coordinated administration insulated to some degree from short-term electoral pressure. The label does not settle how rights review, accountability, party competition, or public participation should be secured.",
  },
  transhumanism: {
    normative:
      "Values human flourishing, autonomy, and the possibility of overcoming disease, aging, or inherited biological limits through enhancement.",
    descriptive:
      "Expects biomedical, computational, and cybernetic technologies to make human capacities more alterable and to create new conflicts over risk, access, and governance.",
    prescriptive:
      "Favors research, development, regulation, and access pathways for human enhancement, with internal disagreement over limits, safety, equality, and public or private control.",
  },
  cyberocracy: {
    normative:
      "Treats effective information circulation, adaptive coordination, and institutional capacity as important political goods, without fixing whether authority should remain human, democratic, or automated.",
    descriptive:
      "Expects electronic information infrastructures and computation to reshape bureaucracy and potentially produce democratic, authoritarian, or hybrid governing forms.",
    prescriptive:
      "Favors building and using networked information systems and computational decision support in public administration; the label alone does not settle who controls them or how they are held accountable.",
  },
  accelerationism: {
    normative:
      "Treats intensification or acceleration of technological, capitalist, or modernizing dynamics as potentially transformative rather than assuming stability or gradualism is inherently preferable.",
    descriptive:
      "Expects crises or transformations to emerge from escalating technical, economic, or social processes; left, right, and technology-centered variants make different causal and political claims.",
    prescriptive:
      "Favors strategically intensifying, redirecting, or removing constraints on selected processes to force systemic change; the concrete program varies so widely that the label does not identify one policy package.",
  },
  dataism: {
    normative:
      "Treats data generation, processing, and circulation as unusually central to knowledge, value, and social organization, while the term remains contested rather than a settled moral doctrine.",
    descriptive:
      "Expects analytics, quantification, and algorithmic systems to increasingly shape decisions and institutions, with disagreements over whether this improves knowledge or reproduces bias and power.",
    prescriptive:
      "Favors expanding data collection, measurement, optimization, and data-driven governance as tools of social coordination; privacy, ownership, accountability, and the status of human judgment remain open disputes.",
  },
  singularitarianism: {
    normative:
      "Treats the possibility of radical artificial-intelligence-driven transformation as a major horizon of human concern, hope, or risk.",
    descriptive:
      "Expects advanced artificial intelligence could become self-reinforcing or socially discontinuous enough to outpace ordinary forecasting and institutions.",
    prescriptive:
      "Favors some combination of artificial-intelligence research, safety or alignment work, preparation, and enhancement; singularitarian currents diverge over whether acceleration or restraint should take priority.",
  },
  "libertarian-municipalism": {
    descriptive:
      "Expects face-to-face local assemblies and confederated municipalities to make political power more accountable and responsive than centralized state administration, while municipalist practice ranges from reformist participation within states to stateless communalism.",
    prescriptive:
      "Favors directly democratic local assemblies joined in confederation instead of centralized state rule.",
  },
  "council-communist": {
    descriptive:
      "Expects capitalist and party-state hierarchies to block workers’ self-emancipation, while workers’ councils and federated direct control can coordinate production and political power; council-communist currents differ over transitional institutions and scale.",
  },
  syndicalist: {
    descriptive:
      "Expects autonomous worker organizations and direct action, especially strikes, to build class power more effectively than electoral parties or state administration, and sees federated unions as a basis for post-capitalist coordination; syndicalist currents vary over tactics and post-revolutionary institutions.",
  },
  participism: {
    descriptive:
      "Expects participatory worker and consumer councils, balanced job complexes, and negotiated planning to coordinate production and consumption more equitably than markets or command planning; the model is a specific proposal, not every participatory or libertarian-socialist tradition.",
  },
  agorist: {
    descriptive:
      "Expects counter-economics—voluntary exchange outside state licensing and taxation—to erode state legitimacy and build parallel institutions, with agorist currents differing over acceptable forms of exchange and transition.",
  },
  "degrowth-green": {
    descriptive:
      "Expects indefinite growth and high-throughput production in wealthy economies to conflict with ecological limits and equitable well-being, while planned reductions in energy and resource use, sufficiency, and democratic redistribution can improve ecological conditions and social welfare; degrowth research remains diverse about scale and transition.",
  },
  ordoliberalism: {
    descriptive:
      "Expects unregulated competition to produce monopoly and interest-group capture, while a strong rule-bound state can construct and maintain a competitive market order; ordoliberal currents differ over democracy, welfare, and the scope of intervention.",
  },
  ethnonationalist: {
    normative:
      "Treats an ethnic or inherited cultural community’s continuity, solidarity, and self-rule as politically important, giving that community’s membership claims priority over a purely civic account of national belonging; this does not by itself settle exclusion, hierarchy, or territorial separation.",
    prescriptive:
      "Favors state institutions and policies that protect an inherited ethnic or cultural nation’s continuity, membership boundaries, and political predominance; possible strategies range from preferential citizenship or assimilation to autonomy or separation, so the label does not specify one level of coercion or one territorial outcome.",
    descriptive:
      "Expects shared descent, inherited culture, and ethnic boundaries to provide stronger national solidarity and continuity than voluntary civic membership; ethnonationalist currents differ over how ethnicity is defined and how state membership should be enforced, and the model can be exclusionary.",
  },
  "absolute-monarchist": {
    descriptive:
      "Expects concentrated hereditary sovereignty to secure political unity and continuity more reliably than divided constitutional authority, while historical absolutist theories differed over whether the sovereign remained bound by law and over the institutions needed to exercise power.",
  },
  regionalism: {
    descriptive:
      "Expects regional self-rule and institutions closer to local identities and interests to represent communities more responsively than centralized administration; regionalist currents differ over cultural protection, federal autonomy, shared rule, and independence.",
  },
};
