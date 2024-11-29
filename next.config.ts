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
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
