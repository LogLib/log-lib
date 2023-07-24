import { withContentlayer } from "next-contentlayer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "vgssydupjvshgeeeqjvo.supabase.co",
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["generated/client"],
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@loglib/core", "@loglib/next", "@loglib/tracker"],
}
export default withContentlayer(nextConfig)
