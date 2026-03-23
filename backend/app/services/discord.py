"""
Service d'envoi de notifications Discord via Webhook.
Configurer DISCORD_WEBHOOK_URL dans le .env.
"""
import httpx
import logging

logger = logging.getLogger(__name__)


async def send_discord(webhook_url: str, title: str, description: str, url: str, score: float, criteria_label: str) -> bool:
    """Envoie un embed Discord via webhook."""
    if not webhook_url:
        logger.warning("DISCORD_WEBHOOK_URL non configuré")
        return False

    # Couleur selon le score (violet → vert)
    color = 0x22c55e if score >= 0.9 else (0x7c5cbf if score >= 0.8 else 0x6366f1)

    payload = {
        "embeds": [{
            "title": title[:256],
            "description": description[:300] + "..." if len(description) > 300 else description,
            "url": url,
            "color": color,
            "fields": [
                {"name": "🎯 Critère", "value": criteria_label, "inline": True},
                {"name": "📊 Score", "value": f"{int(score * 100)}%", "inline": True},
            ],
            "footer": {"text": "Community Radar • Reddit"},
        }]
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(webhook_url, json=payload)
            if resp.status_code in (200, 204):
                logger.info(f"Discord webhook envoyé — score={score:.2f}")
                return True
            logger.error(f"Discord webhook erreur {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        logger.error(f"Discord webhook exception: {e}")
        return False
