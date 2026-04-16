from typing import Any

from pydantic import BaseModel


class RunCodeRequest(BaseModel):
    user_id: int = 1
    level_id: str
    code: str
    mode: str = "beginner"
    used_hint: bool = False


class RunCodeResponse(BaseModel):
    success: bool
    output: str
    tests: list[dict[str, Any]]
    score: int
    stars: int
    passed_count: int
    total_count: int
    message: str


class AIActionRequest(BaseModel):
    level_id: str | None = None
    record_id: int | None = None
    user_code: str = ""
    error: str = ""
    prompt: str = ""


class AIResponse(BaseModel):
    action: str
    source: str
    data: dict[str, Any]

