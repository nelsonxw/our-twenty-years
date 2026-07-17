import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from './markdown'

describe('Markdown', () => {
  it('renders an h1 for a "# " block', () => {
    render(<Markdown content="# Title" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Title')
  })

  it('renders an h2 for a "## " block', () => {
    render(<Markdown content="## Subtitle" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subtitle')
  })

  it('renders an h3 for a "### " block', () => {
    render(<Markdown content="### Minor" />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Minor')
  })

  it('splits blocks on blank lines and renders paragraphs', () => {
    const { container } = render(<Markdown content={'First para\n\nSecond para'} />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0]).toHaveTextContent('First para')
    expect(paragraphs[1]).toHaveTextContent('Second para')
  })

  it('converts **bold** to <strong>', () => {
    const { container } = render(<Markdown content="hello **world**" />)
    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(strong).toHaveTextContent('world')
  })

  it('converts *italic* to <em>', () => {
    const { container } = render(<Markdown content="hello *there*" />)
    const em = container.querySelector('em')
    expect(em).not.toBeNull()
    expect(em).toHaveTextContent('there')
  })

  it('ignores empty blocks produced by multiple blank lines', () => {
    const { container } = render(<Markdown content={'A\n\n\n\nB'} />)
    expect(container.querySelectorAll('p')).toHaveLength(2)
  })

  it('renders a mix of headings and paragraphs together', () => {
    const { container } = render(
      <Markdown content={'# Heading\n\nBody text\n\n## Section'} />
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section')
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
