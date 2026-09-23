import React from 'react';
import {
  X,
  Cpu,
  Sparkles,
  Activity,
  Layers,
  BarChart3,
  Scale,
  Leaf,
  Compass,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

interface FuturisticDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const FuturisticDashboard: React.FC<FuturisticDashboardProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  // Mini sparkline data
  const miniTrend = [
    { day: 1, val: 98 },
    { day: 4, val: 95 },
    { day: 8, val: 91 },
    { day: 12, val: 84 },
    { day: 15, val: 76 },
    { day: 18, val: 65 },
  ];

  const costBreakdown = [
    { name: 'Film', cost: 1.15 },
    { name: 'Barrier', cost: 0.85 },
    { name: 'Print', cost: 0.42 },
    { name: 'Seal', cost: 0.35 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#040711]/95 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Command Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-['Outfit'] tracking-wider">
                  PACKWISE AI COMMAND CENTER
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  FRAME 50 SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Modified Atmosphere Packaging • Smart Packaging for a Sustainable India
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard 3-Column Grid inspired by Frame 50 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column Telemetry Cards (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Compatibility Card (94%) */}
            <div className="p-5 rounded-3xl glass-card border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  AI Compatibility
                </span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-mono">94%</span>
                <span className="text-xs text-emerald-400 font-bold">Optimal</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Matched against adaptive multi-barrier bio-polymer profile.
              </p>
            </div>

            {/* Shelf-Life Card (18 Days) */}
            <div className="p-5 rounded-3xl glass-card border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Freshness Window
                </span>
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-300 font-mono">18</span>
                <span className="text-sm font-bold text-slate-300">Days</span>
                <span className="text-[10px] font-mono text-emerald-400">(+300%)</span>
              </div>
              <div className="h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniTrend}>
                    <Area type="monotone" dataKey="val" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Packaging Unit Cost Card */}
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Packaging Cost
                </span>
                <Scale className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">₹1.84</span>
                <span className="text-xs text-slate-400 font-sans">/ pack</span>
              </div>
              <p className="text-[11px] text-slate-400">
                ₹18,400 per 10,000 unit manufacturing batch.
              </p>
            </div>
          </div>

          {/* Center Column: Frame 50 Signature Visual (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center relative py-6">
            {/* Background Multi-Layer Sacred Lotus & Mandala HUD */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center select-none">
              {/* Outer Golden Mandala Rings */}
              <div className="absolute inset-0 rounded-full border border-amber-500/25 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-spin" />
              <div className="absolute inset-8 rounded-full border border-amber-400/40" />

              {/* High-Resolution Frame 50 Produce Core */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <img
                  src="/frames/ezgif-frame-050.jpg"
                  alt="PackWise AI Dashboard Frame"
                  className="w-full h-full object-cover rounded-full filter contrast-[1.1] brightness-[0.95]"
                />
                {/* Dynamic Holographic Scan Line */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                </div>
              </div>

              {/* HUD Orbit Badges */}
              <div className="absolute top-2 left-6 bg-black/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                OTR: &lt;60 cc
              </div>
              <div className="absolute bottom-4 right-6 bg-black/80 px-2.5 py-1 rounded-lg border border-amber-500/40 text-[10px] font-mono text-amber-300">
                WVTR: &lt;4.5 g
              </div>
            </div>

            {/* Brand Title Bar */}
            <div className="mt-4 space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-wider">
                PACKWISE <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-sm font-medium text-slate-300 tracking-wide">
                Smart Packaging for a Sustainable India
              </p>
            </div>
          </div>

          {/* Right Column Telemetry Cards (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sustainability Eco Score Card */}
            <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Eco Score Rating
                </span>
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-300 font-mono">88</span>
                <span className="text-xs text-slate-400 font-sans">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Mono-material recyclable grade with -42% carbon footprint.
              </p>
            </div>

            {/* MAP Gas Ratio Card */}
            <div className="p-5 rounded-3xl glass-card border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">
                  Atmosphere Balance
                </span>
                <Compass className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-sm font-bold font-mono text-white flex items-center justify-between pt-1">
                <span className="text-cyan-400">5% O₂</span>
                <span className="text-emerald-400">10% CO₂</span>
                <span className="text-slate-400">85% N₂</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex mt-2">
                <div className="bg-cyan-400 h-full w-[5%]" />
                <div className="bg-emerald-400 h-full w-[10%]" />
                <div className="bg-slate-500 h-full w-[85%]" />
              </div>
            </div>

            {/* Material Specification */}
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Recommended Film
                </span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-base font-bold text-white leading-tight">
                PET + PE Multilayer Barrier Film
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Thickness: <strong className="text-white font-mono">75 µm</strong></span>
                <span>FSSAI: <strong className="text-emerald-400">Verified</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Navigation Links */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-mono">
            COMMAND INTERFACE SHORTCUTS:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'recommend', label: 'Start Recommendation' },
              { id: 'lab3d', label: '3D Packaging Lab' },
              { id: 'storyboard', label: 'Visual Sequence' },
              { id: 'compliance', label: 'FSSAI/BIS Module' },
              { id: 'cost', label: 'Cost Calculator' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigateTab(link.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
