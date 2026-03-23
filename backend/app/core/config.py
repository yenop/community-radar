from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "CommunityRadar/1.0"
    ANTHROPIC_API_KEY: str = ""
    DISCORD_WEBHOOK_URL: str = ""
    # plus utilisé
    MARIADB_HOST: str = "db"
    MARIADB_USER: str = "community_radar"
    MARIADB_PASSWORD: str = "radar_pass_2026"
    MARIADB_DATABASE: str = "community_radar"
    class Config:
        env_file = ".env"

settings = Settings()
