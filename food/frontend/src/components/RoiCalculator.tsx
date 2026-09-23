import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Scale,
  Sparkles,
  DollarSign,
  PackageCheck,
  Wheat,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Truck,
  IndianRupee,
  Percent,
} from 'lucide-react';

interface MandiData {
  id: string;
  name: string;
  state: string;
  specialty: string;
}

const APMC_MANDIS: MandiData[] = [
  { id: 'azadpur', name: 'Azadpur APMC (Delhi)', state: 'Delhi NCR', specialty: 'National Produce Gateway (Asia\'s Largest)' },
  { id: 'vashi', name: 'APMC Market Vashi (Navi Mumbai)', state: 'Maharashtra', specialty: 'Western India Fruits, Veg & Spices' },
  { id: 'lasalgaon', name: 'Lasalgaon APMC (Nashik)', state: 'Maharashtra', specialty: 'Asia\'s Largest Onion & Grape Mandi' },
  { id: 'guntur', name: 'Guntur Mirchi Yard', state: 'Andhra Pradesh', specialty: 'Asia\'s Largest Red Chilli & Spice Market' },
  { id: 'kolar', name: 'Kolar APMC Mandi', state: 'Karnataka', specialty: 'South India Tomato & Mango Hub' },
  { id: 'unjha', name: 'Unjha APMC Mandi', state: 'Gujarat', specialty: 'Global Cumin (Jeera), Fennel & Isabgol Hub' },
  { id: 'sirsa', name: 'Sirsa Grain Mandi', state: 'Haryana', specialty: 'North India Wheat, Basmati Rice & Mustard' },
  { id: 'gadag', name: 'APMC Gadag', state: 'Karnataka', specialty: 'Chilli, Onion & Cotton Hub' },
];

interface CommodityMandiProfile {
  name: string;
  hindiName: string;
  defaultPricePerKg: number;
  traditionalLossPercent: number;
  packwiseLossPercent: number;
  packCostPerKg: number;
  category: string;
}

const COMMODITY_PROFILES: Record<string, CommodityMandiProfile> = {
  'Alphonso Mango': {
    name: 'Alphonso Mango (Ratnagiri/Devgad)',
    hindiName: 'हापुस आम',
    defaultPricePerKg: 160,
    traditionalLossPercent: 28,
    packwiseLossPercent: 4.5,
    packCostPerKg: 3.5,
    category: 'Fresh Fruit',
  },
  'Kashmiri Apple': {
    name: 'Kashmiri Delicious Apple',
    hindiName: 'कश्मीरी सेब',
    defaultPricePerKg: 95,
    traditionalLossPercent: 22,
    packwiseLossPercent: 3.8,
    packCostPerKg: 2.8,
    category: 'Fresh Fruit',
  },
  'Hybrid Tomato': {
    name: 'Hybrid Salad Tomato',
    hindiName: 'टमाटर',
    defaultPricePerKg: 32,
    traditionalLossPercent: 34,
    packwiseLossPercent: 6.0,
    packCostPerKg: 1.2,
    category: 'Vegetables',
  },
  'Nashik Red Onion': {
    name: 'Nashik Red Onion (Poli/Gavran)',
    hindiName: 'प्याज',
    defaultPricePerKg: 24,
    traditionalLossPercent: 26,
    packwiseLossPercent: 5.0,
    packCostPerKg: 0.8,
    category: 'Vegetables',
  },
  'Guntur Red Chilli': {
    name: 'Guntur Sannam Red Chilli',
    hindiName: 'लाल मिर्च',
    defaultPricePerKg: 210,
    traditionalLossPercent: 16,
    packwiseLossPercent: 2.0,
    packCostPerKg: 2.4,
    category: 'Spices',
  },
  'Basmati Rice': {
    name: '1121 Pusa Basmati Rice',
    hindiName: 'बासमती चावल',
    defaultPricePerKg: 85,
    traditionalLossPercent: 12,
    packwiseLossPercent: 1.2,
    packCostPerKg: 1.5,
    category: 'Grains',
  },
  'Malai Paneer': {
    name: 'Fresh Malai Paneer',
    hindiName: 'मलाई पनीर',
    defaultPricePerKg: 340,
    traditionalLossPercent: 18,
    packwiseLossPercent: 2.5,
    packCostPerKg: 4.8,
    category: 'Dairy',
  },
  'Pomfret Fish': {
    name: 'Silver Pomfret (Chilled Marine)',
    hindiName: 'पापलेट मछली',
    defaultPricePerKg: 520,
    traditionalLossPercent: 25,
    packwiseLossPercent: 3.0,
    packCostPerKg: 6.5,
    category: 'Seafood',
  },
  'Broiler Chicken': {
    name: 'Fresh Chilled Dressed Chicken',
    hindiName: 'चिकन',
    defaultPricePerKg: 190,
    traditionalLossPercent: 20,
    packwiseLossPercent: 2.8,
    packCostPerKg: 4.0,
    category: 'Poultry',
  },
};

export const RoiCalculator: React.FC = () => {
  const [selectedMandi, setSelectedMandi] = useState<string>('azadpur');
  const [selectedCrop, setSelectedCrop] = useState<string>('Alphonso Mango');
  const [weightUnit, setWeightUnit] = useState<'tonnes' | 'quintals'>('tonnes');
  const [weightValue, setWeightValue] = useState<number>(10); // 10 tonnes or 100 quintals
  const [mandiPricePerKg, setMandiPricePerKg] = useState<number>(160);
  const [packCostPerKg, setPackCostPerKg] = useState<number>(3.5);

  const profile = COMMODITY_PROFILES[selectedCrop] || COMMODITY_PROFILES['Alphonso Mango'];
  const mandiObj = APMC_MANDIS.find((m) => m.id === selectedMandi) || APMC_MANDIS[0];

  const totalKg = useMemo(() => {
    return weightUnit === 'tonnes' ? weightValue * 1000 : weightValue * 100;
  }, [weightUnit, weightValue]);

  const grossConsignmentValueINR = totalKg * mandiPricePerKg;

  // Spoilage calculations
  const traditionalLossKg = totalKg * (profile.traditionalLossPercent / 100);
  const packwiseLossKg = totalKg * (profile.packwiseLossPercent / 100);
  const foodSavedKg = traditionalLossKg - packwiseLossKg;
  const foodSavedTonnes = (foodSavedKg / 1000).toFixed(2);
  const foodSavedQuintals = (foodSavedKg / 100).toFixed(1);

  // Financial calculations
  const revenuePreservedINR = foodSavedKg * mandiPricePerKg;
  const packagingInvestmentINR = totalKg * packCostPerKg;
  const netProfitGainINR = Math.max(0, revenuePreservedINR - packagingInvestmentINR);
  const roiMultiple = packagingInvestmentINR > 0 ? (revenuePreservedINR / packagingInvestmentINR).toFixed(1) : '0';

  const handleCropChange = (cropKey: string) => {
    setSelectedCrop(cropKey);
    const p = COMMODITY_PROFILES[cropKey];
    if (p) {
      setMandiPricePerKg(p.defaultPricePerKg);
      setPackCostPerKg(p.packCostPerKg);
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>APMC Mandi & Supply Chain Economics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Post-Harvest Loss Prevention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Indian Mandi Spoilage & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Packaging ROI Calculator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Calculate the exact return on investment by eliminating post-harvest transit spoilage across APMC mandis, cold-chains, and wholesale shipments in India.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="w-3.5 h-3.5" /> APMC BENCHMARKED MODEL
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-card border border-white/15 p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Mandi & Consignment Parameters
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              India APMC
            </span>
          </div>

          {/* Mandi Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Destination Mandi / Market Yard
            </label>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
            >
              {APMC_MANDIS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.state}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 italic">{mandiObj.specialty}</p>
          </div>

          {/* Commodity Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-emerald-400" /> Food Commodity
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
            >
              {Object.keys(COMMODITY_PROFILES).map((k) => (
                <option key={k} value={k}>
                  {COMMODITY_PROFILES[k].name} ({COMMODITY_PROFILES[k].hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Consignment Weight Unit & Value */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Shipment Volume</span>
              <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    setWeightUnit('tonnes');
                    setWeightValue(10);
                  }}
                  className={`px-2 py-0.5 rounded ${
                    weightUnit === 'tonnes' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Tonnes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWeightUnit('quintals');
                    setWeightValue(100);
                  }}
                  className={`px-2 py-0.5 rounded ${
                    weightUnit === 'quintals' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Quintals
                </button>
              </div>
            </div>

            <div className="flex justify-between text-xs font-mono font-bold text-cyan-300">
              <span>{weightValue} {weightUnit.toUpperCase()}</span>
              <span className="text-slate-400">({totalKg.toLocaleString('en-IN')} kg)</span>
            </div>

            <input
              type="range"
              min={weightUnit === 'tonnes' ? 1 : 10}
              max={weightUnit === 'tonnes' ? 50 : 500}
              step={weightUnit === 'tonnes' ? 1 : 10}
              value={weightValue}
              onChange={(e) => setWeightValue(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Mandi Wholesale Price ₹/kg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Wholesale Realization (Mandi Rate)</span>
              <span className="font-mono text-amber-300 font-bold">
                ₹{mandiPricePerKg}/kg (₹{mandiPricePerKg * 100}/quintal)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={700}
              step={5}
              value={mandiPricePerKg}
              onChange={(e) => setMandiPricePerKg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Packaging Cost per kg */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Packaging Upgrade Cost</span>
              <span className="font-mono text-emerald-300 font-bold">₹{packCostPerKg.toFixed(1)}/kg</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={12}
              step={0.2}
              value={packCostPerKg}
              onChange={(e) => setPackCostPerKg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Consignment Value:</span>
              <span className="font-mono text-white font-bold">₹{(grossConsignmentValueINR / 100000).toFixed(2)} Lakhs</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Traditional Indian Mandi Loss:</span>
              <span className="font-mono text-rose-400 font-bold">{profile.traditionalLossPercent}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PackWise Protected Loss:</span>
              <span className="font-mono text-emerald-400 font-bold">{profile.packwiseLossPercent}%</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
              <span>Net Spoilage Reduced:</span>
              <span className="font-mono text-cyan-300 font-bold">
                {(profile.traditionalLossPercent - profile.packwiseLossPercent).toFixed(1)}% Absolute
              </span>
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
                <span className="text-xs text-slate-400 block mt-0.5">
                  Across {weightValue} {weightUnit} at {mandiObj.name}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">INVESTMENT ROI</span>
                <p className="text-3xl font-black text-emerald-300 font-mono mt-0.5">{roiMultiple}x</p>
                <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Rupees return/₹1</span>
              </div>
            </div>

            {/* Visual Loss Comparison Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400">Traditional Transit Loss: {traditionalLossKg.toLocaleString('en-IN')} kg ({profile.traditionalLossPercent}%)</span>
                <span className="text-emerald-400">PackWise Loss: {packwiseLossKg.toLocaleString('en-IN')} kg ({profile.packwiseLossPercent}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${profile.traditionalLossPercent}%` }}
                  title="Traditional Spoilage"
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${profile.packwiseLossPercent}%` }}
                  title="PackWise Spoilage"
                />
              </div>
            </div>

            {/* Breakdown Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Produce Saved</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">
                  {foodSavedTonnes} <span className="text-xs font-sans text-slate-400">Tonnes</span>
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ({foodSavedQuintals} Quintals / {foodSavedKg.toLocaleString('en-IN')} kg)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Packaging Investment</span>
                <p className="text-lg font-bold text-amber-300 font-mono mt-0.5">
                  ₹{(packagingInvestmentINR / 100000).toFixed(2)} <span className="text-xs font-sans text-slate-400">Lakh</span>
                </p>
                <span className="text-[10px] text-slate-500 font-mono">@ ₹{packCostPerKg.toFixed(1)}/kg</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Gross Spoilage Prevented</span>
                <p className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                  ₹{(revenuePreservedINR / 100000).toFixed(2)} <span className="text-xs font-sans text-slate-400">Lakh</span>
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Wholesale Mandi Value</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                By upgrading packaging, the consignment recovers <strong>₹{(netProfitGainINR / 100000).toFixed(2)} Lakhs</strong> in net profit, yielding a <strong>{roiMultiple}x return</strong> on packaging spend.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

