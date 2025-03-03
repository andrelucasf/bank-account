/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    apiUrl: "http://localhost:8080",
    clientId: "100",
  },
};

module.exports = nextConfig;
