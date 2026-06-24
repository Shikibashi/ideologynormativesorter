import { useState } from 'react'
import { buildShareUrl } from '../share'
import type { AnswerMap, Axis, Domain, ResultProfile } from '../types'
import { AxisBar } from './AxisBar'
import { CompassPlot } from './CompassPlot'

interface ResultsScreenProps {
   result: ResultProfile
   axes: Axis[]
   domains: Domain[]
   answers: AnswerMap
   compareResult?: ResultProfile | null
   onRestart: () => void
}


function formatFamilyName(family: string): string {
   return family
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

function topConfidence(subfamilies: Record<string, { confidence: number }[]>): number {
   let best = 0
   for (const matches of Object.values(subfamilies)) {
      for (const m of matches) if (m.confidence > best) best = m.confidence
   }
   return best
}
const LAYER_TITLES = {
   normative: 'Normative profile — what you believe is morally legitimate',
   descriptive: 'Descriptive profile — what you believe is empirically true',
   prescriptive: 'Prescriptive profile — what you think should be done now',
} as const

export function ResultsScreen({ result, axes, domains, answers, compareResult, onRestart }: ResultsScreenProps) {
   const axisById = new Map(axes.map((a) => [a.id, a]))
   const domainById = new Map(domains.map((d) => [d.id, d]))
   const [copied, setCopied] = useState(false)
   const [compareUrlInput, setCompareUrlInput] = useState('')

   function handleCopyLink() {
      const meta = result.bankVersion ? { bankVersion: result.bankVersion, scoringVersion: result.scoringVersion } : undefined
      const url = buildShareUrl(answers, meta)
      navigator.clipboard.writeText(url).then(
         () => setCopied(true),
         () => setCopied(false),
      )
   }

   return (
      <section className="screen results-screen">
         <h1>Your results</h1>
         <p className="muted">
            This test separates your normative values, descriptive beliefs, and prescriptive strategy. Labels are secondary.
         </p>

         <button type="button" className="scale-button copy-link-button" onClick={handleCopyLink}>
            {copied ? 'Link copied' : 'Copy link to this result'}
         </button>

         {!compareResult && (
            <div className="result-block compare-input-area">
               <h2>Compare with another result</h2>
               <p className="muted">Paste a shared result link below to see two profiles side by side.</p>
               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                     type="text"
                     className="compare-url-input"
                     value={compareUrlInput}
                     onChange={(e) => setCompareUrlInput(e.target.value)}
                     placeholder="Paste shared URL or hash..."
                     style={{ flex: 1, padding: '0.3rem 0.5rem' }}
                  />
                  <button
                     type="button"
                     className="scale-button"
                     onClick={() => {
                        const hash = compareUrlInput.includes('#r=') ? compareUrlInput.split('#r=')[1] : compareUrlInput
                        if (hash) window.location.hash = `r=${hash}&c=${encodeURIComponent(window.location.hash.slice(3))}`
                     }}
                  >
                     Compare
                  </button>
               </div>
            </div>
         )}

         {compareResult && (
            <div className="result-block compare-banner">
               <h2>Comparison view</h2>
               <p className="muted">Showing both profiles side by side — your scores on the left, compared profile on the right.</p>
            </div>
         )}
         <div className="result-block compass-block">
            <h2>Compass</h2>
            <CompassPlot scores={result.scores} compareScores={compareResult?.scores} />
         </div>
         {(['normative', 'descriptive', 'prescriptive'] as const).map((layer) => (
            <div className="result-block" key={layer}>
               <h2>{LAYER_TITLES[layer]}</h2>
               <div className="axis-bar-list">
                  {(result.scores[layer] || []).map((score) => {
                     const axis = axisById.get(score.axisId)
                     return axis ? <AxisBar key={score.axisId} axis={axis} score={score} result={result} /> : null
                  })}
               </div>
            </div>
         ))}

         {compareResult && (
            <div className="result-block">
               <h2>Axis comparison</h2>
               <p className="muted">Your axis scores (left) vs compared profile (right).</p>
               {(['normative', 'descriptive', 'prescriptive'] as const).map((layer) => (
                  <div key={layer}>
                     <h3 style={{ textTransform: 'capitalize' }}>{layer}</h3>
                     <div className="axis-bar-list">
                        {(result.scores[layer] || []).map((score) => {
                           const axis = axisById.get(score.axisId)
                           if (!axis) return null
                           const other = compareResult.scores[layer]?.find((s) => s.axisId === score.axisId)
                           return (
                              <div key={score.axisId} className="axis-compare-row">
                                 <span className="axis-compare-label">{axis.name}</span>
                                 <div className="axis-compare-bars" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <AxisBar axis={axis} score={score} result={result} />
                                    {other && <AxisBar axis={axis} score={other} result={compareResult} />}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               ))}
            </div>
         )}

         {result.gaps.length > 0 && (
            <div className="result-block">
               <h2>Ideal vs. non-ideal gap</h2>
               <p className="muted">
                  Large gaps show where your ideal theory diverges from what you prescribe under current conditions.
               </p>
               <ul className="gap-list">
                  {result.gaps.map((gap) => (
                     <li key={gap.domain}>
                        <strong>{domainById.get(gap.domain)?.name ?? gap.domain}</strong>: ideal {gap.ideal.toFixed(2)}, non-ideal{' '}
                        {gap.nonIdeal.toFixed(2)}, gap {gap.gap.toFixed(2)}
                     </li>
                  ))}
               </ul>
            </div>
         )}

         <div className="result-block">
            <h2>Nearest ideology labels</h2>
            {result.familySubtree && Object.keys(result.familySubtree).length > 0 ? (
               Object.entries(result.familySubtree)
                  .sort((a, b) => topConfidence(b[1]) - topConfidence(a[1]))
                  .map(([family, subfamilies]) => (
                     <div key={family} className="family-group">
                        <h3 className="family-name">{formatFamilyName(family)}</h3>
                        {Object.entries(subfamilies)
                           .sort((a, b) => (b[1][0]?.confidence ?? 0) - (a[1][0]?.confidence ?? 0))
                           .map(([subfamily, matches]) => (
                              <div key={subfamily} className="subfamily-group">
                                 {subfamily !== family && (
                                    <h4 className="subfamily-name">{formatFamilyName(subfamily)}</h4>
                                 )}
                                 <ol className="label-list">
                                    {matches.map((match) => (
                                       <li key={match.labelId}>
                                          {match.name}{' '}
                                          <span className="muted">({Math.round(match.confidence * 100)}% match)</span>
                                       </li>
                                    ))}
                                 </ol>
                              </div>
                           ))}
                     </div>
                  ))
            ) : (
               <ol className="label-list">
                  {result.nearestLabels.map((match) => (
                     <li key={match.labelId}>
                        {match.name} <span className="muted">({Math.round(match.confidence * 100)}% match)</span>
                     </li>
                  ))}
               </ol>
            )}
         </div>


         {result.conflatedLabels.length > 0 && (
            <div className="result-block">
               <h2>Labels that conflate your layers</h2>
               <p className="muted">
                  These labels fit one layer of your views but would conflate it with the others, where you diverge.
               </p>
               <ul className="conflated-list">
                  {result.conflatedLabels.map((flag) => (
                     <li key={flag.labelId}>
                        {flag.reason}
                        <span className="layer-agreement">
                           {(['normative', 'descriptive', 'prescriptive'] as const).map((layer) => (
                              <span
                                 key={layer}
                                 className={layer === flag.matchedLayer ? 'layer-chip matched' : 'layer-chip'}
                              >
                                 {layer} {Math.round(flag.layerAgreement[layer] * 100)}%
                              </span>
                           ))}
                        </span>
                     </li>
                  ))}
               </ul>
            </div>
         )}



         <p className="muted">
            If you found this tool useful, consider starring{' '}
            <a href="https://github.com/Yeachan-Heo/gajae-code" target="_blank" rel="noopener noreferrer">
               gajae-code on GitHub
            </a>.
         </p>
         <button type="button" className="primary-button" onClick={onRestart}>
            Start over
         </button>
      </section>
   )
}