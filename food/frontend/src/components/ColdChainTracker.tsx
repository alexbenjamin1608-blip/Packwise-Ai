import React, { useState, useEffect } from 'react';
import {
  Truck,
  Thermometer,
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TransitRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  commodity: string;
  distanceKm: number;
  durationHours: number;
  optimalTempC: number;
  optimalRhPercent: number;
}

const ROUTES: TransitRoute[] = [
  {
    id: 'ratnagiri-mumbai',
    name: 'Konkan Mango Reefer Corridor',
    from: 'Ratnagiri Orchards, MH',
    to: 'Vashi APMC Mandi, Navi Mumbai',
    commodity: 'Alphonso Mango',
    distanceKm: 360,
    durationHours: 10,
    optimalTempC: 13,
    optimalRhPercent: 88,
  },
  {
    id: 'nashik-delhi',
    name: 'Western Agrilogistics Trunk Route',
    from: 'Nashik Packhouse, MH',
    to: 'Azadpur Mandi, New Delhi',
    commodity: 'Grapes / Tomatoes',
    distanceKm: 1280,
    durationHours: 32,
    optimalTempC: 4,
    optimalRhPercent: 92,
  },
  {
    id: 'guntur-kolkata',
    name: 'East Coast Spice Freight',
    from: 'Guntur Cold Chain Terminal, AP',
    to: 'Posta Mandi, Kolkata, WB',
    commodity: 'Fresh Chillies / Turmeric',
    distanceKm: 1150,
    durationHours: 28,
    optimalTempC: 10,
    optimalRhPercent: 75,
  },
];

export const ColdChainTracker: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ratnagiri-mumbai');
  const [isCompressorFailed, setIsCompressorFailed] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(13.2);
  const [currentRh, setCurrentRh] = useState<number>(88);
  const [vibrationG, setVibrationG] = useState<number>(0.35);

  const route = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];

  // Live telemetry logging points
  const [telemetryPoints, setTelemetryPoints] = useState<
    { hour: string; temp: number; rh: number }[]
  >([
    { hour: '0h', temp: 13.0, rh: 88 },
    { hour: '2h', temp: 13.2, rh: 87 },
    { hour: '4h', temp: 13.5, rh: 89 },
    { hour: '6h', temp: 13.1, rh: 88 },
    { hour: '8h', temp: 13.4, rh: 88 },
  ]);

  // Handle compressor spike
  useEffect(() => {
    if (isCompressorFailed) {
      setCurrentTemp(31.4);
      setCurrentRh(62);
      setTelemetryPoints((prev) => [
        ...prev.slice(-5),
        { hour: 'Now', temp: 31.4, rh: 62 },
      ]);
    } else {
      setCurrentTemp(route.optimalTempC);
      setCurrentRh(route.optimalRhPercent);
    }
  }, [isCompressorFailed, route]);

  // Recalculate degradation
  const nominalShelfLifeDays = 18;
  const abusedShelfLifeDays = isCompressorFailed ? 6 : nominalShelfLifeDays;
  const shelfLifeLossPercent = isCompressorFailed ? 66 : 0;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Smart Cold Chain Logistics</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Reefer Truck IoT Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Indian Transit Route & <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">IoT Thermal Logger</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Simulate real-time temperature, humidity, and road vibration abuse across national transit corridors.
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2">
          {ROUTES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRouteId(r.id);
                setIsCompressorFailed(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedRouteId === r.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/30 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {r.commodity}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Status & Telemetry Card (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-card border border-white/15 p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                ACTIVE REEFER TRANSIT ROUTE
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">{route.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{route.from}</span>
                <span className="text-slate-600">→</span>
                <span className="text-emerald-300">{route.to}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono">Distance / Transit</span>
              <p className="text-base font-bold text-white font-mono">{route.distanceKm} km ({route.durationHours}h)</p>
            </div>
          </div>

          {/* Live Sensor Metrics Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              isCompressorFailed
                ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-black/40 border-cyan-500/30'
            }`}>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Chamber Temp</span>
              <p className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${
                isCompressorFailed ? 'text-rose-400' : 'text-cyan-300'
              }`}>
                {currentTemp}°C
              </p>
              <span className="text-[10px] text-slate-500">Target: {route.optimalTempC}°C</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Humidity (RH)</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">
                {currentRh}%
              </p>
              <span className="text-[10px] text-slate-500">Target: {route.optimalRhPercent}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Vibration Shock</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono mt-1">
                {vibrationG} g
              </p>
              <span className="text-[10px] text-slate-500">NH-66 Highway</span>
            </div>
          </div>

          {/* Real-time Temperature Telemetry Chart */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              Temperature & Humidity In-Transit Log
            </span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryPoints} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 40]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090E1A',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="temp" name="Temp °C" stroke={isCompressorFailed ? '#F43F5E' : '#06B6D4'} strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cold-Chain Abuse & Dynamic Recalculation (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-white/15 space-y-4">
            <h4 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Cold-Chain Stress Simulator
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test how an unexpected refrigeration compressor shutdown on hot Indian highways accelerates respiration and destroys shelf-life.
            </p>

            {/* Abuse Simulation Buttons */}
            <div className="space-y-2 pt-1">
              {!isCompressorFailed ? (
                <button
                  onClick={() => setIsCompressorFailed(true)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Simulate Reefer Failure (Spike to 31°C)
                </button>
              ) : (
                <button
                  onClick={() => setIsCompressorFailed(false)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Restore Reefer Cooling (Back to 13°C)
                </button>
              )}
            </div>

            {/* Recalculated Shelf-Life Impact Display */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Predicted Freshness Window:</span>
                <span className={`font-mono text-base font-extrabold ${isCompressorFailed ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {abusedShelfLifeDays} Days
                </span>
              </div>

              {isCompressorFailed && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-[11px] space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Thermal Abuse Alert
                  </p>
                  <p>
                    Temperature reached 31.4°C. Respiration rate jumped 300% ($Q_{10}$ effect). Internal fruit moisture lost to headspace. Safe commercial window reduced by <strong>{shelfLifeLossPercent}%</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            <strong>Barrier Protective Action:</strong> Under thermal abuse, PackWise high-barrier multilayer film slows ethylene triggering compared to unsealed fruit, retaining an extra 3 to 4 days of market viability.
          </div>
        </div>
      </div>
    </section>
  );
};
