import { ReactNode } from 'react'
import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@chinese-fonts/rmjzqpybxs/dist/瑞美加张清平硬笔行书/result.css'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Our Twenty Years | 2006–2026',
  description:
    'A digital memoir celebrating twenty years of marriage, love, and shared memories from 2006 to 2026.',
  openGraph: {
    title: 'Our Twenty Years',
    description: 'A digital memoir celebrating twenty years of marriage.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Twenty Years',
    description: 'A digital memoir celebrating twenty years of marriage.',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
