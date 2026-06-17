/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable Next.js built-in image optimization (avif + webp, aggressive caching)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  // Gzip/Brotli compression
  compress: true,
  // Remove X-Powered-By header (security + best-practices)
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
