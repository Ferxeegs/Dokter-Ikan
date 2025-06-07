// lib/indexedDB.ts
import { openDB } from 'idb';

interface Symptom {
    symptoms_id: number;
    code: string;
    name: string;
    type: 'fisik' | 'perilaku';
}

interface Disease {
    fishdisease_id: number;
    name: string;
    description: string;
    image: string | null;
}

interface FishType {
    fish_type_id: number;
    name: string;
    other_name: string | null;
    latin_name: string | null;
    description: string | null;
    habitat: string | null;
    image: string | null;
}

interface ServiceWorkerMessage {
    type: 'SHOW_DATA_SYNC_NOTIFICATION' | 'PRECACHE_IMAGES';
    message: string;
    images?: string[];
}

interface ImageCacheStatus {
    url: string;
    cached: boolean;
    timestamp: number;
    size?: number;
}

const DB_NAME = 'dokterIkanDB';
const DB_VERSION = 3; // Increment version for new image cache store
const STORES = {
    SYMPTOMS: 'symptoms',
    DISEASES: 'diseases',
    FISH_TYPES: 'fishTypes',
    METADATA: 'metadata',
    IMAGE_CACHE: 'imageCache' // New store for tracking cached images
} as const;

// First, add interfaces for metadata values
interface MetadataValue {
    key: string;
    value: unknown;
    timestamp: number;
}

interface InitErrorMetadata {
    error: string;
    timestamp: number;
}

// Add interfaces for API responses
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T[];
}

// Add type assertion helper functions
const isApiResponse = <T>(data: unknown): data is ApiResponse<T> => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'success' in data &&
        'message' in data &&
        'data' in data &&
        Array.isArray((data as ApiResponse<T>).data)
    );
};

export const initDB = async () => {
    return await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            if (!db.objectStoreNames.contains(STORES.SYMPTOMS)) {
                db.createObjectStore(STORES.SYMPTOMS, { keyPath: 'symptoms_id' });
            }

            if (!db.objectStoreNames.contains(STORES.DISEASES)) {
                db.createObjectStore(STORES.DISEASES, { keyPath: 'fishdisease_id' });
            }

            if (!db.objectStoreNames.contains(STORES.FISH_TYPES)) {
                const fishStore = db.createObjectStore(STORES.FISH_TYPES, { keyPath: 'fish_type_id' });
                // Buat index untuk pencarian
                fishStore.createIndex('name', 'name', { unique: false });
                fishStore.createIndex('latin_name', 'latin_name', { unique: false });
            }

            // Store baru untuk metadata
            if (!db.objectStoreNames.contains(STORES.METADATA)) {
                db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
            }

            // New store for image cache tracking (version 3+)
            if (oldVersion < 3 && !db.objectStoreNames.contains(STORES.IMAGE_CACHE)) {
                db.createObjectStore(STORES.IMAGE_CACHE, { keyPath: 'url' });
            }
        },
    });
};

// Fungsi untuk precache images
export const precacheImages = async (images: string[]): Promise<void> => {
    try {
        if (!images || images.length === 0) {
            console.log('No images to precache');
            return;
        }

        console.log(`Starting to precache ${images.length} images...`);
        
        // Filter out null/undefined/empty images
        const validImages = images.filter(img => img && img.trim() !== '');
        
        if (validImages.length === 0) {
            console.log('No valid images to precache');
            return;
        }

        // Send images to service worker for caching
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const message: ServiceWorkerMessage = {
                type: 'PRECACHE_IMAGES',
                message: `Menyimpan ${validImages.length} gambar untuk akses offline...`,
                images: validImages
            };
            
            navigator.serviceWorker.ready.then(registration => {
                registration.active?.postMessage(message);
            });
        }

        // Track image cache status in IndexedDB
        await Promise.all(validImages.map(async (imageUrl) => {
            try {
                await saveImageCacheStatus(imageUrl, true);
            } catch (error) {
                console.error(`Failed to track cache status for ${imageUrl}:`, error);
            }
        }));

        console.log(`Successfully initiated precaching for ${validImages.length} images`);
    } catch (error) {
        console.error('Error precaching images:', error);
        throw error;
    }
};

// Fungsi untuk menyimpan status cache gambar
export const saveImageCacheStatus = async (url: string, cached: boolean, size?: number): Promise<void> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.IMAGE_CACHE, 'readwrite');
        const store = tx.objectStore(STORES.IMAGE_CACHE);
        
        const cacheStatus: ImageCacheStatus = {
            url,
            cached,
            timestamp: Date.now(),
            size
        };
        
        await store.put(cacheStatus);
        await tx.done;
    } catch (error) {
        console.error('Error saving image cache status:', error);
    }
};

// Fungsi untuk mendapatkan status cache gambar
export const getImageCacheStatus = async (url: string): Promise<ImageCacheStatus | null> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.IMAGE_CACHE, 'readonly');
        const store = tx.objectStore(STORES.IMAGE_CACHE);
        
        return await store.get(url) || null;
    } catch (error) {
        console.error('Error getting image cache status:', error);
        return null;
    }
};

// Fungsi untuk mendapatkan semua gambar yang perlu di-cache
export const getAllImageUrls = async (): Promise<string[]> => {
    try {
        const [diseases, fishTypes] = await Promise.all([
            getDiseasesFromIndexedDB([]),
            getAllFishTypesFromIndexedDB()
        ]);

        const imageUrls: string[] = [];

        // Collect disease images
        diseases.forEach(disease => {
            if (disease.image && disease.image.trim() !== '') {
                imageUrls.push(disease.image);
            }
        });

        // Collect fish type images
        fishTypes.forEach(fishType => {
            if (fishType.image && fishType.image.trim() !== '') {
                imageUrls.push(fishType.image);
            }
        });

        // Remove duplicates
        return [...new Set(imageUrls)];
    } catch (error) {
        console.error('Error getting all image URLs:', error);
        return [];
    }
};

// Fungsi untuk menyimpan metadata
export const saveMetadata = async (key: string, value: unknown): Promise<void> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.METADATA, 'readwrite');
        const store = tx.objectStore(STORES.METADATA);
        
        const metadata: MetadataValue = {
            key,
            value,
            timestamp: Date.now()
        };
        
        await store.put(metadata);
        await tx.done;
    } catch (error) {
        console.error('Error saving metadata:', error);
        throw error;
    }
};

// Fungsi untuk mengambil metadata
export const getMetadata = async <T>(key: string): Promise<T | null> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.METADATA, 'readonly');
        const store = tx.objectStore(STORES.METADATA);
        
        const result = await store.get(key) as MetadataValue | undefined;
        return (result?.value as T) || null;
    } catch (error) {
        console.error('Error getting metadata:', error);
        return null;
    }
};

// Fungsi utama untuk fetch dan save data saat install
export const initializeAppData = async (API_BASE_URL: string) => {
    try {
        console.log('Initializing app data after PWA install...');
        
        const isInitialized = await getMetadata<boolean>('data_initialized');
        const lastInitTime = await getMetadata<number>('last_init_time');
        
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (isInitialized && lastInitTime && (now - lastInitTime < dayInMs)) {
            console.log('Data already initialized recently, checking images...');
            
            // Even if data is fresh, check if images need to be cached
            const imagesCached = await getMetadata<boolean>('images_cached');
            if (!imagesCached) {
                const imageUrls = await getAllImageUrls();
                if (imageUrls.length > 0) {
                    await precacheImages(imageUrls);
                    await saveMetadata('images_cached', true);
                    await saveMetadata('images_cache_time', now);
                }
            }
            return;
        }

        // Fetch dan save semua data
        const result = await fetchAndSaveAllData(API_BASE_URL);
        
        // Precache images after data is saved
        console.log('Starting image precaching after data initialization...');
        const imageUrls = await getAllImageUrls();
        if (imageUrls.length > 0) {
            await precacheImages(imageUrls);
            await saveMetadata('images_cached', true);
            await saveMetadata('images_cache_time', now);
        }
        
        // Simpan status inisialisasi
        await saveMetadata('data_initialized', true);
        await saveMetadata('last_init_time', now);
        await saveMetadata('install_timestamp', now);
        
        console.log('App data initialization completed:', result);
        console.log(`Precached ${imageUrls.length} images`);
        return result;
    } catch (error: unknown) {
        console.error('Error initializing app data:', error);
        const errorMetadata: InitErrorMetadata = {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now()
        };
        await saveMetadata('last_init_error', errorMetadata);
        throw error; // Re-throw to let caller handle it
    }
};

// API Functions with improved error handling and data validation
export const fetchAndSaveAllData = async (API_BASE_URL: string) => {
    try {
        console.log('Starting to fetch and save all data...');
        
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const message: ServiceWorkerMessage = {
                type: 'SHOW_DATA_SYNC_NOTIFICATION',
                message: 'Mengunduh data aplikasi...'
            };
            
            navigator.serviceWorker.ready.then(registration => {
                registration.active?.postMessage(message);
            });
        }
        
        // Fetch all data concurrently
        const [symptomsResponse, diseasesResponse, fishTypesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/symptoms`),
            fetch(`${API_BASE_URL}/fishdiseases`),
            fetch(`${API_BASE_URL}/fish-types`)
        ]);

        // Check if all requests are successful
        if (!symptomsResponse.ok) {
            throw new Error(`Symptoms API failed: ${symptomsResponse.status} ${symptomsResponse.statusText}`);
        }
        if (!diseasesResponse.ok) {
            throw new Error(`Diseases API failed: ${diseasesResponse.status} ${diseasesResponse.statusText}`);
        }
        if (!fishTypesResponse.ok) {
            throw new Error(`Fish types API failed: ${fishTypesResponse.status} ${fishTypesResponse.statusText}`);
        }

        // Parse JSON data with type assertions
        const [symptomsResponseData, diseasesResponseData, fishTypesResponseData] = await Promise.all([
            symptomsResponse.json(),
            diseasesResponse.json(),
            fishTypesResponse.json()
        ]);

        // Type guard and validation
        if (!isApiResponse<Symptom>(symptomsResponseData)) {
            throw new Error('Invalid symptoms response format');
        }
        if (!isApiResponse<Disease>(diseasesResponseData)) {
            throw new Error('Invalid diseases response format');
        }
        if (!isApiResponse<FishType>(fishTypesResponseData)) {
            throw new Error('Invalid fish types response format');
        }

        // Extract arrays from API responses
        const symptomsArray = symptomsResponseData.data;
        const diseasesArray = diseasesResponseData.data;
        const fishTypesArray = fishTypesResponseData.data;

        console.log('Extracted arrays:', {
            symptoms: symptomsArray.length,
            diseases: diseasesArray.length,
            fishTypes: fishTypesArray.length
        });

        // Save all data to IndexedDB concurrently
        await Promise.all([
            saveSymptomsToIndexedDB(symptomsArray),
            saveDiseasesToIndexedDB(diseasesArray),
            saveFishTypesToIndexedDB(fishTypesArray)
        ]);

        // Update metadata
        await saveMetadata('last_data_sync', Date.now());
        await saveMetadata('data_counts', {
            symptoms: symptomsArray.length,
            diseases: diseasesArray.length,
            fishTypes: fishTypesArray.length
        });

        console.log('All data successfully fetched and saved to IndexedDB');
        
        // Show success notification
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.active?.postMessage({
                    type: 'SHOW_DATA_SYNC_NOTIFICATION',
                    message: 'Data aplikasi berhasil diunduh!'
                });
            });
        }
        
        return {
            symptoms: symptomsArray.length,
            diseases: diseasesArray.length,
            fishTypes: fishTypesArray.length
        };
    } catch (error: unknown) {
        console.error('Error fetching and saving data:', error);
        
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const message: ServiceWorkerMessage = {
                type: 'SHOW_DATA_SYNC_NOTIFICATION',
                message: 'Gagal mengunduh data. Akan dicoba lagi nanti.'
            };
            
            navigator.serviceWorker.ready.then(registration => {
                registration.active?.postMessage(message);
            });
        }
        
        throw error;
    }
};

// Check if data needs to be updated
export const checkDataFreshness = async (): Promise<boolean> => {
    try {
        const [symptomsCount, diseasesCount, fishTypesCount] = await Promise.all([
            getSymptomsFromIndexedDB(),
            getDiseasesFromIndexedDB([]),
            getAllFishTypesFromIndexedDB()
        ]);

        // If any store is empty, data needs to be fetched
        return symptomsCount.length > 0 && diseasesCount.length > 0 && fishTypesCount.length > 0;
    } catch (error: unknown) {
        console.error('Error checking data freshness:', error);
        return false;
    }
};

// Improved functions for symptoms with better validation
export const saveSymptomsToIndexedDB = async (data: ApiResponse<Symptom> | Symptom[]) => {
    try {
        const symptoms = Array.isArray(data) ? data : data.data;
        // Validate that data is an array
        if (!Array.isArray(symptoms)) {
            throw new Error(`Expected array but got ${typeof symptoms}`);
        }

        if (symptoms.length === 0) {
            console.warn('No symptoms data to save');
            return;
        }

        // Validate each symptom object
        const validSymptoms = symptoms.filter((symptom): symptom is Symptom => {
            if (!symptom || typeof symptom !== 'object') {
                console.warn('Invalid symptom object:', symptom);
                return false;
            }
            if (!symptom.symptoms_id) {
                console.warn('Symptom missing symptoms_id:', symptom);
                return false;
            }
            return true;
        });

        console.log(`Saving ${validSymptoms.length} valid symptoms out of ${symptoms.length} total`);

        const db = await initDB();
        const tx = db.transaction(STORES.SYMPTOMS, 'readwrite');
        const store = tx.objectStore(STORES.SYMPTOMS);

        await Promise.all(validSymptoms.map((symptom: Symptom) => store.put(symptom)));
        await tx.done;
        
        console.log(`Successfully saved ${validSymptoms.length} symptoms to IndexedDB`);
    } catch (error) {
        console.error('Error saving symptoms to IndexedDB:', error);
        throw error;
    }
};

export const getSymptomsFromIndexedDB = async (): Promise<Symptom[]> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.SYMPTOMS, 'readonly');
        const store = tx.objectStore(STORES.SYMPTOMS);

        return await store.getAll();
    } catch (error) {
        console.error('Error getting symptoms from IndexedDB:', error);
        throw error;
    }
};

// Improved functions for diseases with better validation
export const saveDiseasesToIndexedDB = async (data: ApiResponse<Disease> | Disease[]) => {
    try {
        const diseases = Array.isArray(data) ? data : data.data;
        // Validate that data is an array
        if (!Array.isArray(diseases)) {
            throw new Error(`Expected array but got ${typeof diseases}`);
        }

        if (diseases.length === 0) {
            console.warn('No diseases data to save');
            return;
        }

        // Validate each disease object
        const validDiseases = diseases.filter((disease): disease is Disease => {
            if (!disease || typeof disease !== 'object') {
                console.warn('Invalid disease object:', disease);
                return false;
            }
            if (!disease.fishdisease_id) {
                console.warn('Disease missing fishdisease_id:', disease);
                return false;
            }
            return true;
        });

        console.log(`Saving ${validDiseases.length} valid diseases out of ${diseases.length} total`);

        const db = await initDB();
        const tx = db.transaction(STORES.DISEASES, 'readwrite');
        const store = tx.objectStore(STORES.DISEASES);

        await Promise.all(validDiseases.map((disease: Disease) => store.put(disease)));
        await tx.done;
        
        console.log(`Successfully saved ${validDiseases.length} diseases to IndexedDB`);
    } catch (error) {
        console.error('Error saving diseases to IndexedDB:', error);
        throw error;
    }
};

export const getDiseasesFromIndexedDB = async (diseaseNames: string[]): Promise<Disease[]> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.DISEASES, 'readonly');
        const store = tx.objectStore(STORES.DISEASES);

        const allDiseases = await store.getAll();
        console.log('All diseases in IndexedDB:', allDiseases.length);

        if (diseaseNames.length === 0) {
            return allDiseases;
        }

        const filteredDiseases = allDiseases.filter(disease =>
            diseaseNames.includes(disease.name)
        );
        console.log('Filtered diseases:', filteredDiseases.length);

        if (filteredDiseases.length === 0) {
            console.warn('No diseases found for names:', diseaseNames);
        }

        return filteredDiseases;
    } catch (error) {
        console.error('Error getting diseases from IndexedDB:', error);
        throw error;
    }
};

// Improved functions for FishTypes with better validation
export const saveFishTypesToIndexedDB = async (data: ApiResponse<FishType> | FishType[]) => {
    try {
        const fishTypes = Array.isArray(data) ? data : data.data;
        // Validate that data is an array
        if (!Array.isArray(fishTypes)) {
            throw new Error(`Expected array but got ${typeof fishTypes}`);
        }

        if (fishTypes.length === 0) {
            console.warn('No fish types data to save');
            return;
        }

        // Validate each fish type object
        const validFishTypes = fishTypes.filter((fishType): fishType is FishType => {
            if (!fishType || typeof fishType !== 'object') {
                console.warn('Invalid fish type object:', fishType);
                return false;
            }
            if (!fishType.fish_type_id) {
                console.warn('Fish type missing fish_type_id:', fishType);
                return false;
            }
            return true;
        });

        console.log(`Saving ${validFishTypes.length} valid fish types out of ${fishTypes.length} total`);

        const db = await initDB();
        const tx = db.transaction(STORES.FISH_TYPES, 'readwrite');
        const store = tx.objectStore(STORES.FISH_TYPES);

        await Promise.all(validFishTypes.map((fishType: FishType) => store.put(fishType)));
        await tx.done;

        console.log(`Successfully saved ${validFishTypes.length} fish types to IndexedDB`);
    } catch (error) {
        console.error('Error saving fish types to IndexedDB:', error);
        throw error;
    }
};

export const getFishTypeFromIndexedDB = async (fishName: string): Promise<FishType | null> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.FISH_TYPES, 'readonly');
        const store = tx.objectStore(STORES.FISH_TYPES);

        // Cari berdasarkan nama utama
        const nameIndex = store.index('name');
        let fishType = await nameIndex.get(fishName);

        // Jika tidak ditemukan, cari berdasarkan latin name
        if (!fishType) {
            const latinIndex = store.index('latin_name');
            fishType = await latinIndex.get(fishName);
        }

        // Jika masih tidak ditemukan, cari dengan pencarian fuzzy
        if (!fishType) {
            const allFishTypes = await store.getAll();
            fishType = allFishTypes.find(fish => 
                fish.name?.toLowerCase().includes(fishName.toLowerCase()) ||
                fish.other_name?.toLowerCase().includes(fishName.toLowerCase()) ||
                fish.latin_name?.toLowerCase().includes(fishName.toLowerCase())
            );
        }

        return fishType || null;
    } catch (error) {
        console.error('Error getting fish type from IndexedDB:', error);
        throw error;
    }
};

export const getAllFishTypesFromIndexedDB = async (): Promise<FishType[]> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORES.FISH_TYPES, 'readonly');
        const store = tx.objectStore(STORES.FISH_TYPES);

        return await store.getAll();
    } catch (error) {
        console.error('Error getting all fish types from IndexedDB:', error);
        throw error;
    }
};

export const clearAllData = async () => {
    try {
        const db = await initDB();
        const tx = db.transaction([STORES.SYMPTOMS, STORES.DISEASES, STORES.FISH_TYPES, STORES.METADATA, STORES.IMAGE_CACHE], 'readwrite');
        
        await Promise.all([
            tx.objectStore(STORES.SYMPTOMS).clear(),
            tx.objectStore(STORES.DISEASES).clear(),
            tx.objectStore(STORES.FISH_TYPES).clear(),
            tx.objectStore(STORES.METADATA).clear(),
            tx.objectStore(STORES.IMAGE_CACHE).clear()
        ]);
        
        await tx.done;
        console.log('All data cleared from IndexedDB');
    } catch (error) {
        console.error('Error clearing all data from IndexedDB:', error);
        throw error;
    }
};

// Utility function untuk check apakah data sudah ada di IndexedDB
export const isDataAvailable = async (): Promise<{
    symptoms: boolean;
    diseases: boolean;
    fishTypes: boolean;
    all: boolean;
    lastSync?: number;
    installTime?: number;
    imagesCached?: boolean;
    imagesCacheTime?: number;
}> => {
    try {
        const [symptoms, diseases, fishTypes, lastSync, installTime, imagesCached, imagesCacheTime] = await Promise.all([
            getSymptomsFromIndexedDB(),
            getDiseasesFromIndexedDB([]),
            getAllFishTypesFromIndexedDB(),
            getMetadata<number>('last_data_sync'),
            getMetadata<number>('install_timestamp'),
            getMetadata<boolean>('images_cached'),
            getMetadata<number>('images_cache_time')
        ]);

        const result = {
            symptoms: symptoms.length > 0,
            diseases: diseases.length > 0,
            fishTypes: fishTypes.length > 0,
            all: false,
            lastSync: lastSync || undefined,
            installTime: installTime || undefined,
            imagesCached: imagesCached || false,
            imagesCacheTime: imagesCacheTime || undefined
        };

        result.all = result.symptoms && result.diseases && result.fishTypes;
        
        return result;
    } catch (error) {
        console.error('Error checking data availability:', error);
        return {
            symptoms: false,
            diseases: false,
            fishTypes: false,
            all: false,
            imagesCached: false
        };
    }
};