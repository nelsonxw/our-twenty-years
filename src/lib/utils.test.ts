import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('supports conditional object syntax', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('supports array syntax', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })

  it('dedupes conflicting tailwind classes, keeping the last', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-navy', 'text-ivory')).toBe('text-ivory')
  })

  it('merges non-conflicting tailwind utilities', () => {
    expect(cn('px-2 py-1', 'text-sm')).toBe('px-2 py-1 text-sm')
  })

  it('returns an empty string with no arguments', () => {
    expect(cn()).toBe('')
  })
})
