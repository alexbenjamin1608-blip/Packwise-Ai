import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import FoodCommodity, PackagingMaterial, RecommendationLog
from schemas import DesignOptimizationRequest, MaterialOptimizationResult
from services.topsis_service import solve_topsis_optimization

router = APIRouter(prefix="/api/v1", tags=["Optimization"])

@router.post("/optimize", response_model=List[MaterialOptimizationResult])
def run_topsis_optimization(
    payload: DesignOptimizationRequest,
    db: Session = Depends(get_db)
):
    # 1. Fetch commodity from DB or find closest match
    query_name = payload.commodity_name.strip().lower()
    commodity = db.query(FoodCommodity).filter(FoodCommodity.name.ilike(f"%{query_name}%")).first()

    if not commodity:
        # Check by category or fallback to strawberries/dry goods profile
        fresh_keywords = ["strawberries", "mango", "fruit", "leaf", "tomato", "spinach", "vegetable", "produce", "berry"]
        is_fresh = any(k in query_name for k in fresh_keywords)

        commodity_dict = {
            "name": payload.commodity_name,
            "category": "Fresh Produce" if is_fresh else "Dry Goods",
            "moisture_content_pct": 91.0 if is_fresh else 8.0,
            "lipid_content_pct": 0.3 if is_fresh else 2.0,
            "ph_value": 4.5 if is_fresh else 6.2,
            "is_respiring": is_fresh,
            "optimum_temp_c": 4.0 if is_fresh else 20.0,
            "critical_oxygen_limit_pct": 2.0 if is_fresh else None,
            "critical_moisture_limit_pct": 95.0 if is_fresh else 14.0,
            "water_activity_aw": 0.98 if is_fresh else 0.45,
            "default_shelf_life_days": 10 if is_fresh else 180
        }
    else:
        commodity_dict = {
            "name": commodity.name,
            "category": commodity.category,
            "moisture_content_pct": commodity.moisture_content_pct,
            "lipid_content_pct": commodity.lipid_content_pct,
            "ph_value": commodity.ph_value,
            "is_respiring": commodity.is_respiring,
            "optimum_temp_c": commodity.optimum_temp_c,
            "critical_oxygen_limit_pct": commodity.critical_oxygen_limit_pct,
            "critical_moisture_limit_pct": commodity.critical_moisture_limit_pct,
            "water_activity_aw": commodity.water_activity_aw,
            "default_shelf_life_days": commodity.default_shelf_life_days
        }

    # 2. Fetch all materials
    db_materials = db.query(PackagingMaterial).all()
    materials_list = []
    for m in db_materials:
        materials_list.append({
            "material_id": m.material_id,
            "trade_name": m.trade_name,
            "base_polymer": m.base_polymer,
            "thickness_microns": m.thickness_microns,
            "otr_normalized": m.otr_normalized,
            "wvtr_normalized": m.wvtr_normalized,
            "co2tr_normalized": m.co2tr_normalized,
            "tensile_strength_mpa": m.tensile_strength_mpa,
            "cost_per_kg": m.cost_per_kg,
            "carbon_footprint_index": m.carbon_footprint_index,
            "is_biodegradable": m.is_biodegradable,
            "fda_approved": m.fda_approved
        })

    # 3. Solve TOPSIS multi-criteria optimization
    results = solve_topsis_optimization(
        commodity=commodity_dict,
        materials=materials_list,
        ambient_temp_c=payload.ambient_temp_c,
        external_rh_pct=payload.external_rh_pct,
        package_surface_area_m2=payload.package_surface_area_m2,
        dry_solid_mass_kg=payload.dry_solid_mass_kg,
        priority_eco=payload.priority_eco,
        priority_cost=payload.priority_cost,
        priority_barrier=payload.priority_barrier
    )

    # 4. Log top recommendation
    if results:
        top = results[0]
        try:
            log_entry = RecommendationLog(
                log_id=str(uuid.uuid4()),
                commodity_name=payload.commodity_name,
                ambient_temp_c=payload.ambient_temp_c,
                external_rh_pct=payload.external_rh_pct,
                surface_area_m2=payload.package_surface_area_m2,
                product_mass_kg=payload.dry_solid_mass_kg,
                recommended_material=top["trade_name"],
                topsis_score=top["topsis_score"],
                predicted_shelf_life_days=top["estimated_shelf_life_days"]
            )
            db.add(log_entry)
            db.commit()
        except Exception:
            db.rollback()

    return results
