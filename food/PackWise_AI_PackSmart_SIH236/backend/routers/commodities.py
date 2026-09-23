from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any

from database import get_db
from models import FoodCommodity
from schemas import CommodityBase

router = APIRouter(prefix="/api/v1", tags=["Commodities"])

@router.get("/commodities", response_model=List[CommodityBase])
def list_commodities(
    category: Optional[str] = Query(None, description="Filter by commodity category"),
    search: Optional[str] = Query(None, description="Search by name"),
    is_respiring: Optional[bool] = Query(None, description="Filter by respiring status"),
    skip: int = 0,
    limit: int = 150,
    db: Session = Depends(get_db)
):
    query = db.query(FoodCommodity)

    if category:
        query = query.filter(FoodCommodity.category == category)
    if search:
        query = query.filter(FoodCommodity.name.ilike(f"%{search.strip()}%"))
    if is_respiring is not None:
        query = query.filter(FoodCommodity.is_respiring == is_respiring)

    return query.offset(skip).limit(limit).all()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    results = (
        db.query(FoodCommodity.category, func.count(FoodCommodity.commodity_id))
        .group_by(FoodCommodity.category)
        .all()
    )
    return [{"category": r[0], "count": r[1]} for r in results]

@router.get("/commodities/{id_or_name}", response_model=CommodityBase)
def get_commodity(id_or_name: str, db: Session = Depends(get_db)):
    item = (
        db.query(FoodCommodity)
        .filter(
            (FoodCommodity.commodity_id == id_or_name) |
            (FoodCommodity.name.ilike(id_or_name))
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail=f"Commodity '{id_or_name}' not found")
    return item
