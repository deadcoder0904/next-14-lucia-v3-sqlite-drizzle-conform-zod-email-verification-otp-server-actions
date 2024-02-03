/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['hoppscotch.io', 'localhost:3000'],
      allowedForwardedHosts: ['hoppscotch.io', 'localhost:3000'],
    },
  },
}

module.exports = nextConfig
