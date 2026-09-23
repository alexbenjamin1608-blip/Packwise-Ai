import { COMMODITIES_100, ScientificCommodity } from '../data/commodities100';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface DesignOptimizationPayload {
  commodity_name: string;
  ambient_temp_c: number;
  external_rh_pct: number;
  package_surface_area_m2: number;
  dry_solid_mass_kg: number;
  priority_eco: number;
  priority_cost: number;
  priority_barrier: number;
}

export interface MaterialOptimizationResult {
  rank: number;
  trade_name: string;
  base_polymer: string;
  topsis_score: number;
  recommended_thickness_microns: number;
  estimated_shelf_life_days: number;
  carbon_footprint_score: number;
  unit_cost_usd: number;
  gas_regulation_type: string;
  critical_defect_warning?: string | null;
  otr?: number;
  wvtr?: number;
  tensile_strength?: number;
  is_biodegradable?: boolean;
}

const FALLBACK_MATERIALS = [
  { trade_name: "BioWrap Compostable PLA", base_polymer: "PLA", thickness_microns: 25.0, otr: 750.0, wvtr: 110.0, co2tr: 2400.0, tensile_strength: 48.0, cost_per_kg: 4.80, carbon_footprint_index: 2.2, is_biodegradable: true },
  { trade_name: "NaturaEco PHA Marine Film", base_polymer: "PHA", thickness_microns: 30.0, otr: 420.0, wvtr: 65.0, co2tr: 1300.0, tensile_strength: 35.0, cost_per_kg: 6.50, carbon_footprint_index: 1.1, is_biodegradable: true },
  { trade_name: "Standard PolyPack LDPE", base_polymer: "LDPE", thickness_microns: 50.0, otr: 3800.0, wvtr: 12.0, co2tr: 11000.0, tensile_strength: 22.0, cost_per_kg: 1.75, carbon_footprint_index: 6.5, is_biodegradable: false },
  { trade_name: "HiDensity Tough HDPE", base_polymer: "HDPE", thickness_microns: 40.0, otr: 1600.0, wvtr: 4.5, co2tr: 5200.0, tensile_strength: 32.0, cost_per_kg: 1.95, carbon_footprint_index: 5.8, is_biodegradable: false },
  { trade_name: "ClearShield Gloss PET", base_polymer: "PET", thickness_microns: 15.0, otr: 75.0, wvtr: 18.0, co2tr: 280.0, tensile_strength: 165.0, cost_per_kg: 2.90, carbon_footprint_index: 7.8, is_biodegradable: false },
  { trade_name: "BarrierMax Metallized PET", base_polymer: "MET-PET", thickness_microns: 12.0, otr: 1.2, wvtr: 0.7, co2tr: 4.5, tensile_strength: 150.0, cost_per_kg: 3.40, carbon_footprint_index: 8.2, is_biodegradable: false },
  { trade_name: "HydroBlock Aluminum Foil Laminate", base_polymer: "AL-FOIL-LAMI", thickness_microns: 75.0, otr: 0.01, wvtr: 0.01, co2tr: 0.01, tensile_strength: 85.0, cost_per_kg: 5.20, carbon_footprint_index: 9.1, is_biodegradable: false },
  { trade_name: "AeroFlow Micro-perforated Film", base_polymer: "BOPP-PERF", thickness_microns: 20.0, otr: 12000.0, wvtr: 85.0, co2tr: 36000.0, tensile_strength: 120.0, cost_per_kg: 3.10, carbon_footprint_index: 6.9, is_biodegradable: false },
  { trade_name: "NaturPaper Chitosan Coated", base_polymer: "CHITOSAN-PAPER", thickness_microns: 80.0, otr: 450.0, wvtr: 180.0, co2tr: 1200.0, tensile_strength: 28.0, cost_per_kg: 3.90, carbon_footprint_index: 1.5, is_biodegradable: true },
  { trade_name: "OmniShield EVOH Coextrusion", base_polymer: "PE/EVOH/PE", thickness_microns: 60.0, otr: 0.4, wvtr: 3.2, co2tr: 1.2, tensile_strength: 55.0, cost_per_kg: 5.80, carbon_footprint_index: 7.5, is_biodegradable: false }
];

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAllCommodities(category?: string, search?: string): Promise<ScientificCommodity[]> {
  try {
    let url = `${API_BASE_URL}/commodities?limit=150`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback to bundled 100 commodities
  }

  let list = COMMODITIES_100;
  if (category) {
    list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q));
  }
  return list;
}

export async function fetchCategories(): Promise<{ category: string; count: number }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  const counts: Record<string, number> = {};
  COMMODITIES_100.forEach((c) => {
    counts[c.category] = (counts[c.category] || 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

export async function runTopsisOptimization(payload: DesignOptimizationPayload): Promise<MaterialOptimizationResult[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn('FastAPI backend offline. Executing client-side TOPSIS physics engine...');
  }

  // Client-side fallback implementation
  const comm = COMMODITIES_100.find(
    (c) => c.name.toLowerCase() === payload.commodity_name.toLowerCase()
  ) || COMMODITIES_100[0];

  const t = payload.ambient_temp_c;
  const pSatKpa = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));

  const candidates = FALLBACK_MATERIALS.map((mat) => {
    const warnings: string[] = [];
    let predLife: number;

    if (comm.is_respiring) {
      if (mat.otr < 100) {
        warnings.push("High hazard: Extremely low OTR causes rapid anaerobic tissue fermentation.");
        predLife = Math.max(2, Math.floor(comm.default_shelf_life_days * 0.25));
      } else if (mat.otr > 10000) {
        warnings.push("Aeration excessive: Accelerates high transpiration and physiological shriveling.");
        predLife = Math.max(3, Math.floor(comm.default_shelf_life_days * 0.5));
      } else {
        predLife = Math.floor(comm.default_shelf_life_days * (1.0 + mat.co2tr / 15000.0));
      }
    } else {
      const deltaAw = Math.abs((comm.critical_moisture_limit_pct / 100.0) - comm.water_activity_aw);
      const barrier = Math.max(0.01, mat.wvtr);
      predLife = Math.floor((deltaAw * payload.dry_solid_mass_kg * 1000) / (barrier * payload.package_surface_area_m2 * (pSatKpa / 101.325)));
      predLife = Math.min(730, Math.max(5, predLife));
    }

    const unitMassG = payload.package_surface_area_m2 * (mat.thickness_microns * 1e-6) * (1.2 * 1e6);
    const unitCost = (unitMassG / 1000.0) * mat.cost_per_kg;

    return {
      mat,
      predLife,
      unitCost: parseFloat(unitCost.toFixed(4)),
      warnings,
      costMetric: unitCost,
      ecoMetric: mat.carbon_footprint_index,
      barrierMetric: mat.tensile_strength / (mat.wvtr + 0.01)
    };
  });

  // Client TOPSIS calculation
  const m = candidates.map(c => [c.costMetric, c.ecoMetric, c.barrierMetric]);
  const colSum0 = Math.sqrt(m.reduce((acc, row) => acc + row[0] * row[0], 0)) || 1;
  const colSum1 = Math.sqrt(m.reduce((acc, row) => acc + row[1] * row[1], 0)) || 1;
  const colSum2 = Math.sqrt(m.reduce((acc, row) => acc + row[2] * row[2], 0)) || 1;

  const wSum = payload.priority_cost + payload.priority_eco + payload.priority_barrier || 1;
  const w0 = payload.priority_cost / wSum;
  const w1 = payload.priority_eco / wSum;
  const w2 = payload.priority_barrier / wSum;

  const weighted = m.map(row => [
    (row[0] / colSum0) * w0,
    (row[1] / colSum1) * w1,
    (row[2] / colSum2) * w2
  ]);

  const idealBest = [
    Math.min(...weighted.map(r => r[0])),
    Math.min(...weighted.map(r => r[1])),
    Math.max(...weighted.map(r => r[2]))
  ];
  const idealWorst = [
    Math.max(...weighted.map(r => r[0])),
    Math.max(...weighted.map(r => r[1])),
    Math.min(...weighted.map(r => r[2]))
  ];

  const resultsWithScore = candidates.map((cand, idx) => {
    const row = weighted[idx];
    const sBest = Math.sqrt(
      Math.pow(row[0] - idealBest[0], 2) +
      Math.pow(row[1] - idealBest[1], 2) +
      Math.pow(row[2] - idealBest[2], 2)
    );
    const sWorst = Math.sqrt(
      Math.pow(row[0] - idealWorst[0], 2) +
      Math.pow(row[1] - idealWorst[1], 2) +
      Math.pow(row[2] - idealWorst[2], 2)
    );
    const score = sWorst / (sBest + sWorst + 1e-9);
    return { cand, score };
  });

  resultsWithScore.sort((a, b) => b.score - a.score);

  return resultsWithScore.map((item, rankIdx) => {
    const c = item.cand;
    const m = c.mat;
    let gasMode = "Hermetic Static Seal";
    if (comm.is_respiring) gasMode = "Active MAP: 4% O2 | 6% CO2 | Bal N2";
    else if (m.base_polymer.includes("PET")) gasMode = "Nitrogen Gas Flush Ready";

    return {
      rank: rankIdx + 1,
      trade_name: m.trade_name,
      base_polymer: m.base_polymer,
      topsis_score: parseFloat(item.score.toFixed(3)),
      recommended_thickness_microns: m.thickness_microns,
      estimated_shelf_life_days: c.predLife,
      carbon_footprint_score: parseFloat((10.0 - m.carbon_footprint_index).toFixed(1)),
      unit_cost_usd: c.unitCost,
      gas_regulation_type: gasMode,
      critical_defect_warning: c.warnings[0] || null,
      otr: m.otr,
      wvtr: m.wvtr,
      tensile_strength: m.tensile_strength,
      is_biodegradable: m.is_biodegradable
    };
  });
}
