import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Sparkles,
  Recycle,
  TreePine,
  ShieldCheck,
  TrendingUp,
  Info,
  ArrowUpRight,
  Globe2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const SustainabilityScore: React.FC = () => {
  const [annualPackCount, setAnnualPackCount] = useState<number>(500000); // 5 Lakh packs
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>('mono-pe');

  // Eco Profiles
  const substrates: Record<string, {
    name: string;
    ecoScore: number;
    carbonFactorKgCo2Per1kPacks: number; // kg CO2e per 1000 packs
    plasticSavedPct: number;
    recyclability: string;
    eprCreditPerPackINR: number;
    standard: string;
    description: string;
  }> = {
    'mono-pe': {
      name: 'Mono-Material PE (MDO-PE / PE)',
      ecoScore: 92,
      carbonFactorKgCo2Per1kPacks: 14.2, // Baseline is 28.5 kg CO2e
      plasticSavedPct: 35,
      recyclability: '100% Recyclable in standard PE stream (RIC 4)',
      eprCreditPerPackINR: 0.18,
      standard: 'PWM Rules 2022 Category II',
      description: 'Fully circular mono-polymer pouch replacing multi-material foil laminates. Eliminates CPCB plastic penalties.',
    },
    'bio-film-pla': {
      name: 'Certified Compostable Bio-Film (PLA / PBAT)',
      ecoScore: 96,
      carbonFactorKgCo2Per1kPacks: 8.8,
      plasticSavedPct: 100, // 100% fossil plastic eliminated
      recyclability: 'Industrial & Soil Compostable (IS/ISO 17088)',
      eprCreditPerPackINR: 0.25,
      standard: 'CPCB Certified Compostable',
      description: 'Cornstarch & plant-derived polymers that naturally degrade into organic compost without microplastic residue.',
    },
    'kraft-paper': {
      name: 'Barrier Kraft Paper (Aqueous Dispersion)',
      ecoScore: 94,
      carbonFactorKgCo2Per1kPacks: 11.5,
      plasticSavedPct: 88,
      recyclability: '>85% Repulpable in Indian paper mills',
      eprCreditPerPackINR: 0.20,
      standard: 'FSC Certified / Repulpable',
      description: 'Renewable wood pulp structure with water-based dispersion coating for oxygen and moisture protection.',
    },
    'downgauged-evoh': {
      name: 'Precision Down-gauged EVOH (9-Layer Co-ex)',
      ecoScore: 78,
      carbonFactorKgCo2Per1kPacks: 19.8,
      plasticSavedPct: 28,
      recyclability: 'Compatibilized recycling with MAH-g-PE',
      eprCreditPerPackINR: 0.08,
      standard: 'PWM Rules Category III',
      description: 'Ultra-thin barrier core minimizing overall resin consumption while providing maximum shelf-life extension.',
    },
  };

  const activeSubstrate = substrates[selectedSubstrate] || substrates['mono-pe'];
  const baselineCo2KgPer1k = 28.5; // Baseline conventional unrecyclable PET/Alu/PE

  // Annual Calculations
  const baselineAnnualCo2Tonnes = (baselineCo2KgPer1k * annualPackCount) / 1000 / 1000;
  const currentAnnualCo2Tonnes = (activeSubstrate.carbonFactorKgCo2Per1kPacks * annualPackCount) / 1000 / 1000;
  const co2SavedTonnes = Math.max(0, +(baselineAnnualCo2Tonnes - currentAnnualCo2Tonnes).toFixed(1));
  const treesEquivalent = Math.round(co2SavedTonnes * 45); // ~45 trees sequester 1 ton CO2/year
  const plasticAvoidedTonnes = +((annualPackCount * 0.007 * (activeSubstrate.plasticSavedPct / 100))).toFixed(1); // ~7g plastic per pack
  const annualEprCreditsINR = Math.round(annualPackCount * activeSubstrate.eprCreditPerPackINR);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Green Packaging Analytics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Environmental Lifecycle Assessment & EPR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Circular Economy & <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Eco-Score Metrics</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Evaluate plastic waste mitigation, EPR certificate savings under India Plastic Waste Management Rules (PWMR 2022), and renewable bio-material transitions.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          <Globe2 className="w-3.5 h-3.5" /> ISO 14040 LCA MODEL
        </div>
      </div>

      {/* Interactive Annual Volume & Substrate Selector */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-emerald-500/30 mb-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Interactive Sustainable Transition Calculator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate brand-level carbon mitigation and CPCB EPR credits based on annual packaging production.
            </p>
          </div>

          {/* Substrate Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(substrates).map(([k, s]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedSubstrate(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSubstrate === k
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {s.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Annual Commercial Packaging Volume</span>
            <span className="font-mono text-emerald-300 font-bold">
              {annualPackCount >= 100000 ? `${(annualPackCount / 100000).toFixed(1)} Lakh Packs` : `${annualPackCount.toLocaleString('en-IN')} Packs`}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={5000000}
            step={50000}
            value={annualPackCount}
            onChange={(e) => setAnnualPackCount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>50,000 (D2C / Startup)</span>
            <span>5 Lakh (Regional Brand)</span>
            <span>50 Lakh (National FMCG)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Lifecycle Impacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Eco Score</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {activeSubstrate.ecoScore} <span className="text-sm text-slate-400 font-sans">/ 100</span>
          </p>
          <p className="text-xs text-slate-300 truncate">
            {activeSubstrate.recyclability.split(' (')[0]}
          </p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Annual CO₂ Saved</span>
            <TreePine className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {co2SavedTonnes} <span className="text-sm text-cyan-400 font-sans">Tonnes</span>
          </p>
          <p className="text-xs text-slate-300">
            Equivalent to planting <strong>{treesEquivalent.toLocaleString('en-IN')}</strong> mature trees
          </p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Landfill Plastic Diverted</span>
            <Recycle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            {plasticAvoidedTonnes} <span className="text-sm text-amber-400 font-sans">Tonnes</span>
          </p>
          <p className="text-xs text-slate-300">
            {activeSubstrate.plasticSavedPct}% fossil plastic eliminated from waste stream
          </p>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">Annual CPCB EPR Value</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">
            ₹{(annualEprCreditsINR / 100000).toFixed(2)} <span className="text-sm text-teal-400 font-sans">Lakhs</span>
          </p>
          <p className="text-xs text-slate-300">
            EPR certificate credits & penalty avoidance
          </p>
        </div>
      </div>

      {/* Sustainable Alternatives Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-['Outfit']">
          Evaluated Sustainable Packaging Alternatives for Indian Supply Chains
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(substrates).map(([key, alt]) => (
            <div
              key={key}
              onClick={() => setSelectedSubstrate(key)}
              className={`p-6 rounded-3xl glass-card border transition-all cursor-pointer ${
                selectedSubstrate === key
                  ? 'border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    {alt.standard}
                  </span>
                  <h4 className="text-base font-bold text-white font-['Outfit'] mt-0.5">{alt.name}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Eco Score: {alt.ecoScore}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{alt.description}</p>

              <div className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-white/5 mt-3">
                <p>
                  <strong className="text-slate-400">Recyclability:</strong> {alt.recyclability}
                </p>
                <p>
                  <strong className="text-slate-400">Carbon Intensity:</strong>{' '}
                  <span className="text-emerald-400 font-semibold">{alt.carbonFactorKgCo2Per1kPacks} kg CO₂e / 1k packs</span>
                </p>
                <p>
                  <strong className="text-slate-400">EPR Incentive:</strong> ₹{alt.eprCreditPerPackINR}/pack credit
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

