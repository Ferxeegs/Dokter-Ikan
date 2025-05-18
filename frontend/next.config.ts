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
  disable: false,
  register: false,
  skipWaiting: true,
  runtimeCaching,
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
