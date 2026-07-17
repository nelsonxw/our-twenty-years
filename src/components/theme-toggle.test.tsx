import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const setTheme = vi.fn()
let currentTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: currentTheme, setTheme }),
}))

import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear()
    currentTheme = 'light'
  })

  it('renders a toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })

  it('switches to dark when currently light', () => {
    currentTheme = 'light'
    render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Toggle theme'))
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('switches to light when currently dark', () => {
    currentTheme = 'dark'
    render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Toggle theme'))
    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
