from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import PackagingMaterial
from schemas import PackagingMaterialBase

router = APIRouter(prefix="/api/v1", tags=["Materials"])

@router.get("/packaging-materials", response_model=List[PackagingMaterialBase])
def list_materials(db: Session = Depends(get_db)):
    return db.query(PackagingMaterial).all()

@router.get("/packaging-materials/{id_or_name}", response_model=PackagingMaterialBase)
def get_material(id_or_name: str, db: Session = Depends(get_db)):
    item = (
        db.query(PackagingMaterial)
        .filter(
            (PackagingMaterial.material_id == id_or_name) |
            (PackagingMaterial.trade_name.ilike(id_or_name))
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail=f"Material '{id_or_name}' not found")
    return item
