import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Sparkles,
  DollarSign,
  PackageCheck,
  Wheat,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CommodityPricing {
  name: string;
  defaultPricePerKg: number;
  traditionalLossPercent: number;
  packwiseLossPercent: number;
  packCostPerKg: number;
}

const COMMODITY_PRESETS: Record<string, CommodityPricing> = {
  'Alphonso Mango': {
    name: 'Alphonso Mango',
    defaultPricePerKg: 140,
    traditionalLossPercent: 28,
    packwiseLossPercent: 5,
    packCostPerKg: 3.2,
  },
  'Hybrid Tomato': {
    name: 'Hybrid Tomato',
    defaultPricePerKg: 28,
    traditionalLossPercent: 32,
    packwiseLossPercent: 6,
    packCostPerKg: 1.1,
  },
  'Kashmiri Apple': {
    name: 'Kashmiri Apple',
    defaultPricePerKg: 95,
    traditionalLossPercent: 22,
    packwiseLossPercent: 4,
    packCostPerKg: 2.8,
  },
  'Malai Paneer': {
    name: 'Malai Paneer',
    defaultPricePerKg: 320,
    traditionalLossPercent: 18,
    packwiseLossPercent: 2,
    packCostPerKg: 4.5,
  },
  'Fresh Fish / Pomfret': {
    name: 'Fresh Coastal Fish',
    defaultPricePerKg: 480,
    traditionalLossPercent: 25,
    packwiseLossPercent: 3,
    packCostPerKg: 6.0,
  },
};

export const RoiCalculator: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Alphonso Mango');
  const [tonnes, setTonnes] = useState<number>(10); // 10 tonnes = 10,000 kg
  const [mandiPricePerKg, setMandiPricePerKg] = useState<number>(140);

  const preset = COMMODITY_PRESETS[selectedCrop] || COMMODITY_PRESETS['Alphonso Mango'];

  const totalKg = tonnes * 1000;
  const grossConsignmentValueINR = totalKg * mandiPricePerKg;

  // Spoilage calculations
  const traditionalLossKg = totalKg * (preset.traditionalLossPercent / 100);
  const packwiseLossKg = totalKg * (preset.packwiseLossPercent / 100);
  const foodSavedKg = traditionalLossKg - packwiseLossKg;
  const foodSavedTonnes = (foodSavedKg / 1000).toFixed(2);

  // Financial calculations
  const revenuePreservedINR = foodSavedKg * mandiPricePerKg;
  const packagingInvestmentINR = totalKg * preset.packCostPerKg;
  const netProfitGainINR = Math.max(0, revenuePreservedINR - packagingInvestmentINR);
  const roiMultiple = (revenuePreservedINR / packagingInvestmentINR).toFixed(1);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Mandi & Exporter Economics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Post-Harvest Loss Prevention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Food Spoilage & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Packaging ROI Calculator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Calculate the exact return on investment by preventing post-harvest spoilage across wholesale Indian mandis and export shipments.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="w-3.5 h-3.5" /> POST-HARVEST WASTE REDUCTION
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-card border border-white/15 p-6 sm:p-7 shadow-2xl space-y-5">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Consignment Parameters
          </h3>

          {/* Commodity Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Food Commodity</label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                const newCrop = e.target.value;
                setSelectedCrop(newCrop);
                setMandiPricePerKg(COMMODITY_PRESETS[newCrop].defaultPricePerKg);
              }}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
            >
              {Object.keys(COMMODITY_PRESETS).map((k) => (
                <option key={k} value={k}>
                  {k} (Avg Mandi: ₹{COMMODITY_PRESETS[k].defaultPricePerKg}/kg)
                </option>
              ))}
            </select>
          </div>

          {/* Batch Weight (Tonnes) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Consignment Weight</span>
              <span className="font-mono text-cyan-300 font-bold">{tonnes} Tonnes ({totalKg.toLocaleString('en-IN')} kg)</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={tonnes}
              onChange={(e) => setTonnes(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 Ton (Pickup tempo)</span>
              <span>10 Tons (Truck)</span>
              <span>50 Tons (Train / Multi-axle)</span>
            </div>
          </div>

          {/* Mandi Wholesale Price ₹/kg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Mandi Price / Realization</span>
              <span className="font-mono text-amber-300 font-bold">₹{mandiPricePerKg} / kg</span>
            </div>
            <input
              type="range"
              min={15}
              max={600}
              step={5}
              value={mandiPricePerKg}
              onChange={(e) => setMandiPricePerKg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Consignment Value:</span>
              <span className="font-mono text-white font-bold">₹{(grossConsignmentValueINR / 100000).toFixed(2)} Lakhs</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Traditional Indian Spoilage:</span>
              <span className="font-mono text-rose-400 font-bold">{preset.traditionalLossPercent}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PackWise Protected Spoilage:</span>
              <span className="font-mono text-emerald-400 font-bold">{preset.packwiseLossPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right Financial ROI Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Profit Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/40 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  NET PRESERVED CONSIGNMENT PROFIT
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                  ₹{(netProfitGainINR / 100000).toFixed(2)}{' '}
                  <span className="text-lg font-sans text-emerald-400 font-bold">Lakhs Saved</span>
                </h3>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold">INVESTMENT ROI</span>
                <p className="text-2xl font-black text-emerald-300 font-mono">{roiMultiple}x</p>
              </div>
            </div>

            {/* Breakdown Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Food Saved from Waste</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{foodSavedTonnes} <span className="text-xs font-sans text-slate-400">Tonnes</span></p>
                <span className="text-[10px] text-emerald-400 font-mono">({foodSavedKg.toLocaleString('en-IN')} kg)</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Packaging Investment</span>
                <p className="text-lg font-bold text-amber-300 font-mono mt-0.5">₹{(packagingInvestmentINR / 100000).toFixed(2)} <span className="text-xs font-sans text-slate-400">Lakh</span></p>
                <span className="text-[10px] text-slate-500 font-mono">@ ₹{preset.packCostPerKg}/kg</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Gross Spoilage Saved</span>
                <p className="text-lg font-bold text-cyan-300 font-mono mt-0.5">₹{(revenuePreservedINR / 100000).toFixed(2)} <span className="text-xs font-sans text-slate-400">Lakh</span></p>
                <span className="text-[10px] text-slate-500 font-mono">Preserved value</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Every <strong>₹1 invested</strong> in PackWise MAP multilayer packaging returns <strong>₹{roiMultiple}</strong> in preserved marketable produce.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
