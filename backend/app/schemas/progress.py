from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DraftSyncRequest(BaseModel):
    lesson_id: int
    draft_code: str


class ProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    is_completed: bool
    draft_code: Optional[str] = None
    completed_at: Optional[datetime] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgressSummary(BaseModel):
    total_completed: int
    total_lessons: int
    completion_rate_percentage: float
    current_streak: int
    total_xp: int

