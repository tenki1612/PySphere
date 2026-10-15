from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SubmissionCreate(BaseModel):
    lesson_id: int
    submitted_code: str
    status: str  # PASSED, FAILED, RUNTIME_ERROR
    execution_time_ms: int = 0
    tests_passed: int = 0
    tests_total: int = 0
    error_message: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    submitted_code: str
    status: str
    execution_time_ms: int
    tests_passed: int
    tests_total: int
    error_message: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubmissionResultResponse(BaseModel):
    submission_id: int
    status: str
    xp_earned: int
    current_streak: int
    total_xp: int
    is_first_completion: bool

