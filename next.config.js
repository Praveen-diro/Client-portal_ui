/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    compress: true,
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
                }
            ]
        };
    }
};

module.exports = nextConfig; 