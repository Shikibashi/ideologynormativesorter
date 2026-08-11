import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IntroScreen } from './IntroScreen'
import { MethodologyScreen } from './MethodologyScreen'

afterEach(cleanup)

describe('respondent-facing instrument copy', () => {
  it('describes short forms without stale per-layer coverage guarantees', () => {
    render(
      <IntroScreen
        questionCounts={{ blitz: 19, quick: 56, moderate: 158, extensive: 336 }}
        domainCount={20}
        contributionAvailable
        savedProgress={null}
        onResume={vi.fn()}
        onStart={vi.fn()}
        onClearSavedProgress={vi.fn()}
      />,
    )

    expect(screen.getByText(/a short snapshot spanning all three layers/i)).toBeInTheDocument()
    expect(screen.getByText(/some layer\/domain gaps under editorial review/i)).toBeInTheDocument()
    expect(screen.queryByText(/seven items per layer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/one item per domain per layer/i)).not.toBeInTheDocument()
  })

  it('accurately describes the active agreement scale and skipped-rating behavior', () => {
    render(<MethodologyScreen onBack={vi.fn()} />)

    expect(screen.getByText(/ordered seven-point agreement scales/i)).toBeInTheDocument()
    expect(screen.getByText(/skipping that rating excludes the answer from the result/i)).toBeInTheDocument()
    expect(screen.queryByText(/five- or seven-point agreement scales/i)).not.toBeInTheDocument()
  })
})
