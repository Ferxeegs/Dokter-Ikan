import withPWA from 'next-pwa';
import runtimeCaching from './runtimeCaching';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true,
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching,
})(nextConfig);