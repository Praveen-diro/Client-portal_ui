/** @type {import('next').NextConfig} */

// Add bundle analyzer for performance monitoring
const withBundleAnalyzer = process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({
        enabled: true,
    })
    : (config) => config;

const nextConfig = {
    output: 'standalone',
    experimental: {
        optimizeCss: true,
        // Improve module resolution
        optimizePackageImports: ['react-day-picker', 'date-fns', '@react-pdf-viewer/core', 'lucide-react', 'framer-motion', 'recharts'],
        // Add these additional performance optimizations for Next.js 15
        serverActions: {
            bodySizeLimit: '2mb',
        },
        // Enable turbopack for faster refresh
        turbo: {
            rules: {
                // Avoid processing certain imports during development
                // This will make HMR much faster
                '*.svg': ['url'],
                '*.png': ['url'],
                '*.jpg': ['url'],
                '*.jpeg': ['url'],
                '*.gif': ['url'],
                '*.webp': ['url'],
            },
        }
        // Removed unrecognized experimental features
    },
    // Customize webpack config to optimize bundle size
    webpack: (config, { dev, isServer }) => {
        // Only run in production client builds
        if (!dev && !isServer) {
            // Split chunks more aggressively for better caching
            config.optimization.splitChunks = {
                chunks: 'all',
                maxInitialRequests: 25,
                minSize: 20000,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    framework: {
                        name: 'framework',
                        test: /[\\/]node_modules[\\/](react|react-dom|next|framer-motion)[\\/]/,
                        priority: 40,
                        enforce: true,
                    },
                    commons: {
                        name: 'commons',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 30,
                        reuseExistingChunk: true,
                    },
                },
            };
        }
        return config;
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

// Export config with bundle analyzer wrapper
module.exports = withBundleAnalyzer(nextConfig); 