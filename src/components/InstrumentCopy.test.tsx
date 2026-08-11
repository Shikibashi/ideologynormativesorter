import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IntroScreen } from './IntroScreen'
import { MethodologyScreen } from './MethodologyScreen'

afterEach(cleanup)

describe('respondent-facing instrument copy', () => {
  it('offers only outcome-oriented balanced and full-depth public assessments', () => {
    render(
      <IntroScreen
        questionCounts={{ blitz: 17, quick: 51, moderate: 140, extensive: 286 }}
        domainCount={20}
        contributionAvailable
        savedProgress={null}
        onResume={vi.fn()}
        onStart={vi.fn()}
        onClearSavedProgress={vi.fn()}
      />,
    )

    expect(screen.getByRole('radio', { name: /balanced profile/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /full-depth profile/i })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /^moderate\b/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /^extensive\b/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /blitz/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /quick/i })).not.toBeInTheDocument()
  })

  it('accurately describes the active agreement scale and skipped-rating behavior', () => {
    render(<MethodologyScreen onBack={vi.fn()} />)

    expect(screen.getByText(/ordered seven-point agreement scales/i)).toBeInTheDocument()
    expect(screen.getByText(/skipping that rating excludes the answer from the result/i)).toBeInTheDocument()
    expect(screen.getByText(/does not yet provide claim-level citations for every scored label/i)).toBeInTheDocument()
    expect(screen.queryByText(/five- or seven-point agreement scales/i)).not.toBeInTheDocument()
  })
})
