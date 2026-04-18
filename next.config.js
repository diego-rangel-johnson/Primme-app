/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "localhost:5002",
    "localhost:5001",
    "localhost:5000",
    "localhost:4002",
    "localhost:4001",
    "localhost:4000",
    "localhost:3000",
    "127.0.0.1:5002",
    "127.0.0.1:5001",
    "127.0.0.1:5000",
    "127.0.0.1:4002",
    "127.0.0.1:4001",
    "127.0.0.1:4000",
    "127.0.0.1:3000",
    // Bind with `npm run dev:lan` (0.0.0.0); browser may still use localhost
    "0.0.0.0:3000",
    "0.0.0.0:5000",
    "0.0.0.0:5001",
    "0.0.0.0:5002",
    // Typical RFC1918 LAN hosts when opening http://192.168.x.x:PORT from another device
    "192.168.0.1:3000",
    "192.168.1.1:3000",
    "192.168.2.1:3000",
    "10.0.0.1:3000",
  ],
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
