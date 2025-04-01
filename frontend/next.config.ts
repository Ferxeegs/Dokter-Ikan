const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);