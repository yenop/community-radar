from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from ...core.database import get_db
from ...models.models import PostDetected, Source, Criteria

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.get("")
def list_posts(
    db: Session = Depends(get_db),
    limit: int = Query(50, le=200),
    offset: int = 0,
    criteria_id: Optional[int] = None,
    min_score: Optional[float] = None,
):
    q = db.query(PostDetected)
    if criteria_id:
        q = q.filter(PostDetected.criteria_id == criteria_id)
    if min_score is not None:
        q = q.filter(PostDetected.score_pertinence >= min_score)
    total = q.count()
    posts = q.order_by(desc(PostDetected.detected_at)).offset(offset).limit(limit).all()
    return {"total": total, "items": posts}
