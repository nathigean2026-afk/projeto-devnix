import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Devnix | Soluções Web Inteligentes',
  description:
    'Devnix — Soluções Web Inteligentes. Desenvolvimento de sites, software personalizado, plataformas analíticas, landing pages e e-commerce sob medida para o seu negócio.',
  generator: 'v0.app',
  keywords: ['desenvolvimento web', 'software personalizado', 'devnix', 'sites profissionais', 'soluções web'],
}

export const viewport: Viewport = {
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
