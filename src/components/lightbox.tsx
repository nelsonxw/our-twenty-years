'use client'

import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-ivory transition hover:text-champagne"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory transition hover:text-champagne"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory transition hover:text-champagne"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <motion.div
            key={initialIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative h-[80vh] w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[initialIndex]}
              alt={`Image ${initialIndex + 1} of ${images.length}`}
              fill
              priority
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>

          <div className="absolute bottom-6 left-0 w-full text-center font-serif text-sm text-ivory/80">
            {initialIndex + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
