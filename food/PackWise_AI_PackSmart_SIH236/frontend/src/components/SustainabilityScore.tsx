import React from 'react';
import {
  Leaf,
  Sparkles,
  Recycle,
  TreePine,
  ShieldCheck,
  TrendingUp,
  Info,
  ArrowUpRight,
} from 'lucide-react';

export const SustainabilityScore: React.FC = () => {
  const greenAlternatives = [
    {
      name: 'Mono-Material Barrier PE (MDO-PE / PE)',
      ecoScore: 92,
      carbonReduction: '-38% CO₂e',
      recyclability: '100% Recyclable in standard LDPE stream',
      eprAdvantage: 'Eliminates multi-layered plastic EPR penalty fees in India',
      status: 'Ready for Commercial Scale',
    },
    {
      name: 'Compostable PLA / PBAT Bio-Film',
      ecoScore: 95,
      carbonReduction: '-62% CO₂e',
      recyclability: 'Industrial Compostable (IS/ISO 17088)',
      eprAdvantage: 'Exempt from fossil-fuel plastic bans for organic produce',
      status: 'Niche / Organic Retail',
    },
    {
      name: 'Kraft Paper with Aqueous Dispersion Barrier',
      ecoScore: 94,
      carbonReduction: '-54% CO₂e',
      recyclability: '>85% Repulpable in Indian paper mills',
      eprAdvantage: 'Renewable bio-fiber, zero microplastic shedding',
      status: 'Dry Produce & Bakery',
    },
    {
      name: 'Downgauged High-Barrier Multilayer (9-Layer Co-ex)',
      ecoScore: 76,
      carbonReduction: '-25% Plastic Weight',
      recyclability: 'Delamination / Compatibilized Recycling',
      eprAdvantage: 'Sub-3µm EVOH core minimizes polymer consumption',
      status: 'Long-life MAP & Meat',
    },
  ];

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Green Packaging Analytics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Environmental Lifecycle Assessment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Circular Economy & <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Eco-Score Metrics</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Evaluate plastic waste mitigation, EPR compliance under Plastic Waste Management Rules 2022, and renewable bio-material transitions.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          <Info className="w-3.5 h-3.5" /> MODEL GENERATED VALUES
        </div>
      </div>

      {/* Hero Eco Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Average Eco Score</span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono">
            88 <span className="text-base text-slate-400 font-sans">/ 100</span>
          </p>
          <p className="text-xs text-slate-300">
            High recyclability index through mono-material transition
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Carbon Footprint Saved</span>
            <TreePine className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono">
            -42% <span className="text-base text-cyan-400 font-sans">CO₂e</span>
          </p>
          <p className="text-xs text-slate-300">
            Compared to traditional unrecyclable foil/PET laminates
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Polymer Reduction</span>
            <Recycle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono">
            320 kg <span className="text-base text-slate-400 font-sans">/ 100k packs</span>
          </p>
          <p className="text-xs text-slate-300">
            Achieved via precision micro-layer down-gauging
          </p>
        </div>
      </div>

      {/* Sustainable Alternatives Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-['Outfit']">
          Evaluated Sustainable Packaging Alternatives for Indian Supply Chains
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {greenAlternatives.map((alt) => (
            <div
              key={alt.name}
              className="p-6 rounded-3xl glass-card border border-white/15 space-y-3 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    {alt.status}
                  </span>
                  <h4 className="text-base font-bold text-white font-['Outfit'] mt-0.5">{alt.name}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Eco Score: {alt.ecoScore}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <p>
                  <strong className="text-slate-400">Carbon Advantage:</strong>{' '}
                  <span className="text-emerald-400 font-semibold">{alt.carbonReduction}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Recyclability:</strong> {alt.recyclability}
                </p>
                <p>
                  <strong className="text-slate-400">EPR & Regulatory:</strong> {alt.eprAdvantage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
