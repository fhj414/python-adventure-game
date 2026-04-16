import json
from collections import defaultdict
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Badge, Level, User, UserProgress, WrongQuestion
from app.schemas import AIActionRequest, AIResponse, RunCodeRequest, RunCodeResponse
from app.services.ai_service import call_ai
from app.services.sandbox import SandboxError, execute_user_code

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_json(value: str):
    return json.loads(value) if value else []


def evaluate_tests(output: str, test_cases: list[dict]) -> tuple[list[dict], int]:
    clean_output = output.strip()
    output_lines = [line.strip() for line in clean_output.splitlines() if line.strip()]
    results = []
    passed = 0
    for test in test_cases:
        ok = False
        if test["type"] == "stdout":
            ok = clean_output == test["expected"]
        elif test["type"] == "stdout_lines":
            ok = output_lines == test["expected"]
        elif test["type"] == "stdout_lines_unordered":
            ok = sorted(output_lines) == sorted(test["expected"])
        results.append({"type": test["type"], "expected": test["expected"], "passed": ok})
        if ok:
            passed += 1
    return results, passed


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.app_name}


@app.get(f"{settings.api_prefix}/bootstrap")
def bootstrap(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    levels = db.query(Level).order_by(Level.world_order, Level.level_order).all()
    progress_map = {item.level_id: item for item in db.query(UserProgress).filter(UserProgress.user_id == user.id).all()}
    worlds = defaultdict(list)

    unlocked_world_order = 1
    for level in levels:
        progress = progress_map.get(level.id)
        is_unlocked = level.world_order <= unlocked_world_order + 1
        worlds[level.world].append(
            {
                "id": level.id,
                "title": level.title,
                "difficulty": level.difficulty,
                "knowledgePoint": level.knowledge_point,
                "conceptTags": parse_json(level.concept_tags),
                "stars": progress.stars if progress else 0,
                "score": progress.score if progress else 0,
                "completed": progress.completed if progress else False,
                "unlocked": is_unlocked,
            }
        )
        if progress and progress.completed:
            unlocked_world_order = max(unlocked_world_order, level.world_order)

    badges = db.query(Badge).all()
    wrong_questions = db.query(WrongQuestion).filter(WrongQuestion.user_id == user.id).order_by(WrongQuestion.created_at.desc()).all()
    return {
        "user": {
            "id": user.id,
            "nickname": user.nickname,
            "totalPoints": user.total_points,
            "level": user.level,
            "streakDays": user.streak_days,
            "masteredConcepts": user.mastered_concepts,
            "currentLevelId": user.current_level_id,
        },
        "worlds": [{"name": world, "levels": items} for world, items in worlds.items()],
        "badges": [{"code": badge.code, "name": badge.name, "description": badge.description, "icon": badge.icon} for badge in badges],
        "wrongQuestions": [
            {
                "id": item.id,
                "levelId": item.level_id,
                "knowledgePoint": item.knowledge_point,
                "errorMessage": item.error_message,
                "resolved": item.resolved,
                "createdAt": item.created_at.isoformat(),
            }
            for item in wrong_questions
        ],
    }


@app.get(f"{settings.api_prefix}/levels")
def get_levels(db: Session = Depends(get_db)):
    items = db.query(Level).order_by(Level.world_order, Level.level_order).all()
    return [
        {
            "id": item.id,
            "world": item.world,
            "title": item.title,
            "description": item.description,
            "conceptTags": parse_json(item.concept_tags),
            "difficulty": item.difficulty,
            "knowledgePoint": item.knowledge_point,
        }
        for item in items
    ]


@app.get(f"{settings.api_prefix}/levels/{{level_id}}")
def get_level(level_id: str, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return {
        "id": level.id,
        "world": level.world,
        "title": level.title,
        "description": level.description,
        "conceptTags": parse_json(level.concept_tags),
        "starterCode": level.starter_code,
        "hints": parse_json(level.hints),
        "difficulty": level.difficulty,
        "knowledgePoint": level.knowledge_point,
        "xpReward": level.xp_reward,
        "coinReward": level.coin_reward,
        "testCases": parse_json(level.test_cases),
    }


@app.post(f"{settings.api_prefix}/run", response_model=RunCodeResponse)
def run_code(payload: RunCodeRequest, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.id == payload.level_id).first()
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not level or not user:
        raise HTTPException(status_code=404, detail="User or level not found")

    try:
        output, runtime_error = execute_user_code(payload.code)
    except SandboxError as exc:
        output, runtime_error = "", str(exc)

    test_cases = parse_json(level.test_cases)
    tests, passed_count = evaluate_tests(output, test_cases) if not runtime_error else ([], 0)
    total_count = len(test_cases)
    success = runtime_error is None and passed_count == total_count
    base_score = int((passed_count / total_count) * 100) if total_count else 0
    if payload.used_hint:
        base_score = max(0, base_score - 10)
    stars = 3 if base_score >= 95 else 2 if base_score >= 80 else 1 if base_score >= 60 else 0
    message = "通关成功，继续冲刺下一关。" if success else (runtime_error or "还有测试没通过，再试一次。")

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == payload.user_id,
        UserProgress.level_id == payload.level_id,
    ).first()
    if not progress:
        progress = UserProgress(user_id=payload.user_id, level_id=payload.level_id)
        db.add(progress)

    progress.attempts += 1
    progress.last_code = payload.code
    progress.last_result = message
    progress.updated_at = datetime.utcnow()
    if success:
        progress.completed = True
        progress.score = max(progress.score, base_score)
        progress.stars = max(progress.stars, stars)
        user.total_points += level.xp_reward + level.coin_reward
        user.mastered_concepts = min(30, user.mastered_concepts + 1)
        user.current_level_id = payload.level_id
    else:
        wrong = WrongQuestion(
            user_id=payload.user_id,
            level_id=payload.level_id,
            knowledge_point=level.knowledge_point,
            user_code=payload.code,
            error_message=message,
        )
        db.add(wrong)
    db.commit()

    return RunCodeResponse(
        success=success,
        output=output if output else (runtime_error or ""),
        tests=tests,
        score=base_score,
        stars=stars,
        passed_count=passed_count,
        total_count=total_count,
        message=message,
    )


@app.get(f"{settings.api_prefix}/wrong-questions")
def get_wrong_questions(knowledge_point: str | None = None, db: Session = Depends(get_db)):
    query = db.query(WrongQuestion).filter(WrongQuestion.user_id == 1)
    if knowledge_point:
        query = query.filter(WrongQuestion.knowledge_point == knowledge_point)
    records = query.order_by(WrongQuestion.created_at.desc()).all()
    levels = {item.id: item.title for item in db.query(Level).all()}
    return [
        {
            "id": record.id,
            "levelId": record.level_id,
            "levelTitle": levels.get(record.level_id, record.level_id),
            "knowledgePoint": record.knowledge_point,
            "userCode": record.user_code,
            "errorMessage": record.error_message,
            "resolved": record.resolved,
            "createdAt": record.created_at.isoformat(),
        }
        for record in records
    ]


@app.get(f"{settings.api_prefix}/profile")
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).first()
    badges = db.query(Badge).all()
    completed = db.query(UserProgress).filter(UserProgress.user_id == 1, UserProgress.completed.is_(True)).count()
    return {
        "nickname": user.nickname,
        "totalPoints": user.total_points,
        "level": user.level,
        "streakDays": user.streak_days,
        "masteredConcepts": user.mastered_concepts,
        "completedLevels": completed,
        "badges": [{"name": badge.name, "icon": badge.icon, "description": badge.description} for badge in badges],
    }


async def _resolve_level_title(db: Session, level_id: str | None) -> str:
    if not level_id:
        return "通用练习"
    level = db.query(Level).filter(Level.id == level_id).first()
    return level.title if level else level_id


@app.post(f"{settings.api_prefix}/ai/hint", response_model=AIResponse)
async def ai_hint(payload: AIActionRequest, db: Session = Depends(get_db)):
    title = await _resolve_level_title(db, payload.level_id)
    data = await call_ai("hint", title, "给我一点提示，不要直接给完整答案。", payload.user_code, payload.error)
    return AIResponse(**data)


@app.post(f"{settings.api_prefix}/ai/explain", response_model=AIResponse)
async def ai_explain(payload: AIActionRequest, db: Session = Depends(get_db)):
    title = await _resolve_level_title(db, payload.level_id)
    data = await call_ai("explain", title, "像老师一样讲懂这道题，并结合当前错误。", payload.user_code, payload.error)
    return AIResponse(**data)


@app.post(f"{settings.api_prefix}/ai/locate-error", response_model=AIResponse)
async def ai_locate_error(payload: AIActionRequest, db: Session = Depends(get_db)):
    title = await _resolve_level_title(db, payload.level_id)
    data = await call_ai("locate_error", title, "只指出可能出错的位置和类型，不直接给答案。", payload.user_code, payload.error)
    return AIResponse(**data)


@app.post(f"{settings.api_prefix}/ai/similar", response_model=AIResponse)
async def ai_similar(payload: AIActionRequest, db: Session = Depends(get_db)):
    title = await _resolve_level_title(db, payload.level_id)
    data = await call_ai("similar", title, "给我两道类似题，要更适合移动端碎片化练习。", payload.user_code, payload.error)
    return AIResponse(**data)


@app.post(f"{settings.api_prefix}/ai/review", response_model=AIResponse)
async def ai_review(payload: AIActionRequest, db: Session = Depends(get_db)):
    title = "错题复盘"
    if payload.record_id:
        record = db.query(WrongQuestion).filter(WrongQuestion.id == payload.record_id).first()
        if record:
            title = await _resolve_level_title(db, record.level_id)
            payload.user_code = record.user_code
            payload.error = record.error_message
    data = await call_ai("review", title, "帮我复盘这道错题，给出改进建议。", payload.user_code, payload.error)
    return AIResponse(**data)
