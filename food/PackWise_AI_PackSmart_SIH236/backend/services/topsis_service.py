import numpy as np
from typing import List, Dict, Any
from services.physics_engine import estimate_shelf_life_physics

def calculate_unit_packaging_cost(surface_area_m2: float, thickness_microns: float, cost_per_kg: float) -> float:
    """
    Estimates per-unit packaging material cost based on thickness, area, and polymer density.
    Average polymer density assumed ~ 1.2 g/cm3.
    """
    density_g_cm3 = 1.2
    # Volume in m3 = area_m2 * (thickness * 1e-6)
    # Mass in g = volume_m3 * (density * 1e6)
    unit_mass_g = surface_area_m2 * (thickness_microns * 1e-6) * (density_g_cm3 * 1e6)
    cost = (unit_mass_g / 1000.0) * cost_per_kg
    return float(round(cost, 4))

def solve_topsis_optimization(
    commodity: Dict[str, Any],
    materials: List[Dict[str, Any]],
    ambient_temp_c: float,
    external_rh_pct: float,
    package_surface_area_m2: float,
    dry_solid_mass_kg: float,
    priority_eco: float,
    priority_cost: float,
    priority_barrier: float
) -> List[Dict[str, Any]]:
    """
    Executes the multi-criteria TOPSIS optimization balancing Cost, Eco-Impact, and Barrier Performance.
    """
    if not materials:
        return []

    processed = []
    for mat in materials:
        thickness = float(mat.get("thickness_microns", 30.0))
        cost_per_kg = float(mat.get("cost_per_kg", 3.0))
        tensile = float(mat.get("tensile_strength_mpa", mat.get("tensile_strength", 50.0)))
        wvtr = float(mat.get("wvtr_normalized", mat.get("wvtr", 10.0)))
        otr = float(mat.get("otr_normalized", mat.get("otr", 100.0)))
        carbon_index = float(mat.get("carbon_footprint_index", 5.0))

        # 1. Physics Shelf Life & Anomaly Watch
        pred_days, warnings = estimate_shelf_life_physics(
            commodity=commodity,
            material=mat,
            ambient_temp_c=ambient_temp_c,
            external_rh_pct=external_rh_pct,
            surface_area_m2=package_surface_area_m2,
            dry_mass_kg=dry_solid_mass_kg
        )

        # 2. Financial Metrics
        unit_cost = calculate_unit_packaging_cost(package_surface_area_m2, thickness, cost_per_kg)

        # 3. Decision Metrics:
        # Cost Metric (Cost/Min)
        cost_metric = unit_cost
        # Eco Metric (Lower carbon index = better, Cost/Min)
        eco_metric = carbon_index
        # Barrier Metric (Higher strength and lower moisture migration = better, Benefit/Max)
        barrier_metric = tensile / (wvtr + 0.01)

        processed.append({
            "mat": mat,
            "shelf_life_days": pred_days,
            "unit_cost": unit_cost,
            "warnings": warnings,
            "cost_metric": cost_metric,
            "eco_metric": eco_metric,
            "barrier_metric": barrier_metric,
            "thickness": thickness,
            "carbon_index": carbon_index,
            "otr": otr,
            "wvtr": wvtr,
            "tensile": tensile
        })

    # Build Decision Matrix [N x 3]
    matrix = np.array([[c["cost_metric"], c["eco_metric"], c["barrier_metric"]] for c in processed], dtype=float)

    # Vector Normalization
    col_norms = np.sqrt((matrix ** 2).sum(axis=0))
    col_norms = np.where(col_norms == 0, 1.0, col_norms)
    norm_matrix = matrix / col_norms

    # Normalized Weights
    w_sum = priority_cost + priority_eco + priority_barrier
    if w_sum <= 0:
        w_sum = 1.0
        priority_cost, priority_eco, priority_barrier = 0.33, 0.33, 0.34

    weights = np.array([
        priority_cost / w_sum,
        priority_eco / w_sum,
        priority_barrier / w_sum
    ])

    weighted_matrix = norm_matrix * weights

    # Target Vectors (Criteria 0: Cost [Min], Criteria 1: Eco [Min], Criteria 2: Barrier [Max])
    ideal_best = np.array([
        weighted_matrix[:, 0].min(),
        weighted_matrix[:, 1].min(),
        weighted_matrix[:, 2].max()
    ])

    ideal_worst = np.array([
        weighted_matrix[:, 0].max(),
        weighted_matrix[:, 1].max(),
        weighted_matrix[:, 2].min()
    ])

    # Euclidean Distances
    s_best = np.sqrt(((weighted_matrix - ideal_best) ** 2).sum(axis=1))
    s_worst = np.sqrt(((weighted_matrix - ideal_worst) ** 2).sum(axis=1))

    denom = s_best + s_worst
    topsis_scores = np.where(denom == 0, 0.5, s_worst / (denom + 1e-9))

    # Rank Candidates
    ranked_indices = np.argsort(topsis_scores)[::-1]
    results = []

    is_respiring = commodity.get("is_respiring", False)

    for rank_pos, idx in enumerate(ranked_indices):
        cand = processed[idx]
        m = cand["mat"]

        gas_mode = "Hermetic Static Seal"
        if is_respiring:
            gas_mode = "Active MAP: 4% O2 | 6% CO2 | Bal N2"
        elif "PET" in m.get("base_polymer", ""):
            gas_mode = "Nitrogen Gas Flush Ready"
        elif "AL" in m.get("base_polymer", "") or "FOIL" in m.get("base_polymer", ""):
            gas_mode = "Vacuum Hermetic Evacuation"

        results.append({
            "rank": rank_pos + 1,
            "trade_name": m.get("trade_name", "Material"),
            "base_polymer": m.get("base_polymer", "Polymer"),
            "topsis_score": float(round(topsis_scores[idx], 3)),
            "recommended_thickness_microns": cand["thickness"],
            "estimated_shelf_life_days": cand["shelf_life_days"],
            "carbon_footprint_score": float(round(10.0 - cand["carbon_index"], 1)),
            "unit_cost_usd": cand["unit_cost"],
            "gas_regulation_type": gas_mode,
            "critical_defect_warning": cand["warnings"][0] if cand["warnings"] else None,
            "otr": cand["otr"],
            "wvtr": cand["wvtr"],
            "tensile_strength": cand["tensile"],
            "is_biodegradable": bool(m.get("is_biodegradable", False))
        })

    return results
