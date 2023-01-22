/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NODE_ENV === 'production' ? 'https://aif-app-server.herokuapp.com' : 'http://localhost:8080'
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
