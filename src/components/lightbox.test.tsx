import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Lightbox } from './lightbox'

const images = ['/a.jpg', '/b.jpg', '/c.jpg']

function setup(overrides: Partial<React.ComponentProps<typeof Lightbox>> = {}) {
  const onClose = vi.fn()
  const onPrev = vi.fn()
  const onNext = vi.fn()
  const props = {
    images,
    initialIndex: 0,
    isOpen: true,
    onClose,
    onPrev,
    onNext,
    ...overrides,
  }
  const utils = render(<Lightbox {...props} />)
  return { onClose, onPrev, onNext, ...utils }
}

describe('Lightbox', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders nothing when closed', () => {
    setup({ isOpen: false })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders the dialog with the current position counter when open', () => {
    setup({ initialIndex: 1 })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByLabelText('Close lightbox'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onNext / onPrev from the arrow buttons without triggering close', () => {
    const { onNext, onPrev, onClose } = setup()
    fireEvent.click(screen.getByLabelText('Next image'))
    fireEvent.click(screen.getByLabelText('Previous image'))
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('handles Escape / ArrowLeft / ArrowRight keyboard events', () => {
    const { onClose, onPrev, onNext } = setup()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignores unrelated keys', () => {
    const { onClose, onPrev, onNext } = setup()
    fireEvent.keyDown(window, { key: 'a' })
    expect(onClose).not.toHaveBeenCalled()
    expect(onPrev).not.toHaveBeenCalled()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('does not register keyboard handling while closed', () => {
    const { onClose } = setup({ isOpen: false })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
