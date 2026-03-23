from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ...core.database import get_db
from ...models.models import Criteria

router = APIRouter(prefix="/api/criteria", tags=["criteria"])

class CriteriaCreate(BaseModel):
    user_id: int = 1
    label: str
    description_naturelle: str
    active: Optional[int] = 1

class CriteriaUpdate(BaseModel):
    label: Optional[str] = None
    description_naturelle: Optional[str] = None
    active: Optional[int] = None

@router.get("")
def list_criteria(db: Session = Depends(get_db)):
    return db.query(Criteria).order_by(Criteria.created_at.desc()).all()

@router.post("", status_code=201)
def create_criteria(payload: CriteriaCreate, db: Session = Depends(get_db)):
    c = Criteria(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.patch("/{cid}")
def update_criteria(cid: int, payload: CriteriaUpdate, db: Session = Depends(get_db)):
    c = db.query(Criteria).filter(Criteria.id == cid).first()
    if not c:
        raise HTTPException(404, "Critère non trouvé")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c

@router.delete("/{cid}")
def delete_criteria(cid: int, db: Session = Depends(get_db)):
    c = db.query(Criteria).filter(Criteria.id == cid).first()
    if not c:
        raise HTTPException(404, "Critère non trouvé")
    db.delete(c)
    db.commit()
    return {"ok": True}
