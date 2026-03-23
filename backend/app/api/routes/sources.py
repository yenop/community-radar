from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ...core.database import get_db
from ...models.models import Source

router = APIRouter(prefix="/api/sources", tags=["sources"])

class SourceToggle(BaseModel):
    active: int

@router.get("")
def list_sources(db: Session = Depends(get_db)):
    return db.query(Source).all()

@router.patch("/{sid}")
def toggle_source(sid: int, payload: SourceToggle, db: Session = Depends(get_db)):
    s = db.query(Source).filter(Source.id == sid).first()
    if not s:
        from fastapi import HTTPException
        raise HTTPException(404)
    s.active = payload.active
    db.commit()
    db.refresh(s)
    return s
