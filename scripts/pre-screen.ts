import { labels } from '../src/data/labels'
import type { AxisId } from '../src/types/common'

// Candidate labels from the plan, with approximate centroids
const candidates: Array<{
  id: string
  name: string
  family: string
  centroid: Record<AxisId, number>
}> = [
  // Anarchist additions
  {
    id: 'anarcho-syndicalism',
    name: 'Anarcho-Syndicalism',
    family: 'anarchist',
    centroid: {
      'authority-legitimacy': -0.6, 'property-legitimacy': -0.7, 'liberty-noninterference': 0.5,
      'equality-theory': 0.7, 'political-community-boundary': 0.4, 'moral-traditionalism': -0.5,
      'anti-domination': 0.8, 'human-nature-priority': 0.2, 'market-process-confidence': -0.5,
      'state-capacity-confidence': -0.6, 'public-choice-skepticism': 0.4, 'democratic-confidence': 0.5,
      'expert-confidence': 0.2, 'cultural-plasticity': 0.4, 'coordination-optimism': 0.3,
      'centralization-preference': -0.6, 'reform-vs-revolution': 0.6, 'gradualism-vs-immediatism': 0.3,
      'state-action-vs-exit': -0.5, 'electoralism-vs-direct-action': -0.3, 'compromise-vs-persistence': 0.1,
      'coercion-strategy': -0.5, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': 0.6,
      'militarism-pacifism': -0.4, 'secularism-religious': -0.4,
    }
  },
  {
    id: 'platformism',
    name: 'Platformism',
    family: 'anarchist',
    centroid: {
      'authority-legitimacy': -0.55, 'property-legitimacy': -0.7, 'liberty-noninterference': 0.4,
      'equality-theory': 0.7, 'political-community-boundary': 0.4, 'moral-traditionalism': -0.5,
      'anti-domination': 0.75, 'human-nature-priority': 0.2, 'market-process-confidence': -0.5,
      'state-capacity-confidence': -0.5, 'public-choice-skepticism': 0.4, 'democratic-confidence': 0.5,
      'expert-confidence': 0.2, 'cultural-plasticity': 0.4, 'coordination-optimism': 0.3,
      'centralization-preference': -0.3, 'reform-vs-revolution': 0.3, 'gradualism-vs-immediatism': 0.2,
      'state-action-vs-exit': -0.4, 'electoralism-vs-direct-action': -0.2, 'compromise-vs-persistence': 0.2,
      'coercion-strategy': -0.5, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': 0.6,
      'militarism-pacifism': -0.4, 'secularism-religious': -0.4,
    }
  },
  // Conservative additions
  {
    id: 'fiscal-conservatism',
    name: 'Fiscal Conservatism',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.3, 'property-legitimacy': 0.6, 'liberty-noninterference': 0.4,
      'equality-theory': -0.2, 'political-community-boundary': 0.3, 'moral-traditionalism': 0.3,
      'anti-domination': 0.2, 'human-nature-priority': 0.2, 'market-process-confidence': 0.7,
      'state-capacity-confidence': 0.3, 'public-choice-skepticism': 0.5, 'democratic-confidence': 0.4,
      'expert-confidence': 0.3, 'cultural-plasticity': -0.1, 'coordination-optimism': 0.2,
      'centralization-preference': 0.2, 'reform-vs-revolution': -0.1, 'gradualism-vs-immediatism': 0.1,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.4, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.1, 'regulation-vs-deregulation': -0.5, 'redistribution-vs-predistribution': -0.4,
      'militarism-pacifism': 0.1, 'secularism-religious': 0.2,
    }
  },
  {
    id: 'social-conservatism',
    name: 'Social Conservatism',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.5, 'property-legitimacy': 0.4, 'liberty-noninterference': 0.0,
      'equality-theory': -0.1, 'political-community-boundary': 0.2, 'moral-traditionalism': 0.8,
      'anti-domination': 0.1, 'human-nature-priority': 0.1, 'market-process-confidence': 0.4,
      'state-capacity-confidence': 0.4, 'public-choice-skepticism': 0.3, 'democratic-confidence': 0.3,
      'expert-confidence': 0.2, 'cultural-plasticity': -0.5, 'coordination-optimism': 0.1,
      'centralization-preference': 0.3, 'reform-vs-revolution': -0.2, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.4, 'electoralism-vs-direct-action': 0.3, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': 0.0, 'regulation-vs-deregulation': -0.1, 'redistribution-vs-predistribution': -0.1,
      'militarism-pacifism': 0.2, 'secularism-religious': 0.5,
    }
  },
  {
    id: 'national-conservatism',
    name: 'National Conservatism',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.6, 'property-legitimacy': 0.3, 'liberty-noninterference': -0.2,
      'equality-theory': -0.1, 'political-community-boundary': -0.6, 'moral-traditionalism': 0.7,
      'anti-domination': -0.1, 'human-nature-priority': -0.1, 'market-process-confidence': 0.3,
      'state-capacity-confidence': 0.5, 'public-choice-skepticism': 0.2, 'democratic-confidence': 0.2,
      'expert-confidence': 0.2, 'cultural-plasticity': -0.5, 'coordination-optimism': 0.1,
      'centralization-preference': 0.4, 'reform-vs-revolution': -0.1, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': 0.2, 'compromise-vs-persistence': 0.2,
      'coercion-strategy': 0.2, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': 0.3, 'secularism-religious': 0.3,
    }
  },
  {
    id: 'liberal-conservatism',
    name: 'Liberal Conservatism',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.2, 'property-legitimacy': 0.5, 'liberty-noninterference': 0.4,
      'equality-theory': 0.1, 'political-community-boundary': 0.3, 'moral-traditionalism': 0.3,
      'anti-domination': 0.2, 'human-nature-priority': 0.2, 'market-process-confidence': 0.5,
      'state-capacity-confidence': 0.3, 'public-choice-skepticism': 0.3, 'democratic-confidence': 0.4,
      'expert-confidence': 0.3, 'cultural-plasticity': 0.0, 'coordination-optimism': 0.2,
      'centralization-preference': 0.1, 'reform-vs-revolution': -0.3, 'gradualism-vs-immediatism': -0.1,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.4, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.1, 'regulation-vs-deregulation': -0.3, 'redistribution-vs-predistribution': -0.2,
      'militarism-pacifism': 0.0, 'secularism-religious': 0.1,
    }
  },
  // Green additions
  {
    id: 'bright-green-environmentalism',
    name: 'Bright Green Environmentalism',
    family: 'green',
    centroid: {
      'authority-legitimacy': 0.0, 'property-legitimacy': 0.3, 'liberty-noninterference': 0.3,
      'equality-theory': 0.3, 'political-community-boundary': 0.3, 'moral-traditionalism': -0.2,
      'anti-domination': 0.3, 'human-nature-priority': 0.3, 'market-process-confidence': 0.6,
      'state-capacity-confidence': 0.4, 'public-choice-skepticism': 0.1, 'democratic-confidence': 0.5,
      'expert-confidence': 0.6, 'cultural-plasticity': 0.4, 'coordination-optimism': 0.5,
      'centralization-preference': 0.1, 'reform-vs-revolution': -0.4, 'gradualism-vs-immediatism': -0.3,
      'state-action-vs-exit': 0.4, 'electoralism-vs-direct-action': 0.3, 'compromise-vs-persistence': 0.4,
      'coercion-strategy': -0.3, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': 0.1,
      'militarism-pacifism': -0.2, 'secularism-religious': -0.2,
    }
  },
  // Georgist additions
  {
    id: 'georgism',
    name: 'Georgism',
    family: 'libertarian-leaning',
    centroid: {
      'authority-legitimacy': -0.1, 'property-legitimacy': 0.3, 'liberty-noninterference': 0.4,
      'equality-theory': 0.4, 'political-community-boundary': 0.3, 'moral-traditionalism': -0.1,
      'anti-domination': 0.4, 'human-nature-priority': 0.2, 'market-process-confidence': 0.5,
      'state-capacity-confidence': 0.3, 'public-choice-skepticism': 0.3, 'democratic-confidence': 0.4,
      'expert-confidence': 0.3, 'cultural-plasticity': 0.2, 'coordination-optimism': 0.3,
      'centralization-preference': 0.0, 'reform-vs-revolution': -0.4, 'gradualism-vs-immediatism': -0.3,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.4, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.2, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.2,
      'militarism-pacifism': -0.2, 'secularism-religious': -0.2,
    }
  },
  // Internationalist additions
  {
    id: 'internationalism',
    name: 'Internationalism',
    family: 'liberal',
    centroid: {
      'authority-legitimacy': 0.0, 'property-legitimacy': 0.1, 'liberty-noninterference': 0.4,
      'equality-theory': 0.4, 'political-community-boundary': 0.7, 'moral-traditionalism': -0.4,
      'anti-domination': 0.5, 'human-nature-priority': 0.2, 'market-process-confidence': 0.2,
      'state-capacity-confidence': 0.3, 'public-choice-skepticism': 0.2, 'democratic-confidence': 0.5,
      'expert-confidence': 0.4, 'cultural-plasticity': 0.5, 'coordination-optimism': 0.5,
      'centralization-preference': 0.2, 'reform-vs-revolution': -0.4, 'gradualism-vs-immediatism': -0.3,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.4, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.2, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.2,
      'militarism-pacifism': -0.4, 'secularism-religious': -0.4,
    }
  },
  // Liberal additions
  {
    id: 'bleeding-heart-libertarianism',
    name: 'Bleeding-Heart Libertarianism',
    family: 'liberal',
    centroid: {
      'authority-legitimacy': -0.2, 'property-legitimacy': 0.5, 'liberty-noninterference': 0.7,
      'equality-theory': 0.4, 'political-community-boundary': 0.4, 'moral-traditionalism': -0.3,
      'anti-domination': 0.6, 'human-nature-priority': 0.2, 'market-process-confidence': 0.5,
      'state-capacity-confidence': -0.2, 'public-choice-skepticism': 0.4, 'democratic-confidence': 0.4,
      'expert-confidence': 0.3, 'cultural-plasticity': 0.4, 'coordination-optimism': 0.3,
      'centralization-preference': -0.3, 'reform-vs-revolution': -0.4, 'gradualism-vs-immediatism': -0.3,
      'state-action-vs-exit': 0.2, 'electoralism-vs-direct-action': 0.3, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.3, 'regulation-vs-deregulation': -0.3, 'redistribution-vs-predistribution': -0.1,
      'militarism-pacifism': -0.3, 'secularism-religious': -0.4,
    }
  },
  // Monarchist additions
  {
    id: 'constitutional-monarchism',
    name: 'Constitutional Monarchism',
    family: 'authoritarian',
    centroid: {
      'authority-legitimacy': 0.5, 'property-legitimacy': 0.3, 'liberty-noninterference': 0.1,
      'equality-theory': 0.0, 'political-community-boundary': 0.2, 'moral-traditionalism': 0.4,
      'anti-domination': 0.1, 'human-nature-priority': 0.1, 'market-process-confidence': 0.3,
      'state-capacity-confidence': 0.5, 'public-choice-skepticism': 0.2, 'democratic-confidence': 0.3,
      'expert-confidence': 0.4, 'cultural-plasticity': -0.1, 'coordination-optimism': 0.2,
      'centralization-preference': 0.5, 'reform-vs-revolution': -0.2, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.4, 'electoralism-vs-direct-action': 0.3, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': 0.1, 'regulation-vs-deregulation': 0.0, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': 0.1, 'secularism-religious': 0.2,
    }
  },
  // Nationalist additions
  {
    id: 'expansionist-nationalism',
    name: 'Expansionist Nationalism',
    family: 'nationalist',
    centroid: {
      'authority-legitimacy': 0.5, 'property-legitimacy': 0.2, 'liberty-noninterference': -0.4,
      'equality-theory': -0.2, 'political-community-boundary': -0.8, 'moral-traditionalism': 0.4,
      'anti-domination': -0.3, 'human-nature-priority': -0.1, 'market-process-confidence': 0.3,
      'state-capacity-confidence': 0.6, 'public-choice-skepticism': 0.0, 'democratic-confidence': 0.1,
      'expert-confidence': 0.2, 'cultural-plasticity': -0.3, 'coordination-optimism': 0.1,
      'centralization-preference': 0.5, 'reform-vs-revolution': 0.1, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': 0.1, 'compromise-vs-persistence': 0.0,
      'coercion-strategy': 0.4, 'regulation-vs-deregulation': 0.0, 'redistribution-vs-predistribution': -0.1,
      'militarism-pacifism': 0.6, 'secularism-religious': 0.1,
    }
  },
  {
    id: 'separatist-nationalism',
    name: 'Separatist Nationalism',
    family: 'nationalist',
    centroid: {
      'authority-legitimacy': 0.1, 'property-legitimacy': 0.1, 'liberty-noninterference': 0.2,
      'equality-theory': 0.2, 'political-community-boundary': -0.7, 'moral-traditionalism': 0.3,
      'anti-domination': 0.4, 'human-nature-priority': 0.1, 'market-process-confidence': 0.1,
      'state-capacity-confidence': 0.2, 'public-choice-skepticism': 0.1, 'democratic-confidence': 0.3,
      'expert-confidence': 0.2, 'cultural-plasticity': 0.2, 'coordination-optimism': 0.1,
      'centralization-preference': 0.0, 'reform-vs-revolution': 0.1, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.2, 'electoralism-vs-direct-action': 0.2, 'compromise-vs-persistence': 0.1,
      'coercion-strategy': 0.0, 'regulation-vs-deregulation': 0.0, 'redistribution-vs-predistribution': 0.1,
      'militarism-pacifism': 0.1, 'secularism-religious': -0.1,
    }
  },
  // Populist additions
  {
    id: 'agrarian-populism',
    name: 'Agrarian Populism',
    family: 'populist',
    centroid: {
      'authority-legitimacy': 0.1, 'property-legitimacy': 0.1, 'liberty-noninterference': 0.1,
      'equality-theory': 0.3, 'political-community-boundary': 0.2, 'moral-traditionalism': 0.4,
      'anti-domination': 0.4, 'human-nature-priority': 0.2, 'market-process-confidence': 0.1,
      'state-capacity-confidence': 0.2, 'public-choice-skepticism': 0.3, 'democratic-confidence': 0.3,
      'expert-confidence': 0.1, 'cultural-plasticity': 0.1, 'coordination-optimism': 0.2,
      'centralization-preference': -0.1, 'reform-vs-revolution': -0.2, 'gradualism-vs-immediatism': -0.1,
      'state-action-vs-exit': 0.2, 'electoralism-vs-direct-action': 0.2, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.1, 'regulation-vs-deregulation': 0.0, 'redistribution-vs-predistribution': 0.3,
      'militarism-pacifism': -0.1, 'secularism-religious': 0.1,
    }
  },
  // Religious additions
  {
    id: 'fundamentalist-theocracy',
    name: 'Fundamentalist Theocracy',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.8, 'property-legitimacy': 0.2, 'liberty-noninterference': -0.7,
      'equality-theory': -0.3, 'political-community-boundary': 0.0, 'moral-traditionalism': 0.95,
      'anti-domination': -0.5, 'human-nature-priority': -0.3, 'market-process-confidence': 0.1,
      'state-capacity-confidence': 0.6, 'public-choice-skepticism': -0.2, 'democratic-confidence': -0.5,
      'expert-confidence': 0.1, 'cultural-plasticity': -0.8, 'coordination-optimism': 0.0,
      'centralization-preference': 0.6, 'reform-vs-revolution': -0.3, 'gradualism-vs-immediatism': -0.2,
      'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': 0.1, 'compromise-vs-persistence': -0.3,
      'coercion-strategy': 0.5, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': 0.1, 'secularism-religious': 0.95,
    }
  },
  {
    id: 'political-islam',
    name: 'Political Islam',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.4, 'property-legitimacy': 0.1, 'liberty-noninterference': -0.3,
      'equality-theory': 0.1, 'political-community-boundary': -0.3, 'moral-traditionalism': 0.7,
      'anti-domination': 0.1, 'human-nature-priority': -0.1, 'market-process-confidence': 0.1,
      'state-capacity-confidence': 0.4, 'public-choice-skepticism': 0.0, 'democratic-confidence': 0.1,
      'expert-confidence': 0.2, 'cultural-plasticity': -0.4, 'coordination-optimism': 0.1,
      'centralization-preference': 0.3, 'reform-vs-revolution': 0.0, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.2, 'compromise-vs-persistence': 0.1,
      'coercion-strategy': 0.1, 'regulation-vs-deregulation': 0.0, 'redistribution-vs-predistribution': 0.1,
      'militarism-pacifism': 0.2, 'secularism-religious': 0.6,
    }
  },
  {
    id: 'christian-reconstructionism',
    name: 'Christian Reconstructionism',
    family: 'conservative',
    centroid: {
      'authority-legitimacy': 0.7, 'property-legitimacy': 0.4, 'liberty-noninterference': -0.5,
      'equality-theory': -0.2, 'political-community-boundary': 0.1, 'moral-traditionalism': 0.9,
      'anti-domination': -0.3, 'human-nature-priority': -0.2, 'market-process-confidence': 0.4,
      'state-capacity-confidence': 0.5, 'public-choice-skepticism': 0.1, 'democratic-confidence': -0.2,
      'expert-confidence': 0.2, 'cultural-plasticity': -0.6, 'coordination-optimism': 0.2,
      'centralization-preference': 0.4, 'reform-vs-revolution': -0.2, 'gradualism-vs-immediatism': -0.1,
      'state-action-vs-exit': 0.4, 'electoralism-vs-direct-action': 0.1, 'compromise-vs-persistence': -0.2,
      'coercion-strategy': 0.3, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': -0.1,
      'militarism-pacifism': 0.1, 'secularism-religious': 0.9,
    }
  },
  // Technocratic additions
  {
    id: 'dataism',
    name: 'Dataism',
    family: 'technocratic',
    centroid: {
      'authority-legitimacy': 0.2, 'property-legitimacy': 0.2, 'liberty-noninterference': 0.0,
      'equality-theory': 0.1, 'political-community-boundary': 0.3, 'moral-traditionalism': -0.4,
      'anti-domination': 0.1, 'human-nature-priority': 0.3, 'market-process-confidence': 0.5,
      'state-capacity-confidence': 0.6, 'public-choice-skepticism': 0.1, 'democratic-confidence': 0.3,
      'expert-confidence': 0.8, 'cultural-plasticity': 0.5, 'coordination-optimism': 0.6,
      'centralization-preference': 0.4, 'reform-vs-revolution': -0.3, 'gradualism-vs-immediatism': -0.2,
      'state-action-vs-exit': 0.3, 'electoralism-vs-direct-action': 0.3, 'compromise-vs-persistence': 0.2,
      'coercion-strategy': -0.1, 'regulation-vs-deregulation': 0.2, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': -0.1, 'secularism-religious': -0.5,
    }
  },
  {
    id: 'singularitarianism',
    name: 'Singularitarianism',
    family: 'technocratic',
    centroid: {
      'authority-legitimacy': 0.0, 'property-legitimacy': 0.2, 'liberty-noninterference': 0.3,
      'equality-theory': 0.2, 'political-community-boundary': 0.4, 'moral-traditionalism': -0.5,
      'anti-domination': 0.2, 'human-nature-priority': 0.4, 'market-process-confidence': 0.4,
      'state-capacity-confidence': 0.3, 'public-choice-skepticism': 0.2, 'democratic-confidence': 0.3,
      'expert-confidence': 0.7, 'cultural-plasticity': 0.6, 'coordination-optimism': 0.6,
      'centralization-preference': 0.1, 'reform-vs-revolution': -0.1, 'gradualism-vs-immediatism': 0.0,
      'state-action-vs-exit': 0.2, 'electoralism-vs-direct-action': 0.2, 'compromise-vs-persistence': 0.2,
      'coercion-strategy': -0.1, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': -0.1, 'secularism-religious': -0.4,
    }
  },
  {
    id: 'universal-basic-income',
    name: 'Universal Basic Income Advocacy',
    family: 'social-democratic',
    centroid: {
      'authority-legitimacy': 0.0, 'property-legitimacy': -0.1, 'liberty-noninterference': 0.3,
      'equality-theory': 0.5, 'political-community-boundary': 0.4, 'moral-traditionalism': -0.3,
      'anti-domination': 0.4, 'human-nature-priority': 0.2, 'market-process-confidence': 0.2,
      'state-capacity-confidence': 0.4, 'public-choice-skepticism': 0.1, 'democratic-confidence': 0.4,
      'expert-confidence': 0.4, 'cultural-plasticity': 0.4, 'coordination-optimism': 0.3,
      'centralization-preference': 0.1, 'reform-vs-revolution': -0.5, 'gradualism-vs-immediatism': -0.4,
      'state-action-vs-exit': 0.4, 'electoralism-vs-direct-action': 0.4, 'compromise-vs-persistence': 0.3,
      'coercion-strategy': -0.2, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.4,
      'militarism-pacifism': -0.2, 'secularism-religious': -0.3,
    }
  },
  {
    id: 'fourth-theory',
    name: 'Fourth Theory',
    family: 'authoritarian',
    centroid: {
      'authority-legitimacy': 0.7, 'property-legitimacy': 0.0, 'liberty-noninterference': -0.6,
      'equality-theory': -0.1, 'political-community-boundary': -0.5, 'moral-traditionalism': 0.6,
      'anti-domination': -0.3, 'human-nature-priority': -0.2, 'market-process-confidence': 0.0,
      'state-capacity-confidence': 0.6, 'public-choice-skepticism': -0.2, 'democratic-confidence': -0.4,
      'expert-confidence': 0.3, 'cultural-plasticity': -0.3, 'coordination-optimism': 0.2,
      'centralization-preference': 0.6, 'reform-vs-revolution': 0.3, 'gradualism-vs-immediatism': 0.2,
      'state-action-vs-exit': 0.5, 'electoralism-vs-direct-action': -0.1, 'compromise-vs-persistence': -0.2,
      'coercion-strategy': 0.5, 'regulation-vs-deregulation': 0.1, 'redistribution-vs-predistribution': 0.0,
      'militarism-pacifism': 0.4, 'secularism-religious': 0.2,
    }
  },
]

// Cosine similarity between two centroid vectors
function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const keys = Object.keys(a)
  let dot = 0, normA = 0, normB = 0
  for (const k of keys) {
    const va = a[k] ?? 0
    const vb = b[k] ?? 0
    dot += va * vb
    normA += va * va
    normB += vb * vb
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

// Cosine distance = 1 - cosine similarity
function cosineDistance(a: Record<string, number>, b: Record<string, number>): number {
  return 1 - cosineSimilarity(a, b)
}

const axisIds = Object.keys(candidates[0].centroid)
const THRESHOLD = 0.03

console.log('=== Centroid Pre-Screen ===')
console.log(`Candidates: ${candidates.length}`)
console.log(`Existing labels: ${labels.length}`)
console.log(`Threshold: ${THRESHOLD} (≤ = alias candidate)\n`)

let passedCount = 0
let aliasCount = 0
const results: Array<{ id: string; name: string; distance: number; nearest: string; verdict: string }> = []

for (const candidate of candidates) {
  // Find nearest existing label in the same family
  const sameFamily = labels.filter(l => l.family === candidate.family)
  let minDist = Infinity
  let nearestId = ''
  
  for (const existing of sameFamily) {
    const dist = cosineDistance(candidate.centroid, existing.centroid)
    if (dist < minDist) {
      minDist = dist
      nearestId = existing.id
    }
  }
  
  // Also check nearest across ALL labels (in case wrong family assignment)
  for (const existing of labels) {
    if (existing.family === candidate.family) continue
    const dist = cosineDistance(candidate.centroid, existing.centroid)
    if (dist < minDist) {
      minDist = dist
      nearestId = `${existing.id} [cross-family: ${existing.family}]`
    }
  }
  
  const verdict = minDist <= THRESHOLD ? 'ALIAS CANDIDATE' : 'PASS'
  if (verdict === 'ALIAS CANDIDATE') aliasCount++
  else passedCount++
  
  results.push({ id: candidate.id, name: candidate.name, distance: minDist, nearest: nearestId, verdict })
  const arrow = minDist <= THRESHOLD ? '⚠️' : '✅'
  console.log(`${arrow} ${candidate.id} (${candidate.name})`)
  console.log(`   Distance: ${minDist.toFixed(4)} | Nearest: ${nearestId}`)
  console.log(`   Verdict: ${verdict}`)
}

console.log(`\n=== Summary ===`)
console.log(`Passed: ${passedCount} | Alias candidates: ${aliasCount} | Total: ${results.length}`)
console.log(`Total labels after adding: ${labels.length + passedCount}`)

if (labels.length + passedCount < 115) {
  console.log(`\n⚠️ WARNING: Total (${labels.length + passedCount}) below floor (115)!`)
}

const THIRTY_PCT = Math.ceil((labels.length + passedCount) * 0.33)
console.log(`Near-tie budget (33%): ~${THIRTY_PCT} exceptions max`)
console.log(`\n=== Alias Candidates ===`)
results.filter(r => r.verdict === 'ALIAS CANDIDATE').forEach(r => {
  console.log(`  ${r.id} (${r.name}): d=${r.distance.toFixed(4)} near ${r.nearest}`)
})
