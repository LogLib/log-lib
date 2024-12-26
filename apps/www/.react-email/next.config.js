/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // swcMinify: true,
    images: {
        domains: [
            "https://avatars.githubusercontent.com",
            "https://i.pravatar.cc",
            "https://github.com/",
        ],
    },
    experimental: {
        appDir: true,
        externalDir: true, // compile files that are located next to the .react-email directory
    },
};

module.exports = nextConfig;
