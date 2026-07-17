import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_t, tag: string) =>
          ({ children, initial, whileInView, viewport, transition, ...props }: any) =>
            React.createElement(tag, props, children),
      }
    ),
    useInView: () => false,
    animate: vi.fn(),
  }
})

import { ByTheNumbers } from './by-the-numbers'

describe('ByTheNumbers', () => {
  it('renders the section heading', () => {
    render(<ByTheNumbers />)
    expect(screen.getByRole('heading', { name: 'By The Numbers' })).toBeInTheDocument()
  })

  it('renders all four stat labels', () => {
    render(<ByTheNumbers />)
    for (const label of ['Years Together', 'Days Together', 'Family Milestones', 'Adventures']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('renders a counter (starting at 0) per stat', () => {
    render(<ByTheNumbers />)
    // AnimatedCounter renders 0 before entering view (useInView mocked to false)
    expect(screen.getAllByText('0')).toHaveLength(4)
  })
})
