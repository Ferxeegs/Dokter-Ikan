'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  console.log('🔥 RegisterSW mounted');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        console.log('📦 Trying to register service worker');
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.error('❌ SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
}
