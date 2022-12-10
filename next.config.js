/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/scenicspot-and-activity',
        destination: '/',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
};
