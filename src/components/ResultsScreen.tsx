import { useState } from 'react'
import { buildCompareUrl, buildShareUrl, decodeAnswers, extractEncodedAnswers } from '../share'
import type { AnswerMap, Axis, AxisId, AxisReliability, Domain, LabelMatch, LabelReliability, Layer, ResultProfile } from '../types'
import type { IdeologyLabel } from '../types/label'
import { AxisBar } from './AxisBar'
import { CompassPlot } from './CompassPlot'

type LabelWithInfluences = IdeologyLabel & {
   philosophyInfluences?: Array<{
      philosophy: string
      description: string
      affectedAxes: AxisId[]
   }>
}

interface ResultsScreenProps {
   result: ResultProfile
   axes: Axis[]
   domains: Domain[]
   labels: LabelWithInfluences[]
   answers: AnswerMap
   compareResult?: ResultProfile | null
   onCompare: (answers: AnswerMap) => void
   onRestart: () => void
}

interface PhilosophyRow {
   philosophy: string
   layer: Layer
   score: number
   axisIds: AxisId[]
   labelNames: string[]
   descriptions: string[]
}

const LAYERS: Layer[] = ['normative', 'descriptive', 'prescriptive']

function formatFamilyName(family: string): string {
   return family
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

function topFit(subfamilies: Record<string, { fit: number }[]>): number {
   let best = 0
   for (const matches of Object.values(subfamilies)) {
      for (const m of matches) if (m.fit > best) best = m.fit
   }
   return best
}

const LAYER_TITLES = {
   normative: 'Normative profile — what you believe is morally legitimate',
   descriptive: 'Descriptive profile — what you believe is empirically true',
   prescriptive: 'Prescriptive profile — what you think should be done now',
} as const

const LAYER_LABELS: Record<Layer, string> = {
   normative: 'Normative',
   descriptive: 'Descriptive',
   prescriptive: 'Prescriptive',
}

const GENERAL_PHILOSOPHY_DESCRIPTIONS: Record<string, string> = {
   Socialism: 'Political traditions that emphasize social ownership, economic democracy, or collective claims over productive resources.',
   Marxism: 'Analysis of class, production relations, and capitalist power as central drivers of political conflict.',
   Environmentalism: 'Political traditions that treat ecological integrity as a central public and moral concern.',
   Populism: 'Political framing that contrasts a people or public with entrenched elites or institutions.',
   Liberalism: 'Political traditions centered on individual rights, legal equality, and constrained public power.',
   Nationalism: 'Political traditions that give national identity, sovereignty, or self-determination special importance.',
}

function philosophyOverview(philosophy: string): string {
   return GENERAL_PHILOSOPHY_DESCRIPTIONS[philosophy] ?? 'A recurring influence among the nearest labels, shown through the specific axes below.'
}

function scoreByAxis(result: ResultProfile): Map<AxisId, number> {
   const entries = LAYERS.flatMap((layer) => result.scores[layer].map((score) => [score.axisId, score.normalized] as const))
   return new Map(entries)
}

function alignment(score: number, centroid: number): number {
   return Math.max(0, 1 - Math.abs(score - centroid) / 2)
}

function topPhilosophyRows(result: ResultProfile, labels: LabelWithInfluences[], axes: Axis[]): PhilosophyRow[] {
   const labelById = new Map(labels.map((label) => [label.id, label]))
   const axisById = new Map(axes.map((axis) => [axis.id, axis]))
   const userScores = scoreByAxis(result)
   const conflationByLabel = new Map(result.conflatedLabels.map((flag) => [flag.labelId, flag]))
   const rows = new Map<string, PhilosophyRow>()

   for (const match of result.nearestLabels) {
      const label = labelById.get(match.labelId)
      if (!label?.philosophyInfluences) continue
      const conflation = conflationByLabel.get(match.labelId)

      for (const influence of label.philosophyInfluences) {
         for (const layer of LAYERS) {
            const axisIds = influence.affectedAxes.filter((axisId) => axisById.get(axisId)?.layer === layer)
            if (axisIds.length === 0) continue

            const axisAlignments = axisIds.map((axisId) => alignment(userScores.get(axisId) ?? 0, label.centroid[axisId] ?? 0))
            const meanAlignment = axisAlignments.reduce((sum, value) => sum + value, 0) / axisAlignments.length
            const layerAgreement = conflation?.layerAgreement[layer] ?? match.fit
            const score = match.fit * layerAgreement * meanAlignment
            const key = `${layer}:${influence.philosophy}`
            const existing = rows.get(key)

            if (existing) {
               existing.score += score
               existing.axisIds = Array.from(new Set([...existing.axisIds, ...axisIds]))
               existing.labelNames = Array.from(new Set([...existing.labelNames, label.name]))
               existing.descriptions = Array.from(new Set([...existing.descriptions, influence.description]))
            } else {
               rows.set(key, {
                  philosophy: influence.philosophy,
                  layer,
                  score,
                  axisIds,
                  labelNames: [label.name],
                  descriptions: [influence.description],
               })
            }
         }
      }
   }

   return LAYERS.flatMap((layer) =>
      Array.from(rows.values())
         .filter((row) => row.layer === layer)
         .sort((a, b) => b.score - a.score)
         .slice(0, 5),
   )
}

function groupLabels(labels: LabelWithInfluences[]): Record<string, Record<string, LabelWithInfluences[]>> {
   const grouped: Record<string, Record<string, LabelWithInfluences[]>> = {}
   for (const label of labels) {
      const family = label.family
      const subfamily = label.subfamily ?? label.family
      grouped[family] ??= {}
      grouped[family][subfamily] ??= []
      grouped[family][subfamily].push(label)
   }
   return grouped
}

function labelMatchesSearch(label: LabelWithInfluences, query: string): boolean {
   if (!query) return true
   const haystack = [
      label.name,
      label.family,
      label.subfamily,
      label.description,
      ...(label.aliases ?? []),
      ...(label.philosophies ?? []),
   ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
   return haystack.includes(query.toLowerCase())
}

function labelEvidenceSummary(
   label: LabelWithInfluences,
   labelReliability?: LabelReliability,
   axisReliabilities?: Record<AxisId, AxisReliability>,
   axisById?: Map<AxisId, Axis>,
): string {
   const sparseAxes = Object.keys(label.centroid)
      .filter((axisId): axisId is AxisId => {
         const reliability = axisReliabilities?.[axisId]
         return !reliability || reliability.band === 'insufficient' || reliability.itemCount < 3
      })
      .map((axisId) => axisById?.get(axisId)?.name ?? axisId)
      .slice(0, 2)

   const reliabilityText = labelReliability
      ? `${labelReliability.band} evidence · ${labelReliability.evidenceCount} contributing answers`
      : 'evidence unavailable'
   const sparseText = sparseAxes.length > 0 ? ` · sparse axes: ${sparseAxes.join(', ')}` : ''
   return `${reliabilityText}${sparseText}`
}

function LabelCard({
   label,
   match,
   labelReliability,
   axisReliabilities,
   axisById,
}: {
   label: LabelWithInfluences
   match?: LabelMatch
   labelReliability?: LabelReliability
   axisReliabilities?: Record<AxisId, AxisReliability>
   axisById?: Map<AxisId, Axis>
}) {
   return (
      <article className="label-card">
         <h5>{label.name}</h5>
         {match && (
            <p className="muted">
               {Math.round(match.fit * 100)}% fit
               {match.evidenceStrength < 1 && (
                  <> · {Math.round(match.evidenceStrength * 100)}% measured</>
               )}
               {match.uncertaintyBand !== 'low' && (
                  <> · {match.uncertaintyBand} uncertainty</>
               )}
               {match.runnerUpMargin !== undefined && match.runnerUpMargin < 0.08 && (
                  <> · near-tie</>
               )}
            </p>
         )}
         {match && (
            <p className="muted label-evidence">
               {labelEvidenceSummary(label, labelReliability, axisReliabilities, axisById)}
            </p>
         )}
         <p>{label.description}</p>
         {label.philosophies && label.philosophies.length > 0 && (
            <p className="muted">Philosophies: {label.philosophies.slice(0, 5).join(', ')}</p>
         )}
      </article>
   )
}

export function ResultsScreen({ result, axes, domains, labels, answers, compareResult, onCompare, onRestart }: ResultsScreenProps) {
   const axisById = new Map(axes.map((a) => [a.id, a]))
   const domainById = new Map(domains.map((d) => [d.id, d]))
   const nearestById = new Map(result.nearestLabels.map((match) => [match.labelId, match]))
   const philosophyRows = topPhilosophyRows(result, labels, axes)
   const [copied, setCopied] = useState(false)
   const [copying, setCopying] = useState(false)
   const [copyError, setCopyError] = useState<string | null>(null)
   const [compareUrlInput, setCompareUrlInput] = useState('')
   const [compareError, setCompareError] = useState<string | null>(null)
   const [labelSearch, setLabelSearch] = useState('')
   const [shareUrl, setShareUrl] = useState<string | null>(null)
   const visibleLabels = labels.filter((label) => labelMatchesSearch(label, labelSearch))
   const groupedLabels = groupLabels(visibleLabels)

   function handleCopyLink() {
      const meta = result.bankVersion ? { bankVersion: result.bankVersion, scoringVersion: result.scoringVersion } : undefined
      const url = buildShareUrl(answers, meta)
      if (!navigator.clipboard?.writeText) {
         setCopied(false)
         setShareUrl(url)
         setCopyError("Automatic copying isn't available here. Select the link below and copy it manually.")
         return
      }
      setCopying(true)
      navigator.clipboard.writeText(url).then(
         () => {
            setCopied(true)
            setCopyError(null)
            setShareUrl(null)
            setCopying(false)
         },
         (err) => {
            console.error('Clipboard write failed:', err)
            setCopied(false)
            setShareUrl(url)
            setCopyError("We couldn't copy the link automatically. Select the link below and copy it manually.")
            setCopying(false)
         },
      )
   }

   function handleCompareLink() {
      const encoded = extractEncodedAnswers(compareUrlInput, 'r')
      const parsedAnswers = encoded ? decodeAnswers(encoded) : null
      if (!parsedAnswers || Object.keys(parsedAnswers).length === 0) {
         setCompareError("We couldn't read that link. Paste a full shared result link (it should contain '#r=').")
         return
      }

      onCompare(parsedAnswers)
      setCompareError(null)
      const meta = result.bankVersion ? { bankVersion: result.bankVersion, scoringVersion: result.scoringVersion } : undefined
      window.history.replaceState(null, '', buildCompareUrl(answers, parsedAnswers, meta))
   }

   return (
      <section className="screen results-screen">
         <h1>Your results</h1>
         <p className="muted">
            This test separates your normative values, descriptive beliefs, and prescriptive strategy. Labels are secondary.
         </p>

         <button type="button" className="scale-button copy-link-button" onClick={handleCopyLink} disabled={copying}>
            {copying ? 'Copying...' : copied ? 'Link copied' : 'Copy link to this result'}
         </button>
         {copyError && <p className="muted" role="alert">{copyError}</p>}
         {shareUrl && (
            <input
               type="text"
               className="compare-url-input"
               readOnly
               value={shareUrl}
               aria-label="Shareable result link"
               onFocus={(e) => e.currentTarget.select()}
               style={{ width: '100%', padding: '0.3rem 0.5rem' }}
            />
         )}

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
                     maxLength={5000}
                     style={{ flex: 1, padding: '0.3rem 0.5rem' }}
                     aria-label="Shared result link to compare"
                     aria-invalid={compareError ? true : undefined}
                     aria-describedby={compareError ? 'compare-error' : undefined}
                  />
                  <button type="button" className="scale-button" onClick={handleCompareLink}>
                     Compare
                  </button>
               </div>
               {compareError && <p className="muted" role="alert" id="compare-error">{compareError}</p>}
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
         {LAYERS.map((layer) => (
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
               {LAYERS.map((layer) => (
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

         {result.divergences && result.divergences.length > 0 && (
            <div className="result-block">
               <h2>Divergences & Strategic Compromises</h2>
               <p className="muted">
                  These reports highlight conflicts or trade-offs between different layers of your views.
               </p>
               <ul className="gap-list">
                  {result.divergences.map((div, i) => (
                     <li key={i}>
                        <strong style={{ textTransform: 'capitalize' }}>{div.type.replace('_', ' ')}</strong>: {div.description}
                     </li>
                  ))}
               </ul>
            </div>
         )}

         {philosophyRows.length > 0 && (
            <div className="result-block philosophy-explorer">
               <h2>Philosophy Explorer</h2>
               <p className="muted">
                  Top philosophy influences from your nearest labels, grouped by the layer and axes where your scores align.
               </p>
               {LAYERS.map((layer) => {
                  const rows = philosophyRows.filter((row) => row.layer === layer)
                  if (rows.length === 0) return null
                  return (
                     <div key={layer} className="philosophy-layer">
                        <h3>{LAYER_LABELS[layer]}</h3>
                        <div className="philosophy-list">
                           {rows.map((row) => (
                              <article key={`${row.layer}:${row.philosophy}`} className="philosophy-card">
                                 <h4>{row.philosophy}</h4>
                                 <p>{philosophyOverview(row.philosophy)}</p>
                                 <p className="muted">In these matched labels: {row.descriptions.slice(0, 2).join('; ')}</p>
                                 <p className="muted">Seen in: {row.labelNames.slice(0, 3).join(', ')}</p>
                                 <div className="axis-chip-list">
                                    {row.axisIds.map((axisId) => {
                                       const axis = axisById.get(axisId)
                                       const score = result.scores[layer].find((s) => s.axisId === axisId)
                                       return axis ? (
                                          <span key={axisId} className="axis-chip">
                                             {axis.name}: {score ? score.normalized.toFixed(2) : '0.00'}
                                          </span>
                                       ) : null
                                    })}
                                 </div>
                              </article>
                           ))}
                        </div>
                     </div>
                  )
               })}
            </div>
         )}

         <div className="result-block">
            <h2>Nearest ideology labels</h2>
            {result.familySubtree && Object.keys(result.familySubtree).length > 0 ? (
               Object.entries(result.familySubtree)
                  .sort((a, b) => topFit(b[1]) - topFit(a[1]))
                  .map(([family, subfamilies]) => (
                     <details key={family} className="family-group" open>
                        <summary className="family-name">{formatFamilyName(family)}</summary>
                        {Object.entries(subfamilies)
                           .sort((a, b) => (b[1][0]?.fit ?? 0) - (a[1][0]?.fit ?? 0))
                           .map(([subfamily, matches]) => (
                              <details key={subfamily} className="subfamily-group" open>
                                 <summary className="subfamily-name">{subfamily !== family ? formatFamilyName(subfamily) : 'Top matches'}</summary>
                                 <div className="label-card-list">
                                    {matches.map((match) => {
                                       const label = labels.find((l) => l.id === match.labelId)
                                       return label ? (
                                          <LabelCard
                                             key={match.labelId}
                                             label={label}
                                             match={match}
                                             labelReliability={result.labelReliabilities?.[label.id]}
                                             axisReliabilities={result.axisReliabilities}
                                             axisById={axisById}
                                          />
                                       ) : null
                                    })}
                                 </div>
                              </details>
                           ))}
                     </details>
                  ))
            ) : (
               <ol className="label-list">
                  {result.nearestLabels.map((match) => (
                     <li key={match.labelId}>
                        {match.name} <span className="muted">({Math.round(match.fit * 100)}% fit)</span>
                     </li>
                  ))}
               </ol>
            )}
         </div>

         <details className="result-block full-label-browser">
            <summary>
               <h2>Browse all ideology labels</h2>
            </summary>
            <p className="muted">Search all {labels.length} labels by name, family, subfamily, aliases, or philosophy.</p>
            <input
               type="search"
               className="label-search-input"
               value={labelSearch}
               maxLength={200}
               onChange={(e) => setLabelSearch(e.target.value)}
               placeholder="Search labels, families, aliases, philosophies..."
               aria-label="Search ideology labels"
            />
            <p className="muted">Showing {visibleLabels.length} labels.</p>
            {Object.entries(groupedLabels)
               .sort(([a], [b]) => formatFamilyName(a).localeCompare(formatFamilyName(b)))
               .map(([family, subfamilies]) => (
                  <details key={family} className="family-group">
                     <summary className="family-name">{formatFamilyName(family)}</summary>
                     {Object.entries(subfamilies)
                        .sort(([a], [b]) => formatFamilyName(a).localeCompare(formatFamilyName(b)))
                        .map(([subfamily, familyLabels]) => (
                           <details key={subfamily} className="subfamily-group">
                              <summary className="subfamily-name">{subfamily !== family ? formatFamilyName(subfamily) : 'Labels'}</summary>
                              <div className="label-card-list">
                                 {familyLabels
                                    .slice()
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((label) => (
                                       <LabelCard
                                          key={label.id}
                                          label={label}
                                          match={nearestById.get(label.id)}
                                          labelReliability={result.labelReliabilities?.[label.id]}
                                          axisReliabilities={result.axisReliabilities}
                                          axisById={axisById}
                                       />
                                    ))}
                              </div>
                           </details>
                        ))}
                  </details>
               ))}
         </details>

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
                           {LAYERS.map((layer) => (
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
