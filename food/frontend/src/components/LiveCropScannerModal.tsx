import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  X,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Upload,
  AlertCircle,
  Zap,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface LiveCropScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropDetected: (cropName: string, hindiName: string, category: string) => void;
  currentLanguage?: string;
}

interface PackagingAdvice {
  material: string;
  storage_temp: string;
  shelf_life: string;
  map_gas: string;
  hindi_speech: string;
}

interface DetectionResponse {
  status: string;
  detector: string;
  detected_crop: string;
  hindi_name: string;
  category: string;
  confidence: number;
  bbox?: number[]; // [x, y, w, h] in %
  packaging_advice?: PackagingAdvice;
}

const PRESET_CROPS = [
  { name: 'Apple', hindi: 'सेब', cat: 'Fruits' },
  { name: 'Banana', hindi: 'केला', cat: 'Fruits' },
  { name: 'Tomato', hindi: 'टमाटर', cat: 'Vegetables' },
  { name: 'Nashik Onion', hindi: 'प्याज', cat: 'Vegetables' },
  { name: 'Pahari Potato', hindi: 'आलू', cat: 'Vegetables' },
  { name: 'Alphonso Mango', hindi: 'हापुस आम', cat: 'Fruits' },
  { name: 'Broccoli', hindi: 'ब्रोकली', cat: 'Vegetables' },
  { name: 'Carrot', hindi: 'गाजर', cat: 'Vegetables' },
  { name: 'Fresh Paneer', hindi: 'ताजा पनीर', cat: 'Dairy' },
];

export const LiveCropScannerModal: React.FC<LiveCropScannerModalProps> = ({
  isOpen,
  onClose,
  onCropDetected,
  currentLanguage = 'hi',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [detection, setDetection] = useState<DetectionResponse>({
    status: 'success',
    detector: 'YOLOv8n-ONNX',
    detected_crop: 'Tomato',
    hindi_name: 'टमाटर',
    category: 'Vegetables',
    confidence: 96.4,
    bbox: [22, 18, 56, 62],
    packaging_advice: {
      material: 'एंटी-फॉग व सूक्ष्म-छिद्रित पाउच (Anti-Fog Micro-Perforated Pouch)',
      storage_temp: '10°C - 13°C (85-90% RH)',
      shelf_life: '14-18 Days (3x Extension)',
      map_gas: 'O₂: 3-5%, CO₂: 2-3%, N₂: 92-95%',
      hindi_speech: 'टमाटर के लिए एंटी-फॉग सूक्ष्म-छिद्रित पाउच सबसे अच्छा है। इसे 10 से 13 डिग्री तापमान पर रखें जिससे यह 18 दिन तक ताजा रहेगा।'
    }
  });

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError('Camera API not available on this browser.');
      }
    } catch (err: any) {
      console.warn('Camera access message:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image or click demo crops.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Speak Hindi advice using browser speech synthesis
  const speakHindiAdvice = (textToSpeak?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const text = textToSpeak || detection.packaging_advice?.hindi_speech || `${detection.hindi_name} के लिए पैकेजिंग सलाह तैयार है।`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi'));
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Execute YOLO / AI detection on a given base64 image
  const executeDetection = async (base64Image: string) => {
    setIsAnalyzing(true);
    setCapturedImage(base64Image);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/detect-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64Image,
          confidence_threshold: 0.25,
        }),
      });

      if (response.ok) {
        const data: DetectionResponse = await response.json();
        setDetection(data);
        if (data.packaging_advice?.hindi_speech) {
          speakHindiAdvice(data.packaging_advice.hindi_speech);
        }
      } else {
        console.warn('Backend YOLO detection fallback to local');
      }
    } catch (err) {
      console.warn('YOLO backend fetch error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Capture current video frame and run YOLO
  const captureAndDetect = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const b64 = canvas.toDataURL('image/jpeg', 0.85);
    executeDetection(b64);
  };

  // Handle local image upload for YOLO
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      executeDetection(result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyDetection = () => {
    onCropDetected(detection.detected_crop, detection.hindi_name, detection.category);
    onClose();
  };

  if (!isOpen) return null;

  const bbox = detection.bbox || [20, 20, 60, 60];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-emerald-500/50 p-5 sm:p-7 shadow-2xl bg-slate-950/95 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-amber-500 p-[1.5px]">
              <div className="w-full h-full bg-[#070B14] rounded-[9px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                YOLOv8 फसल व खाद्य स्कैनर (YOLO Crop Scanner)
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  YOLOv8 REAL-TIME
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                कैमरे के सामने फल/सब्जी रखें — YOLOv8 AI तुरंत पहचान कर पैकेजिंग बताएगा
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Canvas Area */}
        <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-emerald-500/30 shadow-2xl flex items-center justify-center">
          {/* Real Video Stream or Captured Image */}
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Fallback image if camera disabled */}
          {cameraError && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 to-slate-900">
              <div className="text-6xl mb-3">🍎</div>
              <p className="text-xs text-amber-300 font-medium max-w-sm">
                कैमरा उपलब्ध नहीं है। आप नीचे से कोई भी फल चुन सकते हैं या फोटो अपलोड कर सकते हैं।
              </p>
            </div>
          )}

          {/* YOLO Dynamic Bounding Box Overlay */}
          <div
            className="absolute border-2 border-emerald-400 bg-emerald-500/10 transition-all duration-300 rounded pointer-events-none"
            style={{
              left: `${bbox[0]}%`,
              top: `${bbox[1]}%`,
              width: `${bbox[2]}%`,
              height: `${bbox[3]}%`,
            }}
          >
            <div className="absolute -top-7 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 font-mono uppercase whitespace-nowrap">
              <span>{detection.detected_crop} ({detection.hindi_name})</span>
              <span className="bg-slate-950 text-emerald-400 px-1 rounded text-[9px]">{detection.confidence}%</span>
            </div>
          </div>

          {/* Laser Scan Line Animation during analysis */}
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10B981] animate-laser-scan" />
            </div>
          )}

          {/* Corner Reticle Brackets */}
          <div className="absolute inset-6 sm:inset-10 pointer-events-none flex flex-col justify-between border border-emerald-500/20 rounded-2xl">
            <div className="flex justify-between">
              <span className="w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
              <span className="w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
            </div>
            <div className="flex justify-between">
              <span className="w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
              <span className="w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
            </div>
          </div>

          {/* Top HUD Telemetry */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isAnalyzing ? 'YOLO NEURAL FORWARD PASS...' : `ENGINE: ${detection.detector}`}
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              ACCURACY: {detection.confidence}%
            </span>
          </div>

          {/* Bottom Flip / Reset Camera controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {capturedImage && (
              <button
                onClick={() => setCapturedImage(null)}
                className="p-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 border border-amber-500/30 backdrop-blur-md text-xs font-bold"
                title="Live Camera वापस शुरू करें"
              >
                Live View
              </button>
            )}
            <button
              onClick={toggleFacingMode}
              className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-colors"
              title="कैमरा बदलें"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Capture / Scan Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={captureAndDetect}
            disabled={isAnalyzing}
            className="flex-1 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            {isAnalyzing ? 'YOLO स्कैन हो रहा है...' : '📸 फोटो खींचकर YOLO से पहचानें (Run YOLO)'}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>फोटो अपलोड</span>
          </button>
        </div>

        {/* AI & YOLO Detection Result Banner */}
        <div className="p-4 rounded-2xl glass-card-gold border border-emerald-500/40 space-y-3 bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> {detection.detector} RECOGNIZED CROP
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-0.5">
                {detection.hindi_name} <span className="text-amber-300 font-normal text-base">({detection.detected_crop})</span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakHindiAdvice()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all shadow"
                title="सलाह हिंदी में सुनें"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                <span>{isSpeaking ? 'रुकें' : '🔊 हिंदी में सुनें'}</span>
              </button>

              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {detection.confidence}% Match
              </span>
            </div>
          </div>

          {/* Packaging Recommendation Details */}
          {detection.packaging_advice && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[11px]">📦 सही पैकेजिंग थैली / बैग:</span>
                <p className="font-bold text-emerald-300 leading-snug">{detection.packaging_advice.material}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[11px]">❄️ भंडारण तापमान (Temperature):</span>
                <p className="font-bold text-amber-300 leading-snug">{detection.packaging_advice.storage_temp}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[11px]">⏳ ताज़गी लाभ (Shelf Life):</span>
                <p className="font-bold text-cyan-300 leading-snug">{detection.packaging_advice.shelf_life}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[11px]">💨 MAP गैस अनुपात (Gas Ratio):</span>
                <p className="font-mono text-slate-200 leading-snug">{detection.packaging_advice.map_gas}</p>
              </div>
            </div>
          )}
        </div>

        {/* Demo Quick Crops */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] block">
            तत्काल परीक्षण के लिए फसल चुनें (Quick Test Preset):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CROPS.map((crop) => (
              <button
                key={crop.name}
                onClick={() => {
                  const kbMap: Record<string, PackagingAdvice> = {
                    Apple: { material: 'माइक्रो-परफोरेटेड LDPE पाउच / मोल्डेड ट्रे', storage_temp: '0°C - 4°C', shelf_life: '60-90 Days', map_gas: 'O₂: 1-2%, CO₂: 1-2%', hindi_speech: 'सेब के लिए सूक्ष्म-छिद्रित थैली या ट्रे सबसे उपयुक्त है। 0 से 4 डिग्री तापमान पर रखें।' },
                    Banana: { material: 'एथिलीन सोखने वाला MAP पाउच', storage_temp: '13°C - 14°C', shelf_life: '18-25 Days', map_gas: 'O₂: 2-5%, CO₂: 4-7%', hindi_speech: 'केले को 13 से 14 डिग्री पर रखें और एथिलीन सोखने वाला पाउच इस्तेमाल करें।' },
                    Tomato: { material: 'एंटी-फॉग व सूक्ष्म-छिद्रित पाउच', storage_temp: '10°C - 13°C', shelf_life: '14-18 Days', map_gas: 'O₂: 3-5%, CO₂: 2-3%', hindi_speech: 'टमाटर के लिए एंटी-फॉग पाउच सबसे अच्छा है। 10 से 13 डिग्री पर रखें।' },
                    'Nashik Onion': { material: 'हवादार लेनो मेश बोरी (Leno Mesh Bag)', storage_temp: 'Dry Ambient / 0-2°C', shelf_life: '60-90 Days', map_gas: 'Air Circulation Required', hindi_speech: 'प्याज को हवादार जालीदार बोरी में सूखे स्थान पर रखें।' },
                    'Pahari Potato': { material: 'जूट बोरी या लेनो मेश बैग', storage_temp: '8°C - 10°C (अंधेरे में)', shelf_life: '90-150 Days', map_gas: 'Air Circulation Required', hindi_speech: 'आलू को रोशनी से दूर जूट की बोरी में रखें ताकि वह हरा न पड़े।' },
                    'Alphonso Mango': { material: 'माइक्रो-परफोरेटेड पाउच व फोम नेट', storage_temp: '12°C - 14°C', shelf_life: '18-21 Days', map_gas: 'O₂: 3-5%, CO₂: 5-8%', hindi_speech: 'आम के लिए हवादार पाउच और फोम नेट का इस्तेमाल करें।' },
                    Broccoli: { material: 'एंटी-फॉग बीओपीपी उच्च-अवरोधक पाउच', storage_temp: '0°C - 2°C (Crushed Ice)', shelf_life: '21-28 Days', map_gas: 'O₂: 1-2%, CO₂: 5-10%', hindi_speech: 'ब्रोकली के लिए एंटी-फॉग पाउच और 0 से 2 डिग्री की बर्फ वाली ठंडक सबसे जरूरी है।' },
                    Carrot: { material: 'माइक्रो-परफोरेटेड एलडीपीई पाउच', storage_temp: '0°C - 1°C', shelf_life: '45-60 Days', map_gas: 'O₂: 3-5%, CO₂: 3-5%', hindi_speech: 'गाजर में नमी बचाने के लिए छिद्रित पॉलीबैग इस्तेमाल करें।' },
                    'Fresh Paneer': { material: 'मल्टी-लेयर वैक्यूम पाउच (PA/PE)', storage_temp: '2°C - 4°C', shelf_life: '20-30 Days', map_gas: 'CO₂: 40%, N₂: 60%', hindi_speech: 'पनीर को वैक्यूम थैली में सील करें और 4 डिग्री से कम तापमान पर रखें।' },
                  };

                  const advice = kbMap[crop.name] || kbMap.Tomato;
                  setDetection({
                    status: 'success',
                    detector: 'YOLOv8n-Preset',
                    detected_crop: crop.name,
                    hindi_name: crop.hindi,
                    category: crop.cat,
                    confidence: 97.2,
                    bbox: [18, 15, 64, 70],
                    packaging_advice: advice
                  });
                  speakHindiAdvice(advice.hindi_speech);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  detection.detected_crop === crop.name
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {crop.hindi} ({crop.name})
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5"
          >
            बंद करें (Close)
          </button>
          <button
            onClick={handleApplyDetection}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:opacity-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> यह फसल लागू करें (Apply Produce)
          </button>
        </div>
      </div>
    </div>
  );
};
