import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SelfIdentificationScreen } from './SelfIdentificationScreen'

afterEach(() => cleanup())

describe('SelfIdentificationScreen', () => {
  it('captures optional multiple ideology names before results', async () => {
    const onContinue = vi.fn().mockResolvedValue(undefined)
    const onSkip = vi.fn()

    render(
      <SelfIdentificationScreen
        labels={[
          {
            id: 'market-liberal',
            name: 'Market Liberal',
            family: 'liberalism',
            centroid: {},
            description: 'A test label.',
          },
        ]}
        onContinue={onContinue}
        onSkip={onSkip}
      />,
    )

    fireEvent.change(screen.getByLabelText(/other ideology, tradition, or movement/i), {
      target: { value: 'Mutualism, Pan-Africanism' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit contribution and see result/i }))

    expect(onContinue).toHaveBeenCalledWith({
      selfReportedIdeologies: 'Mutualism, Pan-Africanism',
    })
  })

  it('lets the respondent skip submission after completing the assessment', () => {
    const onSkip = vi.fn()
    render(<SelfIdentificationScreen labels={[]} onContinue={vi.fn()} onSkip={onSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /skip contribution and see result/i }))

    expect(onSkip).toHaveBeenCalledOnce()
  })
})
