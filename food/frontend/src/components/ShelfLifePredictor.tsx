import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface DayTelemetry {
  day: number;
  firmness: number; // 100 to 0
  moistureRetention: number; // 100 to 0
  microbialCountLog: number; // log CFU/g (1 to 8)
  oxidationIndex: number; // meq O2/kg (0 to 10)
  status: string;
  notes: string;
}

const TIMELINE_DATA: DayTelemetry[] = [
  {
    day: 1,
    firmness: 98,
    moistureRetention: 99,
    microbialCountLog: 1.8,
    oxidationIndex: 0.2,
    status: 'Peak Freshness',
    notes: 'Harvest fresh, cellular turgor 100%, high soluble solids, no off-odors.',
  },
  {
    day: 5,
    firmness: 89,
    moistureRetention: 96,
    microbialCountLog: 2.3,
    oxidationIndex: 0.8,
    status: 'Optimal Commercial Quality',
    notes: 'Natural ripening continues at controlled rate; unpackaged fruit would show skin freckling here.',
  },
  {
    day: 10,
    firmness: 78,
    moistureRetention: 92,
    microbialCountLog: 3.1,
    oxidationIndex: 1.6,
    status: 'Safe Retail Window',
    notes: 'High sweetness, flesh softened to table-ready texture, zero fungal lesions inside barrier film.',
  },
  {
    day: 15,
    firmness: 68,
    moistureRetention: 88,
    microbialCountLog: 4.2,
    oxidationIndex: 2.4,
    status: 'Acceptable Consumer Consumption',
    notes: 'Aromatic volatiles at peak intensity, slight moisture migration to pouch headspace.',
  },
  {
    day: 18,
    firmness: 58,
    moistureRetention: 84,
    microbialCountLog: 5.0,
    oxidationIndex: 3.2,
    status: 'Predicted Shelf-Life Window Limit',
    notes: 'Terminal retail freshness limit. Fruit remains edible; prompt consumption recommended.',
  },
];

export const ShelfLifePredictor: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(10);

  const activeTelemetry = TIMELINE_DATA.find((d) => d.day === selectedDay) || TIMELINE_DATA[2];

  // Comparative shelf life curve
  const comparisonCurve = [
    { day: 0, unpackaged: 100, standardPoly: 100, packwiseAiMap: 100 },
    { day: 3, unpackaged: 72, standardPoly: 92, packwiseAiMap: 98 },
    { day: 5, unpackaged: 40, standardPoly: 80, packwiseAiMap: 95 },
    { day: 8, unpackaged: 10, standardPoly: 62, packwiseAiMap: 90 },
    { day: 12, unpackaged: 0, standardPoly: 35, packwiseAiMap: 82 },
    { day: 15, unpackaged: 0, standardPoly: 15, packwiseAiMap: 74 },
    { day: 18, unpackaged: 0, standardPoly: 0, packwiseAiMap: 65 },
    { day: 22, unpackaged: 0, standardPoly: 0, packwiseAiMap: 45 },
  ];

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Kinetic Shelf-Life Modeling</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Degradation Curves</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Predicted Shelf-Life <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Freshness Window</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Compare post-harvest quality decay rates between unpackaged produce, standard poly bags, and PackWise AI barrier structures.
          </p>
        </div>

        {/* AI Model Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <Info className="w-3.5 h-3.5" /> AI MODEL ESTIMATE
        </div>
      </div>

      {/* Main Timeline Interactive Ribbon */}
      <div className="p-6 rounded-3xl glass-card border border-white/15 shadow-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Interactive Freshness Timeline
          </span>
          <span className="text-xs font-mono text-cyan-300">
            CURRENT INSPECTION: DAY {selectedDay}
          </span>
        </div>

        {/* Timeline Day Steps */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {TIMELINE_DATA.map((item) => {
            const isSelected = selectedDay === item.day;
            return (
              <button
                key={item.day}
                onClick={() => setSelectedDay(item.day)}
                className={`p-3 sm:p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-500/25 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base sm:text-xl font-extrabold font-mono ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                    Day {item.day}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-1">
                  {item.status}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Day Telemetry Inspector */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Tissue Firmness</span>
            <p className="text-lg font-bold text-emerald-300 font-mono mt-0.5">{activeTelemetry.firmness}%</p>
            <span className="text-[10px] text-slate-500">Pectin structural integrity</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Moisture Retention</span>
            <p className="text-lg font-bold text-cyan-300 font-mono mt-0.5">{activeTelemetry.moistureRetention}%</p>
            <span className="text-[10px] text-slate-500">Free water retention</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Microbial Count</span>
            <p className="text-lg font-bold text-amber-300 font-mono mt-0.5">{activeTelemetry.microbialCountLog} <span className="text-xs font-sans">log CFU/g</span></p>
            <span className="text-[10px] text-slate-500">Psychrotrophic bacteria</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Lipid Oxidation</span>
            <p className="text-lg font-bold text-white font-mono mt-0.5">{activeTelemetry.oxidationIndex} <span className="text-xs font-sans">meq/kg</span></p>
            <span className="text-[10px] text-slate-500">Peroxide value index</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-3 italic">
          <strong>Day {selectedDay} Observation:</strong> {activeTelemetry.notes}
        </p>
      </div>

      {/* Comparative Degradation Curves Chart */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Comparative Freshness Retention Curves (Quality Index %)
            </h3>
            <p className="text-xs text-slate-400">
              Alphonso Mango stored at chilled temperature (12°C, 90% RH)
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            PACKWISE AI EXTENSION: +260%
          </span>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={comparisonCurve} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorMap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPoly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorNone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" Days" />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090E1A',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="packwiseAiMap" name="PackWise AI MAP Multilayer" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMap)" />
              <Area type="monotone" dataKey="standardPoly" name="Standard Polyethylene Bag" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorPoly)" />
              <Area type="monotone" dataKey="unpackaged" name="Unpackaged Open Ambient" stroke="#EF4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorNone)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Shelf-life estimates are simulated based on empirical food degradation kinetics (Arrhenius equation and respiration models). Actual shelf life is subject to initial harvest bioburden, temperature maintenance in transit, and seal integrity.
          </span>
        </div>
      </div>
    </section>
  );
};
