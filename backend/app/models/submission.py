from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), index=True, nullable=False)
    submitted_code = Column(Text, nullable=False)
    status = Column(String(50), nullable=False)  # PASSED, FAILED, RUNTIME_ERROR
    execution_time_ms = Column(Integer, default=0)
    tests_passed = Column(Integer, default=0)
    tests_total = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="submissions")
    lesson = relationship("Lesson", back_populates="submissions")

