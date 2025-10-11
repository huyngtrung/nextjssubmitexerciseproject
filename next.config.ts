import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        authInterrupts: true,
        useCache: true,
    },
    images: {
        domains: ['picsum.photos'],
        unoptimized: true,
    },
};

export default nextConfig;
