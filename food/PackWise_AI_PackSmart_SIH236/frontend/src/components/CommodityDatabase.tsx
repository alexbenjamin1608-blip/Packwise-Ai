import React, { useState } from 'react';
import { Search, Sparkles, Filter, Info, ShieldCheck, Thermometer, Box } from 'lucide-react';
import { INDIAN_COMMODITIES } from '../data/indianCommodities';
import { FoodCommodity, FoodCategory } from '../types/packaging';

interface CommodityDatabaseProps {
  onSelectCommodity?: (commodity: FoodCommodity) => void;
}

export const CommodityDatabase: React.FC<CommodityDatabaseProps> = ({
  onSelectCommodity,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<FoodCommodity>(INDIAN_COMMODITIES[0]);

  const categories: (FoodCategory | 'All')[] = [
    'All',
    'Fresh Fruits',
    'Vegetables',
    'Grains',
    'Pulses',
    'Spices',
    'Dairy',
    'Processed',
    'Chilled/Frozen',
  ];

  const filtered = INDIAN_COMMODITIES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hindiName.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'All' || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Indigenous Food Database</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Indian Agro-Commodity Profiles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            India Food <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">Packaging Repository</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Biochemical properties, respiration sensitivity, and packaging specifications for Indian agricultural produce, dairy, spices, and processed foods.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, spice, dairy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs glass-input text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCat === cat
                ? 'bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  if (onSelectCommodity) onSelectCommodity(item);
                }}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    Max: {item.maxShelfLifePackagedDays}d
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.hindiName}</p>
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Respiration: <strong className="text-slate-200">{item.respirationRate}</strong></span>
                  <span>Ideal Temp: <strong className="text-cyan-300">{item.idealTempC}°C</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl space-y-5 sticky top-24">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {selectedItem.category} Profile
                </span>
                <h3 className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-amber-300/90 font-sans">{selectedItem.hindiName}</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-right">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Shelf Life Potential</span>
                <p className="text-lg font-bold text-emerald-400 font-mono">
                  {selectedItem.defaultShelfLifeUnpackagedDays}d → {selectedItem.maxShelfLifePackagedDays}d
                </p>
              </div>
            </div>

            {/* Biochemical Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 font-mono text-[10px]">Moisture</span>
                <p className="font-bold text-cyan-300 mt-0.5">{selectedItem.moistureContent}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 font-mono text-[10px]">Water Activity (a_w)</span>
                <p className="font-mono font-bold text-amber-300 mt-0.5">{selectedItem.waterActivity.toFixed(2)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 font-mono text-[10px]">Fat / Oil</span>
                <p className="font-mono font-bold text-white mt-0.5">{selectedItem.fatOilContent}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-500 font-mono text-[10px]">Respiration</span>
                <p className="font-medium text-emerald-300 mt-0.5">{selectedItem.respirationRate}</p>
              </div>
            </div>

            {/* Packaging Advisory */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" /> Recommended Packaging Solution
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {selectedItem.packagingNotes}
              </p>
            </div>

            {/* MAP Gas Balance recommendation */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 uppercase tracking-wider">
                  MAP Suitability: {selectedItem.mapRecommendation.suitable ? 'Recommended' : 'Not Typically Required'}
                </span>
                {selectedItem.mapRecommendation.suitable && (
                  <span className="font-mono text-cyan-400 text-[11px]">
                    {selectedItem.mapRecommendation.o2Percent}% O₂ / {selectedItem.mapRecommendation.co2Percent}% CO₂ / {selectedItem.mapRecommendation.n2Percent}% N₂
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedItem.mapRecommendation.notes}
              </p>
            </div>

            {/* FSSAI & Compliance Notes */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>FSSAI Indian Regulatory Standard:</strong> {selectedItem.fssaiNotes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
