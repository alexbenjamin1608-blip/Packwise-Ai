import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Info,
  TrendingDown,
  DollarSign,
  Layers,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

export const CostOptimizer: React.FC = () => {
  const [productionQty, setProductionQty] = useState<number>(10000);
  const [pouchAreaM2, setPouchAreaM2] = useState<number>(0.045); // ~250g - 500g pouch
  const [thicknessMicrons, setThicknessMicrons] = useState<number>(75);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('pet-pe-multilayer');

  const activeMaterial = PACKAGING_MATERIALS.find((m) => m.id === selectedMaterialId) || PACKAGING_MATERIALS[0];
  const monoPeMaterial = PACKAGING_MATERIALS.find((m) => m.id === 'mono-pe-recyclable') || PACKAGING_MATERIALS[4];
  const aluFoilMaterial = PACKAGING_MATERIALS.find((m) => m.id === 'alu-foil-laminate') || PACKAGING_MATERIALS[2];

  // Price calculations with volume discounting
  const getVolumeDiscountFactor = (qty: number) => {
    if (qty >= 100000) return 0.78; // 22% volume discount on resin & converting
    if (qty >= 25000) return 0.85;
    if (qty >= 10000) return 0.92;
    return 1.0;
  };

  const discount = getVolumeDiscountFactor(productionQty);

  const calculateUnitCost = (matRatePerM2: number, defThickness: number, chosenThickness: number) => {
    const rawCost = matRatePerM2 * pouchAreaM2 * (chosenThickness / defThickness);
    const printingConvertingCost = 0.42 * discount;
    const totalUnitINR = (rawCost * discount) + printingConvertingCost;
    return Number(totalUnitINR.toFixed(2));
  };

  const currentUnitCost = calculateUnitCost(activeMaterial.relativeCostPerM2INR, activeMaterial.defaultThicknessMicrons, thicknessMicrons);
  const monoPeUnitCost = calculateUnitCost(monoPeMaterial.relativeCostPerM2INR, monoPeMaterial.defaultThicknessMicrons, 80);
  const aluFoilUnitCost = calculateUnitCost(aluFoilMaterial.relativeCostPerM2INR, aluFoilMaterial.defaultThicknessMicrons, 105);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Commercial Economics & Procurement</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Domestic Indian Market</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            India Packaging <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">Cost & Batch Optimizer</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Model unit and batch packaging expenditure across polymer conversion rates and bulk procurement tiers in India.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <Info className="w-3.5 h-3.5" /> INDIAN MARKET ESTIMATE / DEMO VALUE
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Configuration (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl glass-card border border-white/15 space-y-5">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Production Parameters
          </h3>

          {/* Quantity selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Production Run Quantity</span>
              <span className="font-mono text-cyan-300 font-bold">{productionQty.toLocaleString('en-IN')} Packs</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 10000, 100000].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setProductionQty(qty)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    productionQty === qty
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {qty.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Package Surface Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Pouch Surface Area</span>
              <span className="font-mono text-amber-300 font-bold">{(pouchAreaM2 * 10000).toFixed(0)} cm² ({pouchAreaM2} m²)</span>
            </div>
            <select
              value={pouchAreaM2}
              onChange={(e) => setPouchAreaM2(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white"
            >
              <option value={0.025}>Small Sachet (50g - 100g) • 250 cm²</option>
              <option value={0.045}>Standard Standup Pouch (250g - 500g) • 450 cm²</option>
              <option value={0.085}>Bulk Consumer Bag (1 kg) • 850 cm²</option>
              <option value={0.160}>Commercial Wholesale Sack (5 kg) • 1,600 cm²</option>
            </select>
          </div>

          {/* Material Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Packaging Structure</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white"
            >
              {PACKAGING_MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (₹{m.relativeCostPerM2INR}/m²)
                </option>
              ))}
            </select>
          </div>

          {/* Thickness Gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Engineered Film Thickness</span>
              <span className="font-mono text-cyan-300 font-bold">{thicknessMicrons} µm</span>
            </div>
            <input
              type="range"
              min={50}
              max={140}
              value={thicknessMicrons}
              onChange={(e) => setThicknessMicrons(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="pt-2 text-[11px] text-slate-400 italic">
            *Includes base polymer resin spot rate, blown film co-extrusion, rotogravure/flexo printing, solventless lamination, and pouch slitting.
          </div>
        </div>

        {/* Right Cost Tiers & Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Expenditure Overview Card */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card-gold border border-amber-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Cost Breakdown ({activeMaterial.shortCode})
                </span>
                <h3 className="text-2xl font-extrabold text-white font-['Outfit'] mt-0.5">
                  ₹{currentUnitCost} <span className="text-sm font-sans text-slate-400">/ pack</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Tier Discount: {Math.round((1 - discount) * 100)}%
              </span>
            </div>

            {/* Batch Cost Multipliers */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Per Pack</span>
                <p className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">₹{currentUnitCost}</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">1,000 Packs</span>
                <p className="text-base sm:text-lg font-bold text-amber-300 font-mono mt-0.5">₹{(currentUnitCost * 1000).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">10,000 Packs</span>
                <p className="text-base sm:text-lg font-bold text-cyan-300 font-mono mt-0.5">₹{(currentUnitCost * 10000).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Three-Way Comparison: Current vs Recyclable vs Foil */}
          <div className="p-6 rounded-3xl glass-card border border-white/15 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Alternative Packaging Economics Comparison
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Selected Structure</span>
                <h4 className="font-bold text-white mt-1">{activeMaterial.shortCode}</h4>
                <p className="text-lg font-bold text-cyan-300 font-mono mt-1">₹{currentUnitCost} <span className="text-[10px] text-slate-400">/ pack</span></p>
                <span className="text-[10px] text-slate-400 block mt-1">Balanced OTR/WVTR</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">100% Recyclable</span>
                <h4 className="font-bold text-white mt-1">Mono-PE Barrier</h4>
                <p className="text-lg font-bold text-emerald-300 font-mono mt-1">₹{monoPeUnitCost} <span className="text-[10px] text-slate-400">/ pack</span></p>
                <span className="text-[10px] text-emerald-300 block mt-1">EPR Compliant</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Ultra High Barrier</span>
                <h4 className="font-bold text-white mt-1">Alu Foil Laminate</h4>
                <p className="text-lg font-bold text-amber-300 font-mono mt-1">₹{aluFoilUnitCost} <span className="text-[10px] text-slate-400">/ pack</span></p>
                <span className="text-[10px] text-slate-400 block mt-1">Zero OTR / Non-Recyclable</span>
              </div>
            </div>
          </div>

          {/* Pricing Dynamics Note */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Market Variance Note:</strong> Actual commercial price varies by raw polymer supplier (Reliance / IOCL / GAIL), regional transportation, ink coverage, cylinder engraving costs, and crude oil indices.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
