import { describe, expect, it } from 'vitest'
import { questions } from './questions'

/**
 * Polarity regression guard.
 *
 * A whole class of validity bug lived in this bank: an item's prompt clearly
 * argued in one direction on an axis, but its axisWeight sign pointed the
 * other way, so AGREEING with the statement scored the respondent toward the
 * opposite pole (e.g. agreeing with "reduce veto points" scored as pro-regulation).
 *
 * This test re-derives the prompt's evident direction on each axis from keyword
 * signals and fails if a weight sign contradicts an UNAMBIGUOUS signal. It is a
 * heuristic, not a proof: it only fires when exactly one pole's keywords match,
 * and a small, documented allowlist covers genuine false positives where the
 * keyword fires on an incidental clause rather than the item's thrust.
 */

type Pole = 1 | -1

interface PolarityRule {
   /** Keywords that, when the respondent AGREES, signal the axis's positive pole. */
   pos: RegExp
   /** Keywords that, when the respondent AGREES, signal the axis's negative pole. */
   neg: RegExp
}

const RULES: Record<string, PolarityRule> = {
   'regulation-vs-deregulation': {
      pos: /\b(stricter|more oversight|impose more|mandate|tighter|prohibit|ban\b)\b/i,
      neg: /\b(reduce|remove|repeal|deregulat|fewer rules|legaliz|liberaliz|open protocol|barriers? to entry|reduce legal barriers|reduce veto|broad (?:exceptions|copyright)|interoperab|target fraud|abolish)\b/i,
   },
   'state-action-vs-exit': {
      pos: /\b(public provision|state should provide|government should run|nationaliz)\b/i,
      neg: /\b(exit option|opt-out|competitive alternativ|private alternativ|counter-institutional|voluntary|decriminaliz)\b/i,
   },
   'centralization-preference': {
      pos: /\b(centraliz|single (?:plan|center)|concentrat(?:e|ing) (?:power|authority))\b/i,
      neg: /\b(decentraliz|local experimentation|devolve|overlapping jurisdiction|let many institutions compete|layered identit)\b/i,
   },
   'reform-vs-revolution': {
      pos: /\b(ruptured?|overthrow|seize|insurrection)\b/i,
      neg: /\b(incremental reform|gradual|within existing institutions|revolutionary .* (?:rejected|trap)|reject(?:ed)? when it|build .* before relying)\b/i,
   },
   'state-capacity-confidence': {
      pos: /\b(states? can competently|government can (?:run|execute|deliver) well)\b/i,
      neg: /\b(states? (?:tend to|usually) (?:expand|fail|overreach)|rarely return|less responsive|constrained by (?:budgets|politics)|fail to execute|maintenance backlog|underprices)\b/i,
   },
   'expert-confidence': {
      pos: /\b(delegating .* experts? .* improves|experts? generally improve)\b/i,
      neg: /\b(knowledge problem|carteliz|moat for incumbent|survive failure|repurposed for ordinary)\b/i,
   },
   'anti-domination': {
      pos: /\b(unaccountable power|suspect when authority|cannot legally opt out|forfeit .* rights|forced labor|not .* justify unlimited)\b/i,
      neg: /\b(stable hierarchy is (?:normal|acceptable))\b/i,
   },
   'moral-traditionalism': {
      pos: /\b(traditional .* moral order|settled moral|single model of (?:masculinity|marriage))\b/i,
      neg: /\b(free to choose|should not (?:enforce|decide|fund)|freedom from religion|blasphemy .* not .* crimes|right to be wrong|peaceful adult difference|peaceful opinions)\b/i,
   },
   'militarism-pacifism': {
      pos: /\b(overwhelming force|project military power|national greatness .* military|willingness to project)\b/i,
      neg: /\b(defensive force is easier|conscription is forced labor|no right to use its population|distrusted most|does not .* justify military|justification as strong as|spreading freedom by denying)\b/i,
   },
   'secularism-religious': {
      pos: /\b(religious heritage can .* shape public law|public life should reflect a religious)\b/i,
      neg: /\b(freedom from religion|not political supremacy|blasphemy .* should not|state favoritism toward a religion is unjust|do not assume any particular religion|publicly accessible reasons|justified in terms accessible)\b/i,
   },
}

/**
 * Documented false positives: the keyword fires on an incidental clause, not
 * the item's actual thrust. Each entry is an axis on a specific question whose
 * current sign is correct despite the heuristic flag.
 */
const ALLOWLIST: Record<string, string[]> = {
   // "stricter rules on PUBLIC unions" is genuinely more state constraint; +regulation is correct.
   q0095: ['state-action-vs-exit'],
   // "impose losses on investors before taxpayers" = remove the bailout subsidy; -regulation is correct.
   q0135: ['regulation-vs-deregulation'],
   // "stricter" refers to CITIZENSHIP; the item's thrust is broad/quick work auth = -regulation is correct.
   q0214: ['regulation-vs-deregulation'],
}

describe('axis-weight polarity', () => {
   it('no item weight sign contradicts an unambiguous prompt signal', () => {
      const violations: string[] = []

      for (const q of questions) {
         if (q.responseType === 'statementChoice') continue
         for (const w of q.axisWeights) {
            const rule = RULES[w.axisId]
            if (!rule) continue
            const signalsPos = rule.pos.test(q.prompt)
            const signalsNeg = rule.neg.test(q.prompt)
            if (signalsPos === signalsNeg) continue // no signal, or conflicting -> treat as ambiguous
            if (ALLOWLIST[q.id]?.includes(w.axisId)) continue

            const promptDir: Pole = signalsPos ? 1 : -1
            const weightDir: Pole = w.weight >= 0 ? 1 : -1
            if (promptDir !== weightDir) {
               violations.push(`${q.id} ${w.axisId}: weight ${w.weight} but prompt signals ${promptDir > 0 ? 'POSITIVE' : 'NEGATIVE'} pole — "${q.prompt}"`)
            }
         }
      }

      expect(violations, `Polarity mismatches found:\n${violations.join('\n')}`).toEqual([])
   })
})
