/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 React 严格模式
  reactStrictMode: true,

  // 禁用 x-powered-by 头
  poweredByHeader: false,

  // 生产环境 source maps
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',

  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.gitee.com',
      },
      {
        protocol: 'https',
        hostname: '**.github.com',
      },
    ],
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SITE_URL: process.env.WEBSITE_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
