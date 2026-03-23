import httpx, logging
from ..core.config import settings

logger = logging.getLogger(__name__)

async def send_telegram(chat_id: str, message: str) -> bool:
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN non configuré")
        return False
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"})
            if resp.status_code == 200:
                logger.info(f"Telegram envoyé à {chat_id}")
                return True
            logger.error(f"Telegram error {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        logger.error(f"Telegram exception: {e}")
        return False
