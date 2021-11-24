/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/bikes',
        destination: '/',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
}
