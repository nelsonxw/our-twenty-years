import type { Easing } from 'framer-motion'

export const IN_VIEW_MARGIN = '-100px'

export const REVEAL_VIEWPORT = { once: true, margin: IN_VIEW_MARGIN } as const

interface RevealOptions {
  y?: number
  duration?: number
  delay?: number
  ease?: Easing
}

export function reveal({
  y = 24,
  duration = 0.8,
  delay = 0,
  ease = 'easeOut',
}: RevealOptions = {}) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: { duration, delay, ease },
  }
}
