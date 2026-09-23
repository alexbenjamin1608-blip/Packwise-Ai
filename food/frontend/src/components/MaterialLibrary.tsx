import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Scale,
  Leaf,
  Info,
  Check,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';
import { PackagingMaterial } from '../types/packaging';

export const MaterialLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'compare'>('library');
  const [selectedMaterial, setSelectedMaterial] = useState<PackagingMaterial>(PACKAGING_MATERIALS[0]);

  // Comparison selection (max 3)
  const [compareIds, setCompareIds] = useState<string[]>([
    'pet-pe-multilayer',
    'mono-pe-recyclable',
    'alu-foil-laminate',
  ]);

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      if (compareIds.length > 1) {
        setCompareIds(compareIds.filter((mId) => mId !== id));
      }
    } else {
      if (compareIds.length < 3) {
        setCompareIds([...compareIds, id]);
      } else {
        setCompareIds([compareIds[1], compareIds[2], id]);
      }
    }
  };

  const comparedMaterials = PACKAGING_MATERIALS.filter((m) => compareIds.includes(m.id));

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Polymer & Barrier Library</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Indian Market Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Indian Packaging <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">Material Database & Matrix</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Comprehensive physical, chemical, barrier, and economic profiles for standard flexible films, laminates, and bio-polymers.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Material Library
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'compare'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Side-by-Side Compare ({compareIds.length}/3)
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        /* LIBRARY VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Materials Grid List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {PACKAGING_MATERIALS.map((mat) => {
              const isSelected = selectedMaterial.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                      {mat.structureType}
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      ₹{mat.relativeCostPerM2INR}/m²
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">{mat.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{mat.shortCode}</p>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>OTR: <strong className="text-cyan-300">{mat.otr}</strong></span>
                    <span>WVTR: <strong className="text-amber-300">{mat.wvtr}</strong></span>
                    <span>Eco Score: <strong className="text-emerald-300">{mat.ecoScore}/100</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Material Detail Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl space-y-5 sticky top-24">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    {selectedMaterial.structureType} Specification
                  </span>
                  <h3 className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">
                    {selectedMaterial.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    BIS Standard Reference: {selectedMaterial.bisStandard}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Reference Cost</span>
                  <p className="text-lg font-bold text-amber-300 font-mono">
                    ₹{selectedMaterial.relativeCostPerM2INR} <span className="text-xs text-slate-400 font-sans">/ m²</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {selectedMaterial.description}
              </p>

              {/* Physical & Barrier Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono text-[10px]">Oxygen (OTR)</span>
                  <p className="font-mono font-bold text-cyan-300 mt-0.5">{selectedMaterial.otr} <span className="text-[10px] text-slate-500">cc</span></p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono text-[10px]">Moisture (WVTR)</span>
                  <p className="font-mono font-bold text-amber-300 mt-0.5">{selectedMaterial.wvtr} <span className="text-[10px] text-slate-500">g</span></p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono text-[10px]">Strength</span>
                  <p className="font-mono font-bold text-white mt-0.5">{selectedMaterial.tensileStrengthMpa} MPa</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-slate-500 font-mono text-[10px]">Eco Score</span>
                  <p className="font-mono font-bold text-emerald-300 mt-0.5">{selectedMaterial.ecoScore}/100</p>
                </div>
              </div>

              {/* Common Indian Applications */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Common Commercial Applications in India
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMaterial.commonApplications.map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recyclability & Sustainability */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" /> Recyclability Code: {selectedMaterial.recyclabilityCode}
                  </span>
                </div>
                <p className="text-slate-300">{selectedMaterial.recyclabilityText}</p>
                <p className="text-emerald-200/90 italic pt-1">{selectedMaterial.sustainabilityNotes}</p>
              </div>

              {/* Compare Button */}
              <button
                onClick={() => {
                  toggleCompare(selectedMaterial.id);
                  setActiveTab('compare');
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center justify-center gap-2"
              >
                Compare this Material Side-by-Side <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* COMPARISON MATRIX VIEW */
        <div className="space-y-6">
          {/* Material Selectors */}
          <div className="p-4 rounded-2xl glass-card border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Select 2 or 3 Materials to Compare:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PACKAGING_MATERIALS.map((m) => {
                const isSelected = compareIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleCompare(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isSelected && '✓ '} {m.shortCode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Comparison Table Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparedMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-6 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl space-y-4 relative"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    {mat.structureType}
                  </span>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] mt-1">{mat.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{mat.shortCode}</p>
                </div>

                {/* Parameters Matrix */}
                <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Oxygen (OTR):</span>
                    <span className="font-mono text-cyan-300 font-bold">{mat.otr} cc/m²·d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Moisture (WVTR):</span>
                    <span className="font-mono text-amber-300 font-bold">{mat.wvtr} g/m²·d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Default Gauge:</span>
                    <span className="font-mono text-white">{mat.defaultThicknessMicrons} µm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tensile Strength:</span>
                    <span className="font-mono text-white">{mat.tensileStrengthMpa} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Heat Sealability:</span>
                    <span className="font-semibold text-emerald-300">{mat.sealability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">MAP Compatibility:</span>
                    <span className="font-semibold text-sky-300">{mat.mapSuitability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Eco Score:</span>
                    <span className="font-mono text-emerald-400 font-bold">{mat.ecoScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost Index:</span>
                    <span className="font-mono text-amber-300 font-bold">₹{mat.relativeCostPerM2INR} / m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recyclability:</span>
                    <span className="font-mono text-slate-300">{mat.recyclabilityCode}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <strong className="text-white">BIS Standard:</strong> {mat.bisStandard}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            <strong>Comparative Analysis Rule:</strong> No single material is universally best across all criteria. Aluminium laminate offers absolute barrier but low recyclability; Mono-PE achieves circularity with moderate OTR; Micro-perforated film is essential for high-respiration fruits.
          </div>
        </div>
      )}
    </section>
  );
};
