const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
    additionalData: `
      @use "styles/abstracts/variables" as *;
      @use "styles/abstracts/mixins" as *;
    `,
  },

  images: {
    domains: ['cdn.dummyjson.com'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/checkout',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
