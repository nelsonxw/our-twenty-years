'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { ScrollIndicator } from './scroll-indicator'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 scale-110"
      >
        <Image
          src="/images/IMG_8531_enhanced.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/40" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-ivory"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl leading-tight md:text-7xl lg:text-8xl"
        >
          Twenty Years Together
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 font-serif text-2xl tracking-[0.2em] text-champagne md:text-3xl"
        >
          2006–2026
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-ivory/80"
        >
          A love story told one year at a time.
        </motion.p>
      </motion.div>

      <ScrollIndicator />
    </section>
  )
}
