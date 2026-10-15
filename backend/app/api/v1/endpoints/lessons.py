from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, get_optional_user
from app.core.database import get_db
from app.models.lesson import Lesson
from app.models.progress import UserProgress
from app.models.user import User
from app.schemas.lesson import LessonCreate, LessonListItem, LessonResponse

router = APIRouter()


@router.get("", response_model=List[LessonListItem])
async def list_lessons(
    stage: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """List all available lessons in the roadmap."""
    query = select(Lesson).order_by(Lesson.stage.asc(), Lesson.day_number.asc())
    if stage:
        query = query.where(Lesson.stage == stage)

    result = await db.execute(query)
    lessons = result.scalars().all()

    completed_ids = set()
    if current_user:
        progress_res = await db.execute(
            select(UserProgress.lesson_id).where(
                UserProgress.user_id == current_user.id,
                UserProgress.is_completed.is_(True),
            )
        )
        completed_ids = set(progress_res.scalars().all())

    return [
        LessonListItem(
            id=l.id,
            stage=l.stage,
            day_number=l.day_number,
            slug=l.slug,
            title=l.title,
            topic=l.topic,
            xp_reward=l.xp_reward,
            is_completed=(l.id in completed_ids),
        )
        for l in lessons
    ]


@router.get("/{identifier}", response_model=LessonResponse)
async def get_lesson(
    identifier: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Retrieve full lesson details by ID or day_number."""
    query = select(Lesson)
    if identifier.isdigit():
        num = int(identifier)
        query = query.where((Lesson.id == num) | (Lesson.day_number == num))
    else:
        query = query.where(Lesson.slug == identifier)

    result = await db.execute(query)
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found"
        )

    is_completed = False
    draft_code = None
    if current_user:
        prog_res = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == current_user.id,
                UserProgress.lesson_id == lesson.id,
            )
        )
        prog = prog_res.scalar_one_or_none()
        if prog:
            is_completed = prog.is_completed
            draft_code = prog.draft_code

    return LessonResponse(
        id=lesson.id,
        stage=lesson.stage,
        day_number=lesson.day_number,
        slug=lesson.slug,
        title=lesson.title,
        topic=lesson.topic,
        description_md=lesson.description_md,
        starter_code=lesson.starter_code,
        solution_code=lesson.solution_code,
        test_cases=lesson.test_cases,
        xp_reward=lesson.xp_reward,
        created_at=lesson.created_at,
        is_completed=is_completed,
        draft_code=draft_code,
    )


@router.post("", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    lesson_in: LessonCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or seed a lesson (admin/dev)."""
    lesson = Lesson(**lesson_in.model_dump())
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return LessonResponse.model_validate(lesson)

