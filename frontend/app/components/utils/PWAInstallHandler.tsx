// components/utils/PWAInstallHandler.tsx
'use client';

import { useEffect, useState } from 'react';
import { initializeAppData, isDataAvailable, getAllImageUrls, precacheImages, saveMetadata } from './indexedDB';

interface PWAInstallHandlerProps {
    apiBaseUrl?: string;
}

// Define interface for window.navigator
interface CustomNavigator extends Navigator {
    standalone?: boolean;
}

const PWAInstallHandler: React.FC<PWAInstallHandlerProps> = ({ 
    apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://server.dokterikan.com'
}) => {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isImageCaching, setIsImageCaching] = useState(false);
    const [dataStatus, setDataStatus] = useState<{
        available: boolean;
        lastSync?: number;
        imagesCached?: boolean;
        error?: string;
    }>({ available: false });
    const [retryCount, setRetryCount] = useState(0);
    const [imageCacheProgress, setImageCacheProgress] = useState<{
        total: number;
        cached: number;
        isActive: boolean;
    }>({ total: 0, cached: 0, isActive: false });

    // Cek status PWA dan data saat komponen mount
    useEffect(() => {
        checkPWAInstallStatus();
        checkDataStatus();
    }, []);

    // Fungsi untuk cek status instalasi PWA
    const checkPWAInstallStatus = () => {
        // Cek apakah PWA sudah diinstall
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppiOS = (window.navigator as CustomNavigator).standalone === true;
        const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
        
        const installed = isStandalone || isInWebAppiOS || isInWebAppChrome;
        setIsInstalled(installed);

        if (installed) {
            console.log('PWA is installed');
        }
    };

    // Fungsi untuk cek status data
    const checkDataStatus = async () => {
        try {
            const status = await isDataAvailable();
            setDataStatus({
                available: status.all,
                lastSync: status.lastSync,
                imagesCached: status.imagesCached
            });

            // Jika PWA terinstall tapi data belum ada, inisialisasi data
            if (isInstalled && !status.all) {
                await handleDataInitialization();
            }
            // Jika data ada tapi gambar belum di-cache, cache gambar
            else if (isInstalled && status.all && !status.imagesCached) {
                await handleImageCaching();
            }
        } catch (error) {
            console.error('Error checking data status:', error);
            setDataStatus(prev => ({
                ...prev,
                error: 'Failed to check data status'
            }));
        }
    };

    // Fungsi untuk menangani caching gambar secara terpisah
    const handleImageCaching = async () => {
        if (isImageCaching) return;

        try {
            setIsImageCaching(true);
            setImageCacheProgress({ total: 0, cached: 0, isActive: true });
            
            console.log('Starting image precaching...');
            
            // Dapatkan semua URL gambar yang perlu di-cache
            const imageUrls = await getAllImageUrls();
            
            if (imageUrls.length === 0) {
                console.log('No images to cache');
                await saveMetadata('images_cached', true);
                await saveMetadata('images_cache_time', Date.now());
                setDataStatus(prev => ({ ...prev, imagesCached: true }));
                return;
            }

            setImageCacheProgress({ total: imageUrls.length, cached: 0, isActive: true });
            
            // Precache images
            await precacheImages(imageUrls);
            
            // Update metadata
            await saveMetadata('images_cached', true);
            await saveMetadata('images_cache_time', Date.now());
            
            // Update status
            setDataStatus(prev => ({ ...prev, imagesCached: true }));
            setImageCacheProgress({ total: imageUrls.length, cached: imageUrls.length, isActive: false });
            
            console.log(`Successfully cached ${imageUrls.length} images`);
        } catch (error) {
            console.error('Error caching images:', error);
            setImageCacheProgress(prev => ({ ...prev, isActive: false }));
        } finally {
            setIsImageCaching(false);
        }
    };

    // Fungsi untuk inisialisasi data dengan retry mechanism
    const handleDataInitialization = async () => {
        if (isDataLoading) return;

        try {
            setIsDataLoading(true);
            setDataStatus(prev => ({ ...prev, error: undefined }));
            console.log('Initializing app data...');
            
            await initializeAppData(apiBaseUrl);
            
            // Re-check data status setelah inisialisasi
            const updatedStatus = await isDataAvailable();
            setDataStatus({
                available: updatedStatus.all,
                lastSync: updatedStatus.lastSync,
                imagesCached: updatedStatus.imagesCached
            });

            // Reset retry count on success
            setRetryCount(0);
            console.log('Data initialization completed successfully');

            // Jika gambar belum di-cache, mulai caching gambar
            if (updatedStatus.all && !updatedStatus.imagesCached) {
                // Delay sedikit untuk memberi waktu UI update
                setTimeout(() => {
                    handleImageCaching();
                }, 1000);
            }
        } catch (error) {
            console.error('Error initializing data:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setDataStatus(prev => ({
                ...prev,
                error: errorMessage
            }));

            // Increment retry count
            setRetryCount(prev => prev + 1);
            
            // Auto retry after delay if retry count is less than 3
            if (retryCount < 2) {
                const delay = Math.min(5000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
                setTimeout(() => {
                    console.log(`Retrying data initialization (attempt ${retryCount + 2})...`);
                    handleDataInitialization();
                }, delay);
            }
        } finally {
            setIsDataLoading(false);
        }
    };

    // Listen untuk event PWA install
    useEffect(() => {
        // Listen untuk beforeinstallprompt event
        const handleBeforeInstallPrompt = () => {
            console.log('PWA install prompt will be shown');
        };

        // Listen untuk appinstalled event
        const handleAppInstalled = async () => {
            console.log('PWA was installed');
            setIsInstalled(true);
            
            // Tunggu sebentar lalu inisialisasi data dan cache gambar
            setTimeout(async () => {
                await handleDataInitialization();
            }, 2000);
        };

        // Listen untuk perubahan display mode
        const handleDisplayModeChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                console.log('Display mode changed to standalone');
                setIsInstalled(true);
                
                // Cek dan inisialisasi data jika perlu
                setTimeout(async () => {
                    const status = await isDataAvailable();
                    if (!status.all) {
                        await handleDataInitialization();
                    } else if (!status.imagesCached) {
                        await handleImageCaching();
                    }
                }, 1000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        mediaQuery.addEventListener('change', handleDisplayModeChange);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            mediaQuery.removeEventListener('change', handleDisplayModeChange);
        };
    }, [apiBaseUrl, retryCount]);

    // Listen untuk event visibility change (saat user kembali ke app)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden && isInstalled) {
                // Cek apakah perlu update data (misal: sudah 1 hari)
                const status = await isDataAvailable();
                const now = Date.now();
                const dayInMs = 24 * 60 * 60 * 1000;
                
                if (!status.all || (status.lastSync && (now - status.lastSync) > dayInMs)) {
                    console.log('Data needs refresh');
                    await handleDataInitialization();
                } else if (status.all && !status.imagesCached) {
                    console.log('Images need caching');
                    await handleImageCaching();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isInstalled]);

    // Render loading indicator jika sedang loading data
    if (isDataLoading) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">
                        Mengunduh data...
                        {retryCount > 0 && ` (Percobaan ${retryCount + 1})`}
                    </span>
                </div>
            </div>
        );
    }

    // Render loading indicator jika sedang caching gambar
    if (isImageCaching && imageCacheProgress.isActive) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                        <div className="animate-pulse rounded-full h-4 w-4 border-2 border-white"></div>
                        <span className="text-sm font-medium">Menyimpan gambar...</span>
                    </div>
                    {imageCacheProgress.total > 0 && (
                        <>
                            <div className="text-xs opacity-90 mb-1">
                                {imageCacheProgress.cached} dari {imageCacheProgress.total} gambar
                            </div>
                            <div className="w-full bg-green-400 rounded-full h-1">
                                <div 
                                    className="bg-white h-1 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${(imageCacheProgress.cached / imageCacheProgress.total) * 100}%` 
                                    }}
                                ></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Render error state jika ada error dan sudah mencoba beberapa kali
    if (dataStatus.error && retryCount >= 2) {
        return (
            <div className="fixed top-4 right-4 z-50 max-w-xs">
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">Gagal mengunduh data</p>
                    <p className="text-xs mt-1 opacity-90">{dataStatus.error}</p>
                    <button 
                        onClick={() => {
                            setRetryCount(0);
                            handleDataInitialization();
                        }}
                        className="text-xs underline mt-2 hover:no-underline"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        );
    }

    // Render status jika data ada tapi gambar belum di-cache
    if (isInstalled && dataStatus.available && !dataStatus.imagesCached && !isImageCaching) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">Gambar belum tersimpan</p>
                    <button 
                        onClick={handleImageCaching}
                        className="text-xs underline mt-1 hover:no-underline"
                    >
                        Simpan untuk offline
                    </button>
                </div>
            </div>
        );
    }

    // Render status data jika PWA terinstall tapi data belum ada
    if (isInstalled && !dataStatus.available && !isDataLoading && !dataStatus.error) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm">Data belum tersedia</p>
                    <button 
                        onClick={handleDataInitialization}
                        className="text-xs underline mt-1 hover:no-underline"
                    >
                        Unduh sekarang
                    </button>
                </div>
            </div>
        );
    }

    // Component ini tidak render apa-apa dalam kondisi normal
    return null;
};

export default PWAInstallHandler;