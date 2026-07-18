import { useMemo, useState } from 'react'
import type { IdeologyLabel } from '../types'
import type { ResearchIdentity } from '../research'

interface SelfIdentificationScreenProps {
  labels: IdeologyLabel[]
  onContinue: (identity: ResearchIdentity) => Promise<void>
}

export function SelfIdentificationScreen({ labels, onContinue }: SelfIdentificationScreenProps) {
  const [selfLabelId, setSelfLabelId] = useState('')
  const [ageBand, setAgeBand] = useState<ResearchIdentity['ageBand']>()
  const [genderGroup, setGenderGroup] = useState<ResearchIdentity['genderGroup']>()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sortedLabels = useMemo(() => [...labels].sort((a, b) => a.name.localeCompare(b.name)), [labels])

  async function continueToResults(): Promise<void> {
    setSubmitting(true)
    setError(null)
    try {
      await onContinue({
        selfLabelId: selfLabelId || undefined,
        ageBand,
        genderGroup,
      })
    } catch (cause) {
      setSubmitting(false)
      setError(cause instanceof Error ? cause.message : 'The research record could not be prepared.')
    }
  }

  return (
    <section className="screen intro-screen">
      <h1>Before seeing your result</h1>
      <p>
        These optional questions measure whether the instrument agrees with how respondents describe themselves before
        seeing its output. Leaving any field blank does not prevent you from continuing.
      </p>

      <label className="form-field">
        <span>Which political label is closest to your current self-description?</span>
        <select value={selfLabelId} onChange={(event) => setSelfLabelId(event.target.value)}>
          <option value="">No label, unsure, other, or prefer not to answer</option>
          {sortedLabels.map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}
        </select>
      </label>

      <label className="form-field">
        <span>Age band</span>
        <select value={ageBand ?? ''} onChange={(event) => setAgeBand(event.target.value as ResearchIdentity['ageBand'] || undefined)}>
          <option value="">Prefer not to answer</option>
          <option value="18-24">18–24</option>
          <option value="25-34">25–34</option>
          <option value="35-44">35–44</option>
          <option value="45-54">45–54</option>
          <option value="55-64">55–64</option>
          <option value="65+">65+</option>
        </select>
      </label>

      <label className="form-field">
        <span>Gender group for optional measurement-invariance analysis</span>
        <select
          value={genderGroup ?? ''}
          onChange={(event) => setGenderGroup(event.target.value as ResearchIdentity['genderGroup'] || undefined)}
        >
          <option value="">Prefer not to answer</option>
          <option value="woman">Woman</option>
          <option value="man">Man</option>
          <option value="nonbinary-or-another">Nonbinary or another gender</option>
        </select>
      </label>

      {error && <p role="alert" className="muted error-inline">{error}</p>}
      <button type="button" className="primary-button" disabled={submitting} onClick={continueToResults}>
        {submitting ? 'Preparing record…' : 'Continue to results'}
      </button>
    </section>
  )
}
