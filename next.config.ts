import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,

  headers: async () => ([
    {
      source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff|woff2|ttf|otf)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ]),

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.overlymarketing.com' }],
        destination: 'https://overlymarketing.com/:path*',
        permanent: true, // Vercel will use 308
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'overly2.vercel.app' }],
        destination: 'https://overlymarketing.com/:path*',
        permanent: true,
      },
    ];
  },
    images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },
    ],
  },
};

export default nextConfig;
