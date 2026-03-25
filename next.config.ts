const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'gen.pollinations.ai',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
      // Legacy: old posts in DB saved before API migration
      {
        hostname: 'image.pollinations.ai',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;