/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // tüm HTTPS görsellerine izin ver
      },
      {
        protocol: "http",
        hostname: "**", // tüm HTTP görsellerine izin ver
      },
    ],
  },
};

module.exports = nextConfig;
