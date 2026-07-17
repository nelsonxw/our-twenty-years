import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/image', () => ({
  default: ({ alt, src, priority, fill, sizes, ...rest }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ''} src={typeof src === 'string' ? src : ''} {...rest} />
  ),
}))

vi.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_t, tag: string) =>
          ({ children, style, initial, animate, transition, ...props }: any) =>
            React.createElement(tag, props, children),
      }
    ),
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
  }
})

import { Hero } from './hero'

describe('Hero', () => {
  it('renders the headline and subtitles', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { name: 'Twenty Years Together' })
    ).toBeInTheDocument()
    expect(screen.getByText('2006–2026')).toBeInTheDocument()
    expect(screen.getByText('A love story told one year at a time.')).toBeInTheDocument()
  })

  it('renders the scroll indicator', () => {
    render(<Hero />)
    expect(screen.getByLabelText('Scroll to first chapter')).toBeInTheDocument()
  })
})
