import { describe, expect, it } from 'vitest'
import type { IdeologyLabel } from '../types'
import { axes } from './axes'
import {
   CURATED_IDEOLOGY_LAYER_SUMMARIES,
   getIdeologyLayerSummary,
   getIdeologyTermDefinitions,
   LAYER_EXPLAINERS,
} from './ideologyExplainers'
import { labels } from './labels'

describe('ideology explainers', () => {
   it('defines the three layers without collapsing them into one political preference', () => {
      expect(LAYER_EXPLAINERS.normative.measurement).toMatch(/morally legitimate/)
      expect(LAYER_EXPLAINERS.descriptive.measurement).toMatch(/true in the world/)
      expect(LAYER_EXPLAINERS.prescriptive.measurement).toMatch(/policies, institutions, or strategies/)
      expect(LAYER_EXPLAINERS.normative.label).toMatch(/Foundational values/)
      expect(LAYER_EXPLAINERS.prescriptive.label).toMatch(/Applied policy/)
      expect(LAYER_EXPLAINERS.normative.measurement).not.toBe(LAYER_EXPLAINERS.prescriptive.measurement)
   })

   it('produces a readable layer explanation for every catalog label', () => {
      for (const label of labels) {
         for (const layer of ['normative', 'descriptive', 'prescriptive'] as const) {
            const summary = getIdeologyLayerSummary(label, axes, layer)
            expect(summary, `${label.id}/${layer} is missing an explainer`).toMatch(/this layer asks/i)
            expect(summary.length, `${label.id}/${layer} explainer is too long`).toBeLessThanOrEqual(700)
         }
      }
   })

   it('keeps every catalog label explicit across normative, descriptive, and prescriptive layers', () => {
      const missing: string[] = []
      for (const label of labels) {
         for (const layer of ['normative', 'descriptive', 'prescriptive'] as const) {
            const summary = CURATED_IDEOLOGY_LAYER_SUMMARIES[label.id]?.[layer]
            if (!summary || summary.length <= 80) missing.push(`${label.id}/${layer}`)
            if (summary?.match(/does not currently provide/i)) missing.push(`${label.id}/${layer}:fallback`)
         }
      }
      expect(missing).toEqual([])
   })

   it('provides a direct or pattern-matched term definition for every catalog label', () => {
      for (const label of labels) {
         const definitions = getIdeologyTermDefinitions(label)
         expect(definitions.length, `${label.id} is missing a term definition`).toBeGreaterThan(0)
         expect(definitions.every((definition) => definition.length > 40), `${label.id} has a thin term definition`).toBe(true)
      }
   })

   it('uses the intended definitions for high-confusion ideology terms', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, RegExp]> = [
         ['national-traditionalist', /national continuity, inherited institutions/],
         ['fascist-authoritarian', /revolutionary ultranationalism promising national rebirth/],
         ['eco-fascism', /fascist or exclusionary ultranationalism with ecological politics/],
         ['strasserism', /radical fascist current associated with the Strasser brothers/],
         ['christian-democrat', /Christian social thought with democratic constitutionalism/],
         ['theocrat', /religious authority or binding religious doctrine/],
         ['integralism', /Catholic integralism/],
         ['fundamentalist-theocracy', /strict or literal authoritative interpretation of sacred texts/],
         ['democratic-socialist', /social ownership of major productive assets/],
         ['market-socialist', /social, public, or worker-cooperative ownership/],
         ['socialist-feminism', /gender domination together with capitalism, class, labor/],
         ['juche', /DPRK\/Kimist state ideology of political independence/],
         ['egalitarian-statist', /capable, accountable public institutions/],
         ['social-democrat', /mixed economy, welfare provision, labor rights/],
         ['universal-basic-income', /periodic cash payment delivered individually/],
         ['social-investment-state', /building and maintaining human capabilities/],
         ['right-wing-populism', /people-versus-elite antagonism/],
         ['left-wing-populism', /egalitarian, socialist, redistributive/],
         ['agrarian-populism', /rural producers or “people of the land/],
         ['cultural-populism', /defines the people and the elite through cultural identity/],
         ['zionism', /Jewish national self-determination/],
         ['civic-nationalist', /shared citizenship, political institutions/],
         ['indigenism', /Indigenous peoples’ authority/],
         ['hindutva', /Hindu-nationalist political ideology/],
         ['religious-nationalism', /fuses national identity or sovereignty/],
         ['left-wing-nationalism', /national self-determination or popular sovereignty/],
         ['expansionist-nationalism', /territorial enlargement, imperial influence/],
         ['separatist-nationalism', /autonomy, federal reorganization, or independence/],
         ['market-liberal', /market-oriented liberal position/],
         ['decentralist-market-skeptic-of-state', /market-liberal position that treats concentrated state power/],
         ['civil-libertarian-cosmopolitan', /civil-libertarian skepticism of concentrated authority/],
         ['classical-liberalism', /broad liberal tradition centered on individual liberty/],
         ['neoliberalism', /catalog’s narrower use/],
         ['social-liberalism', /individual rights and equal citizenship/],
         ['progressivism', /broad and historically changing reform tradition/],
         ['liberal-feminism', /gender equality through individual autonomy/],
         ['georgism', /socially generated value of land/],
         ['internationalism', /cooperation and obligations across national boundaries/],
         ['radical-centrism', /contested political style that rejects fixed left-right coalitions/],
         ['constitutional-monarchism', /hereditary monarch as head of state within constitutional rules/],
         ['anti-imperialism', /opposes colonial rule, external domination/],
         ['traditional-monarchist', /conservative royalist orientation/],
         ['world-federalism', /democratic federal layer of global government/],
         ['multiculturalism', /family of normative views that rejects forced assimilation/],
         ['technocratic-centralist', /centralized expert administration/],
         ['accelerationism', /left, right, and technology-centered/],
         ['cyberocracy', /speculative theory of governance/],
         ['bright-green-environmentalism', /technology- and design-optimist environmental current/],
         ['green-capitalism', /capitalist market institutions/],
         ['fascist-authoritarian', /revolutionary ultranationalism promising national rebirth/],
         ['national-socialism', /Nazi ideology of racial hierarchy/],
         ['indigenism', /Indigenous self-determination/],
         ['political-islam', /broad, contested family of movements and projects/],
         ['communitarianism', /identities and moral judgments are formed through constitutive communities/],
         ['republicanism', /freedom as non-domination/],
         ['bioregionalism', /ecologically defined places/],
         ['transhumanism', /family of philosophical and movement views/],
         ['dataism', /emerging, contested techno-philosophical term/],
         ['singularitarianism', /futurist current centered on the possibility/],
         ['world-federalism', /democratic federal layer/],
         ['council-communist', /workers’ councils/],
         ['syndicalist', /worker-run unions and direct action/],
         ['anarcho-syndicalism', /anti-state aims to syndicalist labor organization/],
         ['platformism', /theoretical and tactical unity/],
         ['mutualist', /reciprocity, cooperative exchange, and mutual credit/],
         ['agorist', /building a counter-economy/],
         ['welfare-chauvinism', /restricting immigrants’ or other out-groups’ access/],
         ['participism', /balanced job complexes/],
         ['panarchism', /voluntary, nonterritorial government/],
         ['liquid-democracy', /delegable proxy voting/],
         ['ecomodernist', /decouple human development from environmental harm/],
         ['ecosocialist', /anti-capitalist socialist transformation/],
         ['geolibertarian', /equal claim to the value of land/],
         ['anarcho-capitalist', /competing providers of law, protection, and arbitration/],
         ['anarcho-communist', /common control of productive resources/],
         ['bleeding-heart-libertarianism', /social justice and the interests of the least advantaged/],
         ['national-bolshevism', /historically varied attempts/],
         ['kemalism', /Six Arrows/],
         ['christian-reconstructionism', /Reformed Protestant theonomic movement/],
         ['fourth-theory', /Aleksandr Dugin’s anti-liberal project/],
         ['revolutionary-collectivist', /catalog umbrella/],
         ['marxist-leninist', /Soviet tradition codified under Stalin/],
         ['libertarian-socialism', /anti-capitalist and anti-authoritarian family/],
         ['maoism', /mass line, peasant mobilization/],
         ['trotskyism', /permanent and international revolution/],
         ['guild-socialism', /public ownership with democratic worker guilds/],
         ['christian-socialism', /diverse family applying Christian teachings/],
         ['utopian-socialism', /retrospective label/],
         ['neoconservative', /modern U\.S\. current/],
         ['paleoconservatism', /U\.S\. current named in the 1980s/],
         ['one-nation-conservatism', /British paternalist tradition/],
         ['fiscal-conservatism', /thin budget-policy orientation/],
         ['social-conservatism', /inherited moral norms and institutions/],
         ['national-conservatism', /national sovereignty, cultural continuity/],
         ['conservative-liberalism', /liberal-family synthesis/],
         ['liberal-conservatism', /conservative-family synthesis/],
         ['left-wing-market-anarchism', /anti-capitalist market-anarchist umbrella/],
         ['individualist-anarchism', /historically diverse anarchist family/],
         ['anarcho-primitivism', /critique of civilization/],
         ['voluntaryism', /voluntarily funded minimal state/],
         ['stirnerism', /unions of egoists/],
         ['anarcha-feminism', /feminist analysis of gender domination/],
         ['queer-anarchism', /resistance to enforced sexual and gender norms/],
         ['techno-anarchism', /encryption, anonymity, peer-to-peer systems/],
         ['technocratic-orientation', /cross-cutting preference for using specialized knowledge/],
         ['black-nationalism', /heterogeneous traditions of Black racial consciousness/],
         ['pan-africanism', /changing idea and movement for solidarity/],
      ]

      for (const [id, expected] of cases) {
         const label = byId.get(id)
         expect(label, `${id} must exist`).toBeDefined()
         expect(getIdeologyTermDefinitions(label!)).toEqual(expect.arrayContaining([expect.stringMatching(expected)]))
      }
   })

   it('does not require a complete ideology to have a named philosophy in every layer', () => {
      const label: IdeologyLabel = {
         id: 'test-label',
         name: 'Test Label',
         family: 'test',
         description: 'A test label.',
         centroid: Object.fromEntries(axes.map((axis) => [axis.id, 0])),
      }

      expect(getIdeologyLayerSummary(label, axes, 'normative')).toContain('does not currently provide a curated summary')
   })

   it('does not infer term guides from rejected or comparator traditions in prose', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))

      expect(getIdeologyTermDefinitions(byId.get('national-traditionalist')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Fascism/)]))
      expect(getIdeologyTermDefinitions(byId.get('fascist-authoritarian')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism/)]))
      expect(getIdeologyTermDefinitions(byId.get('social-conservatism')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Progressivism/)]))
      expect(getIdeologyTermDefinitions(byId.get('national-bolshevism')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism|Socialism/)]))
      expect(getIdeologyTermDefinitions(byId.get('fourth-theory')!)).not.toEqual(expect.arrayContaining([expect.stringMatching(/Liberalism|Fascism/)]))
   })

   it('keeps National Socialism separate from the generic socialism definition', () => {
      const label = labels.find((candidate) => candidate.id === 'national-socialism')!
      const definitions = getIdeologyTermDefinitions(label)

      expect(definitions).toHaveLength(1)
      expect(definitions[0]).toMatch(/Nazi ideology/)
      expect(definitions[0]).toMatch(/does not make it socialism/)
   })

   it('keeps narrowed catalog labels separate from broader family definitions', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const corporatism = getIdeologyTermDefinitions(byId.get('corporatism')!)
      const islamicDemocracy = getIdeologyTermDefinitions(byId.get('islamic-democracy')!)

      expect(corporatism).toHaveLength(1)
      expect(corporatism[0]).toMatch(/State corporatism/)
      expect(corporatism[0]).toMatch(/distinct from democratic societal/)
      expect(islamicDemocracy).toHaveLength(1)
      expect(islamicDemocracy[0]).toMatch(/electoral government, constitutional limits/)
      expect(islamicDemocracy[0]).not.toMatch(/broad family of projects/)
   })

   it('distinguishes council, syndicalist, and platformist organization instead of showing only parent-family guides', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['council-communist', /rather than parliament or a vanguard party/],
         ['syndicalist', /institutional basis for workers’ control afterward/],
         ['anarcho-syndicalism', /abolish capitalism and the state/],
         ['platformism', /collective responsibility, and federalism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('defines unfamiliar compound labels without substituting a broader parent-family guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases = [
         'mutualist',
         'agorist',
         'welfare-chauvinism',
         'participism',
         'panarchism',
         'liquid-democracy',
         'ecomodernist',
         'ecosocialist',
         'geolibertarian',
         'anarcho-capitalist',
         'anarcho-communist',
         'bleeding-heart-libertarianism',
         'national-bolshevism',
         'kemalism',
         'christian-reconstructionism',
         'fourth-theory',
      ]

      for (const id of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes socialist traditions instead of substituting one generic socialism or Marxism guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases = [
         'revolutionary-collectivist',
         'marxist-leninist',
         'libertarian-socialism',
         'maoism',
         'trotskyism',
         'guild-socialism',
         'christian-socialism',
         'utopian-socialism',
      ]

      for (const id of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
      }

      expect(getIdeologyTermDefinitions(byId.get('libertarian-socialism')!)[0]).toMatch(/distinct from right-libertarian/)
      expect(getIdeologyTermDefinitions(byId.get('christian-socialism')!)[0]).toMatch(/disagree over markets, ownership/)
      expect(getIdeologyTermDefinitions(byId.get('utopian-socialism')!)[0]).toMatch(/not one doctrine/)
   })

   it('distinguishes technocratic, futurist, and green-technology labels instead of substituting broad parent guides', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['technocratic-centralist', /ordinary electoral judgment/],
         ['transhumanism', /distinct from posthumanism/],
         ['cyberocracy', /democratic to authoritarian or hybrid/],
         ['accelerationism', /not simply faster policy/],
         ['dataism', /not a settled political movement/],
         ['singularitarianism', /not a synonym for all AI optimism/],
         ['bright-green-environmentalism', /not identical to green capitalism/],
         ['green-capitalism', /rather than requiring its abolition/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes liberal and cosmopolitan variants instead of substituting generic liberalism', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['market-liberal', /distinct from social liberalism/],
         ['decentralist-market-skeptic-of-state', /distinct from socialist anarchism/],
         ['civil-libertarian-cosmopolitan', /does not by itself settle property/],
         ['classical-liberalism', /not identical to contemporary libertarianism/],
         ['neoliberalism', /broader term remains historically contested/],
         ['social-liberalism', /does not imply socialism/],
         ['world-federalism', /stronger than international cooperation alone/],
         ['multiculturalism', /not simply the demographic fact of diversity/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes populist variants instead of substituting the generic populism guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['right-wing-populism', /right-leaning host such as nationalism/],
         ['left-wing-populism', /distinct from social democracy/],
         ['agrarian-populism', /can be progressive, conservative, socialist, or pro-market/],
         ['cultural-populism', /not identical to right-wing populism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/thin-centered|broad family of traditions|family of theories/)
      }
   })

   it('distinguishes social-democratic variants instead of substituting the generic welfare guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['egalitarian-statist', /distinct from authoritarian state socialism/],
         ['social-democrat', /does not by itself require abolishing capitalism/],
         ['universal-basic-income', /without a means test or work requirement/],
         ['social-investment-state', /not a synonym for passive income maintenance/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes socialist variants instead of substituting the generic socialism guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['democratic-socialist', /stronger ownership distinction from social democracy/],
         ['market-socialist', /differs from both private-capitalist ownership and command planning/],
         ['socialist-feminism', /without claiming they are identical/],
         ['juche', /not generic socialism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes religious-authority variants instead of substituting a generic religious guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['christian-democrat', /not equivalent to theocracy/],
         ['theocrat', /not merely personal faith/],
         ['integralism', /not synonymous with every clerical-fascist movement/],
         ['fundamentalist-theocracy', /more specific than theocracy/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes authoritarian-nationalist variants instead of substituting generic authoritarianism', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['national-traditionalist', /distinct from ethnonationalism and fascist ultranationalism/],
         ['fascist-authoritarian', /not generic authoritarianism/],
         ['eco-fascism', /strong environmental regulation or environmental concern alone is not eco-fascism/],
         ['strasserism', /does not make it socialism or generic market socialism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes liberal-family variants instead of substituting generic liberalism', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['progressivism', /not synonymous with technocracy/],
         ['liberal-feminism', /distinct from feminist traditions/],
         ['georgism', /historic single tax is one formulation/],
         ['internationalism', /broader than cosmopolitanism/],
         ['radical-centrism', /contested political style/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes community, civic, ecological, and religious-political traditions from generic family guides', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['communitarianism', /not one socialist or anti-liberal state program/],
         ['republicanism', /not a contemporary party label or one regime template/],
         ['bioregionalism', /not simple localism or one economic model/],
         ['political-islam', /not synonymous with Islam, Muslim civic participation/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes monarchist forms and anti-imperialism from neighboring traditions', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases: Array<[string, RegExp]> = [
         ['constitutional-monarchism', /not a synonym for traditional or absolute monarchy/],
         ['anti-imperialism', /cross-cutting orientation/],
         ['traditional-monarchist', /differs from constitutional monarchism/],
      ]

      for (const [id, expected] of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).toMatch(expected)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|family of theories/)
      }
   })

   it('distinguishes conservative traditions instead of substituting one generic conservatism guide', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases = [
         'neoconservative',
         'paleoconservatism',
         'one-nation-conservatism',
         'fiscal-conservatism',
         'social-conservatism',
         'national-conservatism',
         'conservative-liberalism',
         'liberal-conservatism',
      ]

      for (const id of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
      }

      expect(getIdeologyTermDefinitions(byId.get('neoconservative')!)[0]).toMatch(/not simply any hawkish conservatism/)
      expect(getIdeologyTermDefinitions(byId.get('fiscal-conservatism')!)[0]).toMatch(/does not determine social or foreign policy/)
      expect(getIdeologyTermDefinitions(byId.get('conservative-liberalism')!)[0]).toMatch(/historically variable and overlaps/)
      expect(getIdeologyTermDefinitions(byId.get('liberal-conservatism')!)[0]).toMatch(/historically variable and overlaps/)
   })

   it('distinguishes anarchist and anti-state currents instead of substituting generic anarchism', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases = [
         'left-wing-market-anarchism',
         'individualist-anarchism',
         'anarcho-primitivism',
         'voluntaryism',
         'stirnerism',
         'anarcha-feminism',
         'queer-anarchism',
         'techno-anarchism',
      ]

      for (const id of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).not.toMatch(/subjects political authority|socialist, mutualist, individualist/)
      }

      expect(getIdeologyTermDefinitions(byId.get('left-wing-market-anarchism')!)[0]).toMatch(/not a synonym for anarcho-capitalism/)
      expect(getIdeologyTermDefinitions(byId.get('individualist-anarchism')!)[0]).toMatch(/not a synonym for egoist anarchism/)
      expect(getIdeologyTermDefinitions(byId.get('voluntaryism')!)[0]).toMatch(/does not automatically mean anarchism/)
      expect(getIdeologyTermDefinitions(byId.get('stirnerism')!)[0]).toMatch(/not ordinary selfishness/)
      expect(getIdeologyTermDefinitions(byId.get('techno-anarchism')!)[0]).toMatch(/not a synonym for blockchain advocacy/)
   })

   it('distinguishes nationalist membership and sovereignty traditions instead of substituting generic nationalism', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directOnlyCases = [
         'civic-nationalist',
         'indigenism',
         'hindutva',
         'religious-nationalism',
         'zionism',
         'left-wing-nationalism',
         'expansionist-nationalism',
         'separatist-nationalism',
      ]

      for (const id of directOnlyCases) {
         const definitions = getIdeologyTermDefinitions(byId.get(id)!)
         expect(definitions, id).toHaveLength(1)
         expect(definitions[0], id).not.toMatch(/broad family of traditions|subjects political authority/)
      }

      expect(getIdeologyTermDefinitions(byId.get('civic-nationalist')!)[0]).toMatch(/does not guarantee liberal democracy/)
      expect(getIdeologyTermDefinitions(byId.get('indigenism')!)[0]).toMatch(/not one uniform political program/)
      expect(getIdeologyTermDefinitions(byId.get('hindutva')!)[0]).toMatch(/not the same as Hinduism as a religion/)
      expect(getIdeologyTermDefinitions(byId.get('zionism')!)[0]).toMatch(/not a synonym for any one government/)
      expect(getIdeologyTermDefinitions(byId.get('expansionist-nationalism')!)[0]).toMatch(/distinct from nationalism in general/)
      expect(getIdeologyTermDefinitions(byId.get('separatist-nationalism')!)[0]).toMatch(/does not by itself settle/)
   })

   it('defines theocracy and high-confusion labels directly from stable ids', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const directCases: Array<[string, RegExp]> = [
         ['fundamentalist-theocracy', /strict or literal authoritative interpretation/],
         ['neoreactionary', /anti-democratic current/],
         ['distributism', /dispersed ownership/],
         ['deep-ecology', /nonhuman life/],
         ['objectivism', /Ayn Rand/],
         ['democratic-confederalism', /local assemblies/],
         ['libertarian-municipalism', /local assemblies/],
      ]

      for (const [id, expected] of directCases) {
         expect(getIdeologyTermDefinitions(byId.get(id)!)[0], id).toMatch(expected)
      }
   })

   it('uses curated influences deterministically instead of converting centroid poles into doctrine', () => {
      const label = labels.find((candidate) => candidate.id === 'anarcho-capitalist')!
      const forward = getIdeologyLayerSummary(label, axes, 'normative')
      const reversed = getIdeologyLayerSummary(label, [...axes].reverse(), 'normative')

      expect(forward).toBe(reversed)
      expect(forward).toContain('self-ownership and voluntary association')
      expect(forward).not.toContain('strongest distinctions')
      expect(forward).not.toContain('equally strong positions omitted')
   })

   it('uses explicit layer-keyed copy where general influence notes would conflate values, beliefs, and strategy', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))

      for (const [id, summaries] of Object.entries(CURATED_IDEOLOGY_LAYER_SUMMARIES)) {
         const label = byId.get(id)
         expect(label, `${id} must exist`).toBeDefined()
         for (const [layer, expected] of Object.entries(summaries)) {
            expect(getIdeologyLayerSummary(label!, axes, layer as 'normative' | 'descriptive' | 'prescriptive')).toContain(expected)
         }
      }

      expect(getIdeologyLayerSummary(byId.get('national-socialism')!, axes, 'normative')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('technocratic-centralist')!, axes, 'descriptive')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('theocrat')!, axes, 'prescriptive')).not.toMatch(/does not imply/i)
      expect(getIdeologyLayerSummary(byId.get('libertarian-municipalism')!, axes, 'prescriptive')).not.toMatch(/does not imply/i)
   })

   it('replaces false missing-summary fallbacks where label metadata already states the layer doctrine', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, 'normative' | 'descriptive' | 'prescriptive', RegExp]> = [
         ['ecomodernist', 'normative', /human flourishing and ecological protection/],
         ['ecomodernist', 'descriptive', /technological modernization, urbanization, and intensified production.*global, fast-enough absolute form remains unestablished/],
         ['kemalism', 'descriptive', /secular, scientifically modernizing republic.*unified Turkish national identity.*Kemalist currents differ/],
         ['christian-reconstructionism', 'descriptive', /secular legal neutrality.*theonomic biblical norms.*Christian social order/],
         ['revolutionary-collectivist', 'descriptive', /capitalist property relations.*class domination.*revolutionary seizure.*centralized collective ownership/],
         ['marxist-leninist', 'descriptive', /capitalist class power and crisis.*disciplined vanguard party.*planned social ownership/],
         ['maoism', 'descriptive', /agrarian or peripheral societies.*peasant mobilization.*protracted struggle.*mass-line leadership/],
         ['trotskyism', 'descriptive', /socialism isolated within one country.*bureaucratic degeneration.*international or “permanent” revolution/],
         ['guild-socialism', 'descriptive', /capitalist industrial hierarchy.*workers democratic control.*public ownership and worker guilds/],
         ['paleoconservatism', 'descriptive', /liberal internationalism.*mass immigration.*multiculturalism.*national cohesion.*economic nationalism/],
         ['one-nation-conservatism', 'descriptive', /social division and insecurity.*national cohesion.*paternalist welfare.*competitive enterprise/],
         ['fiscal-conservatism', 'descriptive', /persistent deficits.*debt accumulation.*expansive public budgets.*sustainable public finances/],
         ['social-conservatism', 'descriptive', /rapid changes in family, gender, sexual, or religious norms.*social cohesion.*traditional authority/],
         ['national-conservatism', 'descriptive', /cosmopolitan or supranational institutions.*liberal universalism.*national solidarity.*national sovereignty/],
         ['conservative-liberalism', 'descriptive', /constitutional rules.*competitive market order.*unregulated market power.*centralized economic direction/],
         ['liberal-conservatism', 'descriptive', /abrupt social redesign.*inherited institutions and social order.*constitutional rights.*cautious reform/],
         ['council-communist', 'descriptive', /capitalist and party-state hierarchies.*workers’ self-emancipation.*workers’ councils.*federated direct control/],
         ['syndicalist', 'descriptive', /autonomous worker organizations and direct action.*strikes.*federated unions/],
         ['libertarian-socialism', 'descriptive', /capitalist concentration and centralized party-state control.*worker self-management.*voluntary federation/],
         ['participism', 'descriptive', /participatory worker and consumer councils.*balanced job complexes.*negotiated planning/],
         ['agorist', 'descriptive', /counter-economics.*voluntary exchange outside state licensing and taxation.*state legitimacy/],
         ['degrowth-green', 'descriptive', /indefinite growth and high-throughput production.*ecological limits.*planned reductions in energy and resource use/],
         ['ordoliberalism', 'descriptive', /unregulated competition.*monopoly and interest-group capture.*strong rule-bound state.*competitive market order/],
         ['ethnonationalist', 'descriptive', /shared descent.*inherited culture.*ethnic boundaries.*national solidarity.*voluntary civic membership/],
         ['absolute-monarchist', 'descriptive', /concentrated hereditary sovereignty.*political unity and continuity.*divided constitutional authority/],
         ['regionalism', 'descriptive', /regional self-rule.*local identities and interests.*centralized administration.*federal autonomy/],
         ['anarcho-capitalist', 'descriptive', /private providers.*law, protection, and arbitration.*equal access to law/],
         ['anarcho-capitalist', 'prescriptive', /competitive private provision of law/],
         ['market-socialist', 'descriptive', /markets and prices to coordinate dispersed information/],
         ['christian-democrat', 'prescriptive', /subsidiarity, social-market institutions/],
         ['republicanism', 'prescriptive', /checks on arbitrary power/],
         ['distributism', 'prescriptive', /dispersing productive property/],
         ['distributism', 'descriptive', /concentrated ownership.*economic independence/],
         ['world-federalism', 'prescriptive', /federal layer of world government/],
         ['radical-democracy', 'prescriptive', /beyond periodic elections/],
         ['christian-socialism', 'prescriptive', /cooperative organization, labor protection/],
         ['green-capitalism', 'normative', /ecological protection alongside human prosperity/],
         ['green-capitalism', 'prescriptive', /carbon pricing, renewable-energy markets/],
         ['deep-ecology', 'normative', /nonhuman life and ecological systems.*value independent of their usefulness/],
         ['deep-ecology', 'descriptive', /anthropocentric industrial practices, pollution, and resource depletion/],
         ['deep-ecology', 'prescriptive', /restraint in human impacts, respect for ecological diversity/],
         ['eco-authoritarianism', 'normative', /ecological protection as an overriding political priority/],
         ['eco-authoritarianism', 'descriptive', /ecological crisis.*centralized expertise/],
         ['eco-authoritarianism', 'prescriptive', /powerful centralized authority.*command-and-control environmental rules/],
         ['radical-democracy', 'normative', /democratic equality, active participation, and the contestability/],
         ['radical-democracy', 'descriptive', /settled representative institutions and dominant hegemonies/],
         ['radical-democracy', 'prescriptive', /beyond periodic elections/],
         ['liquid-democracy', 'normative', /voter autonomy and flexible participation/],
         ['liquid-democracy', 'descriptive', /direct voting and voluntary, revisable proxy delegation/],
         ['liquid-democracy', 'prescriptive', /delegable proxy voting/],
         ['democratic-confederalism', 'normative', /grassroots self-government, pluralism, ecological responsibility/],
         ['democratic-confederalism', 'descriptive', /local communities and assemblies, linked through delegated coordination/],
         ['democratic-confederalism', 'prescriptive', /linked local assemblies and councils/],
         ['corporatism', 'prescriptive', /under strong state direction to mediate represented interests/],
         ['corporatism', 'descriptive', /occupational bodies under state direction.*authoritarian state corporatism/],
         ['corporatism', 'normative', /organized occupational and sectoral representation.*social harmony.*coordinated public direction/],
         ['kemalism', 'normative', /republican sovereignty, secular public authority.*scientific modernization/],
         ['fiscal-conservatism', 'normative', /sustainable public finances.*fairness across present and future taxpayers/],
         ['ethnonationalist', 'prescriptive', /protect an inherited ethnic or cultural nation’s continuity.*membership boundaries/],
         ['islamic-democracy', 'prescriptive', /electoral and constitutional government.*Islamic ethical or legal framework/],
         ['fourth-theory', 'prescriptive', /autonomous post-liberal political model.*civilizational plurality and multipolar coordination/],
         ['anarcho-syndicalism', 'normative', /worker solidarity, self-management/],
         ['anarcho-syndicalism', 'descriptive', /industrial unions, direct action, and federated worker organization/],
         ['platformism', 'normative', /anarchist-communist emancipation and coordinated collective action/],
         ['platformism', 'descriptive', /shared political program, tactical coordination, collective responsibility/],
         ['liberal-feminism', 'prescriptive', /legal reform, equal rights/],
         ['mutualist', 'prescriptive', /mutual credit, cooperative exchange/],
         ['geolibertarian', 'descriptive', /self-ownership and market exchange.*equal claims to natural opportunities/],
         ['mutualist', 'normative', /reciprocity, worker autonomy, equal exchange/],
         ['mutualist', 'descriptive', /cooperative markets and mutual-credit institutions/],
         ['minarchist', 'normative', /individual rights in life, liberty, property, and contract/],
         ['minarchist', 'descriptive', /public system of police, courts, and defense/],
         ['minarchist', 'prescriptive', /minimal state limited mainly to protecting rights/],
         ['ecomodernist', 'prescriptive', /technological innovation, resource-efficient infrastructure/],
         ['ecosocialist', 'descriptive', /capitalist accumulation and profit-driven growth.*collective ownership and democratic planning/],
         ['ecosocialist', 'prescriptive', /social ownership and democratic planning/],
         ['geolibertarian', 'normative', /equal claim to the value of land/],
         ['geolibertarian', 'prescriptive', /land or resource rent/],
         ['anarcho-communist', 'prescriptive', /stateless federations/],
         ['anarcho-communist', 'descriptive', /decentralized communal production and sharing/],
         ['bleeding-heart-libertarianism', 'normative', /individual liberty and social justice/],
         ['bleeding-heart-libertarianism', 'descriptive', /market mechanisms, voluntary cooperation, and property rights.*vulnerable or least-advantaged people/],
         ['kemalism', 'prescriptive', /Six Arrows program/],
         ['christian-reconstructionism', 'prescriptive', /theonomic biblical law/],
         ['revolutionary-collectivist', 'prescriptive', /centralized public ownership or state power/],
         ['marxist-leninist', 'prescriptive', /disciplined vanguard party taking state power/],
         ['libertarian-socialism', 'prescriptive', /worker self-management, social ownership/],
         ['maoism', 'prescriptive', /mass-line organizing, peasant or peripheral mobilization/],
         ['trotskyism', 'prescriptive', /permanent international revolution/],
         ['guild-socialism', 'prescriptive', /public ownership of industry.*democratic worker guilds/],
         ['utopian-socialism', 'prescriptive', /moral persuasion, model communities/],
         ['neoconservative', 'normative', /liberal-democratic institutions/],
         ['neoconservative', 'descriptive', /authoritarian or totalitarian threats.*national security, military power/],
         ['neoconservative', 'prescriptive', /assertive U\.S\. or allied international role/],
         ['paleoconservatism', 'prescriptive', /less interventionist foreign policy than neoconservatism/],
         ['one-nation-conservatism', 'prescriptive', /cost-conscious welfare provision/],
         ['fiscal-conservatism', 'prescriptive', /sustainable public finances/],
         ['social-conservatism', 'normative', /inherited moral norms and institutions/],
         ['social-conservatism', 'prescriptive', /preserving or reinforcing traditional social institutions/],
         ['national-conservatism', 'normative', /national sovereignty, cultural continuity/],
         ['national-conservatism', 'prescriptive', /strengthening the nation-state/],
         ['national-socialism', 'descriptive', /leader-centered state power.*territorial expansion.*secure the survival/],
         ['conservative-liberalism', 'normative', /liberal rights, rule of law/],
         ['conservative-liberalism', 'prescriptive', /constitutional market order and gradual reform/],
         ['liberal-conservatism', 'normative', /conservative concern for continuity/],
         ['liberal-conservatism', 'prescriptive', /cautious reform, a market economy/],
         ['left-wing-market-anarchism', 'normative', /opposition to state privilege, exploitation/],
         ['left-wing-market-anarchism', 'prescriptive', /stateless freed markets/],
         ['individualist-anarchism', 'normative', /individual self-direction and voluntary association/],
         ['individualist-anarchism', 'descriptive', /compulsory authority.*individual autonomy.*voluntary cooperation/],
         ['individualist-anarchism', 'prescriptive', /natural-rights, mutualist, and egoist currents/],
         ['anarcho-primitivism', 'normative', /freedom from civilizational domination/],
         ['anarcho-primitivism', 'descriptive', /domestication, agriculture, symbolic systems, division of labor/],
         ['anarcho-primitivism', 'prescriptive', /deindustrialization, rewilding/],
         ['voluntaryism', 'normative', /consent, individual liberty, and voluntary support/],
         ['voluntaryism', 'prescriptive', /voluntarily funded minimal state/],
         ['stirnerism', 'normative', /fixed moral, political, or social abstractions/],
         ['stirnerism', 'descriptive', /fixed ideas.*independent authorities.*unions of egoists/],
         ['stirnerism', 'prescriptive', /no single institutional blueprint/],
         ['utopian-socialism', 'descriptive', /deliberate social reconstruction.*model communities.*cooperative experiments.*Saint-Simonian, Fourierist, and Owenite/],
         ['anarcha-feminism', 'normative', /patriarchy and gender subordination/],
         ['anarcha-feminism', 'descriptive', /patriarchy, gendered divisions of labor, sexual regulation/],
         ['anarcha-feminism', 'prescriptive', /intimate life, work, political organization/],
         ['queer-anarchism', 'normative', /coercive sexual and gender hierarchy/],
         ['queer-anarchism', 'prescriptive', /does not impose one universal account/],
         ['techno-anarchism', 'normative', /privacy, autonomy, and resistance/],
         ['techno-anarchism', 'descriptive', /encryption, anonymity, distributed trust/],
         ['techno-anarchism', 'prescriptive', /encryption, anonymity systems, peer-to-peer protocols/],
         ['civic-nationalist', 'normative', /shared civic membership, political self-government/],
         ['civic-nationalist', 'descriptive', /shared citizenship.*solidarity.*civic criteria can still be exclusionary/],
         ['civic-nationalist', 'prescriptive', /inclusive citizenship, common political institutions/],
         ['panarchism', 'descriptive', /territorial monopoly.*voluntary nonterritorial states/],
         ['indigenism', 'normative', /Indigenous collective self-determination/],
         ['indigenism', 'descriptive', /imposed state or market institutions.*Indigenous authority/],
         ['indigenism', 'prescriptive', /Indigenous governance, land and resource rights/],
         ['hindutva', 'normative', /Hindu civilizational or national identity/],
         ['hindutva', 'descriptive', /culturally unified Hindu nation.*modern, historically developing discourse/],
         ['hindutva', 'prescriptive', /Hindu-nationalist conception of India/],
         ['religious-nationalism', 'normative', /religious tradition and the national community/],
         ['religious-nationalism', 'descriptive', /shared religious identity.*national solidarity.*state authority/],
         ['religious-nationalism', 'prescriptive', /religiously informed law/],
         ['zionism', 'normative', /Jewish national self-determination/],
         ['zionism', 'prescriptive', /Land of Israel/],
         ['left-wing-nationalism', 'normative', /social equality, anti-colonial solidarity/],
         ['left-wing-nationalism', 'descriptive', /imperial domination and unequal international integration.*national liberation/],
         ['left-wing-nationalism', 'prescriptive', /national liberation, redistributive or socialist policy/],
         ['expansionist-nationalism', 'normative', /territorial enlargement, external influence/],
         ['expansionist-nationalism', 'prescriptive', /territorial acquisition, imperial administration/],
         ['separatist-nationalism', 'normative', /distinct national or regional community’s self-government/],
         ['separatist-nationalism', 'descriptive', /autonomy, federal reorganization, or independence.*autonomy can reduce it/],
         ['separatist-nationalism', 'prescriptive', /autonomy, federal reorganization, or secession/],
         ['christian-democrat', 'normative', /human dignity, solidarity, family and civil society/],
         ['christian-democrat', 'prescriptive', /democratic constitutionalism, subsidiarity, social-market institutions/],
         ['theocrat', 'normative', /binding religious doctrine or recognized religious authority/],
         ['theocrat', 'prescriptive', /final civil-law legitimacy/],
         ['integralism', 'normative', /Catholic truth, the common good, and ordered social authority/],
         ['integralism', 'prescriptive', /Catholicly informed public law/],
         ['fundamentalist-theocracy', 'normative', /strict or literal fidelity to authoritative scripture/],
         ['fundamentalist-theocracy', 'prescriptive', /religious law and state institutions enforcing a strict sacred-text interpretation/],
         ['national-traditionalist', 'normative', /national continuity, inherited institutions, cultural tradition/],
         ['national-traditionalist', 'prescriptive', /protecting national institutions, inherited practices/],
         ['fascist-authoritarian', 'normative', /organic national unity, rebirth, hierarchy/],
         ['fascist-authoritarian', 'prescriptive', /authoritarian mass mobilization, centralized leadership/],
         ['eco-fascism', 'normative', /ecological integrity or territorial nature/],
         ['eco-fascism', 'prescriptive', /authoritarian or exclusionary ecological measures/],
         ['strasserism', 'normative', /national rebirth, revolutionary hierarchy and discipline/],
         ['strasserism', 'prescriptive', /fascist mass mobilization and a strong state/],
         ['democratic-socialist', 'normative', /democratic control of economic power and social ownership/],
         ['democratic-socialist', 'prescriptive', /democratic social ownership or control of major productive assets/],
         ['market-socialist', 'normative', /social or worker ownership/],
         ['market-socialist', 'prescriptive', /social, public, or cooperative ownership with market pricing/],
         ['socialist-feminism', 'normative', /gender liberation and the transformation of class and property relations/],
         ['socialist-feminism', 'prescriptive', /collective action against patriarchy and capitalist exploitation/],
         ['juche', 'normative', /political autonomy, national self-reliance, collective discipline/],
         ['juche', 'prescriptive', /political independence, state-directed economic self-reliance, military self-defense/],
         ['egalitarian-statist', 'normative', /material equality and effective public provision/],
         ['egalitarian-statist', 'prescriptive', /progressive redistribution, broad social provision/],
         ['social-democrat', 'normative', /freedom and equality as requiring democratic control/],
         ['social-democrat', 'prescriptive', /mixed-economy reform through elections/],
         ['universal-basic-income', 'normative', /unconditional income floor/],
         ['universal-basic-income', 'prescriptive', /periodic cash payment to all individuals/],
         ['social-investment-state', 'normative', /capabilities across the life course/],
         ['social-investment-state', 'prescriptive', /build, mobilize, and preserve capabilities/],
         ['right-wing-populism', 'normative', /authentic or national people as the rightful source/],
         ['right-wing-populism', 'prescriptive', /majoritarian, anti-establishment, nationalist/],
         ['left-wing-populism', 'normative', /ordinary people, especially subordinated or working groups/],
         ['left-wing-populism', 'prescriptive', /redistribution, public control, or economic democracy/],
         ['agrarian-populism', 'normative', /small producers, rural communities, land-based livelihoods/],
         ['agrarian-populism', 'prescriptive', /producer protections, cooperative or distributed ownership/],
         ['cultural-populism', 'normative', /cultural belonging, everyday norms, or community recognition/],
         ['cultural-populism', 'prescriptive', /protect or restore a preferred cultural order/],
         ['market-liberal', 'normative', /private property, individual liberty, legal equality/],
         ['market-liberal', 'prescriptive', /competitive markets, secure private property/],
         ['decentralist-market-skeptic-of-state', 'normative', /concentrated authority and dependence on centralized administration/],
         ['decentralist-market-skeptic-of-state', 'prescriptive', /decentralizing provision, expanding exit/],
         ['civil-libertarian-cosmopolitan', 'normative', /individual civil liberty and moral concern beyond national borders/],
         ['civil-libertarian-cosmopolitan', 'prescriptive', /strong civil liberties, decentralized institutions/],
         ['classical-liberalism', 'normative', /individual liberty, private property, voluntary exchange/],
         ['classical-liberalism', 'prescriptive', /constitutionally limited government/],
         ['neoliberalism', 'descriptive', /competition, price signals, expert regulation/],
         ['neoliberalism', 'prescriptive', /competition policy, market mechanisms/],
         ['social-liberalism', 'normative', /individual liberty and equal citizenship/],
         ['social-liberalism', 'prescriptive', /rights-based public provision, social insurance/],
         ['progressivism', 'normative', /deliberate social improvement, equal civic standing/],
         ['progressivism', 'descriptive', /empirical inquiry, public administration, and institutional experimentation/],
         ['progressivism', 'prescriptive', /evidence-informed institutional reform, public programs/],
         ['liberal-feminism', 'normative', /equal rights, autonomy, legal status, and opportunity/],
         ['liberal-feminism', 'prescriptive', /legal reform, equal rights, anti-discrimination protections/],
         ['georgism', 'normative', /value created by their labor and improvements/],
         ['georgism', 'prescriptive', /public capture of land or resource rent/],
         ['internationalism', 'normative', /obligations, cooperation, and rights across national boundaries/],
         ['internationalism', 'prescriptive', /international cooperation, institutions, treaties/],
         ['radical-centrism', 'normative', /practical problem-solving, pluralist compromise/],
         ['radical-centrism', 'prescriptive', /pragmatic cross-cutting coalitions/],
         ['constitutional-monarchism', 'normative', /hereditary continuity or a nonpartisan head of state/],
         ['constitutional-monarchism', 'prescriptive', /hereditary crown bounded by constitutional rules/],
         ['anti-imperialism', 'normative', /political equality, self-determination/],
         ['anti-imperialism', 'prescriptive', /decolonization, national or popular self-government/],
         ['traditional-monarchist', 'normative', /dynastic continuity, inherited authority/],
         ['traditional-monarchist', 'prescriptive', /preserving or restoring a hereditary monarchy/],
         ['communitarianism', 'normative', /shared community, social membership, tradition/],
         ['communitarianism', 'prescriptive', /civic participation, institutions that sustain community/],
         ['republicanism', 'normative', /civic self-government, equal civic standing/],
         ['republicanism', 'descriptive', /domination to persist whenever people or groups remain dependent/],
         ['bioregionalism', 'normative', /ecological integrity, place-based belonging/],
         ['bioregionalism', 'prescriptive', /governance, land use, and resource management organized around ecological regions/],
         ['political-islam', 'normative', /Islamic principles as relevant to public authority, law/],
         ['political-islam', 'prescriptive', /public role for Islamic normative or legal principles/],
         ['islamic-democracy', 'descriptive', /elected government, constitutional rights, and Islamic ethical or legal review/],
         ['world-federalism', 'normative', /shared political institutions capable of securing peace/],
         ['world-federalism', 'descriptive', /problems that cross borders/],
         ['multiculturalism', 'normative', /cultural membership and the ability to maintain distinctive identities/],
         ['multiculturalism', 'prescriptive', /recognition, accommodation, or group-differentiated rights/],
         ['technocratic-centralist', 'normative', /expert competence and centralized administrative coordination/],
         ['technocratic-centralist', 'prescriptive', /expert-led national agencies, planning/],
         ['transhumanism', 'normative', /human flourishing, autonomy/],
         ['transhumanism', 'prescriptive', /human enhancement/],
         ['cyberocracy', 'descriptive', /electronic information infrastructures/],
         ['cyberocracy', 'prescriptive', /networked information systems/],
         ['accelerationism', 'normative', /intensification or acceleration/],
         ['accelerationism', 'prescriptive', /strategically intensifying/],
         ['dataism', 'normative', /data generation, processing, and circulation/],
         ['dataism', 'prescriptive', /data collection, measurement, optimization/],
         ['singularitarianism', 'descriptive', /advanced artificial intelligence/],
         ['singularitarianism', 'prescriptive', /safety or alignment work/],
         ['bright-green-environmentalism', 'prescriptive', /clean energy, efficient infrastructure/],
         ['green-capitalism', 'descriptive', /prices, investment, firms, and innovation/],
         ['objectivism', 'descriptive', /objective reality to constrain thought and reason to provide reliable knowledge/],
         ['neoreactionary', 'descriptive', /electoral democracy to produce instability, elite capture, or short-termism/],
         ['paleolibertarianism', 'descriptive', /welfare-state expansion, interventionist foreign policy/],
         ['welfare-chauvinism', 'descriptive', /bounded national or ethnic welfare community/],
         ['libertarian-municipalism', 'descriptive', /face-to-face local assemblies and confederated municipalities/],
         ['voluntaryism', 'descriptive', /compulsory taxation and state direction to create intrusion/],
         ['national-bolshevism', 'descriptive', /strong, anti-liberal state.*national power/],
         ['fourth-theory', 'descriptive', /civilizational pluralism and multipolar great spaces/],
         ['zionism', 'descriptive', /Jewish national self-determination.*collective survival/],
         ['christian-socialism', 'descriptive', /industrial capitalism’s concentration of wealth and power/],
         ['left-wing-market-anarchism', 'descriptive', /legal privilege and state-backed corporate power/],
         ['queer-anarchism', 'descriptive', /rigid sexual and gender norms.*wider political, economic, and social hierarchies/],
         ['expansionist-nationalism', 'descriptive', /territorial enlargement or external influence.*national strength, security, status/],
      ]

      for (const [id, layer, expected] of cases) {
         const summary = getIdeologyLayerSummary(byId.get(id)!, axes, layer)
         expect(summary, `${id}/${layer}`).toMatch(expected)
         expect(summary, `${id}/${layer}`).not.toMatch(/does not currently provide/i)
      }
   })

   it('scopes historically variable or author-specific radical-right labels', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const nationalBolshevism = byId.get('national-bolshevism')!
      const fourthTheory = byId.get('fourth-theory')!

      expect(nationalBolshevism.description).toMatch(/historically variable/)
      expect(nationalBolshevism.description).toMatch(/post-Soviet authoritarian nationalist current/)
      expect(nationalBolshevism.usageNote).toMatch(/distinct interwar German currents/)
      expect(fourthTheory.description).toMatch(/does not provide one settled economic program/)
      expect(fourthTheory.usageNote).toMatch(/claimed break.*disputes|disputes.*claimed break/)
   })

   it('scopes Juche and National Bolshevism to their modeled historical reference cases', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const juche = byId.get('juche')!
      const nationalBolshevism = byId.get('national-bolshevism')!

      expect(juche.description).toMatch(/state-directed self-reliance/)
      expect(juche.description).not.toMatch(/economic self-sufficiency/)
      expect(juche.cautionNote).toMatch(/not.*economically autarkic/)
      expect(juche.normativePhilosophies).toContain('Juche')
      expect(nationalBolshevism.description).toMatch(/reference case/)
      expect(nationalBolshevism.cautionNote).toMatch(/historically bounded specialist label/)
   })

   it('does not invent unrelated layer doctrine for broad or cross-cutting labels', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))
      const cases: Array<[string, 'normative' | 'descriptive' | 'prescriptive', RegExp]> = [
         ['multiculturalism', 'normative', /own nation/i],
         ['panarchism', 'prescriptive', /state action and public provision/i],
         ['eco-authoritarianism', 'prescriptive', /exit into private/i],
         ['transhumanism', 'prescriptive', /electoral channels/i],
         ['voluntaryism', 'prescriptive', /the state is illegitimate/i],
      ]

      for (const [id, layer, forbidden] of cases) {
         expect(getIdeologyLayerSummary(byId.get(id)!, axes, layer), `${id}/${layer}`).not.toMatch(forbidden)
      }

      expect(getIdeologyLayerSummary(byId.get('voluntaryism')!, axes, 'prescriptive')).toMatch(/voluntarily funded minimal state/i)
   })

   it('keeps conceptual and heterogeneous descriptive summaries qualified', () => {
      const byId = new Map(labels.map((label) => [label.id, label]))

      expect(CURATED_IDEOLOGY_LAYER_SUMMARIES.stirnerism?.descriptive).toMatch(/fixed ideas/)
      expect(CURATED_IDEOLOGY_LAYER_SUMMARIES['utopian-socialism']?.descriptive).toMatch(/model communities/)
      expect(getIdeologyLayerSummary(byId.get('stirnerism')!, axes, 'descriptive')).toMatch(/philosophical account, not a settled empirical model/i)
      expect(getIdeologyLayerSummary(byId.get('utopian-socialism')!, axes, 'descriptive')).toMatch(/Saint-Simonian, Fourierist, and Owenite projects differed substantially/i)
      expect(getIdeologyLayerSummary(byId.get('stirnerism')!, axes, 'descriptive')).not.toMatch(/does not currently provide/i)
      expect(getIdeologyLayerSummary(byId.get('utopian-socialism')!, axes, 'descriptive')).not.toMatch(/does not currently provide/i)
   })
})
