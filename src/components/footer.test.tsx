import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders the title and year range', () => {
    render(<Footer />)
    expect(screen.getByText('Our Twenty Years')).toBeInTheDocument()
    expect(screen.getByText('2006–2026')).toBeInTheDocument()
  })

  it('renders inside a contentinfo landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
