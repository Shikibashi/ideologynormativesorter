import type { AnswerMap, IdeologyLabel } from '../types'
import { questions } from '../data/questions'
import { labelById } from '../data/labels'

export interface CalibrationFixture {
   id: string
   description: string
   answers: AnswerMap
   expectedLabelIds: string[]
   minConfidence: number
}

function createCentroidAlignedFixture(targetLabel: IdeologyLabel): AnswerMap {
   const answers: AnswerMap = {}
   const centroid = targetLabel.centroid

   for (const q of questions) {
      let total = 0
      let weightSum = 0
      for (const w of q.axisWeights) {
         const c = centroid[w.axisId] || 0
         total += c * w.weight
         weightSum += Math.abs(w.weight)
      }
      if (weightSum > 0) {
         const avg = total / weightSum
         const val = Math.sign(avg) * 3
         answers[q.id] = {
            questionId: q.id,
            value: val as number
         }
      } else {
         answers[q.id] = { questionId: q.id, value: 0 }
      }
   }
   return answers
}

const targetIds = [
   'egalitarian-statist',
   'market-liberal',
   'democratic-socialist',
   'revolutionary-collectivist',
   'national-traditionalist',
   'technocratic-centralist',
   'decentralist-market-skeptic-of-state',
   'civil-libertarian-cosmopolitan',
   'geolibertarian',
   'anarcho-capitalist',
   'market-socialist',
   'social-democrat',
   'mutualist',
   'ecomodernist',
   'christian-democrat',
   'fascist-authoritarian',
   'marxist-leninist',
   'council-communist',
   'syndicalist',
   'anarcho-communist',
   'minarchist',
   'agorist',
   'neoconservative',
   'theocrat',
   'ecosocialist',
   'degrowth-green',
   'civic-nationalist',
   'ethnonationalist',
   'absolute-monarchist',
   'neoreactionary',
   'classical-liberalism',
   'neoliberalism',
   'ordoliberalism',
   'social-liberalism',
   'conservative-liberalism',
   'communitarianism',
   'republicanism',
   'distributism',
   'libertarian-socialism',
   'deep-ecology',
   'paleolibertarianism',
   'objectivism',
   'transhumanism',
   'welfare-chauvinism',
   'right-wing-populism',
   'radical-democracy',
   'participism',
   'left-wing-market-anarchism',
   'individualist-anarchism',
   'anarcho-primitivism',
   'left-wing-populism',
   'maoism',
   'trotskyism',
   'panarchism',
   'world-federalism',
   'indigenism',
   'guild-socialism',
   'multiculturalism',
   'cyberocracy',
   'bioregionalism',
   'eco-authoritarianism',
   'eco-fascism',
   'hindutva',
   'religious-nationalism',
   'zionism',
   'national-bolshevism',
   'strasserism',
   'integralism',
   'democratic-confederalism',
   'paleoconservatism',
   'one-nation-conservatism',
   'islamic-democracy',
   'liquid-democracy',
   'accelerationism',
   'juche',
   'techno-anarchism',
]

export const calibrationFixtures: CalibrationFixture[] = targetIds.map(id => {
   const label = labelById.get(id)!
   const answers = createCentroidAlignedFixture(label)
   return {
      id: `fixture-${id}`,
      description: `Synthetic profile targeting ${label.name}`,
      answers,
      expectedLabelIds: [id],
      minConfidence: 0.45
   }
})

export const allCalibrationFixtures = calibrationFixtures