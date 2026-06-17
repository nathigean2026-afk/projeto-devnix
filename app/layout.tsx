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
  preload: false,
})

const BASE_URL = 'https://v0-devnix.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Devnix | Soluções Web Inteligentes',
    template: '%s | Devnix',
  },
  description:
    'Devnix — Desenvolvimento de sites, software personalizado, plataformas analíticas, landing pages e e-commerce sob medida para o seu negócio. Código-fonte entregue, sem limites de escala.',
  keywords: [
    'desenvolvimento web', 'software personalizado', 'devnix',
    'sites profissionais', 'soluções web', 'landing page', 'e-commerce',
    'sistemas web', 'plataformas digitais',
  ],
  authors: [{ name: 'Devnix', url: BASE_URL }],
  creator: 'Devnix',
  publisher: 'Devnix',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Devnix',
    title: 'Devnix | Soluções Web Inteligentes',
    description:
      'Desenvolvimento de sites, software e plataformas digitais sob medida. Código-fonte entregue, personalizado do zero, sem limites de escala.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Devnix — Soluções Web Inteligentes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devnix | Soluções Web Inteligentes',
    description: 'Desenvolvimento de sites, software e plataformas digitais sob medida.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
      className={`${inter.variable} ${geistMono.variable} bg-background scroll-smooth`}
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
