from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Health Check Schema
class HealthResponse(BaseModel):
    status: str
    version: str
    engine: str
    commodities_count: int
    materials_count: int

# Optimization Schemas (TOPSIS Engine)
class DesignOptimizationRequest(BaseModel):
    commodity_name: str = Field(..., example="Fresh Strawberries")
    ambient_temp_c: float = Field(23.0, ge=-20, le=50)
    external_rh_pct: float = Field(75.0, ge=0, le=100)
    package_surface_area_m2: float = Field(0.08, gt=0)
    dry_solid_mass_kg: float = Field(0.25, gt=0)
    priority_eco: float = Field(0.4, ge=0, le=1)
    priority_cost: float = Field(0.3, ge=0, le=1)
    priority_barrier: float = Field(0.3, ge=0, le=1)

class MaterialOptimizationResult(BaseModel):
    rank: int
    trade_name: str
    base_polymer: str
    topsis_score: float
    recommended_thickness_microns: float
    estimated_shelf_life_days: int
    carbon_footprint_score: float
    unit_cost_usd: float
    gas_regulation_type: str
    critical_defect_warning: Optional[str] = None
    otr: float
    wvtr: float
    tensile_strength: float
    is_biodegradable: bool

# Commodity Schemas
class CommodityBase(BaseModel):
    commodity_id: str
    name: str
    category: str
    moisture_content_pct: float
    lipid_content_pct: float
    ph_value: float
    is_respiring: bool
    optimum_temp_c: float
    critical_oxygen_limit_pct: Optional[float] = None
    critical_moisture_limit_pct: float
    water_activity_aw: float
    default_shelf_life_days: int

    class Config:
        from_attributes = True

# Packaging Material Schema
class PackagingMaterialBase(BaseModel):
    material_id: str
    trade_name: str
    base_polymer: str
    thickness_microns: float
    otr_normalized: float
    wvtr_normalized: float
    co2tr_normalized: float
    tensile_strength_mpa: float
    cost_per_kg: float
    carbon_footprint_index: float
    is_biodegradable: bool
    fda_approved: bool

    class Config:
        from_attributes = True

# Full PackWise Recommendation Request Schema
class FullRecommendationRequest(BaseModel):
    commodity_id: Optional[str] = None
    commodity_name: Optional[str] = "Alphonso Mango"
    moisture_category: Optional[str] = "High"
    water_activity: Optional[float] = 0.98
    fat_oil_pct: Optional[float] = 0.4
    ph: Optional[float] = 4.5
    respiration_rate: Optional[str] = "High"
    ethylene_sensitivity: Optional[str] = "High"
    oxygen_sensitivity: Optional[str] = "Medium"
    light_sensitivity: Optional[str] = "Medium"
    desired_shelf_life_days: Optional[int] = 18
    storage_condition: Optional[str] = "Chilled"
    storage_temp_c: Optional[float] = 13.0
    relative_humidity_pct: Optional[float] = 88.0
    region: Optional[str] = "West India"
    transport_type: Optional[str] = "Reefer Truck"
    transport_duration_hours: Optional[float] = 36.0
    distance_km: Optional[float] = 850.0
    vibration_level: Optional[str] = "Medium"
    priority: Optional[str] = "map"

# Full PackWise Recommendation Output Schema
class FullRecommendationResponse(BaseModel):
    id: str
    timestamp: str
    commodity: Dict[str, Any]
    material: Dict[str, Any]
    compatibility_score: float
    projected_shelf_life_days: int
    shelf_life_gain_multiplier: float
    map_details: Dict[str, Any]
    barrier_analysis: Dict[str, Any]
    sustainability: Dict[str, Any]
    compliance: Dict[str, Any]
    cost_metrics: Dict[str, Any]
    cold_chain_risks: List[str]
    why_this_package: str
    alternatives: List[Dict[str, Any]]

# Analytics Summary Schema
class AnalyticsSummaryResponse(BaseModel):
    total_commodities: int
    total_materials: int
    categories: List[str]
    biodegradable_pct: float
    average_shelf_life_gain_pct: float
    total_recommendations_served: int
