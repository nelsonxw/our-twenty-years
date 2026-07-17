import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'

const useInView = vi.fn()
const animate = vi.fn()

vi.mock('framer-motion', () => ({
  useInView: (...args: unknown[]) => useInView(...args),
  animate: (...args: unknown[]) => animate(...args),
}))

import { AnimatedCounter } from './animated-counter'

describe('AnimatedCounter', () => {
  beforeEach(() => {
    useInView.mockReset()
    animate.mockReset()
    animate.mockReturnValue({ stop: vi.fn() })
  })

  it('renders 0 (formatted) before it enters the viewport', () => {
    useInView.mockReturnValue(false)
    render(<AnimatedCounter to={1000} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(animate).not.toHaveBeenCalled()
  })

  it('animates from 0 to the target once in view', () => {
    useInView.mockReturnValue(true)
    render(<AnimatedCounter to={7305} duration={1} />)
    expect(animate).toHaveBeenCalledTimes(1)
    const [from, to, opts] = animate.mock.calls[0]
    expect(from).toBe(0)
    expect(to).toBe(7305)
    expect(opts).toMatchObject({ duration: 1, ease: 'easeOut' })
  })

  it('formats the displayed value with locale separators via onUpdate', () => {
    useInView.mockReturnValue(true)
    render(<AnimatedCounter to={7305} />)
    const { onUpdate } = animate.mock.calls[0][2]
    act(() => onUpdate(7305))
    expect(screen.getByText('7,305')).toBeInTheDocument()
  })
})
