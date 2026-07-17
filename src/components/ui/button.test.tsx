import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from './button'

describe('buttonVariants', () => {
  it('applies default variant and size classes', () => {
    const cls = buttonVariants({})
    expect(cls).toContain('bg-navy')
    expect(cls).toContain('h-10')
  })

  it('applies the requested variant and size', () => {
    const cls = buttonVariants({ variant: 'ghost', size: 'icon' })
    expect(cls).toContain('hover:bg-navy/5')
    expect(cls).toContain('rounded-full')
  })

  it('merges extra className', () => {
    expect(buttonVariants({ className: 'custom-x' })).toContain('custom-x')
  })
})

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Click</Button>)
    const btn = screen.getByRole('button', { name: 'Click' })
    expect(btn.tagName).toBe('BUTTON')
  })

  it('forwards native props such as disabled and onClick', () => {
    render(<Button disabled>Nope</Button>)
    expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled()
  })

  it('renders as a child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toHaveAttribute('href', '/home')
    expect(link.className).toContain('bg-navy')
  })
})
