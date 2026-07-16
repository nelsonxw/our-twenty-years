'use client'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const blocks = content
    .split(/\n\n+/)
    .filter(Boolean)
    .map((block, i) => {
      const trimmed = block.trim()

      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={i}
            className="mb-4 mt-8 font-serif text-2xl text-navy dark:text-ivory"
          >
            {trimmed.replace('### ', '')}
          </h3>
        )
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="mb-4 mt-10 font-serif text-3xl text-navy dark:text-ivory"
          >
            {trimmed.replace('## ', '')}
          </h2>
        )
      }

      if (trimmed.startsWith('# ')) {
        return (
          <h1
            key={i}
            className="mb-6 font-serif text-4xl text-navy dark:text-ivory"
          >
            {trimmed.replace('# ', '')}
          </h1>
        )
      }

      const html = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')

      return (
        <p
          key={i}
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )
    })

  return <div>{blocks}</div>
}
