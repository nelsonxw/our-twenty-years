'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Lightbox } from './lightbox'
import { cn } from '@/lib/utils'
import type { YearData } from '@/lib/types'

interface YearChapterProps {
  data: YearData
  index: number
}

export function YearChapter({ data, index }: YearChapterProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15])

  const allImages = data.heroImage
    ? [data.heroImage, ...data.galleryImages]
    : data.galleryImages

  const isGoogleDrive =
    data.heroVideo?.startsWith('https://drive.google.com') ?? false

  const openAt = (i: number) => {
    setPhotoIndex(i)
    setLightboxOpen(true)
  }

  const next = () =>
    setPhotoIndex((i) => (i + 1) % allImages.length)
  const prev = () =>
    setPhotoIndex((i) => (i - 1 + allImages.length) % allImages.length)

  return (
    <section
      id={`year-${data.year}`}
      ref={sectionRef}
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden lg:flex-row',
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative h-[60vh] w-full overflow-hidden lg:h-auto lg:w-1/2 lg:min-h-screen"
      >
        <motion.div
          style={{ y, scale }}
          className="relative h-full w-full"
        >
          {data.heroVideo ? (
            isGoogleDrive ? (
              <iframe
                src={data.heroVideo}
                title={`${data.title} video`}
                allow="autoplay; fullscreen; local-network-access *; local-network *; loopback-network *"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <video
                src={data.heroVideo}
                controls
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                aria-label={`${data.title} video`}
              />
            )
          ) : data.heroImage ? (
            <button
              onClick={() => openAt(0)}
              className="block h-full w-full"
              aria-label={`View ${data.title} hero image`}
            >
              <Image
                src={data.heroImage}
                alt={data.title}
                fill
                priority={index < 2}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </button>
          ) : null}
        </motion.div>
      </motion.div>

      <div className="flex w-full flex-col justify-center bg-ivory/90 px-8 py-16 lg:w-1/2 lg:px-16 lg:py-24 dark:bg-navy/90">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <span className="font-serif text-6xl text-champagne lg:text-8xl">
            {data.year}
          </span>
          <h2 className="mt-4 font-serif text-3xl text-navy dark:text-ivory lg:text-5xl">
            {data.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-warm-gray">
            {data.summary}
          </p>

          {data.milestones.length > 0 && (
            <ul className="mt-8 space-y-3">
              {data.milestones.map((milestone) => (
                <li
                  key={milestone}
                  className="flex items-center gap-3 text-navy/80 dark:text-ivory/80"
                >
                  <Heart className="h-4 w-4 text-champagne" />
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          )}

          {data.galleryImages.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.galleryImages.map((image, i) => (
                <button
                  key={image}
                  onClick={() => openAt(i + (data.heroImage ? 1 : 0))}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                  aria-label={`View gallery image ${i + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${data.title} gallery ${i + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Lightbox
        images={allImages}
        initialIndex={photoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
