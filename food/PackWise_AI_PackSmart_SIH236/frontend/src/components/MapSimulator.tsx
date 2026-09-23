import React, { useState } from 'react';
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
} from 'lucide-react';

export const MapSimulator: React.FC = () => {
  const [targetFood, setTargetFood] = useState<string>('Alphonso Mango');
  const [o2Percent, setO2Percent] = useState<number>(5);
  const [co2Percent, setCo2Percent] = useState<number>(10);
  const [tempC, setTempC] = useState<number>(12);
  const [pkgVolumeMl, setPkgVolumeMl] = useState<number>(1200);

  // Remaining inert gas is Nitrogen
  const n2Percent = Math.max(0, 100 - o2Percent - co2Percent);

  // Physiological checks
  const isAnaerobicRisk = o2Percent < 2.0;
  const isCo2InjuryRisk = co2Percent > 12.0;
  const isIdealMap = !isAnaerobicRisk && !isCo2InjuryRisk && o2Percent <= 8 && co2Percent >= 5;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Modified Atmosphere Packaging Simulator</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Gas Equilibrium Modeling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            MAP Chamber & <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Gas Atmosphere Simulator</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Simulate equilibrium modified atmospheres ($O_2, CO_2, N_2$) to decelerate post-harvest produce respiration.
          </p>
        </div>

        {/* Prominent Demo Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm">
          <Info className="w-3.5 h-3.5" /> EXAMPLE / MODEL OUTPUT
        </div>
      </div>

      {/* Main Simulator Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive MAP Chamber (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Produce Visual in Cold Chamber from Frame 40 */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/70 flex items-center justify-center">
            <img
              src="/frames/ezgif-frame-040.jpg"
              alt="Cold Storage Produce MAP Chamber"
              className="w-full h-full object-cover filter brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Simulated Floating Gas Molecules Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-bounce font-mono text-[9px] font-bold px-1.5 py-0.5 border shadow-lg ${
                    i % 3 === 0
                      ? 'bg-cyan-500/80 text-white border-cyan-300'
                      : i % 3 === 1
                      ? 'bg-emerald-500/80 text-white border-emerald-300'
                      : 'bg-slate-700/80 text-slate-200 border-slate-500'
                  }`}
                  style={{
                    top: `${15 + (i * 19) % 65}%`,
                    left: `${10 + (i * 27) % 80}%`,
                    animationDuration: `${2.5 + (i % 3) * 0.8}s`,
                  }}
                >
                  {i % 3 === 0 ? 'O₂' : i % 3 === 1 ? 'CO₂' : 'N₂'}
                </div>
              ))}
            </div>

            {/* Chamber Telemetry Badge */}
            <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-cyan-300 font-bold">{targetFood}</span>
              <span className="text-slate-400 font-mono">| {tempC}°C | {pkgVolumeMl} ml</span>
            </div>
          </div>

          {/* Gas Stack Bar */}
          <div className="mt-6 space-y-2">
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

          {/* Real-time Atmosphere Safety Diagnostic */}
          <div className="mt-4">
            {isAnaerobicRisk ? (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Anaerobic Risk:</strong> O₂ level below 2% can trigger anaerobic alcoholic fermentation, off-flavors, and tissue breakdown in climacteric fruits.
                </span>
              </div>
            ) : isCo2InjuryRisk ? (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>CO₂ Injury Warning:</strong> CO₂ above 12% risks physiological injury, internal cavity browning, and skin pitting in sensitive varieties.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Equilibrium MAP Atmosphere:</strong> Suppresses ethylene production and extends crispness without anaerobic stress.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Atmospheric Sliders & Controllers (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/15 space-y-5">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" /> Gas Composition Sliders
            </h3>

            {/* Target Produce Preset */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Produce Type</label>
              <select
                value={targetFood}
                onChange={(e) => {
                  setTargetFood(e.target.value);
                  if (e.target.value === 'Alphonso Mango') {
                    setO2Percent(5);
                    setCo2Percent(10);
                    setTempC(12);
                  } else if (e.target.value === 'Malai Paneer') {
                    setO2Percent(0);
                    setCo2Percent(30);
                    setTempC(4);
                  } else if (e.target.value === 'Kashmiri Apple') {
                    setO2Percent(3);
                    setCo2Percent(2);
                    setTempC(2);
                  }
                }}
                className="w-full p-2.5 rounded-xl text-xs glass-input text-white font-medium"
              >
                <option value="Alphonso Mango">Alphonso Mango (Fresh Produce)</option>
                <option value="Kashmiri Apple">Kashmiri Apple (Deciduous)</option>
                <option value="Bhagwa Pomegranate">Bhagwa Pomegranate (Arils)</option>
                <option value="Malai Paneer">Malai Paneer (Dairy Solid)</option>
                <option value="Fresh Chilled Chicken">Fresh Chilled Chicken (Poultry)</option>
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
                value={o2Percent}
                onChange={(e) => setO2Percent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500">Atmospheric normal: 20.9%</span>
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
                max={40}
                value={co2Percent}
                onChange={(e) => setCo2Percent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-[10px] text-slate-500">Bacteriostatic agent; suppresses mould</span>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-300">Chamber Temperature</span>
                <span className="font-mono text-amber-400 font-bold">{tempC}°C</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[10px] text-slate-500">Respiration triples every 10°C rise ($Q_{10} \approx 2.5$)</span>
            </div>

            {/* Package Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Package Headspace Volume</span>
                <span className="font-mono text-white font-bold">{pkgVolumeMl} ml</span>
              </div>
              <input
                type="range"
                min={300}
                max={3000}
                step={100}
                value={pkgVolumeMl}
                onChange={(e) => setPkgVolumeMl(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Engineering Note:</strong> Modified atmosphere packaging relies on precision micro-perforation or selective polymer breathability matching the product respiration rate (R_O2) at cold storage temperature.
          </div>
        </div>
      </div>
    </section>
  );
};
