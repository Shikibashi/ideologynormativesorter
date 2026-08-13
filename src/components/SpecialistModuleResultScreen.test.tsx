import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AnswerMap } from '../types'
import { scoreSpecialistModule, specialistModuleById } from '../specialist'
import { SpecialistModuleResultScreen } from './SpecialistModuleResultScreen'

afterEach(cleanup)

function answerMap(values: Record<string, number>): AnswerMap {
  return Object.fromEntries(
    Object.entries(values).map(([questionId, value]) => [questionId, { questionId, value }]),
  )
}

describe('SpecialistModuleResultScreen', () => {
  it('discloses the historical and source boundary of a mutualism family-level comparison', () => {
    const module = specialistModuleById.get('anarchist-families-module')
    expect(module).toBeDefined()

    const outcome = scoreSpecialistModule(
      'anarchist-families-module',
      answerMap({
        'fm-an-1': 3,
        'fm-an-2': 1,
        'fm-an-3': 1,
        'fm-an-4': 3,
      }),
    )

    render(
      <SpecialistModuleResultScreen
        module={module!}
        outcome={outcome}
        onContinue={vi.fn()}
      />,
    )

    const heading = screen.getByRole('heading', { name: 'Mutualism (family-level)' })
    const card = heading.closest('article')
    expect(card).not.toBeNull()
    const view = within(card!)

    expect(view.getByText(/does not identify Proudhonian, Tuckerite, Labadie-line/i)).toBeInTheDocument()

    fireEvent.click(view.getByText('Scope and limitations'))
    expect(view.getByText(/Joseph \(Jo\) and Laurance Labadie/i)).toBeInTheDocument()
    expect(view.getByText(/C4SS is a contemporary left-market-anarchist organization/i)).toBeInTheDocument()

    fireEvent.click(view.getByText('Sources and scope'))
    expect(view.getByRole('link', { name: 'Pierre-Joseph Proudhon’s Mutualist Social Science' })).toBeInTheDocument()
    expect(view.getByRole('link', { name: 'What Is C4SS?' })).toBeInTheDocument()
    expect(view.getByText(/do not validate this experimental comparison/i)).toBeInTheDocument()
  })

  it('does not display a low-coverage specialist comparison as a public result', () => {
    const module = specialistModuleById.get('anarchist-families-module')
    expect(module).toBeDefined()

    const outcome = scoreSpecialistModule(
      'anarchist-families-module',
      answerMap({
        'fm-an-1': 3,
        'fm-an-2': 0,
      }),
    )

    render(
      <SpecialistModuleResultScreen
        module={module!}
        outcome={outcome}
        onContinue={vi.fn()}
      />,
    )

    expect(screen.queryByRole('heading', { name: 'Individualist Anarchism' })).not.toBeInTheDocument()
    expect(screen.getByText(/no candidate profile met the experimental display threshold/i)).toBeInTheDocument()
  })
})
