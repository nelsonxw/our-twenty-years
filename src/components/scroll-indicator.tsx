'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function ScrollIndicator() {
  const scrollToFirst = () => {
    const el = document.getElementById('year-2006')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.button
      onClick={scrollToFirst}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory"
      aria-label="Scroll to first chapter"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <ChevronDown className="h-8 w-8" />
    </motion.button>
  )
}
