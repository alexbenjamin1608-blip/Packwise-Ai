import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Thermometer,
  Box,
  Layers,
  Wind,
  Search,
  Activity,
  ShieldAlert,
  Clock,
  Gauge,
} from 'lucide-react';
import { COMMODITIES_100 } from '../data/commodities100';
import { INDIAN_COMMODITIES } from '../data/indianCommodities';

export const MapSimulator: React.FC = () => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('prod-015'); // Alphonso / Kent Mango
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Unified list of commodities
  const commodityList = useMemo(() => {
    return COMMODITIES_100.map((c) => {
      const indianMatch = INDIAN_COMMODITIES.find(
        (ic) => ic.name.toLowerCase().includes(c.name.toLowerCase().split(' ')[1] || c.name.toLowerCase())
      );
      return {
        id: c.commodity_id,
        name: c.name,
        category: c.category,
        optimumTemp: c.optimum_temp_c,
        criticalO2: c.critical_oxygen_limit_pct ?? 2.0,
        isRespiring: c.is_respiring,
        defaultShelfLife: c.default_shelf_life_days,
        moisture: c.moisture_content_pct,
        aw: c.water_activity_aw,
        ph: c.ph_value,
        hindiName: indianMatch?.hindiName || '',
      };
    });
  }, []);

  const activeFood = useMemo(() => {
    return commodityList.find((c) => c.id === selectedFoodId) || commodityList[0];
  }, [commodityList, selectedFoodId]);

  // Atmosphere States
  const [o2Percent, setO2Percent] = useState<number>(3.5);
  const [co2Percent, setCo2Percent] = useState<number>(6.0);
  const [tempC, setTempC] = useState<number>(12);
  const [pkgVolumeMl, setPkgVolumeMl] = useState<number>(1200);

  // Auto-tune when food changes
  const handleSelectFood = (foodId: string) => {
    setSelectedFoodId(foodId);
    const food = commodityList.find((c) => c.id === foodId);
    if (food) {
      setTempC(food.optimumTemp);
      if (food.isRespiring) {
        setO2Percent(Math.max(2.5, food.criticalO2 + 1.0));
        setCo2Percent(food.category === 'Fresh Produce' ? 6.0 : 15.0);
      } else {
        // Non-respiring (dairy, meat, bakery) benefits from high CO2 / zero O2
        setO2Percent(0.2);
        setCo2Percent(30.0);
      }
    }
  };

  // Remaining inert gas is Nitrogen
  const n2Percent = Math.max(0, +(100 - o2Percent - co2Percent).toFixed(1));

  // Physiological checks
  const isAnaerobicRisk = activeFood.isRespiring && o2Percent < activeFood.criticalO2;
  const isCo2InjuryRisk = activeFood.isRespiring && co2Percent > 12.0;
  const isTempHigh = tempC > activeFood.optimumTemp + 8;
  const isChillingInjuryRisk = activeFood.optimumTemp >= 8 && tempC < 5;

  // Kinetic shelf life calculation:
  // Base shelf life scaled by Q10 temperature coefficient and O2/CO2 suppression factors
  const shelfLifeEstimate = useMemo(() => {
    const q10 = 2.2;
    const tempFactor = Math.pow(q10, (activeFood.optimumTemp - tempC) / 10);
    let gasFactor = 1.0;

    if (activeFood.isRespiring) {
      if (isAnaerobicRisk) {
        gasFactor = 0.35; // Rapid alcoholic fermentation breakdown
      } else if (isCo2InjuryRisk) {
        gasFactor = 0.55; // Physiological tissue browning
      } else {
        // Optimal MAP deceleration
        const o2Suppression = Math.max(0.7, 1 + (21 - o2Percent) * 0.05);
        const co2Suppression = Math.max(0.8, 1 + co2Percent * 0.04);
        gasFactor = Math.min(3.2, o2Suppression * co2Suppression * 0.65);
      }
    } else {
      // For Dairy / Bakery / Meat: Low O2 stops mold & oxidation, high CO2 inhibits microbes
      const o2Benefit = o2Percent < 1.0 ? 2.2 : o2Percent < 5.0 ? 1.5 : 1.0;
      const co2Benefit = 1 + co2Percent * 0.03;
      gasFactor = Math.min(3.5, o2Benefit * co2Benefit * 0.7);
    }

    const calculatedDays = Math.round(activeFood.defaultShelfLife * tempFactor * gasFactor);
    return Math.max(1, calculatedDays);
  }, [activeFood, tempC, o2Percent, co2Percent, isAnaerobicRisk, isCo2InjuryRisk]);

  // Respiration rate index (mg CO2 / kg / hr)
  const estimatedRespirationRate = useMemo(() => {
    if (!activeFood.isRespiring) return 0;
    const baseR = activeFood.category === 'Fresh Produce' ? 24 : 10;
    const tempMultiplier = Math.pow(2.2, (tempC - 10) / 10);
    const o2Multiplier = Math.sqrt(Math.max(0.1, o2Percent / 21));
    return +(baseR * tempMultiplier * o2Multiplier).toFixed(1);
  }, [activeFood, tempC, o2Percent]);

  const categories = ['All', 'Fresh Produce', 'Dairy', 'Bakery', 'Dry Goods', 'Meat & Poultry', 'Seafood'];

  const filteredFoods = useMemo(() => {
    return commodityList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hindiName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [commodityList, searchQuery, selectedCategory]);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Modified Atmosphere Packaging Simulator</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">All 100 Food Commodities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            MAP Chamber & <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Gas Atmosphere Simulator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Simulate equilibrium modified atmospheres (O₂, CO₂, N₂) across 100 food products. Real-time respiration kinetics, microbial suppression, and shelf-life prediction.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm">
          <Activity className="w-3.5 h-3.5" /> SCIENTIFIC KINETICS ENGINE
        </div>
      </div>

      {/* Main Simulator Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive MAP Chamber (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          {/* Chamber Visual Screen */}
          <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 flex flex-col justify-between p-4">
            {/* Top Atmospheric Telemetry Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-cyan-300 font-bold">{activeFood.name}</span>
                {activeFood.hindiName && (
                  <span className="text-amber-300 text-[11px]">({activeFood.hindiName})</span>
                )}
              </div>

              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
                {activeFood.isRespiring ? 'Respiring Tissue' : 'Non-Respiring Matrix'}
              </div>
            </div>

            {/* Simulated Floating Gas Molecules Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 22 }).map((_, i) => {
                const isO2 = i % 4 === 0;
                const isCO2 = i % 4 === 1;
                return (
                  <div
                    key={i}
                    className={`absolute rounded-full animate-bounce font-mono text-[9px] font-bold px-1.5 py-0.5 border shadow-lg transition-all duration-500 ${
                      isO2
                        ? 'bg-cyan-500/80 text-white border-cyan-300'
                        : isCO2
                        ? 'bg-emerald-500/80 text-white border-emerald-300'
                        : 'bg-slate-700/80 text-slate-200 border-slate-500'
                    }`}
                    style={{
                      top: `${12 + (i * 17) % 72}%`,
                      left: `${8 + (i * 23) % 84}%`,
                      animationDuration: `${2.2 + (i % 3) * 0.7}s`,
                      opacity: isO2 ? Math.min(1, o2Percent / 12) : isCO2 ? Math.min(1, co2Percent / 20) : 0.6,
                    }}
                  >
                    {isO2 ? 'O₂' : isCO2 ? 'CO₂' : 'N₂'}
                  </div>
                );
              })}
            </div>

            {/* Chamber Center Readout */}
            <div className="my-auto text-center z-10">
              <div className="inline-block p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  PREDICTED SHELF LIFE IN MAP
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1">
                  {shelfLifeEstimate}{' '}
                  <span className="text-xl font-sans text-cyan-400 font-bold">Days</span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Baseline (ambient air): {activeFood.defaultShelfLife} days •{' '}
                  <span className="text-emerald-400 font-bold">
                    +{(shelfLifeEstimate - activeFood.defaultShelfLife > 0 ? '+' : '')}
                    {shelfLifeEstimate - activeFood.defaultShelfLife} days gain
                  </span>
                </div>
              </div>
            </div>

            {/* Chamber Telemetry Footer */}
            <div className="grid grid-cols-3 gap-2 z-10 text-center">
              <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Chamber Temp</span>
                <p className="text-xs font-bold text-amber-300 font-mono">{tempC}°C</p>
              </div>
              <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Respiration R_O2</span>
                <p className="text-xs font-bold text-cyan-300 font-mono">
                  {estimatedRespirationRate > 0 ? `${estimatedRespirationRate} mg/kg·h` : 'N/A (Static)'}
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Headspace</span>
                <p className="text-xs font-bold text-emerald-300 font-mono">{pkgVolumeMl} ml</p>
              </div>
            </div>
          </div>

          {/* Gas Stack Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-cyan-400">O₂: {o2Percent}%</span>
              <span className="text-emerald-400">CO₂: {co2Percent}%</span>
              <span className="text-slate-400">N₂: {n2Percent}% (Inert Balance)</span>
            </div>

            <div className="h-4 w-full bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${o2Percent}%` }}
                title={`Oxygen: ${o2Percent}%`}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${co2Percent}%` }}
                title={`Carbon Dioxide: ${co2Percent}%`}
              />
              <div
                className="bg-slate-600 h-full transition-all duration-300"
                style={{ width: `${n2Percent}%` }}
                title={`Nitrogen: ${n2Percent}%`}
              />
            </div>
          </div>

          {/* Real-time Atmosphere Safety Diagnostics */}
          <div className="mt-4 space-y-2">
            {isAnaerobicRisk && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Anaerobic Risk:</strong> O₂ level ({o2Percent}%) is below critical threshold ({activeFood.criticalO2}%). Risk of ethanol accumulation, alcoholic off-flavors, and tissue breakdown!
                </span>
              </div>
            )}

            {isCo2InjuryRisk && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>CO₂ Injury Warning:</strong> CO₂ level ({co2Percent}%) exceeds tolerance threshold for {activeFood.name} (12%). Causes internal browning and skin lesions.
                </span>
              </div>
            )}

            {isChillingInjuryRisk && (
              <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/40 text-xs text-blue-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Chilling Injury Alert:</strong> {activeFood.name} is tropical/subtropical (ideal {activeFood.optimumTemp}°C). Storage at {tempC}°C causes pitting and surface discoloration.
                </span>
              </div>
            )}

            {!isAnaerobicRisk && !isCo2InjuryRisk && !isChillingInjuryRisk && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Optimal Equilibrium Atmosphere:</strong> Respiration slowed, microbial proliferation suppressed, maximum nutrient retention achieved.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Atmospheric Sliders & Controllers (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" /> Atmosphere Controls
            </h3>

            {/* Food Selector with Search & Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Food Product (100 Available)</label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-xl text-xs glass-input text-white"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1.5 rounded-xl text-xs glass-input text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedFoodId}
                onChange={(e) => handleSelectFood(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
              >
                {filteredFoods.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.hindiName ? `(${f.hindiName})` : ''} • {f.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Oxygen O2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-300">Oxygen (O₂)</span>
                <span className="font-mono text-cyan-400 font-bold">{o2Percent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={21}
                step={0.5}
                value={o2Percent}
                onChange={(e) => setO2Percent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Anaerobic / MAP flush)</span>
                <span>Safe: &gt;{activeFood.criticalO2}%</span>
                <span>20.9% (Air)</span>
              </div>
            </div>

            {/* Carbon Dioxide CO2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-300">Carbon Dioxide (CO₂)</span>
                <span className="font-mono text-emerald-400 font-bold">{co2Percent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={co2Percent}
                onChange={(e) => setCo2Percent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-[10px] text-slate-500">Inhibits aerobic bacteria and mould sporulation</span>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-300">Storage Temperature</span>
                <span className="font-mono text-amber-400 font-bold">{tempC}°C</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0°C (Deep chill)</span>
                <span>Ideal: {activeFood.optimumTemp}°C</span>
                <span>30°C (Ambient)</span>
              </div>
            </div>

            {/* Package Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Headspace Volume</span>
                <span className="font-mono text-white font-bold">{pkgVolumeMl} ml</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={pkgVolumeMl}
                onChange={(e) => setPkgVolumeMl(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Equilibrium Equation:</strong> Permeability flux matches respiration rate:
            <code className="text-cyan-300 block font-mono mt-1 text-[11px]">
              Flux = (P_O2 · A / L) · (p_atm - p_pkg) = R_O2 · W_product
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

