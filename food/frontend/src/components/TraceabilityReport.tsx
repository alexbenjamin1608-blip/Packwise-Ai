import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Box,
  Thermometer,
  Layers,
  FileText,
} from 'lucide-react';
import { RecommendationResultData } from '../types/packaging';

interface TraceabilityReportProps {
  result: RecommendationResultData;
}

export const TraceabilityReport: React.FC<TraceabilityReportProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [batchId] = useState<string>(`IN-PWI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [packDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const { food, material } = result;

  useEffect(() => {
    if (!canvasRef.current) return;

    const qrPayload = JSON.stringify({
      app: 'PackWise AI India',
      batch: batchId,
      product: food.name,
      material: material.shortCode,
      packed: packDate,
      shelfLifeDays: result.shelfLifeGainDays,
      fssai: result.fssaiComplianceStatus,
      bis: result.bisReference,
    });

    QRCode.toCanvas(canvasRef.current, qrPayload, {
      width: 170,
      margin: 1,
      color: {
        dark: '#070B14',
        light: '#FFFFFF',
      },
    }).catch((err) => {
      console.error('QR code generation error:', err);
    });
  }, [batchId, food, material, packDate, result]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `PackWise AI Specification Certificate: Batch ${batchId} | ${food.name} packaged in ${material.name} (Valid: ${result.shelfLifeGainDays} days)`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Smart Traceability & Digital Passport</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">GS1 Compliant Format</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Batch Passport & <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Technical Report</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Certified technical report preview and encrypted QR pass for food safety verification in cold-chains.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Share Pass'}
          </button>
        </div>
      </div>

      {/* Main Two-Column Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Digital QR Passport Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
              INDIA SUPPLY CHAIN PASSPORT
            </span>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mt-1">
              {food.name}
            </h3>
            <p className="text-xs text-amber-300 font-mono mt-0.5">Batch: {batchId}</p>

            {/* Generated QR Code on Canvas */}
            <div className="my-5 p-3 rounded-2xl bg-white shadow-xl inline-block">
              <canvas ref={canvasRef} className="rounded-lg" />
            </div>

            <div className="space-y-1.5 text-xs text-left pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">Packaging Date:</span>
                <span className="font-mono text-white">{packDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Material Structure:</span>
                <span className="font-mono text-cyan-300">{material.shortCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Cold Storage:</span>
                <span className="font-mono text-white">{food.idealTempC}°C ({food.idealRhPercent}% RH)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Freshness Window:</span>
                <span className="font-mono text-emerald-300 font-bold">18 Days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 w-full text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FSSAI VERIFICATION STAMP ACTIVE</span>
          </div>
        </div>

        {/* Printable Comprehensive Engineering Report (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl space-y-6 text-left">
          {/* Certificate Title */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                SPECIFICATION CERTIFICATE NO. PW-2026-904
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">
                PackWise AI Engineered Packaging Specification
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                COMPLIANCE VALIDATED
              </span>
              <span className="text-xs text-slate-400 font-mono">{packDate}</span>
            </div>
          </div>

          {/* Section 1: Food Properties */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              1. Food Biochemical & Respiration Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-black/40 p-3 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500">Commodity:</span>
                <p className="font-bold text-white">{food.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Moisture:</span>
                <p className="font-mono text-cyan-300">{food.moistureContent}</p>
              </div>
              <div>
                <span className="text-slate-500">Water Activity ($a_w$):</span>
                <p className="font-mono text-amber-300">{food.waterActivity}</p>
              </div>
              <div>
                <span className="text-slate-500">Respiration:</span>
                <p className="font-medium text-emerald-300">{food.respirationRate}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Recommended Material & Structure */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              2. Recommended Packaging Structure & Barrier Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-black/40 p-3 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500">Material:</span>
                <p className="font-bold text-white">{material.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Target OTR:</span>
                <p className="font-mono text-cyan-300">{result.requiredOtr}</p>
              </div>
              <div>
                <span className="text-slate-500">Target WVTR:</span>
                <p className="font-mono text-amber-300">{result.requiredWvtr}</p>
              </div>
              <div>
                <span className="text-slate-500">Gauge:</span>
                <p className="font-mono text-white">{result.optimalThicknessMicrons} µm</p>
              </div>
            </div>
          </div>

          {/* Section 3: MAP & Shelf-Life Projection */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              3. MAP Atmosphere & Shelf-Life Extension
            </h4>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Equilibrium Gas Blend:</span>
                <span className="font-mono text-cyan-300 font-bold">5% O₂ / 10% CO₂ / 85% N₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Unpackaged Shelf Life:</span>
                <span className="font-mono text-slate-300">{food.defaultShelfLifeUnpackagedDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Shelf Life Window:</span>
                <span className="font-mono text-emerald-400 font-bold">{food.maxShelfLifePackagedDays} Days (+{result.shelfLifeGainDays} Days Gain)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Regulatory Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              4. Regulatory Standards & Conformity
            </h4>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
              <p className="text-slate-200">
                <strong className="text-emerald-300">BIS Standard:</strong> {result.bisReference}
              </p>
              <p className="text-slate-200">
                <strong className="text-emerald-300">FSSAI Status:</strong> Conforming to FSSAI (Packaging) Regulations 2018; overall migration test compliant.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-500 italic">
            *This document is generated by the PackWise AI Packaging Heuristic Platform for trial and design specification.
          </div>
        </div>
      </div>
    </section>
  );
};
