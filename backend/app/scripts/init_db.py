import json

from app.database import Base, SessionLocal, engine
from app.models import Badge, Level, User, UserProgress, WrongQuestion
from app.services.level_seed import BADGES, LEVELS


def seed_levels(db):
    if db.query(Level).count() == 0:
        for item in LEVELS:
            db.add(Level(**item))


def seed_badges(db):
    if db.query(Badge).count() == 0:
        for item in BADGES:
            db.add(Badge(**item))


def seed_user(db):
    if db.query(User).count() == 0:
        user = User(
            nickname="移动端勇者",
            total_points=180,
            level=3,
            streak_days=4,
            mastered_concepts=9,
            current_level_id="level-06",
        )
        db.add(user)
        db.flush()
        demo_progress = [
            UserProgress(user_id=user.id, level_id="level-01", stars=3, score=100, attempts=1, completed=True, last_code="print('Hello, PyRunner!')", last_result="pass"),
            UserProgress(user_id=user.id, level_id="level-02", stars=2, score=90, attempts=2, completed=True, last_code="print('Welcome')\nprint('Python!')", last_result="pass"),
            UserProgress(user_id=user.id, level_id="level-03", stars=3, score=100, attempts=1, completed=True, last_code="name='Ada'\nprint('Hello, '+name)", last_result="pass"),
            UserProgress(user_id=user.id, level_id="level-04", stars=1, score=70, attempts=3, completed=True, last_code="coins=7\nprint(coins+5)", last_result="pass"),
            UserProgress(user_id=user.id, level_id="level-05", stars=0, score=0, attempts=1, completed=False, last_code="temp=31\nprint('Hot')", last_result="failed"),
        ]
        demo_wrongs = [
            WrongQuestion(user_id=user.id, level_id="level-05", knowledge_point="if/else", user_code="temp = 31\nprint('Hot')", error_message="测试未通过：需要使用条件判断"),
            WrongQuestion(user_id=user.id, level_id="level-11", knowledge_point="while", user_code="count=3\nwhile count>0:\n    print(count)", error_message="代码执行超时，请检查是否出现死循环。"),
        ]
        for row in demo_progress + demo_wrongs:
            db.add(row)


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_levels(db)
        seed_badges(db)
        seed_user(db)
        db.commit()
        print(json.dumps({"status": "ok", "levels": len(LEVELS), "badges": len(BADGES)}, ensure_ascii=False))
    finally:
        db.close()


if __name__ == "__main__":
    main()
