import math
import numpy as np
from typing import Dict, List, Tuple, Optional

# Constants
R_GAS = 8.314  # J / (mol * K)
ATM_KPA = 101.325 # kPa at 1 atm

def calculate_tetens_p_sat(temp_c: float) -> float:
    """
    Calculates saturated vapor pressure in kPa using the Tetens formula.
    P_sat(T) = 0.61078 * exp((17.27 * T) / (T + 237.3))
    """
    return 0.61078 * math.exp((17.27 * temp_c) / (temp_c + 237.3))

def calculate_arrhenius_vmax(v_max_ref: float, temp_c: float, ref_temp_c: float = 4.0, ea_kj: float = 65.0) -> float:
    """
    Calculates temperature-adjusted maximum respiration rate via Arrhenius equation.
    """
    t_k = temp_c + 273.15
    t_ref_k = ref_temp_c + 273.15
    ea_j = ea_kj * 1000.0
    factor = math.exp((-ea_j / R_GAS) * ((1.0 / t_k) - (1.0 / t_ref_k)))
    return v_max_ref * factor

def calculate_michaelis_menten_rate(o2_pct: float, v_max: float, k_m: float) -> float:
    """
    Michaelis-Menten respiration rate R_O2 = (V_max * [O2]) / (K_m + [O2])
    """
    if o2_pct <= 0:
        return 0.0
    return (v_max * o2_pct) / (k_m + o2_pct)

def estimate_shelf_life_physics(
    commodity: Dict,
    material: Dict,
    ambient_temp_c: float,
    external_rh_pct: float,
    surface_area_m2: float,
    dry_mass_kg: float
) -> Tuple[int, List[str]]:
    """
    Physics-informed shelf-life estimation based on commodity respiration vs water migration.
    """
    warnings = []
    is_respiring = commodity.get("is_respiring", False)
    default_days = commodity.get("default_shelf_life_days", 14)
    p_sat = calculate_tetens_p_sat(ambient_temp_c)

    otr = float(material.get("otr_normalized", material.get("otr", 100.0)))
    wvtr = float(material.get("wvtr_normalized", material.get("wvtr", 10.0)))
    co2tr = float(material.get("co2tr_normalized", material.get("co2tr", 200.0)))

    if is_respiring:
        # Respiring produce: OTR matching to prevent fermentation or dehydration
        crit_o2 = commodity.get("critical_oxygen_limit_pct") or 2.0
        if otr < 50.0:
            warnings.append("Critical Risk: Extremely low OTR causes rapid anaerobic tissue fermentation and off-odors.")
            pred_days = max(2, int(default_days * 0.25))
        elif otr < 200.0 and crit_o2 > 2.0:
            warnings.append("Warning: Reduced OTR may induce physiological internal browning.")
            pred_days = max(3, int(default_days * 0.6))
        elif otr > 8000.0:
            warnings.append("Aeration Excessive: Accelerated transpiration causes severe shriveling and mass loss.")
            pred_days = max(3, int(default_days * 0.5))
        else:
            # Optimal MAP balance
            co2_benefit = min(1.8, 1.0 + (co2tr / 15000.0))
            pred_days = int(default_days * co2_benefit)
            # Temperature penalty if far from optimum
            opt_temp = commodity.get("optimum_temp_c", 4.0)
            delta_t = max(0.0, ambient_temp_c - opt_temp)
            q10_factor = 2.0 ** (delta_t / 10.0)
            pred_days = max(2, int(pred_days / q10_factor))
    else:
        # Non-respiring / Dry goods / Bakery / Dairy / Meat:
        # Water activity equilibrium & moisture migration across barrier
        aw_init = commodity.get("water_activity_aw", 0.6)
        aw_crit = (commodity.get("critical_moisture_limit_pct", 14.0) / 100.0)
        aw_ext = external_rh_pct / 100.0

        delta_aw = abs(aw_crit - aw_init)
        barrier_factor = max(0.005, wvtr)
        vapor_drive = max(0.1, p_sat / ATM_KPA)

        # Days = (Delta_aw * Dry_Mass_g) / (WVTR * SurfaceArea * VaporDrive)
        calculated = (delta_aw * dry_mass_kg * 1000.0) / (barrier_factor * surface_area_m2 * vapor_drive)

        # Lipid oxidation risk for high lipid foods in high OTR
        lipid_pct = commodity.get("lipid_content_pct", 0.0)
        if lipid_pct > 15.0 and otr > 500.0:
            warnings.append("Oxidative Rancidity Risk: High lipid matrix exposed to elevated OTR will form hexanal volatiles.")
            calculated *= 0.6

        # Temperature degradation factor
        opt_temp = commodity.get("optimum_temp_c", 20.0)
        if ambient_temp_c > opt_temp + 5.0:
            temp_penalty = 1.0 + (0.05 * (ambient_temp_c - opt_temp))
            calculated /= temp_penalty

        pred_days = int(calculated)
        # Bounded between 3 days and 3 years (1095 days)
        pred_days = min(1095, max(3, pred_days))

    return pred_days, warnings

def calculate_quality_decay_curve(initial_shelf_life: int, ambient_temp_c: float, optimal_temp_c: float) -> List[Dict[str, float]]:
    """
    Generates time-series quality retention data points for chart visualization.
    """
    # Q(t) = 100 * exp(-k * t)
    k_base = 1.0 / max(1, initial_shelf_life)
    # Temperature acceleration factor
    delta_t = max(0.0, ambient_temp_c - optimal_temp_c)
    k_actual = k_base * (1.5 ** (delta_t / 10.0))

    days_to_project = max(7, int(initial_shelf_life * 1.3))
    step = max(1, days_to_project // 10)

    curve = []
    for day in range(0, days_to_project + 1, step):
        quality = 100.0 * math.exp(-k_actual * day)
        curve.append({
            "day": float(day),
            "quality_retention_pct": round(max(0.0, quality), 1)
        })
    return curve
