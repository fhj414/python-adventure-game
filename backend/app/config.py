from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PyRunner API"
    app_env: str = "development"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./data/pyrunner.db"
    cors_origins: str = "http://localhost:3000"
    moonshot_api_key: str = ""
    openai_api_key: str = ""
    openai_base_url: str = "https://api.moonshot.ai/v1"
    openai_model: str = "kimi-k2-turbo-preview"
    sandbox_timeout_seconds: int = 2
    sandbox_output_limit: int = 1200

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
