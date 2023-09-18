/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/sign-in',
        permanent: false,
        missing: [
          {
            type: 'cookie',
            key: 'next-auth.session-token',
          },
        ],
      },
      {
        source: '/admin',
        permanent: false,
        destination: '/admin/dashboard',
        has: [
          {
            type: 'cookie',
            key: 'next-auth.session-token',
          },
        ],
      },
      {
        source: '/admin/news/edit',
        destination: '/admin/news',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
