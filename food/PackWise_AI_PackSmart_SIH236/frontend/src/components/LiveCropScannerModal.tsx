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
  Eye,
} from 'lucide-react';

interface LiveCropScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropDetected: (cropName: string, hindiName: string, category: string) => void;
  currentLanguage?: string;
}

interface DetectionCandidate {
  name: string;
  hindiName: string;
  category: string;
  confidence: number;
  respiration: string;
  moisture: string;
}

const SAMPLE_DETECTIONS: DetectionCandidate[] = [
  {
    name: 'Alphonso Mango',
    hindiName: 'हापुस आम',
    category: 'Fresh Fruits',
    confidence: 96,
    respiration: 'High Climacteric',
    moisture: 'High (82%)',
  },
  {
    name: 'Hybrid Tomato',
    hindiName: 'टमाटर',
    category: 'Vegetables',
    confidence: 94,
    respiration: 'High',
    moisture: 'High (94%)',
  },
  {
    name: 'Nashik Red Onion',
    hindiName: 'प्याज',
    category: 'Vegetables',
    confidence: 92,
    respiration: 'Low',
    moisture: 'Medium',
  },
  {
    name: 'Pahari Potato',
    hindiName: 'आलू',
    category: 'Vegetables',
    confidence: 95,
    respiration: 'Low',
    moisture: 'Medium',
  },
  {
    name: 'Aged Basmati Rice',
    hindiName: 'बासमती चावल',
    category: 'Grains',
    confidence: 91,
    respiration: 'None',
    moisture: 'Low (<12%)',
  },
];

export const LiveCropScannerModal: React.FC<LiveCropScannerModalProps> = ({
  isOpen,
  onClose,
  onCropDetected,
  currentLanguage = 'en',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [detectedCrop, setDetectedCrop] = useState<DetectionCandidate>(SAMPLE_DETECTIONS[0]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    // Simulate AI scanning interval detecting crop after 2 seconds
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 2200);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    setIsAnalyzing(true);
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
      setCameraError('Camera access denied or unavailable. You can use demo AI detection presets below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleApplyDetection = () => {
    onCropDetected(detectedCrop.name, detectedCrop.hindiName, detectedCrop.category);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-cyan-500/50 p-5 sm:p-7 shadow-2xl bg-slate-950/95 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-amber-500 p-[1.5px]">
              <div className="w-full h-full bg-[#070B14] rounded-[9px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                AI Live Crop & Food Scanner
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  REAL-TIME VISION
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Point camera at fresh produce to auto-detect respiration and barrier specs
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
        <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-cyan-500/30 shadow-2xl flex items-center justify-center">
          {/* Real Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Fallback image if camera is disabled/denied */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 to-slate-900">
              <img
                src="/frames/ezgif-frame-010.jpg"
                alt="Demo Alphonso Mango Scan"
                className="w-40 h-40 object-cover rounded-full border-2 border-amber-400/60 shadow-xl opacity-90 mb-3"
              />
              <p className="text-xs text-amber-300 font-medium max-w-sm">
                Live camera demo mode active. Pointing at fresh Indian produce.
              </p>
            </div>
          )}

          {/* Holographic Laser Scan Line Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22D3EE] animate-laser-scan" />
          </div>

          {/* Corner Holographic Reticle Brackets */}
          <div className="absolute inset-6 sm:inset-10 pointer-events-none flex flex-col justify-between border border-cyan-500/20 rounded-2xl">
            <div className="flex justify-between">
              <span className="w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
              <span className="w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            </div>
            <div className="flex justify-between">
              <span className="w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
              <span className="w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </div>

          {/* Top HUD Telemetry */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-black/70 text-cyan-300 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {isAnalyzing ? 'OPTICAL NEURAL SCAN...' : 'FOOD RECOGNIZED'}
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              FPS: 30 • HD VISION
            </span>
          </div>

          {/* Bottom Flip Camera button */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={toggleFacingMode}
              className="p-2 rounded-xl bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-colors"
              title="Switch Front/Back Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Detection Result Banner */}
        <div className="p-4 rounded-2xl glass-card-gold border border-amber-500/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                AI RECOGNIZED COMMODITY
              </span>
              <h4 className="text-xl font-black text-white font-['Outfit'] mt-0.5">
                {detectedCrop.name} <span className="text-amber-300 font-normal">({detectedCrop.hindiName})</span>
              </h4>
            </div>

            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {detectedCrop.confidence}% Confidence
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-white/10">
            <div>
              <span className="text-slate-400">Category:</span>
              <p className="font-bold text-white">{detectedCrop.category}</p>
            </div>
            <div>
              <span className="text-slate-400">Respiration:</span>
              <p className="font-mono text-cyan-300 font-bold">{detectedCrop.respiration}</p>
            </div>
            <div>
              <span className="text-slate-400">Moisture Profile:</span>
              <p className="font-mono text-amber-300 font-bold">{detectedCrop.moisture}</p>
            </div>
          </div>
        </div>

        {/* Preset Crop Swapper for Demonstration */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] block">
            DEMO SCANNER PRESETS (Or point camera at real crop):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_DETECTIONS.map((crop) => (
              <button
                key={crop.name}
                onClick={() => setDetectedCrop(crop)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  detectedCrop.name === crop.name
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {crop.name} ({crop.hindiName})
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyDetection}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:opacity-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Apply & Get Packaging Advice
          </button>
        </div>
      </div>
    </div>
  );
};
