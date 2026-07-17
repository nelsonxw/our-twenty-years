'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from './animated-counter'
import { reveal } from '@/lib/animations'

const stats = [
  { label: 'Years Together', value: 20 },
  { label: 'Days Together', value: 7305 },
  { label: 'Family Milestones', value: 4 },
  { label: 'Adventures', value: 48 },
]

export function ByTheNumbers() {
  return (
    <section className="relative bg-navy py-24 text-ivory lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          {...reveal({ y: 30 })}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-4xl text-champagne lg:text-5xl">
            By The Numbers
          </h2>
          <p className="mt-4 text-ivory/70">
            Twenty years, measured in moments.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...reveal({ y: 30, duration: 0.6, delay: i * 0.1 })}
              className="text-center"
            >
              <div className="font-serif text-5xl text-champagne lg:text-6xl">
                <AnimatedCounter to={stat.value} />
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-ivory/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
