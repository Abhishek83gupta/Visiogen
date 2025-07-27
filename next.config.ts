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