import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MakeupStudio - Practice Makeup on Your Photo',
  description: 'A privacy-first web app to practice makeup techniques on your own photos using realistic brushes and AI-powered face detection.',
  keywords: 'makeup, practice, photo editing, beauty, cosmetics, virtual makeup, face detection',
  authors: [{ name: 'MakeupStudio' }],
  creator: 'MakeupStudio',
  publisher: 'MakeupStudio',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://makeup-studio.vercel.app',
    title: 'MakeupStudio - Practice Makeup on Your Photo',
    description: 'Practice makeup techniques on your own photos with realistic brushes and AI-powered face detection.',
    siteName: 'MakeupStudio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakeupStudio - Practice Makeup on Your Photo',
    description: 'Practice makeup techniques on your own photos with realistic brushes and AI-powered face detection.',
    creator: '@makeupstudio',
  },
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="bg-studio-darker text-white min-h-screen">
        {children}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}