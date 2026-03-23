from fastapi import APIRouter
from pydantic import BaseModel
from ...services.discord import send_discord
from ...core.config import settings

router = APIRouter(prefix="/api", tags=["notifications"])


class TestPayload(BaseModel):
    webhook_url: str = ""


@router.post("/test-notification")
async def test_notification(payload: TestPayload):
    url = payload.webhook_url or settings.DISCORD_WEBHOOK_URL
    ok = await send_discord(
        url,
        title="🔔 Test Community Radar",
        description="Notification Discord opérationnelle !",
        url="https://communityradar.nextly.ovh",
        score=0.95,
        criteria_label="Test"
    )
    return {"ok": ok, "webhook_url": url[:40] + "..." if len(url) > 40 else url}
