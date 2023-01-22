/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: process.env.PORT
  },
  publicRuntimeConfig: {
    env: process.env,
    BACKEND_URL: (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + 'localhost:' + (process.env.PORT || 8080)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
        port: ''
      }
    ]
  }
}

module.exports = nextConfig
