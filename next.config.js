/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/forgotpassword',
                    destination: '/authentication/forgotpassword',
                    has: [
                        {
                            type: 'header',
                            key: 'x-middleware-rewrite',
                            value: '(?!.*)',  // Only allow if not already rewritten
                        },
                    ],
                },
                {
                    source: '/resetpassword',
                    destination: '/authentication/resetpassword',
                },
            ],
        };
    },
};

module.exports = nextConfig; 