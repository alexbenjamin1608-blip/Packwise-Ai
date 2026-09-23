import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Sparkles, Info, Activity, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

export const BarrierAnalytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'otr' | 'wvtr'>('otr');

  // Chart data comparing materials
  const comparisonData = PACKAGING_MATERIALS.map((m) => ({
    name: m.shortCode,
    fullName: m.name,
    otr: m.otr,
    wvtr: m.wvtr,
    cost: m.relativeCostPerM2INR,
    eco: m.ecoScore,
  }));

  // Thickness vs Permeation Transmission Curve (Fick's Law of Diffusion: Flux = D * S * ΔP / Thickness)
  const permeationCurveData = [
    { thickness: 40, otrPetPe: 160, otrEvoh: 4.1, wvtrPetPe: 9.0, wvtrAlu: 0.05 },
    { thickness: 60, otrPetPe: 106, otrEvoh: 2.7, wvtrPetPe: 6.0, wvtrAlu: 0.03 },
    { thickness: 80, otrPetPe: 80, otrEvoh: 2.0, wvtrPetPe: 4.5, wvtrAlu: 0.02 },
    { thickness: 100, otrPetPe: 64, otrEvoh: 1.6, wvtrPetPe: 3.6, wvtrAlu: 0.015 },
    { thickness: 120, otrPetPe: 53, otrEvoh: 1.3, wvtrPetPe: 3.0, wvtrAlu: 0.012 },
    { thickness: 150, otrPetPe: 42, otrEvoh: 1.1, wvtrPetPe: 2.4, wvtrAlu: 0.01 },
  ];

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Barrier Physics & Permeation Analytics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Scientific Modeling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            OTR & WVTR <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Permeability Engineering</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Evaluate oxygen ingress and moisture transmission kinetics to safeguard biochemical stability.
          </p>
        </div>

        {/* Metric Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedMetric('otr')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedMetric === 'otr'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            OTR (Oxygen Transmission)
          </button>

          <button
            onClick={() => setSelectedMetric('wvtr')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedMetric === 'wvtr'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            WVTR (Moisture Vapor)
          </button>
        </div>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl glass-card border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Oxygen Transmission Rate (OTR)
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Measures the volume of oxygen gas passing through a square meter of film per 24 hours (<strong>cc/m²·day·atm</strong> at 23°C, 0% RH per ASTM D3985). Critical for preventing oxidative rancidity in fried snacks, browning in fruits, and microbial bloom in paneer.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Water Vapor Transmission Rate (WVTR)
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Measures grams of moisture permeating through a film per square meter daily (<strong>g/m²·day</strong> at 38°C, 90% RH per ASTM F1249). Prevents crisp biscuit sogginess, powder lumping, and fresh produce dehydration during hot and humid Indian monsoons.
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Material Comparison Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl glass-card border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                {selectedMetric === 'otr' ? 'Oxygen Permeability Comparison (OTR)' : 'Water Vapor Barrier Comparison (WVTR)'}
              </h3>
              <p className="text-xs text-slate-400">
                Lower value indicates superior barrier performance (logarithmic scale)
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              {selectedMetric === 'otr' ? 'cc/m²·day' : 'g/m²·day'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  scale="log"
                  domain={[0.01, 4000]}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090E1A',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [
                    `${val} ${selectedMetric === 'otr' ? 'cc/m²·day' : 'g/m²·day'}`,
                    selectedMetric.toUpperCase(),
                  ]}
                />
                <Bar
                  dataKey={selectedMetric}
                  fill={selectedMetric === 'otr' ? '#06B6D4' : '#F59E0B'}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Thickness vs Barrier Fickian Curve (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl glass-card border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Thickness vs Permeation Kinetics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulating barrier gain as film gauge increases from 40 µm to 150 µm
            </p>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={permeationCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="thickness" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="µm" />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090E1A',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="otrPetPe" name="PET/PE OTR" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="otrEvoh" name="EVOH OTR" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="wvtrPetPe" name="PET/PE WVTR" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-200">
            <strong>Barrier Insight:</strong> Doubling film thickness reduces permeation by ~50%, but incorporating a 3 µm EVOH core layer improves oxygen barrier by <strong>4,000%</strong> without polymer weight penalties.
          </div>
        </div>
      </div>
    </section>
  );
};
