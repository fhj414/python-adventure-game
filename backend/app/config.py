from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PyRunner API"
    app_env: str = "development"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./pyrunner.db"
    cors_origins: str = "http://localhost:3000"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o-mini"
    sandbox_timeout_seconds: int = 2
    sandbox_output_limit: int = 1200

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
