// Definisikan tipe handler caching
type StrategyName = 'CacheFirst' | 'NetworkFirst' | 'CacheOnly' | 'NetworkOnly' | 'StaleWhileRevalidate';

interface RuntimeCaching {
  urlPattern: RegExp | string | ((params: { url: URL; request: Request }) => boolean);
  handler: StrategyName;
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
  // ✅ Cache untuk halaman navigasi (dengan fallback offline)
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
      plugins: [
        {
          cacheWillUpdate: async ({ response }: { response: Response }) => {
            // Hanya cache response yang berhasil dan berisi HTML
            return response.status === 200 && 
                   response.headers.get('content-type')?.includes('text/html') ? response : null;
          },
          handlerDidError: async (): Promise<Response | undefined> => {
            return await caches.match('/fallback.html') ?? undefined;
          },
        },
      ],
    },
  },

  // ✅ Fallback page cache
  {
    urlPattern: /\/fallback\.html$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fallback-cache',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },

  // ✅ Cache untuk sumber daya statis
  {
    urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|ico|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-resources',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },

  // Cache manifest
  {
    urlPattern: /manifest\.json$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'manifest',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },

  // ONNX models
  {
    urlPattern: /\/models\/.*\.onnx$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'onnx-models',
      expiration: {
        maxEntries: 5,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },

  // Cache halaman spesifik
  {
    urlPattern: ({ url }) => url.pathname === '/' || url.pathname === '',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'start-page',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/fishdetection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'fishdetection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/diseasedetection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'diseasedetection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/result-fish-detection'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'result-fish-detection',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/result-expert-system'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'result-expert-system',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },

  // Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      },
    },
  },

  // Cloudinary
  {
    urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'cloudinary-images',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
    },
  },

  // API
  {
    urlPattern: /\/api\//,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
];

export default runtimeCaching;