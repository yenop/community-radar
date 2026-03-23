from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from ...core.database import get_db
from ...models.models import PostDetected, Criteria, Source

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(PostDetected).count()
    notified = db.query(PostDetected).filter(PostDetected.notified == 1).count()
    avg_score = db.query(func.avg(PostDetected.score_pertinence)).scalar() or 0
    criteria_count = db.query(Criteria).filter(Criteria.active == 1).count()
    sources_count = db.query(Source).filter(Source.active == 1).count()

    per_day = db.execute(text(
        "SELECT DATE(detected_at) as day, COUNT(*) as count "
        "FROM posts_detected "
        "GROUP BY DATE(detected_at) "
        "ORDER BY day DESC LIMIT 14"
    )).fetchall()

    return {
        "total_posts": total,
        "notified_posts": notified,
        "avg_score": round(float(avg_score), 2),
        "active_criteria": criteria_count,
        "active_sources": sources_count,
        "per_day": [{"day": str(r[0]), "count": r[1]} for r in per_day],
    }
