import { useState } from 'react'
import type { SpecialistCriterionResponse, SpecialistModuleDefinition } from '../specialist'

interface SpecialistCriterionScreenProps {
  module: SpecialistModuleDefinition
  onContinue: (criterion: SpecialistCriterionResponse) => void
  onSkip: () => void
}

export function SpecialistCriterionScreen({ module, onContinue, onSkip }: SpecialistCriterionScreenProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [noneOrUnsure, setNoneOrUnsure] = useState(false)
  const [confidence, setConfidence] = useState<SpecialistCriterionResponse['confidence']>('medium')

  function toggleOption(id: string): void {
    setNoneOrUnsure(false)
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }

  function toggleNone(): void {
    setSelectedIds([])
    setNoneOrUnsure((current) => !current)
  }

  const canContinue = noneOrUnsure || selectedIds.length > 0

  return (
    <section className="screen intro-screen">
      <h1>Before seeing the follow-up result</h1>
      <p>
        Which of these traditions, if any, do you already use to describe your own political outlook? Select all that
        genuinely fit. This answer is collected before showing the module score so it can serve as an independent
        validation criterion.
      </p>

      <fieldset className="tier-picker">
        <legend>{module.shortTitle}</legend>
        {module.criterionOptions.map((option) => {
          const selected = selectedIds.includes(option.id)
          return (
            <label key={option.id} className={`tier-option${selected ? ' selected' : ''}`}>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleOption(option.id)}
              />
              <span>
                <span className="tier-option-label">
                  {option.label}{option.variant ? ` — ${option.variant}` : ''}
                </span>
                <span className="tier-option-description">{option.description}</span>
              </span>
            </label>
          )
        })}
        <label className={`tier-option${noneOrUnsure ? ' selected' : ''}`}>
          <input type="checkbox" checked={noneOrUnsure} onChange={toggleNone} />
          <span className="tier-option-label">None of these / I am not sure</span>
        </label>
      </fieldset>

      <fieldset className="tier-picker">
        <legend>How confident are you in that self-description?</legend>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <label key={level} className={`tier-option${confidence === level ? ' selected' : ''}`}>
            <input
              type="radio"
              name="specialist-criterion-confidence"
              value={level}
              checked={confidence === level}
              onChange={() => setConfidence(level)}
            />
            <span className="tier-option-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        className="primary-button"
        disabled={!canContinue}
        onClick={() => onContinue({ selectedIds, noneOrUnsure, confidence })}
      >
        Submit follow-up and show result
      </button>
      <button type="button" className="back-link" onClick={onSkip}>
        Do not submit this follow-up
      </button>
    </section>
  )
}
