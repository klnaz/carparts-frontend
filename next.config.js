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
        hostname: "**", // gerekirse HTTP için de (örnek: yerel sunucu)
      },
    ],
  },
};

module.exports = nextConfig;
