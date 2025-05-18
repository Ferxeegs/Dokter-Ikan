import { RouteHandler } from 'workbox-core';

// Definisikan tipe yang valid untuk handler caching
type StrategyName = 'CacheFirst' | 'NetworkFirst' | 'CacheOnly' | 'NetworkOnly' | 'StaleWhileRevalidate';

// Interface untuk konfigurasi cache
interface RuntimeCaching {
  urlPattern: RegExp | string | ((params: { url: URL; request: Request }) => boolean);
  handler: RouteHandler | StrategyName;
  options?: {
    cacheName: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    networkTimeoutSeconds?: number;
    plugins?: any[];
  };
}

const runtimeCaching: RuntimeCaching[] = [
  // Cache untuk sumber daya statis
  {
    urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|ico|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-resources',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      },
    },
  },
  // Cache untuk manifest.json
  {
    urlPattern: /manifest\.json$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'manifest',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      },
    },
  },
  // Cache untuk navigasi halaman
  {
    urlPattern: ({ request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 3,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk halaman utama
  {
    urlPattern: ({ url }) => url.pathname === '/' || url.pathname === '',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'start-page',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk halaman deteksi ikan
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/fishdetection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'fishdetection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk halaman deteksi penyakit
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/diseasedetection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'diseasedetection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk halaman hasil deteksi ikan
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/result-fish-detection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'result-fish-detection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk halaman hasil sistem pakar
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/result-expert-system'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'result-expert-system',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
  // Cache untuk Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 tahun
      },
    },
  },
  // Cache untuk gambar Cloudinary
  {
    urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'cloudinary-images',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
      },
    },
  },
  // Cache untuk halaman fallback
  {
    urlPattern: /\/fallback\.html$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fallback-cache',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 tahun
      },
    },
  },
  // Cache untuk API calls
  {
    urlPattern: /\/api\//,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 hari
      },
    },
  },
];

export default runtimeCaching;