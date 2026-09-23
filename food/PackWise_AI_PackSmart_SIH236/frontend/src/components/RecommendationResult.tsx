import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Box,
  BarChart3,
  Scale,
  QrCode,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { RecommendationResultData } from '../types/packaging';

interface RecommendationResultProps {
  result: RecommendationResultData;
  onOpenLab3D: () => void;
  onOpenShelfLife: () => void;
  onOpenCost: () => void;
  onOpenTraceability: () => void;
  onReset: () => void;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  result,
  onOpenLab3D,
  onOpenShelfLife,
  onOpenCost,
  onOpenTraceability,
  onReset,
}) => {
  const { food, material, compatibilityScore } = result;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Packaging Recommendation Engine</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Analysis Complete</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Tailored Packaging Specification for <span className="text-amber-400">{food.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Indian Commodity Category: <span className="text-cyan-300">{food.category}</span> ({food.hindiName})
          </p>
        </div>

        <button
          onClick={onReset}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start New Analysis
        </button>
      </div>

      {/* Main Result Showcase */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Signature Recommendation Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Recommended Primary Structure
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
                  {material.name}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {material.shortCode} • {material.structureType}
                </span>
              </div>

              {/* Compatibility Score Radial Badge */}
              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray={`${compatibilityScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-extrabold text-white font-mono leading-none">
                      {compatibilityScore}%
                    </span>
                  </div>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-200">AI Compatibility</p>
                  <p className="text-[11px] text-emerald-400">Optimal Barrier Match</p>
                </div>
              </div>
            </div>

            {/* Why This Package? Explanation */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5" /> Why this package structure?
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {result.whyThisPackage}
              </p>
              <p className="text-[11px] text-slate-400 italic mt-2">
                *Note: No packaging material is universally best. Selection represents an engineered compromise between respiration control, barrier needs, cost, and logistics conditions.
              </p>
            </div>

            {/* Scientific Barrier & Structural Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Target OTR</span>
                <p className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{result.requiredOtr}</p>
                <span className="text-[10px] text-slate-500">Oxygen barrier</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Target WVTR</span>
                <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">{result.requiredWvtr}</p>
                <span className="text-[10px] text-slate-500">Moisture barrier</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Thickness</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5">{result.optimalThicknessMicrons} µm</p>
                <span className="text-[10px] text-slate-500">Engineered gauge</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Heat Sealability</span>
                <p className="text-sm font-bold text-emerald-300 mt-0.5">{result.sealability}</p>
                <span className="text-[10px] text-slate-500">Hermetic seal</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">MAP Suitability</span>
                <p className="text-sm font-bold text-sky-300 mt-0.5">{result.mapSuitability}</p>
                <span className="text-[10px] text-slate-500">Gas retention</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Shelf Life Extension</span>
                <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">+{result.shelfLifeGainDays} Days</p>
                <span className="text-[10px] text-slate-500">Over unpackaged</span>
              </div>
            </div>

            {/* Quick Link Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenLab3D}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Box className="w-4 h-4" /> Inspect in 3D Packaging Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenShelfLife}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" /> Shelf Life Timeline
              </button>

              <button
                onClick={onOpenCost}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-colors"
              >
                <Scale className="w-4 h-4 text-emerald-400" /> Cost Optimizer
              </button>

              <button
                onClick={onOpenTraceability}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-colors"
              >
                <QrCode className="w-4 h-4 text-cyan-400" /> Batch QR Pass
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Compliance & Risks Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* FSSAI & BIS India Compliance Badge Card */}
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> India Regulatory Compliance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {result.fssaiComplianceStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-medium">FSSAI Food Contact Suitability:</strong>
                  <p className="text-slate-400 mt-0.5">{food.fssaiNotes}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-medium">BIS Standard Reference:</strong>
                  <p className="text-cyan-300 font-mono mt-0.5">{result.bisReference}</p>
                </div>
              </div>
            </div>

            {/* Mandatory Regulatory Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Regulatory Notice:</strong> Verify current FSSAI requirements, overall migration limits (IS 9845), and applicable conformity/testing documentation before commercial deployment.
              </span>
            </div>
          </div>

          {/* Critical Spoilage Risks Mitigated */}
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/15 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Key Spoilage Risks Mitigated
            </span>
            <div className="space-y-2">
              {result.risksMitigated.map((risk) => (
                <div
                  key={risk}
                  className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs"
                >
                  <span className="text-emerald-200 font-medium">{risk}</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">CONTROLLED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Economics Summary */}
          <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/15 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Estimated Unit Cost:</span>
              <p className="text-lg font-bold text-amber-300 font-mono">
                ₹{result.estimatedCostPerPackINR} <span className="text-xs text-slate-400 font-sans">/ pack</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Sustainability Score:</span>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                {result.ecoScore} <span className="text-xs text-slate-400 font-sans">/ 100</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
