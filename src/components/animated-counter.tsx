'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { REVEAL_VIEWPORT } from '@/lib/animations'

interface AnimatedCounterProps {
  to: number
  duration?: number
}

export function AnimatedCounter({ to, duration = 2.5 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, REVEAL_VIEWPORT)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => setDisplay(Math.round(value)),
    })
    return () => controls.stop()
  }, [isInView, to, duration])

  return <span ref={ref}>{display.toLocaleString()}</span>
}
