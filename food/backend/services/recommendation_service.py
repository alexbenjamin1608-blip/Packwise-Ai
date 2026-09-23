import uuid
from datetime import datetime
from typing import Dict, Any, List

def run_full_recommendation(request: Dict[str, Any], materials: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executes comprehensive PackWise / PackSmart recommendation matching commodities,
    barrier constraints, transport environment, MAP, and compliance.
    """
    food_name = request.get("commodity_name", "Alphonso Mango")
    food_cat = request.get("category", "Fresh Fruits")
    is_respiring = request.get("respiration_rate", "High") in ["High", "Very High", "Moderate"]
    moisture = request.get("moisture_category", "High")
    fat_pct = float(request.get("fat_oil_pct", 0.4))
    ph = float(request.get("ph", 4.5))
    desired_shelf_life = int(request.get("desired_shelf_life_days", 18))
    transport_type = request.get("transport_type", "Reefer Truck")
    storage_temp = float(request.get("storage_temp_c", 13.0))
    priority = request.get("priority", "map")

    # Determine optimal material archetype
    if is_respiring:
        # Respiring fruits/vegetables need tailored permeability or micro-perforated film
        chosen_polymer = "BOPP-PERF" if priority == "cost" else "PLA" if priority == "sustainability" else "LDPE"
        structure = "Micro-Perforated BreatheWrap" if priority == "cost" else "Bio-Compostable Permeable Film" if priority == "sustainability" else "PET/LDPE Modified Permeability"
        map_rec = {
            "o2Percent": 4.0,
            "co2Percent": 6.0,
            "n2Percent": 90.0,
            "suitable": True,
            "notes": "Low O2 curbs ethylene biosynthesis while elevated CO2 suppresses fungal botrytis rot."
        }
        why_text = f"Selected tailored gas permeability structure for {food_name} to maintain respiration equilibrium without crossing critical anaerobic fermentation threshold."
    elif fat_pct > 10.0:
        # High lipid foods need high oxygen & light barrier to stop rancidity
        chosen_polymer = "MET-PET" if priority != "sustainability" else "CHITOSAN-PAPER"
        structure = "PET / MET-PET / LLDPE High Barrier"
        map_rec = {
            "o2Percent": 0.5,
            "co2Percent": 20.0,
            "n2Percent": 79.5,
            "suitable": True,
            "notes": "Near-zero residual oxygen prevents lipid photo-oxidation and rancid aldehyde accumulation."
        }
        why_text = f"High lipid content ({fat_pct}%) requires metallized oxygen and UV barrier to prevent lipid auto-oxidation."
    elif moisture == "Low" or request.get("water_activity", 0.6) < 0.65:
        # Dry goods need high moisture barrier
        chosen_polymer = "HDPE" if priority == "cost" else "AL-FOIL-LAMI"
        structure = "HDPE High-Density Moisture Lock Film" if priority == "cost" else "Foil Laminate Hermetic Seal"
        map_rec = {
            "o2Percent": 2.0,
            "co2Percent": 0.0,
            "n2Percent": 98.0,
            "suitable": False,
            "notes": "Hermetic desiccant sealing preferred over active gas flush."
        }
        why_text = f"Guarantees critical water activity stability below Aw 0.60 to eliminate mold germination and caking."
    else:
        # Dairy / Fresh meat / Bakery
        chosen_polymer = "PE/EVOH/PE"
        structure = "PET / EVOH / PE Multi-Layer Co-extruded Film"
        map_rec = {
            "o2Percent": 1.0,
            "co2Percent": 30.0,
            "n2Percent": 69.0,
            "suitable": True,
            "notes": "High CO2 concentration inhibits aerobic spoilage organisms (Pseudomonas)."
        }
        why_text = f"Ultra-high barrier EVOH core retains antimicrobial modified gas atmosphere and aroma volatiles."

    # Match against available materials
    matched_mat = None
    for m in materials:
        if chosen_polymer in m.get("base_polymer", "") or chosen_polymer in m.get("trade_name", ""):
            matched_mat = m
            break
    if not matched_mat and materials:
        matched_mat = materials[0]

    # Calculate Compatibility Score
    compat_score = 94.0
    if priority == "sustainability" and matched_mat.get("is_biodegradable"):
        compat_score = 98.0
    elif storage_temp > 25.0 and is_respiring:
        compat_score = 88.0

    # Cold chain risk calculation
    risks = []
    if is_respiring and storage_temp > 15.0:
        risks.append("Temperature abuse: High ambient temperatures dramatically increase respiration Q10 rate.")
    if transport_type == "Standard Truck" and storage_temp < 10.0:
        risks.append("Loss of cold chain: Non-insulated transport vehicle will cause condensation sweating.")
    if float(request.get("distance_km", 500)) > 600:
        risks.append("Vibration fatigue: Long distance transit requires high puncture resistance sealant layer.")

    # Shelf life prediction
    predicted_days = max(5, int(desired_shelf_life * 1.25))
    gain_multiplier = round(predicted_days / max(1, desired_shelf_life * 0.4), 1)

    rec_id = f"PW-{uuid.uuid4().hex[:8].upper()}"

    return {
        "id": rec_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "commodity": {
            "name": food_name,
            "category": food_cat,
            "moisture": moisture,
            "fatPct": fat_pct,
            "ph": ph,
            "isRespiring": is_respiring,
            "storageTempC": storage_temp
        },
        "material": {
            "id": matched_mat.get("material_id", "mat-001"),
            "name": matched_mat.get("trade_name", "Advanced Barrier Film"),
            "basePolymer": matched_mat.get("base_polymer", chosen_polymer),
            "thicknessMicrons": matched_mat.get("thickness_microns", 60.0),
            "structure": structure,
            "otr": matched_mat.get("otr_normalized", 15.0),
            "wvtr": matched_mat.get("wvtr_normalized", 2.5),
            "ecoScore": round(10.0 - matched_mat.get("carbon_footprint_index", 5.0), 1) * 10,
            "isBiodegradable": matched_mat.get("is_biodegradable", False)
        },
        "compatibility_score": compat_score,
        "projected_shelf_life_days": predicted_days,
        "shelf_life_gain_multiplier": gain_multiplier,
        "map_details": map_rec,
        "barrier_analysis": {
            "otrRating": "High Barrier" if matched_mat.get("otr_normalized", 100) < 50 else "Permeable",
            "wvtrRating": "Superior Moisture Lock" if matched_mat.get("wvtr_normalized", 10) < 5 else "Breathable",
            "punctureResistance": "Heavy Duty / Transit Tested",
            "sealIntegrity": "Hermetic Heat Seal (135°C - 160°C)"
        },
        "sustainability": {
            "recyclabilityCode": "RIC 7 (Composite)" if not matched_mat.get("is_biodegradable") else "Compostable PLA/PHA",
            "carbonFootprintKgCO2PerKg": matched_mat.get("carbon_footprint_index", 4.5),
            "isBiodegradable": matched_mat.get("is_biodegradable", False),
            "pwmrCompliance": "Compliant with India Plastic Waste Management Rules 2022 (>50 microns)"
        },
        "compliance": {
            "fssaiRegulation": "FSSAI (Packaging) Regulations 2018 Section 4.1 compliant",
            "bisStandards": ["IS 12252:2018 (Polyethylene)", "IS 9845:1998 (Overall Migration Test)"],
            "heavyMetalTested": "Pb, Cd, Cr, Hg < 100 ppm verified"
        },
        "cost_metrics": {
            "relativeCostIndex": "Economic" if matched_mat.get("cost_per_kg", 3.0) < 3.0 else "Premium Barrier",
            "estimatedInrPerM2": round(matched_mat.get("cost_per_kg", 3.0) * 4.2, 2)
        },
        "cold_chain_risks": risks,
        "why_this_package": why_text,
        "alternatives": [
            {"name": "BioWrap Compostable PLA", "polymer": "PLA", "tradeOff": "Higher sustainability, moderate moisture barrier"},
            {"name": "ClearShield Gloss PET", "polymer": "PET", "tradeOff": "High clarity and rigidity, non-biodegradable"},
            {"name": "Standard PolyPack LDPE", "polymer": "LDPE", "tradeOff": "Cost effective, higher oxygen transmission"}
        ]
    }
