from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict


class LessonBase(BaseModel):
    stage: int
    day_number: int
    slug: str
    title: str
    topic: str
    description_md: str
    starter_code: str
    solution_code: str
    test_cases: Optional[List[Any]] = None
    xp_reward: int = 50


class LessonCreate(LessonBase):
    pass


class LessonListItem(BaseModel):
    id: int
    stage: int
    day_number: int
    slug: str
    title: str
    topic: str
    xp_reward: int
    is_completed: bool = False

    model_config = ConfigDict(from_attributes=True)


class LessonResponse(LessonBase):
    id: int
    created_at: datetime
    is_completed: bool = False
    draft_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

