import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Attempts to play a media element, swallowing only the benign rejections that
 * browsers raise for autoplay/interruption (`NotAllowedError` when autoplay is
 * blocked, `AbortError` when a pending play is interrupted by a pause/load).
 * Any other error is genuinely unexpected and is surfaced to the console
 * instead of being silently discarded.
 */
export function playMediaSafely(media: HTMLMediaElement): void {
  const playback = media.play()
  if (!playback) return

  playback.catch((error: unknown) => {
    const name = error instanceof DOMException ? error.name : ''
    if (name === 'NotAllowedError' || name === 'AbortError') return
    console.error('Unexpected error while playing media', error)
  })
}
