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
  }
})

import { Reflection } from './reflection'

describe('Reflection', () => {
  it('renders the section heading', () => {
    render(<Reflection content="Some words" />)
    expect(screen.getByRole('heading', { name: 'Looking Back' })).toBeInTheDocument()
  })

  it('renders the provided content through Markdown', () => {
    render(<Reflection content={'## A section\n\nBody paragraph'} />)
    expect(screen.getByRole('heading', { name: 'A section' })).toBeInTheDocument()
    expect(screen.getByText('Body paragraph')).toBeInTheDocument()
  })
})
