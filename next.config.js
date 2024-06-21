/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'pubchem.ncbi.nlm.nih.gov',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'cdn.rcsb.org',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: ''
            }
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.target = 'web';
        }

        return config;
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "http://backend:3001" },
                    { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version Authorization" },
                ],
            },
        ];
    }
    // experimental: {
    //     serverActions: true,
    // },
}

module.exports = nextConfig;
