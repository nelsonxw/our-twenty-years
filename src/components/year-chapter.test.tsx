import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import type { YearData } from '@/lib/types'

vi.mock('next/image', () => ({
  default: ({ alt, src, priority, fill, sizes, loading, ...rest }: any) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} src={typeof src === 'string' ? src : ''} {...rest} />
  ),
}))

vi.mock('framer-motion', () => {
  const React = require('react')
  const passthrough = (tag: string) =>
    React.forwardRef(({ children, ...props }: any, ref: any) => {
      const clean = { ...props }
      delete clean.initial
      delete clean.animate
      delete clean.whileInView
      delete clean.viewport
      delete clean.transition
      delete clean.exit
      return React.createElement(tag, { ...clean, ref }, children)
    })
  return {
    motion: new Proxy({}, { get: (_t, tag: string) => passthrough(tag) }),
    AnimatePresence: ({ children }: any) => children,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useInView: () => false,
  }
})

import { YearChapter } from './year-chapter'

const base: YearData = {
  year: 2010,
  title: 'A New Arrival',
  summary: 'The world got bigger.',
  heroImage: 'https://picsum.photos/seed/2010/1920/1080',
  galleryImages: [
    'https://picsum.photos/seed/2010-g1/800/600',
    'https://picsum.photos/seed/2010-g2/800/600',
    'https://picsum.photos/seed/2010-g3/800/600',
    'https://picsum.photos/seed/2010-g4/800/600',
  ],
  milestones: ['Welcome first child', 'First family portrait'],
}

describe('YearChapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // jsdom does not implement media playback
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  it('renders year, title, summary and milestones', () => {
    render(<YearChapter data={base} index={0} />)
    expect(screen.getByText('2010')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A New Arrival' })).toBeInTheDocument()
    expect(screen.getByText('The world got bigger.')).toBeInTheDocument()
    expect(screen.getByText('Welcome first child')).toBeInTheDocument()
    expect(screen.getByText('First family portrait')).toBeInTheDocument()
  })

  it('limits the displayed gallery to the first three images', () => {
    render(<YearChapter data={base} index={0} />)
    expect(screen.getByLabelText('View gallery image 1')).toBeInTheDocument()
    expect(screen.getByLabelText('View gallery image 3')).toBeInTheDocument()
    expect(screen.queryByLabelText('View gallery image 4')).toBeNull()
  })

  it('reverses layout for odd indexes', () => {
    const { container } = render(<YearChapter data={base} index={1} />)
    expect(container.querySelector('section')?.className).toContain('lg:flex-row-reverse')
  })

  it('does not reverse layout for even indexes', () => {
    const { container } = render(<YearChapter data={base} index={2} />)
    expect(container.querySelector('section')?.className).not.toContain('lg:flex-row-reverse')
  })

  it('uses the section id derived from the year', () => {
    const { container } = render(<YearChapter data={base} index={0} />)
    expect(container.querySelector('section')?.id).toBe('year-2010')
  })

  it('opens the lightbox when the hero image button is clicked', () => {
    render(<YearChapter data={base} index={0} />)
    fireEvent.click(screen.getByLabelText('View A New Arrival hero image'))
    const dialog = screen.getByRole('dialog')
    // hero image is index 0 -> "1 / 5" (hero + 4 gallery images)
    expect(within(dialog).getByText('1 / 5')).toBeInTheDocument()
  })

  it('renders a native video when heroVideo is a non-Google-Drive url', () => {
    render(
      <YearChapter
        data={{ ...base, heroVideo: 'https://example.com/clip.mp4' }}
        index={0}
      />
    )
    expect(screen.getByLabelText('A New Arrival video')).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('renders a Google Drive iframe when heroVideo is a drive url', () => {
    render(
      <YearChapter
        data={{ ...base, heroVideo: 'https://drive.google.com/file/d/x/preview' }}
        index={0}
      />
    )
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute('title')).toBe('A New Arrival video')
  })

  it('hides the milestones list when there are none', () => {
    render(<YearChapter data={{ ...base, milestones: [] }} index={0} />)
    expect(document.querySelector('ul')).toBeNull()
  })
})
