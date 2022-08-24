/** @type {import('next').NextConfig} */
// allow to import CSS from node_modules
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
])
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
