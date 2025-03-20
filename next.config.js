/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        optimizeCss: true,
    },
    compress: true,
    reactStrictMode: true,
    images: {
        domains: [],
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        // Add resolver for .jsx
        config.resolve.extensions.push('.jsx');
        
        // Fix swagger-ui-react issues
        config.module.rules.push({
            test: /\.(js|mjs|jsx)$/,
            resolve: {
                fullySpecified: false,
            },
        });
        
        // Allow access to Swagger UI's CSS
        if (config.module && config.module.rules) {
            // Find the rule that handles CSS
            const cssRule = config.module.rules.find(rule => 
                rule.test && rule.test.toString().includes('.css')
            );
            
            if (cssRule) {
                // Ensure Swagger UI's CSS is not optimized out
                const oneOfRules = cssRule.oneOf || [];
                for (const rule of oneOfRules) {
                    if (rule.issuer && rule.issuer.and) {
                        // Add exclusion for swagger-ui CSS
                        rule.issuer.and = rule.issuer.and.filter(
                            issuer => !issuer.toString().includes('swagger-ui')
                        );
                    }
                }
            }
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

module.exports = nextConfig; 