// 'use client';

// import { useEffect, useState } from 'react';

// export default function PWALifecycle() {
//   const [isOnline, setIsOnline] = useState(true);
//   const [showUpdateBanner, setShowUpdateBanner] = useState(false);
//   const [workboxInstance, setWorkboxInstance] = useState<Window['workbox'] | null>(null);

//   useEffect(() => {
//     // Monitor network status
//     const handleOnline = () => {
//       setIsOnline(true);
//       console.log('🌐 Back online');
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       console.log('📴 Gone offline');
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     // Initialize service worker
//     if (
//       typeof window !== 'undefined' &&
//       'serviceWorker' in navigator &&
//       'workbox' in window
//     ) {
//       const wb = window.workbox;
//       setWorkboxInstance(wb);
      
//       // Event listener untuk update yang tersedia
//       const promptNewVersionAvailable = () => {
//         console.log('🔄 New version available');
//         setShowUpdateBanner(true);
//       };

//       // Event listener ketika service worker berhasil terpasang untuk pertama kali
//       const handleServiceWorkerInstalled = () => {
//         console.log('✅ Service Worker installed successfully');
//       };

//       // Event listener ketika service worker aktif dan mengontrol halaman
//       const handleServiceWorkerActivated = () => {
//         console.log('🚀 Service Worker activated and ready to use');
//       };

//       // Daftarkan event listeners
//       wb.addEventListener('installed', handleServiceWorkerInstalled);
//       wb.addEventListener('waiting', promptNewVersionAvailable);
//       wb.addEventListener('controlling', handleServiceWorkerActivated);
//       wb.addEventListener('externalwaiting', promptNewVersionAvailable);

//       // Register service worker
//       wb.register()
//         .then((registration: ServiceWorkerRegistration) => {
//           console.log('📦 Service Worker registered successfully:', registration.scope);
          
//           // Check if there's an update available immediately
//           registration.addEventListener('updatefound', () => {
//             console.log('🔍 New service worker version found');
//           });
//         })
//         .catch((error: Error) => {
//           console.error('❌ Service Worker registration failed:', error);
//         });

//       // Cleanup function
//       return () => {
//         window.removeEventListener('online', handleOnline);
//         window.removeEventListener('offline', handleOffline);
//         if (wb) {
//           wb.removeEventListener('installed', handleServiceWorkerInstalled);
//           wb.removeEventListener('waiting', promptNewVersionAvailable);
//           wb.removeEventListener('controlling', handleServiceWorkerActivated);
//           wb.removeEventListener('externalwaiting', promptNewVersionAvailable);
//         }
//       };
//     }

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   const handleUpdate = () => {
//     if (workboxInstance) {
//       workboxInstance.addEventListener('controlling', () => {
//         window.location.reload();
//       });
      
//       workboxInstance.messageSkipWaiting();
//       setShowUpdateBanner(false);
//     }
//   };

//   const dismissUpdate = () => {
//     setShowUpdateBanner(false);
//   };

//   return (
//     <>
//       {/* Offline Indicator */}
//       <div className={`offline-indicator ${!isOnline ? 'show' : ''}`}>
//         📴 Anda sedang offline - Beberapa fitur mungkin tidak tersedia
//       </div>

//       {/* Update Banner */}
//       {showUpdateBanner && (
//         <div className="pwa-update-notification">
//           <span>🔄 Versi baru tersedia!</span>
//           <button onClick={handleUpdate}>
//             Perbarui
//           </button>
//           <button onClick={dismissUpdate} style={{ marginLeft: '8px', background: 'transparent', color: 'white', border: '1px solid white' }}>
//             Nanti
//           </button>
//         </div>
//       )}
//     </>
//   );
// }