from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nickname: Mapped[str] = mapped_column(String(50), default="勇者学员")
    total_points: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    streak_days: Mapped[int] = mapped_column(Integer, default=1)
    mastered_concepts: Mapped[int] = mapped_column(Integer, default=0)
    current_level_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    progress: Mapped[list["UserProgress"]] = relationship(back_populates="user")
    wrong_questions: Mapped[list["WrongQuestion"]] = relationship(back_populates="user")


class Level(Base):
    __tablename__ = "levels"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    world: Mapped[str] = mapped_column(String(50), index=True)
    world_order: Mapped[int] = mapped_column(Integer, default=0)
    level_order: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    concept_tags: Mapped[str] = mapped_column(Text)
    starter_code: Mapped[str] = mapped_column(Text)
    answer_code: Mapped[str] = mapped_column(Text)
    test_cases: Mapped[str] = mapped_column(Text)
    hints: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[str] = mapped_column(String(20))
    knowledge_point: Mapped[str] = mapped_column(String(80))
    xp_reward: Mapped[int] = mapped_column(Integer, default=20)
    coin_reward: Mapped[int] = mapped_column(Integer, default=10)

    progress: Mapped[list["UserProgress"]] = relationship(back_populates="level")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    level_id: Mapped[str] = mapped_column(ForeignKey("levels.id"))
    stars: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[int] = mapped_column(Integer, default=0)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    last_code: Mapped[str] = mapped_column(Text, default="")
    last_result: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="progress")
    level: Mapped["Level"] = relationship(back_populates="progress")


class WrongQuestion(Base):
    __tablename__ = "wrong_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    level_id: Mapped[str] = mapped_column(ForeignKey("levels.id"))
    knowledge_point: Mapped[str] = mapped_column(String(80))
    user_code: Mapped[str] = mapped_column(Text, default="")
    error_message: Mapped[str] = mapped_column(Text, default="")
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="wrong_questions")


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    name: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    icon: Mapped[str] = mapped_column(String(20), default="⭐")
    unlock_rule: Mapped[str] = mapped_column(Text)
