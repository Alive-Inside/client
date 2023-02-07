const { hostname } = require("os")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FULLSTORY_ORG_ID: 'o-1GSQSE-na1',
  },
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NODE_ENV === 'production' ? 'https://www.aifapp.com' : 'http://localhost:8080'
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.fbcdn.net',
      },
      {
        hostname: '*.scdn.co'
      }
    ]
  }
}

module.exports = nextConfig
