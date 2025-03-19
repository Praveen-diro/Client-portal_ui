/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    compress: true,
    // Server external packages configuration
    serverExternalPackages: [],
    // Add experimental features to support Next.js 15
    experimental: {
        // Enable modern optimization features
        optimizeCss: true,
        // Improve module resolution
        optimizePackageImports: ['react-day-picker', 'date-fns', '@react-pdf-viewer/core']
    },
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/forgotpassword',
                    destination: '/authentication/forgotpassword'
                },
                {
                    source: '/resetpassword',
                    destination: '/authentication/resetpassword'
                },
                {
                    source: '/two-factor',
                    destination: '/authentication/two-factor'
                },
                {
                    source: '/passwordreset/:id/:userEmail',
                    destination: '/passwordreset/:id/:userEmail'
                }
            ]
        };
    }
};

module.exports = nextConfig; 