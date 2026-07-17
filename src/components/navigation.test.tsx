import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

import { Navigation } from './navigation'

describe('Navigation', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  it('renders the site title and a go-to-top control', () => {
    render(<Navigation />)
    expect(screen.getByLabelText('Go to top')).toBeInTheDocument()
    expect(screen.getByText('我们的二十年')).toBeInTheDocument()
  })

  it('is transparent at the top of the page', () => {
    const { container } = render(<Navigation />)
    expect(container.querySelector('header')?.className).toContain('bg-transparent')
  })

  it('becomes opaque after scrolling past the threshold', () => {
    const { container } = render(<Navigation />)
    act(() => {
      ;(window as any).scrollY = 120
      window.dispatchEvent(new Event('scroll'))
    })
    expect(container.querySelector('header')?.className).toContain('backdrop-blur-md')
    expect(container.querySelector('header')?.className).not.toContain('bg-transparent')
  })

  it('scrolls to the top when the title is clicked', () => {
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo
    render(<Navigation />)
    fireEvent.click(screen.getByLabelText('Go to top'))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
