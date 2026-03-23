from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import criteria, sources, posts, stats, notifications
from .core.database import engine, Base
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Community Radar API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(criteria.router)
app.include_router(sources.router)
app.include_router(posts.router)
app.include_router(stats.router)
app.include_router(notifications.router)

@app.get("/health")
def health():
    return {"status": "ok"}
