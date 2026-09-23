import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import FoodCommodity, PackagingMaterial
from schemas import HealthResponse
from data.init_db import initialize_database

from routers import optimize, recommend, commodities, materials, analytics, detect

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed 100 commodities + materials
    initialize_database()
    yield
    # Shutdown

app = FastAPI(
    title="PackWise AI / PackSmart Core Engine (SIH 236)",
    description="Multi-Criteria Optimization Decision Engine & Physics-Informed Shelf Life Simulator for Food Packaging Materials.",
    version="2.5.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite development & local deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(optimize.router)
app.include_router(recommend.router)
app.include_router(commodities.router)
app.include_router(materials.router)
app.include_router(analytics.router)
app.include_router(detect.router)

@app.get("/", tags=["General"])
def root():
    return {
        "system": "PackWise AI / PackSmart Core Engine — SIH 236",
        "status": "online",
        "docs_url": "/docs",
        "api_v1_health": "/api/v1/health"
    }

@app.get("/api/v1/health", response_model=HealthResponse, tags=["General"])
def health_check(db: Session = Depends(get_db)):
    comm_count = db.query(FoodCommodity).count()
    mat_count = db.query(PackagingMaterial).count()
    return HealthResponse(
        status="healthy",
        version="2.5.0",
        engine="FastAPI + NumPy TOPSIS + Arrhenius/Tetens Physics Engine",
        commodities_count=comm_count,
        materials_count=mat_count
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
