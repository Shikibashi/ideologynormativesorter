import type { AnswerMap, AxisWeight, IdeologyLabel, Question } from '../types'
import { questions } from '../data/questions'
import { labelById } from '../data/labels'

export interface CalibrationFixture {
   id: string
   description: string
   answers: AnswerMap
   expectedLabelIds: string[]
   minConfidence: number
}

export function centroidAlignmentScore(axisWeights: AxisWeight[], centroid: IdeologyLabel['centroid']): number | null {
   let maxProduct = -Infinity
   let maxW: AxisWeight | null = null

   for (const w of axisWeights) {
      const centValue = centroid[w.axisId]
      if (centValue === undefined) continue

      const prod = Math.abs(centValue * w.weight)
      if (prod > maxProduct) {
         maxProduct = prod
         maxW = w
      }
   }

   if (!maxW) return null
   return (centroid[maxW.axisId] ?? 0) * Math.sign(maxW.weight)
}

export function centroidAlignedAnswerValue(question: Question, centroid: IdeologyLabel['centroid']): number {
   if (question.responseType === 'statementChoice') {
      const statementOptions = question.statementOptions

      if (!statementOptions) {
         throw new Error(`statementChoice question ${question.id} is missing statementOptions`)
      }

      if (statementOptions.length === 0) {
         throw new Error(`statementChoice question ${question.id} has no statementOptions`)
      }

      let bestIndex = -1
      let bestScore = Number.NEGATIVE_INFINITY

      statementOptions.forEach((option, index) => {
         const score = centroidAlignmentScore(option.axisWeights, centroid)
         if (score !== null && score > bestScore) {
            bestIndex = index
            bestScore = score
         }
      })

      if (bestIndex < 0) {
         throw new Error(`statementChoice question ${question.id} has no scorable statementOptions`)
      }

      return bestIndex
   }

   const score = centroidAlignmentScore(question.axisWeights, centroid)
   const max = question.responseType === 'likert5' ? 2 : 3
   return score === null ? 0 : Math.max(-max, Math.min(max, score * max))
}

function createCentroidAlignedFixture(targetLabel: IdeologyLabel): AnswerMap {
   const answers: AnswerMap = {}
   const centroid = targetLabel.centroid

   for (const q of questions) {
      answers[q.id] = {
         questionId: q.id,
         value: centroidAlignedAnswerValue(q, centroid),
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
   'progressivism',
   'liberal-feminism',
   'national-socialism',
   'left-wing-nationalism',
   'christian-socialism',
   'utopian-socialism',
   'voluntaryism',
   'stirnerism',
   'libertarian-municipalism',
   'corporatism',
   'kemalism',
   'anarcha-feminism',
   'queer-anarchism',
   'anarcho-syndicalism',
   'platformism',
   'fiscal-conservatism',
   'social-conservatism',
   'national-conservatism',
   'liberal-conservatism',
   'bright-green-environmentalism',
   'georgism',
   'internationalism',
   'bleeding-heart-libertarianism',
   'constitutional-monarchism',
   'expansionist-nationalism',
   'separatist-nationalism',
   'agrarian-populism',
   'fundamentalist-theocracy',
   'political-islam',
   'christian-reconstructionism',
   'dataism',
   'singularitarianism',
   'universal-basic-income',
   'fourth-theory',
   'anti-imperialism',
   'green-capitalism',
   'radical-centrism',
   'traditional-monarchist',
   'regionalism',
   'cultural-populism',
   'social-investment-state',
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