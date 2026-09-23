import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  Info,
  TrendingDown,
  Layers,
  ArrowRight,
  AlertTriangle,
  IndianRupee,
  Package,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

interface PouchPreset {
  id: string;
  name: string;
  weightCapacity: string;
  areaM2: number;
  areaCm2: number;
  format: string;
}

const POUCH_PRESETS: PouchPreset[] = [
  { id: 'pouch-100g', name: '100g Sachet / 3-Side Seal', weightCapacity: '100g', areaM2: 0.024, areaCm2: 240, format: '3-Side Seal' },
  { id: 'pouch-250g', name: '250g Standup Zipper Doypack', weightCapacity: '250g', areaM2: 0.042, areaCm2: 420, format: 'Standup Zipper' },
  { id: 'pouch-500g', name: '500g Standup Pouch', weightCapacity: '500g', areaM2: 0.062, areaCm2: 620, format: 'Standup Zipper' },
  { id: 'pouch-1kg', name: '1 kg Center Seal Pillow / Gusset', weightCapacity: '1 kg', areaM2: 0.095, areaCm2: 950, format: 'Center Seal / Gusset' },
  { id: 'pouch-5kg', name: '5 kg Commercial Bulk Bag', weightCapacity: '5 kg', areaM2: 0.185, areaCm2: 1850, format: 'Heavy Duty Quad Seal' },
];

export const CostOptimizer: React.FC = () => {
  const [productionQty, setProductionQty] = useState<number>(25000);
  const [selectedPouchId, setSelectedPouchId] = useState<string>('pouch-250g');
  const [thicknessMicrons, setThicknessMicrons] = useState<number>(75);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('pet-pe-multilayer');
  const [printingType, setPrintingType] = useState<'8-color-roto' | 'flexo' | 'unprinted'>('8-color-roto');

  const activePouch = POUCH_PRESETS.find((p) => p.id === selectedPouchId) || POUCH_PRESETS[1];
  const activeMaterial = PACKAGING_MATERIALS.find((m) => m.id === selectedMaterialId) || PACKAGING_MATERIALS[0];
  const monoPeMaterial = PACKAGING_MATERIALS.find((m) => m.id === 'mono-pe-recyclable') || PACKAGING_MATERIALS[4];
  const aluFoilMaterial = PACKAGING_MATERIALS.find((m) => m.id === 'alu-foil-laminate') || PACKAGING_MATERIALS[2];

  // Volume discount curve based on Indian converting & masterbatch economics
  const discountFactor = useMemo(() => {
    if (productionQty >= 200000) return 0.74; // 26% discount on bulk resin & cylinder amortisation
    if (productionQty >= 50000) return 0.82;  // 18% discount
    if (productionQty >= 25000) return 0.88;  // 12% discount
    if (productionQty >= 10000) return 0.94;  // 6% discount
    return 1.0;                               // Short-run setup overhead
  }, [productionQty]);

  // Converting and printing cost per pack
  const printingCostPerPack = useMemo(() => {
    if (printingType === 'unprinted') return 0.05;
    if (printingType === 'flexo') return 0.22 * discountFactor;
    return 0.38 * discountFactor; // 8-color rotogravure
  }, [printingType, discountFactor]);

  // CPCB EPR Cess under India Plastic Waste Management Rules 2022:
  // Mono-materials have zero or negative EPR cess (rebates); multilayer composites pay ₹0.08 - ₹0.15/pack
  const eprCessPerPack = useMemo(() => {
    if (activeMaterial.id === 'mono-pe-recyclable' || activeMaterial.id === 'kraft-paper-barrier') {
      return 0.0; // EPR exempt / zero penalty
    }
    if (activeMaterial.id === 'bio-film-pla') {
      return -0.05; // Green subsidy credit
    }
    return 0.12; // Multi-layered plastic penalty
  }, [activeMaterial]);

  // Unit cost calculation
  const calculateDetailedCost = (matRatePerM2: number, defThickness: number, chosenThickness: number) => {
    const thicknessRatio = chosenThickness / defThickness;
    const rawResinCost = matRatePerM2 * activePouch.areaM2 * thicknessRatio * discountFactor;
    const laminationAndSlitting = 0.28 * discountFactor;
    const pouchMakingAndZipper = activePouch.format.includes('Zipper') ? 0.35 * discountFactor : 0.18 * discountFactor;
    const totalUnitINR = +(rawResinCost + printingCostPerPack + laminationAndSlitting + pouchMakingAndZipper + eprCessPerPack).toFixed(2);

    return {
      totalUnitINR,
      rawResinCost: +rawResinCost.toFixed(2),
      printingCost: +printingCostPerPack.toFixed(2),
      convertingCost: +(laminationAndSlitting + pouchMakingAndZipper).toFixed(2),
      eprCess: +eprCessPerPack.toFixed(2),
    };
  };

  const currentCost = calculateDetailedCost(activeMaterial.relativeCostPerM2INR, activeMaterial.defaultThicknessMicrons, thicknessMicrons);
  const monoPeCost = calculateDetailedCost(monoPeMaterial.relativeCostPerM2INR, monoPeMaterial.defaultThicknessMicrons, 80);
  const aluFoilCost = calculateDetailedCost(aluFoilMaterial.relativeCostPerM2INR, aluFoilMaterial.defaultThicknessMicrons, 105);

  const totalBatchExpenditureINR = currentCost.totalUnitINR * productionQty;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Commercial Economics & Procurement</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Indian Substrate & Converting Market</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Indian Packaging <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">Cost & Batch Optimizer</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Model accurate unit pouch cost (₹/pack) and batch procurement across Indian polymer substrates, cylinder printing, and CPCB EPR cess rules.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <Info className="w-3.5 h-3.5" /> DOMESTIC INDIAN RATES (₹ INR)
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Configuration (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl glass-card border border-white/15 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Packaging Specification & Tiers
          </h3>

          {/* Production Volume Tiers */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Batch Quantity</span>
              <span className="font-mono text-cyan-300 font-bold">{productionQty.toLocaleString('en-IN')} Packs</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1000, 10000, 25000, 100000].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setProductionQty(qty)}
                  className={`py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                    productionQty === qty
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {qty >= 100000 ? '1 Lakh' : qty >= 1000 ? `${qty / 1000}k` : qty}
                </button>
              ))}
            </div>
          </div>

          {/* Indian Pouch Standard Presets */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Pouch Format & Grammage</span>
              <span className="font-mono text-amber-300 font-bold">{activePouch.areaCm2} cm²</span>
            </div>
            <select
              value={selectedPouchId}
              onChange={(e) => setSelectedPouchId(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
            >
              {POUCH_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.areaCm2} cm²)
                </option>
              ))}
            </select>
          </div>

          {/* Material Substrate Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Indian Polymer Substrate</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => {
                setSelectedMaterialId(e.target.value);
                const mat = PACKAGING_MATERIALS.find((m) => m.id === e.target.value);
                if (mat) setThicknessMicrons(mat.defaultThicknessMicrons);
              }}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
            >
              {PACKAGING_MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Base: ₹{m.relativeCostPerM2INR}/m²)
                </option>
              ))}
            </select>
          </div>

          {/* Film Thickness Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Engineered Gauge Thickness</span>
              <span className="font-mono text-cyan-300 font-bold">{thicknessMicrons} µm (microns)</span>
            </div>
            <input
              type="range"
              min={40}
              max={150}
              step={5}
              value={thicknessMicrons}
              onChange={(e) => setThicknessMicrons(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Light (40µm)</span>
              <span>Default: {activeMaterial.defaultThicknessMicrons}µm</span>
              <span>Heavy (150µm)</span>
            </div>
          </div>

          {/* Printing Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Printing & Graphics Process</label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {[
                { id: '8-color-roto', label: '8-Color Roto' },
                { id: 'flexo', label: 'HD Flexo' },
                { id: 'unprinted', label: 'Plain / Unprinted' },
              ].map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setPrintingType(pt.id as any)}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    printingType === pt.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Cost Tiers & Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Expenditure Overview Card */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card-gold border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  NET UNIT ESTIMATE ({activeMaterial.shortCode})
                </span>
                <h3 className="text-3xl font-extrabold text-white font-['Outfit'] mt-0.5">
                  ₹{currentCost.totalUnitINR}{' '}
                  <span className="text-sm font-sans text-slate-300 font-normal">/ unit pouch</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Bulk Tier: {Math.round((1 - discountFactor) * 100)}% Discount
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Batch: ₹{(totalBatchExpenditureINR / 100000).toFixed(2)} Lakhs
                </p>
              </div>
            </div>

            {/* Granular Cost Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Polymer Resin</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5">₹{currentCost.rawResinCost}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Printing</span>
                <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">₹{currentCost.printingCost}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Lamination & Zipper</span>
                <p className="text-sm font-bold text-cyan-300 font-mono mt-0.5">₹{currentCost.convertingCost}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[9px] text-slate-400 uppercase font-mono">CPCB EPR Cess</span>
                <p className={`text-sm font-bold font-mono mt-0.5 ${currentCost.eprCess <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentCost.eprCess <= 0 ? '₹0.00 (Exempt)' : `₹${currentCost.eprCess}`}
                </p>
              </div>
            </div>
          </div>

          {/* Three-Way Comparison: Current vs Recyclable vs Foil */}
          <div className="p-6 rounded-3xl glass-card border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Comparative Indian Substrate Economics
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Per {activePouch.weightCapacity} Pouch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Current Selection</span>
                <h4 className="font-bold text-white mt-1">{activeMaterial.shortCode}</h4>
                <p className="text-lg font-bold text-cyan-300 font-mono mt-1">₹{currentCost.totalUnitINR}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Standard Market Baseline</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">100% Recyclable</span>
                <h4 className="font-bold text-white mt-1">Mono-PE Barrier</h4>
                <p className="text-lg font-bold text-emerald-300 font-mono mt-1">₹{monoPeCost.totalUnitINR}</p>
                <span className="text-[10px] text-emerald-300 block mt-1">Zero EPR Penalty Cess</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Ultra High Barrier</span>
                <h4 className="font-bold text-white mt-1">Alu Foil 3-Ply</h4>
                <p className="text-lg font-bold text-amber-300 font-mono mt-1">₹{aluFoilCost.totalUnitINR}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Zero OTR / Non-Recyclable</span>
              </div>
            </div>
          </div>

          {/* Pricing Dynamics Note */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Market Benchmarks:</strong> Polyethylene and PET film price indices fluctuate based on ICIS Indian polymer spot rates (RIL / IOCL polymers) and CPCB Plastic Waste Management guidelines.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

