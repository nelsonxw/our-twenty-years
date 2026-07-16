'use client'

import { motion } from 'framer-motion'
import { Markdown } from './markdown'

interface ReflectionProps {
  content: string
}

export function Reflection({ content }: ReflectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-[#FDF6EC] to-[#F3E6D0] dark:from-navy dark:via-navy dark:to-navy">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            'url(https://picsum.photos/seed/reflection/1920/1080)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ivory/60 dark:bg-navy/70" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1 }}
        className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center lg:py-32"
      >
        <h2 className="font-serif text-4xl text-navy dark:text-ivory lg:text-5xl">
          Looking Back
        </h2>
        <div className="mt-12 text-left text-lg leading-relaxed text-navy/80 dark:text-ivory/80">
          <Markdown content={content} />
        </div>
      </motion.div>
    </section>
  )
}
