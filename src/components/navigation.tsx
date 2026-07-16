'use client'

import { useEffect, useState } from 'react'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300',
        scrolled
          ? 'bg-ivory/90 text-navy shadow-sm backdrop-blur-md dark:bg-navy/90 dark:text-ivory'
          : 'bg-transparent text-ivory'
      )}
    >
      <button
        onClick={scrollToTop}
        className="font-chinese text-2xl tracking-[-0.1em] focus:outline-none"
        aria-label="Go to top"
      >
        我们的二十年
      </button>
      <ThemeToggle />
    </header>
  )
}
