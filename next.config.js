/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FULLSTORY_ORG_ID: 'o-1GSQSE-na1',
  },
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NODE_ENV === 'production' ? 'https://aif-app-server.herokuapp.com' : 'http://localhost:8080'
  },
  images: {
    domains: ['scontent-mia3-1.xx.fbcdn.net', 'i.scdn.co'],
  }
}

module.exports = nextConfig
