import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_t, tag: string) =>
          ({ children, animate, transition, ...props }: any) =>
            React.createElement(tag, props, children),
      }
    ),
  }
})

import { ScrollIndicator } from './scroll-indicator'

describe('ScrollIndicator', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders an accessible scroll button', () => {
    render(<ScrollIndicator />)
    expect(screen.getByLabelText('Scroll to first chapter')).toBeInTheDocument()
  })

  it('scrolls the first chapter into view when clicked', () => {
    const target = document.createElement('div')
    target.id = 'year-2006'
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    document.body.appendChild(target)

    render(<ScrollIndicator />)
    fireEvent.click(screen.getByLabelText('Scroll to first chapter'))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('does nothing when the first chapter element is absent', () => {
    render(<ScrollIndicator />)
    expect(() =>
      fireEvent.click(screen.getByLabelText('Scroll to first chapter'))
    ).not.toThrow()
  })
})
