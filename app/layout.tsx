import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Devnix | Soluções Web Inteligentes',
  description:
    'Devnix — Soluções Web Inteligentes. Desenvolvimento de sites, software personalizado, plataformas analíticas, landing pages e e-commerce sob medida para o seu negócio.',
  keywords: ['desenvolvimento web', 'software personalizado', 'devnix', 'sites profissionais', 'soluções web', 'freelancer web', 'next.js'],
  authors: [{ name: 'Devnix' }],
  creator: 'Devnix',
  metadataBase: new URL('https://v0-devnix.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://v0-devnix.vercel.app',
    title: 'Devnix | Soluções Web Inteligentes',
    description:
      'Desenvolvimento de sites, software personalizado, plataformas analíticas e e-commerce sob medida para o seu negócio.',
    siteName: 'Devnix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devnix | Soluções Web Inteligentes',
    description:
      'Desenvolvimento de sites, software personalizado e plataformas sob medida para o seu negócio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground noise-overlay">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
