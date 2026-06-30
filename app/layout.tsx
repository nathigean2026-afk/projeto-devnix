import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  // Apenas os pesos realmente usados — reduz payload de fonte
  weight: ['400', '500', '700', '800', '900'],
  display: 'swap',
  preload: true,
  // fallback reduz CLS enquanto a fonte carrega
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  title: 'Elevanthe | Tecnologia que Eleva Negócios',
  description:
    'Elevanthe — Tecnologia que Eleva Negócios. Desenvolvimento de sites, software personalizado, plataformas analíticas, landing pages e e-commerce sob medida para o seu negócio.',
  keywords: ['desenvolvimento web', 'software personalizado', 'elevanthe', 'sites profissionais', 'soluções web', 'tecnologia', 'next.js'],
  authors: [{ name: 'Elevanthe' }],
  creator: 'Elevanthe',
  metadataBase: new URL('https://www.elevanthe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.elevanthe.com',
    title: 'Elevanthe | Tecnologia que Eleva Negócios',
    description:
      'Desenvolvimento de sites, software personalizado, plataformas analíticas e e-commerce sob medida para o seu negócio.',
    siteName: 'Elevanthe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elevanthe | Tecnologia que Eleva Negócios',
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
      <head>
        {/* Preconnect para fontes — elimina round-trip extra no LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground noise-overlay">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
