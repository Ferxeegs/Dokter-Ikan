'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import * as ort from 'onnxruntime-web';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface Prediction {
  image_url: string;
  class_name: string;
}

interface Detection {
  className: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export default function FishDetection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadBoxRef = useRef<HTMLDivElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [model, setModel] = useState<ort.InferenceSession | null>(null);
  const [, setIsModelLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // Client-side only code
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize model on component mount
  useEffect(() => {
    const initModel = async () => {
      try {
        setIsModelLoading(true);
        // Load model from public directory
        const session = await ort.InferenceSession.create('/models/species.onnx', {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        });
        setModel(session);
      } catch (error) {
        console.error('Error loading model:', error);
        setErrorMessage('Gagal memuat model deteksi offline.');
        setShowErrorModal(true);
      } finally {
        setIsModelLoading(false);
      }
    };

    // Check online status
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    setIsOffline(!navigator.onLine);

    initModel();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Function to preprocess image for ONNX model
  const preprocessImage = async (imageData: ImageData): Promise<Float32Array> => {
    const tensor = new Float32Array(3 * 640 * 640); // CHW format: [C, H, W]
    const { data } = imageData;

    // Convert from HWC to CHW format
    for (let y = 0; y < 640; y++) {
      for (let x = 0; x < 640; x++) {
        const pixelIndex = (y * 640 + x) * 4;
        const tensorIndex = y * 640 + x;
        
        // R channel
        tensor[tensorIndex] = data[pixelIndex] / 255.0;
        // G channel  
        tensor[640 * 640 + tensorIndex] = data[pixelIndex + 1] / 255.0;
        // B channel
        tensor[2 * 640 * 640 + tensorIndex] = data[pixelIndex + 2] / 255.0;
      }
    }

    return tensor;
  };

  const normalize = (tensor: Float32Array): Float32Array => {
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    const size = 640 * 640;

    // Normalize each channel separately (CHW format)
    for (let c = 0; c < 3; c++) {
      for (let i = 0; i < size; i++) {
        const index = c * size + i;
        tensor[index] = (tensor[index] - mean[c]) / std[c];
      }
    }

    return tensor;
  };

  // Fungsi untuk menghitung Intersection over Union (IoU)
  const calculateIoU = (box1: Detection['bbox'], box2: Detection['bbox']): number => {
    const x1 = Math.max(box1.x - box1.w/2, box2.x - box2.w/2);
    const y1 = Math.max(box1.y - box1.h/2, box2.y - box2.h/2);
    const x2 = Math.min(box1.x + box1.w/2, box2.x + box2.w/2);
    const y2 = Math.min(box1.y + box1.h/2, box2.y + box2.h/2);

    if (x2 <= x1 || y2 <= y1) return 0;

    const intersection = (x2 - x1) * (y2 - y1);
    const area1 = box1.w * box1.h;
    const area2 = box2.w * box2.h;
    const union = area1 + area2 - intersection;

    return intersection / union;
  };

  // Non-Maximum Suppression
  const applyNMS = (detections: Detection[], iouThreshold: number = 0.5): Detection[] => {
    if (detections.length === 0) return [];

    // Sort berdasarkan confidence (tertinggi dulu)
    const sortedDetections = detections.sort((a, b) => b.confidence - a.confidence);
    const keepDetections: Detection[] = [];

    for (let i = 0; i < sortedDetections.length; i++) {
      const currentDetection = sortedDetections[i];
      let shouldKeep = true;

      // Bandingkan dengan deteksi yang sudah di-keep
      for (let j = 0; j < keepDetections.length; j++) {
        const keptDetection = keepDetections[j];
        
        // Jika sama class dan IoU tinggi, skip (duplikat)
        if (currentDetection.className === keptDetection.className) {
          const iou = calculateIoU(currentDetection.bbox, keptDetection.bbox);
          if (iou > iouThreshold) {
            shouldKeep = false;
            break;
          }
        }
      }

      if (shouldKeep) {
        keepDetections.push(currentDetection);
      }
    }

    return keepDetections;
  };

  // Fungsi postprocessOutput yang sudah diperbaiki dengan NMS
  const postprocessOutput = (output: ort.Tensor, numClasses: number, confidenceThreshold: number = 0.25): Detection[] => {
    const outputData = Array.from(output.data as Float32Array);
    
    // Debug output shape
    console.log('Output shape:', output.dims);
    console.log('Output data length:', outputData.length);
    
    // Untuk YOLOv8, format output biasanya [1, 84, 8400] untuk 5 classes
    // 84 = 4 (bbox) + 80 (coco classes) tapi kita hanya pakai 5 classes
    // Atau bisa jadi [1, 4+5, 8400] = [1, 9, 8400]
    
    let numAnchors, numFeatures;
    if (output.dims.length === 3) {
      numAnchors = output.dims[2];  // 8400 anchors
      numFeatures = output.dims[1]; // 9 features (4 bbox + 5 classes)
    } else {
      // Fallback jika format berbeda
      numAnchors = outputData.length / (numClasses + 4); // 4 untuk bbox
      numFeatures = numClasses + 4;
    }
    
    console.log(`Processing ${numAnchors} anchors with ${numFeatures} features`);
    
    const detections: Detection[] = [];
    const classNames = ['Ikan Bawal', 'Ikan Gurame', 'Ikan Lele', 'Ikan Nila', 'Ikan Tuna'];

    // Ekstrak semua deteksi yang memenuhi threshold
    for (let i = 0; i < numAnchors; i++) {
      // YOLOv8 format: data disusun sebagai [x, y, w, h, class1, class2, ...]
      // Tanpa object confidence terpisah
      const x = outputData[i]; // atau outputData[0 * numAnchors + i]
      const y = outputData[numAnchors + i]; // atau outputData[1 * numAnchors + i]  
      const w = outputData[2 * numAnchors + i];
      const h = outputData[3 * numAnchors + i];

      // Ambil probabilitas untuk setiap class
      const classProbabilities: number[] = [];
      for (let c = 0; c < numClasses; c++) {
        const classIndex = (4 + c) * numAnchors + i;
        classProbabilities.push(outputData[classIndex]);
      }

      // Cari class dengan probabilitas tertinggi
      const maxClassProbability = Math.max(...classProbabilities);
      const maxClassIndex = classProbabilities.indexOf(maxClassProbability);
      
      // Untuk YOLOv8, class probability sudah final confidence
      const finalConfidence = maxClassProbability;

      // Debug untuk beberapa anchor pertama
      if (i < 5) {
        console.log(`Anchor ${i}: x=${x.toFixed(3)}, y=${y.toFixed(3)}, w=${w.toFixed(3)}, h=${h.toFixed(3)}, conf=${finalConfidence.toFixed(3)}, class=${maxClassIndex}`);
      }

      // Hanya tambahkan jika confidence di atas threshold
      if (finalConfidence > confidenceThreshold) {
        detections.push({
          className: classNames[maxClassIndex],
          confidence: finalConfidence,
          bbox: { x, y, w, h }
        });
      }
    }

    console.log(`Found ${detections.length} raw detections before NMS`);

    // Terapkan NMS untuk menghilangkan duplikasi
    const nmsDetections = applyNMS(detections, 0.5);
    console.log(`After NMS: ${nmsDetections.length} detections`);

    // Untuk single species prediction, ambil yang confidence tertinggi
    if (nmsDetections.length > 0) {
      const bestDetection = nmsDetections.reduce((best, current) => 
        current.confidence > best.confidence ? current : best
      );
      
      console.log(`Best detection: ${bestDetection.className} with confidence ${bestDetection.confidence.toFixed(3)}`);
      return [bestDetection];
    }

    return [];
  };

  // // Alternatif: Jika Anda yakin hanya butuh 1 prediksi terbaik tanpa NMS
  // const postprocessOutputSimplest = (output: ort.Tensor, numClasses: number, confidenceThreshold: number = 0.25): Detection[] => {
  //   const outputData = Array.from(output.data as Float32Array);
    
  //   // Debug output shape
  //   console.log('Output shape:', output.dims);
    
  //   let numAnchors;
  //   if (output.dims.length === 3) {
  //     numAnchors = output.dims[2];  // Biasanya 8400 untuk YOLOv8
  //   } else {
  //     numAnchors = outputData.length / (numClasses + 4);
  //   }
    
  //   let bestDetection: Detection | null = null;
  //   let bestConfidence = 0;
  //   const classNames = ['Ikan Bawal', 'Ikan Gurame', 'Ikan Lele', 'Ikan Nila', 'Ikan Tuna'];

  //   // Langsung cari yang terbaik tanpa menyimpan semua
  //   for (let i = 0; i < numAnchors; i++) {
  //     // YOLOv8 format: [x, y, w, h, class1, class2, ...]
  //     const x = outputData[i];
  //     const y = outputData[numAnchors + i];
  //     const w = outputData[2 * numAnchors + i];
  //     const h = outputData[3 * numAnchors + i];

  //     // Ambil probabilitas untuk setiap class
  //     const classProbabilities: number[] = [];
  //     for (let c = 0; c < numClasses; c++) {
  //       const classIndex = (4 + c) * numAnchors + i;
  //       classProbabilities.push(outputData[classIndex]);
  //     }

  //     const maxClassProbability = Math.max(...classProbabilities);
  //     const maxClassIndex = classProbabilities.indexOf(maxClassProbability);
      
  //     // Debug untuk beberapa anchor pertama
  //     if (i < 5) {
  //       console.log(`Anchor ${i}: conf=${maxClassProbability.toFixed(3)}, class=${maxClassIndex} (${classNames[maxClassIndex]})`);
  //     }

  //     if (maxClassProbability > bestConfidence && maxClassProbability > confidenceThreshold) {
  //       bestConfidence = maxClassProbability;
  //       bestDetection = {
  //         className: classNames[maxClassIndex],
  //         confidence: maxClassProbability,
  //         bbox: { x, y, w, h }
  //       };
  //     }
  //   }

  //   console.log(`Processed ${numAnchors} anchors, best: ${bestDetection?.className} (${bestDetection?.confidence.toFixed(3)})`);
  //   return bestDetection ? [bestDetection] : [];
  // };

  // Function to run inference
  const runInference = async (imageData: ImageData): Promise<Detection[]> => {
    if (!model) {
      throw new Error('Model not loaded');
    }

    let inputTensor = await preprocessImage(imageData);
    inputTensor = normalize(inputTensor);

    const inputName = model.inputNames[0];
    const input = new ort.Tensor('float32', inputTensor, [1, 3, 640, 640]);

    const feeds = { [inputName]: input };
    const outputs = await model.run(feeds);

    const outputName = model.outputNames[0];
    const output = outputs[outputName];

    if (!output) {
      throw new Error('Output tensor is undefined');
    }

    console.log('Output shape:', output.dims);
    
    const numClasses = 5;
    const confidenceThreshold = 0.3;
    
    // Gunakan versi simplest untuk performa terbaik
    const detections = postprocessOutput(output, numClasses, confidenceThreshold);

    return detections;
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const scrollToUploadBox = () => {
    if (uploadBoxRef.current) {
      const offsetTop = uploadBoxRef.current.offsetTop;
      const scrollOffset = offsetTop - 200;
      window.scrollTo({
        top: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  // Modified processFile function
  const processFile = async (file: File) => {
    console.log("Processing file:", file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);

        try {
          setIsLoading(true);

          if (isOffline) {
            const img = new Image();
            img.src = e.target.result as string;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 640;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(img, 0, 0, 640, 640);
            const imageData = ctx.getImageData(0, 0, 640, 640);

            const detections = await runInference(imageData);
            console.log('Offline detection result:', detections);

            // Ambil class_name dari deteksi pertama (jika ada)
            const className = detections.length > 0 ? detections[0].className : "Unknown";

            // Redirect ke halaman hasil dengan class_name
            router.push(`/result-fish-detection?class_name=${encodeURIComponent(className)}&offline=true`);
          } else {
            // Online processing using API
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/upload-fish`, {
              method: "POST",
              body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
              setImageUrls((prevImageUrls) => [
                ...prevImageUrls,
                ...result.predictions.map((prediction: Prediction) => prediction.image_url),
              ]);
              const className = result.predictions[0].class_name;
              router.push(`/result-fish-detection?class_name=${encodeURIComponent(className)}`);
            } else {
              throw new Error(result.message || "Terjadi kesalahan tak terduga");
            }
          }
        } catch (error) {
          console.error("Error processing image:", error);
          setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat memproses gambar.");
          setShowErrorModal(true);
          setPreviewImage(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    processFile(files[0]);

    // Reset the input value to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null; // Return nothing during SSR
  }

  // Client-side only markup from here
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: '#f0f8ff',
        backgroundImage:
          'url("/wave-bg.svg"), linear-gradient(to bottom, #e6f4ff 0%, #ffffff 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
        {/* Hero section */}
        <div
          className="w-full max-w-4xl mt-24 mb-12 px-4 opacity-100 transform-none"
          style={{
            animation: 'fadeInAndSlideUp 0.5s ease-out forwards',
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0066cc] font-lato">
            Deteksi Spesies Ikan dengan AI
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-[#2C2C2C] max-w-2xl mx-auto">
            Unggah foto ikan, dan teknologi AI kami akan mengidentifikasi spesies dengan akurat
          </p>

          {/* Fish icons animation - with CSS animation instead of framer-motion */}
          <div className="relative h-32 mb-8 overflow-hidden">
            {/* Left side fish */}
            <img
              src="/images/icon/ic_fish.png"
              alt="Fish icon"
              className="absolute h-12 w-auto fish-left"
              style={{ left: "5%", top: "20%" }}
            />

            {/* Right side fish */}
            <img
              src="/images/icon/ic_fish.png"
              alt="Fish icon"
              className="absolute h-12 w-auto transform scale-x-[-1] fish-right"
              style={{ right: "5%", top: "20%" }}
            />

            {/* Center fish */}
            <img
              src="/images/icon/ic_fish.png"
              alt="Fish icon"
              className="absolute h-14 w-auto fish-center"
              style={{ left: "calc(50% - 28px)", top: "30%" }}
            />

            {/* Bubbles with CSS animations */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={`bubble-${i}`}
                className="absolute rounded-full bg-blue-100 opacity-70 bubble"
                style={{
                  width: 8 + i * 3,
                  height: 8 + i * 3,
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Buttons Container */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 opacity-0"
          style={{ animation: 'fadeIn 0.5s ease-out 0.3s forwards' }}
        >
          {/* Button for Upload */}
          <button
            onClick={scrollToUploadBox}
            className="flex items-center justify-center bg-gradient-to-r from-[#0066cc] to-[#3399ff] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 w-full sm:w-64"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-base font-medium">Unggah Gambar</span>
          </button>

          {/* "atau" separator */}
          <span className="text-lg text-[#0066cc] my-2 sm:my-0">atau</span>

          {/* Button for Camera Scan */}
          <button
            onClick={handleCameraClick}
            className="flex items-center justify-center bg-white text-[#0066cc] px-6 py-4 border-2 border-[#0066cc] rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 w-full sm:w-64"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-base font-medium">Foto dengan Kamera</span>
          </button>
        </div>

        {/* Small Text */}
        <p className="text-sm text-gray-600 mb-16">
          Pilih salah satu metode untuk mengunggah atau memindai gambar ikan untuk identifikasi spesies.
        </p>

        {/* Upload Box */}
        <div
          className="w-full max-w-2xl mx-auto p-8 bg-white border border-blue-200 rounded-2xl shadow-xl opacity-0 transform translate-y-5"
          ref={uploadBoxRef}
          style={{ animation: 'fadeInAndSlideUp 0.5s ease-out 0.5s forwards' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0066cc]">
              Upload Gambar untuk Identifikasi Spesies
            </h2>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">AI-Powered</span>
            </div>
          </div>

          {/* Manual dropzone implementation without the library */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-full mx-auto border-dashed border-2 rounded-xl transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
          >
            <div className="p-8 flex flex-col items-center justify-center">
              {previewImage ? (
                <div className="mb-4">
                  <div className="h-48 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-48 object-contain rounded-lg shadow-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-base text-center text-gray-600 mb-2">
                    {isDragging ? (
                      <span className="font-medium text-blue-600">Drop your image here</span>
                    ) : (
                      <>Drag & drop your fish image here</>
                    )}
                  </span>
                  <span className="text-sm text-gray-500 mb-4">
                    or click to browse files
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                className="mt-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Files
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 mt-6 rounded-xl">
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full shadow-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-base font-medium text-blue-800 mb-1">Hasil Identifikasi Spesies:</p>
                <p className="text-sm text-blue-700">
                  {previewImage
                    ? "Menganalisis gambar ikan..."
                    : "Unggah gambar untuk melihat hasil identifikasi spesies."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          className="w-full max-w-4xl mt-20 mb-16 px-4 opacity-0"
          style={{ animation: 'fadeIn 0.5s ease-out 0.7s forwards' }}
        >
          <h2 className="text-2xl font-bold text-[#0066cc] mb-8">Fitur Utama</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-400 font-semibold mb-2">Identifikasi Cepat</h3>
              <p className="text-gray-600">Deteksi spesies ikan dalam hitungan detik dengan algoritma AI canggih.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-400 font-semibold mb-2">Akurasi Tinggi</h3>
              <p className="text-gray-600">Dilatih dengan ribuan gambar ikan untuk memberikan hasil identifikasi yang akurat.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg text-blue-400 font-semibold mb-2">Informasi Spesies</h3>
              <p className="text-gray-600">Dapatkan informasi detail tentang karakteristik dan habitat spesies ikan yang terdeteksi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4">
                <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-blue-700 mb-3">Menganalisis...</h2>
              <p className="text-gray-700 text-center">Mohon tunggu sementara AI kami mengidentifikasi spesies ikan Anda.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Error</h2>
              <button
                onClick={closeErrorModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700">{errorMessage}</p>
              </div>
              <button
                onClick={closeErrorModal}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mt-4"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add offline indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          Mode Offline - Menggunakan deteksi lokal
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInAndSlideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fish-left {
          animation: swimLeft 12s infinite alternate, fishBob 4s infinite;
        }
        
        .fish-right {
          animation: swimRight 12s infinite alternate, fishBob 4s infinite reverse;
        }
        
        .fish-center {
          animation: fishBob 3s infinite, fishScale 2s infinite alternate;
        }
        
        .bubble {
          animation: bubbleRise 3s infinite linear;
          bottom: -10px;
        }
        
        @keyframes swimLeft {
          from { transform: translateX(-10%); }
          to { transform: translateX(40%); }
        }
        
        @keyframes swimRight {
          from { transform: translateX(10%) scaleX(-1); }
          to { transform: translateX(-40%) scaleX(-1); }
        }
        
        @keyframes fishBob {
          0% { transform: translateY(0); }
          25% { transform: translateY(-15px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(15px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes fishScale {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        
        @keyframes bubbleRise {
          from { 
            transform: translateY(0);
            opacity: 0.7;
          }
          to { 
            transform: translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>

      {/* Footer */}
      <Footer />
    </div>
  );
}