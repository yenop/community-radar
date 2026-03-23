from fastapi import APIRouter
from pydantic import BaseModel
from ...services.telegram import send_telegram
from ...core.config import settings
import asyncio

router = APIRouter(prefix="/api", tags=["notifications"])

class TestPayload(BaseModel):
    chat_id: str = ""
    message: str = "🔔 Test Community Radar — Notification Telegram opérationnelle !"

@router.post("/test-notification")
async def test_notification(payload: TestPayload):
    chat_id = payload.chat_id or settings.TELEGRAM_CHAT_ID
    ok = await send_telegram(chat_id, payload.message)
    return {"ok": ok, "chat_id": chat_id}
