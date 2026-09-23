from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, func
from database import Base

class FoodCommodity(Base):
    __tablename__ = "food_commodities"

    commodity_id = Column(String(36), primary_key=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    moisture_content_pct = Column(Float, nullable=False)
    lipid_content_pct = Column(Float, nullable=False)
    ph_value = Column(Float, nullable=False)
    is_respiring = Column(Boolean, default=False)
    optimum_temp_c = Column(Float, nullable=False)
    critical_oxygen_limit_pct = Column(Float, nullable=True)
    critical_moisture_limit_pct = Column(Float, nullable=False)
    water_activity_aw = Column(Float, nullable=False)
    default_shelf_life_days = Column(Integer, nullable=False)

class PackagingMaterial(Base):
    __tablename__ = "packaging_materials"

    material_id = Column(String(36), primary_key=True)
    trade_name = Column(String(100), unique=True, nullable=False)
    base_polymer = Column(String(50), nullable=False)
    thickness_microns = Column(Float, nullable=False)
    otr_normalized = Column(Float, nullable=False)
    wvtr_normalized = Column(Float, nullable=False)
    co2tr_normalized = Column(Float, nullable=False)
    tensile_strength_mpa = Column(Float, nullable=False)
    cost_per_kg = Column(Float, nullable=False)
    carbon_footprint_index = Column(Float, nullable=False)
    is_biodegradable = Column(Boolean, default=False)
    fda_approved = Column(Boolean, default=True)

class RespirationKinetics(Base):
    __tablename__ = "respiration_kinetics"

    id = Column(String(36), primary_key=True)
    commodity_name = Column(String(100), nullable=False, index=True)
    v_max_o2 = Column(Float, nullable=False)
    k_m_o2 = Column(Float, nullable=False)
    rq = Column(Float, default=1.0)
    activation_energy_kj = Column(Float, default=65.0)

class RecommendationLog(Base):
    __tablename__ = "recommendation_logs"

    log_id = Column(String(36), primary_key=True)
    commodity_name = Column(String(100), nullable=False)
    ambient_temp_c = Column(Float, nullable=False)
    external_rh_pct = Column(Float, nullable=False)
    surface_area_m2 = Column(Float, nullable=False)
    product_mass_kg = Column(Float, nullable=False)
    recommended_material = Column(String(100), nullable=False)
    topsis_score = Column(Float, nullable=False)
    predicted_shelf_life_days = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
