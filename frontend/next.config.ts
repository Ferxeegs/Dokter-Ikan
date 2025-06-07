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
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true,
  skipWaiting: true,
  runtimeCaching,
  maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25 MB
  buildExcludes: [
    /app-build-manifest\.json$/,
    /build-manifest\.json$/,
    /react-loadable-manifest\.json$/,
    /middleware-manifest\.json$/,
    /_middleware\.js$/,
    /\.js\.map$/,
  ],
  fallbacks: {
    document: '/fallback.html',
    image: '',
    audio: '',
    video: '',
    font: '',
  },
})(nextConfig);
