const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_POLLINATIONS_HOSTNAME,
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during the build process.
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
