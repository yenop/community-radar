#!/usr/bin/env python3
"""
Community Radar Worker
Tourne toutes les 30 minutes, scrape Reddit, évalue avec Claude, notifie Telegram.
"""
import time, logging, asyncio, json
from datetime import datetime
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.models import Source, Criteria, PostDetected, Notification
from app.services.discord import send_discord

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s — %(message)s")
logger = logging.getLogger("worker")

SCAN_INTERVAL = 30 * 60  # 30 minutes


def get_reddit_posts(subreddit_name: str, limit: int = 25) -> list:
    try:
        import praw
        reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT,
        )
        sub = reddit.subreddit(subreddit_name)
        posts = []
        for post in sub.new(limit=limit):
            posts.append({
                "title":   post.title,
                "content": post.selftext[:1000] if post.selftext else "",
                "url":     f"https://reddit.com{post.permalink}",
                "id":      post.id,
            })
        logger.info(f"r/{subreddit_name} — {len(posts)} posts récupérés")
        return posts
    except Exception as e:
        logger.error(f"Reddit scraping error ({subreddit_name}): {e}")
        return []


def evaluate_with_claude(post: dict, criteria: object) -> float:
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        prompt = f"""Évalue la pertinence de ce post Reddit par rapport au critère suivant.

CRITÈRE : {criteria.label}
DESCRIPTION : {criteria.description_naturelle}

POST :
Titre : {post["title"]}
Contenu : {post["content"][:500] or "(pas de texte)"}

Réponds UNIQUEMENT avec un JSON :
{{"score": <float entre 0 et 1>, "raison": "<1 phrase>"}}

0 = pas du tout pertinent, 1 = parfaitement pertinent."""

        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text.strip().replace("```json","").replace("```","")
        data = json.loads(raw)
        score = float(data.get("score", 0))
        logger.info(f"Claude score={score:.2f} | {post['title'][:50]}")
        return score
    except Exception as e:
        logger.error(f"Claude error: {e}")
        return 0.0


def format_notification(post: dict, criteria: object, score: float) -> str:
    parts = [
        "Community Radar",
        "Critere : " + criteria.label,
        "Score : " + str(int(score * 100)) + "%",
        "",
        post["title"],
        "",
        post["url"],
    ]
    return chr(10).join(parts)


async def run_scan():
    logger.info("=== Début du scan ===")
    db = SessionLocal()
    try:
        sources = db.query(Source).filter(Source.active == 1, Source.type == "reddit").all()
        criterias = db.query(Criteria).filter(Criteria.active == 1).all()

        if not criterias:
            logger.info("Aucun critère actif — scan ignoré")
            return

        logger.info(f"{len(sources)} sources | {len(criterias)} critères")

        for source in sources:
            subreddit = source.url.split("/r/")[-1].strip("/")
            posts = get_reddit_posts(subreddit)

            for post in posts:
                # Vérifier si déjà traité
                existing = db.query(PostDetected).filter(PostDetected.url == post["url"]).first()
                if existing:
                    continue

                for criteria in criterias:
                    score = evaluate_with_claude(post, criteria)
                    if score >= 0.7:
                        logger.info(f"✅ Post pertinent détecté! score={score:.2f}")
                        new_post = PostDetected(
                            source_id=source.id,
                            criteria_id=criteria.id,
                            title=post["title"],
                            content=post["content"][:2000],
                            url=post["url"],
                            score_pertinence=score,
                            notified=0,
                        )
                        db.add(new_post)
                        db.commit()
                        db.refresh(new_post)

                        if settings.DISCORD_WEBHOOK_URL:
                            sent = await send_discord(
                                settings.DISCORD_WEBHOOK_URL,
                                title=post["title"],
                                description=post["content"][:300] if post["content"] else "",
                                url=post["url"],
                                score=score,
                                criteria_label=criteria.label
                            )
                            if sent:
                                new_post.notified = 1
                                notif = Notification(user_id=criteria.user_id, post_id=new_post.id, channel="discord")
                                db.add(notif)
                                db.commit()

    except Exception as e:
        logger.error(f"Erreur worker: {e}")
    finally:
        db.close()
    logger.info("=== Fin du scan ===")


if __name__ == "__main__":
    logger.info("Community Radar Worker démarré")
    while True:
        asyncio.run(run_scan())
        logger.info(f"Prochain scan dans {SCAN_INTERVAL // 60} minutes")
        time.sleep(SCAN_INTERVAL)
