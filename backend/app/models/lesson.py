from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    stage = Column(Integer, index=True, nullable=False)  # 1: Basics, 2: Functions, 3: Advanced
    day_number = Column(Integer, unique=True, index=True, nullable=False)  # 1 to 60
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    topic = Column(String(100), nullable=False)
    description_md = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=False)
    solution_code = Column(Text, nullable=False)
    test_cases = Column(JSON, nullable=True)  # List of test fixtures / inputs / expected outputs
    xp_reward = Column(Integer, default=50)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    progress_records = relationship(
        "UserProgress", back_populates="lesson", cascade="all, delete-orphan"
    )
    submissions = relationship(
        "Submission", back_populates="lesson", cascade="all, delete-orphan"
    )

