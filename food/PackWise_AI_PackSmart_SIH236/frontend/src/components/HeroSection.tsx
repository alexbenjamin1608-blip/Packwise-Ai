import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Box,
  Compass,
  CheckCircle,
  Activity,
  Layers,
  Thermometer,
  Shield,
  Film,
} from 'lucide-react';

interface HeroSectionProps {
  onStartRecommendation: () => void;
  onExplore3DLab: () => void;
  onOpenStoryboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartRecommendation,
  onExplore3DLab,
  onOpenStoryboard,
}) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background Indian Sunrise Agricultural Landscape from Frame Sequence */}
      <div className="absolute inset-0 z-0">
        <img
          src="/frames/ezgif-frame-001.jpg"
          alt="Indian Agricultural Field at Sunrise"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105 transition-transform duration-1000"
        />
        {/* Dark Navy / Cyan Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/90 to-[#070B14]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/80" />
      </div>

      {/* Subtle Golden Mandala Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Content (6 Columns) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Category Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AI-POWERED FOOD PACKAGING</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-cyan-300">INDIA INITIATIVE</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-['Outfit']">
                Intelligent Packaging.
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  Longer Freshness.
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-xl">
              AI-powered packaging recommendations based on food properties, storage conditions, barrier requirements (OTR / WVTR), cost and sustainability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onStartRecommendation}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-cyan-500/30 hover:opacity-95 transition-all flex items-center gap-2 transform hover:scale-[1.02]"
              >
                <span>Start AI Recommendation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplore3DLab}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Explore 3D Packaging Lab</span>
              </button>

              <button
                onClick={onOpenStoryboard}
                className="px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>50-Frame Story</span>
              </button>
            </div>
          </div>

          {/* Center / Right Visual Showcase (6 Columns) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Center Produce Visual with Golden AI Energy Orbit & Mandala HUD */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center select-none">
              {/* Sacred Rangoli / Mandala Geometry Rings */}
              <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-spin-slow opacity-60" />
              <div className="absolute inset-6 rounded-full border border-cyan-500/30 animate-spin opacity-40" />
              <div className="absolute inset-12 rounded-full border border-dashed border-amber-400/40 opacity-75" />

              {/* Realistic Floating Mango Visual with Golden AI Aura */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center p-2 shadow-2xl shadow-amber-500/30">
                {/* Mango Image from sequence */}
                <img
                  src="/frames/ezgif-frame-010.jpg"
                  alt="Alphonso Mango with AI Orbit"
                  className="w-full h-full object-cover rounded-full border-2 border-amber-400/50 shadow-inner"
                />

                {/* Golden AI Energy Ring (Dynamic Orbit) */}
                <div className="absolute inset-[-12px] rounded-full border-2 border-transparent border-t-amber-400 border-r-cyan-400 animate-spin" />
              </div>

              {/* Holographic HUD Badge on Produce */}
              <div className="absolute -top-2 -right-2 bg-black/80 px-3 py-1.5 rounded-xl border border-cyan-500/40 backdrop-blur-md text-left shadow-lg">
                <div className="text-[10px] font-mono text-cyan-400">AI TARGET SCAN</div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Alphonso Mango
                </div>
              </div>
            </div>

            {/* Right Telemetry Glass Card */}
            <div className="mt-4 sm:-mt-6 w-full max-w-md p-4 sm:p-5 rounded-2xl glass-card border border-white/15 shadow-2xl backdrop-blur-xl text-left">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> REAL-TIME BIO-TELEMETRY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                <div>
                  <span className="text-slate-400">Food Commodity:</span>
                  <p className="font-bold text-white text-sm">Alphonso Mango</p>
                </div>
                <div>
                  <span className="text-slate-400">Moisture Content:</span>
                  <p className="font-mono font-bold text-cyan-300">High (82%)</p>
                </div>
                <div>
                  <span className="text-slate-400">Respiration Rate:</span>
                  <p className="font-mono font-bold text-amber-300">High (Climacteric)</p>
                </div>
                <div>
                  <span className="text-slate-400">Storage Profile:</span>
                  <p className="font-medium text-slate-200">Chilled (12°C - 14°C)</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Desired Shelf Life:</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono">18 Days (with MAP)</p>
                </div>
                <button
                  onClick={onStartRecommendation}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center gap-1"
                >
                  Configure <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics HUD Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 sm:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 shadow-xl bg-black/40">
          <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-left">
            <span className="text-[10px] font-mono uppercase text-slate-400">Oxygen Permeability</span>
            <div className="text-base sm:text-lg font-bold text-cyan-300 font-mono mt-0.5">
              OTR &lt; 60 <span className="text-[10px] text-slate-400 font-sans">cc/m²·d</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">Inhibits enzymatic oxidation</p>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-left">
            <span className="text-[10px] font-mono uppercase text-slate-400">Water Vapor Barrier</span>
            <div className="text-base sm:text-lg font-bold text-amber-300 font-mono mt-0.5">
              WVTR &lt; 4.5 <span className="text-[10px] text-slate-400 font-sans">g/m²·d</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">Prevents shrivel & weight loss</p>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-left">
            <span className="text-[10px] font-mono uppercase text-slate-400">Modified Atmosphere</span>
            <div className="text-base sm:text-lg font-bold text-emerald-300 font-mono mt-0.5">
              5% O₂ / 10% CO₂
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">Arrests ethylene ripening</p>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-left">
            <span className="text-[10px] font-mono uppercase text-slate-400">Shelf-Life Prediction</span>
            <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
              18 Days <span className="text-[10px] text-emerald-400 font-mono">(+300%)</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">vs 5 days unpackaged</p>
          </div>
        </div>
      </div>
    </section>
  );
};
