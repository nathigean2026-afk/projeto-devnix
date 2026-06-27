/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake apenas os ícones e variants de motion usados — reduz JS ~30%
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Habilita otimização de imagens (compressão, WebP, AVIF, lazy-load)
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Permite query strings em imagens locais (ex: ?v=3 para cache busting)
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/**", search: "**" },
    ],
  },
  // Remover console.log em produção para reduzir bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Headers de cache e segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache longo para assets estáticos
        source: "/(.*)\\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

export default nextConfig
