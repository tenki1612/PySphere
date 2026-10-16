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
    solution_code: Optional[str] = None
    test_cases: Optional[List[Any]] = None
    xp_reward: int = 50
    has_visualizer: bool = False
    visualizer_type: Optional[str] = None


class LessonCreate(BaseModel):
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
    has_visualizer: bool = False
    visualizer_type: Optional[str] = None


class LessonListItem(BaseModel):
    id: int
    stage: int
    day_number: int
    slug: str
    title: str
    topic: str
    xp_reward: int
    has_visualizer: bool = False
    visualizer_type: Optional[str] = None
    is_completed: bool = False

    model_config = ConfigDict(from_attributes=True)


class LessonResponse(BaseModel):
    id: int
    stage: int
    day_number: int
    slug: str
    title: str
    topic: str
    description_md: str
    starter_code: str
    solution_code: Optional[str] = None
    test_cases: Optional[List[Any]] = None
    xp_reward: int
    has_visualizer: bool = False
    visualizer_type: Optional[str] = None
    created_at: datetime
    is_completed: bool = False
    draft_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

