'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
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
  const hasChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text)
  const isPanoramicImage = (imagePath: string) => {
    return imagePath.includes('map') || imagePath.toLowerCase().includes('panoram')
  }

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [userInteracted, setUserInteracted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15])

  const lightboxImages = data.heroImage
    ? [data.heroImage, ...data.galleryImages]
    : data.galleryImages

  const displayGallery = data.galleryImages.slice(0, 3)
  const galleryCount = displayGallery.length
  const isWideGalleryLayout = galleryCount > 0 && galleryCount <= 2
  const is2020Gallery = data.year === 2020

  const isGoogleDrive =
    data.heroVideo?.startsWith('https://drive.google.com') ?? false

  const openAt = (i: number) => {
    setPhotoIndex(i)
    setLightboxOpen(true)
  }

  const next = () =>
    setPhotoIndex((i) => (i + 1) % lightboxImages.length)
  const prev = () =>
    setPhotoIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length)

  const isInView = useInView(mediaRef, { once: false, amount: 'some', margin: '-1px' })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    isInViewRef.current = isInView
    if (!document.hidden && isInView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVisibilityChange = () => {
      if (!document.hidden && isInViewRef.current) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const unmuteOnce = () => setUserInteracted(true)
    document.addEventListener('pointerdown', unmuteOnce, { once: true })

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('pointerdown', unmuteOnce)
    }
  }, [])

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
        ref={mediaRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-champagne/30 via-ivory/20 to-transparent lg:h-screen lg:w-1/2 dark:from-navy/40 dark:via-navy/20"
      >
        <motion.div
          style={{ y, scale }}
          className="relative h-full w-full flex items-start justify-center pt-16 lg:pt-24"
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
                ref={videoRef}
                src={data.heroVideo}
                autoPlay
                muted={!userInteracted}
                loop
                playsInline
                controls
                className="h-full w-full bg-rose-950 bg-[url('/rose-pattern.svg')] bg-[length:120px_120px] bg-repeat object-contain"
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
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </button>
          ) : null}
        </motion.div>
      </motion.div>

      <div
        className={cn(
          'flex w-full flex-col justify-center bg-ivory/90 lg:w-1/2 dark:bg-navy/90',
          data.year === 2007 ||
          (data.year >= 2009 && data.year <= 2021 && data.year !== 2018) ||
          (data.year >= 2023 && data.year <= 2026)
            ? 'px-8 pb-16 pt-4 lg:justify-start lg:px-16 lg:pb-24 lg:pt-0'
            : 'px-8 py-16 lg:px-16 lg:py-24'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <span className="font-serif text-6xl text-champagne lg:text-8xl">
            {data.year}
          </span>
          <h2 className={cn('mt-4 text-3xl text-navy dark:text-ivory lg:text-5xl', hasChinese(data.title) ? 'font-chinese' : 'font-serif')}>
            {data.title}
          </h2>
          <p className={cn('mt-6 max-w-xl text-lg leading-relaxed text-warm-gray dark:text-[#A8A6C8]', hasChinese(data.summary) && 'font-chinese text-xl lg:text-2xl')}>
            {data.summary}
          </p>

          {data.milestones.length > 0 && (
            <ul className="mt-8 space-y-3">
              {data.milestones.map((milestone) => (
                <li
                  key={milestone}
                  className={cn('flex items-start gap-3 text-navy/80 dark:text-ivory/80', hasChinese(milestone) && 'text-lg lg:text-xl')}
                >
                  <Heart className="mt-1 h-4 w-4 shrink-0 self-start text-champagne" />
                  <span className={cn(hasChinese(milestone) && 'font-chinese')}>{milestone}</span>
                </li>
              ))}
            </ul>
          )}

        {galleryCount > 0 && (
          <div
            className={cn(
              'mt-4 grid',
              is2020Gallery || isWideGalleryLayout
                ? 'grid-cols-1 gap-8'
                : 'grid-cols-3 gap-2 sm:gap-4'
            )}
          >
            {displayGallery.map((image, i) => {
              const isPanoramic = isPanoramicImage(image)
              const imageFitClass = is2020Gallery
                ? 'object-fill'
                : isPanoramic || isWideGalleryLayout
                  ? 'object-contain'
                  : 'object-cover'
              return (
                <button
                  key={image}
                  onClick={() => openAt(i + (data.heroImage ? 1 : 0))}
                  className={cn(
                    'group relative overflow-hidden rounded-lg',
                    is2020Gallery || isPanoramic || isWideGalleryLayout
                      ? 'col-span-full aspect-[40/9]'
                      : 'aspect-[4/3]'
                  )}
                  aria-label={`View gallery image ${i + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${data.title} gallery ${i + 1}`}
                    fill
                    loading="lazy"
                    className={cn(
                      'transition duration-500',
                      !is2020Gallery && 'group-hover:scale-105',
                      imageFitClass
                    )}
                    sizes={
                      is2020Gallery || isPanoramic || isWideGalleryLayout
                        ? '(max-width: 1024px) 100vw, 50vw'
                        : '(max-width: 768px) 33vw, 33vw'
                    }
                  />
                </button>
              )
            })}
          </div>
        )}
        </motion.div>
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={photoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
