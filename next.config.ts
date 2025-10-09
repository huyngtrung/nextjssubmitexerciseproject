import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        useCache: true,
    },
    images: {
        domains: ['picsum.photos'],
    },
};

export default nextConfig;
