
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'image.pollinations.ai',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during the build process.
  },
};

module.exports = nextConfig;
