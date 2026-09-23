import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Sliders,
  ShieldAlert,
  Leaf,
  Layers,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Atom,
  TrendingUp,
  Scale
} from 'lucide-react';
import { COMMODITIES_100, ScientificCommodity } from '../data/commodities100';
import {
  runTopsisOptimization,
  checkBackendHealth,
  MaterialOptimizationResult
} from '../services/api';

export function Quantum3dDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [commodityName, setCommodityName] = useState<string>('Fresh Strawberries');
  const [temp, setTemp] = useState<number>(4.0);
  const [humidity, setHumidity] = useState<number>(85);
  const [area, setArea] = useState<number>(0.08);
  const [mass, setMass] = useState<number>(0.3);

  // TOPSIS MCDM Weights
  const [ecoWeight, setEcoWeight] = useState<number>(0.4);
  const [costWeight, setCostWeight] = useState<number>(0.3);
  const [barrierWeight, setBarrierWeight] = useState<number>(0.3);

  const [loading, setLoading] = useState<boolean>(false);
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<MaterialOptimizationResult[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Check backend health periodically
  useEffect(() => {
    checkBackendHealth().then(setIsBackendLive);
    const timer = setInterval(() => {
      checkBackendHealth().then(setIsBackendLive);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', 'Fresh Produce', 'Dairy', 'Bakery', 'Dry Goods', 'Meat & Poultry', 'Seafood'];

  const filteredCommodities = selectedCategory === 'All'
    ? COMMODITIES_100
    : COMMODITIES_100.filter((c) => c.category === selectedCategory);

  const handleCommoditySelect = (comm: ScientificCommodity) => {
    setCommodityName(comm.name);
    setTemp(comm.optimum_temp_c);
    setHumidity(comm.is_respiring ? 90 : 60);
    setArea(comm.is_respiring ? 0.08 : 0.05);
    setMass(comm.category === 'Dry Goods' ? 0.5 : 0.25);
  };

  const handleRunOptimizer = async () => {
    setLoading(true);
    try {
      const results = await runTopsisOptimization({
        commodity_name: commodityName,
        ambient_temp_c: temp,
        external_rh_pct: humidity,
        package_surface_area_m2: area,
        dry_solid_mass_kg: mass,
        priority_eco: ecoWeight,
        priority_cost: costWeight,
        priority_barrier: barrierWeight
      });
      setRecommendations(results);
    } catch (err) {
      console.error('Optimization pipeline error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunOptimizer();
  }, [commodityName]);

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-slate-950 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl my-4">
      {/* Dynamic 3D Ambient Light Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[180px] pointer-events-none animate-pulse duration-[12s]" />

      {/* Header Bar */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-teal-400">
              Ω
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-teal-300">
                QUANTUM<span className="text-teal-400 font-semibold text-xl ml-1">PACK 3D</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                TOPSIS Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Criteria Optimization & Physics-Informed Shelf Life Simulator (100 Commodities)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
            isBackendLive
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            {isBackendLive ? 'FastAPI Python Engine: Connected' : 'Local WebAssembly Mode: Ready'}
          </div>

          <button
            onClick={handleRunOptimizer}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-teal-300 transition-all active:scale-95"
            title="Recalculate Matrices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Side: Physical Parameter Interface */}
        <section className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                Physical Parameter Interface
              </h2>
              <span className="text-[11px] text-teal-400/80 uppercase tracking-wider font-mono">
                100 Commodities Matrix
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-4">
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Filter Category ({filteredCommodities.length} items)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                  Select Food Commodity
                </label>
                <div className="relative">
                  <select
                    value={commodityName}
                    onChange={(e) => {
                      const comm = COMMODITIES_100.find((c) => c.name === e.target.value);
                      if (comm) handleCommoditySelect(comm);
                      else setCommodityName(e.target.value);
                    }}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 hover:border-white/20"
                  >
                    {filteredCommodities.map((c) => (
                      <option key={c.commodity_id} value={c.name} className="bg-slate-900 text-white">
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                    Ambient Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                    Relative Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                    Package Area (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={area}
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                    Dry Mass (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={mass}
                    onChange={(e) => setMass(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>
              </div>

              {/* Dynamic Weights Adjustment (MCDM/TOPSIS Control Area) */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                    MCDM Weight Preferences
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Σ = 100%</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Eco-Impact Index
                    </span>
                    <span className="font-mono text-emerald-300">{(ecoWeight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ecoWeight}
                    onChange={(e) => setEcoWeight(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Cost Optimization
                    </span>
                    <span className="font-mono text-amber-300">{(costWeight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={costWeight}
                    onChange={(e) => setCostWeight(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-indigo-400 font-medium flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Physical Protection / Barrier
                    </span>
                    <span className="font-mono text-indigo-300">{(barrierWeight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={barrierWeight}
                    onChange={(e) => setBarrierWeight(parseFloat(e.target.value))}
                    className="w-full accent-indigo-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunOptimizer}
            disabled={loading}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 font-bold text-slate-950 uppercase tracking-wider shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                Solving TOPSIS Matrices...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-slate-950" />
                Execute AI Matching Pipeline
              </>
            )}
          </button>
        </section>

        {/* Right Side: High-Fidelity 3D Perspective Card Layout */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Optimal Configurations
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Ranked via mathematical proximity to positive-ideal barrier, cost, and LCA properties
              </p>
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              {recommendations.length} Candidates
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-5">
            {recommendations.map((item, index) => {
              const isEco = item.carbon_footprint_score >= 7.5 || item.is_biodegradable;
              const isHovered = hoveredCard === index;

              return (
                <div
                  key={item.trade_name}
                  className="relative transition-all duration-500 ease-out"
                  style={{ perspective: '1000px' }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Glowing Outline on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-teal-500/20 to-indigo-500/20 rounded-2xl blur-xl transition-opacity duration-500 pointer-events-none ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* 3D Transform Card Component */}
                  <div
                    className={`relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-lg border rounded-2xl p-5 sm:p-6 transition-all duration-500 cursor-pointer ${
                      isHovered
                        ? 'border-teal-400/50 -translate-y-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]'
                        : 'border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)]'
                    }`}
                    style={{
                      transform: isHovered ? 'rotateX(4deg) rotateY(-3deg)' : 'none'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center font-bold text-lg text-teal-400 border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                          #{item.rank}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                            {item.trade_name}
                            {item.rank === 1 && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                                TOP MATCH
                              </span>
                            )}
                          </h3>
                          <p className="text-slate-400 text-xs">
                            Base Matrix Polymer: <span className="text-teal-300 font-mono font-bold">{item.base_polymer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300">
                          TOPSIS Fit: {(item.topsis_score * 100).toFixed(0)}%
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            isEco
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isEco ? 'SUSTAINABLE' : 'RECYCLABLE'}
                        </span>
                      </div>
                    </div>

                    <hr className="border-white/5 my-3" />

                    {/* Operational Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <p className="text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Estimated Shelf-Life</p>
                        <p className="text-base font-bold text-white font-mono">{item.estimated_shelf_life_days} Days</p>
                      </div>
                      <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <p className="text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Thickness Metric</p>
                        <p className="text-base font-bold text-white font-mono">{item.recommended_thickness_microns} μm</p>
                      </div>
                      <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <p className="text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Unit Cost (Est.)</p>
                        <p className="text-base font-bold text-emerald-400 font-mono">${item.unit_cost_usd.toFixed(4)}</p>
                      </div>
                      <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <p className="text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">LCA Eco Index</p>
                        <p className="text-base font-bold text-teal-400 font-mono">{item.carbon_footprint_score} / 10</p>
                      </div>
                    </div>

                    {/* Critical Chemical Safety Warnings Area */}
                    {item.critical_defect_warning && (
                      <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                        <span className="font-bold text-rose-400">⚠️ ANOMALY WATCH:</span>
                        <span>{item.critical_defect_warning}</span>
                      </div>
                    )}

                    {/* Operational Environment Specification */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="text-slate-400">Gas Modification Target:</span>
                      <span className="text-indigo-300 font-semibold font-mono">{item.gas_regulation_type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
