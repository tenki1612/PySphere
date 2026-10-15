from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.lesson import Lesson
from app.models.progress import UserProgress
from app.models.user import User
from app.schemas.progress import DraftSyncRequest, ProgressResponse, ProgressSummary

router = APIRouter()


@router.post("/sync-draft", response_model=ProgressResponse)
async def sync_draft_code(
    payload: DraftSyncRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save an auto-saved draft code state for the current user and lesson."""
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == payload.lesson_id,
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            lesson_id=payload.lesson_id,
            draft_code=payload.draft_code,
        )
        db.add(progress)
    else:
        progress.draft_code = payload.draft_code

    await db.commit()
    await db.refresh(progress)
    return ProgressResponse.model_validate(progress)


@router.get("/summary", response_model=ProgressSummary)
async def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve learner's progress metrics, streak, and XP summary."""
    # Count total available lessons
    total_lessons_res = await db.execute(select(func.count(Lesson.id)))
    total_lessons = total_lessons_res.scalar() or 0

    # Count completed lessons for user
    completed_res = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == current_user.id,
            UserProgress.is_completed.is_(True),
        )
    )
    total_completed = completed_res.scalar() or 0

    percentage = 0.0
    if total_lessons > 0:
        percentage = round((total_completed / total_lessons) * 100, 2)

    return ProgressSummary(
        total_completed=total_completed,
        total_lessons=total_lessons,
        completion_rate_percentage=percentage,
        current_streak=current_user.streak_count,
        total_xp=current_user.xp,
    )

