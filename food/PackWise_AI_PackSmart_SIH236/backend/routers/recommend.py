from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from database import get_db
from models import PackagingMaterial, FoodCommodity
from schemas import FullRecommendationRequest, FullRecommendationResponse
from services.recommendation_service import run_full_recommendation

router = APIRouter(prefix="/api/v1", tags=["Recommendations"])

@router.post("/recommend", response_model=FullRecommendationResponse)
def get_recommendation(
    payload: FullRecommendationRequest,
    db: Session = Depends(get_db)
):
    materials = db.query(PackagingMaterial).all()
    mat_list = [
        {
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
        }
        for m in materials
    ]

    req_dict = payload.model_dump()

    # Enrich from DB if commodity exists
    if payload.commodity_name:
        comm = db.query(FoodCommodity).filter(FoodCommodity.name.ilike(f"%{payload.commodity_name}%")).first()
        if comm:
            req_dict["category"] = comm.category
            req_dict["moisture_category"] = "High" if comm.moisture_content_pct > 60 else "Low"
            req_dict["water_activity"] = comm.water_activity_aw
            req_dict["fat_oil_pct"] = comm.lipid_content_pct
            req_dict["ph"] = comm.ph_value
            req_dict["respiration_rate"] = "High" if comm.is_respiring else "None"

    return run_full_recommendation(req_dict, mat_list)
